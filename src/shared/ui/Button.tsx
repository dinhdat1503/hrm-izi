import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
};

export function Button({ variant = "primary", className = "", ...props }: Props) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition";

  const styles =
    variant === "primary"
      ? "bg-gray-900 text-white hover:bg-black dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
      : "border border-gray-200 hover:bg-gray-50 text-gray-800 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800";

  return <button className={[base, styles, className].join(" ")} {...props} />;
}
