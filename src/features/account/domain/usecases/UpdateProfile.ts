import type { AccountRepository } from "../AccountRepository";
import { Account } from "../Account";

export class UpdateProfile {
  constructor(private repo: AccountRepository) {}

  async exec(current: Account, input: Partial<{ fullName: string; phone?: string; bio?: string; avatarUrl?: string }>) {
    current.updateProfile(input);
    const updated = await this.repo.updateProfile(current.value);
    return new Account(updated);
  }
}
