import { Perfume, MessagePreset, Testimonial } from './types';

// Importing the high-quality assets we generated
import museImg from './assets/images/muse_perfume_bottle_1783423214425.jpg';
import nexusImg from './assets/images/nexus_perfume_bottle_1783423229807.jpg';
import forgeImg from './assets/images/forge_perfume_bottle_1783423243909.jpg';
import heroImg from './assets/images/hero_perfume_banner_1783423199196.jpg';
import giftingBoxImg from './assets/images/corporate_gifting_box_1783423256190.jpg';
import giftingBgImg from './assets/images/gifting_bg_lux_1783432670394.jpg';

export { heroImg, giftingBoxImg, giftingBgImg };

export const PERFUMES: Perfume[] = [
  {
    id: 'muse',
    name: 'MUSE',
    type: 'women',
    tagline: 'The Visionary Command',
    price: 185,
    size: '50 ML',
    edition: 'Limited Run of 500 Bottles',
    imageUrl: museImg,
    description: 'The ultimate olfactory signature for the visionary female leader. Muse is a complex, magnetic blend of rare white florals and deep, grounded cedar. It is a fragrance that precedes your words, establishing a magnetic gravity of grace, intelligence, and uncompromising authority.',
    concentration: 'Premium Parfum',
    longevity: '12+ Hours (Premium Luxury Grade)',
    sillage: 'Commanding & Magnetic',
    notes: {
      top: ['Pink Pepper', 'Damask Rose', 'Sweet Bergamot'],
      heart: ['Jasmine Sambac', 'French Iris', 'Cashmere Wood'],
      base: ['White Patchouli', 'Warm Cedarwood', 'Rich Ambergris']
    },
    character: ['Visionary', 'Graceful', 'Unyielding', 'Sophisticated']
  },
  {
    id: 'nexus',
    name: 'NEXUS',
    type: 'unisex',
    tagline: 'The Architectural Balance',
    price: 185,
    size: '50 ML',
    edition: 'Limited Run of 350 Bottles',
    imageUrl: nexusImg,
    description: 'Built on the principle of balanced intelligence. Nexus is a fluid, architectural fragrance that exists beyond traditional boundaries. Crisp Mediterranean citrus fuses with warm, velvet lavender and deep dry amber to construct an atmosphere of diplomatic precision and intellectual authority.',
    concentration: 'Premium Parfum',
    longevity: '10-12 Hours',
    sillage: 'Refined & Articulate',
    notes: {
      top: ['Calabrian Bergamot', 'Clary Sage', 'Juniper Berry'],
      heart: ['French Lavender', 'Warm Saffron', 'Sandalwood'],
      base: ['Grey Ambergris', 'Haitian Vetiver', 'Oakmoss']
    },
    character: ['Diplomatic', 'Balanced', 'Intellectual', 'Progressive']
  },
  {
    id: 'forge',
    name: 'FORGE',
    type: 'men',
    tagline: 'The Decisive Resolve',
    price: 185,
    size: '50 ML',
    edition: 'Limited Run of 500 Bottles',
    imageUrl: forgeImg,
    description: 'The physical manifestation of absolute resolve. Forge is a powerful, heavy-hitting blend of rich leather, structured vetiver, and dark, warm oud. Specifically formulated for men who build empires out of chaos and carve their strategic vision through sheer focus.',
    concentration: 'Premium Parfum',
    longevity: '14+ Hours (Extreme Longevity)',
    sillage: 'Powerful & Majestic',
    notes: {
      top: ['Smoky Leather', 'Black Cardamom', 'Coriander Seed'],
      heart: ['Dark Oud Wood', 'Virginia Cedar', 'Tobacco Leaf'],
      base: ['Dry Vetiver', 'Bourbon Vanilla', 'Rich Musk']
    },
    character: ['Decisive', 'Commanding', 'Indomitable', 'Architectural']
  }
];

export const MESSAGE_PRESETS: MessagePreset[] = [
  {
    id: 'partnership',
    title: 'Executive Partnership',
    text: 'In appreciation of your exceptional leadership, strategic vision, and valued partnership. May our mutual endeavors continue to forge empires. Warmest regards.'
  },
  {
    id: 'achievement',
    title: 'Milestone Achievement',
    text: 'To celebrate your incredible milestone and outstanding achievement. True leadership is defined by the trails you blaze. Congratulations on this historic success.'
  },
  {
    id: 'appreciation',
    title: 'Board Appreciation',
    text: 'With sincere gratitude for your decisive direction, unyielding commitment, and guidance as a leader. Your presence shapes our collective legacy.'
  },
  {
    id: 'custom',
    title: 'Custom Message',
    text: ''
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Eleanor Vance',
    role: 'Managing Partner',
    company: 'Vanguard Capital',
    quote: 'Muse has become my invisible armor in the boardroom. Its subtle cedarwood undertone sets a tone of authority before I even speak a word.',
    perfume: 'MUSE for Women'
  },
  {
    name: 'Marcus K. Sterling',
    role: 'Chief Executive Officer',
    company: 'Aether Industries',
    quote: 'Forge is exactly what the name implies: solid, indomitable, and structured. In bulk corporate gifting, my executive board was thoroughly impressed with the customized laser engraving.',
    perfume: 'FORGE for Men'
  },
  {
    name: 'Devon Wright',
    role: 'Founder & President',
    company: 'Nexus Legal Group',
    quote: 'For our end-of-year leadership summit, the unisex Nexus was the perfect gift. The personalized executive boxes felt tailored, bespoke, and extremely elite.',
    perfume: 'NEXUS Unisex'
  }
];

export const CARD_STYLES = [
  {
    id: 'white',
    name: 'Executive Ivory',
    bgClass: 'bg-white text-neutral-900 border-neutral-300',
    fontColor: 'text-neutral-800',
    accentColor: 'border-gold-500',
    headerClass: 'font-serif text-neutral-900 border-neutral-200'
  },
  {
    id: 'charcoal',
    name: 'Presidential Charcoal',
    bgClass: 'bg-[#181a1f] text-[#f5edd3] border-neutral-800',
    fontColor: 'text-[#dcd6c5]',
    accentColor: 'border-gold-400',
    headerClass: 'font-serif text-gold-200 border-neutral-800'
  },
  {
    id: 'navy',
    name: 'Sovereign Navy',
    bgClass: 'bg-[#0f172a] text-sky-100 border-slate-800',
    fontColor: 'text-slate-300',
    accentColor: 'border-gold-300',
    headerClass: 'font-serif text-[#ebd8a7] border-slate-800'
  },
  {
    id: 'gold',
    name: 'Monarch Gold Foil',
    bgClass: 'bg-gradient-to-br from-[#121418] to-[#272118] text-amber-50 border-gold-500/30',
    fontColor: 'text-gold-100',
    accentColor: 'border-gold-500',
    headerClass: 'font-serif text-gold-400 border-gold-900/30'
  }
];
