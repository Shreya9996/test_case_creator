import express from "express"
import cors from "cors"
import morgan from "morgan"
import path from "path"
import fs from "fs"
import { fileURLToPath } from "url"
import aiRoutes from "./routes/aiRoutes.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express();

// CORS configuration for Vercel
const corsOptions = {
  origin: true, // Allow all origins in production or configure specifically
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Only use morgan in development
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan("dev"));
}

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// AI Routes
app.use("/api/ai", aiRoutes);

// Dashboard endpoint
app.get("/api/dashboard", (req, res) => {
  res.json({
    success: true,
    message: "Dashboard endpoint"
  });
});

// For Vercel deployment, we don't serve static files from backend
// The frontend is served separately by Vercel's static build

export default app;
