export interface ProductPrice {
  value: number;
  currency: string;
  originalValue?: number;
  discountPercentage?: number;
}

export interface BrandLogo {
  url: string;
  format: "png" | "jpeg" | "jpg" | "webp" | "svg" | "unknown";
}

export interface ProductProfile {
  sourceUrl: string;

  product: {
    name: string;
    description?: string;
    category?: string;
    features: string[];
    benefits: string[];
    claims: string[];
    price?: ProductPrice;
    cta?: string;
  };

  brand: {
    name?: string;
    description?: string;
    logo?: BrandLogo;
    colors?: string[];
    visualStyle?: string;
  };

  seller: {
    name?: string;
    logo?: string;
  };

  assets: {
    productImages: string[];
    additionalImages: string[];
  };

  audience?: {
    description?: string;
    demographics?: string[];
    interests?: string[];
  };

  pageContent?: {
    title?: string;
    metaDescription?: string;
    headings?: string[];
  };
}

export interface VideoShotAnalysis {
  start: number;
  end: number;
  description: string;
  action: string;
  productVisible: boolean;
  productPosition?: string;
  cameraMovement?: string;
  composition?: string;
  dominantColors?: string[];
  safeTextAreas?: string[];
  recommendedOverlay?: string;
}

export interface VideoAnalysis {
  duration: number;
  shots: VideoShotAnalysis[];
  overallStyle?: string;
  dominantColors?: string[];
  visualMood?: string;
}

export interface AdDesignSystem {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };

  typography: {
    headingStyle: string;
    bodyStyle: string;
  };

  visualStyle: string;
  spacing: string;
  borderRadius: string;
  animationStyle: string;
  overlayStyle: string;
  logoTreatment: string;
}

export interface TextOverlayElement {
  id: string;
  type: 'text';
  text: string;
  subtext?: string;
  role: 'hook' | 'benefit' | 'feature' | 'cta' | 'headline';
  position: 'top' | 'center' | 'bottom' | 'bottom-left' | 'top-left';
  fontSize: number;
  color: string;
  backgroundColor?: string;
  animation?: 'fade-in' | 'slide-up' | 'zoom-in' | 'typewriter';
  start: number;
  end: number;
  enabled: boolean;
}

export interface GraphicBadgeElement {
  id: string;
  type: 'badge' | 'price' | 'logo';
  content: string;
  position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  start: number;
  end: number;
  enabled: boolean;
}

export interface AdScene {
  id: string;
  name: string;
  start: number;
  end: number;
  videoClipUrl: string;
  overlays: TextOverlayElement[];
  badges?: GraphicBadgeElement[];
  transition?: 'fade' | 'cut' | 'wipe';
}

export interface EndCard {
  enabled: boolean;
  duration: number;
  headline: string;
  subheadline: string;
  ctaText: string;
  websiteUrl: string;
  logoUrl?: string;
  backgroundColor: string;
  accentColor: string;
  textColor: string;
}

export interface AdComposition {
  duration: number;
  format: "9:16" | "1:1" | "16:9";
  videoUrl: string;
  audioTrack?: {
    url: string;
    volume: number;
    genre?: string;
  };
  scenes: AdScene[];
  endCard?: EndCard;
  json2videoPayload?: Record<string, any>;
}

export interface AdProject {
  id: string;
  sourceUrl: string;
  format: "9:16" | "1:1" | "16:9";
  targetDuration: number;
  style: "auto" | "cinematic" | "punchy" | "minimal";

  productProfile?: ProductProfile;

  creativeDirection?: {
    theme: string;
    targetAudience: string;
    tone: string;
    keySellingPoints: string[];
  };

  videoGeneration?: {
    prompt: string;
    negativePrompt: string;
    provider: string;
    videoUrl?: string;
    status: 'idle' | 'generating' | 'completed' | 'failed';
    error?: string;
    isMock?: boolean;
  };

  videoAnalysis?: VideoAnalysis;

  designSystem?: AdDesignSystem;

  composition?: AdComposition;

  render?: {
    status: 'idle' | 'rendering' | 'completed' | 'failed';
    progress?: number;
    outputUrl?: string;
    renderTimeSeconds?: number;
    error?: string;
    isMock?: boolean;
  };
}

export interface ProviderStatus {
  replicateConfigured: boolean;
  json2videoConfigured: boolean;
  geminiConfigured: boolean;
  defaultMode: 'mock' | 'live';
}
