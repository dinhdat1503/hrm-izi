import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className = "", ...props }: Props) {
  return (
    <input
      className={[
        "w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none",
        "focus:ring-2 focus:ring-gray-900/20",
        className,
      ].join(" ")}
      {...props}
    />
  );
}
