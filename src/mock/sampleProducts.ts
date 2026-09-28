import { ProductProfile } from '../types/adProject';

export interface SampleProductItem {
  id: string;
  name: string;
  tagline: string;
  url: string;
  profile: ProductProfile;
}

export const SAMPLE_PRODUCTS: SampleProductItem[] = [
  {
    id: 'solstice-coffee',
    name: 'Solstice Precision Coffee Grinder',
    tagline: 'Single-dose conical burr grinder for specialty espresso',
    url: 'https://example-coffee.com/products/solstice-precision-grinder',
    profile: {
      sourceUrl: 'https://example-coffee.com/products/solstice-precision-grinder',
      product: {
        name: 'Solstice Precision Coffee Grinder',
        description: 'Engineered for espresso perfection with 48mm titanium-coated conical burrs, stepless micron adjustment, and near-zero grind retention. Experience café-quality extraction right on your countertop.',
        category: 'Kitchen Appliances / Specialty Coffee',
        features: [
          '48mm titanium-coated conical burrs',
          'Stepless micron dial with 60 micro-increments',
          'Ultra-low 0.1g retention bellows system',
          'Silent DC motor with auto-stop sensor',
          'Magnetic quick-release dosing cup'
        ],
        benefits: [
          'Flawless espresso crema and nuanced flavor extraction',
          'Zero bean waste between different brewing methods',
          'Whisper-quiet morning coffee preparation',
          'Built to last decades with aircraft-grade aluminum'
        ],
        claims: [
          'Ranked #1 Single-Dose Grinder 2025 by Specialty Coffee Guild',
          'Under 0.1g grind retention guaranteed'
        ],
        price: {
          value: 189,
          currency: 'USD',
          originalValue: 229,
          discountPercentage: 17
        },
        cta: 'Shop Now & Save $40'
      },
      brand: {
        name: 'Solstice Labs',
        description: 'Precision artisan coffee engineering crafted in Portland, Oregon.',
        logo: {
          url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=200&auto=format&fit=crop&q=80',
          format: 'jpeg'
        },
        colors: ['#D97706', '#1E293B', '#F8FAFC', '#78350F'],
        visualStyle: 'Warm minimalist industrial, dark brushed metals, amber accent glows'
      },
      seller: {
        name: 'Solstice Labs Direct',
        logo: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=100&auto=format&fit=crop&q=80'
      },
      assets: {
        productImages: [
          'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1589396575653-c09c794ff6a6?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=80'
        ],
        additionalImages: [
          'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&auto=format&fit=crop&q=80'
        ]
      },
      audience: {
        description: 'Discerning espresso enthusiasts, home baristas, and design-conscious kitchen owners.',
        demographics: ['Ages 24-48', 'Higher disposable income', 'Urban / suburban'],
        interests: ['Specialty coffee', 'Kitchen design', 'Minimalist gadgets', 'Artisanal roasters']
      },
      pageContent: {
        title: 'Solstice Precision Conical Burr Coffee Grinder | Official Store',
        metaDescription: 'Discover the Solstice Precision Coffee Grinder with 48mm titanium burrs and near-zero retention. Shop now with free express shipping.',
        headings: [
          'Single-Dose Perfection',
          'Stepless Micron Dial',
          'Near-Zero Retention Bellows',
          'Customer Reviews (4.9 / 5.0)'
        ]
      }
    }
  },
  {
    id: 'lumina-horizon',
    name: 'Lumina Horizon Ambient Smart Lamp',
    tagline: 'Circadian rhythm desktop illumination with wireless inductive base',
    url: 'https://lumina-light.io/products/horizon-ambient',
    profile: {
      sourceUrl: 'https://lumina-light.io/products/horizon-ambient',
      product: {
        name: 'Lumina Horizon Ambient Smart Lamp',
        description: 'Sculptural architectural lighting that syncs with natural solar cycles to enhance focus during the day and melatonin production at sunset. Features 15W wireless charging built into the solid walnut base.',
        category: 'Smart Home / Design Decor',
        features: [
          'Natural circadian color temperature adjustment (2200K - 6500K)',
          'Precision CNC-machined anodized aluminum ring',
          'Integrated 15W Qi2 wireless charging pad',
          'Touchless gesture dimming and capacitive slide control',
          'Apple HomeKit, Matter, and Alexa seamless integration'
        ],
        benefits: [
          'Eliminates late-night eye strain and boosts restful sleep',
          'Declutters your desk with integrated fast charging',
          'Transforms any workspace into a high-end designer studio'
        ],
        claims: [
          '98+ High CRI color rendering accuracy',
          'Featured in Architectural Digest 2025'
        ],
        price: {
          value: 129,
          currency: 'USD',
          originalValue: 169,
          discountPercentage: 24
        },
        cta: 'Upgrade Your Desk'
      },
      brand: {
        name: 'Lumina Design Lab',
        description: 'Scandinavian-inspired smart illumination for modern creatives.',
        logo: {
          url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=200&auto=format&fit=crop&q=80',
          format: 'jpeg'
        },
        colors: ['#6366F1', '#0F172A', '#E0E7FF', '#F43F5E'],
        visualStyle: 'Modern architectural, soft gradient bloom, matte anodized textures'
      },
      seller: {
        name: 'Lumina Design Lab',
        logo: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=100&auto=format&fit=crop&q=80'
      },
      assets: {
        productImages: [
          'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&auto=format&fit=crop&q=80'
        ],
        additionalImages: []
      },
      audience: {
        description: 'Creative professionals, remote software engineers, and modern interior lovers.',
        demographics: ['22-45', 'Designers, developers, architects'],
        interests: ['Desk setup', 'Smart home', 'Interior design', 'Productivity gear']
      }
    }
  },
  {
    id: 'aura-bottle',
    name: 'Aura Thermal Pure Insulated Bottle',
    tagline: 'Triple-walled vacuum stainless steel with UV-C self-purifying cap',
    url: 'https://aura-hydration.co/products/pure-bottle-750ml',
    profile: {
      sourceUrl: 'https://aura-hydration.co/products/pure-bottle-750ml',
      product: {
        name: 'Aura Thermal Pure Insulated Bottle',
        description: 'Keep beverages ice-cold for 36 hours or piping hot for 18 hours. Equipped with a patented 280nm UV-C LED in the cap that destroys 99.99% of bacteria and viruses in just 60 seconds.',
        category: 'Sports & Outdoors / Lifestyle',
        features: [
          'Self-cleaning UV-C sterilization cap',
          'Triple-wall copper-lined vacuum insulation',
          'Medical grade 18/8 Pro-Grade stainless steel',
          'Sweat-proof powder coat finish in matte obsidian',
          'Leakproof magnetic sports carry loop'
        ],
        benefits: [
          'Never drink from a stinky water bottle again',
          'Always crisp, ice-cold hydration during intense workouts',
          'Replaces thousands of disposable plastic bottles'
        ],
        claims: [
          'Kills 99.99% of waterborne bio-contaminants',
          'Zero plastic taste or odor retention'
        ],
        price: {
          value: 48,
          currency: 'USD',
          originalValue: 60,
          discountPercentage: 20
        },
        cta: 'Get Pure Hydration'
      },
      brand: {
        name: 'Aura Hydration',
        description: 'Clean drinking technology built for active life.',
        logo: {
          url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=200&auto=format&fit=crop&q=80',
          format: 'jpeg'
        },
        colors: ['#06B6D4', '#0F172A', '#ECFEFF', '#10B981'],
        visualStyle: 'Fresh athletic outdoor, crisp water droplets, clean cyan accents'
      },
      seller: {
        name: 'Aura Hydration Store'
      },
      assets: {
        productImages: [
          'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80'
        ],
        additionalImages: []
      }
    }
  },
  {
    id: 'vanguard-headphones',
    name: 'Vanguard Apex Studio Wireless Headphones',
    tagline: 'Lossless spatial audio with hybrid active noise cancellation',
    url: 'https://vanguard-audio.com/products/apex-studio',
    profile: {
      sourceUrl: 'https://vanguard-audio.com/products/apex-studio',
      product: {
        name: 'Vanguard Apex Studio Wireless Headphones',
        description: 'Immerse yourself in concert-hall acoustic realism. Custom 40mm beryllium drivers deliver razor-sharp audio fidelity, complemented by adaptive AI noise cancellation that silences 42dB of environmental distractions.',
        category: 'Consumer Electronics / Audio',
        features: [
          'Custom 40mm Beryllium acoustic drivers',
          'Hybrid 8-microphone ANC with transparency pass-through',
          '65-hour battery life with 10-minute fast charge',
          'Plush memory foam lambskin leather earcups',
          'Lossless Bluetooth 5.4 with LDAC & aptX Adaptive'
        ],
        benefits: [
          'Total silence in noisy airplanes, trains, and offices',
          'Hear instruments and soundstage details you never noticed before',
          'All-day cloud-like comfort without headband fatigue'
        ],
        claims: [
          'Voted Best ANC Headphones of 2025 by TechCritique',
          '42dB Active Noise Cancellation depth'
        ],
        price: {
          value: 279,
          currency: 'USD',
          originalValue: 349,
          discountPercentage: 20
        },
        cta: 'Claim $70 Off Today'
      },
      brand: {
        name: 'Vanguard Acoustic',
        description: 'Audiophile performance meets uncompromising industrial design.',
        logo: {
          url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&auto=format&fit=crop&q=80',
          format: 'jpeg'
        },
        colors: ['#3B82F6', '#18181B', '#F4F4F5', '#8B5CF6'],
        visualStyle: 'Sleek luxury audio, satin black finishes, micro-etched metal details'
      },
      seller: {
        name: 'Vanguard Direct'
      },
      assets: {
        productImages: [
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80'
        ],
        additionalImages: []
      }
    }
  }
];
