import React, { useEffect, useState } from "react";
import api from "../api/client";
import Pagination from "../components/Pagination";
import TableShell from "../components/TableShell";
import { PaginatedResponse, PaginationMeta, Ticket } from "../types";
import { usePagination } from "../hooks/usePagination";
import { formatDateTime } from "../utils/format";

const TicketsPage = () => {
  const { page, setPage, limit } = usePagination();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>();

  useEffect(() => {
    api.get<PaginatedResponse<Ticket>>(`/api/cars/tickets?page=${page}&limit=${limit}`).then((response) => {
      setTickets(response.data.data);
      setPagination(response.data.pagination);
    });
  }, [page, limit]);

  return (
    <TableShell title="Tickets">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-slate-200 text-slate-500">
          <tr>
            <th className="py-3">Ticket number</th>
            <th>Plate</th>
            <th>Parking</th>
            <th>Issued at</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.id} className="border-b border-slate-100">
              <td className="py-3 font-medium text-slate-900">{ticket.ticketNumber}</td>
              <td>{ticket.printedPayload.plateNumber}</td>
              <td>{ticket.printedPayload.parkingCode}</td>
              <td>{formatDateTime(ticket.issuedAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination meta={pagination} onChange={setPage} />
    </TableShell>
  );
};

export default TicketsPage;
