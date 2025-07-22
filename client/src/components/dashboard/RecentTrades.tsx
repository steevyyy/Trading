import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTradingData } from "@/hooks/useTradingData";

export function RecentTrades() {
  const { recentTrades, isLoading } = useTradingData();

  if (isLoading) {
    return (
      <div className="lg:col-span-2">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="border-b border-slate-700">
            <CardTitle className="text-white">Recent Trades (Paper)</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-slate-700/50 rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleExportTrades = () => {
    // TODO: Implement CSV export functionality
    console.log('Exporting trades...');
  };

  return (
    <div className="lg:col-span-2">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="border-b border-slate-700 flex flex-row items-center justify-between">
          <CardTitle className="text-white">Recent Trades (Paper)</CardTitle>
          <Button 
            onClick={handleExportTrades}
            className="bg-primary hover:bg-primary/90"
          >
            Export History
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            {recentTrades.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-400">No trades available</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs text-slate-400 border-b border-slate-700">
                    <th className="pb-3">Pair</th>
                    <th className="pb-3">Type</th>
                    <th className="pb-3">Entry</th>
                    <th className="pb-3">Exit</th>
                    <th className="pb-3">P&L</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {recentTrades.slice(0, 10).map((trade) => (
                    <tr key={trade.id} className="border-b border-slate-700/50">
                      <td className="py-3">
                        <div className="font-medium text-white">
                          {trade.instrument?.symbol || 'Unknown'}
                        </div>
                      </td>
                      <td className="py-3">
                        <Badge variant={trade.tradeType === 'buy' ? 'default' : 'destructive'} className="text-xs">
                          {trade.tradeType.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-3 text-slate-300">
                        {parseFloat(trade.entryPrice).toFixed(5)}
                      </td>
                      <td className="py-3 text-slate-300">
                        {trade.exitPrice ? parseFloat(trade.exitPrice).toFixed(5) : '-'}
                      </td>
                      <td className="py-3">
                        {trade.pnl ? (
                          <span className={`font-medium ${parseFloat(trade.pnl) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {parseFloat(trade.pnl) >= 0 ? '+' : ''}${parseFloat(trade.pnl).toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="py-3 text-slate-400">
                        {new Date(trade.openedAt).toLocaleDateString()} {new Date(trade.openedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </td>
                      <td className="py-3">
                        <Badge 
                          variant={trade.status === 'open' ? 'default' : 
                                 trade.status === 'stop_loss' ? 'destructive' : 'secondary'}
                          className="text-xs"
                        >
                          {trade.status === 'stop_loss' ? 'Stop Loss' : 
                           trade.status === 'take_profit' ? 'Take Profit' :
                           trade.status.charAt(0).toUpperCase() + trade.status.slice(1)}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
