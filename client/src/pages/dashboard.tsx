import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { OverviewCards } from "@/components/dashboard/OverviewCards";
import { TradingSignals } from "@/components/dashboard/TradingSignals";
import { MarketWatchlist } from "@/components/dashboard/MarketWatchlist";
import { TechnicalAnalysis } from "@/components/dashboard/TechnicalAnalysis";
import { SentimentAnalysis } from "@/components/dashboard/SentimentAnalysis";
import { RiskManagement } from "@/components/dashboard/RiskManagement";
import { RecentTrades } from "@/components/dashboard/RecentTrades";
import { SystemStatus } from "@/components/dashboard/SystemStatus";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useTradingData } from "@/hooks/useTradingData";

export default function Dashboard() {
  const { isConnected } = useWebSocket();
  const { overview } = useTradingData();

  return (
    <div className="min-h-screen flex bg-slate-900">
      <Sidebar />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header isConnected={isConnected} />
        
        <div className="flex-1 overflow-auto p-6 space-y-6">
          <OverviewCards data={overview} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <TradingSignals />
            <MarketWatchlist />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TechnicalAnalysis />
            <SentimentAnalysis />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <RiskManagement />
            <RecentTrades />
          </div>

          <SystemStatus />
        </div>
      </main>
    </div>
  );
}
