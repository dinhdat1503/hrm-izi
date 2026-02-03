import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "danger";
};

export function Button({ variant = "primary", className = "", ...props }: Props) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition disabled:opacity-60 disabled:cursor-not-allowed";
  const styles =
    variant === "primary"
      ? "bg-gray-900 text-white hover:bg-black"
      : variant === "danger"
      ? "border border-red-200 text-red-700 hover:bg-red-50"
      : "border border-gray-200 hover:bg-gray-50 text-gray-800";

  return <button className={[base, styles, className].join(" ")} {...props} />;
}
