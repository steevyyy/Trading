import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertTradingSignalSchema, insertRiskSettingsSchema } from "@shared/schema";
import { z } from "zod";

// Import services
import { DataAcquisitionService } from "./services/dataAcquisition";
import { TechnicalAnalysisService } from "./services/technicalAnalysis";
import { FundamentalAnalysisService } from "./services/fundamentalAnalysis";
import { SentimentAnalysisService } from "./services/sentimentAnalysis";
import { CotAnalysisService } from "./services/cotAnalysis";
import { SignalEngineService } from "./services/signalEngine";
import { RiskManagerService } from "./services/riskManager";
import { PaperTradingService } from "./services/paperTrading";

// Initialize services
const dataAcquisition = new DataAcquisitionService(storage);
const technicalAnalysis = new TechnicalAnalysisService(storage);
const fundamentalAnalysis = new FundamentalAnalysisService(storage);
const sentimentAnalysis = new SentimentAnalysisService(storage);
const cotAnalysis = new CotAnalysisService(storage);
const signalEngine = new SignalEngineService(storage);
const riskManager = new RiskManagerService(storage);
const paperTrading = new PaperTradingService(storage, riskManager);

// WebSocket clients
const wsClients = new Set<WebSocket>();

// Broadcast to all connected WebSocket clients
function broadcast(data: any) {
  const message = JSON.stringify(data);
  wsClients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// Start automated data collection and analysis
async function startAutomatedServices() {
  // Initialize default instruments
  await initializeInstruments();
  
  // Start data collection every 5 minutes
  setInterval(async () => {
    try {
      await dataAcquisition.collectMarketData();
      await storage.insertSystemLog({
        level: 'info',
        source: 'data_acquisition',
        message: 'Market data collected successfully',
        metadata: { timestamp: new Date() }
      });
    } catch (error) {
      await storage.insertSystemLog({
        level: 'error',
        source: 'data_acquisition',
        message: `Market data collection failed: ${error}`,
        metadata: { error: String(error) }
      });
    }
  }, 5 * 60 * 1000);

  // Run analysis every 10 minutes
  setInterval(async () => {
    try {
      const instruments = await storage.getInstruments();
      
      for (const instrument of instruments) {
        // Run technical analysis
        await technicalAnalysis.analyzeInstrument(instrument.id);
        
        // Generate signals
        const signals = await signalEngine.generateSignals(instrument.id);
        
        if (signals.length > 0) {
          broadcast({
            type: 'new_signals',
            data: signals
          });
        }
      }
      
      await storage.insertSystemLog({
        level: 'info',
        source: 'analysis_engine',
        message: 'Analysis completed successfully',
        metadata: { instrumentCount: instruments.length }
      });
    } catch (error) {
      await storage.insertSystemLog({
        level: 'error',
        source: 'analysis_engine',
        message: `Analysis failed: ${error}`,
        metadata: { error: String(error) }
      });
    }
  }, 10 * 60 * 1000);

  // Collect sentiment data every 15 minutes
  setInterval(async () => {
    try {
      await sentimentAnalysis.collectSentimentData();
    } catch (error) {
      await storage.insertSystemLog({
        level: 'error',
        source: 'sentiment_analysis',
        message: `Sentiment collection failed: ${error}`,
        metadata: { error: String(error) }
      });
    }
  }, 15 * 60 * 1000);

  // Collect COT data weekly (Fridays)
  setInterval(async () => {
    const now = new Date();
    if (now.getDay() === 5) { // Friday
      try {
        await cotAnalysis.collectCotData();
      } catch (error) {
        await storage.insertSystemLog({
          level: 'error',
          source: 'cot_analysis',
          message: `COT data collection failed: ${error}`,
          metadata: { error: String(error) }
        });
      }
    }
  }, 24 * 60 * 60 * 1000); // Daily check
}

async function initializeInstruments() {
  const defaultInstruments = [
    { symbol: 'EURUSD', name: 'EUR/USD', type: 'forex', exchange: 'Forex' },
    { symbol: 'GBPUSD', name: 'GBP/USD', type: 'forex', exchange: 'Forex' },
    { symbol: 'USDJPY', name: 'USD/JPY', type: 'forex', exchange: 'Forex' },
    { symbol: 'XAUUSD', name: 'Gold/USD', type: 'metal', exchange: 'Metals' },
    { symbol: 'XAGUSD', name: 'Silver/USD', type: 'metal', exchange: 'Metals' },
  ];

  for (const instrument of defaultInstruments) {
    const existing = await storage.getInstrumentBySymbol(instrument.symbol);
    if (!existing) {
      await storage.createInstrument(instrument);
    }
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Dashboard data endpoints
  app.get('/api/dashboard/overview', async (req, res) => {
    try {
      const userId = 1; // Default user for demo
      const performance = await storage.getTradingPerformance(userId);
      const activeSignals = await storage.getActiveSignals();
      const apiStatuses = await storage.getApiStatuses();
      
      res.json({
        performance,
        activeSignalsCount: activeSignals.length,
        dataSourcesOnline: apiStatuses.filter(s => s.status === 'active').length,
        totalDataSources: apiStatuses.length
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch overview data' });
    }
  });

  app.get('/api/trading-signals', async (req, res) => {
    try {
      const signals = await storage.getActiveSignals();
      const signalsWithInstruments = await Promise.all(
        signals.map(async (signal) => {
          const instrument = await storage.getInstrument(signal.instrumentId);
          return { ...signal, instrument };
        })
      );
      res.json(signalsWithInstruments);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch trading signals' });
    }
  });

  app.get('/api/market-data', async (req, res) => {
    try {
      const instruments = await storage.getInstruments();
      const marketData = await Promise.all(
        instruments.map(async (instrument) => {
          const data = await storage.getLatestMarketData(instrument.id, '1d');
          return { instrument, data };
        })
      );
      res.json(marketData);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch market data' });
    }
  });

  app.get('/api/technical-analysis/:instrumentId', async (req, res) => {
    try {
      const instrumentId = parseInt(req.params.instrumentId);
      const indicators = await storage.getLatestTechnicalIndicators(instrumentId, '4h');
      res.json(indicators);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch technical analysis' });
    }
  });

  app.get('/api/sentiment-analysis', async (req, res) => {
    try {
      const sentimentData = await storage.getLatestSentimentData();
      
      // Calculate overall sentiment score
      const overallSentiment = sentimentData.reduce((acc, data) => {
        return acc + parseFloat(data.sentiment || '0');
      }, 0) / sentimentData.length || 0;

      // Group by source
      const bySource = sentimentData.reduce((acc, data) => {
        if (!acc[data.source]) {
          acc[data.source] = [];
        }
        acc[data.source].push(data);
        return acc;
      }, {} as Record<string, typeof sentimentData>);

      const sourceAverages = Object.entries(bySource).map(([source, data]) => ({
        source,
        average: data.reduce((acc, d) => acc + parseFloat(d.sentiment || '0'), 0) / data.length
      }));

      res.json({
        overall: overallSentiment,
        bySource: sourceAverages,
        recent: sentimentData.slice(0, 10)
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch sentiment analysis' });
    }
  });

  app.get('/api/cot-data', async (req, res) => {
    try {
      const instruments = await storage.getInstruments();
      const cotData = await Promise.all(
        instruments.map(async (instrument) => {
          const data = await storage.getLatestCotData(instrument.id);
          return { instrument, data };
        })
      );
      res.json(cotData);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch COT data' });
    }
  });

  app.get('/api/risk-settings/:userId', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const settings = await storage.getRiskSettings(userId);
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch risk settings' });
    }
  });

  app.put('/api/risk-settings/:userId', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const settings = insertRiskSettingsSchema.parse(req.body);
      const updated = await storage.updateRiskSettings(userId, settings);
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update risk settings' });
    }
  });

  app.get('/api/paper-trades/:userId', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const limit = parseInt(req.query.limit as string) || 50;
      const trades = await storage.getTradeHistory(userId, limit);
      
      const tradesWithInstruments = await Promise.all(
        trades.map(async (trade) => {
          const instrument = await storage.getInstrument(trade.instrumentId);
          return { ...trade, instrument };
        })
      );
      
      res.json(tradesWithInstruments);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch paper trades' });
    }
  });

  app.get('/api/system-status', async (req, res) => {
    try {
      const apiStatuses = await storage.getApiStatuses();
      const recentLogs = await storage.getSystemLogs(10);
      
      res.json({
        apiStatuses,
        recentLogs,
        systemHealth: {
          cpu: Math.floor(Math.random() * 30 + 10), // Mock data
          memory: Math.floor(Math.random() * 30 + 30),
          uptime: '7d 14h 23m'
        }
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch system status' });
    }
  });

  // Manual signal generation endpoint
  app.post('/api/generate-signals', async (req, res) => {
    try {
      const instruments = await storage.getInstruments();
      const allSignals = [];
      
      for (const instrument of instruments) {
        const signals = await signalEngine.generateSignals(instrument.id);
        allSignals.push(...signals);
      }
      
      if (allSignals.length > 0) {
        broadcast({
          type: 'new_signals',
          data: allSignals
        });
      }
      
      res.json({ generated: allSignals.length });
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate signals' });
    }
  });

  const httpServer = createServer(app);

  // WebSocket server
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws) => {
    wsClients.add(ws);
    
    ws.on('close', () => {
      wsClients.delete(ws);
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      wsClients.delete(ws);
    });

    // Send initial data
    ws.send(JSON.stringify({
      type: 'connection_established',
      timestamp: new Date().toISOString()
    }));
  });

  // Start automated services
  await startAutomatedServices();

  return httpServer;
}
