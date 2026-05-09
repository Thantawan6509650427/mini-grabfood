import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getRestaurants, getFavorites, addFavorite, removeFavorite } from "../api/restaurant.api";
import "./RestaurantList.css";

function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

const CATEGORIES = ["ทั้งหมด", "อาหารไทย", "อาหารญี่ปุ่น", "อาหารตะวันตก", "ชาบู/บุฟเฟ่ต์"];

export default function RestaurantList() {
  const navigate = useNavigate();
  const { user, login } = useAuth();

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("rating_desc");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 0, hasNextPage: false, hasPrevPage: false });
  const [favoriteIds, setFavoriteIds] = useState([]);

  // Filter state
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: "ทั้งหมด",
    min_rating: "",
    open_now: false
  });

  const debouncedSearch = useDebounce(search, 400);
  const activeFilterCount = [
    filters.category !== "ทั้งหมด",
    filters.min_rating !== "",
    filters.open_now
  ].filter(Boolean).length;

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getRestaurants(debouncedSearch, page, 6, filters);
        setRestaurants(result.data);
        setPagination(result.pagination);
      } catch (err) {
        setError("ไม่สามารถโหลดข้อมูลร้านอาหารได้ กรุณาลองใหม่อีกครั้ง");
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, [debouncedSearch, page, filters]);

  useEffect(() => { setPage(1); }, [debouncedSearch, filters]);

  useEffect(() => {
    const loadFavorites = async () => {
      if (!user) { setFavoriteIds([]); return; }
      try {
        const favs = await getFavorites();
        setFavoriteIds(favs.map((item) => item.id));
      } catch (err) {
        console.error("Failed to load favorites:", err);
      }
    };
    loadFavorites();
  }, [user]);

  const sortedRestaurants = useMemo(() => {
    const result = [...restaurants];
    if (sort === "rating_desc") result.sort((a, b) => (b.avg_rating || 0) - (a.avg_rating || 0));
    else if (sort === "rating_asc") result.sort((a, b) => (a.avg_rating || 0) - (b.avg_rating || 0));
    else if (sort === "name_asc") result.sort((a, b) => a.name.localeCompare(b.name, "th"));
    return result;
  }, [restaurants, sort]);

  const toggleFavorite = async (restaurantId) => {
    if (!user) { login(); return; }
    const isFavorited = favoriteIds.includes(restaurantId);
    try {
      if (isFavorited) {
        await removeFavorite(restaurantId);
        setFavoriteIds((curr) => curr.filter((id) => id !== restaurantId));
      } else {
        await addFavorite(restaurantId);
        setFavoriteIds((curr) => [...curr, restaurantId]);
      }
    } catch (err) {
      alert("ไม่สามารถอัปเดตร้านโปรดได้");
    }
  };

  const resetFilters = () => {
    setFilters({ category: "ทั้งหมด", min_rating: "", open_now: false });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลดร้านอาหาร... 🍳</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 text-lg mb-4">❌ {error}</p>
          <button onClick={() => window.location.reload()} className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition">
            ลองใหม่อีกครั้ง
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4">

      {/* Search + Sort + Filter button */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="🔍 ค้นหาร้านอาหาร..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">✕</button>
            )}
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 md:w-48 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="rating_desc">⭐ คะแนนสูง → ต่ำ</option>
            <option value="rating_asc">⭐ คะแนนต่ำ → สูง</option>
            <option value="name_asc">🔤 ชื่อ ก-ฮ</option>
          </select>

          {/* Filter toggle button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`relative flex items-center gap-2 px-4 py-2 rounded-lg border transition ${
              showFilters || activeFilterCount > 0
                ? "bg-orange-500 text-white border-orange-500"
                : "border-gray-300 text-gray-700 hover:border-orange-400"
            }`}
          >
            <span>🎛️ ตัวกรอง</span>
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Results count */}
        <div className="mt-3 text-sm text-gray-600 flex items-center justify-between">
          <span>
            พบ {pagination.total} ร้านทั้งหมด
            {debouncedSearch && ` จากการค้นหา "${debouncedSearch}"`}
            {pagination.total > 0 && ` • แสดง ${sortedRestaurants.length} รายการ (หน้าที่ ${page}/${pagination.totalPages})`}
          </span>
          {activeFilterCount > 0 && (
            <button onClick={resetFilters} className="text-orange-500 hover:text-orange-600 text-sm underline">
              ล้างตัวกรอง ({activeFilterCount})
            </button>
          )}
        </div>
      </div>

      {/* Advanced Filter Panel */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4 border border-orange-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Category filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">🍽️ ประเภทอาหาร</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilters((prev) => ({ ...prev, category: cat }))}
                    className={`px-3 py-1 rounded-full text-sm transition ${
                      filters.category === cat
                        ? "bg-orange-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-orange-100"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Min rating filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ⭐ คะแนนขั้นต่ำ: {filters.min_rating || "ทั้งหมด"}
              </label>
              <input
                type="range"
                min="0"
                max="5"
                step="0.5"
                value={filters.min_rating || 0}
                onChange={(e) => setFilters((prev) => ({
                  ...prev,
                  min_rating: e.target.value === "0" ? "" : e.target.value
                }))}
                className="w-full accent-orange-500"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>ทั้งหมด</span>
                <span>5 ดาว</span>
              </div>
            </div>

            {/* Open now filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">🕐 เวลาเปิด</label>
              <button
                onClick={() => setFilters((prev) => ({ ...prev, open_now: !prev.open_now }))}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg border transition w-full ${
                  filters.open_now
                    ? "bg-green-500 text-white border-green-500"
                    : "border-gray-300 text-gray-700 hover:border-green-400"
                }`}
              >
                <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  filters.open_now ? "bg-white border-white" : "border-gray-400"
                }`}>
                  {filters.open_now && <span className="text-green-500 text-xs font-bold">✓</span>}
                </span>
                <span className="text-sm font-medium">
                  {filters.open_now ? "✅ เปิดอยู่ตอนนี้" : "เปิดอยู่ตอนนี้"}
                </span>
              </button>
              <p className="text-xs text-gray-400 mt-1">
                เวลาปัจจุบัน: {new Date().toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" })} น.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {sortedRestaurants.length === 0 && !loading && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-xl text-gray-700 mb-2">ไม่พบร้านอาหารที่ตรงกับเงื่อนไข</p>
          <p className="text-sm text-gray-500">ลองเปลี่ยนคำค้นหาหรือล้างตัวกรองดูนะ</p>
          <button onClick={() => { setSearch(""); resetFilters(); }} className="mt-4 text-orange-500 hover:text-orange-600 underline">
            ล้างทั้งหมด
          </button>
        </div>
      )}

      {/* Restaurant grid */}
      {sortedRestaurants.length > 0 && (
        <>
          <div className="restaurant-container">
            <div className="restaurant-grid">
              {sortedRestaurants.map((restaurant) => (
                <RestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                  onClick={() => navigate(`/restaurants/${restaurant.id}`)}
                  isFavorite={favoriteIds.includes(restaurant.id)}
                  toggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2 mt-8 mb-6">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={!pagination.hasPrevPage}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
            >
              ← ก่อนหน้า
            </button>
            <div className="flex items-center gap-2">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === pagination.totalPages || (p >= page - 1 && p <= page + 1))
                .map((p, idx, arr) => (
                  <div key={p}>
                    {idx > 0 && arr[idx - 1] !== p - 1 && <span className="text-gray-400">...</span>}
                    <button
                      onClick={() => setPage(p)}
                      className={`px-3 py-1 rounded-lg transition ${
                        p === page ? "bg-orange-500 text-white font-semibold" : "bg-white border border-gray-300 text-gray-700 hover:border-orange-500"
                      }`}
                    >
                      {p}
                    </button>
                  </div>
                ))}
            </div>
            <button
              onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
              disabled={!pagination.hasNextPage}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
            >
              ถัดไป →
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// RestaurantCard — เพิ่ม category + เวลาเปิด
function RestaurantCard({ restaurant, onClick, isFavorite, toggleFavorite }) {
  const { id, name, description, image_url, avg_rating, rating_count, category, opening_time, closing_time } = restaurant;

  const formatTime = (time) => {
    if (!time) return "-";
    return time.slice(0, 5); // "08:00:00" → "08:00"
  };

  const isOpenNow = () => {
    if (!opening_time || !closing_time) return null;
    const now = new Date();
    const current = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    return current >= opening_time.slice(0, 5) && current <= closing_time.slice(0, 5);
  };

  const openStatus = isOpenNow();

  return (
    <div onClick={onClick} className="restaurant-card cursor-pointer">
      <div className="relative">
        <img
          src={image_url || "/placeholder-restaurant.jpg"}
          alt={name}
          className="w-full h-48 object-cover"
          loading="lazy"
          onError={(e) => { e.target.src = "https://via.placeholder.com/400x300?text=No+Image"; }}
        />
        {/* Favorite button */}
        <button
          onClick={(e) => { e.stopPropagation(); toggleFavorite(id); }}
          className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-full w-8 h-8 flex items-center justify-center shadow hover:scale-110 transition"
        >
          {isFavorite ? "♥" : "♡"}
        </button>
        {/* Open/Closed badge */}
        {openStatus !== null && (
          <span className={`absolute top-2 left-2 text-xs font-semibold px-2 py-1 rounded-full ${
            openStatus ? "bg-green-500 text-white" : "bg-gray-500 text-white"
          }`}>
            {openStatus ? "🟢 เปิด" : "🔴 ปิด"}
          </span>
        )}
      </div>

      <div className="p-4">
        {/* Category tag */}
        {category && (
          <span className="inline-block text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full mb-2">
            {category}
          </span>
        )}

        <h2 className="font-bold text-lg mb-1 line-clamp-1">{name}</h2>
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{description || "ไม่มีคำอธิบาย"}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-yellow-500">⭐</span>
            <span className="font-semibold">{avg_rating ? Number(avg_rating).toFixed(1) : "-"}</span>
            <span className="text-xs text-gray-500">({rating_count || 0})</span>
          </div>
          <span className="text-xs text-gray-400">
            🕐 {formatTime(opening_time)}–{formatTime(closing_time)}
          </span>
        </div>
      </div>
    </div>
  );
}