import { eq, desc, and, gte, lte, sql } from "drizzle-orm";
import { db } from "./db";
import {
  users, instruments, marketData, technicalIndicators, fundamentalData,
  sentimentData, cotData, tradingSignals, paperTrades, riskSettings,
  systemLogs, apiStatus,
  type User, type InsertUser, type Instrument, type MarketData,
  type TechnicalIndicator, type FundamentalData, type SentimentData,
  type CotData, type TradingSignal, type PaperTrade, type RiskSettings,
  type SystemLog, type ApiStatus
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Instruments
  getInstruments(): Promise<Instrument[]>;
  getInstrument(id: number): Promise<Instrument | undefined>;
  getInstrumentBySymbol(symbol: string): Promise<Instrument | undefined>;
  createInstrument(instrument: Omit<Instrument, 'id' | 'createdAt'>): Promise<Instrument>;

  // Market Data
  getLatestMarketData(instrumentId: number, timeframe: string): Promise<MarketData | undefined>;
  getMarketDataRange(instrumentId: number, timeframe: string, from: Date, to: Date): Promise<MarketData[]>;
  insertMarketData(data: Omit<MarketData, 'id'>): Promise<MarketData>;
  insertMarketDataBatch(data: Omit<MarketData, 'id'>[]): Promise<void>;

  // Technical Indicators
  getLatestTechnicalIndicators(instrumentId: number, timeframe: string): Promise<TechnicalIndicator | undefined>;
  insertTechnicalIndicators(indicators: Omit<TechnicalIndicator, 'id'>): Promise<TechnicalIndicator>;

  // Fundamental Data
  getRecentFundamentalData(limit: number): Promise<FundamentalData[]>;
  insertFundamentalData(data: Omit<FundamentalData, 'id'>): Promise<FundamentalData>;

  // Sentiment Data
  getLatestSentimentData(instrumentId?: number): Promise<SentimentData[]>;
  insertSentimentData(data: Omit<SentimentData, 'id'>): Promise<SentimentData>;

  // COT Data
  getLatestCotData(instrumentId: number): Promise<CotData | undefined>;
  insertCotData(data: Omit<CotData, 'id'>): Promise<CotData>;

  // Trading Signals
  getActiveSignals(): Promise<TradingSignal[]>;
  getSignalsByInstrument(instrumentId: number): Promise<TradingSignal[]>;
  createTradingSignal(signal: Omit<TradingSignal, 'id' | 'timestamp' | 'isActive'>): Promise<TradingSignal>;
  deactivateSignal(id: number): Promise<void>;

  // Paper Trades
  getActiveTrades(userId: number): Promise<PaperTrade[]>;
  getTradeHistory(userId: number, limit: number): Promise<PaperTrade[]>;
  createPaperTrade(trade: Omit<PaperTrade, 'id' | 'openedAt'>): Promise<PaperTrade>;
  updatePaperTrade(id: number, updates: Partial<PaperTrade>): Promise<PaperTrade>;

  // Risk Settings
  getRiskSettings(userId: number): Promise<RiskSettings | undefined>;
  updateRiskSettings(userId: number, settings: Omit<RiskSettings, 'id' | 'userId' | 'updatedAt'>): Promise<RiskSettings>;

  // System Logs
  insertSystemLog(log: Omit<SystemLog, 'id' | 'timestamp'>): Promise<SystemLog>;
  getSystemLogs(limit: number): Promise<SystemLog[]>;

  // API Status
  getApiStatuses(): Promise<ApiStatus[]>;
  updateApiStatus(serviceName: string, status: Omit<ApiStatus, 'id' | 'serviceName' | 'lastUpdate'>): Promise<ApiStatus>;

  // Analytics
  getTradingPerformance(userId: number): Promise<{
    totalPnL: number;
    winRate: number;
    totalTrades: number;
    activeTrades: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Instruments
  async getInstruments(): Promise<Instrument[]> {
    return await db.select().from(instruments).where(eq(instruments.isActive, true));
  }

  async getInstrument(id: number): Promise<Instrument | undefined> {
    const [instrument] = await db.select().from(instruments).where(eq(instruments.id, id));
    return instrument || undefined;
  }

  async getInstrumentBySymbol(symbol: string): Promise<Instrument | undefined> {
    const [instrument] = await db.select().from(instruments).where(eq(instruments.symbol, symbol));
    return instrument || undefined;
  }

  async createInstrument(instrument: Omit<Instrument, 'id' | 'createdAt'>): Promise<Instrument> {
    const [created] = await db.insert(instruments).values(instrument).returning();
    return created;
  }

  // Market Data
  async getLatestMarketData(instrumentId: number, timeframe: string): Promise<MarketData | undefined> {
    const [data] = await db
      .select()
      .from(marketData)
      .where(and(eq(marketData.instrumentId, instrumentId), eq(marketData.timeframe, timeframe)))
      .orderBy(desc(marketData.timestamp))
      .limit(1);
    return data || undefined;
  }

  async getMarketDataRange(instrumentId: number, timeframe: string, from: Date, to: Date): Promise<MarketData[]> {
    return await db
      .select()
      .from(marketData)
      .where(
        and(
          eq(marketData.instrumentId, instrumentId),
          eq(marketData.timeframe, timeframe),
          gte(marketData.timestamp, from),
          lte(marketData.timestamp, to)
        )
      )
      .orderBy(marketData.timestamp);
  }

  async insertMarketData(data: Omit<MarketData, 'id'>): Promise<MarketData> {
    const [inserted] = await db.insert(marketData).values(data).returning();
    return inserted;
  }

  async insertMarketDataBatch(data: Omit<MarketData, 'id'>[]): Promise<void> {
    if (data.length > 0) {
      await db.insert(marketData).values(data);
    }
  }

  // Technical Indicators
  async getLatestTechnicalIndicators(instrumentId: number, timeframe: string): Promise<TechnicalIndicator | undefined> {
    const [indicators] = await db
      .select()
      .from(technicalIndicators)
      .where(and(eq(technicalIndicators.instrumentId, instrumentId), eq(technicalIndicators.timeframe, timeframe)))
      .orderBy(desc(technicalIndicators.timestamp))
      .limit(1);
    return indicators || undefined;
  }

  async insertTechnicalIndicators(indicators: Omit<TechnicalIndicator, 'id'>): Promise<TechnicalIndicator> {
    const [inserted] = await db.insert(technicalIndicators).values(indicators).returning();
    return inserted;
  }

  // Fundamental Data
  async getRecentFundamentalData(limit: number): Promise<FundamentalData[]> {
    return await db
      .select()
      .from(fundamentalData)
      .orderBy(desc(fundamentalData.timestamp))
      .limit(limit);
  }

  async insertFundamentalData(data: Omit<FundamentalData, 'id'>): Promise<FundamentalData> {
    const [inserted] = await db.insert(fundamentalData).values(data).returning();
    return inserted;
  }

  // Sentiment Data
  async getLatestSentimentData(instrumentId?: number): Promise<SentimentData[]> {
    const query = db.select().from(sentimentData);
    
    if (instrumentId) {
      query.where(eq(sentimentData.instrumentId, instrumentId));
    }
    
    return await query.orderBy(desc(sentimentData.timestamp)).limit(10);
  }

  async insertSentimentData(data: Omit<SentimentData, 'id'>): Promise<SentimentData> {
    const [inserted] = await db.insert(sentimentData).values(data).returning();
    return inserted;
  }

  // COT Data
  async getLatestCotData(instrumentId: number): Promise<CotData | undefined> {
    const [data] = await db
      .select()
      .from(cotData)
      .where(eq(cotData.instrumentId, instrumentId))
      .orderBy(desc(cotData.reportDate))
      .limit(1);
    return data || undefined;
  }

  async insertCotData(data: Omit<CotData, 'id'>): Promise<CotData> {
    const [inserted] = await db.insert(cotData).values(data).returning();
    return inserted;
  }

  // Trading Signals
  async getActiveSignals(): Promise<TradingSignal[]> {
    return await db
      .select()
      .from(tradingSignals)
      .where(eq(tradingSignals.isActive, true))
      .orderBy(desc(tradingSignals.timestamp));
  }

  async getSignalsByInstrument(instrumentId: number): Promise<TradingSignal[]> {
    return await db
      .select()
      .from(tradingSignals)
      .where(and(eq(tradingSignals.instrumentId, instrumentId), eq(tradingSignals.isActive, true)))
      .orderBy(desc(tradingSignals.timestamp));
  }

  async createTradingSignal(signal: Omit<TradingSignal, 'id' | 'timestamp' | 'isActive'>): Promise<TradingSignal> {
    const [created] = await db
      .insert(tradingSignals)
      .values({
        ...signal,
        timestamp: new Date(),
        isActive: true,
      })
      .returning();
    return created;
  }

  async deactivateSignal(id: number): Promise<void> {
    await db
      .update(tradingSignals)
      .set({ isActive: false })
      .where(eq(tradingSignals.id, id));
  }

  // Paper Trades
  async getActiveTrades(userId: number): Promise<PaperTrade[]> {
    return await db
      .select()
      .from(paperTrades)
      .where(and(eq(paperTrades.userId, userId), eq(paperTrades.status, 'open')))
      .orderBy(desc(paperTrades.openedAt));
  }

  async getTradeHistory(userId: number, limit: number): Promise<PaperTrade[]> {
    return await db
      .select()
      .from(paperTrades)
      .where(eq(paperTrades.userId, userId))
      .orderBy(desc(paperTrades.openedAt))
      .limit(limit);
  }

  async createPaperTrade(trade: Omit<PaperTrade, 'id' | 'openedAt'>): Promise<PaperTrade> {
    const [created] = await db
      .insert(paperTrades)
      .values({
        ...trade,
        openedAt: new Date(),
      })
      .returning();
    return created;
  }

  async updatePaperTrade(id: number, updates: Partial<PaperTrade>): Promise<PaperTrade> {
    const [updated] = await db
      .update(paperTrades)
      .set(updates)
      .where(eq(paperTrades.id, id))
      .returning();
    return updated;
  }

  // Risk Settings
  async getRiskSettings(userId: number): Promise<RiskSettings | undefined> {
    const [settings] = await db
      .select()
      .from(riskSettings)
      .where(eq(riskSettings.userId, userId));
    return settings || undefined;
  }

  async updateRiskSettings(userId: number, settings: Omit<RiskSettings, 'id' | 'userId' | 'updatedAt'>): Promise<RiskSettings> {
    const [updated] = await db
      .update(riskSettings)
      .set({
        ...settings,
        updatedAt: new Date(),
      })
      .where(eq(riskSettings.userId, userId))
      .returning();
    return updated;
  }

  // System Logs
  async insertSystemLog(log: Omit<SystemLog, 'id' | 'timestamp'>): Promise<SystemLog> {
    const [inserted] = await db
      .insert(systemLogs)
      .values({
        ...log,
        timestamp: new Date(),
      })
      .returning();
    return inserted;
  }

  async getSystemLogs(limit: number): Promise<SystemLog[]> {
    return await db
      .select()
      .from(systemLogs)
      .orderBy(desc(systemLogs.timestamp))
      .limit(limit);
  }

  // API Status
  async getApiStatuses(): Promise<ApiStatus[]> {
    return await db.select().from(apiStatus);
  }

  async updateApiStatus(serviceName: string, status: Omit<ApiStatus, 'id' | 'serviceName' | 'lastUpdate'>): Promise<ApiStatus> {
    const [updated] = await db
      .insert(apiStatus)
      .values({
        serviceName,
        ...status,
        lastUpdate: new Date(),
      })
      .onConflictDoUpdate({
        target: apiStatus.serviceName,
        set: {
          ...status,
          lastUpdate: new Date(),
        },
      })
      .returning();
    return updated;
  }

  // Analytics
  async getTradingPerformance(userId: number): Promise<{
    totalPnL: number;
    winRate: number;
    totalTrades: number;
    activeTrades: number;
  }> {
    const [totalPnLResult] = await db
      .select({
        totalPnL: sql<number>`COALESCE(SUM(CASE WHEN status != 'open' THEN pnl ELSE 0 END), 0)`,
        totalTrades: sql<number>`COUNT(CASE WHEN status != 'open' THEN 1 END)`,
        winningTrades: sql<number>`COUNT(CASE WHEN status != 'open' AND pnl > 0 THEN 1 END)`,
        activeTrades: sql<number>`COUNT(CASE WHEN status = 'open' THEN 1 END)`,
      })
      .from(paperTrades)
      .where(eq(paperTrades.userId, userId));

    const totalPnL = Number(totalPnLResult.totalPnL) || 0;
    const totalTrades = Number(totalPnLResult.totalTrades) || 0;
    const winningTrades = Number(totalPnLResult.winningTrades) || 0;
    const activeTrades = Number(totalPnLResult.activeTrades) || 0;
    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;

    return {
      totalPnL,
      winRate,
      totalTrades,
      activeTrades,
    };
  }
}

export const storage = new DatabaseStorage();
