import express from 'express';
import cors from 'cors';
import { config, isGeminiConfigured } from './config/index.js';
import { initDatabase } from './database/db.js';
import interviewRoutes from './routes/interviewRoutes.js';
import topicsRoutes from './routes/topicsRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import authRoutes from './routes/authRoutes.js';

// Initialize persistent database
initDatabase();

export const app = express();

// Production-ready CORS
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json({ limit: '5mb' }));

// Health Check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'online',
    app: 'NEXORA AI C++ Mock Interview Platform',
    geminiConfigured: isGeminiConfigured(),
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/topics', topicsRoutes);
app.use('/api/settings', settingsRoutes);

// Error handling middleware
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error occurred.'
  });
});

export default app;
