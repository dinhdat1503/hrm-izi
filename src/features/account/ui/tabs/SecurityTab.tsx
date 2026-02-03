import { useState } from "react";
import { Input } from "../../../../shared/ui/Input";
import { Button } from "../../../../shared/ui/Button";

export function SecurityTab({
  onChangePassword,
}: {
  onChangePassword: (oldPass: string, newPass: string) => Promise<void>;
}) {
  const [oldPassword, setOld] = useState("");
  const [newPassword, setNew] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  const submit = async () => {
    setMsg(null);
    if (newPassword !== confirm) {
      setMsg("Mật khẩu mới và xác nhận không khớp");
      return;
    }
    await onChangePassword(oldPassword, newPassword);
    setOld(""); setNew(""); setConfirm("");
  };

  return (
    <section className="rounded-2xl border border-gray-100 p-5">
      <h2 className="font-semibold">Bảo mật</h2>
      <p className="text-sm text-gray-500 mt-1">Đổi mật khẩu đăng nhập</p>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Mật khẩu hiện tại">
          <Input type="password" value={oldPassword} onChange={(e) => setOld(e.target.value)} />
        </Field>

        <div />

        <Field label="Mật khẩu mới">
          <Input type="password" value={newPassword} onChange={(e) => setNew(e.target.value)} />
        </Field>

        <Field label="Xác nhận mật khẩu mới">
          <Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </Field>
      </div>

      {msg && <div className="mt-4 text-sm text-gray-700">{msg}</div>}

      <div className="mt-5">
        <Button onClick={submit}>Cập nhật mật khẩu</Button>
      </div>
    </section>
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
