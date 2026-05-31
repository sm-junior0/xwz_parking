import React from "react";
import classNames from "classnames";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

const Button = ({ className, variant = "primary", ...props }: ButtonProps) => (
  <button
    className={classNames(
      "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-brand-500/40 disabled:opacity-60",
      variant === "primary"
        ? "bg-brand-500 text-white hover:bg-brand-700"
        : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
      className
    )}
    {...props}
  />
);

export default Button;
