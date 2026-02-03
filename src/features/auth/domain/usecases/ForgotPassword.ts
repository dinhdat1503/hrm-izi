import type { AuthRepository } from "../AuthRepository";

export class ForgotPassword {
  constructor(private repo: AuthRepository) {}
  exec(email: string) {
    if (!email.includes("@")) throw new Error("Email không hợp lệ");
    return this.repo.forgotPassword(email);
  }
}
