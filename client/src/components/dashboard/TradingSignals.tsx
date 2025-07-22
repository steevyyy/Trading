import { ArrowUp, ArrowDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTradingData } from "@/hooks/useTradingData";

export function TradingSignals() {
  const { signals, isLoading } = useTradingData();

  if (isLoading) {
    return (
      <div className="lg:col-span-2">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="border-b border-slate-700">
            <CardTitle className="text-white">Active Trading Signals</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-slate-700/50 rounded-lg"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="lg:col-span-2">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="border-b border-slate-700 flex flex-row items-center justify-between">
          <CardTitle className="text-white">Active Trading Signals</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-400">Live</span>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {signals.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-400">No active signals</p>
              </div>
            ) : (
              signals.slice(0, 5).map((signal) => (
                <div key={signal.id} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      signal.signalType === 'buy' ? 'bg-green-500/10' : 'bg-red-500/10'
                    }`}>
                      {signal.signalType === 'buy' ? (
                        <ArrowUp className="text-green-500 h-5 w-5" />
                      ) : (
                        <ArrowDown className="text-red-500 h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-white font-medium">
                          {signal.instrument?.symbol || 'Unknown'}
                        </span>
                        <Badge variant={signal.signalType === 'buy' ? 'default' : 'destructive'} className="text-xs">
                          {signal.signalType.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-slate-400">
                          Entry: {parseFloat(signal.entryPrice || '0').toFixed(5)}
                        </span>
                        <span className="text-sm text-slate-400">
                          Target: {parseFloat(signal.targetPrice || '0').toFixed(5)}
                        </span>
                        <span className="text-sm text-slate-400">
                          Stop: {parseFloat(signal.stopLoss || '0').toFixed(5)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-medium">
                      {parseFloat(signal.confidence || '0').toFixed(0)}%
                    </div>
                    <div className="text-xs text-slate-400">
                      {signal.timeframe} • {new Date(signal.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
