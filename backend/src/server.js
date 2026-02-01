import app from "./app.js";
import pool from "./db.js";

const PORT = process.env.PORT || 5000;

// Test database connection
async function testDbConnection() {
  try {
    await pool.query("SELECT 1");
    console.log("✓ Database connected successfully");
    return true;
  } catch (err) {
    console.error("✗ Database connection failed:", err.message);
    return false;
  }
}

// Start server
async function startServer() {
  // Test database first
  const dbConnected = await testDbConnection();
  
  if (!dbConnected) {
    console.error("Failed to connect to database. Exiting...");
    process.exit(1);
  }

  // Start listening
  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`🔗 API: http://localhost:${PORT}/api`);
  });

  // Graceful shutdown
  const shutdown = async (signal) => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    
    server.close(async () => {
      console.log("✓ HTTP server closed");
      
      try {
        await pool.end();
        console.log("✓ Database connections closed");
        process.exit(0);
      } catch (err) {
        console.error("Error closing database:", err);
        process.exit(1);
      }
    });

    // Force shutdown after 10 seconds
    setTimeout(() => {
      console.error("Forced shutdown after timeout");
      process.exit(1);
    }, 10000);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

// Handle uncaught errors
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

// Start the application
startServer();