import { useEffect, useMemo, useState } from "react";
import { LocalUserRepository } from "../data/LocalUserRepository";
import { ListUsers } from "../domain/usecases/ListUsers";
import { CreateUser } from "../domain/usecases/CreateUser";
import { UpdateUser } from "../domain/usecases/UpdateUser";
import { DeleteUser } from "../domain/usecases/DeleteUser";
import type { User } from "../domain/User";
import type { CreateUserInput } from "../domain/UserRepository";

type State = { loading: boolean; error?: string; ok?: string };

export function useUsers() {
  const repo = useMemo(() => new LocalUserRepository(), []);
  const listUC = useMemo(() => new ListUsers(repo), [repo]);
  const createUC = useMemo(() => new CreateUser(repo), [repo]);
  const updateUC = useMemo(() => new UpdateUser(repo), [repo]);
  const deleteUC = useMemo(() => new DeleteUser(repo), [repo]);

  const [users, setUsers] = useState<User[]>([]);
  const [state, setState] = useState<State>({ loading: true });

  const refresh = async () => {
    try {
      setState({ loading: true });
      const rows = await listUC.exec();
      setUsers(rows);
      setState({ loading: false });
    } catch (e: any) {
      setState({ loading: false, error: e?.message || "Không tải được danh sách" });
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createUser = async (input: CreateUserInput) => {
    try {
      setState({ loading: true });
      await createUC.exec(input);
      setState({ loading: false, ok: "Đã tạo người dùng" });
      await refresh();
      setTimeout(() => setState((s) => ({ ...s, ok: undefined })), 1500);
    } catch (e: any) {
      setState({ loading: false, error: e?.message || "Tạo thất bại" });
    }
  };

  const updateUser = async (u: User, input: any) => {
    try {
      setState({ loading: true });
      await updateUC.exec(u, input);
      setState({ loading: false, ok: "Đã cập nhật" });
      await refresh();
      setTimeout(() => setState((s) => ({ ...s, ok: undefined })), 1500);
    } catch (e: any) {
      setState({ loading: false, error: e?.message || "Cập nhật thất bại" });
    }
  };

  const deleteUser = async (id: string) => {
    try {
      setState({ loading: true });
      await deleteUC.exec(id);
      setState({ loading: false, ok: "Đã xoá" });
      await refresh();
      setTimeout(() => setState((s) => ({ ...s, ok: undefined })), 1500);
    } catch (e: any) {
      setState({ loading: false, error: e?.message || "Xoá thất bại" });
    }
  };

  return { users, state, refresh, createUser, updateUser, deleteUser };
}
