import { GoogleGenAI, Type } from '@google/genai';
import { AdComposition, AdDesignSystem, AdScene, EndCard, GraphicBadgeElement, ProductProfile, TextOverlayElement, VideoAnalysis, VideoShotAnalysis } from '../../types/adProject';
import { artDirectionService } from './artDirectionService';
import { buildJSON2VideoPayload } from './json2videoBuilder';

export class CompositionService {
  private ai: GoogleGenAI | null = null;

  constructor() {
    if (process.env.GEMINI_API_KEY) {
      this.ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });
    }
  }

  async composeAd(
    profile: ProductProfile,
    videoUrl: string,
    videoAnalysis: VideoAnalysis,
    designSystem: AdDesignSystem,
    format: '9:16' | '1:1' | '16:9' = '9:16',
    targetDuration: number = 15
  ): Promise<AdComposition> {
    // 1. Generate advertising copy tailored to the video shots
    let sceneOverlays = await this.generateSceneOverlays(profile, videoAnalysis, designSystem);

    // 2. Build AdScenes
    const scenes: AdScene[] = videoAnalysis.shots.map((shot: VideoShotAnalysis, idx: number) => {
      const overlayData = sceneOverlays[idx] || this.getDefaultOverlayForShot(shot, profile, idx, designSystem);

      const badges: GraphicBadgeElement[] = [];
      // If price is available, show badge on feature shot or closing shot
      if (profile.product.price && (shot.recommendedOverlay === 'feature' || idx === 1)) {
        badges.push({
          id: `badge-${idx}`,
          type: 'price',
          content: `${profile.product.price.currency === 'USD' ? '$' : profile.product.price.currency === 'EUR' ? '€' : ''}${profile.product.price.value}`,
          position: 'top-right',
          start: shot.start,
          end: shot.end,
          enabled: true
        });
      }

      return {
        id: `scene-${idx + 1}`,
        name: `Shot ${idx + 1}: ${shot.recommendedOverlay?.toUpperCase() || 'SCENE'}`,
        start: shot.start,
        end: shot.end,
        videoClipUrl: videoUrl,
        overlays: [overlayData],
        badges,
        transition: idx > 0 ? 'fade' : undefined
      };
    });

    // 3. Build EndCard
    const endCard: EndCard = {
      enabled: true,
      duration: 3,
      headline: profile.product.name,
      subheadline: profile.product.benefits[0] || 'Experience the future of premium design',
      ctaText: profile.product.cta || 'Shop Now & Save',
      websiteUrl: new URL(profile.sourceUrl).hostname.replace('www.', ''),
      logoUrl: profile.brand.logo?.url,
      backgroundColor: '#090D16',
      accentColor: designSystem.colors.primary,
      textColor: '#FFFFFF'
    };

    const composition: AdComposition = {
      duration: targetDuration,
      format,
      videoUrl,
      scenes,
      endCard
    };

    // 4. Build strict JSON2Video payload
    composition.json2videoPayload = buildJSON2VideoPayload(composition, designSystem, profile);

    return composition;
  }

  private async generateSceneOverlays(
    profile: ProductProfile,
    videoAnalysis: VideoAnalysis,
    designSystem: AdDesignSystem
  ): Promise<TextOverlayElement[]> {
    if (this.ai) {
      try {
        const prompt = `You are a world-class TikTok / Reels / YouTube Shorts video ad copywriter.
We need concise, high-converting text overlays for 4 commercial video shots.
Product: ${profile.product.name}
Description: ${profile.product.description}
Top Features: ${profile.product.features.slice(0, 3).join(', ')}
Top Benefits: ${profile.product.benefits.slice(0, 3).join(', ')}
Price: ${profile.product.price ? `${profile.product.price.value} ${profile.product.price.currency}` : 'N/A'}
CTA: ${profile.product.cta || 'Shop Now'}

Shots breakdown:
${videoAnalysis.shots.map((s, i) => `Shot ${i + 1} (${s.start}s - ${s.end}s): ${s.description} | Action: ${s.action} | Safe Text Areas: ${s.safeTextAreas?.join(', ')} | Role: ${s.recommendedOverlay}`).join('\n')}

RULES:
1. Hook: Ultra-short, punchy (under 6 words). E.g. "Your morning just got better"
2. Benefit: Clear value proposition (under 7 words).
3. Feature: Factual standout specification (under 6 words).
4. CTA: Clear action-oriented closing hook.
5. Choose position strictly from safeTextAreas (usually 'top' or 'bottom') to never block faces or the product.`;

        const response = await this.ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING },
                  subtext: { type: Type.STRING },
                  role: { type: Type.STRING },
                  position: { type: Type.STRING }
                },
                required: ['text', 'role', 'position']
              }
            }
          }
        });

        const list = JSON.parse(response.text?.trim() || '[]');
        if (Array.isArray(list) && list.length === videoAnalysis.shots.length) {
          return list.map((item, idx) => {
            const shot = videoAnalysis.shots[idx];
            return {
              id: `overlay-${idx + 1}`,
              type: 'text',
              text: item.text,
              subtext: item.subtext,
              role: (item.role as any) || 'hook',
              position: (['top', 'center', 'bottom', 'bottom-left', 'top-left'].includes(item.position) ? item.position : 'bottom') as any,
              fontSize: 44,
              color: '#FFFFFF',
              backgroundColor: 'rgba(15, 23, 42, 0.85)',
              animation: idx % 2 === 0 ? 'slide-up' : 'fade-in',
              start: shot.start,
              end: shot.end,
              enabled: true
            };
          });
        }
      } catch (err) {
        console.warn('Gemini overlay copywriting fallback:', err);
      }
    }

    // Deterministic fallback copywriting
    return videoAnalysis.shots.map((shot, idx) => this.getDefaultOverlayForShot(shot, profile, idx, designSystem));
  }

  private getDefaultOverlayForShot(
    shot: VideoShotAnalysis,
    profile: ProductProfile,
    idx: number,
    designSystem: AdDesignSystem
  ): TextOverlayElement {
    let text = '';
    let subtext: string | undefined = undefined;
    let role: any = shot.recommendedOverlay || 'benefit';
    let position: any = shot.safeTextAreas?.[0] || 'bottom';

    if (idx === 0) {
      role = 'hook';
      text = profile.product.benefits[0] || `Meet ${profile.product.name}`;
      subtext = 'The new standard in performance';
      position = 'top';
    } else if (idx === 1) {
      role = 'benefit';
      text = profile.product.benefits[1] || profile.product.benefits[0] || 'Crafted for absolute perfection';
      position = 'bottom';
    } else if (idx === 2) {
      role = 'feature';
      text = profile.product.features[0] || 'Precision-Engineered Components';
      subtext = profile.product.features[1] || undefined;
      position = 'top';
    } else {
      role = 'cta';
      text = profile.product.cta || 'Claim Your Exclusive Discount';
      subtext = 'Limited batch available';
      position = 'bottom';
    }

    return {
      id: `overlay-${idx + 1}`,
      type: 'text',
      text,
      subtext,
      role,
      position,
      fontSize: 44,
      color: '#FFFFFF',
      backgroundColor: 'rgba(15, 23, 42, 0.85)',
      animation: 'slide-up',
      start: shot.start,
      end: shot.end,
      enabled: true
    };
  }
}

export const compositionService = new CompositionService();
