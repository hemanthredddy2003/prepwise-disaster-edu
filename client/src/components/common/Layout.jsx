import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import ChatBot from "../chatbot/ChatBot";
import { useTheme } from "../../context/ThemeContext";

function EmergencyButton() {
  const [open, setOpen] = useState(false);
  const emergencyContacts = [
    { label:"National Emergency",  number:"112", icon:"🚨", color:"#EF4444" },
    { label:"Ambulance",           number:"108", icon:"🚑", color:"#F97316" },
    { label:"NDMA Helpline",       number:"1078",icon:"🛡️", color:"#3B82F6" },
    { label:"Disaster Mgmt",       number:"1077",icon:"🌊", color:"#8B5CF6" },
    { label:"Fire Brigade",        number:"101", icon:"🔥", color:"#EF4444" },
    { label:"Police",              number:"100", icon:"👮", color:"#1D4ED8" },
  ];

  return (
    <div style={{position:"fixed",bottom:90,right:24,zIndex:9999,display:"flex",flexDirection:"column",alignItems:"flex-end",gap:10}}>
      {open && (
        <div style={{background:"#0F172A",border:"1px solid rgba(239,68,68,0.4)",borderRadius:16,padding:"14px 16px",width:240,boxShadow:"0 20px 60px rgba(0,0,0,0.5)"}}>
          <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.5)",letterSpacing:"0.1em",marginBottom:10,fontFamily:"JetBrains Mono, monospace"}}>🆘 EMERGENCY CONTACTS</div>
          {emergencyContacts.map(({label,number,icon,color}) => (
            <a key={number} href={`tel:${number}`} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"9px 10px",borderRadius:10,marginBottom:5,background:"rgba(255,255,255,0.06)",textDecoration:"none",border:"1px solid rgba(255,255,255,0.08)",cursor:"pointer"}}
              onClick={e => { e.preventDefault(); window.location.href = `tel:${number}`; }}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:16}}>{icon}</span>
                <div>
                  <div style={{fontSize:12,fontWeight:600,color:"#E2E8F0",fontFamily:"Space Grotesk, sans-serif"}}>{label}</div>
                </div>
              </div>
              <div style={{fontSize:16,fontWeight:800,color:color,fontFamily:"JetBrains Mono, monospace"}}>{number}</div>
            </a>
          ))}
          <div style={{marginTop:10,paddingTop:10,borderTop:"1px solid rgba(255,255,255,0.08)",fontSize:10,color:"rgba(255,255,255,0.35)",textAlign:"center",fontFamily:"Inter, sans-serif"}}>Tap any number to call</div>
        </div>
      )}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width:56,height:56,borderRadius:"50%",
          background:open?"#1E293B":"linear-gradient(135deg,#EF4444,#DC2626)",
          border:open?"2px solid #EF4444":"none",
          color:"#fff",fontSize:24,cursor:"pointer",
          boxShadow:open?"0 0 0 4px rgba(239,68,68,0.2)":"0 4px 20px rgba(239,68,68,0.5)",
          display:"flex",alignItems:"center",justifyContent:"center",
          transition:"all 0.2s",
          animation: open ? "none" : "sos-pulse 2s infinite",
        }}
        title="Emergency Contacts"
      >
        {open ? "✕" : "🆘"}
      </button>
      <style>{`
        @keyframes sos-pulse {
          0%,100% { box-shadow: 0 4px 20px rgba(239,68,68,0.5); }
          50%      { box-shadow: 0 4px 30px rgba(239,68,68,0.9), 0 0 0 8px rgba(239,68,68,0.15); }
        }
      `}</style>
    </div>
  );
}

export default function Layout({ children }) {
  const { dark } = useTheme();
  const location = useLocation();
  const [pageKey, setPageKey] = useState(location.pathname);
  useEffect(() => { setPageKey(location.pathname); }, [location.pathname]);

  return (
    <div style={{display:"flex",background:dark?"#0A0F1E":"#F0F4F8",minHeight:"100vh",transition:"background 0.3s"}}>
      <Sidebar />
      <div style={{marginLeft:220,flex:1,display:"flex",flexDirection:"column",minWidth:0,transition:"margin 0.25s ease"}}>
        <Topbar />
        <main key={pageKey} className="page-enter" style={{flex:1,padding:"24px",marginTop:56,minHeight:"calc(100vh - 56px)",overflowX:"hidden"}}>
          <Outlet />
        </main>
      </div>
      <ChatBot />
      <EmergencyButton />
    </div>
  );
}
