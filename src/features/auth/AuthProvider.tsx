import { createContext, useEffect, useMemo, useState } from "react";
import { storage } from "../../shared/utils/storage";

type Role = "ADMIN" | "MANAGER" | "USER";
export type AuthUser = { id: string; email: string; fullName: string; role: Role };

type AuthState = {
  user: AuthUser | null;
  isAuthed: boolean;
  loading: boolean;
  error?: string;
};

type AuthContextValue = {
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

const LS_SESSION = "dev_auth_session";

function demoValidate(email: string, password: string): AuthUser | null {
  const e = email.trim().toLowerCase();
  const p = password.trim();

  // Demo account (bạn có thể đổi)
  if (e === "demo@gmail.com" && p === "123456") {
    return { id: "u_001", email: e, fullName: "Ngô Đình Đạt", role: "ADMIN" };
  }
  return null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthed: false,
    loading: true,
  });

  useEffect(() => {
    const user = storage.get<AuthUser | null>(LS_SESSION, null);
    setState({ user, isAuthed: !!user, loading: false });
  }, []);

  const api = useMemo<AuthContextValue>(() => {
    return {
      state,
      async login(email, password) {
        setState((s) => ({ ...s, loading: true, error: undefined }));
        const u = demoValidate(email, password);
        if (!u) {
          setState((s) => ({ ...s, loading: false, error: "Sai email hoặc mật khẩu (demo: demo@gmail.com / 123456)" }));
          return;
        }
        storage.set(LS_SESSION, u);
        setState({ user: u, isAuthed: true, loading: false });
      },
      logout() {
        storage.remove(LS_SESSION);

        // tuỳ bạn: có thể clear cache demo khác
        // storage.remove("dev_account_me");
        // storage.remove("dev_admin_users");

        setState({ user: null, isAuthed: false, loading: false });
      },
      async forgotPassword(email) {
        const e = email.trim().toLowerCase();
        if (!e.includes("@")) {
          setState((s) => ({ ...s, error: "Email không hợp lệ" }));
          return;
        }
        // Demo: giả lập gửi mail
        setState((s) => ({ ...s, error: undefined }));
        await new Promise((r) => setTimeout(r, 400));
      },
    };
  }, [state]);

  return <AuthContext.Provider value={api}>{children}</AuthContext.Provider>;
}
