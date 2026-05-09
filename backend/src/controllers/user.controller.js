import pool from "../db.js";

export const getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const [ratingStats] = await pool.query(`
      SELECT COUNT(*) AS total_ratings,
             ROUND(AVG(score), 1) AS avg_score_given,
             COUNT(DISTINCT restaurant_id) AS unique_restaurants_rated
      FROM ratings WHERE user_id = ?
    `, [userId]);

    const [favoriteStats] = await pool.query(
      "SELECT COUNT(*) AS total_favorites FROM favorites WHERE user_id = ?",
      [userId]
    );

    const [recentRatings] = await pool.query(`
      SELECT r.id AS restaurant_id, r.name, r.image_url,
             rt.score, rt.comment, rt.created_at
      FROM ratings rt
      JOIN restaurants r ON rt.restaurant_id = r.id
      WHERE rt.user_id = ?
      ORDER BY rt.created_at DESC LIMIT 6
    `, [userId]);

    res.json({
      total_ratings: ratingStats[0].total_ratings || 0,
      avg_score_given: ratingStats[0].avg_score_given || 0,
      unique_restaurants_rated: ratingStats[0].unique_restaurants_rated || 0,
      total_favorites: favoriteStats[0].total_favorites || 0,
      recent_ratings: recentRatings
    });
  } catch (err) {
    console.error("Error fetching user stats:", err);
    res.status(500).json({ message: "Failed to fetch user statistics", error: err.message });
  }
};