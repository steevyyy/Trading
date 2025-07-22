import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { useTradingData } from "@/hooks/useTradingData";

export function RiskManagement() {
  const { riskData, isLoading } = useTradingData();

  if (isLoading) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="border-b border-slate-700">
          <CardTitle className="text-white">Risk Management</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-16 bg-slate-700/50 rounded-lg"></div>
            <div className="grid grid-cols-2 gap-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-12 bg-slate-700/50 rounded-lg"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const dailyRiskUsed = riskData?.dailyRiskUsed || 0;
  const maxDailyRisk = riskData?.maxDailyRisk || 500;
  const riskPercentage = (dailyRiskUsed / maxDailyRisk) * 100;

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader className="border-b border-slate-700">
        <CardTitle className="text-white">Risk Management</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="bg-slate-700/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-300">Daily Risk Limit</span>
              <span className="text-white font-medium">${maxDailyRisk}</span>
            </div>
            <Progress value={riskPercentage} className="h-2" />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>${dailyRiskUsed.toFixed(2)} used</span>
              <span>{riskPercentage.toFixed(0)}%</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-700/50 rounded-lg p-3">
              <div className="text-xs text-slate-400 mb-1">Max Drawdown</div>
              <div className="text-white font-medium">{(riskData?.currentDrawdown || 0).toFixed(1)}%</div>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-3">
              <div className="text-xs text-slate-400 mb-1">Active Trades</div>
              <div className="text-white font-medium">{riskData?.activeTrades || 0}</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Auto Stop Loss</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Risk Scaling</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Weekend Trading</span>
              <Switch />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
