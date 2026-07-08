import React from 'react';
import { motion } from 'motion/react';
import { Briefcase, Key, Compass, ShieldCheck } from 'lucide-react';

export default function Philosophy() {
  const pillars = [
    {
      icon: <Briefcase className="w-5 h-5 text-gold-400" />,
      title: 'Boardroom Gravitas',
      desc: 'Formulated to create an immediate olfactory anchor in high-pressure rooms, projecting professional focus and silent control.'
    },
    {
      icon: <Key className="w-5 h-5 text-gold-400" />,
      title: 'Commanding Longevity',
      desc: 'Formulated with masterfully balanced notes to ensure an all-day luxury sillage that lasts through full-day board summits and dinners.'
    },
    {
      icon: <Compass className="w-5 h-5 text-gold-400" />,
      title: 'Bespoke Executive Detailing',
      desc: 'We support precise personalization, laser-engraving leader names directly onto the boxes to make a monumental impression.'
    }
  ];

  return (
    <section id="philosophy" className="relative w-full py-24 md:py-32 bg-[#0b0c0e] border-b border-white/5 overflow-hidden">
      
      {/* Background Graphic Lines */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold-950/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute left-10 top-1/4 w-[1px] h-1/2 bg-gradient-to-b from-transparent via-gold-500/10 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Editorial Layout: Left side philosophy text, Right side card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <span className="font-mono text-xs uppercase tracking-[0.35em] text-gold-500 mb-4 block font-medium">
              THE MANIFESTO
            </span>
            <h2 className="font-serif text-3xl md:text-5xl tracking-[0.1em] text-white font-bold mb-8 leading-[1.25]">
              Scent is the invisible language of <span className="italic text-gold-300 font-extrabold">authority.</span>
            </h2>

            {/* Core Stats / Technical Specs Grid */}
            <div className="grid grid-cols-2 gap-6 w-full pt-6 border-t border-white/5">
              <div className="flex flex-col">
                <span className="font-mono text-2xl font-bold text-gold-300">100ML & 50ML</span>
                <span className="font-sans text-xs text-neutral-200 uppercase tracking-widest mt-1 font-bold">
                  Dual Volumes
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-2xl font-bold text-gold-300">LIMITED EDITION</span>
                <span className="font-sans text-xs text-neutral-200 uppercase tracking-widest mt-1 font-bold">
                  Bespoke Batch Reserve
                </span>
              </div>
            </div>
          </div>

          {/* Right Visual / Pillars Column */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            <div className="p-8 md:p-10 luxury-glass relative overflow-hidden group shadow-gold-glow">
              {/* Corner Accent Decor */}
              <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-gold-500/20" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-gold-500/20" />
              
              <h3 className="font-serif text-lg text-white tracking-[0.15em] uppercase mb-8 border-b border-white/5 pb-4">
                Leadership Signatures
              </h3>

              <div className="flex flex-col space-y-8">
                {pillars.map((pillar, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="p-2.5 bg-neutral-900 border border-white/10 rounded-none flex-shrink-0">
                      {pillar.icon}
                    </div>
                    <div>
                      <h4 className="font-serif text-sm text-gold-300 tracking-wider font-bold mb-1">
                        {pillar.title}
                      </h4>
                      <p className="font-sans text-xs text-neutral-100 leading-relaxed font-semibold">
                        {pillar.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Extra Security Badge */}
              <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between text-[10px] text-neutral-200 font-mono tracking-widest font-extrabold">
                <span className="uppercase">VICTNOW CONCIERGE CERTIFIED</span>
                <ShieldCheck className="w-4.5 h-4.5 text-gold-500/50" />
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
