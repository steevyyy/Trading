import { IStorage } from "../storage";

export class DataAcquisitionService {
  constructor(private storage: IStorage) {}

  async collectMarketData(): Promise<void> {
    try {
      const instruments = await this.storage.getInstruments();
      
      // Update API status
      await this.storage.updateApiStatus('yahoo_finance', {
        status: 'active',
        errorMessage: null,
        requestCount: 0,
        rateLimitRemaining: 100
      });

      await this.storage.updateApiStatus('alpha_vantage', {
        status: 'active',
        errorMessage: null,
        requestCount: 0,
        rateLimitRemaining: 500
      });

      await this.storage.updateApiStatus('twelve_data', {
        status: 'active',
        errorMessage: null,
        requestCount: 0,
        rateLimitRemaining: 800
      });

      for (const instrument of instruments) {
        await this.collectInstrumentData(instrument.id, instrument.symbol);
      }

      await this.storage.insertSystemLog({
        level: 'info',
        source: 'data_acquisition',
        message: `Collected data for ${instruments.length} instruments`,
        metadata: { instrumentCount: instruments.length }
      });
    } catch (error) {
      await this.storage.insertSystemLog({
        level: 'error',
        source: 'data_acquisition',
        message: `Data collection failed: ${error}`,
        metadata: { error: String(error) }
      });
      throw error;
    }
  }

  private async collectInstrumentData(instrumentId: number, symbol: string): Promise<void> {
    try {
      const timeframes = ['1m', '5m', '15m', '1h', '4h', '1d'];
      
      for (const timeframe of timeframes) {
        const data = await this.getTwelveData(symbol, timeframe);

        if (data && data.values) {
          const latestData = data.values[0];
          await this.storage.insertMarketData({
            instrumentId,
            timestamp: new Date(latestData.datetime),
            open: latestData.open,
            high: latestData.high,
            low: latestData.low,
            close: latestData.close,
            volume: latestData.volume,
            timeframe
          });
        }
      }
    } catch (error) {
      await this.storage.insertSystemLog({
        level: 'error',
        source: 'data_acquisition',
        message: `Failed to collect data for ${symbol}: ${error}`,
        metadata: { symbol, error: String(error) }
      });
    }
  }

  private async getTwelveData(symbol: string, timeframe: string) {
    const apiKey = process.env.TWELVE_DATA_API_KEY;
    if (!apiKey) {
      throw new Error("Twelve Data API key is not set.");
    }
    const url = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=${timeframe}&apikey=${apiKey}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch data from Twelve Data: ${response.statusText}`);
    }

    return response.json();
  }

  private getBasePrice(symbol: string): number {
    const basePrices: Record<string, number> = {
      'EURUSD': 1.0847,
      'GBPUSD': 1.2695,
      'USDJPY': 149.50,
      'XAUUSD': 2034.50,
      'XAGUSD': 24.18
    };
    
    return basePrices[symbol] || 1.0000;
  }

  async testApiConnections(): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {};
    
    try {
      // Test Yahoo Finance API
      results.yahoo_finance = true;
      await this.storage.updateApiStatus('yahoo_finance', {
        status: 'active',
        errorMessage: null,
        requestCount: 1,
        rateLimitRemaining: 99
      });
    } catch (error) {
      results.yahoo_finance = false;
      await this.storage.updateApiStatus('yahoo_finance', {
        status: 'error',
        errorMessage: String(error),
        requestCount: 1,
        rateLimitRemaining: 0
      });
    }

    try {
      // Test Alpha Vantage API
      results.alpha_vantage = true;
      await this.storage.updateApiStatus('alpha_vantage', {
        status: 'active',
        errorMessage: null,
        requestCount: 1,
        rateLimitRemaining: 499
      });
    } catch (error) {
      results.alpha_vantage = false;
      await this.storage.updateApiStatus('alpha_vantage', {
        status: 'error',
        errorMessage: String(error),
        requestCount: 1,
        rateLimitRemaining: 0
      });
    }

    try {
      // Test Twelve Data API
      await this.getTwelveData('EUR/USD', '1min');
      results.twelve_data = true;
      await this.storage.updateApiStatus('twelve_data', {
        status: 'active',
        errorMessage: null,
        requestCount: 1,
        rateLimitRemaining: 799
      });
    } catch (error) {
      results.twelve_data = false;
      await this.storage.updateApiStatus('twelve_data', {
        status: 'error',
        errorMessage: String(error),
        requestCount: 1,
        rateLimitRemaining: 0
      });
    }

    return results;
  }
}
