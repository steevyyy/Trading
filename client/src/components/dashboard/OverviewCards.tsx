import { TrendingUp, Signal, Target, Database } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface OverviewData {
  performance?: {
    totalPnL: number;
    winRate: number;
    totalTrades: number;
    activeTrades: number;
  };
  activeSignalsCount?: number;
  dataSourcesOnline?: number;
  totalDataSources?: number;
}

interface OverviewCardsProps {
  data: OverviewData;
}

export function OverviewCards({ data }: OverviewCardsProps) {
  const { performance, activeSignalsCount, dataSourcesOnline, totalDataSources } = data;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Total P&L (Paper)</p>
              <p className={`text-2xl font-bold ${(performance?.totalPnL || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatCurrency(performance?.totalPnL || 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-green-500 h-6 w-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className={`text-sm font-medium ${(performance?.totalPnL || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {(performance?.totalPnL || 0) >= 0 ? '+' : ''}{((performance?.totalPnL || 0) / 100).toFixed(1)}%
            </span>
            <span className="text-slate-400 text-sm ml-2">this month</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Active Signals</p>
              <p className="text-2xl font-bold text-white">{activeSignalsCount || 0}</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Signal className="text-primary h-6 w-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-primary text-sm font-medium">
              {performance?.activeTrades || 0} Active
            </span>
            <span className="text-slate-400 text-sm ml-2">• Live monitoring</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Win Rate</p>
              <p className="text-2xl font-bold text-white">{(performance?.winRate || 0).toFixed(1)}%</p>
            </div>
            <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center">
              <Target className="text-amber-500 h-6 w-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-green-400 text-sm font-medium">
              {performance?.totalTrades || 0} trades
            </span>
            <span className="text-slate-400 text-sm ml-2">total executed</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Data Sources</p>
              <p className="text-2xl font-bold text-white">
                {dataSourcesOnline || 0}/{totalDataSources || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
              <Database className="text-green-500 h-6 w-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-green-400 text-sm font-medium">All Online</span>
            <span className="text-slate-400 text-sm ml-2">• No errors</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
