import express, { type Request, Response, NextFunction } from "express";
import http from "http";
import next from "next";
import { registerRoutes } from "./routes";
import { seedData } from "./seedData";
import path from "path";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      console.log(logLine);
    }
  });

  next();
});

(async () => {
  console.log('🔄 Starting Admin Dashboard Server...');
  
  const dev = process.env.NODE_ENV !== 'production';
  const nextApp = next({ dev, dir: process.cwd() });
  const handle = nextApp.getRequestHandler();

  await nextApp.prepare();
  console.log('✅ Next.js application prepared');
  
  // Initialize PostgreSQL/Supabase data seeding
  try {
    await seedData();
    console.log('✅ Admin data seeded to Supabase');
  } catch (error) {
    console.log('Note: Admin data seeding skipped (already exists or error occurred)');
  }
  
  const server = await registerRoutes(app);
  console.log('✅ Admin routes registered successfully');

  // Handle all Next.js pages
  app.all('*', (req, res) => {
    return handle(req, res);
  });

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    console.log(`Admin dashboard serving on port ${port}`);
  });
})();
