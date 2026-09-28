import { AdComposition } from '../types/adProject';

export interface RenderResult {
  outputUrl: string;
  provider: string;
  isMock: boolean;
  format: string;
  duration: number;
  renderTimeSeconds: number;
  metadata?: Record<string, any>;
}

export interface VideoRenderingProvider {
  name: string;
  renderComposition(composition: AdComposition): Promise<RenderResult>;
}
