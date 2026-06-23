import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function EditAssignment() {
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { id } = useParams();
  const [form, setForm] = useState({
    title: "",
    description: "",
    difficulty: "easy",
    category: "",
    setupSQL: "",
    solutionSQL: "",
    hint: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await axios.get(`${API}/api/admin/getassignmentadmin/${id}`, {
          withCredentials: true,
        });
        setAssignment(res.data.assignment);
        setForm(res.data.assignment);
      } catch (err) {
        setError("Failed to fetch assignment.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchAssignment();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await axios.put(`${API}/api/admin/updateassignment/${id}`, form, {
        withCredentials: true,
      });
      setSuccess("Assignment updated successfully!");
      setTimeout(() => navigate("/admin/assignments"), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update assignment.");
    } finally {
      setLoading(false);
    }
  };

  if (!assignment) {
    return (
      <section className="page1 create-assignment">
        <div className="create-assignment__header">
          <h1>Edit Assignment</h1>
          {error ? (
            <div className="create-assignment__alert create-assignment__alert--error">{error}</div>
          ) : (
            <p>Loading assignment...</p>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="page1 create-assignment">
      <div className="create-assignment__header">
        <h1>Edit Assignment: {assignment.title}</h1>
        <p>Update an existing SQL assignment for students.</p>
      </div>

      {error && <div className="create-assignment__alert create-assignment__alert--error">{error}</div>}
      {success && <div className="create-assignment__alert create-assignment__alert--success">{success}</div>}

      <form className="create-assignment__form" onSubmit={handleSubmit}>
        {/* Title */}
        <div className="create-assignment__group">
          <label htmlFor="title">Title *</label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="e.g. SQL SELECT Basics"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        {/* Description */}
        <div className="create-assignment__group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            placeholder="Describe what the student needs to do..."
            rows={3}
            value={form.description}
            onChange={handleChange}
            required
          />
        </div>

        {/* Difficulty + Category */}
        <div className="create-assignment__row">
          <div className="create-assignment__group">
            <label htmlFor="difficulty">Difficulty</label>
            <select
              id="difficulty"
              name="difficulty"
              value={form.difficulty}
              onChange={handleChange}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div className="create-assignment__group">
            <label htmlFor="category">Category</label>
            <input
              id="category"
              name="category"
              type="text"
              placeholder="e.g. SELECT, JOIN, GROUP BY"
              value={form.category}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Setup SQL */}
        <div className="create-assignment__group">
          <label htmlFor="setupSQL">
            Setup SQL
            <span className="create-assignment__hint">CREATE TABLE + INSERT statements</span>
          </label>
          <textarea
            id="setupSQL"
            name="setupSQL"
            placeholder={`CREATE TABLE employees (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  salary INT
);

INSERT INTO employees (name, salary) VALUES
('Alice', 50000),
('Bob', 60000);`}
            rows={8}
            value={form.setupSQL}
            onChange={handleChange}
            className="create-assignment__code"
          />
        </div>

        {/* Solution SQL */}
        <div className="create-assignment__group">
          <label htmlFor="solutionSQL">
            Solution SQL
            <span className="create-assignment__hint">The correct query (hidden from students)</span>
          </label>
          <textarea
            id="solutionSQL"
            name="solutionSQL"
            placeholder="SELECT * FROM employees WHERE salary > 50000;"
            rows={4}
            value={form.solutionSQL}
            onChange={handleChange}
            className="create-assignment__code"
          />
        </div>

        {/* Hint */}
        <div className="create-assignment__group">
          <label htmlFor="hint">
            Hint
            <span className="create-assignment__hint">Optional hint for students</span>
          </label>
          <input
            id="hint"
            name="hint"
            type="text"
            placeholder="e.g. Use WHERE clause to filter rows"
            value={form.hint}
            onChange={handleChange}
          />
        </div>

        {/* Actions */}
        <div className="create-assignment__actions">
          <button
            type="submit"
            className="create-assignment__btn create-assignment__btn--primary"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Assignment"}
          </button>
          <button
            type="button"
            className="create-assignment__btn create-assignment__btn--secondary"
            onClick={() => navigate("/admin/assignments")}
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  )
}