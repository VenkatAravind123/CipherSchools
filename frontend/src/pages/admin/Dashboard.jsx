import React from 'react'
import "./Admin.scss";

export default function Dashboard() {
  
  return (
    <section className="page1">
      <h1>Welcome back!</h1>
      <p>Track your SQL learning progress and continue where you left off.</p>

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <span className="dashboard-card__value">12</span>
          <span className="dashboard-card__label">Assignments Completed</span>
        </div>

        <div className="dashboard-card">
          <span className="dashboard-card__value">5</span>
          <span className="dashboard-card__label">In Progress</span>
        </div>

        <div className="dashboard-card">
          <span className="dashboard-card__value">87%</span>
          <span className="dashboard-card__label">Accuracy</span>
        </div>

        <div className="dashboard-card">
          <span className="dashboard-card__value">7</span>
          <span className="dashboard-card__label">Day Streak 🔥</span>
        </div>
      </div>
    </section>
  )
}
