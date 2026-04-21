import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const FONT = "Space Grotesk, sans-serif";
const FONT_BODY = "Inter, sans-serif";
const FONT_MONO = "JetBrains Mono, monospace";

const STATS = [
  { val:"50M+", label:"People affected by disasters yearly in India", icon:"🇮🇳" },
  { val:"20%", label:"Of global flood deaths occur in India", icon:"🌊" },
  { val:"₹1.5L Cr", label:"Annual economic loss from disasters", icon:"📉" },
  { val:"95%", label:"Deaths preventable with proper training", icon:"💡" },
];

const FEATURES = [
  { icon:"🎮", title:"AI Simulations", desc:"12 real Indian disaster scenarios — Kerala Flood, Gujarat Earthquake, Odisha Cyclone and more. Make life-or-death decisions and learn from them safely.", color:"#8B5CF6", bg:"#F5F3FF" },
  { icon:"🤖", title:"PREPWISE AI", desc:"Powered by Llama 3.3 70B — the same AI technology used by top platforms. Ask anything about disaster safety in English or Hindi with voice input.", color:"#3B82F6", bg:"#EFF6FF" },
  { icon:"📚", title:"25 Expert Courses", desc:"Structured learning with detailed content, do and don't lists, real images and key takeaways for every lesson. From beginner to expert level.", color:"#10B981", bg:"#F0FDF4" },
  { icon:"🏆", title:"Verified Certificates", desc:"Earn professional PDF certificates on course completion with unique IDs, QR verification codes and NDMA recognition.", color:"#F59E0B", bg:"#FFFBEB" },
  { icon:"🏕️", title:"Shelter Locator", desc:"Find nearest emergency shelters in real time with capacity tracking, contact numbers and live occupancy status.", color:"#EF4444", bg:"#FEF2F2" },
  { icon:"🚨", title:"Live Alert System", desc:"Real-time disaster alerts filtered by severity level. Stay informed about cyclones, floods and other threats in your region.", color:"#06B6D4", bg:"#ECFEFF" },
];

const STEPS = [
  { step:"01", icon:"📝", title:"Register Free", desc:"Create your account in 60 seconds. Choose your role — student, teacher or community member.", color:"#4F46E5" },
  { step:"02", icon:"📚", title:"Take Courses", desc:"Enroll in disaster preparedness courses specific to your region. Learn at your own pace with rich content.", color:"#10B981" },
  { step:"03", icon:"🎮", title:"Run Simulations", desc:"Practice real disaster scenarios with AI. Make decisions, see consequences, learn without risk.", color:"#F59E0B" },
  { step:"04", icon:"🏆", title:"Get Certified", desc:"Complete courses to earn verified PDF certificates. Share on LinkedIn and prove your preparedness.", color:"#EF4444" },
];

const TESTIMONIALS = [
  { name:"Priya Sharma", role:"School Teacher, Kerala", avatar:"👩‍🏫", text:"After the 2018 Kerala floods, I realized how unprepared we were. PREPWISE helped me train 200 students in flood safety. The simulations are incredibly realistic.", stars:5 },
  { name:"Rahul Verma", role:"College Student, Delhi", avatar:"🧑‍🎓", text:"The earthquake simulation taught me Drop Cover Hold On in a way no textbook ever could. I actually practice it now. The AI chatbot answers all my questions instantly.", stars:5 },
  { name:"Dr. Anita Nair", role:"Community Leader, Odisha", avatar:"👩‍⚕️", text:"Our community used PREPWISE to prepare for cyclone season. The emergency kit checklist and shelter locator were lifesavers during the last cyclone warning.", stars:5 },
];

const DISASTERS = [
  { name:"Floods", icon:"🌊", states:"Assam, Bihar, UP, Kerala", risk:"HIGH", color:"#3B82F6" },
  { name:"Cyclones", icon:"🌀", states:"Odisha, AP, Tamil Nadu", risk:"CRITICAL", color:"#8B5CF6" },
  { name:"Earthquakes", icon:"🏚️", states:"Northeast, J&K, Gujarat", risk:"HIGH", color:"#EF4444" },
  { name:"Heatwaves", icon:"🌡️", states:"Delhi, Rajasthan, Telangana", risk:"MODERATE", color:"#F59E0B" },
  { name:"Landslides", icon:"⛰️", states:"Uttarakhand, Himachal", risk:"MODERATE", color:"#10B981" },
  { name:"Tsunamis", icon:"🌊", states:"Andaman, Tamil Nadu coast", risk:"LOW", color:"#06B6D4" },
];

function Counter({ target, suffix="" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const num = parseInt(target.replace(/[^0-9]/g,""));
        const dur = 2000, steps = 60;
        let i = 0;
        const t = setInterval(() => {
          i++;
          setCount(Math.round((num * i) / steps));
          if (i >= steps) clearInterval(t);
        }, dur/steps);
      }
    });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{count}{suffix}</span>;
}

export default function HomePage() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setActiveTestimonial(i => (i+1) % TESTIMONIALS.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ fontFamily:FONT_BODY, background:"#fff", overflowX:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap');
        *{margin:0;padding:0;box-sizing:border-box;}
        .nav-link:hover{color:#4F46E5!important;}
        .feat-card:hover{transform:translateY(-6px);box-shadow:0 20px 48px rgba(0,0,0,0.1)!important;}
        .dis-card:hover{transform:translateY(-3px);}
        .cta-btn:hover{transform:translateY(-2px);box-shadow:0 12px 32px rgba(79,70,229,0.5)!important;}
        .sec-btn:hover{background:#F5F3FF!important;color:#4F46E5!important;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.6}}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes gradient{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        .hero-bg{background:linear-gradient(-45deg,#0F172A,#1E1B4B,#312E81,#1E3A5F);background-size:400% 400%;animation:gradient 12s ease infinite;}
        .float-icon{animation:float 3s ease-in-out infinite;}
      `}</style>

      {/* NAVBAR */}
      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:1000, background:scrolled?"rgba(255,255,255,0.95)":"transparent", backdropFilter:scrolled?"blur(20px)":"none", borderBottom:scrolled?"1px solid #E2E8F0":"none", transition:"all 0.3s", padding:"0 5%" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", height:64 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:"linear-gradient(135deg,#4F46E5,#7C3AED)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>🛡️</div>
            <div>
              <div style={{ fontSize:17, fontWeight:800, color:scrolled?"#0F172A":"#fff", fontFamily:FONT, lineHeight:1 }}>PREPWISE</div>
              <div style={{ fontSize:9, color:scrolled?"#94A3B8":"rgba(255,255,255,0.6)", letterSpacing:"0.1em" }}>EDU SYSTEM</div>
            </div>
          </div>
          <div style={{ display:"flex", gap:28, alignItems:"center" }}>
            {["Features","How it Works","Courses","About"].map(item=>(
              <a key={item} className="nav-link" href={"#"+item.toLowerCase().replace(/ /g,"-")} style={{ fontSize:14, fontWeight:500, color:scrolled?"#374151":"rgba(255,255,255,0.85)", textDecoration:"none", transition:"color 0.2s" }}>{item}</a>
            ))}
            <button onClick={()=>navigate("/login")} style={{ padding:"8px 20px", background:"transparent", border:`1.5px solid ${scrolled?"#4F46E5":"rgba(255,255,255,0.5)"}`, borderRadius:8, color:scrolled?"#4F46E5":"#fff", fontSize:13, fontWeight:600, cursor:"pointer", transition:"all 0.2s" }}>Login</button>
            <button onClick={()=>navigate("/register")} className="cta-btn" style={{ padding:"8px 20px", background:"linear-gradient(135deg,#4F46E5,#7C3AED)", border:"none", borderRadius:8, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", transition:"all 0.2s", boxShadow:"0 4px 12px rgba(79,70,229,0.3)" }}>Get Started Free →</button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero-bg" style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:"120px 5% 80px", position:"relative", overflow:"hidden" }}>
        {/* Floating elements */}
        <div style={{ position:"absolute", top:"15%", left:"8%", fontSize:48, animation:"float 4s 0s infinite" }}>🌊</div>
        <div style={{ position:"absolute", top:"25%", right:"10%", fontSize:40, animation:"float 4s 1s infinite" }}>🏚️</div>
        <div style={{ position:"absolute", bottom:"20%", left:"12%", fontSize:36, animation:"float 4s 2s infinite" }}>🌀</div>
        <div style={{ position:"absolute", bottom:"30%", right:"8%", fontSize:44, animation:"float 4s 0.5s infinite" }}>🚑</div>
        <div style={{ position:"absolute", top:"50%", left:"3%", fontSize:30, animation:"float 3s 1.5s infinite" }}>🎒</div>
        <div style={{ position:"absolute", top:"60%", right:"4%", fontSize:32, animation:"float 3.5s 0.8s infinite" }}>🔔</div>

        {/* Glow circles */}
        <div style={{ position:"absolute", top:"20%", left:"30%", width:400, height:400, borderRadius:"50%", background:"rgba(79,70,229,0.12)", filter:"blur(80px)" }}/>
        <div style={{ position:"absolute", bottom:"20%", right:"25%", width:300, height:300, borderRadius:"50%", background:"rgba(139,92,246,0.1)", filter:"blur(60px)" }}/>

        <div style={{ maxWidth:900, textAlign:"center", position:"relative", animation:"fadeUp 0.8s ease" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.2)", borderRadius:30, padding:"6px 16px", marginBottom:24, backdropFilter:"blur(10px)" }}>
            <div style={{ width:6, height:6, borderRadius:"50%", background:"#4ADE80", animation:"pulse 2s infinite" }}/>
            <span style={{ fontSize:12, color:"rgba(255,255,255,0.85)", fontFamily:FONT_MONO }}>India's #1 Disaster Preparedness Platform</span>
          </div>

          <h1 style={{ fontSize:64, fontWeight:800, color:"#fff", fontFamily:FONT, lineHeight:1.1, marginBottom:20 }}>
            Be Ready for<br/>
            <span style={{ background:"linear-gradient(135deg,#A5B4FC,#C4B5FD,#FCD34D)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Any Disaster.</span>
          </h1>

          <p style={{ fontSize:18, color:"rgba(255,255,255,0.7)", lineHeight:1.8, marginBottom:36, maxWidth:620, margin:"0 auto 36px" }}>
            Learn disaster preparedness through AI-powered simulations, expert courses and an intelligent chatbot — built specifically for India.
          </p>

          <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap", marginBottom:48 }}>
            <button onClick={()=>navigate("/register")} className="cta-btn" style={{ padding:"15px 36px", background:"linear-gradient(135deg,#4F46E5,#7C3AED)", border:"none", borderRadius:12, color:"#fff", fontSize:16, fontWeight:700, cursor:"pointer", fontFamily:FONT, boxShadow:"0 8px 24px rgba(79,70,229,0.45)", transition:"all 0.2s" }}>
              Start Learning Free →
            </button>
            <button onClick={()=>navigate("/login")} className="sec-btn" style={{ padding:"15px 36px", background:"rgba(255,255,255,0.1)", border:"1.5px solid rgba(255,255,255,0.3)", borderRadius:12, color:"#fff", fontSize:16, fontWeight:600, cursor:"pointer", fontFamily:FONT, backdropFilter:"blur(10px)", transition:"all 0.2s" }}>
              Sign In
            </button>
          </div>

          {/* Hero stats */}
          <div style={{ display:"flex", gap:40, justifyContent:"center", flexWrap:"wrap" }}>
            {[["25+","Courses"],["12","Simulations"],["100%","Free"],["AI","Powered"]].map(([val,label])=>(
              <div key={label} style={{ textAlign:"center" }}>
                <div style={{ fontSize:28, fontWeight:800, color:"#fff", fontFamily:FONT }}>{val}</div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.55)", fontFamily:FONT_MONO }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DISASTER STATS */}
      <section style={{ background:"#0F172A", padding:"60px 5%" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:40 }}>
            <div style={{ fontSize:11, fontWeight:700, color:"#EF4444", letterSpacing:"0.12em", fontFamily:FONT_MONO, marginBottom:8 }}>🚨 INDIA DISASTER STATISTICS</div>
            <h2 style={{ fontSize:36, fontWeight:800, color:"#fff", fontFamily:FONT }}>Why Preparedness Matters</h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:20 }}>
            {STATS.map((s,i)=>(
              <div key={i} style={{ background:"rgba(255,255,255,0.05)", borderRadius:16, padding:"24px 20px", border:"1px solid rgba(255,255,255,0.08)", textAlign:"center" }}>
                <div style={{ fontSize:32, marginBottom:10 }}>{s.icon}</div>
                <div style={{ fontSize:36, fontWeight:800, color:"#fff", fontFamily:FONT, marginBottom:6 }}>
                  <Counter target={s.val} />
                </div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.55)", lineHeight:1.6, fontFamily:FONT_BODY }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DISASTER RISK MAP */}
      <section style={{ background:"#F8FAFC", padding:"80px 5%" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:40 }}>
            <div style={{ fontSize:11, fontWeight:700, color:"#4F46E5", letterSpacing:"0.12em", fontFamily:FONT_MONO, marginBottom:8 }}>DISASTER RISK ACROSS INDIA</div>
            <h2 style={{ fontSize:36, fontWeight:800, color:"#0F172A", fontFamily:FONT }}>Know Your Region's Risk</h2>
            <p style={{ fontSize:15, color:"#64748B", marginTop:10, fontFamily:FONT_BODY }}>Different parts of India face different disaster threats. PREPWISE covers all of them.</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
            {DISASTERS.map((d,i)=>(
              <div key={i} className="dis-card" style={{ background:"#fff", borderRadius:14, padding:"20px", border:`1px solid ${d.color}25`, boxShadow:"0 1px 4px rgba(0,0,0,0.04)", transition:"all 0.2s", borderLeft:`4px solid ${d.color}` }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                  <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                    <span style={{ fontSize:24 }}>{d.icon}</span>
                    <div style={{ fontSize:16, fontWeight:700, color:"#0F172A", fontFamily:FONT }}>{d.name}</div>
                  </div>
                  <span style={{ fontSize:9, fontWeight:700, color:d.color, background:d.color+"15", padding:"3px 8px", borderRadius:8, fontFamily:FONT_MONO }}>{d.risk}</span>
                </div>
                <div style={{ fontSize:12, color:"#64748B", fontFamily:FONT_BODY }}>📍 {d.states}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding:"80px 5%", background:"#fff" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:56 }}>
            <div style={{ fontSize:11, fontWeight:700, color:"#4F46E5", letterSpacing:"0.12em", fontFamily:FONT_MONO, marginBottom:8 }}>PLATFORM FEATURES</div>
            <h2 style={{ fontSize:40, fontWeight:800, color:"#0F172A", fontFamily:FONT, marginBottom:12 }}>Everything You Need to Stay Safe</h2>
            <p style={{ fontSize:16, color:"#64748B", maxWidth:500, margin:"0 auto", fontFamily:FONT_BODY, lineHeight:1.7 }}>One platform for learning, practicing and staying prepared for any disaster that may strike your region.</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 }}>
            {FEATURES.map((f,i)=>(
              <div key={i} className="feat-card" style={{ background:"#fff", borderRadius:18, padding:"28px 24px", border:"1px solid #E2E8F0", boxShadow:"0 2px 8px rgba(0,0,0,0.04)", transition:"all 0.3s", cursor:"pointer" }} onClick={()=>navigate("/register")}>
                <div style={{ width:52, height:52, borderRadius:14, background:f.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, marginBottom:16 }}>{f.icon}</div>
                <h3 style={{ fontSize:17, fontWeight:700, color:"#0F172A", fontFamily:FONT, marginBottom:8 }}>{f.title}</h3>
                <p style={{ fontSize:13, color:"#64748B", lineHeight:1.7, fontFamily:FONT_BODY }}>{f.desc}</p>
                <div style={{ marginTop:14, fontSize:12, fontWeight:600, color:f.color, display:"flex", alignItems:"center", gap:4 }}>Learn more →</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{ padding:"80px 5%", background:"linear-gradient(135deg,#F8FAFC,#EFF6FF)" }}>
        <div style={{ maxWidth:1000, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:56 }}>
            <div style={{ fontSize:11, fontWeight:700, color:"#4F46E5", letterSpacing:"0.12em", fontFamily:FONT_MONO, marginBottom:8 }}>HOW IT WORKS</div>
            <h2 style={{ fontSize:40, fontWeight:800, color:"#0F172A", fontFamily:FONT }}>Get Prepared in 4 Steps</h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, position:"relative" }}>
            {/* Connector line */}
            <div style={{ position:"absolute", top:40, left:"15%", right:"15%", height:2, background:"linear-gradient(90deg,#4F46E5,#10B981,#F59E0B,#EF4444)", zIndex:0, opacity:0.3 }}/>
            {STEPS.map((s,i)=>(
              <div key={i} style={{ textAlign:"center", position:"relative", zIndex:1 }}>
                <div style={{ width:80, height:80, borderRadius:"50%", background:`linear-gradient(135deg,${s.color},${s.color}99)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:32, margin:"0 auto 16px", boxShadow:`0 8px 24px ${s.color}40` }}>
                  {s.icon}
                </div>
                <div style={{ fontSize:10, fontWeight:700, color:s.color, fontFamily:FONT_MONO, letterSpacing:"0.1em", marginBottom:4 }}>STEP {s.step}</div>
                <div style={{ fontSize:15, fontWeight:700, color:"#0F172A", fontFamily:FONT, marginBottom:8 }}>{s.title}</div>
                <div style={{ fontSize:12, color:"#64748B", lineHeight:1.6, fontFamily:FONT_BODY }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding:"80px 5%", background:"#fff" }}>
        <div style={{ maxWidth:800, margin:"0 auto", textAlign:"center" }}>
          <div style={{ fontSize:11, fontWeight:700, color:"#4F46E5", letterSpacing:"0.12em", fontFamily:FONT_MONO, marginBottom:8 }}>TESTIMONIALS</div>
          <h2 style={{ fontSize:36, fontWeight:800, color:"#0F172A", fontFamily:FONT, marginBottom:40 }}>Trusted Across India</h2>
          <div style={{ background:"#F8FAFC", borderRadius:20, padding:"36px 40px", border:"1px solid #E2E8F0", minHeight:200, position:"relative" }}>
            <div style={{ fontSize:48, color:"#E2E8F0", fontFamily:"serif", position:"absolute", top:16, left:24, lineHeight:1 }}>"</div>
            <div style={{ fontSize:32, marginBottom:12 }}>{TESTIMONIALS[activeTestimonial].avatar}</div>
            <p style={{ fontSize:16, color:"#374151", lineHeight:1.8, fontFamily:FONT_BODY, fontStyle:"italic", marginBottom:20 }}>"{TESTIMONIALS[activeTestimonial].text}"</p>
            <div style={{ fontWeight:700, color:"#0F172A", fontFamily:FONT, marginBottom:2 }}>{TESTIMONIALS[activeTestimonial].name}</div>
            <div style={{ fontSize:12, color:"#94A3B8", fontFamily:FONT_BODY }}>{TESTIMONIALS[activeTestimonial].role}</div>
            <div style={{ fontSize:14, color:"#F59E0B", marginTop:8 }}>{"★".repeat(TESTIMONIALS[activeTestimonial].stars)}</div>
          </div>
          <div style={{ display:"flex", justifyContent:"center", gap:8, marginTop:16 }}>
            {TESTIMONIALS.map((_,i)=>(
              <div key={i} onClick={()=>setActiveTestimonial(i)} style={{ width:i===activeTestimonial?24:8, height:8, borderRadius:4, background:i===activeTestimonial?"#4F46E5":"#E2E8F0", cursor:"pointer", transition:"all 0.3s" }}/>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:"80px 5%", background:"linear-gradient(135deg,#1E1B4B,#312E81,#4C1D95)", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-60, right:-60, width:300, height:300, borderRadius:"50%", background:"rgba(255,255,255,0.04)" }}/>
        <div style={{ position:"absolute", bottom:-40, left:80, width:200, height:200, borderRadius:"50%", background:"rgba(255,255,255,0.03)" }}/>
        <div style={{ maxWidth:700, margin:"0 auto", textAlign:"center", position:"relative" }}>
          <div style={{ fontSize:40, marginBottom:16, className:"float-icon" }}>🛡️</div>
          <h2 style={{ fontSize:42, fontWeight:800, color:"#fff", fontFamily:FONT, lineHeight:1.2, marginBottom:16 }}>
            Start Your Preparedness<br/>Journey Today
          </h2>
          <p style={{ fontSize:16, color:"rgba(255,255,255,0.7)", marginBottom:32, fontFamily:FONT_BODY, lineHeight:1.7 }}>
            Join thousands of Indians learning to protect themselves and their communities. Free forever.
          </p>
          <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
            <button onClick={()=>navigate("/register")} className="cta-btn" style={{ padding:"16px 40px", background:"linear-gradient(135deg,#F59E0B,#D97706)", border:"none", borderRadius:12, color:"#fff", fontSize:16, fontWeight:700, cursor:"pointer", fontFamily:FONT, boxShadow:"0 8px 24px rgba(245,158,11,0.4)", transition:"all 0.2s" }}>
              Get Started — It is Free →
            </button>
            <button onClick={()=>navigate("/login")} style={{ padding:"16px 40px", background:"rgba(255,255,255,0.1)", border:"1.5px solid rgba(255,255,255,0.3)", borderRadius:12, color:"#fff", fontSize:16, fontWeight:600, cursor:"pointer", fontFamily:FONT, backdropFilter:"blur(10px)" }}>
              Sign In
            </button>
          </div>
          <div style={{ display:"flex", gap:24, justifyContent:"center", marginTop:32, flexWrap:"wrap" }}>
            {["✅ 100% Free","✅ No credit card","✅ India-specific","✅ AI-powered"].map(t=>(
              <span key={t} style={{ fontSize:13, color:"rgba(255,255,255,0.65)", fontFamily:FONT_BODY }}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background:"#0F172A", padding:"40px 5% 24px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24, flexWrap:"wrap", gap:16 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:36, height:36, borderRadius:10, background:"linear-gradient(135deg,#4F46E5,#7C3AED)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>🛡️</div>
              <div>
                <div style={{ fontSize:16, fontWeight:800, color:"#fff", fontFamily:FONT }}>PREPWISE</div>
                <div style={{ fontSize:10, color:"#64748B", letterSpacing:"0.1em" }}>EDU SYSTEM</div>
              </div>
            </div>
            <div style={{ display:"flex", gap:20, flexWrap:"wrap" }}>
              {["About","Courses","Simulations","Certificates","Contact"].map(l=>(
                <span key={l} style={{ fontSize:13, color:"#64748B", cursor:"pointer", fontFamily:FONT_BODY }}>{l}</span>
              ))}
            </div>
            <div style={{ display:"flex", gap:12 }}>
              {[["112","Emergency"],["108","Ambulance"],["1078","NDRF"]].map(([n,l])=>(
                <a key={n} href={"tel:"+n} style={{ textDecoration:"none", background:"rgba(239,68,68,0.15)", borderRadius:8, padding:"4px 10px", display:"flex", gap:4, alignItems:"center" }}>
                  <span style={{ fontSize:12, fontWeight:800, color:"#EF4444", fontFamily:FONT_MONO }}>{n}</span>
                  <span style={{ fontSize:10, color:"#64748B" }}>{l}</span>
                </a>
              ))}
            </div>
          </div>
          <div style={{ borderTop:"1px solid #1E293B", paddingTop:20, display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:8 }}>
            <span style={{ fontSize:12, color:"#475569", fontFamily:FONT_BODY }}>© 2026 PREPWISE. Built for India's safety 🇮🇳</span>
            <span style={{ fontSize:12, color:"#475569", fontFamily:FONT_BODY }}>Powered by Groq AI · Llama 3.3 70B</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
