import React, { createContext, useContext, useMemo, useState } from "react";
import api from "../api/client";
import { User } from "../types";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (payload: Record<string, string>) => Promise<{ email: string; otpPreview?: string }>;
  verifySignupOtp: (email: string, otpCode: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const storedToken = localStorage.getItem("xwz_token");
const storedUser = localStorage.getItem("xwz_user");

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(storedToken);
  const [user, setUser] = useState<User | null>(storedUser ? JSON.parse(storedUser) : null);

  const persistSession = (nextToken: string, nextUser: User) => {
    localStorage.setItem("xwz_token", nextToken);
    localStorage.setItem("xwz_user", JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
  };

  const login = async (email: string, password: string) => {
    const response = await api.post("/api/auth/login", { email, password });
    persistSession(response.data.token, response.data.user);
  };

  const signup = async (payload: Record<string, string>) => {
    const response = await api.post("/api/auth/signup", payload);
    return {
      email: response.data.email,
      otpPreview: response.data.otpPreview,
    };
  };

  const verifySignupOtp = async (email: string, otpCode: string) => {
    const response = await api.post("/api/auth/signup/verify-otp", { email, otpCode });
    persistSession(response.data.token, response.data.user);
  };

  const logout = () => {
    localStorage.removeItem("xwz_token");
    localStorage.removeItem("xwz_user");
    setToken(null);
    setUser(null);
  };

  const value = useMemo(() => ({ user, token, login, signup, verifySignupOtp, logout }), [token, user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
