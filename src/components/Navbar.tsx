import React from 'react';
import { Sparkles, Code2, Film, ShieldCheck, Zap } from 'lucide-react';
import { ProviderStatus } from '../types/adProject';

interface NavbarProps {
  status: ProviderStatus | null;
  onOpenInspector: () => void;
  currentStep: number;
  onReset: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  status,
  onOpenInspector,
  currentStep,
  onReset
}) => {
  const isMock = status ? (status.defaultMode === 'mock' || (!status.replicateConfigured && !status.geminiConfigured)) : true;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div 
          onClick={onReset}
          className="flex cursor-pointer items-center space-x-3 transition-opacity hover:opacity-90"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-amber-500 to-indigo-600 shadow-lg shadow-amber-500/20">
            <Film className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-white sm:text-lg">
              AdCraft <span className="bg-gradient-to-r from-amber-400 to-indigo-400 bg-clip-text text-transparent">AI</span>
            </span>
            <span className="ml-2 hidden text-xs font-medium text-slate-400 sm:inline-block">
              URL-to-Ad Engine
            </span>
          </div>
        </div>

        {/* Center Mode Indicator */}
        <div className="flex items-center space-x-2">
          {isMock ? (
            <div className="inline-flex items-center space-x-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>DEMO MODE</span>
            </div>
          ) : (
            <div className="inline-flex items-center space-x-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 shadow-sm">
              <Zap className="h-3.5 w-3.5 text-emerald-400" />
              <span>LIVE AI ENGINE</span>
            </div>
          )}

          <div className="hidden items-center space-x-1 text-xs text-slate-400 md:flex">
            <span className="rounded bg-slate-800/80 px-2 py-0.5 text-[11px] text-slate-300">Wan 3.0</span>
            <span className="rounded bg-slate-800/80 px-2 py-0.5 text-[11px] text-slate-300">Vision Analysis</span>
            <span className="rounded bg-slate-800/80 px-2 py-0.5 text-[11px] text-slate-300">JSON2Video</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={onOpenInspector}
            className="inline-flex items-center space-x-1.5 rounded-lg border border-slate-700/80 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-slate-600 hover:bg-slate-800 hover:text-white"
            title="Inspect AI data flow, generated prompts, and JSON2Video payload"
          >
            <Code2 className="h-3.5 w-3.5 text-indigo-400" />
            <span className="hidden sm:inline">View AI Details</span>
            <span className="sm:hidden">Details</span>
          </button>

          {currentStep > 1 && (
            <button
              onClick={onReset}
              className="inline-flex items-center space-x-1.5 rounded-lg border border-white/10 bg-slate-800/60 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
            >
              <span>New Ad</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
