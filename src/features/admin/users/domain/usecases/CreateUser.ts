import type { UserRepository, CreateUserInput } from "../UserRepository";
import { User } from "../User";

export class CreateUser {
  private repo: UserRepository;
  constructor(repo: UserRepository) {
    this.repo = repo;
  }

  async exec(input: CreateUserInput) {
    if (input.fullName.trim().length < 2) throw new Error("Họ tên tối thiểu 2 ký tự");
    if (!input.email.includes("@")) throw new Error("Email không hợp lệ");
    if (input.password.length < 6) throw new Error("Mật khẩu tối thiểu 6 ký tự");

    const dto = await this.repo.create(input);
    return new User(dto);
  }
}
