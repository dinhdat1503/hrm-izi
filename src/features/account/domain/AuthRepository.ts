export type LoginInput = { email: string; password: string };

export interface AuthRepository {
  login(input: LoginInput): Promise<void>;
  logout(): Promise<void>;
  forgotPassword(email: string): Promise<void>;
}
