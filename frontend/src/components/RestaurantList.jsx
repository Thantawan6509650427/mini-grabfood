import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRestaurants } from "../api/restaurant.api";
import "./RestaurantList.css";

// Debounce hook for search optimization
function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

export default function RestaurantList() {
  const navigate = useNavigate();

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("rating_desc");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  const debouncedSearch = useDebounce(search, 400);

  // Fetch restaurants
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getRestaurants(debouncedSearch, page, 6);
        setRestaurants(result.data);
        setPagination(result.pagination);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("ไม่สามารถโหลดข้อมูลร้านอาหารได้ กรุณาลองใหม่อีกครั้ง");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [debouncedSearch, page]);

  // Reset to page 1 when search changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  // Sort restaurants (client-side only, search is server-side)
  const sortedRestaurants = useMemo(() => {
    let result = [...restaurants];

    // Sort by rating or name
    if (sort === "rating_desc") {
      result.sort((a, b) => (b.avg_rating || 0) - (a.avg_rating || 0));
    } else if (sort === "rating_asc") {
      result.sort((a, b) => (a.avg_rating || 0) - (b.avg_rating || 0));
    } else if (sort === "name_asc") {
      result.sort((a, b) => a.name.localeCompare(b.name, 'th'));
    }

    return result;
  }, [restaurants, sort]);

  // Loading state
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

  // Error state
  if (error) {
    return (
      <div className="max-w-5xl mx-auto p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 text-lg mb-4">❌ {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
          >
            ลองใหม่อีกครั้ง
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      {/* Header with search and filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search input */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="🔍 ค้นหาร้านอาหาร..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sort dropdown */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 md:w-48 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="rating_desc">⭐ คะแนนสูง → ต่ำ</option>
            <option value="rating_asc">⭐ คะแนนต่ำ → สูง</option>
            <option value="name_asc">🔤 ชื่อ ก-ฮ</option>
          </select>
        </div>

        {/* Results count */}
        <div className="mt-3 text-sm text-gray-600">
          พบ {pagination.total} ร้านทั้งหมด
          {debouncedSearch && ` จากการค้นหา "${debouncedSearch}"`}
          {pagination.total > 0 && (
            <span> • แสดง {sortedRestaurants.length} รายการ (หน้าที่ {page}/{pagination.totalPages})</span>
          )}
        </div>
      </div>

      {/* Empty state */}
      {sortedRestaurants.length === 0 && !loading && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-xl text-gray-700 mb-2">ไม่พบร้านอาหารที่ค้นหา</p>
          <p className="text-sm text-gray-500">ลองเปลี่ยนคำค้นหาหรือล้างตัวกรองดูนะ</p>
          {search && (
            <button
              onClick={() => setSearch("")}
              className="mt-4 text-orange-500 hover:text-orange-600 underline"
            >
              ล้างการค้นหา
            </button>
          )}
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
                />
              ))}
            </div>
          </div>

          {/* Pagination controls */}
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
                .filter(
                  (p) =>
                    p === 1 ||
                    p === pagination.totalPages ||
                    (p >= page - 1 && p <= page + 1)
                )
                .map((p, idx, arr) => (
                  <div key={p}>
                    {idx > 0 && arr[idx - 1] !== p - 1 && (
                      <span className="text-gray-400">...</span>
                    )}
                    <button
                      onClick={() => setPage(p)}
                      className={`px-3 py-1 rounded-lg transition ${
                        p === page
                          ? "bg-orange-500 text-white font-semibold"
                          : "bg-white border border-gray-300 text-gray-700 hover:border-orange-500"
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

// Separate card component for better organization
function RestaurantCard({ restaurant, onClick }) {
  const { name, description, image_url, avg_rating, rating_count } = restaurant;

  return (
    <div onClick={onClick} className="restaurant-card">
      <img
        src={image_url || "/placeholder-restaurant.jpg"}
        alt={name}
        className="w-full h-48 object-cover"
        loading="lazy"
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
        }}
      />

      <div className="p-4">
        <h2 className="font-bold text-lg mb-2 line-clamp-1">{name}</h2>
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {description || "ไม่มีคำอธิบาย"}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-yellow-500">⭐</span>
            <span className="font-semibold">
              {avg_rating ? Number(avg_rating).toFixed(1) : "-"}
            </span>
          </div>
          <span className="text-xs text-gray-500">
            ({rating_count || 0} รีวิว)
          </span>
        </div>
      </div>
    </div>
  );
}