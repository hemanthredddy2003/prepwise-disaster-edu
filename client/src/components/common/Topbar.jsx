import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../context/ThemeContext";

const SEARCH_ITEMS = [
  { label:"Dashboard", path:"/dashboard", icon:"🏠", cat:"Pages" },
  { label:"Courses", path:"/courses", icon:"📚", cat:"Pages" },
  { label:"Simulations", path:"/simulations", icon:"🎮", cat:"Pages" },
  { label:"Certificates", path:"/certificates", icon:"🏆", cat:"Pages" },
  { label:"My Profile", path:"/profile", icon:"👤", cat:"Pages" },
  { label:"Emergency Kit", path:"/kit", icon:"🎒", cat:"Pages" },
  { label:"Shelter Locator", path:"/shelters", icon:"🏕️", cat:"Pages" },
  { label:"Alert System", path:"/alerts", icon:"🚨", cat:"Pages" },
  { label:"Drill Scheduler", path:"/drills", icon:"🔔", cat:"Pages" },
  { label:"Safety Tips", path:"/tips", icon:"💡", cat:"Pages" },
  { label:"Quiz", path:"/quiz", icon:"📝", cat:"Pages" },
  { label:"Disaster Reports", path:"/reports", icon:"📋", cat:"Pages" },
  { label:"Admin Analytics", path:"/admin", icon:"📊", cat:"Pages" },
  { label:"Flood Safety Course", path:"/courses", icon:"🌊", cat:"Courses" },
  { label:"Earthquake Preparedness", path:"/courses", icon:"🏚️", cat:"Courses" },
  { label:"First Aid & CPR", path:"/courses", icon:"🚑", cat:"Courses" },
  { label:"Kerala Flood Simulation", path:"/simulations", icon:"🎮", cat:"Simulations" },
  { label:"Gujarat Earthquake Sim", path:"/simulations", icon:"🎮", cat:"Simulations" },
];

const NOTIFICATIONS = [
  { id:1, icon:"🌀", title:"Cyclone Alert — Odisha", msg:"Category 3 cyclone approaching coast", time:"2 min ago", unread:true, color:"#EF4444" },
  { id:2, icon:"🌊", title:"Flood Warning — Assam", msg:"Brahmaputra river levels rising", time:"1 hr ago", unread:true, color:"#3B82F6" },
  { id:3, icon:"🏆", title:"Certificate Earned!", msg:"You completed Flood Safety course", time:"2 hrs ago", unread:false, color:"#F59E0B" },
  { id:4, icon:"🎮", title:"New Simulation Available", msg:"Chennai Flood 2024 scenario added", time:"1 day ago", unread:false, color:"#8B5CF6" },
  { id:5, icon:"📚", title:"Course Updated", msg:"Earthquake Preparedness updated", time:"2 days ago", unread:false, color:"#10B981" },
];

export default function Topbar() {
  const { user } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifs, setNotifs] = useState(NOTIFICATIONS);
  const searchRef = useRef(null);
  const notifRef = useRef(null);

  const page = location.pathname.split("/")[1] || "dashboard";
  const pageTitle = page.charAt(0).toUpperCase() + page.slice(1);
  const unreadCount = notifs.filter(n => n.unread).length;

  const filtered = search.trim().length > 1
    ? SEARCH_ITEMS.filter(i => i.label.toLowerCase().includes(search.toLowerCase()) || i.cat.toLowerCase().includes(search.toLowerCase()))
    : [];

  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifs(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Keyboard shortcut Cmd+K
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
        setTimeout(() => document.getElementById("global-search")?.focus(), 100);
      }
      if (e.key === "Escape") { setSearchOpen(false); setShowNotifs(false); }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const markAllRead = () => setNotifs(n => n.map(x => ({...x, unread:false})));

  return (
    <header style={{
      position:"fixed", top:0, right:0, left:220, zIndex:99, height:56,
      background: dark ? "#0F172A" : "#fff",
      borderBottom: `1px solid ${dark ? "#1E293B" : "#E2E8F0"}`,
      display:"flex", alignItems:"center", justifyContent:"space-between",
      padding:"0 24px", transition:"all 0.3s",
      boxShadow: dark ? "0 1px 8px rgba(0,0,0,0.3)" : "0 1px 4px rgba(0,0,0,0.04)"
    }}>

      {/* Left — breadcrumb */}
      <div style={{display:"flex", alignItems:"center", gap:8}}>
        <span style={{fontSize:15, fontWeight:700, color: dark?"#F1F5F9":"#0F172A", fontFamily:"Space Grotesk,sans-serif", textTransform:"uppercase", letterSpacing:"0.05em"}}>{pageTitle}</span>
        <span style={{fontSize:12, color: dark?"#475569":"#94A3B8", fontFamily:"JetBrains Mono,monospace"}}>/PREPWISE</span>
      </div>

      {/* Center — Global Search */}
      <div ref={searchRef} style={{position:"relative", flex:1, maxWidth:400, margin:"0 24px"}}>
        <div onClick={() => { setSearchOpen(true); setTimeout(() => document.getElementById("global-search")?.focus(), 50); }}
          style={{display:"flex", alignItems:"center", gap:8, padding:"7px 14px",
            background: dark ? "#1E293B" : "#F8FAFC",
            border:`1px solid ${dark?"#334155":"#E2E8F0"}`,
            borderRadius:10, cursor:"text", transition:"all 0.2s"
          }}>
          <span style={{fontSize:14, color:"#94A3B8"}}>🔍</span>
          <input id="global-search" value={search} onChange={e => { setSearch(e.target.value); setSearchOpen(true); }}
            onFocus={() => setSearchOpen(true)}
            placeholder="Search pages, courses, simulations... (⌘K)"
            style={{border:"none", background:"transparent", outline:"none", fontSize:13,
              color: dark?"#E2E8F0":"#374151", fontFamily:"Inter,sans-serif", width:"100%"
            }} />
          {search && <button onClick={() => setSearch("")} style={{background:"none", border:"none", cursor:"pointer", color:"#94A3B8", fontSize:14}}>✕</button>}
        </div>

        {/* Search results dropdown */}
        {searchOpen && (filtered.length > 0 || search.trim().length > 1) && (
          <div style={{position:"absolute", top:"calc(100% + 6px)", left:0, right:0,
            background: dark?"#0F172A":"#fff",
            border:`1px solid ${dark?"#1E293B":"#E2E8F0"}`,
            borderRadius:12, boxShadow:"0 8px 32px rgba(0,0,0,0.12)", zIndex:200, overflow:"hidden", maxHeight:320, overflowY:"auto"
          }}>
            {filtered.length === 0 && search.trim().length > 1 ? (
              <div style={{padding:"20px", textAlign:"center", color:"#94A3B8", fontSize:13, fontFamily:"Inter,sans-serif"}}>No results for "{search}"</div>
            ) : (
              <>
                <div style={{padding:"8px 14px 4px", fontSize:10, fontWeight:700, color:"#94A3B8", fontFamily:"JetBrains Mono,sans-serif", letterSpacing:"0.08em"}}>RESULTS</div>
                {filtered.map((item, i) => (
                  <div key={i} onClick={() => { navigate(item.path); setSearch(""); setSearchOpen(false); }}
                    style={{display:"flex", alignItems:"center", gap:12, padding:"10px 14px", cursor:"pointer",
                      background:"transparent", transition:"all 0.15s",
                      borderBottom:`1px solid ${dark?"#1E293B":"#F8FAFC"}`
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = dark?"#1E293B":"#F5F3FF"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <span style={{fontSize:18, flexShrink:0}}>{item.icon}</span>
                    <div style={{flex:1}}>
                      <div style={{fontSize:13, fontWeight:600, color: dark?"#E2E8F0":"#0F172A", fontFamily:"Inter,sans-serif"}}>{item.label}</div>
                      <div style={{fontSize:10, color:"#94A3B8", fontFamily:"JetBrains Mono,monospace"}}>{item.cat}</div>
                    </div>
                    <span style={{fontSize:11, color:"#94A3B8"}}>→</span>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>

      {/* Right — actions */}
      <div style={{display:"flex", alignItems:"center", gap:8, flexShrink:0}}>

        {/* Date */}
        <span style={{fontSize:11, color:"#94A3B8", fontFamily:"JetBrains Mono,monospace", marginRight:4}}>
          {new Date().toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}
        </span>

        {/* Dark mode toggle */}
        <button onClick={toggle} style={{
          width:36, height:36, borderRadius:10, border:`1px solid ${dark?"#334155":"#E2E8F0"}`,
          background: dark?"#1E293B":"#F8FAFC", cursor:"pointer", fontSize:17,
          display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.2s"
        }} title={dark?"Switch to Light Mode":"Switch to Dark Mode"}>
          {dark ? "☀️" : "🌙"}
        </button>

        {/* Notifications */}
        <div ref={notifRef} style={{position:"relative"}}>
          <button onClick={() => { setShowNotifs(s => !s); }} style={{
            width:36, height:36, borderRadius:10, border:`1px solid ${dark?"#334155":"#E2E8F0"}`,
            background: dark?"#1E293B":"#F8FAFC", cursor:"pointer", fontSize:16,
            display:"flex", alignItems:"center", justifyContent:"center", position:"relative", transition:"all 0.2s"
          }}>
            🔔
            {unreadCount > 0 && (
              <div style={{position:"absolute", top:-4, right:-4, width:18, height:18, borderRadius:"50%",
                background:"#EF4444", color:"#fff", fontSize:10, fontWeight:700,
                display:"flex", alignItems:"center", justifyContent:"center", border:"2px solid white"
              }}>{unreadCount}</div>
            )}
          </button>

          {/* Notifications panel */}
          {showNotifs && (
            <div style={{position:"absolute", top:"calc(100% + 8px)", right:0, width:340,
              background: dark?"#0F172A":"#fff",
              border:`1px solid ${dark?"#1E293B":"#E2E8F0"}`,
              borderRadius:16, boxShadow:"0 12px 40px rgba(0,0,0,0.15)", zIndex:200, overflow:"hidden"
            }}>
              <div style={{padding:"14px 16px", borderBottom:`1px solid ${dark?"#1E293B":"#F1F5F9"}`, display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                <span style={{fontSize:14, fontWeight:700, color: dark?"#F1F5F9":"#0F172A", fontFamily:"Space Grotesk,sans-serif"}}>Notifications</span>
                <button onClick={markAllRead} style={{fontSize:11, color:"#4F46E5", background:"none", border:"none", cursor:"pointer", fontWeight:600}}>Mark all read</button>
              </div>
              <div style={{maxHeight:320, overflowY:"auto"}}>
                {notifs.map(n => (
                  <div key={n.id} style={{display:"flex", gap:12, padding:"12px 16px",
                    background: n.unread ? (dark?"rgba(79,70,229,0.08)":"#F5F3FF") : "transparent",
                    borderBottom:`1px solid ${dark?"#1E293B":"#F8FAFC"}`,
                    cursor:"pointer", transition:"all 0.15s"
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = dark?"#1E293B":"#F8FAFC"}
                    onMouseLeave={e => e.currentTarget.style.background = n.unread?(dark?"rgba(79,70,229,0.08)":"#F5F3FF"):"transparent"}
                  >
                    <div style={{width:36, height:36, borderRadius:10, background:n.color+"20", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0}}>{n.icon}</div>
                    <div style={{flex:1, minWidth:0}}>
                      <div style={{fontSize:13, fontWeight:n.unread?700:500, color: dark?"#E2E8F0":"#0F172A", fontFamily:"Inter,sans-serif", marginBottom:2}}>{n.title}</div>
                      <div style={{fontSize:11, color:"#64748B", fontFamily:"Inter,sans-serif", lineHeight:1.4}}>{n.msg}</div>
                      <div style={{fontSize:10, color:"#94A3B8", fontFamily:"JetBrains Mono,monospace", marginTop:3}}>{n.time}</div>
                    </div>
                    {n.unread && <div style={{width:8, height:8, borderRadius:"50%", background:"#4F46E5", flexShrink:0, marginTop:4}}/>}
                  </div>
                ))}
              </div>
              <div style={{padding:"10px 16px", borderTop:`1px solid ${dark?"#1E293B":"#F1F5F9"}`, textAlign:"center"}}>
                <button onClick={() => { navigate("/alerts"); setShowNotifs(false); }} style={{fontSize:12, color:"#4F46E5", background:"none", border:"none", cursor:"pointer", fontWeight:600}}>View all alerts →</button>
              </div>
            </div>
          )}
        </div>

        {/* User avatar */}
        <div onClick={() => navigate("/profile")} style={{
          width:36, height:36, borderRadius:10,
          background:"linear-gradient(135deg,#4F46E5,#7C3AED)",
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:14, fontWeight:700, color:"#fff", cursor:"pointer",
          fontFamily:"Space Grotesk,sans-serif", flexShrink:0
        }} title="My Profile">
          {(user?.name||"U")[0].toUpperCase()}
        </div>
      </div>
    </header>
  );
}
