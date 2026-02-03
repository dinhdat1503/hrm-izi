import type { UserDTO, UserRole, UserStatus } from "./User";

export type CreateUserInput = {
  fullName: string;
  email: string;
  password: string; // demo: chỉ dùng để validate
  role: UserRole;
  status: UserStatus;
};

export type UpdateUserInput = Partial<Pick<UserDTO, "fullName" | "role" | "status">>;

export interface UserRepository {
  list(): Promise<UserDTO[]>;
  create(input: CreateUserInput): Promise<UserDTO>;
  update(id: string, input: UpdateUserInput): Promise<UserDTO>;
  remove(id: string): Promise<void>;
}
