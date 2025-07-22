import { IStorage } from "../storage";
import { RiskManagerService } from "./riskManager";

export class PaperTradingService {
  constructor(
    private storage: IStorage,
    private riskManager: RiskManagerService
  ) {}

  async executeTrade(signalId: number, userId: number): Promise<{
    success: boolean;
    tradeId?: number;
    error?: string;
  }> {
    try {
      // Get the trading signal
      const signals = await this.storage.getActiveSignals();
      const signal = signals.find(s => s.id === signalId);
      
      if (!signal) {
        return { success: false, error: 'Signal not found' };
      }

      // Calculate position size based on risk management
      const positionSize = await this.riskManager.calculatePositionSize(
        userId,
        signal.instrumentId,
        parseFloat(signal.entryPrice || '0'),
        parseFloat(signal.stopLoss || '0'),
        1 // 1% risk per trade
      );

      // Prepare trade data
      const tradeData = {
        userId,
        instrumentId: signal.instrumentId,
        tradeType: signal.signalType as 'buy' | 'sell',
        positionSize,
        entryPrice: parseFloat(signal.entryPrice || '0'),
        stopLoss: parseFloat(signal.stopLoss || '0')
      };

      // Validate trade with risk manager
      const validation = await this.riskManager.validateTrade(tradeData);
      
      if (!validation.isValid) {
        return { success: false, error: validation.reason };
      }

      // Adjust position size if needed
      const finalPositionSize = validation.adjustedPositionSize || positionSize;

      // Create paper trade
      const trade = await this.storage.createPaperTrade({
        userId,
        signalId,
        instrumentId: signal.instrumentId,
        tradeType: signal.signalType as 'buy' | 'sell',
        positionSize: finalPositionSize.toFixed(4),
        entryPrice: signal.entryPrice || '0',
        exitPrice: null,
        stopLoss: signal.stopLoss,
        takeProfit: signal.targetPrice,
        pnl: null,
        status: 'open',
        closedAt: null
      });

      await this.storage.insertSystemLog({
        level: 'info',
        source: 'paper_trading',
        message: `Paper trade executed: ${signal.signalType} ${finalPositionSize} ${signal.instrumentId}`,
        metadata: { tradeId: trade.id, signalId, userId }
      });

      return { success: true, tradeId: trade.id };
    } catch (error) {
      await this.storage.insertSystemLog({
        level: 'error',
        source: 'paper_trading',
        message: `Trade execution failed: ${error}`,
        metadata: { signalId, userId, error: String(error) }
      });
      return { success: false, error: String(error) };
    }
  }

  async closeTrade(tradeId: number, exitPrice: number, reason: 'manual' | 'stop_loss' | 'take_profit' = 'manual'): Promise<{
    success: boolean;
    pnl?: number;
    error?: string;
  }> {
    try {
      // Get trade history to find the trade
      const trades = await this.storage.getTradeHistory(1, 1000); // Get all trades
      const trade = trades.find(t => t.id === tradeId);
      
      if (!trade) {
        return { success: false, error: 'Trade not found' };
      }

      if (trade.status !== 'open') {
        return { success: false, error: 'Trade is not open' };
      }

      // Calculate P&L
      const entryPrice = parseFloat(trade.entryPrice);
      const positionSize = parseFloat(trade.positionSize);
      
      let pnl = 0;
      if (trade.tradeType === 'buy') {
        pnl = (exitPrice - entryPrice) * positionSize * 100000; // Assuming forex pip value
      } else {
        pnl = (entryPrice - exitPrice) * positionSize * 100000;
      }

      // Update trade
      const updatedTrade = await this.storage.updatePaperTrade(tradeId, {
        exitPrice: exitPrice.toFixed(5),
        pnl: pnl.toFixed(2),
        status: reason,
        closedAt: new Date()
      });

      await this.storage.insertSystemLog({
        level: 'info',
        source: 'paper_trading',
        message: `Paper trade closed: ${trade.tradeType} ${trade.positionSize} P&L: ${pnl.toFixed(2)}`,
        metadata: { tradeId, exitPrice, pnl, reason }
      });

      return { success: true, pnl };
    } catch (error) {
      await this.storage.insertSystemLog({
        level: 'error',
        source: 'paper_trading',
        message: `Trade closure failed: ${error}`,
        metadata: { tradeId, exitPrice, error: String(error) }
      });
      return { success: false, error: String(error) };
    }
  }

  async checkStopLossAndTakeProfit(): Promise<void> {
    try {
      const activeTrades = await this.storage.getActiveTrades(1); // Default user
      
      for (const trade of activeTrades) {
        // Get current market price
        const currentData = await this.storage.getLatestMarketData(trade.instrumentId, '1m');
        
        if (!currentData) continue;
        
        const currentPrice = parseFloat(currentData.close);
        const stopLoss = parseFloat(trade.stopLoss || '0');
        const takeProfit = parseFloat(trade.takeProfit || '0');
        
        let shouldClose = false;
        let reason: 'stop_loss' | 'take_profit' | 'manual' = 'manual';
        
        if (trade.tradeType === 'buy') {
          if (stopLoss > 0 && currentPrice <= stopLoss) {
            shouldClose = true;
            reason = 'stop_loss';
          } else if (takeProfit > 0 && currentPrice >= takeProfit) {
            shouldClose = true;
            reason = 'take_profit';
          }
        } else { // sell
          if (stopLoss > 0 && currentPrice >= stopLoss) {
            shouldClose = true;
            reason = 'stop_loss';
          } else if (takeProfit > 0 && currentPrice <= takeProfit) {
            shouldClose = true;
            reason = 'take_profit';
          }
        }
        
        if (shouldClose) {
          await this.closeTrade(trade.id, currentPrice, reason);
        } else {
          // Update trailing stops if enabled
          await this.riskManager.implementTrailingStop(trade.id, currentPrice);
        }
      }
    } catch (error) {
      await this.storage.insertSystemLog({
        level: 'error',
        source: 'paper_trading',
        message: `Stop loss/take profit check failed: ${error}`,
        metadata: { error: String(error) }
      });
    }
  }

  async getTradingStatistics(userId: number): Promise<{
    totalTrades: number;
    winningTrades: number;
    losingTrades: number;
    totalPnL: number;
    averagePnL: number;
    winRate: number;
    profitFactor: number;
    maxDrawdown: number;
    sharpeRatio: number;
  }> {
    try {
      const trades = await this.storage.getTradeHistory(userId, 1000);
      const closedTrades = trades.filter(t => t.status !== 'open' && t.pnl !== null);
      
      if (closedTrades.length === 0) {
        return {
          totalTrades: 0,
          winningTrades: 0,
          losingTrades: 0,
          totalPnL: 0,
          averagePnL: 0,
          winRate: 0,
          profitFactor: 0,
          maxDrawdown: 0,
          sharpeRatio: 0
        };
      }

      const pnls = closedTrades.map(t => parseFloat(t.pnl || '0'));
      const winningTrades = pnls.filter(p => p > 0);
      const losingTrades = pnls.filter(p => p < 0);
      
      const totalPnL = pnls.reduce((sum, pnl) => sum + pnl, 0);
      const averagePnL = totalPnL / closedTrades.length;
      const winRate = (winningTrades.length / closedTrades.length) * 100;
      
      const grossProfit = winningTrades.reduce((sum, pnl) => sum + pnl, 0);
      const grossLoss = Math.abs(losingTrades.reduce((sum, pnl) => sum + pnl, 0));
      const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : 0;
      
      // Calculate max drawdown
      let peak = 0;
      let maxDrawdown = 0;
      let runningPnL = 0;
      
      for (const pnl of pnls) {
        runningPnL += pnl;
        if (runningPnL > peak) {
          peak = runningPnL;
        }
        const drawdown = peak - runningPnL;
        if (drawdown > maxDrawdown) {
          maxDrawdown = drawdown;
        }
      }
      
      // Calculate Sharpe ratio (simplified)
      const returns = pnls.map(pnl => pnl / 10000); // Assuming $10k account
      const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
      const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
      const stdDev = Math.sqrt(variance);
      const sharpeRatio = stdDev > 0 ? (avgReturn / stdDev) * Math.sqrt(252) : 0; // Annualized
      
      return {
        totalTrades: closedTrades.length,
        winningTrades: winningTrades.length,
        losingTrades: losingTrades.length,
        totalPnL,
        averagePnL,
        winRate,
        profitFactor,
        maxDrawdown,
        sharpeRatio
      };
    } catch (error) {
      await this.storage.insertSystemLog({
        level: 'error',
        source: 'paper_trading',
        message: `Statistics calculation failed: ${error}`,
        metadata: { userId, error: String(error) }
      });
      return {
        totalTrades: 0,
        winningTrades: 0,
        losingTrades: 0,
        totalPnL: 0,
        averagePnL: 0,
        winRate: 0,
        profitFactor: 0,
        maxDrawdown: 0,
        sharpeRatio: 0
      };
    }
  }

  async getPortfolioValue(userId: number): Promise<{
    totalValue: number;
    cashBalance: number;
    unrealizedPnL: number;
    realizedPnL: number;
  }> {
    try {
      const performance = await this.storage.getTradingPerformance(userId);
      const activeTrades = await this.storage.getActiveTrades(userId);
      
      // Calculate unrealized P&L from open trades
      let unrealizedPnL = 0;
      for (const trade of activeTrades) {
        const currentData = await this.storage.getLatestMarketData(trade.instrumentId, '1m');
        if (currentData) {
          const currentPrice = parseFloat(currentData.close);
          const entryPrice = parseFloat(trade.entryPrice);
          const positionSize = parseFloat(trade.positionSize);
          
          let pnl = 0;
          if (trade.tradeType === 'buy') {
            pnl = (currentPrice - entryPrice) * positionSize * 100000;
          } else {
            pnl = (entryPrice - currentPrice) * positionSize * 100000;
          }
          unrealizedPnL += pnl;
        }
      }
      
      const startingBalance = 10000; // $10k starting balance
      const realizedPnL = performance.totalPnL;
      const totalValue = startingBalance + realizedPnL + unrealizedPnL;
      const cashBalance = startingBalance + realizedPnL;
      
      return {
        totalValue,
        cashBalance,
        unrealizedPnL,
        realizedPnL
      };
    } catch (error) {
      await this.storage.insertSystemLog({
        level: 'error',
        source: 'paper_trading',
        message: `Portfolio value calculation failed: ${error}`,
        metadata: { userId, error: String(error) }
      });
      return {
        totalValue: 10000,
        cashBalance: 10000,
        unrealizedPnL: 0,
        realizedPnL: 0
      };
    }
  }
}
