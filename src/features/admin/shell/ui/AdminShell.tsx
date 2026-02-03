import { useMemo, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";

type NavItem = {
  label: string;
  to: string;
  desc?: string;
};

const NAV: NavItem[] = [
  { label: "Quản lý người dùng", to: "/admin/users", desc: "CRUD người dùng" },
  { label: "Vai trò & phân quyền", to: "/admin/roles", desc: "Role/Permission" },
  { label: "Phòng ban", to: "/admin/departments", desc: "Quản lý phòng ban" },
  { label: "Chức vụ", to: "/admin/titles", desc: "Chức danh/chức vụ" },
  { label: "Cài đặt hệ thống", to: "/admin/settings", desc: "Cấu hình chung" },
];

function cx(...arr: Array<string | false | undefined | null>) {
  return arr.filter(Boolean).join(" ");
}

export function AdminShell() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  const pageTitle = useMemo(() => {
    const hit = NAV.find((x) => pathname.startsWith(x.to));
    return hit?.label || "Quản trị hệ thống";
  }, [pathname]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile topbar */}
      <div className="md:hidden sticky top-0 z-40 bg-white border-b border-gray-100">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="font-semibold">IZIHRM Admin</div>
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="rounded-xl border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50"
          >
            Menu
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-[280px] bg-white border-r border-gray-100 shadow-xl">
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 py-6 md:py-8">
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-[280px_1fr]">
            {/* Sidebar desktop */}
            <aside className="hidden md:block border-r border-gray-100">
              <Sidebar />
            </aside>

            {/* Content */}
            <main className="p-5 md:p-6">
              {/* Header content area */}
              <div className="mb-5 flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs text-gray-500">Quản trị</div>
                  <h1 className="text-lg md:text-xl font-semibold">{pageTitle}</h1>
                </div>

                {/* Bạn có thể gắn nút đăng xuất ở đây nếu muốn */}
                {/* <button className="rounded-xl border border-gray-200 px-4 py-2 text-sm hover:bg-gray-50">Đăng xuất</button> */}
              </div>

              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="p-5">
      <div className="mb-5">
        <div className="text-sm font-semibold">IZIHRM Admin</div>
        <div className="text-xs text-gray-500 mt-1">Bảng điều khiển hệ thống</div>
      </div>

      <div className="space-y-1">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              cx(
                "block rounded-xl px-3 py-2 transition",
                isActive ? "bg-gray-900 text-white" : "hover:bg-gray-50 text-gray-800"
              )
            }
          >
            <div className="text-sm font-medium">{item.label}</div>
            {item.desc && (
              <div className={cx("text-xs", "opacity-80")}>{item.desc}</div>
            )}
          </NavLink>
        ))}
      </div>

      <div className="mt-6 pt-5 border-t border-gray-100 text-xs text-gray-500">
        <div>Version: dev</div>
      </div>
    </div>
  );
}
