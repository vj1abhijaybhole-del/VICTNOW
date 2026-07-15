import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, Gift, CreditCard, Sparkles, AlertCircle, ShieldAlert, Award } from 'lucide-react';
import { CartItem } from '../types';
import { PERFUMES, CARD_STYLES } from '../data';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveItem: (id: string) => void;
  onUpdateQuantity: (id: string, newQty: number) => void;
  onTriggerCheckout: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onRemoveItem,
  onUpdateQuantity,
  onTriggerCheckout
}: CartDrawerProps) {
  
  // Calculate pricing metrics
  const standardSubtotal = cartItems.reduce((acc, item) => {
    // If customized, it already has the personalized unitPrice calculated
    return acc + (item.unitPrice * item.quantity);
  }, 0);

  // If there are multiple items, let's sum them up
  const subtotal = standardSubtotal;
  const standardShippingCost = 0; // Complimentary Delivery
  const total = subtotal + standardShippingCost;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          
          {/* Dark overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-neutral-950/85 backdrop-blur-sm transition-opacity"
          />

          <div className="absolute inset-y-0 right-0 max-w-full flex">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="w-screen max-w-md h-full bg-[#121418] border-l border-white/5 shadow-2xl flex flex-col justify-between"
            >
              
              {/* Drawer Header */}
              <div className="p-6 border-b border-white/10 flex items-center justify-between bg-neutral-950">
                <div className="flex items-center space-x-3 text-left">
                  <Award className="w-4.5 h-4.5 text-gold-400" />
                  <h2 className="font-serif text-lg text-gold-200 tracking-widest uppercase font-extrabold">
                    Your Collection
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="font-mono text-[10px] uppercase tracking-widest text-neutral-200 hover:text-gold-300 transition-colors cursor-pointer p-2 font-extrabold"
                >
                  Close [X]
                </button>
              </div>

              {/* Items Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cartItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-12 h-12 rounded-full border-2 border-neutral-700 flex items-center justify-center">
                      <Gift className="w-5 h-5 text-neutral-400" />
                    </div>
                    <div>
                      <h3 className="font-serif text-sm text-white tracking-wider uppercase font-extrabold">
                        Collection is Empty
                      </h3>
                      <p className="font-sans text-xs text-neutral-200 max-w-[250px] mx-auto mt-1 leading-relaxed font-semibold">
                        Add a limited edition aroma or customize an executive gifting bundle to begin.
                      </p>
                    </div>
                  </div>
                ) : (
                  cartItems.map((item) => {
                    const perfume = PERFUMES.find((p) => p.id === item.perfumeId);
                    if (!perfume) return null;

                    const cardName = item.customization
                      ? CARD_STYLES.find(c => c.id === item.customization?.cardDesign)?.name
                      : '';

                    return (
                      <div
                        key={item.id}
                        className="flex items-start space-x-4 pb-6 border-b border-white/10 last:border-0 last:pb-0 text-left"
                      >
                        {/* Image */}
                        <div className="w-16 h-16 bg-neutral-950 flex-shrink-0 border-2 border-white/10 p-1">
                          <img
                            src={perfume.imageUrl}
                            alt={perfume.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        {/* Content */}
                        <div className="flex-grow min-w-0">
                          <div className="flex items-baseline justify-between gap-2">
                            <h4 className="font-serif text-sm text-white tracking-wider truncate uppercase font-bold">
                              {perfume.name}
                            </h4>
                            <span className="font-mono text-sm text-gold-200 flex-shrink-0 font-extrabold">
                              ₹{(item.unitPrice * item.quantity).toLocaleString(undefined, {minimumFractionDigits: 2})}
                            </span>
                          </div>
                          
                          <p className="font-sans text-[10px] text-neutral-200 mt-0.5 uppercase tracking-wider font-extrabold">
                            {item.size} • Standard Limited Flacon
                          </p>

                          {/* Personalization Specs */}
                          {item.isCustomized && item.customization && (
                            <div className="mt-3 p-3 bg-neutral-950 border-2 border-gold-500/30 space-y-2 text-[10px] shadow-lg">
                              
                              <div className="flex items-center space-x-1.5 text-gold-300 font-mono">
                                <Sparkles className="w-3 h-3 text-gold-400" />
                                <span className="uppercase tracking-widest font-extrabold">LASER ENGRAVED</span>
                              </div>

                              <p className="font-sans text-neutral-100 leading-normal font-bold">
                                <strong className="font-extrabold text-neutral-200">Recipient Name:</strong>{' '}
                                <span className="font-mono tracking-wider text-gold-300 font-extrabold">
                                  {item.customization.recipientName}
                                </span>
                              </p>

                              <p className="font-sans text-neutral-100 leading-normal font-bold">
                                <strong className="font-extrabold text-neutral-200">Card Palette:</strong>{' '}
                                <span className="font-extrabold text-neutral-100">{cardName}</span>
                              </p>

                              <div className="pt-1 border-t border-white/10">
                                <p className="font-sans text-neutral-200 italic line-clamp-2 leading-relaxed font-bold">
                                  "{item.customization.customMessage}"
                                </p>
                              </div>

                              {item.customization.includeCorporateLogo && (
                                <p className="font-mono text-[8px] bg-gold-950/50 text-gold-300 px-1.5 py-0.5 inline-block uppercase tracking-wider mt-1 border border-gold-500/40 font-extrabold animate-pulse">
                                  + Corporate Crest Cap Seal
                                </p>
                              )}
                            </div>
                          )}

                          {/* Control Row */}
                          <div className="flex items-center justify-between mt-4">
                            
                            {/* Qty update */}
                            <div className="flex items-center border-2 border-white/20 bg-neutral-950">
                              <button
                                onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                className="px-2.5 py-1 font-mono text-neutral-200 hover:text-white cursor-pointer font-extrabold"
                              >
                                -
                              </button>
                              <span className="px-3 font-mono text-xs text-white font-extrabold">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                className="px-2.5 py-1 font-mono text-neutral-200 hover:text-white cursor-pointer font-extrabold"
                              >
                                +
                              </button>
                            </div>

                            {/* Remove Trigger */}
                            <button
                              onClick={() => onRemoveItem(item.id)}
                              className="text-neutral-400 hover:text-rose-400 transition-colors cursor-pointer p-1"
                              aria-label="Remove Item"
                            >
                              <Trash2 className="w-4.5 h-4.5" />
                            </button>

                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Subtotal, Estimates & Checkout Checkout Button */}
              {cartItems.length > 0 && (
                <div className="p-6 bg-neutral-950 border-t-2 border-white/10 space-y-4">
                  
                  {/* Summary Rows */}
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between text-neutral-200 font-bold">
                      <span>Collection Subtotal</span>
                      <span className="font-mono text-white font-extrabold">₹{subtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                    </div>
                    <div className="flex items-center justify-between text-neutral-200 font-bold">
                      <span>Delivery</span>
                      <span className="font-mono text-emerald-400 font-extrabold">
                        FREE
                      </span>
                    </div>
                    
                    <div className="pt-3 border-t border-white/10 flex items-baseline justify-between">
                      <span className="font-serif text-sm text-white uppercase tracking-wider font-extrabold">Estimated Total</span>
                      <span className="font-mono text-lg text-gold-200 font-extrabold">
                        ₹{total.toLocaleString(undefined, {minimumFractionDigits: 2})}
                      </span>
                    </div>
                  </div>

                  {/* Free shipping banner */}
                  <div className="p-2.5 bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 text-[10px] text-left flex items-start space-x-2 font-bold shadow">
                    <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-400" />
                    <span>
                      Complimentary premium delivery applied to your order.
                    </span>
                  </div>

                  {/* Secure Check notes */}
                  <div className="flex items-center justify-center space-x-1.5 text-[9px] text-neutral-200 font-mono tracking-widest pt-1 uppercase font-extrabold">
                    <ShieldAlert className="w-3.5 h-3.5 text-gold-500" />
                    <span>SECURE CONCIERGE CHECKOUT GATEWAY</span>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={onTriggerCheckout}
                    className="w-full py-4 bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-neutral-950 font-sans text-xs uppercase tracking-[0.25em] font-extrabold shadow-xl hover:shadow-gold-glow transition-all cursor-pointer flex items-center justify-center space-x-2"
                  >
                    <CreditCard className="w-4 h-4 stroke-[2.5]" />
                    <span>Proceed to Checkout</span>
                  </button>

                </div>
              )}

            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
