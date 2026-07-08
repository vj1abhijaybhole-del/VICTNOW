import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X, Award, ShieldCheck, User, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User as UserType } from '../types';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  scrollToSection: (id: string) => void;
  currentUser: UserType | null;
  onLoginClick: () => void;
  onLogout: () => void;
}

export default function Header({ 
  cartCount, 
  onOpenCart, 
  scrollToSection,
  currentUser,
  onLoginClick,
  onLogout
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
          <nav className="hidden lg:flex items-center space-x-10">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="font-sans text-xs uppercase tracking-[0.2em] text-neutral-100 hover:text-gold-300 transition-colors duration-300 cursor-pointer text-left font-extrabold"
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center space-x-6">
            {/* Auth Profile / Login Trigger */}
            {currentUser ? (
              <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-gold-950/30 border border-gold-500/30 rounded-full" id="user-profile-badge">
                <User className="w-3.5 h-3.5 text-gold-400" />
                <span className="font-mono text-[9px] uppercase tracking-wider text-gold-300 font-extrabold max-w-[100px] truncate">
                  {currentUser.name || currentUser.email.split('@')[0]}
                </span>
                <button
                  onClick={onLogout}
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

              {/* Mobile Auth Integration */}
              {currentUser ? (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navItems.length * 0.05 }}
                  className="py-4 border-b border-white/5 flex items-center justify-between"
                  id="mobile-user-profile"
                >
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-gold-400" />
                    <div className="flex flex-col">
                      <span className="font-serif text-lg text-white font-extrabold leading-tight">
                        {currentUser.name || 'VIP Member'}
                      </span>
                      <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-400">
                        {currentUser.email}
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
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navItems.length * 0.05 }}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onLoginClick();
                  }}
                  className="w-full py-3 bg-[#121418] border border-white/10 hover:border-gold-500/40 text-gold-400 hover:text-gold-300 font-mono text-xs uppercase tracking-widest text-center transition-all font-bold flex items-center justify-center space-x-2"
                  id="mobile-login-btn-action"
                >
                  <User className="w-4 h-4" />
                  <span>Client Login</span>
                </motion.button>
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
                VICTNOW fragrances are crafted under strict quality standards. Standard delivery includes secure, white-glove courier dispatch.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
