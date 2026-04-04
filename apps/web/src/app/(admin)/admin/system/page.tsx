'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Server,
  Database,
  Cloud,
  Cpu,
  HardDrive,
  Activity,
  Wifi,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Globe,
  Shield,
  Zap,
  BarChart3,
  Terminal,
} from 'lucide-react';

// System components status
const systemComponents = [
  {
    name: 'Web Server (Next.js)',
    status: 'healthy',
    uptime: '99.99%',
    latency: '45ms',
    instances: 4,
    cpu: 32,
    memory: 45,
    requests: '15.2K/min',
    region: 'us-east-1',
  },
  {
    name: 'API Gateway',
    status: 'healthy',
    uptime: '99.98%',
    latency: '23ms',
    instances: 3,
    cpu: 28,
    memory: 38,
    requests: '8.5K/min',
    region: 'us-east-1',
  },
  {
    name: 'PostgreSQL Database',
    status: 'healthy',
    uptime: '99.95%',
    latency: '12ms',
    instances: 2,
    cpu: 45,
    memory: 68,
    connections: '245/500',
    region: 'us-east-1',
  },
  {
    name: 'Redis Cache',
    status: 'healthy',
    uptime: '100%',
    latency: '2ms',
    instances: 2,
    cpu: 15,
    memory: 52,
    hitRate: '94.2%',
    region: 'us-east-1',
  },
  {
    name: 'CDN (CloudFlare)',
    status: 'healthy',
    uptime: '100%',
    latency: '8ms',
    instances: 'Global',
    bandwidth: '2.4TB/day',
    cacheHit: '89%',
    region: 'Global',
  },
  {
    name: 'AI Service',
    status: 'warning',
    uptime: '99.85%',
    latency: '180ms',
    instances: 2,
    cpu: 78,
    memory: 82,
    requests: '1.2K/min',
    region: 'us-west-2',
  },
  {
    name: 'Video Streaming',
    status: 'healthy',
    uptime: '99.90%',
    latency: '95ms',
    instances: 3,
    bandwidth: '850GB/day',
    streams: '342 active',
    region: 'Global',
  },
  {
    name: 'Search (Elasticsearch)',
    status: 'healthy',
    uptime: '99.99%',
    latency: '35ms',
    instances: 3,
    cpu: 42,
    memory: 58,
    documents: '2.4M',
    region: 'us-east-1',
  },
];

// Server metrics history
const metricsHistory = Array.from({ length: 24 }, (_, i) => ({
  time: `${23 - i}h`,
  cpu: Math.floor(Math.random() * 30) + 25,
  memory: Math.floor(Math.random() * 20) + 45,
  requests: Math.floor(Math.random() * 5000) + 10000,
}));

// Recent deployments
const deployments = [
  { id: '1', version: 'v2.4.1', status: 'success', time: '2 hours ago', commit: 'feat: add VR scenario builder', author: 'System' },
  { id: '2', version: 'v2.4.0', status: 'success', time: '1 day ago', commit: 'chore: upgrade dependencies', author: 'System' },
  { id: '3', version: 'v2.3.9', status: 'success', time: '3 days ago', commit: 'fix: AI response latency', author: 'DevOps' },
  { id: '4', version: 'v2.3.8', status: 'failed', time: '4 days ago', commit: 'feat: new dashboard widgets', author: 'System' },
];

// Alerts
const activeAlerts = [
  { id: '1', severity: 'warning', message: 'AI Service CPU usage above 75%', time: '15m ago' },
  { id: '2', severity: 'info', message: 'Scheduled maintenance in 2 hours', time: '1h ago' },
];

export default function SystemPage() {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<typeof systemComponents[0] | null>(null);

  const healthyCount = systemComponents.filter(c => c.status === 'healthy').length;
  const warningCount = systemComponents.filter(c => c.status === 'warning').length;
  const criticalCount = systemComponents.filter(c => c.status === 'critical').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold flex items-center gap-2">
            <Server className="w-7 h-7 text-blue-400" />
            System Health
          </h1>
          <p className="text-gray-500 text-sm">
            Infrastructure monitoring and system status
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-4 px-4 py-2 rounded-lg bg-white">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <span className="text-sm">{healthyCount} Healthy</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              <span className="text-sm">{warningCount} Warning</span>
            </div>
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-400" />
              <span className="text-sm">{criticalCount} Critical</span>
            </div>
          </div>
          <button
            onClick={() => {
              setRefreshing(true);
              setTimeout(() => setRefreshing(false), 1000);
            }}
            className={`p-2 rounded-lg bg-white hover:bg-gray-100 transition-colors ${refreshing ? 'animate-spin' : ''}`}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Alerts */}
      {activeAlerts.length > 0 && (
        <div className="space-y-2">
          {activeAlerts.map((alert) => (
            <div 
              key={alert.id} 
              className={`flex items-center gap-4 p-4 rounded-lg border ${
                alert.severity === 'warning' 
                  ? 'bg-yellow-500/10 border-yellow-500/30' 
                  : 'bg-blue-500/10 border-blue-500/30'
              }`}
            >
              {alert.severity === 'warning' ? (
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
              ) : (
                <Activity className="w-5 h-5 text-blue-400" />
              )}
              <div className="flex-1">
                <div className="font-medium text-sm">{alert.message}</div>
                <div className="text-xs text-gray-500">{alert.time}</div>
              </div>
              <button className="text-xs text-gray-400 hover:text-white">Dismiss</button>
            </div>
          ))}
        </div>
      )}

      {/* System Components Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
        {systemComponents.map((component) => (
          <motion.div
            key={component.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => setSelectedComponent(component)}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              selectedComponent?.name === component.name
                ? 'bg-blue-500/10 border-blue-500/30'
                : 'bg-white border-gray-200 shadow-sm hover:border-white/10'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  component.status === 'healthy' ? 'bg-green-500' :
                  component.status === 'warning' ? 'bg-yellow-500' :
                  'bg-red-500'
                }`} />
                <span className="font-medium text-sm">{component.name}</span>
              </div>
              <span className="text-xs text-gray-500">{component.region}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-lg bg-gray-50">
                <div className="text-gray-500">Uptime</div>
                <div className="font-medium">{component.uptime}</div>
              </div>
              <div className="p-2 rounded-lg bg-gray-50">
                <div className="text-gray-500">Latency</div>
                <div className="font-medium">{component.latency}</div>
              </div>
              {component.cpu !== undefined && (
                <div className="p-2 rounded-lg bg-gray-50">
                  <div className="text-gray-500">CPU</div>
                  <div className={`font-medium ${component.cpu > 70 ? 'text-yellow-400' : ''}`}>{component.cpu}%</div>
                </div>
              )}
              {component.memory !== undefined && (
                <div className="p-2 rounded-lg bg-gray-50">
                  <div className="text-gray-500">Memory</div>
                  <div className={`font-medium ${component.memory > 80 ? 'text-yellow-400' : ''}`}>{component.memory}%</div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Metrics and Deployments Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* CPU & Memory Chart */}
        <div className="p-5 rounded-xl bg-white border border-gray-200 shadow-sm">
          <h2 className="font-semibold flex items-center gap-2 mb-4">
            <Cpu className="w-5 h-5 text-cyan-400" />
            Resource Usage (24h)
          </h2>
          <div className="h-40 flex items-end gap-1">
            {metricsHistory.map((metric, index) => (
              <div key={index} className="flex-1 flex flex-col gap-0.5">
                <div 
                  className="w-full bg-cyan-500/50 rounded-t" 
                  style={{ height: `${metric.cpu}%` }}
                  title={`CPU: ${metric.cpu}%`}
                />
                <div 
                  className="w-full bg-purple-500/50 rounded-t" 
                  style={{ height: `${metric.memory * 0.8}%` }}
                  title={`Memory: ${metric.memory}%`}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-cyan-500/50" />
                <span className="text-gray-400">CPU</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-purple-500/50" />
                <span className="text-gray-400">Memory</span>
              </div>
            </div>
            <span className="text-xs text-gray-500">Last 24 hours</span>
          </div>
        </div>

        {/* Recent Deployments */}
        <div className="p-5 rounded-xl bg-white border border-gray-200 shadow-sm">
          <h2 className="font-semibold flex items-center gap-2 mb-4">
            <Terminal className="w-5 h-5 text-green-400" />
            Recent Deployments
          </h2>
          <div className="space-y-3">
            {deployments.map((deployment) => (
              <div key={deployment.id} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  deployment.status === 'success' ? 'bg-green-500/20' : 'bg-red-500/20'
                }`}>
                  {deployment.status === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{deployment.version}</span>
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      deployment.status === 'success' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {deployment.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 truncate">{deployment.commit}</div>
                </div>
                <div className="text-xs text-gray-500 text-right">
                  <div>{deployment.time}</div>
                  <div className="text-gray-600">{deployment.author}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          { label: 'Total Requests', value: '2.4M', trend: '+12%', icon: Globe, color: 'text-blue-400' },
          { label: 'Avg Response', value: '45ms', trend: '-5ms', icon: Zap, color: 'text-green-400' },
          { label: 'Error Rate', value: '0.02%', trend: '-0.01%', icon: AlertTriangle, color: 'text-yellow-400' },
          { label: 'DB Connections', value: '245', trend: 'stable', icon: Database, color: 'text-purple-400' },
          { label: 'Cache Hit Rate', value: '94.2%', trend: '+2.1%', icon: HardDrive, color: 'text-cyan-400' },
          { label: 'SSL Grade', value: 'A+', trend: '', icon: Shield, color: 'text-green-400' },
        ].map((stat) => (
          <div key={stat.label} className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm">
            <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
            <div className="text-xl font-bold">{stat.value}</div>
            <div className="text-xs text-gray-500">{stat.label}</div>
            {stat.trend && (
              <div className="text-xs text-green-400 mt-1">{stat.trend}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

