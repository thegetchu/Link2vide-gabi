import { AdDesignSystem, ProductProfile, VideoAnalysis } from '../../types/adProject';

export class ArtDirectionService {
  /**
   * Generates a coherent AdDesignSystem unifying brand identity and video cinematography
   */
  generateDesignSystem(profile: ProductProfile, videoAnalysis?: VideoAnalysis): AdDesignSystem {
    // 1. Color extraction & contrast balancing
    const brandColors = profile.brand.colors || [];
    const videoColors = videoAnalysis?.dominantColors || [];

    // Primary: Brand primary or strong accent
    const primary = brandColors[0] || videoColors[0] || '#D97706';
    // Secondary: Brand secondary or dark slate background
    const secondary = brandColors[1] || videoColors[1] || '#1E293B';
    // Accent: High-visibility vibrancy for CTAs / badges
    const accent = brandColors[3] || brandColors[0] || '#F59E0B';
    // Dark background for overlays
    const background = 'rgba(15, 23, 42, 0.85)';
    // Clean text color
    const text = '#FFFFFF';

    // 2. Typography & style selection based on category
    const category = (profile.product.category || '').toLowerCase();
    let headingStyle = 'font-sans font-extrabold tracking-tight uppercase';
    let bodyStyle = 'font-sans font-medium tracking-normal';
    let visualStyle = 'Modern High-Contrast Minimalist';
    let borderRadius = '12px';
    let animationStyle = 'slide-up';
    let overlayStyle = 'backdrop-blur-md bg-slate-950/80 border border-white/10 shadow-2xl';
    let logoTreatment = 'subtle-badge-top-left';

    if (category.includes('tech') || category.includes('audio') || category.includes('electronic')) {
      headingStyle = 'font-sans font-black tracking-tighter uppercase';
      bodyStyle = 'font-mono text-xs tracking-wider';
      visualStyle = 'Futuristic Cyber-Sleek Studio';
      borderRadius = '8px';
      animationStyle = 'zoom-in';
      overlayStyle = 'backdrop-blur-xl bg-black/75 border border-indigo-500/20 shadow-indigo-950/50 shadow-2xl';
    } else if (category.includes('luxury') || category.includes('cosmetic') || category.includes('fashion')) {
      headingStyle = 'font-serif font-bold tracking-wide';
      bodyStyle = 'font-sans font-light tracking-normal';
      visualStyle = 'Editorial Luxury Elegance';
      borderRadius = '0px';
      animationStyle = 'fade-in';
      overlayStyle = 'backdrop-blur-sm bg-neutral-950/80 border border-amber-200/20 shadow-xl';
    } else if (category.includes('fitness') || category.includes('sport') || category.includes('outdoor')) {
      headingStyle = 'font-sans font-black italic tracking-tight uppercase';
      bodyStyle = 'font-sans font-bold tracking-tight';
      visualStyle = 'High-Impact Athletic Dynamic';
      borderRadius = '16px';
      animationStyle = 'slide-up';
      overlayStyle = 'backdrop-blur-md bg-slate-900/90 border border-emerald-500/30 shadow-2xl';
    }

    return {
      colors: {
        primary,
        secondary,
        accent,
        background,
        text
      },
      typography: {
        headingStyle,
        bodyStyle
      },
      visualStyle,
      spacing: '16px',
      borderRadius,
      animationStyle,
      overlayStyle,
      logoTreatment
    };
  }
}

export const artDirectionService = new ArtDirectionService();
