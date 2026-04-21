import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";

export default function Login() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await axios.post(import.meta.env.VITE_API_BASE_URL + "/auth/login", { email, password });
      login(res.data.data || res.data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally { setLoading(false); }
  };

  const disasters = ["🌊","🏚️","🌀","🔥","🌡️","⛰️","🌊","💨"];

  return (
    <div style={{ minHeight: "100vh", background: "#0F172A", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>

      {/* Animated background blobs */}
      <div style={{ position: "absolute", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(6,182,212,0.12), transparent 70%)", top: "-100px", left: "-100px", pointerEvents: "none" }} />
      <div style={{ position: "absolute", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(168,85,247,0.1), transparent 70%)", bottom: "-80px", right: "-80px", pointerEvents: "none" }} />

      {/* Floating disaster icons */}
      {disasters.map((d, i) => (
        <div key={i} style={{
          position: "absolute", fontSize: i % 2 === 0 ? "28px" : "20px", opacity: 0.08,
          left: (10 + i * 12) + "%", top: (15 + (i % 3) * 25) + "%",
          animation: "float" + (i % 3) + " " + (4 + i * 0.5) + "s ease-in-out infinite",
          pointerEvents: "none"
        }}>{d}</div>
      ))}

      <style>{`
        @keyframes float0 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }
        @keyframes float1 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes float2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-22px)} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .inp:focus { border-color: #06B6D4 !important; box-shadow: 0 0 0 3px rgba(6,182,212,0.15) !important; }
        .btn-primary:hover { background: #0891B2 !important; transform: translateY(-1px); }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
      `}</style>

      <div style={{ width: "100%", maxWidth: "420px", padding: "0 20px", position: "relative", zIndex: 1 }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "20px", background: "linear-gradient(135deg, #06B6D4, #0284C7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", margin: "0 auto 16px", boxShadow: "0 8px 32px rgba(6,182,212,0.3)" }}>
            🛡️
          </div>
          <h1 style={{ color: "#E2E8F0", fontSize: "28px", fontWeight: "900", margin: "0 0 4px" }}>PREPWISE</h1>
          <p style={{ color: "#475569", fontSize: "13px", margin: 0 }}>Disaster Preparedness Education System</p>
        </div>

        {/* Card */}
        <div style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: "24px", padding: "32px", boxShadow: "0 24px 64px rgba(0,0,0,0.4)" }}>
          <h2 style={{ color: "#E2E8F0", fontSize: "20px", fontWeight: "900", margin: "0 0 6px" }}>Welcome back</h2>
          <p style={{ color: "#475569", fontSize: "13px", margin: "0 0 24px" }}>Sign in to your account to continue</p>

          {error && (
            <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "12px", padding: "12px 14px", marginBottom: "16px", display: "flex", gap: "8px", alignItems: "center" }}>
              <span>⚠️</span>
              <span style={{ color: "#FCA5A5", fontSize: "13px" }}>{error}</span>
            </div>
          )}

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", color: "#94A3B8", fontSize: "12px", fontWeight: "700", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Email Address</label>
            <input className="inp" type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{ width: "100%", padding: "12px 14px", borderRadius: "12px", background: "#0F172A", border: "1px solid #334155", color: "#E2E8F0", fontSize: "14px", outline: "none", boxSizing: "border-box", transition: "all 0.2s" }} />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", color: "#94A3B8", fontSize: "12px", fontWeight: "700", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Password</label>
            <div style={{ position: "relative" }}>
              <input className="inp" type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                onKeyDown={e => e.key === "Enter" && handleSubmit(e)}
                style={{ width: "100%", padding: "12px 44px 12px 14px", borderRadius: "12px", background: "#0F172A", border: "1px solid #334155", color: "#E2E8F0", fontSize: "14px", outline: "none", boxSizing: "border-box", transition: "all 0.2s" }} />
              <button onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "16px", color: "#475569" }}>
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <button className="btn-primary" onClick={handleSubmit} disabled={loading || !email || !password}
            style={{ width: "100%", padding: "13px", borderRadius: "14px", fontWeight: "800", fontSize: "15px", cursor: "pointer", background: "linear-gradient(135deg, #06B6D4, #0284C7)", color: "#fff", border: "none", transition: "all 0.2s", boxShadow: "0 4px 20px rgba(6,182,212,0.3)" }}>
            {loading ? "⏳ Signing in..." : "Sign In →"}
          </button>

          <div style={{ textAlign: "center", marginTop: "20px", paddingTop: "20px", borderTop: "1px solid #334155" }}>
            <span style={{ color: "#475569", fontSize: "13px" }}>Don{"\u2019"}t have an account? </span>
            <Link to="/register" style={{ color: "#06B6D4", fontWeight: "700", fontSize: "13px", textDecoration: "none" }}>Create account →</Link>
          </div>
        </div>

        {/* Demo credentials */}
        <div style={{ marginTop: "16px", background: "rgba(6,182,212,0.05)", border: "1px solid rgba(6,182,212,0.15)", borderRadius: "14px", padding: "12px 16px" }}>
          <div style={{ fontSize: "11px", fontWeight: "800", color: "#06B6D4", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>🔑 Demo Credentials</div>
          <div style={{ display: "flex", gap: "20px" }}>
            <div>
              <span style={{ fontSize: "11px", color: "#475569" }}>Email: </span>
              <span style={{ fontSize: "11px", color: "#94A3B8", fontFamily: "monospace" }}>hemanth@test.com</span>
            </div>
            <div>
              <span style={{ fontSize: "11px", color: "#475569" }}>Pass: </span>
              <span style={{ fontSize: "11px", color: "#94A3B8", fontFamily: "monospace" }}>Test@123</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
