import { IStorage } from "./storage";
import { DataAcquisitionService } from "./services/dataAcquisition";
import { SignalEngineService } from "./services/signalEngine";
import { PaperTradingService } from "./services/paperTrading";
import { RiskManagerService } from "./services/riskManager";
import { MarketSimulatorService } from "./services/marketSimulator";

export class TradingBotScheduler {
  private dataAcquisition: DataAcquisitionService;
  private signalEngine: SignalEngineService;
  private paperTrading: PaperTradingService;
  private marketSimulator: MarketSimulatorService;
  private isRunning = false;
  private intervals: NodeJS.Timeout[] = [];

  constructor(private storage: IStorage) {
    this.dataAcquisition = new DataAcquisitionService(storage);
    this.signalEngine = new SignalEngineService(storage);
    this.paperTrading = new PaperTradingService(storage, new RiskManagerService(storage));
    this.marketSimulator = new MarketSimulatorService(storage);
  }

  start(): void {
    if (this.isRunning) {
      console.log('Trading bot scheduler is already running');
      return;
    }

    this.isRunning = true;
    console.log('Starting trading bot scheduler...');

    // Schedule market data generation every 2 minutes
    const marketDataInterval = setInterval(async () => {
      try {
        console.log('Generating market data...');
        await this.marketSimulator.generateMarketData();
        await this.marketSimulator.generateEconomicEvents();
        console.log('Market data generation completed');
      } catch (error) {
        console.error('Market data generation error:', error);
      }
    }, 2 * 60 * 1000); // 2 minutes

    // Schedule signal generation every 10 minutes
    const signalGenerationInterval = setInterval(async () => {
      try {
        console.log('Running signal generation...');
        await this.generateSignalsForAllInstruments();
        console.log('Signal generation completed');
      } catch (error) {
        console.error('Signal generation error:', error);
      }
    }, 10 * 60 * 1000); // 10 minutes

    // Schedule trade execution check every 15 minutes
    const tradeExecutionInterval = setInterval(async () => {
      try {
        console.log('Running trade execution check...');
        await this.executeTradesFromSignals();
        console.log('Trade execution check completed');
      } catch (error) {
        console.error('Trade execution error:', error);
      }
    }, 15 * 60 * 1000); // 15 minutes

    this.intervals.push(marketDataInterval, signalGenerationInterval, tradeExecutionInterval);

    // Run initial data collection immediately
    this.runInitialSetup();
  }

  stop(): void {
    if (!this.isRunning) {
      return;
    }

    this.isRunning = false;
    console.log('Stopping trading bot scheduler...');

    this.intervals.forEach(interval => clearInterval(interval));
    this.intervals = [];
  }

  private async runInitialSetup(): Promise<void> {
    try {
      console.log('Running initial bot setup...');
      
      // Create default instruments if they don't exist
      await this.ensureDefaultInstruments();
      
      // Initial market data generation
      await this.marketSimulator.generateMarketData();
      await this.marketSimulator.generateEconomicEvents();
      
      // Generate initial signals
      await this.generateSignalsForAllInstruments();
      
      console.log('Initial setup completed');
    } catch (error) {
      console.error('Initial setup error:', error);
    }
  }

  private async ensureDefaultInstruments(): Promise<void> {
    const defaultInstruments = [
      { symbol: 'EURUSD', name: 'Euro/US Dollar', type: 'forex' },
      { symbol: 'GBPUSD', name: 'British Pound/US Dollar', type: 'forex' },
      { symbol: 'USDJPY', name: 'US Dollar/Japanese Yen', type: 'forex' },
      { symbol: 'AUDUSD', name: 'Australian Dollar/US Dollar', type: 'forex' },
      { symbol: 'XAUUSD', name: 'Gold/US Dollar', type: 'metals' },
      { symbol: 'XAGUSD', name: 'Silver/US Dollar', type: 'metals' },
    ];

    for (const instrument of defaultInstruments) {
      try {
        const existing = await this.storage.getInstrumentBySymbol(instrument.symbol);
        if (!existing) {
          await this.storage.createInstrument({
            ...instrument,
            exchange: null,
            isActive: true
          });
          console.log(`Created instrument: ${instrument.symbol}`);
        }
      } catch (error) {
        console.error(`Error creating instrument ${instrument.symbol}:`, error);
      }
    }
  }

  private async generateSignalsForAllInstruments(): Promise<void> {
    const instruments = await this.storage.getInstruments();
    
    for (const instrument of instruments) {
      try {
        const signals = await this.signalEngine.generateSignals(instrument.id);
        console.log(`Generated ${signals.length} signals for ${instrument.symbol}`);
      } catch (error) {
        console.error(`Error generating signals for ${instrument.symbol}:`, error);
      }
    }
  }

  private async executeTradesFromSignals(): Promise<void> {
    const userId = 1; // Default user for demo
    const activeSignals = await this.storage.getActiveSignals();
    
    for (const signal of activeSignals) {
      try {
        const confidence = parseFloat(signal.confidence);
        if (confidence > 70) { // Only execute high confidence signals
          const result = await this.paperTrading.executeTrade(signal.id, userId);
          const success = result.success;
          
          if (success) {
            console.log(`Executed trade for signal ${signal.id} on ${signal.instrumentId}`);
            // Deactivate signal after execution
            await this.storage.deactivateSignal(signal.id);
          }
        }
      } catch (error) {
        console.error(`Error executing trade for signal ${signal.id}:`, error);
      }
    }
  }

  private calculateTradeAmount(confidence: number): number {
    // Risk-adjusted position sizing based on confidence
    const baseAmount = 1000; // $1000 base position
    const confidenceMultiplier = confidence / 100;
    return Math.round(baseAmount * confidenceMultiplier);
  }
}