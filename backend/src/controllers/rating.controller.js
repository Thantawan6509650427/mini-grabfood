import pool from "../db.js";

// Add rating to a restaurant
export const addRating = async (req, res) => {
  try {
    const { id } = req.params;
    const { score, comment } = req.body;

    // Validate restaurant ID
    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Invalid restaurant ID" });
    }

    // Validate score (must be 1-5)
    if (!score || score < 1 || score > 5) {
      return res.status(400).json({ 
        message: "Score must be between 1 and 5" 
      });
    }

    // Check if restaurant exists
    const [restaurant] = await pool.query(
      "SELECT id FROM restaurants WHERE id = ?",
      [id]
    );

    if (restaurant.length === 0) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // ⭐ ดึง user_id จาก req.user (ถ้ามี authentication)
    const userId = req.user ? req.user.id : null;

    // Insert rating พร้อม user_id
    const [result] = await pool.query(
      "INSERT INTO ratings (user_id, restaurant_id, score, comment) VALUES (?, ?, ?, ?)",
      [userId, id, score, comment || null]  // ← เพิ่ม userId
    );

    // Get updated restaurant stats
    const [updated] = await pool.query(
      `SELECT 
        ROUND(AVG(score), 1) AS avg_rating,
        COUNT(id) AS rating_count
      FROM ratings
      WHERE restaurant_id = ?`,
      [id]
    );

    res.status(201).json({ 
      success: true,
      message: "Rating added successfully",
      rating_id: result.insertId,
      restaurant_stats: updated[0]
    });
  } catch (err) {
    console.error("Error adding rating:", err);
    res.status(500).json({ 
      message: "Failed to add rating",
      error: process.env.NODE_ENV === "development" ? err.message : undefined
    });
  }
};

// Delete rating (optional - for future use)
export const deleteRating = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Invalid rating ID" });
    }

    const [result] = await pool.query(
      "DELETE FROM ratings WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Rating not found" });
    }

    res.json({ 
      success: true,
      message: "Rating deleted successfully" 
    });
  } catch (err) {
    console.error("Error deleting rating:", err);
    res.status(500).json({ 
      message: "Failed to delete rating",
      error: process.env.NODE_ENV === "development" ? err.message : undefined
    });
  }
};