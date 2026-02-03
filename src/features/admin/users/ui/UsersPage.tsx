import { useMemo, useState } from "react";
import type { Role, Status, User } from "../domain/types";
import { Button } from "../../../../shared/ui/Button";
import { Input } from "../../../../shared/ui/Input";
import { useUsers } from "../hooks/useUsers";

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("vi-VN");
}

export function UsersPage() {
  const { users, loading, toast, create, update, remove, reset } = useUsers();

  const [q, setQ] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | "ALL">("ALL");
  const [statusFilter, setStatusFilter] = useState<Status | "ALL">("ALL");

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);

  const filtered = useMemo(() => {
    const keyword = q.trim().toLowerCase();
    return users
      .filter((u) => (roleFilter === "ALL" ? true : u.role === roleFilter))
      .filter((u) => (statusFilter === "ALL" ? true : u.status === statusFilter))
      .filter((u) => {
        if (!keyword) return true;
        return (
          u.fullName.toLowerCase().includes(keyword) ||
          u.email.toLowerCase().includes(keyword) ||
          (u.phone || "").toLowerCase().includes(keyword) ||
          u.id.toLowerCase().includes(keyword)
        );
      })
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [users, q, roleFilter, statusFilter]);

  const onCreate = () => { setEditing(null); setOpen(true); };
  const onEdit = (u: User) => { setEditing(u); setOpen(true); };
  const onDelete = (u: User) => {
    const ok = window.confirm(`Xoá người dùng "${u.fullName}"?`);
    if (!ok) return;
    remove(u.id);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-semibold">Quản lý người dùng</h1>
          <p className="text-sm text-gray-500 mt-1">CRUD + lọc/tìm kiếm (LocalStorage demo)</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="ghost" onClick={() => { if (window.confirm("Reset dữ liệu mẫu?")) reset(); }}>
            Reset dữ liệu
          </Button>
          <Button onClick={onCreate}>+ Thêm người dùng</Button>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="md:col-span-2">
          <div className="text-sm font-medium text-gray-700">Tìm kiếm</div>
          <div className="mt-1">
            <Input placeholder="Tên, email, SĐT, ID..." value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
        </div>

        <div>
          <div className="text-sm font-medium text-gray-700">Vai trò</div>
          <select
            className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as any)}
          >
            <option value="ALL">Tất cả</option>
            <option value="ADMIN">ADMIN</option>
            <option value="MANAGER">MANAGER</option>
            <option value="USER">USER</option>
          </select>
        </div>

        <div>
          <div className="text-sm font-medium text-gray-700">Trạng thái</div>
          <select
            className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
          >
            <option value="ALL">Tất cả</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="mt-6 rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Tổng: <span className="font-medium">{filtered.length}</span> người dùng
          </div>
          {loading && <div className="text-sm text-gray-500">Đang tải...</div>}
        </div>

        <div className="p-5">
          <div className="overflow-auto rounded-2xl border border-gray-100">
            <table className="min-w-[900px] w-full text-sm">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <Th>ID</Th>
                  <Th>Họ tên</Th>
                  <Th>Email</Th>
                  <Th>SĐT</Th>
                  <Th>Vai trò</Th>
                  <Th>Trạng thái</Th>
                  <Th>Ngày tạo</Th>
                  <Th className="text-right">Hành động</Th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id} className="border-t border-gray-100 hover:bg-gray-50/50">
                    <Td mono>{u.id}</Td>
                    <Td>{u.fullName}</Td>
                    <Td>{u.email}</Td>
                    <Td>{u.phone || "-"}</Td>
                    <Td><Badge>{u.role}</Badge></Td>
                    <Td><Badge tone={u.status === "ACTIVE" ? "green" : "gray"}>{u.status}</Badge></Td>
                    <Td>{formatDate(u.createdAt)}</Td>
                    <Td className="text-right">
                      <div className="inline-flex gap-2">
                        <Button variant="ghost" className="px-3 py-1.5" onClick={() => onEdit(u)}>Sửa</Button>
                        <Button variant="danger" className="px-3 py-1.5" onClick={() => onDelete(u)}>Xoá</Button>
                      </div>
                    </Td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-gray-500">Không có dữ liệu</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <p className="mt-3 text-xs text-gray-500">
            * Dữ liệu đang lưu trong LocalStorage key: <span className="font-mono">dev_admin_users</span>
          </p>
        </div>
      </div>

      {/* Modal */}
      {open && (
        <UserModal
          title={editing ? "Cập nhật người dùng" : "Thêm người dùng"}
          initial={
            editing
              ? { fullName: editing.fullName, email: editing.email, phone: editing.phone || "", role: editing.role, status: editing.status }
              : { fullName: "", email: "", phone: "", role: "USER", status: "ACTIVE" }
          }
          onClose={() => { setOpen(false); setEditing(null); }}
          onSave={async (data) => {
            if (editing) {
              await update({ id: editing.id, ...data });
            } else {
              await create(data);
            }
            setOpen(false);
            setEditing(null);
          }}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-5 right-5">
          <div
            className={[
              "rounded-2xl px-4 py-3 text-sm shadow-lg border",
              toast.type === "ok"
                ? "bg-green-50 text-green-800 border-green-200"
                : "bg-red-50 text-red-800 border-red-200",
            ].join(" ")}
          >
            {toast.msg}
          </div>
        </div>
      )}
    </div>
  );
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <th className={["p-3 text-left font-medium", className].join(" ")}>{children}</th>;
}

function Td({ children, className = "", mono }: { children: React.ReactNode; className?: string; mono?: boolean }) {
  return (
    <td className={["p-3 align-middle text-gray-800", mono ? "font-mono text-xs" : "", className].join(" ")}>
      {children}
    </td>
  );
}

function Badge({ children, tone = "default" }: { children: React.ReactNode; tone?: "default" | "green" | "gray" }) {
  const cls =
    tone === "green"
      ? "bg-green-50 text-green-700 border-green-200"
      : tone === "gray"
      ? "bg-gray-100 text-gray-700 border-gray-200"
      : "bg-gray-100 text-gray-800 border-gray-200";
  return (
    <span className={["inline-flex items-center rounded-full border px-2 py-0.5 text-xs", cls].join(" ")}>
      {children}
    </span>
  );
}

function UserModal({
  title,
  initial,
  onClose,
  onSave,
}: {
  title: string;
  initial: { fullName: string; email: string; phone: string; role: Role; status: Status };
  onClose: () => void;
  onSave: (data: Omit<User, "id" | "createdAt">) => Promise<void>;
}) {
  const [form, setForm] = useState(initial);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white border border-gray-100 shadow-xl">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div className="font-semibold">{title}</div>
          <Button variant="ghost" onClick={onClose}>Đóng</Button>
        </div>

        <div className="p-5 space-y-4">
          <Field label="Họ tên">
            <Input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="Nhập họ tên" />
          </Field>

          <Field label="Email">
            <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Nhập email" />
          </Field>

          <Field label="Số điện thoại">
            <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Nhập SĐT (tuỳ chọn)" />
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Vai trò">
              <select className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value as Role })}
              >
                <option value="ADMIN">ADMIN</option>
                <option value="MANAGER">MANAGER</option>
                <option value="USER">USER</option>
              </select>
            </Field>

            <Field label="Trạng thái">
              <select className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as Status })}
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </Field>
          </div>
        </div>

        <div className="p-5 border-t border-gray-100 flex items-center justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>Huỷ</Button>
          <Button onClick={() => onSave({
            fullName: form.fullName,
            email: form.email,
            phone: form.phone || undefined,
            role: form.role,
            status: form.status,
          } as any)}>Lưu</Button>
        </div>
      </div>
    </div>
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
