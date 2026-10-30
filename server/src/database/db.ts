import { DatabaseSync } from 'node:sqlite';
import { config, setActiveApiKey, serverRoot, isServerless } from '../config/index.js';
import path from 'path';
import fs from 'fs';

// In serverless environments, if /tmp/nexora.db does not exist, seed it from bundled template
if (isServerless && !fs.existsSync(config.databaseFile)) {
  const candidates = [
    path.join(serverRoot, 'nexora.db'),
    path.resolve(process.cwd(), 'nexora.db'),
    path.resolve(process.cwd(), 'server', 'nexora.db')
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      try {
        const targetDir = path.dirname(config.databaseFile);
        if (!fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir, { recursive: true });
        }
        fs.copyFileSync(candidate, config.databaseFile);
        console.log(`Seeded serverless database from ${candidate} to ${config.databaseFile}`);
        break;
      } catch (err) {
        console.warn(`Could not seed DB from ${candidate}:`, err);
      }
    }
  }
}

// Ensure data folder exists
const dbDir = path.dirname(config.databaseFile);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

export const db = new DatabaseSync(config.databaseFile);

// Initialize tables
export function initDatabase(): void {
  // Enable WAL mode for high concurrency & reliability (with DELETE mode fallback)
  try {
    db.exec('PRAGMA journal_mode = WAL;');
  } catch (_e) {
    db.exec('PRAGMA journal_mode = DELETE;');
  }
  db.exec('PRAGMA foreign_keys = ON;');


  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      salt TEXT NOT NULL,
      target_role TEXT DEFAULT 'C++ Software Engineer',
      experience_level TEXT DEFAULT 'Intermediate',
      bio TEXT DEFAULT '',
      avatar_seed TEXT DEFAULT '',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS auth_tokens (
      token TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      created_at TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      topic_id TEXT NOT NULL,
      topic_title TEXT NOT NULL,
      difficulty TEXT NOT NULL,
      current_difficulty TEXT NOT NULL,
      target_questions INTEGER NOT NULL,
      status TEXT NOT NULL,
      current_question_index INTEGER NOT NULL DEFAULT 0,
      start_time TEXT NOT NULL,
      end_time TEXT,
      final_score REAL,
      total_marks_awarded REAL,
      total_max_marks REAL,
      report_json TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS questions (
      id TEXT PRIMARY KEY,
      session_id TEXT NOT NULL,
      question_index INTEGER NOT NULL,
      question_text TEXT NOT NULL,
      topic TEXT NOT NULL,
      difficulty TEXT NOT NULL,
      max_marks REAL NOT NULL,
      expected_points_json TEXT NOT NULL,
      code_snippet TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS interactions (
      id TEXT PRIMARY KEY,
      session_id TEXT NOT NULL,
      question_id TEXT NOT NULL,
      interaction_type TEXT NOT NULL,
      user_input TEXT NOT NULL,
      ai_response_text TEXT NOT NULL,
      evaluation_status TEXT NOT NULL,
      marks_awarded REAL NOT NULL,
      max_marks REAL NOT NULL,
      correct_points_json TEXT NOT NULL,
      missing_points_json TEXT NOT NULL,
      incorrect_points_json TEXT NOT NULL,
      feedback TEXT NOT NULL,
      expected_answer TEXT NOT NULL,
      follow_up_question TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
      FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
    );
  `);

  // Ensure sessions has user_id column if created earlier
  try {
    db.exec('ALTER TABLE sessions ADD COLUMN user_id TEXT;');
  } catch (_e) {
    // Column already exists
  }

  // Persistently load Gemini API key across server restarts and Vercel environments
  try {
    const envKey = process.env.GEMINI_API_KEY || config.geminiApiKey;
    if (envKey && envKey.trim().length >= 20) {
      setActiveApiKey(envKey.trim());
      db.prepare("INSERT INTO settings (key, value) VALUES ('gemini_api_key', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value").run(envKey.trim());
    } else {
      const row = db.prepare("SELECT value FROM settings WHERE key = 'gemini_api_key'").get() as { value: string } | undefined;
      if (row && row.value && row.value.trim().length >= 20) {
        setActiveApiKey(row.value.trim());
      }
    }
  } catch (err) {
    console.error('Error loading settings from DB:', err);
  }

  console.log('Database initialized successfully at', config.databaseFile);
}
