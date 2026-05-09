import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { updateUserProfile } from "../api/admin.api";

export default function ProfileSettings() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const fileRef = useRef();

  const [name, setName] = useState(user?.name || "");
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateUserProfile(name, file);
      await refreshUser();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const currentPicture = preview || user?.picture;

  return (
    <div className="max-w-lg mx-auto p-4 pb-12">
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">👤 ตั้งค่าโปรไฟล์</h1>
          <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-gray-700">
            ← กลับ
          </button>
        </div>

        {/* รูปโปรไฟล์ */}
        <div className="flex flex-col items-center mb-6">
          <div
            onClick={() => fileRef.current.click()}
            className="relative w-24 h-24 rounded-full cursor-pointer group"
          >
            {currentPicture ? (
              <img src={currentPicture} className="w-24 h-24 rounded-full object-cover" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-orange-100 flex items-center justify-center text-4xl font-bold text-orange-500">
                {user?.name?.[0]?.toUpperCase()}
              </div>
            )}
            <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
              <span className="text-white text-xs">เปลี่ยนรูป</span>
            </div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          <p className="text-xs text-gray-400 mt-2">คลิกที่รูปเพื่อเปลี่ยน</p>
        </div>

        {/* ชื่อ */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อแสดง</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Email (readonly) */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">อีเมล</label>
          <input
            type="text"
            value={user?.email || ""}
            disabled
            className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm bg-gray-50 text-gray-400"
          />
        </div>

        {success && (
          <div className="mb-4 bg-green-50 text-green-600 text-sm px-4 py-2 rounded-xl">
            ✅ บันทึกสำเร็จแล้ว
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-orange-500 text-white py-2 rounded-xl font-medium hover:bg-orange-600 transition disabled:opacity-50"
        >
          {saving ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
        </button>
      </div>
    </div>
  );
}