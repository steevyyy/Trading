import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useTradingData } from "@/hooks/useTradingData";

export function SentimentAnalysis() {
  const { sentimentData, isLoading } = useTradingData();

  if (isLoading) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="border-b border-slate-700">
          <CardTitle className="text-white">Sentiment & Positioning</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-slate-700/50 rounded w-1/2"></div>
            <div className="h-2 bg-slate-700/50 rounded"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-8 bg-slate-700/50 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const overallSentiment = sentimentData?.overall || 0;
  const sentimentPercentage = Math.max(0, Math.min(100, (overallSentiment + 100) / 2));

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader className="border-b border-slate-700">
        <CardTitle className="text-white">Sentiment & Positioning</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-slate-300">Market Sentiment Score</h4>
            <span className={`text-lg font-bold ${overallSentiment >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {overallSentiment >= 0 ? '+' : ''}{overallSentiment.toFixed(0)}
            </span>
          </div>
          <Progress value={sentimentPercentage} className="h-2" />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>Bearish</span>
            <span>Bullish</span>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-slate-300 mb-3">Sentiment Sources</h4>
          <div className="space-y-3">
            {sentimentData?.bySource ? (
              Object.entries(sentimentData.bySource).map(([source, score]) => {
                const percentage = Math.max(0, Math.min(100, (score + 100) / 2));
                const getSourceIcon = (source: string) => {
                  switch (source) {
                    case 'twitter': return '𝕏';
                    case 'reddit': return '🔴';
                    case 'news': return '📰';
                    default: return '📊';
                  }
                };

                return (
                  <div key={source} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">{getSourceIcon(source)}</span>
                      <span className="text-sm text-white capitalize">{source}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`font-medium ${score >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {score >= 0 ? '+' : ''}{score.toFixed(0)}
                      </span>
                      <div className="w-16 bg-slate-700 rounded-full h-1">
                        <div 
                          className={`h-1 rounded-full ${score >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-4">
                <p className="text-slate-400">No sentiment data available</p>
              </div>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-slate-300 mb-3">COT Positioning (Large Speculators)</h4>
          <div className="space-y-3">
            <div className="bg-slate-700/50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white">EUR Futures</span>
                <span className="text-green-400 font-medium">+12.3K</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Net Long</span>
                <span className="text-slate-400">Weekly Change: <span className="text-green-400">+2.1K</span></span>
              </div>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white">Gold Futures</span>
                <span className="text-red-400 font-medium">-8.7K</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Net Short</span>
                <span className="text-slate-400">Weekly Change: <span className="text-red-400">-1.4K</span></span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
