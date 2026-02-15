import express from "express";
import { 
  getRestaurants, 
  getRestaurantById,
  getRestaurantRatings 
} from "../controllers/restaurant.controller.js";
import { addRating, deleteRating } from "../controllers/rating.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";  // ← บรรทัดนี้สำคัญ!

const router = express.Router();

// Restaurant routes
router.get("/restaurants", getRestaurants);
router.get("/restaurants/:id", getRestaurantById);
router.get("/restaurants/:id/ratings", getRestaurantRatings);

// Rating routes - ต้องมี authenticate
router.post("/restaurants/:id/rating", authenticate, addRating);
router.delete("/ratings/:id", authenticate, deleteRating);

export default router;