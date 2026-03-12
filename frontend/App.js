"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = App;
/**
 * App.tsx — Punto de entrada React con React Router v6
 *
 * CAMBIOS vs versión anterior:
 *   1. MainLayout envuelve TODAS las rutas protegidas vía <Outlet>
 *   2. ChatbotBubble vive dentro del MainLayout (aparece en todas las páginas)
 *   3. playerStore se hidrata desde MainLayout.useEffect (no desde aquí)
 *   4. Rutas públicas (login/register) NO tienen sidebar/chatbot
 */
require("@/styles/globals.css");
var react_router_dom_1 = require("react-router-dom");
var authStore_1 = require("@/store/authStore");
var MainLayout_1 = require("@/layouts/MainLayout");
// Páginas
var LoginPage_1 = require("@/pages/LoginPage");
var RegisterPage_1 = require("@/pages/RegisterPage");
var DashboardPage_1 = require("@/pages/DashboardPage");
var AuctionsPage_1 = require("@/pages/AuctionsPage");
var AuctionDetailPage_1 = require("@/pages/AuctionDetailPage");
var MissionsPage_1 = require("@/pages/MissionsPage");
var InventoryPage_1 = require("@/pages/InventoryPage");
var RankingsPage_1 = require("@/pages/RankingsPage");
var ProfilePage_1 = require("@/pages/ProfilePage");
var ShopPage_1 = require("@/pages/ShopPage");
/** Ruta protegida: redirige a /login si no hay sesión */
function ProtectedRoute(_a) {
    var children = _a.children;
    var isAuthenticated = (0, authStore_1.useAuthStore)(function (s) { return s.isAuthenticated; });
    return isAuthenticated ? <>{children}</> : <react_router_dom_1.Navigate to="/login" replace/>;
}
/** Ruta pública: redirige al dashboard si ya hay sesión */
function GuestRoute(_a) {
    var children = _a.children;
    var isAuthenticated = (0, authStore_1.useAuthStore)(function (s) { return s.isAuthenticated; });
    return !isAuthenticated ? <>{children}</> : <react_router_dom_1.Navigate to="/dashboard" replace/>;
}
function App() {
    return (<react_router_dom_1.BrowserRouter>
      <react_router_dom_1.Routes>
        {/* ── Rutas públicas (sin layout) ─────────────────── */}
        <react_router_dom_1.Route path="/login" element={<GuestRoute><LoginPage_1.default /></GuestRoute>}/>
        <react_router_dom_1.Route path="/register" element={<GuestRoute><RegisterPage_1.default /></GuestRoute>}/>

        {/* ── Rutas protegidas (con MainLayout) ───────────── */}
        {/*
          MainLayout contiene: Navbar + Sidebar + <Outlet> + ChatbotBubble
          Todas las páginas hijas se renderizan en el <Outlet>
        */}
        <react_router_dom_1.Route element={<ProtectedRoute>
              <MainLayout_1.MainLayout />
            </ProtectedRoute>}>
          <react_router_dom_1.Route index element={<react_router_dom_1.Navigate to="/dashboard" replace/>}/>
          <react_router_dom_1.Route path="/dashboard" element={<DashboardPage_1.default />}/>
          <react_router_dom_1.Route path="/shop" element={<ShopPage_1.default />}/>
          <react_router_dom_1.Route path="/auctions" element={<AuctionsPage_1.default />}/>
          <react_router_dom_1.Route path="/auctions/:id" element={<AuctionDetailPage_1.default />}/>
          <react_router_dom_1.Route path="/missions" element={<MissionsPage_1.default />}/>
          <react_router_dom_1.Route path="/inventory" element={<InventoryPage_1.default />}/>
          <react_router_dom_1.Route path="/rankings" element={<RankingsPage_1.default />}/>
          <react_router_dom_1.Route path="/profile" element={<ProfilePage_1.default />}/>
        </react_router_dom_1.Route>

        {/* ── Fallback ─────────────────────────────────────── */}
        <react_router_dom_1.Route path="*" element={<react_router_dom_1.Navigate to="/dashboard" replace/>}/>
      </react_router_dom_1.Routes>
    </react_router_dom_1.BrowserRouter>);
}
