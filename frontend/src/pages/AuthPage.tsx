import React, { useState } from "react";
import { Redirect, useHistory, useLocation } from "react-router-dom";
import Button from "../components/Button";
import ErrorAlert from "../components/ErrorAlert";
import Input from "../components/Input";
import Select from "../components/Select";
import { useAuth } from "../context/AuthContext";
import { getApiErrorMessage } from "../utils/apiError";

const AuthPage = ({ mode }: { mode: "login" | "signup" }) => {
  const { token, login, signup, verifySignupOtp } = useAuth();
  const history = useHistory();
  const location = useLocation();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "parking_attendant",
  });
  const [otpCode, setOtpCode] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");
  const [otpPreview, setOtpPreview] = useState("");
  const [awaitingOtp, setAwaitingOtp] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (token) {
    return <Redirect to="/" />;
  }

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    try {
      if (mode === "login") {
        await login(form.email, form.password);
        history.push("/");
      } else {
        const response = await signup(form);
        setAwaitingOtp(true);
        setPendingEmail(response.email);
        setOtpPreview(response.otpPreview || "");
        setSuccess("OTP sent successfully. Enter it below to complete signup.");
        return;
      }
    } catch (submitError: any) {
      setError(getApiErrorMessage(submitError, "Unable to complete request"));
    }
  };

  const onVerifyOtp = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    try {
      await verifySignupOtp(pendingEmail, otpCode);
      history.push("/");
    } catch (submitError: any) {
      setError(getApiErrorMessage(submitError, "Unable to verify OTP"));
    }
  };

  return (
    <div className="grid min-h-screen bg-surface lg:grid-cols-2">
      <section className="hidden bg-brand-900 p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-slate-300">XWZ LTD</p>
          <h1 className="mt-6 max-w-md text-5xl font-semibold leading-tight">Responsive parking operations for modern city teams.</h1>
        </div>
        <div className="max-w-md rounded-xl border border-white/10 bg-white/5 p-6">
          <p className="text-lg font-semibold">Signup mockup direction</p>
          <p className="mt-3 text-sm text-slate-200">
            Clean two-column layout, bright form surface, strong labels, balanced spacing, and a compact role selector.
          </p>
        </div>
      </section>
      <section className="flex items-center justify-center p-6">
        <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-8 shadow-panel">
          <p className="text-sm uppercase tracking-wide text-brand-700">XWZ LTD Parking</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-900">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            {mode === "login" ? "Sign in to manage parking operations." : "Register admins and attendants securely."}
          </p>
          {mode === "signup" && !awaitingOtp && (
            <div className="mt-4">
              <ErrorAlert
                variant="info"
                title="Role guidance"
                message="Choose Admin for system management and reports, or Parking Attendant for daily vehicle entry and exit operations. OTP verification is required before the account becomes active."
              />
            </div>
          )}

          {!awaitingOtp ? (
            <>
              <form onSubmit={onSubmit}>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {mode === "signup" && (
                    <>
                      <Input label="First name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
                      <Input label="Last name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
                    </>
                  )}
                  <Input
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                  <Input
                    label="Password"
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                  {mode === "signup" && (
                    <div className="sm:col-span-2">
                      <Select
                        label="Role"
                        value={form.role}
                        onChange={(e) => setForm({ ...form, role: e.target.value })}
                        options={[
                          { value: "admin", label: "Admin" },
                          { value: "parking_attendant", label: "Parking Attendant" },
                        ]}
                      />
                    </div>
                  )}
                </div>
                <div className="mt-4 space-y-3">
                  <ErrorAlert message={error} title="Authentication issue" />
                  {success && <ErrorAlert message={success} variant="success" title="Success" />}
                </div>
                <Button type="submit" className="mt-6 h-11 w-full">
                  {mode === "login" ? "Login" : "Submit"}
                </Button>
              </form>
            </>
          ) : (
            <div className="mt-8">
              <form onSubmit={onVerifyOtp} className="space-y-4">
                <Input label="Email" value={pendingEmail} readOnly />
                <Input label="OTP Code" value={otpCode} onChange={(e) => setOtpCode(e.target.value)} maxLength={6} />
                {otpPreview && (
                  <ErrorAlert
                    title="Development helper"
                    variant="info"
                    message={`The OTP was emailed to ${pendingEmail}. For local testing, the preview code is ${otpPreview}.`}
                  />
                )}
                <ErrorAlert message={error} title="Verification issue" />
                <Button type="submit" className="h-11 w-full">
                  Verify OTP
                </Button>
              </form>
            </div>
          )}

          <p className="mt-4 text-sm text-slate-500">
            {mode === "login" ? "Need an account?" : "Already registered?"}{" "}
            <button
              type="button"
              onClick={() => history.push(mode === "login" ? "/signup" : "/login")}
              className="font-semibold text-brand-700"
            >
              {mode === "login" ? "Sign up" : "Login"}
            </button>
          </p>
          <p className="mt-2 text-xs text-slate-400">Current route: {location.pathname}</p>
        </div>
      </section>
    </div>
  );
};

export default AuthPage;
