import { AdComposition } from '../../types/adProject';
import { VideoRenderingProvider, RenderResult } from '../videoRenderingProvider';

export class JSON2VideoProvider implements VideoRenderingProvider {
  name = 'JSON2Video Cloud Render';
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.JSON2VIDEO_API_KEY || '';
  }

  isAvailable(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  async renderComposition(composition: AdComposition): Promise<RenderResult> {
    if (!this.isAvailable()) {
      throw new Error('JSON2Video API key is not configured. Please set JSON2VIDEO_API_KEY.');
    }

    const startTime = Date.now();
    const payload = composition.json2videoPayload;

    if (!payload) {
      throw new Error('AdComposition is missing valid json2videoPayload.');
    }

    // Call JSON2Video API
    const res = await fetch('https://api.json2video.com/v2/movies', {
      method: 'POST',
      headers: {
        'x-api-key': this.apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`JSON2Video submission failed (${res.status}): ${errText}`);
    }

    const data = await res.json();
    const projectId = data.project || data.id;

    if (!projectId) {
      throw new Error('Failed to retrieve project ID from JSON2Video response.');
    }

    // Poll JSON2Video for render status
    const maxPollAttempts = 40;
    let attempts = 0;
    let outputUrl = '';

    while (attempts < maxPollAttempts) {
      await new Promise(r => setTimeout(r, 4000));
      attempts++;

      const statusRes = await fetch(`https://api.json2video.com/v2/movies?project=${projectId}`, {
        headers: {
          'x-api-key': this.apiKey
        }
      });

      if (!statusRes.ok) continue;

      const statusData = await statusRes.json();
      const movie = statusData.movie || statusData;

      if (movie.status === 'done' || movie.status === 'success') {
        outputUrl = movie.url || movie.output;
        break;
      } else if (movie.status === 'error' || movie.status === 'failed') {
        throw new Error(`JSON2Video rendering failed: ${movie.message || 'Unknown render error'}`);
      }
    }

    if (!outputUrl) {
      throw new Error('JSON2Video render polling timed out.');
    }

    return {
      outputUrl,
      provider: 'JSON2Video Cloud Render',
      isMock: false,
      format: composition.format,
      duration: composition.duration,
      renderTimeSeconds: Math.round((Date.now() - startTime) / 1000),
      metadata: {
        projectId,
        payloadSize: JSON.stringify(payload).length
      }
    };
  }
}
