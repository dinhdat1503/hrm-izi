import type { UserRepository } from "../UserRepository";

export class DeleteUser {
  private repo: UserRepository;
  constructor(repo: UserRepository) {
    this.repo = repo;
  }

  exec(id: string) {
    return this.repo.remove(id);
  }
}
