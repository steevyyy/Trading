import { IStorage } from "../storage";
import { TechnicalAnalysisService } from "./technicalAnalysis";
import { FundamentalAnalysisService } from "./fundamentalAnalysis";
import { SentimentAnalysisService } from "./sentimentAnalysis";
import { CotAnalysisService } from "./cotAnalysis";

export class SignalEngineService {
  private technicalAnalysis: TechnicalAnalysisService;
  private fundamentalAnalysis: FundamentalAnalysisService;
  private sentimentAnalysis: SentimentAnalysisService;
  private cotAnalysis: CotAnalysisService;

  constructor(private storage: IStorage) {
    this.technicalAnalysis = new TechnicalAnalysisService(storage);
    this.fundamentalAnalysis = new FundamentalAnalysisService(storage);
    this.sentimentAnalysis = new SentimentAnalysisService(storage);
    this.cotAnalysis = new CotAnalysisService(storage);
  }

  async generateSignals(instrumentId: number): Promise<any[]> {
    try {
      const instrument = await this.storage.getInstrument(instrumentId);
      if (!instrument) {
        throw new Error(`Instrument not found: ${instrumentId}`);
      }

      // Deactivate old signals for this instrument
      const existingSignals = await this.storage.getSignalsByInstrument(instrumentId);
      for (const signal of existingSignals) {
        await this.storage.deactivateSignal(signal.id);
      }

      const timeframes = ['1h', '4h', '1d'];
      const newSignals = [];

      for (const timeframe of timeframes) {
        const signal = await this.generateSignalForTimeframe(instrumentId, timeframe, instrument.symbol);
        if (signal && signal.confidence > 50) { // Only create high confidence signals
          newSignals.push(signal);
        }
      }

      await this.storage.insertSystemLog({
        level: 'info',
        source: 'signal_engine',
        message: `Generated ${newSignals.length} signals for ${instrument.symbol}`,
        metadata: { instrumentId, signalCount: newSignals.length }
      });

      return newSignals;
    } catch (error) {
      await this.storage.insertSystemLog({
        level: 'error',
        source: 'signal_engine',
        message: `Signal generation failed for instrument ${instrumentId}: ${error}`,
        metadata: { instrumentId, error: String(error) }
      });
      return [];
    }
  }

  private async generateSignalForTimeframe(instrumentId: number, timeframe: string, symbol: string): Promise<any | null> {
    try {
      // Get signals from all analysis modules
      const technicalSignal = await this.technicalAnalysis.getTechnicalSignal(instrumentId, timeframe);
      const fundamentalSignal = await this.fundamentalAnalysis.getFundamentalSignal(this.extractCurrency(symbol));
      const sentimentSignal = await this.sentimentAnalysis.getSentimentSignal(instrumentId);
      const cotSignal = await this.cotAnalysis.getCotSignal(instrumentId);

      // Calculate weighted scores
      const weights = {
        technical: 0.4,
        fundamental: 0.25,
        sentiment: 0.2,
        cot: 0.15
      };

      // Convert signals to numeric scores
      const technicalScore = this.signalToScore(technicalSignal.signal) * technicalSignal.confidence;
      const fundamentalScore = this.signalToScore(fundamentalSignal.signal) * fundamentalSignal.confidence;
      const sentimentScore = this.signalToScore(sentimentSignal.signal) * sentimentSignal.confidence;
      const cotScore = this.signalToScore(cotSignal.signal) * cotSignal.confidence;

      // Calculate combined score
      const combinedScore = (
        technicalScore * weights.technical +
        fundamentalScore * weights.fundamental +
        sentimentScore * weights.sentiment +
        cotScore * weights.cot
      );

      // Determine signal type and confidence
      let signalType: 'buy' | 'sell' | 'hold' = 'hold';
      const confidence = Math.abs(combinedScore);

      if (combinedScore > 30) {
        signalType = 'buy';
      } else if (combinedScore < -30) {
        signalType = 'sell';
      }

      // Only create signal if confidence is above threshold
      if (confidence < 50) {
        return null;
      }

      // Calculate entry, target, and stop loss prices
      const marketData = await this.storage.getLatestMarketData(instrumentId, timeframe);
      if (!marketData) {
        return null;
      }

      const currentPrice = parseFloat(marketData.close);
      const atr = await this.getATR(instrumentId, timeframe);
      
      const { entryPrice, targetPrice, stopLoss } = this.calculatePrices(
        currentPrice,
        signalType,
        atr,
        confidence
      );

      // Create and store the signal
      const signal = await this.storage.createTradingSignal({
        instrumentId,
        signalType,
        confidence: confidence.toFixed(2),
        entryPrice: entryPrice.toFixed(5),
        targetPrice: targetPrice.toFixed(5),
        stopLoss: stopLoss.toFixed(5),
        timeframe,
        technicalScore: technicalScore.toFixed(2),
        fundamentalScore: fundamentalScore.toFixed(2),
        sentimentScore: sentimentScore.toFixed(2),
        cotScore: cotScore.toFixed(2),
        combinedScore: combinedScore.toFixed(2)
      });

      return signal;
    } catch (error) {
      await this.storage.insertSystemLog({
        level: 'error',
        source: 'signal_engine',
        message: `Signal generation failed for ${symbol} ${timeframe}: ${error}`,
        metadata: { instrumentId, timeframe, error: String(error) }
      });
      return null;
    }
  }

  private signalToScore(signal: 'buy' | 'sell' | 'hold'): number {
    switch (signal) {
      case 'buy': return 1;
      case 'sell': return -1;
      case 'hold': return 0;
      default: return 0;
    }
  }

  private extractCurrency(symbol: string): string {
    // Extract base currency from symbol
    if (symbol.startsWith('XAU') || symbol.startsWith('XAG')) {
      return 'USD'; // Metals priced in USD
    }
    return symbol.substring(0, 3); // First 3 characters for forex
  }

  private async getATR(instrumentId: number, timeframe: string): Promise<number> {
    try {
      const indicators = await this.storage.getLatestTechnicalIndicators(instrumentId, timeframe);
      return indicators ? parseFloat(indicators.atr || '0.001') : 0.001;
    } catch {
      return 0.001; // Default ATR
    }
  }

  private calculatePrices(currentPrice: number, signalType: 'buy' | 'sell' | 'hold', atr: number, confidence: number): {
    entryPrice: number;
    targetPrice: number;
    stopLoss: number;
  } {
    const confidenceMultiplier = confidence / 100;
    const atrMultiplier = 2 + confidenceMultiplier; // Higher confidence = wider targets
    
    let entryPrice = currentPrice;
    let targetPrice = currentPrice;
    let stopLoss = currentPrice;

    if (signalType === 'buy') {
      // Buy signal
      entryPrice = currentPrice * 1.001; // Slight premium for market orders
      targetPrice = currentPrice * (1 + atr * atrMultiplier / currentPrice);
      stopLoss = currentPrice * (1 - atr * 1.5 / currentPrice);
    } else if (signalType === 'sell') {
      // Sell signal
      entryPrice = currentPrice * 0.999; // Slight discount for market orders
      targetPrice = currentPrice * (1 - atr * atrMultiplier / currentPrice);
      stopLoss = currentPrice * (1 + atr * 1.5 / currentPrice);
    }

    return { entryPrice, targetPrice, stopLoss };
  }

  async analyzeSignalPerformance(): Promise<{
    totalSignals: number;
    successfulSignals: number;
    averageConfidence: number;
    performanceByTimeframe: Record<string, number>;
  }> {
    try {
      // This would analyze historical signal performance
      // For now, return mock data
      return {
        totalSignals: 156,
        successfulSignals: 114,
        averageConfidence: 73.2,
        performanceByTimeframe: {
          '1h': 68.5,
          '4h': 75.8,
          '1d': 81.2
        }
      };
    } catch (error) {
      await this.storage.insertSystemLog({
        level: 'error',
        source: 'signal_engine',
        message: `Signal performance analysis failed: ${error}`,
        metadata: { error: String(error) }
      });
      return {
        totalSignals: 0,
        successfulSignals: 0,
        averageConfidence: 0,
        performanceByTimeframe: {}
      };
    }
  }

  async optimizeSignalWeights(): Promise<Record<string, number>> {
    try {
      // This would use machine learning to optimize signal weights
      // For now, return current weights
      return {
        technical: 0.4,
        fundamental: 0.25,
        sentiment: 0.2,
        cot: 0.15
      };
    } catch (error) {
      await this.storage.insertSystemLog({
        level: 'error',
        source: 'signal_engine',
        message: `Signal weight optimization failed: ${error}`,
        metadata: { error: String(error) }
      });
      return {
        technical: 0.4,
        fundamental: 0.25,
        sentiment: 0.2,
        cot: 0.15
      };
    }
  }
}
