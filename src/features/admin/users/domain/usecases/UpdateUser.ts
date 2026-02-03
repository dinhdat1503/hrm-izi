import type { UserRepository, UpdateUserInput } from "../UserRepository";
import { User } from "../User";

export class UpdateUser {
  private repo: UserRepository;
  constructor(repo: UserRepository) {
    this.repo = repo;
  }

  async exec(current: User, input: UpdateUserInput) {
    current.update(input);
    const dto = await this.repo.update(current.value.id, current.value);
    return new User(dto);
  }
}
