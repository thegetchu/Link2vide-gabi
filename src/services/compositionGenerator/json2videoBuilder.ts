import { AdComposition, AdDesignSystem, AdScene, EndCard, ProductProfile, TextOverlayElement, VideoAnalysis } from '../../types/adProject';
import { JSON2VideoMoviePayload, JSON2VideoScene, JSON2VideoElement, JSON2VideoTextElement } from '../../types/json2video';

/**
 * Builds a strictly compliant JSON2Video payload from an AdComposition
 */
export function buildJSON2VideoPayload(
  composition: AdComposition,
  designSystem: AdDesignSystem,
  profile: ProductProfile
): JSON2VideoMoviePayload {
  const isVertical = composition.format === '9:16';
  const isSquare = composition.format === '1:1';
  const width = isVertical ? 1080 : isSquare ? 1080 : 1920;
  const height = isVertical ? 1920 : isSquare ? 1080 : 1080;

  const scenes: JSON2VideoScene[] = [];

  // 1. Process ad scenes
  for (let i = 0; i < composition.scenes.length; i++) {
    const scene = composition.scenes[i];
    const duration = scene.end - scene.start;
    const elements: JSON2VideoElement[] = [];

    // Background video slice
    elements.push({
      type: 'video',
      src: scene.videoClipUrl || composition.videoUrl,
      start: scene.start,
      duration: duration,
      width: '100%',
      height: '100%',
      muted: true
    });

    // Brand logo watermark if enabled (raster PNG/JPEG only)
    if (profile.brand.logo?.url && !profile.brand.logo.url.endsWith('.svg')) {
      elements.push({
        type: 'image',
        src: profile.brand.logo.url,
        x: '6%',
        y: '5%',
        width: 140,
        height: 60,
        start: 0,
        duration: duration,
        border_radius: 8
      });
    }

    // Badges (e.g. price / discount badge)
    if (scene.badges) {
      for (const badge of scene.badges) {
        if (!badge.enabled) continue;
        elements.push({
          type: 'text',
          text: badge.content,
          font_family: 'Montserrat',
          font_size: 28,
          font_weight: 'bold',
          font_color: '#FFFFFF',
          background_color: designSystem.colors.primary,
          border_radius: 20,
          padding: 12,
          x: badge.position.includes('right') ? '70%' : '6%',
          y: badge.position.includes('top') ? '6%' : '84%',
          start: 0.3,
          duration: duration - 0.3,
          animations: [{ type: 'zoom-in', duration: 0.3 }]
        });
      }
    }

    // Text overlays
    for (const overlay of scene.overlays) {
      if (!overlay.enabled) continue;

      let posY: string = '74%';
      if (overlay.position === 'top') posY = '14%';
      else if (overlay.position === 'center') posY = '45%';
      else if (overlay.position === 'bottom') posY = '74%';
      else if (overlay.position === 'top-left') posY = '12%';

      const textElem: JSON2VideoTextElement = {
        type: 'text',
        text: overlay.text,
        font_family: 'Montserrat',
        font_size: overlay.fontSize || (isVertical ? 46 : 40),
        font_weight: '800',
        font_color: overlay.color || designSystem.colors.text,
        background_color: overlay.backgroundColor || designSystem.colors.background,
        border_radius: parseInt(designSystem.borderRadius) || 12,
        padding: 16,
        x: 'center',
        y: posY,
        width: isVertical ? '88%' : '75%',
        text_align: 'center',
        start: 0.2,
        duration: duration - 0.4,
        animations: [
          { type: 'slide-in', direction: 'up', duration: 0.4 },
          { type: 'fade-out', duration: 0.3 }
        ]
      };

      elements.push(textElem);

      // Subtext if present
      if (overlay.subtext) {
        elements.push({
          type: 'text',
          text: overlay.subtext,
          font_family: 'Montserrat',
          font_size: 26,
          font_weight: '500',
          font_color: '#E2E8F0',
          background_color: 'rgba(0,0,0,0.6)',
          border_radius: 8,
          padding: 8,
          x: 'center',
          y: `${parseInt(posY) + 8}%`,
          width: '80%',
          text_align: 'center',
          start: 0.4,
          duration: duration - 0.5,
          animations: [{ type: 'fade-in', duration: 0.3 }]
        });
      }
    }

    scenes.push({
      comment: `Scene ${i + 1}: ${scene.name}`,
      duration,
      transition: i > 0 ? { style: 'fade', duration: 0.4 } : undefined,
      elements
    });
  }

  // 2. Add End Card scene if enabled
  if (composition.endCard && composition.endCard.enabled) {
    const endCard = composition.endCard;
    const endElements: JSON2VideoElement[] = [
      // Headline
      {
        type: 'text',
        text: endCard.headline,
        font_family: 'Montserrat',
        font_size: 52,
        font_weight: '900',
        font_color: endCard.textColor || '#FFFFFF',
        x: 'center',
        y: '28%',
        width: '85%',
        text_align: 'center',
        duration: endCard.duration,
        animations: [{ type: 'fade-in', duration: 0.4 }]
      },
      // Subheadline / Key Benefit
      {
        type: 'text',
        text: endCard.subheadline,
        font_family: 'Montserrat',
        font_size: 30,
        font_weight: '500',
        font_color: '#94A3B8',
        x: 'center',
        y: '42%',
        width: '80%',
        text_align: 'center',
        duration: endCard.duration
      },
      // CTA Button
      {
        type: 'text',
        text: endCard.ctaText,
        font_family: 'Montserrat',
        font_size: 36,
        font_weight: 'bold',
        font_color: '#FFFFFF',
        background_color: endCard.accentColor || designSystem.colors.primary,
        border_radius: 16,
        padding: 20,
        x: 'center',
        y: '58%',
        width: '65%',
        text_align: 'center',
        duration: endCard.duration,
        animations: [{ type: 'zoom-in', duration: 0.3 }]
      },
      // Website URL
      {
        type: 'text',
        text: endCard.websiteUrl,
        font_family: 'Montserrat',
        font_size: 26,
        font_weight: '600',
        font_color: '#CBD5E1',
        x: 'center',
        y: '72%',
        text_align: 'center',
        duration: endCard.duration
      }
    ];

    scenes.push({
      comment: 'End Card: Brand Call to Action',
      duration: endCard.duration,
      "background-color": endCard.backgroundColor || '#0F172A',
      transition: { style: 'fade', duration: 0.5 },
      elements: endElements
    });
  }

  return {
    width,
    height,
    fps: 30,
    quality: 'high',
    scenes
  };
}
