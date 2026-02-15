import express from "express";
import passport from "passport";
import { googleCallback, logout, getCurrentUser } from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

// Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: process.env.FRONTEND_URL }),
  googleCallback
);

// User routes
router.get("/user", authenticate, getCurrentUser);
router.post("/logout", authenticate, logout);

export default router;