import React from "react";
import "./Dashboard.scss";
import {useSelector } from 'react-redux';



function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function getDisplayName(user) {
  try {
    if (!user) return "";    
    return user?.name || user?.username || "";
  } catch {
    return "";
  }
}

export default function Dashboard() {
  const greeting = getGreeting();
  
  const user = useSelector((state) => state.auth.user);
  const name = getDisplayName(user);
  // Replace with real API data later
  const stats = {
    completed: 12,
    inProgress: 5,
    accuracy: 0.87,
    streakDays: 7,
  };

  const assignments = [
    { id: 1, title: "SQL SELECT Basics", status: "Completed", time: "Today" },
    { id: 2, title: "WHERE + AND/OR", status: "In progress", time: "Yesterday" },
    { id: 3, title: "JOINs Practice Set", status: "Started", time: "2 days ago" },
  ];

  // const nextUp = [
  //   { id: "n1", title: "GROUP BY & Aggregations", level: "Intermediate", eta: "15 min" },
  //   { id: "n2", title: "HAVING vs WHERE", level: "Intermediate", eta: "10 min" },
  //   { id: "n3", title: "LEFT JOIN Patterns", level: "Intermediate", eta: "20 min" },
  // ];

  return (
    <section className="page1 dashboard">
      <header className="dashboard__header">
        <div>
          <h1>
            {greeting}
            {name ? `, ${name}` : ""}!
          </h1>
          <p>Track your SQL learning progress and continue where you left off.</p>
        </div>

        <div className="dashboard__actions" aria-label="Quick actions">
          <button className="dashboard__btn" type="button">
            Continue learning
          </button>
          <button className="dashboard__btn dashboard__btn--secondary" type="button">
            Start new assignment
          </button>
        </div>
      </header>

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <span className="dashboard-card__value">{stats.completed}</span>
          <span className="dashboard-card__label">Assignments Completed</span>
        </div>

        <div className="dashboard-card">
          <span className="dashboard-card__value">{stats.inProgress}</span>
          <span className="dashboard-card__label">In Progress</span>
        </div>

        <div className="dashboard-card">
          <span className="dashboard-card__value">
            {Math.round(stats.accuracy * 100)}%
          </span>
          <span className="dashboard-card__label">Accuracy</span>
        </div>

        <div className="dashboard-card">
          <span className="dashboard-card__value">{stats.streakDays}</span>
          <span className="dashboard-card__label">Day Streak</span>
        </div>
      </div>

      <div className="dashboard__grid">
        <section className="dashboard-panel dashboard-panel--wide">
          <div className="dashboard-panel__header">
            <h2>Assignments</h2>
            <button type="button" className="dashboard-panel__link">
              View all
            </button>
          </div>

          <ul className="dashboard-list">
            {assignments.map((r) => (
              <li key={r.id} className="dashboard-list__item">
                <div className="dashboard-list__main">
                  <div className="dashboard-list__title">{r.title}</div>
                  <div className="dashboard-list__meta">{r.time}</div>
                </div>

                <span
                  className={`dashboard-badge ${
                    r.status === "Completed"
                      ? "dashboard-badge--success"
                      : r.status === "In progress"
                      ? "dashboard-badge--warn"
                      : "dashboard-badge--neutral"
                  }`}
                >
                  {r.status}
                </span>
              </li>
            ))}
          </ul>
        </section>


        <section className="dashboard-panel dashboard-panel--wide">
          <div className="dashboard-panel__header">
            <h2>Progress overview</h2>
            <div className="dashboard-panel__hint">This week</div>
          </div>

          <div className="dashboard-progress">
            <div className="dashboard-progress__row">
              <div className="dashboard-progress__label">Assignments done</div>
              <div className="dashboard-progress__bar">
                <div className="dashboard-progress__fill" style={{ width: "70%" }} />
              </div>
              <div className="dashboard-progress__value">7/10</div>
            </div>

            <div className="dashboard-progress__row">
              <div className="dashboard-progress__label">Practice minutes</div>
              <div className="dashboard-progress__bar">
                <div className="dashboard-progress__fill dashboard-progress__fill--alt" style={{ width: "55%" }} />
              </div>
              <div className="dashboard-progress__value">110/200</div>
            </div>

            <div className="dashboard-progress__row">
              <div className="dashboard-progress__label">Accuracy target</div>
              <div className="dashboard-progress__bar">
                <div className="dashboard-progress__fill dashboard-progress__fill--good" style={{ width: "87%" }} />
              </div>
              <div className="dashboard-progress__value">87%</div>
            </div>
          </div>
        </section>

        <section className="dashboard-panel">
          <div className="dashboard-panel__header">
            <h2>Tip</h2>
          </div>
          <p className="dashboard-tip">
            Use <code>EXPLAIN</code> to understand query plans and optimize slow
            queries.
          </p>
        </section>
      </div>
    </section>
  );
}