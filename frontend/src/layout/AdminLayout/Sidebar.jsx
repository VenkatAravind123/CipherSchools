import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { MdLogout } from "react-icons/md";
import "./SidebarAdmin.scss";

export default function Sidebar({ title, items }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await globalThis.fetch((import.meta.env.VITE_API_BASE_URL || "http://localhost:5000") + "/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        globalThis.alert?.(data?.message || "Logout failed.");
        return;
      }

      globalThis.localStorage?.removeItem("user");
      navigate("/login", { replace: true });
    } catch {
      globalThis.alert?.("Network error. Please try again.");
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">{title}</div>

      <nav className="sidebar__nav">
        {items.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            end={it.end}
            className={({ isActive }) =>
              `sidebar__link${isActive ? " sidebar__link--active" : ""}`
            }
          >
            {it.icon && <span className="sidebar__icon">{it.icon}</span>}
            <span className="sidebar__label">{it.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__footer">
        <button type="button" className="sidebar__link1" onClick={handleLogout}>
          <span className="sidebar__label">Log out</span>
          <MdLogout className="sidebar__icon-only" size={20} />
        </button>
      </div>
    </aside>
  );
}