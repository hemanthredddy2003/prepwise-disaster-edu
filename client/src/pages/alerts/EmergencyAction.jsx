import { useState } from "react";

const disasters = [
  {
    id: "earthquake", label: "Earthquake", icon: "🌍", color: "#DC2626", bg: "#FEF2F2",
    phases: [
      { phase: "During Shaking", icon: "⚡", steps: [
        { action: "DROP to hands and knees immediately", critical: true },
        { action: "Take COVER under a sturdy desk or table. If none, cover head and neck with arms", critical: true },
        { action: "HOLD ON until shaking completely stops", critical: true },
        { action: "Stay away from windows, exterior walls and anything that can fall" },
        { action: "If in bed, stay there and protect head with pillow" },
        { action: "Never run outside during shaking — falling debris is the biggest killer" },
      ]},
      { phase: "After Shaking", icon: "🔍", steps: [
        { action: "Check yourself for injuries before helping others", critical: true },
        { action: "Expect aftershocks — DROP, COVER, HOLD ON again each time" },
        { action: "If you smell gas — open windows, leave immediately, call gas helpline from outside" },
        { action: "Do NOT use elevators — use stairs only" },
        { action: "Move to open ground away from buildings and power lines" },
        { action: "Do NOT re-enter damaged buildings under any circumstances" },
      ]},
      { phase: "Next 24-72 Hours", icon: "📻", steps: [
        { action: "Tune to All India Radio or Doordarshan for official updates" },
        { action: "Use SMS — more reliable than calls during network congestion" },
        { action: "Document damage with photos for insurance claims" },
        { action: "Check on elderly, disabled and vulnerable neighbours" },
        { action: "Do not spread unverified information on social media" },
      ]},
    ],
    emergency: ["112 — National Emergency", "1078 — NDRF Helpline", "108 — Ambulance", "100 — Police"],
    tip: "Most deaths in earthquakes are caused by falling objects — not by the ground moving. The Drop-Cover-Hold On technique reduces injury risk by up to 90%."
  },
  {
    id: "flood", label: "Flood", icon: "🌊", color: "#2563EB", bg: "#EFF6FF",
    phases: [
      { phase: "Before Flood Arrives", icon: "⚡", steps: [
        { action: "Act on the FIRST warning — do not wait for water to reach your door", critical: true },
        { action: "Grab your emergency kit — water, food, medicines, documents, torch, power bank", critical: true },
        { action: "Move to higher ground or nearest government shelter", critical: true },
        { action: "Turn off electricity at main switch before leaving" },
        { action: "Move vehicles to higher ground if time permits" },
        { action: "Inform neighbours and help those who need assistance" },
      ]},
      { phase: "During Flood", icon: "🔍", steps: [
        { action: "Never walk through moving water — 15cm can knock you down", critical: true },
        { action: "Never drive through floodwater — Turn Around, Don't Drown", critical: true },
        { action: "If trapped at home, move to highest floor. Signal rescuers with bright cloth" },
        { action: "Drink only bottled or boiled water — flood water is contaminated" },
        { action: "Call 112 for emergency rescue. Use whistle to signal location" },
      ]},
      { phase: "After Flood Recedes", icon: "📻", steps: [
        { action: "Do not return home until authorities declare it safe" },
        { action: "Wear rubber boots and gloves — floodwater carries disease" },
        { action: "Check for structural damage before entering any building" },
        { action: "Discard all food that touched floodwater" },
        { action: "Clean and disinfect everything that got wet" },
        { action: "Watch for mosquito breeding — dengue risk rises after floods" },
      ]},
    ],
    emergency: ["112 — National Emergency", "1078 — NDRF Helpline", "108 — Ambulance", "1800-180-1717 — NDMA"],
    tip: "Early evacuation saves lives. By the time water reaches your door, roads may already be flooded. Leave when you get the first warning."
  },
  {
    id: "cyclone", label: "Cyclone", icon: "🌀", color: "#7C3AED", bg: "#F5F3FF",
    phases: [
      { phase: "24-48 Hours Before", icon: "⚡", steps: [
        { action: "Evacuate coastal areas and low-lying regions immediately when warned", critical: true },
        { action: "Stock 3 days of water, food, medicines and essentials", critical: true },
        { action: "Secure or bring inside all loose outdoor objects" },
        { action: "Reinforce doors and windows with boards or tape" },
        { action: "Charge all devices and power banks fully" },
        { action: "Know the location of your nearest cyclone shelter" },
      ]},
      { phase: "During Cyclone", icon: "🔍", steps: [
        { action: "Stay indoors — never go outside during a cyclone", critical: true },
        { action: "Move to the strongest room on the lowest floor away from windows" },
        { action: "If roof is torn off, get under a heavy table — do not run outside" },
        { action: "Beware of the eye — calm period does NOT mean cyclone is over" },
        { action: "Listen to radio for updates. Do not trust social media rumours" },
      ]},
      { phase: "After Cyclone", icon: "📻", steps: [
        { action: "Wait for official all-clear before going outside" },
        { action: "Avoid downed power lines — assume all are live" },
        { action: "Check for gas leaks before switching on electricity" },
        { action: "Report damage to authorities for relief assistance" },
        { action: "Watch for snakes displaced by flooding" },
      ]},
    ],
    emergency: ["112 — National Emergency", "1078 — NDRF", "08912752600 — AP Cyclone Centre", "1800-180-1717 — NDMA"],
    tip: "The eye of a cyclone brings false calm — winds return stronger from the opposite direction. Never go outside during the eye."
  },
  {
    id: "fire", label: "Fire", icon: "🔥", color: "#EA580C", bg: "#FFF7ED",
    phases: [
      { phase: "When Fire Breaks Out", icon: "⚡", steps: [
        { action: "Shout FIRE to alert everyone. Activate the nearest fire alarm", critical: true },
        { action: "Call 101 (Fire) and 112 (Emergency) immediately", critical: true },
        { action: "Evacuate immediately — do not try to collect belongings", critical: true },
        { action: "Crawl low under smoke — clean air is near the floor" },
        { action: "Feel doors with back of hand before opening — if hot, don't open" },
        { action: "Close doors behind you to slow fire spread" },
      ]},
      { phase: "If Trapped", icon: "🔍", steps: [
        { action: "Seal gaps under doors with clothing to block smoke", critical: true },
        { action: "Signal from window with bright cloth — do NOT jump from above 2nd floor" },
        { action: "Call 112 and give your exact location" },
        { action: "Stay low and move toward fresh air" },
        { action: "If clothes catch fire — STOP, DROP, ROLL" },
      ]},
      { phase: "After Evacuation", icon: "📻", steps: [
        { action: "Meet at your designated assembly point — never go back inside" },
        { action: "Account for all family members and report missing persons to fire brigade" },
        { action: "Do not re-enter until fire brigade gives all clear" },
        { action: "Seek medical attention even for minor smoke inhalation" },
      ]},
    ],
    emergency: ["101 — Fire Brigade", "112 — National Emergency", "108 — Ambulance"],
    tip: "Smoke kills faster than flames. In a fire, crawl low — the air near the floor is cleaner. Cover your nose and mouth with wet cloth."
  },
  {
    id: "heatwave", label: "Heatwave", icon: "🌡️", color: "#D97706", bg: "#FFFBEB",
    phases: [
      { phase: "Immediate Actions", icon: "⚡", steps: [
        { action: "Stay indoors between 11am and 5pm — avoid outdoor activity", critical: true },
        { action: "Drink water every 15-20 minutes even if not thirsty", critical: true },
        { action: "Wear loose, light-coloured cotton clothing" },
        { action: "Use ORS if sweating heavily to replace salts" },
        { action: "Check on elderly, young children and those with health conditions" },
      ]},
      { phase: "Signs of Heat Stroke", icon: "🔍", steps: [
        { action: "CALL 108 immediately if someone stops sweating, is confused or unconscious", critical: true },
        { action: "Move person to shade or cool area immediately" },
        { action: "Cool with wet cloth, ice packs on neck, armpits and groin" },
        { action: "Do NOT give water to unconscious person" },
        { action: "Fan the person while keeping skin wet" },
      ]},
      { phase: "Protection Measures", icon: "📻", steps: [
        { action: "Use cooler, AC or wet curtains to cool home" },
        { action: "Avoid alcohol, tea and coffee — they dehydrate" },
        { action: "Never leave children or pets in parked vehicles" },
        { action: "Follow IMD heat alerts — schools may close on red alert days" },
      ]},
    ],
    emergency: ["108 — Ambulance / EMRI", "112 — National Emergency", "104 — Health Helpline"],
    tip: "Heat stroke is a medical emergency — the person stops sweating and body temperature rises above 104°F. Call 108 immediately."
  },
  {
    id: "landslide", label: "Landslide", icon: "⛰️", color: "#65A30D", bg: "#F7FEE7",
    phases: [
      { phase: "Warning Signs", icon: "⚡", steps: [
        { action: "Evacuate IMMEDIATELY if you hear rumbling or see cracks in hillside", critical: true },
        { action: "Watch for sudden changes in stream water — muddy water means landslide upstream", critical: true },
        { action: "Act on ANY official warning — do not wait to confirm visually" },
        { action: "Move away from slopes, drainage channels and valleys" },
        { action: "Alert neighbours and help those who cannot move quickly" },
      ]},
      { phase: "If Landslide Occurs", icon: "🔍", steps: [
        { action: "Run to nearest high ground — move perpendicular to debris flow path", critical: true },
        { action: "If escape is impossible — curl into tight ball and protect head" },
        { action: "Avoid river valleys and low-lying areas after heavy rain" },
        { action: "If buried — tap rhythmically to help rescuers locate you" },
      ]},
      { phase: "After Landslide", icon: "📻", steps: [
        { action: "Stay away from slide area — secondary slides are common" },
        { action: "Watch for flooding — landslides can dam rivers temporarily" },
        { action: "Check for injured persons — do not move seriously injured without training" },
        { action: "Report to authorities for rescue operations" },
      ]},
    ],
    emergency: ["112 — National Emergency", "1078 — NDRF", "108 — Ambulance"],
    tip: "Most landslide deaths occur because people do not evacuate when warned. Heavy rainfall + steep slopes = evacuate immediately. No belongings are worth your life."
  },
];

export default function EmergencyAction() {
  const [selected, setSelected] = useState(null);
  const [activePhase, setActivePhase] = useState(0);

  const d = selected ? disasters.find(x => x.id === selected) : null;

  return (
    <div style={{ padding: "24px 28px", maxWidth: 1000, margin: "0 auto", fontFamily: "Inter, system-ui" }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: "#6B7280", letterSpacing: "0.1em", marginBottom: 4 }}>EMERGENCY — INSTANT GUIDANCE</div>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111827", margin: 0 }}>⚡ What do I do RIGHT NOW?</h1>
        <p style={{ fontSize: 13, color: "#6B7280", margin: "4px 0 0" }}>Select your emergency for immediate step-by-step guidance</p>
      </div>

      {/* Disaster grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 24 }}>
        {disasters.map(dis => (
          <button key={dis.id} onClick={() => { setSelected(dis.id); setActivePhase(0); }} style={{
            padding: "20px", borderRadius: 16, border: `2px solid ${selected === dis.id ? dis.color : "#E5E7EB"}`,
            background: selected === dis.id ? dis.bg : "#fff", cursor: "pointer", textAlign: "center",
            transition: "all 0.2s", boxShadow: selected === dis.id ? `0 4px 16px ${dis.color}30` : "0 1px 3px rgba(0,0,0,0.05)"
          }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>{dis.icon}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: selected === dis.id ? dis.color : "#374151" }}>{dis.label}</div>
          </button>
        ))}
      </div>

      {/* Action steps */}
      {d && (
        <div>
          {/* Tip banner */}
          <div style={{ background: d.bg, border: `1px solid ${d.color}30`, borderRadius: 14, padding: "14px 18px", marginBottom: 20, display: "flex", gap: 12, alignItems: "flex-start" }}>
            <span style={{ fontSize: 20 }}>💡</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: d.color, marginBottom: 4 }}>KEY FACT</div>
              <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.6 }}>{d.tip}</div>
            </div>
          </div>

          {/* Phase tabs */}
          <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
            {d.phases.map((p, i) => (
              <button key={i} onClick={() => setActivePhase(i)} style={{
                padding: "9px 18px", borderRadius: 20, border: `1px solid ${activePhase === i ? d.color : "#E5E7EB"}`,
                background: activePhase === i ? d.color : "#fff", color: activePhase === i ? "#fff" : "#6B7280",
                fontSize: 13, fontWeight: 600, cursor: "pointer"
              }}>{p.icon} {p.phase}</button>
            ))}
          </div>

          {/* Steps */}
          <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", marginBottom: 20 }}>
            <div style={{ padding: "16px 20px", background: d.bg, borderBottom: "1px solid #E5E7EB" }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: d.color }}>{d.phases[activePhase].icon} {d.phases[activePhase].phase}</div>
            </div>
            <div>
              {d.phases[activePhase].steps.map((step, i) => (
                <div key={i} style={{ display: "flex", gap: 14, padding: "14px 20px", borderBottom: i < d.phases[activePhase].steps.length - 1 ? "1px solid #F9FAFB" : "none", background: step.critical ? d.color + "05" : "#fff" }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: step.critical ? d.color : "#F3F4F6", color: step.critical ? "#fff" : "#6B7280", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, flexShrink: 0 }}>{i + 1}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: step.critical ? 700 : 500, color: step.critical ? "#111827" : "#374151", lineHeight: 1.5 }}>{step.action}</div>
                    {step.critical && <span style={{ fontSize: 10, fontWeight: 700, color: d.color, background: d.bg, border: `1px solid ${d.color}30`, padding: "1px 8px", borderRadius: 8, marginTop: 4, display: "inline-block" }}>CRITICAL</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency numbers */}
          <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 14, padding: "16px 20px" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#DC2626", marginBottom: 12 }}>🆘 Emergency Numbers — Call Now</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8 }}>
              {d.emergency.map((e, i) => {
                const [num, ...rest] = e.split(" — ");
                return (
                  <a key={i} href={`tel:${num.trim()}`} style={{ display: "flex", gap: 10, alignItems: "center", padding: "10px 14px", background: "#fff", borderRadius: 10, border: "1px solid #FECACA", textDecoration: "none" }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: "#DC2626", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>📞</div>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: "#DC2626" }}>{num.trim()}</div>
                      <div style={{ fontSize: 11, color: "#6B7280" }}>{rest.join(" — ")}</div>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {!selected && (
        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 16, padding: "40px", textAlign: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>👆</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 8 }}>Select a disaster type above</div>
          <div style={{ fontSize: 13, color: "#9CA3AF" }}>Get immediate step-by-step guidance for any emergency situation in India</div>
        </div>
      )}
    </div>
  );
}
