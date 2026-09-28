import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  Type, 
  Clock, 
  Palette, 
  FileCode, 
  Play, 
  Check, 
  Sparkles, 
  ArrowRight, 
  Copy, 
  Eye, 
  EyeOff, 
  CreditCard,
  Tv
} from 'lucide-react';
import { AdComposition, AdDesignSystem, AdScene, ProductProfile, TextOverlayElement } from '../../types/adProject';
import { VideoCompositionPreview } from './VideoCompositionPreview';
import { buildJSON2VideoPayload } from '../../services/compositionGenerator/json2videoBuilder';

interface MiniEditorStepProps {
  initialComposition: AdComposition;
  initialDesignSystem: AdDesignSystem;
  profile: ProductProfile;
  onRenderAd: (finalComposition: AdComposition, finalDesignSystem: AdDesignSystem) => void;
  isRendering: boolean;
}

export const MiniEditorStep: React.FC<MiniEditorStepProps> = ({
  initialComposition,
  initialDesignSystem,
  profile,
  onRenderAd,
  isRendering
}) => {
  const [composition, setComposition] = useState<AdComposition>(JSON.parse(JSON.stringify(initialComposition)));
  const [designSystem, setDesignSystem] = useState<AdDesignSystem>(JSON.parse(JSON.stringify(initialDesignSystem)));
  const [showLogo, setShowLogo] = useState(true);

  // Playback state
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Editor Tabs
  const [activeTab, setActiveTab] = useState<'text' | 'timing' | 'brand' | 'endcard' | 'spec'>('text');
  const [selectedSceneIdx, setSelectedSceneIdx] = useState(0);
  const [copiedSpec, setCopiedSpec] = useState(false);

  // Playback timer loop
  useEffect(() => {
    let interval: any = null;
    const totalDuration = composition.duration + (composition.endCard?.enabled ? composition.endCard.duration : 0);

    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= totalDuration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 0.1;
        });
      }, 100);
    }

    return () => clearInterval(interval);
  }, [isPlaying, composition]);

  // Keep JSON2Video payload synced
  useEffect(() => {
    const updatedPayload = buildJSON2VideoPayload(composition, designSystem, profile);
    setComposition(prev => ({
      ...prev,
      json2videoPayload: updatedPayload
    }));
  }, [designSystem, composition.scenes, composition.endCard]);

  // Text overlay handlers
  const handleUpdateOverlay = (sceneIdx: number, overlayIdx: number, updates: Partial<TextOverlayElement>) => {
    setComposition(prev => {
      const nextScenes = [...prev.scenes];
      const targetScene = { ...nextScenes[sceneIdx] };
      const targetOverlays = [...targetScene.overlays];
      targetOverlays[overlayIdx] = { ...targetOverlays[overlayIdx], ...updates };
      targetScene.overlays = targetOverlays;
      nextScenes[sceneIdx] = targetScene;
      return { ...prev, scenes: nextScenes };
    });
  };

  // Scene timing handlers
  const handleUpdateSceneTiming = (sceneIdx: number, start: number, end: number) => {
    setComposition(prev => {
      const nextScenes = [...prev.scenes];
      nextScenes[sceneIdx] = {
        ...nextScenes[sceneIdx],
        start,
        end
      };
      return { ...prev, scenes: nextScenes };
    });
  };

  // End card handlers
  const handleUpdateEndCard = (updates: any) => {
    setComposition(prev => ({
      ...prev,
      endCard: prev.endCard ? { ...prev.endCard, ...updates } : undefined
    }));
  };

  // Copy JSON2Video Spec
  const handleCopySpec = () => {
    if (composition.json2videoPayload) {
      navigator.clipboard.writeText(JSON.stringify(composition.json2videoPayload, null, 2));
      setCopiedSpec(true);
      setTimeout(() => setCopiedSpec(false), 2000);
    }
  };

  const currentScene = composition.scenes[selectedSceneIdx] || composition.scenes[0];
  const currentOverlay = currentScene?.overlays?.[0];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:py-10">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-400 mb-1">
            <Sliders className="h-3 w-3" />
            <span>Mini Ad Studio</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Fine-Tune Your Video Ad
          </h1>
          <p className="text-xs text-slate-400">
            Real-time overlay editor with JSON2Video automated compilation.
          </p>
        </div>

        <button
          onClick={() => onRenderAd(composition, designSystem)}
          disabled={isRendering}
          className="inline-flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-3 text-sm font-bold text-slate-950 shadow-xl shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 transition-all disabled:opacity-50"
        >
          <Sparkles className="h-4 w-4" />
          <span>{isRendering ? 'Rendering Video...' : 'Render Final Ad'}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Main Workspace Grid: Left Live Preview / Right Mini Controls */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Live Interactive Player (5 cols) */}
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-xl lg:col-span-5">
          <div className="w-full flex items-center justify-between mb-3 text-xs text-slate-400">
            <span className="font-semibold text-slate-200">Real-Time Composition Preview</span>
            <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-amber-400 font-mono">
              {composition.format} • {composition.duration}s
            </span>
          </div>

          <VideoCompositionPreview
            composition={composition}
            designSystem={designSystem}
            profile={profile}
            currentTime={currentTime}
            onTimeUpdate={setCurrentTime}
            isPlaying={isPlaying}
            onTogglePlay={() => setIsPlaying(!isPlaying)}
            showLogoWatermark={showLogo}
          />
        </div>

        {/* Right Column: Mini Editor Controls (7 cols) */}
        <div className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/80 shadow-2xl backdrop-blur-xl lg:col-span-7 overflow-hidden">
          {/* Editor Tab Navigation */}
          <div className="flex border-b border-slate-800 bg-slate-950/60 px-4 py-2 space-x-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('text')}
              className={`inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'text'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Type className="h-3.5 w-3.5" />
              <span>Overlays</span>
            </button>

            <button
              onClick={() => setActiveTab('timing')}
              className={`inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'timing'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Clock className="h-3.5 w-3.5" />
              <span>Timing</span>
            </button>

            <button
              onClick={() => setActiveTab('brand')}
              className={`inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'brand'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Palette className="h-3.5 w-3.5" />
              <span>Brand & Style</span>
            </button>

            <button
              onClick={() => setActiveTab('endcard')}
              className={`inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'endcard'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Tv className="h-3.5 w-3.5" />
              <span>End Card</span>
            </button>

            <button
              onClick={() => setActiveTab('spec')}
              className={`inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'spec'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <FileCode className="h-3.5 w-3.5" />
              <span>JSON2Video JSON</span>
            </button>
          </div>

          {/* Tab Content Panel */}
          <div className="p-6 flex-1 overflow-y-auto">
            {/* 1. TEXT OVERLAYS TAB */}
            {activeTab === 'text' && (
              <div className="space-y-5">
                {/* Scene Selector Pills */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Select Shot to Edit
                  </label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {composition.scenes.map((scene, idx) => (
                      <button
                        key={scene.id}
                        onClick={() => {
                          setSelectedSceneIdx(idx);
                          setCurrentTime(scene.start + 0.2);
                        }}
                        className={`rounded-lg border px-3 py-2 text-left text-xs font-medium transition-all ${
                          selectedSceneIdx === idx
                            ? 'border-amber-400 bg-amber-400/10 text-white'
                            : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        <span className="block font-bold text-amber-400 text-[10px] uppercase">
                          Shot {idx + 1}
                        </span>
                        <span className="truncate block font-semibold text-slate-200">
                          {scene.name.split(':')[1]?.trim() || scene.name}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {scene.start}s - {scene.end}s
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selected Overlay Editor */}
                {currentOverlay ? (
                  <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-xs font-bold text-amber-400 uppercase">
                          {currentOverlay.role}
                        </span>
                        <span className="text-xs text-slate-400">
                          (Shot {selectedSceneIdx + 1})
                        </span>
                      </div>

                      <button
                        onClick={() => handleUpdateOverlay(selectedSceneIdx, 0, { enabled: !currentOverlay.enabled })}
                        className={`inline-flex items-center space-x-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                          currentOverlay.enabled
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {currentOverlay.enabled ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                        <span>{currentOverlay.enabled ? 'Enabled' : 'Disabled'}</span>
                      </button>
                    </div>

                    {/* Headline Text */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300">
                        Overlay Headline
                      </label>
                      <input
                        type="text"
                        value={currentOverlay.text}
                        onChange={(e) => handleUpdateOverlay(selectedSceneIdx, 0, { text: e.target.value })}
                        className="mt-1.5 block w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-semibold text-white focus:border-amber-400 focus:outline-none"
                      />
                    </div>

                    {/* Subtext */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300">
                        Subtext (Optional)
                      </label>
                      <input
                        type="text"
                        value={currentOverlay.subtext || ''}
                        onChange={(e) => handleUpdateOverlay(selectedSceneIdx, 0, { subtext: e.target.value })}
                        placeholder="Additional support line..."
                        className="mt-1.5 block w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-200 focus:border-amber-400 focus:outline-none"
                      />
                    </div>

                    {/* Position & Font Size */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300">
                          Text Position
                        </label>
                        <select
                          value={currentOverlay.position}
                          onChange={(e) => handleUpdateOverlay(selectedSceneIdx, 0, { position: e.target.value as any })}
                          className="mt-1.5 block w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                        >
                          <option value="top">Top Third (Safe)</option>
                          <option value="center">Center</option>
                          <option value="bottom">Bottom Third (Safe)</option>
                          <option value="top-left">Top Left</option>
                          <option value="bottom-left">Bottom Left</option>
                        </select>
                      </div>

                      <div>
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-semibold text-slate-300">
                            Font Scale ({currentOverlay.fontSize}px)
                          </label>
                        </div>
                        <input
                          type="range"
                          min={28}
                          max={60}
                          step={2}
                          value={currentOverlay.fontSize}
                          onChange={(e) => handleUpdateOverlay(selectedSceneIdx, 0, { fontSize: parseInt(e.target.value, 10) })}
                          className="mt-3 block w-full accent-amber-500 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">No overlay configured for this shot.</p>
                )}
              </div>
            )}

            {/* 2. TIMING TAB */}
            {activeTab === 'timing' && (
              <div className="space-y-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Shot Boundaries & End Card Timing
                </h3>

                <div className="space-y-4">
                  {composition.scenes.map((scene, idx) => (
                    <div
                      key={scene.id}
                      className="rounded-xl border border-slate-800 bg-slate-950/60 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-200">
                          Shot {idx + 1}: {scene.name.split(':')[1]?.trim() || scene.name}
                        </span>
                        <span className="font-mono text-xs text-amber-400">
                          {(scene.end - scene.start).toFixed(1)}s duration
                        </span>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] text-slate-400">Start Time (sec)</label>
                          <input
                            type="number"
                            min={0}
                            max={scene.end - 0.5}
                            step={0.5}
                            value={scene.start}
                            onChange={(e) => handleUpdateSceneTiming(idx, parseFloat(e.target.value) || 0, scene.end)}
                            className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-400">End Time (sec)</label>
                          <input
                            type="number"
                            min={scene.start + 0.5}
                            max={composition.duration}
                            step={0.5}
                            value={scene.end}
                            onChange={(e) => handleUpdateSceneTiming(idx, scene.start, parseFloat(e.target.value) || scene.end)}
                            className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* End Card Duration */}
                  {composition.endCard && (
                    <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-200">End Card Duration</span>
                        <span className="font-mono text-xs text-amber-400">{composition.endCard.duration}s</span>
                      </div>
                      <input
                        type="range"
                        min={1.5}
                        max={5}
                        step={0.5}
                        value={composition.endCard.duration}
                        onChange={(e) => handleUpdateEndCard({ duration: parseFloat(e.target.value) })}
                        className="mt-3 block w-full accent-amber-500 cursor-pointer"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 3. BRAND & STYLING TAB */}
            {activeTab === 'brand' && (
              <div className="space-y-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  AdDesignSystem Color Palette & Brand Marks
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Primary Color */}
                  <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                    <label className="block text-xs font-semibold text-slate-300">
                      Primary Accent Color
                    </label>
                    <p className="text-[11px] text-slate-500">Used for CTA buttons and highlighted badges</p>
                    <div className="mt-3 flex items-center space-x-3">
                      <input
                        type="color"
                        value={designSystem.colors.primary}
                        onChange={(e) => setDesignSystem(prev => ({
                          ...prev,
                          colors: { ...prev.colors, primary: e.target.value }
                        }))}
                        className="h-9 w-9 rounded-lg border border-white/20 cursor-pointer bg-transparent"
                      />
                      <input
                        type="text"
                        value={designSystem.colors.primary}
                        onChange={(e) => setDesignSystem(prev => ({
                          ...prev,
                          colors: { ...prev.colors, primary: e.target.value }
                        }))}
                        className="w-28 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 font-mono text-xs text-white"
                      />
                    </div>
                  </div>

                  {/* Secondary Color */}
                  <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                    <label className="block text-xs font-semibold text-slate-300">
                      Secondary Brand Tone
                    </label>
                    <p className="text-[11px] text-slate-500">Used for secondary badges & borders</p>
                    <div className="mt-3 flex items-center space-x-3">
                      <input
                        type="color"
                        value={designSystem.colors.secondary}
                        onChange={(e) => setDesignSystem(prev => ({
                          ...prev,
                          colors: { ...prev.colors, secondary: e.target.value }
                        }))}
                        className="h-9 w-9 rounded-lg border border-white/20 cursor-pointer bg-transparent"
                      />
                      <input
                        type="text"
                        value={designSystem.colors.secondary}
                        onChange={(e) => setDesignSystem(prev => ({
                          ...prev,
                          colors: { ...prev.colors, secondary: e.target.value }
                        }))}
                        className="w-28 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 font-mono text-xs text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Logo Watermark Toggle */}
                <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                  <div>
                    <span className="text-xs font-semibold text-slate-200">Show Brand Logo Watermark</span>
                    <p className="text-[11px] text-slate-400">Displays brand emblem badge in upper left corner</p>
                  </div>
                  <button
                    onClick={() => setShowLogo(!showLogo)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                      showLogo
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {showLogo ? 'Enabled' : 'Disabled'}
                  </button>
                </div>

                {/* Typography treatment preview */}
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-xs text-slate-400">
                  <span className="font-semibold text-slate-300">Active Visual Style:</span> {designSystem.visualStyle}
                  <div className="mt-1 text-[11px] text-slate-500">
                    Heading class: <code className="text-slate-400">{designSystem.typography.headingStyle}</code>
                  </div>
                </div>
              </div>
            )}

            {/* 4. END CARD TAB */}
            {activeTab === 'endcard' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Tailwind CSS End Card
                    </h3>
                    <p className="text-xs text-slate-400">2–3 second commercial closing splash</p>
                  </div>
                  <button
                    onClick={() => handleUpdateEndCard({ enabled: !composition.endCard?.enabled })}
                    className={`rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${
                      composition.endCard?.enabled
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {composition.endCard?.enabled ? 'End Card Enabled' : 'Disabled'}
                  </button>
                </div>

                {composition.endCard?.enabled && (
                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300">Headline</label>
                      <input
                        type="text"
                        value={composition.endCard.headline}
                        onChange={(e) => handleUpdateEndCard({ headline: e.target.value })}
                        className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300">Subheadline / Benefit</label>
                      <input
                        type="text"
                        value={composition.endCard.subheadline}
                        onChange={(e) => handleUpdateEndCard({ subheadline: e.target.value })}
                        className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300">CTA Button Text</label>
                        <input
                          type="text"
                          value={composition.endCard.ctaText}
                          onChange={(e) => handleUpdateEndCard({ ctaText: e.target.value })}
                          className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white font-bold text-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300">Website URL</label>
                        <input
                          type="text"
                          value={composition.endCard.websiteUrl}
                          onChange={(e) => handleUpdateEndCard({ websiteUrl: e.target.value })}
                          className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 5. JSON2VIDEO SPEC TAB */}
            {activeTab === 'spec' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Validated JSON2Video Specification
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Constrained schema layer using primitives (video, text, image, shape, transitions)
                    </p>
                  </div>
                  <button
                    onClick={handleCopySpec}
                    className="inline-flex items-center space-x-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
                  >
                    {copiedSpec ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedSpec ? 'Copied' : 'Copy Payload'}</span>
                  </button>
                </div>

                <pre className="max-h-[360px] overflow-auto rounded-xl bg-slate-950 p-4 font-mono text-[11px] text-slate-300 border border-slate-800 select-text leading-relaxed">
                  {JSON.stringify(composition.json2videoPayload || {}, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Bottom Render Action Bar */}
          <div className="flex items-center justify-between border-t border-slate-800 bg-slate-950/80 p-4">
            <span className="text-xs text-slate-400">
              Ready to export final ad with JSON2Video?
            </span>
            <button
              onClick={() => onRenderAd(composition, designSystem)}
              disabled={isRendering}
              className="inline-flex items-center space-x-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-2.5 text-sm font-bold text-slate-950 shadow-xl shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 transition-all disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4" />
              <span>{isRendering ? 'Rendering Video...' : 'Render Final Ad'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
