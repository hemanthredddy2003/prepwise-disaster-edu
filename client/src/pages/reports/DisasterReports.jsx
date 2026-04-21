import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../context/ThemeContext";

const FONT = "Space Grotesk, sans-serif";
const FONT_MONO = "JetBrains Mono, monospace";
const FONT_BODY = "Inter, sans-serif";

const TYPE_CONFIG = {
  flood:      { color:"#3B82F6", bg:"rgba(59,130,246,0.1)",  icon:"🌊", label:"Flood" },
  earthquake: { color:"#F59E0B", bg:"rgba(245,158,11,0.1)",  icon:"🏚️", label:"Earthquake" },
  cyclone:    { color:"#8B5CF6", bg:"rgba(139,92,246,0.1)",  icon:"🌀", label:"Cyclone" },
  fire:       { color:"#EF4444", bg:"rgba(239,68,68,0.1)",   icon:"🔥", label:"Fire" },
  landslide:  { color:"#10B981", bg:"rgba(16,185,129,0.1)",  icon:"⛰️", label:"Landslide" },
  tsunami:    { color:"#06B6D4", bg:"rgba(6,182,212,0.1)",   icon:"🌊", label:"Tsunami" },
  heatwave:   { color:"#F97316", bg:"rgba(249,115,22,0.1)",  icon:"🌡️", label:"Heatwave" },
  default:    { color:"#94A3B8", bg:"rgba(148,163,184,0.1)", icon:"📋", label:"Report" },
};

const DEMO_REPORTS = [
  { id:1, title:"Kerala Floods 2018 — Lessons Learned", disaster_type:"flood", description:"The 2018 Kerala floods were the worst in nearly a century, affecting 14 of the 14 districts. This report documents evacuation protocols, community response, and key preparedness gaps identified.", location:"Kerala", year:2018 },
  { id:2, title:"Gujarat Earthquake 2001 — Bhuj Impact Assessment", disaster_type:"earthquake", description:"The 2001 Bhuj earthquake (Mw 7.7) killed over 20,000 people and caused massive structural damage. This report covers building code failures, rescue operations, and post-disaster reconstruction.", location:"Gujarat", year:2001 },
  { id:3, title:"Odisha Super Cyclone 1999 — Emergency Response", disaster_type:"cyclone", description:"The 1999 Odisha super cyclone was one of the deadliest tropical storms to hit India. Wind speeds exceeded 260 km/h. This report analyzes the warning systems and evacuation effectiveness.", location:"Odisha", year:1999 },
  { id:4, title:"Uttarakhand Flash Floods 2013 — Kedarnath Disaster", disaster_type:"flood", description:"The 2013 Uttarakhand floods caused over 5,000 deaths. This report examines cloud burst patterns, rescue helicopter operations, and improvements in mountain disaster response protocols.", location:"Uttarakhand", year:2013 },
  { id:5, title:"Assam Landslides 2022 — Monsoon Season Report", disaster_type:"landslide", description:"Unprecedented monsoon rainfall triggered hundreds of landslides across Assam, displacing over 4 lakh people. Documents early warning systems and NDRF deployment strategies.", location:"Assam", year:2022 },
  { id:6, title:"Tamil Nadu Tsunami 2004 — Indian Ocean Impact", disaster_type:"tsunami", description:"The 2004 Indian Ocean tsunami devastated Tamil Nadu and Andaman & Nicobar Islands. This report reviews coastal community vulnerability, warning systems, and the formation of India's tsunami alert network.", location:"Tamil Nadu", year:2004 },
  { id:7, title:"Delhi Heatwave 2024 — Public Health Response", disaster_type:"heatwave", description:"Delhi recorded temperatures above 50°C during May 2024, the highest in recorded history. This report covers cooling centre operations, hospital surge capacity, and heatwave preparedness guidelines.", location:"Delhi", year:2024 },
  { id:8, title:"Andhra Pradesh Cyclone Phailin 2013 — Evacuation Success", disaster_type:"cyclone", description:"Cyclone Phailin made landfall with 220 km/h winds but resulted in only 45 deaths due to one of the largest evacuations in Indian history — nearly 10 lakh people moved in 48 hours.", location:"Andhra Pradesh", year:2013 },
];

const TYPES = ["ALL","FLOOD","EARTHQUAKE","CYCLONE","FIRE","LANDSLIDE","TSUNAMI","HEATWAVE"];

export default function DisasterReports() {
  const { token } = useAuth();
  const { dark } = useTheme();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selType, setSelType] = useState("ALL");
  const [expanded, setExpanded] = useState(null);

  const s = (light, dk) => dark ? dk : light;

  useEffect(() => {
    axios.get(import.meta.env.VITE_API_BASE_URL + "/reports", {
      headers: { Authorization: "Bearer " + token }
    }).then(r => {
      const data = r.data?.data?.reports || r.data?.reports || [];
      setReports(data.length > 0 ? data : DEMO_REPORTS);
    }).catch(() => setReports(DEMO_REPORTS))
      .finally(() => setLoading(false));
  }, [token]);

  const getCfg = (type) => TYPE_CONFIG[(type||"default").toLowerCase()] || TYPE_CONFIG.default;

  const filtered = reports.filter(r => {
    const matchType = selType === "ALL" || (r.disaster_type || r.type || "").toUpperCase() === selType;
    const matchSearch = !search || (r.title||"").toLowerCase().includes(search.toLowerCase()) || (r.location||"").toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  // Count by type
  const counts = {};
  TYPES.slice(1).forEach(t => {
    counts[t] = reports.filter(r => (r.disaster_type||r.type||"").toUpperCase() === t).length;
  });

  return (
    
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .report-card:hover { transform:translateY(-3px); box-shadow: 0 12px 32px rgba(0,0,0,0.1) !important; }
        .report-card { transition: all 0.2s !important; }
        .type-btn:hover { transform:translateY(-1px); }
      `}</style>

      {/* Header */}
      <div style={{marginBottom:24}}>
        <div style={{fontSize:10,color:"#94A3B8",fontFamily:FONT_MONO,letterSpacing:"0.12em",marginBottom:4}}>SAFETY — DOCUMENTATION</div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
          <h1 style={{fontSize:28,fontWeight:800,color:s("#0F172A","#F1F5F9"),fontFamily:FONT,margin:0}}>Disaster Reports</h1>
          <div style={{display:"flex",gap:10}}>
            {[
              [reports.length, "Total Reports", "#4F46E5"],
              [Object.values(counts).filter(v=>v>0).length, "Disaster Types", "#10B981"],
            ].map(([val,label,color]) => (
              <div key={label} style={{background:s("#fff","#0F172A"),border:`1px solid ${s("#E2E8F0","#1E293B")}`,borderRadius:12,padding:"10px 16px",textAlign:"center"}}>
                <div style={{fontSize:20,fontWeight:800,color,fontFamily:FONT}}>{val}</div>
                <div style={{fontSize:9,color:"#94A3B8",fontFamily:FONT_MONO}}>{label.toUpperCase()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Search + filter */}
      <div style={{background:s("#fff","#0F172A"),border:`1px solid ${s("#E2E8F0","#1E293B")}`,borderRadius:16,padding:"16px 20px",marginBottom:20,boxShadow:s("0 1px 4px rgba(0,0,0,0.04)","none")}}>
        <div style={{display:"flex",alignItems:"center",gap:8,background:s("#F8FAFC","#1E293B"),border:`1px solid ${s("#E2E8F0","#334155")}`,borderRadius:10,padding:"9px 14px",marginBottom:12}}>
          <span style={{fontSize:16,color:"#94A3B8"}}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search reports by title or location..."
            style={{border:"none",background:"transparent",outline:"none",fontSize:13,color:s("#374151","#E2E8F0"),fontFamily:FONT_BODY,width:"100%"}}/>
          {search && <button onClick={() => setSearch("")} style={{background:"none",border:"none",cursor:"pointer",color:"#94A3B8",fontSize:14}}>✕</button>}
        </div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {TYPES.map(t => {
            const cfg = t === "ALL" ? { color:"#4F46E5", icon:"📋" } : getCfg(t.toLowerCase());
            const active = selType === t;
            const count = t === "ALL" ? reports.length : (counts[t] || 0);
            return (
              <button key={t} className="type-btn" onClick={() => setSelType(t)} style={{
                padding:"6px 12px",borderRadius:20,transition:"all 0.15s",
                border:`1px solid ${active ? cfg.color : s("#E2E8F0","#334155")}`,
                background: active ? cfg.color : s("#F8FAFC","#1E293B"),
                color: active ? "#fff" : s("#475569","#94A3B8"),
                fontSize:11,fontWeight:active?700:500,cursor:"pointer",fontFamily:FONT_MONO,
                display:"flex",alignItems:"center",gap:5
              }}>
                <span>{cfg.icon}</span> {t} {count > 0 && <span style={{fontSize:9,opacity:0.8}}>({count})</span>}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{fontSize:11,color:"#94A3B8",fontFamily:FONT_MONO,marginBottom:14}}>{filtered.length} REPORTS FOUND</div>

      {/* Reports grid */}
      {loading ? (
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:14}}>
          {[1,2,3,4].map(i => <div key={i} style={{height:200,background:s("#F8FAFC","#0F172A"),borderRadius:14,border:`1px solid ${s("#E2E8F0","#1E293B")}`}}/>)}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{textAlign:"center",padding:60,background:s("#fff","#0F172A"),borderRadius:16,border:`1px solid ${s("#E2E8F0","#1E293B")}`}}>
          <div style={{fontSize:48,marginBottom:12}}>📋</div>
          <div style={{fontSize:16,fontWeight:700,color:s("#0F172A","#F1F5F9"),fontFamily:FONT}}>No Reports Found</div>
          <button onClick={() => {setSearch("");setSelType("ALL");}} style={{marginTop:16,padding:"8px 20px",background:"#4F46E5",color:"#fff",border:"none",borderRadius:8,cursor:"pointer",fontWeight:600,fontFamily:FONT}}>Clear filters</button>
        </div>
      ) : (
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:14}}>
          {filtered.map((r, i) => {
            const type = (r.disaster_type || r.type || "default").toLowerCase();
            const cfg = getCfg(type);
            const isExpanded = expanded === (r.id || i);
            return (
              <div key={r.id || i} className="report-card" style={{
                background:s("#fff","#0F172A"),border:`1px solid ${s("#E2E8F0","#1E293B")}`,
                borderRadius:16,overflow:"hidden",cursor:"pointer",
                boxShadow:s("0 2px 8px rgba(0,0,0,0.04)","0 2px 8px rgba(0,0,0,0.2)"),
                animation:`fadeUp 0.3s ease ${i*0.04}s both`
              }} onClick={() => setExpanded(isExpanded ? null : (r.id || i))}>
                <div style={{height:4,background:cfg.color}}/>
                <div style={{padding:"18px 20px"}}>
                  {/* Icon + type */}
                  <div style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:12}}>
                    <div style={{width:46,height:46,borderRadius:13,background:cfg.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0,border:`1px solid ${cfg.color}25`}}>
                      {cfg.icon}
                    </div>
                    <div style={{flex:1}}>
                      <span style={{fontSize:9,fontWeight:700,color:cfg.color,background:cfg.bg,padding:"2px 8px",borderRadius:8,fontFamily:FONT_MONO,display:"inline-block",marginBottom:6}}>{cfg.label.toUpperCase()}</span>
                      <h3 style={{fontSize:14,fontWeight:700,color:s("#0F172A","#F1F5F9"),fontFamily:FONT,lineHeight:1.4,margin:0}}>{r.title}</h3>
                    </div>
                  </div>

                  {/* Description */}
                  <p style={{fontSize:12,color:s("#64748B","#94A3B8"),lineHeight:1.7,marginBottom:12,fontFamily:FONT_BODY,display:"-webkit-box",WebkitLineClamp:isExpanded?100:3,WebkitBoxOrient:"vertical",overflow:"hidden"}}>
                    {r.description || r.summary || "No description available."}
                  </p>

                  {/* Footer */}
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:10,borderTop:`1px solid ${s("#F1F5F9","#1E293B")}`}}>
                    <div style={{display:"flex",gap:10}}>
                      {r.location && <span style={{fontSize:10,color:"#94A3B8",fontFamily:FONT_MONO,display:"flex",alignItems:"center",gap:3}}>📍 {r.location}</span>}
                      {(r.year || r.createdAt) && <span style={{fontSize:10,color:"#94A3B8",fontFamily:FONT_MONO}}>📅 {r.year || new Date(r.createdAt).getFullYear()}</span>}
                    </div>
                    <span style={{fontSize:10,color:cfg.color,fontFamily:FONT_MONO,fontWeight:600}}>{isExpanded?"Show less ↑":"Read more ↓"}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    
  );
}
