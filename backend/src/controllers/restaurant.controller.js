import pool from "../db.js";

export const getRestaurants = async (req, res) => {
  try {
    const { 
      search, 
      page = 1, 
      limit = 6,
      category,
      min_rating,
      open_now
    } = req.query;

    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 6));
    const offset = (pageNum - 1) * limitNum;

    const conditions = [];
    const params = [];

    // Search filter
    if (search && search.trim()) {
      conditions.push("(r.name LIKE ? OR r.description LIKE ?)");
      const searchPattern = `%${search.trim()}%`;
      params.push(searchPattern, searchPattern);
    }

    // Category filter
    if (category && category !== "ทั้งหมด") {
      conditions.push("r.category = ?");
      params.push(category);
    }

    // Open now filter
    if (open_now === "true") {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      conditions.push("(r.opening_time <= ? AND r.closing_time >= ?)");
      params.push(currentTime, currentTime);
    }

    const whereClause = conditions.length > 0 ? " WHERE " + conditions.join(" AND ") : "";

    // Count query
    const countSql = `SELECT COUNT(DISTINCT r.id) as total FROM restaurants r${whereClause}`;
    const [countResult] = await pool.query(countSql, params);
    const total = countResult[0].total;

    // Main query — min_rating filter ทำใน HAVING เพราะต้องการ AVG
    let sql = `
      SELECT 
        r.id, r.name, r.description, r.image_url, r.created_at,
        r.category, r.opening_time, r.closing_time,
        ROUND(AVG(rt.score), 1) AS avg_rating,
        COUNT(rt.id) AS rating_count
      FROM restaurants r
      LEFT JOIN ratings rt ON r.id = rt.restaurant_id
      ${whereClause}
      GROUP BY r.id, r.name, r.description, r.image_url, r.created_at, r.category, r.opening_time, r.closing_time
    `;

    const havingParams = [...params];
    if (min_rating && !isNaN(min_rating)) {
      sql += " HAVING avg_rating >= ? OR avg_rating IS NULL";
      havingParams.push(parseFloat(min_rating));
    }

    sql += " ORDER BY avg_rating DESC, r.name ASC";
    sql += " LIMIT ? OFFSET ?";
    havingParams.push(limitNum, offset);

    const [rows] = await pool.query(sql, havingParams);
    const totalPages = Math.ceil(total / limitNum);

    res.json({
      data: rows,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      }
    });
  } catch (err) {
    console.error("Error fetching restaurants:", err);
    res.status(500).json({ 
      message: "Failed to fetch restaurants",
      error: process.env.NODE_ENV === "development" ? err.message : undefined
    });
  }
};

// getRestaurantById — เพิ่ม category, opening_time, closing_time
export const getRestaurantById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) return res.status(400).json({ message: "Invalid restaurant ID" });

    const [rows] = await pool.query(`
      SELECT 
        r.id, r.name, r.description, r.image_url, r.created_at,
        r.category, r.opening_time, r.closing_time,
        ROUND(AVG(rt.score), 1) AS avg_rating,
        COUNT(rt.id) AS rating_count
      FROM restaurants r
      LEFT JOIN ratings rt ON r.id = rt.restaurant_id
      WHERE r.id = ?
      GROUP BY r.id, r.name, r.description, r.image_url, r.created_at, r.category, r.opening_time, r.closing_time
    `, [id]);

    if (rows.length === 0) return res.status(404).json({ message: "Restaurant not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error(`Error fetching restaurant ${req.params.id}:`, err);
    res.status(500).json({ message: "Failed to fetch restaurant" });
  }
};

export const getRestaurantRatings = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) return res.status(400).json({ message: "Invalid restaurant ID" });

    const [rows] = await pool.query(`
      SELECT id, score, comment, created_at
      FROM ratings WHERE restaurant_id = ?
      ORDER BY created_at DESC
    `, [id]);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch ratings" });
  }
};