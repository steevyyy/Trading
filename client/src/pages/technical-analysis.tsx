import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import { ArrowLeft, TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function TechnicalAnalysisPage() {
  const { data: technicalData, isLoading } = useQuery({
    queryKey: ['/api/technical-analysis/1'],
  });

  const { data: instruments } = useQuery({
    queryKey: ['/api/market-data'],
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

  const getIndicatorStatus = (value: string | null, type: string) => {
    if (!value) return { status: 'neutral', color: 'bg-gray-500' };
    
    const numValue = parseFloat(value);
    
    switch (type) {
      case 'rsi':
        if (numValue < 30) return { status: 'oversold', color: 'bg-green-500' };
        if (numValue > 70) return { status: 'overbought', color: 'bg-red-500' };
        return { status: 'neutral', color: 'bg-yellow-500' };
      
      case 'macd':
        if (numValue > 0) return { status: 'bullish', color: 'bg-green-500' };
        if (numValue < 0) return { status: 'bearish', color: 'bg-red-500' };
        return { status: 'neutral', color: 'bg-gray-500' };
      
      default:
        return { status: 'neutral', color: 'bg-gray-500' };
    }
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
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Technical Analysis
          </h1>
          <p className="text-slate-400 text-lg mt-2">
            Comprehensive technical indicators and market analysis
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* RSI Indicator */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                RSI (14)
              </CardTitle>
              <CardDescription>Relative Strength Index</CardDescription>
            </CardHeader>
            <CardContent>
              {(technicalData as any)?.rsi ? (
                <div className="space-y-3">
                  <div className="text-3xl font-bold">
                    {parseFloat((technicalData as any).rsi).toFixed(1)}
                  </div>
                  <Progress 
                    value={parseFloat((technicalData as any).rsi)} 
                    className="h-2" 
                  />
                  <Badge className={getIndicatorStatus((technicalData as any).rsi, 'rsi').color}>
                    {getIndicatorStatus((technicalData as any).rsi, 'rsi').status}
                  </Badge>
                  <div className="text-sm text-slate-400">
                    <div>Oversold: &lt; 30</div>
                    <div>Overbought: &gt; 70</div>
                  </div>
                </div>
              ) : (
                <div className="text-slate-500">No data available</div>
              )}
            </CardContent>
          </Card>

          {/* MACD Indicator */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                MACD
              </CardTitle>
              <CardDescription>Moving Average Convergence Divergence</CardDescription>
            </CardHeader>
            <CardContent>
              {(technicalData as any)?.macd ? (
                <div className="space-y-3">
                  <div className="text-2xl font-bold">
                    {parseFloat((technicalData as any).macd).toFixed(6)}
                  </div>
                  <div className="text-sm">
                    Signal: {(technicalData as any).macdSignal ? parseFloat((technicalData as any).macdSignal).toFixed(6) : 'N/A'}
                  </div>
                  <Badge className={getIndicatorStatus((technicalData as any).macd, 'macd').color}>
                    {getIndicatorStatus((technicalData as any).macd, 'macd').status}
                  </Badge>
                  <div className="text-sm text-slate-400">
                    <div>Bullish: MACD &gt; Signal</div>
                    <div>Bearish: MACD &lt; Signal</div>
                  </div>
                </div>
              ) : (
                <div className="text-slate-500">No data available</div>
              )}
            </CardContent>
          </Card>

          {/* Moving Averages */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                Moving Averages
              </CardTitle>
              <CardDescription>MA 50 & MA 200</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-slate-400">MA 50</div>
                  <div className="text-xl font-bold">
                    {(technicalData as any)?.ma50 ? parseFloat((technicalData as any).ma50).toFixed(5) : 'N/A'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-slate-400">MA 200</div>
                  <div className="text-xl font-bold">
                    {(technicalData as any)?.ma200 ? parseFloat((technicalData as any).ma200).toFixed(5) : 'N/A'}
                  </div>
                </div>
                {(technicalData as any)?.ma50 && (technicalData as any)?.ma200 && (
                  <Badge className={parseFloat((technicalData as any).ma50) > parseFloat((technicalData as any).ma200) ? 'bg-green-500' : 'bg-red-500'}>
                    {parseFloat((technicalData as any).ma50) > parseFloat((technicalData as any).ma200) ? 'Golden Cross' : 'Death Cross'}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Bollinger Bands */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                Bollinger Bands
              </CardTitle>
              <CardDescription>Price volatility bands</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-slate-400">Upper Band</div>
                  <div className="text-lg font-bold">
                    {(technicalData as any)?.bollingerUpper ? parseFloat((technicalData as any).bollingerUpper).toFixed(5) : 'N/A'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-slate-400">Lower Band</div>
                  <div className="text-lg font-bold">
                    {(technicalData as any)?.bollingerLower ? parseFloat((technicalData as any).bollingerLower).toFixed(5) : 'N/A'}
                  </div>
                </div>
                <div className="text-sm text-slate-400">
                  Price outside bands indicates potential reversal
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ATR */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                ATR (14)
              </CardTitle>
              <CardDescription>Average True Range</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-2xl font-bold">
                  {(technicalData as any)?.atr ? parseFloat((technicalData as any).atr).toFixed(6) : 'N/A'}
                </div>
                <div className="text-sm text-slate-400">
                  Measures market volatility
                </div>
                {(technicalData as any)?.atr && (
                  <Badge className="bg-gray-600">
                    {parseFloat((technicalData as any).atr) > 0.001 ? 'High Volatility' : 'Low Volatility'}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Support & Resistance */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                Support & Resistance
              </CardTitle>
              <CardDescription>Key price levels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-slate-400">Resistance</div>
                  <div className="text-lg font-bold text-red-400">
                    {(technicalData as any)?.resistanceLevel ? parseFloat((technicalData as any).resistanceLevel).toFixed(5) : 'N/A'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-slate-400">Support</div>
                  <div className="text-lg font-bold text-green-400">
                    {(technicalData as any)?.supportLevel ? parseFloat((technicalData as any).supportLevel).toFixed(5) : 'N/A'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Instrument Selection */}
        {instruments && (instruments as any[]).length > 1 && (
          <Card className="bg-slate-800 border-slate-700 mt-6">
            <CardHeader>
              <CardTitle>Available Instruments</CardTitle>
              <CardDescription>Switch between different trading instruments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                {(instruments as any[]).map((item: any) => (
                  <Link key={item.instrument.id} href={`/technical-analysis/${item.instrument.id}`}>
                    <button className="p-3 bg-slate-700 hover:bg-slate-600 rounded border border-slate-600 text-left w-full">
                      <div className="font-bold">{item.instrument.symbol}</div>
                      <div className="text-sm text-slate-400">{item.price}</div>
                    </button>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}