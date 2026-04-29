import { useState, useRef } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";

const METRICS = [
  { key: "stress",     label: "Stress",      color: "#f87171", emoji: "🔥" },
  { key: "anxiety",    label: "Anxiety",     color: "#fb923c", emoji: "😰" },
  { key: "depression", label: "Depression",  color: "#818cf8", emoji: "🌧️" },
  { key: "loneliness", label: "Loneliness",  color: "#60a5fa", emoji: "🫂" },
  { key: "burnout",    label: "Burnout",     color: "#f472b6", emoji: "💤" },
  { key: "mood",       label: "Mood",        color: "#34d399", emoji: "😊" },
];

const defaultForm = () =>
  Object.fromEntries(METRICS.map((m) => [m.key, 5]));

function getAnalysis(avg) {
  if (avg <= 3) return { label: "You're doing well 🌿", color: "#34d399", detail: "Keep nurturing your wellbeing with rest and connection." };
  if (avg <= 5) return { label: "Moderate — be gentle with yourself 🌤️", color: "#fbbf24", detail: "Some areas need attention. Small habits go a long way." };
  if (avg <= 7) return { label: "Elevated — consider some self-care 🌀", color: "#fb923c", detail: "Your mind is working hard. Rest, breathe, and reach out to someone you trust." };
  return { label: "High load — please seek support 🆘", color: "#f87171", detail: "These levels are significant. Talking to a mental health professional can truly help." };
}

const CustomSlider = ({ metric, value, onChange }) => (
  <div style={{ marginBottom: "1rem" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", color: "#e2e8f0", letterSpacing: "0.02em" }}>
        {metric.emoji} {metric.label}
      </span>
      <span style={{
        background: metric.color + "33",
        color: metric.color,
        borderRadius: "6px",
        padding: "2px 10px",
        fontSize: "0.85rem",
        fontWeight: 700,
        fontFamily: "'DM Mono', monospace",
        minWidth: "36px",
        textAlign: "center",
      }}>
        {value}
      </span>
    </div>
    <div style={{ position: "relative", height: "6px" }}>
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        borderRadius: "99px", background: "#1e293b",
      }} />
      <div style={{
        position: "absolute", top: 0, left: 0, bottom: 0,
        borderRadius: "99px",
        width: `${(value / 10) * 100}%`,
        background: `linear-gradient(90deg, ${metric.color}88, ${metric.color})`,
        transition: "width 0.2s",
      }} />
      <input
        type="range" min={0} max={10} value={value}
        onChange={(e) => onChange(metric.key, Number(e.target.value))}
        style={{
          position: "absolute", top: "-6px", left: 0, right: 0,
          width: "100%", opacity: 0, cursor: "pointer", height: "18px",
        }}
      />
    </div>
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.65rem", color: "#475569", marginTop: "2px" }}>
      <span>0 – None</span><span>5 – Moderate</span><span>10 – Severe</span>
    </div>
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#0f172a", border: "1px solid #334155",
      borderRadius: "10px", padding: "10px 14px",
    }}>
      <p style={{ color: "#94a3b8", fontSize: "0.78rem", margin: "0 0 6px" }}>Entry {label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color, fontSize: "0.82rem", margin: "2px 0" }}>
          {p.name}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  );
};

export default function App() {
  const [form, setForm] = useState(defaultForm());
  const [history, setHistory] = useState([]);
  const [label, setLabel] = useState("");

  const handleChange = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = () => {
    const entry = {
      name: label.trim() || `Entry ${history.length + 1}`,
      ...form,
    };
    setHistory((h) => [...h, entry]);
    setForm(defaultForm());
    setLabel("");
  };

  const handleClear = () => { setHistory([]); setForm(defaultForm()); setLabel(""); };

  // Pie chart: latest entry or form values
  const pieSource = history.length > 0 ? history[history.length - 1] : form;
  const pieData = METRICS.map((m) => ({ name: m.label, value: pieSource[m.key], color: m.color }));

  // Average score for analysis
  const allVals = METRICS.map((m) => (history.length > 0 ? history[history.length - 1][m.key] : form[m.key]));
  const avg = allVals.reduce((a, b) => a + b, 0) / allVals.length;
  const analysis = getAnalysis(avg);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #020617 0%, #0f172a 60%, #1e1b4b 100%)",
      fontFamily: "'DM Sans', sans-serif",
      padding: "2rem 1rem",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=DM+Mono:wght@400;500&family=Playfair+Display:wght@700&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0f172a; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 99px; }
      `}</style>

      <div style={{ maxWidth: "960px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{ fontSize: "0.75rem", letterSpacing: "0.25em", color: "#64748b", textTransform: "uppercase", marginBottom: "0.5rem" }}>
            Mental Health Tracker
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(2rem, 5vw, 3rem)",
            color: "#f1f5f9",
            margin: 0,
            lineHeight: 1.1,
          }}>
            How Are You <span style={{ color: "#818cf8" }}>Feeling</span> Today?
          </h1>
          <p style={{ color: "#64748b", marginTop: "0.75rem", fontSize: "0.92rem" }}>
            Log your mental state, track trends, and get instant insights.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", alignItems: "start" }}>
          {/* Input Panel */}
          <div style={{
            background: "#0f172acc",
            border: "1px solid #1e293b",
            borderRadius: "16px",
            padding: "1.75rem",
            backdropFilter: "blur(10px)",
          }}>
            <h2 style={{ color: "#e2e8f0", fontSize: "1rem", fontWeight: 700, margin: "0 0 1.25rem", letterSpacing: "0.05em" }}>
              📋 Log Your State
            </h2>

            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ color: "#94a3b8", fontSize: "0.8rem", display: "block", marginBottom: "0.4rem" }}>
                Label (optional)
              </label>
              <input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g. Monday morning, After work..."
                style={{
                  width: "100%", background: "#1e293b", border: "1px solid #334155",
                  borderRadius: "8px", color: "#f1f5f9", padding: "0.55rem 0.85rem",
                  fontSize: "0.88rem", outline: "none", fontFamily: "'DM Sans', sans-serif",
                }}
              />
            </div>

            {METRICS.map((m) => (
              <CustomSlider key={m.key} metric={m} value={form[m.key]} onChange={handleChange} />
            ))}

            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
              <button
                onClick={handleSubmit}
                style={{
                  flex: 1, padding: "0.7rem",
                  background: "linear-gradient(135deg, #6366f1, #818cf8)",
                  color: "white", border: "none", borderRadius: "10px",
                  fontWeight: 700, fontSize: "0.92rem", cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.03em",
                  transition: "opacity 0.2s",
                }}
                onMouseOver={(e) => e.target.style.opacity = 0.85}
                onMouseOut={(e) => e.target.style.opacity = 1}
              >
                + Log Entry
              </button>
              {history.length > 0 && (
                <button
                  onClick={handleClear}
                  style={{
                    padding: "0.7rem 1rem",
                    background: "transparent", color: "#64748b",
                    border: "1px solid #334155", borderRadius: "10px",
                    fontSize: "0.85rem", cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Analysis Card */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {/* Analysis Banner */}
            <div style={{
              background: analysis.color + "18",
              border: `1px solid ${analysis.color}55`,
              borderRadius: "14px", padding: "1.25rem 1.5rem",
            }}>
              <div style={{ fontSize: "1.1rem", fontWeight: 700, color: analysis.color, marginBottom: "0.4rem" }}>
                {analysis.label}
              </div>
              <div style={{ color: "#94a3b8", fontSize: "0.88rem", lineHeight: 1.5 }}>
                {analysis.detail}
              </div>
              <div style={{ marginTop: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <div style={{ flex: 1, height: "6px", background: "#1e293b", borderRadius: "99px", overflow: "hidden" }}>
                  <div style={{
                    width: `${(avg / 10) * 100}%`, height: "100%",
                    background: `linear-gradient(90deg, #34d399, ${analysis.color})`,
                    borderRadius: "99px", transition: "width 0.4s",
                  }} />
                </div>
                <span style={{ color: analysis.color, fontFamily: "'DM Mono', monospace", fontSize: "0.85rem", fontWeight: 700 }}>
                  {avg.toFixed(1)} / 10
                </span>
              </div>
            </div>

            {/* Pie Chart */}
            <div style={{
              background: "#0f172acc", border: "1px solid #1e293b",
              borderRadius: "16px", padding: "1.5rem",
            }}>
              <div style={{ color: "#e2e8f0", fontWeight: 700, fontSize: "0.95rem", marginBottom: "0.5rem" }}>
                🍩 Current Breakdown {history.length > 0 ? "(Latest Entry)" : "(Live)"}
              </div>
              <PieChart width={280} height={220} style={{ margin: "0 auto" }}>
                <Pie data={pieData} cx={135} cy={100} innerRadius={55} outerRadius={85}
                  dataKey="value" paddingAngle={3}>
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip formatter={(v, n) => [v, n]} contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: "8px", fontSize: "0.8rem" }} />
                <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{ color: "#94a3b8", fontSize: "0.78rem" }}>{v}</span>} />
              </PieChart>
            </div>
          </div>
        </div>

        {/* Line Chart */}
        {history.length >= 2 && (
          <div style={{
            background: "#0f172acc", border: "1px solid #1e293b",
            borderRadius: "16px", padding: "1.75rem", marginTop: "1.5rem",
          }}>
            <div style={{ color: "#e2e8f0", fontWeight: 700, fontSize: "0.95rem", marginBottom: "1.25rem" }}>
              📈 Trend Over Time ({history.length} entries)
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={history} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 10]} tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{ color: "#94a3b8", fontSize: "0.78rem" }}>{v}</span>} />
                {METRICS.map((m) => (
                  <Line key={m.key} type="monotone" dataKey={m.key} name={m.label}
                    stroke={m.color} strokeWidth={2} dot={{ r: 4, fill: m.color, strokeWidth: 0 }}
                    activeDot={{ r: 6 }} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {history.length < 2 && (
          <div style={{
            textAlign: "center", marginTop: "1.5rem",
            color: "#334155", fontSize: "0.85rem", fontStyle: "italic",
          }}>
            📊 Log at least 2 entries to see your trend line chart
          </div>
        )}

        {/* Log Table */}
        {history.length > 0 && (
          <div style={{
            background: "#0f172acc", border: "1px solid #1e293b",
            borderRadius: "16px", padding: "1.5rem", marginTop: "1.5rem", overflowX: "auto",
          }}>
            <div style={{ color: "#e2e8f0", fontWeight: 700, fontSize: "0.95rem", marginBottom: "1rem" }}>
              🗂️ Entry Log
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
              <thead>
                <tr>
                  <th style={{ color: "#475569", textAlign: "left", padding: "0.4rem 0.75rem", borderBottom: "1px solid #1e293b" }}>Entry</th>
                  {METRICS.map((m) => (
                    <th key={m.key} style={{ color: m.color, textAlign: "center", padding: "0.4rem 0.75rem", borderBottom: "1px solid #1e293b" }}>{m.emoji}</th>
                  ))}
                  <th style={{ color: "#475569", textAlign: "center", padding: "0.4rem 0.75rem", borderBottom: "1px solid #1e293b" }}>Avg</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h, i) => {
                  const rowAvg = (METRICS.reduce((s, m) => s + h[m.key], 0) / METRICS.length).toFixed(1);
                  const ra = getAnalysis(Number(rowAvg));
                  return (
                    <tr key={i} style={{ borderBottom: "1px solid #0f172a" }}>
                      <td style={{ color: "#94a3b8", padding: "0.5rem 0.75rem" }}>{h.name}</td>
                      {METRICS.map((m) => (
                        <td key={m.key} style={{ color: m.color, textAlign: "center", padding: "0.5rem 0.75rem", fontFamily: "'DM Mono', monospace" }}>{h[m.key]}</td>
                      ))}
                      <td style={{ textAlign: "center", padding: "0.5rem 0.75rem" }}>
                        <span style={{ color: ra.color, fontFamily: "'DM Mono', monospace", fontWeight: 700 }}>{rowAvg}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: "2rem", color: "#1e293b", fontSize: "0.75rem" }}>
          This tracker is for personal reflection only. Please consult a professional for mental health concerns. 💙
        </div>
      </div>
    </div>
  );
}
