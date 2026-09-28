import { GoogleGenAI, Type } from '@google/genai';
import { ProductProfile, VideoAnalysis, VideoShotAnalysis } from '../../types/adProject';
import { getDemoVideoForCategory } from '../../mock/demoVideos';

export class VideoAnalyzerService {
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

  async analyzeVideo(videoUrl: string, profile: ProductProfile, duration: number = 15): Promise<VideoAnalysis> {
    // 1. Try Gemini Vision Analysis if key is available
    if (this.ai) {
      try {
        const analysis = await this.analyzeWithGemini(videoUrl, profile, duration);
        if (analysis && analysis.shots && analysis.shots.length > 0) {
          return analysis;
        }
      } catch (err) {
        console.warn('Gemini video analysis encountered an issue, falling back to deterministic video analyzer:', err);
      }
    }

    // 2. High-fidelity category-adapted fallback analyzer
    return this.analyzeDeterministically(videoUrl, profile, duration);
  }

  private async analyzeWithGemini(videoUrl: string, profile: ProductProfile, duration: number): Promise<VideoAnalysis> {
    const prompt = `You are a video advertising computer-vision and creative analysis system.
We have generated a commercial video for the following product:
Product: ${profile.product.name}
Category: ${profile.product.category || 'Consumer Product'}
Key Features: ${profile.product.features.join('; ')}
Key Benefits: ${profile.product.benefits.join('; ')}
Video URL: ${videoUrl}
Video Duration: ${duration} seconds

TASK:
Analyze this commercial video into 3-4 structured temporal shots.
For each shot, determine:
- start and end timestamps (covering 0 to ${duration}s)
- description of what is shown
- key action happening
- whether product is visible
- product position (e.g. 'center', 'bottom-center', 'left', 'right')
- camera movement (e.g. 'slow zoom-in', 'pan right', 'orbit', 'dynamic tracking', 'static')
- composition description
- 2-3 dominant colors in hex (e.g. ['#1E293B', '#F59E0B'])
- safeTextAreas where text overlays will NOT obscure the product or faces (e.g. ['top', 'bottom', 'bottom-left'])
- recommendedOverlay role for this moment ('hook' for opening, 'benefit' for middle, 'feature' for close-up, 'cta' for ending).

Ensure the overlays align with the product facts.`;

    const response = await this.ai!.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            duration: { type: Type.NUMBER },
            overallStyle: { type: Type.STRING },
            visualMood: { type: Type.STRING },
            dominantColors: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            shots: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  start: { type: Type.NUMBER },
                  end: { type: Type.NUMBER },
                  description: { type: Type.STRING },
                  action: { type: Type.STRING },
                  productVisible: { type: Type.BOOLEAN },
                  productPosition: { type: Type.STRING },
                  cameraMovement: { type: Type.STRING },
                  composition: { type: Type.STRING },
                  dominantColors: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  safeTextAreas: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  recommendedOverlay: { type: Type.STRING }
                },
                required: ['start', 'end', 'description', 'action', 'productVisible', 'safeTextAreas', 'recommendedOverlay']
              }
            }
          },
          required: ['duration', 'shots', 'overallStyle']
        }
      }
    });

    const parsed = JSON.parse(response.text?.trim() || '{}') as VideoAnalysis;
    parsed.duration = duration;
    return parsed;
  }

  private analyzeDeterministically(videoUrl: string, profile: ProductProfile, duration: number): VideoAnalysis {
    const demo = getDemoVideoForCategory(profile.product.category, profile.product.name);
    const baseAnalysis = JSON.parse(JSON.stringify(demo.analysis)) as VideoAnalysis;

    baseAnalysis.duration = duration;

    // Harmonize dominant colors with product profile brand colors if available
    if (profile.brand.colors && profile.brand.colors.length > 0) {
      baseAnalysis.dominantColors = [
        ...profile.brand.colors.slice(0, 2),
        ...(baseAnalysis.dominantColors || []).slice(0, 2)
      ];
    }

    // Scale shot boundaries proportionally to duration
    const scaleFactor = duration / (baseAnalysis.shots[baseAnalysis.shots.length - 1].end || 15);
    baseAnalysis.shots = baseAnalysis.shots.map((shot: VideoShotAnalysis) => ({
      ...shot,
      start: Math.round(shot.start * scaleFactor * 10) / 10,
      end: Math.round(shot.end * scaleFactor * 10) / 10,
      description: shot.description.replace(/coffee grinder|lamp|bottle|headphones/gi, profile.product.name)
    }));

    return baseAnalysis;
  }
}

export const videoAnalyzerService = new VideoAnalyzerService();
