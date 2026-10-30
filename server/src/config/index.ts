import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const serverRoot = path.resolve(__dirname, '..', '..');

// Load .env explicitly from serverRoot so cwd does not alter config loading
const envPath = path.join(serverRoot, '.env');
dotenv.config({ path: envPath });

export const isServerless = Boolean(
  process.env.VERCEL || 
  process.env.AWS_LAMBDA_FUNCTION_NAME || 
  process.env.VERCEL_ENV
);

// In serverless environments, the container root is read-only; /tmp is the writable storage
const defaultDbPath = isServerless
  ? path.join('/tmp', 'nexora.db')
  : path.join(serverRoot, 'nexora.db');

const dbPath = process.env.DATABASE_FILE || defaultDbPath;


export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  geminiModel: process.env.GEMINI_MODEL || 'gemini-3.8-flash',
  databaseFile: dbPath,
};

// In-memory active key (initialized from process.env.GEMINI_API_KEY or SQLite on boot)
let dynamicApiKey = config.geminiApiKey;

export function getActiveApiKey(): string {
  return dynamicApiKey || config.geminiApiKey || process.env.GEMINI_API_KEY || '';
}

export function setActiveApiKey(newKey: string): void {
  dynamicApiKey = newKey.trim();
  process.env.GEMINI_API_KEY = dynamicApiKey;

  // Persist to .env file for local restarts (if filesystem is writable)
  try {
    if (fs.existsSync(envPath)) {
      let content = fs.readFileSync(envPath, 'utf8');
      if (content.includes('GEMINI_API_KEY=')) {
        content = content.replace(/GEMINI_API_KEY=.*/, `GEMINI_API_KEY=${dynamicApiKey}`);
      } else {
        content += `\nGEMINI_API_KEY=${dynamicApiKey}\n`;
      }
      fs.writeFileSync(envPath, content, 'utf8');
    }
  } catch (err) {
    // In read-only serverless environments (like Vercel production), filesystem writes to .env are ignored.
    // In Vercel, GEMINI_API_KEY is permanently stored in Vercel Project Environment Variables.
  }
}

export function isGeminiConfigured(): boolean {
  const key = getActiveApiKey();
  return Boolean(key && key.trim().length >= 20);
}

export function getMaskedApiKey(): string {
  const key = getActiveApiKey();
  if (!key) return '';
  return '••••••••';
}
