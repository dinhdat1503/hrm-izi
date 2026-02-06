import { forwardRef } from "react";

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className = "", ...props }, ref) => {
    return (
      <input
        ref={ref}
        {...props}
        className={[
          "w-full rounded-xl border px-3 py-2 text-sm outline-none transition",
          // light mode
          "bg-white text-gray-900 border-gray-200",
          "focus:ring-2 focus:ring-gray-900/20",
          // dark mode
          "dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700",
          "dark:focus:ring-slate-100/20",
          className,
        ].join(" ")}
      />
    );
  }
);

Input.displayName = "Input";
