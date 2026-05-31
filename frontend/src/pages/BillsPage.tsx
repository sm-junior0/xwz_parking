import React, { useEffect, useState } from "react";
import api from "../api/client";
import Pagination from "../components/Pagination";
import TableShell from "../components/TableShell";
import { usePagination } from "../hooks/usePagination";
import { Bill, PaginatedResponse, PaginationMeta } from "../types";
import { currency, formatDateTime } from "../utils/format";

const BillsPage = () => {
  const { page, setPage, limit } = usePagination();
  const [bills, setBills] = useState<Bill[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>();

  useEffect(() => {
    api.get<PaginatedResponse<Bill>>(`/api/cars/bills?page=${page}&limit=${limit}`).then((response) => {
      setBills(response.data.data);
      setPagination(response.data.pagination);
    });
  }, [page, limit]);

  return (
    <TableShell title="Bills">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-slate-200 text-slate-500">
          <tr>
            <th className="py-3">Bill number</th>
            <th>Hours</th>
            <th>Status</th>
            <th>Generated</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {bills.map((bill) => (
            <tr key={bill.id} className="border-b border-slate-100">
              <td className="py-3 font-medium text-slate-900">{bill.billNumber}</td>
              <td>{bill.hoursCharged}</td>
              <td>{bill.paymentStatus}</td>
              <td>{formatDateTime(bill.generatedAt)}</td>
              <td>{currency(Number(bill.amount))}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination meta={pagination} onChange={setPage} />
    </TableShell>
  );
};

export default BillsPage;
