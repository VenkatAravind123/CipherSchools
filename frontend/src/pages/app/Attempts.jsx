import React, { useEffect, useState } from 'react';
// import './Attempts.scss';
import './Assignment.scss'; 
export default function Attempts() {
  const [submissions, setSubmissions] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/api/auth/getsubmissionsbyuser`, {
          credentials: "include",
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data?.message || "Failed to fetch attempts");
        setSubmissions(data.submissions || []);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchAttempts();
  }, []);

  return (
    <section className="attempts-page">
      <h1 className="attempts-title">My Submissions</h1>
      {error && <div className="attempts-error">{error}</div>}
      {submissions.length > 0 ? (
        <div className="attempts-list">
          {submissions.map(sub => (
            <div className={`attempts-card ${sub.passed ? "attempts-card--pass" : "attempts-card--fail"}`} key={sub._id}>
              <div className="attempts-card-header">
                <span className="attempts-status">
                  {sub.passed ? "✅ Passed" : "❌ Failed"}
                </span>
                <span className="attempts-date">
                  {new Date(sub.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="attempts-assignment">
                <strong>Assignment ID:</strong> {sub.assignment?.title || sub.assignment}
              </div>
              <div className="attempts-query">
                <strong>Your Query:</strong>
                <pre>{sub.query}</pre>
              </div>
              {sub.error && (
                <div className="attempts-error-details">
                  <strong>Error:</strong> {sub.error}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="attempts-empty">No attempts found.</p>
      )}
    </section>
  );
}