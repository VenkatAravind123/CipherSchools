import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import { useDispatch  } from "react-redux";
import { loginSuccess } from "../store/authSlice";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch((import.meta.env.VITE_API_BASE_URL || "http://localhost:5000") + "/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // IMPORTANT for cookie-based JWT:
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.message || "Login failed.");
        return;
      }

      // Optional: store user info for UI (cookie holds the real auth)
      if (data?.user) dispatch(loginSuccess(data.user))

      // Role-based redirect (adjust routes to what you actually have)
      if (data?.user?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/app");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="header">
        <Link to="/" className="brand-logo">
          <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="24" width="24" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
            <path d="M3 5V19A9 3 0 0 0 21 19V5"></path>
            <path d="M3 12A9 3 0 0 0 21 12"></path>
            <path d="M9 17h6"></path>
          </svg>
          <span>SQLStudio</span>
        </Link>
      </div>

      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-head">
            <h1>Welcome back to SQLStudio</h1>
            <p>Log in to continue learning SQL with hands-on practice.</p>
          </div>

          {error ? <div className="form-error">{error}</div> : null}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                className="input"
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                required
                disabled={loading}
              />
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                className="input"
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                disabled={loading}
              />
            </div>

            <div className="auth-row">
              <label className="checkbox">
                <input type="checkbox" name="remember" disabled={loading} />
                <span>Remember me</span>
              </label>

              <Link className="link" to="/forgot-password">
                Forgot password?
              </Link>
            </div>

            <button className="auth-button" type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          <div className="auth-footer">
            <span>New here?</span>
            <Link className="link" to="/signup">
              Create an account
            </Link>
          </div>

          <div className="auth-back">
            <Link className="link" to="/">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}