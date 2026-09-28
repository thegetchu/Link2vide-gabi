import { AdComposition } from '../../types/adProject';
import { VideoRenderingProvider, RenderResult } from '../videoRenderingProvider';

export class MockJSON2VideoProvider implements VideoRenderingProvider {
  name = 'Mock JSON2Video (Instant Preview Render)';

  async renderComposition(composition: AdComposition): Promise<RenderResult> {
    const startTime = Date.now();
    // Simulate render processing time
    await new Promise(r => setTimeout(r, 2000));

    return {
      outputUrl: composition.videoUrl,
      provider: 'Mock JSON2Video (Demo Mode)',
      isMock: true,
      format: composition.format,
      duration: composition.duration,
      renderTimeSeconds: 2,
      metadata: {
        simulatedEncoding: 'H.264 / AAC 1080p',
        scenesRendered: composition.scenes.length,
        hasEndCard: Boolean(composition.endCard?.enabled)
      }
    };
  }
}
