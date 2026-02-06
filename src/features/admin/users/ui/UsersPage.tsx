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

function cx(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(" ");
}

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
  const raw = localStorage.getItem(LS_KEY);
  if (!raw) return seedUsers();
  try {
    return JSON.parse(raw) as User[];
  } catch {
    return seedUsers();
  }
}

function writeLS(users: User[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(users));
}

function validateUser(
  input: Omit<User, "id" | "createdAt">,
  existing: User[],
  editingId?: string
) {
  if (!input.fullName.trim() || input.fullName.trim().length < 2) return "Họ tên tối thiểu 2 ký tự";
  const email = input.email.trim().toLowerCase();
  if (!email || !email.includes("@")) return "Email không hợp lệ";

  const dup = existing.find((u) => u.email.toLowerCase() === email && u.id !== editingId);
  if (dup) return "Email đã tồn tại";

  if (input.phone && input.phone.replace(/\D/g, "").length < 9) return "Số điện thoại không hợp lệ";
  return null;
}

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [q, setQ] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | "ALL">("ALL");
  const [statusFilter, setStatusFilter] = useState<Status | "ALL">("ALL");

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null);

  useEffect(() => {
    setUsers(readLS());
  }, []);

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
    setTimeout(() => setToast(null), 1800);
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
    if (err) return showToast("err", err);

    if (editing) {
      setUsers((prev) =>
        prev.map((u) => (u.id === editing.id ? { ...u, ...data, email: data.email.trim().toLowerCase() } : u))
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

  return (
    // QUAN TRỌNG: h-full + flex + min-h-0 để giãn theo AdminShell
    <div className="h-full min-h-0 flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            Quản lý người dùng
          </h1>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            CRUD + lọc/tìm kiếm (LocalStorage demo)
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50
                       dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
            onClick={onResetData}
            type="button"
          >
            Reset dữ liệu
          </button>

          <button
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-black
                       dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
            onClick={onCreate}
            type="button"
          >
            + Thêm người dùng
          </button>
        </div>
      </div>

      {/* Card - flex-1 để ăn hết phần còn lại */}
      <section
        className="flex-1 min-h-0 rounded-2xl border border-slate-200 bg-white shadow-sm
                   dark:border-slate-800 dark:bg-slate-900
                   flex flex-col"
      >
        {/* Filters header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="md:col-span-2">
              <Label>Tìm kiếm</Label>
              <Input placeholder="Tên, email, SĐT, ID..." value={q} onChange={(e) => setQ(e.target.value)} />
            </div>

            <div>
              <Label>Vai trò</Label>
              <Select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value as any)}>
                <option value="ALL">Tất cả</option>
                <option value="ADMIN">ADMIN</option>
                <option value="MANAGER">MANAGER</option>
                <option value="USER">USER</option>
              </Select>
            </div>

            <div>
              <Label>Trạng thái</Label>
              <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)}>
                <option value="ALL">Tất cả</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </Select>
            </div>
          </div>

          <div className="mt-4 text-sm text-slate-600 dark:text-slate-300">
            Tổng: <span className="font-semibold">{filtered.length}</span> người dùng
          </div>
        </div>

        {/* Body - min-h-0 để vùng bảng scroll đúng */}
        <div className="flex-1 min-h-0 p-5 flex flex-col gap-3">
          <div className="flex-1 min-h-0 overflow-auto rounded-xl border border-slate-200 bg-white
                          dark:border-slate-800 dark:bg-slate-950/40">
            <table className="min-w-[980px] w-full text-sm">
              <thead className="sticky top-0 z-10 bg-slate-50 text-slate-700 border-b border-slate-200
                                dark:bg-slate-900 dark:text-slate-200 dark:border-slate-800">
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

              <tbody className="text-slate-900 dark:text-slate-100">
                {filtered.map((u) => (
                  <tr
                    key={u.id}
                    className="border-t border-slate-200 hover:bg-slate-50
                               dark:border-slate-800 dark:hover:bg-slate-800/40"
                  >
                    <Td mono>{u.id}</Td>
                    <Td>{u.fullName}</Td>
                    <Td>{u.email}</Td>
                    <Td>{u.phone || "-"}</Td>
                    <Td>
                      <Badge>{u.role}</Badge>
                    </Td>
                    <Td>
                      <Badge tone={u.status === "ACTIVE" ? "green" : "gray"}>{u.status}</Badge>
                    </Td>
                    <Td>{formatDate(u.createdAt)}</Td>
                    <Td className="text-right">
                      <div className="inline-flex gap-2">
                        <button
                          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium
                                     hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
                          onClick={() => onEdit(u)}
                          type="button"
                        >
                          Sửa
                        </button>
                        <button
                          className="rounded-lg border border-rose-200 bg-white px-3 py-1.5 text-sm font-medium text-rose-700
                                     hover:bg-rose-50 dark:border-rose-400/20 dark:bg-slate-900 dark:text-rose-300 dark:hover:bg-rose-400/10"
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
                    <td colSpan={8} className="p-10 text-center text-slate-500 dark:text-slate-400">
                      Không có dữ liệu
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            * Dữ liệu đang lưu trong LocalStorage key:{" "}
            <span className="font-mono text-[11px]">{LS_KEY}</span>
          </p>
        </div>
      </section>

      {/* Modal */}
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
              : { fullName: "", email: "", phone: "", role: "USER", status: "ACTIVE" }
          }
          onClose={() => {
            setOpen(false);
            setEditing(null);
          }}
          onSave={onSave}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-5 right-5">
          <div
            className={cx(
              "rounded-xl px-4 py-3 text-sm shadow-lg border",
              toast.type === "ok"
                ? "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-400/10 dark:text-emerald-200 dark:border-emerald-400/20"
                : "bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-400/10 dark:text-rose-200 dark:border-rose-400/20"
            )}
          >
            {toast.msg}
          </div>
        </div>
      )}
    </div>
  );
}

/* --------- UI bits --------- */

function Label({ children }: { children: React.ReactNode }) {
  return <div className="text-sm font-medium text-slate-700 dark:text-slate-200">{children}</div>;
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cx(
        "mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none transition",
        "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400",
        "focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300",
        "dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-100 dark:placeholder:text-slate-500",
        "dark:focus:ring-slate-200/10 dark:focus:border-slate-700",
        props.className
      )}
    />
  );
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cx(
        "mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none transition",
        "border-slate-200 bg-white text-slate-900",
        "focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300",
        "dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-100",
        "dark:focus:ring-slate-200/10 dark:focus:border-slate-700",
        props.className
      )}
    />
  );
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <th className={cx("p-3 text-left font-semibold", className)}>{children}</th>;
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
      className={cx(
        "p-3 align-middle",
        mono && "font-mono text-[11px] text-slate-600 dark:text-slate-300",
        className
      )}
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
      ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-400/10 dark:text-emerald-200 dark:border-emerald-400/20"
      : tone === "gray"
      ? "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800/60 dark:text-slate-200 dark:border-slate-700"
      : "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800/60 dark:text-slate-200 dark:border-slate-700";

  return (
    <span className={cx("inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium", cls)}>
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="font-semibold text-slate-900 dark:text-slate-50">{title}</div>
          <button
            className="rounded-lg px-3 py-1.5 text-sm border border-slate-200 hover:bg-slate-50
                       dark:border-slate-700 dark:hover:bg-slate-800"
            onClick={onClose}
            type="button"
          >
            Đóng
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <Label>Họ tên</Label>
            <Input
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              placeholder="Nhập họ tên"
            />
          </div>

          <div>
            <Label>Email</Label>
            <Input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Nhập email"
            />
          </div>

          <div>
            <Label>Số điện thoại</Label>
            <Input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="Nhập SĐT (tuỳ chọn)"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label>Vai trò</Label>
              <Select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as Role })}>
                <option value="ADMIN">ADMIN</option>
                <option value="MANAGER">MANAGER</option>
                <option value="USER">USER</option>
              </Select>
            </div>

            <div>
              <Label>Trạng thái</Label>
              <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Status })}>
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </Select>
            </div>
          </div>
        </div>

        <div className="p-5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
          <button
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50
                       dark:border-slate-800 dark:hover:bg-slate-800"
            onClick={onClose}
            type="button"
          >
            Huỷ
          </button>

          <button
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-black
                       dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
            onClick={() =>
              onSave({
                fullName: form.fullName,
                email: form.email,
                phone: form.phone || undefined,
                role: form.role,
                status: form.status,
              } as any)
            }
            type="button"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
}
