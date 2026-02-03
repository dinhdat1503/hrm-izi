import type { UserRepository } from "../UserRepository";
import { User } from "../User";

export class ListUsers {
  private repo: UserRepository;
  constructor(repo: UserRepository) {
    this.repo = repo;
  }
  async exec() {
    const rows = await this.repo.list();
    return rows.map((r) => new User(r));
  }
}
