import type { AccountRepository, ChangePasswordInput } from "../AccountRepository";

export class ChangePassword {
  constructor(private repo: AccountRepository) {}

  async exec(input: ChangePasswordInput) {
    if (input.newPassword.length < 8) throw new Error("Mật khẩu mới tối thiểu 8 ký tự");
    await this.repo.changePassword(input);
  }
}
