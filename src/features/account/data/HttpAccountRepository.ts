import type { AccountRepository, ChangePasswordInput } from "../domain/AccountRepository";
import type { AccountDTO } from "../domain/Account";
import { ApiClient } from "../../../shared/api/apiClient";

export class HttpAccountRepository implements AccountRepository {
  private api: ApiClient;
  constructor(api: ApiClient) {
    this.api = api;
  }

  getMe() {
    return this.api.request<AccountDTO>("/me");
  }

  updateProfile(input: Partial<AccountDTO>) {
    return this.api.request<AccountDTO>("/me", {
      method: "PATCH",
      body: JSON.stringify(input),
    });
  }

  async changePassword(input: ChangePasswordInput) {
    await this.api.request<void>("/me/password", {
      method: "POST",
      body: JSON.stringify(input),
    });
  }
}
