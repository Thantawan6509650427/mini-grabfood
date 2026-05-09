import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  getRestaurantById, addRating, getRestaurantReviews,
  getFavorites, addFavorite, removeFavorite
} from "../api/restaurant.api";
import StarRating from "./StarRating";
import ConfirmDialog from "./ConfirmDialog";

export default function RestaurantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, login } = useAuth();

  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [reviews, setReviews] = useState([]);

  // Rating form state
  const [selectedScore, setSelectedScore] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        setError(null);
        const [data, reviewData] = await Promise.all([
          getRestaurantById(id),
          getRestaurantReviews(id)
        ]);
        setRestaurant(data);
        setReviews(reviewData);
      } catch (err) {
        setError("ไม่สามารถโหลดข้อมูลร้านอาหารได้");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [id]);

  useEffect(() => {
    const loadFavoriteState = async () => {
      if (!user) { setIsFavorite(false); return; }
      try {
        const favorites = await getFavorites();
        setIsFavorite(favorites.some((item) => Number(item.id) === Number(id)));
      } catch (err) {
        console.error("Failed to load favorite state:", err);
      }
    };
    loadFavoriteState();
  }, [user, id]);

  const handleToggleFavorite = async () => {
    if (!user) { login(); return; }
    try {
      if (isFavorite) { await removeFavorite(id); setIsFavorite(false); }
      else { await addFavorite(id); setIsFavorite(true); }
    } catch (err) {
      alert("ไม่สามารถอัปเดตร้านโปรดได้");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("ขนาดรูปต้องไม่เกิน 5MB");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRate = (score) => {
    if (submitting) return;
    if (!user) { login(); return; }
    setSelectedScore(score);
  };

  const handleSubmitReview = () => {
    if (!selectedScore) {
      alert("กรุณาเลือกคะแนนก่อน");
      return;
    }
    setConfirmOpen(true);
  };

  const handleConfirmRate = async () => {
    setConfirmOpen(false);
    try {
      setSubmitting(true);
      setSubmitSuccess(false);
      await addRating(id, selectedScore, comment, imageFile);
      const [updatedData, updatedReviews] = await Promise.all([
        getRestaurantById(id),
        getRestaurantReviews(id)
      ]);
      setRestaurant(updatedData);
      setReviews(updatedReviews);
      setSubmitSuccess(true);
      setComment("");
      setImageFile(null);
      setImagePreview(null);
      setSelectedScore(0);
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (err) {
      alert("ไม่สามารถส่งรีวิวได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelRate = () => {
    setConfirmOpen(false);
    setPendingScore(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลดข้อมูลร้าน...</p>
        </div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">😢</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">ไม่พบร้านอาหาร</h2>
          <p className="text-gray-600 mb-6">{error || "ไม่พบร้านอาหารที่คุณกำลังมองหา"}</p>
          <button onClick={() => navigate("/")} className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition font-medium">
            ← กลับหน้าหลัก
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ConfirmDialog
        isOpen={confirmOpen}
        title="ยืนยันการส่งรีวิว"
        message={`ให้ ${selectedScore} ดาว⭐ กับ "${restaurant?.name}"${comment ? `\n\n"${comment}"` : ""}`}
        confirmText="ส่งรีวิว"
        cancelText="แก้ไข"
        confirmColor="orange"
        onConfirm={handleConfirmRate}
        onCancel={() => setConfirmOpen(false)}
      />

      {/* Back button */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition">
            <span className="text-xl">←</span>
            <span>กลับหน้าหลัก</span>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 py-8 space-y-6">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">

          {/* Header image */}
          <div className="relative h-64 md:h-96 bg-gray-200">
            <img
              src={restaurant.image_url || "https://via.placeholder.com/800x400?text=No+Image"}
              alt={restaurant.name}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = "https://via.placeholder.com/800x400?text=No+Image"; }}
            />
            <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg px-4 py-3 shadow-lg">
              <div className="flex flex-col gap-3 items-end">
                <button
                  onClick={handleToggleFavorite}
                  className={`rounded-full px-3 py-2 text-sm font-semibold transition ${isFavorite ? "bg-red-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                >
                  {isFavorite ? "♥ ร้านโปรดแล้ว" : "♡ เพิ่มในร้านโปรด"}
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-500 text-2xl">⭐</span>
                  <div>
                    <div className="font-bold text-2xl">
                      {restaurant.avg_rating ? Number(restaurant.avg_rating).toFixed(1) : "-"}
                    </div>
                    <div className="text-xs text-gray-600">{restaurant.rating_count || 0} รีวิว</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            {restaurant.category && (
              <span className="inline-block text-xs bg-orange-100 text-orange-600 px-3 py-1 rounded-full mb-3">
                {restaurant.category}
              </span>
            )}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{restaurant.name}</h1>

            {restaurant.opening_time && (
              <p className="text-sm text-gray-500 mb-4">
                🕐 เปิด {restaurant.opening_time?.slice(0, 5)} – {restaurant.closing_time?.slice(0, 5)} น.
              </p>
            )}

            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">เกี่ยวกับร้าน</h2>
              <p className="text-gray-600 leading-relaxed">{restaurant.description || "ไม่มีคำอธิบายสำหรับร้านนี้"}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-orange-50 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-orange-600">
                  {restaurant.avg_rating ? Number(restaurant.avg_rating).toFixed(1) : "-"}
                </div>
                <div className="text-sm text-gray-600 mt-1">คะแนนเฉลี่ย</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-blue-600">{restaurant.rating_count || 0}</div>
                <div className="text-sm text-gray-600 mt-1">จำนวนรีวิว</div>
              </div>
            </div>

            {/* Rating form */}
            <div className="border-t pt-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">เขียนรีวิว</h2>

              {submitSuccess && (
                <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
                  <span>✓</span><span>ส่งรีวิวสำเร็จ! ขอบคุณสำหรับความคิดเห็น</span>
                </div>
              )}

              {!user ? (
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <p className="text-gray-600 mb-3">เข้าสู่ระบบเพื่อเขียนรีวิว</p>
                  <button onClick={login} className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition">
                    เข้าสู่ระบบ
                  </button>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-6 space-y-4">

                  {/* Step 1 - เลือกดาว */}
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-3">
                      ขั้นที่ 1 — เลือกคะแนน <span className="text-red-500">*</span>
                    </p>
                    <div className="flex flex-col items-center gap-2 bg-white rounded-lg p-4 border border-gray-200">
                      <StarRating value={selectedScore} onRate={handleRate} disabled={submitting} />
                      <p className="text-sm text-gray-500">
                        {selectedScore === 0 && "คลิกดาวเพื่อเลือกคะแนน"}
                        {selectedScore === 1 && "😞 แย่มาก"}
                        {selectedScore === 2 && "😕 พอใช้"}
                        {selectedScore === 3 && "😊 ดี"}
                        {selectedScore === 4 && "😄 ดีมาก"}
                        {selectedScore === 5 && "🤩 ยอดเยี่ยม!"}
                      </p>
                    </div>
                  </div>

                  {/* Step 2 - comment */}
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">
                      ขั้นที่ 2 — เขียนความคิดเห็น <span className="text-gray-400">(ไม่บังคับ)</span>
                    </p>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="เล่าประสบการณ์ของคุณที่ร้านนี้..."
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                      disabled={submitting}
                    />
                  </div>

                  {/* Step 3 - รูป */}
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">
                      ขั้นที่ 3 — แนบรูปภาพ <span className="text-gray-400">(ไม่บังคับ, ไม่เกิน 5MB)</span>
                    </p>
                    <div className="flex items-start gap-4">
                      <label className="cursor-pointer flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-lg hover:border-orange-400 transition text-sm text-gray-600">
                        <span>📁 เลือกรูป</span>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handleImageChange}
                          className="hidden"
                          disabled={submitting}
                        />
                      </label>
                      {imagePreview && (
                        <div className="relative">
                          <img src={imagePreview} alt="preview" className="h-20 w-20 object-cover rounded-lg border" />
                          <button
                            onClick={() => { setImageFile(null); setImagePreview(null); }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                          >✕</button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ปุ่มส่ง */}
                  <button
                    onClick={handleSubmitReview}
                    disabled={submitting || selectedScore === 0}
                    className="w-full py-3 rounded-xl font-semibold text-white transition
                      bg-orange-500 hover:bg-orange-600
                      disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {submitting ? "กำลังส่งรีวิว..." : selectedScore === 0 ? "เลือกคะแนนก่อนส่ง" : `ส่งรีวิว ${selectedScore} ดาว ⭐`}
                  </button>

                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reviews list */}
        {reviews.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              รีวิวทั้งหมด ({reviews.length})
            </h2>
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border-b last:border-0 pb-6 last:pb-0">
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    {review.user_picture ? (
                      <img src={review.user_picture} alt={review.user_name} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                        {review.user_name ? review.user_name[0].toUpperCase() : "?"}
                      </div>
                    )}

                    <div className="flex-1">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div>
                          <p className="font-semibold text-gray-800">{review.user_name || "ผู้ใช้ไม่ระบุชื่อ"}</p>
                          <div className="flex items-center gap-1 mt-0.5">
                            {[1,2,3,4,5].map((s) => (
                              <span key={s} className={s <= review.score ? "text-yellow-500" : "text-gray-300"}>★</span>
                            ))}
                            <span className="text-sm text-gray-500 ml-1">{review.score}/5</span>
                          </div>
                        </div>
                        <span className="text-xs text-gray-400">
                          {new Date(review.created_at).toLocaleDateString("th-TH", {
                            year: "numeric", month: "long", day: "numeric"
                          })}
                        </span>
                      </div>

                      {review.comment && (
                        <p className="mt-2 text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                      )}

                      {review.image_url && (
                        <img
                          src={review.image_url}
                          alt="review"
                          className="mt-3 rounded-lg max-h-48 object-cover cursor-pointer hover:opacity-90 transition"
                          onClick={() => window.open(review.image_url, "_blank")}
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}