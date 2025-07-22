import { IStorage } from "../storage";

/**
 * Market Simulator Service
 * Generates realistic market data and price movements for the trading bot
 */
export class MarketSimulatorService {
  private priceHistory: Map<number, { price: number; trend: number; volatility: number }> = new Map();
  
  constructor(private storage: IStorage) {}

  async generateMarketData(): Promise<void> {
    try {
      const instruments = await this.storage.getInstruments();
      const now = new Date();
      
      for (const instrument of instruments) {
        await this.generateInstrumentData(instrument.id, instrument.symbol, now);
      }
      
      await this.storage.insertSystemLog({
        level: 'info',
        source: 'market_simulator',
        message: `Generated market data for ${instruments.length} instruments`,
        metadata: { timestamp: now.toISOString(), instrumentCount: instruments.length }
      });
    } catch (error) {
      await this.storage.insertSystemLog({
        level: 'error',
        source: 'market_simulator',
        message: `Market data generation failed: ${error}`,
        metadata: { error: String(error) }
      });
      throw error;
    }
  }

  private async generateInstrumentData(instrumentId: number, symbol: string, timestamp: Date): Promise<void> {
    // Get or initialize price state
    let state = this.priceHistory.get(instrumentId);
    if (!state) {
      state = {
        price: this.getBasePrice(symbol),
        trend: 0,
        volatility: this.getBaseVolatility(symbol)
      };
      this.priceHistory.set(instrumentId, state);
    }

    // Generate realistic price movement
    const priceData = this.generateRealisticPriceMovement(state, symbol);
    this.priceHistory.set(instrumentId, priceData.newState);

    // Generate data for multiple timeframes
    const timeframes = ['1m', '5m', '15m', '1h', '4h', '1d'];
    
    for (const timeframe of timeframes) {
      const timeframeData = this.adjustForTimeframe(priceData, timeframe);
      
      await this.storage.insertMarketData({
        instrumentId,
        timestamp,
        open: timeframeData.open.toFixed(5),
        high: timeframeData.high.toFixed(5),
        low: timeframeData.low.toFixed(5),
        close: timeframeData.close.toFixed(5),
        volume: timeframeData.volume.toFixed(2),
        timeframe
      });
    }
  }

  private generateRealisticPriceMovement(
    state: { price: number; trend: number; volatility: number },
    symbol: string
  ): {
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    newState: { price: number; trend: number; volatility: number };
  } {
    // Market dynamics simulation
    const trendStrength = 0.7; // 70% trend persistence
    const volatilityReversion = 0.95; // Volatility mean reversion
    const newsImpact = this.getNewsImpact(); // Random news events
    
    // Update trend with some persistence and random walk
    let newTrend = state.trend * trendStrength + (Math.random() - 0.5) * 0.2;
    newTrend += newsImpact * 0.5;
    newTrend = Math.max(-1, Math.min(1, newTrend)); // Clamp between -1 and 1
    
    // Update volatility with mean reversion
    const baseVol = this.getBaseVolatility(symbol);
    let newVolatility = state.volatility * volatilityReversion + baseVol * (1 - volatilityReversion);
    newVolatility += Math.abs(newsImpact) * baseVol * 0.5; // News increases volatility
    
    // Generate price movement
    const trendComponent = newTrend * newVolatility * 0.3;
    const randomComponent = (Math.random() - 0.5) * newVolatility;
    const priceChange = trendComponent + randomComponent;
    
    const open = state.price;
    const close = open * (1 + priceChange);
    
    // Generate realistic high and low
    const intrabarVolatility = newVolatility * 0.6;
    const high = Math.max(open, close) * (1 + Math.random() * intrabarVolatility);
    const low = Math.min(open, close) * (1 - Math.random() * intrabarVolatility);
    
    // Generate volume based on volatility and trend changes
    const baseVolume = this.getBaseVolume(symbol);
    const volumeMultiplier = 1 + (Math.abs(priceChange) * 5) + (Math.abs(newsImpact) * 2);
    const volume = baseVolume * volumeMultiplier * (0.8 + Math.random() * 0.4);
    
    return {
      open,
      high,
      low,
      close,
      volume,
      newState: {
        price: close,
        trend: newTrend,
        volatility: newVolatility
      }
    };
  }

  private adjustForTimeframe(
    baseData: { open: number; high: number; low: number; close: number; volume: number },
    timeframe: string
  ): { open: number; high: number; low: number; close: number; volume: number } {
    // Higher timeframes have more range and volume
    const multipliers: Record<string, number> = {
      '1m': 0.3,
      '5m': 0.5,
      '15m': 0.7,
      '1h': 1.0,
      '4h': 1.5,
      '1d': 2.0
    };
    
    const mult = multipliers[timeframe] || 1.0;
    const range = baseData.high - baseData.low;
    const expandedRange = range * mult;
    const center = (baseData.high + baseData.low) / 2;
    
    return {
      open: baseData.open,
      high: center + expandedRange / 2,
      low: center - expandedRange / 2,
      close: baseData.close,
      volume: baseData.volume * mult
    };
  }

  private getBasePrice(symbol: string): number {
    const basePrices: Record<string, number> = {
      'EURUSD': 1.0850,
      'GBPUSD': 1.2650,
      'USDJPY': 149.50,
      'AUDUSD': 0.6750,
      'XAUUSD': 2650.00,
      'XAGUSD': 30.50,
    };
    return basePrices[symbol] || 1.0000;
  }

  private getBaseVolatility(symbol: string): number {
    const volatilities: Record<string, number> = {
      'EURUSD': 0.008,  // 0.8% daily volatility
      'GBPUSD': 0.012,  // 1.2% daily volatility
      'USDJPY': 0.010,  // 1.0% daily volatility
      'AUDUSD': 0.015,  // 1.5% daily volatility
      'XAUUSD': 0.020,  // 2.0% daily volatility
      'XAGUSD': 0.035,  // 3.5% daily volatility
    };
    return volatilities[symbol] || 0.010;
  }

  private getBaseVolume(symbol: string): number {
    const volumes: Record<string, number> = {
      'EURUSD': 5000000,
      'GBPUSD': 3000000,
      'USDJPY': 4000000,
      'AUDUSD': 2000000,
      'XAUUSD': 1500000,
      'XAGUSD': 800000,
    };
    return volumes[symbol] || 1000000;
  }

  private getNewsImpact(): number {
    // Simulate random news events (5% chance of significant news)
    if (Math.random() < 0.05) {
      return (Math.random() - 0.5) * 2; // -1 to +1 impact
    }
    return 0;
  }

  /**
   * Create economic calendar events that affect fundamental analysis
   */
  async generateEconomicEvents(): Promise<void> {
    const events = [
      { event: 'Non-Farm Payrolls', currency: 'USD', impact: 'high' },
      { event: 'ECB Interest Rate Decision', currency: 'EUR', impact: 'high' },
      { event: 'Consumer Price Index', currency: 'USD', impact: 'medium' },
      { event: 'Manufacturing PMI', currency: 'GBP', impact: 'medium' },
      { event: 'Retail Sales', currency: 'AUD', impact: 'medium' },
      { event: 'Bank of Japan Rate Decision', currency: 'JPY', impact: 'high' },
    ];

    for (const event of events) {
      // 10% chance of each event occurring
      if (Math.random() < 0.1) {
        const forecast = this.generateEconomicValue(event.event);
        const actual = forecast + (Math.random() - 0.5) * forecast * 0.3;
        const previous = forecast - (Math.random() - 0.5) * forecast * 0.2;

        const score = this.calculateFundamentalScore(forecast, actual, event.impact);

        await this.storage.insertFundamentalData({
          timestamp: new Date(),
          event: event.event,
          currency: event.currency,
          impact: event.impact,
          forecast: forecast.toFixed(1),
          actual: actual.toFixed(1),
          previous: previous.toFixed(1),
          score: score.toFixed(2)
        });
      }
    }
  }

  private generateEconomicValue(eventType: string): number {
    const baseValues: Record<string, number> = {
      'Non-Farm Payrolls': 200000,
      'Consumer Price Index': 3.2,
      'Manufacturing PMI': 52.5,
      'Retail Sales': 0.3,
      'Interest Rate Decision': 5.25,
    };
    
    const baseValue = baseValues[eventType] || 50;
    return baseValue * (0.9 + Math.random() * 0.2); // ±10% variation
  }

  private calculateFundamentalScore(forecast: number, actual: number, impact: string): number {
    const surprise = (actual - forecast) / Math.abs(forecast);
    const impactMultiplier = impact === 'high' ? 3 : impact === 'medium' ? 2 : 1;
    return Math.max(-100, Math.min(100, surprise * 100 * impactMultiplier));
  }
}