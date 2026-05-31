import React, { useEffect, useState } from "react";
import api from "../api/client";
import StatCard from "../components/StatCard";
import TableShell from "../components/TableShell";
import { Bill, CarEntry, PaginatedResponse, Parking } from "../types";
import { currency, formatDateTime } from "../utils/format";

const DashboardPage = () => {
  const [parkings, setParkings] = useState<Parking[]>([]);
  const [entries, setEntries] = useState<CarEntry[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);

  useEffect(() => {
    const load = async () => {
      const [parkingsRes, entriesRes, billsRes] = await Promise.all([
        api.get<PaginatedResponse<Parking>>("/api/parkings?limit=5"),
        api.get<PaginatedResponse<CarEntry>>("/api/cars/entries?limit=5"),
        api.get<PaginatedResponse<Bill>>("/api/cars/bills?limit=5"),
      ]);
      setParkings(parkingsRes.data.data);
      setEntries(entriesRes.data.data);
      setBills(billsRes.data.data);
    };

    load().catch(() => undefined);
  }, []);

  const totalSpaces = parkings.reduce((sum, parking) => sum + Number(parking.availableSpaces), 0);
  const totalRevenue = bills.reduce((sum, bill) => sum + Number(bill.amount), 0);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm uppercase tracking-wide text-brand-700">Overview</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Operational dashboard</h1>
      </header>
      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Registered parkings" value={String(parkings.length)} hint="Current visible parking areas" />
        <StatCard label="Available spaces" value={String(totalSpaces)} hint="Live remaining capacity" />
        <StatCard label="Recent billing" value={currency(totalRevenue)} hint="Sum of loaded bills" />
      </section>
      <div className="grid gap-6 xl:grid-cols-2">
        <TableShell title="Latest car entries">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-slate-500">
              <tr>
                <th className="py-3">Plate</th>
                <th>Parking</th>
                <th>Entry</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id} className="border-b border-slate-100">
                  <td className="py-3 font-medium text-slate-900">{entry.plateNumber}</td>
                  <td>{entry.parkingCode}</td>
                  <td>{formatDateTime(entry.entryDateTime)}</td>
                  <td>{entry.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableShell>
        <TableShell title="Latest bills">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-slate-500">
              <tr>
                <th className="py-3">Bill</th>
                <th>Hours</th>
                <th>Status</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {bills.map((bill) => (
                <tr key={bill.id} className="border-b border-slate-100">
                  <td className="py-3 font-medium text-slate-900">{bill.billNumber}</td>
                  <td>{bill.hoursCharged}</td>
                  <td>{bill.paymentStatus}</td>
                  <td>{currency(Number(bill.amount))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableShell>
      </div>
    </div>
  );
};

export default DashboardPage;
