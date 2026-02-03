import type { AuthRepository, LoginInput } from "../domain/AuthRepository";

export class HttpAuthRepository implements AuthRepository {
  async login(input: LoginInput) {
    // MOCK: accept demo
    if (input.email !== "demo@gmail.com" || input.password !== "123456") {
      throw new Error("Sai tài khoản hoặc mật khẩu (demo: demo@gmail.com / 123456)");
    }
  }

  async logout() {
    return;
  }

  async forgotPassword(_email: string) {
    return;
  }
}
