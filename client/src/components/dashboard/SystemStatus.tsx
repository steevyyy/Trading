import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useTradingData } from "@/hooks/useTradingData";

export function SystemStatus() {
  const { systemStatus, isLoading } = useTradingData();

  if (isLoading) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="border-b border-slate-700">
          <CardTitle className="text-white">System Status & API Monitor</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-3">
                  <div className="h-4 bg-slate-700/50 rounded w-1/2"></div>
                  <div className="space-y-2">
                    {[1, 2, 3].map((j) => (
                      <div key={j} className="h-12 bg-slate-700/50 rounded-lg"></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      case 'rate_limited': return 'bg-amber-500';
      default: return 'bg-slate-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Active';
      case 'error': return 'Error';
      case 'rate_limited': return 'Rate Limited';
      default: return 'Unknown';
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'error': return 'text-red-400';
      case 'rate_limited': return 'text-amber-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader className="border-b border-slate-700">
        <CardTitle className="text-white">System Status & API Monitor</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="text-sm font-medium text-slate-300 mb-4">Data Sources</h4>
            <div className="space-y-3">
              {systemStatus?.apiStatuses ? (
                systemStatus.apiStatuses.map((api) => (
                  <div key={api.serviceName} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(api.status)}`}></div>
                      <span className="text-sm text-white capitalize">
                        {api.serviceName.replace('_', ' ')}
                      </span>
                    </div>
                    <span className={`text-xs ${getStatusTextColor(api.status)}`}>
                      {getStatusText(api.status)}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-slate-400">No API status available</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-slate-300 mb-4">Performance</h4>
            <div className="space-y-3">
              {systemStatus?.systemHealth ? (
                <>
                  <div className="bg-slate-700/50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-300">CPU Usage</span>
                      <span className="text-white font-medium">{systemStatus.systemHealth.cpu}%</span>
                    </div>
                    <Progress value={systemStatus.systemHealth.cpu} className="h-1" />
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-300">Memory</span>
                      <span className="text-white font-medium">{systemStatus.systemHealth.memory}%</span>
                    </div>
                    <Progress value={systemStatus.systemHealth.memory} className="h-1" />
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">Uptime</span>
                      <span className="text-white font-medium">{systemStatus.systemHealth.uptime}</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-slate-400">No performance data available</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-slate-300 mb-4">Recent Activity</h4>
            <div className="space-y-2 text-xs">
              {systemStatus?.recentLogs && systemStatus.recentLogs.length > 0 ? (
                systemStatus.recentLogs.slice(0, 4).map((log, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className={`w-1 h-1 rounded-full mt-2 flex-shrink-0 ${
                      log.level === 'error' ? 'bg-red-500' : 
                      log.level === 'warning' ? 'bg-amber-500' : 'bg-green-500'
                    }`}></div>
                    <div>
                      <div className="text-slate-400">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </div>
                      <div className="text-white">{log.message}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-slate-400">No recent activity</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
