import React, { useEffect, useMemo, useState } from "react";
import api from "../api/client";
import Button from "../components/Button";
import ErrorAlert from "../components/ErrorAlert";
import Input from "../components/Input";
import Select from "../components/Select";
import { CarEntry, PaginatedResponse, Parking } from "../types";
import { getApiErrorMessage } from "../utils/apiError";
import { currency, formatDateTime } from "../utils/format";

const CarFlowPage = ({ mode }: { mode: "entry" | "exit" }) => {
  const [form, setForm] = useState({ plateNumber: "", parkingCode: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [parkings, setParkings] = useState<Parking[]>([]);
  const [activeEntries, setActiveEntries] = useState<CarEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const availableParkings = useMemo(
    () => parkings.filter((parking) => Number(parking.availableSpaces) > 0),
    [parkings]
  );

  const selectedParking = useMemo(
    () => parkings.find((parking) => parking.code === form.parkingCode),
    [parkings, form.parkingCode]
  );

  const selectedActiveEntry = useMemo(
    () => activeEntries.find((entry) => entry.id === form.plateNumber),
    [activeEntries, form.plateNumber]
  );

  const selectedEntryParking = useMemo(
    () => parkings.find((parking) => parking.code === selectedActiveEntry?.parkingCode),
    [parkings, selectedActiveEntry]
  );

  const loadData = async () => {
    try {
      setLoading(true);
      const [parkingRes, entriesRes] = await Promise.all([
        api.get<PaginatedResponse<Parking>>("/api/parkings?page=1&limit=100"),
        api.get<PaginatedResponse<CarEntry>>("/api/cars/entries?page=1&limit=100&status=IN"),
      ]);
      setParkings(parkingRes.data.data);
      setActiveEntries(entriesRes.data.data);
      setError("");
    } catch (loadError: any) {
      setError(getApiErrorMessage(loadError, "Unable to load live parking and vehicle data"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData().catch(() => undefined);
  }, []);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();

    const payload =
      mode === "exit" && selectedActiveEntry
        ? {
            plateNumber: selectedActiveEntry.plateNumber,
            parkingCode: selectedActiveEntry.parkingCode,
          }
        : {
            plateNumber: form.plateNumber.toUpperCase(),
            parkingCode: form.parkingCode,
          };

    const confirmed = window.confirm(
      mode === "entry"
        ? `Register entry for ${payload.plateNumber} at ${payload.parkingCode}? A ticket will be generated immediately.`
        : `Register exit for ${payload.plateNumber} from ${payload.parkingCode}? A bill will be generated immediately.`
    );

    if (!confirmed) {
      return;
    }

    const endpoint = mode === "entry" ? "/api/cars/entries" : "/api/cars/exits";

    try {
      const response = await api.post(endpoint, payload);
      setMessage(response.data.message);
      setError("");
      setForm({ plateNumber: "", parkingCode: "" });
      await loadData();
    } catch (submitError: any) {
      setError(getApiErrorMessage(submitError, "Unable to save this transaction"));
      setMessage("");
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <header>
        <p className="text-sm uppercase tracking-wide text-brand-700">Car service</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">
          {mode === "entry" ? "Register car entry" : "Register car exit"}
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          {mode === "entry"
            ? "Pick a parking with free space and capture the plate number. The system will issue a ticket and reduce capacity."
            : "Pick an active parked car to exit it quickly. The system will calculate charges and generate the bill."}
        </p>
      </header>

      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-panel">
        <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
          {mode === "entry" ? (
            <>
              <Input
                label="Plate number"
                value={form.plateNumber}
                onChange={(e) => setForm({ ...form, plateNumber: e.target.value.toUpperCase() })}
                placeholder="RAB123A"
              />
              <Select
                label="Available parking"
                value={form.parkingCode}
                onChange={(e) => setForm({ ...form, parkingCode: e.target.value })}
                options={[
                  { value: "", label: loading ? "Loading parkings..." : "Select a parking" },
                  ...availableParkings.map((parking) => ({
                    value: parking.code,
                    label: `${parking.code} - ${parking.parkingName} (${parking.availableSpaces} free)`,
                  })),
                ]}
              />
            </>
          ) : (
            <>
              <Select
                label="Active parked cars"
                value={form.plateNumber}
                onChange={(e) => {
                  const entry = activeEntries.find((item) => item.id === e.target.value);
                  setForm({
                    plateNumber: e.target.value,
                    parkingCode: entry?.parkingCode || "",
                  });
                }}
                options={[
                  { value: "", label: loading ? "Loading active entries..." : "Select an active entry" },
                  ...activeEntries.map((entry) => ({
                    value: entry.id,
                    label: `${entry.plateNumber} - ${entry.parkingCode} - entered ${new Date(entry.entryDateTime).toLocaleTimeString()}`,
                  })),
                ]}
              />
              <Input label="Parking code" value={selectedActiveEntry?.parkingCode || form.parkingCode} readOnly />
            </>
          )}

          {mode === "entry" && selectedParking && (
            <div className="md:col-span-2 space-y-3">
              <ErrorAlert
                variant={Number(selectedParking.availableSpaces) <= 3 ? "warning" : "info"}
                title={Number(selectedParking.availableSpaces) <= 3 ? "Low capacity warning" : "Parking summary"}
                message={`${selectedParking.parkingName} at ${selectedParking.location} has ${selectedParking.availableSpaces} free spaces left. Charging fee: ${currency(Number(selectedParking.chargingFeePerHour))} per hour.`}
              />
              {Number(selectedParking.availableSpaces) === 1 && (
                <ErrorAlert
                  variant="warning"
                  title="Last space alert"
                  message="This action will consume the final available space in this parking area. Double-check the plate number before continuing."
                />
              )}
            </div>
          )}

          {mode === "exit" && selectedActiveEntry && (
            <div className="md:col-span-2 space-y-3">
              <ErrorAlert
                variant="info"
                title="Exit preview"
                message={`${selectedActiveEntry.plateNumber} entered at ${formatDateTime(selectedActiveEntry.entryDateTime)} in ${selectedActiveEntry.parkingCode}. Continuing will calculate the duration and generate the bill.`}
              />
              {selectedEntryParking && (
                <ErrorAlert
                  variant={Number(selectedEntryParking.availableSpaces) <= 2 ? "warning" : "success"}
                  title={
                    Number(selectedEntryParking.availableSpaces) <= 2
                      ? "This exit will free a tight parking area"
                      : "Capacity will be restored"
                  }
                  message={`${selectedEntryParking.parkingName} currently has ${selectedEntryParking.availableSpaces} free spaces. Completing this exit will increase availability and update the bill using ${currency(Number(selectedEntryParking.chargingFeePerHour))} per hour.`}
                />
              )}
            </div>
          )}

          <div className="md:col-span-2">
            <Button
              type="submit"
              className="h-11"
              disabled={
                loading ||
                (mode === "entry" ? !form.plateNumber || !form.parkingCode : !selectedActiveEntry)
              }
            >
              {mode === "entry" ? "Generate ticket" : "Generate bill"}
            </Button>
          </div>
        </form>

        <div className="mt-4 space-y-4">
          <ErrorAlert message={error} title="Action blocked" />
          {message && <ErrorAlert message={message} variant="success" title="Completed" />}
        </div>
      </section>
    </div>
  );
};

export default CarFlowPage;
