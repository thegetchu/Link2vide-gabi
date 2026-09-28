import React, { useState, useEffect } from 'react';
import { AdProject, ProviderStatus, ProductProfile, AdComposition, AdDesignSystem } from './types/adProject';
import { Navbar } from './components/Navbar';
import { StepIndicator } from './components/StepIndicator';
import { AdInspectorModal } from './components/AdInspectorModal';
import { UrlInputStep } from './features/product-analysis/UrlInputStep';
import { ProductProfileEditor } from './features/product-analysis/ProductProfileEditor';
import { GenerationProgressStep, PipelineStage } from './features/video-generation/GenerationProgressStep';
import { MiniEditorStep } from './features/editor/MiniEditorStep';
import { RenderResultStep } from './features/rendering/RenderResultStep';

export default function App() {
  // Current active step (1 to 5)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [providerStatus, setProviderStatus] = useState<ProviderStatus | null>(null);
  const [inspectorOpen, setInspectorOpen] = useState<boolean>(false);

  // Loading and error states
  const [isAnalyzingProduct, setIsAnalyzingProduct] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Video Generation & Pipeline state
  const [pipelineStage, setPipelineStage] = useState<PipelineStage>('analyzed');
  const [pipelineError, setPipelineError] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState<boolean>(false);

  // Main Project State (independently persisted stages)
  const [project, setProject] = useState<AdProject>({
    id: `ad-${Date.now()}`,
    sourceUrl: '',
    format: '9:16',
    targetDuration: 15,
    style: 'auto',
    videoGeneration: {
      prompt: '',
      negativePrompt: '',
      provider: 'Pending',
      status: 'idle'
    },
    render: {
      status: 'idle'
    }
  });

  // Fetch provider health & configuration on mount
  useEffect(() => {
    fetch('/api/status')
      .then(res => res.json())
      .then(data => setProviderStatus(data))
      .catch(() => {
        setProviderStatus({
          replicateConfigured: false,
          json2videoConfigured: false,
          geminiConfigured: false,
          defaultMode: 'mock'
        });
      });
  }, []);

  // STEP 1 -> STEP 2: Analyze Product
  const handleAnalyzeUrl = async (
    url: string,
    format: '9:16' | '1:1' | '16:9',
    duration: number,
    style: 'auto' | 'cinematic' | 'punchy' | 'minimal'
  ) => {
    setIsAnalyzingProduct(true);
    setAnalysisError(null);

    try {
      const res = await fetch('/api/analyze-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to extract product information from URL.');
      }

      const profile: ProductProfile = await res.json();

      setProject(prev => ({
        ...prev,
        sourceUrl: url,
        format,
        targetDuration: duration,
        style,
        productProfile: profile
      }));

      setCurrentStep(2);
    } catch (err: any) {
      setAnalysisError(err.message || 'An error occurred while analyzing the product URL.');
    } finally {
      setIsAnalyzingProduct(false);
    }
  };

  // STEP 2 -> STEP 3: Start Generation Pipeline
  const handleGenerateAd = async (updatedProfile: ProductProfile) => {
    // Save updated profile
    setProject(prev => ({
      ...prev,
      productProfile: updatedProfile
    }));

    setCurrentStep(3);
    runFullPipeline(updatedProfile);
  };

  // Pipeline Execution (Separated stages with independent retry)
  const runFullPipeline = async (profile: ProductProfile) => {
    setPipelineError(null);

    try {
      // 1. Creative Direction & Prompt Synthesis
      setPipelineStage('creative_direction');
      const promptRes = await fetch('/api/generate-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productProfile: profile,
          format: project.format,
          style: project.style,
          duration: project.targetDuration
        })
      });

      if (!promptRes.ok) {
        throw new Error('Creative direction prompt synthesis failed.');
      }

      const promptData = await promptRes.json();
      setProject(prev => ({
        ...prev,
        videoGeneration: {
          ...prev.videoGeneration,
          prompt: promptData.prompt,
          negativePrompt: promptData.negativePrompt,
          provider: 'Wan 3.0',
          status: 'generating'
        }
      }));

      // 2. Video Generation (Wan 3.0 via Replicate or Mock)
      setPipelineStage('generating_video');
      const videoRes = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productProfile: profile,
          format: project.format,
          style: project.style,
          duration: project.targetDuration
        })
      });

      if (!videoRes.ok) {
        const errData = await videoRes.json().catch(() => ({}));
        throw new Error(errData.error || 'Wan 3.0 video generation encountered an error.');
      }

      const videoData = await videoRes.json();
      setProject(prev => ({
        ...prev,
        videoGeneration: {
          prompt: videoData.prompt,
          negativePrompt: videoData.negativePrompt,
          provider: videoData.provider,
          videoUrl: videoData.videoUrl,
          status: 'completed',
          isMock: videoData.isMock
        }
      }));

      // 3. Computer Vision Video Analysis
      setPipelineStage('analyzing_video');
      const analysisRes = await fetch('/api/analyze-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoUrl: videoData.videoUrl,
          productProfile: profile,
          duration: project.targetDuration
        })
      });

      if (!analysisRes.ok) {
        throw new Error('Computer vision video analysis failed.');
      }

      const analysisData = await analysisRes.json();
      setProject(prev => ({
        ...prev,
        videoAnalysis: analysisData
      }));

      // 4. Synthesize AdDesignSystem
      setPipelineStage('designing_overlays');
      const artRes = await fetch('/api/art-direction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productProfile: profile,
          videoAnalysis: analysisData
        })
      });

      if (!artRes.ok) {
        throw new Error('Art direction synthesis failed.');
      }

      const designSystemData: AdDesignSystem = await artRes.json();
      setProject(prev => ({
        ...prev,
        designSystem: designSystemData
      }));

      // 5. JSON2Video Ad Composition
      setPipelineStage('preparing_composition');
      const compRes = await fetch('/api/compose-ad', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productProfile: profile,
          videoUrl: videoData.videoUrl,
          videoAnalysis: analysisData,
          designSystem: designSystemData,
          format: project.format,
          duration: project.targetDuration
        })
      });

      if (!compRes.ok) {
        throw new Error('JSON2Video ad composition failed.');
      }

      const compositionData: AdComposition = await compRes.json();
      setProject(prev => ({
        ...prev,
        composition: compositionData
      }));

      setPipelineStage('completed');
    } catch (err: any) {
      console.error('Pipeline error:', err);
      setPipelineStage('failed');
      setPipelineError(err.message || 'Production pipeline failed.');
    }
  };

  // Retry Video Generation only
  const handleRetryVideoGeneration = () => {
    if (project.productProfile) {
      runFullPipeline(project.productProfile);
    }
  };

  // Retry Composition only (reuses existing generated video)
  const handleRetryComposition = async () => {
    if (!project.productProfile || !project.videoGeneration?.videoUrl) {
      return handleRetryVideoGeneration();
    }

    setPipelineError(null);
    try {
      setPipelineStage('analyzing_video');
      const analysisRes = await fetch('/api/analyze-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoUrl: project.videoGeneration.videoUrl,
          productProfile: project.productProfile,
          duration: project.targetDuration
        })
      });
      const analysisData = await analysisRes.json();

      setPipelineStage('designing_overlays');
      const artRes = await fetch('/api/art-direction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productProfile: project.productProfile,
          videoAnalysis: analysisData
        })
      });
      const designSystemData = await artRes.json();

      setPipelineStage('preparing_composition');
      const compRes = await fetch('/api/compose-ad', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productProfile: project.productProfile,
          videoUrl: project.videoGeneration.videoUrl,
          videoAnalysis: analysisData,
          designSystem: designSystemData,
          format: project.format,
          duration: project.targetDuration
        })
      });
      const compositionData = await compRes.json();

      setProject(prev => ({
        ...prev,
        videoAnalysis: analysisData,
        designSystem: designSystemData,
        composition: compositionData
      }));

      setPipelineStage('completed');
    } catch (err: any) {
      setPipelineStage('failed');
      setPipelineError(err.message || 'Composition retry failed.');
    }
  };

  // STEP 4 -> STEP 5: Render Final Ad
  const handleRenderAd = async (
    finalComposition: AdComposition,
    finalDesignSystem: AdDesignSystem
  ) => {
    setIsRendering(true);

    try {
      const res = await fetch('/api/render-ad', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          composition: finalComposition,
          forceMock: false
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Video rendering failed.');
      }

      const renderResult = await res.json();

      setProject(prev => ({
        ...prev,
        composition: finalComposition,
        designSystem: finalDesignSystem,
        render: {
          status: 'completed',
          outputUrl: renderResult.outputUrl,
          renderTimeSeconds: renderResult.renderTimeSeconds,
          isMock: renderResult.isMock
        }
      }));

      setCurrentStep(5);
    } catch (err: any) {
      alert(`Render error: ${err.message}`);
    } finally {
      setIsRendering(false);
    }
  };

  // Reset to create another ad
  const handleReset = () => {
    setCurrentStep(1);
    setPipelineStage('analyzed');
    setPipelineError(null);
    setProject({
      id: `ad-${Date.now()}`,
      sourceUrl: '',
      format: '9:16',
      targetDuration: 15,
      style: 'auto',
      videoGeneration: {
        prompt: '',
        negativePrompt: '',
        provider: 'Pending',
        status: 'idle'
      },
      render: {
        status: 'idle'
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Navbar */}
      <Navbar
        status={providerStatus}
        onOpenInspector={() => setInspectorOpen(true)}
        currentStep={currentStep}
        onReset={handleReset}
      />

      {/* Progress Step Indicator */}
      <StepIndicator
        currentStep={currentStep}
        onStepClick={(step) => {
          if (step < currentStep) setCurrentStep(step);
        }}
        canNavigateToStep={(step) => {
          if (step === 1) return true;
          if (step === 2 && project.productProfile !== undefined) return true;
          if (step === 4 && project.composition !== undefined) return true;
          return false;
        }}
      />

      {/* Main Content Area based on Step */}
      <main className="flex-1">
        {currentStep === 1 && (
          <UrlInputStep
            onAnalyze={handleAnalyzeUrl}
            isLoading={isAnalyzingProduct}
            error={analysisError}
          />
        )}

        {currentStep === 2 && project.productProfile && (
          <ProductProfileEditor
            initialProfile={project.productProfile}
            onGenerateAd={handleGenerateAd}
            onBack={() => setCurrentStep(1)}
            isGenerating={false}
          />
        )}

        {currentStep === 3 && (
          <GenerationProgressStep
            currentStage={pipelineStage}
            error={pipelineError}
            videoUrl={project.videoGeneration?.videoUrl}
            isMock={project.videoGeneration?.isMock}
            onRetryVideoGeneration={handleRetryVideoGeneration}
            onRetryComposition={handleRetryComposition}
            onContinueToEditor={() => setCurrentStep(4)}
          />
        )}

        {currentStep === 4 && project.composition && project.designSystem && project.productProfile && (
          <MiniEditorStep
            initialComposition={project.composition}
            initialDesignSystem={project.designSystem}
            profile={project.productProfile}
            onRenderAd={handleRenderAd}
            isRendering={isRendering}
          />
        )}

        {currentStep === 5 && (
          <RenderResultStep
            project={project}
            onEditAgain={() => setCurrentStep(4)}
            onCreateAnother={handleReset}
            onOpenInspector={() => setInspectorOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>AdCraft AI URL-to-Ad Generator • Wan 3.0 + CV Vision + JSON2Video Pipeline</span>
          <div className="flex items-center space-x-4 text-slate-400">
            <button
              onClick={() => setInspectorOpen(true)}
              className="hover:text-amber-400 transition-colors"
            >
              AI Pipeline Inspector
            </button>
            <span>•</span>
            <button
              onClick={handleReset}
              className="hover:text-amber-400 transition-colors"
            >
              New Campaign
            </button>
          </div>
        </div>
      </footer>

      {/* AI Inspector Modal */}
      <AdInspectorModal
        isOpen={inspectorOpen}
        onClose={() => setInspectorOpen(false)}
        project={project}
      />
    </div>
  );
}
