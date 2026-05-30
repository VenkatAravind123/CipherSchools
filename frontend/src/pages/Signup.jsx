import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";

export default function Signup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");

    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch((import.meta.env.VITE_API_BASE_URL || "http://localhost:5000") + "/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.message || "Signup failed.");
        return;
      }

      // successful signup -> go to login (or change to /curriculum if you prefer)
      navigate("/login");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="header">
        <Link to="/">CipherSQLStudio</Link>
      </div>

      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-head">
            <h1>Create your account</h1>
            <p>Start learning SQL with interactive lessons and practice challenges.</p>
          </div>

          {error ? <div className="form-error">{error}</div> : null}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="name">Full name</label>
              <input
                className="input"
                id="name"
                name="name"
                type="text"
                placeholder="Your name"
                autoComplete="name"
                required
              />
            </div>

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
              />
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                className="input"
                id="password"
                name="password"
                type="password"
                placeholder="Create a password"
                autoComplete="new-password"
                minLength={8}
                required
              />
              <small className="hint">Use at least 8 characters.</small>
            </div>

            <button className="auth-button" type="submit" disabled={loading}>
              {loading ? "Signing up..." : "Sign up"}
            </button>
          </form>

          <div className="auth-footer">
            <span>Already have an account?</span>
            <Link className="link" to="/login">
              Log in
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