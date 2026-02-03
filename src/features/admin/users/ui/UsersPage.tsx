import { useEffect, useMemo, useState } from "react";

type Role = "ADMIN" | "MANAGER" | "USER";
type Status = "ACTIVE" | "INACTIVE";

type User = {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: Role;
  status: Status;
  createdAt: string; // ISO
};

const LS_KEY = "dev_admin_users";

function uid() {
  return "u_" + Math.random().toString(16).slice(2) + Date.now().toString(16);
}

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("vi-VN");
}

function seedUsers(): User[] {
  const now = new Date().toISOString();
  return [
    {
      id: "u_001",
      fullName: "Ngô Đình Đạt",
      email: "demo@gmail.com",
      phone: "0900000000",
      role: "ADMIN",
      status: "ACTIVE",
      createdAt: now,
    },
    {
      id: "u_002",
      fullName: "Phùng Thu Trang",
      email: "trang@gmail.com",
      phone: "0911111111",
      role: "MANAGER",
      status: "ACTIVE",
      createdAt: now,
    },
    {
      id: "u_003",
      fullName: "Người dùng test",
      email: "user@gmail.com",
      phone: "0922222222",
      role: "USER",
      status: "INACTIVE",
      createdAt: now,
    },
  ];
}

function readLS(): User[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return seedUsers();
    const parsed = JSON.parse(raw) as User[];
    if (!Array.isArray(parsed)) return seedUsers();
    return parsed;
  } catch {
    return seedUsers();
  }
}

function writeLS(users: User[]) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(users));
  } catch {
    // ignore
  }
}

function validateUser(
  input: Omit<User, "id" | "createdAt">,
  existing: User[],
  editingId?: string
) {
  if (!input.fullName.trim() || input.fullName.trim().length < 2) {
    return "Họ tên tối thiểu 2 ký tự";
  }

  const email = input.email.trim().toLowerCase();
  if (!email || !email.includes("@")) return "Email không hợp lệ";

  const dup = existing.find(
    (u) => u.email.toLowerCase() === email && u.id !== editingId
  );
  if (dup) return "Email đã tồn tại";

  if (input.phone && input.phone.replace(/\D/g, "").length < 9) {
    return "Số điện thoại không hợp lệ";
  }

  return null;
}

export function UsersPage({ embedded = false }: { embedded?: boolean } = {}) {
  // ✅ FIX: đọc LocalStorage ngay khi init state (tránh effect ghi rỗng)
  const [users, setUsers] = useState<User[]>(() => readLS());

  const [q, setQ] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | "ALL">("ALL");
  const [statusFilter, setStatusFilter] = useState<Status | "ALL">("ALL");

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);

  const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(
    null
  );

  // ✅ Ghi lại LocalStorage mỗi khi users thay đổi
  useEffect(() => {
    writeLS(users);
  }, [users]);

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

  const showToast = (type: "ok" | "err", msg: string) => {
    setToast({ type, msg });
    window.setTimeout(() => setToast(null), 1800);
  };

  const onCreate = () => {
    setEditing(null);
    setOpen(true);
  };

  const onEdit = (u: User) => {
    setEditing(u);
    setOpen(true);
  };

  const onDelete = (u: User) => {
    const ok = window.confirm(`Xoá người dùng "${u.fullName}"?`);
    if (!ok) return;
    setUsers((prev) => prev.filter((x) => x.id !== u.id));
    showToast("ok", "Đã xoá người dùng");
  };

  const onResetData = () => {
    const ok = window.confirm("Reset danh sách user về dữ liệu mẫu?");
    if (!ok) return;
    setUsers(seedUsers());
    showToast("ok", "Đã reset dữ liệu");
  };

  const onSave = (data: Omit<User, "id" | "createdAt">) => {
    const err = validateUser(data, users, editing?.id);
    if (err) {
      showToast("err", err);
      return;
    }

    if (editing) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editing.id
            ? { ...u, ...data, email: data.email.trim().toLowerCase() }
            : u
        )
      );
      showToast("ok", "Đã cập nhật người dùng");
    } else {
      const next: User = {
        id: uid(),
        createdAt: new Date().toISOString(),
        ...data,
        email: data.email.trim().toLowerCase(),
      };
      setUsers((prev) => [next, ...prev]);
      showToast("ok", "Đã tạo người dùng");
    }

    setOpen(false);
    setEditing(null);
  };

  // ✅ Card nội dung để dùng chung cho embedded/full page
  const card = (
    <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl font-semibold">Quản trị hệ thống</h1>
            <p className="text-sm text-gray-500 mt-1">Quản lý người dùng (CRUD)</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              className="rounded-xl border border-gray-200 px-4 py-2 text-sm hover:bg-gray-50"
              onClick={onResetData}
              type="button"
            >
              Reset dữ liệu
            </button>

            <button
              className="rounded-xl bg-gray-900 px-4 py-2 text-sm text-white hover:bg-black"
              onClick={onCreate}
              type="button"
            >
              + Thêm người dùng
            </button>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Tìm kiếm</label>
            <input
              className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-900/20"
              placeholder="Tên, email, SĐT, ID..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Vai trò</label>
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
            <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
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
      </div>

      <div className="p-6">
        <div className="text-sm text-gray-600 mb-3">
          Tổng: <span className="font-medium">{filtered.length}</span> người dùng
        </div>

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
                  <Td>
                    <Badge>{u.role}</Badge>
                  </Td>
                  <Td>
                    <Badge tone={u.status === "ACTIVE" ? "green" : "gray"}>
                      {u.status}
                    </Badge>
                  </Td>
                  <Td>{formatDate(u.createdAt)}</Td>
                  <Td className="text-right">
                    <div className="inline-flex gap-2">
                      <button
                        className="rounded-xl border border-gray-200 px-3 py-1.5 hover:bg-white"
                        onClick={() => onEdit(u)}
                        type="button"
                      >
                        Sửa
                      </button>
                      <button
                        className="rounded-xl border border-red-200 px-3 py-1.5 text-red-700 hover:bg-red-50"
                        onClick={() => onDelete(u)}
                        type="button"
                      >
                        Xoá
                      </button>
                    </div>
                  </Td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-500">
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-xs text-gray-500">
          * Dữ liệu đang lưu trong LocalStorage key:{" "}
          <span className="font-mono">{LS_KEY}</span>
        </p>
      </div>
    </div>
  );

  // ✅ Embedded: dùng trong layout admin có sidebar (không bọc nền + max-width)
  if (embedded) {
    return (
      <>
        {card}

        {open && (
          <UserModal
            title={editing ? "Cập nhật người dùng" : "Thêm người dùng"}
            initial={
              editing
                ? {
                    fullName: editing.fullName,
                    email: editing.email,
                    phone: editing.phone || "",
                    role: editing.role,
                    status: editing.status,
                  }
                : {
                    fullName: "",
                    email: "",
                    phone: "",
                    role: "USER",
                    status: "ACTIVE",
                  }
            }
            onClose={() => {
              setOpen(false);
              setEditing(null);
            }}
            onSave={onSave}
          />
        )}

        {toast && <Toast toast={toast} />}
      </>
    );
  }

  // ✅ Full page: giống style cũ
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {card}

        {open && (
          <UserModal
            title={editing ? "Cập nhật người dùng" : "Thêm người dùng"}
            initial={
              editing
                ? {
                    fullName: editing.fullName,
                    email: editing.email,
                    phone: editing.phone || "",
                    role: editing.role,
                    status: editing.status,
                  }
                : {
                    fullName: "",
                    email: "",
                    phone: "",
                    role: "USER",
                    status: "ACTIVE",
                  }
            }
            onClose={() => {
              setOpen(false);
              setEditing(null);
            }}
            onSave={onSave}
          />
        )}

        {toast && <Toast toast={toast} />}
      </div>
    </div>
  );
}

function Toast({ toast }: { toast: { type: "ok" | "err"; msg: string } }) {
  return (
    <div className="fixed bottom-5 right-5 z-[60]">
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
  );
}

function Th({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <th className={["p-3 text-left font-medium", className].join(" ")}>{children}</th>;
}

function Td({
  children,
  className = "",
  mono,
}: {
  children: React.ReactNode;
  className?: string;
  mono?: boolean;
}) {
  return (
    <td
      className={[
        "p-3 align-middle text-gray-800",
        mono ? "font-mono text-xs" : "",
        className,
      ].join(" ")}
    >
      {children}
    </td>
  );
}

function Badge({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: "default" | "green" | "gray";
}) {
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
  onSave: (data: Omit<User, "id" | "createdAt">) => void;
}) {
  const [form, setForm] = useState(initial);

  const submit = () => {
    const payload: Omit<User, "id" | "createdAt"> = {
      fullName: form.fullName,
      email: form.email,
      phone: form.phone || undefined,
      role: form.role,
      status: form.status,
    };
    onSave(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white border border-gray-100 shadow-xl">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div className="font-semibold">{title}</div>
          <button
            className="rounded-xl px-3 py-1.5 text-sm border border-gray-200 hover:bg-gray-50"
            onClick={onClose}
            type="button"
          >
            Đóng
          </button>
        </div>

        <div className="p-5 space-y-4">
          <Field label="Họ tên">
            <input
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-900/20"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              placeholder="Nhập họ tên"
            />
          </Field>

          <Field label="Email">
            <input
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-900/20"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Nhập email"
            />
          </Field>

          <Field label="Số điện thoại">
            <input
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-900/20"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="Nhập SĐT (tuỳ chọn)"
            />
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Vai trò">
              <select
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value as Role })}
              >
                <option value="ADMIN">ADMIN</option>
                <option value="MANAGER">MANAGER</option>
                <option value="USER">USER</option>
              </select>
            </Field>

            <Field label="Trạng thái">
              <select
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
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
          <button
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm hover:bg-gray-50"
            onClick={onClose}
            type="button"
          >
            Huỷ
          </button>
          <button
            className="rounded-xl bg-gray-900 px-4 py-2 text-sm text-white hover:bg-black"
            onClick={submit}
            type="button"
          >
            Lưu
          </button>
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
