import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTradingData } from "@/hooks/useTradingData";

export function MarketWatchlist() {
  const { marketData, isLoading } = useTradingData();

  if (isLoading) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="border-b border-slate-700">
          <CardTitle className="text-white">Market Watchlist</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-slate-700/50 rounded-lg"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getSymbolColor = (symbol: string) => {
    if (symbol.includes('EUR')) return 'text-primary';
    if (symbol.includes('XAU') || symbol.includes('GOLD')) return 'text-amber-500';
    if (symbol.includes('XAG') || symbol.includes('SILVER')) return 'text-slate-400';
    if (symbol.includes('GBP')) return 'text-blue-500';
    return 'text-slate-400';
  };

  const getExchangeLabel = (type: string) => {
    return type === 'forex' ? 'Forex' : 'Metals';
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader className="border-b border-slate-700">
        <CardTitle className="text-white">Market Watchlist</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {marketData.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-400">No market data available</p>
            </div>
          ) : (
            marketData.map((item) => (
              <div key={item.instrument.id} className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className={`text-xs font-bold ${getSymbolColor(item.instrument.symbol)}`}>
                      {item.instrument.symbol.substring(0, 3)}
                    </span>
                  </div>
                  <div>
                    <div className="text-white font-medium">{item.instrument.symbol}</div>
                    <div className="text-xs text-slate-400">{getExchangeLabel(item.instrument.type)}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-medium">
                    {item.data ? parseFloat(item.data.close).toFixed(item.instrument.type === 'forex' ? 4 : 2) : 'N/A'}
                  </div>
                  {item.data && (
                    <div className="text-sm text-green-400">
                      +{((parseFloat(item.data.close) - parseFloat(item.data.open)) * 
                        (item.instrument.type === 'forex' ? 10000 : 1)).toFixed(item.instrument.type === 'forex' ? 1 : 2)}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
