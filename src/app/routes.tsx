import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { useAuth } from "../features/auth/useAuth";
import { LoginPage } from "../features/auth/ui/LoginPage";
import { ForgotPasswordPage } from "../features/auth/ui/ForgotPasswordPage";
import { AdminShell } from "./layouts/AdminShell";
import { UsersPage } from "../features/admin/users/ui/UsersPage";
import { AccountPage } from "../features/account/ui/AccountPage";

function RequireAuth() {
  const { state } = useAuth();
  const loc = useLocation();
  if (state.loading) return null;
  if (!state.isAuthed) return <Navigate to="/login" replace state={{ from: loc }} />;
  return <Outlet />;
}

function RequireAdmin() {
  const { state } = useAuth();
  if (!state.user) return <Navigate to="/login" replace />;
  if (state.user.role !== "ADMIN") return <Navigate to="/account" replace />;
  return <Outlet />;
}

function Placeholder({ title, desc }: { title: string; desc?: string }) {
  return (
    <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
      <div className="text-xl font-semibold">{title}</div>
      <div className="text-sm text-gray-500 mt-1">{desc || "Chưa triển khai (placeholder)"}</div>
    </div>
  );
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      <Route element={<RequireAuth />}>
        <Route path="/account" element={<AccountPage />} />

        <Route element={<RequireAdmin />}>
          <Route path="/admin" element={<AdminShell />}>
            <Route path="users" element={<UsersPage />} />
            <Route path="roles" element={<Placeholder title="Quản lý vai trò" />} />
            <Route path="settings" element={<Placeholder title="Cài đặt hệ thống" />} />
            <Route index element={<Navigate to="/admin/users" replace />} />
          </Route>
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/admin/users" replace />} />
      <Route path="*" element={<Navigate to="/admin/users" replace />} />
    </Routes>
  );
}
