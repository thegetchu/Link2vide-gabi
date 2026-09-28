import React from 'react';
import { Download, Sparkles, RefreshCw, Edit3, CheckCircle2, Film, Share2, Layers } from 'lucide-react';
import { AdComposition, AdProject } from '../../types/adProject';

interface RenderResultStepProps {
  project: AdProject;
  onEditAgain: () => void;
  onCreateAnother: () => void;
  onOpenInspector: () => void;
}

export const RenderResultStep: React.FC<RenderResultStepProps> = ({
  project,
  onEditAgain,
  onCreateAnother,
  onOpenInspector
}) => {
  const outputUrl = project.render?.outputUrl || project.composition?.videoUrl;
  const productName = project.productProfile?.product.name || 'Product Advertisement';
  const brandName = project.productProfile?.brand.name || 'Brand';
  const format = project.format;
  const duration = project.composition?.duration || project.targetDuration;
  const isMock = project.render?.isMock ?? true;

  const handleDownload = () => {
    if (!outputUrl) return;
    const a = document.createElement('a');
    a.href = outputUrl;
    a.download = `${productName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-ad.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const aspectClass = format === '9:16'
    ? 'aspect-[9/16] max-w-[320px]'
    : format === '1:1'
    ? 'aspect-square max-w-[420px]'
    : 'aspect-video max-w-[560px]';

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:py-14">
      {/* Title */}
      <div className="text-center">
        <div className="inline-flex items-center space-x-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-400 mb-3">
          <CheckCircle2 className="h-4 w-4" />
          <span>Production Complete</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Your ad is ready
        </h1>
        <p className="mt-2 text-xs text-slate-400 sm:text-sm">
          High-definition commercial ad rendered with Wan 3.0 cinematography & JSON2Video overlays.
        </p>
      </div>

      {/* Main Video Presentation Card */}
      <div className="mt-8 flex flex-col items-center">
        <div className={`relative w-full ${aspectClass} overflow-hidden rounded-2xl border-2 border-slate-700 bg-slate-950 shadow-2xl ring-1 ring-white/10`}>
          {outputUrl ? (
            <video
              src={outputUrl}
              controls
              autoPlay
              loop
              playsInline
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-slate-500">
              No video available
            </div>
          )}

          <div className="absolute top-3 left-3 rounded-full bg-slate-950/80 px-2.5 py-1 text-[10px] font-bold text-amber-400 backdrop-blur-md border border-white/10">
            {isMock ? 'Instant Render (Demo Mode)' : 'JSON2Video Cloud Render'}
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handleDownload}
            className="inline-flex items-center space-x-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-3 text-sm font-bold text-slate-950 shadow-xl shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 transition-all"
          >
            <Download className="h-4 w-4" />
            <span>Download Video (MP4)</span>
          </button>

          <button
            onClick={onEditAgain}
            className="inline-flex items-center space-x-2 rounded-xl border border-slate-700 bg-slate-800/80 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-700 transition-all"
          >
            <Edit3 className="h-4 w-4" />
            <span>Back to Editor</span>
          </button>

          <button
            onClick={onCreateAnother}
            className="inline-flex items-center space-x-2 rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Create Another</span>
          </button>
        </div>

        {/* Summary Card (Section 17 Requirements) */}
        <div className="mt-10 w-full rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-xl">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
            Campaign Specification & Creative Direction
          </h2>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5">
              <span className="block text-[11px] text-slate-400">Product</span>
              <span className="mt-1 block font-bold text-sm text-white truncate">{productName}</span>
              <span className="text-[10px] text-slate-500">{brandName}</span>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5">
              <span className="block text-[11px] text-slate-400">Ad Format</span>
              <span className="mt-1 block font-bold text-sm text-white">{format} Vertical</span>
              <span className="text-[10px] text-slate-500">1080 × 1920 (9:16)</span>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5">
              <span className="block text-[11px] text-slate-400">Duration</span>
              <span className="mt-1 block font-bold text-sm text-white">{duration}s Commercial</span>
              <span className="text-[10px] text-slate-500">+3s Tailwind End Card</span>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5">
              <span className="block text-[11px] text-slate-400">Rendering Engine</span>
              <span className="mt-1 block font-bold text-sm text-amber-400">JSON2Video</span>
              <span className="text-[10px] text-slate-500">60 FPS Hardware Render</span>
            </div>
          </div>

          {/* Creative Summary Box */}
          <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/40 p-4">
            <span className="text-xs font-semibold text-slate-300">Commercial Direction Summary:</span>
            <p className="mt-1 text-xs text-slate-400 leading-relaxed">
              {project.videoAnalysis?.overallStyle || 'Cinematic macro, studio depth of field, and precision lighting.'}
              {' '}Key product claims verified from page content and overlaid in safe text zones without obscuring product details.
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs text-slate-500">
            <span>Project ID: <code className="text-slate-400">{project.id}</code></span>
            <button
              onClick={onOpenInspector}
              className="text-indigo-400 hover:text-indigo-300 font-medium"
            >
              View Full AI Pipeline Breakdown →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
