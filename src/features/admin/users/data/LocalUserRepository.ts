import type { UserRepository, CreateUserInput, UpdateUserInput } from "../domain/UserRepository";
import type { UserDTO } from "../domain/User";

export class LocalUserRepository implements UserRepository {
  private key = "dev_users";

  private seed(): UserDTO[] {
    const now = new Date().toISOString();
    return [
      { id: "u_admin", fullName: "Admin Demo", email: "admin@gmail.com", role: "admin", status: "active", createdAt: now },
      { id: "u_001", fullName: "Người dùng demo", email: "demo@gmail.com", role: "user", status: "active", createdAt: now },
    ];
  }

  private read(): UserDTO[] {
    const raw = localStorage.getItem(this.key);
    if (!raw) {
      const init = this.seed();
      localStorage.setItem(this.key, JSON.stringify(init));
      return init;
    }
    return JSON.parse(raw) as UserDTO[];
  }

  private write(rows: UserDTO[]) {
    localStorage.setItem(this.key, JSON.stringify(rows));
  }

  async list() {
    return this.read().sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }

  async create(input: CreateUserInput) {
    const rows = this.read();
    const exists = rows.some((u) => u.email.toLowerCase() === input.email.toLowerCase());
    if (exists) throw new Error("Email đã tồn tại");

    const dto: UserDTO = {
      id: "u_" + Math.random().toString(16).slice(2, 10),
      fullName: input.fullName.trim(),
      email: input.email.trim().toLowerCase(),
      role: input.role,
      status: input.status,
      createdAt: new Date().toISOString(),
    };

    const next = [dto, ...rows];
    this.write(next);
    return dto;
  }

  async update(id: string, input: UpdateUserInput) {
    const rows = this.read();
    const idx = rows.findIndex((u) => u.id === id);
    if (idx === -1) throw new Error("Không tìm thấy người dùng");

    const cur = rows[idx];
    const next: UserDTO = { ...cur, ...input };
    rows[idx] = next;
    this.write(rows);
    return next;
  }

  async remove(id: string) {
    const rows = this.read();
    const next = rows.filter((u) => u.id !== id);
    this.write(next);
  }
}
