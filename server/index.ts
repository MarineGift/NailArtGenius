import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { seedBookingData } from "./seedData";
import { seedTestCustomersAndReservations } from "./test-data-seeder";
import { seedComprehensiveData } from "./comprehensive-seed-data";

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

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Initialize booking system data
  await seedBookingData();
  
  // Seed test customers and reservations
  try {
    await seedTestCustomersAndReservations();
  } catch (error) {
    console.log('Note: Test data seeding skipped (already exists or error occurred)');
  }
  
  // Seed comprehensive data (carousel, gallery, AI nail art)
  try {
    await seedComprehensiveData();
  } catch (error) {
    console.log('Note: Comprehensive data seeding skipped (already exists or error occurred)');
  }

  // Seed comprehensive sample data for testing
  try {
    const { seedComprehensiveSampleData } = await import('./comprehensive-sample-data');
    await seedComprehensiveSampleData();
  } catch (error) {
    console.log('Note: Comprehensive sample data seeding skipped (already exists or error occurred)');
  }

  // Create booking data for all customers (1-5 bookings each)
  try {
    const { seedBookingData } = await import('./booking-data-seeder');
    await seedBookingData();
  } catch (error) {
    console.log('Note: Booking data seeding skipped (already exists or error occurred)');
  }

  // Update gallery with Gallery_No unique identifiers
  try {
    const { updateGalleryWithGalleryNo } = await import('./gallery-update');
    await updateGalleryWithGalleryNo();
  } catch (error) {
    console.log('Note: Gallery update skipped (already exists or error occurred)');
  }
  
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

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
    log(`serving on port ${port}`);
  });
})();
