export type AccountDTO = {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  bio?: string;
  notifyEmail: boolean;
};

export class Account {
  constructor(private props: AccountDTO) {}

  get value() {
    return this.props;
  }

  updateProfile(input: Partial<Pick<AccountDTO, "fullName" | "phone" | "bio" | "avatarUrl">>) {
    if (input.fullName !== undefined && input.fullName.trim().length < 2) {
      throw new Error("Họ tên phải có ít nhất 2 ký tự");
    }
    this.props = { ...this.props, ...input };
    return this;
  }

  toggleEmailNotification(v: boolean) {
    this.props = { ...this.props, notifyEmail: v };
    return this;
  }
}
