import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:5001/api";
const token = () => localStorage.getItem("token");

const CAT_CONFIG = {
  Flood:      { icon: "🌊", color: "#2563EB", grad: "linear-gradient(135deg,#1D4ED8,#3B82F6)" },
  Earthquake: { icon: "🏚️", color: "#DC2626", grad: "linear-gradient(135deg,#991B1B,#EF4444)" },
  Cyclone:    { icon: "🌀", color: "#7C3AED", grad: "linear-gradient(135deg,#5B21B6,#8B5CF6)" },
  Tsunami:    { icon: "🌊", color: "#0891B2", grad: "linear-gradient(135deg,#0E7490,#06B6D4)" },
  Medical:    { icon: "🚑", color: "#16A34A", grad: "linear-gradient(135deg,#15803D,#22C55E)" },
  Fire:       { icon: "🔥", color: "#EA580C", grad: "linear-gradient(135deg,#C2410C,#F97316)" },
  Heatwave:   { icon: "🌡️", color: "#D97706", grad: "linear-gradient(135deg,#B45309,#F59E0B)" },
  Community:  { icon: "🏘️", color: "#DB2777", grad: "linear-gradient(135deg,#9D174D,#EC4899)" },
  Landslide:  { icon: "⛰️", color: "#65A30D", grad: "linear-gradient(135deg,#4D7C0F,#84CC16)" },
  Industrial: { icon: "⚗️", color: "#6D28D9", grad: "linear-gradient(135deg,#4C1D95,#7C3AED)" },
  Nuclear:    { icon: "☢️", color: "#374151", grad: "linear-gradient(135deg,#1F2937,#6B7280)" },
  Storm:      { icon: "⛈️", color: "#1D4ED8", grad: "linear-gradient(135deg,#1E3A8A,#3B82F6)" },
  Rescue:     { icon: "🚁", color: "#DC2626", grad: "linear-gradient(135deg,#7F1D1D,#DC2626)" },
  Education:  { icon: "🎓", color: "#7C3AED", grad: "linear-gradient(135deg,#4C1D95,#8B5CF6)" },
  Drought:    { icon: "🏜️", color: "#D97706", grad: "linear-gradient(135deg,#92400E,#D97706)" },
  General:    { icon: "📚", color: "#2563EB", grad: "linear-gradient(135deg,#1E3A8A,#2563EB)" },
};

function getCfg(category) {
  const key = Object.keys(CAT_CONFIG).find(k => (category||"").toLowerCase().includes(k.toLowerCase()));
  return CAT_CONFIG[key] || CAT_CONFIG.General;
}

const LEVELS = { beginner: { label: "Beginner", color: "#16A34A", bg: "#F0FDF4" }, intermediate: { label: "Intermediate", color: "#D97706", bg: "#FFFBEB" }, advanced: { label: "Advanced", color: "#DC2626", bg: "#FEF2F2" } };

export default function CoursesPage() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [levelFilter, setLevelFilter] = useState("All");

  useEffect(() => {
    const h = { Authorization: `Bearer ${token()}` };
    Promise.all([
      fetch(`${API}/courses`, { headers: h }).then(r => r.json()),
      fetch(`${API}/courses/enrollments/my`, { headers: h }).then(r => r.json()),
      fetch(`${API}/courses/progress/my`, { headers: h }).then(r => r.json()),
    ]).then(([cd, ed, pd]) => {
      setCourses(cd?.data?.courses || cd?.courses || []);
      setEnrollments(ed?.data?.courses || ed?.courses || []);
      setProgress(pd?.data?.courses || pd?.courses || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  function isEnrolled(id) { return enrollments.some(e => e.id === id || e.course_id === id); }
  function getProgress(id) { const p = progress.find(p => p.id === id || p.course_id === id); return p?.completion_percentage || 0; }

  async function enroll(courseId) {
    await fetch(`${API}/courses/${courseId}/enroll`, { method: "POST", headers: { Authorization: `Bearer ${token()}` } });
    navigate(`/courses/${courseId}`);
  }

  const categories = ["All", ...new Set(courses.map(c => c.category).filter(Boolean))];
  const filtered = courses.filter(c => {
    const matchCat = catFilter === "All" || c.category === catFilter;
    const matchLevel = levelFilter === "All" || c.level === levelFilter;
    const matchSearch = !search || c.title?.toLowerCase().includes(search.toLowerCase()) || c.description?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchLevel && matchSearch;
  });

  const enrolledCourses = courses.filter(c => isEnrolled(c.id));
  const completedCourses = enrolledCourses.filter(c => getProgress(c.id) >= 100);

  return (
    <div style={{ fontFamily: "Inter, system-ui", background: "#F9FAFB", minHeight: "100vh" }}>
      {/* Hero banner */}
      <div style={{ background: "linear-gradient(135deg,#0F172A,#1E3A5F,#2563EB)", padding: "32px 32px 28px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em", marginBottom: 8 }}>DISASTER PREPAREDNESS EDUCATION</div>
          <h1 style={{ fontSize: 30, fontWeight: 800, color: "#fff", margin: "0 0 8px", letterSpacing: "-0.5px" }}>
            Learn. Practice. <span style={{ color: "#60A5FA" }}>Stay Safe.</span>
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", margin: "0 0 24px" }}>
            {courses.length} expert-designed courses covering all major Indian disaster types — all free
          </p>
          <div style={{ display: "flex", gap: 16 }}>
            {[
              [courses.length + "+", "Courses"],
              [enrolledCourses.length, "Enrolled"],
              [completedCourses.length, "Completed"],
              ["Free", "Always"],
            ].map(([val, label]) => (
              <div key={label} style={{ background: "rgba(255,255,255,0.1)", borderRadius: 12, padding: "10px 18px", textAlign: "center", border: "1px solid rgba(255,255,255,0.15)" }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>{val}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 32px" }}>
        {/* Search + filters */}
        <div style={{ background: "#fff", borderRadius: 16, padding: "16px 20px", marginBottom: 24, border: "1px solid #E5E7EB", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10, background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 10, padding: "10px 14px" }}>
              <span style={{ fontSize: 16, color: "#9CA3AF" }}>🔍</span>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search courses by name or topic..."
                style={{ border: "none", background: "transparent", outline: "none", fontSize: 14, color: "#374151", width: "100%" }} />
              {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", fontSize: 16 }}>✕</button>}
            </div>
            <select value={levelFilter} onChange={e => setLevelFilter(e.target.value)} style={{ padding: "10px 14px", background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 10, fontSize: 13, color: "#374151", cursor: "pointer", outline: "none" }}>
              <option value="All">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {categories.slice(0, 14).map(cat => {
              const cfg = cat === "All" ? { icon: "📋", color: "#2563EB" } : getCfg(cat);
              const active = catFilter === cat;
              return (
                <button key={cat} onClick={() => setCatFilter(cat)} style={{
                  padding: "6px 14px", borderRadius: 20, border: `1px solid ${active ? cfg.color : "#E5E7EB"}`,
                  background: active ? cfg.color : "#fff", color: active ? "#fff" : "#6B7280",
                  fontSize: 12, fontWeight: active ? 700 : 500, cursor: "pointer", transition: "all 0.15s"
                }}>
                  {cat === "All" ? "📋 All" : `${cfg.icon} ${cat}`}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 16, fontWeight: 500 }}>
          Showing {filtered.length} courses {catFilter !== "All" ? `in ${catFilter}` : ""} {search ? `matching "${search}"` : ""}
        </div>

        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
            {[1,2,3,4,5,6].map(i => <div key={i} style={{ height: 320, background: "#fff", borderRadius: 16, border: "1px solid #E5E7EB" }} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: 80, background: "#fff", borderRadius: 16, border: "1px solid #E5E7EB" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 8 }}>No courses found</div>
            <button onClick={() => { setCatFilter("All"); setSearch(""); setLevelFilter("All"); }} style={{ padding: "10px 24px", background: "#2563EB", color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", fontWeight: 600 }}>Clear Filters</button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
            {filtered.map(course => {
              const cfg = getCfg(course.category);
              const enrolled = isEnrolled(course.id);
              const pct = getProgress(course.id);
              const lvl = LEVELS[course.level] || LEVELS.beginner;
              return (
                <div key={course.id} onClick={() => navigate(`/courses/${course.id}`)} style={{
                  background: "#fff", border: "1px solid #E5E7EB", borderRadius: 18,
                  overflow: "hidden", cursor: "pointer", boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                  transition: "all 0.25s", display: "flex", flexDirection: "column"
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.12)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)"; }}>
                  {/* Card top */}
                  <div style={{ height: 130, background: cfg.grad, position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", inset: 0, opacity: 0.2, background: "radial-gradient(circle at 30% 50%, rgba(255,255,255,0.4) 0%, transparent 60%)" }} />
                    <div style={{ position: "absolute", top: 12, left: 12, right: 12, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.9)", background: "rgba(0,0,0,0.25)", padding: "3px 10px", borderRadius: 20, backdropFilter: "blur(8px)" }}>
                        {(course.category||"GENERAL").toUpperCase()}
                      </span>
                      {enrolled && <span style={{ fontSize: 10, fontWeight: 700, color: "#fff", background: "rgba(16,185,129,0.7)", padding: "3px 10px", borderRadius: 20 }}>✓ ENROLLED</span>}
                      {course.has_certificate && !enrolled && <span style={{ fontSize: 10, fontWeight: 700, color: "#fff", background: "rgba(245,158,11,0.7)", padding: "3px 10px", borderRadius: 20 }}>🏆 CERT</span>}
                    </div>
                    <div style={{ position: "absolute", bottom: 14, left: 14, fontSize: 44 }}>{cfg.icon}</div>
                    <div style={{ position: "absolute", bottom: 14, right: 14, fontSize: 11, color: "rgba(255,255,255,0.8)", background: "rgba(0,0,0,0.2)", padding: "2px 8px", borderRadius: 8 }}>⏱ {course.duration_mins || 60} min</div>
                  </div>

                  {/* Card body */}
                  <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column" }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#111827", lineHeight: 1.35, marginBottom: 8 }}>{course.title}</div>
                    <p style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.6, marginBottom: 12, flex: 1, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{course.description}</p>

                    {/* Level badge */}
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: enrolled ? 10 : 12 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: lvl.color, background: lvl.bg, padding: "2px 10px", borderRadius: 20 }}>
                        📊 {lvl.label}
                      </span>
                      {course.has_certificate && <span style={{ fontSize: 11, color: "#D97706", background: "#FFFBEB", padding: "2px 10px", borderRadius: 20, fontWeight: 600 }}>🏆 Certificate</span>}
                    </div>

                    {/* Progress bar if enrolled */}
                    {enrolled && (
                      <div style={{ marginBottom: 12 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}>
                          <span style={{ color: "#6B7280" }}>Progress</span>
                          <span style={{ fontWeight: 700, color: pct >= 100 ? "#16A34A" : cfg.color }}>{pct >= 100 ? "✓ Complete" : `${Math.round(pct)}%`}</span>
                        </div>
                        <div style={{ height: 5, background: "#F3F4F6", borderRadius: 3, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${pct}%`, background: pct >= 100 ? "#16A34A" : cfg.color, borderRadius: 3, transition: "width 0.5s" }} />
                        </div>
                      </div>
                    )}

                    {/* CTA button */}
                    {enrolled ? (
                      <button onClick={e => { e.stopPropagation(); navigate(`/courses/${course.id}`); }} style={{
                        width: "100%", padding: "10px", background: pct >= 100 ? "#16A34A" : cfg.color,
                        color: "#fff", border: "none", borderRadius: 10, fontSize: 13, cursor: "pointer", fontWeight: 700
                      }}>{pct >= 100 ? "🔁 Review Course" : "▶ Continue Learning"}</button>
                    ) : (
                      <button onClick={e => { e.stopPropagation(); enroll(course.id); }} style={{
                        width: "100%", padding: "10px", background: "#fff", color: cfg.color,
                        border: `2px solid ${cfg.color}`, borderRadius: 10, fontSize: 13, cursor: "pointer", fontWeight: 700,
                        transition: "all 0.15s"
                      }}
                        onMouseEnter={e => { e.currentTarget.style.background = cfg.color; e.currentTarget.style.color = "#fff"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = cfg.color; }}>
                        Enroll Free →
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
