import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "@/pages/dashboard";
import TechnicalAnalysis from "@/pages/technical-analysis";
import FundamentalAnalysis from "@/pages/fundamental-analysis";
import SentimentAnalysis from "@/pages/sentiment-analysis";
import TradingSignals from "@/pages/trading-signals";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/technical-analysis" component={TechnicalAnalysis} />
      <Route path="/technical-analysis/:instrumentId" component={TechnicalAnalysis} />
      <Route path="/fundamental-analysis" component={FundamentalAnalysis} />
      <Route path="/sentiment-analysis" component={SentimentAnalysis} />
      <Route path="/trading-signals" component={TradingSignals} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
