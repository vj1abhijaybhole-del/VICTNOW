import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Gift, Calendar, Sparkles, User, Package, ChevronRight, Activity } from 'lucide-react';
import { fetchUserActivities } from '../lib/supabase';
import { User as UserType } from '../types';

interface ActivityHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserType | null;
}

export default function ActivityHistoryModal({ isOpen, onClose, currentUser }: ActivityHistoryModalProps) {
  const [orders, setOrders] = useState<any[]>([]);
  const [giftingRequests, setGiftingRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [trackingEmail, setTrackingEmail] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (currentUser?.email) {
        setTrackingEmail(currentUser.email);
        loadActivitiesForEmail(currentUser.email);
      } else {
        setOrders([]);
        setGiftingRequests([]);
        setTrackingEmail('');
        setHasSearched(false);
        setError('');
      }
    }
  }, [isOpen, currentUser]);

  const loadActivitiesForEmail = async (emailToFetch: string) => {
    const trimmed = emailToFetch.trim();
    if (!trimmed) {
      setError('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    setError('');
    setHasSearched(true);
    const { orders: fetchedOrders, giftingRequests: fetchedGifting, error: fetchErr } = await fetchUserActivities(trimmed);
    if (fetchErr) {
      setError(fetchErr);
    } else {
      setOrders(fetchedOrders);
      setGiftingRequests(fetchedGifting);
    }
    setLoading(false);
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            id="activity-backdrop"
          />

          {/* Drawer Panel (Slides in from the right) */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', ease: 'easeOut', duration: 0.4 }}
            className="relative w-full max-w-xl h-full bg-[#0d0f12] border-l border-white/5 shadow-2xl flex flex-col z-10"
            id="activity-history-box"
          >
            {/* Header */}
            <div className="p-6 md:p-8 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gold-950/40 border border-gold-500/30 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-gold-400" />
                </div>
                <div>
                  <h3 className="font-serif text-lg md:text-xl text-white font-extrabold tracking-wider">
                    Client History Suite
                  </h3>
                  <p className="font-mono text-[9px] text-gold-400 uppercase tracking-[0.2em] font-bold mt-0.5">
                    {currentUser?.email || (trackingEmail ? `Tracking: ${trackingEmail}` : 'Order Tracking Lounge')}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-neutral-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                aria-label="Close History Panel"
                id="close-activity-modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 custom-scrollbar">
              {/* If guest and hasn't searched or just generally, show the beautiful order tracking form */}
              {!currentUser && (
                <div className="p-6 bg-[#121418] border-2 border-gold-500/10 rounded-lg space-y-4 shadow-xl">
                  <div className="flex items-center space-x-2 text-gold-400">
                    <Package className="w-4.5 h-4.5 text-gold-400" />
                    <span className="font-mono text-[10px] uppercase tracking-widest font-extrabold">Instant Delivery Tracking</span>
                  </div>
                  <h4 className="font-serif text-base text-white font-extrabold">Track Your VICTNOW Delivery</h4>
                  <p className="font-sans text-xs text-neutral-300 leading-relaxed font-semibold">
                    Enter the corporate or personal email address you specified during checkout to fetch the live dispatch route and delivery progress.
                  </p>
                  
                  <form onSubmit={(e) => { e.preventDefault(); loadActivitiesForEmail(trackingEmail); }} className="space-y-3 pt-2">
                    <div>
                      <label className="font-mono text-[9px] uppercase tracking-wider text-neutral-400 block mb-1 font-extrabold">Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. director@company.com"
                        value={trackingEmail}
                        onChange={(e) => setTrackingEmail(e.target.value)}
                        className="w-full bg-neutral-950 border-2 border-white/10 focus:border-gold-500 px-3 py-2 font-sans text-xs text-white focus:outline-none transition-colors font-bold"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-2.5 bg-gold-500 hover:bg-gold-400 text-neutral-950 font-mono text-2xs uppercase tracking-widest font-extrabold transition-all cursor-pointer shadow-lg flex items-center justify-center space-x-1"
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Activity className="w-3.5 h-3.5" />
                          <span>Fetch Live Progress</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}

              {loading ? (
                <div className="h-64 flex flex-col items-center justify-center space-y-3">
                  <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
                  <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-400">Loading Client Ledger...</span>
                </div>
              ) : error ? (
                <div className="p-4 bg-red-950/20 border border-red-500/20 rounded-md text-red-400 text-xs font-sans">
                  <p className="font-bold mb-1">Failed to Load History</p>
                  <p>{error}</p>
                  <button
                    onClick={() => loadActivitiesForEmail(trackingEmail)}
                    className="mt-3 px-3 py-1 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-[10px] uppercase tracking-wider font-mono font-bold text-red-300 transition-all cursor-pointer"
                  >
                    Try Reconnecting
                  </button>
                </div>
              ) : (currentUser || hasSearched) ? (
                <>
                  {/* Past Orders Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <div className="flex items-center space-x-2">
                        <ShoppingBag className="w-4 h-4 text-gold-400" />
                        <h4 className="font-mono text-2xs uppercase tracking-widest text-neutral-300 font-extrabold">
                          Direct Purchases ({orders.length})
                        </h4>
                      </div>
                    </div>

                    {orders.length === 0 ? (
                      <p className="font-sans text-xs text-neutral-500 font-semibold italic pl-1">
                        No direct standard purchase records found.
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {orders.map((order, idx) => {
                          let parsedItems = [];
                          try {
                            parsedItems = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
                          } catch (e) {
                            parsedItems = order.items || [];
                          }

                          return (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.05 }}
                              key={order.id}
                              className="p-5 bg-[#121418] border border-white/5 hover:border-gold-500/20 transition-all rounded"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-3 border-b border-white/5">
                                <div className="flex items-center space-x-2">
                                  <span className="font-mono text-[10px] uppercase tracking-wider text-gold-400 font-extrabold bg-gold-950/20 px-2.5 py-0.5 border border-gold-500/20 rounded-full">
                                    #ORD{order.id}
                                  </span>
                                  <span className="text-neutral-500 font-sans text-xs">•</span>
                                  <span className="font-sans text-[11px] text-neutral-400 font-semibold flex items-center">
                                    <Calendar className="w-3 h-3 text-neutral-500 mr-1" />
                                    {formatDate(order.created_at)}
                                  </span>
                                </div>
                                <div className="text-right">
                                  <span className="font-mono text-xs font-extrabold text-gold-300">
                                    ₹{Number(order.total_price).toLocaleString('en-IN')}
                                  </span>
                                </div>
                              </div>

                              {/* Order Items */}
                              <div className="space-y-2 mb-3">
                                {parsedItems.map((item: any, i: number) => (
                                  <div key={i} className="flex justify-between items-start text-xs">
                                    <div>
                                      <span className="font-serif text-white font-extrabold capitalize">
                                        VICTNOW {item.perfumeId}
                                      </span>
                                      <span className="font-sans text-neutral-400 font-medium ml-1.5 text-[11px]">
                                        ({item.size || '100 ML'})
                                      </span>
                                      {item.isCustomized && (
                                        <span className="font-mono text-[9px] text-gold-400 uppercase tracking-widest ml-2 bg-gold-950/30 px-1.5 py-0.5 rounded border border-gold-500/10 font-bold">
                                          Gifting Edition
                                        </span>
                                      )}
                                    </div>
                                    <span className="font-mono text-neutral-400 text-2xs font-bold">
                                      {item.quantity}x
                                    </span>
                                  </div>
                                ))}
                              </div>

                              <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-neutral-500 pb-3 border-b border-white/5">
                                <span className="flex items-center">
                                  <Package className="w-3.5 h-3.5 mr-1 text-gold-500/60" />
                                  Method: {order.payment_method === 'cod' ? 'Cash on Delivery' : 'Secure Online Payment'}
                                </span>
                                <span className="text-gold-400 font-bold">DISPATCHED</span>
                              </div>

                              {/* Live Delivery Progress Timeline */}
                              <div className="mt-4 space-y-3">
                                <span className="font-mono text-[9px] text-gold-400 uppercase tracking-widest block font-extrabold">
                                  Live Delivery Updates & Transit Route
                                </span>
                                
                                <div className="grid grid-cols-4 gap-1 relative pt-2">
                                  {/* Progress line */}
                                  <div className="absolute top-[18px] left-[12%] right-[12%] h-[2px] bg-white/10 z-0">
                                    <div className="h-full bg-gold-500 w-[66%]" /> {/* Gold progress up to In Transit (3rd step) */}
                                  </div>
                                  
                                  {[
                                    { label: 'Confirmed', desc: 'Order approved', active: true },
                                    { label: 'Scent QC', desc: 'Crafted & sealed', active: true },
                                    { label: 'In Transit', desc: 'Arrived at hub', active: true },
                                    { label: 'Delivered', desc: 'Hand-delivered', active: false },
                                  ].map((step, idx) => (
                                    <div key={idx} className="flex flex-col items-center text-center relative z-10">
                                      <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 text-[9px] font-mono font-extrabold transition-all ${
                                        step.active 
                                          ? 'bg-[#0d0f12] border-gold-400 text-gold-300 shadow-md shadow-gold-500/20' 
                                          : 'bg-neutral-900 border-white/10 text-neutral-500'
                                      }`}>
                                        {idx + 1}
                                      </div>
                                      <span className={`font-mono text-[9px] uppercase tracking-wider font-extrabold mt-1.5 ${
                                        step.active ? 'text-gold-200' : 'text-neutral-500'
                                      }`}>
                                        {step.label}
                                      </span>
                                      <span className="font-sans text-[8px] text-neutral-400 font-semibold mt-0.5 max-w-[80px] hidden xs:block leading-tight">
                                        {step.desc}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Corporate Gifting Requests Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <div className="flex items-center space-x-2">
                        <Gift className="w-4 h-4 text-gold-400" />
                        <h4 className="font-mono text-2xs uppercase tracking-widest text-neutral-300 font-extrabold">
                          Corporate Gifting Commissions ({giftingRequests.length})
                        </h4>
                      </div>
                    </div>

                    {giftingRequests.length === 0 ? (
                      <p className="font-sans text-xs text-neutral-500 font-semibold italic pl-1">
                        No custom corporate gifting commissions found.
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {giftingRequests.map((req, idx) => (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            key={req.id}
                            className="p-5 bg-[#121418] border border-white/5 hover:border-gold-500/20 transition-all rounded"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-3 border-b border-white/5">
                              <div className="flex items-center space-x-2">
                                <span className="font-mono text-[10px] uppercase tracking-wider text-gold-400 font-extrabold bg-gold-950/20 px-2.5 py-0.5 border border-gold-500/20 rounded-full">
                                  #GFT{req.id}
                                </span>
                                <span className="text-neutral-500 font-sans text-xs">•</span>
                                <span className="font-sans text-[11px] text-neutral-400 font-semibold flex items-center">
                                  <Calendar className="w-3 h-3 text-neutral-500 mr-1" />
                                  {formatDate(req.created_at)}
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="font-mono text-xs font-extrabold text-gold-300">
                                  Qty: {req.quantity}
                                </span>
                              </div>
                            </div>

                            <div className="space-y-2 mb-4 text-xs font-sans">
                              <div>
                                <span className="text-neutral-400 font-semibold">Fragrance Selection:</span>
                                <span className="text-white font-extrabold capitalize ml-1.5 font-serif">
                                  VICTNOW {req.perfume_id} ({req.size})
                                </span>
                              </div>
                              <div>
                                <span className="text-neutral-400 font-semibold">Recipient Name:</span>
                                <span className="text-white font-extrabold ml-1.5">{req.recipient_name}</span>
                              </div>
                              <div>
                                <span className="text-neutral-400 font-semibold">Engraved Inscription:</span>
                                <span className="text-gold-300 italic font-semibold ml-1.5">
                                  "{req.message}"
                                </span>
                                <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 bg-neutral-900 px-1.5 py-0.5 rounded border border-white/5 ml-2 font-bold">
                                  {req.font_style} Font
                                </span>
                              </div>
                              <div>
                                <span className="text-neutral-400 font-semibold">Satin Ribbon Accent:</span>
                                <span className="text-white font-bold ml-1.5 capitalize">{req.ribbon_color}</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-neutral-500 pt-2 pb-3 border-b border-t border-white/5">
                              <span className="flex items-center font-bold text-gold-400 bg-gold-950/20 px-2.5 py-0.5 border border-gold-500/20 rounded-full">
                                CONCIERGE VERIFIED
                              </span>
                              <span className="text-neutral-400">IN PRODUCTION</span>
                            </div>

                            {/* Gifting delivery timeline */}
                            <div className="mt-4 space-y-3">
                              <span className="font-mono text-[9px] text-gold-400 uppercase tracking-widest block font-extrabold">
                                Bespoke Gifting Pipeline Status
                              </span>
                              
                              <div className="grid grid-cols-4 gap-1 relative pt-2">
                                {/* Progress line */}
                                <div className="absolute top-[18px] left-[12%] right-[12%] h-[2px] bg-white/10 z-0">
                                  <div className="h-full bg-gold-500 w-[33%]" /> {/* Gold progress up to Engraving/Design (2nd step) */}
                                </div>
                                
                                {[
                                  { label: 'Verified', desc: 'Design approved', active: true },
                                  { label: 'Engraving', desc: 'Active laser craft', active: true },
                                  { label: 'Quality QC', desc: 'Aroma sealed', active: false },
                                  { label: 'Shipped', desc: 'Delivery dispatch', active: false },
                                ].map((step, idx) => (
                                  <div key={idx} className="flex flex-col items-center text-center relative z-10">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 text-[9px] font-mono font-extrabold transition-all ${
                                      step.active 
                                        ? 'bg-[#0d0f12] border-gold-400 text-gold-300 shadow-md shadow-gold-500/20' 
                                        : 'bg-neutral-900 border-white/10 text-neutral-500'
                                    }`}>
                                      {idx + 1}
                                    </div>
                                    <span className={`font-mono text-[9px] uppercase tracking-wider font-extrabold mt-1.5 ${
                                      step.active ? 'text-gold-200' : 'text-neutral-500'
                                    }`}>
                                      {step.label}
                                    </span>
                                    <span className="font-sans text-[8px] text-neutral-400 font-semibold mt-0.5 max-w-[80px] hidden xs:block leading-tight">
                                      {step.desc}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Dynamic Luxury Callout */}
                  <div className="p-4 bg-gold-950/20 border border-gold-500/20 rounded text-center">
                    <Sparkles className="w-4 h-4 text-gold-400 mx-auto mb-2" />
                    <p className="font-serif text-xs text-gold-300 font-extrabold mb-1">
                      Concierge Assistance Available
                    </p>
                    <p className="font-sans text-[10px] text-neutral-400 leading-relaxed font-semibold">
                      Need custom dispatch scheduling, custom batch sizes, or direct priority shipping? Contact your assigned Elite Concierge support team directly at <span className="text-gold-400">concierge@victnow.com</span>.
                    </p>
                  </div>
                </>
              ) : (
                <div className="h-48 flex flex-col items-center justify-center space-y-2 text-center">
                  <Package className="w-8 h-8 text-neutral-600 animate-bounce" />
                  <p className="font-serif text-sm text-neutral-400 font-bold">Waiting for Email Input</p>
                  <p className="font-sans text-xs text-neutral-500 max-w-xs font-semibold">
                    Submit your email address above to unlock full telemetry updates for your orders.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
