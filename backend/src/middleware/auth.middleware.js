import jwt from "jsonwebtoken";
import pool from "../db.js";

export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [users] = await pool.query("SELECT * FROM users WHERE id = ?", [decoded.id]);

    if (users.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = users[0];
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};