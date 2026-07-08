import React from 'react';
import { motion } from 'motion/react';
import { ArrowDown, Award, Send } from 'lucide-react';
import { heroImg } from '../data';

interface HeroProps {
  onExploreClick: () => void;
  onGiftingClick: () => void;
}

export default function Hero({ onExploreClick, onGiftingClick }: HeroProps) {
  return (
    <section id="hero" className="relative w-full min-h-screen flex items-center justify-center overflow-hidden pt-20">
      
      {/* Background Cinematic Image with Luxury Vignette Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImg}
          alt="VICTNOW Presence of Leadership luxury presentation"
          className="w-full h-full object-cover object-center scale-105 filter brightness-[0.45] saturate-[0.85] transition-all duration-1000"
          referrerPolicy="no-referrer"
        />
        {/* Gradients to darken borders and integrate beautifully */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0c0e] via-transparent to-[#0b0c0e] opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c0e] via-transparent to-transparent opacity-90" />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Gold Radial Accent Glow in Background */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-gold-600/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 text-center flex flex-col items-center">
        
        {/* VIP Subtitle Tag */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="flex items-center space-x-2 px-4 py-1.5 bg-neutral-900/80 backdrop-blur-md border border-gold-500/30 rounded-full mb-8 shadow-gold-glow"
        >
          <Award className="w-4.5 h-4.5 text-gold-400" />
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-gold-300 font-medium pl-[2px]">
            Limited Edition Collection
          </span>
        </motion.div>

        {/* Brand Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
          className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-[0.2em] text-white font-medium mb-4 leading-none"
        >
          VICTNOW
        </motion.h1>

        {/* Tagline "presence of leadership" */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
          className="font-serif text-xl md:text-2xl lg:text-3xl italic tracking-widest text-gold-300 max-w-3xl font-bold mb-8"
        >
          presence of leadership
        </motion.p>

        {/* Elegant divider line */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: '120px', opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="h-[1.5px] bg-gradient-to-r from-transparent via-gold-400 to-transparent mb-8"
        />

        {/* Description Copy */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="font-sans text-xs md:text-sm text-neutral-200 max-w-xl tracking-wide leading-relaxed mb-12 font-semibold"
        >
          Three rare scents in 50ml and 100ml. Formulated with pure ingredients for visionary leaders.
          <span className="text-gold-400 block mt-2 font-extrabold text-sm md:text-base">Command with unspoken authority.</span>
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full max-w-md"
        >
          {/* Main call to action */}
          <button
            onClick={onExploreClick}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-neutral-950 font-sans text-xs uppercase tracking-[0.25em] font-extrabold rounded-none shadow-xl cursor-pointer transition-all duration-300 transform hover:-translate-y-0.5 relative overflow-hidden shimmer-btn group"
          >
            Explore Trio
          </button>

          {/* Secondary CTA */}
          <button
            onClick={onGiftingClick}
            className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-white/60 hover:border-gold-400 hover:bg-white/10 text-white hover:text-gold-300 font-sans text-xs uppercase tracking-[0.25em] font-bold rounded-none transition-all duration-300 cursor-pointer flex items-center justify-center space-x-2 shadow-md"
          >
            <span>Corporate Gifting</span>
            <Send className="w-3.5 h-3.5 stroke-[2]" />
          </button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, delay: 1.5 }}
          onClick={onExploreClick}
          className="mt-16 flex flex-col items-center cursor-pointer group"
        >
          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-neutral-200 font-extrabold group-hover:text-gold-400 transition-colors mb-2">
            SCROLL TO DISCOVER
          </span>
          <ArrowDown className="w-4 h-4 text-neutral-300 group-hover:text-gold-400 transition-colors animate-bounce stroke-[2]" />
        </motion.div>

      </div>
    </section>
  );
}
