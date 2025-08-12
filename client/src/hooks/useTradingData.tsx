import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

// Define types for the data returned by the API
interface Overview {
  performance: any;
  activeSignalsCount: number;
  dataSourcesOnline: number;
  totalDataSources: number;
}

interface Signal {
  id: number;
  instrument: { symbol: string };
  signalType: 'buy' | 'sell';
  confidence: number;
  timestamp: string;
  entryPrice: number;
  targetPrice: number;
  stopLoss: number;
  timeframe: string;
}

interface MarketDataItem {
  instrument: { id: number; symbol: string; type: string };
  data: { open: string; close: string } | null;
}

interface TechnicalData {
  rsi: number;
  macd: number;
  ma50: number;
  resistanceLevel: number;
  supportLevel: number;
}

interface SentimentData {
  overall: number;
  bySource: { source: string, average: number }[];
  recent: any[];
}

interface RiskData {
  dailyRiskUsed: number;
  maxDailyRisk: number;
  currentDrawdown: number;
  activeTrades: number;
}

interface Trade {
  id: number;
  instrument: { symbol: string };
  tradeType: 'buy' | 'sell';
  entryPrice: string | number;
  exitPrice?: string | number | null;
  pnl?: string | number | null;
  status: string;
  openedAt: string;
  closedAt?: string | null;
}

interface SystemStatus {
  apiStatuses: { serviceName: string, status: string }[];
  systemHealth: { cpu: number, memory: number, uptime: string };
  recentLogs: { level: string, message: string, timestamp: string }[];
}


export function useTradingData() {
  const { data: overview, isLoading: overviewLoading } = useQuery<Overview>({
    queryKey: ["/api/dashboard/overview"],
    queryFn: () => apiRequest("GET", "/api/dashboard/overview").then(res => res.json()),
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: signals, isLoading: signalsLoading } = useQuery<Signal[]>({
    queryKey: ["/api/trading-signals"],
    queryFn: () => apiRequest("GET", "/api/trading-signals").then(res => res.json()),
    refetchInterval: 15000, // Refresh every 15 seconds
  });

  const { data: marketData, isLoading: marketLoading } = useQuery<MarketDataItem[]>({
    queryKey: ["/api/market-data"],
    queryFn: () => apiRequest("GET", "/api/market-data").then(res => res.json()),
    refetchInterval: 60000, // Refresh every minute
  });

  const { data: technicalData, isLoading: technicalLoading } = useQuery<TechnicalData>({
    queryKey: ["/api/technical-analysis/1"], // EUR/USD instrument ID
    queryFn: () => apiRequest("GET", "/api/technical-analysis/1").then(res => res.json()),
    refetchInterval: 300000, // Refresh every 5 minutes
  });

  const { data: sentimentData, isLoading: sentimentLoading } = useQuery<SentimentData>({
    queryKey: ["/api/sentiment-analysis"],
    queryFn: () => apiRequest("GET", "/api/sentiment-analysis").then(res => res.json()),
    refetchInterval: 900000, // Refresh every 15 minutes
  });

  const { data: riskData, isLoading: riskLoading } = useQuery<RiskData>({
    queryKey: ["/api/risk-settings/1"], // Default user ID
    queryFn: () => apiRequest("GET", "/api/risk-settings/1").then(res => res.json()),
    refetchInterval: 120000, // Refresh every 2 minutes
  });

  const { data: recentTrades, isLoading: tradesLoading } = useQuery<Trade[]>({
    queryKey: ["/api/paper-trades/1"],
    queryFn: () => apiRequest("GET", "/api/paper-trades/1").then(res => res.json()),
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: systemStatus, isLoading: statusLoading } = useQuery<SystemStatus>({
    queryKey: ["/api/system-status"],
    queryFn: () => apiRequest("GET", "/api/system-status").then(res => res.json()),
    refetchInterval: 60000, // Refresh every minute
  });

  return {
    overview,
    signals: signals || [],
    marketData: marketData || [],
    technicalData,
    sentimentData,
    riskData,
    recentTrades: recentTrades || [],
    systemStatus,
    isLoading: overviewLoading || signalsLoading || marketLoading || 
               technicalLoading || sentimentLoading || riskLoading || 
               tradesLoading || statusLoading,
  };
}
