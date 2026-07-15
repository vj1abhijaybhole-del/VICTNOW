import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Database } from 'lucide-react';
import Header from './components/Header';
import Hero from './components/Hero';
import Philosophy from './components/Philosophy';
import ProductSection from './components/ProductSection';
import CorporateGifting from './components/CorporateGifting';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';
import ActivityHistoryModal from './components/ActivityHistoryModal';
import DatabaseConsole from './components/DatabaseConsole';
import DeveloperGateModal from './components/DeveloperGateModal';
import { CartItem, GiftingCustomization, User, Perfume } from './types';
import { saveGiftingRequest, fetchProducts } from './lib/supabase';
import { PERFUMES } from './data';

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isActivityOpen, setIsActivityOpen] = useState(false);
  const [products, setProducts] = useState<Perfume[]>(PERFUMES);

  // Load products dynamically from database
  const loadProducts = async () => {
    try {
      const { data, error } = await fetchProducts();
      if (!error && data && data.length > 0) {
        setProducts(data);
      }
    } catch (err) {
      console.error('Error fetching dynamic database products:', err);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);
  
  // Auth state
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('victnow_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isDbConsoleOpen, setIsDbConsoleOpen] = useState(false);
  const [isDevGateOpen, setIsDevGateOpen] = useState(false);

  // Secret Dev / Admin Backdoor access setup
  useEffect(() => {
    // 1. Direct /admin path routing access gate
    const pathName = window.location.pathname.toLowerCase();
    if (pathName === '/admin' || pathName === '/admin/') {
      setIsDbConsoleOpen(true);
    }

    const secretCode = (import.meta.env.VITE_ADMIN_ACCESS_SECRET || "ceoviju").toLowerCase();

    // 2. Check URL parameters for ?devkey=YOUR_SECRET_CODE
    const params = new URLSearchParams(window.location.search);
    const devkey = params.get('devkey');
    if (devkey && devkey.toLowerCase() === secretCode) {
      setIsDevGateOpen(true);
      // Clean up URL parameter quietly to preserve layout integrity
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }

    // 3. Secret Cheat-Code Sequence: Type the secret word anywhere on the keyboard to summon console
    let typedBuffer = "";
    let lastKeyTime = Date.now();

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore keys typed while focusing on input fields or textareas to prevent false triggers
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
        return;
      }

      const now = Date.now();
      // If there is more than a 3-second gap between typing keys, reset the buffer
      if (now - lastKeyTime > 3000) {
        typedBuffer = "";
      }
      lastKeyTime = now;

      if (e.key.length === 1) {
        typedBuffer += e.key.toLowerCase();
        
        // Keep only the last 20 characters of the typed buffer
        if (typedBuffer.length > 20) {
          typedBuffer = typedBuffer.slice(-20);
        }
        
        if (typedBuffer.endsWith(secretCode)) {
          setIsDevGateOpen(true);
          typedBuffer = ""; // Reset buffer immediately
        } else if (typedBuffer.endsWith('/admin') || typedBuffer.endsWith('admin')) {
          setIsDbConsoleOpen(true);
          typedBuffer = ""; // Reset buffer immediately
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  const [pendingAction, setPendingAction] = useState<{
    type: 'standard' | 'custom';
    perfumeId: 'muse' | 'nexus' | 'forge';
    size?: '50 ML' | '100 ML';
    custom?: GiftingCustomization;
  } | null>(null);

  // Controls which perfume is pre-loaded into the customization workspace
  const [selectedGiftingPerfumeId, setSelectedGiftingPerfumeId] = useState<'muse' | 'nexus' | 'forge'>('muse');

  // Smooth scroll utility
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Raw cart additions
  const executeAddToCart = (perfumeId: 'muse' | 'nexus' | 'forge', size: '50 ML' | '100 ML' = '100 ML') => {
    const perf = products.find((p) => p.id === perfumeId);
    const dbPrice = perf ? perf.price : 499;
    const price = size === '100 ML' ? Math.round(dbPrice * 1.6) : dbPrice;
    setCartItems((prev) => {
      const existing = prev.find((item) => item.perfumeId === perfumeId && !item.isCustomized && item.size === size);
      if (existing) {
        return prev.map((item) =>
          item.id === existing.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: `standard-${perfumeId}-${size}-${Date.now()}`,
          perfumeId,
          quantity: 1,
          isCustomized: false,
          unitPrice: price,
          size
        }
      ];
    });
    setIsCartOpen(true);
  };

  const executeAddCustomizedToCart = (
    perfumeId: 'muse' | 'nexus' | 'forge', 
    custom: GiftingCustomization,
    userOverride?: User
  ) => {
    const perf = products.find((p) => p.id === perfumeId);
    const dbPrice = perf ? perf.price : 499;
    const basePrice = custom.size === '100 ML' ? Math.round(dbPrice * 1.6) : dbPrice;
    const customizationFee = 50;
    let discountRate = 0;
    
    if (custom.quantity >= 50) discountRate = 0.20;
    else if (custom.quantity >= 25) discountRate = 0.15;
    else if (custom.quantity >= 10) discountRate = 0.10;
    else if (custom.quantity >= 5) discountRate = 0.05;

    const discountedProductPrice = basePrice * (1 - discountRate);
    const totalUnitCost = discountedProductPrice + (custom.includeCorporateLogo ? customizationFee + 25 : customizationFee);

    const newCustomItem: CartItem = {
      id: `custom-${perfumeId}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      perfumeId,
      quantity: custom.quantity,
      isCustomized: true,
      customization: custom,
      unitPrice: totalUnitCost,
      size: custom.size
    };

    // Sync customized gifting request to Supabase
    const activeUser = userOverride || currentUser;
    if (activeUser) {
      saveGiftingRequest({
        perfume_id: perfumeId,
        size: custom.size,
        quantity: custom.quantity,
        recipient_name: custom.recipientName,
        message: custom.customMessage,
        font_style: custom.engravingFont,
        ribbon_color: custom.cardDesign,
        customer_email: activeUser.email,
        customer_phone: activeUser.mobile
      });
    }

    setCartItems((prev) => [...prev, newCustomItem]);
    setIsCartOpen(true);
  };

  // Add standard bottle (single units) with login protection
  const handleAddToCart = (perfumeId: 'muse' | 'nexus' | 'forge', size: '50 ML' | '100 ML' = '100 ML') => {
    if (!currentUser) {
      setPendingAction({ type: 'standard', perfumeId, size });
      setIsLoginModalOpen(true);
      return;
    }
    executeAddToCart(perfumeId, size);
  };

  // Route customer to Gifting Suite and pre-select clicked aroma
  const handleSelectForGifting = (perfumeId: 'muse' | 'nexus' | 'forge') => {
    setSelectedGiftingPerfumeId(perfumeId);
    scrollToSection('gifting');
  };

  // Add customized package with login protection
  const handleAddCustomizedToCart = (perfumeId: 'muse' | 'nexus' | 'forge', custom: GiftingCustomization) => {
    if (!currentUser) {
      setPendingAction({ type: 'custom', perfumeId, custom });
      setIsLoginModalOpen(true);
      return;
    }
    executeAddCustomizedToCart(perfumeId, custom);
  };

  // Session triggers
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('victnow_user', JSON.stringify(user));

    if (pendingAction) {
      if (pendingAction.type === 'standard') {
        executeAddToCart(pendingAction.perfumeId, pendingAction.size);
      } else if (pendingAction.type === 'custom' && pendingAction.custom) {
        executeAddCustomizedToCart(pendingAction.perfumeId, pendingAction.custom, user);
      }
      setPendingAction(null);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('victnow_user');
  };

  // Remove individual entry from cart
  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Adjust item quantities inside cart drawer
  const handleUpdateQuantity = (id: string, newQty: number) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
    );
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleTriggerCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // Aggregate quantity for header badge
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#0b0c0e] text-[#f3f4f6] font-sans overflow-x-hidden selection:bg-gold-500 selection:text-[#0b0c0e]">
      
      {/* Luxury Navigation Header */}
      <Header
        cartCount={totalItemsCount}
        onOpenCart={() => setIsCartOpen(true)}
        scrollToSection={scrollToSection}
        currentUser={currentUser}
        onLoginClick={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
        onActivityClick={() => setIsActivityOpen(true)}
      />

      {/* Main Layout Blocks */}
      <main>
        
        {/* 1. Cinematic Hero Screen */}
        <Hero
          onExploreClick={() => scrollToSection('collection')}
          onGiftingClick={() => scrollToSection('gifting')}
        />

        {/* 2. Brand Philosophy & Leadership Manifesto */}
        <Philosophy />

        {/* 3. Interactive Olfactory Collection Showcase */}
        <ProductSection
          products={products}
          onAddToCart={handleAddToCart}
          onSelectForGifting={handleSelectForGifting}
        />

        {/* 4. Bespoke Corporate Personalization Studio */}
        <CorporateGifting
          initialPerfumeId={selectedGiftingPerfumeId}
          onAddCustomizedToCart={handleAddCustomizedToCart}
          products={products}
        />

      </main>

      {/* Luxury Brand Footer */}
      <Footer 
        scrollToSection={scrollToSection} 
        onActivityClick={() => setIsActivityOpen(true)} 
      />

      {/* Interactive Cart Slide-over Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveItem}
        onUpdateQuantity={handleUpdateQuantity}
        onTriggerCheckout={handleTriggerCheckout}
      />

      {/* Secure Checkout Portal & Registry Invoice Generator */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onClearCart={handleClearCart}
        currentUser={currentUser}
      />

      {/* Luxury Client Authentication Portal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Client Activities & Orders History Drawer */}
      <ActivityHistoryModal
        isOpen={isActivityOpen}
        onClose={() => setIsActivityOpen(false)}
        currentUser={currentUser}
      />

      {isDbConsoleOpen && (
        <DatabaseConsole
          isOpen={isDbConsoleOpen}
          onClose={() => {
            setIsDbConsoleOpen(false);
            if (window.location.pathname.toLowerCase() === '/admin' || window.location.pathname.toLowerCase() === '/admin/') {
              window.history.pushState({}, document.title, '/');
            }
          }}
          onDataMutated={loadProducts}
        />
      )}

      <DeveloperGateModal
        isOpen={isDevGateOpen}
        onClose={() => setIsDevGateOpen(false)}
        onSuccess={() => {
          setIsDevGateOpen(false);
          setIsDbConsoleOpen(true);
        }}
      />

    </div>
  );
}
