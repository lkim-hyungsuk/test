import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { clearToken } from "./useAuth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const navClass = ({ isActive }: { isActive: boolean }) =>
    `block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive ? "bg-forest text-white" : "text-gray-600 hover:bg-gray-100"
    }`;

  function logout() {
    clearToken();
    navigate("/admin/login");
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-52 shrink-0 bg-white border-r border-gray-200 p-4 flex flex-col gap-1">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-3">Admin</p>
        <NavLink to="/admin/queue" className={navClass}>Article Queue</NavLink>
        <NavLink to="/admin/tutorials" className={navClass}>Tutorials</NavLink>
        <NavLink to="/admin/compose" className={navClass}>Compose</NavLink>
        <NavLink to="/admin/subscribers" className={navClass}>Subscribers</NavLink>
        <div className="mt-auto">
          <button onClick={logout} className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-gray-100">
            Log out
          </button>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
