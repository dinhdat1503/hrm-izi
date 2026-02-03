import type { AuthRepository } from "../AuthRepository";

export class ForgotPassword {
  private repo: AuthRepository;

  constructor(repo: AuthRepository) {
    this.repo = repo;
  }

  exec(email: string) {
    if (!email.includes("@")) throw new Error("Email không hợp lệ");
    return this.repo.forgotPassword(email);
  }
}
