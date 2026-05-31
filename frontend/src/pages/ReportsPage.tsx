import React, { useState } from "react";
import api from "../api/client";
import Button from "../components/Button";
import Input from "../components/Input";
import TableShell from "../components/TableShell";
import { CarEntry } from "../types";
import { currency, formatDateTime } from "../utils/format";

const ReportsPage = () => {
  const [reportType, setReportType] = useState("entered-cars");
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");
  const [rows, setRows] = useState<CarEntry[]>([]);
  const [total, setTotal] = useState<number | null>(null);

  const load = async (event: React.FormEvent) => {
    event.preventDefault();
    const response = await api.get(`/api/reports/${reportType}?startDateTime=${startDateTime}&endDateTime=${endDateTime}`);
    setRows(response.data.data);
    setTotal(response.data.totalAmountCharged ?? null);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-panel">
        <h1 className="text-3xl font-semibold text-slate-900">Reports</h1>
        <form onSubmit={load} className="mt-6 grid gap-4 md:grid-cols-4">
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            <span>Report type</span>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="h-11 rounded-lg border border-slate-200 px-3"
            >
              <option value="entered-cars">Entered cars</option>
              <option value="outgoing-cars">Outgoing cars</option>
              <option value="revenue">Revenue</option>
            </select>
          </label>
          <Input label="Start date and time" type="datetime-local" value={startDateTime} onChange={(e) => setStartDateTime(e.target.value)} />
          <Input label="End date and time" type="datetime-local" value={endDateTime} onChange={(e) => setEndDateTime(e.target.value)} />
          <div className="flex items-end">
            <Button type="submit" className="h-11 w-full">Generate</Button>
          </div>
        </form>
        {total !== null && <p className="mt-4 text-sm font-medium text-brand-700">Total amount charged: {currency(total)}</p>}
      </section>

      <TableShell title="Report results">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-slate-500">
            <tr>
              <th className="py-3">Plate</th>
              <th>Parking</th>
              <th>Entry</th>
              <th>Exit</th>
              <th>Charge</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-slate-100">
                <td className="py-3 font-medium text-slate-900">{row.plateNumber}</td>
                <td>{row.parkingCode}</td>
                <td>{formatDateTime(row.entryDateTime)}</td>
                <td>{formatDateTime(row.exitDateTime)}</td>
                <td>{currency(Number(row.chargedAmount))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableShell>
    </div>
  );
};

export default ReportsPage;
