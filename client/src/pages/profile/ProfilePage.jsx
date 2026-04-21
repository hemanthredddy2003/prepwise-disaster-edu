import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:5001/api";
const token = () => localStorage.getItem("token");

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState([]);
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState("overview");

  useEffect(() => {
    const h = { Authorization: `Bearer ${token()}` };
    Promise.all([
      fetch(`${API}/auth/profile`, { headers: h }).then(r => r.json()),
      fetch(`${API}/progress/my`, { headers: h }).then(r => r.json()),
      fetch(`${API}/courses/certificates/my`, { headers: h }).then(r => r.json()),
    ]).then(([ud, pd, cd]) => {
      const u = ud?.data?.user || ud?.user || ud;
      setUser(u); setForm(u || {});
      setProgress(pd?.data?.courses || pd?.courses || []);
      setCerts(cd?.data?.certificates || cd?.certificates || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  async function saveProfile() {
    setSaving(true);
    try {
      const res = await fetch(`${API}/auth/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const d = await res.json();
        setUser(d?.data?.user || d?.user || form);
        setEditing(false);
      }
    } catch (e) { console.error(e); }
    setSaving(false);
  }

  const enrolled = progress.length;
  const completed = progress.filter(p => (p.completion_percentage || 0) >= 100).length;
  const avgProgress = enrolled > 0 ? Math.round(progress.reduce((s, p) => s + (p.completion_percentage || 0), 0) / enrolled) : 0;

  const BADGES = [
    { icon: "🌟", label: "First Login", earned: true, color: "#F59E0B" },
    { icon: "📚", label: "First Course", earned: enrolled > 0, color: "#2563EB" },
    { icon: "✅", label: "Completionist", earned: completed > 0, color: "#16A34A" },
    { icon: "🏆", label: "Certified", earned: certs.length > 0, color: "#F59E0B" },
    { icon: "🤖", label: "AI User", earned: true, color: "#0891B2" },
    { icon: "🎒", label: "Prepared", earned: false, color: "#D97706" },
    { icon: "🔥", label: "On Fire", earned: completed >= 3, color: "#DC2626" },
    { icon: "🌊", label: "Flood Expert", earned: false, color: "#2563EB" },
    { icon: "🛡️", label: "Guardian", earned: certs.length >= 2, color: "#7C3AED" },
  ];

  if (loading) return <div style={{ textAlign: "center", padding: 80, color: "#9CA3AF", fontFamily: "Inter, system-ui" }}>Loading profile...</div>;

  const card = { background: "#fff", border: "1px solid #E5E7EB", borderRadius: 16, padding: "20px 22px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" };

  return (
    <div style={{ padding: "24px 28px", maxWidth: 1000, margin: "0 auto", fontFamily: "Inter, system-ui" }}>
      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg,#1E3A5F,#2563EB,#1D4ED8)", borderRadius: 20, padding: "28px 32px", marginBottom: 24, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 20, position: "relative" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(255,255,255,0.2)", border: "3px solid rgba(255,255,255,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, flexShrink: 0 }}>
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: "#fff", margin: 0 }}>{user?.name || "User"}</h1>
              <span style={{ fontSize: 10, fontWeight: 700, color: "#fff", background: "rgba(255,255,255,0.2)", padding: "3px 10px", borderRadius: 20 }}>{(user?.role || "STUDENT").toUpperCase()}</span>
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginBottom: 2 }}>{user?.email}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Member since {new Date(user?.created_at || Date.now()).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</div>
          </div>
          <div style={{ display: "flex", gap: 24, flexShrink: 0 }}>
            {[
              [enrolled, "Enrolled"],
              [completed, "Completed"],
              [certs.length, "Certificates"],
            ].map(([val, label]) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 26, fontWeight: 800, color: "#fff", lineHeight: 1 }}>{val}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", marginTop: 3 }}>{label}</div>
              </div>
            ))}
          </div>
          <button onClick={() => setEditing(!editing)} style={{ padding: "9px 18px", background: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 10, cursor: "pointer", fontSize: 12, fontWeight: 600, flexShrink: 0 }}>
            {editing ? "Cancel" : "✏️ Edit"}
          </button>
        </div>
      </div>

      {/* Edit form */}
      {editing && (
        <div style={{ ...card, marginBottom: 20, border: "1px solid #BFDBFE" }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: "0 0 16px" }}>Edit Profile</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[["Name", "name"], ["Institution", "institution"], ["Phone", "phone"]].map(([label, key]) => (
              <div key={key}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>{label}</label>
                <input value={form[key] || ""} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                  style={{ width: "100%", padding: "9px 12px", border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 13, outline: "none", boxSizing: "border-box" }} />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button onClick={saveProfile} disabled={saving} style={{ padding: "9px 22px", background: "#2563EB", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 13 }}>{saving ? "Saving..." : "Save Changes"}</button>
            <button onClick={() => setEditing(false)} style={{ padding: "9px 18px", background: "#F9FAFB", color: "#374151", border: "1px solid #E5E7EB", borderRadius: 8, cursor: "pointer", fontSize: 13 }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: "flex", background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, padding: 4, marginBottom: 20, gap: 2 }}>
        {[["overview","📊 Overview"],["courses","📚 Courses"],["badges","🏅 Badges"]].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} style={{
            flex: 1, padding: "10px", border: "none", borderRadius: 10, cursor: "pointer",
            background: tab === key ? "#2563EB" : "transparent",
            color: tab === key ? "#fff" : "#6B7280",
            fontSize: 13, fontWeight: tab === key ? 700 : 500
          }}>{label}</button>
        ))}
      </div>

      {tab === "overview" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 }}>
            {[
              { icon: "📚", val: enrolled, label: "Enrolled", color: "#2563EB" },
              { icon: "✅", val: completed, label: "Completed", color: "#16A34A" },
              { icon: "🏆", val: certs.length, label: "Certificates", color: "#F59E0B" },
              { icon: "📈", val: avgProgress + "%", label: "Avg Progress", color: "#7C3AED" },
            ].map(s => (
              <div key={s.label} style={{ ...card, textAlign: "center", borderTop: `3px solid ${s.color}` }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.val}</div>
                <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
          <div style={card}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: "0 0 16px" }}>Disaster Preparedness Skills</h3>
            {[
              { label: "Flood Response", pct: 80, color: "#2563EB", icon: "🌊" },
              { label: "Earthquake Safety", pct: 65, color: "#DC2626", icon: "🏚️" },
              { label: "Cyclone Preparedness", pct: 70, color: "#7C3AED", icon: "🌀" },
              { label: "First Aid & CPR", pct: 55, color: "#16A34A", icon: "🚑" },
              { label: "Emergency Planning", pct: 90, color: "#F59E0B", icon: "🎒" },
            ].map(s => (
              <div key={s.label} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span>{s.icon}</span>
                    <span style={{ fontSize: 13, color: "#374151" }}>{s.label}</span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: s.color }}>{s.pct}%</span>
                </div>
                <div style={{ height: 6, background: "#F3F4F6", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${s.pct}%`, background: s.color, borderRadius: 3, transition: "width 1s" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "courses" && (
        <div style={card}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: "0 0 16px" }}>📚 Your Courses</h3>
          {progress.length === 0 ? (
            <div style={{ textAlign: "center", padding: 40 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📖</div>
              <p style={{ color: "#9CA3AF", marginBottom: 16 }}>No courses enrolled yet</p>
              <button onClick={() => navigate("/courses")} style={{ padding: "9px 20px", background: "#2563EB", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>Browse Courses →</button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {progress.map((p, i) => {
                const pct = Math.min(100, p.completion_percentage || 0);
                const done = pct >= 100;
                return (
                  <div key={i} onClick={() => navigate(`/courses/${p.course_id || p.id}`)} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 12, cursor: "pointer" }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: done ? "#F0FDF4" : "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{done ? "✅" : "📘"}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#111827", marginBottom: 6 }}>{p.title || p.course_title || "Course"}</div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 11, color: "#9CA3AF" }}>{p.category || "General"}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: done ? "#16A34A" : "#2563EB" }}>{pct}%</span>
                      </div>
                      <div style={{ height: 4, background: "#E5E7EB", borderRadius: 2 }}>
                        <div style={{ height: "100%", width: `${pct}%`, background: done ? "#16A34A" : "#2563EB", borderRadius: 2 }} />
                      </div>
                    </div>
                    {done && <span style={{ fontSize: 20 }}>🏆</span>}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {tab === "badges" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
          {BADGES.map((b, i) => (
            <div key={i} style={{ ...card, textAlign: "center", opacity: b.earned ? 1 : 0.5, border: b.earned ? `1px solid ${b.color}30` : "1px solid #E5E7EB", position: "relative" }}>
              {b.earned && <div style={{ position: "absolute", top: 10, right: 10, fontSize: 9, fontWeight: 700, color: b.color, background: b.color + "15", padding: "2px 8px", borderRadius: 8 }}>EARNED</div>}
              <div style={{ fontSize: 40, marginBottom: 10, filter: b.earned ? "none" : "grayscale(1)" }}>{b.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 4 }}>{b.label}</div>
              {!b.earned && <div style={{ fontSize: 11, color: "#9CA3AF" }}>🔒 Keep learning to unlock</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
