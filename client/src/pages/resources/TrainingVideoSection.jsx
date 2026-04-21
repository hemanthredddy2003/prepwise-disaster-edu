import { useState } from "react";

// Map of disaster topic -> YouTube video data
const TOPIC_VIDEOS = {
  floods: {
    id: "dKHAMOPoSoY",
    title: "Flood Safety & Preparedness",
    description: "Watch this video to better understand floods preparedness",
    channel: "NDMA India",
  },
  earthquake: {
    id: "ICsNAAN_pAQ",
    title: "Earthquake: Drop, Cover & Hold On",
    description: "Learn the correct actions to take during an earthquake",
    channel: "Ready.gov",
  },
  cyclone: {
    id: "TZxSaJToFPk",
    title: "Cyclone Safety Guide",
    description: "Essential steps to stay safe before and during a cyclone",
    channel: "NDMA",
  },
  tsunami: {
    id: "RPJHNfGlVPc",
    title: "Tsunami Warning & Response",
    description: "What to do when a tsunami warning is issued",
    channel: "NOAA",
  },
  wildfire: {
    id: "kIXliKkcGbU",
    title: "Wildfire Evacuation & Safety",
    description: "How to protect yourself and evacuate during a wildfire",
    channel: "Cal Fire",
  },
  heatwave: {
    id: "4K5RJVEQVBY",
    title: "Surviving Extreme Heat",
    description: "Stay safe and cool during dangerous heat waves",
    channel: "Red Cross",
  },
  landslide: {
    id: "XFN9kKmvKXk",
    title: "Landslide Awareness & Safety",
    description: "Recognize warning signs and respond to landslides",
    channel: "USGS",
  },
  cpr: {
    id: "hizBvK5bLSc",
    title: "CPR Step-by-Step Guide",
    description: "Learn life-saving CPR technique from certified instructors",
    channel: "Red Cross",
  },
};

// Fallback: generic flood if topic not found
const DEFAULT_VIDEO = TOPIC_VIDEOS.floods;

export default function TrainingVideoSection({ topic = "floods" }) {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  const video = TOPIC_VIDEOS[topic?.toLowerCase()] || DEFAULT_VIDEO;
  const thumbnailUrl = `https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`;
  const youtubeUrl = `https://www.youtube.com/watch?v=${video.id}`;

  const handleClick = () => {
    setClicked(true);
    window.open(youtubeUrl, "_blank", "noopener,noreferrer");
    setTimeout(() => setClicked(false), 600);
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <h2 style={styles.title}>Training Video</h2>
        <p style={styles.subtitle}>{video.description}</p>
      </div>

      {/* Clickable video card */}
      <div
        onClick={handleClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          ...styles.card,
          ...(hovered ? styles.cardHovered : {}),
          ...(clicked ? styles.cardClicked : {}),
        }}
      >
        {/* Thumbnail */}
        <img
          src={thumbnailUrl}
          alt={video.title}
          style={styles.thumbnail}
          onError={(e) => {
            // Fallback to hqdefault if maxres not available
            e.target.src = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
          }}
        />

        {/* Dark gradient overlay */}
        <div
          style={{
            ...styles.overlay,
            opacity: hovered ? 0.5 : 0.65,
          }}
        />

        {/* Play button */}
        <div
          style={{
            ...styles.playButton,
            transform: hovered
              ? "translate(-50%, -50%) scale(1.12)"
              : "translate(-50%, -50%) scale(1)",
            boxShadow: hovered
              ? "0 0 0 6px rgba(255,0,0,0.35), 0 8px 32px rgba(0,0,0,0.6)"
              : "0 0 0 3px rgba(255,255,255,0.2), 0 4px 20px rgba(0,0,0,0.5)",
          }}
        >
          {/* YouTube logo-style play icon */}
          <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>

        {/* Bottom info bar */}
        <div style={styles.infoBar}>
          <div style={styles.infoLeft}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#FF0000" style={{ flexShrink: 0 }}>
              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z" />
            </svg>
            <span style={styles.infoTitle}>{video.title}</span>
          </div>
          <span style={styles.watchLabel}>
            {hovered ? "▶ Open on YouTube" : video.channel}
          </span>
        </div>
      </div>

      {/* After watching checklist */}
      <div style={styles.afterSection}>
        <p style={styles.afterTitle}>After watching, make sure you:</p>
        <ul style={styles.checklist}>
          {getChecklist(topic).map((item, i) => (
            <li key={i} style={styles.checkItem}>
              <span style={styles.checkIcon}>✓</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function getChecklist(topic) {
  const lists = {
    floods: [
      "Know your evacuation routes",
      "Prepare an emergency kit with 3 days of supplies",
      "Identify the highest ground near your home",
      "Sign up for local flood alerts",
    ],
    earthquake: [
      "Practice Drop, Cover, and Hold On",
      "Secure heavy furniture to walls",
      "Keep shoes near your bed",
      "Know how to shut off gas and water",
    ],
    default: [
      "Review the key safety steps",
      "Share this information with your family",
      "Update your emergency kit",
      "Know your local emergency contacts",
    ],
  };
  return lists[topic?.toLowerCase()] || lists.default;
}

const styles = {
  wrapper: {
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    color: "#e2e8f0",
    maxWidth: 900,
    margin: "0 auto",
    padding: "0 4px",
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
    color: "#f1f5f9",
    margin: "0 0 6px 0",
  },
  subtitle: {
    fontSize: 14,
    color: "#94a3b8",
    margin: 0,
  },
  card: {
    position: "relative",
    width: "100%",
    aspectRatio: "16/9",
    borderRadius: 12,
    overflow: "hidden",
    cursor: "pointer",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
    background: "#1a1f2e",
  },
  cardHovered: {
    transform: "translateY(-2px)",
    boxShadow: "0 8px 40px rgba(0,0,0,0.6)",
  },
  cardClicked: {
    transform: "scale(0.99)",
  },
  thumbnail: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    transition: "transform 0.3s ease",
  },
  overlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.85) 100%)",
    transition: "opacity 0.2s ease",
  },
  playButton: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 72,
    height: 72,
    borderRadius: "50%",
    background: "rgba(255, 0, 0, 0.9)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    paddingLeft: 4,
  },
  infoBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: "12px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  infoLeft: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    overflow: "hidden",
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: "#fff",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  watchLabel: {
    fontSize: 12,
    color: "#cbd5e1",
    whiteSpace: "nowrap",
    transition: "color 0.2s",
  },
  afterSection: {
    marginTop: 20,
    padding: "16px 20px",
    background: "rgba(255,255,255,0.04)",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.08)",
  },
  afterTitle: {
    margin: "0 0 12px 0",
    fontSize: 14,
    fontWeight: 600,
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  checklist: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  checkItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
    fontSize: 14,
    color: "#cbd5e1",
    lineHeight: 1.5,
  },
  checkIcon: {
    color: "#22c55e",
    fontWeight: 700,
    flexShrink: 0,
    marginTop: 1,
  },
};
