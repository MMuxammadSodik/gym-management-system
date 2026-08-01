import { Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import Members from "./pages/members/Members";
import MemberDetail from "./pages/member/MemberDetail";
import MembershipPlans from "./pages/MembershipPlans/MembershipPlans";
import Products from "./pages/Products/Products";
import Staff from "./pages/Staff/Staff";
import NotFound from "./pages/NotFound";
import SinglePurchase from "./pages/single-purchase/SinglePurchase";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute/AdminRoute";
import PublicRoute from "./components/PublicRoute";
import AdminLayout from "./layouts/AdminLayout/AdminLayout";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />

          <Route path="members" element={<Members />} />

          <Route path="member/:id" element={<MemberDetail />} />

          <Route path="membership-plans" element={<MembershipPlans />} />

          <Route path="products" element={<Products />} />
          <Route path="/dashboard/single-purchase" element={<SinglePurchase />} />

          <Route
            path="staff"
            element={
              <AdminRoute>
                <Staff />
              </AdminRoute>
            }
          />

        </Route>
      </Route>
        <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
