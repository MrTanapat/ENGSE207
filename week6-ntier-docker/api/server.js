// server.js
// Main entry point for Task Board API
// ENGSE207 - Week 6 Docker Version

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { healthCheck } = require("./src/config/database");
const taskRoutes = require("./src/routes/taskRoutes");
const {
  errorHandler,
  notFoundHandler,
} = require("./src/middleware/errorHandler");

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// Middleware
// ============================================

// CORS - อนุญาต requests จาก Nginx
// app.use(
//   cors({
//     origin: process.env.CORS_ORIGIN || "*",
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   }),
// );

// CORS configuration - รองรับทั้ง Local และ Railway
const corsOptions = {
  origin: function (origin, callback) {
    // อนุญาต requests ที่ไม่มี origin (เช่น mobile apps, curl)
    // และ origins ที่อนุญาต
    const allowedOrigins = [
      "http://localhost:3000",
      "http://localhost:8080",
      "https://localhost",
      /\.railway\.app$/, // อนุญาตทุก subdomain ของ railway.app
    ];

    if (!origin) return callback(null, true);

    const isAllowed = allowedOrigins.some((allowed) => {
      if (allowed instanceof RegExp) return allowed.test(origin);
      return allowed === origin;
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      console.log("CORS blocked:", origin);
      callback(null, true); // อนุญาตทุก origin สำหรับ Lab
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan("combined"));

// ============================================
// Routes
// ============================================

// Health check endpoint (สำหรับ Docker health check)
app.get("/api/health", async (req, res) => {
  const dbHealth = await healthCheck();
  const healthy = dbHealth.status === "healthy";

  res.status(healthy ? 200 : 503).json({
    status: healthy ? "healthy" : "unhealthy",
    timestamp: new Date().toISOString(),
    version: "2.0.0",
    environment: process.env.NODE_ENV || "development",
    database: dbHealth,
  });
});

// API info
app.get("/api", (req, res) => {
  res.json({
    name: "Task Board API",
    version: "2.0.0",
    description: "ENGSE207 Week 6 - N-Tier Architecture (Docker)",
    endpoints: {
      health: "GET /api/health",
      tasks: {
        list: "GET /api/tasks",
        get: "GET /api/tasks/:id",
        create: "POST /api/tasks",
        update: "PUT /api/tasks/:id",
        delete: "DELETE /api/tasks/:id",
        stats: "GET /api/tasks/stats",
      },
    },
  });
});

// Task routes
app.use("/api/tasks", taskRoutes);

// ============================================
// Error Handling
// ============================================

app.use(notFoundHandler);
app.use(errorHandler);

// ============================================
// Start Server
// ============================================

// Wait for database connection before starting
const startServer = async () => {
  try {
    // Test database connection
    const dbHealth = await healthCheck();
    if (dbHealth.status !== "healthy") {
      console.error("❌ Database connection failed:", dbHealth.error);
      console.log("⏳ Waiting for database...");
      // Retry after 5 seconds
      setTimeout(startServer, 5000);
      return;
    }

    app.listen(PORT, "0.0.0.0", () => {
      console.log("=========================================");
      console.log("🚀 Task Board API Started");
      console.log("=========================================");
      console.log(`📡 Server running on port ${PORT}`);
      console.log(`🗄️  Database: ${dbHealth.database}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log("=========================================");
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    setTimeout(startServer, 5000);
  }
};

startServer();
