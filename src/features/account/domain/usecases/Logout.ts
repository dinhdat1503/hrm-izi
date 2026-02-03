import type { AuthRepository } from "../AuthRepository";

export class Logout {
  constructor(private repo: AuthRepository) {}
  exec() {
    return this.repo.logout();
  }
}
