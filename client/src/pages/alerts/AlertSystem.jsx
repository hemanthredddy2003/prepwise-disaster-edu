// AlertSystem.jsx — Real-time alerts with IMD/NDMA feed + auto-refresh

import { useState, useEffect, useCallback } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5001/api";
const token = () => localStorage.getItem("token");

const SEVERITY_CONFIG = {
  critical: { bg: "#FCEBEB", border: "#F09595", text: "#A32D2D", badge: "#E24B4A", label: "Critical" },
  high:     { bg: "#FFF3E0", border: "#FFCC80", text: "#854F0B", badge: "#EF9F27", label: "High" },
  medium:   { bg: "#FAEEDA", border: "#FAC775", text: "#633806", badge: "#BA7517", label: "Medium" },
  low:      { bg: "#E1F5EE", border: "#9FE1CB", text: "#085041", badge: "#1D9E75", label: "Low" },
  info:     { bg: "#E6F1FB", border: "#B5D4F4", text: "#0C447C", badge: "#378ADD", label: "Info" },
};

const TYPE_ICONS = {
  cyclone: "🌀", flood: "🌊", earthquake: "🌍", fire: "🔥",
  heatwave: "☀️", landslide: "⛰️", tsunami: "🌊", storm: "⛈️",
  drought: "🏜️", lightning: "⚡", default: "⚠️",
};

export default function AlertSystem() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchAlerts = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      // First try our backend (which should proxy IMD/NDMA)
      const res = await fetch(`${API}/alerts?limit=50`, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      if (res.ok) {
        const data = await res.json();
        // Map DB fields to component fields
        const mapped = (Array.isArray(data) ? data : data?.data?.alerts || data?.alerts || []).map((a) => ({
          id: a.id || a._id,
          title: a.title,
          description: a.message || a.description || a.ai_summary || 'No details available',
          severity: (() => {
            const l = (a.level || a.severity || 'info').toLowerCase();
            if (l === 'critical') return 'critical';
            if (l === 'warning') return 'high';
            if (l === 'info') return 'medium';
            return l;
          })(),
          type: a.type || a.disaster_type || "default",
          location: a.location || a.area || "India",
          issued_at: a.issued_at || a.created_at || a.date,
          expires_at: a.expires_at,
          source: a.source || "NDMA",
          ai_summary: a.ai_summary,
          active: a.is_active !== false && a.is_active !== 0,
        }));
        setAlerts(mapped.filter((a) => a.active));
        setLastUpdated(new Date());
      }
    } catch (err) {
      console.error("Alert fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => fetchAlerts(true), 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchAlerts]);

  function mapSeverity(level) {
    if (!level) return "info";
    const l = level.toLowerCase();
    if (l === "red" || l === "critical" || l === "extreme") return "critical";
    if (l === "orange" || l === "high" || l === "severe") return "high";
    if (l === "yellow" || l === "medium" || l === "moderate") return "medium";
    if (l === "green" || l === "low" || l === "minor") return "low";
    return "info";
  }

  function timeAgo(dateStr) {
    if (!dateStr) return "";
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  }

  const severities = ["all", "critical", "high", "medium", "low"];
  const filtered = filter === "all" ? alerts : alerts.filter((a) => a.severity === filter);
  const criticalCount = alerts.filter((a) => a.severity === "critical").length;

  return (
    <div style={{ padding: "1.5rem", maxWidth: 800, margin: "0 auto", fontFamily: "system-ui" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>
            🚨 Disaster Alerts
            {criticalCount > 0 && (
              <span style={{ fontSize: 13, background: "#E24B4A", color: "#fff", borderRadius: 20, padding: "2px 10px", marginLeft: 10, verticalAlign: "middle" }}>
                {criticalCount} critical
              </span>
            )}
          </h1>
          {lastUpdated && (
            <p style={{ fontSize: 12, color: "#888", margin: "4px 0 0" }}>
              Updated {timeAgo(lastUpdated)} · {autoRefresh ? "Auto-refreshes every 5 min" : "Auto-refresh off"}
            </p>
          )}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => setAutoRefresh((v) => !v)}
            style={{ fontSize: 12, padding: "6px 12px", borderRadius: 8, border: "1.5px solid #ddd", background: autoRefresh ? "#E6F1FB" : "#fff", color: autoRefresh ? "#185FA5" : "#666", cursor: "pointer" }}
          >
            {autoRefresh ? "⏱ Auto" : "⏱ Manual"}
          </button>
          <button
            onClick={() => fetchAlerts()}
            style={{ fontSize: 12, padding: "6px 12px", borderRadius: 8, border: "1.5px solid #ddd", background: "#fff", color: "#444", cursor: "pointer" }}
          >
            ↻ Refresh
          </button>
        </div>
      </div>

      {/* Severity filter */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {severities.map((s) => {
          const cfg = s === "all" ? { badge: "#888", label: "All" } : SEVERITY_CONFIG[s];
          const count = s === "all" ? alerts.length : alerts.filter((a) => a.severity === s).length;
          return (
            <button key={s} onClick={() => setFilter(s)} style={{
              padding: "5px 14px", borderRadius: 20, fontSize: 13, cursor: "pointer",
              border: filter === s ? `2px solid ${cfg.badge}` : "1.5px solid #e0e0e0",
              background: filter === s ? `${cfg.badge}22` : "#fff",
              color: filter === s ? cfg.badge : "#666",
              fontWeight: filter === s ? 600 : 400,
            }}>
              {cfg.label} {count > 0 && <span style={{ fontSize: 11 }}>({count})</span>}
            </button>
          );
        })}
      </div>

      {/* Alert list */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "#888" }}>Loading alerts...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem", border: "1.5px dashed #ddd", borderRadius: 12, color: "#aaa" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
          <p>No {filter !== "all" ? filter : ""} alerts at this time</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map((alert) => {
            const cfg = SEVERITY_CONFIG[alert.severity] || SEVERITY_CONFIG.info;
            const icon = TYPE_ICONS[alert.type?.toLowerCase()] || TYPE_ICONS.default;
            const isExpanded = expanded === alert.id;

            return (
              <div
                key={alert.id}
                style={{
                  background: cfg.bg, border: `1.5px solid ${cfg.border}`,
                  borderRadius: 12, padding: "14px 16px", cursor: "pointer",
                  transition: "all 0.15s",
                }}
                onClick={() => setExpanded(isExpanded ? null : alert.id)}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "flex-start", flex: 1 }}>
                    <span style={{ fontSize: 22, flexShrink: 0 }}>{icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center", marginBottom: 4 }}>
                        <span style={{ fontWeight: 700, fontSize: 15, color: cfg.text }}>{alert.title}</span>
                        <span style={{ fontSize: 11, background: cfg.badge, color: "#fff", borderRadius: 6, padding: "2px 8px", fontWeight: 600 }}>
                          {cfg.label}
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: cfg.text, opacity: 0.8 }}>
                        📍 {alert.location} · {timeAgo(alert.issued_at)} · {alert.source}
                      </div>
                    </div>
                  </div>
                  <span style={{ color: cfg.text, opacity: 0.6, fontSize: 16, marginLeft: 8 }}>{isExpanded ? "▲" : "▼"}</span>
                </div>

                {isExpanded && (
                  <div style={{ marginTop: 14, borderTop: `1px solid ${cfg.border}`, paddingTop: 14 }}>
                    <p style={{ fontSize: 14, color: cfg.text, lineHeight: 1.6, margin: "0 0 10px" }}>{alert.description}</p>

                    {alert.ai_summary && (
                      <div style={{ background: "#fff", borderRadius: 8, padding: "10px 14px", marginBottom: 10, border: `1px solid ${cfg.border}` }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: cfg.badge, marginBottom: 4 }}>🤖 AI SUMMARY</div>
                        <p style={{ fontSize: 13, color: cfg.text, margin: 0, lineHeight: 1.6 }}>{alert.ai_summary}</p>
                      </div>
                    )}

                    {alert.expires_at && (
                      <div style={{ fontSize: 12, color: cfg.text, opacity: 0.7 }}>
                        ⏰ Valid until: {new Date(alert.expires_at).toLocaleString("en-IN")}
                      </div>
                    )}

                    <a
                      href="/emergency-action"
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        display: "inline-block", marginTop: 12, padding: "7px 16px",
                        background: cfg.badge, color: "#fff", borderRadius: 8,
                        fontSize: 13, textDecoration: "none", fontWeight: 600
                      }}
                    >
                      ⚡ See what to do now
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* IMD data note */}
      <p style={{ fontSize: 11, color: "#bbb", textAlign: "center", marginTop: 20 }}>
        Alerts sourced from NDMA, IMD, and state disaster management authorities.
        For official information visit ndma.gov.in
      </p>
    </div>
  );
}
