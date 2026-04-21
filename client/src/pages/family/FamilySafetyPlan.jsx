import { useState, useEffect } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5001/api";
const token = () => localStorage.getItem("token");

export default function FamilySafetyPlan() {
  const [tab, setTab] = useState("members");
  const [members, setMembers] = useState([]);
  const [meetingPoints, setMeetingPoints] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [memberForm, setMemberForm] = useState({ name: "", age: "", relation: "", blood_group: "", medical_notes: "", phone: "" });
  const [meetingForm, setMeetingForm] = useState({ name: "", address: "", landmark: "", notes: "" });
  const [contactForm, setContactForm] = useState({ name: "", phone: "", relation: "", priority: "1" });
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [showMeetingForm, setShowMeetingForm] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);

  useEffect(() => {
    setMembers(JSON.parse(localStorage.getItem("family_members") || "[]"));
    setMeetingPoints(JSON.parse(localStorage.getItem("meeting_points") || "[]"));
    setContacts(JSON.parse(localStorage.getItem("emergency_contacts") || "[]"));
  }, []);

  function addMember() {
    if (!memberForm.name) return;
    const updated = [...members, { ...memberForm, id: Date.now() }];
    setMembers(updated);
    localStorage.setItem("family_members", JSON.stringify(updated));
    setMemberForm({ name: "", age: "", relation: "", blood_group: "", medical_notes: "", phone: "" });
    setShowMemberForm(false);
    fetch(`${API}/family/members`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` }, body: JSON.stringify(memberForm) }).catch(() => {});
  }

  function addMeeting() {
    if (!meetingForm.name) return;
    const updated = [...meetingPoints, { ...meetingForm, id: Date.now() }];
    setMeetingPoints(updated);
    localStorage.setItem("meeting_points", JSON.stringify(updated));
    setMeetingForm({ name: "", address: "", landmark: "", notes: "" });
    setShowMeetingForm(false);
  }

  function addContact() {
    if (!contactForm.name || !contactForm.phone) return;
    const updated = [...contacts, { ...contactForm, id: Date.now() }];
    setContacts(updated);
    localStorage.setItem("emergency_contacts", JSON.stringify(updated));
    setContactForm({ name: "", phone: "", relation: "", priority: "1" });
    setShowContactForm(false);
  }

  function deleteMember(id) { const u = members.filter(m => m.id !== id); setMembers(u); localStorage.setItem("family_members", JSON.stringify(u)); }
  function deleteMeeting(id) { const u = meetingPoints.filter(m => m.id !== id); setMeetingPoints(u); localStorage.setItem("meeting_points", JSON.stringify(u)); }
  function deleteContact(id) { const u = contacts.filter(c => c.id !== id); setContacts(u); localStorage.setItem("emergency_contacts", JSON.stringify(u)); }

  const card = { background: "#fff", border: "1px solid #E5E7EB", borderRadius: 16, padding: "20px 22px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" };
  const inp = { width: "100%", padding: "9px 12px", border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 13, outline: "none", boxSizing: "border-box" };
  const lbl = { fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 };

  const completeness = Math.round(((members.length > 0 ? 33 : 0) + (meetingPoints.length > 0 ? 33 : 0) + (contacts.length > 0 ? 34 : 0)));

  return (
    <div style={{ padding: "24px 28px", maxWidth: 900, margin: "0 auto", fontFamily: "Inter, system-ui" }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: "#6B7280", letterSpacing: "0.1em", marginBottom: 4 }}>SAFETY — FAMILY PLAN</div>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111827", margin: 0 }}>👨‍👩‍👧 Family Safety Plan</h1>
        <p style={{ fontSize: 13, color: "#6B7280", margin: "4px 0 0" }}>Add members, define meeting points, and store emergency contacts</p>
      </div>

      {/* Progress */}
      <div style={{ ...card, marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>Plan Completeness</div>
            <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>{members.length} members · {meetingPoints.length} meeting points · {contacts.length} contacts</div>
          </div>
          <div style={{ fontSize: 30, fontWeight: 800, color: completeness === 100 ? "#16A34A" : completeness >= 60 ? "#D97706" : "#DC2626" }}>{completeness}%</div>
        </div>
        <div style={{ height: 8, background: "#F3F4F6", borderRadius: 4, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${completeness}%`, background: completeness === 100 ? "#16A34A" : completeness >= 60 ? "#D97706" : "#DC2626", borderRadius: 4, transition: "width 0.5s" }} />
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
          {[
            { label: "Family Members", done: members.length > 0, icon: "👥" },
            { label: "Meeting Points", done: meetingPoints.length > 0, icon: "📍" },
            { label: "Emergency Contacts", done: contacts.length > 0, icon: "📞" },
          ].map(s => (
            <div key={s.label} style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: s.done ? "#F0FDF4" : "#F9FAFB", border: `1px solid ${s.done ? "#86EFAC" : "#E5E7EB"}`, borderRadius: 10 }}>
              <span style={{ fontSize: 16 }}>{s.icon}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: s.done ? "#16A34A" : "#6B7280" }}>{s.label}</span>
              {s.done && <span style={{ marginLeft: "auto", fontSize: 14 }}>✅</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, padding: 4, marginBottom: 20, gap: 2 }}>
        {[["members","👥 Family Members"],["meeting","📍 Meeting Points"],["contacts","📞 Emergency Contacts"]].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} style={{
            flex: 1, padding: "10px", border: "none", borderRadius: 10, cursor: "pointer",
            background: tab === key ? "#2563EB" : "transparent",
            color: tab === key ? "#fff" : "#6B7280",
            fontSize: 13, fontWeight: tab === key ? 700 : 500
          }}>{label}</button>
        ))}
      </div>

      {/* MEMBERS TAB */}
      {tab === "members" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>Family Members ({members.length})</div>
            <button onClick={() => setShowMemberForm(!showMemberForm)} style={{ padding: "9px 18px", background: "#2563EB", color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", fontWeight: 700, fontSize: 13 }}>+ Add Member</button>
          </div>
          {showMemberForm && (
            <div style={{ ...card, marginBottom: 16, border: "1px solid #BFDBFE" }}>
              <h4 style={{ margin: "0 0 14px", fontSize: 14, fontWeight: 700, color: "#111827" }}>Add Family Member</h4>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                {[["Full Name *", "name"], ["Age", "age"], ["Relation", "relation"], ["Blood Group", "blood_group"], ["Phone", "phone"]].map(([label, key]) => (
                  <div key={key}>
                    <label style={lbl}>{label}</label>
                    <input value={memberForm[key]} onChange={e => setMemberForm(p => ({ ...p, [key]: e.target.value }))} style={inp} placeholder={label.replace(" *", "")} />
                  </div>
                ))}
                <div style={{ gridColumn: "1/-1" }}>
                  <label style={lbl}>Medical Notes / Conditions</label>
                  <input value={memberForm.medical_notes} onChange={e => setMemberForm(p => ({ ...p, medical_notes: e.target.value }))} style={inp} placeholder="e.g. Diabetic, needs insulin. Allergic to penicillin." />
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                <button onClick={addMember} style={{ padding: "9px 22px", background: "#2563EB", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 13 }}>Add Member</button>
                <button onClick={() => setShowMemberForm(false)} style={{ padding: "9px 16px", background: "#F9FAFB", color: "#374151", border: "1px solid #E5E7EB", borderRadius: 8, cursor: "pointer" }}>Cancel</button>
              </div>
            </div>
          )}
          {members.length === 0 ? (
            <div style={{ ...card, textAlign: "center", padding: 50 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>👨‍👩‍👧</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 8 }}>No family members added yet</div>
              <p style={{ fontSize: 13, color: "#9CA3AF", marginBottom: 16 }}>Add family members with medical info for first responders</p>
              <button onClick={() => setShowMemberForm(true)} style={{ padding: "9px 20px", background: "#2563EB", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>+ Add First Member</button>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {members.map(m => (
                <div key={m.id} style={{ ...card, position: "relative" }}>
                  <button onClick={() => deleteMember(m.id)} style={{ position: "absolute", top: 12, right: 12, background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", borderRadius: 6, cursor: "pointer", fontSize: 11, padding: "2px 8px" }}>Remove</button>
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 10 }}>
                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>👤</div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{m.name}</div>
                      <div style={{ fontSize: 12, color: "#6B7280" }}>{m.relation}{m.age ? ` · Age ${m.age}` : ""}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {m.blood_group && <span style={{ fontSize: 11, fontWeight: 700, color: "#DC2626", background: "#FEF2F2", border: "1px solid #FECACA", padding: "2px 8px", borderRadius: 8 }}>🩸 {m.blood_group}</span>}
                    {m.phone && <a href={`tel:${m.phone}`} style={{ fontSize: 11, color: "#2563EB", textDecoration: "none" }}>📞 {m.phone}</a>}
                  </div>
                  {m.medical_notes && <div style={{ marginTop: 8, fontSize: 12, color: "#92400E", background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 8, padding: "6px 10px" }}>⚕️ {m.medical_notes}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MEETING POINTS TAB */}
      {tab === "meeting" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>Meeting Points ({meetingPoints.length})</div>
            <button onClick={() => setShowMeetingForm(!showMeetingForm)} style={{ padding: "9px 18px", background: "#16A34A", color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", fontWeight: 700, fontSize: 13 }}>+ Add Point</button>
          </div>
          {showMeetingForm && (
            <div style={{ ...card, marginBottom: 16, border: "1px solid #BBF7D0" }}>
              <h4 style={{ margin: "0 0 14px", fontSize: 14, fontWeight: 700, color: "#111827" }}>Add Meeting Point</h4>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[["Location Name *", "name", "e.g. Aunt Priya's House"], ["Landmark", "landmark", "e.g. Near BMTC Bus Stop"]].map(([label, key, ph]) => (
                  <div key={key}>
                    <label style={lbl}>{label}</label>
                    <input value={meetingForm[key]} onChange={e => setMeetingForm(p => ({ ...p, [key]: e.target.value }))} style={inp} placeholder={ph} />
                  </div>
                ))}
                <div style={{ gridColumn: "1/-1" }}>
                  <label style={lbl}>Full Address *</label>
                  <input value={meetingForm.address} onChange={e => setMeetingForm(p => ({ ...p, address: e.target.value }))} style={inp} placeholder="e.g. 15, 3rd Cross, Indiranagar, Bangalore 560038" />
                </div>
                <div style={{ gridColumn: "1/-1" }}>
                  <label style={lbl}>Notes</label>
                  <input value={meetingForm.notes} onChange={e => setMeetingForm(p => ({ ...p, notes: e.target.value }))} style={inp} placeholder="e.g. Use if home unsafe. Key under mat. Primary contact: Aunt Priya." />
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                <button onClick={addMeeting} style={{ padding: "9px 22px", background: "#16A34A", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 13 }}>Add Meeting Point</button>
                <button onClick={() => setShowMeetingForm(false)} style={{ padding: "9px 16px", background: "#F9FAFB", color: "#374151", border: "1px solid #E5E7EB", borderRadius: 8, cursor: "pointer" }}>Cancel</button>
              </div>
            </div>
          )}
          {meetingPoints.length === 0 ? (
            <div style={{ ...card, textAlign: "center", padding: 50 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📍</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 8 }}>No meeting points defined</div>
              <p style={{ fontSize: 13, color: "#9CA3AF", marginBottom: 16 }}>Define where your family will meet if separated during a disaster</p>
              <button onClick={() => setShowMeetingForm(true)} style={{ padding: "9px 20px", background: "#16A34A", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>+ Add Meeting Point</button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {meetingPoints.map((m, i) => (
                <div key={m.id} style={{ ...card, position: "relative" }}>
                  <button onClick={() => deleteMeeting(m.id)} style={{ position: "absolute", top: 12, right: 12, background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", borderRadius: 6, cursor: "pointer", fontSize: 11, padding: "2px 8px" }}>Remove</button>
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: "#F0FDF4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>📍</div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: "#16A34A", background: "#F0FDF4", border: "1px solid #86EFAC", padding: "1px 8px", borderRadius: 10 }}>POINT {i + 1}</span>
                        <span style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{m.name}</span>
                      </div>
                      {m.landmark && <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 3 }}>🏳️ {m.landmark}</div>}
                      <div style={{ fontSize: 12, color: "#374151", marginBottom: m.notes ? 8 : 0 }}>📍 {m.address}</div>
                      {m.notes && <div style={{ fontSize: 12, color: "#92400E", background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 8, padding: "6px 10px" }}>💡 {m.notes}</div>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CONTACTS TAB */}
      {tab === "contacts" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>Emergency Contacts ({contacts.length})</div>
            <button onClick={() => setShowContactForm(!showContactForm)} style={{ padding: "9px 18px", background: "#DC2626", color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", fontWeight: 700, fontSize: 13 }}>+ Add Contact</button>
          </div>
          {showContactForm && (
            <div style={{ ...card, marginBottom: 16, border: "1px solid #FECACA" }}>
              <h4 style={{ margin: "0 0 14px", fontSize: 14, fontWeight: 700, color: "#111827" }}>Add Emergency Contact</h4>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                {[["Name *", "name"], ["Phone *", "phone"], ["Relation", "relation"]].map(([label, key]) => (
                  <div key={key}>
                    <label style={lbl}>{label}</label>
                    <input value={contactForm[key]} onChange={e => setContactForm(p => ({ ...p, [key]: e.target.value }))} style={inp} placeholder={label.replace(" *", "")} />
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                <button onClick={addContact} style={{ padding: "9px 22px", background: "#DC2626", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 13 }}>Add Contact</button>
                <button onClick={() => setShowContactForm(false)} style={{ padding: "9px 16px", background: "#F9FAFB", color: "#374151", border: "1px solid #E5E7EB", borderRadius: 8, cursor: "pointer" }}>Cancel</button>
              </div>
            </div>
          )}
          {/* National emergency numbers */}
          <div style={{ ...card, marginBottom: 16, background: "#FEF2F2", border: "1px solid #FECACA" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#991B1B", marginBottom: 10 }}>🚨 National Emergency Numbers (Always Available)</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
              {[["112","National Emergency"],["108","Ambulance"],["101","Fire"],["100","Police"],["1078","NDRF"],["1800-180-1717","NDMA"]].map(([num, label]) => (
                <a key={num} href={`tel:${num}`} style={{ display: "flex", gap: 10, alignItems: "center", padding: "8px 12px", background: "#fff", borderRadius: 8, border: "1px solid #FECACA", textDecoration: "none" }}>
                  <span style={{ fontSize: 14, fontWeight: 800, color: "#DC2626" }}>{num}</span>
                  <span style={{ fontSize: 11, color: "#6B7280" }}>{label}</span>
                </a>
              ))}
            </div>
          </div>
          {contacts.length === 0 ? (
            <div style={{ ...card, textAlign: "center", padding: 50 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📞</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 8 }}>No personal contacts added</div>
              <p style={{ fontSize: 13, color: "#9CA3AF", marginBottom: 16 }}>Add trusted contacts outside your immediate family</p>
              <button onClick={() => setShowContactForm(true)} style={{ padding: "9px 20px", background: "#DC2626", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>+ Add Contact</button>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {contacts.map((c, i) => (
                <div key={c.id} style={{ ...card, display: "flex", gap: 12, alignItems: "center", position: "relative" }}>
                  <button onClick={() => deleteContact(c.id)} style={{ position: "absolute", top: 10, right: 10, background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", borderRadius: 6, cursor: "pointer", fontSize: 11, padding: "2px 8px" }}>Remove</button>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>👤</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{c.name}</div>
                    <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 4 }}>{c.relation}</div>
                    <a href={`tel:${c.phone}`} style={{ fontSize: 14, fontWeight: 700, color: "#DC2626", textDecoration: "none" }}>📞 {c.phone}</a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
