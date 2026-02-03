export type UserRole = "admin" | "user";
export type UserStatus = "active" | "inactive";

export type UserDTO = {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string; // ISO
};

export class User {
  private props: UserDTO;

  constructor(dto: UserDTO) {
    this.props = dto;
  }

  get value() {
    return this.props;
  }

  update(input: Partial<Pick<UserDTO, "fullName" | "role" | "status">>) {
    if (input.fullName !== undefined && input.fullName.trim().length < 2) {
      throw new Error("Họ tên tối thiểu 2 ký tự");
    }
    this.props = { ...this.props, ...input };
    return this;
  }
}
