import type { AuthRepository, LoginInput } from "../AuthRepository";

export class Login {
  constructor(private repo: AuthRepository) {}
  exec(input: LoginInput) {
    if (!input.email.includes("@")) throw new Error("Email không hợp lệ");
    if (input.password.length < 6) throw new Error("Mật khẩu tối thiểu 6 ký tự");
    return this.repo.login(input);
  }
}
