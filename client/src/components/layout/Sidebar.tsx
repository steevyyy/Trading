import { 
  BarChart3, 
  TrendingUp, 
  Newspaper, 
  MessageSquare, 
  Building, 
  Signal, 
  FileText, 
  Shield, 
  Settings, 
  Bot 
} from "lucide-react";

const navItems = [
  { icon: BarChart3, label: "Dashboard", active: true },
  { icon: TrendingUp, label: "Technical Analysis" },
  { icon: Newspaper, label: "Fundamental Data" },
  { icon: MessageSquare, label: "Sentiment Analysis" },
  { icon: Building, label: "COT Reports" },
  { icon: Signal, label: "Trading Signals" },
  { icon: FileText, label: "Paper Trading" },
  { icon: Shield, label: "Risk Management" },
  { icon: Settings, label: "Settings" },
];

export function Sidebar() {
  return (
    <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Bot className="text-white h-4 w-4" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">TradingBot AI</h1>
            <p className="text-xs text-slate-400">Multi-Analysis System</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <a
            key={item.label}
            href="#"
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              item.active
                ? "text-white bg-primary"
                : "text-slate-300 hover:text-white hover:bg-slate-700"
            }`}
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.label}
          </a>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
            <span className="text-slate-300 text-sm font-medium">A</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-white">Admin User</p>
            <p className="text-xs text-slate-400">Online</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
