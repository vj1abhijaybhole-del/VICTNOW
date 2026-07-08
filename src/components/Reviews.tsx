import React from 'react';
import { motion } from 'motion/react';
import { Star, Quote, ShieldCheck } from 'lucide-react';
import { TESTIMONIALS } from '../data';

export default function Reviews() {
  return (
    <section id="testimonials" className="relative w-full py-24 md:py-32 bg-[#0d0e11] border-b border-white/5 overflow-hidden">
      
      {/* Background Atmosphere */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-950/2 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Header Block */}
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-24">
          <span className="font-mono text-xs uppercase tracking-[0.35em] text-gold-400 mb-4 block font-extrabold">
            EXECUTIVE FEEDBACK
          </span>
          <h2 className="font-serif text-3xl md:text-5xl tracking-[0.1em] text-white font-bold mb-6">
            Endorsed by <span className="italic text-gold-300 font-extrabold">Leaders</span>
          </h2>
          <p className="font-sans text-neutral-100 text-sm leading-relaxed font-semibold">
            Read critical testimonials from managing partners, CEOs, and empire builders who integrate the VICTNOW collection into their strategic daily lives and corporate gifting budgets.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              key={index}
              className="p-8 bg-[#121418] border-2 border-white/10 flex flex-col justify-between relative text-left group hover:border-gold-500/40 transition-all duration-300 shadow-xl"
            >
              {/* Luxury Quote Icon Watermark */}
              <Quote className="absolute top-6 right-6 w-10 h-10 text-white/5 opacity-40 pointer-events-none group-hover:scale-110 transition-transform duration-500" />
              
              <div className="space-y-6">
                {/* Gold Rating Stars */}
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-gold-400 text-gold-400" />
                  ))}
                </div>

                {/* Quote Text */}
                <p className="font-sans text-neutral-100 text-xs md:text-sm leading-relaxed italic font-semibold">
                  "{t.quote}"
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-6 mt-8 border-t border-white/10 flex flex-col">
                <span className="font-serif text-sm text-white tracking-wider font-extrabold">
                  {t.name}
                </span>
                <span className="font-sans text-[10px] text-neutral-200 uppercase tracking-widest mt-1 font-bold">
                  {t.role}, <strong className="font-extrabold text-gold-300">{t.company}</strong>
                </span>
                
                {/* Associated Perfume tag */}
                <span className="font-mono text-[8px] bg-neutral-950 text-gold-300 px-2 py-0.5 uppercase tracking-wider self-start mt-3 border border-white/15 font-extrabold">
                  ✓ Preferred: {t.perfume}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Corporate Trust Badge */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
          <div className="flex items-center space-x-3">
            <ShieldCheck className="w-5 h-5 text-gold-500" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-200 font-extrabold">
              Approved vendor for fortune 500 board gifting
            </span>
          </div>
          <span className="font-mono text-[9px] text-neutral-200 uppercase tracking-widest font-extrabold">
            AUTHENTICITY COMPLIANCE REGISTERED
          </span>
        </div>

      </div>
    </section>
  );
}
