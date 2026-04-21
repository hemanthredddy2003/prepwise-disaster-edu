import { useState, useEffect } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5001/api";
const token = () => localStorage.getItem("token");

const TYPE_CONFIG = {
  flood:      { icon: "🌊", color: "#2563EB", bg: "#EFF6FF", label: "Flood Shelter" },
  cyclone:    { icon: "🌀", color: "#7C3AED", bg: "#F5F3FF", label: "Cyclone Shelter" },
  earthquake: { icon: "🏚️", color: "#DC2626", bg: "#FEF2F2", label: "Earthquake Camp" },
  fire:       { icon: "🔥", color: "#EA580C", bg: "#FFF7ED", label: "Fire Shelter" },
  general:    { icon: "🏕️", color: "#16A34A", bg: "#F0FDF4", label: "General Shelter" },
  default:    { icon: "🏠", color: "#6B7280", bg: "#F9FAFB", label: "Emergency Shelter" },
};

function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

export default function ShelterLocator() {
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [userLoc, setUserLoc] = useState(null);
  const [locLoading, setLocLoading] = useState(false);
  const [locError, setLocError] = useState("");

  useEffect(() => {
    fetch(`${API}/shelters`, { headers: { Authorization: `Bearer ${token()}` } })
      .then(r => r.json())
      .then(d => setShelters(d?.data?.shelters || d?.shelters || []))
      .catch(() => setShelters([]))
      .finally(() => setLoading(false));
  }, []);

  function handleNearMe() {
    if (!navigator.geolocation) { setLocError("Geolocation not supported."); return; }
    setLocLoading(true); setLocError("");
    navigator.geolocation.getCurrentPosition(
      pos => { setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setLocLoading(false); },
      () => { setLocError("Could not get location. Please allow access."); setLocLoading(false); }
    );
  }

  const getCfg = t => TYPE_CONFIG[(t||"").toLowerCase()] || TYPE_CONFIG.default;
  const filters = ["all", ...new Set(shelters.map(s => s.type).filter(Boolean))];
  const totalCapacity = shelters.reduce((sum, s) => sum + (s.capacity || 0), 0);

  const filtered = shelters
    .map(s => ({ ...s, distance: (userLoc && s.latitude && s.longitude) ? getDistanceKm(userLoc.lat, userLoc.lng, s.latitude, s.longitude) : null }))
    .filter(s => {
      const matchFilter = filter === "all" || s.type === filter;
      const matchSearch = !search || s.name?.toLowerCase().includes(search.toLowerCase()) || s.address?.toLowerCase().includes(search.toLowerCase()) || s.city?.toLowerCase().includes(search.toLowerCase());
      return matchFilter && matchSearch;
    })
    .sort((a, b) => userLoc ? (a.distance||999) - (b.distance||999) : 0);

  return (
    <div style={{ padding: "24px 28px", maxWidth: 1100, margin: "0 auto", fontFamily: "'Inter', system-ui" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 11, color: "#6B7280", letterSpacing: "0.1em", marginBottom: 4 }}>SAFETY — LOCATIONS</div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111827", margin: 0 }}>🏠 Shelter Locator</h1>
          <p style={{ fontSize: 13, color: "#6B7280", margin: "4px 0 0" }}>{shelters.length} shelters · {totalCapacity.toLocaleString()} total capacity across India</p>
        </div>
        <button onClick={handleNearMe} disabled={locLoading} style={{
          padding: "11px 22px", borderRadius: 12, border: "none", cursor: "pointer",
          background: userLoc ? "#16A34A" : "linear-gradient(135deg,#2563EB,#1D4ED8)",
          color: "#fff", fontSize: 13, fontWeight: 700
        }}>
          {locLoading ? "⟳ Detecting..." : userLoc ? "✅ Location Active" : "📍 Near Me"}
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { icon: "🏠", value: shelters.length, label: "Total Shelters", color: "#2563EB" },
          { icon: "👥", value: totalCapacity.toLocaleString(), label: "Total Capacity", color: "#16A34A" },
          { icon: "✅", value: shelters.filter(s => s.is_active).length, label: "Active Now", color: "#059669" },
          { icon: "🗺️", value: new Set(shelters.map(s => s.state).filter(Boolean)).size || "12", label: "States Covered", color: "#7C3AED" },
        ].map(s => (
          <div key={s.label} style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, padding: "16px 18px", borderTop: `3px solid ${s.color}`, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {userLoc && (
        <div style={{ background: "#F0FDF4", border: "1px solid #86EFAC", borderRadius: 12, padding: "12px 18px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
          <span>📍</span>
          <span style={{ fontSize: 13, color: "#065F46", fontWeight: 600 }}>Showing {filtered.length} shelters sorted by distance from your location</span>
          <button onClick={() => setUserLoc(null)} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "#6B7280", fontSize: 12 }}>✕ Clear</button>
        </div>
      )}
      {locError && <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: 10, padding: "10px 16px", marginBottom: 16, fontSize: 13, color: "#DC2626" }}>{locError}</div>}

      <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, padding: "16px 18px", marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 10, padding: "9px 14px" }}>
            <span style={{ color: "#9CA3AF" }}>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, city or address..."
              style={{ border: "none", background: "transparent", outline: "none", fontSize: 13, color: "#374151", width: "100%" }} />
            {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF" }}>✕</button>}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {filters.map(f => {
            const cfg = f === "all" ? { color: "#2563EB" } : getCfg(f);
            return (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: "6px 14px", borderRadius: 20, border: `1px solid ${filter === f ? cfg.color : "#E5E7EB"}`,
                background: filter === f ? cfg.color : "#fff", color: filter === f ? "#fff" : "#6B7280",
                fontSize: 12, fontWeight: filter === f ? 700 : 500, cursor: "pointer", textTransform: "capitalize"
              }}>
                {f === "all" ? "🏠 All" : `${getCfg(f).icon} ${f}`}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 14 }}>{filtered.length} shelters found</div>

      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
          {[1,2,3,4,5,6].map(i => <div key={i} style={{ height: 200, background: "#F9FAFB", borderRadius: 14, border: "1px solid #E5E7EB" }} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, background: "#fff", borderRadius: 16, border: "1px solid #E5E7EB" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🏠</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>No shelters found</div>
          <button onClick={() => { setSearch(""); setFilter("all"); }} style={{ marginTop: 16, padding: "9px 20px", background: "#2563EB", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>Clear filters</button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
          {filtered.map((s, i) => {
            const cfg = getCfg(s.type);
            return (
              <div key={s.id||i} style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", transition: "transform 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-3px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
                {userLoc && i === 0 && <div style={{ background: "#16A34A", color: "#fff", fontSize: 10, fontWeight: 700, padding: "4px 0", textAlign: "center" }}>📍 NEAREST TO YOU</div>}
                <div style={{ height: 4, background: cfg.color }} />
                <div style={{ padding: "16px 18px" }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 12 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 12, background: cfg.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{cfg.icon}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 9, fontWeight: 700, color: cfg.color, letterSpacing: "0.08em", marginBottom: 2 }}>{cfg.label.toUpperCase()}</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", lineHeight: 1.3 }}>{s.name}</div>
                    </div>
                  </div>
                  {s.address && <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 6, display: "flex", gap: 5 }}><span>📍</span><span>{s.address}</span></div>}
                  {s.city && <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 8 }}>📌 {s.city}{s.state ? `, ${s.state}` : ""}</div>}
                  {s.distance !== null && s.distance !== undefined && (
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#2563EB", background: "#EFF6FF", padding: "4px 10px", borderRadius: 8, display: "inline-block", marginBottom: 8 }}>
                      🗺️ {s.distance < 1 ? (s.distance*1000).toFixed(0)+"m" : s.distance.toFixed(1)+"km"} away
                    </div>
                  )}
                  {s.capacity > 0 && (
                    <div style={{ marginBottom: 10 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}>
                        <span style={{ color: "#6B7280" }}>Capacity</span>
                        <span style={{ fontWeight: 700, color: "#16A34A" }}>{s.capacity.toLocaleString()} people</span>
                      </div>
                      <div style={{ height: 4, background: "#F3F4F6", borderRadius: 2 }}>
                        <div style={{ height: "100%", width: "30%", background: "#16A34A", borderRadius: 2 }} />
                      </div>
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    {s.contact ? (
                      <a href={`tel:${s.contact}`} style={{ fontSize: 12, color: "#2563EB", textDecoration: "none" }}>📞 {s.contact}</a>
                    ) : <span />}
                    <span style={{ fontSize: 10, fontWeight: 700, color: "#16A34A", background: "#F0FDF4", border: "1px solid #86EFAC", padding: "2px 8px", borderRadius: 8 }}>✓ ACTIVE</span>
                  </div>
                  {s.latitude && s.longitude && (
                    <a href={`https://maps.google.com/?q=${s.latitude},${s.longitude}`} target="_blank" rel="noreferrer"
                      style={{ display: "block", padding: "8px", background: "#2563EB", color: "#fff", borderRadius: 8, textAlign: "center", fontSize: 12, textDecoration: "none", fontWeight: 600 }}>
                      🗺️ Get Directions →
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
