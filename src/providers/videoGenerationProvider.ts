export interface VideoGenerationInput {
  prompt: string;
  negativePrompt: string;
  referenceImageUrl?: string;
  aspectRatio: '9:16' | '1:1' | '16:9';
  duration: number; // in seconds
  category?: string;
  productName?: string;
  parameters?: Record<string, any>;
}

export interface VideoGenerationResult {
  videoUrl: string;
  provider: string;
  isMock: boolean;
  metadata?: {
    model?: string;
    predictionId?: string;
    generationTimeMs?: number;
    promptUsed?: string;
  };
}

export interface VideoGenerationProvider {
  name: string;
  generateVideo(input: VideoGenerationInput): Promise<VideoGenerationResult>;
}
