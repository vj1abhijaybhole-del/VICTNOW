export interface PerfumeNotes {
  top: string[];
  heart: string[];
  base: string[];
}

export interface Perfume {
  id: 'muse' | 'nexus' | 'forge';
  name: string;
  type: 'women' | 'unisex' | 'men';
  tagline: string;
  price: number;
  size: string;
  edition: string;
  imageUrl: string;
  notes: PerfumeNotes;
  character: string[];
  description: string;
  concentration: string; // e.g., "Premium Parfum"
  longevity: string; // e.g., "12+ Hours"
  sillage: string; // e.g., "Intimate to Strong"
  isLimitedEdition?: boolean;
}

export interface GiftingCustomization {
  recipientName: string;
  cardDesign: 'white' | 'charcoal' | 'navy' | 'gold';
  messagePresetId: string;
  customMessage: string;
  quantity: number;
  includeCorporateLogo: boolean;
  logoUrl?: string;
  engravingFont: 'serif' | 'sans' | 'script';
  size: string;
}

export interface CartItem {
  id: string; // Unique entry ID (e.g., standard item or customized combo)
  perfumeId: string;
  quantity: number;
  isCustomized: boolean;
  customization?: GiftingCustomization;
  unitPrice: number;
  size: string;
}

export interface MessagePreset {
  id: string;
  title: string;
  text: string;
}

export interface Testimonial {
  name: string;
  role: string;
  company: string;
  quote: string;
  perfume: string;
}

export interface User {
  email: string;
  mobile: string;
  name?: string;
}

