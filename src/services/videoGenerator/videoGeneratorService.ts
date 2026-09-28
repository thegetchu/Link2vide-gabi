import { ProductProfile } from '../../types/adProject';
import { buildWanPrompt, GeneratedPrompts } from './promptBuilder';
import { ReplicateWanProvider } from '../../providers/replicate/replicateWanProvider';
import { MockWanProvider } from '../../providers/replicate/mockWanProvider';
import { VideoGenerationProvider } from '../../providers/videoGenerationProvider';

export interface GenerateVideoResponse {
  videoUrl: string;
  provider: string;
  isMock: boolean;
  prompt: string;
  negativePrompt: string;
  productSpecificConstraints: string[];
}

export class VideoGeneratorService {
  private replicateProvider: ReplicateWanProvider;
  private mockProvider: MockWanProvider;

  constructor() {
    this.replicateProvider = new ReplicateWanProvider();
    this.mockProvider = new MockWanProvider();
  }

  getProvider(forceMock: boolean = false): VideoGenerationProvider {
    if (forceMock) {
      return this.mockProvider;
    }
    if (this.replicateProvider.isAvailable()) {
      return this.replicateProvider;
    }
    return this.mockProvider;
  }

  async generate(
    profile: ProductProfile,
    options: {
      format?: '9:16' | '1:1' | '16:9';
      style?: 'auto' | 'cinematic' | 'punchy' | 'minimal';
      duration?: number;
      forceMock?: boolean;
    } = {}
  ): Promise<GenerateVideoResponse> {
    const format = options.format || '9:16';
    const style = options.style || 'auto';
    const duration = options.duration || 15;

    const prompts: GeneratedPrompts = buildWanPrompt(profile, format, style, duration);
    const provider = this.getProvider(options.forceMock);

    // Primary product reference image if available
    const referenceImageUrl = profile.assets.productImages?.[0];

    const result = await provider.generateVideo({
      prompt: prompts.prompt,
      negativePrompt: prompts.negativePrompt,
      referenceImageUrl,
      aspectRatio: format,
      duration,
      category: profile.product.category,
      productName: profile.product.name
    });

    return {
      videoUrl: result.videoUrl,
      provider: result.provider,
      isMock: result.isMock,
      prompt: prompts.prompt,
      negativePrompt: prompts.negativePrompt,
      productSpecificConstraints: prompts.productSpecificConstraints
    };
  }
}

export const videoGeneratorService = new VideoGeneratorService();
