import express from 'express';
import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dev = process.env.NODE_ENV !== 'production';
const hostname = '0.0.0.0';
const port = parseInt(process.env.PORT || '3000', 10);

// Create Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

async function startServer() {
  try {
    // Prepare Next.js app
    await app.prepare();

    // Create Express server
    const server = express();

    // API routes can be added here if needed
    server.use('/api', express.json());

    // Handle all other requests with Next.js
    server.all('*', (req, res) => {
      const parsedUrl = parse(req.url!, true);
      return handle(req, res, parsedUrl);
    });

    // Create HTTP server
    const httpServer = createServer(server);

    // Start server
    httpServer.listen(port, () => {
      console.log(`🚀 Server ready on http://${hostname}:${port}`);
      console.log(`📱 App URL: http://localhost:${port}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, shutting down gracefully');
      httpServer.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();