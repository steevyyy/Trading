import { IStorage } from "../storage";

export class RiskManagerService {
  constructor(private storage: IStorage) {}

  async validateTrade(trade: {
    userId: number;
    instrumentId: number;
    tradeType: 'buy' | 'sell';
    positionSize: number;
    entryPrice: number;
    stopLoss: number;
  }): Promise<{
    isValid: boolean;
    reason?: string;
    adjustedPositionSize?: number;
  }> {
    try {
      const riskSettings = await this.storage.getRiskSettings(trade.userId);
      
      if (!riskSettings) {
        // Create default risk settings
        await this.createDefaultRiskSettings(trade.userId);
        return { isValid: true };
      }

      // Check daily risk limit
      const dailyRiskCheck = await this.checkDailyRiskLimit(trade.userId, trade, riskSettings);
      if (!dailyRiskCheck.isValid) {
        return dailyRiskCheck;
      }

      // Check position size limits
      const positionSizeCheck = await this.checkPositionSizeLimit(trade, riskSettings);
      if (!positionSizeCheck.isValid) {
        return positionSizeCheck;
      }

      // Check maximum drawdown
      const drawdownCheck = await this.checkMaxDrawdown(trade.userId, riskSettings);
      if (!drawdownCheck.isValid) {
        return drawdownCheck;
      }

      // Check correlation and exposure limits
      const exposureCheck = await this.checkExposureLimits(trade.userId, trade.instrumentId);
      if (!exposureCheck.isValid) {
        return exposureCheck;
      }

      return { isValid: true };
    } catch (error) {
      await this.storage.insertSystemLog({
        level: 'error',
        source: 'risk_manager',
        message: `Trade validation failed: ${error}`,
        metadata: { trade, error: String(error) }
      });
      return { isValid: false, reason: 'Risk validation error' };
    }
  }

  private async createDefaultRiskSettings(userId: number): Promise<void> {
    await this.storage.updateRiskSettings(userId, {
      maxDailyRisk: "500.00",
      maxPositionSize: "0.10",
      maxDrawdown: "5.00",
      autoStopLoss: true,
      riskScaling: true,
      weekendTrading: false
    });
  }

  private async checkDailyRiskLimit(
    userId: number,
    trade: any,
    riskSettings: any
  ): Promise<{ isValid: boolean; reason?: string }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get today's trades
    const todayTrades = await this.storage.getTradeHistory(userId, 100);
    const todayOnly = todayTrades.filter(t => 
      t.openedAt && new Date(t.openedAt) >= today
    );

    // Calculate today's risk exposure
    const todayRisk = todayOnly.reduce((total, t) => {
      if (t.status === 'open') {
        const riskAmount = Math.abs(parseFloat(t.entryPrice) - parseFloat(t.stopLoss || '0')) 
                          * parseFloat(t.positionSize);
        return total + riskAmount;
      }
      return total;
    }, 0);

    // Calculate risk for new trade
    const newTradeRisk = Math.abs(trade.entryPrice - trade.stopLoss) * trade.positionSize;
    const totalRisk = todayRisk + newTradeRisk;
    const maxDailyRisk = parseFloat(riskSettings.maxDailyRisk);

    if (totalRisk > maxDailyRisk) {
      return {
        isValid: false,
        reason: `Daily risk limit exceeded. Current: $${todayRisk.toFixed(2)}, New trade: $${newTradeRisk.toFixed(2)}, Limit: $${maxDailyRisk.toFixed(2)}`
      };
    }

    return { isValid: true };
  }

  private async checkPositionSizeLimit(
    trade: any,
    riskSettings: any
  ): Promise<{ isValid: boolean; reason?: string; adjustedPositionSize?: number }> {
    const maxPositionSize = parseFloat(riskSettings.maxPositionSize);
    
    if (trade.positionSize > maxPositionSize) {
      if (riskSettings.riskScaling) {
        return {
          isValid: true,
          adjustedPositionSize: maxPositionSize,
          reason: `Position size adjusted from ${trade.positionSize} to ${maxPositionSize}`
        };
      } else {
        return {
          isValid: false,
          reason: `Position size ${trade.positionSize} exceeds maximum ${maxPositionSize}`
        };
      }
    }

    return { isValid: true };
  }

  private async checkMaxDrawdown(
    userId: number,
    riskSettings: any
  ): Promise<{ isValid: boolean; reason?: string }> {
    const performance = await this.storage.getTradingPerformance(userId);
    const maxDrawdown = parseFloat(riskSettings.maxDrawdown);
    
    // Calculate current drawdown (simplified)
    const currentDrawdown = Math.abs(Math.min(performance.totalPnL, 0)) / 10000 * 100; // Assuming $10k account
    
    if (currentDrawdown > maxDrawdown) {
      return {
        isValid: false,
        reason: `Maximum drawdown exceeded. Current: ${currentDrawdown.toFixed(2)}%, Limit: ${maxDrawdown}%`
      };
    }

    return { isValid: true };
  }

  private async checkExposureLimits(
    userId: number,
    instrumentId: number
  ): Promise<{ isValid: boolean; reason?: string }> {
    const activeTrades = await this.storage.getActiveTrades(userId);
    const sameInstrumentTrades = activeTrades.filter(t => t.instrumentId === instrumentId);
    
    // Limit to 3 open trades per instrument
    if (sameInstrumentTrades.length >= 3) {
      return {
        isValid: false,
        reason: `Maximum trades per instrument exceeded (limit: 3, current: ${sameInstrumentTrades.length})`
      };
    }

    // Limit total open trades to 10
    if (activeTrades.length >= 10) {
      return {
        isValid: false,
        reason: `Maximum total open trades exceeded (limit: 10, current: ${activeTrades.length})`
      };
    }

    return { isValid: true };
  }

  async calculatePositionSize(
    userId: number,
    instrumentId: number,
    entryPrice: number,
    stopLoss: number,
    riskPercentage: number = 1
  ): Promise<number> {
    try {
      const riskSettings = await this.storage.getRiskSettings(userId);
      const accountBalance = 10000; // Assuming $10k paper trading account
      
      const riskAmount = (accountBalance * riskPercentage) / 100;
      const pipRisk = Math.abs(entryPrice - stopLoss);
      
      if (pipRisk === 0) return 0;
      
      const positionSize = riskAmount / pipRisk;
      const maxPositionSize = riskSettings ? parseFloat(riskSettings.maxPositionSize) : 0.1;
      
      return Math.min(positionSize, maxPositionSize);
    } catch (error) {
      await this.storage.insertSystemLog({
        level: 'error',
        source: 'risk_manager',
        message: `Position size calculation failed: ${error}`,
        metadata: { userId, instrumentId, error: String(error) }
      });
      return 0.01; // Default small position size
    }
  }

  async updateStopLoss(tradeId: number, newStopLoss: number): Promise<boolean> {
    try {
      const trade = await this.storage.updatePaperTrade(tradeId, {
        stopLoss: newStopLoss.toFixed(5)
      });

      await this.storage.insertSystemLog({
        level: 'info',
        source: 'risk_manager',
        message: `Stop loss updated for trade ${tradeId}`,
        metadata: { tradeId, newStopLoss }
      });

      return true;
    } catch (error) {
      await this.storage.insertSystemLog({
        level: 'error',
        source: 'risk_manager',
        message: `Stop loss update failed: ${error}`,
        metadata: { tradeId, newStopLoss, error: String(error) }
      });
      return false;
    }
  }

  async implementTrailingStop(tradeId: number, currentPrice: number): Promise<boolean> {
    try {
      // Get the trade
      const trades = await this.storage.getTradeHistory(1, 100); // Get all trades for user 1
      const trade = trades.find(t => t.id === tradeId);
      
      if (!trade || trade.status !== 'open') {
        return false;
      }

      const entryPrice = parseFloat(trade.entryPrice);
      const currentStopLoss = parseFloat(trade.stopLoss || '0');
      const atrValue = 0.001; // Get from technical indicators
      
      let newStopLoss = currentStopLoss;
      
      if (trade.tradeType === 'buy') {
        // For long positions, only move stop loss up
        const trailingStop = currentPrice - (atrValue * 2);
        if (trailingStop > currentStopLoss) {
          newStopLoss = trailingStop;
        }
      } else {
        // For short positions, only move stop loss down
        const trailingStop = currentPrice + (atrValue * 2);
        if (trailingStop < currentStopLoss) {
          newStopLoss = trailingStop;
        }
      }

      if (newStopLoss !== currentStopLoss) {
        return await this.updateStopLoss(tradeId, newStopLoss);
      }

      return true;
    } catch (error) {
      await this.storage.insertSystemLog({
        level: 'error',
        source: 'risk_manager',
        message: `Trailing stop implementation failed: ${error}`,
        metadata: { tradeId, currentPrice, error: String(error) }
      });
      return false;
    }
  }

  async getRiskMetrics(userId: number): Promise<{
    dailyRiskUsed: number;
    maxDailyRisk: number;
    currentDrawdown: number;
    maxDrawdown: number;
    activeTrades: number;
    riskScore: number;
  }> {
    try {
      const riskSettings = await this.storage.getRiskSettings(userId);
      const performance = await this.storage.getTradingPerformance(userId);
      const activeTrades = await this.storage.getActiveTrades(userId);
      
      // Calculate daily risk used
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const todayTrades = await this.storage.getTradeHistory(userId, 50);
      const dailyRiskUsed = todayTrades
        .filter(t => t.openedAt && new Date(t.openedAt) >= today && t.status === 'open')
        .reduce((total, t) => {
          const riskAmount = Math.abs(parseFloat(t.entryPrice) - parseFloat(t.stopLoss || '0')) 
                            * parseFloat(t.positionSize);
          return total + riskAmount;
        }, 0);

      const maxDailyRisk = riskSettings ? parseFloat(riskSettings.maxDailyRisk) : 500;
      const maxDrawdownLimit = riskSettings ? parseFloat(riskSettings.maxDrawdown) : 5;
      
      // Calculate current drawdown
      const currentDrawdown = Math.abs(Math.min(performance.totalPnL, 0)) / 10000 * 100;
      
      // Calculate risk score (0-100, higher is riskier)
      const riskScore = Math.min(
        (dailyRiskUsed / maxDailyRisk * 50) +
        (currentDrawdown / maxDrawdownLimit * 30) +
        (activeTrades.length / 10 * 20),
        100
      );

      return {
        dailyRiskUsed,
        maxDailyRisk,
        currentDrawdown,
        maxDrawdown: maxDrawdownLimit,
        activeTrades: activeTrades.length,
        riskScore
      };
    } catch (error) {
      await this.storage.insertSystemLog({
        level: 'error',
        source: 'risk_manager',
        message: `Risk metrics calculation failed: ${error}`,
        metadata: { userId, error: String(error) }
      });
      return {
        dailyRiskUsed: 0,
        maxDailyRisk: 500,
        currentDrawdown: 0,
        maxDrawdown: 5,
        activeTrades: 0,
        riskScore: 0
      };
    }
  }
}
