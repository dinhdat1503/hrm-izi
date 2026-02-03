import type { UsersRepository, CreateUserInput, UpdateUserInput } from "./UsersRepository";
import type { User } from "./types";

export function makeUsersUsecases(repo: UsersRepository) {
  return {
    async list() {
      return repo.list();
    },
    async create(input: CreateUserInput) {
      validateUser(input, await repo.list());
      return repo.create(input);
    },
    async update(input: UpdateUserInput) {
      const existing = await repo.list();
      validateUser(
        { fullName: input.fullName, email: input.email, phone: input.phone, role: input.role, status: input.status },
        existing,
        input.id
      );
      return repo.update(input);
    },
    async remove(id: string) {
      return repo.remove(id);
    },
    async reset() {
      return repo.reset();
    },
  };
}

function validateUser(input: CreateUserInput, existing: User[], editingId?: string) {
  if (!input.fullName.trim() || input.fullName.trim().length < 2) {
    throw new Error("Họ tên tối thiểu 2 ký tự");
  }
  const email = input.email.trim().toLowerCase();
  if (!email || !email.includes("@")) throw new Error("Email không hợp lệ");

  const dup = existing.find((u) => u.email.toLowerCase() === email && u.id !== editingId);
  if (dup) throw new Error("Email đã tồn tại");

  if (input.phone && input.phone.replace(/\D/g, "").length < 9) {
    throw new Error("Số điện thoại không hợp lệ");
  }
}
