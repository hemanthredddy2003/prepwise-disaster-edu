import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../context/ThemeContext";

const FONT = "Space Grotesk, sans-serif";
const FONT_MONO = "JetBrains Mono, monospace";
const FONT_BODY = "Inter, sans-serif";

export default function ProgressPage() {
  const { token } = useAuth();
  const { dark } = useTheme();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const s = (light, dk) => dark ? dk : light;

  useEffect(() => {
    axios.get(import.meta.env.VITE_API_BASE_URL + "/courses/my-courses", {
      headers: { Authorization: "Bearer " + token }
    })
      .then(r => setCourses(r.data?.data?.courses || r.data?.courses || []))
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, [token]);

  const completed   = courses.filter(c => c.status === "completed").length;
  const inProgress  = courses.filter(c => c.status === "in_progress").length;
  const certs       = courses.filter(c => c.cert_code).length;

  return (
    
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .prog-card:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(0,0,0,0.08) !important; }
        .prog-card { transition:all 0.2s !important; }
      `}</style>

      {/* Header */}
      <div style={{marginBottom:24}}>
        <div style={{fontSize:10,color:"#94A3B8",fontFamily:FONT_MONO,letterSpacing:"0.12em",marginBottom:4}}>LEARN — MY PROGRESS</div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <h1 style={{fontSize:28,fontWeight:800,color:s("#0F172A","#F1F5F9"),fontFamily:FONT,margin:0}}>Progress & Certificates</h1>
          <button onClick={() => navigate("/courses")} style={{padding:"10px 20px",background:"#4F46E5",color:"#fff",border:"none",borderRadius:10,cursor:"pointer",fontWeight:600,fontFamily:FONT,fontSize:13}}>
            Browse Courses →
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:24}}>
        {[
          { label:"Enrolled",    value:courses.length, color:"#3B82F6", bg:s("#EFF6FF","rgba(59,130,246,0.08)"),   icon:"📚" },
          { label:"Completed",   value:completed,      color:"#10B981", bg:s("#F0FDF4","rgba(16,185,129,0.08)"),  icon:"✅" },
          { label:"In Progress", value:inProgress,     color:"#F59E0B", bg:s("#FFFBEB","rgba(245,158,11,0.08)"),  icon:"⏳" },
          { label:"Certificates",value:certs,          color:"#8B5CF6", bg:s("#F5F3FF","rgba(139,92,246,0.08)"),  icon:"🏆" },
        ].map(stat => (
          <div key={stat.label} style={{background:stat.bg,border:`1px solid ${stat.color}30`,borderRadius:14,padding:"18px 20px",boxShadow:s("0 1px 3px rgba(0,0,0,0.04)","none")}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div>
                <div style={{fontSize:10,color:"#94A3B8",letterSpacing:"0.08em",marginBottom:4,fontFamily:FONT_MONO}}>{stat.label.toUpperCase()}</div>
                <div style={{fontSize:32,fontWeight:800,color:stat.color,fontFamily:FONT}}>{stat.value}</div>
              </div>
              <div style={{fontSize:26}}>{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Course list */}
      {loading ? (
        <div style={{textAlign:"center",padding:60,color:"#94A3B8",fontFamily:FONT}}>Loading progress...</div>
      ) : courses.length === 0 ? (
        <div style={{textAlign:"center",padding:60,background:s("#fff","#0F172A"),borderRadius:16,border:`1px solid ${s("#E2E8F0","#1E293B")}`}}>
          <div style={{fontSize:48,marginBottom:12}}>📚</div>
          <div style={{fontSize:18,fontWeight:700,color:s("#0F172A","#F1F5F9"),fontFamily:FONT,marginBottom:8}}>No courses yet</div>
          <p style={{color:"#94A3B8",fontSize:13,fontFamily:FONT_BODY,marginBottom:20}}>Enroll in courses to track your progress here</p>
          <button onClick={() => navigate("/courses")} style={{padding:"10px 24px",background:"#4F46E5",color:"#fff",border:"none",borderRadius:10,cursor:"pointer",fontWeight:600,fontFamily:FONT}}>Browse Courses →</button>
        </div>
      ) : (
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {courses.map((c, i) => {
            const prog = c.progress || 0;
            const done = c.status === "completed";
            const hasCert = !!c.cert_code;
            return (
              <div key={c.id || i} className="prog-card" onClick={() => navigate("/courses/" + c.id)} style={{
                background:s("#fff","#0F172A"),border:`1px solid ${s("#E2E8F0","#1E293B")}`,
                borderRadius:14,padding:"18px 20px",cursor:"pointer",
                boxShadow:s("0 1px 3px rgba(0,0,0,0.04)","none"),
                animation:`fadeUp 0.3s ease ${i*0.05}s both`
              }}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                  <div>
                    <h3 style={{fontSize:15,fontWeight:700,color:s("#0F172A","#F1F5F9"),fontFamily:FONT,marginBottom:4,margin:0}}>{c.title || "Course"}</h3>
                    <div style={{display:"flex",gap:8,marginTop:4}}>
                      <span style={{fontSize:10,color:"#94A3B8",fontFamily:FONT_MONO}}>{c.category || "General"}</span>
                      <span style={{fontSize:10,color:"#94A3B8",fontFamily:FONT_MONO}}>•</span>
                      <span style={{fontSize:10,color:"#94A3B8",fontFamily:FONT_MONO}}>{c.level || "beginner"}</span>
                      <span style={{fontSize:10,color:"#94A3B8",fontFamily:FONT_MONO}}>•</span>
                      <span style={{fontSize:10,color:"#94A3B8",fontFamily:FONT_MONO}}>{c.completed_modules || 0}/{c.total_modules || 0} modules</span>
                    </div>
                  </div>
                  <div style={{display:"flex",gap:8,alignItems:"center"}}>
                    {hasCert && (
                      <span style={{fontSize:10,fontWeight:700,color:"#8B5CF6",background:"#F5F3FF",padding:"4px 10px",borderRadius:10,fontFamily:FONT_MONO,border:"1px solid #DDD6FE"}}>🏆 CERTIFIED</span>
                    )}
                    <span style={{fontSize:10,fontWeight:700,
                      color:done?"#10B981":prog>0?"#F59E0B":"#3B82F6",
                      background:done?"#F0FDF4":prog>0?"#FFFBEB":"#EFF6FF",
                      padding:"4px 10px",borderRadius:10,fontFamily:FONT_MONO,
                      border:`1px solid ${done?"#BBF7D0":prog>0?"#FDE68A":"#BFDBFE"}`
                    }}>
                      {done ? "COMPLETED" : prog > 0 ? "IN PROGRESS" : "ENROLLED"}
                    </span>
                  </div>
                </div>

                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                  <span style={{fontSize:11,color:"#94A3B8",fontFamily:FONT_MONO}}>PROGRESS</span>
                  <span style={{fontSize:11,fontWeight:700,color:done?"#10B981":"#F59E0B",fontFamily:FONT_MONO}}>{prog}%</span>
                </div>
                <div style={{height:8,background:s("#F1F5F9","#1E293B"),borderRadius:4,overflow:"hidden"}}>
                  <div style={{height:"100%",width:prog+"%",background:done?"linear-gradient(90deg,#10B981,#34D399)":"linear-gradient(90deg,#F59E0B,#FCD34D)",borderRadius:4,transition:"width 0.5s"}}/>
                </div>

                {c.enrolled_at && (
                  <div style={{marginTop:8,fontSize:10,color:"#94A3B8",fontFamily:FONT_MONO}}>
                    Enrolled: {new Date(c.enrolled_at).toLocaleDateString("en-IN")}
                    {c.issued_at && <span style={{marginLeft:16}}>Certified: {new Date(c.issued_at).toLocaleDateString("en-IN")}</span>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    
  );
}
