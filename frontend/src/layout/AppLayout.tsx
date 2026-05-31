import React from "react";
import { BarChart3, CarFront, FileText, LayoutDashboard, LogOut, ParkingCircle, Users } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import classNames from "classnames";
import { useAuth } from "../context/AuthContext";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (confirmed) {
      logout();
    }
  };

  const links = [
    { label: "Dashboard", to: "/", icon: LayoutDashboard, roles: ["admin", "parking_attendant"] },
    { label: "Parkings", to: "/parkings", icon: ParkingCircle, roles: ["admin", "parking_attendant"] },
    { label: "Car Entry", to: "/entries", icon: CarFront, roles: ["admin", "parking_attendant"] },
    { label: "Car Exit", to: "/exits", icon: CarFront, roles: ["admin", "parking_attendant"] },
    { label: "Tickets", to: "/tickets", icon: FileText, roles: ["admin", "parking_attendant"] },
    { label: "Bills", to: "/bills", icon: FileText, roles: ["admin", "parking_attendant"] },
    { label: "Reports", to: "/reports", icon: BarChart3, roles: ["admin"] },
    { label: "Users", to: "/users", icon: Users, roles: ["admin"] },
  ];

  return (
    <div className="min-h-screen bg-surface">
      <div className="grid min-h-screen lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="border-b border-slate-200 bg-brand-900 px-5 py-6 text-white lg:border-b-0 lg:border-r">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-300">XWZ LTD</p>
            <h1 className="mt-2 text-2xl font-semibold">Parking System</h1>
            <p className="mt-2 text-sm text-slate-300">{user?.firstName} {user?.lastName}</p>
          </div>
          <nav className="mt-8 flex flex-col gap-2">
            {links
              .filter((link) => link.roles.includes(user?.role || ""))
              .map(({ icon: Icon, ...link }) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={classNames(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
                    location.pathname === link.to ? "bg-white text-brand-900" : "text-slate-200 hover:bg-white/10"
                  )}
                >
                  <Icon size={18} />
                  {link.label}
                </Link>
              ))}
          </nav>
          <button onClick={handleLogout} className="mt-8 flex items-center gap-2 text-sm font-medium text-slate-200">
            <LogOut size={16} />
            Logout
          </button>
        </aside>
        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
