import pool from "../db.js";

// ── Dashboard Stats ──────────────────────────────────
export const getDashboardStats = async (req, res) => {
  try {
    const [[{ total_restaurants }]] = await pool.query("SELECT COUNT(*) AS total_restaurants FROM restaurants");
    const [[{ total_users }]] = await pool.query("SELECT COUNT(*) AS total_users FROM users");
    const [[{ total_ratings }]] = await pool.query("SELECT COUNT(*) AS total_ratings FROM ratings");
    const [[{ total_favorites }]] = await pool.query("SELECT COUNT(*) AS total_favorites FROM favorites");

    const [topRestaurants] = await pool.query(`
      SELECT r.id, r.name, r.category,
             ROUND(AVG(rt.score), 1) AS avg_rating,
             COUNT(rt.id) AS rating_count
      FROM restaurants r
      LEFT JOIN ratings rt ON r.id = rt.restaurant_id
      GROUP BY r.id, r.name, r.category
      ORDER BY rating_count DESC
      LIMIT 5
    `);

    const [recentUsers] = await pool.query(`
      SELECT id, name, email, created_at, is_admin, is_banned
      FROM users ORDER BY created_at DESC LIMIT 5
    `);

    res.json({
      stats: { total_restaurants, total_users, total_ratings, total_favorites },
      topRestaurants,
      recentUsers
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
};

// ── Restaurant Management ────────────────────────────
export const adminGetRestaurants = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT r.id, r.name, r.description, r.image_url, r.category,
             r.opening_time, r.closing_time, r.created_at,
             ROUND(AVG(rt.score), 1) AS avg_rating,
             COUNT(rt.id) AS rating_count
      FROM restaurants r
      LEFT JOIN ratings rt ON r.id = rt.restaurant_id
      GROUP BY r.id
      ORDER BY r.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch restaurants" });
  }
};

export const adminCreateRestaurant = async (req, res) => {
  try {
    const { name, description, image_url, category, opening_time, closing_time } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });

    const [result] = await pool.query(
      `INSERT INTO restaurants (name, description, image_url, category, opening_time, closing_time)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, description || null, image_url || null,
       category || "อาหารไทย", opening_time || "08:00", closing_time || "20:00"]
    );
    res.status(201).json({ success: true, id: result.insertId, message: "Restaurant created" });
  } catch (err) {
    res.status(500).json({ message: "Failed to create restaurant" });
  }
};

export const adminUpdateRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, image_url, category, opening_time, closing_time } = req.body;

    const [result] = await pool.query(
      `UPDATE restaurants SET name=?, description=?, image_url=?,
       category=?, opening_time=?, closing_time=?, updated_at=NOW()
       WHERE id=?`,
      [name, description || null, image_url || null,
       category, opening_time, closing_time, id]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Restaurant not found" });

    res.json({ success: true, message: "Restaurant updated" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update restaurant" });
  }
};

export const adminDeleteRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query("DELETE FROM restaurants WHERE id=?", [id]);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Restaurant not found" });
    res.json({ success: true, message: "Restaurant deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete restaurant" });
  }
};

// ── User Management ──────────────────────────────────
export const adminGetUsers = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT u.id, u.name, u.email, u.picture, u.is_admin, u.is_banned,
             u.created_at, u.last_login,
             COUNT(DISTINCT r.id) AS total_ratings,
             COUNT(DISTINCT f.id) AS total_favorites
      FROM users u
      LEFT JOIN ratings r ON u.id = r.user_id
      LEFT JOIN favorites f ON u.id = f.user_id
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

export const adminToggleBan = async (req, res) => {
  try {
    const { id } = req.params;
    if (Number(id) === req.user.id)
      return res.status(400).json({ message: "Cannot ban yourself" });

    const [[user]] = await pool.query("SELECT is_banned FROM users WHERE id=?", [id]);
    if (!user) return res.status(404).json({ message: "User not found" });

    const newStatus = !user.is_banned;
    await pool.query("UPDATE users SET is_banned=? WHERE id=?", [newStatus, id]);
    res.json({ success: true, is_banned: newStatus });
  } catch (err) {
    res.status(500).json({ message: "Failed to update ban status" });
  }
};

export const adminToggleAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    if (Number(id) === req.user.id)
      return res.status(400).json({ message: "Cannot change your own admin status" });

    const [[user]] = await pool.query("SELECT is_admin FROM users WHERE id=?", [id]);
    if (!user) return res.status(404).json({ message: "User not found" });

    const newStatus = !user.is_admin;
    await pool.query("UPDATE users SET is_admin=? WHERE id=?", [newStatus, id]);
    res.json({ success: true, is_admin: newStatus });
  } catch (err) {
    res.status(500).json({ message: "Failed to update admin status" });
  }
};

// ── Review Management ────────────────────────────────
export const adminDeleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query("DELETE FROM ratings WHERE id=?", [id]);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Review not found" });
    res.json({ success: true, message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete review" });
  }
};