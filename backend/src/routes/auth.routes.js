import express from "express";
import passport from "passport";
import multer from "multer";
import { googleCallback, logout, getCurrentUser, updateProfile } from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();
const upload = multer({ dest: "uploads/profiles/" });

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
router.put("/user/profile", authenticate, upload.single("picture"), updateProfile);
router.post("/logout", authenticate, logout);

export default router;