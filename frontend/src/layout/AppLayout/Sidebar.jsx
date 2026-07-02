import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { MdLogout } from "react-icons/md";
import "./SidebarApp.scss";
import {useDispatch} from 'react-redux';
import {logout} from '../../store/authSlice'
export default function Sidebar({ title, items }) {
  const navigate = useNavigate();

  const dispatch = useDispatch();
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

      dispatch(logout())
      navigate("/login", { replace: true });
    } catch {
      globalThis.alert?.("Network error. Please try again.");
    }
  };

  return (
    <aside className="sidebarapp">
      <div className="sidebarapp__header">
        <div className="sidebarapp__brand">
          <svg stroke="currentColor" fill="none" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="22" width="22" xmlns="http://www.w3.org/2000/svg" style={{ color: '#3b82f6', marginRight: '8px', display: 'inline-block', verticalAlign: 'middle' }}>
            <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
            <path d="M3 5V19A9 3 0 0 0 21 19V5"></path>
            <path d="M3 12A9 3 0 0 0 21 12"></path>
            <path d="M9 17h6"></path>
          </svg>
          <span style={{ verticalAlign: 'middle' }}>{title}</span>
        </div>
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