const express = require("express");
const cors = require("cors");
require("dotenv").config();
const multer = require("multer");

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

const analyzeRoutes = require("./routes/analyze.routes");
app.use("/api", analyzeRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Java Code Analyzer API",
    version: "1.0.0",
    endpoints: {
      health: "GET /api/health",
      analyze: "POST /api/analyze",
      format: "POST /api/format",
      upload: "POST /api/analyze/upload",
    },
    documentation: "https://github.com/your-repo/java-analyzer-api",
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Not Found",
    message: `Cannot ${req.method} ${req.path}`,
  });
});

app.use((err, req, res, next) => {
  console.error("Error:", err);

  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      error: "File upload error",
      message: err.message,
    });
  }

  res.status(err.status || 500).json({
    success: false,
    error: err.name || "Internal Server Error",
    message: err.message || "An unexpected error occurred",
    details: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

module.exports = app;
