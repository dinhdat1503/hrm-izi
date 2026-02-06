// src/app/layouts/AdminShell.tsx
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/useAuth";
import { useTheme } from "../../shared/theme/ThemeProvider";

type NavItem = { to: string; label: string; icon?: string };

const items: NavItem[] = [
  { to: "/admin/users", label: "Quản lý người dùng", icon: "👤" },
  { to: "/admin/roles", label: "Quản lý vai trò", icon: "🛡️" },
  { to: "/admin/settings", label: "Cài đặt hệ thống", icon: "⚙️" },
  { to: "/account", label: "Tài khoản cá nhân", icon: "🙍" },
];

function cx(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(" ");
}

export function AdminShell() {
  const { state, logout } = useAuth();
  const nav = useNavigate();
  const { theme, toggle } = useTheme();

  const onLogout = () => {
    logout();
    nav("/login", { replace: true });
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="flex min-h-screen w-full">
        {/* SIDEBAR */}
        <aside
          className={cx(
            "w-[280px] shrink-0 border-r px-4 py-5",
            "bg-white/80 border-slate-200/70 backdrop-blur",
            "dark:bg-slate-950/60 dark:border-slate-800"
          )}
        >
          {/* Brand + toggle */}
          <div className="mb-5 flex items-start justify-between gap-3">
            <div>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Quản trị
              </div>
              <div className="text-lg font-semibold tracking-tight">Hệ thống</div>
            </div>

            <button
              type="button"
              onClick={toggle}
              className={cx(
                "shrink-0 rounded-xl border px-3 py-2 text-xs font-medium",
                "border-slate-200 bg-white hover:bg-slate-50",
                "dark:border-slate-800 dark:bg-slate-900/40 dark:hover:bg-slate-900"
              )}
              title="Bật/Tắt giao diện"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
          </div>

          {/* User card */}
          <div
            className={cx(
              "mb-5 rounded-2xl border p-3",
              "border-slate-200/70 bg-white",
              "dark:border-slate-800 dark:bg-slate-900/40"
            )}
          >
            <div className="text-sm font-semibold">
              {state.user?.fullName || "Admin"}
            </div>
            <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              {state.user?.email || "-"}
            </div>

            <div className="mt-2">
              <span
                className={cx(
                  "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium",
                  "border-slate-200 bg-slate-50 text-slate-700",
                  "dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200"
                )}
              >
                {state.user?.role || "ADMIN"}
              </span>
            </div>
          </div>

          {/* Nav */}
          <nav className="space-y-1">
            {items.map((it) => (
              <NavLink
                key={it.to}
                to={it.to}
                end={it.to === "/admin/users"}
                className={({ isActive }) =>
                  cx(
                    "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition",
                    isActive
                      ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                      : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900/60"
                  )
                }
              >
                <span className="text-base">{it.icon}</span>
                <span>{it.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Logout */}
          <div className="mt-6">
            <button
              type="button"
              onClick={onLogout}
              className={cx(
                "w-full rounded-2xl border px-4 py-2 text-sm font-semibold",
                "border-slate-200 bg-white hover:bg-slate-50",
                "dark:border-slate-800 dark:bg-slate-900/30 dark:hover:bg-slate-900"
              )}
            >
              Đăng xuất
            </button>
          </div>
        </aside>

        {/* MAIN */}
        <main className="flex-1 min-w-0 p-6 overflow-auto">
          {/* Nền “nhẹ” để giống kiểu hệ thống */}
          <div
            className={cx(
              "min-h-[calc(100vh-48px)] rounded-3xl border shadow-sm",
              "border-slate-200/70 bg-white",
              "dark:border-slate-800 dark:bg-slate-900/35"
            )}
          >
            <div className="p-6">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
