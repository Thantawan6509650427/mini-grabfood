import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import RestaurantList from "./components/RestaurantList";
import RestaurantDetail from "./components/RestaurantDetail";
import AuthCallback from "./pages/AuthCallback";
import Profile from "./pages/Profile";
import Header from "./components/Header";
import AdminPanel from "./pages/AdminPanel";
import ProfileSettings from "./pages/ProfileSettings";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          {/* Header with Auth */}
          <Header />

          {/* Main content */}
          <main className="flex-1 pb-8">
            <Routes>
              <Route path="/" element={<RestaurantList />} />
              <Route path="/restaurants/:id" element={<RestaurantDetail />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/profile/settings" element={<ProfileSettings />} />
            </Routes>
          </main>

          {/* Footer */}
          <footer className="bg-gray-800 text-gray-300 mt-auto">
            <div className="max-w-7xl mx-auto px-4 py-6 text-center">
              <p className="text-sm">
                © 2026 Mini GrabFood - Made with ❤️ and React
              </p>
            </div>
          </footer>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;