import React from 'react';
import { Check, Link, Sparkles, Sliders, Film, ArrowRight } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
  canNavigateToStep?: (step: number) => boolean;
}

const STEPS = [
  { step: 1, label: 'Product URL', icon: Link },
  { step: 2, label: 'Product Profile', icon: Sparkles },
  { step: 3, label: 'AI Generation', icon: Film },
  { step: 4, label: 'Mini Editor', icon: Sliders },
  { step: 5, label: 'Final Ad', icon: Check }
];

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  onStepClick,
  canNavigateToStep
}) => {
  return (
    <div className="w-full border-b border-white/5 bg-slate-950/40 py-3">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <nav aria-label="Progress">
          <ol className="flex items-center justify-between">
            {STEPS.map((s, index) => {
              const isCompleted = currentStep > s.step;
              const isCurrent = currentStep === s.step;
              const isClickable = canNavigateToStep ? canNavigateToStep(s.step) : false;
              const Icon = s.icon;

              return (
                <li key={s.step} className="relative flex flex-1 items-center last:flex-none">
                  <div
                    onClick={() => isClickable && onStepClick && onStepClick(s.step)}
                    className={`group flex items-center ${isClickable ? 'cursor-pointer' : 'cursor-default'}`}
                  >
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-all ${
                        isCompleted
                          ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                          : isCurrent
                          ? 'border-2 border-amber-400 bg-amber-400/10 text-amber-300 shadow-md shadow-amber-500/10'
                          : 'border border-slate-700 bg-slate-900 text-slate-400'
                      }`}
                    >
                      {isCompleted ? <Check className="h-4 w-4" /> : s.step}
                    </div>
                    <span
                      className={`ml-2.5 hidden text-xs font-medium transition-colors sm:block ${
                        isCurrent
                          ? 'text-white font-semibold'
                          : isCompleted
                          ? 'text-slate-300'
                          : 'text-slate-400'
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>

                  {index < STEPS.length - 1 && (
                    <div className="mx-2 sm:mx-4 flex-1 border-t border-slate-800" />
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </div>
  );
};
