import { VideoAnalysis } from '../types/adProject';

export interface DemoVideoAsset {
  id: string;
  category: string;
  videoUrl: string;
  posterUrl: string;
  duration: number;
  analysis: VideoAnalysis;
}

export const DEMO_VIDEOS: Record<string, DemoVideoAsset> = {
  coffee: {
    id: 'coffee',
    category: 'coffee',
    // High quality vertical coffee commercial / espresso extraction loop
    videoUrl: 'https://assets.mixkit.co/videos/4836/4836-720.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&auto=format&fit=crop&q=80',
    duration: 15,
    analysis: {
      duration: 15,
      overallStyle: 'Cinematic warm macro, shallow depth of field, artisan studio lighting',
      dominantColors: ['#D97706', '#1E293B', '#3B2314', '#F59E0B'],
      visualMood: 'Premium, rich, precise, artisanal',
      shots: [
        {
          start: 0,
          end: 3.5,
          description: 'Macro opening shot of glossy roasted coffee beans cascading into the precision hopper with soft backlight rim.',
          action: 'Coffee beans falling in slow motion into conical burrs',
          productVisible: true,
          productPosition: 'center',
          cameraMovement: 'slow zoom-in',
          composition: 'Centric macro shot with clean top and bottom third negative space',
          dominantColors: ['#3B2314', '#D97706', '#1E293B'],
          safeTextAreas: ['top', 'bottom'],
          recommendedOverlay: 'hook'
        },
        {
          start: 3.5,
          end: 8.0,
          description: 'Side profile of the precision dial adjusting steplessly with tactile click indicators and zero-retention bellows activation.',
          action: 'Dial turning to fine espresso micron setting, grinding soundlessly',
          productVisible: true,
          productPosition: 'bottom-center',
          cameraMovement: 'pan right',
          composition: 'Product in lower two-thirds, open dark headroom on top',
          dominantColors: ['#1E293B', '#F59E0B', '#475569'],
          safeTextAreas: ['top', 'top-left'],
          recommendedOverlay: 'benefit'
        },
        {
          start: 8.0,
          end: 12.0,
          description: 'Silky, golden extraction of espresso streaming through bottomless portafilter into glass demitasse.',
          action: 'Rich crema extraction and steam rising under warm amber studio light',
          productVisible: true,
          productPosition: 'center',
          cameraMovement: 'orbit',
          composition: 'Warm lighting, dark vignette corners',
          dominantColors: ['#D97706', '#78350F', '#18181B'],
          safeTextAreas: ['top', 'bottom'],
          recommendedOverlay: 'feature'
        },
        {
          start: 12.0,
          end: 15.0,
          description: 'Hero commercial freeze frame of the grinder on dark slate countertop next to steaming cup.',
          action: 'Still hero product placement with subtle ambient light shimmer',
          productVisible: true,
          productPosition: 'center',
          cameraMovement: 'static',
          composition: 'Hero product showcase with balanced safe margins',
          dominantColors: ['#0F172A', '#D97706', '#E2E8F0'],
          safeTextAreas: ['top', 'bottom'],
          recommendedOverlay: 'cta'
        }
      ]
    }
  },
  tech: {
    id: 'tech',
    category: 'tech',
    // High quality modern tech / ambient desk video
    videoUrl: 'https://assets.mixkit.co/videos/42220/42220-720.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80',
    duration: 15,
    analysis: {
      duration: 15,
      overallStyle: 'Sleek architectural minimalism, soft gradient diffusion, modern studio aesthetic',
      dominantColors: ['#6366F1', '#0F172A', '#E0E7FF', '#38BDF8'],
      visualMood: 'Futuristic, serene, premium, focused',
      shots: [
        {
          start: 0,
          end: 3.5,
          description: 'Overhead reveal of modern designer desk as ambient light blooms gently into daylight temperature.',
          action: 'Smart light turning on seamlessly with gesture control',
          productVisible: true,
          productPosition: 'center',
          cameraMovement: 'slow zoom-in',
          composition: 'Architectural top-down perspective, generous negative margins',
          dominantColors: ['#0F172A', '#6366F1', '#F8FAFC'],
          safeTextAreas: ['top', 'bottom'],
          recommendedOverlay: 'hook'
        },
        {
          start: 3.5,
          end: 8.0,
          description: 'Close-up on phone docking on wireless inductive charging pad with subtle pulse illumination.',
          action: 'Phone snapping into place with magnetic Qi2 connection',
          productVisible: true,
          productPosition: 'center',
          cameraMovement: 'dynamic tracking',
          composition: 'Product in mid ground, dark negative space in top third',
          dominantColors: ['#1E1B4B', '#818CF8', '#0284C7'],
          safeTextAreas: ['top', 'top-right'],
          recommendedOverlay: 'benefit'
        },
        {
          start: 8.0,
          end: 12.0,
          description: 'Time-lapse transition from crisp daylight 6500K focus light to warm sunset 2200K relaxation amber.',
          action: 'Circadian spectrum shift illuminating wooden grain and workspace',
          productVisible: true,
          productPosition: 'center',
          cameraMovement: 'pan right',
          composition: 'Warm gradient glow across entire frame',
          dominantColors: ['#4338CA', '#F59E0B', '#0F172A'],
          safeTextAreas: ['bottom', 'top'],
          recommendedOverlay: 'feature'
        },
        {
          start: 12.0,
          end: 15.0,
          description: 'Commercial hero lockup of lamp on executive desk with brand emblem subtly reflecting light.',
          action: 'Hero lighting showcase with gentle glow pulse',
          productVisible: true,
          productPosition: 'center',
          cameraMovement: 'static',
          composition: 'Centered product with ample safe text borders',
          dominantColors: ['#0F172A', '#6366F1', '#E2E8F0'],
          safeTextAreas: ['top', 'bottom'],
          recommendedOverlay: 'cta'
        }
      ]
    }
  },
  bottle: {
    id: 'bottle',
    category: 'bottle',
    // Fresh athletic outdoor water bottle clip
    videoUrl: 'https://assets.mixkit.co/videos/4791/4791-720.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80',
    duration: 15,
    analysis: {
      duration: 15,
      overallStyle: 'Crisp high-speed sports cinematography, water splashes, vivid contrast',
      dominantColors: ['#06B6D4', '#0F172A', '#10B981', '#ECFEFF'],
      visualMood: 'Pure, refreshing, energetic, durable',
      shots: [
        {
          start: 0,
          end: 3.5,
          description: 'High-speed capture of cold water droplets exploding in slow motion across the matte obsidian flask.',
          action: 'Water droplets atomizing against insulated steel finish',
          productVisible: true,
          productPosition: 'center',
          cameraMovement: 'slow zoom-in',
          composition: 'Dynamic vertical composition with clean lower third',
          dominantColors: ['#0891B2', '#0F172A', '#F0FDFA'],
          safeTextAreas: ['top', 'bottom'],
          recommendedOverlay: 'hook'
        },
        {
          start: 3.5,
          end: 8.0,
          description: 'Cap illumination with vivid cyan UV-C sterilization ring indicating active pathogen destruction.',
          action: 'UV-C LED ring activating with subtle optical ripple',
          productVisible: true,
          productPosition: 'top-center',
          cameraMovement: 'pan right',
          composition: 'Focus on illuminated cap, wide negative space in lower half',
          dominantColors: ['#06B6D4', '#10B981', '#18181B'],
          safeTextAreas: ['bottom', 'bottom-left'],
          recommendedOverlay: 'benefit'
        },
        {
          start: 8.0,
          end: 12.0,
          description: 'Trail runner grabbing the bottle and taking an ice-cold gulp against mountain sunrise peak.',
          action: 'Hydration in motion outdoors',
          productVisible: true,
          productPosition: 'center',
          cameraMovement: 'dynamic tracking',
          composition: 'Vibrant outdoor lighting with high contrast dark silhouette',
          dominantColors: ['#0284C7', '#0F172A', '#F59E0B'],
          safeTextAreas: ['top', 'bottom'],
          recommendedOverlay: 'feature'
        },
        {
          start: 12.0,
          end: 15.0,
          description: 'Hero product stance standing on rugged granite stone with frost on powder coat.',
          action: 'Hero presentation with sun flare behind cap',
          productVisible: true,
          productPosition: 'center',
          cameraMovement: 'static',
          composition: 'Hero centered stance',
          dominantColors: ['#0F172A', '#06B6D4', '#FFFFFF'],
          safeTextAreas: ['top', 'bottom'],
          recommendedOverlay: 'cta'
        }
      ]
    }
  },
  audio: {
    id: 'audio',
    category: 'audio',
    // Luxury headphones commercial
    videoUrl: 'https://assets.mixkit.co/videos/42220/42220-720.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    duration: 15,
    analysis: {
      duration: 15,
      overallStyle: 'High-contrast luxury industrial product film, soundwave visualization, sleek shadows',
      dominantColors: ['#3B82F6', '#18181B', '#8B5CF6', '#F4F4F5'],
      visualMood: 'Sophisticated, immersive, high-tech, razor-sharp',
      shots: [
        {
          start: 0,
          end: 3.5,
          description: 'Floating headphone assembly exploding slightly to reveal custom beryllium drivers with magnetic flux.',
          action: 'Exploded acoustic driver view assembling with precision click',
          productVisible: true,
          productPosition: 'center',
          cameraMovement: 'orbit',
          composition: 'Geometric center focus, clean top and bottom margins',
          dominantColors: ['#18181B', '#3B82F6', '#64748B'],
          safeTextAreas: ['top', 'bottom'],
          recommendedOverlay: 'hook'
        },
        {
          start: 3.5,
          end: 8.0,
          description: 'City subway noise instantly muffling into acoustic silence as the ANC sensor pulses deep violet blue.',
          action: 'Noise cancellation ring visualization absorbing soundwaves',
          productVisible: true,
          productPosition: 'center',
          cameraMovement: 'slow zoom-in',
          composition: 'Acoustic waveform graphics flowing in background',
          dominantColors: ['#1E1B4B', '#3B82F6', '#C7D2FE'],
          safeTextAreas: ['bottom', 'top'],
          recommendedOverlay: 'benefit'
        },
        {
          start: 8.0,
          end: 12.0,
          description: 'Detailed slow-motion glide across perforated lambskin earcups and brushed metal headband joint.',
          action: 'Luxury craftsmanship tactile glide',
          productVisible: true,
          productPosition: 'center',
          cameraMovement: 'pan right',
          composition: 'Macro texture emphasis, dark negative space',
          dominantColors: ['#18181B', '#8B5CF6', '#F8FAFC'],
          safeTextAreas: ['top', 'top-left'],
          recommendedOverlay: 'feature'
        },
        {
          start: 12.0,
          end: 15.0,
          description: 'Hero product lockup angled dramatically with subtle laser-etched logo catchlight.',
          action: 'Hero product commercial finish',
          productVisible: true,
          productPosition: 'center',
          cameraMovement: 'static',
          composition: 'Hero commercial framing',
          dominantColors: ['#09090B', '#3B82F6', '#E4E4E7'],
          safeTextAreas: ['top', 'bottom'],
          recommendedOverlay: 'cta'
        }
      ]
    }
  }
};

export function getDemoVideoForCategory(category?: string, name?: string): DemoVideoAsset {
  const text = `${category || ''} ${name || ''}`.toLowerCase();
  if (text.includes('coffee') || text.includes('grinder') || text.includes('espresso') || text.includes('bean') || text.includes('brew')) {
    return DEMO_VIDEOS.coffee;
  }
  if (text.includes('bottle') || text.includes('water') || text.includes('drink') || text.includes('fitness') || text.includes('outdoor')) {
    return DEMO_VIDEOS.bottle;
  }
  if (text.includes('audio') || text.includes('headphone') || text.includes('sound') || text.includes('earphone') || text.includes('music')) {
    return DEMO_VIDEOS.audio;
  }
  // default to modern tech/design
  return DEMO_VIDEOS.tech;
}
