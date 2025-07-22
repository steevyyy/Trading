import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import { ArrowLeft, Signal, TrendingUp, TrendingDown, Target, Shield } from "lucide-react";
import { format } from "date-fns";

export default function TradingSignalsPage() {
  const { data: signals, isLoading } = useQuery({
    queryKey: ['/api/trading-signals'],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-800 rounded w-64 mb-6"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-slate-800 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getSignalColor = (signalType: string) => {
    switch (signalType?.toLowerCase()) {
      case 'buy': return 'text-green-400';
      case 'sell': return 'text-red-400';
      default: return 'text-yellow-400';
    }
  };

  const getSignalBadgeColor = (signalType: string) => {
    switch (signalType?.toLowerCase()) {
      case 'buy': return 'bg-green-500';
      case 'sell': return 'bg-red-500';
      default: return 'bg-yellow-500';
    }
  };

  const getSignalIcon = (signalType: string) => {
    switch (signalType?.toLowerCase()) {
      case 'buy': return <TrendingUp className="h-4 w-4" />;
      case 'sell': return <TrendingDown className="h-4 w-4" />;
      default: return <Signal className="h-4 w-4" />;
    }
  };

  const getConfidenceColor = (confidence: string) => {
    const conf = parseFloat(confidence || '0');
    if (conf >= 80) return 'text-green-400';
    if (conf >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/">
              <button className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors">
                <ArrowLeft className="h-5 w-5" />
                Back to Dashboard
              </button>
            </Link>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Trading Signals
          </h1>
          <p className="text-slate-400 text-lg mt-2">
            AI-generated trading signals based on multi-factor analysis
          </p>
        </div>

        {signals && signals.length > 0 ? (
          <div className="space-y-6">
            {/* Active Signals */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Signal className="h-5 w-5" />
                  Active Trading Signals ({signals.length})
                </CardTitle>
                <CardDescription>
                  Current trading opportunities identified by the AI system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {signals.map((signal: any) => (
                    <div key={signal.id} className="border border-slate-700 rounded-lg p-4">
                      {/* Signal Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`${getSignalColor(signal.signalType)}`}>
                            {getSignalIcon(signal.signalType)}
                          </div>
                          <div>
                            <h3 className="font-bold text-lg">
                              Instrument #{signal.instrumentId}
                            </h3>
                            <Badge className={getSignalBadgeColor(signal.signalType)}>
                              {signal.signalType?.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-slate-400">Generated</div>
                          <div className="text-sm">
                            {format(new Date(signal.timestamp), 'MMM dd, HH:mm')}
                          </div>
                        </div>
                      </div>

                      {/* Confidence Score */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Confidence Score</span>
                          <span className={`font-bold ${getConfidenceColor(signal.confidence)}`}>
                            {parseFloat(signal.confidence || '0').toFixed(1)}%
                          </span>
                        </div>
                        <Progress 
                          value={parseFloat(signal.confidence || '0')} 
                          className="h-2" 
                        />
                      </div>

                      {/* Price Levels */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="p-3 bg-slate-700 rounded">
                          <div className="text-sm text-slate-400 mb-1">Entry Price</div>
                          <div className="font-bold text-lg">
                            {signal.entryPrice ? parseFloat(signal.entryPrice).toFixed(5) : 'N/A'}
                          </div>
                        </div>
                        <div className="p-3 bg-slate-700 rounded">
                          <div className="text-sm text-slate-400 mb-1 flex items-center gap-1">
                            <Target className="h-3 w-3" />
                            Target Price
                          </div>
                          <div className="font-bold text-lg text-green-400">
                            {signal.targetPrice ? parseFloat(signal.targetPrice).toFixed(5) : 'N/A'}
                          </div>
                        </div>
                        <div className="p-3 bg-slate-700 rounded">
                          <div className="text-sm text-slate-400 mb-1 flex items-center gap-1">
                            <Shield className="h-3 w-3" />
                            Stop Loss
                          </div>
                          <div className="font-bold text-lg text-red-400">
                            {signal.stopLoss ? parseFloat(signal.stopLoss).toFixed(5) : 'N/A'}
                          </div>
                        </div>
                      </div>

                      {/* Analysis Breakdown */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="text-center p-2 bg-slate-700 rounded">
                          <div className="text-xs text-slate-400">Technical</div>
                          <div className="font-bold">
                            {signal.technicalScore ? parseFloat(signal.technicalScore).toFixed(1) : 'N/A'}
                          </div>
                        </div>
                        <div className="text-center p-2 bg-slate-700 rounded">
                          <div className="text-xs text-slate-400">Fundamental</div>
                          <div className="font-bold">
                            {signal.fundamentalScore ? parseFloat(signal.fundamentalScore).toFixed(1) : 'N/A'}
                          </div>
                        </div>
                        <div className="text-center p-2 bg-slate-700 rounded">
                          <div className="text-xs text-slate-400">Sentiment</div>
                          <div className="font-bold">
                            {signal.sentimentScore ? parseFloat(signal.sentimentScore).toFixed(1) : 'N/A'}
                          </div>
                        </div>
                        <div className="text-center p-2 bg-slate-700 rounded">
                          <div className="text-xs text-slate-400">COT</div>
                          <div className="font-bold">
                            {signal.cotScore ? parseFloat(signal.cotScore).toFixed(1) : 'N/A'}
                          </div>
                        </div>
                      </div>

                      {/* Signal Details */}
                      <div className="mt-4 pt-3 border-t border-slate-700">
                        <div className="flex items-center justify-between text-sm">
                          <div>
                            <span className="text-slate-400">Timeframe: </span>
                            <Badge variant="outline">{signal.timeframe}</Badge>
                          </div>
                          <div>
                            <span className="text-slate-400">Combined Score: </span>
                            <span className="font-bold">
                              {signal.combinedScore ? parseFloat(signal.combinedScore).toFixed(1) : 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Signal Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-green-400">Buy Signals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {signals.filter((s: any) => s.signalType?.toLowerCase() === 'buy').length}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-red-400">Sell Signals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {signals.filter((s: any) => s.signalType?.toLowerCase() === 'sell').length}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-blue-400">Avg Confidence</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {signals.length > 0 ? (
                      signals.reduce((sum: number, s: any) => sum + parseFloat(s.confidence || '0'), 0) / signals.length
                    ).toFixed(1) : '0.0'}%
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-purple-400">High Confidence</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {signals.filter((s: any) => parseFloat(s.confidence || '0') >= 80).length}
                  </div>
                  <div className="text-slate-400 text-sm">≥ 80%</div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-12 text-center">
              <Signal className="h-16 w-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Active Signals</h3>
              <p className="text-slate-400 mb-4">
                The AI system hasn't generated any trading signals yet. Signals are created when market conditions meet specific criteria.
              </p>
              <div className="text-sm text-slate-500">
                <p>Signal generation occurs every 10 minutes based on:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Technical analysis indicators</li>
                  <li>Fundamental market events</li>
                  <li>Sentiment analysis</li>
                  <li>COT positioning data</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}