import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";

const TYPE_ICONS = { video:"🎬", pdf:"📄", guide:"📚", article:"📰", default:"📋" };
const TYPE_COLORS = { video:"#EF4444", pdf:"#F59E0B", guide:"#3B82F6", article:"#10B981", default:"#8B5CF6" };

export default function ResourceLibrary() {
  const { token } = useAuth();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selType, setSelType] = useState("ALL");

  useEffect(() => {
    axios.get(import.meta.env.VITE_API_BASE_URL+"/resources", { headers:{ Authorization:"Bearer "+token } })
      .then(r => setResources(r.data?.data?.resources || r.data?.resources || []))
      .catch(() => setResources([]))
      .finally(() => setLoading(false));
  }, [token]);

  const types = ["ALL","VIDEO","PDF","GUIDE","ARTICLE"];
  const filtered = resources.filter(r => {
    const matchType = selType==="ALL" || (r.type||r.resource_type||"").toUpperCase()===selType;
    const matchSearch = !search || (r.title||"").toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    
      <div style={{marginBottom:24}}>
        <div style={{fontSize:10,color:"#94A3B8",fontFamily:"JetBrains Mono,monospace",letterSpacing:"0.12em",marginBottom:4}}>LEARN — TRAINING</div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <h1 style={{fontSize:32,fontWeight:800,color:"#0F172A",fontFamily:"Space Grotesk,sans-serif"}}>Training Center</h1>
          <span style={{fontSize:28,fontWeight:800,color:"#E2E8F0",fontFamily:"Space Grotesk,sans-serif"}}>{resources.length}</span>
        </div>
      </div>

      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search resources..."
        style={{width:"100%",padding:"12px 16px",background:"#fff",border:"1px solid #E2E8F0",borderRadius:10,fontSize:13,color:"#0F172A",outline:"none",fontFamily:"Inter,sans-serif",marginBottom:14}} />

      <div style={{display:"flex",gap:8,marginBottom:20}}>
        {types.map(t => (
          <button key={t} onClick={()=>setSelType(t)} style={{padding:"6px 14px",borderRadius:20,border:"1px solid "+(selType===t?"#3B82F6":"#E2E8F0"),background:selType===t?"#3B82F6":"#fff",color:selType===t?"#fff":"#64748B",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"JetBrains Mono,monospace",transition:"all 0.15s"}}>{t}</button>
        ))}
      </div>

      {loading ? (
        <div style={{textAlign:"center",padding:60,color:"#94A3B8"}}>Loading resources...</div>
      ) : filtered.length === 0 ? (
        <div style={{textAlign:"center",padding:60,background:"#fff",borderRadius:16,border:"1px solid #E2E8F0"}}>
          <div style={{fontSize:40,marginBottom:12}}>📚</div>
          <div style={{fontSize:16,fontWeight:700,color:"#0F172A",fontFamily:"Space Grotesk,sans-serif"}}>No Resources Found</div>
        </div>
      ) : (
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:14}}>
          {filtered.map((r,i) => {
            const type = (r.type||r.resource_type||"default").toLowerCase();
            const col = TYPE_COLORS[type]||TYPE_COLORS.default;
            const icon = TYPE_ICONS[type]||TYPE_ICONS.default;
            return (
              <div key={i} style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:14,overflow:"hidden",boxShadow:"0 1px 3px rgba(0,0,0,0.04)",cursor:"pointer",transition:"all 0.2s"}}
                onClick={()=>r.url && window.open(r.url,"_blank")}
                onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
                onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
                <div style={{height:4,background:`linear-gradient(90deg,${col},${col}40)`}} />
                <div style={{padding:"18px 20px"}}>
                  <div style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:10}}>
                    <div style={{width:44,height:44,borderRadius:12,background:col+"15",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{icon}</div>
                    <div>
                      <span style={{fontSize:9,fontWeight:700,color:col,background:col+"15",padding:"2px 8px",borderRadius:10,fontFamily:"JetBrains Mono,monospace",display:"inline-block",marginBottom:6}}>{type.toUpperCase()}</span>
                      <h3 style={{fontSize:14,fontWeight:700,color:"#0F172A",fontFamily:"Space Grotesk,sans-serif",lineHeight:1.4}}>{r.title}</h3>
                    </div>
                  </div>
                  <p style={{fontSize:12,color:"#64748B",lineHeight:1.6,marginBottom:10}}>{(r.description||"").slice(0,100)}</p>
                  {r.duration && <span style={{fontSize:10,color:"#94A3B8",fontFamily:"JetBrains Mono,monospace"}}>⏱ {r.duration}</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    
  );
}
