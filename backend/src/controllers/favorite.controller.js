import pool from "../db.js";

export const getFavorites = async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await pool.query(`
      SELECT r.id, r.name, r.description, r.image_url, r.created_at,
             ROUND(AVG(rt.score), 1) AS avg_rating,
             COUNT(rt.id) AS rating_count,
             f.created_at AS favorited_at
      FROM favorites f
      JOIN restaurants r ON f.restaurant_id = r.id
      LEFT JOIN ratings rt ON r.id = rt.restaurant_id
      WHERE f.user_id = ?
      GROUP BY r.id, r.name, r.description, r.image_url, r.created_at, f.created_at
      ORDER BY f.created_at DESC
    `, [userId]);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching favorites:", err);
    res.status(500).json({ message: "Failed to fetch favorites", error: err.message });
  }
};

export const addFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const [restaurant] = await pool.query("SELECT id FROM restaurants WHERE id = ?", [id]);
    if (restaurant.length === 0)
      return res.status(404).json({ message: "Restaurant not found" });

    const [existing] = await pool.query(
      "SELECT id FROM favorites WHERE user_id = ? AND restaurant_id = ?",
      [userId, id]
    );
    if (existing.length > 0)
      return res.status(400).json({ message: "Restaurant already in favorites" });

    await pool.query(
      "INSERT INTO favorites (user_id, restaurant_id) VALUES (?, ?)",
      [userId, id]
    );
    res.status(201).json({ success: true, message: "Added to favorites" });
  } catch (err) {
    console.error("Error adding favorite:", err);
    res.status(500).json({ message: "Failed to add favorite", error: err.message });
  }
};

export const removeFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const [result] = await pool.query(
      "DELETE FROM favorites WHERE user_id = ? AND restaurant_id = ?",
      [userId, id]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Favorite not found" });

    res.json({ success: true, message: "Removed from favorites" });
  } catch (err) {
    console.error("Error removing favorite:", err);
    res.status(500).json({ message: "Failed to remove favorite", error: err.message });
  }
};