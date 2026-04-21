import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";

export default function Register() {
  const [form, setForm]       = useState({ name: "", email: "", password: "", confirm: "", role: "student" });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const strength = () => {
    const p = form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  };
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];
  const strengthColor = ["", "#EF4444", "#F59E0B", "#06B6D4", "#22C55E"];
  const s = strength();

  const handleSubmit = async () => {
    setError("");
    if (!form.name || !form.email || !form.password) return setError("All fields are required.");
    if (form.password !== form.confirm) return setError("Passwords do not match.");
    if (form.password.length < 6) return setError("Password must be at least 6 characters.");
    setLoading(true);
    try {
      const res = await axios.post(import.meta.env.VITE_API_BASE_URL + "/auth/register", { name: form.name, email: form.email, password: form.password, role: form.role });
      login(res.data.data || res.data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0F172A", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", padding: "20px" }}>

      <div style={{ position: "absolute", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(168,85,247,0.1), transparent 70%)", top: "-100px", right: "-100px", pointerEvents: "none" }} />
      <div style={{ position: "absolute", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(6,182,212,0.08), transparent 70%)", bottom: "-80px", left: "-80px", pointerEvents: "none" }} />

      <style>{`
        .inp:focus { border-color: #06B6D4 !important; box-shadow: 0 0 0 3px rgba(6,182,212,0.15) !important; }
        .btn-primary:hover:not(:disabled) { background: #0891B2 !important; transform: translateY(-1px); }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
        .role-btn:hover { border-color: #06B6D4 !important; }
      `}</style>

      <div style={{ width: "100%", maxWidth: "440px", position: "relative", zIndex: 1 }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ width: "56px", height: "56px", borderRadius: "18px", background: "linear-gradient(135deg, #06B6D4, #0284C7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", margin: "0 auto 12px", boxShadow: "0 8px 32px rgba(6,182,212,0.3)" }}>🛡️</div>
          <h1 style={{ color: "#E2E8F0", fontSize: "24px", fontWeight: "900", margin: "0 0 4px" }}>Join PREPWISE</h1>
          <p style={{ color: "#475569", fontSize: "13px", margin: 0 }}>Start your disaster preparedness journey</p>
        </div>

        <div style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: "24px", padding: "28px", boxShadow: "0 24px 64px rgba(0,0,0,0.4)" }}>
          <h2 style={{ color: "#E2E8F0", fontSize: "18px", fontWeight: "900", margin: "0 0 20px" }}>Create your account</h2>

          {error && (
            <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "12px", padding: "10px 14px", marginBottom: "14px", display: "flex", gap: "8px" }}>
              <span>⚠️</span><span style={{ color: "#FCA5A5", fontSize: "13px" }}>{error}</span>
            </div>
          )}

          {/* Role selector */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", color: "#94A3B8", fontSize: "12px", fontWeight: "700", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.06em" }}>I am a</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
              {[{ v: "student", icon: "🎓", label: "Student" }, { v: "teacher", icon: "👨\u200d🏫", label: "Teacher" }, { v: "admin", icon: "🛡️", label: "Admin" }].map(r => (
                <button key={r.v} className="role-btn" onClick={() => update("role", r.v)}
                  style={{ padding: "10px 8px", borderRadius: "12px", fontSize: "12px", fontWeight: "700", cursor: "pointer", textAlign: "center", transition: "all 0.2s",
                    background: form.role === r.v ? "rgba(6,182,212,0.15)" : "#0F172A",
                    color: form.role === r.v ? "#06B6D4" : "#64748B",
                    border: "1px solid " + (form.role === r.v ? "#06B6D4" : "#334155") }}>
                  <div style={{ fontSize: "18px", marginBottom: "2px" }}>{r.icon}</div>
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div style={{ marginBottom: "14px" }}>
            <label style={{ display: "block", color: "#94A3B8", fontSize: "12px", fontWeight: "700", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Full Name</label>
            <input className="inp" type="text" value={form.name} onChange={e => update("name", e.target.value)} placeholder="Hemanth Reddy"
              style={{ width: "100%", padding: "11px 14px", borderRadius: "12px", background: "#0F172A", border: "1px solid #334155", color: "#E2E8F0", fontSize: "14px", outline: "none", boxSizing: "border-box", transition: "all 0.2s" }} />
          </div>

          {/* Email */}
          <div style={{ marginBottom: "14px" }}>
            <label style={{ display: "block", color: "#94A3B8", fontSize: "12px", fontWeight: "700", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Email Address</label>
            <input className="inp" type="email" value={form.email} onChange={e => update("email", e.target.value)} placeholder="you@example.com"
              style={{ width: "100%", padding: "11px 14px", borderRadius: "12px", background: "#0F172A", border: "1px solid #334155", color: "#E2E8F0", fontSize: "14px", outline: "none", boxSizing: "border-box", transition: "all 0.2s" }} />
          </div>

          {/* Password */}
          <div style={{ marginBottom: "14px" }}>
            <label style={{ display: "block", color: "#94A3B8", fontSize: "12px", fontWeight: "700", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Password</label>
            <div style={{ position: "relative" }}>
              <input className="inp" type={showPass ? "text" : "password"} value={form.password} onChange={e => update("password", e.target.value)} placeholder="Min. 6 characters"
                style={{ width: "100%", padding: "11px 44px 11px 14px", borderRadius: "12px", background: "#0F172A", border: "1px solid #334155", color: "#E2E8F0", fontSize: "14px", outline: "none", boxSizing: "border-box", transition: "all 0.2s" }} />
              <button onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "15px", color: "#475569" }}>
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>
            {form.password && (
              <div style={{ marginTop: "6px" }}>
                <div style={{ display: "flex", gap: "4px", marginBottom: "4px" }}>
                  {[1,2,3,4].map(i => (
                    <div key={i} style={{ flex: 1, height: "3px", borderRadius: "999px", background: i <= s ? strengthColor[s] : "#334155", transition: "background 0.3s" }} />
                  ))}
                </div>
                <span style={{ fontSize: "11px", color: strengthColor[s], fontWeight: "700" }}>{strengthLabel[s]}</span>
              </div>
            )}
          </div>

          {/* Confirm */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", color: "#94A3B8", fontSize: "12px", fontWeight: "700", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Confirm Password</label>
            <input className="inp" type="password" value={form.confirm} onChange={e => update("confirm", e.target.value)} placeholder="Re-enter password"
              style={{ width: "100%", padding: "11px 14px", borderRadius: "12px", background: "#0F172A", border: "1px solid #334155", color: form.confirm && form.confirm !== form.password ? "#EF4444" : "#E2E8F0", fontSize: "14px", outline: "none", boxSizing: "border-box", transition: "all 0.2s" }} />
            {form.confirm && form.confirm !== form.password && <div style={{ fontSize: "11px", color: "#EF4444", marginTop: "4px" }}>Passwords do not match</div>}
          </div>

          <button className="btn-primary" onClick={handleSubmit} disabled={loading || !form.name || !form.email || !form.password || form.password !== form.confirm}
            style={{ width: "100%", padding: "13px", borderRadius: "14px", fontWeight: "800", fontSize: "15px", cursor: "pointer", background: "linear-gradient(135deg, #06B6D4, #0284C7)", color: "#fff", border: "none", transition: "all 0.2s", boxShadow: "0 4px 20px rgba(6,182,212,0.3)" }}>
            {loading ? "⏳ Creating account..." : "Create Account →"}
          </button>

          <div style={{ textAlign: "center", marginTop: "16px", paddingTop: "16px", borderTop: "1px solid #334155" }}>
            <span style={{ color: "#475569", fontSize: "13px" }}>Already have an account? </span>
            <Link to="/login" style={{ color: "#06B6D4", fontWeight: "700", fontSize: "13px", textDecoration: "none" }}>Sign in →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
