import { Routes, Route } from "react-router-dom";
import RestaurantList from "./components/RestaurantList";
import RestaurantDetail from "./components/RestaurantDetail";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Centered */}
      <header className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col items-center justify-center gap-3 text-center">
            <div>
              <h1 className="text-3xl font-bold">🍽️ Mini GrabFood</h1>
              <p className="text-sm text-green-100 mt-1">ค้นหาร้านอาหารและให้คะแนน</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="pb-8">
        <Routes>
          <Route path="/" element={<RestaurantList />} />
          <Route path="/restaurants/:id" element={<RestaurantDetail />} />
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
  );
}

export default App;