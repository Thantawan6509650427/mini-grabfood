import express from "express";
import { addRating } from "../controllers/rating.controller.js";

const router = express.Router();
router.post("/", addRating);

export default router;
