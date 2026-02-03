import type { UsersRepository, CreateUserInput, UpdateUserInput } from "../domain/UsersRepository";
import type { User } from "../domain/types";
import { storage } from "../../../../shared/utils/storage";

const LS_KEY = "dev_admin_users";

function uid() {
  return "u_" + Math.random().toString(16).slice(2) + Date.now().toString(16);
}

function seed(): User[] {
  const now = new Date().toISOString();
  return [
    { id: "u_001", fullName: "Ngô Đình Đạt", email: "demo@gmail.com", phone: "0900000000", role: "ADMIN", status: "ACTIVE", createdAt: now },
    { id: "u_002", fullName: "Phùng Thu Trang", email: "trang@gmail.com", phone: "0911111111", role: "MANAGER", status: "ACTIVE", createdAt: now },
    { id: "u_003", fullName: "Người dùng test", email: "user@gmail.com", phone: "0922222222", role: "USER", status: "INACTIVE", createdAt: now },
  ];
}

export class LocalUsersRepository implements UsersRepository {
  async list() {
    const users = storage.get<User[]>(LS_KEY, []);
    if (users.length === 0) {
      const s = seed();
      storage.set(LS_KEY, s);
      return s;
    }
    return users;
  }

  async create(input: CreateUserInput) {
    const users = await this.list();
    const next: User = { id: uid(), createdAt: new Date().toISOString(), ...input, email: input.email.trim().toLowerCase() };
    const all = [next, ...users];
    storage.set(LS_KEY, all);
    return next;
  }

  async update(input: UpdateUserInput) {
    const users = await this.list();
    const all = users.map((u) => (u.id === input.id ? { ...u, ...input, email: input.email.trim().toLowerCase() } : u));
    storage.set(LS_KEY, all);
    const updated = all.find((u) => u.id === input.id);
    if (!updated) throw new Error("Không tìm thấy user để cập nhật");
    return updated;
  }

  async remove(id: string) {
    const users = await this.list();
    const all = users.filter((u) => u.id !== id);
    storage.set(LS_KEY, all);
  }

  async reset() {
    const s = seed();
    storage.set(LS_KEY, s);
    return s;
  }
}
