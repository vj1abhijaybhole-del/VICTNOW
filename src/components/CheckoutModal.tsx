import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CreditCard, Landmark, FileText, CheckCircle2, Award, Sparkles, Building, Loader2, ArrowLeft, Heart, ShieldCheck, Mail, Zap, AlertTriangle } from 'lucide-react';
import { CartItem, User as UserType } from '../types';
import { PERFUMES, CARD_STYLES } from '../data';
import { saveOrder } from '../lib/supabase';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onClearCart: () => void;
  currentUser: UserType | null;
}

export default function CheckoutModal({ isOpen, onClose, cartItems, onClearCart, currentUser }: CheckoutModalProps) {
  // Steps: 'form' | 'processing' | 'success'
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');
  const [processState, setProcessState] = useState('Initiating secure vault handshake...');

  // Form states
  const [fullName, setFullName] = useState('Abhijay Bhole');
  const [email, setEmail] = useState('victnowperfumes@gmail.com');
  const [company, setCompany] = useState('VICTNOW Enterprises');
  const [phone, setPhone] = useState('+91-8055854596');

  // Pre-populate fields with authenticated user details
  useEffect(() => {
    if (currentUser && isOpen) {
      if (currentUser.name) {
        setFullName(currentUser.name);
      }
      setEmail(currentUser.email);
      setPhone(currentUser.mobile);
    }
  }, [currentUser, isOpen]);
  const [address, setAddress] = useState('100 Financial Plaza, Penthouse B');
  const [city, setCity] = useState('New York');
  const [stateVal, setStateVal] = useState('New York');
  const [zip, setZip] = useState('10005');
  const [country, setCountry] = useState('United States');
  const [billingMethod, setBillingMethod] = useState<'card' | 'invoice' | 'wire' | 'razorpay'>('razorpay');
  const [poNumber, setPoNumber] = useState('PO-2026-94812');
  const [conciergeNotes, setConciergeNotes] = useState('Deliver before the board meeting on Thursday morning. Please use white-glove security routing.');

  // Generated success metadata
  const [orderId, setOrderId] = useState('');
  const [authCertificateCode, setAuthCertificateCode] = useState('');

  // Razorpay integration states
  const [razorpayError, setRazorpayError] = useState<string>('');
  const [showRzpSimulator, setShowRzpSimulator] = useState<boolean>(false);
  const [activeRzpOrder, setActiveRzpOrder] = useState<any>(null);
  const [isRzpLoading, setIsRzpLoading] = useState<boolean>(false);
  const [forceSandbox, setForceSandbox] = useState<boolean>(true);

  // Auto-detect Razorpay credentials on the server and disable sandbox if real credentials exist
  useEffect(() => {
    if (isOpen) {
      fetch('/api/razorpay/config')
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error('Config request failed');
        })
        .then((config) => {
          if (config && config.isMock === false) {
            setForceSandbox(false);
          } else {
            setForceSandbox(true);
          }
        })
        .catch(() => {
          setForceSandbox(true);
        });
    }
  }, [isOpen]);


  // Math
  const subtotal = cartItems.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);
  const shipping = 0;
  const total = subtotal + shipping;

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const completeSuccessfulOrder = async (rzpOrderId: string, rzpPaymentId: string) => {
    const generatedOrderNum = `VTN-${Math.floor(100000 + Math.random() * 900000)}`;
    const generatedCertNum = `CERT-${Math.floor(200000 + Math.random() * 800000)}-${currentDateCode()}`;
    
    setStep('processing');
    setProcessState('Securing luxury order in database...');

    const res = await saveOrder({
      customer_name: fullName,
      customer_email: email,
      customer_phone: phone,
      company: company || null,
      address: `${address}, ${city}, ${stateVal}, ${zip}, ${country}`,
      city: city,
      zip: zip,
      items: cartItems.map(item => ({
        perfumeId: item.perfumeId,
        size: item.size,
        quantity: item.quantity,
        isCustomized: item.isCustomized,
        recipientName: item.customization?.recipientName || null,
        message: item.customization?.customMessage || null,
        unitPrice: item.unitPrice
      })),
      total_price: total,
      payment_method: `Razorpay (${rzpPaymentId || 'simulated'})`
    });

    if (res.error) {
      setStep('form');
      setRazorpayError(`Database Order Registration Failed: ${res.error.message || res.error}`);
      return;
    }

    setOrderId(generatedOrderNum);
    setAuthCertificateCode(generatedCertNum);
    setStep('success');
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setRazorpayError('');

    if (billingMethod === 'razorpay') {
      setIsRzpLoading(true);
      setStep('processing');
      setProcessState('Initiating secure Razorpay gateway handshake...');

      try {
        const orderRes = await fetch('/api/razorpay/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: total, // already in INR
            currency: 'INR'
          })
        });

        if (!orderRes.ok) {
          throw new Error('Failed to create payment order on server.');
        }

        const order = await orderRes.json();
        setActiveRzpOrder(order);

        const configRes = await fetch('/api/razorpay/config');
        const config = await configRes.json();

        if (forceSandbox || order.isMock || config.isMock) {
          setProcessState('Launching Razorpay Sandbox payment panel...');
          setTimeout(() => {
            setShowRzpSimulator(true);
          }, 800);
          return;
        }

        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          throw new Error('Failed to load Razorpay payment library.');
        }

        setProcessState('Awaiting authentication signature...');
        const options = {
          key: config.keyId,
          amount: order.amount,
          currency: order.currency,
          name: "VICTNOW Perfumes",
          description: "Exclusive Bespoke Purchase",
          order_id: order.id,
          handler: async function (response: any) {
            setStep('processing');
            setProcessState('Verifying Razorpay cryptographic signature...');
            try {
              const verifyRes = await fetch('/api/razorpay/verify-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature
                })
              });
              const verifyResult = await verifyRes.json();
              if (verifyResult.success) {
                completeSuccessfulOrder(response.razorpay_order_id, response.razorpay_payment_id);
              } else {
                setStep('form');
                setRazorpayError(verifyResult.error || 'Payment signature verification failed.');
              }
            } catch (err: any) {
              setStep('form');
              setRazorpayError('Could not connect to verification endpoint.');
            }
          },
          prefill: {
            name: fullName,
            email: email,
            contact: phone
          },
          theme: {
            color: "#d4af37"
          },
          modal: {
            ondismiss: function() {
              setStep('form');
            }
          }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();

      } catch (err: any) {
        setStep('form');
        setRazorpayError(err.message || 'Razorpay initialization failed.');
      } finally {
        setIsRzpLoading(false);
      }
    } else {
      setStep('processing');
      setProcessState('Initiating secure executive vault transaction...');

      // Sync order details to Supabase database
      const res = await saveOrder({
        customer_name: fullName,
        customer_email: email,
        customer_phone: phone,
        company: company || null,
        address: `${address}, ${city}, ${stateVal}, ${zip}, ${country}`,
        city: city,
        zip: zip,
        items: cartItems.map(item => ({
          perfumeId: item.perfumeId,
          size: item.size,
          quantity: item.quantity,
          isCustomized: item.isCustomized,
          recipientName: item.customization?.recipientName || null,
          message: item.customization?.customMessage || null,
          unitPrice: item.unitPrice
        })),
        total_price: total,
        payment_method: billingMethod
      });

      if (res.error) {
        setStep('form');
        setRazorpayError(`Database Order Registration Failed: ${res.error.message || res.error}`);
        return;
      }

      const states = [
        { text: 'Validating limited edition serial allocations...', delay: 600 },
        { text: 'Etching laser blueprint files for recipient crystal engraving...', delay: 1200 },
        { text: 'Generating Gold Foil hot-stamp printing card files...', delay: 1800 },
        { text: 'Registering Certificate of Olfactory Authenticity codes...', delay: 2400 },
        { text: 'Completing order serialization...', delay: 3000 }
      ];

      states.forEach((s) => {
        setTimeout(() => {
          setProcessState(s.text);
        }, s.delay);
      });

      // Final trigger
      setTimeout(() => {
        const generatedOrderNum = `VTN-${Math.floor(100000 + Math.random() * 900000)}`;
        const generatedCertNum = `CERT-${Math.floor(200000 + Math.random() * 800000)}-${currentDateCode()}`;
        setOrderId(generatedOrderNum);
        setAuthCertificateCode(generatedCertNum);
        setStep('success');
      }, 3600);
    }
  };

  const currentDateCode = () => {
    const d = new Date();
    return `${d.getFullYear()}${(d.getMonth()+1).toString().padStart(2,'0')}${d.getDate().toString().padStart(2,'0')}`;
  };

  const handleFinish = () => {
    onClearCart();
    setStep('form');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 md:p-8">
          
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => step !== 'processing' && onClose()}
            className="absolute inset-0 bg-neutral-950/90 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="relative w-full max-w-4xl bg-[#121418] border border-white/5 shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]"
          >
            
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-neutral-950">
              <div className="flex items-center space-x-3 text-left">
                <Award className="w-5 h-5 text-gold-400" />
                <h3 className="font-serif text-sm md:text-base text-gold-200 tracking-widest uppercase font-extrabold">
                  {step === 'form' && 'Executive Checkout Studio'}
                  {step === 'processing' && 'Artisanal Assembly Pipeline'}
                  {step === 'success' && 'Concierge Order Secured'}
                </h3>
              </div>
              {step !== 'processing' && (
                <button
                  onClick={onClose}
                  className="font-mono text-[10px] uppercase tracking-widest text-neutral-200 hover:text-gold-300 transition-colors cursor-pointer font-extrabold"
                >
                  Close [X]
                </button>
              )}
            </div>

            {/* Inner Content Scroller */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10">
              <AnimatePresence mode="wait">
                
                {/* STEP 1: FORM */}
                {step === 'form' && (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    onSubmit={handlePlaceOrder}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 text-left"
                  >
                    {/* Left Column: Form Details (Col 7) */}
                    <div className="lg:col-span-7 space-y-6">
                      
                      {/* Section 1: Contact */}
                      <div className="space-y-4">
                        <h4 className="font-serif text-xs text-gold-300 uppercase tracking-widest border-b border-white/10 pb-2 font-extrabold">
                          Buyer Credentials
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="font-mono text-[10px] uppercase tracking-wider text-neutral-200 block mb-1 font-extrabold">
                              Contact Full Name
                            </label>
                            <input
                              type="text"
                              required
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              className="w-full bg-neutral-950 border-2 border-white/20 px-3 py-2 font-sans text-xs text-white focus:outline-none focus:border-gold-400 transition-colors font-bold"
                            />
                          </div>
                          <div>
                            <label className="font-mono text-[10px] uppercase tracking-wider text-neutral-200 block mb-1 font-extrabold">
                              Corporate Email Address
                            </label>
                            <input
                              type="email"
                              required
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="w-full bg-neutral-950 border-2 border-white/20 px-3 py-2 font-sans text-xs text-white focus:outline-none focus:border-gold-400 transition-colors font-bold"
                            />
                          </div>
                          <div>
                            <label className="font-mono text-[10px] uppercase tracking-wider text-neutral-200 block mb-1 font-extrabold">
                              Concierge Phone Number
                            </label>
                            <input
                              type="text"
                              required
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              className="w-full bg-neutral-950 border-2 border-white/20 px-3 py-2 font-sans text-xs text-white focus:outline-none focus:border-gold-400 transition-colors font-bold"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Section 2: Address */}
                      <div className="space-y-4 pt-4">
                        <h4 className="font-serif text-xs text-gold-300 uppercase tracking-widest border-b border-white/10 pb-2 font-extrabold">
                          Delivery Destination
                        </h4>
                        <div className="space-y-4">
                          <div>
                            <label className="font-mono text-[10px] uppercase tracking-wider text-neutral-200 block mb-1 font-extrabold">
                              Suite / Street Address
                            </label>
                            <input
                              type="text"
                              required
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                              className="w-full bg-neutral-950 border-2 border-white/20 px-3 py-2 font-sans text-xs text-white focus:outline-none focus:border-gold-400 transition-colors font-bold"
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                              <label className="font-mono text-[10px] uppercase tracking-wider text-neutral-200 block mb-1 font-extrabold">
                                City
                              </label>
                              <input
                                type="text"
                                required
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                className="w-full bg-neutral-950 border-2 border-white/20 px-3 py-2 font-sans text-xs text-white focus:outline-none focus:border-gold-400 transition-colors font-bold"
                              />
                            </div>
                            <div>
                              <label className="font-mono text-[10px] uppercase tracking-wider text-neutral-200 block mb-1 font-extrabold">
                                State
                              </label>
                              <input
                                type="text"
                                required
                                value={stateVal}
                                onChange={(e) => setStateVal(e.target.value)}
                                className="w-full bg-neutral-950 border-2 border-white/20 px-3 py-2 font-sans text-xs text-white focus:outline-none focus:border-gold-400 transition-colors font-bold"
                              />
                            </div>
                            <div>
                              <label className="font-mono text-[10px] uppercase tracking-wider text-neutral-200 block mb-1 font-extrabold">
                                ZIP Code
                              </label>
                              <input
                                type="text"
                                required
                                value={zip}
                                onChange={(e) => setZip(e.target.value)}
                                className="w-full bg-neutral-950 border-2 border-white/20 px-3 py-2 font-sans text-xs text-white focus:outline-none focus:border-gold-400 transition-colors font-bold"
                              />
                            </div>
                            <div>
                              <label className="font-mono text-[10px] uppercase tracking-wider text-neutral-200 block mb-1 font-extrabold">
                                Country
                              </label>
                              <input
                                type="text"
                                required
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                className="w-full bg-neutral-950 border-2 border-white/20 px-3 py-2 font-sans text-xs text-white focus:outline-none focus:border-gold-400 transition-colors font-bold"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Section 3: Billing */}
                      <div className="space-y-4 pt-4">
                        <h4 className="font-serif text-xs text-gold-300 uppercase tracking-widest border-b border-white/10 pb-2 font-extrabold">
                          Billing Arrangement
                        </h4>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <button
                            type="button"
                            onClick={() => setBillingMethod('razorpay')}
                            className={`py-3 px-3 border-2 font-mono text-[10px] uppercase tracking-widest cursor-pointer flex flex-col items-center justify-center space-y-1 font-extrabold transition-all duration-200 ${
                              billingMethod === 'razorpay' ? 'border-gold-400 text-gold-300 bg-gold-950/20 shadow-lg shadow-gold-950/30' : 'border-white/10 text-neutral-300 bg-neutral-900/60 hover:bg-neutral-800'
                            }`}
                          >
                            <Zap className="w-4.5 h-4.5 text-gold-400" />
                            <span>Razorpay Pay</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setBillingMethod('invoice')}
                            className={`py-3 px-3 border-2 font-mono text-[10px] uppercase tracking-widest cursor-pointer flex flex-col items-center justify-center space-y-1 font-extrabold transition-all duration-200 ${
                              billingMethod === 'invoice' ? 'border-gold-400 text-gold-300 bg-gold-950/20 shadow-lg' : 'border-white/10 text-neutral-300 bg-neutral-900/60 hover:bg-neutral-800'
                            }`}
                          >
                            <FileText className="w-4.5 h-4.5" />
                            <span>Firm Invoice / PO</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setBillingMethod('card')}
                            className={`py-3 px-3 border-2 font-mono text-[10px] uppercase tracking-widest cursor-pointer flex flex-col items-center justify-center space-y-1 font-extrabold transition-all duration-200 ${
                              billingMethod === 'card' ? 'border-gold-400 text-gold-300 bg-gold-950/20 shadow-lg' : 'border-white/10 text-neutral-300 bg-neutral-900/60 hover:bg-neutral-800'
                            }`}
                          >
                            <CreditCard className="w-4.5 h-4.5" />
                            <span>Executive Card</span>
                          </button>
                        </div>

                        {razorpayError && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-rose-950/30 border-2 border-rose-500/20 p-3 flex items-start space-x-2 text-rose-300 shadow-md rounded-md"
                          >
                            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                            <div className="font-mono text-[10px] uppercase tracking-wider font-bold">
                              <span>Transaction Handshake Error: {razorpayError}</span>
                            </div>
                          </motion.div>
                        )}

                        {billingMethod === 'razorpay' && (
                          <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-3"
                          >
                            <div className="bg-[#0b0c0e] p-4 border-2 border-white/10 text-left shadow-lg space-y-2.5">
                              <div className="flex items-center space-x-2 text-gold-300 font-mono text-xs font-bold uppercase tracking-wider">
                                <Zap className="w-4 h-4 text-gold-400 shrink-0" />
                                <span>Instant Payment Handshake Gate</span>
                              </div>
                              <p className="font-sans text-[11px] text-neutral-200 font-bold leading-relaxed">
                                You will pay in Indian Rupees (INR) securely. Total: <strong className="font-mono text-gold-300 font-extrabold">₹{total.toLocaleString(undefined, {maximumFractionDigits: 0})} INR</strong>.
                              </p>
                              <p className="font-sans text-[10px] text-neutral-400 leading-relaxed">
                                Secured by Razorpay. Accepts Credit/Debit Cards, UPI, Netbanking, and popular wallets.
                              </p>
                            </div>

                          </motion.div>
                        )}

                        {billingMethod === 'invoice' && (
                          <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-[#0b0c0e] p-4 border-2 border-white/10 text-left shadow-lg"
                          >
                            <label className="font-mono text-[10px] uppercase tracking-wider text-neutral-200 block mb-1 font-extrabold">
                              Corporate Purchase Order (PO) Number
                            </label>
                            <input
                              type="text"
                              required
                              value={poNumber}
                              onChange={(e) => setPoNumber(e.target.value)}
                              className="w-full bg-neutral-950 border-2 border-white/20 px-3 py-2 font-mono text-xs text-white focus:outline-none focus:border-gold-400 font-extrabold"
                            />
                            <p className="font-sans text-[11px] text-neutral-200 font-bold mt-1.5 leading-relaxed">
                              A corporate digital invoice will be dispatched to <strong className="font-extrabold text-gold-300">{email}</strong> within 1 hour. Delivery scheduled immediately following formal PO confirmation.
                            </p>
                          </motion.div>
                        )}

                        {billingMethod === 'card' && (
                          <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-[#0b0c0e] p-4 border-2 border-white/10 grid grid-cols-3 gap-4 shadow-lg"
                          >
                            <div className="col-span-3">
                              <label className="font-mono text-[10px] uppercase tracking-wider text-neutral-200 block mb-1 font-extrabold">
                                Executive Card Number
                              </label>
                              <input
                                type="text"
                                required
                                placeholder="•••• •••• •••• ••••"
                                className="w-full bg-neutral-950 border-2 border-white/20 px-3 py-2 font-mono text-xs text-white focus:outline-none font-extrabold placeholder-neutral-500"
                              />
                            </div>
                            <div>
                              <label className="font-mono text-[10px] uppercase tracking-wider text-neutral-200 block mb-1 font-extrabold">
                                Expiration Code
                              </label>
                              <input
                                type="text"
                                required
                                placeholder="MM/YY"
                                className="w-full bg-neutral-950 border-2 border-white/20 px-3 py-2 font-mono text-xs text-white focus:outline-none font-extrabold placeholder-neutral-500"
                              />
                            </div>
                            <div className="col-span-2">
                              <label className="font-mono text-[10px] uppercase tracking-wider text-neutral-200 block mb-1 font-extrabold">
                                CVC / Security Key
                              </label>
                              <input
                                type="text"
                                required
                                placeholder="•••"
                                className="w-full bg-neutral-950 border-2 border-white/20 px-3 py-2 font-mono text-xs text-white focus:outline-none font-extrabold placeholder-neutral-500"
                              />
                            </div>
                          </motion.div>
                        )}

                        {billingMethod === 'wire' && (
                          <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-[#0b0c0e] p-4 border-2 border-white/10 text-xs text-neutral-200 leading-relaxed text-left space-y-1.5 font-bold shadow-lg"
                          >
                            <p><strong className="font-extrabold text-neutral-100">Bank:</strong> Sovereign Trust & Clearing Corp.</p>
                            <p><strong className="font-extrabold text-neutral-100">SWIFT/BIC:</strong> VICTNOWTRNY</p>
                            <p><strong className="font-extrabold text-neutral-100">Routing Number:</strong> •••••8210</p>
                            <p className="text-[10px] text-gold-400 font-mono uppercase tracking-wider pt-2 font-extrabold">
                              Wire receipt instructions will be emailed on dispatch.
                            </p>
                          </motion.div>
                        )}
                      </div>

                      {/* Section 4: Concierge Delivery Instructions */}
                      <div>
                        <label className="font-mono text-[10px] uppercase tracking-wider text-neutral-200 block mb-1 font-extrabold">
                          Private Delivery Notes
                        </label>
                        <textarea
                          rows={2}
                          value={conciergeNotes}
                          onChange={(e) => setConciergeNotes(e.target.value)}
                          className="w-full bg-neutral-950 border-2 border-white/20 p-3 font-sans text-xs text-neutral-100 tracking-wide focus:outline-none focus:border-gold-400 font-bold"
                        />
                      </div>

                    </div>

                    {/* Right Column: Collection Summary & Submit (Col 5) */}
                    <div className="lg:col-span-5 bg-neutral-950 p-6 border-2 border-white/10 h-fit flex flex-col justify-between shadow-2xl">
                      
                      <div className="space-y-6">
                        <h4 className="font-serif text-xs text-gold-400 uppercase tracking-widest border-b border-white/10 pb-2 font-extrabold">
                          Order Breakdown
                        </h4>

                        <div className="space-y-4 max-h-[220px] overflow-y-auto pr-2">
                          {cartItems.map((item) => {
                            const isTrialPack = item.perfumeId === 'signature-trial-pack';
                            const perfume = isTrialPack
                              ? { name: 'Signature Discovery Suite' }
                              : PERFUMES.find(p => p.id === item.perfumeId);
                            if (!perfume) return null;

                            return (
                              <div key={item.id} className="flex justify-between items-start text-xs border-b border-white/10 pb-3 last:border-0 last:pb-0">
                                <div>
                                  <p className="font-serif text-white font-bold uppercase tracking-wider">
                                    {perfume.name} <span className="font-mono text-gold-300 font-extrabold">x{item.quantity}</span>
                                  </p>
                                  {item.isCustomized && (
                                    <p className="font-mono text-[9px] text-gold-300 uppercase mt-0.5 tracking-wider font-extrabold">
                                      {isTrialPack ? `Engraved Name: ${item.customization?.recipientName || 'Myself'}` : `Bespoke Engraved for ${item.customization?.recipientName}`}
                                    </p>
                                  )}
                                </div>
                                <span className="font-mono text-white font-bold flex-shrink-0">
                                  ₹{(item.unitPrice * item.quantity).toLocaleString(undefined, {minimumFractionDigits: 2})}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Totals */}
                        <div className="space-y-2 pt-4 border-t border-white/10 text-xs text-left">
                          <div className="flex justify-between text-neutral-200 font-bold">
                            <span>Subtotal</span>
                            <span className="font-mono text-white font-extrabold">₹{subtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                          </div>
                          <div className="flex justify-between text-neutral-200 font-bold">
                            <span>Delivery</span>
                            <span className="font-mono text-emerald-400 font-extrabold">
                              FREE
                            </span>
                          </div>
                          <div className="flex justify-between pt-3 border-t border-white/10 font-serif text-sm font-extrabold text-white uppercase tracking-wider">
                            <span>Invoice Total</span>
                            <span className="font-mono text-lg text-gold-200 font-extrabold">₹{total.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                          </div>
                        </div>
                      </div>

                      {/* Submit */}
                      <button
                        type="submit"
                        className="w-full py-4 bg-gradient-to-r from-gold-500 to-gold-400 text-neutral-950 font-sans text-xs uppercase tracking-[0.25em] font-extrabold shadow-lg hover:from-gold-400 hover:to-gold-300 cursor-pointer mt-8 transition-all"
                      >
                        Authorize & Dispatch
                      </button>

                      <div className="mt-4 text-center text-[9px] text-neutral-200 font-mono uppercase tracking-widest flex items-center justify-center space-x-1.5 font-extrabold">
                        <ShieldCheck className="w-4 h-4 text-gold-500" />
                        <span>Encrypted Executive Ledger Portal</span>
                      </div>

                    </div>
                  </motion.form>
                )}

                {/* STEP 2: PROCESSING ANIMATION */}
                {step === 'processing' && (
                  <motion.div
                    key="processing"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="flex flex-col items-center justify-center py-20 space-y-8"
                  >
                    <Loader2 className="w-12 h-12 text-gold-400 animate-spin stroke-[1.5]" />
                    <div className="space-y-2 text-center max-w-md">
                      <h4 className="font-serif text-lg text-white tracking-widest uppercase">
                        Assembling Your Signature Suite
                      </h4>
                      <p className="font-mono text-[10px] text-gold-500 uppercase tracking-[0.25em] h-6 flex items-center justify-center animate-pulse">
                        {processState}
                      </p>
                      <p className="font-sans text-xs text-neutral-500 font-light pt-4 leading-relaxed">
                        Each bottle of Muse, Nexus, and Forge is customized by hand. We are encoding unique laser engraving templates, stamping our textured stationery, and assigning official registry records.
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: SUCCESS SUCCESS INVOICE */}
                {step === 'success' && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center space-y-10"
                  >
                    
                    {/* Visual Success Accent */}
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-gold-950/30 border-2 border-gold-500 flex items-center justify-center shadow-gold-glow mb-4">
                        <Sparkles className="w-8 h-8 text-gold-400 animate-pulse" />
                      </div>
                      <h4 className="font-serif text-3xl text-white tracking-widest uppercase font-extrabold">
                        Legacy Registered
                      </h4>
                      <p className="font-sans text-sm text-neutral-100 max-w-md mx-auto mt-2 text-center font-bold leading-relaxed">
                        An elite corporate advisor has been allocated to oversee the physical customization of your order. You will receive a delivery coordination briefing within 1 hour.
                      </p>
                    </div>

                    {/* Highly Polished Authenticity Certificate & Invoice */}
                    <div className="w-full max-w-2xl bg-[#121418] border-2 border-gold-500/30 p-8 md:p-10 relative overflow-hidden text-left shadow-2xl">
                      
                      {/* Gold design borders */}
                      <div className="absolute inset-3 border-2 border-gold-500/10 pointer-events-none" />
                      
                      {/* Top certificate watermark background */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-gold-500/5 blur-[80px] rounded-full pointer-events-none" />

                      {/* Header */}
                      <div className="flex flex-col md:flex-row md:items-start justify-between border-b border-gold-500/20 pb-6 mb-6 gap-4 z-10 relative">
                        <div>
                          <span className="font-serif text-2xl tracking-[0.25em] text-white font-extrabold">VICTNOW</span>
                          <p className="font-mono text-[9px] uppercase tracking-widest text-gold-400 mt-2 pl-[2px] font-extrabold">
                            CERTIFICATE OF AUTHENTICITY & RECEIPT
                          </p>
                        </div>
                        <div className="text-left md:text-right font-mono text-[10px] uppercase tracking-widest text-neutral-200 space-y-1 font-bold">
                          <p><strong>Order Ref:</strong> <span className="text-white font-extrabold">{orderId}</span></p>
                          <p><strong>Registry Seal:</strong> <span className="text-gold-300 font-extrabold">{authCertificateCode}</span></p>
                          <p><strong>Date:</strong> <span className="text-white font-extrabold">{new Date().toLocaleDateString(undefined, {month: 'long', day: 'numeric', year: 'numeric'})}</span></p>
                        </div>
                      </div>

                      {/* Client Details */}
                      <div className="grid grid-cols-2 gap-4 pb-6 border-b border-white/10 text-xs z-10 relative font-bold text-neutral-200">
                        <div>
                          <span className="font-mono text-[9px] text-neutral-400 uppercase tracking-wider block mb-1 font-extrabold">Prepared For</span>
                          <p className="font-serif text-white font-extrabold uppercase tracking-wider">{fullName}</p>
                          <p className="font-sans text-neutral-100 text-[11px] font-semibold mt-0.5">{company || 'Individual Client'}</p>
                        </div>
                        <div>
                          <span className="font-mono text-[9px] text-neutral-400 uppercase tracking-wider block mb-1 font-extrabold">Dispatch Destination</span>
                          <p className="font-sans text-neutral-100 text-[11px] font-bold">{address}</p>
                          <p className="font-sans text-neutral-100 text-[11px] font-bold">{city}, {stateVal}, {zip}, {country}</p>
                        </div>
                      </div>

                      {/* Purchased Itemized Rows */}
                      <div className="py-6 border-b border-white/10 space-y-4 z-10 relative">
                        <span className="font-mono text-[9px] text-neutral-400 uppercase tracking-wider block mb-2 font-extrabold">Registered Assets</span>
                        
                        {cartItems.map((item) => {
                          const isTrialPack = item.perfumeId === 'signature-trial-pack';
                          const perfume = isTrialPack
                            ? { name: 'Signature Discovery Suite' }
                            : PERFUMES.find(p => p.id === item.perfumeId);
                          if (!perfume) return null;

                          return (
                            <div key={item.id} className="flex justify-between items-start text-xs leading-relaxed">
                              <div>
                                <p className="font-serif text-white uppercase tracking-widest font-extrabold">
                                  {perfume.name} <span className="font-mono text-gold-300">{isTrialPack ? `x${item.quantity} Suite` : `x${item.quantity} Bottles`}</span>
                                </p>
                                {item.isCustomized ? (
                                  <div className="mt-1.5 space-y-0.5 bg-neutral-950 p-2.5 border border-white/10">
                                    <p className="font-mono text-[9px] text-gold-400 uppercase tracking-wider font-extrabold">
                                      ✓ Custom Engraving: "{item.customization?.recipientName}"
                                    </p>
                                    <p className="font-sans text-[11px] text-neutral-200 italic font-bold">
                                      Greeting Message: "{item.customization?.customMessage}"
                                    </p>
                                  </div>
                                ) : (
                                  <p className="font-sans text-[10px] text-neutral-400 font-bold">
                                    Standard Issue Limited Edition Bottle
                                  </p>
                                )}
                              </div>
                              <span className="font-mono text-white font-extrabold">
                                ₹{(item.unitPrice * item.quantity).toLocaleString(undefined, {minimumFractionDigits: 2})}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Receipt Footer Calculations */}
                      <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-baseline z-10 relative">
                        {/* Legal Note */}
                        <div className="flex items-start space-x-2 text-[10px] text-neutral-200 leading-relaxed font-bold">
                          <ShieldCheck className="w-4.5 h-4.5 text-gold-400 flex-shrink-0 mt-0.5" />
                          <p>
                            We verify that each bottle in this registry is hand-poured, quality tested, and laser-carved. All oils are sourced under the highest parameters of sustainability and luxury standards.
                          </p>
                        </div>

                        {/* Grand Total */}
                        <div className="text-left md:text-right flex flex-col justify-end">
                          <span className="font-mono text-[9px] text-neutral-400 uppercase tracking-wider block mb-1 font-extrabold">
                            Total Charged Amount
                          </span>
                          <span className="font-serif text-2xl text-gold-300 font-extrabold">
                            ₹{total.toLocaleString(undefined, {minimumFractionDigits: 2})} INR
                          </span>
                          <span className="font-mono text-[9px] text-emerald-400 uppercase tracking-widest mt-1 font-extrabold">
                            ✓ {billingMethod === 'invoice' ? 'PO APPROVED / PENDING INVOICE' : 'AUTHORIZED SECURELY'}
                          </span>
                        </div>
                      </div>

                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full max-w-sm">
                      <button
                        onClick={handleFinish}
                        className="w-full py-4 bg-gradient-to-r from-gold-500 to-gold-400 text-neutral-950 font-sans text-xs uppercase tracking-[0.25em] font-extrabold hover:brightness-110 cursor-pointer shadow-lg"
                      >
                        Return to Brand Store
                      </button>
                    </div>

                  </motion.div>
                )}

              </AnimatePresence>

              {/* Razorpay Interactive Sandbox Simulator Dialog */}
              <AnimatePresence>
                {showRzpSimulator && (
                  <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[200] p-4">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 15 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 15 }}
                      className="bg-neutral-900 border-2 border-gold-400/40 w-full max-w-md shadow-2xl rounded-lg overflow-hidden flex flex-col font-sans"
                    >
                      {/* Simulator Header */}
                      <div className="bg-[#122448] p-4 flex items-center justify-between border-b border-gold-400/20">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded bg-blue-500 flex items-center justify-center shadow-inner">
                            <Zap className="w-4 h-4 text-white animate-pulse" />
                          </div>
                          <div>
                            <h3 className="text-white text-xs font-mono uppercase tracking-widest font-extrabold">
                              Razorpay Sandbox
                            </h3>
                            <p className="text-[9px] text-blue-300 font-mono tracking-wider">SECURE PAYMENTS PORTAL</p>
                          </div>
                        </div>
                        <div className="bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 rounded text-[9px] text-emerald-300 font-mono font-extrabold uppercase tracking-wide">
                          TEST MODE
                        </div>
                      </div>

                      {/* Simulator Body */}
                      <div className="p-5 space-y-4">
                        <div className="bg-neutral-950 p-4 border border-white/5 space-y-2 rounded text-left">
                          <div className="flex justify-between text-[11px] text-neutral-400 font-mono uppercase tracking-wider">
                            <span>Client Email</span>
                            <span className="text-neutral-200 font-bold">{email}</span>
                          </div>
                          <div className="flex justify-between text-[11px] text-neutral-400 font-mono uppercase tracking-wider">
                            <span>Contact Phone</span>
                            <span className="text-neutral-200 font-bold">{phone}</span>
                          </div>
                          <div className="flex justify-between text-[11px] text-neutral-400 font-mono uppercase tracking-wider">
                            <span>Order ID Reference</span>
                            <span className="text-neutral-200 font-mono font-bold">{activeRzpOrder?.id || 'MOCK_ORDER_ID'}</span>
                          </div>
                          <div className="border-t border-white/10 pt-2 flex justify-between text-xs text-neutral-200 font-extrabold uppercase tracking-widest">
                            <span>Total Amount</span>
                            <span className="text-gold-300 text-sm">
                              ₹{Math.round(total).toLocaleString()} INR
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2 text-left">
                          <p className="font-mono text-[9px] text-neutral-400 uppercase tracking-widest font-extrabold">
                            SELECT SIMULATED BANK ACTION
                          </p>
                          <p className="font-sans text-[11px] text-neutral-300 leading-relaxed font-bold">
                            This sandbox environment allows you to simulate Razorpay's API responses inside the secure workspace frame.
                          </p>
                        </div>

                        {/* Simulated Payment Methods Choice List */}
                        <div className="space-y-1.5 text-left">
                          <div className="bg-neutral-950 border border-white/10 px-3 py-2 rounded-md flex items-center justify-between text-xs font-semibold text-neutral-200 hover:border-gold-400/40 transition-colors">
                            <span className="flex items-center space-x-2">
                              <CreditCard className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                              <span>Simulate Visa/Mastercard (Debit/Credit)</span>
                            </span>
                            <span className="text-[9px] text-neutral-500 font-mono font-extrabold">AUTO</span>
                          </div>
                          <div className="bg-neutral-950 border border-white/10 px-3 py-2 rounded-md flex items-center justify-between text-xs font-semibold text-neutral-200 hover:border-gold-400/40 transition-colors">
                            <span className="flex items-center space-x-2">
                              <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              <span>Simulate Instant UPI QR Scan</span>
                            </span>
                            <span className="text-[9px] text-neutral-500 font-mono font-extrabold">AUTO</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="bg-neutral-950 p-4 border-t border-white/10 grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setShowRzpSimulator(false);
                            completeSuccessfulOrder(activeRzpOrder?.id || 'order_mock_sim', 'pay_mock_' + Math.floor(100000 + Math.random() * 900000));
                          }}
                          className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-[10px] uppercase tracking-widest font-extrabold transition-all duration-200 cursor-pointer shadow-lg rounded"
                        >
                          Authorize Payment
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowRzpSimulator(false);
                            setStep('form');
                            setRazorpayError('Simulated transaction declined/cancelled by customer.');
                          }}
                          className="w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 text-rose-400 font-mono text-[10px] uppercase tracking-widest font-extrabold transition-all duration-200 cursor-pointer rounded"
                        >
                          Decline/Cancel
                        </button>
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>

            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
