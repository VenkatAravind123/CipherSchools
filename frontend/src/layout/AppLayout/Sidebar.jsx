import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { MdLogout } from "react-icons/md";
import "./SidebarApp.scss";

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
    <aside className="sidebarapp">
      <div className="sidebarapp__header">
        <div className="sidebarapp__brand">{title}</div>
      </div>

      <nav className="sidebarapp__nav">
        {items.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            end={it.end}
            className={({ isActive }) =>
              `sidebarapp__link${isActive ? " sidebarapp__link--active" : ""}`
            }
          >
            {it.icon && <span className="sidebarapp__icon">{it.icon}</span>}
            <span className="sidebarapp__label">{it.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebarapp__footer">
        <button type="button" className="sidebarapp__link1s" onClick={handleLogout}>
          <span className="sidebarapp__label">Log out</span>
          <MdLogout className="sidebarapp__icon-only" size={20} />
        </button>
      </div>
    </aside>
  );
}

// Sidebar.propTypes = {
//   title: () => null,
//   items: () => null,
// };