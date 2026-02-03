export type Role = "ADMIN" | "MANAGER" | "USER";
export type Status = "ACTIVE" | "INACTIVE";

export type User = {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: Role;
  status: Status;
  createdAt: string; // ISO
};
