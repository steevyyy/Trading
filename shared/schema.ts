import { pgTable, text, serial, integer, boolean, decimal, timestamp, jsonb, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Market instruments
export const instruments = pgTable("instruments", {
  id: serial("id").primaryKey(),
  symbol: varchar("symbol", { length: 20 }).notNull().unique(),
  name: text("name").notNull(),
  type: varchar("type", { length: 20 }).notNull(), // 'forex', 'metal'
  exchange: text("exchange"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Market data
export const marketData = pgTable("market_data", {
  id: serial("id").primaryKey(),
  instrumentId: integer("instrument_id").notNull(),
  timestamp: timestamp("timestamp").notNull(),
  open: decimal("open", { precision: 10, scale: 5 }).notNull(),
  high: decimal("high", { precision: 10, scale: 5 }).notNull(),
  low: decimal("low", { precision: 10, scale: 5 }).notNull(),
  close: decimal("close", { precision: 10, scale: 5 }).notNull(),
  volume: decimal("volume", { precision: 15, scale: 2 }),
  timeframe: varchar("timeframe", { length: 10 }).notNull(), // '1m', '5m', '15m', '1h', '4h', '1d'
});

// Technical indicators
export const technicalIndicators = pgTable("technical_indicators", {
  id: serial("id").primaryKey(),
  instrumentId: integer("instrument_id").notNull(),
  timestamp: timestamp("timestamp").notNull(),
  timeframe: varchar("timeframe", { length: 10 }).notNull(),
  rsi: decimal("rsi", { precision: 5, scale: 2 }),
  macd: decimal("macd", { precision: 10, scale: 6 }),
  macdSignal: decimal("macd_signal", { precision: 10, scale: 6 }),
  ma50: decimal("ma_50", { precision: 10, scale: 5 }),
  ma200: decimal("ma_200", { precision: 10, scale: 5 }),
  bollingerUpper: decimal("bollinger_upper", { precision: 10, scale: 5 }),
  bollingerLower: decimal("bollinger_lower", { precision: 10, scale: 5 }),
  atr: decimal("atr", { precision: 10, scale: 6 }),
  supportLevel: decimal("support_level", { precision: 10, scale: 5 }),
  resistanceLevel: decimal("resistance_level", { precision: 10, scale: 5 }),
});

// Fundamental data
export const fundamentalData = pgTable("fundamental_data", {
  id: serial("id").primaryKey(),
  timestamp: timestamp("timestamp").notNull(),
  event: text("event").notNull(),
  currency: varchar("currency", { length: 3 }),
  impact: varchar("impact", { length: 10 }), // 'high', 'medium', 'low'
  forecast: text("forecast"),
  actual: text("actual"),
  previous: text("previous"),
  score: decimal("score", { precision: 5, scale: 2 }), // -100 to +100
});

// Sentiment data
export const sentimentData = pgTable("sentiment_data", {
  id: serial("id").primaryKey(),
  timestamp: timestamp("timestamp").notNull(),
  source: varchar("source", { length: 20 }).notNull(), // 'twitter', 'reddit', 'news'
  instrumentId: integer("instrument_id"),
  sentiment: decimal("sentiment", { precision: 5, scale: 2 }).notNull(), // -100 to +100
  confidence: decimal("confidence", { precision: 5, scale: 2 }), // 0 to 100
  content: text("content"),
  url: text("url"),
});

// COT (Commitment of Traders) data
export const cotData = pgTable("cot_data", {
  id: serial("id").primaryKey(),
  instrumentId: integer("instrument_id").notNull(),
  reportDate: timestamp("report_date").notNull(),
  commercialLong: decimal("commercial_long", { precision: 15, scale: 0 }),
  commercialShort: decimal("commercial_short", { precision: 15, scale: 0 }),
  nonCommercialLong: decimal("non_commercial_long", { precision: 15, scale: 0 }),
  nonCommercialShort: decimal("non_commercial_short", { precision: 15, scale: 0 }),
  netNonCommercial: decimal("net_non_commercial", { precision: 15, scale: 0 }),
  weeklyChange: decimal("weekly_change", { precision: 15, scale: 0 }),
});

// Trading signals
export const tradingSignals = pgTable("trading_signals", {
  id: serial("id").primaryKey(),
  instrumentId: integer("instrument_id").notNull(),
  timestamp: timestamp("timestamp").notNull(),
  signalType: varchar("signal_type", { length: 10 }).notNull(), // 'buy', 'sell', 'hold'
  confidence: decimal("confidence", { precision: 5, scale: 2 }).notNull(), // 0 to 100
  entryPrice: decimal("entry_price", { precision: 10, scale: 5 }),
  targetPrice: decimal("target_price", { precision: 10, scale: 5 }),
  stopLoss: decimal("stop_loss", { precision: 10, scale: 5 }),
  timeframe: varchar("timeframe", { length: 10 }).notNull(),
  technicalScore: decimal("technical_score", { precision: 5, scale: 2 }),
  fundamentalScore: decimal("fundamental_score", { precision: 5, scale: 2 }),
  sentimentScore: decimal("sentiment_score", { precision: 5, scale: 2 }),
  cotScore: decimal("cot_score", { precision: 5, scale: 2 }),
  combinedScore: decimal("combined_score", { precision: 5, scale: 2 }),
  isActive: boolean("is_active").default(true),
});

// Paper trades
export const paperTrades = pgTable("paper_trades", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  signalId: integer("signal_id"),
  instrumentId: integer("instrument_id").notNull(),
  tradeType: varchar("trade_type", { length: 10 }).notNull(), // 'buy', 'sell'
  positionSize: decimal("position_size", { precision: 10, scale: 4 }).notNull(),
  entryPrice: decimal("entry_price", { precision: 10, scale: 5 }).notNull(),
  exitPrice: decimal("exit_price", { precision: 10, scale: 5 }),
  stopLoss: decimal("stop_loss", { precision: 10, scale: 5 }),
  takeProfit: decimal("take_profit", { precision: 10, scale: 5 }),
  pnl: decimal("pnl", { precision: 10, scale: 2 }),
  status: varchar("status", { length: 20 }).notNull(), // 'open', 'closed', 'stop_loss', 'take_profit'
  openedAt: timestamp("opened_at").notNull(),
  closedAt: timestamp("closed_at"),
});

// Risk settings
export const riskSettings = pgTable("risk_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  maxDailyRisk: decimal("max_daily_risk", { precision: 10, scale: 2 }).notNull(),
  maxPositionSize: decimal("max_position_size", { precision: 5, scale: 4 }).notNull(),
  maxDrawdown: decimal("max_drawdown", { precision: 5, scale: 2 }).notNull(),
  autoStopLoss: boolean("auto_stop_loss").default(true),
  riskScaling: boolean("risk_scaling").default(true),
  weekendTrading: boolean("weekend_trading").default(false),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// System logs
export const systemLogs = pgTable("system_logs", {
  id: serial("id").primaryKey(),
  timestamp: timestamp("timestamp").defaultNow(),
  level: varchar("level", { length: 10 }).notNull(), // 'info', 'warning', 'error'
  source: varchar("source", { length: 50 }).notNull(),
  message: text("message").notNull(),
  metadata: jsonb("metadata"),
});

// API status
export const apiStatus = pgTable("api_status", {
  id: serial("id").primaryKey(),
  serviceName: varchar("service_name", { length: 50 }).notNull().unique(),
  status: varchar("status", { length: 20 }).notNull(), // 'active', 'error', 'rate_limited'
  lastUpdate: timestamp("last_update").defaultNow(),
  errorMessage: text("error_message"),
  requestCount: integer("request_count").default(0),
  rateLimitRemaining: integer("rate_limit_remaining"),
});

// Relations
export const instrumentsRelations = relations(instruments, ({ many }) => ({
  marketData: many(marketData),
  technicalIndicators: many(technicalIndicators),
  sentimentData: many(sentimentData),
  cotData: many(cotData),
  tradingSignals: many(tradingSignals),
  paperTrades: many(paperTrades),
}));

export const marketDataRelations = relations(marketData, ({ one }) => ({
  instrument: one(instruments, {
    fields: [marketData.instrumentId],
    references: [instruments.id],
  }),
}));

export const technicalIndicatorsRelations = relations(technicalIndicators, ({ one }) => ({
  instrument: one(instruments, {
    fields: [technicalIndicators.instrumentId],
    references: [instruments.id],
  }),
}));

export const sentimentDataRelations = relations(sentimentData, ({ one }) => ({
  instrument: one(instruments, {
    fields: [sentimentData.instrumentId],
    references: [instruments.id],
  }),
}));

export const cotDataRelations = relations(cotData, ({ one }) => ({
  instrument: one(instruments, {
    fields: [cotData.instrumentId],
    references: [instruments.id],
  }),
}));

export const tradingSignalsRelations = relations(tradingSignals, ({ one, many }) => ({
  instrument: one(instruments, {
    fields: [tradingSignals.instrumentId],
    references: [instruments.id],
  }),
  paperTrades: many(paperTrades),
}));

export const paperTradesRelations = relations(paperTrades, ({ one }) => ({
  user: one(users, {
    fields: [paperTrades.userId],
    references: [users.id],
  }),
  instrument: one(instruments, {
    fields: [paperTrades.instrumentId],
    references: [instruments.id],
  }),
  signal: one(tradingSignals, {
    fields: [paperTrades.signalId],
    references: [tradingSignals.id],
  }),
}));

export const riskSettingsRelations = relations(riskSettings, ({ one }) => ({
  user: one(users, {
    fields: [riskSettings.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertInstrumentSchema = createInsertSchema(instruments).omit({
  id: true,
  createdAt: true,
});

export const insertMarketDataSchema = createInsertSchema(marketData).omit({
  id: true,
});

export const insertTechnicalIndicatorSchema = createInsertSchema(technicalIndicators).omit({
  id: true,
});

export const insertFundamentalDataSchema = createInsertSchema(fundamentalData).omit({
  id: true,
});

export const insertSentimentDataSchema = createInsertSchema(sentimentData).omit({
  id: true,
});

export const insertCotDataSchema = createInsertSchema(cotData).omit({
  id: true,
});

export const insertTradingSignalSchema = createInsertSchema(tradingSignals).omit({
  id: true,
  timestamp: true,
  isActive: true,
});

export const insertPaperTradeSchema = createInsertSchema(paperTrades).omit({
  id: true,
  openedAt: true,
});

export const insertRiskSettingsSchema = createInsertSchema(riskSettings).omit({
  id: true,
  updatedAt: true,
});

export const insertSystemLogSchema = createInsertSchema(systemLogs).omit({
  id: true,
  timestamp: true,
});

export const insertApiStatusSchema = createInsertSchema(apiStatus).omit({
  id: true,
  lastUpdate: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Instrument = typeof instruments.$inferSelect;
export type MarketData = typeof marketData.$inferSelect;
export type TechnicalIndicator = typeof technicalIndicators.$inferSelect;
export type FundamentalData = typeof fundamentalData.$inferSelect;
export type SentimentData = typeof sentimentData.$inferSelect;
export type CotData = typeof cotData.$inferSelect;
export type TradingSignal = typeof tradingSignals.$inferSelect;
export type PaperTrade = typeof paperTrades.$inferSelect;
export type RiskSettings = typeof riskSettings.$inferSelect;
export type SystemLog = typeof systemLogs.$inferSelect;
export type ApiStatus = typeof apiStatus.$inferSelect;
