import React from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, ...rest }: RouteProps & { children: React.ReactNode }) => {
  const { token } = useAuth();
  return <Route {...rest} render={() => (token ? children : <Redirect to="/login" />)} />;
};

export default ProtectedRoute;
