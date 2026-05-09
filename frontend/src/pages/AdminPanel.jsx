import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  getDashboardStats, adminGetRestaurants, adminCreateRestaurant,
  adminUpdateRestaurant, adminDeleteRestaurant,
  adminGetUsers, adminToggleBan, adminToggleAdmin, adminDeleteReview
} from "../api/admin.api";
import ConfirmDialog from "../components/ConfirmDialog";

const CATEGORIES = ["อาหารไทย", "อาหารญี่ปุ่น", "อาหารตะวันตก", "ชาบู/บุฟเฟ่ต์"];
const TABS = ["📊 Dashboard", "🏪 ร้านอาหาร", "👤 ผู้ใช้"];

const emptyForm = {
  name: "", description: "", image_url: "",
  category: "อาหารไทย", opening_time: "08:00", closing_time: "20:00"
};

export default function AdminPanel() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [tab, setTab] = useState(0);
  const [pageLoading, setPageLoading] = useState(true);

  // Dashboard
  const [dashboard, setDashboard] = useState(null);

  // Restaurants
  const [restaurants, setRestaurants] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  // Users
  const [users, setUsers] = useState([]);

  // Confirm dialog
  const [confirm, setConfirm] = useState({ open: false, title: "", message: "", onConfirm: null });

  useEffect(() => {
    if (!loading && (!user || !user.is_admin)) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user?.is_admin) return;
    const load = async () => {
      setPageLoading(true);
      try {
        if (tab === 0) setDashboard(await getDashboardStats());
        else if (tab === 1) setRestaurants(await adminGetRestaurants());
        else if (tab === 2) setUsers(await adminGetUsers());
      } catch (err) {
        console.error(err);
      } finally {
        setPageLoading(false);
      }
    };
    load();
  }, [tab, user]);

  const askConfirm = (title, message, onConfirm) => {
    setConfirm({ open: true, title, message, onConfirm });
  };

  // ── Restaurant handlers ──
  const handleSaveRestaurant = async () => {
    try {
      if (editingId) {
        await adminUpdateRestaurant(editingId, form);
      } else {
        await adminCreateRestaurant(form);
      }
      setRestaurants(await adminGetRestaurants());
      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEditRestaurant = (r) => {
    setForm({
      name: r.name, description: r.description || "",
      image_url: r.image_url || "", category: r.category || "อาหารไทย",
      opening_time: r.opening_time?.slice(0, 5) || "08:00",
      closing_time: r.closing_time?.slice(0, 5) || "20:00"
    });
    setEditingId(r.id);
    setShowForm(true);
  };

  const handleDeleteRestaurant = (r) => {
    askConfirm(
      "ลบร้านอาหาร?",
      `คุณแน่ใจว่าต้องการลบ "${r.name}"? ข้อมูลรีวิวทั้งหมดจะหายไปด้วย`,
      async () => {
        await adminDeleteRestaurant(r.id);
        setRestaurants((prev) => prev.filter((x) => x.id !== r.id));
      }
    );
  };

  // ── User handlers ──
  const handleToggleBan = (u) => {
    askConfirm(
      u.is_banned ? "ยกเลิก Ban?" : "Ban ผู้ใช้?",
      `${u.is_banned ? "ยกเลิก ban" : "ban"} ${u.name} (${u.email})?`,
      async () => {
        const result = await adminToggleBan(u.id);
        setUsers((prev) => prev.map((x) => x.id === u.id ? { ...x, is_banned: result.is_banned } : x));
      }
    );
  };

  const handleToggleAdmin = (u) => {
    askConfirm(
      u.is_admin ? "ถอด Admin?" : "ตั้งเป็น Admin?",
      `${u.is_admin ? "ถอดสิทธิ์ admin จาก" : "ตั้ง"} ${u.name} เป็น admin?`,
      async () => {
        const result = await adminToggleAdmin(u.id);
        setUsers((prev) => prev.map((x) => x.id === u.id ? { ...x, is_admin: result.is_admin } : x));
      }
    );
  };

  if (loading || pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!user?.is_admin) return null;

  return (
    <div className="max-w-6xl mx-auto p-4 pb-12">
      <ConfirmDialog
        isOpen={confirm.open}
        title={confirm.title}
        message={confirm.message}
        confirmText="ยืนยัน"
        cancelText="ยกเลิก"
        confirmColor="red"
        onConfirm={async () => {
          setConfirm((c) => ({ ...c, open: false }));
          await confirm.onConfirm?.();
        }}
        onCancel={() => setConfirm((c) => ({ ...c, open: false }))}
      />

      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">🛠️ Admin Panel</h1>
          <p className="text-sm text-gray-500 mt-1">สวัสดี, {user.name}</p>
        </div>
        <button onClick={() => navigate("/")} className="text-orange-600 border border-orange-200 px-4 py-2 rounded-full hover:bg-orange-50 transition text-sm">
          กลับหน้าหลัก
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-white rounded-xl shadow-sm p-2">
        {TABS.map((t, i) => (
          <button
            key={i}
            onClick={() => setTab(i)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
              tab === i ? "bg-orange-500 text-white" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ── Dashboard Tab ── */}
      {tab === 0 && dashboard && (
        <div className="space-y-6">
          {/* Stats cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "ร้านอาหาร", value: dashboard.stats.total_restaurants, color: "orange", icon: "🏪" },
              { label: "ผู้ใช้", value: dashboard.stats.total_users, color: "blue", icon: "👤" },
              { label: "รีวิว", value: dashboard.stats.total_ratings, color: "green", icon: "⭐" },
              { label: "ร้านโปรด", value: dashboard.stats.total_favorites, color: "red", icon: "♥" },
            ].map((s) => (
              <div key={s.label} className={`bg-${s.color}-50 rounded-2xl p-5 shadow-sm`}>
                <p className="text-2xl mb-1">{s.icon}</p>
                <p className={`text-3xl font-bold text-${s.color}-600`}>{s.value}</p>
                <p className={`text-sm text-${s.color}-500 mt-1`}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Top restaurants */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">🏆 ร้านยอดนิยม (รีวิวมากสุด)</h2>
            <div className="space-y-3">
              {dashboard.topRestaurants.map((r, i) => (
                <div key={r.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-gray-300">#{i + 1}</span>
                    <div>
                      <p className="font-semibold text-gray-800">{r.name}</p>
                      <p className="text-xs text-gray-400">{r.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-orange-600">⭐ {r.avg_rating || "-"}</p>
                    <p className="text-xs text-gray-400">{r.rating_count} รีวิว</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent users */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">🆕 ผู้ใช้ล่าสุด</h2>
            <div className="space-y-3">
              {dashboard.recentUsers.map((u) => (
                <div key={u.id} className="flex items-center gap-3 py-2 border-b last:border-0">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm">
                    {u.name?.[0]?.toUpperCase() || "?"}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 text-sm">{u.name}</p>
                    <p className="text-xs text-gray-400">{u.email}</p>
                  </div>
                  <div className="flex gap-1">
                    {!!u.is_admin && <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">Admin</span>}
                    {!!u.is_banned && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Banned</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Restaurants Tab ── */}
      {tab === 1 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-gray-600 text-sm">ทั้งหมด {restaurants.length} ร้าน</p>
            <button
              onClick={() => { setForm(emptyForm); setEditingId(null); setShowForm(true); }}
              className="bg-orange-500 text-white px-4 py-2 rounded-xl text-sm hover:bg-orange-600 transition"
            >
              + เพิ่มร้านใหม่
            </button>
          </div>

          {/* Form */}
          {showForm && (
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-orange-100">
              <h3 className="font-bold text-gray-800 mb-4">{editingId ? "✏️ แก้ไขร้าน" : "➕ เพิ่มร้านใหม่"}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: "ชื่อร้าน *", key: "name", type: "text" },
                  { label: "URL รูปภาพ", key: "image_url", type: "text" },
                  { label: "เวลาเปิด", key: "opening_time", type: "time" },
                  { label: "เวลาปิด", key: "closing_time", type: "time" },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                    <input
                      type={f.type}
                      value={form[f.key]}
                      onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                ))}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ประเภท</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">คำอธิบาย</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                    rows={2}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-4 justify-end">
                <button onClick={() => { setShowForm(false); setEditingId(null); }} className="px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">
                  ยกเลิก
                </button>
                <button onClick={handleSaveRestaurant} className="px-4 py-2 bg-orange-500 text-white rounded-xl text-sm hover:bg-orange-600">
                  {editingId ? "บันทึกการแก้ไข" : "เพิ่มร้าน"}
                </button>
              </div>
            </div>
          )}

          {/* Restaurant list */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-4 py-3 text-left">ร้าน</th>
                  <th className="px-4 py-3 text-left hidden md:table-cell">ประเภท</th>
                  <th className="px-4 py-3 text-center hidden md:table-cell">⭐</th>
                  <th className="px-4 py-3 text-center hidden md:table-cell">รีวิว</th>
                  <th className="px-4 py-3 text-center">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {restaurants.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={r.image_url || "https://via.placeholder.com/40"}
                          className="w-10 h-10 rounded-lg object-cover"
                          onError={(e) => { e.target.src = "https://via.placeholder.com/40"; }}
                        />
                        <div>
                          <p className="font-medium text-gray-800">{r.name}</p>
                          <p className="text-xs text-gray-400">{r.opening_time?.slice(0,5)}–{r.closing_time?.slice(0,5)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="bg-orange-100 text-orange-600 text-xs px-2 py-0.5 rounded-full">{r.category}</span>
                    </td>
                    <td className="px-4 py-3 text-center hidden md:table-cell font-semibold text-orange-600">
                      {r.avg_rating || "-"}
                    </td>
                    <td className="px-4 py-3 text-center hidden md:table-cell text-gray-600">
                      {r.rating_count}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2 justify-center">
                        <button onClick={() => handleEditRestaurant(r)} className="text-blue-500 hover:text-blue-700 text-xs border border-blue-200 px-2 py-1 rounded-lg">
                          ✏️ แก้ไข
                        </button>
                        <button onClick={() => handleDeleteRestaurant(r)} className="text-red-500 hover:text-red-700 text-xs border border-red-200 px-2 py-1 rounded-lg">
                          🗑️ ลบ
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Users Tab ── */}
      {tab === 2 && (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 text-sm text-gray-600">ทั้งหมด {users.length} ผู้ใช้</div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left">ผู้ใช้</th>
                <th className="px-4 py-3 text-center hidden md:table-cell">รีวิว</th>
                <th className="px-4 py-3 text-center hidden md:table-cell">โปรด</th>
                <th className="px-4 py-3 text-center">สถานะ</th>
                <th className="px-4 py-3 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((u) => (
                <tr key={u.id} className={`hover:bg-gray-50 ${u.is_banned ? "bg-red-50" : ""}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {u.picture ? (
                        <img src={u.picture} className="w-9 h-9 rounded-full object-cover" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                          {u.name?.[0]?.toUpperCase() || "?"}
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-800">{u.name}</p>
                        <p className="text-xs text-gray-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center hidden md:table-cell text-gray-600">{u.total_ratings}</td>
                  <td className="px-4 py-3 text-center hidden md:table-cell text-gray-600">{u.total_favorites}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex gap-1 justify-center flex-wrap">
                        {!!u.is_admin && <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">Admin</span>}
                        {!!u.is_banned && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Banned</span>}
                        {!u.is_admin && !u.is_banned && <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">ปกติ</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 justify-center flex-wrap">
                      <button
                        onClick={() => handleToggleBan(u)}
                        disabled={u.id === user.id}
                        className={`text-xs px-2 py-1 rounded-lg border transition disabled:opacity-30 ${
                          u.is_banned
                            ? "text-green-600 border-green-200 hover:bg-green-50"
                            : "text-red-500 border-red-200 hover:bg-red-50"
                        }`}
                      >
                        {u.is_banned ? "✅ Unban" : "🚫 Ban"}
                      </button>
                      <button
                        onClick={() => handleToggleAdmin(u)}
                        disabled={u.id === user.id}
                        className={`text-xs px-2 py-1 rounded-lg border transition disabled:opacity-30 ${
                          u.is_admin
                            ? "text-gray-500 border-gray-200 hover:bg-gray-50"
                            : "text-purple-600 border-purple-200 hover:bg-purple-50"
                        }`}
                      >
                        {u.is_admin ? "👤 ถอด Admin" : "⚡ ตั้ง Admin"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}