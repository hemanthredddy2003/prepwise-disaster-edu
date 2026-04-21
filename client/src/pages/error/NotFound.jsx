import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

export default function NotFound() {
  const navigate = useNavigate();
  const { dark } = useTheme();

  return (
    <div style={{
      minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center",
      background: dark?"#0A0F1E":"#F0F4F8", flexDirection:"column", textAlign:"center", padding:24
    }}>
      <style>{`@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-16px)}} @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}</style>

      <div style={{animation:"float 3s ease-in-out infinite", fontSize:80, marginBottom:16}}>🌪️</div>

      <div style={{animation:"fadeUp 0.5s ease"}}>
        <div style={{fontSize:96, fontWeight:800, color:"#4F46E5", fontFamily:"Space Grotesk,sans-serif", lineHeight:1, marginBottom:8}}>404</div>
        <h1 style={{fontSize:28, fontWeight:700, color: dark?"#F1F5F9":"#0F172A", fontFamily:"Space Grotesk,sans-serif", marginBottom:12}}>
          Page Not Found
        </h1>
        <p style={{fontSize:15, color:"#64748B", maxWidth:400, margin:"0 auto 32px", lineHeight:1.7, fontFamily:"Inter,sans-serif"}}>
          Looks like this page got swept away in a disaster! Let us help you get back to safety.
        </p>

        <div style={{display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap"}}>
          <button onClick={() => navigate(-1)} style={{padding:"11px 24px", background:dark?"#1E293B":"#fff", color: dark?"#E2E8F0":"#374151", border:`1px solid ${dark?"#334155":"#E2E8F0"}`, borderRadius:10, cursor:"pointer", fontSize:14, fontWeight:600, fontFamily:"Space Grotesk,sans-serif"}}>
            ← Go Back
          </button>
          <button onClick={() => navigate("/dashboard")} style={{padding:"11px 24px", background:"linear-gradient(135deg,#4F46E5,#7C3AED)", color:"#fff", border:"none", borderRadius:10, cursor:"pointer", fontSize:14, fontWeight:700, fontFamily:"Space Grotesk,sans-serif", boxShadow:"0 4px 12px rgba(79,70,229,0.3)"}}>
            🏠 Go to Dashboard
          </button>
        </div>

        <div style={{marginTop:32, display:"flex", gap:16, justifyContent:"center", flexWrap:"wrap"}}>
          {[["🎮","Simulations","/simulations"],["📚","Courses","/courses"],["🤖","AI Chat","/dashboard"],["🏆","Certificates","/certificates"]].map(([icon,label,path])=>(
            <div key={label} onClick={()=>navigate(path)} style={{padding:"8px 16px", background:dark?"rgba(79,70,229,0.15)":"#EEF2FF", borderRadius:10, cursor:"pointer", fontSize:12, fontWeight:600, color:"#4F46E5", fontFamily:"Inter,sans-serif", display:"flex", gap:6, alignItems:"center"}}>
              {icon} {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
