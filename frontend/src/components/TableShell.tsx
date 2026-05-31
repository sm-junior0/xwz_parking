import React from "react";

const TableShell = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
    </div>
    <div className="overflow-x-auto">{children}</div>
  </section>
);

export default TableShell;
