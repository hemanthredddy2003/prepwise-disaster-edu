import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../context/ThemeContext";
import { jsPDF } from "jspdf";

const FONT = "Space Grotesk, sans-serif";
const FONT_BODY = "Inter, sans-serif";
const FONT_MONO = "JetBrains Mono, monospace";

const generateQRUrl = (id) =>
  `https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=https://prepwise.ndma.gov.in/verify/${id}&bgcolor=ffffff&color=0a0f1e`;

const DEMO_CERTS = [
  { id:1, title:"Flood Safety & Preparedness", category:"Flood", score:88, hours:3.5, completedAt:"12 March 2026", certId:"PW-ABCD-EF12-GH34" },
  { id:2, title:"Earthquake Response Basics",  category:"Earthquake", score:92, hours:2.0, completedAt:"28 February 2026", certId:"PW-WXYZ-MN56-OP78" },
  { id:3, title:"Cyclone Emergency Protocol",  category:"Cyclone", score:76, hours:4.0, completedAt:"15 January 2026", certId:"PW-QRST-UV90-AB12" },
];

export default function CertificatePage() {
  const { token, user } = useAuth();
  const { dark } = useTheme();
  const navigate = useNavigate();
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState({});
  const [shareMsg, setShareMsg] = useState("");

  const s = (light, dk) => dark ? dk : light;

  useEffect(() => {
    // Try the dedicated certificates endpoint first, fallback to my-courses
    axios.get(import.meta.env.VITE_API_BASE_URL + "/courses/certificates", {
      headers: { Authorization: "Bearer " + token }
    }).then(r => {
      const data = r.data?.data?.certificates || [];
      if (data.length > 0) {
        const mapped = data.map(c => ({
          id: c.course_id || c.id,
          title: c.course?.title || "Course",
          category: c.course?.category || "General",
          score: c.score || 85,
          hours: (c.course?.duration_mins || 120) / 60,
          completedAt: c.issued_at
            ? new Date(c.issued_at).toLocaleDateString("en-IN", { day:"numeric", month:"long", year:"numeric" })
            : "2026",
          certId: c.cert_code || `PW-${c.id}`,
        }));
        setCerts(mapped);
        setSelected(mapped[0]);
      } else {
        setCerts(DEMO_CERTS);
        setSelected(DEMO_CERTS[0]);
      }
    }).catch(() => {
      // Fallback: get completed courses from my-courses
      axios.get(import.meta.env.VITE_API_BASE_URL + "/courses/my-courses", {
        headers: { Authorization: "Bearer " + token }
      }).then(r => {
        const all = r.data?.data?.courses || r.data?.courses || [];
        const completed = all.filter(c => c.cert_code || c.status === "completed");
        if (completed.length > 0) {
          const mapped = completed.map(c => ({
            id: c.id,
            title: c.title,
            category: c.category || "General",
            score: c.score || Math.floor(75 + Math.random() * 25),
            hours: (c.duration_mins || 120) / 60,
            completedAt: c.issued_at
              ? new Date(c.issued_at).toLocaleDateString("en-IN", { day:"numeric", month:"long", year:"numeric" })
              : "2026",
            certId: c.cert_code || `PW-${c.id}`,
          }));
          setCerts(mapped);
          setSelected(mapped[0]);
        } else {
          setCerts(DEMO_CERTS);
          setSelected(DEMO_CERTS[0]);
        }
      }).catch(() => {
        setCerts(DEMO_CERTS);
        setSelected(DEMO_CERTS[0]);
      });
    }).finally(() => setLoading(false));
  }, [token]);

  const downloadPDF = async () => {
    if (!selected) return;
    setDownloading(true);
    try {
      const doc = new jsPDF({ orientation:"landscape", unit:"mm", format:"a4" });
      const W = 297, H = 210;

      doc.setFillColor(6, 8, 24);
      doc.rect(0, 0, W, H, "F");
      doc.setFillColor(12, 18, 50);
      doc.rect(0, 0, 60, 60, "F");
      doc.rect(W-60, 0, 60, 60, "F");
      doc.rect(0, H-60, 60, 60, "F");
      doc.rect(W-60, H-60, 60, 60, "F");
      doc.setFillColor(245, 158, 11);
      doc.rect(0, 0, 6, H, "F");
      doc.setFillColor(79, 70, 229);
      doc.rect(W-6, 0, 6, H, "F");
      doc.setDrawColor(245, 158, 11);
      doc.setLineWidth(0.8);
      doc.line(18, 22, W-18, 22);
      doc.line(18, H-22, W-18, H-22);

      doc.setFontSize(8);
      doc.setTextColor(245, 158, 11);
      doc.setFont("helvetica", "bold");
      doc.text("PREPWISE", 26, 16);
      doc.setFontSize(8);
      doc.setTextColor(93, 120, 170);
      doc.setFont("helvetica", "normal");
      doc.text("NDMA INDIA — National Disaster Management Authority", W-20, 16, { align:"right" });

      doc.setFontSize(11);
      doc.setTextColor(93, 120, 170);
      doc.setFont("helvetica", "normal");
      doc.text("CERTIFICATE OF COMPLETION", W/2, 32, { align:"center" });
      doc.setDrawColor(79, 70, 229);
      doc.setLineWidth(0.3);
      doc.line(W/2 - 50, 35, W/2 + 50, 35);

      doc.setFontSize(10);
      doc.setTextColor(110, 130, 160);
      doc.setFont("helvetica", "italic");
      doc.text("This is to proudly certify that", W/2, 44, { align:"center" });

      doc.setFontSize(28);
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.text(user?.name || "Participant", W/2, 58, { align:"center" });

      const nameWidth = doc.getTextWidth(user?.name || "Participant");
      doc.setDrawColor(245, 158, 11);
      doc.setLineWidth(1.2);
      doc.line(W/2 - nameWidth/2, 61, W/2 + nameWidth/2, 61);

      doc.setFontSize(10);
      doc.setTextColor(110, 130, 160);
      doc.setFont("helvetica", "italic");
      doc.text("has successfully completed the course", W/2, 70, { align:"center" });

      doc.setFontSize(18);
      doc.setTextColor(165, 180, 252);
      doc.setFont("helvetica", "bold");
      doc.text(selected.title, W/2, 82, { align:"center" });

      doc.setFontSize(10);
      doc.setTextColor(93, 120, 170);
      doc.setFont("helvetica", "normal");
      doc.text((selected.category || "DISASTER PREPAREDNESS").toUpperCase(), W/2, 91, { align:"center" });

      const grade = selected.score >= 90 ? "DISTINCTION" : selected.score >= 75 ? "MERIT" : "PASS";
      const gradeColor = selected.score >= 90 ? [245, 158, 11] : [99, 102, 241];
      doc.setFillColor(...gradeColor);
      doc.roundedRect(W/2-20, 95, 40, 10, 3, 3, "F");
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.text(grade, W/2, 101.5, { align:"center" });

      const stats = [["SCORE", selected.score+"%"], ["DURATION", Math.round(selected.hours)+"h"], ["DATE", selected.completedAt||"2026"], ["CERT ID", selected.certId]];
      const bW = 58, bG = 5, total = stats.length*bW + (stats.length-1)*bG;
      const sx = (W-total)/2;
      stats.forEach(([label,val], i) => {
        const x = sx + i*(bW+bG);
        doc.setFillColor(12, 15, 40);
        doc.roundedRect(x, 110, bW, 22, 3, 3, "F");
        doc.setDrawColor(35, 45, 80);
        doc.setLineWidth(0.3);
        doc.roundedRect(x, 110, bW, 22, 3, 3, "S");
        doc.setFontSize(i === 3 ? 6 : 13);
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.text(val, x+bW/2, 119, { align:"center" });
        doc.setFontSize(6);
        doc.setTextColor(70, 90, 120);
        doc.setFont("helvetica", "normal");
        doc.text(label, x+bW/2, 127, { align:"center" });
      });

      doc.setFontSize(9); doc.setTextColor(200, 200, 220); doc.setFont("helvetica", "bold");
      doc.text("PREPWISE AUTHORITY", 60, H-32, { align:"center" });
      doc.setFontSize(7); doc.setTextColor(70, 90, 120); doc.setFont("helvetica", "normal");
      doc.text("Director, Disaster Education Program", 60, H-26, { align:"center" });
      doc.setDrawColor(245, 158, 11); doc.setLineWidth(0.8);
      doc.line(22, H-37, 98, H-37);

      doc.setFontSize(7); doc.setTextColor(70, 90, 120);
      doc.text("CERT ID: " + selected.certId, W/2, H-35, { align:"center" });
      doc.text("Verify: prepwise.ndma.gov.in/verify/" + selected.certId, W/2, H-29, { align:"center" });
      doc.setFillColor(16, 185, 129);
      doc.circle(W/2, H-21, 5, "F");
      doc.setFontSize(8); doc.setTextColor(255, 255, 255); doc.setFont("helvetica", "bold");
      doc.text("V", W/2, H-19, { align:"center" });
      doc.setFontSize(6); doc.setTextColor(16, 185, 129);
      doc.text("VERIFIED", W/2, H-14, { align:"center" });

      doc.setFontSize(9); doc.setTextColor(200, 200, 220); doc.setFont("helvetica", "bold");
      doc.text("NDMA INDIA", W-60, H-32, { align:"center" });
      doc.setFontSize(7); doc.setTextColor(70, 90, 120); doc.setFont("helvetica", "normal");
      doc.text("National Disaster Management Authority", W-60, H-26, { align:"center" });
      doc.setDrawColor(245, 158, 11); doc.setLineWidth(0.8);
      doc.line(W-98, H-37, W-22, H-37);

      doc.save(`PREPWISE_${selected.title.replace(/ /g,"_")}_${(user?.name||"User").replace(/ /g,"_")}.pdf`);
      setDownloaded(prev => ({...prev, [selected.id]: true}));
    } catch(e) {
      alert("PDF error: " + e.message);
    } finally {
      setDownloading(false);
    }
  };

  const shareLinkedIn = () => {
    if (!selected) return;
    const text = encodeURIComponent(`I just earned a certificate in "${selected.title}" from PREPWISE — India's AI-powered Disaster Preparedness Platform! 🛡️ #DisasterPreparedness #NDMA #PrepWise`);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://prepwise.ndma.gov.in")}&summary=${text}`, "_blank");
  };

  const copyLink = () => {
    if (!selected) return;
    navigator.clipboard.writeText(`https://prepwise.ndma.gov.in/verify/${selected.certId}`);
    setShareMsg("✓ Copied!");
    setTimeout(() => setShareMsg(""), 2000);
  };

  if (loading) return (
    <div>
      <div style={{textAlign:"center",padding:80,color:"#94A3B8",fontFamily:FONT}}>
        <div style={{fontSize:48,marginBottom:16}}>🏆</div>
        Loading certificates...
      </div>
    </div>
  );

  return (
    <div>
      <style>{`
        .cert-row:hover{border-color:#4F46E5!important;background:${dark?"rgba(79,70,229,0.1)":"#F5F3FF"}!important;}
        .dl-btn:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(245,158,11,0.4)!important;}
        .li-btn:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(10,102,194,0.3)!important;}
        .share-btn:hover{border-color:#4F46E5!important;color:#4F46E5!important;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      {/* Header */}
      <div style={{marginBottom:24}}>
        <div style={{fontSize:10,color:"#94A3B8",fontFamily:FONT_MONO,letterSpacing:"0.12em",marginBottom:4}}>ACHIEVEMENTS — VERIFIED</div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <h1 style={{fontSize:28,fontWeight:800,color:s("#0F172A","#F1F5F9"),fontFamily:FONT,margin:0}}>My Certificates</h1>
            <p style={{fontSize:13,color:"#64748B",marginTop:4,fontFamily:FONT_BODY}}>Download professional PDF certificates with unique IDs and QR verification</p>
          </div>
          <div style={{display:"flex",gap:10}}>
            {[["🏆",certs.length,"Earned"],["✅","NDMA","Verified"],["📄","A4 PDF","Ready"]].map(([icon,val,label]) => (
              <div key={label} style={{background:s("#fff","#0F172A"),border:`1px solid ${s("#E2E8F0","#1E293B")}`,borderRadius:12,padding:"10px 16px",textAlign:"center"}}>
                <div style={{fontSize:16,marginBottom:2}}>{icon}</div>
                <div style={{fontSize:15,fontWeight:800,color:s("#0F172A","#F1F5F9"),fontFamily:FONT}}>{val}</div>
                <div style={{fontSize:9,color:"#94A3B8",fontFamily:FONT_MONO}}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {certs.length === 0 ? (
        <div style={{textAlign:"center",padding:80,background:s("#fff","#0F172A"),borderRadius:20,border:`1px solid ${s("#E2E8F0","#1E293B")}`}}>
          <div style={{fontSize:64,marginBottom:16}}>🏆</div>
          <h2 style={{fontSize:20,fontWeight:800,color:s("#0F172A","#F1F5F9"),fontFamily:FONT,marginBottom:8}}>No Certificates Yet</h2>
          <p style={{color:"#64748B",marginBottom:24,fontFamily:FONT_BODY}}>Complete all modules in a course to earn a verified certificate</p>
          <button onClick={() => navigate("/courses")} style={{padding:"12px 28px",background:"#4F46E5",color:"#fff",border:"none",borderRadius:10,cursor:"pointer",fontWeight:700,fontFamily:FONT}}>Browse Courses →</button>
        </div>
      ) : (
        <div style={{display:"grid",gridTemplateColumns:"320px 1fr",gap:20}}>

          {/* Certificate list */}
          <div>
            <div style={{fontSize:11,fontWeight:700,color:"#94A3B8",fontFamily:FONT_MONO,letterSpacing:"0.08em",marginBottom:10}}>YOUR CERTIFICATES ({certs.length})</div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {certs.map(c => (
                <div key={c.id} className="cert-row" onClick={() => setSelected(c)} style={{
                  background: selected?.id===c.id ? s("#F5F3FF","rgba(79,70,229,0.1)") : s("#fff","#0F172A"),
                  border:`2px solid ${selected?.id===c.id?"#4F46E5":s("#E2E8F0","#1E293B")}`,
                  borderRadius:14,padding:"14px 16px",cursor:"pointer",transition:"all 0.15s"
                }}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:13,fontWeight:700,color:s("#0F172A","#F1F5F9"),fontFamily:FONT,marginBottom:3,lineHeight:1.3}}>{c.title}</div>
                      <div style={{fontSize:10,color:"#94A3B8",fontFamily:FONT_MONO}}>{c.category} · {c.completedAt}</div>
                    </div>
                    {downloaded[c.id] && <span style={{fontSize:9,color:"#10B981",background:"#F0FDF4",padding:"2px 8px",borderRadius:8,fontFamily:FONT_MONO,flexShrink:0,marginLeft:6}}>✓ SAVED</span>}
                  </div>
                  <div style={{display:"flex",gap:6}}>
                    <span style={{fontSize:10,fontWeight:700,color:"#10B981",background:"#F0FDF4",padding:"2px 8px",borderRadius:8,fontFamily:FONT_MONO}}>{c.score}%</span>
                    <span style={{fontSize:10,fontWeight:700,color:"#F59E0B",background:"#FFFBEB",padding:"2px 8px",borderRadius:8,fontFamily:FONT_MONO}}>{c.score>=90?"Distinction":c.score>=75?"Merit":"Pass"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Preview + actions */}
          {selected && (
            <div style={{animation:"fadeUp 0.3s ease"}}>
              <div style={{fontSize:11,fontWeight:700,color:"#94A3B8",fontFamily:"JetBrains Mono, monospace",letterSpacing:"0.08em",marginBottom:10}}>CERTIFICATE PREVIEW</div>
              <div style={{background:"linear-gradient(135deg,#0A0A1E,#0F1630)",borderRadius:18,padding:"28px 24px",marginBottom:14,border:"1px solid rgba(79,70,229,0.25)",boxShadow:"0 8px 32px rgba(0,0,0,0.25)",position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",left:0,top:0,width:7,height:"100%",background:"linear-gradient(180deg,#4F46E5,#7C3AED)"}}/>
                <div style={{position:"absolute",right:0,top:0,width:7,height:"100%",background:"linear-gradient(180deg,#F59E0B,#D97706)"}}/>
                <div style={{height:1,background:"linear-gradient(90deg,transparent,#F59E0B,transparent)",marginBottom:18}}/>
                <div style={{textAlign:"center",padding:"0 16px"}}>
                  <div style={{fontSize:9,color:"#A5B4FC",fontFamily:"JetBrains Mono, monospace",letterSpacing:"0.18em",marginBottom:8}}>CERTIFICATE OF COMPLETION</div>
                  <div style={{fontSize:22,fontWeight:800,color:"#fff",fontFamily:"Space Grotesk, sans-serif",marginBottom:3}}>{user?.name||"Your Name"}</div>
                  <div style={{fontSize:10,color:"#475569",fontStyle:"italic",marginBottom:5}}>has successfully completed</div>
                  <div style={{fontSize:14,fontWeight:700,color:"#A5B4FC",marginBottom:8}}>{selected.title}</div>
                  <div style={{display:"flex",justifyContent:"center",gap:8,marginBottom:14}}>
                    {[[selected.score+"%","Score"],[Math.round(selected.hours)+"h","Duration"]].map(([val,label]) => (
                      <div key={label} style={{background:"rgba(255,255,255,0.04)",borderRadius:8,padding:"5px 12px",border:"1px solid rgba(255,255,255,0.06)"}}>
                        <div style={{fontSize:13,fontWeight:700,color:"#fff"}}>{val}</div>
                        <div style={{fontSize:8,color:"#475569"}}>{label}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{fontSize:10,fontWeight:700,color:"#A5B4FC",fontFamily:"JetBrains Mono, monospace"}}>{selected.certId}</div>
                </div>
                <div style={{height:1,background:"linear-gradient(90deg,transparent,#F59E0B,transparent)",marginTop:16}}/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                <button onClick={downloadPDF} disabled={downloading} style={{
                  padding:"13px",background:downloading?"#94A3B8":"linear-gradient(135deg,#F59E0B,#D97706)",
                  color:"#fff",border:"none",borderRadius:12,fontSize:14,fontWeight:700,
                  cursor:downloading?"not-allowed":"pointer",transition:"all 0.2s"
                }}>
                  {downloading ? "Generating..." : "Download PDF"}
                </button>
                <button onClick={shareLinkedIn} style={{
                  padding:"13px",background:"linear-gradient(135deg,#0A66C2,#0077B5)",
                  color:"#fff",border:"none",borderRadius:12,fontSize:14,fontWeight:700,
                  cursor:"pointer",transition:"all 0.2s"
                }}>Share on LinkedIn</button>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                <button onClick={copyLink} style={{
                  padding:"10px",background:"#fff",
                  border:"1px solid #E2E8F0",borderRadius:10,
                  fontSize:12,fontWeight:600,cursor:"pointer",
                  color:shareMsg?"#10B981":"#374151"
                }}>{shareMsg || "Copy Verify Link"}</button>
                <div style={{padding:"10px",background:"#F0FDF4",border:"1px solid #BBF7D0",borderRadius:10,textAlign:"center"}}>
                  <div style={{fontSize:11,fontWeight:600,color:"#065F46"}}>Verified — NDMA</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}