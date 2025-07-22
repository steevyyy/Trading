import { IStorage } from "../storage";

export class TechnicalAnalysisService {
  constructor(private storage: IStorage) {}

  async analyzeInstrument(instrumentId: number): Promise<void> {
    try {
      const timeframes = ['15m', '1h', '4h', '1d'];
      
      for (const timeframe of timeframes) {
        await this.calculateIndicators(instrumentId, timeframe);
      }

      await this.storage.insertSystemLog({
        level: 'info',
        source: 'technical_analysis',
        message: `Technical analysis completed for instrument ${instrumentId}`,
        metadata: { instrumentId }
      });
    } catch (error) {
      await this.storage.insertSystemLog({
        level: 'error',
        source: 'technical_analysis',
        message: `Technical analysis failed for instrument ${instrumentId}: ${error}`,
        metadata: { instrumentId, error: String(error) }
      });
      throw error;
    }
  }

  private async calculateIndicators(instrumentId: number, timeframe: string): Promise<void> {
    try {
      // Get recent market data for calculations
      const endDate = new Date();
      const startDate = new Date(endDate.getTime() - 50 * 24 * 60 * 60 * 1000); // 50 days
      
      const marketData = await this.storage.getMarketDataRange(
        instrumentId,
        timeframe,
        startDate,
        endDate
      );

      if (marketData.length < 20) {
        return; // Not enough data for calculations
      }

      const closes = marketData.map(d => parseFloat(d.close));
      const highs = marketData.map(d => parseFloat(d.high));
      const lows = marketData.map(d => parseFloat(d.low));

      // Calculate indicators
      const rsi = this.calculateRSI(closes, 14);
      const macd = this.calculateMACD(closes);
      const ma50 = this.calculateSMA(closes, 50);
      const ma200 = this.calculateSMA(closes, 200);
      const bollinger = this.calculateBollingerBands(closes, 20, 2);
      const atr = this.calculateATR(highs, lows, closes, 14);
      const levels = this.calculateSupportResistance(highs, lows);

      // Insert technical indicators
      await this.storage.insertTechnicalIndicators({
        instrumentId,
        timestamp: new Date(),
        timeframe,
        rsi: rsi.toFixed(2),
        macd: macd.macd.toFixed(6),
        macdSignal: macd.signal.toFixed(6),
        ma50: ma50.toFixed(5),
        ma200: ma200.toFixed(5),
        bollingerUpper: bollinger.upper.toFixed(5),
        bollingerLower: bollinger.lower.toFixed(5),
        atr: atr.toFixed(6),
        supportLevel: levels.support.toFixed(5),
        resistanceLevel: levels.resistance.toFixed(5)
      });

    } catch (error) {
      await this.storage.insertSystemLog({
        level: 'error',
        source: 'technical_analysis',
        message: `Indicator calculation failed: ${error}`,
        metadata: { instrumentId, timeframe, error: String(error) }
      });
    }
  }

  private calculateRSI(closes: number[], period: number = 14): number {
    if (closes.length < period + 1) return 50;

    let gains = 0;
    let losses = 0;

    // Calculate initial average gain and loss
    for (let i = 1; i <= period; i++) {
      const change = closes[i] - closes[i - 1];
      if (change > 0) {
        gains += change;
      } else {
        losses -= change;
      }
    }

    let avgGain = gains / period;
    let avgLoss = losses / period;

    // Calculate RSI for the most recent period
    for (let i = period + 1; i < closes.length; i++) {
      const change = closes[i] - closes[i - 1];
      const gain = change > 0 ? change : 0;
      const loss = change < 0 ? -change : 0;

      avgGain = (avgGain * (period - 1) + gain) / period;
      avgLoss = (avgLoss * (period - 1) + loss) / period;
    }

    if (avgLoss === 0) return 100;
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
  }

  private calculateMACD(closes: number[]): { macd: number; signal: number } {
    const ema12 = this.calculateEMA(closes, 12);
    const ema26 = this.calculateEMA(closes, 26);
    const macd = ema12 - ema26;
    
    // For simplicity, using a basic signal calculation
    const signal = macd * 0.9; // Simplified signal line
    
    return { macd, signal };
  }

  private calculateEMA(closes: number[], period: number): number {
    if (closes.length === 0) return 0;
    
    const k = 2 / (period + 1);
    let ema = closes[0];
    
    for (let i = 1; i < closes.length; i++) {
      ema = closes[i] * k + ema * (1 - k);
    }
    
    return ema;
  }

  private calculateSMA(closes: number[], period: number): number {
    if (closes.length < period) return closes[closes.length - 1] || 0;
    
    const slice = closes.slice(-period);
    return slice.reduce((sum, price) => sum + price, 0) / period;
  }

  private calculateBollingerBands(closes: number[], period: number, stdDev: number): { upper: number; lower: number } {
    const sma = this.calculateSMA(closes, period);
    
    if (closes.length < period) {
      return { upper: sma, lower: sma };
    }
    
    const slice = closes.slice(-period);
    const variance = slice.reduce((sum, price) => sum + Math.pow(price - sma, 2), 0) / period;
    const standardDeviation = Math.sqrt(variance);
    
    return {
      upper: sma + (standardDeviation * stdDev),
      lower: sma - (standardDeviation * stdDev)
    };
  }

  private calculateATR(highs: number[], lows: number[], closes: number[], period: number): number {
    if (highs.length < 2) return 0;
    
    const trueRanges = [];
    
    for (let i = 1; i < highs.length; i++) {
      const hl = highs[i] - lows[i];
      const hc = Math.abs(highs[i] - closes[i - 1]);
      const lc = Math.abs(lows[i] - closes[i - 1]);
      
      trueRanges.push(Math.max(hl, hc, lc));
    }
    
    return this.calculateSMA(trueRanges, period);
  }

  private calculateSupportResistance(highs: number[], lows: number[]): { support: number; resistance: number } {
    if (highs.length === 0 || lows.length === 0) {
      return { support: 0, resistance: 0 };
    }
    
    // Simple support/resistance calculation using recent highs and lows
    const recentData = 20; // Look at last 20 periods
    const recentHighs = highs.slice(-recentData);
    const recentLows = lows.slice(-recentData);
    
    const resistance = Math.max(...recentHighs);
    const support = Math.min(...recentLows);
    
    return { support, resistance };
  }

  async getTechnicalSignal(instrumentId: number, timeframe: string): Promise<{ signal: 'buy' | 'sell' | 'hold'; confidence: number }> {
    try {
      const indicators = await this.storage.getLatestTechnicalIndicators(instrumentId, timeframe);
      
      if (!indicators) {
        return { signal: 'hold', confidence: 0 };
      }
      
      let score = 0;
      let totalWeight = 0;
      
      // RSI signal
      const rsi = parseFloat(indicators.rsi || '50');
      if (rsi < 30) {
        score += 2; // Oversold - buy signal
      } else if (rsi > 70) {
        score -= 2; // Overbought - sell signal
      }
      totalWeight += 2;
      
      // MACD signal
      const macd = parseFloat(indicators.macd || '0');
      const macdSignal = parseFloat(indicators.macdSignal || '0');
      if (macd > macdSignal) {
        score += 1.5; // Bullish
      } else {
        score -= 1.5; // Bearish
      }
      totalWeight += 1.5;
      
      // Moving average signal
      const ma50 = parseFloat(indicators.ma50 || '0');
      const ma200 = parseFloat(indicators.ma200 || '0');
      if (ma50 > ma200) {
        score += 1; // Golden cross - bullish
      } else {
        score -= 1; // Death cross - bearish
      }
      totalWeight += 1;
      
      const normalizedScore = score / totalWeight;
      const confidence = Math.abs(normalizedScore) * 100;
      
      let signal: 'buy' | 'sell' | 'hold' = 'hold';
      if (normalizedScore > 0.3) {
        signal = 'buy';
      } else if (normalizedScore < -0.3) {
        signal = 'sell';
      }
      
      return { signal, confidence: Math.min(confidence, 100) };
    } catch (error) {
      await this.storage.insertSystemLog({
        level: 'error',
        source: 'technical_analysis',
        message: `Technical signal calculation failed: ${error}`,
        metadata: { instrumentId, timeframe, error: String(error) }
      });
      return { signal: 'hold', confidence: 0 };
    }
  }
}
