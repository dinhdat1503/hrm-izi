import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Button } from "../../shared/ui/Button";
import { useAuth } from "../../features/auth/useAuth";

const items = [
  { to: "/admin/users", label: "Quản lý người dùng" },
  { to: "/admin/roles", label: "Quản lý vai trò" },
  { to: "/admin/settings", label: "Cài đặt hệ thống" },
  { to: "/account", label: "Tài khoản cá nhân" },
];

export function AdminShell() {
  const { state, logout } = useAuth();
  const nav = useNavigate();

  const onLogout = () => {
    logout();
    nav("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex min-h-[650px]">
            {/* Sidebar */}
            <aside className="w-[260px] border-r border-gray-100 p-4">
              <div className="mb-4">
                <div className="text-sm text-gray-500">Quản trị</div>
                <div className="text-lg font-semibold">Hệ thống</div>
              </div>

              <div className="mb-4 rounded-xl bg-gray-50 border border-gray-100 p-3">
                <div className="text-sm font-medium">{state.user?.fullName || "Admin"}</div>
                <div className="text-xs text-gray-500">{state.user?.email}</div>
                <div className="mt-2">
                  <span className="inline-flex rounded-full border border-gray-200 bg-white px-2 py-0.5 text-xs">
                    {state.user?.role || "ADMIN"}
                  </span>
                </div>
              </div>

              <nav className="space-y-1">
                {items.map((it) => (
                  <NavLink
                    key={it.to}
                    to={it.to}
                    className={({ isActive }) =>
                      [
                        "block rounded-xl px-3 py-2 text-sm transition",
                        isActive ? "bg-gray-900 text-white" : "hover:bg-gray-100 text-gray-700",
                      ].join(" ")
                    }
                    end={it.to === "/admin/users"}
                  >
                    {it.label}
                  </NavLink>
                ))}
              </nav>

              <div className="mt-6">
                <Button variant="ghost" className="w-full" onClick={onLogout}>
                  Đăng xuất
                </Button>
              </div>
            </aside>

            {/* Content */}
            <main className="flex-1 p-6">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
