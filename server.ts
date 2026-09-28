import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { productAnalyzerService } from './src/services/productAnalyzer/productAnalyzerService';
import { buildWanPrompt } from './src/services/videoGenerator/promptBuilder';
import { videoGeneratorService } from './src/services/videoGenerator/videoGeneratorService';
import { videoAnalyzerService } from './src/services/videoAnalyzer/videoAnalyzerService';
import { artDirectionService } from './src/services/compositionGenerator/artDirectionService';
import { compositionService } from './src/services/compositionGenerator/compositionService';
import { videoRendererService } from './src/services/videoRenderer/videoRendererService';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '25mb' }));

// 1. Service Status Endpoint
app.get('/api/status', (req, res) => {
  const replicateConfigured = Boolean(process.env.REPLICATE_API_TOKEN && process.env.REPLICATE_API_TOKEN.trim().length > 0);
  const json2videoConfigured = Boolean(process.env.JSON2VIDEO_API_KEY && process.env.JSON2VIDEO_API_KEY.trim().length > 0);
  const geminiConfigured = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0);

  res.json({
    replicateConfigured,
    json2videoConfigured,
    geminiConfigured,
    defaultMode: (replicateConfigured || geminiConfigured) ? 'live' : 'mock'
  });
});

// 2. Product Analysis Endpoint
app.post('/api/analyze-product', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'A valid product URL is required.' });
    }

    const profile = await productAnalyzerService.analyzeUrl(url);
    res.json(profile);
  } catch (err: any) {
    console.error('Error in /api/analyze-product:', err);
    res.status(500).json({ error: err.message || 'Failed to analyze product page.' });
  }
});

// 3. Prompt Generation Endpoint
app.post('/api/generate-prompt', (req, res) => {
  try {
    const { productProfile, format, style, duration } = req.body;
    if (!productProfile) {
      return res.status(400).json({ error: 'Product profile is required.' });
    }

    const prompts = buildWanPrompt(productProfile, format || '9:16', style || 'auto', duration || 15);
    res.json(prompts);
  } catch (err: any) {
    console.error('Error in /api/generate-prompt:', err);
    res.status(500).json({ error: err.message || 'Failed to generate Wan 3.0 prompt.' });
  }
});

// 4. Video Generation Endpoint (Wan 3.0 via Replicate / Mock)
app.post('/api/generate-video', async (req, res) => {
  try {
    const { productProfile, format, style, duration, forceMock } = req.body;
    if (!productProfile) {
      return res.status(400).json({ error: 'Product profile is required.' });
    }

    const result = await videoGeneratorService.generate(productProfile, {
      format: format || '9:16',
      style: style || 'auto',
      duration: duration || 15,
      forceMock: Boolean(forceMock)
    });

    res.json(result);
  } catch (err: any) {
    console.error('Error in /api/generate-video:', err);
    res.status(500).json({ error: err.message || 'Video generation failed.' });
  }
});

// 5. Video Analysis Endpoint
app.post('/api/analyze-video', async (req, res) => {
  try {
    const { videoUrl, productProfile, duration } = req.body;
    if (!videoUrl || !productProfile) {
      return res.status(400).json({ error: 'videoUrl and productProfile are required.' });
    }

    const analysis = await videoAnalyzerService.analyzeVideo(videoUrl, productProfile, duration || 15);
    res.json(analysis);
  } catch (err: any) {
    console.error('Error in /api/analyze-video:', err);
    res.status(500).json({ error: err.message || 'Video analysis failed.' });
  }
});

// 6. Art Direction / Design System Endpoint
app.post('/api/art-direction', (req, res) => {
  try {
    const { productProfile, videoAnalysis } = req.body;
    if (!productProfile) {
      return res.status(400).json({ error: 'productProfile is required.' });
    }

    const designSystem = artDirectionService.generateDesignSystem(productProfile, videoAnalysis);
    res.json(designSystem);
  } catch (err: any) {
    console.error('Error in /api/art-direction:', err);
    res.status(500).json({ error: err.message || 'Art direction generation failed.' });
  }
});

// 7. Compose Ad / JSON2Video Composition Endpoint
app.post('/api/compose-ad', async (req, res) => {
  try {
    const { productProfile, videoUrl, videoAnalysis, designSystem, format, duration } = req.body;
    if (!productProfile || !videoUrl || !videoAnalysis || !designSystem) {
      return res.status(400).json({ error: 'Missing required composition arguments.' });
    }

    const composition = await compositionService.composeAd(
      productProfile,
      videoUrl,
      videoAnalysis,
      designSystem,
      format || '9:16',
      duration || 15
    );

    res.json(composition);
  } catch (err: any) {
    console.error('Error in /api/compose-ad:', err);
    res.status(500).json({ error: err.message || 'Ad composition failed.' });
  }
});

// 8. Render Final Ad Endpoint (JSON2Video / Mock)
app.post('/api/render-ad', async (req, res) => {
  try {
    const { composition, forceMock } = req.body;
    if (!composition) {
      return res.status(400).json({ error: 'composition is required.' });
    }

    const result = await videoRendererService.render(composition, Boolean(forceMock));
    res.json(result);
  } catch (err: any) {
    console.error('Error in /api/render-ad:', err);
    res.status(500).json({ error: err.message || 'Rendering failed.' });
  }
});

// Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`URL-to-Ad Generator server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
