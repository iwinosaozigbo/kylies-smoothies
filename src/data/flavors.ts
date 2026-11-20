export interface FloatingFruitSpec {
  id: string;
  src: string;
  alt: string;
  /** Desktop left/top in % */
  desktopPos: { left: string; top: string };
  /** Mobile left/top in % so it frames cleanly on small screens */
  mobilePos: { left: string; top: string };
  /** Size in px (desktop / mobile) */
  size: { desktop: number; mobile: number };
  /** Base rotation in deg */
  rotation: number;
  /** Depth plane: 'mid' | 'soft' | 'bokeh' */
  plane: 'mid' | 'soft' | 'bokeh';
  /** Pointer parallax multiplier */
  parallax: number;
  /** Scroll fly-out target vector (vw / vh / deg / scale) */
  flyOut: { x: number; y: number; rot: number; scale: number };
  /** Idle bobbing duration & amplitude */
  floatDur: number;
  floatAmp: number;
  /** Hide on tiny mobile if too crowded */
  hideOnMobile?: boolean;
}

export interface IngredientDetail {
  name: string;
  percentage: number;
  origin: string;
  benefit: string;
  image: string;
}

export interface FlavorItem {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  price: number;
  bottleImage: string;
  /** Optional CSS filter for extended menu editions */
  bottleFilter?: string;
  category: 'berry' | 'greens' | 'tropical';
  heroFeatured?: boolean;
  theme: {
    bg: string;
    blob: string;
    blobDeep: string;
    accent: string;
    softBg: string;
    pillText: string;
    ring: string;
  };
  badges: string[];
  nutrition: {
    calories: number;
    vitaminC: number;
    potassium: string;
    fiber: string;
    protein: string;
    addedSugar: string;
  };
  ingredients: IngredientDetail[];
  floatingFruits: FloatingFruitSpec[];
}

export const FLAVORS: FlavorItem[] = [
  {
    id: 'strawberry-fantasy',
    name: 'Strawberry Fantasy',
    shortName: 'Strawberry',
    tagline: 'The original duet of Strawberry and Banana.',
    description:
      'Sun-drenched organic Albion strawberries cold-blended with creamy Cavendish banana, a whisper of garden spearmint, and house-pressed almond mylk.',
    price: 12.35,
    bottleImage: '/assets/bottle-strawberry.webp',
    category: 'berry',
    heroFeatured: true,
    theme: {
      bg: '#EC3E3D',
      blob: '#D62831',
      blobDeep: '#C41F29',
      accent: '#EC3E3D',
      softBg: '#FFF3F2',
      pillText: '#D92B2B',
      ring: '#FF8A89',
    },
    badges: ['Bestseller', 'Zero Added Sugar', 'Cold-Blended'],
    nutrition: {
      calories: 195,
      vitaminC: 145,
      potassium: '640mg',
      fiber: '6g',
      protein: '5g',
      addedSugar: '0g',
    },
    ingredients: [
      {
        name: 'Organic Albion Strawberries',
        percentage: 54,
        origin: 'Watsonville, CA',
        benefit: 'Antioxidant-rich vitamin C glow',
        image: '/assets/fruit-strawberry-whole.webp',
      },
      {
        name: 'Creamy Cavendish Banana',
        percentage: 32,
        origin: 'Fair-Trade Ecuador',
        benefit: 'Natural potassium & velvety body',
        image: '/assets/fruit-banana-chunk.webp',
      },
      {
        name: 'Fresh Garden Spearmint',
        percentage: 4,
        origin: 'Local Greenhouse',
        benefit: 'Crisp cooling aromatic finish',
        image: '/assets/fruit-mint-leaf.webp',
      },
      {
        name: 'Raw Pressed Almond Mylk',
        percentage: 10,
        origin: 'House-Milled Daily',
        benefit: 'Silky plant-based smoothness',
        image: '/assets/fruit-strawberry-half.webp',
      },
    ],
    floatingFruits: [
      // Top-left whole strawberry (matching reference image!)
      {
        id: 'sf-berry-tl',
        src: '/assets/fruit-strawberry-whole.webp',
        alt: 'Fresh ripe strawberry',
        desktopPos: { left: '16%', top: '16%' },
        mobilePos: { left: '6%', top: '15%' },
        size: { desktop: 88, mobile: 58 },
        rotation: -18,
        plane: 'mid',
        parallax: 26,
        flyOut: { x: -34, y: -32, rot: -65, scale: 1.25 },
        floatDur: 4.1,
        floatAmp: 12,
      },
      // Far left mint leaf
      {
        id: 'sf-mint-l',
        src: '/assets/fruit-mint-leaf.webp',
        alt: 'Crisp mint leaf',
        desktopPos: { left: '2%', top: '42%' },
        mobilePos: { left: '-3%', top: '38%' },
        size: { desktop: 68, mobile: 44 },
        rotation: -32,
        plane: 'mid',
        parallax: 20,
        flyOut: { x: -42, y: -12, rot: -90, scale: 1.15 },
        floatDur: 5.0,
        floatAmp: 10,
      },
      // Mid-left soft mint leaf
      {
        id: 'sf-mint-ml',
        src: '/assets/fruit-mint-leaf.webp',
        alt: 'Floating mint leaf',
        desktopPos: { left: '27%', top: '57%' },
        mobilePos: { left: '4%', top: '50%' },
        size: { desktop: 66, mobile: 38 },
        rotation: 52,
        plane: 'soft',
        parallax: 34,
        flyOut: { x: -36, y: 18, rot: 110, scale: 1.3 },
        floatDur: 3.8,
        floatAmp: 14,
      },
      // Lower-left diagonal banana chunk (matching reference image!)
      {
        id: 'sf-banana-bl',
        src: '/assets/fruit-banana-chunk.webp',
        alt: 'Ripe banana chunk',
        desktopPos: { left: '11%', top: '67%' },
        mobilePos: { left: '4%', top: '67%' },
        size: { desktop: 122, mobile: 74 },
        rotation: -14,
        plane: 'mid',
        parallax: 28,
        flyOut: { x: -40, y: 34, rot: -55, scale: 1.2 },
        floatDur: 4.7,
        floatAmp: 13,
      },
      // Top-center-right FOREGROUND BOKEH mint leaf (iconic depth-of-field from reference!)
      {
        id: 'sf-bokeh-mint-top',
        src: '/assets/fruit-mint-leaf.webp',
        alt: 'Foreground mint leaf',
        desktopPos: { left: '57%', top: '1%' },
        mobilePos: { left: '62%', top: '3%' },
        size: { desktop: 148, mobile: 86 },
        rotation: 28,
        plane: 'bokeh',
        parallax: 56,
        flyOut: { x: 26, y: -48, rot: 85, scale: 1.65 },
        floatDur: 5.4,
        floatAmp: 18,
      },
      // Upper-right round banana slice (matching reference image!)
      {
        id: 'sf-banana-tr',
        src: '/assets/fruit-banana-slice.webp',
        alt: 'Banana cross-section slice',
        desktopPos: { left: '76%', top: '15%' },
        mobilePos: { left: '77%', top: '17%' },
        size: { desktop: 112, mobile: 68 },
        rotation: 12,
        plane: 'mid',
        parallax: 30,
        flyOut: { x: 38, y: -34, rot: 75, scale: 1.25 },
        floatDur: 4.4,
        floatAmp: 11,
      },
      // Right-edge mint leaf
      {
        id: 'sf-mint-r',
        src: '/assets/fruit-mint-leaf.webp',
        alt: 'Fresh mint leaf',
        desktopPos: { left: '89%', top: '36%' },
        mobilePos: { left: '86%', top: '42%' },
        size: { desktop: 60, mobile: 40 },
        rotation: 25,
        plane: 'mid',
        parallax: 22,
        flyOut: { x: 44, y: -14, rot: 95, scale: 1.2 },
        floatDur: 4.9,
        floatAmp: 10,
      },
      // Near-bottle tiny crisp mint leaf (matching reference image!)
      {
        id: 'sf-mint-center',
        src: '/assets/fruit-mint-leaf.webp',
        alt: 'Small mint leaf',
        desktopPos: { left: '66%', top: '48%' },
        mobilePos: { left: '76%', top: '53%' },
        size: { desktop: 46, mobile: 34 },
        rotation: -42,
        plane: 'mid',
        parallax: 24,
        flyOut: { x: 30, y: 12, rot: -120, scale: 1.35 },
        floatDur: 3.6,
        floatAmp: 9,
        hideOnMobile: true,
      },
      // Bottom-right halved strawberry (matching reference image!)
      {
        id: 'sf-berry-br',
        src: '/assets/fruit-strawberry-half.webp',
        alt: 'Sliced strawberry half',
        desktopPos: { left: '64%', top: '76%' },
        mobilePos: { left: '75%', top: '73%' },
        size: { desktop: 84, mobile: 58 },
        rotation: 18,
        plane: 'mid',
        parallax: 30,
        flyOut: { x: 34, y: 38, rot: 65, scale: 1.25 },
        floatDur: 4.3,
        floatAmp: 12,
      },
      // Bottom-left-center LARGE FOREGROUND BOKEH strawberry (iconic depth-of-field from reference!)
      {
        id: 'sf-bokeh-berry-bot',
        src: '/assets/fruit-strawberry-whole.webp',
        alt: 'Foreground strawberry',
        desktopPos: { left: '25%', top: '78%' },
        mobilePos: { left: '10%', top: '83%' },
        size: { desktop: 168, mobile: 96 },
        rotation: 26,
        plane: 'bokeh',
        parallax: 60,
        flyOut: { x: -24, y: 52, rot: -55, scale: 1.7 },
        floatDur: 5.8,
        floatAmp: 20,
      },
    ],
  },
  {
    id: 'emerald-glow',
    name: 'Emerald Glow',
    shortName: 'Emerald Glow',
    tagline: 'Crisp Kiwi, Baby Kale, Uji Matcha & Garden Mint.',
    description:
      'A bright, silky green blend powered by Hayward kiwi, organic baby kale, ceremonial Japanese matcha, creamy banana, and freshly torn mint.',
    price: 13.5,
    bottleImage: '/assets/bottle-green.webp',
    category: 'greens',
    heroFeatured: true,
    theme: {
      bg: '#249956',
      blob: '#1B7F44',
      blobDeep: '#146936',
      accent: '#249956',
      softBg: '#EFFBF3',
      pillText: '#197D42',
      ring: '#7CE3A6',
    },
    badges: ['Detox Favorite', 'Antioxidants', 'Plant-Powered'],
    nutrition: {
      calories: 175,
      vitaminC: 190,
      potassium: '710mg',
      fiber: '8g',
      protein: '6g',
      addedSugar: '0g',
    },
    ingredients: [
      {
        name: 'Sun-Grown Hayward Kiwi',
        percentage: 42,
        origin: 'Bay of Plenty, NZ',
        benefit: 'Zesty vitamin C & digestive enzymes',
        image: '/assets/fruit-kiwi-slice.webp',
      },
      {
        name: 'Garden Mint & Baby Kale',
        percentage: 28,
        origin: 'Salinas Valley, CA',
        benefit: 'Chlorophyll clarity & crisp freshness',
        image: '/assets/fruit-mint-leaf.webp',
      },
      {
        name: 'Cavendish Banana',
        percentage: 22,
        origin: 'Fair-Trade Ecuador',
        benefit: 'Balances greens with natural silkiness',
        image: '/assets/fruit-banana-slice.webp',
      },
      {
        name: 'Ceremonial Uji Matcha',
        percentage: 8,
        origin: 'Kyoto, Japan',
        benefit: 'Calm, sustained L-theanine energy',
        image: '/assets/fruit-mint-leaf.webp',
      },
    ],
    floatingFruits: [
      {
        id: 'eg-kiwi-tl',
        src: '/assets/fruit-kiwi-slice.webp',
        alt: 'Fresh kiwi slice',
        desktopPos: { left: '15%', top: '16%' },
        mobilePos: { left: '6%', top: '16%' },
        size: { desktop: 108, mobile: 66 },
        rotation: -15,
        plane: 'mid',
        parallax: 26,
        flyOut: { x: -35, y: -32, rot: -80, scale: 1.25 },
        floatDur: 4.3,
        floatAmp: 12,
      },
      {
        id: 'eg-mint-l',
        src: '/assets/fruit-mint-leaf.webp',
        alt: 'Fresh mint leaf',
        desktopPos: { left: '4%', top: '46%' },
        mobilePos: { left: '-2%', top: '41%' },
        size: { desktop: 74, mobile: 46 },
        rotation: -28,
        plane: 'mid',
        parallax: 22,
        flyOut: { x: -44, y: -10, rot: -100, scale: 1.2 },
        floatDur: 4.9,
        floatAmp: 11,
      },
      {
        id: 'eg-banana-bl',
        src: '/assets/fruit-banana-chunk.webp',
        alt: 'Banana chunk',
        desktopPos: { left: '12%', top: '68%' },
        mobilePos: { left: '5%', top: '67%' },
        size: { desktop: 114, mobile: 70 },
        rotation: -16,
        plane: 'mid',
        parallax: 28,
        flyOut: { x: -38, y: 36, rot: -50, scale: 1.2 },
        floatDur: 4.6,
        floatAmp: 13,
      },
      {
        id: 'eg-bokeh-mint-top',
        src: '/assets/fruit-mint-leaf.webp',
        alt: 'Foreground mint leaf',
        desktopPos: { left: '57%', top: '2%' },
        mobilePos: { left: '63%', top: '4%' },
        size: { desktop: 152, mobile: 86 },
        rotation: 32,
        plane: 'bokeh',
        parallax: 56,
        flyOut: { x: 24, y: -48, rot: 90, scale: 1.65 },
        floatDur: 5.5,
        floatAmp: 18,
      },
      {
        id: 'eg-kiwi-tr',
        src: '/assets/fruit-kiwi-slice.webp',
        alt: 'Emerald kiwi round',
        desktopPos: { left: '75%', top: '16%' },
        mobilePos: { left: '76%', top: '17%' },
        size: { desktop: 116, mobile: 70 },
        rotation: 22,
        plane: 'mid',
        parallax: 30,
        flyOut: { x: 40, y: -34, rot: 95, scale: 1.25 },
        floatDur: 4.1,
        floatAmp: 11,
      },
      {
        id: 'eg-mint-r',
        src: '/assets/fruit-mint-leaf.webp',
        alt: 'Crisp mint',
        desktopPos: { left: '87%', top: '38%' },
        mobilePos: { left: '84%', top: '44%' },
        size: { desktop: 66, mobile: 42 },
        rotation: 40,
        plane: 'mid',
        parallax: 24,
        flyOut: { x: 44, y: -12, rot: 110, scale: 1.2 },
        floatDur: 4.7,
        floatAmp: 10,
      },
      {
        id: 'eg-banana-br',
        src: '/assets/fruit-banana-slice.webp',
        alt: 'Banana round slice',
        desktopPos: { left: '65%', top: '76%' },
        mobilePos: { left: '74%', top: '73%' },
        size: { desktop: 90, mobile: 60 },
        rotation: 16,
        plane: 'mid',
        parallax: 28,
        flyOut: { x: 34, y: 38, rot: 75, scale: 1.25 },
        floatDur: 4.4,
        floatAmp: 12,
      },
      {
        id: 'eg-bokeh-kiwi-bot',
        src: '/assets/fruit-kiwi-slice.webp',
        alt: 'Foreground kiwi slice',
        desktopPos: { left: '25%', top: '79%' },
        mobilePos: { left: '10%', top: '83%' },
        size: { desktop: 160, mobile: 92 },
        rotation: -20,
        plane: 'bokeh',
        parallax: 58,
        flyOut: { x: -24, y: 50, rot: -70, scale: 1.65 },
        floatDur: 5.7,
        floatAmp: 19,
      },
    ],
  },
  {
    id: 'mango-sunrise',
    name: 'Mango Sunrise',
    shortName: 'Mango Sunrise',
    tagline: 'Alphonso Mango, Ripe Banana & Coconut Silk.',
    description:
      'Velvety golden Alphonso mangoes blended chilled with ripe banana, bright citrus zest, and young coconut cream for liquid sunshine.',
    price: 12.95,
    bottleImage: '/assets/bottle-mango.webp',
    category: 'tropical',
    heroFeatured: true,
    theme: {
      bg: '#F39C12',
      blob: '#DB8305',
      blobDeep: '#C47100',
      accent: '#EA8C00',
      softBg: '#FFF9EC',
      pillText: '#C87000',
      ring: '#FFD07A',
    },
    badges: ['Tropical Hit', 'Vitamin A Boost', 'Dairy-Free'],
    nutrition: {
      calories: 210,
      vitaminC: 160,
      potassium: '680mg',
      fiber: '5g',
      protein: '4g',
      addedSugar: '0g',
    },
    ingredients: [
      {
        name: 'Alphonso Golden Mango',
        percentage: 56,
        origin: 'Ratnagiri Orchards',
        benefit: 'Beta-carotene glow & lush nectar',
        image: '/assets/fruit-mango-slice.webp',
      },
      {
        name: 'Ripe Cavendish Banana',
        percentage: 28,
        origin: 'Fair-Trade Ecuador',
        benefit: 'Creamy, sustained natural fuel',
        image: '/assets/fruit-banana-slice.webp',
      },
      {
        name: 'Young Coconut Cream',
        percentage: 12,
        origin: 'Cold-Pressed Daily',
        benefit: 'Electrolytes & silky tropical finish',
        image: '/assets/fruit-banana-chunk.webp',
      },
      {
        name: 'Fresh Garden Mint',
        percentage: 4,
        origin: 'Local Greenhouse',
        benefit: 'Bright aromatic lift',
        image: '/assets/fruit-mint-leaf.webp',
      },
    ],
    floatingFruits: [
      {
        id: 'ms-mango-tl',
        src: '/assets/fruit-mango-slice.webp',
        alt: 'Golden mango wedge',
        desktopPos: { left: '15%', top: '16%' },
        mobilePos: { left: '5%', top: '16%' },
        size: { desktop: 118, mobile: 72 },
        rotation: -12,
        plane: 'mid',
        parallax: 26,
        flyOut: { x: -35, y: -32, rot: -65, scale: 1.25 },
        floatDur: 4.2,
        floatAmp: 12,
      },
      {
        id: 'ms-mint-l',
        src: '/assets/fruit-mint-leaf.webp',
        alt: 'Fresh mint leaf',
        desktopPos: { left: '3%', top: '44%' },
        mobilePos: { left: '-2%', top: '40%' },
        size: { desktop: 68, mobile: 44 },
        rotation: -35,
        plane: 'mid',
        parallax: 20,
        flyOut: { x: -42, y: -12, rot: -95, scale: 1.15 },
        floatDur: 4.8,
        floatAmp: 11,
      },
      {
        id: 'ms-banana-bl',
        src: '/assets/fruit-banana-chunk.webp',
        alt: 'Banana chunk',
        desktopPos: { left: '11%', top: '67%' },
        mobilePos: { left: '4%', top: '67%' },
        size: { desktop: 120, mobile: 72 },
        rotation: -14,
        plane: 'mid',
        parallax: 28,
        flyOut: { x: -40, y: 34, rot: -55, scale: 1.2 },
        floatDur: 4.6,
        floatAmp: 13,
      },
      {
        id: 'ms-bokeh-mint-top',
        src: '/assets/fruit-mint-leaf.webp',
        alt: 'Foreground mint leaf',
        desktopPos: { left: '57%', top: '2%' },
        mobilePos: { left: '62%', top: '3%' },
        size: { desktop: 146, mobile: 84 },
        rotation: 26,
        plane: 'bokeh',
        parallax: 56,
        flyOut: { x: 26, y: -48, rot: 85, scale: 1.65 },
        floatDur: 5.4,
        floatAmp: 18,
      },
      {
        id: 'ms-banana-tr',
        src: '/assets/fruit-banana-slice.webp',
        alt: 'Banana slice',
        desktopPos: { left: '76%', top: '15%' },
        mobilePos: { left: '77%', top: '17%' },
        size: { desktop: 110, mobile: 68 },
        rotation: 14,
        plane: 'mid',
        parallax: 30,
        flyOut: { x: 38, y: -34, rot: 75, scale: 1.25 },
        floatDur: 4.4,
        floatAmp: 11,
      },
      {
        id: 'ms-mint-r',
        src: '/assets/fruit-mint-leaf.webp',
        alt: 'Crisp mint leaf',
        desktopPos: { left: '89%', top: '37%' },
        mobilePos: { left: '86%', top: '42%' },
        size: { desktop: 62, mobile: 40 },
        rotation: 30,
        plane: 'mid',
        parallax: 22,
        flyOut: { x: 44, y: -14, rot: 100, scale: 1.2 },
        floatDur: 4.9,
        floatAmp: 10,
      },
      {
        id: 'ms-mango-br',
        src: '/assets/fruit-mango-slice.webp',
        alt: 'Sweet mango slice',
        desktopPos: { left: '64%', top: '75%' },
        mobilePos: { left: '74%', top: '73%' },
        size: { desktop: 96, mobile: 64 },
        rotation: 145,
        plane: 'mid',
        parallax: 30,
        flyOut: { x: 34, y: 38, rot: 65, scale: 1.25 },
        floatDur: 4.3,
        floatAmp: 12,
      },
      {
        id: 'ms-bokeh-mango-bot',
        src: '/assets/fruit-mango-slice.webp',
        alt: 'Foreground mango slice',
        desktopPos: { left: '24%', top: '79%' },
        mobilePos: { left: '8%', top: '83%' },
        size: { desktop: 168, mobile: 96 },
        rotation: 24,
        plane: 'bokeh',
        parallax: 60,
        flyOut: { x: -24, y: 52, rot: -55, scale: 1.7 },
        floatDur: 5.8,
        floatAmp: 20,
      },
    ],
  },
  {
    id: 'velvet-berry',
    name: 'Velvet Wild Berry',
    shortName: 'Velvet Berry',
    tagline: 'Wild Acai, Crushed Strawberry & Oat Cream.',
    description:
      'Deep ruby berry richness balancing tart wild acai, sun-ripened strawberries, and creamy gluten-free oat milk.',
    price: 13.25,
    bottleImage: '/assets/bottle-strawberry.webp',
    bottleFilter: 'hue-rotate(-34deg) saturate(1.18) brightness(0.88)',
    category: 'berry',
    theme: {
      bg: '#8E2469',
      blob: '#721853',
      blobDeep: '#5A1041',
      accent: '#8E2469',
      softBg: '#FDF2F9',
      pillText: '#7A1B59',
      ring: '#E38CC5',
    },
    badges: ['Superfood Acai', 'Antioxidant Rich'],
    nutrition: {
      calories: 205,
      vitaminC: 130,
      potassium: '590mg',
      fiber: '7g',
      protein: '5g',
      addedSugar: '0g',
    },
    ingredients: [
      {
        name: 'Organic Strawberries',
        percentage: 48,
        origin: 'Watsonville, CA',
        benefit: 'Bright juicy berry sweetness',
        image: '/assets/fruit-strawberry-half.webp',
      },
      {
        name: 'Wild Amazonian Acai',
        percentage: 30,
        origin: 'Para, Brazil',
        benefit: 'Deep anthocyanin antioxidants',
        image: '/assets/fruit-strawberry-whole.webp',
      },
      {
        name: 'Creamy Banana',
        percentage: 22,
        origin: 'Fair-Trade Ecuador',
        benefit: 'Lush velvety finish',
        image: '/assets/fruit-banana-slice.webp',
      },
    ],
    floatingFruits: [],
  },
  {
    id: 'citrus-zen',
    name: 'Kiwi Matcha Zen',
    shortName: 'Matcha Zen',
    tagline: 'Double Kiwi, Coconut Water & Mint Chill.',
    description:
      'Ultra-refreshing electrolyte green smoothie crafted for post-workout clarity with crisp Hayward kiwi and chilled mint.',
    price: 13.75,
    bottleImage: '/assets/bottle-green.webp',
    bottleFilter: 'hue-rotate(16deg) saturate(1.08) brightness(1.06)',
    category: 'greens',
    theme: {
      bg: '#16A085',
      blob: '#117E68',
      blobDeep: '#0D6654',
      accent: '#16A085',
      softBg: '#EEFBF8',
      pillText: '#0E7C66',
      ring: '#7CE3CE',
    },
    badges: ['Electrolytes', 'Low Calorie'],
    nutrition: {
      calories: 160,
      vitaminC: 185,
      potassium: '740mg',
      fiber: '7g',
      protein: '4g',
      addedSugar: '0g',
    },
    ingredients: [
      {
        name: 'Double Hayward Kiwi',
        percentage: 52,
        origin: 'Bay of Plenty, NZ',
        benefit: 'Bright tangy vitamin burst',
        image: '/assets/fruit-kiwi-slice.webp',
      },
      {
        name: 'Fresh Spearmint Leaves',
        percentage: 18,
        origin: 'Local Greenhouse',
        benefit: 'Cooling crisp aroma',
        image: '/assets/fruit-mint-leaf.webp',
      },
      {
        name: 'Raw Coconut Water',
        percentage: 30,
        origin: 'Cold-Cracked Daily',
        benefit: 'Instant natural hydration',
        image: '/assets/fruit-banana-slice.webp',
      },
    ],
    floatingFruits: [],
  },
  {
    id: 'golden-nectar',
    name: 'Golden Sunset',
    shortName: 'Golden Sunset',
    tagline: 'Spiced Mango, Banana & Fresh Ginger Glow.',
    description:
      'Warming cold-pressed Peruvian ginger meets sweet Alphonso mango and velvety banana for an immune-loving daily ritual.',
    price: 12.85,
    bottleImage: '/assets/bottle-mango.webp',
    bottleFilter: 'hue-rotate(-14deg) saturate(1.18) brightness(0.98)',
    category: 'tropical',
    theme: {
      bg: '#E86A24',
      blob: '#CC5515',
      blobDeep: '#B2450D',
      accent: '#E86A24',
      softBg: '#FFF5EE',
      pillText: '#C84E10',
      ring: '#FFB185',
    },
    badges: ['Immunity Boost', 'Ginger Kick'],
    nutrition: {
      calories: 200,
      vitaminC: 155,
      potassium: '660mg',
      fiber: '5g',
      protein: '4g',
      addedSugar: '0g',
    },
    ingredients: [
      {
        name: 'Alphonso Mango',
        percentage: 58,
        origin: 'Ratnagiri Orchards',
        benefit: 'Silky tropical nectar',
        image: '/assets/fruit-mango-slice.webp',
      },
      {
        name: 'Cavendish Banana',
        percentage: 32,
        origin: 'Fair-Trade Ecuador',
        benefit: 'Smooth natural body',
        image: '/assets/fruit-banana-chunk.webp',
      },
      {
        name: 'Fresh Mint & Ginger',
        percentage: 10,
        origin: 'Organic Farms',
        benefit: 'Bright zingy warmth',
        image: '/assets/fruit-mint-leaf.webp',
      },
    ],
    floatingFruits: [],
  },
];

export const HERO_FLAVORS = FLAVORS.filter((f) => f.heroFeatured);
