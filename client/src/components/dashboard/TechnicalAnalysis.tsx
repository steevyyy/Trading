import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTradingData } from "@/hooks/useTradingData";

export function TechnicalAnalysis() {
  const { technicalData, isLoading } = useTradingData();

  if (isLoading) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="border-b border-slate-700">
          <CardTitle className="text-white">Technical Analysis</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-slate-700/50 rounded w-1/2"></div>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 bg-slate-700/50 rounded-lg"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getSignalColor = (signal: string) => {
    switch (signal.toLowerCase()) {
      case 'bullish':
      case 'above':
        return 'bg-green-500/20 text-green-400';
      case 'bearish':
      case 'below':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-blue-500/20 text-blue-400';
    }
  };

  const getSignalText = (value: number, type: string) => {
    if (type === 'rsi') {
      if (value < 30) return 'Oversold';
      if (value > 70) return 'Overbought';
      return 'Neutral';
    }
    if (type === 'macd') {
      return value > 0 ? 'Bullish' : 'Bearish';
    }
    return 'Neutral';
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader className="border-b border-slate-700">
        <CardTitle className="text-white">Technical Analysis</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium text-slate-300 mb-3">Key Indicators (EUR/USD)</h4>
            {technicalData ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <div className="text-xs text-slate-400 mb-1">RSI (14)</div>
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">
                      {parseFloat(technicalData.rsi || '50').toFixed(1)}
                    </span>
                    <Badge className={getSignalColor(getSignalText(parseFloat(technicalData.rsi || '50'), 'rsi'))}>
                      {getSignalText(parseFloat(technicalData.rsi || '50'), 'rsi')}
                    </Badge>
                  </div>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <div className="text-xs text-slate-400 mb-1">MACD</div>
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">
                      {parseFloat(technicalData.macd || '0').toFixed(4)}
                    </span>
                    <Badge className={getSignalColor(getSignalText(parseFloat(technicalData.macd || '0'), 'macd'))}>
                      {getSignalText(parseFloat(technicalData.macd || '0'), 'macd')}
                    </Badge>
                  </div>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <div className="text-xs text-slate-400 mb-1">MA (50)</div>
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">
                      {parseFloat(technicalData.ma50 || '0').toFixed(4)}
                    </span>
                    <Badge className="bg-green-500/20 text-green-400">
                      Above
                    </Badge>
                  </div>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <div className="text-xs text-slate-400 mb-1">Bollinger</div>
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">Mid</span>
                    <Badge className="bg-blue-500/20 text-blue-400">
                      Range
                    </Badge>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-slate-400">No technical data available</p>
              </div>
            )}
          </div>

          {technicalData && (
            <div>
              <h4 className="text-sm font-medium text-slate-300 mb-3">Support & Resistance</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-red-400 text-sm">Resistance 2</span>
                  <span className="text-white">
                    {(parseFloat(technicalData.resistanceLevel || '0') * 1.002).toFixed(4)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-red-400 text-sm">Resistance 1</span>
                  <span className="text-white">
                    {parseFloat(technicalData.resistanceLevel || '0').toFixed(4)}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-b border-slate-600 py-2">
                  <span className="text-primary text-sm font-medium">Current Price</span>
                  <span className="text-white font-bold">
                    {((parseFloat(technicalData.resistanceLevel || '0') + parseFloat(technicalData.supportLevel || '0')) / 2).toFixed(4)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-green-400 text-sm">Support 1</span>
                  <span className="text-white">
                    {parseFloat(technicalData.supportLevel || '0').toFixed(4)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-green-400 text-sm">Support 2</span>
                  <span className="text-white">
                    {(parseFloat(technicalData.supportLevel || '0') * 0.998).toFixed(4)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
