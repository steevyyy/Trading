import { IStorage } from "../storage";

export class SentimentAnalysisService {
  constructor(private storage: IStorage) {}

  async collectSentimentData(): Promise<void> {
    try {
      await this.collectTwitterSentiment();
      await this.collectRedditSentiment();
      await this.collectNewsSentiment();
      
      // Update API status
      await this.storage.updateApiStatus('twitter_api', {
        status: 'rate_limited',
        errorMessage: 'Rate limit reached',
        requestCount: 100,
        rateLimitRemaining: 0
      });

      await this.storage.insertSystemLog({
        level: 'info',
        source: 'sentiment_analysis',
        message: 'Sentiment data collection completed',
        metadata: { timestamp: new Date() }
      });
    } catch (error) {
      await this.storage.insertSystemLog({
        level: 'error',
        source: 'sentiment_analysis',
        message: `Sentiment data collection failed: ${error}`,
        metadata: { error: String(error) }
      });
      throw error;
    }
  }

  private async collectTwitterSentiment(): Promise<void> {
    // Simulate Twitter sentiment data collection
    const instruments = await this.storage.getInstruments();
    
    for (const instrument of instruments) {
      const tweets = this.generateMockTweets(instrument.symbol);
      
      for (const tweet of tweets) {
        const sentiment = this.analyzeSentiment(tweet.content);
        
        await this.storage.insertSentimentData({
          timestamp: new Date(),
          source: 'twitter',
          instrumentId: instrument.id,
          sentiment: sentiment.score.toFixed(2),
          confidence: sentiment.confidence.toFixed(2),
          content: tweet.content,
          url: tweet.url
        });
      }
    }
  }

  private async collectRedditSentiment(): Promise<void> {
    // Simulate Reddit sentiment data collection
    const instruments = await this.storage.getInstruments();
    
    for (const instrument of instruments) {
      const posts = this.generateMockRedditPosts(instrument.symbol);
      
      for (const post of posts) {
        const sentiment = this.analyzeSentiment(post.content);
        
        await this.storage.insertSentimentData({
          timestamp: new Date(),
          source: 'reddit',
          instrumentId: instrument.id,
          sentiment: sentiment.score.toFixed(2),
          confidence: sentiment.confidence.toFixed(2),
          content: post.content,
          url: post.url
        });
      }
    }
  }

  private async collectNewsSentiment(): Promise<void> {
    // Simulate news sentiment data collection
    const instruments = await this.storage.getInstruments();
    
    for (const instrument of instruments) {
      const articles = this.generateMockNewsArticles(instrument.symbol);
      
      for (const article of articles) {
        const sentiment = this.analyzeSentiment(article.content);
        
        await this.storage.insertSentimentData({
          timestamp: new Date(),
          source: 'news',
          instrumentId: instrument.id,
          sentiment: sentiment.score.toFixed(2),
          confidence: sentiment.confidence.toFixed(2),
          content: article.content,
          url: article.url
        });
      }
    }
  }

  private generateMockTweets(symbol: string): Array<{ content: string; url: string }> {
    const templates = [
      `${symbol} looking bullish today! Strong momentum building`,
      `Bearish outlook on ${symbol}, expecting pullback`,
      `${symbol} breaking key resistance levels, time to buy?`,
      `Technical analysis suggests ${symbol} oversold, potential reversal`,
      `${symbol} fundamentals looking strong, long-term bullish`,
      `Market sentiment on ${symbol} turning negative, careful`,
      `${symbol} hitting new highs, FOMO or fundamentally justified?`,
      `Risk-off sentiment affecting ${symbol}, temporary or structural?`
    ];

    return templates.slice(0, 3).map((template, index) => ({
      content: template,
      url: `https://twitter.com/user/status/${Date.now() + index}`
    }));
  }

  private generateMockRedditPosts(symbol: string): Array<{ content: string; url: string }> {
    const templates = [
      `DD: ${symbol} analysis - why I'm bullish long term`,
      `${symbol} chart analysis - what do you think?`,
      `Anyone else concerned about ${symbol} recent performance?`,
      `${symbol} earnings/data coming up - predictions?`,
      `${symbol} technical breakout confirmed, jumping in`,
      `Fundamental analysis suggests ${symbol} undervalued`
    ];

    return templates.slice(0, 2).map((template, index) => ({
      content: template,
      url: `https://reddit.com/r/forex/post/${Date.now() + index}`
    }));
  }

  private generateMockNewsArticles(symbol: string): Array<{ content: string; url: string }> {
    const templates = [
      `${symbol} rises on strong economic data and positive outlook`,
      `Central bank policy changes impact ${symbol} trading dynamics`,
      `${symbol} volatility increases amid geopolitical tensions`,
      `Analysts upgrade ${symbol} forecast following recent developments`,
      `${symbol} faces headwinds from global economic uncertainty`,
      `Technical indicators suggest ${symbol} poised for breakout`
    ];

    return templates.slice(0, 2).map((template, index) => ({
      content: template,
      url: `https://financialnews.com/article/${Date.now() + index}`
    }));
  }

  private analyzeSentiment(text: string): { score: number; confidence: number } {
    // Simple sentiment analysis simulation
    const positiveWords = ['bullish', 'buy', 'strong', 'positive', 'rise', 'breakout', 'upgrade', 'momentum'];
    const negativeWords = ['bearish', 'sell', 'weak', 'negative', 'fall', 'breakdown', 'downgrade', 'decline'];
    
    const words = text.toLowerCase().split(/\s+/);
    
    let positiveCount = 0;
    let negativeCount = 0;
    
    words.forEach(word => {
      if (positiveWords.some(pw => word.includes(pw))) {
        positiveCount++;
      }
      if (negativeWords.some(nw => word.includes(nw))) {
        negativeCount++;
      }
    });
    
    const totalSentimentWords = positiveCount + negativeCount;
    const confidence = Math.min(totalSentimentWords * 20, 100); // Max 100% confidence
    
    if (totalSentimentWords === 0) {
      return { score: 0, confidence: 10 }; // Neutral with low confidence
    }
    
    const sentimentRatio = (positiveCount - negativeCount) / totalSentimentWords;
    const score = sentimentRatio * 100; // Score between -100 and +100
    
    return { score, confidence };
  }

  async getSentimentSignal(instrumentId?: number): Promise<{ signal: 'buy' | 'sell' | 'hold'; confidence: number }> {
    try {
      const sentimentData = await this.storage.getLatestSentimentData(instrumentId);
      
      if (sentimentData.length === 0) {
        return { signal: 'hold', confidence: 0 };
      }

      // Calculate weighted average sentiment
      let totalScore = 0;
      let totalWeight = 0;

      for (const data of sentimentData) {
        const score = parseFloat(data.sentiment || '0');
        const confidence = parseFloat(data.confidence || '0');
        const weight = this.getSourceWeight(data.source) * (confidence / 100);
        
        totalScore += score * weight;
        totalWeight += weight;
      }

      const averageScore = totalWeight > 0 ? totalScore / totalWeight : 0;
      const confidence = Math.min(Math.abs(averageScore), 100);
      
      let signal: 'buy' | 'sell' | 'hold' = 'hold';
      if (averageScore > 30) {
        signal = 'buy';
      } else if (averageScore < -30) {
        signal = 'sell';
      }

      return { signal, confidence };
    } catch (error) {
      await this.storage.insertSystemLog({
        level: 'error',
        source: 'sentiment_analysis',
        message: `Sentiment signal calculation failed: ${error}`,
        metadata: { instrumentId, error: String(error) }
      });
      return { signal: 'hold', confidence: 0 };
    }
  }

  private getSourceWeight(source: string): number {
    return {
      'news': 3,      // News articles have highest weight
      'twitter': 2,   // Twitter medium weight
      'reddit': 1.5   // Reddit lower weight
    }[source] || 1;
  }

  async getOverallSentiment(): Promise<{
    overall: number;
    bySource: Record<string, number>;
    trending: string[];
  }> {
    try {
      const allSentimentData = await this.storage.getLatestSentimentData();
      
      if (allSentimentData.length === 0) {
        return {
          overall: 0,
          bySource: {},
          trending: []
        };
      }

      // Calculate overall sentiment
      const overallScore = allSentimentData.reduce((sum, data) => {
        return sum + parseFloat(data.sentiment || '0');
      }, 0) / allSentimentData.length;

      // Calculate sentiment by source
      const bySource: Record<string, number> = {};
      const sourceGroups = allSentimentData.reduce((groups, data) => {
        if (!groups[data.source]) {
          groups[data.source] = [];
        }
        groups[data.source].push(parseFloat(data.sentiment || '0'));
        return groups;
      }, {} as Record<string, number[]>);

      Object.entries(sourceGroups).forEach(([source, scores]) => {
        bySource[source] = scores.reduce((sum, score) => sum + score, 0) / scores.length;
      });

      // Identify trending topics (simplified)
      const trending = ['EUR/USD', 'Gold', 'Federal Reserve', 'Inflation'];

      return {
        overall: overallScore,
        bySource,
        trending
      };
    } catch (error) {
      await this.storage.insertSystemLog({
        level: 'error',
        source: 'sentiment_analysis',
        message: `Overall sentiment calculation failed: ${error}`,
        metadata: { error: String(error) }
      });
      return {
        overall: 0,
        bySource: {},
        trending: []
      };
    }
  }
}
