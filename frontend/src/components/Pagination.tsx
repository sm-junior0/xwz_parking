import React from "react";
import Button from "./Button";
import { PaginationMeta } from "../types";

const Pagination = ({
  meta,
  onChange,
}: {
  meta?: PaginationMeta;
  onChange: (page: number) => void;
}) => {
  if (!meta) {
    return null;
  }

  return (
    <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-4">
      <p className="text-sm text-slate-500">
        Page {meta.currentPage} of {meta.totalPages} · {meta.totalItems} items
      </p>
      <div className="flex gap-2">
        <Button variant="secondary" disabled={meta.currentPage <= 1} onClick={() => onChange(meta.currentPage - 1)}>
          Previous
        </Button>
        <Button
          variant="secondary"
          disabled={meta.currentPage >= meta.totalPages}
          onClick={() => onChange(meta.currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
