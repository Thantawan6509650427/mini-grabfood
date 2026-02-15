import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get("token");
      
      if (token) {
        // บันทึก token
        localStorage.setItem("token", token);
        
        // รอให้ token บันทึกเสร็จ
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Refresh user data
        await refreshUser();
        
        // Redirect ไปหน้าหลัก
        navigate("/", { replace: true });
      } else {
        // ถ้าไม่มี token (login failed)
        alert("เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
        navigate("/", { replace: true });
      }
    };

    handleCallback();
  }, [searchParams, navigate, refreshUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-yellow-50">
      <div className="text-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-orange-500 mx-auto mb-6"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-3xl">🔐</div>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          กำลังเข้าสู่ระบบ...
        </h2>
        <p className="text-gray-600">
          กรุณารอสักครู่
        </p>
      </div>
    </div>
  );
}