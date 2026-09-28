import { VideoGenerationInput, VideoGenerationProvider, VideoGenerationResult } from '../videoGenerationProvider';

export class ReplicateWanProvider implements VideoGenerationProvider {
  name = 'Replicate Wan 3.0';
  private apiToken: string;
  private modelVersion: string;

  constructor(apiToken?: string, modelVersion?: string) {
    this.apiToken = apiToken || process.env.REPLICATE_API_TOKEN || '';
    this.modelVersion = modelVersion || process.env.WAN_MODEL_VERSION || 'wan-video/wan-2.1-t2v-14b';
  }

  isAvailable(): boolean {
    return Boolean(this.apiToken && this.apiToken.trim().length > 0);
  }

  async generateVideo(input: VideoGenerationInput): Promise<VideoGenerationResult> {
    if (!this.isAvailable()) {
      throw new Error('Replicate API token is not configured. Please set REPLICATE_API_TOKEN.');
    }

    const startTime = Date.now();

    // Map aspect ratio for Wan 3.0
    const sizeMap: Record<string, string> = {
      '9:16': '720*1280',
      '1:1': '960*960',
      '16:9': '1280*720'
    };

    const payload: any = {
      input: {
        prompt: input.prompt,
        negative_prompt: input.negativePrompt,
        size: sizeMap[input.aspectRatio] || '720*1280',
        num_frames: input.duration >= 15 ? 81 : 49,
        guidance_scale: 6.0,
        sample_shift: 8.0
      }
    };

    if (input.referenceImageUrl) {
      payload.input.image = input.referenceImageUrl;
    }

    // Determine prediction endpoint
    let endpoint = 'https://api.replicate.com/v1/predictions';
    if (this.modelVersion.includes('/')) {
      endpoint = `https://api.replicate.com/v1/models/${this.modelVersion}/predictions`;
    } else {
      payload.version = this.modelVersion;
    }

    const startRes = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!startRes.ok) {
      const errText = await startRes.text();
      throw new Error(`Replicate API error (${startRes.status}): ${errText}`);
    }

    const prediction = await startRes.json();
    let pollUrl = prediction.urls?.get;

    if (!pollUrl && prediction.id) {
      pollUrl = `https://api.replicate.com/v1/predictions/${prediction.id}`;
    }

    if (!pollUrl) {
      throw new Error('Failed to obtain polling URL from Replicate prediction.');
    }

    // Poll until completion (max 5 minutes)
    const maxAttempts = 60;
    let attempts = 0;
    let finalVideoUrl = '';

    while (attempts < maxAttempts) {
      await new Promise(r => setTimeout(r, 4000));
      attempts++;

      const checkRes = await fetch(pollUrl, {
        headers: {
          'Authorization': `Bearer ${this.apiToken}`
        }
      });

      if (!checkRes.ok) continue;

      const checkData = await checkRes.json();

      if (checkData.status === 'succeeded') {
        const output = checkData.output;
        if (typeof output === 'string') {
          finalVideoUrl = output;
        } else if (Array.isArray(output) && output.length > 0) {
          finalVideoUrl = output[0];
        }
        break;
      } else if (checkData.status === 'failed' || checkData.status === 'canceled') {
        throw new Error(`Replicate Wan generation failed: ${checkData.error || 'Unknown error'}`);
      }
    }

    if (!finalVideoUrl) {
      throw new Error('Replicate video generation timed out after polling.');
    }

    return {
      videoUrl: finalVideoUrl,
      provider: 'Replicate Wan 3.0',
      isMock: false,
      metadata: {
        model: this.modelVersion,
        predictionId: prediction.id,
        generationTimeMs: Date.now() - startTime,
        promptUsed: input.prompt.substring(0, 200) + '...'
      }
    };
  }
}
