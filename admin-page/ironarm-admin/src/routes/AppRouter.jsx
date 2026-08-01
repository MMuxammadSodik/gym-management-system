import { Routes, Route } from "react-router-dom";

import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";

import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import NotFound from "../pages/NotFound";
import Members from "../pages/members/Members";
import SinglePurchase from "../pages/single-purchase/SinglePurchase";
import MembershipPlans from "../pages/MembershipPlans/MembershipPlans";

function AppRouter() {
    return (
        <Routes>

            <Route element={<AuthLayout />}>
                <Route index element={<Login />} />
            </Route>

            <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dashboard/members" element={<Members />} />
                <Route path="/dashboard/single-purchase" element={<SinglePurchase />} />
                <Route path="/dashboard/membership-plans" element={<MembershipPlans />} />
            </Route>

            <Route path="*" element={<NotFound />} />

        </Routes>
    );
}

export default AppRouter;