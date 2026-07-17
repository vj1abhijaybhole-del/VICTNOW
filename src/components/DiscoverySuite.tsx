import React from 'react';
import { Sparkles, CreditCard, Award, Heart } from 'lucide-react';

interface DiscoverySuiteProps {
  onAddTrialToCart: (recipientName: string, boxDesign: string, message: string, triggerCheckout?: boolean) => void;
}

export default function DiscoverySuite({ onAddTrialToCart }: DiscoverySuiteProps) {
  const handleBuyNow = () => {
    // Adds with a default premium set configuration, directly opening the checkout address & payment page
    onAddTrialToCart(
      'Exclusive Customer',
      'Gold Foil Obsidian',
      'Experiencing the signature trilogy.',
      true
    );
  };

  return (
    <section id="discovery-suite" className="py-16 border-t border-b border-white/5 bg-[#090a0c] relative overflow-hidden">
      {/* Visual background atmospheric glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.03),transparent_60%)] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center">
        <div className="bg-[#0f1114] border border-white/10 p-8 sm:p-12 rounded-xl shadow-2xl relative overflow-hidden">
          
          {/* Accent decoration line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />
          
          <div className="max-w-2xl mx-auto space-y-6">
            
            {/* Header Badge */}
            <div className="flex justify-center">
              <span className="text-[9px] font-mono font-black uppercase tracking-widest text-gold-400 bg-gold-950/40 border border-gold-500/20 px-3 py-1 rounded-full flex items-center space-x-1.5 animate-pulse">
                <Sparkles className="w-3 h-3 text-gold-400" />
                <span>LIMITED QUANTITY ALLOCATION</span>
              </span>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <h2 className="font-serif text-2xl sm:text-3xl text-white font-extrabold tracking-tight uppercase">
                Signature Discovery Suite
              </h2>
              <p className="font-mono text-[10px] text-gold-400/80 uppercase tracking-widest font-bold">
                MUSE • NEXUS • FORGE (3 x 10ML FLACONS)
              </p>
            </div>

            {/* Divider line */}
            <div className="h-[1px] w-12 bg-gold-500/30 mx-auto" />

            {/* Dynamic, clean Price Tag & Checkout action */}
            <div className="pt-6 space-y-4">
              <div className="flex flex-col items-center justify-center space-y-1">
                <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest font-extrabold">
                  PROMOTIONAL INTRODUCTORY OFFER
                </span>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-mono font-black text-gold-400">₹499</span>
                  <span className="text-xs font-mono text-neutral-500 line-through">₹999</span>
                  <span className="text-[9px] font-mono text-emerald-400 font-extrabold bg-emerald-950/30 border border-emerald-500/20 px-2 py-0.5 rounded">
                    70% OFF • COMPLIMENTARY DELIVERY
                  </span>
                </div>
              </div>

              {/* Direct Checkout Button */}
              <div className="max-w-xs mx-auto">
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="w-full bg-gold-500 hover:bg-gold-600 active:bg-gold-700 text-black py-3.5 px-6 font-mono text-xs uppercase tracking-widest font-black transition-all duration-300 flex items-center justify-center space-x-2 shadow-xl shadow-gold-500/10 rounded cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <CreditCard className="w-4 h-4 text-black shrink-0" />
                  <span>Order Trial Pack</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
