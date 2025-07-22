import { IStorage } from "../storage";

export class CotAnalysisService {
  constructor(private storage: IStorage) {}

  async collectCotData(): Promise<void> {
    try {
      const instruments = await this.storage.getInstruments();
      
      for (const instrument of instruments) {
        await this.collectInstrumentCotData(instrument.id, instrument.symbol);
      }

      // Update API status
      await this.storage.updateApiStatus('cftc_cot', {
        status: 'active',
        errorMessage: null,
        requestCount: instruments.length,
        rateLimitRemaining: 100
      });

      await this.storage.insertSystemLog({
        level: 'info',
        source: 'cot_analysis',
        message: `COT data collected for ${instruments.length} instruments`,
        metadata: { instrumentCount: instruments.length }
      });
    } catch (error) {
      await this.storage.insertSystemLog({
        level: 'error',
        source: 'cot_analysis',
        message: `COT data collection failed: ${error}`,
        metadata: { error: String(error) }
      });
      throw error;
    }
  }

  private async collectInstrumentCotData(instrumentId: number, symbol: string): Promise<void> {
    try {
      // Simulate COT data - in real implementation, parse CFTC CSV files
      const cotData = this.generateMockCotData(symbol);
      
      await this.storage.insertCotData({
        instrumentId,
        reportDate: new Date(),
        commercialLong: cotData.commercialLong.toString(),
        commercialShort: cotData.commercialShort.toString(),
        nonCommercialLong: cotData.nonCommercialLong.toString(),
        nonCommercialShort: cotData.nonCommercialShort.toString(),
        netNonCommercial: cotData.netNonCommercial.toString(),
        weeklyChange: cotData.weeklyChange.toString()
      });

    } catch (error) {
      await this.storage.insertSystemLog({
        level: 'error',
        source: 'cot_analysis',
        message: `COT data collection failed for ${symbol}: ${error}`,
        metadata: { symbol, error: String(error) }
      });
    }
  }

  private generateMockCotData(symbol: string): {
    commercialLong: number;
    commercialShort: number;
    nonCommercialLong: number;
    nonCommercialShort: number;
    netNonCommercial: number;
    weeklyChange: number;
  } {
    // Base values for different instruments
    const baseData: Record<string, any> = {
      'EURUSD': { base: 150000, volatility: 0.1 },
      'GBPUSD': { base: 80000, volatility: 0.15 },
      'USDJPY': { base: 120000, volatility: 0.12 },
      'XAUUSD': { base: 200000, volatility: 0.08 },
      'XAGUSD': { base: 50000, volatility: 0.2 }
    };

    const config = baseData[symbol] || { base: 100000, volatility: 0.1 };
    const base = config.base;
    const vol = config.volatility;

    // Generate realistic COT positions
    const commercialLong = Math.floor(base * (1 + (Math.random() - 0.5) * vol));
    const commercialShort = Math.floor(base * 0.9 * (1 + (Math.random() - 0.5) * vol));
    
    const nonCommercialLong = Math.floor(base * 0.3 * (1 + (Math.random() - 0.5) * vol * 2));
    const nonCommercialShort = Math.floor(base * 0.25 * (1 + (Math.random() - 0.5) * vol * 2));
    
    const netNonCommercial = nonCommercialLong - nonCommercialShort;
    const weeklyChange = Math.floor((Math.random() - 0.5) * base * 0.05);

    return {
      commercialLong,
      commercialShort,
      nonCommercialLong,
      nonCommercialShort,
      netNonCommercial,
      weeklyChange
    };
  }

  async getCotSignal(instrumentId: number): Promise<{ signal: 'buy' | 'sell' | 'hold'; confidence: number }> {
    try {
      const cotData = await this.storage.getLatestCotData(instrumentId);
      
      if (!cotData) {
        return { signal: 'hold', confidence: 0 };
      }

      const netNonCommercial = parseFloat(cotData.netNonCommercial || '0');
      const weeklyChange = parseFloat(cotData.weeklyChange || '0');
      
      // Analyze positioning extremes
      const extremeThreshold = 50000; // Adjust based on instrument
      const isExtremelyLong = netNonCommercial > extremeThreshold;
      const isExtremelyShort = netNonCommercial < -extremeThreshold;
      
      // COT is often contrarian - extreme positioning may signal reversal
      let signal: 'buy' | 'sell' | 'hold' = 'hold';
      let confidence = 0;
      
      if (isExtremelyLong && weeklyChange < 0) {
        // Extreme long positions reducing - potential bearish reversal
        signal = 'sell';
        confidence = Math.min(Math.abs(netNonCommercial) / extremeThreshold * 60, 90);
      } else if (isExtremelyShort && weeklyChange > 0) {
        // Extreme short positions reducing - potential bullish reversal
        signal = 'buy';
        confidence = Math.min(Math.abs(netNonCommercial) / extremeThreshold * 60, 90);
      } else if (Math.abs(weeklyChange) > extremeThreshold * 0.1) {
        // Significant weekly change suggests momentum
        signal = weeklyChange > 0 ? 'buy' : 'sell';
        confidence = Math.min(Math.abs(weeklyChange) / (extremeThreshold * 0.1) * 40, 70);
      }

      return { signal, confidence };
    } catch (error) {
      await this.storage.insertSystemLog({
        level: 'error',
        source: 'cot_analysis',
        message: `COT signal calculation failed: ${error}`,
        metadata: { instrumentId, error: String(error) }
      });
      return { signal: 'hold', confidence: 0 };
    }
  }

  async getPositioningAnalysis(): Promise<{
    [instrumentSymbol: string]: {
      netPosition: number;
      weeklyChange: number;
      positionType: 'extremely_long' | 'long' | 'neutral' | 'short' | 'extremely_short';
      contrarian_signal: 'buy' | 'sell' | 'hold';
    }
  }> {
    try {
      const instruments = await this.storage.getInstruments();
      const analysis: any = {};

      for (const instrument of instruments) {
        const cotData = await this.storage.getLatestCotData(instrument.id);
        
        if (cotData) {
          const netPosition = parseFloat(cotData.netNonCommercial || '0');
          const weeklyChange = parseFloat(cotData.weeklyChange || '0');
          
          // Determine position type
          let positionType: string;
          if (netPosition > 50000) {
            positionType = 'extremely_long';
          } else if (netPosition > 20000) {
            positionType = 'long';
          } else if (netPosition < -50000) {
            positionType = 'extremely_short';
          } else if (netPosition < -20000) {
            positionType = 'short';
          } else {
            positionType = 'neutral';
          }

          // Contrarian signal
          let contrarian_signal: 'buy' | 'sell' | 'hold' = 'hold';
          if (positionType === 'extremely_long') {
            contrarian_signal = 'sell';
          } else if (positionType === 'extremely_short') {
            contrarian_signal = 'buy';
          }

          analysis[instrument.symbol] = {
            netPosition,
            weeklyChange,
            positionType,
            contrarian_signal
          };
        }
      }

      return analysis;
    } catch (error) {
      await this.storage.insertSystemLog({
        level: 'error',
        source: 'cot_analysis',
        message: `Positioning analysis failed: ${error}`,
        metadata: { error: String(error) }
      });
      return {};
    }
  }

  async downloadCftcData(): Promise<boolean> {
    try {
      // In a real implementation, this would:
      // 1. Download the latest COT report from CFTC website
      // 2. Parse the CSV/XML files
      // 3. Extract relevant futures data for forex and metals
      // 4. Store in database
      
      await this.storage.insertSystemLog({
        level: 'info',
        source: 'cot_analysis',
        message: 'CFTC data download simulation completed',
        metadata: { timestamp: new Date() }
      });
      
      return true;
    } catch (error) {
      await this.storage.insertSystemLog({
        level: 'error',
        source: 'cot_analysis',
        message: `CFTC data download failed: ${error}`,
        metadata: { error: String(error) }
      });
      return false;
    }
  }
}
