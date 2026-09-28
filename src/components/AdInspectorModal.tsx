import React, { useState } from 'react';
import { X, Copy, Check, Terminal, FileCode, Layers, Video, Palette, Sparkles } from 'lucide-react';
import { AdProject } from '../types/adProject';

interface AdInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: AdProject;
}

export const AdInspectorModal: React.FC<AdInspectorModalProps> = ({
  isOpen,
  onClose,
  project
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'prompt' | 'analysis' | 'designSystem' | 'json2video'>('prompt');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getActiveContent = (): string => {
    switch (activeTab) {
      case 'profile':
        return JSON.stringify(project.productProfile || { message: 'Product profile not yet generated.' }, null, 2);
      case 'prompt':
        return [
          '=== WAN 3.0 POSITIVE PROMPT ===',
          project.videoGeneration?.prompt || 'Prompt not yet built.',
          '',
          '=== WAN 3.0 NEGATIVE PROMPT ===',
          project.videoGeneration?.negativePrompt || 'Negative prompt not yet built.'
        ].join('\n');
      case 'analysis':
        return JSON.stringify(project.videoAnalysis || { message: 'Video analysis not yet performed.' }, null, 2);
      case 'designSystem':
        return JSON.stringify(project.designSystem || { message: 'Design system not yet generated.' }, null, 2);
      case 'json2video':
        return JSON.stringify(project.composition?.json2videoPayload || { message: 'JSON2Video composition not yet created.' }, null, 2);
      default:
        return '';
    }
  };

  const content = getActiveContent();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative flex flex-col w-full max-w-4xl max-h-[85vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">AI Pipeline Inspector</h2>
              <p className="text-xs text-slate-400">Live inspect structured facts, Wan 3.0 prompts, CV analysis, & JSON2Video payloads</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex px-6 space-x-2 border-b border-slate-800 bg-slate-950/30 overflow-x-auto py-2">
          <button
            onClick={() => setActiveTab('prompt')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'prompt'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Wan 3.0 Prompt</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'profile'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>ProductProfile</span>
          </button>
          <button
            onClick={() => setActiveTab('analysis')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'analysis'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Video Analysis</span>
          </button>
          <button
            onClick={() => setActiveTab('designSystem')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'designSystem'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>AdDesignSystem</span>
          </button>
          <button
            onClick={() => setActiveTab('json2video')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'json2video'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>JSON2Video Spec</span>
          </button>
        </div>

        {/* Content Viewer */}
        <div className="relative flex-1 p-6 overflow-y-auto bg-slate-950 font-mono text-xs text-slate-300">
          <div className="absolute top-4 right-6">
            <button
              onClick={() => handleCopy(content)}
              className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
          <pre className="whitespace-pre-wrap break-words leading-relaxed select-text font-mono">
            {content}
          </pre>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-800 bg-slate-950/80 text-xs text-slate-400">
          <span>Project ID: {project.id}</span>
          <span>Duration: {project.targetDuration}s | Format: {project.format}</span>
        </div>
      </div>
    </div>
  );
};
