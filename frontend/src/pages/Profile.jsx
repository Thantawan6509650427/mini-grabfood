import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getFavorites, getUserStats, removeFavorite } from "../api/restaurant.api";
import ConfirmDialog from "../components/ConfirmDialog";

export default function Profile() {
  const navigate = useNavigate();
  const { user, loading, login } = useAuth();
  const [stats, setStats] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    restaurantId: null,
    restaurantName: ""
  });

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) { setPageLoading(false); return; }
      try {
        setPageLoading(true);
        setError(null);
        const [statsResponse, favoritesResponse] = await Promise.all([
          getUserStats(), getFavorites()
        ]);
        setStats(statsResponse);
        setFavorites(favoritesResponse);
      } catch (err) {
        setError("ไม่สามารถโหลดข้อมูลโปรไฟล์ได้ กรุณาลองอีกครั้ง");
      } finally {
        setPageLoading(false);
      }
    };
    loadProfile();
  }, [user]);

  const askRemoveFavorite = (restaurantId, restaurantName) => {
    setConfirmDialog({ isOpen: true, restaurantId, restaurantName });
  };

  const handleConfirmRemove = async () => {
    const { restaurantId } = confirmDialog;
    setConfirmDialog({ isOpen: false, restaurantId: null, restaurantName: "" });

    if (actionLoading) return;
    try {
      setActionLoading(true);
      await removeFavorite(restaurantId);
      setFavorites((current) => current.filter((item) => item.id !== restaurantId));
      setStats((prev) => ({
        ...prev,
        total_favorites: Math.max(0, (prev?.total_favorites || 0) - 1)
      }));
    } catch (err) {
      alert("ไม่สามารถยกเลิกร้านโปรดได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelRemove = () => {
    setConfirmDialog({ isOpen: false, restaurantId: null, restaurantName: "" });
  };

  if (loading || pageLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลดข้อมูลโปรไฟล์...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-lg text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">ยินดีต้อนรับสู่โปรไฟล์ของคุณ</h1>
          <p className="text-gray-600 mb-6">คุณต้องเข้าสู่ระบบก่อนจึงจะสามารถดูร้านโปรดและสถิติการให้คะแนนได้</p>
          <button onClick={login} className="bg-orange-500 text-white px-6 py-3 rounded-full hover:bg-orange-600 transition">
            เข้าสู่ระบบด้วย Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 pb-12">

      {/* ← เพิ่ม ConfirmDialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="ยกเลิกร้านโปรด?"
        message={`คุณต้องการนำ "${confirmDialog.restaurantName}" ออกจากร้านโปรดใช่ไหม?`}
        confirmText="ยกเลิกร้านโปรด"
        cancelText="ไม่ใช่"
        confirmColor="red"
        onConfirm={handleConfirmRemove}
        onCancel={handleCancelRemove}
      />

      <div className="bg-white rounded-3xl shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">สวัสดี, {user.name}</h1>
            <p className="text-sm text-gray-500 mt-1">{user.email}</p>
          </div>
          <button onClick={() => navigate('/')} className="text-orange-600 border border-orange-200 px-4 py-2 rounded-full hover:bg-orange-50 transition">
            กลับหน้าหลัก
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mb-6">{error}</div>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-8">
        <div className="bg-orange-50 p-6 rounded-3xl shadow-sm">
          <p className="text-sm text-orange-600">รีวิวทั้งหมด</p>
          <p className="text-4xl font-bold text-orange-700 mt-3">{stats?.total_ratings || 0}</p>
        </div>
        <div className="bg-amber-50 p-6 rounded-3xl shadow-sm">
          <p className="text-sm text-amber-700">ค่าเฉลี่ยคะแนนที่ให้</p>
          <p className="text-4xl font-bold text-amber-800 mt-3">
            {stats?.avg_score_given ? Number(stats.avg_score_given).toFixed(1) : "-"}
          </p>
        </div>
        <div className="bg-blue-50 p-6 rounded-3xl shadow-sm">
          <p className="text-sm text-blue-700">ร้านโปรด</p>
          <p className="text-4xl font-bold text-blue-800 mt-3">{stats?.total_favorites || 0}</p>
        </div>
        <div className="bg-green-50 p-6 rounded-3xl shadow-sm">
          <p className="text-sm text-green-700">ร้านที่ให้คะแนน</p>
          <p className="text-4xl font-bold text-green-800 mt-3">{stats?.unique_restaurants_rated || 0}</p>
        </div>
      </section>

      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">ร้านโปรดของฉัน</h2>
            <p className="text-sm text-gray-500">จัดการร้านที่คุณบันทึกไว้</p>
          </div>
        </div>

        {favorites.length > 0 ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {favorites.map((restaurant) => (
              <div key={restaurant.id} className="bg-white rounded-3xl shadow-sm overflow-hidden">
                <div className="relative h-48">
                  <img
                    src={restaurant.image_url || "https://via.placeholder.com/600x400?text=No+Image"}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = "https://via.placeholder.com/600x400?text=No+Image"; }}
                  />
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{restaurant.name}</h3>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{restaurant.description || "ไม่มีคำอธิบาย"}</p>
                    </div>
                    {/* ← เปลี่ยน onClick ให้เปิด dialog แทน */}
                    <button
                      onClick={() => askRemoveFavorite(restaurant.id, restaurant.name)}
                      disabled={actionLoading}
                      className="text-red-400 hover:text-red-600 text-sm border border-red-200 px-3 py-1 rounded-full hover:bg-red-50 transition"
                    >
                      ✕ ยกเลิก
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>คะแนนเฉลี่ย: {restaurant.avg_rating ? Number(restaurant.avg_rating).toFixed(1) : "-"}</span>
                    <span>รีวิว: {restaurant.rating_count || 0}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-sm p-8 text-center text-gray-600">
            <p>ยังไม่มีร้านโปรด ลองกดปุ่มหัวใจที่หน้าร้านเพื่อบันทึกร้านโปรดของคุณ</p>
          </div>
        )}
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-800">รีวิวล่าสุดของฉัน</h2>
          <p className="text-sm text-gray-500">ดูสรุปรีวิวล่าสุดของคุณ</p>
        </div>
        {stats?.recent_ratings?.length > 0 ? (
          <div className="space-y-4">
            {stats.recent_ratings.map((rating) => (
              <div key={`${rating.restaurant_id}-${rating.created_at}`} className="bg-white rounded-3xl shadow-sm p-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{rating.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{new Date(rating.created_at).toLocaleDateString('th-TH')}</p>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-orange-100 text-orange-700 px-3 py-1 text-sm font-medium">
                    คะแนน {rating.score}
                  </span>
                </div>
                <p className="mt-4 text-gray-600">{rating.comment || "ไม่มีความเห็นเพิ่มเติม"}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-sm p-8 text-center text-gray-600">
            <p>คุณยังไม่มีรีวิว ลองให้คะแนนร้านอาหารเพื่อดูสถิติของคุณ</p>
          </div>
        )}
      </section>
    </div>
  );
}