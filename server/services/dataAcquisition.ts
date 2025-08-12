import { IStorage } from "../storage";
import { insertMarketDataSchema } from "@shared/schema";
import { z } from "zod";

const ALLTICK_API_KEY = "cad28909d37d94b2962efcb1a271601f-c-app";

const timeframeToKlineType: Record<string, number> = {
  '1m': 1,
  '5m': 2,
  '15m': 3,
  '30m': 4,
  '1h': 5,
  '2h': 6,
  '4h': 7,
  '1d': 8,
  '1w': 9,
  '1M': 10,
};

export class DataAcquisitionService {
  constructor(private storage: IStorage) {}

  async collectMarketData(): Promise<void> {
    try {
      const instruments = await this.storage.getInstruments();
      
      await this.storage.updateApiStatus('alltick_api', {
        status: 'active',
        errorMessage: null,
        requestCount: 0,
        rateLimitRemaining: 100
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
        const data = await this.getAllTickData(symbol, timeframe);

        if (data && data.data.kline_list) {
          for (const kline of data.data.kline_list) {
            await this.storage.insertMarketData({
              instrumentId,
              timestamp: new Date(parseInt(kline.timestamp) * 1000),
              open: kline.open_price,
              high: kline.high_price,
              low: kline.low_price,
              close: kline.close_price,
              volume: kline.volume,
              timeframe
            });
          }
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

  private async getAllTickData(symbol: string, timeframe: string): Promise<any> {
    const instrument = await this.storage.getInstrumentBySymbol(symbol);
    if (!instrument) {
      throw new Error(`Instrument not found for symbol: ${symbol}`);
    }

    const isStock = instrument.type === 'stock';
    const klineType = timeframeToKlineType[timeframe];

    if (!klineType) {
      throw new Error(`Unsupported timeframe: ${timeframe}`);
    }

    if (isStock && (klineType === 6 || klineType === 7)) {
        console.log(`Skipping unsupported timeframe ${timeframe} for stock ${symbol}`);
        return;
    }

    const baseUrl = isStock
      ? 'https://quote.alltick.io/quote-stock-b-api/kline'
      : 'https://quote.alltick.io/quote-b-api/kline';

    const query = {
      trace: `trace-${Date.now()}`,
      data: {
        code: symbol,
        kline_type: klineType,
        kline_timestamp_end: 0,
        query_kline_num: 2, // Get the last 2 k-lines
        adjust_type: 0
      }
    };

    const encodedQuery = encodeURIComponent(JSON.stringify(query));
    const url = `${baseUrl}?token=${ALLTICK_API_KEY}&query=${encodedQuery}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch data from AllTick API: ${response.statusText}`);
    }

    const responseData = await response.json();
    if (responseData.ret !== 200) {
        throw new Error(`AllTick API returned an error: ${responseData.msg}`);
    }
    return responseData;
  }

  async testApiConnections(): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {};
    
    try {
      await this.getAllTickData('EURUSD', '1m');
      results.alltick_api = true;
      await this.storage.updateApiStatus('alltick_api', {
        status: 'active',
        errorMessage: null,
        requestCount: 1,
        rateLimitRemaining: 99
      });
    } catch (error) {
      results.alltick_api = false;
      await this.storage.updateApiStatus('alltick_api', {
        status: 'error',
        errorMessage: String(error),
        requestCount: 1,
        rateLimitRemaining: 0
      });
    }

    return results;
  }
}
