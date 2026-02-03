import { useEffect, useMemo, useState } from "react";
import type { Role, Status, User } from "../domain/types";
import { LocalUsersRepository } from "../data/LocalUsersRepository";
import { makeUsersUsecases } from "../domain/usecases";

type Toast = { type: "ok" | "err"; msg: string } | null;

export function useUsers() {
  const repo = useMemo(() => new LocalUsersRepository(), []);
  const uc = useMemo(() => makeUsersUsecases(repo), [repo]);

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<Toast>(null);

  const showToast = (type: "ok" | "err", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 1800);
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await uc.list();
        setUsers(data);
      } catch (e: any) {
        showToast("err", e?.message || "Không tải được danh sách user");
      } finally {
        setLoading(false);
      }
    })();
  }, [uc]);

  const create = async (input: Omit<User, "id" | "createdAt">) => {
    try {
      const next = await uc.create(input);
      setUsers((prev) => [next, ...prev]);
      showToast("ok", "Đã tạo người dùng");
    } catch (e: any) {
      showToast("err", e?.message || "Tạo thất bại");
      throw e;
    }
  };

  const update = async (input: Omit<User, "createdAt">) => {
    try {
      const updated = await uc.update(input);
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
      showToast("ok", "Đã cập nhật người dùng");
    } catch (e: any) {
      showToast("err", e?.message || "Cập nhật thất bại");
      throw e;
    }
  };

  const remove = async (id: string) => {
    try {
      await uc.remove(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      showToast("ok", "Đã xoá người dùng");
    } catch (e: any) {
      showToast("err", e?.message || "Xoá thất bại");
    }
  };

  const reset = async () => {
    try {
      const data = await uc.reset();
      setUsers(data);
      showToast("ok", "Đã reset dữ liệu");
    } catch (e: any) {
      showToast("err", e?.message || "Reset thất bại");
    }
  };

  return { users, loading, toast, create, update, remove, reset };
}
