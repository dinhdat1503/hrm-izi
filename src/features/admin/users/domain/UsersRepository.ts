import type { User } from "./types";

export type CreateUserInput = Omit<User, "id" | "createdAt">;
export type UpdateUserInput = Omit<User, "createdAt">;

export interface UsersRepository {
  list(): Promise<User[]>;
  create(input: CreateUserInput): Promise<User>;
  update(input: UpdateUserInput): Promise<User>;
  remove(id: string): Promise<void>;
  reset(): Promise<User[]>;
}
