import pool from "../db.js";

export const addRating = async (req, res) => {
  try {
    const { id } = req.params;
    const { score, comment } = req.body;

    if (!id || isNaN(id))
      return res.status(400).json({ message: "Invalid restaurant ID" });

    if (!score || score < 1 || score > 5)
      return res.status(400).json({ message: "Score must be between 1 and 5" });

    const [restaurant] = await pool.query(
      "SELECT id FROM restaurants WHERE id = ?", [id]
    );
    if (restaurant.length === 0)
      return res.status(404).json({ message: "Restaurant not found" });

    const userId = req.user ? req.user.id : null;

    // ← เพิ่ม image_url จากไฟล์ที่ upload
    const imageUrl = req.file
      ? `${process.env.BACKEND_URL || "http://localhost:5000"}/uploads/reviews/${req.file.filename}`
      : null;

    const [result] = await pool.query(
      "INSERT INTO ratings (user_id, restaurant_id, score, comment, image_url) VALUES (?, ?, ?, ?, ?)",
      [userId, id, score, comment || null, imageUrl]
    );

    const [updated] = await pool.query(
      `SELECT ROUND(AVG(score), 1) AS avg_rating, COUNT(id) AS rating_count
       FROM ratings WHERE restaurant_id = ?`, [id]
    );

    res.status(201).json({
      success: true,
      message: "Rating added successfully",
      rating_id: result.insertId,
      image_url: imageUrl,
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

export const deleteRating = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id))
      return res.status(400).json({ message: "Invalid rating ID" });

    const [result] = await pool.query("DELETE FROM ratings WHERE id = ?", [id]);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Rating not found" });

    res.json({ success: true, message: "Rating deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete rating" });
  }
};

// ← เพิ่ม: ดึง reviews ของร้านพร้อม user info
export const getRestaurantReviews = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id))
      return res.status(400).json({ message: "Invalid restaurant ID" });

    const [rows] = await pool.query(`
      SELECT 
        rt.id, rt.score, rt.comment, rt.image_url, rt.created_at,
        u.name AS user_name, u.picture AS user_picture
      FROM ratings rt
      LEFT JOIN users u ON rt.user_id = u.id
      WHERE rt.restaurant_id = ?
      ORDER BY rt.created_at DESC
      LIMIT 20
    `, [id]);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
};