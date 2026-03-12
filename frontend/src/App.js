"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = App;
var react_router_dom_1 = require("react-router-dom");
var authStore_1 = require("@/store/authStore");
// Pages (team implements these)
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
function ProtectedRoute(_a) {
    var children = _a.children;
    var isAuthenticated = (0, authStore_1.useAuthStore)(function (s) { return s.isAuthenticated; });
    return isAuthenticated ? <>{children}</> : <react_router_dom_1.Navigate to="/login" replace/>;
}
function GuestRoute(_a) {
    var children = _a.children;
    var isAuthenticated = (0, authStore_1.useAuthStore)(function (s) { return s.isAuthenticated; });
    return !isAuthenticated ? <>{children}</> : <react_router_dom_1.Navigate to="/dashboard" replace/>;
}
function App() {
    return (<react_router_dom_1.BrowserRouter>
      <react_router_dom_1.Routes>
        {/* Public routes */}
        <react_router_dom_1.Route path="/" element={<react_router_dom_1.Navigate to="/dashboard" replace/>}/>
        <react_router_dom_1.Route path="/login" element={<GuestRoute><LoginPage_1.default /></GuestRoute>}/>
        <react_router_dom_1.Route path="/register" element={<GuestRoute><RegisterPage_1.default /></GuestRoute>}/>

        {/* Protected routes */}
        <react_router_dom_1.Route path="/dashboard" element={<ProtectedRoute><DashboardPage_1.default /></ProtectedRoute>}/>
        <react_router_dom_1.Route path="/auctions" element={<ProtectedRoute><AuctionsPage_1.default /></ProtectedRoute>}/>
        <react_router_dom_1.Route path="/auctions/:id" element={<ProtectedRoute><AuctionDetailPage_1.default /></ProtectedRoute>}/>
        <react_router_dom_1.Route path="/missions" element={<ProtectedRoute><MissionsPage_1.default /></ProtectedRoute>}/>
        <react_router_dom_1.Route path="/inventory" element={<ProtectedRoute><InventoryPage_1.default /></ProtectedRoute>}/>
        <react_router_dom_1.Route path="/rankings" element={<ProtectedRoute><RankingsPage_1.default /></ProtectedRoute>}/>
        <react_router_dom_1.Route path="/profile" element={<ProtectedRoute><ProfilePage_1.default /></ProtectedRoute>}/>
        <react_router_dom_1.Route path="/shop" element={<ProtectedRoute><ShopPage_1.default /></ProtectedRoute>}/>

        <react_router_dom_1.Route path="*" element={<react_router_dom_1.Navigate to="/dashboard" replace/>}/>
      </react_router_dom_1.Routes>
    </react_router_dom_1.BrowserRouter>);
}
