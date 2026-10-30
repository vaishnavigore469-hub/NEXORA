import app from './app.js';
import { config, isGeminiConfigured } from './config/index.js';

app.listen(config.port, () => {
  console.log(`====================================================`);
  console.log(`  NEXORA Server running on http://localhost:${config.port}`);
  console.log(`  AI Engine: ${isGeminiConfigured() ? `Live Google Gemini (${config.geminiModel})` : 'Local C++ Technical Evaluation Engine (DEMO MODE)'}`);
  console.log(`====================================================`);
});

