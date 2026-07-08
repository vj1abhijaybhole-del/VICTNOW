import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Activity, ShieldCheck, Database, RefreshCw, Server, AlertCircle, Sparkles, CheckCircle2, Clock } from 'lucide-react';

interface DiagnosticReport {
  timestamp: string;
  database: {
    status: 'healthy' | 'warning' | 'failed' | 'checking';
    message: string;
    latency: number;
  };
  restApi: {
    status: 'healthy' | 'warning' | 'failed' | 'checking';
    message: string;
    url: string;
    latency: number;
  };
  authService: {
    status: 'healthy' | 'warning' | 'failed' | 'checking';
    message: string;
    url: string;
    latency: number;
  };
}

interface SupabaseDiagnosticProps {
  authToken: string;
  onUnauthorized: () => void;
}

export default function SupabaseDiagnostic({ authToken, onUnauthorized }: SupabaseDiagnosticProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [report, setReport] = useState<DiagnosticReport | null>(null);
  const [error, setError] = useState<string>('');

  const runDiagnostics = async () => {
    if (!authToken) return;
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/admin/diagnose', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      if (response.status === 401) {
        onUnauthorized();
        return;
      }
      if (!response.ok) {
        throw new Error(`Diagnostics server returned error status ${response.status}`);
      }
      const data = await response.json();
      if (data.success && data.diagnostics) {
        setReport(data.diagnostics);
      } else {
        throw new Error(data.error || 'Invalid diagnostic report format received.');
      }
    } catch (err: any) {
      console.error('Diagnostics execution error:', err);
      setError(err.message || 'Failed to communicate with diagnostic endpoint.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runDiagnostics();
  }, [authToken]);

  const getStatusColor = (status: 'healthy' | 'warning' | 'failed' | 'checking') => {
    switch (status) {
      case 'healthy':
        return 'text-emerald-400 border-emerald-500/25 bg-emerald-500/10';
      case 'warning':
        return 'text-amber-400 border-amber-500/25 bg-amber-500/10';
      case 'failed':
        return 'text-rose-400 border-rose-500/25 bg-rose-500/10';
      default:
        return 'text-gray-400 border-white/10 bg-white/5';
    }
  };

  const getStatusBadge = (status: 'healthy' | 'warning' | 'failed' | 'checking') => {
    switch (status) {
      case 'healthy':
        return (
          <span className="flex items-center space-x-1 px-2.5 py-1 text-[10px] font-mono rounded bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold uppercase tracking-wider">
            ● ONLINE
          </span>
        );
      case 'warning':
        return (
          <span className="flex items-center space-x-1 px-2.5 py-1 text-[10px] font-mono rounded bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold uppercase tracking-wider">
            ▲ DEGRADED
          </span>
        );
      case 'failed':
        return (
          <span className="flex items-center space-x-1 px-2.5 py-1 text-[10px] font-mono rounded bg-rose-500/20 border border-rose-500/30 text-rose-300 font-bold uppercase tracking-wider">
            ■ OFFLINE
          </span>
        );
      default:
        return (
          <span className="flex items-center space-x-1 px-2.5 py-1 text-[10px] font-mono rounded bg-white/5 border border-white/10 text-gray-400 font-bold uppercase tracking-wider">
            ○ PINGING
          </span>
        );
    }
  };

  const calculateTotalScore = () => {
    if (!report) return 0;
    let score = 0;
    if (report.database.status === 'healthy') score += 40;
    else if (report.database.status === 'warning') score += 20;

    if (report.restApi.status === 'healthy') score += 30;
    else if (report.restApi.status === 'warning') score += 15;

    if (report.authService.status === 'healthy') score += 30;
    else if (report.authService.status === 'warning') score += 15;

    return score;
  };

  return (
    <div id="supabase-diagnostics-container" className="p-5 bg-[#121317] border border-white/5 rounded-2xl space-y-5">
      {/* Title block */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-gradient-to-br from-amber-500/20 to-amber-600/20 rounded-xl border border-amber-500/30">
            <Activity className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wide flex items-center space-x-1.5">
              <span>Supabase Service Diagnostics Suite</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            </h3>
            <p className="text-xs text-gray-400">Verifying live server database routing, DNS latencies, and microservices.</p>
          </div>
        </div>

        <button
          onClick={runDiagnostics}
          disabled={loading}
          className="flex items-center space-x-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-400 disabled:bg-amber-500/50 text-black text-xs font-semibold rounded-xl font-sans transition-all active:scale-95 cursor-pointer shadow-lg shadow-amber-500/10 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Executing Ping Tasks...' : 'Trigger Comprehensive Ping'}</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/25 rounded-xl flex items-start space-x-2 text-rose-400">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <div className="text-xs">
            <span className="font-bold">Execution Error:</span> {error}
          </div>
        </div>
      )}

      {/* Diagnostics score bar */}
      {report && !loading && (
        <div className="p-4 bg-[#16181e] border border-white/10 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3 w-full md:w-auto">
            <div className="relative flex items-center justify-center">
              <svg className="w-12 h-12 transform -rotate-90">
                <circle cx="24" cy="24" r="20" stroke="rgba(255,255,255,0.05)" strokeWidth="4" fill="transparent" />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke={calculateTotalScore() === 100 ? '#34d399' : calculateTotalScore() >= 60 ? '#fbbf24' : '#f87171'}
                  strokeWidth="4"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 20}`}
                  strokeDashoffset={`${2 * Math.PI * 20 * (1 - calculateTotalScore() / 100)}`}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <span className="absolute text-xs font-bold font-mono">{calculateTotalScore()}%</span>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white">System Integrity Report</h4>
              <p className="text-[11px] text-gray-400">
                {calculateTotalScore() === 100 
                  ? 'All services are executing with optimal low-latency direct SQL & Auth API loops.' 
                  : 'Degraded parameters detected. Verify credentials, Postgres permissions, or API network logs.'}
              </p>
            </div>
          </div>
          <div className="text-[11px] text-gray-500 font-mono self-end md:self-center">
            Piped live report • {new Date(report.timestamp).toLocaleTimeString()}
          </div>
        </div>
      )}

      {/* Bento Grid Diagnostics Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* PostgreSQL Direct Node-Client Diagnostic */}
        <motion.div
          whileHover={{ y: -2 }}
          className={`p-4 border rounded-xl flex flex-col justify-between h-44 transition-all duration-300 ${
            loading 
              ? 'border-white/5 bg-white/2 bg-pulse' 
              : getStatusColor(report?.database.status || 'checking')
          }`}
        >
          <div>
            <div className="flex items-start justify-between">
              <div className="p-1.5 bg-white/5 rounded-lg border border-white/10">
                <Database className="w-4 h-4 text-amber-400" />
              </div>
              {loading ? getStatusBadge('checking') : getStatusBadge(report?.database.status || 'checking')}
            </div>
            <h4 className="text-xs font-bold mt-3 text-white uppercase tracking-wider font-sans">1. Postgres Dialect Link</h4>
            <p className="text-[11px] text-gray-300/90 mt-1 line-clamp-3 leading-relaxed">
              {loading ? 'Establishing connection socket to db.qfabhexouufjeyipxoes.supabase.co:5432...' : report?.database.message}
            </p>
          </div>
          
          <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] font-mono text-gray-400">
            <span>Direct Client SQL</span>
            {report?.database.latency ? (
              <span className="flex items-center text-emerald-400">
                <Clock className="w-3 h-3 mr-1" /> {report.database.latency}ms
              </span>
            ) : null}
          </div>
        </motion.div>

        {/* REST PostgREST Edge Service Diagnostic */}
        <motion.div
          whileHover={{ y: -2 }}
          className={`p-4 border rounded-xl flex flex-col justify-between h-44 transition-all duration-300 ${
            loading 
              ? 'border-white/5 bg-white/2 bg-pulse' 
              : getStatusColor(report?.restApi.status || 'checking')
          }`}
        >
          <div>
            <div className="flex items-start justify-between">
              <div className="p-1.5 bg-white/5 rounded-lg border border-white/10">
                <Server className="w-4 h-4 text-amber-400" />
              </div>
              {loading ? getStatusBadge('checking') : getStatusBadge(report?.restApi.status || 'checking')}
            </div>
            <h4 className="text-xs font-bold mt-3 text-white uppercase tracking-wider font-sans">2. PostgREST Routing</h4>
            <p className="text-[11px] text-gray-300/90 mt-1 line-clamp-3 leading-relaxed">
              {loading ? 'Pinging secure API gateway via rest/v1 router endpoints...' : report?.restApi.message}
            </p>
          </div>
          
          <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] font-mono text-gray-400">
            <span>Edge PostgREST</span>
            {report?.restApi.latency ? (
              <span className="flex items-center text-emerald-400">
                <Clock className="w-3 h-3 mr-1" /> {report.restApi.latency}ms
              </span>
            ) : null}
          </div>
        </motion.div>

        {/* Auth (GoTrue) Microservice Diagnostic */}
        <motion.div
          whileHover={{ y: -2 }}
          className={`p-4 border rounded-xl flex flex-col justify-between h-44 transition-all duration-300 ${
            loading 
              ? 'border-white/5 bg-white/2 bg-pulse' 
              : getStatusColor(report?.authService.status || 'checking')
          }`}
        >
          <div>
            <div className="flex items-start justify-between">
              <div className="p-1.5 bg-white/5 rounded-lg border border-white/10">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
              </div>
              {loading ? getStatusBadge('checking') : getStatusBadge(report?.authService.status || 'checking')}
            </div>
            <h4 className="text-xs font-bold mt-3 text-white uppercase tracking-wider font-sans">3. GoTrue Auth Engine</h4>
            <p className="text-[11px] text-gray-300/90 mt-1 line-clamp-3 leading-relaxed">
              {loading ? 'Consulting auth/v1/health microservice status endpoints...' : report?.authService.message}
            </p>
          </div>
          
          <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] font-mono text-gray-400">
            <span>Auth GoTrue DB</span>
            {report?.authService.latency ? (
              <span className="flex items-center text-emerald-400">
                <Clock className="w-3 h-3 mr-1" /> {report.authService.latency}ms
              </span>
            ) : null}
          </div>
        </motion.div>
      </div>

      {/* Suggestion list based on status */}
      {report && !loading && (
        <div className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-2">
          <div className="flex items-center text-xs font-semibold text-amber-400">
            <CheckCircle2 className="w-4 h-4 mr-1.5" />
            <span>Connection Performance Guide</span>
          </div>
          <div className="text-[11px] text-gray-400 space-y-1.5 list-disc pl-1">
            {report.database.status === 'failed' ? (
              <div className="text-rose-300">
                ⚠️ <span className="font-semibold">Action Required:</span> The PostgreSQL database could not be queried. Please ensure your <span className="font-mono">DATABASE_URL</span> password is not escaped incorrectly, or that Supabase project isn't paused.
              </div>
            ) : (
              <div>
                ✓ <span className="text-gray-300">Database connection:</span> Server-to-database TCP handshakes are healthy and executing transaction queries.
              </div>
            )}
            
            {report.restApi.status === 'healthy' ? (
              <div>
                ✓ <span className="text-gray-300">Network reachability:</span> Edge servers are successfully pinging back within <span className="font-mono text-emerald-400 font-semibold">{report.restApi.latency}ms</span>. No outbound CORS issues detected on Node.js socket layers.
              </div>
            ) : (
              <div className="text-rose-300">
                ⚠️ REST API calls are failing. Ensure that the VITE_SUPABASE_URL contains a valid URL scheme (e.g. HTTPS) and is not blocked by local networks.
              </div>
            )}

            {report.authService.status === 'healthy' ? (
              <div>
                ✓ <span className="text-gray-300">GoTrue Auth Health:</span> Supabase user registration and security token exchange pipelines are fully operational.
              </div>
            ) : (
              <div className="text-amber-300">
                ⚠ Auth microservice responded with a warning. Double-check your GoTrue config rules or identity provider settings inside the Supabase control panel.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
