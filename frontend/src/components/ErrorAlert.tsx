import React from "react";

const variants = {
  error: "border-rose-200 bg-rose-50 text-rose-700",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  info: "border-sky-200 bg-sky-50 text-sky-700",
};

const ErrorAlert = ({
  message,
  variant = "error",
  title,
}: {
  message: string;
  variant?: "error" | "warning" | "success" | "info";
  title?: string;
}) => {
  if (!message) {
    return null;
  }

  return (
    <div className={`rounded-lg border px-4 py-3 text-sm ${variants[variant]}`}>
      {title && <p className="mb-1 font-semibold">{title}</p>}
      <p>{message}</p>
    </div>
  );
};

export default ErrorAlert;
