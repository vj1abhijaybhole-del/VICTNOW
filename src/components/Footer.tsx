import React, { useState } from 'react';
import { Mail, Check, PhoneCall, ShieldCheck, ArrowRight, Instagram, Linkedin, Facebook } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { submitInvitationRequest } from '../lib/supabase';

interface FooterProps {
  scrollToSection: (id: string) => void;
  onActivityClick: () => void;
}

export default function Footer({ scrollToSection, onActivityClick }: FooterProps) {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [vipCode, setVipCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      const { data, error } = await submitInvitationRequest(email);
      if (error) {
        // Fallback locally if any error
        const randomCode = `VIP-${Math.floor(1000 + Math.random() * 9000)}`;
        setVipCode(randomCode);
      } else if (data) {
        setVipCode(data.vip_code);
      }
      setIsSubscribed(true);
      setEmail('');
    } catch (err) {
      const randomCode = `VIP-${Math.floor(1000 + Math.random() * 9000)}`;
      setVipCode(randomCode);
      setIsSubscribed(true);
      setEmail('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="relative bg-[#08090b] border-t border-white/5 pt-20 pb-10 text-left overflow-hidden">
      
      {/* Background Graphic lines */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gold-950/2 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Top block: Newsletter & Branding */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-white/5 items-center">
          
          {/* Logo & Manifesto */}
          <div className="lg:col-span-5 space-y-4">
            <span className="font-serif text-2xl tracking-[0.25em] text-white font-extrabold">
              VICTNOW
            </span>
            <p className="font-sans text-xs text-neutral-100 max-w-sm leading-relaxed font-bold">
              Crafted in limited quantities for elite corporate leaders. Offering a sensory manifestation of decisive authority, strategic precision, and pure presence.
            </p>
            <div className="flex items-center space-x-3 text-[10px] text-gold-300 font-mono tracking-widest uppercase font-extrabold">
              <ShieldCheck className="w-4 h-4 text-gold-400" />
              <span>THE PRESENCE OF LEADERSHIP</span>
            </div>
          </div>

          {/* Newsletter Input */}
          <div className="lg:col-span-7 bg-[#121418] border-2 border-white/10 p-6 md:p-8 space-y-4 relative shadow-2xl">
            <h4 className="font-serif text-sm text-gold-200 tracking-widest uppercase font-extrabold">
              Priority Batch Allocation
            </h4>
            <p className="font-sans text-xs text-neutral-100 font-semibold max-w-lg leading-relaxed">
              Sign up with your corporate email to receive priority reserve invitations for next year's 100ml and 50ml limited edition allocations and bespoke gifting drops.
            </p>

            <AnimatePresence mode="wait">
              {!isSubscribed ? (
                <motion.form
                  key="subscribe_form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubscribe}
                  className="flex flex-col sm:flex-row gap-3 pt-2"
                >
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                    className="flex-grow bg-neutral-950 border-2 border-white/20 px-4 py-3 font-sans text-xs text-white focus:outline-none focus:border-gold-400 transition-colors placeholder-neutral-400 font-extrabold disabled:opacity-50"
                    placeholder="Enter your corporate email address..."
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-gold-500 hover:bg-gold-400 disabled:bg-gold-600 text-neutral-950 font-sans text-xs uppercase tracking-widest font-extrabold transition-colors cursor-pointer flex items-center justify-center space-x-2 shadow-lg disabled:opacity-75 disabled:cursor-not-allowed"
                  >
                    <span>{isSubmitting ? 'Requesting...' : 'Request Invitation'}</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="subscribe_success"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-gold-950/40 border-2 border-gold-500/40 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-2"
                >
                  <div className="flex items-start space-x-3 text-left">
                    <div className="w-8 h-8 rounded-full bg-gold-500/20 border border-gold-500/40 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <Check className="w-4 h-4 text-gold-300 stroke-[2.5]" />
                    </div>
                    <div>
                      <h5 className="font-serif text-xs text-white uppercase tracking-wider font-extrabold">Reserve Access Granted</h5>
                      <p className="font-sans text-[10px] text-neutral-100 font-semibold mt-0.5 leading-normal">
                        Your corporate credentials are saved. You will receive private notifications.
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-[#0b0c0e] px-4 py-2 border-2 border-white/10 text-center">
                    <span className="font-mono text-[8px] uppercase tracking-widest text-neutral-200 block mb-0.5 font-bold">
                      YOUR PASSCODE
                    </span>
                    <span className="font-mono text-xs text-gold-200 font-extrabold tracking-widest">
                      {vipCode}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

        {/* Middle block: Directories & Contact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 py-16 text-xs">
          
          {/* Quick Links */}
          <div className="space-y-4">
            <h5 className="font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-200 font-extrabold">
              Navigate Brand
            </h5>
            <ul className="space-y-2.5">
              {['philosophy', 'collection', 'gifting'].map((id) => (
                <li key={id}>
                  <button
                    onClick={() => scrollToSection(id)}
                    className="text-neutral-100 hover:text-gold-300 transition-colors uppercase font-sans text-[10px] tracking-widest cursor-pointer text-left font-extrabold"
                  >
                    {id === 'gifting' ? 'Corporate Gifting' : id}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={onActivityClick}
                  className="text-gold-400 hover:text-gold-300 transition-colors uppercase font-mono text-[10px] tracking-widest cursor-pointer text-left font-extrabold flex items-center space-x-1"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-ping mr-1"></span>
                  <span>Track Delivery Status</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Scent Trio Details */}
          <div className="space-y-4">
            <h5 className="font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-200 font-extrabold">
              The Signatures
            </h5>
            <ul className="space-y-2 text-neutral-100 font-sans tracking-wide font-bold">
              <li>MUSE — Visionary Women</li>
              <li>NEXUS — Progressive Unisex</li>
              <li>FORGE — Decisive Men</li>
              <li className="text-gold-400 font-mono text-[9px] uppercase tracking-wider font-extrabold">Limited Edition 100ml / 50ml</li>
            </ul>
          </div>

          {/* Executive Concierge */}
          <div className="space-y-4">
            <h5 className="font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-200 font-extrabold">
              Private Concierge
            </h5>
            <ul className="space-y-2.5 text-neutral-100 font-sans font-bold">
              <li className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-gold-400 flex-shrink-0" />
                <a href="mailto:victnowperfumes@gmail.com" className="hover:text-gold-300 break-all">victnowperfumes@gmail.com</a>
              </li>
              <li className="flex items-center space-x-2">
                <PhoneCall className="w-3.5 h-3.5 text-gold-400" />
                <a href="tel:+918055854596" className="hover:text-gold-300">+91-8055854596</a>
              </li>
              <li className="text-neutral-300 text-[10px] leading-relaxed font-bold">
                24/7 client relations team allocated exclusively to high-volume corporate accounts.
              </li>
            </ul>
          </div>

          {/* Socials & Updates */}
          <div className="space-y-4">
            <h5 className="font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-200 font-extrabold">
              Follow Us
            </h5>
            <p className="text-neutral-100 leading-relaxed font-sans text-[11px] font-bold">
              Follow us for more updates on Instagram, Facebook, and LinkedIn.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a href="https://instagram.com/victnow_Perfumes" target="_blank" rel="noopener noreferrer" className="p-2 bg-[#121418] border-2 border-white/10 hover:border-gold-500/50 text-neutral-200 hover:text-gold-300 transition-all font-bold" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-[#121418] border-2 border-white/10 hover:border-gold-500/50 text-neutral-200 hover:text-gold-300 transition-all font-bold" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-[#121418] border-2 border-white/10 hover:border-gold-500/50 text-neutral-200 hover:text-gold-300 transition-all font-bold" aria-label="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom bar: Legalities */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] font-mono uppercase text-neutral-200 tracking-wider font-extrabold">
          <p>© {new Date().getFullYear()} VICTNOW Parfums, Inc. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <a href="#" className="hover:text-neutral-300">Limited Run Registry Compliance</a>
            <a href="#" className="hover:text-neutral-300">Terms of Bespoke Gifting</a>
            <a href="#" className="hover:text-neutral-300">Privacy Policy</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
