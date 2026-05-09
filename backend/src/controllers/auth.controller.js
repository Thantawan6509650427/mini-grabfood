import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import pool from "../db.js";

export const googleCallback = (req, res) => {
  // สร้าง JWT token
  const token = jwt.sign(
    { 
      id: req.user.id, 
      email: req.user.email,
      name: req.user.name 
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  // Redirect กลับไปหน้า frontend พร้อม token
  res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
};

export const logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.json({ success: true, message: "Logged out successfully" });
  });
};

export const getCurrentUser = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  res.json(req.user);
};


export const updateProfile = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user.id;

    const fields = [];
    const values = [];

    if (name?.trim()) {
      fields.push("name = ?");
      values.push(name.trim());
    }

    if (req.file) {
      // ลบรูปเก่า (ถ้าเป็นรูปที่ upload เอง ไม่ใช่ Google)
      if (req.user.picture && req.user.picture.startsWith("/uploads/")) {
        const oldPath = path.join(process.cwd(), req.user.picture);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      fields.push("picture = ?");
      values.push(`/uploads/profiles/${req.file.filename}`);
    }

    if (fields.length === 0) {
      return res.status(400).json({ message: "ไม่มีข้อมูลที่ต้องอัปเดต" });
    }

    values.push(userId);
    await pool.execute(
      `UPDATE users SET ${fields.join(", ")} WHERE id = ?`,
      values
    );

    const [rows] = await pool.execute("SELECT * FROM users WHERE id = ?", [userId]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};