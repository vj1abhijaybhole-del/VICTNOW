import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Eye, Award, CheckCircle, ChevronRight, Sliders, ShieldCheck } from 'lucide-react';
import { PERFUMES } from '../data';
import { Perfume } from '../types';

interface ProductSectionProps {
  products?: Perfume[];
  onAddToCart: (perfumeId: 'muse' | 'nexus' | 'forge', size: '50 ML' | '100 ML') => void;
  onSelectForGifting: (perfumeId: 'muse' | 'nexus' | 'forge') => void;
}

export default function ProductSection({ products = PERFUMES, onAddToCart, onSelectForGifting }: ProductSectionProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'women' | 'unisex' | 'men'>('all');
  const [selectedPerfume, setSelectedPerfume] = useState<Perfume | null>(null);
  const [hoveredNoteIndex, setHoveredNoteIndex] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<'50 ML' | '100 ML'>('100 ML');
  const [cardSizes, setCardSizes] = useState<Record<'muse' | 'nexus' | 'forge', '50 ML' | '100 ML'>>({
    muse: '100 ML',
    nexus: '100 ML',
    forge: '100 ML'
  });

  const filteredPerfumes = products.filter((p) => {
    if (activeFilter === 'all') return true;
    return p.type === activeFilter;
  });

  return (
    <section id="collection" className="relative w-full py-24 md:py-32 bg-[#0d0e11] border-b border-white/5 overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gold-950/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-10 left-10 w-[1px] h-1/2 bg-gradient-to-b from-transparent via-white/5 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="text-left">
            <span className="font-mono text-xs uppercase tracking-[0.35em] text-gold-500 mb-4 block font-medium">
              THE TRIO COLLECTION
            </span>
            <h2 className="font-serif text-3xl md:text-5xl tracking-[0.1em] text-white font-bold leading-[1.2]">
              Limited Edition <span className="italic text-gold-300 font-extrabold">Signatures</span>
            </h2>
            <p className="font-sans text-neutral-200 text-sm mt-3 max-w-xl font-semibold">
              Carefully conceptualized fragrances designed to complete the aura of modern executives. Now available in prestige 100ml and 50ml crystal flacons.
            </p>
          </div>

          {/* Luxury Filter Selector */}
          <div className="flex flex-wrap items-center gap-2 border-b border-white/5 pb-2">
            {(['all', 'women', 'unisex', 'men'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] transition-all duration-300 relative cursor-pointer ${
                  activeFilter === filter
                    ? 'text-gold-300 font-extrabold'
                    : 'text-neutral-300 hover:text-white font-bold'
                }`}
              >
                {filter === 'all' ? 'All Parfums' : filter === 'women' ? 'For Women' : filter === 'men' ? 'For Men' : 'Unisex'}
                {activeFilter === filter && (
                  <motion.div
                    layoutId="activeFilterUnderline"
                    className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gold-400"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Perfume Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {filteredPerfumes.map((perfume) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              key={perfume.id}
              className="group flex flex-col bg-[#121418] border border-white/5 hover:border-gold-500/20 transition-all duration-500 relative overflow-hidden"
            >
              {/* Product Type Label & Limited Edition Pill */}
              <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
                <span className="font-mono text-[9px] uppercase tracking-widest px-2 py-1 bg-[#0b0c0e]/90 backdrop-blur-md border border-white/10 text-neutral-100 font-extrabold">
                  {perfume.type === 'women' ? 'FOR WOMEN' : perfume.type === 'men' ? 'FOR MEN' : 'UNISEX'}
                </span>
                {perfume.isLimitedEdition !== false ? (
                  <span className="font-mono text-[8px] uppercase tracking-widest px-2.5 py-1 bg-gold-950/60 border border-gold-500/40 text-gold-200 flex items-center space-x-1 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
                    <span>LTD ED</span>
                  </span>
                ) : (
                  <span className="font-mono text-[8px] uppercase tracking-widest px-2.5 py-1 bg-neutral-900 border border-neutral-700 text-neutral-400 flex items-center space-x-1 font-bold">
                    <span>CLASSIC</span>
                  </span>
                )}
              </div>

              {/* Image Container with Luxury Zoom Hover */}
              <div className="relative aspect-[1/1] overflow-hidden bg-neutral-950 flex items-center justify-center p-6">
                <img
                  src={perfume.imageUrl}
                  alt={perfume.name}
                  className="w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-105 group-hover:brightness-[0.95]"
                  referrerPolicy="no-referrer"
                />
                
                {/* Hover overlay with action buttons */}
                <div className="absolute inset-0 bg-neutral-950/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 space-y-4">
                  <button
                    onClick={() => { setSelectedSize(cardSizes[perfume.id]); setSelectedPerfume(perfume); }}
                    className="w-full max-w-[200px] py-3 bg-white hover:bg-neutral-200 text-neutral-900 font-sans text-[10px] uppercase tracking-[0.2em] font-medium transition-colors cursor-pointer flex items-center justify-center space-x-2"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspect Profile</span>
                  </button>
                  <button
                    onClick={() => onSelectForGifting(perfume.id)}
                    className="w-full max-w-[200px] py-3 bg-transparent border border-gold-500 hover:bg-gold-500 hover:text-black text-gold-400 font-sans text-[10px] uppercase tracking-[0.2em] font-medium transition-all cursor-pointer flex items-center justify-center space-x-2"
                  >
                    <span>Gift Personalizer</span>
                  </button>
                </div>
              </div>

              {/* Product Info Panel */}
              <div className="p-6 md:p-8 flex flex-col flex-grow text-left">
                <div className="flex items-baseline justify-between mb-2">
                  <h3 className="font-serif text-xl md:text-2xl tracking-[0.15em] text-white font-bold">
                    {perfume.name}
                  </h3>
                  <span className="font-mono text-sm text-gold-200 font-extrabold">
                    ₹{cardSizes[perfume.id] === '100 ML' ? Math.round(perfume.price * 1.6) : perfume.price}
                  </span>
                </div>

                <p className="font-serif text-xs italic text-gold-300 mb-4 tracking-wider font-extrabold">
                  {perfume.tagline}
                </p>

                <p className="font-sans text-xs text-neutral-100 leading-relaxed line-clamp-3 mb-6 font-semibold">
                  {perfume.description}
                </p>

                {/* Character Traits */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {perfume.character.map((char) => (
                    <span
                      key={char}
                      className="font-mono text-[8px] uppercase tracking-wider px-2 py-0.5 bg-neutral-900 text-neutral-200 border border-white/10 rounded-none font-bold"
                    >
                      {char}
                    </span>
                  ))}
                </div>

                {/* Bottle Size Variant Selector */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-400 font-extrabold">
                    Volume
                  </span>
                  <div className="flex space-x-1 bg-neutral-950 p-0.5 border border-white/5">
                    {(['50 ML', '100 ML'] as const).map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setCardSizes(prev => ({ ...prev, [perfume.id]: sz }))}
                        className={`px-3 py-1 font-mono text-[9px] uppercase tracking-widest transition-all cursor-pointer font-extrabold ${
                          cardSizes[perfume.id] === sz
                            ? 'bg-gold-500/15 text-gold-300 border border-gold-500/30'
                            : 'text-neutral-400 hover:text-white border border-transparent'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Card Action footer (visible on mobile / backup for hover) */}
                <div className="mt-auto pt-6 border-t border-white/5 w-full">
                  <button
                    onClick={() => onAddToCart(perfume.id, cardSizes[perfume.id])}
                    className="w-full py-3 bg-gold-500 hover:bg-gold-400 text-neutral-950 font-sans text-[9px] uppercase tracking-wider font-extrabold transition-colors cursor-pointer flex items-center justify-center space-x-1.5 shadow-md"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Add {cardSizes[perfume.id]}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Full Detailed Product Olfactory Modal Drawer */}
      <AnimatePresence>
        {selectedPerfume && (
          <div className="fixed inset-0 z-50 flex items-center justify-end">
            
            {/* Modal Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPerfume(null)}
              className="absolute inset-0 bg-neutral-950/80 backdrop-blur-sm"
            />

            {/* Sliding Panel Content */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-2xl h-full bg-[#121418] border-l border-white/5 shadow-2xl overflow-y-auto p-8 md:p-12 flex flex-col justify-between"
            >
              
              {/* Top Controls */}
              <div className="flex items-center justify-between pb-6 border-b border-white/5 mb-8">
                <div className="flex items-center space-x-3">
                  <Award className="w-4.5 h-4.5 text-gold-400" />
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-400">
                    Scent Profile Inquiry
                  </span>
                </div>
                <button
                  onClick={() => setSelectedPerfume(null)}
                  className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 hover:text-gold-300 transition-colors cursor-pointer"
                >
                  Close [ESC]
                </button>
              </div>

              {/* Main Body */}
              <div className="flex-grow space-y-8">
                
                {/* Header Info */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="text-left">
                    <h3 className="font-serif text-3xl md:text-4xl tracking-[0.1em] text-white">
                      {selectedPerfume.name}
                    </h3>
                    <p className="font-serif text-sm text-gold-400 italic tracking-wider mt-1">
                      {selectedPerfume.tagline}
                    </p>
                  </div>
                  <div className="text-left md:text-right">
                    <span className="font-mono text-xl text-white block font-extrabold">
                      ₹{selectedSize === '100 ML' ? Math.round(selectedPerfume.price * 1.6) : selectedPerfume.price}
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-400 font-extrabold">
                      {selectedSize} / {selectedPerfume.concentration}
                    </span>
                  </div>
                </div>

                {/* Scent Description */}
                <p className="font-sans text-neutral-100 text-xs md:text-sm leading-relaxed font-semibold text-left">
                  {selectedPerfume.description}
                </p>

                {/* Size Selection Toggle */}
                <div className="text-left bg-neutral-950 p-6 border-2 border-white/10 space-y-3">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-200 block font-extrabold">
                    Select Flacon Volume
                  </span>
                  <div className="grid grid-cols-2 gap-4">
                    {(['50 ML', '100 ML'] as const).map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`py-3 border-2 font-mono text-[10px] uppercase tracking-widest cursor-pointer font-extrabold transition-all duration-200 ${
                          selectedSize === size
                            ? 'border-gold-400 text-gold-300 bg-gold-950/20 shadow-lg'
                            : 'border-white/10 text-neutral-300 bg-neutral-900/60 hover:bg-neutral-800'
                        }`}
                      >
                        {size} — ₹{size === '100 ML' ? Math.round(selectedPerfume.price * 1.6) : selectedPerfume.price}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Scent Pyramid / Interactive Notes Visualizer */}
                <div className="bg-[#0b0c0e] p-6 border border-white/5">
                  <h4 className="font-serif text-xs uppercase text-gold-400 tracking-[0.2em] mb-6 text-left">
                    Olfactory Formulation
                  </h4>

                  <div className="flex flex-col space-y-4">
                    {/* Top Notes */}
                    <div
                      onMouseEnter={() => setHoveredNoteIndex('top')}
                      onMouseLeave={() => setHoveredNoteIndex(null)}
                      className={`p-4 border transition-all duration-300 text-left ${
                        hoveredNoteIndex === 'top'
                          ? 'bg-gold-950/20 border-gold-500/40'
                          : 'bg-transparent border-white/5'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-serif text-xs tracking-widest text-neutral-400">TOP NOTES</span>
                        <span className="font-mono text-[8px] text-neutral-500">First Impression (0-30 Mins)</span>
                      </div>
                      <p className="font-sans text-sm text-white font-medium">
                        {selectedPerfume.notes.top.join(' • ')}
                      </p>
                    </div>

                    {/* Heart Notes */}
                    <div
                      onMouseEnter={() => setHoveredNoteIndex('heart')}
                      onMouseLeave={() => setHoveredNoteIndex(null)}
                      className={`p-4 border transition-all duration-300 text-left ${
                        hoveredNoteIndex === 'heart'
                          ? 'bg-gold-950/20 border-gold-500/40'
                          : 'bg-transparent border-white/5'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-serif text-xs tracking-widest text-neutral-400">HEART NOTES</span>
                        <span className="font-mono text-[8px] text-neutral-500">The Identity (30 Mins - 4 Hours)</span>
                      </div>
                      <p className="font-sans text-sm text-white font-medium">
                        {selectedPerfume.notes.heart.join(' • ')}
                      </p>
                    </div>

                    {/* Base Notes */}
                    <div
                      onMouseEnter={() => setHoveredNoteIndex('base')}
                      onMouseLeave={() => setHoveredNoteIndex(null)}
                      className={`p-4 border transition-all duration-300 text-left ${
                        hoveredNoteIndex === 'base'
                          ? 'bg-gold-950/20 border-gold-500/40'
                          : 'bg-transparent border-white/5'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-serif text-xs tracking-widest text-neutral-400">BASE NOTES</span>
                        <span className="font-mono text-[8px] text-neutral-500">The Sillage Anchor (4-12+ Hours)</span>
                      </div>
                      <p className="font-sans text-sm text-white font-medium">
                        {selectedPerfume.notes.base.join(' • ')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Performance Metrics Table */}
                <div className="grid grid-cols-3 gap-4 py-4 border-y border-white/5 text-left">
                  <div>
                    <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-200 block mb-1 font-extrabold">
                      Longevity
                    </span>
                    <span className="font-sans text-xs text-white font-extrabold">
                      {selectedPerfume.longevity}
                    </span>
                  </div>
                  <div>
                    <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-200 block mb-1 font-extrabold">
                      Sillage
                    </span>
                    <span className="font-sans text-xs text-white font-extrabold">
                      {selectedPerfume.sillage}
                    </span>
                  </div>
                  <div>
                    <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-200 block mb-1 font-extrabold">
                      Availability
                    </span>
                    <span className="font-sans text-xs text-gold-200 font-extrabold">
                      {selectedPerfume.edition}
                    </span>
                  </div>
                </div>

                {/* Secure Check Info */}
                <div className="flex items-center space-x-2 text-gold-500/70 justify-center">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="font-mono text-[9px] tracking-widest uppercase">
                    Authenticity Serial Tag and Wooden Presentation Box Included
                  </span>
                </div>

              </div>

              {/* Action Drawer Footer */}
              <div className="pt-8 border-t border-white/5 w-full mt-8">
                <button
                  onClick={() => {
                    onAddToCart(selectedPerfume.id, selectedSize);
                    setSelectedPerfume(null);
                  }}
                  className="w-full py-4 bg-gradient-to-r from-gold-600 to-gold-500 text-neutral-900 font-sans text-xs uppercase tracking-widest font-bold hover:brightness-110 cursor-pointer text-center"
                >
                  Add Standard {selectedSize}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
