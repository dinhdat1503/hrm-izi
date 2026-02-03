import { useMemo, useState } from "react";
import { Input } from "../../../shared/ui/Input";
import { Button } from "../../../shared/ui/Button";
import { storage } from "../../../shared/utils/storage";
import { useAuth } from "../../auth/useAuth";

type AccountMe = {
  fullName: string;
  email: string;
  phone?: string;
  bio?: string;
  notifyEmail: boolean;
};

const LS_ME = "dev_account_me";

export function AccountPage() {
  const { state, logout } = useAuth();

  const defaultMe: AccountMe = useMemo(() => {
    const u = state.user;
    return {
      fullName: u?.fullName || "Người dùng demo",
      email: u?.email || "demo@gmail.com",
      phone: "0900000000",
      bio: "Mẫu bio để test UI",
      notifyEmail: true,
    };
  }, [state.user]);

  const me = storage.get<AccountMe>(LS_ME, defaultMe);

  const [tab, setTab] = useState<"profile" | "security" | "notify">("profile");
  const [form, setForm] = useState(me);
  const [toast, setToast] = useState<string | null>(null);

  const show = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1600);
  };

  const saveProfile = () => {
    if (!form.fullName.trim() || form.fullName.trim().length < 2) return show("Họ tên tối thiểu 2 ký tự");
    storage.set(LS_ME, form);
    show("Đã lưu thay đổi");
  };

  const changePassword = (oldPass: string, newPass: string, confirm: string) => {
    if (newPass.length < 6) return show("Mật khẩu mới tối thiểu 6 ký tự");
    if (newPass !== confirm) return show("Xác nhận mật khẩu không khớp");
    // demo: không gọi backend
    show("Đổi mật khẩu thành công (demo)");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold">Tài khoản cá nhân</h1>
              <p className="text-sm text-gray-500">Cập nhật thông tin & bảo mật</p>
            </div>
            <Button variant="ghost" onClick={logout}>Đăng xuất</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4">
            <aside className="p-4 border-b md:border-b-0 md:border-r border-gray-100">
              <nav className="space-y-1">
                <TabButton active={tab==="profile"} onClick={() => setTab("profile")}>Cập nhật thông tin</TabButton>
                <TabButton active={tab==="security"} onClick={() => setTab("security")}>Đổi mật khẩu</TabButton>
                <TabButton active={tab==="notify"} onClick={() => setTab("notify")}>Thông báo</TabButton>
              </nav>

              {toast && (
                <div className="mt-4 rounded-xl bg-gray-900 text-white text-sm p-3">
                  {toast}
                </div>
              )}
            </aside>

            <main className="p-6 md:col-span-3">
              {tab === "profile" && (
                <section className="rounded-2xl border border-gray-100 p-5">
                  <h2 className="font-semibold">Thông tin hồ sơ</h2>
                  <p className="text-sm text-gray-500 mt-1">Cập nhật thông tin cơ bản</p>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Họ tên">
                      <Input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
                    </Field>
                    <Field label="Email">
                      <Input value={form.email} disabled />
                    </Field>
                    <Field label="Số điện thoại">
                      <Input value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                    </Field>
                    <div className="md:col-span-2">
                      <Field label="Giới thiệu">
                        <textarea
                          className="w-full min-h-[120px] rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-900/20"
                          value={form.bio || ""}
                          onChange={(e) => setForm({ ...form, bio: e.target.value })}
                        />
                      </Field>
                    </div>
                  </div>

                  <div className="mt-5 flex gap-2">
                    <Button onClick={saveProfile}>Lưu thay đổi</Button>
                    <Button variant="ghost" onClick={() => setForm(me)}>Hoàn tác</Button>
                  </div>
                </section>
              )}

              {tab === "security" && <SecurityBox onSubmit={changePassword} />}
              {tab === "notify" && <NotifyBox value={form.notifyEmail} onChange={(v) => { setForm({ ...form, notifyEmail: v }); storage.set(LS_ME, { ...form, notifyEmail: v }); }} />}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-sm font-medium text-gray-700">{label}</div>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function SecurityBox({ onSubmit }: { onSubmit: (oldPass: string, newPass: string, confirm: string) => void }) {
  const [oldPass, setOld] = useState("");
  const [newPass, setNew] = useState("");
  const [confirm, setConfirm] = useState("");

  return (
    <section className="rounded-2xl border border-gray-100 p-5">
      <h2 className="font-semibold">Đổi mật khẩu</h2>
      <p className="text-sm text-gray-500 mt-1">Demo không gọi backend</p>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Mật khẩu hiện tại">
          <Input type="password" value={oldPass} onChange={(e) => setOld(e.target.value)} />
        </Field>
        <div />
        <Field label="Mật khẩu mới">
          <Input type="password" value={newPass} onChange={(e) => setNew(e.target.value)} />
        </Field>
        <Field label="Xác nhận mật khẩu mới">
          <Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </Field>
      </div>

      <div className="mt-5">
        <Button onClick={() => onSubmit(oldPass, newPass, confirm)}>Cập nhật mật khẩu</Button>
      </div>
    </section>
  );
}

function NotifyBox({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <section className="rounded-2xl border border-gray-100 p-5">
      <h2 className="font-semibold">Thông báo</h2>
      <p className="text-sm text-gray-500 mt-1">Bật/tắt nhận email</p>

      <div className="mt-4 flex items-center justify-between rounded-xl border border-gray-100 p-4">
        <div>
          <div className="text-sm font-medium">Nhận email</div>
          <div className="text-xs text-gray-500">Nhận thông báo qua email khi có cập nhật</div>
        </div>

        <button
          type="button"
          onClick={() => onChange(!value)}
          className={["w-12 h-7 rounded-full p-1 transition", value ? "bg-gray-900" : "bg-gray-200"].join(" ")}
        >
          <div className={["w-5 h-5 rounded-full bg-white transition", value ? "translate-x-5" : "translate-x-0"].join(" ")} />
        </button>
      </div>
    </section>
  );
}
