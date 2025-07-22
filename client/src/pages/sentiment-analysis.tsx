import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import { ArrowLeft, MessageSquare, TrendingUp, TrendingDown } from "lucide-react";

export default function SentimentAnalysisPage() {
  const { data: sentimentData, isLoading } = useQuery({
    queryKey: ['/api/sentiment-analysis'],
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

  const getSentimentColor = (sentiment: number) => {
    if (sentiment > 20) return 'text-green-400';
    if (sentiment < -20) return 'text-red-400';
    return 'text-yellow-400';
  };

  const getSentimentBadgeColor = (sentiment: number) => {
    if (sentiment > 20) return 'bg-green-500';
    if (sentiment < -20) return 'bg-red-500';
    return 'bg-yellow-500';
  };

  const getSentimentLabel = (sentiment: number) => {
    if (sentiment > 50) return 'Very Bullish';
    if (sentiment > 20) return 'Bullish';
    if (sentiment < -50) return 'Very Bearish';
    if (sentiment < -20) return 'Bearish';
    return 'Neutral';
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
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Sentiment Analysis
          </h1>
          <p className="text-slate-400 text-lg mt-2">
            Market sentiment from social media, news, and institutional sources
          </p>
        </div>

        {sentimentData ? (
          <div className="space-y-6">
            {/* Overall Market Sentiment */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Overall Market Sentiment
                </CardTitle>
                <CardDescription>Aggregated sentiment across all sources</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className={`text-4xl font-bold ${getSentimentColor(sentimentData.overall)}`}>
                      {sentimentData.overall?.toFixed(1) || '0.0'}
                    </div>
                    <Badge className={getSentimentBadgeColor(sentimentData.overall || 0)}>
                      {getSentimentLabel(sentimentData.overall || 0)}
                    </Badge>
                  </div>
                  <div className="w-32">
                    <Progress 
                      value={Math.abs(sentimentData.overall || 0)} 
                      className="h-3" 
                    />
                  </div>
                </div>
                <div className="text-sm text-slate-400">
                  Range: -100 (Very Bearish) to +100 (Very Bullish)
                </div>
              </CardContent>
            </Card>

            {/* Sentiment by Source */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle>Sentiment by Source</CardTitle>
                <CardDescription>Breakdown of sentiment across different data sources</CardDescription>
              </CardHeader>
              <CardContent>
                {sentimentData.bySource && sentimentData.bySource.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {sentimentData.bySource.map((source: any, index: number) => (
                      <div key={index} className="p-4 bg-slate-700 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-semibold capitalize">{source.source}</div>
                          <Badge variant="outline" className="text-xs">
                            {source.count || 0} posts
                          </Badge>
                        </div>
                        <div className={`text-2xl font-bold ${getSentimentColor(source.sentiment)}`}>
                          {source.sentiment?.toFixed(1) || '0.0'}
                        </div>
                        <div className="text-sm text-slate-400">
                          Confidence: {source.confidence?.toFixed(1) || '0.0'}%
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-slate-400 py-8">
                    <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>No sentiment data by source available yet</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Sentiment Posts */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle>Recent Sentiment Posts</CardTitle>
                <CardDescription>Latest social media and news sentiment</CardDescription>
              </CardHeader>
              <CardContent>
                {sentimentData.recent && sentimentData.recent.length > 0 ? (
                  <div className="space-y-4">
                    {sentimentData.recent.map((post: any, index: number) => (
                      <div key={index} className="border border-slate-700 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <Badge className="bg-blue-600">
                            {post.source}
                          </Badge>
                          <div className={`flex items-center gap-1 ${getSentimentColor(post.sentiment)}`}>
                            {post.sentiment > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                            <span className="font-bold">{post.sentiment?.toFixed(1)}</span>
                          </div>
                        </div>
                        <p className="text-slate-300 mb-2">{post.content}</p>
                        <div className="flex items-center justify-between text-sm text-slate-400">
                          <div>Confidence: {post.confidence?.toFixed(1)}%</div>
                          <div>{new Date(post.timestamp).toLocaleString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-slate-400 py-8">
                    <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>No recent sentiment posts available yet</p>
                    <p className="text-sm mt-2">Sentiment data will be collected as the system runs</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Sentiment Trends */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-green-400">Bullish Signals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {sentimentData.bySource ? 
                      sentimentData.bySource.filter((s: any) => (s.sentiment || 0) > 20).length : 
                      0
                    }
                  </div>
                  <div className="text-slate-400">Positive sentiment sources</div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-red-400">Bearish Signals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {sentimentData.bySource ? 
                      sentimentData.bySource.filter((s: any) => (s.sentiment || 0) < -20).length : 
                      0
                    }
                  </div>
                  <div className="text-slate-400">Negative sentiment sources</div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-12 text-center">
              <MessageSquare className="h-16 w-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Sentiment Data</h3>
              <p className="text-slate-400">
                Sentiment analysis data will be available as the system collects social media and news data.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}