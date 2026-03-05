import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import PageLayout from '@/components/layout/PageLayout';

// Pages
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import DashboardPage from '@/pages/DashboardPage';
import AuctionsPage from '@/pages/AuctionsPage';
import AuctionDetailPage from '@/pages/AuctionDetailPage';
import MissionsPage from '@/pages/MissionsPage';
import InventoryPage from '@/pages/InventoryPage';
import RankingsPage from '@/pages/RankingsPage';
import ProfilePage from '@/pages/ProfilePage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function GuestRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      {/* Runas flotantes de fondo (del mockup) */}
      <div className="rune-bg">
        <span>⚔</span><span>🐉</span><span>✦</span><span>⚜</span><span>🗡</span><span>🛡</span>
      </div>

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

        {/* Protected routes with Layout */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <PageLayout>
              <DashboardPage />
            </PageLayout>
          </ProtectedRoute>
        } />
        <Route path="/auctions" element={
          <ProtectedRoute>
            <PageLayout>
              <AuctionsPage />
            </PageLayout>
          </ProtectedRoute>
        } />
        <Route path="/auctions/:id" element={
          <ProtectedRoute>
            <PageLayout>
              <AuctionDetailPage />
            </PageLayout>
          </ProtectedRoute>
        } />
        <Route path="/missions" element={
          <ProtectedRoute>
            <PageLayout>
              <MissionsPage />
            </PageLayout>
          </ProtectedRoute>
        } />
        <Route path="/inventory" element={
          <ProtectedRoute>
            <PageLayout>
              <InventoryPage />
            </PageLayout>
          </ProtectedRoute>
        } />
        <Route path="/inventory/:id" element={
          <ProtectedRoute>
            <PageLayout>
              <InventoryPage />
            </PageLayout>
          </ProtectedRoute>
        } />
        <Route path="/rankings" element={
          <ProtectedRoute>
            <PageLayout>
              <RankingsPage />
            </PageLayout>
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <PageLayout>
              <ProfilePage />
            </PageLayout>
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}