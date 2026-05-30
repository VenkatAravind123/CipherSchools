import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Assignment.scss";
import Editor from "@monaco-editor/react";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function AssignmentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
 const [aiHint, setAiHint] = useState("");
  const [isHintLoading, setIsHintLoading] = useState(false);
  const [assignment, setAssignment] = useState(null);
  const [query, setQuery] = useState("");
  const [runResult, setRunResult] = useState(null);
  const [expectedOutput, setExpectedOutput] = useState(null);
  const [showSchema,setShowSchema] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [loading, setLoading] = useState({
    page: true,
    run: false,
    expected: false,
    submit: false,
  });
  const [error, setError] = useState("");

  // ── Fetch assignment ──────────────────────────────────
  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        setLoading((p) => ({ ...p, page: true }));
        const res = await axios.get(`${API}/api/auth/assignment/${id}`, {
          withCredentials: true,
        });
        setAssignment(res.data.assignment);
      } catch (err) {
        setError("Failed to fetch assignment.");
        console.error(err);
      } finally {
        setLoading((p) => ({ ...p, page: false }));
      }
    };

    if (id) fetchAssignment();
  }, [id]);

  // ── Run query ─────────────────────────────────────────
  const handleRun = async () => {
    if (!query.trim()) return;
    setRunResult(null);
    setSubmitResult(null);
    setLoading((p) => ({ ...p, run: true }));

    try {
      const res = await axios.post(`${API}/api/auth/assignment/${id}/run`,
        { query },
        { withCredentials: true }
      );
      setRunResult(res.data);
    } catch (err) {
      setRunResult({ error: err.response?.data?.message || err.message });
    } finally {
      setLoading((p) => ({ ...p, run: false }));
    }
  };

  // ── Get expected output ───────────────────────────────
  const handleExpected = async () => {
    setLoading((p) => ({ ...p, expected: true }));

    try {
      const res = await axios.get(`${API}/api/auth/getexpectedoutput/${id}`, {
        withCredentials: true,
      });
      setExpectedOutput(res.data);
    } catch (err) {
      setExpectedOutput({ error: err.response?.data?.message || err.message });
    } finally {
      setLoading((p) => ({ ...p, expected: false }));
    }
  };

  // ── Submit query ──────────────────────────────────────
  const handleSubmit = async () => {
    if (!query.trim()) return;
    setSubmitResult(null);
    setRunResult(null);
    setExpectedOutput(null);
    setLoading((p) => ({ ...p, submit: true }));

    try {
      const res = await axios.post(
        `${API}/api/auth/submit/${id}`,
        { query },
        { withCredentials: true }
      );
      setSubmitResult(res.data);
    } catch (err) {
      setSubmitResult({ error: err.response?.data?.message || err.message });
    } finally {
      setLoading((p) => ({ ...p, submit: false }));
    }
  };

  // ── Handle keyboard shortcut (Ctrl+Enter to run) ─────
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleRun();
    }
  };

  const handleGetAiHint = async () =>{
     if (showHint) {
      setShowHint(false);
      return;
    }
    setShowHint(true);
    
    // If we've already generated the hint, don't ping the API again!
    if (aiHint) return;
    // Fetch the AI Hint
    setIsHintLoading(true);
    try {
      const res = await axios.post(
        `${API}/api/auth/assignment/${id}/hint`,
        { 
          currentSQL: query, 
          description: assignment.description,
          setupSQL: assignment.setupSQL
        },
        { withCredentials: true }
      );
      setAiHint(res.data.hint);
    } catch (err) {
      setAiHint(err.response?.data?.message || "Failed to load AI hint.");
    } finally {
      setIsHintLoading(false);
    }
  }

  // ── Loading / Error states ────────────────────────────
  if (loading.page) {
    return (
      <section className="assignment-page">
        <p className="assignment-page__muted">Loading assignment...</p>
      </section>
    );
  }

  if (error || !assignment) {
    return (
      <section className="assignment-page">
        <p className="assignment-page__error">{error || "Assignment not found."}</p>
        <button className="assignment-page__back-btn" onClick={() => navigate(-1)}>
          ← Go Back
        </button>
      </section>
    );
  }

  const badge = (d) =>
    d === "easy" ? "badge--easy" : d === "medium" ? "badge--medium" : "badge--hard";

  return (
    <section className="assignment-page">
      {/* ── Header ─────────────────────────── */}
      <div className="assignment-page__header">
        <button className="assignment-page__back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <div className="assignment-page__meta">
          <span className={`assignment-page__badge ${badge(assignment.difficulty)}`}>
            {assignment.difficulty}
          </span>
          {assignment.category && (
            <span className="assignment-page__category">{assignment.category}</span>
          )}
        </div>
      </div>

      {/* ── Question ───────────────────────── */}
      <div className="assignment-page__question">
        <h1>{assignment.title}</h1>
        <p>{assignment.description}</p>

        {assignment.setupSQL && (
          <div className="assignment-page__schema-section">
            <button className="assignment-page__hint-btn" onClick={() => setShowSchema(!showSchema)}>{showSchema ? "Hide Schema" : "Show Schema"}</button>
            {showSchema && (
              <div style={{ 
                marginTop: '10px', 
                background: '#1e1e1e', 
                padding: '15px', 
                borderRadius: '8px', 
                border: '1px solid #333',
                overflowX: 'auto' 
              }}>
                <pre style={{ margin: 0, color: '#d4d4d4', fontSize: '14px', fontFamily: '"Consolas", monospace' }}>{assignment.setupSQL}</pre>
              </div>
            )}
          </div>
        )}

        {assignment.hint && (
          <div className="assignment-page__hint-section">
            {/* <button
              className="assignment-page__hint-btn"
              onClick={() => setShowHint(!showHint)}
            >
              {showHint ? "Hide Hint" : "💡 Show Hint"}
            </button>
            {showHint && (
              <p className="assignment-page__hint-text">{assignment.hint}</p>
            )} */}
            <button className="assignment-page__hint-btn" onClick={handleGetAiHint} disabled={isHintLoading}>{showHint ? "Hide Hint" : "Get Hint"}</button>
            {showHint && (
    <div className="assignment-page__hint-text" style={{ marginTop: "10px", padding: "10px", borderRadius: "5px" }}>
      {isHintLoading ? (
        <p style={{ color: "#aaa", fontStyle: "italic", margin: 0 }}>🤖 AI is analyzing your code...</p>
      ) : (
        <p style={{ margin: 0 }}>{aiHint}</p>
      )}
    </div>
  )}
          </div>
        )}
      </div>

      {/* ── SQL Editor ─────────────────────── */}
      <div className="assignment-page__editor">
        <div className="assignment-page__editor-header">
          <label>SQL Query</label>
          <span className="assignment-page__shortcut">Ctrl + Enter to Run</span>
        </div>
        {/* <textarea
          className="assignment-page__textarea"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="-- Write your SQL query here&#10;SELECT * FROM employees;"
          rows={8}
          spellCheck={false}
        /> */}
        <Editor height="50vh"
        defaultLanguage="javascript"
        defaultValue="// some comment"
        theme="vs-dark"
        className="monaco-editor"
        onChange={(value) => setQuery(value)}
        onKeyDown={handleKeyDown}
        value={query}
        />
        <div className="assignment-page__actions">
          <button
            className="assignment-page__btn assignment-page__btn--run"
            onClick={handleRun}
            disabled={loading.run || !query.trim()}
          >
            {loading.run ? "Running..." : "▶ Run"}
          </button>
          <button
            className="assignment-page__btn assignment-page__btn--expected"
            onClick={handleExpected}
            disabled={loading.expected}
          >
            {loading.expected ? "Loading..." : "📋 Expected Output"}
          </button>
          <button
            className="assignment-page__btn assignment-page__btn--submit"
            onClick={handleSubmit}
            disabled={loading.submit || !query.trim()}
          >
            {loading.submit ? "Submitting..." : "✓ Submit"}
          </button>
        </div>
      </div>

      {/* ── Submit Result Banner ───────────── */}
      {submitResult && (
        <div
          className={`assignment-page__banner ${
            submitResult.error
              ? "assignment-page__banner--fail"
              : submitResult.passed
              ? "assignment-page__banner--pass"
              : "assignment-page__banner--fail"
          }`}
        >
          {submitResult.error
            ? `❌ Error: ${submitResult.error}`
            : submitResult.passed
            ? "✅ Correct! Your query matches the expected output."
            : "❌ Incorrect. Your output doesn't match the expected output."}
        </div>
      )}

      {/* ── Run Output ─────────────────────── */}
      {runResult && (
        <div className="assignment-page__output-section">
          <h3>Your Output</h3>
          {runResult.error ? (
            <p className="assignment-page__error">{runResult.error}</p>
          ) : (
            <ResultTable columns={runResult.columns} rows={runResult.rows} />
          )}
        </div>
      )}

      {/* ── Submit Comparison (side by side) ── */}
      {submitResult && !submitResult.error && (
        <div className="assignment-page__compare">
          <div className="assignment-page__output-section">
            <h3>Your Output</h3>
            <ResultTable
              columns={submitResult.userOutput?.columns}
              rows={submitResult.userOutput?.rows}
            />
          </div>
          <div className="assignment-page__output-section">
            <h3>Expected Output</h3>
            <ResultTable
              columns={submitResult.expectedOutput?.columns}
              rows={submitResult.expectedOutput?.rows}
            />
          </div>
        </div>
      )}

      {/* ── Expected Output (standalone) ───── */}
      {expectedOutput && !submitResult && (
        <div className="assignment-page__output-section">
          <h3>Expected Output</h3>
          {expectedOutput.error ? (
            <p className="assignment-page__error">{expectedOutput.error}</p>
          ) : (
            <ResultTable
              columns={expectedOutput.columns}
              rows={expectedOutput.rows}
            />
          )}
        </div>
      )}
    </section>
  );
}

// ── Result Table Component ──────────────────────────────
function ResultTable({ columns, rows }) {
  if (!columns?.length || !rows?.length) {
    return <p className="assignment-page__muted">No results returned.</p>;
  }

  return (
    <div className="assignment-page__table-wrap">
      <table className="assignment-page__table">
        <thead>
          <tr>
            {columns.map((col, i) => (
              <th key={i}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {columns.map((col, j) => (
                <td key={j}>
                  {row[col] !== null && row[col] !== undefined
                    ? String(row[col])
                    : "NULL"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="assignment-page__row-count">
        {rows.length} row{rows.length !== 1 ? "s" : ""} returned
      </div>
    </div>
  );
}