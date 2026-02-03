import { useState } from "react";
import { useAccount } from "../hooks/useAccount";
import { ProfileTab } from "./tabs/ProfileTab";
import { SecurityTab } from "./tabs/SecurityTab";
import { NotificationsTab } from "./tabs/NotificationsTab";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";


type TabKey = "profile" | "security" | "notify";

export function AccountPage() {
  const { account, state, updateProfile, changePassword } = useAccount();
  const nav = useNavigate();
const { logout } = useAuth();

  const [tab, setTab] = useState<TabKey>("profile");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h1 className="text-xl font-semibold">Tài khoản cá nhân</h1>
            <p className="text-sm text-gray-500">Quản lý hồ sơ, bảo mật và thông báo</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4">
            <aside className="p-4 border-b md:border-b-0 md:border-r border-gray-100">
              <nav className="space-y-1">
                <TabButton active={tab === "profile"} onClick={() => setTab("profile")}>Hồ sơ</TabButton>
                <TabButton active={tab === "security"} onClick={() => setTab("security")}>Bảo mật</TabButton>
                <TabButton active={tab === "notify"} onClick={() => setTab("notify")}>Thông báo</TabButton>
              </nav>

              {state.error && (
                <div className="mt-4 rounded-xl bg-red-50 text-red-700 text-sm p-3">
                  {state.error}
                </div>
              )}

              {state.ok && (
                <div className="mt-4 rounded-xl bg-green-50 text-green-700 text-sm p-3">
                  {state.ok}
                </div>
              )}
            </aside>

            <main className="p-6 md:col-span-3">
              {state.loading && (
                <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-600">Đang tải...</div>
              )}

              {!state.loading && account && (
                <>
                  {tab === "profile" && (
                    <ProfileTab account={account.value} onSave={updateProfile} />
                  )}
                  {tab === "security" && (
                    <SecurityTab onChangePassword={changePassword} />
                  )}
                  {tab === "notify" && (
                    <NotificationsTab
                      notifyEmail={account.value.notifyEmail}
                      onToggle={(v) => updateProfile({ notifyEmail: v })}
                    />
                  )}
                </>
              )}
              <div className="p-6 border-b border-gray-100 flex items-start justify-between gap-4">
  <div>
    <h1 className="text-xl font-semibold">Tài khoản cá nhân</h1>
    <p className="text-sm text-gray-500">Quản lý hồ sơ, bảo mật và thông báo</p>
  </div>

  <button
    type="button"
    onClick={async () => {
      await logout();
      nav("/login", { replace: true });
    }}
    className="rounded-xl border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50"
  >
    Đăng xuất
  </button>
</div>

            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "w-full text-left px-3 py-2 rounded-xl text-sm transition",
        active ? "bg-gray-900 text-white" : "hover:bg-gray-100 text-gray-700",
      ].join(" ")}
      type="button"
    >
      {children}
    </button>
  );
}
