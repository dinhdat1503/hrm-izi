import type { AccountRepository } from "../AccountRepository";
import { Account } from "../Account";

export class GetMe {
  constructor(private repo: AccountRepository) {}
  async exec() {
    const dto = await this.repo.getMe();
    return new Account(dto);
  }
}
