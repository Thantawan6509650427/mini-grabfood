import express from "express";
import { 
  getRestaurants, 
  getRestaurantById,
  getRestaurantRatings 
} from "../controllers/restaurant.controller.js";
import { addRating, deleteRating } from "../controllers/rating.controller.js";

const router = express.Router();

// Restaurant routes
router.get("/restaurants", getRestaurants);
router.get("/restaurants/:id", getRestaurantById);
router.get("/restaurants/:id/ratings", getRestaurantRatings);

// Rating routes
router.post("/restaurants/:id/rating", addRating);
router.delete("/ratings/:id", deleteRating);

export default router;