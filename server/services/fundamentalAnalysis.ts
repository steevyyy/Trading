import { IStorage } from "../storage";

export class FundamentalAnalysisService {
  constructor(private storage: IStorage) {}

  async collectFundamentalData(): Promise<void> {
    try {
      // Simulate fundamental data collection
      await this.collectEconomicCalendarData();
      await this.collectCentralBankData();
      
      await this.storage.insertSystemLog({
        level: 'info',
        source: 'fundamental_analysis',
        message: 'Fundamental data collection completed',
        metadata: { timestamp: new Date() }
      });
    } catch (error) {
      await this.storage.insertSystemLog({
        level: 'error',
        source: 'fundamental_analysis',
        message: `Fundamental data collection failed: ${error}`,
        metadata: { error: String(error) }
      });
      throw error;
    }
  }

  private async collectEconomicCalendarData(): Promise<void> {
    // Simulate economic events data
    const events = [
      {
        event: 'Non-Farm Payrolls',
        currency: 'USD',
        impact: 'high',
        forecast: '180K',
        actual: '199K',
        previous: '175K'
      },
      {
        event: 'GDP Growth Rate',
        currency: 'EUR',
        impact: 'high',
        forecast: '2.1%',
        actual: '2.3%',
        previous: '2.0%'
      },
      {
        event: 'Interest Rate Decision',
        currency: 'GBP',
        impact: 'high',
        forecast: '5.25%',
        actual: '5.25%',
        previous: '5.25%'
      },
      {
        event: 'Inflation Rate',
        currency: 'USD',
        impact: 'medium',
        forecast: '3.2%',
        actual: '3.1%',
        previous: '3.3%'
      }
    ];

    for (const event of events) {
      const score = this.calculateImpactScore(event.forecast, event.actual, event.impact);
      
      await this.storage.insertFundamentalData({
        timestamp: new Date(),
        event: event.event,
        currency: event.currency,
        impact: event.impact,
        forecast: event.forecast,
        actual: event.actual,
        previous: event.previous,
        score: score.toFixed(2)
      });
    }
  }

  private async collectCentralBankData(): Promise<void> {
    // Simulate central bank statement analysis
    const statements = [
      {
        event: 'Fed Meeting Minutes',
        currency: 'USD',
        impact: 'high',
        sentiment: 'hawkish'
      },
      {
        event: 'ECB Press Conference',
        currency: 'EUR',
        impact: 'medium',
        sentiment: 'dovish'
      },
      {
        event: 'BOE Monetary Policy Report',
        currency: 'GBP',
        impact: 'medium',
        sentiment: 'neutral'
      }
    ];

    for (const statement of statements) {
      const score = this.calculateSentimentScore(statement.sentiment, statement.impact);
      
      await this.storage.insertFundamentalData({
        timestamp: new Date(),
        event: statement.event,
        currency: statement.currency,
        impact: statement.impact,
        forecast: null,
        actual: statement.sentiment,
        previous: null,
        score: score.toFixed(2)
      });
    }
  }

  private calculateImpactScore(forecast: string, actual: string, impact: string): number {
    // Parse numeric values from forecast and actual
    const forecastNum = this.parseNumericValue(forecast);
    const actualNum = this.parseNumericValue(actual);
    
    if (forecastNum === null || actualNum === null) {
      return 0;
    }

    // Calculate deviation as percentage
    const deviation = ((actualNum - forecastNum) / Math.abs(forecastNum)) * 100;
    
    // Weight by impact level
    const impactMultiplier = {
      'high': 3,
      'medium': 2,
      'low': 1
    }[impact] || 1;

    // Return score between -100 and +100
    return Math.max(-100, Math.min(100, deviation * impactMultiplier));
  }

  private calculateSentimentScore(sentiment: string, impact: string): number {
    const sentimentScore = {
      'hawkish': 75,
      'bullish': 75,
      'positive': 50,
      'neutral': 0,
      'negative': -50,
      'dovish': -75,
      'bearish': -75
    }[sentiment.toLowerCase()] || 0;

    const impactMultiplier = {
      'high': 1,
      'medium': 0.7,
      'low': 0.5
    }[impact] || 0.5;

    return sentimentScore * impactMultiplier;
  }

  private parseNumericValue(value: string): number | null {
    if (!value) return null;
    
    // Remove common symbols and extract number
    const cleaned = value.replace(/[%KMB$€£¥,]/g, '');
    const num = parseFloat(cleaned);
    
    if (isNaN(num)) return null;
    
    // Handle K, M, B suffixes
    if (value.includes('K')) return num * 1000;
    if (value.includes('M')) return num * 1000000;
    if (value.includes('B')) return num * 1000000000;
    
    return num;
  }

  async getFundamentalSignal(currency: string): Promise<{ signal: 'buy' | 'sell' | 'hold'; confidence: number }> {
    try {
      const recentData = await this.storage.getRecentFundamentalData(10);
      const currencyData = recentData.filter(d => d.currency === currency);
      
      if (currencyData.length === 0) {
        return { signal: 'hold', confidence: 0 };
      }

      // Calculate weighted average score
      let totalScore = 0;
      let totalWeight = 0;

      for (const data of currencyData) {
        const score = parseFloat(data.score || '0');
        const weight = this.getEventWeight(data.impact || 'low');
        
        totalScore += score * weight;
        totalWeight += weight;
      }

      const averageScore = totalWeight > 0 ? totalScore / totalWeight : 0;
      const confidence = Math.min(Math.abs(averageScore), 100);
      
      let signal: 'buy' | 'sell' | 'hold' = 'hold';
      if (averageScore > 25) {
        signal = 'buy';
      } else if (averageScore < -25) {
        signal = 'sell';
      }

      return { signal, confidence };
    } catch (error) {
      await this.storage.insertSystemLog({
        level: 'error',
        source: 'fundamental_analysis',
        message: `Fundamental signal calculation failed: ${error}`,
        metadata: { currency, error: String(error) }
      });
      return { signal: 'hold', confidence: 0 };
    }
  }

  private getEventWeight(impact: string): number {
    return {
      'high': 3,
      'medium': 2,
      'low': 1
    }[impact] || 1;
  }

  async analyzeCurrencyStrength(): Promise<Record<string, number>> {
    try {
      const currencies = ['USD', 'EUR', 'GBP', 'JPY'];
      const strengths: Record<string, number> = {};

      for (const currency of currencies) {
        const signal = await this.getFundamentalSignal(currency);
        strengths[currency] = signal.signal === 'buy' ? signal.confidence : 
                             signal.signal === 'sell' ? -signal.confidence : 0;
      }

      return strengths;
    } catch (error) {
      await this.storage.insertSystemLog({
        level: 'error',
        source: 'fundamental_analysis',
        message: `Currency strength analysis failed: ${error}`,
        metadata: { error: String(error) }
      });
      return {};
    }
  }
}
