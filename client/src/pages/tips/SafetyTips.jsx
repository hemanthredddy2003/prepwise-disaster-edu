import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";

const FONT = "Space Grotesk, sans-serif";
const FONT_MONO = "JetBrains Mono, monospace";
const FONT_BODY = "Inter, sans-serif";

const TIPS_DATA = [
  {
    id:"flood", icon:"🌊", title:"Flood Safety", color:"#3B82F6", bg:"rgba(59,130,246,0.1)",
    tips:[
      { title:"Before a Flood", dos:["Move important documents to upper floors","Keep emergency kit ready with 3-day supplies","Know your evacuation routes in advance","Save emergency numbers offline","Elevate electrical appliances if possible"], donts:["Don't ignore flood warnings or alerts","Don't wait for water to enter before evacuating","Don't store valuables in basement","Don't use electrical appliances near water"] },
      { title:"During a Flood", dos:["Move to higher ground immediately","Disconnect electrical equipment safely","Follow official evacuation instructions","Use SMS — calls may not work","Keep children and elderly close"], donts:["Don't walk through moving floodwater (6 inches can knock you down)","Don't drive through flooded roads","Don't touch electrical wires in water","Don't drink floodwater under any circumstances"] },
      { title:"After a Flood", dos:["Wait for official all-clear before returning","Document damage with photos for insurance","Boil water until supply is confirmed safe","Wear protective footwear — hidden hazards in mud","Check for gas leaks before entering building"], donts:["Don't enter buildings with structural damage","Don't use appliances before electrical safety check","Don't ignore skin infections from floodwater","Don't dump debris near waterways"] },
    ]
  },
  {
    id:"earthquake", icon:"🏚️", title:"Earthquake Safety", color:"#F59E0B", bg:"rgba(245,158,11,0.1)",
    tips:[
      { title:"During Shaking", dos:["DROP to hands and knees immediately","Take COVER under sturdy desk or against interior wall","HOLD ON and protect head with arms","If outdoors, move away from buildings and power lines","If driving, stop safely away from bridges and overpasses"], donts:["Don't run outside during shaking","Don't stand in doorways (outdated advice — not safer)","Don't use elevators","Don't use candles or lighters after quake (gas leak risk)"] },
      { title:"After an Earthquake", dos:["Check yourself and others for injuries","Expect aftershocks — can be strong","Check for gas leaks (smell, sound)","Use flashlights — no open flames","Listen to emergency broadcasts"], donts:["Don't re-enter damaged buildings","Don't use phone unless life-threatening emergency","Don't light matches or cigarettes","Don't ignore small cracks — get structure assessed"] },
    ]
  },
  {
    id:"cyclone", icon:"🌀", title:"Cyclone Safety", color:"#8B5CF6", bg:"rgba(139,92,246,0.1)",
    tips:[
      { title:"Before Landfall", dos:["Secure loose outdoor items (furniture, pots)","Board up windows with shutters or plywood","Identify nearest cyclone shelter","Keep emergency kit stocked","Charge all devices, power banks"], donts:["Don't ignore cyclone warnings or downgrade alerts","Don't stay in coastal areas if advised to evacuate","Don't park vehicles under trees","Don't wait for last minute — evacuate early"] },
      { title:"During Cyclone", dos:["Stay indoors away from windows","Stay in strongest room of the building","If in a mobile home — evacuate immediately","Keep radio/phone for updates","Stay calm and conserve battery"], donts:["Don't go outside during the eye — storm will resume","Don't use electrical appliances","Don't open windows thinking pressure equalises","Don't attempt travel in high winds"] },
    ]
  },
  {
    id:"fire", icon:"🔥", title:"Fire Safety", color:"#EF4444", bg:"rgba(239,68,68,0.1)",
    tips:[
      { title:"Home Fire Prevention", dos:["Install smoke detectors on every floor","Test detectors monthly, replace batteries yearly","Keep fire extinguisher in kitchen","Plan and practice home fire escape routes","Keep flammable items away from stove"], donts:["Don't leave cooking unattended","Don't overload electrical outlets","Don't use damaged electrical cords","Don't smoke near flammable materials"] },
      { title:"During a Fire", dos:["Alert everyone and call 101 immediately","Crawl low under smoke to exit","Feel door with back of hand before opening","Use stairs — never elevators","Meet at designated assembly point"], donts:["Don't try to retrieve belongings","Don't open hot doors","Don't re-enter building for any reason","Don't use lifts/elevators"] },
    ]
  },
  {
    id:"heatwave", icon:"🌡️", title:"Heatwave Safety", color:"#F97316", bg:"rgba(249,115,22,0.1)",
    tips:[
      { title:"During Extreme Heat", dos:["Drink water every 20 minutes even if not thirsty","Stay indoors between 11 AM and 5 PM","Wear light, loose, light-colored clothing","Use ORS if sweating heavily","Check on elderly and children regularly"], donts:["Don't do outdoor work in peak afternoon hours","Don't drink alcohol, tea or coffee — dehydrate faster","Don't leave children in parked cars — fatal in 10 minutes","Don't ignore symptoms: dizziness, nausea, rapid pulse"] },
    ]
  },
  {
    id:"general", icon:"🎒", title:"General Preparedness", color:"#10B981", bg:"rgba(16,185,129,0.1)",
    tips:[
      { title:"Emergency Kit Essentials", dos:["Water: 1 litre per person per day for 3 days","Non-perishable food for 3 days","First aid kit with manual","Battery-powered radio and torch","Copies of important documents","Medications (7-day supply)","Cash in small denominations","Whistle to signal for help"], donts:["Don't forget pet food if you have pets","Don't pack heavy items in one bag","Don't forget infant supplies if applicable","Don't neglect special needs equipment"] },
      { title:"Family Emergency Plan", dos:["Designate a meeting point near home","Choose an out-of-state contact for family to check in with","Share plan with all family members including children","Practice the plan twice a year","Know your building's emergency exits"], donts:["Don't assume someone else will make the plan","Don't keep plan only in digital format","Don't forget to include neighbors who may need help","Don't skip practicing with children — they need to know"] },
    ]
  },
];

export default function SafetyTips() {
  const { dark } = useTheme();
  const [activeCat, setActiveCat] = useState("flood");
  const [expandedTip, setExpandedTip] = useState(0);

  const s = (light, dk) => dark ? dk : light;
  const cat = TIPS_DATA.find(t => t.id === activeCat) || TIPS_DATA[0];

  return (
    
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .cat-card:hover { transform:translateY(-3px); box-shadow: 0 8px 20px rgba(0,0,0,0.08) !important; }
        .cat-card { transition: all 0.2s !important; }
        .tip-section:hover { border-color: var(--tip-color) !important; }
      `}</style>

      {/* Header */}
      <div style={{marginBottom:24}}>
        <div style={{fontSize:10,color:"#94A3B8",fontFamily:FONT_MONO,letterSpacing:"0.12em",marginBottom:4}}>LEARN — PREPAREDNESS GUIDE</div>
        <h1 style={{fontSize:28,fontWeight:800,color:s("#0F172A","#F1F5F9"),fontFamily:FONT,margin:0}}>Safety Tips</h1>
        <p style={{fontSize:13,color:"#64748B",marginTop:4,fontFamily:FONT_BODY}}>Do's and Don'ts for every type of disaster — save lives with the right knowledge</p>
      </div>

      {/* Category grid */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:10,marginBottom:24}}>
        {TIPS_DATA.map(t => (
          <div key={t.id} className="cat-card" onClick={() => { setActiveCat(t.id); setExpandedTip(0); }} style={{
            background: activeCat===t.id ? t.color : s("#fff","#0F172A"),
            border:`1px solid ${activeCat===t.id ? t.color : s("#E2E8F0","#1E293B")}`,
            borderRadius:14,padding:"14px 12px",cursor:"pointer",textAlign:"center",
            boxShadow: activeCat===t.id ? `0 8px 24px ${t.color}40` : s("0 1px 3px rgba(0,0,0,0.04)","none")
          }}>
            <div style={{fontSize:26,marginBottom:6}}>{t.icon}</div>
            <div style={{fontSize:11,fontWeight:700,color:activeCat===t.id?"#fff":s("#374151","#94A3B8"),fontFamily:FONT,lineHeight:1.2}}>{t.title.replace(" Safety","").replace(" Preparedness","")}</div>
          </div>
        ))}
      </div>

      {/* Active category content */}
      <div style={{animation:"fadeUp 0.25s ease"}}>
        {/* Category header */}
        <div style={{background:`linear-gradient(135deg,${cat.color}15,${cat.color}05)`,border:`1px solid ${cat.color}30`,borderRadius:16,padding:"18px 24px",marginBottom:16,display:"flex",alignItems:"center",gap:14}}>
          <div style={{width:52,height:52,borderRadius:14,background:cat.color+"20",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,border:`1px solid ${cat.color}30`}}>
            {cat.icon}
          </div>
          <div>
            <h2 style={{fontSize:20,fontWeight:800,color:s("#0F172A","#F1F5F9"),fontFamily:FONT,margin:0}}>{cat.title}</h2>
            <p style={{fontSize:12,color:"#64748B",margin:"4px 0 0",fontFamily:FONT_BODY}}>{cat.tips.length} section{cat.tips.length>1?"s":""} · {cat.tips.reduce((s,t)=>s+t.dos.length+t.donts.length,0)} tips</p>
          </div>
        </div>

        {/* Tip sections */}
        {cat.tips.map((tip, i) => {
          const isOpen = expandedTip === i;
          return (
            <div key={i} className="tip-section" style={{
              "--tip-color": cat.color,
              background:s("#fff","#0F172A"),
              border:`1px solid ${isOpen ? cat.color+"50" : s("#E2E8F0","#1E293B")}`,
              borderRadius:14,marginBottom:10,overflow:"hidden",
              boxShadow: isOpen ? `0 4px 16px ${cat.color}15` : s("0 1px 3px rgba(0,0,0,0.04)","none"),
              transition:"all 0.2s"
            }}>
              {/* Section header */}
              <div onClick={() => setExpandedTip(isOpen ? -1 : i)} style={{padding:"16px 20px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:isOpen?`1px solid ${s("#F1F5F9","#1E293B")}`:"none"}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:cat.color}}/>
                  <span style={{fontSize:14,fontWeight:700,color:s("#0F172A","#F1F5F9"),fontFamily:FONT}}>{tip.title}</span>
                  <span style={{fontSize:10,color:"#94A3B8",fontFamily:FONT_MONO}}>{tip.dos.length + tip.donts.length} tips</span>
                </div>
                <span style={{fontSize:16,color:cat.color,transition:"transform 0.2s",display:"inline-block",transform:isOpen?"rotate(180deg)":"rotate(0deg)"}}>▾</span>
              </div>

              {/* Content */}
              {isOpen && (
                <div style={{padding:"16px 20px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,animation:"fadeUp 0.2s ease"}}>
                  {/* Dos */}
                  <div>
                    <div style={{fontSize:12,fontWeight:700,color:"#10B981",fontFamily:FONT_MONO,letterSpacing:"0.08em",marginBottom:10,display:"flex",alignItems:"center",gap:6}}>
                      <span style={{background:"rgba(16,185,129,0.15)",borderRadius:6,padding:"2px 8px"}}>✅ DO's</span>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",gap:8}}>
                      {tip.dos.map((d,j) => (
                        <div key={j} style={{display:"flex",gap:10,alignItems:"flex-start",padding:"10px 12px",background:s("rgba(16,185,129,0.04)","rgba(16,185,129,0.06)"),borderRadius:10,border:"1px solid rgba(16,185,129,0.12)"}}>
                          <span style={{flexShrink:0,color:"#10B981",fontSize:14,marginTop:1}}>✓</span>
                          <span style={{fontSize:12,color:s("#334155","#94A3B8"),fontFamily:FONT_BODY,lineHeight:1.5}}>{d}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Donts */}
                  <div>
                    <div style={{fontSize:12,fontWeight:700,color:"#EF4444",fontFamily:FONT_MONO,letterSpacing:"0.08em",marginBottom:10,display:"flex",alignItems:"center",gap:6}}>
                      <span style={{background:"rgba(239,68,68,0.1)",borderRadius:6,padding:"2px 8px"}}>❌ DON'Ts</span>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",gap:8}}>
                      {tip.donts.map((d,j) => (
                        <div key={j} style={{display:"flex",gap:10,alignItems:"flex-start",padding:"10px 12px",background:s("rgba(239,68,68,0.04)","rgba(239,68,68,0.06)"),borderRadius:10,border:"1px solid rgba(239,68,68,0.12)"}}>
                          <span style={{flexShrink:0,color:"#EF4444",fontSize:14,marginTop:1}}>✗</span>
                          <span style={{fontSize:12,color:s("#334155","#94A3B8"),fontFamily:FONT_BODY,lineHeight:1.5}}>{d}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    
  );
}
