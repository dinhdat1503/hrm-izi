import { createContext, useMemo, useState } from "react";
import { HttpAuthRepository } from "../data/HttpAuthRepository";
import { Login } from "../domain/usecases/Login";
import { Logout } from "../domain/usecases/Logout";
import { ForgotPassword } from "../domain/usecases/ForgotPassword";

type AuthCtx = {
  isAuthed: boolean;
  loading: boolean;
  error?: string;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
};

export const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const repo = useMemo(() => new HttpAuthRepository(), []);
  const loginUC = useMemo(() => new Login(repo), [repo]);
  const logoutUC = useMemo(() => new Logout(repo), [repo]);
  const forgotUC = useMemo(() => new ForgotPassword(repo), [repo]);

  const [isAuthed, setAuthed] = useState(() => localStorage.getItem("authed") === "1");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const login = async (email: string, password: string) => {
    try {
      setError(undefined);
      setLoading(true);
      await loginUC.exec({ email, password });
      localStorage.setItem("authed", "1");
      setAuthed(true);
    } catch (e: any) {
      setError(e?.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await logoutUC.exec();
      localStorage.removeItem("authed");
      setAuthed(false);
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      setError(undefined);
      setLoading(true);
      await forgotUC.exec(email);
    } catch (e: any) {
      setError(e?.message || "Gửi yêu cầu thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthed, loading, error, login, logout, forgotPassword }}>
      {children}
    </AuthContext.Provider>
  );
}
