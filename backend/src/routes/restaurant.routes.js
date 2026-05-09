import express from "express";
import { getRestaurants, getRestaurantById, getRestaurantRatings } from "../controllers/restaurant.controller.js";
import { addRating, deleteRating, getRestaurantReviews } from "../controllers/rating.controller.js";
import { getFavorites, addFavorite, removeFavorite } from "../controllers/favorite.controller.js";
import { getUserStats } from "../controllers/user.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const router = express.Router();

router.get("/restaurants", getRestaurants);
router.get("/restaurants/:id", getRestaurantById);
router.get("/restaurants/:id/ratings", getRestaurantRatings);
router.get("/restaurants/:id/reviews", getRestaurantReviews);

router.post("/restaurants/:id/rating", authenticate, upload.single("image"), addRating);
router.delete("/ratings/:id", authenticate, deleteRating);

router.get("/favorites", authenticate, getFavorites);
router.post("/restaurants/:id/favorite", authenticate, addFavorite);
router.delete("/restaurants/:id/favorite", authenticate, removeFavorite);

router.get("/users/me/stats", authenticate, getUserStats);

export default router;