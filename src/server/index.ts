import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import dotenv from 'dotenv';
import path from 'path';

import { setupDatabase } from './database/setup';
import { projectRoutes } from './routes/projects';
import { chatRoutes } from './routes/chat';
import { previewRoutes } from './routes/preview';
import { WebSocketManager } from './websocket/manager';

dotenv.config();

const app = express();
const server = createServer(app);
const port = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] 
    : ['http://localhost:3000'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/projects', projectRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/preview', previewRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../dist/client')));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, '../../dist/client/index.html'));
  });
}

// WebSocket setup
const wss = new WebSocketServer({ 
  server,
  path: '/ws'
});

const wsManager = new WebSocketManager(wss);

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Initialize database and start server
async function startServer() {
  try {
    await setupDatabase();
    console.log('✅ Database initialized successfully');
    
    server.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
      console.log(`📱 Frontend: http://localhost:3000`);
      console.log(`🔌 API: http://localhost:${port}/api`);
      console.log(`🌐 WebSocket: ws://localhost:${port}/ws`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export { wsManager }; 