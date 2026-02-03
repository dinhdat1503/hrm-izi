import { useEffect, useMemo, useState } from "react";
import { ApiClient } from "../../../shared/api/apiClient";
import { HttpAccountRepository } from "../data/HttpAccountRepository";
import { GetMe } from "../domain/usecases/GetMe";
import { UpdateProfile } from "../domain/usecases/UpdateProfile";
import { ChangePassword } from "../domain/usecases/ChangePassword";
import type { AccountDTO, Account } from "../domain/Account";
import type { AccountRepository, ChangePasswordInput } from "../domain/AccountRepository";

class InMemoryAccountRepository implements AccountRepository {
  private key = "dev_account_me";

  private defaultData: AccountDTO = {
    id: "u_001",
    fullName: "Người dùng demo",
    email: "demo@gmail.com",
    phone: "0900000000",
    bio: "Mẫu bio để test UI",
    avatarUrl: "",
    notifyEmail: true,
  };

  private read(): AccountDTO {
    const raw = localStorage.getItem(this.key);
    return raw ? (JSON.parse(raw) as AccountDTO) : this.defaultData;
  }

  private write(v: AccountDTO) {
    localStorage.setItem(this.key, JSON.stringify(v));
  }

  async getMe() {
    return this.read();
  }

  async updateProfile(input: Partial<AccountDTO>) {
    const cur = this.read();
    const next = { ...cur, ...input };
    this.write(next);
    return next;
  }

  async changePassword(_input: ChangePasswordInput) {
    // demo: không làm gì
    return;
  }
}

type State = { loading: boolean; error?: string; ok?: string };

export function useAccount() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL as string | undefined;

  const repo = useMemo<AccountRepository>(() => {
    if (baseUrl && baseUrl.trim().length > 0) {
      return new HttpAccountRepository(new ApiClient(baseUrl));
    }
    return new InMemoryAccountRepository();
  }, [baseUrl]);

  const getMeUC = useMemo(() => new GetMe(repo), [repo]);
  const updateUC = useMemo(() => new UpdateProfile(repo), [repo]);
  const changePassUC = useMemo(() => new ChangePassword(repo), [repo]);

  const [account, setAccount] = useState<Account | null>(null);
  const [state, setState] = useState<State>({ loading: true });

  useEffect(() => {
    (async () => {
      try {
        setState({ loading: true });
        const acc = await getMeUC.exec();
        setAccount(acc);
        setState({ loading: false });
      } catch (e: any) {
        setState({ loading: false, error: e?.message || "Không tải được thông tin" });
      }
    })();
  }, [getMeUC]);

  const updateProfile = async (input: any) => {
    if (!account) return;
    try {
      setState({ loading: true });
      const updated = await updateUC.exec(account, input);
      setAccount(updated);
      setState({ loading: false, ok: "Đã lưu" });
      setTimeout(() => setState((s) => ({ ...s, ok: undefined })), 1500);
    } catch (e: any) {
      setState({ loading: false, error: e?.message || "Cập nhật thất bại" });
    }
  };

  const changePassword = async (oldPassword: string, newPassword: string) => {
    try {
      setState({ loading: true });
      await changePassUC.exec({ oldPassword, newPassword });
      setState({ loading: false, ok: "Đổi mật khẩu thành công" });
      setTimeout(() => setState((s) => ({ ...s, ok: undefined })), 1500);
    } catch (e: any) {
      setState({ loading: false, error: e?.message || "Đổi mật khẩu thất bại" });
    }
  };

  return { account, state, updateProfile, changePassword };
}
