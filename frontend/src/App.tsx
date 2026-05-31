import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import ProtectedRoute from "./layout/ProtectedRoute";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import ParkingsPage from "./pages/ParkingsPage";
import CarFlowPage from "./pages/CarFlowPage";
import TicketsPage from "./pages/TicketsPage";
import BillsPage from "./pages/BillsPage";
import ReportsPage from "./pages/ReportsPage";
import UsersPage from "./pages/UsersPage";
import { useAuth } from "./context/AuthContext";

const AppShell = ({ children }: { children: React.ReactNode }) => <AppLayout>{children}</AppLayout>;

const App = () => {
  const { user } = useAuth();

  return (
    <Switch>
      <Route path="/login" render={() => <AuthPage mode="login" />} />
      <Route path="/signup" render={() => <AuthPage mode="signup" />} />
      <ProtectedRoute exact path="/">
        <AppShell>
          <DashboardPage />
        </AppShell>
      </ProtectedRoute>
      <ProtectedRoute path="/parkings">
        <AppShell>
          <ParkingsPage />
        </AppShell>
      </ProtectedRoute>
      <ProtectedRoute path="/entries">
        <AppShell>
          <CarFlowPage mode="entry" />
        </AppShell>
      </ProtectedRoute>
      <ProtectedRoute path="/exits">
        <AppShell>
          <CarFlowPage mode="exit" />
        </AppShell>
      </ProtectedRoute>
      <ProtectedRoute path="/tickets">
        <AppShell>
          <TicketsPage />
        </AppShell>
      </ProtectedRoute>
      <ProtectedRoute path="/bills">
        <AppShell>
          <BillsPage />
        </AppShell>
      </ProtectedRoute>
      <ProtectedRoute path="/reports">
        {user?.role === "admin" ? (
          <AppShell>
            <ReportsPage />
          </AppShell>
        ) : (
          <Redirect to="/" />
        )}
      </ProtectedRoute>
      <ProtectedRoute path="/users">
        {user?.role === "admin" ? (
          <AppShell>
            <UsersPage />
          </AppShell>
        ) : (
          <Redirect to="/" />
        )}
      </ProtectedRoute>
      <Redirect to="/" />
    </Switch>
  );
};

export default App;
