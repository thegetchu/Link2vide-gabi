import { VideoGenerationInput, VideoGenerationProvider, VideoGenerationResult } from '../videoGenerationProvider';
import { getDemoVideoForCategory } from '../../mock/demoVideos';

export class MockWanProvider implements VideoGenerationProvider {
  name = 'Mock Wan 3.0 (Demo Mode)';

  async generateVideo(input: VideoGenerationInput): Promise<VideoGenerationResult> {
    const startTime = Date.now();
    // Simulate realistic generation delay
    await new Promise(r => setTimeout(r, 1800));

    const matchedAsset = getDemoVideoForCategory(input.category, input.productName);

    return {
      videoUrl: matchedAsset.videoUrl,
      provider: 'Mock Wan 3.0 (Demo Mode)',
      isMock: true,
      metadata: {
        model: 'wan-3.0-commercial-mock-v1',
        generationTimeMs: Date.now() - startTime,
        promptUsed: input.prompt.substring(0, 160) + '...'
      }
    };
  }
}
