import { Clock } from "lucide-react";
import { useEffect, useState } from "react";

interface HeaderProps {
  isConnected: boolean;
}

export function Header({ isConnected }: HeaderProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Trading Dashboard</h1>
          <p className="text-sm text-slate-400">Real-time market analysis and trading signals</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full animate-pulse ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className={`text-sm ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
              {isConnected ? 'Bot Active' : 'Bot Offline'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-blue-400">APIs Connected</span>
          </div>
          <div className="text-sm text-slate-400">
            <Clock className="inline w-4 h-4 mr-1" />
            Last Update: {currentTime.toLocaleTimeString()} UTC
          </div>
        </div>
      </div>
    </header>
  );
}
