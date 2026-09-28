import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, ExternalLink } from 'lucide-react';
import { AdComposition, AdDesignSystem, ProductProfile, TextOverlayElement } from '../../types/adProject';

interface VideoCompositionPreviewProps {
  composition: AdComposition;
  designSystem: AdDesignSystem;
  profile: ProductProfile;
  currentTime: number;
  onTimeUpdate: (time: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  showLogoWatermark?: boolean;
}

export const VideoCompositionPreview: React.FC<VideoCompositionPreviewProps> = ({
  composition,
  designSystem,
  profile,
  currentTime,
  onTimeUpdate,
  isPlaying,
  onTogglePlay,
  showLogoWatermark = true
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  const totalDuration = composition.duration + (composition.endCard?.enabled ? composition.endCard.duration : 0);
  const isEndCardActive = composition.endCard?.enabled && currentTime >= composition.duration;

  // Sync video element playback with state
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying && !isEndCardActive) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isPlaying, isEndCardActive]);

  // Sync seek time
  const handleSeek = (newTime: number) => {
    onTimeUpdate(newTime);
    if (videoRef.current && newTime < composition.duration) {
      videoRef.current.currentTime = newTime;
    }
  };

  // Find active overlays for current time
  const activeOverlays: TextOverlayElement[] = [];
  const activeBadges: any[] = [];

  if (!isEndCardActive) {
    for (const scene of composition.scenes) {
      if (currentTime >= scene.start && currentTime <= scene.end) {
        for (const overlay of scene.overlays) {
          if (overlay.enabled) {
            activeOverlays.push(overlay);
          }
        }
        if (scene.badges) {
          for (const badge of scene.badges) {
            if (badge.enabled) activeBadges.push(badge);
          }
        }
      }
    }
  }

  // Determine aspect ratio container classes
  const aspectClass = composition.format === '9:16'
    ? 'aspect-[9/16] max-w-[320px]'
    : composition.format === '1:1'
    ? 'aspect-square max-w-[420px]'
    : 'aspect-video max-w-[540px]';

  return (
    <div className="flex flex-col items-center">
      {/* Phone / Screen Frame Container */}
      <div className={`relative w-full ${aspectClass} overflow-hidden rounded-2xl border-2 border-slate-700/80 bg-slate-950 shadow-2xl ring-1 ring-white/10`}>
        {/* Background Video */}
        <video
          ref={videoRef}
          src={composition.videoUrl}
          playsInline
          muted={isMuted}
          className={`h-full w-full object-cover transition-opacity duration-300 ${isEndCardActive ? 'opacity-0' : 'opacity-100'}`}
          onTimeUpdate={() => {
            if (videoRef.current && isPlaying && !isEndCardActive) {
              onTimeUpdate(videoRef.current.currentTime);
            }
          }}
          onEnded={() => {
            if (!composition.endCard?.enabled) {
              handleSeek(0);
            }
          }}
        />

        {/* Brand Logo Watermark */}
        {showLogoWatermark && profile.brand.logo?.url && !isEndCardActive && (
          <div className="absolute top-4 left-4 z-20 flex items-center space-x-2 rounded-lg bg-black/40 px-2.5 py-1 backdrop-blur-md border border-white/10">
            <img
              src={profile.brand.logo.url}
              alt={profile.brand.name || 'Brand'}
              className="h-5 w-5 rounded object-cover"
            />
            <span className="text-[11px] font-bold tracking-tight text-white">
              {profile.brand.name}
            </span>
          </div>
        )}

        {/* Dynamic Graphic Badges (e.g. Price Tag) */}
        {!isEndCardActive && activeBadges.map((badge, idx) => (
          <div
            key={idx}
            className="absolute top-4 right-4 z-20 animate-in zoom-in-75 duration-300 rounded-full px-3 py-1 text-xs font-black shadow-lg"
            style={{
              backgroundColor: designSystem.colors.primary,
              color: '#FFFFFF'
            }}
          >
            {badge.content}
          </div>
        ))}

        {/* Text Overlays Layer */}
        {!isEndCardActive && (
          <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-6">
            {/* Top Area Overlays */}
            <div className="space-y-2">
              {activeOverlays.filter(o => o.position === 'top' || o.position === 'top-left').map(overlay => (
                <div
                  key={overlay.id}
                  className="mx-auto w-full max-w-[92%] animate-in slide-in-from-top-4 fade-in duration-300 rounded-xl p-3 text-center shadow-2xl backdrop-blur-md border border-white/10"
                  style={{
                    backgroundColor: overlay.backgroundColor || designSystem.colors.background,
                    borderRadius: designSystem.borderRadius
                  }}
                >
                  <p
                    className={`${designSystem.typography.headingStyle} leading-tight text-white`}
                    style={{ fontSize: `${Math.max(14, Math.round(overlay.fontSize * 0.42))}px` }}
                  >
                    {overlay.text}
                  </p>
                  {overlay.subtext && (
                    <p className="mt-1 text-[11px] font-medium text-slate-300">
                      {overlay.subtext}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Center Area Overlays */}
            <div className="space-y-2">
              {activeOverlays.filter(o => o.position === 'center').map(overlay => (
                <div
                  key={overlay.id}
                  className="mx-auto w-full max-w-[92%] animate-in zoom-in-90 fade-in duration-300 rounded-xl p-3 text-center shadow-2xl backdrop-blur-md border border-white/10"
                  style={{
                    backgroundColor: overlay.backgroundColor || designSystem.colors.background,
                    borderRadius: designSystem.borderRadius
                  }}
                >
                  <p
                    className={`${designSystem.typography.headingStyle} leading-tight text-white`}
                    style={{ fontSize: `${Math.max(14, Math.round(overlay.fontSize * 0.42))}px` }}
                  >
                    {overlay.text}
                  </p>
                  {overlay.subtext && (
                    <p className="mt-1 text-[11px] font-medium text-slate-300">
                      {overlay.subtext}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Bottom Area Overlays */}
            <div className="space-y-2 mb-2">
              {activeOverlays.filter(o => o.position === 'bottom' || o.position === 'bottom-left').map(overlay => (
                <div
                  key={overlay.id}
                  className="mx-auto w-full max-w-[92%] animate-in slide-in-from-bottom-4 fade-in duration-300 rounded-xl p-3 text-center shadow-2xl backdrop-blur-md border border-white/10"
                  style={{
                    backgroundColor: overlay.backgroundColor || designSystem.colors.background,
                    borderRadius: designSystem.borderRadius
                  }}
                >
                  <p
                    className={`${designSystem.typography.headingStyle} leading-tight text-white`}
                    style={{ fontSize: `${Math.max(14, Math.round(overlay.fontSize * 0.42))}px` }}
                  >
                    {overlay.text}
                  </p>
                  {overlay.subtext && (
                    <p className="mt-1 text-[11px] font-medium text-slate-300">
                      {overlay.subtext}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tailwind CSS End Card Layer (Sections 14 & 15) */}
        {isEndCardActive && composition.endCard && (
          <div
            className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500"
            style={{
              backgroundColor: composition.endCard.backgroundColor || '#090D16'
            }}
          >
            {/* Logo */}
            {profile.brand.logo?.url && (
              <div className="mb-4">
                <img
                  src={profile.brand.logo.url}
                  alt="Brand Logo"
                  className="h-12 w-12 rounded-xl object-cover border border-white/20 shadow-lg mx-auto"
                />
              </div>
            )}

            {/* Headline / Product Name */}
            <h2 className="text-xl font-extrabold uppercase tracking-tight text-white">
              {composition.endCard.headline}
            </h2>

            {/* Subheadline / Value Proposition */}
            <p className="mt-2 text-xs font-medium text-slate-300 max-w-[220px]">
              {composition.endCard.subheadline}
            </p>

            {/* CTA Button */}
            <div className="mt-6 w-full max-w-[220px]">
              <button
                className="w-full rounded-xl py-3 px-4 text-xs font-extrabold uppercase tracking-wide text-white shadow-xl transition-transform hover:scale-105"
                style={{
                  backgroundColor: composition.endCard.accentColor || designSystem.colors.primary
                }}
              >
                {composition.endCard.ctaText}
              </button>
            </div>

            {/* Website URL */}
            <p className="mt-4 text-[11px] font-semibold text-slate-400">
              {composition.endCard.websiteUrl}
            </p>
          </div>
        )}
      </div>

      {/* Playback Controls & Scrubber */}
      <div className="mt-4 flex w-full max-w-[340px] flex-col space-y-2">
        {/* Scrubber Bar */}
        <div className="relative flex items-center">
          <input
            type="range"
            min={0}
            max={totalDuration}
            step={0.1}
            value={currentTime}
            onChange={(e) => handleSeek(parseFloat(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
          />
        </div>

        {/* Buttons Row */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <button
              onClick={onTogglePlay}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-white hover:bg-slate-700 transition-colors"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
            <button
              onClick={() => handleSeek(0)}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-white hover:bg-slate-700 transition-colors"
              title="Restart"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-white hover:bg-slate-700 transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
            </button>
          </div>

          <div className="font-mono text-[11px] text-slate-400">
            <span>{currentTime.toFixed(1)}s</span> / <span>{totalDuration.toFixed(1)}s</span>
            {isEndCardActive && (
              <span className="ml-1.5 rounded bg-amber-500/10 px-1 py-0.5 text-[9px] font-bold text-amber-400">
                End Card
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
