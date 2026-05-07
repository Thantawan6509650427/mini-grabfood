import pool from "../db.js";

// Get all restaurants with search and ratings (with pagination)
export const getRestaurants = async (req, res) => {
  try {
    const { search, page = 1, limit = 6 } = req.query;
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 6));
    const offset = (pageNum - 1) * limitNum;

    let countSql = "SELECT COUNT(DISTINCT r.id) as total FROM restaurants r";
    let sql = `
      SELECT 
        r.id,
        r.name,
        r.description,
        r.image_url,
        r.created_at,
        ROUND(AVG(rt.score), 1) AS avg_rating,
        COUNT(rt.id) AS rating_count
      FROM restaurants r
      LEFT JOIN ratings rt ON r.id = rt.restaurant_id
    `;
    const params = [];

    if (search && search.trim()) {
      const whereClause = " WHERE r.name LIKE ? OR r.description LIKE ?";
      countSql += whereClause;
      sql += whereClause;
      const searchPattern = `%${search.trim()}%`;
      params.push(searchPattern, searchPattern);
    }

    sql += " GROUP BY r.id, r.name, r.description, r.image_url, r.created_at";
    sql += " ORDER BY avg_rating DESC, r.name ASC";
    sql += " LIMIT ? OFFSET ?";

    // Get total count
    const [countResult] = await pool.query(countSql, params.slice(0, search ? 2 : 0));
    const total = countResult[0].total;

    // Get paginated results
    const [rows] = await pool.query(sql, [...params, limitNum, offset]);
    
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

// Get single restaurant by ID with ratings
export const getRestaurantById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Invalid restaurant ID" });
    }

    const sql = `
      SELECT 
        r.id,
        r.name,
        r.description,
        r.image_url,
        r.created_at,
        ROUND(AVG(rt.score), 1) AS avg_rating,
        COUNT(rt.id) AS rating_count
      FROM restaurants r
      LEFT JOIN ratings rt ON r.id = rt.restaurant_id
      WHERE r.id = ?
      GROUP BY r.id, r.name, r.description, r.image_url, r.created_at
    `;

    const [rows] = await pool.query(sql, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(`Error fetching restaurant ${req.params.id}:`, err);
    res.status(500).json({ 
      message: "Failed to fetch restaurant",
      error: process.env.NODE_ENV === "development" ? err.message : undefined
    });
  }
};

// Get restaurant ratings history (optional - for future use)
export const getRestaurantRatings = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Invalid restaurant ID" });
    }

    const sql = `
      SELECT 
        id,
        score,
        comment,
        created_at
      FROM ratings
      WHERE restaurant_id = ?
      ORDER BY created_at DESC
    `;

    const [rows] = await pool.query(sql, [id]);
    res.json(rows);
  } catch (err) {
    console.error(`Error fetching ratings for restaurant ${req.params.id}:`, err);
    res.status(500).json({ 
      message: "Failed to fetch ratings",
      error: process.env.NODE_ENV === "development" ? err.message : undefined
    });
  }
};