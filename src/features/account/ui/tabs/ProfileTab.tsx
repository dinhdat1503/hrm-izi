import { useMemo, useState } from "react";
import { Input } from "../../../../shared/ui/Input";
import { Button } from "../../../../shared/ui/Button";

export function ProfileTab({
  account,
  onSave,
}: {
  account: { fullName: string; email: string; phone?: string; bio?: string; avatarUrl?: string };
  onSave: (input: any) => Promise<void>;
}) {
  const initial = useMemo(
    () => ({
      fullName: account.fullName || "",
      phone: account.phone || "",
      bio: account.bio || "",
      avatarUrl: account.avatarUrl || "",
    }),
    [account]
  );

  const [form, setForm] = useState(initial);

  return (
    <section className="rounded-2xl border border-gray-100 p-5">
      <h2 className="font-semibold">Thông tin hồ sơ</h2>
      <p className="text-sm text-gray-500 mt-1">Cập nhật thông tin cơ bản của bạn</p>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Họ tên">
          <Input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
        </Field>

        <Field label="Email">
          <Input value={account.email} disabled />
        </Field>

        <Field label="Số điện thoại">
          <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </Field>

        <Field label="Avatar URL">
          <Input value={form.avatarUrl} onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })} />
        </Field>

        <div className="md:col-span-2">
          <Field label="Giới thiệu">
            <textarea
              className="w-full min-h-[110px] rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-900/20"
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
            />
          </Field>
        </div>
      </div>

      <div className="mt-5 flex gap-3">
        <Button onClick={() => onSave(form)}>Lưu thay đổi</Button>
        <Button variant="ghost" onClick={() => setForm(initial)}>Hoàn tác</Button>
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
