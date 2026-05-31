import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Input = ({ label, ...props }: InputProps) => (
  <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
    <span>{label}</span>
    <input
      className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none ring-0 transition focus:border-brand-500"
      {...props}
    />
  </label>
);

export default Input;
