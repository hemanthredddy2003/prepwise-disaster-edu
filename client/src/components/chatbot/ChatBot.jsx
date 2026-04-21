import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";

const API = import.meta.env.VITE_API_BASE_URL?.replace("/api","") || "http://localhost:5001";
const STORAGE_KEY = "prepwise_chat_v3";

const QUICK_LINKS = [
  { icon:"🌊", label:"Flood Safety Guide" },
  { icon:"🏚️", label:"Earthquake Response" },
  { icon:"🚑", label:"First Aid & CPR" },
  { icon:"🌀", label:"Cyclone Preparedness" },
  { icon:"🎒", label:"Emergency Kit Guide" },
  { icon:"📍", label:"Find Nearby Shelters" },
];

const FOLLOW_UPS = {
  flood:["Flood evacuation steps","Emergency kit for floods","Post-flood safety","Water contamination"],
  earthquake:["Drop Cover Hold On","Gas leaks after quake","Aftershock safety","Earthquake kit"],
  fire:["Fire evacuation plan","Stop drop and roll","Smoke inhalation","Fire extinguisher types"],
  cyclone:["Cyclone shelter tips","Secure your home","Cyclone emergency kit","After cyclone safety"],
  tsunami:["Tsunami warning signs","Evacuation to high ground","Coastal safe zones","After tsunami"],
  medical:["CPR steps adult","Treat burns","Stop bleeding","Fracture first aid"],
  evacuation:["Evacuation checklist","Documents to carry","Evacuate with pets","Shelter locations"],
  general:["Build emergency kit","Make family plan","NDRF helpline 1078","Disaster basics"],
};

function detectType(msg) {
  const m = msg.toLowerCase();
  if (/flood|river|water rising/.test(m)) return "flood";
  if (/fire|wildfire|smoke|burn/.test(m)) return "fire";
  if (/earthquake|quake|tremor/.test(m)) return "earthquake";
  if (/cyclone|hurricane|typhoon/.test(m)) return "cyclone";
  if (/tsunami|tidal wave/.test(m)) return "tsunami";
  if (/first aid|bleeding|cpr|choking|fracture/.test(m)) return "medical";
  if (/evacuate|evacuation|escape|shelter/.test(m)) return "evacuation";
  return "general";
}

function renderMarkdown(text) {
  if (!text) return null;
  return text.split("\n").map((line, i) => {
    if (line.startsWith("### ")) return <div key={i} style={{fontSize:13,fontWeight:700,color:"#111",margin:"10px 0 4px",fontFamily:"Space Grotesk,sans-serif"}}>{line.slice(4)}</div>;
    if (line.startsWith("## ")) return <div key={i} style={{fontSize:14,fontWeight:800,color:"#111",margin:"12px 0 4px",fontFamily:"Space Grotesk,sans-serif"}}>{line.slice(3)}</div>;
    if (line.startsWith("# ")) return <div key={i} style={{fontSize:15,fontWeight:800,color:"#111",margin:"14px 0 4px",fontFamily:"Space Grotesk,sans-serif"}}>{line.slice(2)}</div>;
    if (line.startsWith("- ") || line.startsWith("* ")) return <div key={i} style={{fontSize:13,color:"#374151",padding:"3px 0 3px 14px",borderLeft:"2px solid #C7D2FE",margin:"3px 0",lineHeight:1.6}}>{renderInline(line.slice(2))}</div>;
    if (line.match(/^\d+\. /)) return <div key={i} style={{fontSize:13,color:"#374151",padding:"3px 0",margin:"3px 0",lineHeight:1.6}}>{renderInline(line)}</div>;
    if (line.startsWith("> ")) return <div key={i} style={{fontSize:13,color:"#6B7280",borderLeft:"3px solid #4F46E5",paddingLeft:10,margin:"6px 0",fontStyle:"italic"}}>{line.slice(2)}</div>;
    if (line.trim()==="---") return <hr key={i} style={{border:"none",borderTop:"1px solid #E5E7EB",margin:"8px 0"}}/>;
    if (line.trim()==="") return <div key={i} style={{height:5}}/>;
    return <div key={i} style={{fontSize:13,color:"#374151",lineHeight:1.7,margin:"2px 0"}}>{renderInline(line)}</div>;
  });
}

function renderInline(text) {
  const parts=[];
  const regex=/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let last=0,match,idx=0;
  while((match=regex.exec(text))!==null){
    if(match.index>last) parts.push(<span key={idx++}>{text.slice(last,match.index)}</span>);
    const m=match[0];
    if(m.startsWith("**")) parts.push(<strong key={idx++} style={{color:"#111",fontWeight:700}}>{m.slice(2,-2)}</strong>);
    else if(m.startsWith("*")) parts.push(<em key={idx++}>{m.slice(1,-1)}</em>);
    else if(m.startsWith("`")) parts.push(<code key={idx++} style={{background:"#EEF2FF",color:"#4F46E5",padding:"1px 6px",borderRadius:4,fontSize:11,fontFamily:"monospace"}}>{m.slice(1,-1)}</code>);
    last=match.index+m.length;
  }
  if(last<text.length) parts.push(<span key={idx}>{text.slice(last)}</span>);
  return parts.length>0?parts:text;
}

const HELP_TOPICS = [
  {q:"flood safety",a:"During a flood: move to higher ground, avoid walking in moving water, follow evacuation orders, call 112."},
  {q:"earthquake",a:"During an earthquake: Drop, Cover, Hold On. Stay away from windows. After shaking stops, check for injuries."},
  {q:"cyclone",a:"Before a cyclone: secure loose items, stock emergency kit, know evacuation routes. During: stay indoors away from windows."},
  {q:"first aid cpr",a:"CPR: 30 chest compressions followed by 2 rescue breaths. Push hard and fast at center of chest. Call 108 immediately."},
  {q:"emergency kit",a:"Emergency kit should include: water (3L/person/day), food (3 days), first aid kit, torch, documents, medicines, cash."},
  {q:"evacuation",a:"Evacuation checklist: Important documents, medicines, water and food, phone charger, cash, change of clothes, first aid kit."},
  {q:"tsunami",a:"Tsunami warning signs: strong earthquake, ocean suddenly receding. Immediately move inland to high ground. Do not wait."},
  {q:"helpline numbers",a:"India Emergency Helplines: 112 (National), 108 (Ambulance), 101 (Fire), 100 (Police), 1078 (NDRF Disaster)."},
];

export default function ChatBot() {
  const { token, user } = useAuth();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState("home");
  const [messages, setMessages] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)||"[]"); } catch { return []; }
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(0);
  const [searchQ, setSearchQ] = useState("");
  const [copied, setCopied] = useState(null);
  const [listening, setListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [transcript, setTranscript] = useState("");
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  // Check voice support
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setVoiceSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "en-IN";
      recognition.onstart = () => setListening(true);
      recognition.onend = () => { setListening(false); setTranscript(""); };
      recognition.onerror = () => { setListening(false); setTranscript(""); };
      recognition.onresult = (e) => {
        const t = Array.from(e.results).map(r=>r[0].transcript).join("");
        setTranscript(t);
        if (e.results[e.results.length-1].isFinal) {
          setInput(t);
          setTranscript("");
          recognition.stop();
          setTimeout(() => inputRef.current?.focus(), 100);
        }
      };
      recognitionRef.current = recognition;
    }
  }, []);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-60))); } catch { /* Storage unavailable */ }
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({behavior:"smooth"});
  }, [messages, loading]);

  useEffect(() => {
    if (open) setUnread(0);
  }, [open]);

  const toggleVoice = () => {
    if (!recognitionRef.current) return;
    if (listening) {
      recognitionRef.current.stop();
    } else {
      setInput("");
      try { recognitionRef.current.start(); } catch {
        // Ignore errors if speech recognition fails to start
      }
    }
  };

  const copyMessage = (text, idx) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(idx);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const startChat = (initialMsg) => {
    setView("chat");
    if (initialMsg) sendMessage(initialMsg, []);
  };

  const sendMessage = async (msg, existingMsgs) => {
    const text = (msg || input).trim();
    if (!text || loading) return;
    setInput("");
    setTranscript("");
    if (listening) recognitionRef.current?.stop();
    const hist = existingMsgs !== undefined ? existingMsgs : messages;
    const userMsg = { role:"user", content:text, ts:Date.now() };
    const newMsgs = [...hist, userMsg];
    setMessages(newMsgs);
    setLoading(true);
    try {
      const history = newMsgs.slice(-12).map(m=>({role:m.role,content:m.content}));
      const {data} = await axios.post(`${API}/api/chat/message`,{message:text,history},{headers:{Authorization:`Bearer ${token}`}});
      const reply = data.message || data.data?.message || "Sorry, I could not get a response.";
      setMessages(prev=>[...prev,{role:"assistant",content:reply,type:detectType(text),ts:Date.now()}]);
      if (!open) setUnread(u=>u+1);
    } catch {
      setMessages(prev=>[...prev,{role:"assistant",content:"Something went wrong. Please try again.",type:"general",isError:true,ts:Date.now()}]);
    } finally {
      setLoading(false);
      setTimeout(()=>inputRef.current?.focus(),100);
    }
  };

  const clearChat = () => { setMessages([]); localStorage.removeItem(STORAGE_KEY); };

  const userName = user?.name?.split(" ")[0] || "there";
  const initials = (user?.name||"U")[0].toUpperCase();
  const filteredTopics = searchQ.trim().length>1 ? HELP_TOPICS.filter(t=>t.q.includes(searchQ.toLowerCase())||t.a.toLowerCase().includes(searchQ.toLowerCase())) : HELP_TOPICS;

  const formatTime = (ts) => {
    if (!ts) return "";
    const d = new Date(ts);
    return d.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"});
  };

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-60)));
    } catch {
      // Storage unavailable or quota exceeded
    }
  }, [messages]);

  return (
    <>
      <style>{`
        .pw-input:focus{outline:none;border-color:#4F46E5!important;box-shadow:0 0 0 3px rgba(79,70,229,0.1);}
        .pw-send:hover:not(:disabled){background:#4338CA!important;transform:scale(1.05);}
        .pw-chip:hover{background:#EEF2FF!important;border-color:#4F46E5!important;color:#4F46E5!important;}
        .pw-link:hover{background:#F5F3FF!important;}
        .pw-fab:hover{transform:scale(1.08);}
        .pw-copy:hover{opacity:1!important;}
        .pw-voice-btn:hover{background:#EEF2FF!important;}
        @keyframes msgIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes ripple{0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,0.4)}50%{box-shadow:0 0 0 10px rgba(239,68,68,0)}}
        @keyframes dot{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        .listening-ring{animation:ripple 1s infinite;}
        ::-webkit-scrollbar{width:4px;}
        ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:#E5E7EB;border-radius:4px;}
      `}</style>

      {/* FAB */}
      <div style={{position:"fixed",bottom:24,right:24,zIndex:9999}}>
        {!open && unread>0 && (
          <div style={{position:"absolute",top:-6,right:-6,width:20,height:20,borderRadius:"50%",background:"#EF4444",color:"#fff",fontSize:11,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",border:"2px solid #fff",zIndex:1,animation:"fadeIn 0.3s"}}>{unread}</div>
        )}
        <button className="pw-fab" onClick={()=>setOpen(o=>!o)} style={{
          width:58,height:58,borderRadius:"50%",border:"none",cursor:"pointer",
          background:open?"#6B7280":"linear-gradient(135deg,#4F46E5,#7C3AED)",
          display:"flex",alignItems:"center",justifyContent:"center",
          boxShadow:"0 4px 24px rgba(79,70,229,0.45)",transition:"all 0.25s",
        }}>
          <span style={{fontSize:open?20:26,color:"#fff",transition:"all 0.2s"}}>{open?"✕":"💬"}</span>
        </button>
      </div>

      {/* Widget */}
      {open && (
        <div style={{
          position:"fixed",bottom:94,right:24,zIndex:9998,
          width:"min(390px,calc(100vw - 32px))",
          height:"min(640px,calc(100vh - 110px))",
          background:"#fff",borderRadius:22,
          boxShadow:"0 24px 64px rgba(0,0,0,0.16),0 4px 16px rgba(0,0,0,0.08)",
          display:"flex",flexDirection:"column",overflow:"hidden",
          border:"1px solid #E5E7EB",
          animation:"msgIn 0.25s cubic-bezier(0.34,1.56,0.64,1)"
        }}>

          {/* Header */}
          <div style={{background:"linear-gradient(135deg,#4F46E5 0%,#7C3AED 100%)",padding:"18px 18px 14px",flexShrink:0,position:"relative",overflow:"hidden"}}>
            {/* Decorative circles */}
            <div style={{position:"absolute",top:-20,right:-20,width:100,height:100,borderRadius:"50%",background:"rgba(255,255,255,0.06)"}}/>
            <div style={{position:"absolute",bottom:-30,left:40,width:80,height:80,borderRadius:"50%",background:"rgba(255,255,255,0.04)"}}/>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14,position:"relative"}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:38,height:38,borderRadius:"50%",background:"rgba(255,255,255,0.2)",border:"2px solid rgba(255,255,255,0.4)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>🛡️</div>
                <div>
                  <div style={{fontSize:15,fontWeight:800,color:"#fff",fontFamily:"Space Grotesk,sans-serif",lineHeight:1}}>PREPWISE AI</div>
                  <div style={{fontSize:11,color:"rgba(255,255,255,0.7)",marginTop:2,display:"flex",alignItems:"center",gap:4}}>
                    <div style={{width:6,height:6,borderRadius:"50%",background:"#4ADE80"}}/>
                    Online · Always ready
                  </div>
                </div>
              </div>
              <div style={{display:"flex",gap:6}}>
                {view!=="home" && (
                  <button onClick={()=>setView("home")} style={{background:"rgba(255,255,255,0.15)",border:"none",borderRadius:8,padding:"5px 10px",color:"rgba(255,255,255,0.9)",cursor:"pointer",fontSize:12,fontFamily:"Inter,sans-serif"}}>⌂</button>
                )}
                <button onClick={()=>setOpen(false)} style={{background:"rgba(255,255,255,0.15)",border:"none",borderRadius:8,padding:"5px 10px",color:"rgba(255,255,255,0.9)",cursor:"pointer",fontSize:14}}>✕</button>
              </div>
            </div>
            {view==="home" && (
              <div style={{position:"relative"}}>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.7)",fontFamily:"Inter,sans-serif",marginBottom:2}}>Hi {userName} 👋</div>
                <div style={{fontSize:22,fontWeight:800,color:"#fff",fontFamily:"Space Grotesk,sans-serif",lineHeight:1.2}}>How can we help?</div>
              </div>
            )}
            {view==="chat" && (
              <div style={{position:"relative",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{fontSize:13,color:"rgba(255,255,255,0.85)",fontFamily:"Inter,sans-serif"}}>{messages.length} messages</div>
                <button onClick={clearChat} style={{background:"rgba(255,255,255,0.15)",border:"none",borderRadius:8,padding:"4px 10px",color:"rgba(255,255,255,0.8)",cursor:"pointer",fontSize:11,fontFamily:"Inter,sans-serif"}}>Clear</button>
              </div>
            )}
          </div>

          {/* Body */}
          <div style={{flex:1,overflowY:"auto",background:"#F9FAFB"}}>

            {/* HOME */}
            {view==="home" && (
              <div style={{padding:14,display:"flex",flexDirection:"column",gap:8}}>
                <div className="pw-link" onClick={()=>setView("chat")} style={{background:"#fff",border:"1px solid #E5E7EB",borderRadius:14,padding:"14px 16px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",transition:"all 0.15s",boxShadow:"0 1px 4px rgba(0,0,0,0.04)"}}>
                  <div style={{display:"flex",gap:10,alignItems:"center"}}>
                    <div style={{width:36,height:36,borderRadius:10,background:"#EEF2FF",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>💬</div>
                    <div>
                      <div style={{fontSize:13,fontWeight:700,color:"#111",fontFamily:"Space Grotesk,sans-serif"}}>Send a message</div>
                      <div style={{fontSize:11,color:"#6B7280",fontFamily:"Inter,sans-serif"}}>Chat with PREPWISE AI</div>
                    </div>
                  </div>
                  <span style={{color:"#4F46E5",fontSize:20,fontWeight:300}}>›</span>
                </div>

                <div className="pw-link" onClick={()=>setView("search")} style={{background:"#fff",border:"1px solid #E5E7EB",borderRadius:14,padding:"14px 16px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",transition:"all 0.15s",boxShadow:"0 1px 4px rgba(0,0,0,0.04)"}}>
                  <div style={{display:"flex",gap:10,alignItems:"center"}}>
                    <div style={{width:36,height:36,borderRadius:10,background:"#F0FDF4",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>🔍</div>
                    <div>
                      <div style={{fontSize:13,fontWeight:700,color:"#111",fontFamily:"Space Grotesk,sans-serif"}}>Search help topics</div>
                      <div style={{fontSize:11,color:"#6B7280",fontFamily:"Inter,sans-serif"}}>Browse safety guides</div>
                    </div>
                  </div>
                  <span style={{color:"#4F46E5",fontSize:20,fontWeight:300}}>›</span>
                </div>

                <div style={{background:"#fff",border:"1px solid #E5E7EB",borderRadius:14,padding:"12px 14px",boxShadow:"0 1px 4px rgba(0,0,0,0.04)"}}>
                  <div style={{fontSize:10,fontWeight:700,color:"#9CA3AF",fontFamily:"Inter,sans-serif",marginBottom:8,letterSpacing:"0.08em"}}>QUICK HELP TOPICS</div>
                  {QUICK_LINKS.map(({icon,label})=>(
                    <div key={label} className="pw-link" onClick={()=>startChat(label)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"9px 10px",borderRadius:10,cursor:"pointer",transition:"all 0.15s",marginBottom:2}}>
                      <div style={{display:"flex",gap:10,alignItems:"center"}}>
                        <span style={{fontSize:15}}>{icon}</span>
                        <span style={{fontSize:13,color:"#374151",fontFamily:"Inter,sans-serif",fontWeight:500}}>{label}</span>
                      </div>
                      <span style={{color:"#D1D5DB",fontSize:16}}>›</span>
                    </div>
                  ))}
                </div>

                <div style={{background:"#FFF1F2",border:"1px solid #FECDD3",borderRadius:14,padding:"12px 14px"}}>
                  <div style={{fontSize:10,fontWeight:700,color:"#EF4444",fontFamily:"Inter,sans-serif",marginBottom:8,letterSpacing:"0.08em"}}>🚨 EMERGENCY NUMBERS</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                    {[["112","National"],["108","Ambulance"],["101","Fire"],["1078","NDRF"]].map(([num,name])=>(
                      <a key={num} href={"tel:"+num} style={{display:"flex",alignItems:"center",gap:8,background:"#fff",borderRadius:8,padding:"8px 10px",textDecoration:"none",border:"1px solid #FECDD3"}}>
                        <span style={{fontSize:16,fontWeight:800,color:"#EF4444",fontFamily:"monospace"}}>{num}</span>
                        <span style={{fontSize:10,color:"#6B7280",fontFamily:"Inter,sans-serif"}}>{name}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* CHAT */}
            {view==="chat" && (
              <div style={{padding:"14px",display:"flex",flexDirection:"column",gap:12,minHeight:"100%"}}>
                {messages.length===0 && (
                  <div style={{textAlign:"center",padding:"28px 16px",animation:"fadeIn 0.4s"}}>
                    <div style={{fontSize:36,marginBottom:10}}>🛡️</div>
                    <div style={{fontSize:15,fontWeight:700,color:"#111",fontFamily:"Space Grotesk,sans-serif",marginBottom:6}}>PREPWISE AI Assistant</div>
                    <div style={{fontSize:12,color:"#6B7280",lineHeight:1.7,fontFamily:"Inter,sans-serif"}}>Ask me anything about disaster preparedness, first aid, emergency response, or general knowledge. I am here to help!</div>
                    {voiceSupported && (
                      <div style={{marginTop:12,fontSize:11,color:"#9CA3AF",fontFamily:"Inter,sans-serif"}}>🎤 Voice input supported — tap the mic button</div>
                    )}
                  </div>
                )}
                {messages.map((msg,i)=>(
                  <div key={i} style={{display:"flex",flexDirection:"column",alignItems:msg.role==="user"?"flex-end":"flex-start",animation:"msgIn 0.25s ease"}}>
                    <div style={{display:"flex",gap:8,alignItems:"flex-end",flexDirection:msg.role==="user"?"row-reverse":"row",maxWidth:"88%"}}>
                      <div style={{width:28,height:28,borderRadius:"50%",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,
                        background:msg.role==="user"?"linear-gradient(135deg,#4F46E5,#7C3AED)":"#fff",
                        border:msg.role==="assistant"?"1px solid #E5E7EB":"none",
                        color:"#fff",fontWeight:700,boxShadow:"0 1px 4px rgba(0,0,0,0.08)"}}>
                        {msg.role==="user"?initials:"🛡️"}
                      </div>
                      <div style={{
                        padding:"10px 14px",
                        borderRadius:msg.role==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px",
                        background:msg.role==="user"?"linear-gradient(135deg,#4F46E5,#7C3AED)":msg.isError?"#FEF2F2":"#fff",
                        border:msg.role==="assistant"?"1px solid "+(msg.isError?"#FECACA":"#E5E7EB"):"none",
                        boxShadow:"0 2px 8px rgba(0,0,0,0.06)",
                        color:msg.role==="user"?"#fff":"#111",
                        position:"relative",
                      }}>
                        {msg.role==="assistant"?renderMarkdown(msg.content):<p style={{fontSize:13,lineHeight:1.6,margin:0}}>{msg.content}</p>}
                      </div>
                    </div>

                    {/* Timestamp + Copy */}
                    <div style={{display:"flex",alignItems:"center",gap:6,marginTop:3,marginLeft:msg.role==="user"?0:36,marginRight:msg.role==="user"?36:0}}>
                      <span style={{fontSize:10,color:"#9CA3AF",fontFamily:"Inter,sans-serif"}}>{formatTime(msg.ts)}</span>
                      <button className="pw-copy" onClick={()=>copyMessage(msg.content,i)}
                        style={{opacity:0.5,background:"none",border:"none",cursor:"pointer",padding:"2px 6px",borderRadius:6,fontSize:11,color:copied===i?"#10B981":"#9CA3AF",transition:"all 0.15s",display:"flex",alignItems:"center",gap:3}}>
                        {copied===i ? "✓ Copied" : "⎘ Copy"}
                      </button>
                    </div>

                    {/* Follow-up chips */}
                    {msg.role==="assistant"&&!msg.isError&&i===messages.length-1&&!loading&&(
                      <div style={{display:"flex",flexWrap:"wrap",gap:5,marginTop:6,marginLeft:36,maxWidth:"88%"}}>
                        {(FOLLOW_UPS[msg.type]||FOLLOW_UPS.general).map(q=>(
                          <button key={q} className="pw-chip" onClick={()=>sendMessage(q,undefined)} style={{fontSize:10,padding:"4px 10px",background:"#fff",border:"1px solid #E5E7EB",borderRadius:20,color:"#6B7280",cursor:"pointer",fontFamily:"Inter,sans-serif",transition:"all 0.15s"}}>
                            {q}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* Typing indicator */}
                {loading && (
                  <div style={{display:"flex",gap:8,alignItems:"flex-end",animation:"msgIn 0.2s"}}>
                    <div style={{width:28,height:28,borderRadius:"50%",background:"#fff",border:"1px solid #E5E7EB",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,boxShadow:"0 1px 4px rgba(0,0,0,0.08)"}}>🛡️</div>
                    <div style={{padding:"12px 16px",background:"#fff",border:"1px solid #E5E7EB",borderRadius:"18px 18px 18px 4px",boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
                      <div style={{display:"flex",gap:5,alignItems:"center"}}>
                        {[0,1,2].map(d=><div key={d} style={{width:7,height:7,borderRadius:"50%",background:"#4F46E5",animation:`dot 1.2s ${d*0.15}s infinite ease-in-out`}}/>)}
                        <span style={{fontSize:11,color:"#9CA3AF",marginLeft:4,fontFamily:"Inter,sans-serif"}}>typing...</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Voice transcript preview */}
                {transcript && (
                  <div style={{padding:"8px 14px",background:"#EEF2FF",borderRadius:10,border:"1px solid #C7D2FE",fontSize:12,color:"#4F46E5",fontFamily:"Inter,sans-serif",animation:"fadeIn 0.2s"}}>
                    🎤 {transcript}
                  </div>
                )}

                <div ref={bottomRef}/>
              </div>
            )}

            {/* SEARCH */}
            {view==="search" && (
              <div style={{padding:14}}>
                <input value={searchQ} onChange={e=>setSearchQ(e.target.value)} placeholder="Search disaster topics..." className="pw-input"
                  style={{width:"100%",padding:"10px 14px",border:"1px solid #E5E7EB",borderRadius:12,fontSize:13,fontFamily:"Inter,sans-serif",background:"#fff",boxSizing:"border-box",marginBottom:12,color:"#111",transition:"all 0.2s"}} />
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  {filteredTopics.map((t,i)=>(
                    <div key={i} className="pw-link" onClick={()=>{setView("chat");sendMessage(t.q,messages);}} style={{background:"#fff",border:"1px solid #E5E7EB",borderRadius:12,padding:"12px 14px",cursor:"pointer",transition:"all 0.15s"}}>
                      <div style={{fontSize:13,fontWeight:600,color:"#111",marginBottom:3,fontFamily:"Space Grotesk,sans-serif",display:"flex",justifyContent:"space-between"}}>
                        <span>{t.q.charAt(0).toUpperCase()+t.q.slice(1)}</span>
                        <span style={{color:"#4F46E5"}}>›</span>
                      </div>
                      <div style={{fontSize:11,color:"#6B7280",lineHeight:1.5,fontFamily:"Inter,sans-serif"}}>{t.a.slice(0,90)}...</div>
                    </div>
                  ))}
                  {searchQ.trim().length>1 && filteredTopics.length===0 && (
                    <div style={{textAlign:"center",padding:24,color:"#9CA3AF",fontSize:13,fontFamily:"Inter,sans-serif"}}>
                      No results. <span style={{color:"#4F46E5",cursor:"pointer",fontWeight:600}} onClick={()=>startChat(searchQ)}>Ask AI instead →</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Input bar - chat only */}
          {view==="chat" && (
            <div style={{padding:"10px 12px",background:"#fff",borderTop:"1px solid #F3F4F6",flexShrink:0}}>
              {/* Voice status bar */}
              {listening && (
                <div style={{display:"flex",alignItems:"center",gap:8,padding:"6px 10px",background:"#FEF2F2",borderRadius:8,marginBottom:8,border:"1px solid #FECACA"}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:"#EF4444",animation:"ripple 1s infinite"}}/>
                  <span style={{fontSize:11,color:"#EF4444",fontFamily:"Inter,sans-serif",fontWeight:600}}>Listening... speak now</span>
                  <button onClick={toggleVoice} style={{marginLeft:"auto",background:"none",border:"none",cursor:"pointer",color:"#EF4444",fontSize:11,fontFamily:"Inter,sans-serif"}}>Stop</button>
                </div>
              )}
              <div style={{display:"flex",gap:6,alignItems:"flex-end"}}>
                {/* Voice button */}
                {voiceSupported && (
                  <button onClick={toggleVoice} className="pw-voice-btn" style={{
                    width:38,height:38,borderRadius:10,flexShrink:0,
                    background:listening?"#FEF2F2":"#F3F4F6",
                    border:listening?"1px solid #FECACA":"1px solid #E5E7EB",
                    cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",
                    fontSize:16,transition:"all 0.15s",
                    boxShadow:listening?"0 0 0 3px rgba(239,68,68,0.15)":"none"
                  }} title="Voice input">
                    {listening ? "⏹" : "🎤"}
                  </button>
                )}
                <textarea ref={inputRef} value={input} onChange={e=>setInput(e.target.value)}
                  onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendMessage();}}}
                  placeholder={listening?"Listening...":"Ask anything about disasters..."} rows={1}
                  className="pw-input"
                  style={{flex:1,padding:"10px 12px",background:"#F9FAFB",border:"1px solid #E5E7EB",borderRadius:12,fontSize:13,color:"#111",resize:"none",fontFamily:"Inter,sans-serif",lineHeight:1.5,maxHeight:100,overflowY:"auto",transition:"all 0.2s"}}
                />
                <button onClick={()=>sendMessage()} disabled={loading||(!input.trim()&&!transcript)} className="pw-send"
                  style={{width:38,height:38,borderRadius:10,flexShrink:0,
                    background:loading||(!input.trim()&&!transcript)?"#E5E7EB":"linear-gradient(135deg,#4F46E5,#7C3AED)",
                    border:"none",cursor:loading||(!input.trim()&&!transcript)?"not-allowed":"pointer",
                    display:"flex",alignItems:"center",justifyContent:"center",
                    fontSize:16,color:"#fff",transition:"all 0.15s",
                    boxShadow:!loading&&input.trim()?"0 4px 12px rgba(79,70,229,0.3)":"none"
                  }}>↑</button>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:5}}>
                <span style={{fontSize:10,color:"#9CA3AF",fontFamily:"Inter,sans-serif"}}>Enter to send · Shift+Enter for new line</span>
                <button onClick={clearChat} style={{fontSize:10,color:"#9CA3AF",background:"none",border:"none",cursor:"pointer",fontFamily:"Inter,sans-serif"}}>Clear</button>
              </div>
            </div>
          )}

          {/* Bottom nav */}
          <div style={{display:"flex",background:"#fff",borderTop:"1px solid #F3F4F6",flexShrink:0}}>
            {[["home","🏠","Home"],["chat","💬","Chat"],["search","🔍","Search"]].map(([v,icon,label])=>(
              <button key={v} onClick={()=>setView(v)} style={{flex:1,padding:"9px 0",background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2,
                color:view===v?"#4F46E5":"#9CA3AF",
                borderTop:view===v?"2px solid #4F46E5":"2px solid transparent",
                transition:"all 0.15s"}}>
                <span style={{fontSize:15}}>{icon}</span>
                <span style={{fontSize:10,fontFamily:"Inter,sans-serif",fontWeight:view===v?700:400}}>{label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
