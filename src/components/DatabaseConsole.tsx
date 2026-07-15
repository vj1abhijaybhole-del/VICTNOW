import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Database, RefreshCw, CheckCircle, AlertTriangle, Trash2, X, Terminal, ArrowRight, ShieldCheck, HelpCircle, Activity, Lock, User, LogIn } from 'lucide-react';
import SupabaseDiagnostic from './SupabaseDiagnostic';

interface DatabaseConsoleProps {
  isOpen: boolean;
  onClose: () => void;
  onDataMutated?: () => void;
}

type TabType = 'profiles' | 'orders' | 'gifting_requests' | 'products' | 'invitations' | 'diagnostics' | 'credentials';

export default function DatabaseConsole({ isOpen, onClose, onDataMutated }: DatabaseConsoleProps) {
  const [activeTab, setActiveTab] = useState<TabType>('profiles');
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [dbTime, setDbTime] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any[]>([]);
  const [clearing, setClearing] = useState<string | null>(null);

  // Dynamic Product Editor States
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editIsLimitedEdition, setEditIsLimitedEdition] = useState(true);
  const [isSavingProduct, setIsSavingProduct] = useState(false);

  // Authentication State
  const [authToken, setAuthToken] = useState<string | null>(() => {
    return localStorage.getItem('admin_session_token');
  });
  const [usernameInput, setUsernameInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  // Change Credentials State
  const [newUsername, setNewUsername] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [credentialsError, setCredentialsError] = useState<string>('');
  const [credentialsSuccess, setCredentialsSuccess] = useState<string>('');
  const [isSavingCredentials, setIsSavingCredentials] = useState<boolean>(false);

  const handleLogout = () => {
    setAuthToken(null);
    localStorage.removeItem('admin_session_token');
    setData([]);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usernameInput, password: passwordInput })
      });
      if (res.ok) {
        const body = await res.json();
        if (body.success && body.token) {
          setAuthToken(body.token);
          localStorage.setItem('admin_session_token', body.token);
          setLoginError('');
        } else {
          setLoginError('Authentication failed. Token not returned.');
        }
      } else {
        const body = await res.json().catch(() => ({}));
        setLoginError(body.error || 'Invalid credentials');
      }
    } catch (err: any) {
      setLoginError(err.message || 'Login request failed. Server offline?');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleChangeCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCredentialsError('');
    setCredentialsSuccess('');

    if (newPassword !== confirmPassword) {
      setCredentialsError('Passwords do not match');
      return;
    }

    if (!newUsername.trim() || !newPassword.trim()) {
      setCredentialsError('Username and password cannot be empty');
      return;
    }

    setIsSavingCredentials(true);
    try {
      const res = await fetch('/api/admin/change-credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          username: newUsername,
          password: newPassword
        })
      });

      if (res.status === 401) {
        handleLogout();
        return;
      }

      if (res.ok) {
        setCredentialsSuccess('Admin credentials updated successfully!');
        setNewUsername('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        const body = await res.json().catch(() => ({}));
        setCredentialsError(body.error || 'Failed to update credentials');
      }
    } catch (err: any) {
      setCredentialsError(err.message || 'Request failed');
    } finally {
      setIsSavingCredentials(false);
    }
  };

  // Check database status
  const checkStatus = async () => {
    try {
      setStatus('checking');
      const res = await fetch('/api/db-status');
      if (res.ok) {
        const body = await res.json();
        if (body.status === 'connected') {
          setStatus('connected');
          setDbTime(new Date(body.time).toLocaleTimeString());
          setErrorMessage('');
        } else {
          setStatus('error');
          setErrorMessage(body.error || 'Unknown connection state');
        }
      } else {
        const body = await res.json().catch(() => ({}));
        setStatus('error');
        setErrorMessage(body.error || body.details || 'Server returned error status');
      }
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'Network request failed. Is the server running?');
    }
  };

  // Fetch table data
  const fetchTableData = async (table: TabType) => {
    if (!authToken) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/${table}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      if (res.status === 401) {
        handleLogout();
        return;
      }
      if (res.ok) {
        const result = await res.json();
        setData(result.data || []);
      } else {
        const errText = await res.text();
        console.error(`Failed to fetch ${table}:`, errText);
        setData([]);
      }
    } catch (err) {
      console.error(err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // Clear table data
  const handleClearTable = async (table: TabType) => {
    if (!authToken) return;
    if (!window.confirm(`Are you absolutely sure you want to clear all rows in the '${table}' table?`)) {
      return;
    }
    setClearing(table);
    try {
      const res = await fetch('/api/admin/clear-data', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ table })
      });
      if (res.status === 401) {
        handleLogout();
        return;
      }
      if (res.ok) {
        setData([]);
        await checkStatus();
      } else {
        const err = await res.json();
        alert(`Error clearing table: ${err.error}`);
      }
    } catch (err: any) {
      alert(`Request failed: ${err.message}`);
    } finally {
      setClearing(null);
    }
  };

  // Initialize edit form controls
  const startEditing = (product: any) => {
    setEditingProduct(product);
    setEditImageUrl(product.image_url || '');
    setEditDescription(product.description || '');
    setEditPrice(Number(product.price) || 0);
    setEditIsLimitedEdition(product.is_limited_edition !== false);
  };

  // Submit product modifications to Postgres
  const saveProductEdits = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setIsSavingProduct(true);
    try {
      const response = await fetch(`/api/admin/products/${editingProduct.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          image_url: editImageUrl,
          description: editDescription,
          price: editPrice,
          is_limited_edition: editIsLimitedEdition
        })
      });
      if (response.ok) {
        alert('Product details updated successfully in Postgres!');
        setEditingProduct(null);
        fetchTableData('products');
        if (onDataMutated) {
          onDataMutated();
        }
      } else {
        const body = await response.json().catch(() => ({}));
        alert(body.error || 'Failed to update product details');
      }
    } catch (err: any) {
      alert(`Request failed: ${err.message}`);
    } finally {
      setIsSavingProduct(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      const storedToken = localStorage.getItem('admin_session_token');
      if (storedToken !== authToken) {
        setAuthToken(storedToken);
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      checkStatus();
      setEditingProduct(null); // Clear editing state on switching tabs
      if (authToken && activeTab !== 'diagnostics' && activeTab !== 'credentials') {
        fetchTableData(activeTab);
      }
    }
  }, [isOpen, activeTab, authToken]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-5xl h-[85vh] flex flex-col bg-[#111215] border border-white/10 rounded-2xl overflow-hidden shadow-2xl text-white font-sans"
      >
        {/* Console Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-[#16171b]">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#d97706]/10 text-amber-400 rounded-lg border border-amber-500/20">
              <Database className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-semibold tracking-wide text-white flex items-center space-x-2">
                <span>Supabase Postgres Live Sync Monitor</span>
                <span className="px-2 py-0.5 text-2xs uppercase tracking-widest font-mono bg-amber-500/20 text-amber-300 rounded border border-amber-500/30">
                  DevConsole
                </span>
              </h2>
              <p className="text-xs text-gray-400">
                Connected to: <span className="font-mono text-amber-200/90 text-[11px]">db.qfabhexouufjeyipxoes.supabase.co</span>
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {authToken && (
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 rounded-lg text-xs font-mono transition-all hover:scale-102 cursor-pointer mr-2"
              >
                Sign Out
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {!authToken ? (
          /* Secure Login View */
          <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[#0e0f12] overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-md p-8 bg-[#16171b] border border-white/10 rounded-2xl shadow-xl space-y-6"
            >
              <div className="text-center space-y-2">
                <div className="mx-auto w-12 h-12 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20 flex items-center justify-center">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-base font-semibold tracking-wide text-white">Administrator Terminal Gate</h3>
                <p className="text-xs text-gray-400">Please authenticate to gain live access to database records, diagnostics, and sync controllers.</p>
              </div>

              {loginError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/25 rounded-xl flex items-center space-x-2 text-rose-400 text-xs font-mono">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider font-mono text-gray-400 font-semibold block">Admin Username</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 font-mono text-sm">@</span>
                    <input
                      type="text"
                      required
                      placeholder="e.g. admin"
                      value={usernameInput}
                      onChange={(e) => setUsernameInput(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 transition-all font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider font-mono text-gray-400 font-semibold block">Security Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 transition-all font-mono"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 disabled:bg-amber-500/50 text-black text-xs font-bold uppercase tracking-wider rounded-xl transition-all font-mono cursor-pointer flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/10 active:scale-[0.98] disabled:cursor-not-allowed"
                >
                  {isLoggingIn ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <span className="flex items-center space-x-1.5">
                      <LogIn className="w-3.5 h-3.5" />
                      <span>Authenticate Session</span>
                    </span>
                  )}
                </button>
              </form>

              <div className="pt-4 border-t border-white/5 text-center space-y-3">
                <p className="text-[10px] text-gray-500 font-mono">
                  SUPABASE: db.qfabhexouufjeyipxoes.supabase.co
                </p>
                <div className="p-3 bg-amber-500/5 rounded-xl border border-amber-500/10 text-left text-[11px] text-gray-400 leading-relaxed font-sans">
                  💡 <span className="font-semibold text-amber-300">Developer Security:</span> This console requires a valid administrator session. Credentials can be managed securely inside your server environment settings or via the database credentials tab once authorized.
                </div>
              </div>
            </motion.div>
          </div>
        ) : (
          /* Main Admin Console UI */
          <>
            {/* Status bar */}
            <div className="px-6 py-4 bg-[#141519] border-b border-white/5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-400 uppercase tracking-widest font-mono">Status:</span>
                  {status === 'checking' && (
                    <span className="flex items-center text-xs text-amber-400 font-medium">
                      <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Checking connection...
                    </span>
                  )}
                  {status === 'connected' && (
                    <span className="flex items-center text-xs text-emerald-400 font-medium bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                      <CheckCircle className="w-3.5 h-3.5 mr-1.5" /> Online & Connected (Live Sync)
                    </span>
                  )}
                  {status === 'error' && (
                    <span className="flex items-center text-xs text-rose-400 font-medium bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20">
                      <AlertTriangle className="w-3.5 h-3.5 mr-1.5" /> Connection Failed
                    </span>
                  )}
                </div>

                {status === 'connected' && (
                  <span className="text-xs text-gray-500 font-mono">
                    Server Time check: {dbTime}
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={checkStatus}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-xs font-mono rounded-lg border border-white/10 transition-all text-gray-300 hover:text-white"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Test Ping</span>
                </button>
              </div>
            </div>

        {/* Database Credentials Overview */}
        {status === 'error' && (
          <div className="p-4 mx-6 mt-4 bg-rose-500/5 border border-rose-500/20 rounded-xl flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-rose-300">PostgreSQL Connection Warning</h4>
              <p className="text-xs text-rose-200/80 mt-1">
                {errorMessage || 'The server could not communicate with the Supabase database. Please check that your database is up, password is correct, and firewall allows incoming SSL connections.'}
              </p>
              <div className="mt-3 p-2.5 bg-black/40 rounded border border-rose-500/10 font-mono text-[11px] text-rose-200 overflow-x-auto">
                DATABASE_URL=postgresql://postgres:******@db.qfabhexouufjeyipxoes.supabase.co:5432/postgres
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Table Sidebar Selectors */}
          <div className="w-full md:w-60 bg-[#141519] border-r border-white/10 p-4 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-y-auto shrink-0">
            <div className="hidden md:block text-2xs uppercase tracking-wider font-mono text-gray-500 px-3 mb-2">
              Select Public Table
            </div>

            <button
              onClick={() => setActiveTab('profiles')}
              className={`flex-1 md:flex-none flex items-center space-x-2.5 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left whitespace-nowrap ${
                activeTab === 'profiles'
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/25'
                  : 'bg-transparent text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Terminal className="w-4 h-4 shrink-0" />
              <div className="flex-1">
                <div>profiles</div>
                <div className="text-[10px] text-gray-500 font-normal">Customer registrations</div>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`flex-1 md:flex-none flex items-center space-x-2.5 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left whitespace-nowrap ${
                activeTab === 'orders'
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/25'
                  : 'bg-transparent text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Terminal className="w-4 h-4 shrink-0" />
              <div className="flex-1">
                <div>orders</div>
                <div className="text-[10px] text-gray-500 font-normal">Store checkout sales</div>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('gifting_requests')}
              className={`flex-1 md:flex-none flex items-center space-x-2.5 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left whitespace-nowrap ${
                activeTab === 'gifting_requests'
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/25'
                  : 'bg-transparent text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Terminal className="w-4 h-4 shrink-0" />
              <div className="flex-1">
                <div>gifting_requests</div>
                <div className="text-[10px] text-gray-500 font-normal">Custom corporate suites</div>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`flex-1 md:flex-none flex items-center space-x-2.5 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left whitespace-nowrap ${
                activeTab === 'products'
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/25'
                  : 'bg-transparent text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Terminal className="w-4 h-4 shrink-0" />
              <div className="flex-1">
                <div>products</div>
                <div className="text-[10px] text-gray-500 font-normal">Bespoke fragrance catalog</div>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('invitations')}
              className={`flex-1 md:flex-none flex items-center space-x-2.5 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left whitespace-nowrap ${
                activeTab === 'invitations'
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/25'
                  : 'bg-transparent text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Terminal className="w-4 h-4 shrink-0" />
              <div className="flex-1">
                <div>invitations</div>
                <div className="text-[10px] text-gray-500 font-normal">VIP reserve lists</div>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('diagnostics')}
              className={`flex-1 md:flex-none flex items-center space-x-2.5 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left whitespace-nowrap ${
                activeTab === 'diagnostics'
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/25'
                  : 'bg-transparent text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Activity className="w-4 h-4 shrink-0 text-amber-400" />
              <div className="flex-1">
                <div>Connection Health</div>
                <div className="text-[10px] text-gray-500 font-normal">Supabase Service Diagnostics</div>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('credentials')}
              className={`flex-1 md:flex-none flex items-center space-x-2.5 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left whitespace-nowrap ${
                activeTab === 'credentials'
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/25'
                  : 'bg-transparent text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Lock className="w-4 h-4 shrink-0 text-amber-400" />
              <div className="flex-1">
                <div>Change Credentials</div>
                <div className="text-[10px] text-gray-500 font-normal">Admin Username & Password</div>
              </div>
            </button>

            <div className="hidden md:block mt-auto pt-4 border-t border-white/5">
              <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                <h5 className="text-[11px] font-bold text-amber-300 uppercase tracking-widest flex items-center">
                  <ShieldCheck className="w-3 h-3 mr-1" />
                  Dual-Sync Design
                </h5>
                <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">
                  When users register, order, or submit designs, details are synchronized directly to Postgres instantly.
                </p>
              </div>
            </div>
          </div>

          {/* Table Data Viewer Container */}
          <div className="flex-1 flex flex-col min-w-0 bg-[#0e0f12]">
            {activeTab === 'diagnostics' ? (
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <SupabaseDiagnostic authToken={authToken} onUnauthorized={handleLogout} />
              </div>
            ) : activeTab === 'credentials' ? (
              <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center bg-[#0e0f12]">
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full max-w-md p-8 bg-[#16171b] border border-white/10 rounded-2xl shadow-xl space-y-6"
                >
                  <div className="text-center space-y-2">
                    <div className="mx-auto w-12 h-12 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20 flex items-center justify-center">
                      <Lock className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-semibold tracking-wide text-white">Change Admin Credentials</h3>
                    <p className="text-xs text-gray-400">Update your credentials stored on the server for the admin database console.</p>
                  </div>

                  {credentialsError && (
                    <div className="p-3 bg-rose-500/10 border border-rose-500/25 rounded-xl flex items-center space-x-2 text-rose-400 text-xs font-mono">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>{credentialsError}</span>
                    </div>
                  )}

                  {credentialsSuccess && (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/25 rounded-xl flex items-center space-x-2 text-emerald-400 text-xs font-mono">
                      <CheckCircle className="w-4 h-4 shrink-0" />
                      <span>{credentialsSuccess}</span>
                    </div>
                  )}

                  <form onSubmit={handleChangeCredentialsSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-wider font-mono text-gray-400 font-semibold block">New Username</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. secure_admin"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 transition-all font-mono"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-wider font-mono text-gray-400 font-semibold block">New Password</label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 transition-all font-mono"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-wider font-mono text-gray-400 font-semibold block">Confirm New Password</label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 transition-all font-mono"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSavingCredentials}
                      className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 disabled:bg-amber-500/50 text-black text-xs font-bold uppercase tracking-wider rounded-xl transition-all font-mono cursor-pointer flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/10 active:scale-[0.98] disabled:cursor-not-allowed"
                    >
                      {isSavingCredentials ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <span>Save New Credentials</span>
                      )}
                    </button>
                  </form>
                </motion.div>
              </div>
            ) : (
              <>
                {/* Table actions bar */}
            <div className="p-4 bg-[#121317] border-b border-white/5 flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-sm text-amber-300 font-semibold uppercase">
                  public.{activeTab}
                </span>
                <span className="text-xs text-gray-500">
                  ({data.length} rows loaded)
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => fetchTableData(activeTab)}
                  disabled={loading}
                  className="p-1.5 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg border border-white/5 disabled:opacity-50 transition-all"
                  title="Reload rows"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
                <button
                  onClick={() => handleClearTable(activeTab)}
                  disabled={clearing === activeTab || data.length === 0}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 disabled:opacity-40 text-xs font-mono rounded-lg border border-rose-500/20 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{clearing === activeTab ? 'Clearing...' : 'Truncate Table'}</span>
                </button>
              </div>
            </div>

            {/* Table Rows Scroll View */}
            <div className="flex-1 overflow-auto p-4">
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center space-y-3">
                  <RefreshCw className="w-8 h-8 text-amber-400 animate-spin" />
                  <p className="text-xs text-gray-400 font-mono">Querying PostgreSQL table schema public.{activeTab}...</p>
                </div>
              ) : activeTab === 'products' ? (
                /* Products Custom View */
                editingProduct ? (
                  /* Editing Product Form Overlay */
                  <form onSubmit={saveProductEdits} className="max-w-lg mx-auto bg-[#16171b] border border-white/10 rounded-2xl p-6 space-y-4">
                    <h4 className="font-serif text-base text-amber-300 tracking-wide font-extrabold uppercase border-b border-white/5 pb-2">
                      Edit Product: {editingProduct.id.toUpperCase()}
                    </h4>
                    
                    <div className="space-y-1 text-left">
                      <label className="text-[10px] uppercase tracking-wider font-mono text-gray-400 font-bold block text-left">Image URL</label>
                      <input
                        type="url"
                        required
                        value={editImageUrl}
                        onChange={(e) => setEditImageUrl(e.target.value)}
                        className="w-full px-4 py-2 bg-neutral-900 border border-white/10 rounded-xl text-xs text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 font-mono"
                      />
                    </div>

                    <div className="space-y-1 text-left">
                      <label className="text-[10px] uppercase tracking-wider font-mono text-gray-400 font-bold block text-left">Description</label>
                      <textarea
                        required
                        rows={4}
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className="w-full px-4 py-2 bg-neutral-900 border border-white/10 rounded-xl text-xs text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 font-sans leading-relaxed text-left"
                      />
                    </div>

                    <div className="space-y-1 text-left">
                      <label className="text-[10px] uppercase tracking-wider font-mono text-gray-400 font-bold block text-left">Price (INR)</label>
                      <input
                        type="number"
                        required
                        value={editPrice}
                        onChange={(e) => setEditPrice(Number(e.target.value))}
                        className="w-full px-4 py-2 bg-neutral-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500/50 font-mono"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-black/20 border border-white/5 rounded-xl">
                      <div className="text-left">
                        <span className="text-xs font-semibold text-white block">Limited Edition Status</span>
                        <span className="text-[10px] text-gray-400 font-mono">Toggles "LTD ED" versus "CLASSIC" pill</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEditIsLimitedEdition(!editIsLimitedEdition)}
                        className={`px-4 py-1.5 font-mono text-[10px] font-extrabold uppercase tracking-wider transition-all border rounded-lg cursor-pointer ${
                          editIsLimitedEdition
                            ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                            : 'bg-neutral-800 border-neutral-700 text-neutral-400'
                        }`}
                      >
                        {editIsLimitedEdition ? 'LTD ED Enabled' : 'Disabled (Classic)'}
                      </button>
                    </div>

                    <div className="flex items-center justify-end space-x-3 pt-4 border-t border-white/5">
                      <button
                        type="button"
                        onClick={() => setEditingProduct(null)}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold text-gray-300 transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSavingProduct}
                        className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-black rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg active:scale-95 disabled:opacity-50 cursor-pointer"
                      >
                        {isSavingProduct ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </form>
                ) : data.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto space-y-4">
                    <div className="p-4 bg-white/5 text-gray-500 rounded-full border border-white/5">
                      <Database className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-300">No products found inside public.products</h4>
                      <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                        Database table is empty or connection error.
                      </p>
                    </div>
                  </div>
                ) : (
                  /* Products grid list */
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.map((product) => (
                      <div key={product.id} className="bg-[#16171b] border border-white/10 rounded-2xl overflow-hidden p-4 flex flex-col space-y-3 relative">
                        {/* Limited pill indicator */}
                        <div className="absolute top-3 right-3">
                          {product.is_limited_edition !== false ? (
                            <span className="px-2 py-0.5 text-[8px] bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded font-mono uppercase tracking-widest">
                              Limited Edition
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 text-[8px] bg-neutral-800 text-neutral-400 border border-neutral-700 rounded font-mono uppercase tracking-widest">
                              Classic
                            </span>
                          )}
                        </div>

                        <div className="aspect-[3/2] rounded-xl overflow-hidden bg-neutral-950 flex items-center justify-center border border-white/5">
                          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>

                        <div className="text-left space-y-1 flex-1">
                          <h4 className="text-sm font-serif font-extrabold tracking-wider text-white uppercase">{product.name}</h4>
                          <p className="text-[10px] text-amber-400/80 font-mono tracking-widest uppercase">{product.tagline}</p>
                          <p className="text-xs text-emerald-400 font-bold font-mono">₹{product.price}</p>
                          <p className="text-[11px] text-gray-400 line-clamp-3 leading-relaxed font-sans">{product.description}</p>
                        </div>

                        <button
                          onClick={() => startEditing(product)}
                          className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs rounded-xl transition-colors cursor-pointer font-bold tracking-wider"
                        >
                          Edit Content
                        </button>
                      </div>
                    ))}
                  </div>
                )
              ) : data.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto space-y-4">
                  <div className="p-4 bg-white/5 text-gray-500 rounded-full border border-white/5">
                    <Database className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-300">No records found inside public.{activeTab}</h4>
                    <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                      You can instantly create a record in this table! Just interact with the app:
                    </p>
                    {activeTab === 'profiles' && (
                      <div className="mt-4 text-xs bg-[#16171b] p-3 rounded-lg border border-white/5 text-left text-gray-400 space-y-1.5">
                        <div className="flex items-center text-amber-300 font-medium">
                          <ArrowRight className="w-3.5 h-3.5 mr-1 text-amber-400" /> Let's create a Profile:
                        </div>
                        <div>1. Click <span className="text-white font-medium">"Client Portal" / "Access Suite"</span> in the main header.</div>
                        <div>2. Enter your Name, Email, and Mobile, and click register/verify.</div>
                        <div>3. Open this console again to see your user appear in Postgres!</div>
                      </div>
                    )}
                    {activeTab === 'orders' && (
                      <div className="mt-4 text-xs bg-[#16171b] p-3 rounded-lg border border-white/5 text-left text-gray-400 space-y-1.5">
                        <div className="flex items-center text-amber-300 font-medium">
                          <ArrowRight className="w-3.5 h-3.5 mr-1 text-amber-400" /> Let's place a Sales Order:
                        </div>
                        <div>1. Add any elegant fragrance to your shopping bag.</div>
                        <div>2. Open your Cart, click <span className="text-white font-medium">"Secure Order Portal"</span>.</div>
                        <div>3. Complete checkout details and execute. The order inserts right away!</div>
                      </div>
                    )}
                    {activeTab === 'gifting_requests' && (
                      <div className="mt-4 text-xs bg-[#16171b] p-3 rounded-lg border border-white/5 text-left text-gray-400 space-y-1.5">
                        <div className="flex items-center text-amber-300 font-medium">
                          <ArrowRight className="w-3.5 h-3.5 mr-1 text-amber-400" /> Let's customize corporate gifting:
                        </div>
                        <div>1. Scroll to the <span className="text-white font-medium">"Bespoke Personalization Studio"</span> section.</div>
                        <div>2. Enter custom recipient name, engraving message, ribbon, font style, and add to bag.</div>
                        <div>3. Since you are logged in, it will instantly sync the suite customization details!</div>
                      </div>
                    )}
                    {activeTab === 'invitations' && (
                      <div className="mt-4 text-xs bg-[#16171b] p-3 rounded-lg border border-white/5 text-left text-gray-400 space-y-1.5">
                        <div className="flex items-center text-amber-300 font-medium">
                          <ArrowRight className="w-3.5 h-3.5 mr-1 text-amber-400" /> Let's request a VIP invitation:
                        </div>
                        <div>1. Scroll down to the footer subscription field.</div>
                        <div>2. Type your corporate email address and hit the reserve key.</div>
                        <div>3. Instantly watch the live sync generate a VIP Code in the invitations database!</div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="border border-white/10 rounded-xl overflow-hidden bg-[#121317]">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#191a20] border-b border-white/10 text-gray-400 uppercase font-mono tracking-wider text-[10px]">
                        <th className="p-3">ID</th>
                        {activeTab === 'profiles' && (
                          <>
                            <th className="p-3">Email</th>
                            <th className="p-3">Mobile</th>
                            <th className="p-3">Full Name</th>
                            <th className="p-3">Updated At</th>
                          </>
                        )}
                        {activeTab === 'orders' && (
                          <>
                            <th className="p-3">Customer</th>
                            <th className="p-3">Contact</th>
                            <th className="p-3">Address</th>
                            <th className="p-3">Items Count</th>
                            <th className="p-3">Total Value</th>
                            <th className="p-3">Payment</th>
                            <th className="p-3">Created</th>
                          </>
                        )}
                        {activeTab === 'gifting_requests' && (
                          <>
                            <th className="p-3">Aroma ID</th>
                            <th className="p-3">Configuration</th>
                            <th className="p-3">Qty</th>
                            <th className="p-3">Recipient Name</th>
                            <th className="p-3">Bespoke Text</th>
                            <th className="p-3">Client Contact</th>
                            <th className="p-3">Timestamp</th>
                          </>
                        )}
                        {activeTab === 'invitations' && (
                          <>
                            <th className="p-3">VIP Corporate Email</th>
                            <th className="p-3">Assigned VIP Access Code</th>
                            <th className="p-3">Requested Timestamp</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-mono">
                      {data.map((row, idx) => (
                        <tr key={row.id || idx} className="hover:bg-white/5 transition-all text-gray-300">
                          <td className="p-3 font-semibold text-amber-400">{row.id}</td>
                          
                          {/* Profiles View */}
                          {activeTab === 'profiles' && (
                            <>
                              <td className="p-3 text-white selection:bg-amber-400 font-sans">{row.email}</td>
                              <td className="p-3">{row.mobile}</td>
                              <td className="p-3 font-sans text-gray-200">{row.name || <span className="text-gray-600 italic">none</span>}</td>
                              <td className="p-3 text-gray-500 text-[11px]">{new Date(row.updated_at).toLocaleDateString()} {new Date(row.updated_at).toLocaleTimeString()}</td>
                            </>
                          )}

                          {/* Orders View */}
                          {activeTab === 'orders' && (
                            <>
                              <td className="p-3 font-sans">
                                <div className="font-semibold text-white">{row.customer_name}</div>
                                <div className="text-[10px] text-gray-500">{row.customer_email}</div>
                              </td>
                              <td className="p-3">
                                <div>{row.customer_phone}</div>
                                {row.company && <div className="text-[10px] text-amber-400/80 font-sans">{row.company}</div>}
                              </td>
                              <td className="p-3 max-w-[150px] truncate font-sans" title={row.address}>
                                {row.address}
                              </td>
                              <td className="p-3">
                                <span className="px-1.5 py-0.5 bg-white/10 rounded font-bold">
                                  {Array.isArray(row.items) ? row.items.length : 0}
                                </span>
                              </td>
                              <td className="p-3 text-emerald-400 font-bold">₹{Number(row.total_price).toLocaleString()}</td>
                              <td className="p-3 text-2xs uppercase tracking-wider">{row.payment_method}</td>
                              <td className="p-3 text-gray-500 text-[11px]">{new Date(row.created_at).toLocaleDateString()}</td>
                            </>
                          )}

                          {/* Gifting Requests View */}
                          {activeTab === 'gifting_requests' && (
                            <>
                              <td className="p-3 uppercase text-amber-300 font-semibold">{row.perfume_id}</td>
                              <td className="p-3 font-sans">
                                <div className="text-gray-200 text-xs">Size: {row.size}</div>
                                <div className="text-[10px] text-gray-500">Ribbon: {row.ribbon_color} | Font: {row.font_style}</div>
                              </td>
                              <td className="p-3 text-center font-bold text-white">{row.quantity}</td>
                              <td className="p-3 font-sans text-gray-200">{row.recipient_name}</td>
                              <td className="p-3 max-w-[150px] truncate font-sans text-gray-400 italic" title={row.message}>
                                "{row.message}"
                              </td>
                              <td className="p-3">
                                <div className="text-2xs">{row.customer_email}</div>
                                {row.customer_phone && <div className="text-[10px] text-gray-500">{row.customer_phone}</div>}
                              </td>
                              <td className="p-3 text-gray-500 text-[11px]">{new Date(row.created_at).toLocaleDateString()}</td>
                            </>
                          )}

                          {/* Invitations View */}
                          {activeTab === 'invitations' && (
                            <>
                              <td className="p-3 text-white selection:bg-amber-400 font-sans">{row.email}</td>
                              <td className="p-3 text-amber-400 font-bold tracking-wider">{row.vip_code}</td>
                              <td className="p-3 text-gray-500 text-[11px]">{new Date(row.created_at).toLocaleDateString()} {new Date(row.created_at).toLocaleTimeString()}</td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
              </>
            )}
          </div>
        </div>
          </>
        )}

        {/* Footer info banner */}
        <div className="p-4 bg-[#141519] border-t border-white/10 flex items-center justify-between text-2xs text-gray-500 font-mono">
          <div>
            RECORDS STORED VIA DIRECT NODE-POSTGRES CLIENT POOL BINDINGS
          </div>
          <div>
            SECURE PORT 3000 MIDDLEWARE PROXY
          </div>
        </div>
      </motion.div>
    </div>
  );
}
