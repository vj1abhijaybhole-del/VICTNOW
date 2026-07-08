import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, Eye, FileText, Gift, Info, Check, Sparkles, Send, ShieldCheck, ChevronRight, ChevronDown } from 'lucide-react';
import { PERFUMES, MESSAGE_PRESETS, CARD_STYLES, giftingBoxImg, giftingBgImg } from '../data';
import { GiftingCustomization, Perfume } from '../types';

interface CorporateGiftingProps {
  initialPerfumeId?: 'muse' | 'nexus' | 'forge';
  onAddCustomizedToCart: (perfumeId: 'muse' | 'nexus' | 'forge', custom: GiftingCustomization) => void;
}

export default function CorporateGifting({ initialPerfumeId = 'muse', onAddCustomizedToCart }: CorporateGiftingProps) {
  // Current perfume being customized
  const [selectedPerfumeId, setSelectedPerfumeId] = useState<'muse' | 'nexus' | 'forge'>(initialPerfumeId);
  const [size, setSize] = useState<'50 ML' | '100 ML'>('100 ML');
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);

  // Sync scroll position with selectedPerfumeId
  useEffect(() => {
    if (scrollContainerRef.current && !isScrollingRef.current) {
      const container = scrollContainerRef.current;
      const children = container.children;
      const activeIndex = PERFUMES.findIndex(p => p.id === selectedPerfumeId);
      if (activeIndex !== -1 && children[activeIndex]) {
        const targetChild = children[activeIndex] as HTMLElement;
        const containerCenter = container.clientWidth / 2;
        const childCenter = targetChild.offsetLeft + targetChild.clientWidth / 2;
        const targetScrollLeft = childCenter - containerCenter;

        if (Math.abs(container.scrollLeft - targetScrollLeft) > 10) {
          container.scrollTo({
            left: targetScrollLeft,
            behavior: 'smooth'
          });
        }
      }
    }
  }, [selectedPerfumeId]);

  // Handle manual scroll to update selectedPerfumeId
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const children = container.children;
      if (children.length === 0) return;
      
      let closestIndex = 0;
      let minDistance = Infinity;
      const containerCenter = container.getBoundingClientRect().left + container.clientWidth / 2;

      for (let i = 0; i < children.length; i++) {
        const childRect = children[i].getBoundingClientRect();
        const childCenter = childRect.left + childRect.width / 2;
        const distance = Math.abs(childCenter - containerCenter);
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = i;
        }
      }

      const targetPerfume = PERFUMES[closestIndex];
      if (targetPerfume && selectedPerfumeId !== targetPerfume.id) {
        isScrollingRef.current = true;
        setSelectedPerfumeId(targetPerfume.id as any);
        // Reset scrolling flag after a brief delay
        setTimeout(() => {
          isScrollingRef.current = false;
        }, 150);
      }
    }
  };

  // Customization state
  const [recipientName, setRecipientName] = useState('MARCUS STERLING');
  const [cardDesign, setCardDesign] = useState<'white' | 'charcoal' | 'navy' | 'gold'>('gold');
  const [messagePresetId, setMessagePresetId] = useState('partnership');
  const [customMessage, setCustomMessage] = useState('');
  const [engravingFont, setEngravingFont] = useState<'serif' | 'sans' | 'script'>('serif');
  const [quantity, setQuantity] = useState(200);
  const [includeCorporateLogo, setIncludeCorporateLogo] = useState(false);
  const [previewTab, setPreviewTab] = useState<'bottle' | 'card' | 'box'>('bottle');
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Sync with prop changes (e.g. if a user clicks Customize on a product card)
  useEffect(() => {
    setSelectedPerfumeId(initialPerfumeId);
  }, [initialPerfumeId]);

  // Find currently selected perfume object
  const currentPerfume = PERFUMES.find(p => p.id === selectedPerfumeId) || PERFUMES[0];

  // Calculate corporate pricing tier
  // Single bottle: $185 (50ml) or $295 (100ml)
  // Tier discounts apply to the base price
  const basePricePerUnit = size === '100 ML' ? 295 : 185;
  const customizationFee = 15; // standard engraving + box wrapping fee
  const rawPricePerUnit = basePricePerUnit + customizationFee;

  let discountRate = 0;
  if (quantity >= 50) discountRate = 0.20;
  else if (quantity >= 25) discountRate = 0.15;
  else if (quantity >= 10) discountRate = 0.10;
  else if (quantity >= 5) discountRate = 0.05;

  const discountedUnitProductPrice = basePricePerUnit * (1 - discountRate);
  const totalUnitCost = discountedUnitProductPrice + (includeCorporateLogo ? customizationFee + 5 : customizationFee);
  const totalOrderValue = totalUnitCost * quantity;
  const standardValue = rawPricePerUnit * quantity;
  const corporateSavings = standardValue - totalOrderValue;

  // Initialize custom message on preset change
  useEffect(() => {
    const preset = MESSAGE_PRESETS.find(p => p.id === messagePresetId);
    if (preset && preset.id !== 'custom') {
      setCustomMessage(preset.text);
    }
  }, [messagePresetId]);

  const handleAddToCart = () => {
    const customConfig: GiftingCustomization = {
      recipientName,
      cardDesign,
      messagePresetId,
      customMessage: customMessage || 'To a true leader.',
      quantity,
      includeCorporateLogo,
      engravingFont,
      size
    };
    onAddCustomizedToCart(selectedPerfumeId, customConfig);
    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
    }, 4000);
  };

  // Font class mappings for bottle engraving preview
  const getFontFamilyClass = () => {
    switch (engravingFont) {
      case 'serif': return 'font-serif tracking-[0.25em] uppercase';
      case 'sans': return 'font-mono tracking-[0.3em] uppercase text-xs';
      case 'script': return 'font-serif italic tracking-widest capitalize font-light';
      default: return 'font-serif tracking-[0.2em]';
    }
  };

  const selectedCardStyle = CARD_STYLES.find(c => c.id === cardDesign) || CARD_STYLES[0];

  return (
    <section id="gifting" className="relative w-full py-24 md:py-32 bg-[#0b0c0e] border-b border-white/5 overflow-hidden">
      
      {/* Background Reference Image */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.22] transition-opacity duration-700">
        <img
          src={giftingBgImg}
          alt="Luxury corporate gifting background"
          className="w-full h-full object-cover object-center scale-105 motion-safe:animate-[pulse_12s_ease-in-out_infinite]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-neutral-950/40 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b0c0e] via-[#0b0c0e]/80 to-[#0b0c0e]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0c0e] via-transparent to-[#0b0c0e]" />
      </div>

      {/* Background Ornaments */}
      <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-gold-900/5 blur-[120px] rounded-full pointer-events-none z-0" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Title Block */}
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-24">
          <span className="font-mono text-xs uppercase tracking-[0.35em] text-gold-400 mb-4 block font-extrabold">
            CORPORATE GIFTS & BESPOKE PERSONALIZATION
          </span>
          <h2 className="font-serif text-3xl md:text-5xl tracking-[0.1em] text-white font-bold mb-6">
            The Gifting <span className="italic text-gold-300 font-extrabold">Executive</span> Suite
          </h2>
          <p className="font-sans text-neutral-100 text-sm leading-relaxed font-semibold">
            Elevate executive relations, partner summits, or milestones. We laser-engrave customized names directly onto the premium timber presentation boxes, accompanied by bespoke cardstock cards.
          </p>
        </div>

        {/* Customizer Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Interactive Settings (lg:col-span-7) */}
          <div className="lg:col-span-7 bg-[#121418] border border-white/5 p-6 md:p-10 space-y-8 text-left">
            
            {/* Step 1: Aroma Selection */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <span className="font-mono text-[10px] w-5 h-5 rounded-full border border-gold-400 flex items-center justify-center text-gold-300 font-extrabold bg-gold-950/40">1</span>
                <span className="font-serif text-sm text-gold-200 tracking-widest uppercase font-extrabold">Select Olfactory Signature</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {PERFUMES.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPerfumeId(p.id)}
                    className={`py-3.5 px-3 border-2 flex flex-col items-center transition-all cursor-pointer ${
                      selectedPerfumeId === p.id
                        ? 'border-gold-400 bg-gold-950/20 shadow-gold-glow'
                        : 'border-white/10 bg-neutral-900/80 hover:bg-neutral-900'
                    }`}
                  >
                    <span className={`font-serif text-xs tracking-widest ${selectedPerfumeId === p.id ? 'text-gold-200 font-extrabold' : 'text-white font-bold'}`}>{p.name}</span>
                    <span className={`font-mono text-[8px] uppercase mt-1 tracking-wider font-bold ${selectedPerfumeId === p.id ? 'text-gold-300' : 'text-neutral-200'}`}>
                      {p.type === 'women' ? 'Women' : p.type === 'men' ? 'Men' : 'Unisex'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 1B: Size Variant Selection */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <span className="font-mono text-[10px] w-5 h-5 rounded-full border border-gold-400 flex items-center justify-center text-gold-300 font-extrabold bg-gold-950/40">1B</span>
                <span className="font-serif text-sm text-gold-200 tracking-widest uppercase font-extrabold">Select Flacon Size</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {(['50 ML', '100 ML'] as const).map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSize(sz)}
                    className={`py-3 px-4 border-2 flex flex-col items-center justify-center transition-all cursor-pointer ${
                      size === sz
                        ? 'border-gold-400 bg-gold-950/20 shadow-gold-glow'
                        : 'border-white/10 bg-neutral-900/80 hover:bg-neutral-900'
                    }`}
                  >
                    <span className={`font-mono text-xs tracking-widest uppercase ${size === sz ? 'text-gold-200 font-extrabold' : 'text-white font-bold'}`}>
                      {sz}
                    </span>
                    <span className="font-mono text-[8px] text-neutral-400 mt-0.5 font-bold">
                      Base: {sz === '100 ML' ? '$295.00' : '$185.00'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Box Engraving */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <span className="font-mono text-[10px] w-5 h-5 rounded-full border border-gold-400 flex items-center justify-center text-gold-300 font-extrabold bg-gold-950/40">2</span>
                <span className="font-serif text-sm text-gold-200 tracking-widest uppercase font-extrabold">Bespoke Case Engraving</span>
              </div>
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-neutral-100 block mb-1.5 font-extrabold">
                  Recipient Name / Corporate Slogan on Case (Max 24 chars)
                </label>
                <input
                  type="text"
                  maxLength={24}
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value.toUpperCase())}
                  className="w-full bg-neutral-950 border-2 border-white/20 px-4 py-3 font-mono text-xs tracking-widest text-white focus:outline-none focus:border-gold-400 transition-colors uppercase font-extrabold"
                  placeholder="E.G. MARCUS STERLING"
                />
              </div>
            </div>

            {/* Step 3: Greeting Card Configuration */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <span className="font-mono text-[10px] w-5 h-5 rounded-full border border-gold-400 flex items-center justify-center text-gold-300 font-extrabold bg-gold-950/40">3</span>
                <span className="font-serif text-sm text-gold-200 tracking-widest uppercase font-extrabold">Executive Card & Message</span>
              </div>

              {/* Message preset Selector */}
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-neutral-100 block mb-2 font-extrabold">
                  Strategic Message Presets
                </label>
                <div className="relative">
                  <select
                    id="message_preset_select"
                    value={messagePresetId}
                    onChange={(e) => setMessagePresetId(e.target.value)}
                    className="w-full bg-neutral-950 border-2 border-white/20 px-4 py-3 font-mono text-xs tracking-widest text-white appearance-none focus:outline-none focus:border-gold-400 transition-colors uppercase font-extrabold pr-10 cursor-pointer"
                  >
                    {MESSAGE_PRESETS.map((p) => (
                      <option key={p.id} value={p.id} className="bg-neutral-950 text-white font-mono text-xs font-extrabold">
                        {p.title.toUpperCase()} MESSAGE
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gold-400">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Text Area */}
              <div>
                <textarea
                  rows={3}
                  value={customMessage}
                  onChange={(e) => {
                    setMessagePresetId('custom');
                    setCustomMessage(e.target.value);
                  }}
                  className="w-full bg-neutral-950 border-2 border-white/20 p-4 font-sans text-xs text-white tracking-wide leading-relaxed focus:outline-none focus:border-gold-400 transition-colors font-semibold"
                  placeholder="Enter your customized card message for the recipient..."
                />
              </div>
            </div>

            {/* Step 4: Scale & Logistics */}
            <div className="space-y-4 pt-4 border-t border-white/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-[10px] w-5 h-5 rounded-full border border-gold-400 flex items-center justify-center text-gold-300 font-extrabold bg-gold-950/40">4</span>
                  <span className="font-serif text-sm text-gold-200 tracking-widest uppercase font-extrabold">Order Volume & Logo</span>
                </div>
                {/* Discount Badge */}
                {discountRate > 0 && (
                  <span className="font-mono text-[9px] bg-emerald-950/50 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 uppercase tracking-widest font-bold">
                    {(discountRate * 100)}% Corporate Discount Applied
                  </span>
                )}
              </div>

              {/* Range Slider for Quantity */}
              <div className="space-y-2 bg-neutral-950 p-5 border border-white/10">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="text-neutral-100 font-bold">Order Quantity:</span>
                  <span className="text-white font-extrabold">{quantity} Bottles</span>
                </div>
                <input
                  type="range"
                  min={200}
                  max={2000}
                  step={50}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="w-full accent-gold-500 bg-neutral-800 h-1.5 cursor-pointer"
                />
                <div className="flex items-center justify-between font-mono text-[8px] text-neutral-200 uppercase tracking-widest pt-1 font-bold">
                  <span>200 Bottles (Min MOQ)</span>
                  <span>500 Bottles</span>
                  <span>1,000 Bottles</span>
                  <span>2,000 Bottles (20% Off)</span>
                </div>
              </div>

              {/* Logo Checkbox */}
              <div className="flex items-center justify-between p-4 bg-[#0b0c0e] border border-white/5">
                <div className="flex items-start space-x-3 text-left">
                  <input
                    type="checkbox"
                    id="logo_checkbox"
                    checked={includeCorporateLogo}
                    onChange={(e) => setIncludeCorporateLogo(e.target.checked)}
                    className="mt-1 accent-gold-500"
                  />
                  <div>
                    <label htmlFor="logo_checkbox" className="font-serif text-xs text-white tracking-wide cursor-pointer font-medium block">
                      Include Metallic Corporate Seal
                    </label>
                    <p className="font-sans text-[10px] text-neutral-500 font-light mt-0.5">
                      Check this to upload or engrave your firm's visual crest/logo on the solid cap (+$5 per unit).
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Calculations Panel */}
            <div className="p-6 bg-gradient-to-r from-gold-950/10 to-transparent border border-gold-500/10 flex flex-col md:flex-row justify-between items-baseline md:items-center gap-4">
              <div className="text-left">
                <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 block">
                  Concierge Quote Summary
                </span>
                <div className="flex items-baseline space-x-2 mt-1">
                  <span className="font-serif text-3xl text-gold-300 font-medium">${totalOrderValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                  <span className="font-sans text-xs text-neutral-400">Total USD</span>
                </div>
                <span className="font-mono text-[9px] text-neutral-400">
                  Unit Cost: ${totalUnitCost.toFixed(2)} (Customized {size} {currentPerfume.name})
                </span>
              </div>

              {corporateSavings > 0 && (
                <div className="text-left md:text-right">
                  <span className="font-mono text-[9px] text-emerald-400 uppercase tracking-widest block font-bold">
                    ✓ CORPORATE SAVINGS SAVED
                  </span>
                  <span className="font-mono text-sm text-neutral-400">
                    -${corporateSavings.toFixed(2)} USD
                  </span>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              onClick={handleAddToCart}
              className="w-full py-4.5 bg-gradient-to-r from-gold-600 to-gold-400 hover:from-gold-500 hover:to-gold-300 text-neutral-950 font-sans text-xs uppercase tracking-[0.25em] font-bold shadow-lg cursor-pointer hover:shadow-gold-glow transition-all relative overflow-hidden shimmer-btn"
            >
              Add Gifting Bundle to Cart
            </button>

          </div>

          {/* Right Column: Dynamic Mockup Preview Workspace (lg:col-span-5) */}
          <div className="lg:col-span-5 flex flex-col space-y-6 lg:sticky lg:top-28">
            
            {/* Preview Navigation Tabs */}
            <div className="flex items-center justify-between bg-neutral-950 p-1 border-2 border-white/10">
              <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-200 pl-3 font-extrabold">
                LIVE MOCKUP PREVIEW
              </span>
              <div className="flex items-center">
                <button
                  onClick={() => setPreviewTab('bottle')}
                  className={`px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider cursor-pointer transition-colors ${
                    previewTab === 'bottle' ? 'bg-gold-500 text-neutral-950 font-extrabold' : 'text-neutral-200 hover:text-white font-bold'
                  }`}
                >
                  Bottle
                </button>
                <button
                  onClick={() => setPreviewTab('card')}
                  className={`px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider cursor-pointer transition-colors ${
                    previewTab === 'card' ? 'bg-gold-500 text-neutral-950 font-extrabold' : 'text-neutral-200 hover:text-white font-bold'
                  }`}
                >
                  Card
                </button>
                <button
                  onClick={() => setPreviewTab('box')}
                  className={`px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider cursor-pointer transition-colors ${
                    previewTab === 'box' ? 'bg-gold-500 text-neutral-950 font-extrabold' : 'text-neutral-200 hover:text-white font-bold'
                  }`}
                >
                  Box Suite
                </button>
              </div>
            </div>

            {/* Dynamic Visual Area */}
            <div className="aspect-[3/4] lg:aspect-[1/1.2] bg-neutral-950 border border-white/5 flex items-center justify-center p-6 relative overflow-hidden shadow-2xl">
              
              {/* Subtle background glow representing selected perfume character */}
              <div className={`absolute w-[200px] h-[200px] blur-[100px] rounded-full opacity-20 pointer-events-none ${
                selectedPerfumeId === 'muse' ? 'bg-rose-400' : selectedPerfumeId === 'forge' ? 'bg-amber-600' : 'bg-slate-300'
              }`} />

              <AnimatePresence mode="wait">
                
                {/* 1. BOTTLE PREVIEW TAB */}
                {previewTab === 'bottle' && (
                  <motion.div
                    key="bottle"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full h-full flex flex-col items-center justify-between relative p-4"
                  >
                    {/* Left Navigation Chevron */}
                    <button
                      onClick={() => {
                        const idx = PERFUMES.findIndex(p => p.id === selectedPerfumeId);
                        if (idx > 0) {
                          setSelectedPerfumeId(PERFUMES[idx - 1].id as any);
                        }
                      }}
                      disabled={selectedPerfumeId === PERFUMES[0].id}
                      className="absolute left-2 top-[45%] -translate-y-1/2 z-20 p-2 text-gold-400/60 hover:text-gold-300 disabled:opacity-20 transition-all cursor-pointer bg-neutral-900/40 hover:bg-neutral-900/80 rounded-full border border-white/5"
                    >
                      <ChevronDown className="w-5 h-5 rotate-90" />
                    </button>

                    {/* Right Navigation Chevron */}
                    <button
                      onClick={() => {
                        const idx = PERFUMES.findIndex(p => p.id === selectedPerfumeId);
                        if (idx < PERFUMES.length - 1) {
                          setSelectedPerfumeId(PERFUMES[idx + 1].id as any);
                        }
                      }}
                      disabled={selectedPerfumeId === PERFUMES[PERFUMES.length - 1].id}
                      className="absolute right-2 top-[45%] -translate-y-1/2 z-20 p-2 text-gold-400/60 hover:text-gold-300 disabled:opacity-20 transition-all cursor-pointer bg-neutral-900/40 hover:bg-neutral-900/80 rounded-full border border-white/5"
                    >
                      <ChevronDown className="w-5 h-5 -rotate-90" />
                    </button>

                    {/* Horizontal Scrolling Bottle Container */}
                    <div
                      ref={scrollContainerRef}
                      onScroll={handleScroll}
                      className="w-full flex-grow flex items-center overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-none relative"
                      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                      {PERFUMES.map((p) => {
                        return (
                          <div
                            key={p.id}
                            className="w-full flex-shrink-0 flex flex-col items-center justify-center snap-center px-4"
                          >
                            {/* HTML/CSS-crafted premium Perfume Bottle container */}
                            <div className={`relative w-[180px] h-[260px] flex flex-col items-center select-none group transition-all duration-500 origin-bottom ${
                              size === '50 ML' ? 'scale-[0.82]' : 'scale-100'
                            }`}>
                              
                              {/* Heavy Cap */}
                              <div className={`w-[70px] h-[60px] border relative transition-all duration-500 flex items-center justify-center shadow-md ${
                                p.id === 'forge'
                                  ? 'bg-gradient-to-b from-neutral-700 via-neutral-800 to-neutral-950 border-neutral-600 rounded-sm'
                                  : p.id === 'muse'
                                  ? 'bg-gradient-to-b from-amber-200 via-yellow-400 to-amber-500 border-amber-300 rounded-sm'
                                  : 'bg-gradient-to-b from-neutral-200 via-neutral-300 to-neutral-400 border-neutral-300 rounded-full'
                              }`}>
                                {/* Engraved corporate logo indicator */}
                                {includeCorporateLogo && (
                                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                                    <div className="w-5 h-5 rounded-full border border-gold-500/50 flex items-center justify-center">
                                      <Sparkles className="w-2.5 h-2.5 text-gold-400 animate-pulse" />
                                    </div>
                                  </div>
                                )}
                                {/* Cap reflection shine */}
                                <div className="absolute top-1 left-2 w-1.5 h-1/2 bg-white/20 rounded-full blur-[1px] pointer-events-none" />
                                {/* Cap shadow/texture */}
                                <div className="absolute inset-x-0 bottom-0 h-[3px] bg-black/30" />
                              </div>

                              {/* Neck collar */}
                              <div className="w-[30px] h-[12px] bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600 border border-gold-500/50 shadow-inner" />

                              {/* Heavy Crystal Glass Body */}
                              <div className="w-[140px] h-[180px] border-2 border-white/20 bg-white/[0.04] backdrop-blur-[2px] flex flex-col items-center justify-between p-4 relative shadow-2xl transition-all duration-500 rounded-md">
                                {/* Refraction gloss lines (Makes it look like clear glass) */}
                                <div className="absolute left-1.5 top-2 bottom-2 w-[1px] bg-white/20 pointer-events-none" />
                                <div className="absolute left-3 top-2 bottom-2 w-[0.5px] bg-white/10 pointer-events-none" />
                                <div className="absolute right-1.5 top-2 bottom-2 w-[1.5px] bg-white/30 pointer-events-none" />
                                <div className="absolute right-3 top-2 bottom-2 w-[0.5px] bg-white/10 pointer-events-none" />
                                <div className="absolute inset-x-2 top-1.5 h-[1px] bg-white/20 pointer-events-none" />
                                
                                {/* Liquid color hue (Beautifully clear luxurious perfume liquid) */}
                                <div className={`absolute inset-0 -z-10 rounded-md transition-all duration-500 ${
                                  p.id === 'muse'
                                    ? 'bg-gradient-to-t from-rose-500/15 via-amber-500/5 to-transparent'
                                    : p.id === 'forge'
                                    ? 'bg-gradient-to-t from-amber-600/20 via-orange-500/10 to-transparent'
                                    : 'bg-gradient-to-t from-blue-400/12 via-indigo-400/3 to-transparent'
                                }`} />

                                {/* Perfume Label Block */}
                                <div className="border border-white/10 bg-black/75 backdrop-blur-sm p-4 w-full flex flex-col items-center justify-center shadow-lg my-auto">
                                  <span className="font-serif text-sm tracking-[0.2em] text-white font-medium">
                                    {p.name}
                                  </span>
                                  <span className="font-mono text-[7px] tracking-widest text-neutral-400 mt-1 block">
                                    {size}
                                  </span>
                                </div>

                                {/* Bottom thick glass base */}
                                <div className="absolute inset-x-0 bottom-0 h-4 bg-white/10 border-t border-white/20 rounded-b-[4px]" />
                                <div className="absolute inset-x-2 bottom-1 h-1.5 bg-white/20 rounded-b-[2px] blur-[1px]" />
                              </div>

                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Pagination indicators & feedback */}
                    <div className="w-full flex flex-col items-center space-y-3 pt-2 z-10">
                      {/* Gold Pagination Dots */}
                      <div className="flex space-x-2">
                        {PERFUMES.map((p) => (
                          <button
                            key={p.id}
                            onClick={() => setSelectedPerfumeId(p.id as any)}
                            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                              selectedPerfumeId === p.id ? 'bg-gold-400 w-4' : 'bg-white/20 hover:bg-white/40'
                            }`}
                            title={`Select ${p.name}`}
                          />
                        ))}
                      </div>

                      {/* Laser engraving feedback annotation */}
                      <div className="flex items-center justify-center space-x-2 text-neutral-500 text-[9px] font-mono uppercase tracking-widest">
                        <div className="w-1 h-1 rounded-full bg-gold-400 animate-pulse" />
                        <span>Swipe to scroll / Custom laser-engraved cases</span>
                      </div>
                    </div>

                  </motion.div>
                )}

                {/* 2. CARD PREVIEW TAB */}
                {previewTab === 'card' && (
                  <motion.div
                    key="card"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full h-full flex items-center justify-center p-4"
                  >
                    
                    {/* Greeting Card Mockup */}
                    <div className={`w-full max-w-[320px] aspect-[4/3] border shadow-2xl p-6 relative flex flex-col justify-between overflow-hidden ${selectedCardStyle.bgClass}`}>
                      
                      {/* Premium gold double border layout */}
                      <div className={`absolute inset-2 border ${selectedCardStyle.accentColor} opacity-30 pointer-events-none`} />

                      {/* Header signature */}
                      <div className={`flex items-center justify-between pb-3 border-b border-white/5 z-10 ${selectedCardStyle.headerClass}`}>
                        <span className="text-[9px] uppercase tracking-[0.3em]">
                          VICTNOW CONCIERGE
                        </span>
                        <Sparkles className="w-3.5 h-3.5 text-gold-500/50" />
                      </div>

                      {/* Content Message */}
                      <div className="py-4 text-center z-10 flex-grow flex flex-col justify-center">
                        <p className={`font-serif italic text-xs mb-4 ${selectedCardStyle.fontColor}`}>
                          "To {recipientName || 'Bespoke Recipient'}"
                        </p>
                        <p className={`font-sans text-[10px] leading-relaxed max-w-xs mx-auto italic font-light ${selectedCardStyle.fontColor}`}>
                          {customMessage || 'Write your corporate message to see it drafted inside this elite template...'}
                        </p>
                      </div>

                      {/* Stamp footer */}
                      <div className="text-center z-10 pt-2 border-t border-white/5 font-mono text-[7px] uppercase tracking-[0.25em] text-gold-500">
                        PRESENCE OF LEADERSHIP
                      </div>
                    </div>

                  </motion.div>
                )}

                {/* 3. BOX SUITE IMAGE PREVIEW */}
                {previewTab === 'box' && (
                  <motion.div
                    key="box"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-full flex flex-col items-center justify-center p-4 relative"
                  >
                    <img
                      src={giftingBoxImg}
                      alt="VICTNOW corporate executive presentation box"
                      className="w-full h-full object-cover border border-white/5"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/20" />

                    {/* Simulated Laser Engraved Brass Plate on Box */}
                    <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-700 p-0.5 shadow-[0_15px_30px_rgba(0,0,0,0.8)] border border-gold-400/50 rounded-sm">
                      <div className="bg-[#121418]/95 backdrop-blur-sm px-6 py-3.5 border border-gold-500/30 flex flex-col items-center justify-center space-y-1.5">
                        <span className="font-mono text-[6px] text-gold-400 uppercase tracking-[0.3em]">
                          — BESPOKE COGNIZANCE —
                        </span>
                        <span className="font-serif text-gold-100 text-[10px] uppercase tracking-widest font-extrabold max-w-[180px] truncate">
                          {recipientName || 'MARCUS STERLING'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Caption overlay */}
                    <div className="absolute bottom-6 left-6 right-6 p-4 bg-black/80 backdrop-blur-md border border-white/5 text-left">
                      <h4 className="font-serif text-xs text-white tracking-wider uppercase mb-1">
                        Executive Wooden Case
                      </h4>
                      <p className="font-sans text-[10px] text-neutral-400 font-light">
                        Milled from solid timber with custom velvet flocking, soft-close brass hinges, gold hot-stamped branding, and a custom-milled nameplate laser-etched directly on the box.
                      </p>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>

            </div>

            {/* Quick specifications badge */}
            <div className="p-4 bg-neutral-950 border border-white/5 flex items-center justify-between text-left">
              <div className="flex items-center space-x-3">
                <Info className="w-4 h-4 text-gold-400" />
                <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-400">
                  Concierge delivery available for 10+ items
                </span>
              </div>
              <span className="font-mono text-[9px] text-gold-400 font-bold uppercase">
                WHITE GLOVE SHIPPING
              </span>
            </div>

          </div>

        </div>

      </div>

      {/* Success Toast Notification */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 z-50 bg-[#121418] border border-gold-500/30 p-4 shadow-2xl flex items-center space-x-4 max-w-sm rounded-none"
          >
            <div className="w-8 h-8 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center flex-shrink-0">
              <Check className="w-4 h-4 text-gold-400" />
            </div>
            <div className="text-left">
              <h4 className="font-serif text-xs text-white uppercase tracking-wider font-semibold">
                Customized Order Added
              </h4>
              <p className="font-sans text-[10px] text-neutral-400 leading-normal mt-0.5">
                {quantity} customized bottles of {currentPerfume.name} added with message card and engraving.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
