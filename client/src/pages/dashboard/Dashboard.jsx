import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:5001/api";
const token = () => localStorage.getItem("token");

const QUICK_ACTIONS = [
  { label: "What do I do NOW?", desc: "Instant emergency guidance", icon: "⚡", path: "/emergency-action", color: "#DC2626", bg: "linear-gradient(135deg,#FEF2F2,#FEE2E2)", border: "#FCA5A5" },
  { label: "Find Shelter Near Me", desc: "27 shelters across India", icon: "🏠", path: "/shelters", color: "#1D4ED8", bg: "linear-gradient(135deg,#EFF6FF,#DBEAFE)", border: "#93C5FD" },
  { label: "Family Safety Plan", desc: "Add members & meeting points", icon: "👨‍👩‍👧", path: "/family-plan", color: "#065F46", bg: "linear-gradient(135deg,#F0FDF4,#DCFCE7)", border: "#86EFAC" },
  { label: "Emergency Kit", desc: "Check your readiness", icon: "🎒", path: "/kit", color: "#92400E", bg: "linear-gradient(135deg,#FFFBEB,#FEF3C7)", border: "#FCD34D" },
];

const TIPS = [
  { icon: "🌊", title: "Flood", tip: "Move to higher ground immediately. Never walk through moving water." },
  { icon: "🏚️", title: "Earthquake", tip: "Drop, Cover, Hold On. Stay away from windows and exterior walls." },
  { icon: "🌀", title: "Cyclone", tip: "Evacuate coastal areas. Store 3 days of water and food supplies." },
  { icon: "🔥", title: "Fire", tip: "Crawl low under smoke. Feel doors before opening. Meet at a set point." },
  { icon: "🌡️", title: "Heatwave", tip: "Stay hydrated. Avoid 11am-5pm sun. Check on elderly neighbours." },
  { icon: "🏔️", title: "Landslide", tip: "Watch for unusual sounds. Evacuate immediately if warned." },
];

const CHECKS = ["Emergency kit stocked", "Family meeting point set", "Emergency numbers saved", "First aid kit at home", "3-day water supply ready", "Documents backed up"];

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total_courses: 25, active_alerts: 19, total_drills: 20, total_shelters: 27, courses_enrolled: 0, certificates: 0 });
  const [alerts, setAlerts] = useState([]);
  const [progress, setProgress] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tipIdx, setTipIdx] = useState(0);
  const [checks, setChecks] = useState(() => { try { return JSON.parse(localStorage.getItem("prep_checks") || "[]"); } catch { return []; } });

  useEffect(() => {
    fetchData();
    const t = setInterval(() => setTipIdx(i => (i + 1) % TIPS.length), 4000);
    return () => clearInterval(t);
  }, []);

  async function fetchData() {
    try {
      const h = { Authorization: `Bearer ${token()}` };
      const [pR, aR, prR, sR] = await Promise.all([
        fetch(`${API}/auth/profile`, { headers: h }),
        fetch(`${API}/alerts?limit=5`, { headers: h }),
        fetch(`${API}/progress/my`, { headers: h }),
        fetch(`${API}/dashboard/stats`, { headers: h }),
      ]);
      if (pR.ok) { const d = await pR.json(); setUser(d?.data?.user || d?.user || d); }
      if (aR.ok) { const d = await aR.json(); setAlerts((d?.data?.alerts || d?.alerts || []).slice(0, 5)); }
      if (prR.ok) { const d = await prR.json(); setProgress(d?.data?.courses || d?.courses || []); }
      if (sR.ok) { const d = await sR.json(); setStats(prev => ({ ...prev, ...(d?.data || d) })); }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  function toggleCheck(c) {
    const u = checks.includes(c) ? checks.filter(x => x !== c) : [...checks, c];
    setChecks(u);
    localStorage.setItem("prep_checks", JSON.stringify(u));
  }

  const readiness = Math.round((checks.length / CHECKS.length) * 100);
  const tip = TIPS[tipIdx];

  function sev(level) {
    const l = (level || "").toLowerCase();
    if (l === "critical") return { bg: "#FEF2F2", border: "#FCA5A5", dot: "#DC2626", text: "#991B1B", badge: "#DC2626" };
    if (l === "warning") return { bg: "#FFFBEB", border: "#FCD34D", dot: "#D97706", text: "#92400E", badge: "#D97706" };
    return { bg: "#F0FDF4", border: "#86EFAC", dot: "#16A34A", text: "#065F46", badge: "#16A34A" };
  }

  const card = { background: "#fff", border: "1px solid #E5E7EB", borderRadius: 16, padding: "20px 22px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" };

  return (
    <div style={{ padding: "24px 28px", maxWidth: 1100, margin: "0 auto", fontFamily: "'Inter', system-ui" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827", margin: 0, letterSpacing: "-0.5px" }}>
            {loading ? "Loading..." : `Welcome back, ${user?.name?.split(" ")[0] || "there"} 👋`}
          </h1>
          <p style={{ fontSize: 13, color: "#6B7280", margin: "4px 0 0" }}>
            {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            {alerts.filter(a => a.level === "critical").length > 0 && (
              <span style={{ marginLeft: 10, color: "#DC2626", fontWeight: 600, fontSize: 12 }}>
                ⚠️ {alerts.filter(a => a.level === "critical").length} critical alerts active
              </span>
            )}
          </p>
        </div>
        <div style={{ background: "linear-gradient(135deg,#1E3A5F,#2563EB)", borderRadius: 14, padding: "12px 18px", maxWidth: 260, cursor: "pointer" }} onClick={() => navigate("/courses")}>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", letterSpacing: "0.1em", marginBottom: 4 }}>💡 PREPAREDNESS TIP</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 3 }}>{tip.icon} {tip.title}</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.8)", lineHeight: 1.5 }}>{tip.tip}</div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 10, marginBottom: 20 }}>
        {[
          { label: "Total Courses", value: stats.total_courses || 25, icon: "📚", color: "#2563EB" },
          { label: "Active Alerts", value: stats.active_alerts || 19, icon: "🚨", color: "#DC2626" },
          { label: "Drills", value: stats.total_drills || 20, icon: "🏃", color: "#D97706" },
          { label: "Shelters", value: stats.total_shelters || 27, icon: "🏠", color: "#16A34A" },
          { label: "Enrolled", value: stats.courses_enrolled || 0, icon: "🎓", color: "#7C3AED" },
          { label: "Certificates", value: stats.certificates || 0, icon: "🏆", color: "#D97706" },
        ].map(s => (
          <div key={s.label} style={{ ...card, padding: "14px 16px", textAlign: "center", borderTop: `3px solid ${s.color}`, cursor: "pointer" }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 3, fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
        {QUICK_ACTIONS.map(a => (
          <button key={a.path} onClick={() => navigate(a.path)} style={{
            display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 6,
            padding: "16px 18px", background: a.bg, border: `1.5px solid ${a.border}`,
            borderRadius: 14, cursor: "pointer", textAlign: "left",
          }}>
            <span style={{ fontSize: 28 }}>{a.icon}</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, color: a.color }}>{a.label}</div>
              <div style={{ fontSize: 11, color: a.color, opacity: 0.7, marginTop: 2 }}>{a.desc}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Main grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 16, marginBottom: 16 }}>
        {/* Alerts */}
        <div style={card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: "#111827" }}>🚨 Active Disaster Alerts</h2>
            <button onClick={() => navigate("/alerts")} style={{ fontSize: 12, color: "#2563EB", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>View all →</button>
          </div>
          {alerts.length === 0 ? (
            <div style={{ textAlign: "center", padding: "20px 0", color: "#9CA3AF", fontSize: 13 }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>No active alerts
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {alerts.map((a, i) => {
                const c = sev(a.level);
                return (
                  <div key={i} onClick={() => navigate("/alerts")} style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 10, padding: "10px 13px", cursor: "pointer", display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: c.dot, flexShrink: 0, marginTop: 4 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: c.text, lineHeight: 1.3 }}>{a.title}</div>
                      <div style={{ fontSize: 10, color: c.text, opacity: 0.7, marginTop: 2 }}>{a.message?.slice(0, 80)}...</div>
                    </div>
                    <span style={{ fontSize: 9, fontWeight: 700, color: "#fff", background: c.badge, padding: "2px 7px", borderRadius: 6, flexShrink: 0, textTransform: "uppercase" }}>{a.level}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Preparedness Check */}
        <div style={card}>
          <h2 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 6px", color: "#111827" }}>✅ Preparedness Check</h2>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6 }}>
            <span style={{ color: "#6B7280" }}>Readiness score</span>
            <span style={{ fontWeight: 700, color: readiness >= 80 ? "#16A34A" : readiness >= 50 ? "#D97706" : "#DC2626" }}>{readiness}%</span>
          </div>
          <div style={{ height: 8, background: "#F3F4F6", borderRadius: 4, marginBottom: 14, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${readiness}%`, borderRadius: 4, transition: "width 0.5s", background: readiness >= 80 ? "#16A34A" : readiness >= 50 ? "#D97706" : "#DC2626" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {CHECKS.map(c => (
              <label key={c} style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer" }} onClick={() => toggleCheck(c)}>
                <div style={{ width: 18, height: 18, borderRadius: 5, border: `2px solid ${checks.includes(c) ? "#16A34A" : "#D1D5DB"}`, background: checks.includes(c) ? "#16A34A" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s" }}>
                  {checks.includes(c) && <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>✓</span>}
                </div>
                <span style={{ fontSize: 12, color: checks.includes(c) ? "#16A34A" : "#374151", textDecoration: checks.includes(c) ? "line-through" : "none", fontWeight: checks.includes(c) ? 600 : 400 }}>{c}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Progress */}
        <div style={card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: "#111827" }}>📚 Your Learning Progress</h2>
            <button onClick={() => navigate("/courses")} style={{ fontSize: 12, color: "#2563EB", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>Browse →</button>
          </div>
          {progress.length === 0 ? (
            <div style={{ textAlign: "center", padding: "16px 0" }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📖</div>
              <p style={{ fontSize: 13, color: "#9CA3AF", marginBottom: 14 }}>Start learning disaster preparedness today</p>
              <button onClick={() => navigate("/courses")} style={{ padding: "9px 20px", background: "#2563EB", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, cursor: "pointer", fontWeight: 600 }}>Browse 25 Courses →</button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {progress.slice(0, 4).map((p, i) => {
                const pct = Math.min(100, p.completion_percentage || 0);
                return (
                  <div key={i} style={{ cursor: "pointer" }} onClick={() => navigate(`/courses/${p.course_id || p.id}`)}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                      <span style={{ color: "#374151", fontWeight: 600, maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title || p.course_title || "Course"}</span>
                      <span style={{ color: pct >= 100 ? "#16A34A" : "#6B7280", fontWeight: 600, flexShrink: 0 }}>{pct >= 100 ? "✓ Done" : `${Math.round(pct)}%`}</span>
                    </div>
                    <div style={{ height: 5, background: "#F3F4F6", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: pct >= 100 ? "#16A34A" : "#2563EB", borderRadius: 3, transition: "width 0.5s" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Emergency numbers */}
        <div style={card}>
          <h2 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 14px", color: "#111827" }}>🆘 Emergency Helplines India</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[
              ["112", "National Emergency", "#DC2626"],
              ["108", "Ambulance / EMRI", "#7C3AED"],
              ["101", "Fire Brigade", "#D97706"],
              ["100", "Police", "#1D4ED8"],
              ["1078", "NDRF Helpline", "#059669"],
              ["1800-180-1717", "NDMA", "#0891B2"],
              ["1916", "BMC Mumbai", "#16A34A"],
              ["1070", "State EOC", "#9333EA"],
            ].map(([num, name, color]) => (
              <a key={num} href={`tel:${num}`} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", background: color + "10", border: `1px solid ${color}30`, borderRadius: 10, textDecoration: "none" }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 14 }}>📞</span>
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color, lineHeight: 1 }}>{num}</div>
                  <div style={{ fontSize: 10, color: "#6B7280", marginTop: 1 }}>{name}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
