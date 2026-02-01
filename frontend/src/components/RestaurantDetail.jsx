import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRestaurantById, addRating } from "../api/restaurant.api";
import StarRating from "./StarRating";

export default function RestaurantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Fetch restaurant details
  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getRestaurantById(id);
        setRestaurant(data);
      } catch (err) {
        console.error("Failed to fetch restaurant:", err);
        setError("ไม่สามารถโหลดข้อมูลร้านอาหารได้");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id]);

  // Handle rating submission
  const handleRate = async (score) => {
    if (submitting) return;

    try {
      setSubmitting(true);
      setSubmitSuccess(false);
      
      await addRating(id, score);
      
      // Refresh restaurant data to get updated rating
      const updatedData = await getRestaurantById(id);
      setRestaurant(updatedData);
      
      setSubmitSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to submit rating:", err);
      alert("ไม่สามารถส่งคะแนนได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
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

  // Error state
  if (error || !restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">😢</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">ไม่พบร้านอาหาร</h2>
          <p className="text-gray-600 mb-6">
            {error || "ไม่พบร้านอาหารที่คุณกำลังมองหา"}
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition font-medium"
          >
            ← กลับหน้าหลัก
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back button */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition"
          >
            <span className="text-xl">←</span>
            <span>กลับหน้าหลัก</span>
          </button>
        </div>
      </div>

      {/* Restaurant details */}
      <div className="max-w-4xl mx-auto p-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header image */}
          <div className="relative h-64 md:h-96 bg-gray-200">
            <img
              src={restaurant.image_url || "https://via.placeholder.com/800x400?text=No+Image"}
              alt={restaurant.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/800x400?text=No+Image";
              }}
            />
            {/* Rating overlay */}
            <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg">
              <div className="flex items-center gap-2">
                <span className="text-yellow-500 text-2xl">⭐</span>
                <div>
                  <div className="font-bold text-2xl">
                    {restaurant.avg_rating ? Number(restaurant.avg_rating).toFixed(1) : "-"}
                  </div>
                  <div className="text-xs text-gray-600">
                    {restaurant.rating_count || 0} รีวิว
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            {/* Restaurant name */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {restaurant.name}
            </h1>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">เกี่ยวกับร้าน</h2>
              <p className="text-gray-600 leading-relaxed">
                {restaurant.description || "ไม่มีคำอธิบายสำหรับร้านนี้"}
              </p>
            </div>

            {/* Rating section */}
            <div className="border-t pt-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">ให้คะแนนร้านนี้</h2>
              
              {submitSuccess && (
                <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
                  <span>✓</span>
                  <span>ส่งคะแนนสำเร็จ! ขอบคุณสำหรับรีวิว</span>
                </div>
              )}

              <div className="flex flex-col items-center gap-4 bg-gray-50 rounded-lg p-6">
                <p className="text-gray-700">คลิกเลือกคะแนนที่คุณต้องการให้</p>
                
                <StarRating
                  value={0}
                  onRate={handleRate}
                />
                
                {submitting && (
                  <p className="text-sm text-gray-500">กำลังส่งคะแนน...</p>
                )}
                
                <p className="text-xs text-gray-500 text-center max-w-md">
                  คะแนนของคุณจะช่วยให้ผู้อื่นตัดสินใจเลือกร้านได้ดีขึ้น
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="bg-orange-50 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-orange-600">
                  {restaurant.avg_rating ? Number(restaurant.avg_rating).toFixed(1) : "-"}
                </div>
                <div className="text-sm text-gray-600 mt-1">คะแนนเฉลี่ย</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {restaurant.rating_count || 0}
                </div>
                <div className="text-sm text-gray-600 mt-1">จำนวนรีวิว</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}