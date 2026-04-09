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
import ItemDetailPage from '@/pages/ItemDetailPage';
import RankingsPage from '@/pages/RankingsPage';
import ProfilePage from '@/pages/ProfilePage';
import ShopPage from '@/pages/ShopPage';
import AdminPage from '@/pages/AdminPage'; // 👈 Importar AdminPage

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
        {/* Rutas públicas — sin Navbar */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
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

        {/* Inventario — branch 4: lista + detalle con Rating */}
        <Route
          path="/inventory"
          element={<ProtectedRoute><WithNavbar><InventoryPage /></WithNavbar></ProtectedRoute>}
        />
        <Route
          path="/inventory/:id"
          element={<ProtectedRoute><WithNavbar><ItemDetailPage /></WithNavbar></ProtectedRoute>}
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

        {/* 👇 Ruta de administración - PROTEGIDA y CON NAVBAR */}
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

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}