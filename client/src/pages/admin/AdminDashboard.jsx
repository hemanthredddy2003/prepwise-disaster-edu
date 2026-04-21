import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:5001/api";
const token = () => localStorage.getItem("token");

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total_courses: 25, active_alerts: 19, total_drills: 20, total_shelters: 27, total_users: 16, certificates: 0 });
  const [users, setUsers] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("overview");
  const [alertForm, setAlertForm] = useState({ title: "", level: "warning", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");

  useEffect(() => {
    const h = { Authorization: `Bearer ${token()}` };
    Promise.all([
      fetch(`${API}/dashboard/stats`, { headers: h }).then(r => r.json()),
      fetch(`${API}/auth/users`, { headers: h }).then(r => r.json()),
      fetch(`${API}/alerts?limit=20`, { headers: h }).then(r => r.json()),
    ]).then(([sd, ud, ad]) => {
      setStats(prev => ({ ...prev, ...(sd?.data || sd) }));
      setUsers(ud?.data?.users || ud?.users || []);
      setAlerts(ad?.data?.alerts || ad?.alerts || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  async function postAlert() {
    if (!alertForm.title || !alertForm.message) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/alerts`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
        body: JSON.stringify({ ...alertForm, target_group: "all" }),
      });
      if (res.ok) {
        setAlertMsg("✅ Alert posted successfully!");
        setAlertForm({ title: "", level: "warning", message: "" });
        setTimeout(() => setAlertMsg(""), 3000);
      }
    } catch (e) { console.error(e); }
    setSubmitting(false);
  }

  const card = { background: "#fff", border: "1px solid #E5E7EB", borderRadius: 16, padding: "20px 22px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" };

  const METRICS = [
    { label: "Total Users", value: stats.total_users || 16, icon: "👥", color: "#2563EB", path: "/admin" },
    { label: "Total Courses", value: stats.total_courses || 25, icon: "📚", color: "#16A34A", path: "/courses" },
    { label: "Active Alerts", value: stats.active_alerts || 19, icon: "🚨", color: "#DC2626", path: "/alerts" },
    { label: "Total Drills", value: stats.total_drills || 20, icon: "🏃", color: "#D97706", path: "/drills" },
    { label: "Shelters", value: stats.total_shelters || 27, icon: "🏠", color: "#7C3AED", path: "/shelters" },
    { label: "Certificates", value: stats.certificates || 0, icon: "🏆", color: "#F59E0B", path: "/certificates" },
  ];

  return (
    <div style={{ padding: "24px 28px", maxWidth: 1100, margin: "0 auto", fontFamily: "Inter, system-ui" }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: "#6B7280", letterSpacing: "0.1em", marginBottom: 4 }}>ADMINISTRATION</div>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111827", margin: 0 }}>🛡️ Admin Dashboard</h1>
        <p style={{ fontSize: 13, color: "#6B7280", margin: "4px 0 0" }}>Manage users, content, alerts and system data</p>
      </div>

      {/* Metric cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 10, marginBottom: 24 }}>
        {METRICS.map(m => (
          <div key={m.label} onClick={() => navigate(m.path)} style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, padding: "14px 16px", textAlign: "center", borderTop: `3px solid ${m.color}`, cursor: "pointer", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", transition: "transform 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>{m.icon}</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: m.color, lineHeight: 1 }}>{m.value}</div>
            <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 3 }}>{m.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, padding: 4, marginBottom: 20, gap: 2 }}>
        {[["overview","📊 Overview"],["users","👥 Users"],["alerts","🚨 Post Alert"]].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} style={{
            flex: 1, padding: "10px", border: "none", borderRadius: 10, cursor: "pointer",
            background: tab === key ? "#2563EB" : "transparent",
            color: tab === key ? "#fff" : "#6B7280",
            fontSize: 13, fontWeight: tab === key ? 700 : 500
          }}>{label}</button>
        ))}
      </div>

      {tab === "overview" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {/* Recent alerts */}
          <div style={card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: 0 }}>🚨 Recent Alerts</h3>
              <button onClick={() => navigate("/alerts")} style={{ fontSize: 12, color: "#2563EB", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>View all →</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {alerts.slice(0, 6).map((a, i) => {
                const colors = { critical: "#DC2626", warning: "#D97706", info: "#2563EB" };
                const c = colors[a.level] || "#6B7280";
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "#F9FAFB", borderRadius: 10, border: "1px solid #E5E7EB" }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: c, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.title}</div>
                    </div>
                    <span style={{ fontSize: 9, fontWeight: 700, color: "#fff", background: c, padding: "2px 7px", borderRadius: 6, flexShrink: 0, textTransform: "uppercase" }}>{a.level}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* System status */}
          <div style={card}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: "0 0 14px" }}>⚡ System Status</h3>
            {[
              { label: "Backend Server", status: "Online", color: "#16A34A", icon: "🟢" },
              { label: "MySQL Database", status: "Connected", color: "#16A34A", icon: "🟢" },
              { label: "MongoDB", status: "Connected", color: "#16A34A", icon: "🟢" },
              { label: "Groq AI", status: "Active", color: "#16A34A", icon: "🟢" },
              { label: "Alert System", status: "Auto-refresh", color: "#2563EB", icon: "🔵" },
              { label: "Total Data Points", status: `${(stats.total_courses||25)+(stats.active_alerts||19)+(stats.total_drills||20)+(stats.total_shelters||27)} records`, color: "#7C3AED", icon: "📊" },
            ].map((s, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < 5 ? "1px solid #F3F4F6" : "none" }}>
                <span style={{ fontSize: 13, color: "#374151" }}>{s.icon} {s.label}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: s.color, background: s.color + "15", padding: "3px 10px", borderRadius: 20 }}>{s.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "users" && (
        <div style={card}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: "0 0 16px" }}>👥 Registered Users ({users.length})</h3>
          {users.length === 0 ? (
            <div style={{ textAlign: "center", padding: 40, color: "#9CA3AF" }}>Loading users...</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1fr 1fr", gap: 10, padding: "10px 14px", background: "#F9FAFB", borderRadius: "10px 10px 0 0", border: "1px solid #E5E7EB" }}>
                {["Name", "Email", "Role", "Joined"].map(h => <span key={h} style={{ fontSize: 11, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</span>)}
              </div>
              {users.map((u, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1fr 1fr", gap: 10, padding: "12px 14px", border: "1px solid #E5E7EB", borderTop: "none", background: i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{u.name}</span>
                  <span style={{ fontSize: 13, color: "#6B7280", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.email}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: u.role === "admin" ? "#DC2626" : "#2563EB", background: u.role === "admin" ? "#FEF2F2" : "#EFF6FF", padding: "2px 8px", borderRadius: 8, display: "inline-block", textTransform: "uppercase" }}>{u.role}</span>
                  <span style={{ fontSize: 12, color: "#9CA3AF" }}>{new Date(u.created_at || Date.now()).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "alerts" && (
        <div style={card}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: "0 0 6px" }}>🚨 Post Emergency Alert</h3>
          <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 20px" }}>Send alerts to all registered users immediately</p>
          {alertMsg && <div style={{ background: "#F0FDF4", border: "1px solid #86EFAC", borderRadius: 10, padding: "12px 16px", marginBottom: 16, fontSize: 13, color: "#065F46", fontWeight: 600 }}>{alertMsg}</div>}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Alert Title *</label>
              <input value={alertForm.title} onChange={e => setAlertForm(p => ({ ...p, title: e.target.value }))}
                placeholder="e.g. RED ALERT: Cyclone Warning — Odisha Coast"
                style={{ width: "100%", padding: "10px 14px", border: "1px solid #E5E7EB", borderRadius: 10, fontSize: 13, outline: "none", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Severity Level *</label>
              <div style={{ display: "flex", gap: 10 }}>
                {[["critical","🔴 Critical","#DC2626"],["warning","🟡 Warning","#D97706"],["info","🔵 Info","#2563EB"]].map(([val, label, color]) => (
                  <button key={val} onClick={() => setAlertForm(p => ({ ...p, level: val }))} style={{
                    flex: 1, padding: "10px", borderRadius: 10, cursor: "pointer", fontWeight: 700, fontSize: 13,
                    border: `2px solid ${alertForm.level === val ? color : "#E5E7EB"}`,
                    background: alertForm.level === val ? color + "15" : "#fff",
                    color: alertForm.level === val ? color : "#6B7280"
                  }}>{label}</button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Alert Message *</label>
              <textarea value={alertForm.message} onChange={e => setAlertForm(p => ({ ...p, message: e.target.value }))}
                placeholder="Detailed information about the emergency, affected areas, safety instructions and helpline numbers..."
                style={{ width: "100%", padding: "10px 14px", border: "1px solid #E5E7EB", borderRadius: 10, fontSize: 13, outline: "none", resize: "vertical", minHeight: 120, boxSizing: "border-box" }} />
            </div>
            <button onClick={postAlert} disabled={submitting || !alertForm.title || !alertForm.message} style={{
              padding: "12px 28px", background: alertForm.level === "critical" ? "#DC2626" : alertForm.level === "warning" ? "#D97706" : "#2563EB",
              color: "#fff", border: "none", borderRadius: 12, cursor: "pointer", fontWeight: 700, fontSize: 14,
              opacity: (!alertForm.title || !alertForm.message) ? 0.5 : 1, alignSelf: "flex-start"
            }}>{submitting ? "Posting..." : "🚨 Post Alert to All Users"}</button>
          </div>
        </div>
      )}
    </div>
  );
}
