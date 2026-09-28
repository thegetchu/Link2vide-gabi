import { AdComposition } from '../../types/adProject';
import { JSON2VideoProvider } from '../../providers/json2video/json2videoProvider';
import { MockJSON2VideoProvider } from '../../providers/json2video/mockJson2VideoProvider';
import { RenderResult, VideoRenderingProvider } from '../../providers/videoRenderingProvider';

export class VideoRendererService {
  private json2videoProvider: JSON2VideoProvider;
  private mockProvider: MockJSON2VideoProvider;

  constructor() {
    this.json2videoProvider = new JSON2VideoProvider();
    this.mockProvider = new MockJSON2VideoProvider();
  }

  getProvider(forceMock: boolean = false): VideoRenderingProvider {
    if (forceMock) {
      return this.mockProvider;
    }
    if (this.json2videoProvider.isAvailable()) {
      return this.json2videoProvider;
    }
    return this.mockProvider;
  }

  async render(composition: AdComposition, forceMock: boolean = false): Promise<RenderResult> {
    const provider = this.getProvider(forceMock);
    return await provider.renderComposition(composition);
  }
}

export const videoRendererService = new VideoRendererService();
