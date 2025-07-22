import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { ArrowLeft, Calendar, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import { format } from "date-fns";

export default function FundamentalAnalysisPage() {
  const { data: fundamentalData, isLoading } = useQuery({
    queryKey: ['/api/fundamental-data'],
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

  const getImpactColor = (impact: string) => {
    switch (impact?.toLowerCase()) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getScoreColor = (score: string) => {
    const numScore = parseFloat(score || '0');
    if (numScore > 20) return 'text-green-400';
    if (numScore < -20) return 'text-red-400';
    return 'text-yellow-400';
  };

  const getScoreIcon = (score: string) => {
    const numScore = parseFloat(score || '0');
    if (numScore > 20) return <TrendingUp className="h-4 w-4" />;
    if (numScore < -20) return <TrendingDown className="h-4 w-4" />;
    return <AlertTriangle className="h-4 w-4" />;
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
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            Fundamental Analysis
          </h1>
          <p className="text-slate-400 text-lg mt-2">
            Economic events and data that drive market movements
          </p>
        </div>

        {fundamentalData && fundamentalData.length > 0 ? (
          <div className="space-y-6">
            {/* Economic Calendar */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Recent Economic Events
                </CardTitle>
                <CardDescription>
                  Key economic data releases and their market impact
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {fundamentalData.map((event: any) => (
                    <div key={event.id} className="border border-slate-700 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{event.event}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className="bg-blue-600">{event.currency}</Badge>
                            <Badge className={getImpactColor(event.impact)}>
                              {event.impact} Impact
                            </Badge>
                          </div>
                        </div>
                        <div className="text-sm text-slate-400">
                          {format(new Date(event.timestamp), 'MMM dd, yyyy HH:mm')}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <div className="text-sm text-slate-400">Forecast</div>
                          <div className="font-bold">{event.forecast || 'N/A'}</div>
                        </div>
                        <div>
                          <div className="text-sm text-slate-400">Actual</div>
                          <div className="font-bold">{event.actual || 'N/A'}</div>
                        </div>
                        <div>
                          <div className="text-sm text-slate-400">Previous</div>
                          <div className="font-bold">{event.previous || 'N/A'}</div>
                        </div>
                        <div>
                          <div className="text-sm text-slate-400">Market Impact</div>
                          <div className={`flex items-center gap-1 font-bold ${getScoreColor(event.score)}`}>
                            {getScoreIcon(event.score)}
                            {parseFloat(event.score || '0').toFixed(1)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Market Impact Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-green-400">Bullish Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {fundamentalData.filter((event: any) => parseFloat(event.score || '0') > 20).length}
                  </div>
                  <div className="text-slate-400">Positive impact events</div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-red-400">Bearish Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {fundamentalData.filter((event: any) => parseFloat(event.score || '0') < -20).length}
                  </div>
                  <div className="text-slate-400">Negative impact events</div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-yellow-400">Neutral Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {fundamentalData.filter((event: any) => {
                      const score = parseFloat(event.score || '0');
                      return score >= -20 && score <= 20;
                    }).length}
                  </div>
                  <div className="text-slate-400">Minimal market impact</div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-12 text-center">
              <Calendar className="h-16 w-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Economic Events</h3>
              <p className="text-slate-400">
                No recent economic events found. The system generates economic data periodically.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Currency Impact Analysis */}
        <Card className="bg-slate-800 border-slate-700 mt-6">
          <CardHeader>
            <CardTitle>Currency Impact Analysis</CardTitle>
            <CardDescription>How recent events are affecting different currencies</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD'].map(currency => {
                const currencyEvents = fundamentalData?.filter((event: any) => event.currency === currency) || [];
                const avgScore = currencyEvents.length > 0 
                  ? currencyEvents.reduce((sum: number, event: any) => sum + parseFloat(event.score || '0'), 0) / currencyEvents.length 
                  : 0;

                return (
                  <div key={currency} className="p-4 bg-slate-700 rounded-lg text-center">
                    <div className="text-lg font-bold">{currency}</div>
                    <div className={`text-2xl font-bold ${getScoreColor(avgScore.toString())}`}>
                      {avgScore.toFixed(1)}
                    </div>
                    <div className="text-sm text-slate-400">
                      {currencyEvents.length} events
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}