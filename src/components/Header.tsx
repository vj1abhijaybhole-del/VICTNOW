import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X, Award, ShieldCheck, User, LogOut, Phone, Mail, Copy, Check, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User as UserType } from '../types';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  scrollToSection: (id: string) => void;
  currentUser: UserType | null;
  onLoginClick: () => void;
  onLogout: () => void;
  onActivityClick: () => void;
}

export default function Header({ 
  cartCount, 
  onOpenCart, 
  scrollToSection,
  currentUser,
  onLoginClick,
  onLogout,
  onActivityClick
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isContactDropdownOpen, setIsContactDropdownOpen] = useState(false);
  const [isMobileContactOpen, setIsMobileContactOpen] = useState(false);
  const [copiedType, setCopiedType] = useState<'phone' | 'email' | null>(null);

  const handleCopy = (text: string, type: 'phone' | 'email') => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Philosophy', id: 'philosophy' },
    { name: 'Collection', id: 'collection' },
    { name: 'Corporate Gifting', id: 'gifting' },
  ];

  const handleNavClick = (id: string) => {
    setIsMobileMenuOpen(false);
    scrollToSection(id);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-500 ${
          isScrolled
            ? 'py-4 bg-[#0b0c0ee6] backdrop-blur-md border-b border-white/5 shadow-lg'
            : 'py-6 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          
          {/* Brand Logo & Tagline */}
          <div 
            onClick={() => scrollToSection('hero')} 
            className="flex flex-col cursor-pointer group"
          >
            <span className="font-serif text-2xl md:text-3xl tracking-[0.25em] text-white font-extrabold group-hover:text-gold-300 transition-colors duration-300">
              VICTNOW
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-gold-400 mt-1 pl-[2px] transition-all duration-500 group-hover:tracking-[0.4em] font-bold">
              Presence of Leadership
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-10 relative">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="font-sans text-xs uppercase tracking-[0.2em] text-neutral-100 hover:text-gold-300 transition-colors duration-300 cursor-pointer text-left font-extrabold"
              >
                {item.name}
              </button>
            ))}

            {/* Contact Us Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setIsContactDropdownOpen(true)}
              onMouseLeave={() => setIsContactDropdownOpen(false)}
            >
              <button
                onClick={() => setIsContactDropdownOpen(!isContactDropdownOpen)}
                className={`font-sans text-xs uppercase tracking-[0.2em] transition-colors duration-300 cursor-pointer text-left font-extrabold flex items-center space-x-1 ${
                  isContactDropdownOpen ? 'text-gold-300' : 'text-neutral-100 hover:text-gold-300'
                }`}
                id="contact-us-trigger-btn"
              >
                <span>Contact Us</span>
                <span className="text-[7px] opacity-60">▼</span>
              </button>

              <AnimatePresence>
                {isContactDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-72 bg-[#0d0f12]/95 backdrop-blur-md border border-white/10 p-5 rounded shadow-2xl z-50 flex flex-col space-y-4"
                    id="contact-us-popover"
                  >
                    <div className="border-b border-white/5 pb-2">
                      <span className="font-serif text-sm text-gold-300 font-extrabold block">
                        Elite Concierge Line
                      </span>
                      <span className="font-mono text-[8px] uppercase tracking-widest text-neutral-400 mt-0.5 block font-bold">
                        Direct Customer Support
                      </span>
                    </div>

                    {/* Mobile Line */}
                    <div className="space-y-1 text-left">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-400 block font-bold">
                        Call / WhatsApp
                      </span>
                      <div className="flex items-center justify-between group">
                        <a
                          href="tel:+918055854596"
                          className="font-sans text-xs text-white hover:text-gold-300 transition-colors flex items-center space-x-2 font-bold"
                        >
                          <Phone className="w-3.5 h-3.5 text-gold-400" />
                          <span>+91 80558 54596</span>
                        </a>
                        <button
                          onClick={() => handleCopy('+918055854596', 'phone')}
                          className="p-1 hover:bg-white/5 text-neutral-400 hover:text-white transition-all rounded cursor-pointer"
                          title="Copy Mobile"
                        >
                          {copiedType === 'phone' ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Email Line */}
                    <div className="space-y-1 text-left">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-400 block font-bold">
                        Priority Email
                      </span>
                      <div className="flex items-center justify-between group">
                        <a
                          href="mailto:concierge@victnow.com"
                          className="font-sans text-xs text-white hover:text-gold-300 transition-colors flex items-center space-x-2 font-bold"
                        >
                          <Mail className="w-3.5 h-3.5 text-gold-400" />
                          <span>concierge@victnow.com</span>
                        </a>
                        <button
                          onClick={() => handleCopy('concierge@victnow.com', 'email')}
                          className="p-1 hover:bg-white/5 text-neutral-400 hover:text-white transition-all rounded cursor-pointer"
                          title="Copy Email"
                        >
                          {copiedType === 'email' ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/5 text-center">
                      <span className="font-mono text-[9px] text-neutral-500 font-semibold block">
                        Response target: Under 15 Minutes
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Right Controls */}
          <div className="flex items-center space-x-4">
            {/* Track Orders Button */}
            <button
              onClick={onActivityClick}
              className="hidden sm:flex items-center space-x-1.5 px-3.5 py-1.5 bg-gold-500/10 hover:bg-gold-500 hover:text-neutral-950 border border-gold-500/30 hover:border-gold-400 text-gold-400 transition-all rounded-full cursor-pointer font-bold text-[9px] font-mono uppercase tracking-wider shadow-md shadow-gold-500/5"
              id="header-track-orders-btn"
            >
              <Package className="w-3 h-3 animate-pulse" />
              <span>Track Orders</span>
            </button>

            {/* Auth Profile / Login Trigger */}
            {currentUser ? (
              <div 
                className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-gold-950/30 border border-gold-500/30 hover:border-gold-400/50 hover:bg-gold-900/30 rounded-full cursor-pointer transition-all" 
                id="user-profile-badge"
                onClick={onActivityClick}
                title="View Client History Ledger"
              >
                <User className="w-3.5 h-3.5 text-gold-400" />
                <span className="font-mono text-[9px] uppercase tracking-wider text-gold-300 font-extrabold max-w-[100px] truncate">
                  {currentUser.name || currentUser.email.split('@')[0]}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onLogout();
                  }}
                  className="p-0.5 hover:text-red-400 text-neutral-400 transition-colors ml-1 cursor-pointer"
                  title="Logout session"
                  id="header-logout-btn"
                >
                  <LogOut className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 bg-[#121418] border border-white/10 hover:border-gold-500/40 hover:text-gold-300 transition-all rounded-full cursor-pointer font-bold text-[9px] font-mono uppercase tracking-wider"
                id="header-login-btn"
              >
                <User className="w-3 h-3 text-gold-400" />
                <span>Client Login</span>
              </button>
            )}

            {/* VIP Status Tag */}
            <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 bg-neutral-900/60 border border-white/5 rounded-full">
              <Award className="w-3.5 h-3.5 text-gold-400" />
              <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-400 font-bold">
                LTD EDITIONS
              </span>
            </div>

            {/* Cart Trigger */}
            <button
              onClick={onOpenCart}
              className="relative p-2 text-white hover:text-gold-300 transition-colors duration-300 focus:outline-none cursor-pointer"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute -top-1 -right-1 bg-gold-500 text-[#0b0c0e] font-mono text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-lg"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-white hover:text-gold-300 transition-colors duration-300 focus:outline-none cursor-pointer"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 stroke-[1.5]" />
              ) : (
                <Menu className="w-6 h-6 stroke-[1.5]" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 w-full h-screen bg-[#0b0c0ee6] backdrop-blur-xl z-30 pt-28 px-12 flex flex-col space-y-8 lg:hidden"
          >
            <div className="flex flex-col space-y-6">
              {navItems.map((item, i) => (
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className="font-serif text-2xl tracking-widest text-left text-neutral-300 hover:text-gold-300 transition-colors duration-300 py-2 border-b border-white/5"
                >
                  {item.name}
                </motion.button>
              ))}

              {/* Contact Us Mobile Collapsible */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navItems.length * 0.05 }}
                className="py-2 border-b border-white/5 flex flex-col"
              >
                <button
                  onClick={() => setIsMobileContactOpen(!isMobileContactOpen)}
                  className="font-serif text-2xl tracking-widest text-left text-neutral-300 hover:text-gold-300 transition-colors duration-300 flex items-center justify-between w-full"
                >
                  <span>Contact Us</span>
                  <span className="text-sm text-gold-400">{isMobileContactOpen ? '▲' : '▼'}</span>
                </button>
                
                <AnimatePresence>
                  {isMobileContactOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden space-y-4 mt-4 pl-2"
                    >
                      <div className="space-y-1">
                        <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-400 block font-bold">
                          Direct Line / WhatsApp
                        </span>
                        <a
                          href="tel:+918055854596"
                          className="font-sans text-sm text-white hover:text-gold-300 transition-colors flex items-center space-x-2 font-bold"
                        >
                          <Phone className="w-4 h-4 text-gold-400" />
                          <span>+91 80558 54596</span>
                        </a>
                      </div>
                      
                      <div className="space-y-1">
                        <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-400 block font-bold">
                          Email Support
                        </span>
                        <a
                          href="mailto:concierge@victnow.com"
                          className="font-sans text-sm text-white hover:text-gold-300 transition-colors flex items-center space-x-2 font-bold"
                        >
                          <Mail className="w-4 h-4 text-gold-400" />
                          <span>concierge@victnow.com</span>
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Mobile Auth Integration */}
              {currentUser ? (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navItems.length * 0.05 }}
                  className="py-4 border-b border-white/5 flex items-center justify-between"
                  id="mobile-user-profile"
                >
                  <div 
                    className="flex items-center space-x-3 cursor-pointer group" 
                    onClick={() => {
                      onActivityClick();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <User className="w-5 h-5 text-gold-400 group-hover:text-white transition-colors" />
                    <div className="flex flex-col">
                      <span className="font-serif text-lg text-white font-extrabold leading-tight group-hover:text-gold-300 transition-colors">
                        {currentUser.name || 'VIP Member'}
                      </span>
                      <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-400 group-hover:text-neutral-200 transition-colors">
                        {currentUser.email} (View History)
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      onLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="p-2 border border-white/10 hover:border-red-500/30 text-neutral-400 hover:text-red-400 transition-all font-bold text-xs"
                    id="mobile-logout-btn"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </motion.div>
              ) : (
                <div className="flex flex-col space-y-3 w-full">
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navItems.length * 0.05 }}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onActivityClick();
                    }}
                    className="w-full py-3 bg-gold-500/10 border-2 border-gold-500/40 text-gold-400 font-mono text-xs uppercase tracking-widest text-center transition-all font-bold flex items-center justify-center space-x-2 rounded"
                    id="mobile-track-orders-btn"
                  >
                    <Package className="w-4 h-4 animate-pulse" />
                    <span>Track Orders</span>
                  </motion.button>

                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (navItems.length + 1) * 0.05 }}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onLoginClick();
                    }}
                    className="w-full py-3 bg-[#121418] border border-white/10 hover:border-gold-500/40 text-gold-400 hover:text-gold-300 font-mono text-xs uppercase tracking-widest text-center transition-all font-bold flex items-center justify-center space-x-2 rounded"
                    id="mobile-login-btn-action"
                  >
                    <User className="w-4 h-4" />
                    <span>Client Login</span>
                  </motion.button>
                </div>
              )}
            </div>

            <div className="pt-8 border-t border-white/5 flex flex-col space-y-4">
              <div className="flex items-center space-x-3 text-gold-400">
                <ShieldCheck className="w-5 h-5" />
                <span className="font-mono text-xs uppercase tracking-wider">
                  Concierge Support Enabled
                </span>
              </div>
              <p className="font-sans text-xs text-neutral-500 tracking-wide leading-relaxed">
                VICTNOW fragrances are crafted under strict quality standards. Standard delivery includes secure, premium delivery dispatch.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
