import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Phone, User, Sparkles, ShieldCheck } from 'lucide-react';
import { User as UserType } from '../types';
import { saveUserProfile } from '../lib/supabase';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserType) => void;
  title?: string;
  subtitle?: string;
}

export default function LoginModal({
  isOpen,
  onClose,
  onLoginSuccess,
  title = "Authenticate Your Access",
  subtitle = "To reserve limited edition batches and custom formulations, please verify your details."
}: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please provide a valid corporate or personal email address.');
      return;
    }

    // Mobile validation (simple: digits and some common characters like +, -, spaces)
    const phoneCleaned = mobile.replace(/[^0-9+]/g, '');
    if (phoneCleaned.length < 8) {
      setError('Please provide a valid contact number (at least 8 digits).');
      return;
    }

    setIsSubmitting(true);

    // Save profile to Supabase database
    saveUserProfile(email, mobile, name.trim() || undefined);

    // Simulate luxury verification
    setTimeout(() => {
      setIsSubmitting(false);
      onLoginSuccess({
        email,
        mobile,
        name: name.trim() || undefined
      });
      setEmail('');
      setMobile('');
      setName('');
      onClose();
    }, 1000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop with sophisticated heavy blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
            id="login-backdrop"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-lg bg-[#111317] border-2 border-gold-500/20 shadow-2xl overflow-hidden z-10"
            id="login-modal-box"
          >
            {/* Top decorative gold bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
              aria-label="Close authentication screen"
              id="close-login-modal"
            >
              <X className="w-5 h-5 stroke-[1.5]" />
            </button>

            {/* Body */}
            <div className="p-8 md:p-10">
              <div className="flex items-center space-x-2 text-gold-400 mb-4 justify-center">
                <Sparkles className="w-5 h-5 animate-pulse" />
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] font-extrabold">VICTNOW Elite Club</span>
              </div>

              <h3 className="font-serif text-2xl md:text-3xl text-white text-center tracking-wider font-extrabold mb-2" id="login-title">
                {title}
              </h3>
              <p className="text-neutral-300 text-xs text-center leading-relaxed font-sans font-medium mb-8 max-w-sm mx-auto">
                {subtitle}
              </p>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Optional Full Name */}
                <div className="space-y-1.5">
                  <label className="block font-mono text-[9px] uppercase tracking-widest text-neutral-400 font-extrabold">
                    Full Name <span className="text-neutral-500 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g., Abhijay Bhole"
                      className="w-full bg-[#16181d] border border-white/10 focus:border-gold-500/50 text-white pl-11 pr-4 py-3.5 text-xs font-sans placeholder-neutral-600 outline-none transition-all font-bold"
                    />
                  </div>
                </div>

                {/* Email Address - Required */}
                <div className="space-y-1.5">
                  <label className="block font-mono text-[9px] uppercase tracking-widest text-neutral-400 font-extrabold">
                    Email Address <span className="text-gold-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g., victnowperfumes@gmail.com"
                      className="w-full bg-[#16181d] border border-white/10 focus:border-gold-500/50 text-white pl-11 pr-4 py-3.5 text-xs font-sans placeholder-neutral-600 outline-none transition-all font-bold"
                    />
                  </div>
                </div>

                {/* Mobile Number - Required */}
                <div className="space-y-1.5">
                  <label className="block font-mono text-[9px] uppercase tracking-widest text-neutral-400 font-extrabold">
                    Mobile Number <span className="text-gold-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <input
                      required
                      type="tel"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="e.g., +91-8055854596"
                      className="w-full bg-[#16181d] border border-white/10 focus:border-gold-500/50 text-white pl-11 pr-4 py-3.5 text-xs font-sans placeholder-neutral-600 outline-none transition-all font-bold"
                    />
                  </div>
                </div>

                {/* Error Banner */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3.5 bg-red-950/20 border border-red-500/30 text-red-400 font-sans text-xs font-semibold leading-relaxed"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 hover:from-gold-500 hover:to-gold-400 text-[#0b0c0e] font-sans text-xs font-extrabold uppercase tracking-[0.2em] transition-all flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50 cursor-pointer"
                  id="submit-login"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#0b0c0e] border-t-transparent rounded-full animate-spin" />
                      <span>Verifying Client Status...</span>
                    </>
                  ) : (
                    <span>Verify and Access Collection</span>
                  )}
                </button>
              </form>

              {/* Secure Concierge Footnote */}
              <div className="mt-8 pt-6 border-t border-white/5 flex items-start space-x-3 text-left">
                <ShieldCheck className="w-4 h-4 text-gold-400 mt-0.5 flex-shrink-0" />
                <p className="font-sans text-[10px] text-neutral-400 leading-relaxed font-semibold">
                  By providing your corporate email and secure contact number, you gain direct priority placement on all production runs. No marketing spam. Real-time courier dispatch only.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
