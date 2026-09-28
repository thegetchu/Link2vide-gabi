import React from 'react';
import { CheckCircle2, Circle, AlertCircle, RefreshCw, Sparkles, Film, ArrowRight, Video } from 'lucide-react';

export type PipelineStage = 
  | 'analyzed'
  | 'creative_direction'
  | 'generating_video'
  | 'analyzing_video'
  | 'designing_overlays'
  | 'preparing_composition'
  | 'completed'
  | 'failed';

interface GenerationProgressStepProps {
  currentStage: PipelineStage;
  error?: string | null;
  videoUrl?: string;
  isMock?: boolean;
  onRetryVideoGeneration: () => void;
  onRetryComposition: () => void;
  onContinueToEditor: () => void;
}

const STAGES = [
  { id: 'analyzed', label: 'Product analyzed & structured' },
  { id: 'creative_direction', label: 'Creative direction & Wan 3.0 prompt synthesized' },
  { id: 'generating_video', label: 'Generating cinematic video with Wan 3.0' },
  { id: 'analyzing_video', label: 'Analyzing generated video with computer vision' },
  { id: 'designing_overlays', label: 'Synthesizing AdDesignSystem & typography' },
  { id: 'preparing_composition', label: 'Preparing JSON2Video final composition' }
];

export const GenerationProgressStep: React.FC<GenerationProgressStepProps> = ({
  currentStage,
  error,
  videoUrl,
  isMock,
  onRetryVideoGeneration,
  onRetryComposition,
  onContinueToEditor
}) => {
  const getStageIndex = (stage: PipelineStage): number => {
    switch (stage) {
      case 'analyzed': return 0;
      case 'creative_direction': return 1;
      case 'generating_video': return 2;
      case 'analyzing_video': return 3;
      case 'designing_overlays': return 4;
      case 'preparing_composition': return 5;
      case 'completed': return 6;
      case 'failed': return 2;
      default: return 0;
    }
  };

  const currentIdx = getStageIndex(currentStage);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:py-16">
      <div className="text-center">
        <div className="inline-flex items-center space-x-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-400 mb-3">
          <Film className="h-3.5 w-3.5 text-amber-400" />
          <span>AI Creative Production</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-4xl">
          {currentStage === 'completed'
            ? 'Advertisement Composition Ready!'
            : 'Creating your advertisement'}
        </h1>
        <p className="mt-2 text-xs text-slate-400 sm:text-sm">
          {currentStage === 'completed'
            ? 'Review and fine-tune your overlays and timing in the mini-editor before final render.'
            : 'Transforming product intelligence into a high-converting video commercial.'}
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-12">
        {/* Left Side: Step-by-step progress checklist (6 cols) */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl backdrop-blur-xl md:col-span-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-5">
            Production Pipeline
          </h2>

          <div className="space-y-4">
            {STAGES.map((s, idx) => {
              const isPast = currentIdx > idx;
              const isCurrent = currentIdx === idx && currentStage !== 'failed' && currentStage !== 'completed';
              const isFailed = currentStage === 'failed' && currentIdx === idx;

              return (
                <div key={s.id} className="flex items-center space-x-3.5">
                  <div className="shrink-0">
                    {isPast || currentStage === 'completed' ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    ) : isFailed ? (
                      <AlertCircle className="h-5 w-5 text-rose-400" />
                    ) : isCurrent ? (
                      <div className="relative flex h-5 w-5 items-center justify-center">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
                      </div>
                    ) : (
                      <Circle className="h-5 w-5 text-slate-700" />
                    )}
                  </div>
                  <span
                    className={`text-xs font-medium transition-colors ${
                      isPast || currentStage === 'completed'
                        ? 'text-slate-200'
                        : isCurrent
                        ? 'text-amber-400 font-semibold'
                        : isFailed
                        ? 'text-rose-400'
                        : 'text-slate-500'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Error & Retry Handling */}
          {error && (
            <div className="mt-6 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
                <div>
                  <p className="font-semibold">Pipeline interrupted</p>
                  <p className="mt-1 text-slate-300">{error}</p>
                </div>
              </div>

              <div className="mt-4 flex space-x-3">
                <button
                  onClick={onRetryVideoGeneration}
                  className="inline-flex items-center space-x-1.5 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-500 transition-colors"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Retry Video Generation</span>
                </button>
                <button
                  onClick={onRetryComposition}
                  className="inline-flex items-center space-x-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-700"
                >
                  <span>Retry Composition</span>
                </button>
              </div>
            </div>
          )}

          {/* Continue Action */}
          {currentStage === 'completed' && (
            <div className="mt-8 pt-4 border-t border-slate-800">
              <button
                onClick={onContinueToEditor}
                className="w-full inline-flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 transition-all"
              >
                <span>Open Mini Editor</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Right Side: Generated Video Preview (6 cols) */}
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-xl md:col-span-6">
          <div className="w-full max-w-[280px]">
            <div className="relative aspect-[9/16] w-full overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-950 shadow-2xl">
              {videoUrl ? (
                <>
                  <video
                    src={videoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute top-3 left-3 rounded-full bg-slate-950/80 px-2.5 py-1 text-[10px] font-semibold text-amber-400 backdrop-blur-md border border-white/10">
                    {isMock ? 'Wan 3.0 (Demo Mode)' : 'Wan 3.0 (Replicate)'}
                  </div>
                </>
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center text-slate-500">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 border border-slate-800 text-slate-400 animate-pulse">
                    <Video className="h-6 w-6" />
                  </div>
                  <p className="mt-4 text-xs font-medium text-slate-400">
                    Synthesizing video reel...
                  </p>
                  <p className="mt-1 text-[11px] text-slate-600">
                    Applying camera motion & studio lighting
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
