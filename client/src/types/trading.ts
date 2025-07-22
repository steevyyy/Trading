export interface Instrument {
  id: number;
  symbol: string;
  name: string;
  type: 'forex' | 'metal';
  exchange: string;
  isActive: boolean;
  createdAt: string;
}

export interface MarketData {
  id: number;
  instrumentId: number;
  timestamp: string;
  open: string;
  high: string;
  low: string;
  close: string;
  volume?: string;
  timeframe: string;
}

export interface TechnicalIndicator {
  id: number;
  instrumentId: number;
  timestamp: string;
  timeframe: string;
  rsi?: string;
  macd?: string;
  macdSignal?: string;
  ma50?: string;
  ma200?: string;
  bollingerUpper?: string;
  bollingerLower?: string;
  atr?: string;
  supportLevel?: string;
  resistanceLevel?: string;
}

export interface TradingSignal {
  id: number;
  instrumentId: number;
  timestamp: string;
  signalType: 'buy' | 'sell' | 'hold';
  confidence: string;
  entryPrice?: string;
  targetPrice?: string;
  stopLoss?: string;
  timeframe: string;
  technicalScore?: string;
  fundamentalScore?: string;
  sentimentScore?: string;
  cotScore?: string;
  combinedScore?: string;
  isActive: boolean;
  instrument?: Instrument;
}

export interface PaperTrade {
  id: number;
  userId: number;
  signalId?: number;
  instrumentId: number;
  tradeType: 'buy' | 'sell';
  positionSize: string;
  entryPrice: string;
  exitPrice?: string;
  stopLoss?: string;
  takeProfit?: string;
  pnl?: string;
  status: 'open' | 'closed' | 'stop_loss' | 'take_profit';
  openedAt: string;
  closedAt?: string;
  instrument?: Instrument;
}

export interface SentimentData {
  id: number;
  timestamp: string;
  source: 'twitter' | 'reddit' | 'news';
  instrumentId?: number;
  sentiment: string;
  confidence?: string;
  content?: string;
  url?: string;
}

export interface ApiStatus {
  id: number;
  serviceName: string;
  status: 'active' | 'error' | 'rate_limited';
  lastUpdate: string;
  errorMessage?: string;
  requestCount: number;
  rateLimitRemaining?: number;
}

export interface SystemLog {
  id: number;
  timestamp: string;
  level: 'info' | 'warning' | 'error';
  source: string;
  message: string;
  metadata?: any;
}

export interface RiskSettings {
  id: number;
  userId: number;
  maxDailyRisk: string;
  maxPositionSize: string;
  maxDrawdown: string;
  autoStopLoss: boolean;
  riskScaling: boolean;
  weekendTrading: boolean;
  updatedAt: string;
}

export interface DashboardOverview {
  performance: {
    totalPnL: number;
    winRate: number;
    totalTrades: number;
    activeTrades: number;
  };
  activeSignalsCount: number;
  dataSourcesOnline: number;
  totalDataSources: number;
}

export interface MarketWatchItem {
  instrument: Instrument;
  data?: MarketData;
}

export interface SentimentAnalysis {
  overall: number;
  bySource: Record<string, number>;
  trending: string[];
}

export interface SystemHealth {
  cpu: number;
  memory: number;
  uptime: string;
}

export interface SystemStatusResponse {
  apiStatuses: ApiStatus[];
  recentLogs: SystemLog[];
  systemHealth: SystemHealth;
}
