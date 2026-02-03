import { Navigate, Route, Routes } from "react-router-dom";
import { AdminShell } from "../features/admin/shell/ui/AdminShell";
import { UsersPage } from "../features/admin/users/ui/UsersPage";

// Nếu bạn đã có trang login/forgot thì mở import này lên và thêm routes tương ứng
// import { LoginPage } from "../features/auth/ui/LoginPage";
// import { ForgotPasswordPage } from "../features/auth/ui/ForgotPasswordPage";

function Placeholder({ title, desc }: { title: string; desc?: string }) {
  return (
    <div className="rounded-2xl border border-gray-100 p-5">
      <div className="font-semibold">{title}</div>
      <div className="text-sm text-gray-500 mt-1">
        {desc || "Trang đang được phát triển..."}
      </div>
    </div>
  );
}

export function AppRoutes() {
  return (
    <Routes>
      {/* Trang mặc định */}
      <Route path="/" element={<Navigate to="/admin/users" replace />} />

      {/* Admin layout + nested pages */}
      <Route path="/admin" element={<AdminShell />}>
        <Route index element={<Navigate to="/admin/users" replace />} />
        <Route path="users" element={<UsersPage embedded />} />
        <Route
          path="roles"
          element={<Placeholder title="Vai trò & phân quyền" desc="Quản lý role/permission" />}
        />
        <Route
          path="departments"
          element={<Placeholder title="Phòng ban" desc="CRUD phòng ban" />}
        />
        <Route
          path="titles"
          element={<Placeholder title="Chức vụ" desc="CRUD chức vụ/chức danh" />}
        />
        <Route
          path="settings"
          element={<Placeholder title="Cài đặt hệ thống" desc="Cấu hình chung" />}
        />
      </Route>

      {/* Auth (tuỳ bạn bật) */}
      {/*
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      */}

      {/* Not found */}
      <Route path="*" element={<Navigate to="/admin/users" replace />} />
    </Routes>
  );
}
