import React, { useState } from 'react';
import { ArrowRight, Sparkles, Link2, Clock, Smartphone, Wand2, Compass, CheckCircle2 } from 'lucide-react';
import { SAMPLE_PRODUCTS, SampleProductItem } from '../../mock/sampleProducts';

interface UrlInputStepProps {
  onAnalyze: (url: string, format: '9:16' | '1:1' | '16:9', duration: number, style: 'auto' | 'cinematic' | 'punchy' | 'minimal') => void;
  isLoading: boolean;
  error?: string | null;
}

export const UrlInputStep: React.FC<UrlInputStepProps> = ({
  onAnalyze,
  isLoading,
  error
}) => {
  const [url, setUrl] = useState('');
  const [format, setFormat] = useState<'9:16' | '1:1' | '16:9'>('9:16');
  const [duration, setDuration] = useState<number>(15);
  const [style, setStyle] = useState<'auto' | 'cinematic' | 'punchy' | 'minimal'>('auto');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    onAnalyze(url.trim(), format, duration, style);
  };

  const selectPreset = (preset: SampleProductItem) => {
    setUrl(preset.url);
    onAnalyze(preset.url, format, duration, style);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
      {/* Hero Header */}
      <div className="text-center">
        <div className="inline-flex items-center space-x-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-400 mb-4">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          <span>AI-Powered URL-to-Ad Generator</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
          Turn any product page into a <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-amber-400 via-rose-400 to-indigo-400 bg-clip-text text-transparent">
            ready-to-publish video ad
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-slate-400 sm:text-lg">
          Extract brand intelligence, generate cinematic AI video with Wan 3.0, analyze shots with computer vision, and compose high-converting JSON2Video ads in seconds.
        </p>
      </div>

      {/* Main Input Form Card */}
      <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="product-url" className="block text-sm font-semibold text-slate-200">
              Product Page URL
            </label>
            <p className="mt-1 text-xs text-slate-400">
              Paste any public store link (Amazon, Shopify, direct-to-consumer store, etc.)
            </p>
            <div className="mt-2.5 relative flex items-center">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500">
                <Link2 className="h-5 w-5" />
              </div>
              <input
                id="product-url"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example-store.com/products/wireless-earbuds"
                disabled={isLoading}
                className="block w-full rounded-xl border border-slate-700 bg-slate-950 py-3.5 pl-11 pr-32 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
              />
              <div className="absolute right-2">
                <button
                  type="submit"
                  disabled={isLoading || !url.trim()}
                  className="inline-flex items-center space-x-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-sm font-bold text-slate-950 shadow-md transition-all hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <span>Analyze Product</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Configuration Options */}
          <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-3">
            {/* Format */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5">
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300">
                <Smartphone className="h-4 w-4 text-amber-400" />
                <span>Ad Format</span>
              </div>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as any)}
                className="mt-2 block w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-white focus:border-indigo-500 focus:outline-none"
              >
                <option value="9:16">Vertical 9:16 (Reels/TikTok/Shorts)</option>
                <option value="1:1">Square 1:1 (Instagram Feed)</option>
                <option value="16:9">Landscape 16:9 (YouTube/Web)</option>
              </select>
            </div>

            {/* Duration */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5">
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300">
                <Clock className="h-4 w-4 text-indigo-400" />
                <span>Target Duration</span>
              </div>
              <select
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value, 10))}
                className="mt-2 block w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-white focus:border-indigo-500 focus:outline-none"
              >
                <option value={15}>15 seconds (Recommended)</option>
                <option value={20}>20 seconds (Detailed specs)</option>
              </select>
            </div>

            {/* Style */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5">
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300">
                <Compass className="h-4 w-4 text-emerald-400" />
                <span>Creative Direction</span>
              </div>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value as any)}
                className="mt-2 block w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-white focus:border-indigo-500 focus:outline-none"
              >
                <option value="auto">Auto Creative Direction</option>
                <option value="cinematic">Cinematic Luxury Film</option>
                <option value="punchy">Punchy High-Energy</option>
                <option value="minimal">Minimalist Architectural</option>
              </select>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300">
              <p className="font-semibold">Unable to analyze URL:</p>
              <p className="mt-1">{error}</p>
            </div>
          )}
        </form>
      </div>

      {/* Preset Product Quick Selection */}
      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Or test instantly with a demo product preset
          </h2>
          <span className="text-xs text-slate-500">1-click automated pipeline</span>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {SAMPLE_PRODUCTS.map((preset) => (
            <div
              key={preset.id}
              onClick={() => selectPreset(preset)}
              className="group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-amber-500/40 hover:bg-slate-900 hover:shadow-lg hover:shadow-amber-500/5"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-400">
                    {preset.profile.product.category?.split('/')[0].trim() || 'Product'}
                  </span>
                  <span className="text-xs font-bold text-slate-300">
                    ${preset.profile.product.price?.value}
                  </span>
                </div>
                <h3 className="mt-2.5 text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                  {preset.name}
                </h3>
                <p className="mt-1 text-xs text-slate-400 line-clamp-2">
                  {preset.tagline}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-800/80 pt-3 text-[11px] text-slate-400">
                <span>{preset.profile.brand.name}</span>
                <span className="inline-flex items-center space-x-1 font-semibold text-amber-400 group-hover:translate-x-0.5 transition-transform">
                  <span>Launch</span>
                  <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Value Props Banner */}
      <div className="mt-12 rounded-2xl border border-slate-800/60 bg-gradient-to-b from-slate-900/40 to-slate-950/60 p-6 text-xs text-slate-400 sm:grid sm:grid-cols-3 sm:gap-6">
        <div className="flex items-start space-x-3">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
            <Wand2 className="h-4 w-4" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-200">Zero Prompt Writing</h4>
            <p className="mt-0.5 text-slate-400">Wan 3.0 prompt is programmatically generated from exact product specifications.</p>
          </div>
        </div>

        <div className="mt-4 flex items-start space-x-3 sm:mt-0">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
            <Compass className="h-4 w-4" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-200">Vision Shot Analysis</h4>
            <p className="mt-0.5 text-slate-400">Identifies safe text zones, camera motion, and action points to avoid covering key details.</p>
          </div>
        </div>

        <div className="mt-4 flex items-start space-x-3 sm:mt-0">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-200">JSON2Video Composition</h4>
            <p className="mt-0.5 text-slate-400">Strictly structured primitives with animated typography, badges, and Tailwind end-card.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
