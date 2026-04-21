import { useState } from "react";

const CATEGORIES = [
  {
    name: "Water & Food", icon: "💧", color: "#2563EB",
    items: [
      { name: "Drinking water (3L per person per day)", qty: "9 litres min", critical: true },
      { name: "Water purification tablets", qty: "1 pack", critical: true },
      { name: "Ready-to-eat food packets", qty: "3 days supply", critical: true },
      { name: "Energy bars / dry fruits", qty: "500g", critical: false },
      { name: "ORS sachets", qty: "10 sachets", critical: true },
      { name: "Baby food (if applicable)", qty: "3 days supply", critical: false },
    ]
  },
  {
    name: "Medical & First Aid", icon: "🚑", color: "#DC2626",
    items: [
      { name: "Prescription medicines (7 day supply)", qty: "Per family member", critical: true },
      { name: "Basic first aid kit", qty: "1 kit", critical: true },
      { name: "Bandages and antiseptic", qty: "Assorted", critical: true },
      { name: "Thermometer", qty: "1", critical: false },
      { name: "Mosquito repellent", qty: "1 bottle", critical: false },
      { name: "Hand sanitizer", qty: "500ml", critical: false },
    ]
  },
  {
    name: "Documents & Money", icon: "📄", color: "#7C3AED",
    items: [
      { name: "Aadhaar card copies (waterproof bag)", qty: "All family members", critical: true },
      { name: "Bank passbook / cards", qty: "1 set", critical: true },
      { name: "Cash in small denominations", qty: "₹2000-5000", critical: true },
      { name: "Insurance documents", qty: "Copies", critical: false },
      { name: "Property / land documents", qty: "Copies", critical: false },
      { name: "Emergency contacts written on paper", qty: "1 list", critical: true },
    ]
  },
  {
    name: "Tools & Safety", icon: "🔦", color: "#D97706",
    items: [
      { name: "Torch with extra batteries", qty: "1 + batteries", critical: true },
      { name: "Fully charged power bank", qty: "10000mAh+", critical: true },
      { name: "Whistle (to signal for help)", qty: "1 per person", critical: true },
      { name: "Rope (10 metres)", qty: "1 rope", critical: false },
      { name: "Multi-tool or Swiss knife", qty: "1", critical: false },
      { name: "Waterproof matches / lighter", qty: "1", critical: false },
    ]
  },
  {
    name: "Clothing & Shelter", icon: "👕", color: "#16A34A",
    items: [
      { name: "Warm clothes / rain jacket", qty: "1 set per person", critical: true },
      { name: "Sturdy closed-toe shoes", qty: "1 pair per person", critical: true },
      { name: "Blankets", qty: "1 per person", critical: true },
      { name: "Emergency mylar blanket", qty: "1 per person", critical: false },
      { name: "Rain poncho", qty: "1 per person", critical: false },
      { name: "N95 masks", qty: "5 per person", critical: false },
    ]
  },
  {
    name: "Communication", icon: "📻", color: "#0891B2",
    items: [
      { name: "Battery-powered or hand-crank radio", qty: "1", critical: true },
      { name: "Extra SIM card (different network)", qty: "1", critical: false },
      { name: "Written list of emergency numbers", qty: "1 laminated", critical: true },
      { name: "Family communication plan", qty: "1 copy", critical: true },
      { name: "Map of local area (paper)", qty: "1", critical: false },
      { name: "Pen and notepad", qty: "1 set", critical: false },
    ]
  },
];

const EMERGENCY_NUMBERS = [
  { num: "112", label: "National Emergency", color: "#DC2626" },
  { num: "108", label: "Ambulance", color: "#7C3AED" },
  { num: "101", label: "Fire Brigade", color: "#D97706" },
  { num: "100", label: "Police", color: "#2563EB" },
  { num: "1078", label: "NDRF", color: "#16A34A" },
  { num: "1800-180-1717", label: "NDMA Helpline", color: "#0891B2" },
];

export default function EmergencyKit() {
  const [checked, setChecked] = useState(() => {
    try { return JSON.parse(localStorage.getItem("emergency_kit_checks") || "{}"); }
    catch { return {}; }
  });
  const [activeTab, setActiveTab] = useState(0);

  function toggle(catIdx, itemIdx) {
    const key = `${catIdx}-${itemIdx}`;
    const updated = { ...checked, [key]: !checked[key] };
    setChecked(updated);
    localStorage.setItem("emergency_kit_checks", JSON.stringify(updated));
  }

  const totalItems = CATEGORIES.reduce((s, c) => s + c.items.length, 0);
  const checkedCount = Object.values(checked).filter(Boolean).length;
  const readiness = Math.round((checkedCount / totalItems) * 100);

  const cat = CATEGORIES[activeTab];
  const catChecked = cat.items.filter((_, j) => checked[`${activeTab}-${j}`]).length;

  return (
    <div style={{ padding: "24px 28px", maxWidth: 1000, margin: "0 auto", fontFamily: "Inter, system-ui" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: "#6B7280", letterSpacing: "0.1em", marginBottom: 4 }}>PREPAREDNESS — NDMA STANDARD</div>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111827", margin: 0 }}>🎒 Emergency Kit Checklist</h1>
        <p style={{ fontSize: 13, color: "#6B7280", margin: "4px 0 0" }}>NDMA-recommended emergency kit — pack before monsoon season (June 1st)</p>
      </div>

      {/* Progress */}
      <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 16, padding: "20px 24px", marginBottom: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>Overall Kit Readiness</div>
            <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>{checkedCount} of {totalItems} items packed</div>
          </div>
          <div style={{ fontSize: 36, fontWeight: 800, color: readiness >= 80 ? "#16A34A" : readiness >= 50 ? "#D97706" : "#DC2626" }}>{readiness}%</div>
        </div>
        <div style={{ height: 10, background: "#F3F4F6", borderRadius: 5, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${readiness}%`, background: readiness >= 80 ? "#16A34A" : readiness >= 50 ? "#D97706" : "#DC2626", borderRadius: 5, transition: "width 0.5s" }} />
        </div>
        {readiness === 100 && <div style={{ marginTop: 12, fontSize: 13, color: "#065F46", fontWeight: 600 }}>✅ Your emergency kit is fully ready! Refresh annually every June 1st.</div>}
        {readiness < 50 && <div style={{ marginTop: 12, fontSize: 13, color: "#991B1B", fontWeight: 600 }}>⚠️ Your kit needs attention. Focus on critical items first.</div>}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 20 }}>
        {/* Category tabs */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {CATEGORIES.map((c, i) => {
            const cnt = c.items.filter((_, j) => checked[`${i}-${j}`]).length;
            const pct = Math.round((cnt / c.items.length) * 100);
            return (
              <button key={i} onClick={() => setActiveTab(i)} style={{
                padding: "12px 14px", borderRadius: 12, border: `1px solid ${activeTab === i ? c.color : "#E5E7EB"}`,
                background: activeTab === i ? c.color + "10" : "#fff", cursor: "pointer", textAlign: "left",
                transition: "all 0.15s"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 18 }}>{c.icon}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: activeTab === i ? c.color : "#374151" }}>{c.name}</span>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: pct === 100 ? "#16A34A" : c.color }}>{pct}%</span>
                </div>
                <div style={{ height: 3, background: "#F3F4F6", borderRadius: 2 }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: pct === 100 ? "#16A34A" : c.color, borderRadius: 2 }} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Items list */}
        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #F3F4F6", display: "flex", justifyContent: "space-between", alignItems: "center", background: cat.color + "08" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 24 }}>{cat.icon}</span>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{cat.name}</div>
                <div style={{ fontSize: 11, color: "#6B7280" }}>{catChecked} of {cat.items.length} items ready</div>
              </div>
            </div>
            <button onClick={() => {
              const all = {};
              cat.items.forEach((_, j) => { all[`${activeTab}-${j}`] = true; });
              const updated = { ...checked, ...all };
              setChecked(updated);
              localStorage.setItem("emergency_kit_checks", JSON.stringify(updated));
            }} style={{ fontSize: 12, color: cat.color, background: cat.color + "15", border: `1px solid ${cat.color}30`, borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontWeight: 600 }}>
              Mark all ready
            </button>
          </div>
          <div>
            {cat.items.map((item, j) => {
              const key = `${activeTab}-${j}`;
              const done = checked[key];
              return (
                <div key={j} onClick={() => toggle(activeTab, j)} style={{
                  display: "flex", alignItems: "center", gap: 14, padding: "14px 20px",
                  borderBottom: j < cat.items.length - 1 ? "1px solid #F9FAFB" : "none",
                  cursor: "pointer", background: done ? cat.color + "05" : "#fff", transition: "background 0.15s"
                }}>
                  <div style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${done ? cat.color : "#D1D5DB"}`, background: done ? cat.color : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s" }}>
                    {done && <span style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>✓</span>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 13, color: done ? cat.color : "#374151", fontWeight: done ? 600 : 400, textDecoration: done ? "line-through" : "none" }}>{item.name}</span>
                      {item.critical && !done && <span style={{ fontSize: 9, fontWeight: 700, color: "#DC2626", background: "#FEF2F2", border: "1px solid #FECACA", padding: "1px 6px", borderRadius: 6 }}>CRITICAL</span>}
                    </div>
                    <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>Qty: {item.qty}</div>
                  </div>
                  {done && <span style={{ fontSize: 11, color: cat.color, fontWeight: 600 }}>✓ Ready</span>}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Emergency numbers */}
      <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 16, padding: "20px 24px", marginTop: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: "0 0 14px" }}>🆘 Save These Numbers — Works Without Internet</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 10 }}>
          {EMERGENCY_NUMBERS.map(n => (
            <a key={n.num} href={`tel:${n.num}`} style={{ textDecoration: "none", background: n.color + "10", border: `1px solid ${n.color}30`, borderRadius: 12, padding: "12px 10px", textAlign: "center" }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: n.color }}>{n.num}</div>
              <div style={{ fontSize: 10, color: "#6B7280", marginTop: 4 }}>{n.label}</div>
            </a>
          ))}
        </div>
        <div style={{ marginTop: 14, padding: "12px 16px", background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 10 }}>
          <p style={{ fontSize: 12, color: "#92400E", margin: 0, fontWeight: 500 }}>💡 <strong>NDMA Tip:</strong> Store your kit in a waterproof bag above ground level. Check and refresh every June 1st before monsoon season. Keep ₹2000-5000 cash in small notes as ATMs may not work during disasters.</p>
        </div>
      </div>
    </div>
  );
}
