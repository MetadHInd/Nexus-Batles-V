// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

// Layout
import Navbar from '@/components/Navbar';

// Pages
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import DashboardPage from '@/pages/DashboardPage';
import AuctionsPage from '@/pages/AuctionsPage';
import AuctionDetailPage from '@/pages/AuctionDetailPage';
import MissionsPage from '@/pages/MissionsPage';
import InventoryPage from '@/pages/InventoryPage';
import MyInventoryPage from '@/pages/MyInventoryPage';
import CreateItemPage from '@/pages/CreateItemPage';
import ItemDetailPage from '@/pages/ItemDetailPage';
import RankingsPage from '@/pages/RankingsPage';
import ProfilePage from '@/pages/ProfilePage';
import ShopPage from '@/pages/ShopPage';
import AdminPage from '@/pages/AdminPage';
import AdminProductsPage from '@/pages/AdminProductsPage'; // ✅ Agregar
import HomePage from '@/pages/HomePage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function GuestRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" replace />;
}

function WithNavbar({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      {/* Runas flotantes de fondo */}
      <div className="rune-bg">
        <span>⚔</span><span>🐉</span><span>✦</span><span>⚜</span><span>🗡</span><span>🛡</span>
      </div>

      <Routes>
        {/* Ruta pública principal - HomePage */}
        <Route path="/" element={<HomePage />} />
        
        {/* Rutas públicas — sin Navbar */}
        <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

        {/* Rutas protegidas — con Navbar */}
        <Route
          path="/dashboard"
          element={<ProtectedRoute><WithNavbar><DashboardPage /></WithNavbar></ProtectedRoute>}
        />
        <Route
          path="/auctions"
          element={<ProtectedRoute><WithNavbar><AuctionsPage /></WithNavbar></ProtectedRoute>}
        />
        <Route
          path="/auctions/:id"
          element={<ProtectedRoute><WithNavbar><AuctionDetailPage /></WithNavbar></ProtectedRoute>}
        />
        <Route
          path="/missions"
          element={<ProtectedRoute><WithNavbar><MissionsPage /></WithNavbar></ProtectedRoute>}
        />

        {/* Inventario global */}
        <Route
          path="/inventory"
          element={<ProtectedRoute><WithNavbar><InventoryPage /></WithNavbar></ProtectedRoute>}
        />
        <Route
          path="/inventory/:id"
          element={<ProtectedRoute><WithNavbar><ItemDetailPage /></WithNavbar></ProtectedRoute>}
        />
        {/* Inventario personal del jugador */}
        <Route
          path="/my-inventory"
          element={<ProtectedRoute><WithNavbar><MyInventoryPage /></WithNavbar></ProtectedRoute>}
        />
        {/* Crear carta — solo ADMIN */}
        <Route
          path="/create-item"
          element={<ProtectedRoute><WithNavbar><CreateItemPage /></WithNavbar></ProtectedRoute>}
        />

        <Route
          path="/rankings"
          element={<ProtectedRoute><WithNavbar><RankingsPage /></WithNavbar></ProtectedRoute>}
        />
        <Route
          path="/profile"
          element={<ProtectedRoute><WithNavbar><ProfilePage /></WithNavbar></ProtectedRoute>}
        />
        <Route
          path="/shop"
          element={<ProtectedRoute><WithNavbar><ShopPage /></WithNavbar></ProtectedRoute>}
        />

        {/* Ruta de administración de Héroes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <WithNavbar>
                <AdminPage />
              </WithNavbar>
            </ProtectedRoute>
          }
        />

        {/* ✅ Ruta de administración de Productos Premium */}
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute>
              <WithNavbar>
                <AdminProductsPage />
              </WithNavbar>
            </ProtectedRoute>
          }
        />

        {/* 404 - Redirigir a HomePage */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}