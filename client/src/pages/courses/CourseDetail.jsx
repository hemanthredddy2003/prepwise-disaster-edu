import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";
import { getCourseData } from "../../data/courseContent";

export default function CourseDetail() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [activeModule, setActiveModule] = useState(0);
  const [activeLesson, setActiveLesson] = useState(0);
  const [completed, setCompleted] = useState({});
  const [view, setView] = useState("curriculum"); // curriculum | lesson

  useEffect(() => {
    axios.get(import.meta.env.VITE_API_BASE_URL + "/courses/" + id, {
      headers: { Authorization: "Bearer " + token }
    }).then(r => {
      const d = r.data?.data;
      setCourse(d?.course || null);
      setEnrolled(d?.enrolled || false);
    }).catch(() => setCourse(null)).finally(() => setLoading(false));
    const saved = JSON.parse(localStorage.getItem("course_progress_" + id) || "{}");
    setCompleted(saved);
  }, [id, token]);

  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      await axios.post(import.meta.env.VITE_API_BASE_URL + "/courses/" + id + "/enroll", {}, {
        headers: { Authorization: "Bearer " + token }
      });
      setEnrolled(true);
      setView("lesson");
    } catch {}
    setEnrolling(false);
  };

  const markComplete = (modIdx, lesIdx) => {
    const key = modIdx + "-" + lesIdx;
    const updated = { ...completed, [key]: true };
    setCompleted(updated);
    localStorage.setItem("course_progress_" + id, JSON.stringify(updated));
    // Auto advance
    const mod = data.modules[modIdx];
    if (lesIdx < mod.lessons.length - 1) {
      setActiveLesson(lesIdx + 1);
    } else if (modIdx < data.modules.length - 1) {
      setActiveModule(modIdx + 1);
      setActiveLesson(0);
    }
  };

  if (loading) return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 400, color: "#6B7280", fontFamily: "Inter, system-ui", fontSize: 16 }}>Loading course...</div>;
  if (!course) return (
    <div style={{ textAlign: "center", padding: 80, fontFamily: "Inter, system-ui" }}>
      <div style={{ fontSize: 48 }}>📚</div>
      <div style={{ fontSize: 18, fontWeight: 700, marginTop: 12 }}>Course not found</div>
      <button onClick={() => navigate("/courses")} style={{ marginTop: 16, padding: "10px 24px", background: "#2563EB", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>← Back to Courses</button>
    </div>
  );

  const data = getCourseData(course);
  const color = data.color || "#2563EB";
  const totalLessons = data.modules.reduce((s, m) => s + m.lessons.length, 0);
  const completedCount = Object.keys(completed).filter(k => completed[k]).length;
  const progressPct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  const currentLesson = data.modules[activeModule]?.lessons[activeLesson];
  const currentKey = activeModule + "-" + activeLesson;
  const isDone = completed[currentKey];

  // Lesson view - full screen reader
  if (view === "lesson" && currentLesson) {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", height: "calc(100vh - 60px)", fontFamily: "Inter, system-ui", overflow: "hidden" }}>
        {/* Left sidebar - course outline */}
        <div style={{ background: "#111827", overflowY: "auto", borderRight: "1px solid #1F2937" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #1F2937" }}>
            <button onClick={() => setView("curriculum")} style={{ background: "none", border: "none", color: "#9CA3AF", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>← Back to Course</button>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", lineHeight: 1.4 }}>{course.title}</div>
            <div style={{ marginTop: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#9CA3AF", marginBottom: 4 }}>
                <span>{completedCount}/{totalLessons} lessons</span>
                <span>{progressPct}%</span>
              </div>
              <div style={{ height: 4, background: "#374151", borderRadius: 2 }}>
                <div style={{ height: "100%", width: `${progressPct}%`, background: color, borderRadius: 2, transition: "width 0.3s" }} />
              </div>
            </div>
          </div>
          <div style={{ padding: "8px 0" }}>
            {data.modules.map((mod, mi) => (
              <div key={mi}>
                <div style={{ padding: "10px 20px", fontSize: 11, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.08em", background: "#0F172A" }}>
                  {mod.icon} {mod.title}
                </div>
                {mod.lessons.map((les, li) => {
                  const key = mi + "-" + li;
                  const done = completed[key];
                  const active = activeModule === mi && activeLesson === li;
                  return (
                    <button key={li} onClick={() => { setActiveModule(mi); setActiveLesson(li); }} style={{
                      width: "100%", padding: "12px 20px", background: active ? color + "20" : "transparent",
                      border: "none", borderLeft: `3px solid ${active ? color : "transparent"}`,
                      cursor: "pointer", textAlign: "left", display: "flex", gap: 10, alignItems: "flex-start"
                    }}>
                      <div style={{ width: 20, height: 20, borderRadius: "50%", background: done ? color : "#374151", border: `2px solid ${done ? color : "#4B5563"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                        {done && <span style={{ color: "#fff", fontSize: 10, fontWeight: 700 }}>✓</span>}
                      </div>
                      <div>
                        <div style={{ fontSize: 12, color: active ? "#fff" : done ? "#9CA3AF" : "#D1D5DB", fontWeight: active ? 600 : 400, lineHeight: 1.4 }}>{les.title}</div>
                        <div style={{ fontSize: 11, color: "#6B7280", marginTop: 2 }}>⏱ {les.duration}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Right - lesson content */}
        <div style={{ overflowY: "auto", background: "#F9FAFB" }}>
          {/* Lesson header */}
          <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 10 }}>
            <div>
              <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 2 }}>{data.modules[activeModule]?.title} · Lesson {activeLesson + 1}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>{currentLesson.title}</div>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              {activeModule > 0 || activeLesson > 0 ? (
                <button onClick={() => {
                  if (activeLesson > 0) setActiveLesson(l => l - 1);
                  else { setActiveModule(m => m - 1); setActiveLesson(data.modules[activeModule - 1].lessons.length - 1); }
                }} style={{ padding: "8px 16px", background: "#F3F4F6", color: "#374151", border: "1px solid #E5E7EB", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>← Prev</button>
              ) : null}
              {!isDone ? (
                <button onClick={() => markComplete(activeModule, activeLesson)} style={{ padding: "8px 20px", background: color, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 700 }}>Mark Complete ✓</button>
              ) : (
                <div style={{ padding: "8px 16px", background: "#F0FDF4", color: "#16A34A", border: "1px solid #86EFAC", borderRadius: 8, fontSize: 13, fontWeight: 700 }}>✅ Completed</div>
              )}
              {(activeModule < data.modules.length - 1 || activeLesson < data.modules[activeModule].lessons.length - 1) && (
                <button onClick={() => {
                  markComplete(activeModule, activeLesson);
                }} style={{ padding: "8px 16px", background: "#111827", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>Next →</button>
              )}
            </div>
          </div>

          <div style={{ padding: "32px", maxWidth: 800, margin: "0 auto" }}>
            {/* Lesson image */}
            <div style={{ borderRadius: 16, overflow: "hidden", marginBottom: 28, height: 280, position: "relative" }}>
              <img src={currentLesson.img} alt={currentLesson.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => e.target.style.display = "none"} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)" }} />
              <div style={{ position: "absolute", bottom: 16, left: 20, right: 20 }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: color, padding: "4px 12px", borderRadius: 20 }}>
                  <span style={{ fontSize: 12, color: "#fff", fontWeight: 700 }}>⏱ {currentLesson.duration}</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div style={{ background: "#fff", borderRadius: 16, padding: "28px 32px", marginBottom: 24, border: "1px solid #E5E7EB", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "#111827", marginBottom: 20 }}>{currentLesson.title}</h2>
              {currentLesson.content.split("\n\n").map((para, i) => (
                <p key={i} style={{ fontSize: 15, color: "#374151", lineHeight: 1.9, marginBottom: 16, fontFamily: "Inter, system-ui" }}>{para}</p>
              ))}
            </div>

            {/* Do's and Don'ts */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
              <div style={{ background: "#F0FDF4", borderRadius: 16, padding: "20px 22px", border: "1px solid #BBF7D0" }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#16A34A", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 28, height: 28, borderRadius: "50%", background: "#16A34A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>✓</span>
                  DO THIS
                </div>
                {currentLesson.dos.map((d, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
                    <span style={{ color: "#16A34A", fontSize: 14, flexShrink: 0, marginTop: 1, fontWeight: 700 }}>✓</span>
                    <span style={{ fontSize: 13, color: "#166534", lineHeight: 1.6 }}>{d}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: "#FEF2F2", borderRadius: 16, padding: "20px 22px", border: "1px solid #FECACA" }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#DC2626", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 28, height: 28, borderRadius: "50%", background: "#DC2626", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "#fff" }}>✗</span>
                  NEVER DO
                </div>
                {currentLesson.donts.map((d, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
                    <span style={{ color: "#DC2626", fontSize: 14, flexShrink: 0, marginTop: 1, fontWeight: 700 }}>✗</span>
                    <span style={{ fontSize: 13, color: "#991B1B", lineHeight: 1.6 }}>{d}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Takeaway */}
            <div style={{ background: `linear-gradient(135deg, ${color}15, ${color}08)`, borderRadius: 16, padding: "20px 24px", border: `1px solid ${color}30`, marginBottom: 24 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color, marginBottom: 10, letterSpacing: "0.08em", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 18 }}>💡</span> KEY TAKEAWAY
              </div>
              <p style={{ fontSize: 15, color: "#111827", lineHeight: 1.7, fontWeight: 600, margin: 0 }}>{currentLesson.takeaway}</p>
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", gap: 12 }}>
              {!isDone && (
                <button onClick={() => markComplete(activeModule, activeLesson)} style={{
                  padding: "14px 28px", background: `linear-gradient(135deg, ${color}, ${color}cc)`,
                  color: "#fff", border: "none", borderRadius: 12, cursor: "pointer", fontSize: 15,
                  fontWeight: 700, display: "flex", alignItems: "center", gap: 8, boxShadow: `0 4px 14px ${color}40`
                }}>✓ Mark as Complete & Continue</button>
              )}
              {isDone && (
                <div style={{ padding: "14px 24px", background: "#F0FDF4", color: "#16A34A", border: "1px solid #86EFAC", borderRadius: 12, fontSize: 15, fontWeight: 700 }}>
                  ✅ Lesson Completed!
                </div>
              )}
              <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(currentLesson.title + " disaster India")}`}
                target="_blank" rel="noreferrer" style={{ padding: "14px 22px", background: "#fff", color: "#DC2626", border: "1px solid #FECACA", borderRadius: 12, fontSize: 14, fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
                ▶ Watch on YouTube
              </a>
            </div>

            {/* Completion banner */}
            {progressPct === 100 && (
              <div style={{ marginTop: 24, background: "linear-gradient(135deg,#1E3A5F,#2563EB)", borderRadius: 16, padding: "24px", textAlign: "center" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🏆</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 8 }}>Course Complete!</div>
                <div style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", marginBottom: 16 }}>You've completed all lessons. Your certificate is ready.</div>
                <button onClick={() => navigate("/certificates")} style={{ padding: "12px 28px", background: "#F59E0B", color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", fontWeight: 700, fontSize: 14 }}>🏆 View Certificate</button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Curriculum view
  return (
    <div style={{ fontFamily: "Inter, system-ui" }}>
      <button onClick={() => navigate("/courses")} style={{ display: "flex", alignItems: "center", gap: 6, margin: "16px 28px", background: "none", border: "none", color: "#6B7280", cursor: "pointer", fontSize: 13, fontWeight: 500 }}>← Back to Courses</button>

      {/* Hero */}
      <div style={{ position: "relative", height: 300, margin: "0 28px 24px", borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.12)" }}>
        <img src={data.heroImg} alt={course.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => e.target.style.display = "none"} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.6) 60%, transparent 100%)" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "28px 36px" }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#fff", background: color + "CC", padding: "3px 12px", borderRadius: 20 }}>{data.icon} {(course.category||"GENERAL").toUpperCase()}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#fff", background: "rgba(255,255,255,0.15)", padding: "3px 12px", borderRadius: 20 }}>{(course.level||"Intermediate").toUpperCase()}</span>
            {course.has_certificate && <span style={{ fontSize: 11, fontWeight: 700, color: "#fff", background: "rgba(245,158,11,0.8)", padding: "3px 12px", borderRadius: 20 }}>🏆 CERTIFICATE</span>}
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#fff", margin: "0 0 10px", maxWidth: 600, lineHeight: 1.3 }}>{course.title}</h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", maxWidth: 500, lineHeight: 1.6, margin: "0 0 16px" }}>{data.overview}</p>
          <div style={{ display: "flex", gap: 20 }}>
            {[["📚", totalLessons + " lessons"], ["📋", data.modules.length + " modules"], ["🌐", "English / Hindi"]].map(([icon, val]) => (
              <div key={val} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ fontSize: 13 }}>{icon}</span>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.8)" }}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20, padding: "0 28px 28px" }}>
        {/* Left - curriculum */}
        <div>
          {/* Progress bar if enrolled */}
          {enrolled && (
            <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, padding: "16px 20px", marginBottom: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>Your Progress</span>
                <span style={{ fontSize: 13, fontWeight: 700, color, fontFamily: "monospace" }}>{completedCount}/{totalLessons} lessons ({progressPct}%)</span>
              </div>
              <div style={{ height: 8, background: "#F3F4F6", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${progressPct}%`, background: color, borderRadius: 4, transition: "width 0.5s" }} />
              </div>
              {progressPct === 100 && <div style={{ marginTop: 10, fontSize: 13, color: "#16A34A", fontWeight: 600 }}>🎉 Course complete! Your certificate is ready.</div>}
            </div>
          )}

          {/* Course outline */}
          <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #F3F4F6", background: "#F9FAFB" }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: 0 }}>📋 Course Curriculum</h2>
              <div style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>{data.modules.length} modules · {totalLessons} lessons</div>
            </div>
            {data.modules.map((mod, mi) => {
              const modCompleted = mod.lessons.filter((_, li) => completed[mi + "-" + li]).length;
              return (
                <div key={mi} style={{ borderBottom: "1px solid #F3F4F6" }}>
                  <button onClick={() => setActiveModule(activeModule === mi ? -1 : mi)} style={{ width: "100%", padding: "16px 20px", background: activeModule === mi ? color + "08" : "#fff", border: "none", cursor: "pointer", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <div style={{ width: 38, height: 38, borderRadius: 10, background: activeModule === mi ? color : "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0, transition: "all 0.15s" }}>{mod.icon}</div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{mod.title}</div>
                        <div style={{ fontSize: 11, color: "#6B7280", marginTop: 2 }}>{mod.lessons.length} lessons · {modCompleted} completed</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      {modCompleted === mod.lessons.length && <span style={{ fontSize: 11, fontWeight: 700, color: "#16A34A", background: "#F0FDF4", padding: "2px 8px", borderRadius: 8 }}>✓ Done</span>}
                      <span style={{ fontSize: 18, color: "#9CA3AF", transform: activeModule === mi ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}>▾</span>
                    </div>
                  </button>
                  {activeModule === mi && mod.lessons.map((les, li) => {
                    const key = mi + "-" + li;
                    const done = completed[key];
                    return (
                      <div key={li} onClick={() => { if (enrolled) { setActiveModule(mi); setActiveLesson(li); setView("lesson"); } }}
                        style={{ padding: "14px 20px 14px 72px", borderTop: "1px solid #F9FAFB", cursor: enrolled ? "pointer" : "default", display: "flex", gap: 14, alignItems: "flex-start", background: done ? "#F0FDF4" : "#fff", transition: "background 0.15s" }}>
                        <div style={{ width: 22, height: 22, borderRadius: "50%", border: `2px solid ${done ? "#16A34A" : "#D1D5DB"}`, background: done ? "#16A34A" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                          {done ? <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>✓</span> : <span style={{ fontSize: 10, color: "#9CA3AF" }}>{li + 1}</span>}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: done ? 600 : 500, color: done ? "#16A34A" : "#374151" }}>{les.title}</div>
                          <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 3 }}>⏱ {les.duration}</div>
                        </div>
                        {enrolled && <span style={{ fontSize: 11, color: "#2563EB", fontWeight: 600 }}>{done ? "" : "▶ Start"}</span>}
                        {!enrolled && <span style={{ fontSize: 11, color: "#9CA3AF" }}>🔒</span>}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14, position: "sticky", top: 20, alignSelf: "flex-start" }}>
          <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
            <img src={data.heroImg} alt="" style={{ width: "100%", height: 140, objectFit: "cover" }} onError={e => e.target.style.display = "none"} />
            <div style={{ padding: "20px" }}>
              {enrolled ? (
                <>
                  <div style={{ textAlign: "center", marginBottom: 16 }}>
                    <div style={{ fontSize: 32, marginBottom: 6 }}>🎓</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#16A34A" }}>You are enrolled!</div>
                    <div style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>{completedCount} of {totalLessons} lessons completed</div>
                  </div>
                  <div style={{ height: 6, background: "#F3F4F6", borderRadius: 3, marginBottom: 16, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${progressPct}%`, background: progressPct === 100 ? "#16A34A" : color, borderRadius: 3, transition: "width 0.5s" }} />
                  </div>
                  <button onClick={() => setView("lesson")} style={{ width: "100%", padding: 14, background: `linear-gradient(135deg, ${color}, ${color}cc)`, color: "#fff", border: "none", borderRadius: 12, cursor: "pointer", fontSize: 15, fontWeight: 700, boxShadow: `0 4px 14px ${color}40` }}>
                    {completedCount === 0 ? "▶ Start Learning" : progressPct === 100 ? "🔁 Review Course" : "▶ Continue Learning"}
                  </button>
                  {progressPct === 100 && (
                    <button onClick={() => navigate("/certificates")} style={{ width: "100%", padding: 12, background: "#F59E0B", color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 700, marginTop: 10 }}>🏆 Get Certificate</button>
                  )}
                </>
              ) : (
                <>
                  <div style={{ textAlign: "center", marginBottom: 16 }}>
                    <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 4 }}>FULL COURSE ACCESS</div>
                    <div style={{ fontSize: 28, fontWeight: 800, color: "#111827" }}>Free</div>
                    <div style={{ fontSize: 12, color: "#6B7280" }}>{totalLessons} lessons with full content</div>
                  </div>
                  <button onClick={handleEnroll} disabled={enrolling} style={{ width: "100%", padding: 14, background: enrolling ? "#9CA3AF" : `linear-gradient(135deg, ${color}, ${color}cc)`, color: "#fff", border: "none", borderRadius: 12, cursor: enrolling ? "not-allowed" : "pointer", fontSize: 15, fontWeight: 700, boxShadow: `0 4px 14px ${color}40` }}>
                    {enrolling ? "Enrolling..." : "Enroll Now — Free →"}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Course includes */}
          <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 16, padding: "18px 20px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 14 }}>This course includes</div>
            {[
              ["📋", data.modules.length + " modules"],
              ["📚", totalLessons + " lessons"],
              ["✅", "Do's & Don'ts per lesson"],
              ["💡", "Key takeaways"],
              ["▶", "YouTube video links"],
              ["🏆", course.has_certificate ? "Certificate on completion" : "No certificate"],
              ["🌐", "English / Hindi"],
              ["♾️", "Lifetime access"],
            ].map(([icon, val]) => (
              <div key={val} style={{ display: "flex", gap: 10, alignItems: "center", padding: "7px 0", borderBottom: "1px solid #F9FAFB", fontSize: 13 }}>
                <span style={{ fontSize: 15, width: 20 }}>{icon}</span>
                <span style={{ color: "#374151" }}>{val}</span>
              </div>
            ))}
          </div>

          {/* Emergency numbers */}
          <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 16, padding: "16px 18px" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#DC2626", marginBottom: 10 }}>🆘 Emergency Numbers</div>
            {[["112","National Emergency"],["108","Ambulance"],["101","Fire"],["1078","NDRF"]].map(([num, name]) => (
              <a key={num} href={`tel:${num}`} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", textDecoration: "none", borderBottom: "1px solid #FECACA" }}>
                <span style={{ fontSize: 15, fontWeight: 800, color: "#DC2626" }}>{num}</span>
                <span style={{ fontSize: 11, color: "#9CA3AF" }}>{name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
