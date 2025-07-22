import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export function useTradingData() {
  const { data: overview, isLoading: overviewLoading } = useQuery({
    queryKey: ["/api/dashboard/overview"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: signals, isLoading: signalsLoading } = useQuery({
    queryKey: ["/api/trading-signals"],
    refetchInterval: 15000, // Refresh every 15 seconds
  });

  const { data: marketData, isLoading: marketLoading } = useQuery({
    queryKey: ["/api/market-data"],
    refetchInterval: 60000, // Refresh every minute
  });

  const { data: technicalData, isLoading: technicalLoading } = useQuery({
    queryKey: ["/api/technical-analysis/1"], // EUR/USD instrument ID
    refetchInterval: 300000, // Refresh every 5 minutes
  });

  const { data: sentimentData, isLoading: sentimentLoading } = useQuery({
    queryKey: ["/api/sentiment-analysis"],
    refetchInterval: 900000, // Refresh every 15 minutes
  });

  const { data: riskData, isLoading: riskLoading } = useQuery({
    queryKey: ["/api/risk-settings/1"], // Default user ID
    refetchInterval: 120000, // Refresh every 2 minutes
  });

  const { data: recentTrades, isLoading: tradesLoading } = useQuery({
    queryKey: ["/api/paper-trades/1"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: systemStatus, isLoading: statusLoading } = useQuery({
    queryKey: ["/api/system-status"],
    refetchInterval: 60000, // Refresh every minute
  });

  return {
    overview: overview || {},
    signals: signals || [],
    marketData: marketData || [],
    technicalData: technicalData || null,
    sentimentData: sentimentData || null,
    riskData: riskData || null,
    recentTrades: recentTrades || [],
    systemStatus: systemStatus || null,
    isLoading: overviewLoading || signalsLoading || marketLoading || 
               technicalLoading || sentimentLoading || riskLoading || 
               tradesLoading || statusLoading,
  };
}
