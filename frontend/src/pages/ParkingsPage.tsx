import React, { useEffect, useState } from "react";
import api from "../api/client";
import Button from "../components/Button";
import Input from "../components/Input";
import Pagination from "../components/Pagination";
import TableShell from "../components/TableShell";
import ErrorAlert from "../components/ErrorAlert";
import { useAuth } from "../context/AuthContext";
import { usePagination } from "../hooks/usePagination";
import { PaginatedResponse, PaginationMeta, Parking } from "../types";
import { getApiErrorMessage } from "../utils/apiError";
import { currency } from "../utils/format";

const ParkingsPage = () => {
  const { user } = useAuth();
  const { page, setPage, limit } = usePagination();
  const [parkings, setParkings] = useState<Parking[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    code: "",
    parkingName: "",
    availableSpaces: "",
    location: "",
    chargingFeePerHour: "",
  });

  const load = async () => {
    try {
      const response = await api.get<PaginatedResponse<Parking>>(`/api/parkings?page=${page}&limit=${limit}`);
      setParkings(response.data.data);
      setPagination(response.data.pagination);
      setError("");
    } catch (loadError: any) {
      setError(getApiErrorMessage(loadError, "Unable to load parking areas"));
    }
  };

  useEffect(() => {
    load().catch(() => undefined);
  }, [page, limit]);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const confirmed = window.confirm("Are you sure you want to register this parking area?");
    if (!confirmed) {
      return;
    }

    try {
      await api.post("/api/parkings", {
        ...form,
        availableSpaces: Number(form.availableSpaces),
        chargingFeePerHour: Number(form.chargingFeePerHour),
      });
      setForm({ code: "", parkingName: "", availableSpaces: "", location: "", chargingFeePerHour: "" });
      setError("");
      setSuccess("Parking area registered successfully.");
      load().catch(() => undefined);
    } catch (submitError: any) {
      setError(getApiErrorMessage(submitError, "Unable to register parking"));
      setSuccess("");
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm uppercase tracking-wide text-brand-700">Parking service</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Parking areas</h1>
      </header>
      <div className="space-y-3">
        <ErrorAlert message={error} title="Parking service issue" />
        {success && <ErrorAlert message={success} variant="success" title="Completed" />}
      </div>

      {user?.role === "admin" && (
        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-panel">
          <h2 className="text-lg font-semibold text-slate-900">Register parking</h2>
          <div className="mt-4">
            <ErrorAlert
              variant="info"
              title="Admin control"
              message="Only admins can create parking areas. Capacity entered here becomes the starting available space for attendants during entry and exit operations."
            />
          </div>
          <form onSubmit={onSubmit} className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <Input label="Code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
            <Input
              label="Parking name"
              value={form.parkingName}
              onChange={(e) => setForm({ ...form, parkingName: e.target.value })}
            />
            <Input
              label="Available spaces"
              type="number"
              value={form.availableSpaces}
              onChange={(e) => setForm({ ...form, availableSpaces: e.target.value })}
            />
            <Input label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            <Input
              label="Fee per hour"
              type="number"
              value={form.chargingFeePerHour}
              onChange={(e) => setForm({ ...form, chargingFeePerHour: e.target.value })}
            />
            <div className="xl:col-span-5">
              <Button type="submit" className="h-11">Save parking</Button>
            </div>
          </form>
        </section>
      )}

      <TableShell title="Parking list">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-slate-500">
            <tr>
              <th className="py-3">Code</th>
              <th>Name</th>
              <th>Location</th>
              <th>Available</th>
              <th>Total</th>
              <th>Fee / hour</th>
            </tr>
          </thead>
          <tbody>
            {parkings.map((parking) => (
              <tr key={parking.id} className="border-b border-slate-100">
                <td className="py-3 font-medium text-slate-900">{parking.code}</td>
                <td>{parking.parkingName}</td>
                <td>{parking.location}</td>
                <td>
                  <span
                    className={
                      Number(parking.availableSpaces) <= 3 ? "font-semibold text-amber-700" : "text-slate-700"
                    }
                  >
                    {parking.availableSpaces}
                  </span>
                </td>
                <td>{parking.totalSpaces}</td>
                <td>{currency(Number(parking.chargingFeePerHour))}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination meta={pagination} onChange={setPage} />
      </TableShell>
    </div>
  );
};

export default ParkingsPage;
