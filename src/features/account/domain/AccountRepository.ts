import type { AccountDTO } from "./Account";

export type ChangePasswordInput = {
  oldPassword: string;
  newPassword: string;
};

export interface AccountRepository {
  getMe(): Promise<AccountDTO>;
  updateProfile(input: Partial<AccountDTO>): Promise<AccountDTO>;
  changePassword(input: ChangePasswordInput): Promise<void>;
}
