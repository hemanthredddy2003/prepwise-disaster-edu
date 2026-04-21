import { useState, useEffect } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5001/api";
const token = () => localStorage.getItem("token");

const STATUS = {
  scheduled: { color: "#2563EB", bg: "#EFF6FF", border: "#BFDBFE", icon: "🔔", label: "SCHEDULED" },
  completed: { color: "#16A34A", bg: "#F0FDF4", border: "#BBF7D0", icon: "✅", label: "COMPLETED" },
  cancelled: { color: "#DC2626", bg: "#FEF2F2", border: "#FECACA", icon: "❌", label: "CANCELLED" },
  planned:   { color: "#D97706", bg: "#FFFBEB", border: "#FDE68A", icon: "📋", label: "PLANNED" },
  ongoing:   { color: "#7C3AED", bg: "#F5F3FF", border: "#DDD6FE", icon: "⚡", label: "ONGOING" },
};

function getTypeInfo(type) {
  const t = (type||"").toLowerCase();
  if (t.includes("earthquake")) return { icon: "🏚️", color: "#DC2626" };
  if (t.includes("flood")) return { icon: "🌊", color: "#2563EB" };
  if (t.includes("cyclone")) return { icon: "🌀", color: "#7C3AED" };
  if (t.includes("fire")) return { icon: "🔥", color: "#EA580C" };
  if (t.includes("medical") || t.includes("hospital") || t.includes("casualty")) return { icon: "🚑", color: "#16A34A" };
  if (t.includes("heat")) return { icon: "🌡️", color: "#D97706" };
  if (t.includes("tsunami")) return { icon: "🌊", color: "#0891B2" };
  if (t.includes("landslide")) return { icon: "⛰️", color: "#65A30D" };
  if (t.includes("chemical") || t.includes("industrial")) return { icon: "⚗️", color: "#EC4899" };
  if (t.includes("school")) return { icon: "🏫", color: "#F59E0B" };
  return { icon: "🏃", color: "#6B7280" };
}

export default function DrillScheduler() {
  const [drills, setDrills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ type: "", date: "", building: "", participants: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`${API}/drills`, { headers: { Authorization: `Bearer ${token()}` } })
      .then(r => r.json())
      .then(d => setDrills(d?.data?.drills || d?.drills || []))
      .catch(() => setDrills([]))
      .finally(() => setLoading(false));
  }, []);

  async function scheduleDrill() {
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/drills`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const d = await res.json();
        setDrills(prev => [d?.data?.drill || { ...form, id: Date.now(), status: "scheduled" }, ...prev]);
        setShowForm(false);
        setForm({ type: "", date: "", building: "", participants: "", notes: "" });
      }
    } catch (e) { console.error(e); }
    setSubmitting(false);
  }

  const counts = { ALL: drills.length, SCHEDULED: 0, COMPLETED: 0, PLANNED: 0, CANCELLED: 0 };
  drills.forEach(d => { const s = (d.status||"scheduled").toUpperCase(); if (counts[s] !== undefined) counts[s]++; });
  const filtered = filter === "ALL" ? drills : drills.filter(d => (d.status||"scheduled").toUpperCase() === filter);

  return (
    <div style={{ padding: "24px 28px", maxWidth: 1000, margin: "0 auto", fontFamily: "'Inter', system-ui" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 11, color: "#6B7280", letterSpacing: "0.1em", marginBottom: 4 }}>OPERATIONS — SCHEDULE</div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111827", margin: 0 }}>🏃 Drill Scheduler</h1>
          <p style={{ fontSize: 13, color: "#6B7280", margin: "4px 0 0" }}>Schedule and track emergency preparedness drills — {drills.length} drills total</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{
          padding: "11px 22px", background: "linear-gradient(135deg,#2563EB,#1D4ED8)",
          color: "#fff", border: "none", borderRadius: 12, cursor: "pointer", fontSize: 13, fontWeight: 700
        }}>+ Schedule Drill</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { key: "SCHEDULED", label: "Scheduled", icon: "🔔", color: "#2563EB" },
          { key: "COMPLETED", label: "Completed", icon: "✅", color: "#16A34A" },
          { key: "PLANNED", label: "Planned", icon: "📋", color: "#D97706" },
          { key: "CANCELLED", label: "Cancelled", icon: "❌", color: "#DC2626" },
        ].map(s => (
          <div key={s.key} onClick={() => setFilter(filter === s.key ? "ALL" : s.key)} style={{
            background: filter === s.key ? s.color + "10" : "#fff", border: `1px solid ${filter === s.key ? s.color : "#E5E7EB"}`,
            borderRadius: 14, padding: "16px 18px", cursor: "pointer", borderTop: `3px solid ${s.color}`,
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)", transition: "all 0.15s"
          }}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{counts[s.key]}</div>
            <div style={{ fontSize: 11, color: "#9CA3AF" }}>{s.label} drills</div>
          </div>
        ))}
      </div>

      {showForm && (
        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 16, padding: "20px 24px", marginBottom: 20, boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: "0 0 16px" }}>📋 Schedule New Drill</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { label: "Drill Type *", key: "type", placeholder: "e.g. Earthquake Evacuation Drill" },
              { label: "Date *", key: "date", type: "date" },
              { label: "Location / Building", key: "building", placeholder: "e.g. Government School, Delhi" },
              { label: "Expected Participants", key: "participants", type: "number", placeholder: "e.g. 500" },
            ].map(f => (
              <div key={f.key}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>{f.label}</label>
                <input type={f.type || "text"} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.placeholder} style={{ width: "100%", padding: "9px 12px", border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 13, outline: "none", boxSizing: "border-box" }} />
              </div>
            ))}
            <div style={{ gridColumn: "1/-1" }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Notes / Description</label>
              <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                placeholder="Describe drill objectives and procedures..."
                style={{ width: "100%", padding: "9px 12px", border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 13, outline: "none", resize: "vertical", minHeight: 80, boxSizing: "border-box" }} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button onClick={scheduleDrill} disabled={submitting || !form.type || !form.date} style={{
              padding: "10px 24px", background: "#2563EB", color: "#fff", border: "none", borderRadius: 10,
              cursor: "pointer", fontWeight: 700, fontSize: 13, opacity: (!form.type || !form.date) ? 0.5 : 1
            }}>{submitting ? "Scheduling..." : "Schedule Drill"}</button>
            <button onClick={() => setShowForm(false)} style={{ padding: "10px 20px", background: "#F9FAFB", color: "#374151", border: "1px solid #E5E7EB", borderRadius: 10, cursor: "pointer", fontWeight: 600, fontSize: 13 }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {["ALL", "SCHEDULED", "COMPLETED", "PLANNED", "CANCELLED"].map(f => {
          const cfg = STATUS[f.toLowerCase()] || { color: "#2563EB" };
          const active = filter === f;
          return (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: "7px 16px", borderRadius: 20,
              border: `1px solid ${active ? (f === "ALL" ? "#2563EB" : cfg.color) : "#E5E7EB"}`,
              background: active ? (f === "ALL" ? "#2563EB" : cfg.color) : "#fff",
              color: active ? "#fff" : "#6B7280", fontSize: 12, fontWeight: 600, cursor: "pointer"
            }}>{f} ({f === "ALL" ? drills.length : counts[f] || 0})</button>
          );
        })}
      </div>

      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[1,2,3].map(i => <div key={i} style={{ height: 120, background: "#F9FAFB", borderRadius: 14, border: "1px solid #E5E7EB" }} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, background: "#fff", borderRadius: 16, border: "1px solid #E5E7EB" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 8 }}>No drills found</div>
          <button onClick={() => setFilter("ALL")} style={{ padding: "9px 20px", background: "#2563EB", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>Show all</button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map((d, i) => {
            const status = (d.status || "scheduled").toLowerCase();
            const cfg = STATUS[status] || STATUS.scheduled;
            const typeInfo = getTypeInfo(d.type || d.title);
            const drillDate = d.date ? new Date(d.date) : null;
            const isPast = drillDate && drillDate < new Date();
            return (
              <div key={d.id||i} style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                <div style={{ height: 4, background: `linear-gradient(90deg,${cfg.color},${typeInfo.color})` }} />
                <div style={{ padding: "18px 20px", display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <div style={{ width: 50, height: 50, borderRadius: 14, background: cfg.bg, border: `1px solid ${cfg.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>{cfg.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8, flexWrap: "wrap", gap: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 18 }}>{typeInfo.icon}</span>
                        <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: 0 }}>{d.type || d.title || "Drill"}</h3>
                      </div>
                      <span style={{ fontSize: 10, fontWeight: 700, color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}`, padding: "3px 10px", borderRadius: 20 }}>{cfg.icon} {cfg.label}</span>
                    </div>
                    {d.notes && <p style={{ fontSize: 12, color: "#6B7280", margin: "0 0 10px", lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{d.notes}</p>}
                    <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: 12, color: "#6B7280" }}>
                      {drillDate && (
                        <span style={{ display: "flex", alignItems: "center", gap: 5, color: "#374151", fontWeight: 500 }}>
                          📅 {drillDate.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          {!isPast && status === "scheduled" && <span style={{ fontSize: 9, color: "#16A34A", background: "#F0FDF4", border: "1px solid #86EFAC", padding: "1px 6px", borderRadius: 6, fontWeight: 700 }}>UPCOMING</span>}
                        </span>
                      )}
                      {d.participants > 0 && <span>👥 {Number(d.participants).toLocaleString()} participants</span>}
                      {(d.building || d.location) && <span style={{ display: "flex", alignItems: "center", gap: 4 }}>📍 <span style={{ maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.building || d.location}</span></span>}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
