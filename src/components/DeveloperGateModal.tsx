import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, Key, Lock, AlertTriangle, Terminal, Eye, EyeOff } from 'lucide-react';

interface DeveloperGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (token: string) => void;
}

export default function DeveloperGateModal({ isOpen, onClose, onSuccess }: DeveloperGateModalProps) {
  const [accessKey, setAccessKey] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showKey, setShowKey] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!accessKey.trim()) {
      setError('Please provide the developer security key.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/admin/verify-access-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: accessKey.trim() })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.token) {
          // Store token and call success handler
          localStorage.setItem('admin_session_token', data.token);
          onSuccess(data.token);
          setAccessKey('');
        } else {
          setError('Verification succeeded but session token is missing.');
        }
      } else {
        const errData = await res.json().catch(() => ({}));
        setError(errData.error || 'Access Denied. Invalid developer passcode.');
      }
    } catch (err: any) {
      setError(err.message || 'Verification request failed. Server offline?');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative w-full max-w-md bg-[#111215] border border-white/10 rounded-2xl overflow-hidden shadow-2xl text-white font-sans p-8 space-y-6"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-white hover:bg-white/5 rounded-xl transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Icon and Header */}
          <div className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 animate-pulse" />
            </div>
            <h3 className="text-lg font-serif font-extrabold tracking-wide uppercase text-white">
              Developer Access Gate
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-xs mx-auto">
              Secure developer verification required to summon the database monitor. This gate is validated server-side.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start space-x-2.5 text-rose-400 text-xs font-mono"
            >
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="leading-normal">{error}</span>
            </motion.div>
          )}

          {/* Secure Passcode Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-mono text-neutral-400 font-bold block">
                Developer Security Key
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
                  <Key className="w-4 h-4" />
                </div>
                <input
                  type={showKey ? 'text' : 'password'}
                  required
                  autoFocus
                  placeholder="Enter secret developer key"
                  value={accessKey}
                  onChange={(e) => setAccessKey(e.target.value)}
                  className="w-full pl-9 pr-10 py-3 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500/50 transition-all font-mono tracking-wide"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 disabled:bg-amber-500/50 text-black text-xs font-bold uppercase tracking-wider rounded-xl transition-all font-mono cursor-pointer flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/10 active:scale-[0.98] disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <Terminal className="w-4 h-4 animate-spin" />
              ) : (
                <span className="flex items-center space-x-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Verify Passcode</span>
                </span>
              )}
            </button>
          </form>

          {/* Bottom security text */}
          <div className="pt-4 border-t border-white/5 text-center">
            <p className="text-[9px] text-neutral-500 font-mono tracking-wide">
              SECURITY SHIELD ACTIVE • NO RE-AUTHENTICATION BYPASS ALLOWED
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
