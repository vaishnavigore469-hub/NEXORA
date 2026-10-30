import { Router, Request, Response } from 'express';
import { config, getActiveApiKey, isGeminiConfigured, setActiveApiKey, getMaskedApiKey } from '../config/index.js';
import { validateGeminiApiKey } from '../services/geminiService.js';
import { db } from '../database/db.js';

const router = Router();

// Get AI engine and Gemini persistence status
router.get('/ai-status', (_req: Request, res: Response): void => {
  const configured = isGeminiConfigured();

  res.json({
    success: true,
    isConfigured: configured,
    status: configured ? 'connected' : 'disconnected',
    mode: configured ? 'LIVE_AI' : 'DEMO_MODE',
    isSaved: configured,
    model: config.geminiModel,
    maskedKey: configured ? getMaskedApiKey() : null,
    message: configured
      ? `Connected to Google Gemini (${config.geminiModel}) for real-time generative evaluation and question generation.`
      : `Running in DEMO MODE with the verified local C++ technical evaluation engine. To enable real-time generative AI, add your Gemini API Key in Settings.`
  });
});

// Update or set Gemini API key with server-side validation and secure database persistence
router.post('/gemini-key', async (req: Request, res: Response): Promise<void> => {
  try {
    const { apiKey } = req.body;
    if (!apiKey || typeof apiKey !== 'string' || apiKey.trim().length < 15) {
      res.status(400).json({ 
        success: false, 
        error: 'A valid Gemini API key (at least 15 characters) must be provided.' 
      });
      return;
    }

    const trimmedKey = apiKey.trim();

    // Verify key with Gemini 3.8 Flash using safe timeout
    const validation = await validateGeminiApiKey(trimmedKey);
    if (!validation.valid && validation.status === 'invalid_key') {
      res.status(400).json({
        success: false,
        status: validation.status,
        error: validation.message || 'The provided Gemini API key is invalid or revoked by Google.'
      });
      return;
    }

    // Key is verified (or authenticated with temporary network delay):
    // Persist securely on backend (SQLite settings table + server environment sync)
    setActiveApiKey(trimmedKey);
    db.prepare("INSERT INTO settings (key, value) VALUES ('gemini_api_key', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value").run(trimmedKey);

    res.json({
      success: true,
      mode: 'LIVE_AI',
      status: validation.status === 'connected' ? 'connected' : 'saved_offline',
      isSaved: true,
      maskedKey: getMaskedApiKey(),
      message: validation.status === 'connected'
        ? 'Gemini API key verified and securely persisted! LIVE AI MODE is now active.'
        : 'Gemini API key securely saved. Network ping timed out, but your key is preserved.'
    });

  } catch (err: any) {
    console.error('Error updating API key:', err);
    res.status(500).json({ success: false, error: err.message || 'Internal error updating API key' });
  }
});

// Safe on-demand Gemini connectivity test (never deletes or alters the saved key on timeout)
router.post('/test-connection', async (_req: Request, res: Response): Promise<void> => {
  try {
    const currentKey = getActiveApiKey();
    if (!currentKey || !isGeminiConfigured()) {
      res.status(400).json({
        success: false,
        status: 'disconnected',
        error: 'No active Gemini API key found to test. Please save a key first.'
      });
      return;
    }

    const validation = await validateGeminiApiKey(currentKey);
    res.json({
      success: validation.valid,
      status: validation.status,
      message: validation.message,
      maskedKey: getMaskedApiKey(),
      mode: isGeminiConfigured() ? 'LIVE_AI' : 'DEMO_MODE',
      isSaved: true
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      status: 'network_error',
      error: err.message || 'Failed to perform connectivity test'
    });
  }
});

// Clear Gemini API Key (switches back to Demo Mode)
router.post('/clear-key', (_req: Request, res: Response): void => {
  try {
    setActiveApiKey('');
    db.prepare("DELETE FROM settings WHERE key = 'gemini_api_key'").run();
    res.json({
      success: true,
      mode: 'DEMO_MODE',
      isSaved: false,
      maskedKey: null,
      message: 'API key cleared. NEXORA is now running in local Demo Mode.'
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Failed to clear key' });
  }
});

export default router;

