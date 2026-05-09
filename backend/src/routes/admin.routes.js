import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/admin.middleware.js";
import {
  getDashboardStats,
  adminGetRestaurants, adminCreateRestaurant,
  adminUpdateRestaurant, adminDeleteRestaurant,
  adminGetUsers, adminToggleBan, adminToggleAdmin,
  adminDeleteReview
} from "../controllers/admin.controller.js";

const router = express.Router();

// ทุก route ต้อง login และเป็น admin
router.use(authenticate, requireAdmin);

// Dashboard
router.get("/dashboard", getDashboardStats);

// Restaurants
router.get("/restaurants", adminGetRestaurants);
router.post("/restaurants", adminCreateRestaurant);
router.put("/restaurants/:id", adminUpdateRestaurant);
router.delete("/restaurants/:id", adminDeleteRestaurant);

// Users
router.get("/users", adminGetUsers);
router.patch("/users/:id/ban", adminToggleBan);
router.patch("/users/:id/admin", adminToggleAdmin);

// Reviews
router.delete("/reviews/:id", adminDeleteReview);

export default router;