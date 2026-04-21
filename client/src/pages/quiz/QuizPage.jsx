import { useState, useEffect } from "react";

const QUESTION_BANK = {
  flood: [
    { q: "What should you do FIRST when a flood warning is issued?", options: ["Wait and watch the water level", "Move immediately to higher ground", "Collect all your belongings first", "Call your friends and relatives"], answer: 1, explanation: "Moving to higher ground immediately is the top priority. Every minute counts during a flood — belongings can be replaced but lives cannot." },
    { q: "Floodwater as shallow as how much can knock a person down?", options: ["30 cm", "50 cm", "15 cm", "1 meter"], answer: 2, explanation: "Just 15cm of fast-moving floodwater can knock an adult off their feet. Never underestimate floodwater depth or speed." },
    { q: "What is the NDRF emergency helpline number in India?", options: ["108", "011-24363260", "1078", "101"], answer: 1, explanation: "NDRF (National Disaster Response Force) helpline is 011-24363260. The general emergency number 112 also connects you to disaster response." },
    { q: "Why should you NOT drink tap water after a flood?", options: ["It tastes bad", "Floodwater contaminates the supply with sewage", "Water pressure is low", "Government orders restrict it"], answer: 1, explanation: "Floodwater carries sewage, chemicals and pathogens that contaminate the entire water supply system. Always boil water after floods." },
    { q: "If you are trapped in a vehicle during a flood, what should you do?", options: ["Stay inside and call for help", "Get out and move to higher ground immediately", "Roll up windows and wait", "Drive faster through the water"], answer: 1, explanation: "A vehicle can be swept away in as little as 60cm of water. Exit immediately and move to higher ground — the vehicle can be replaced." },
  ],
  earthquake: [
    { q: "What is the correct action during an earthquake — Drop, Cover and...?", options: ["Run", "Hold On", "Pray", "Scream"], answer: 1, explanation: "Drop Cover and Hold On is the internationally proven technique. Drop to hands and knees, take cover under a sturdy table, and hold on until shaking stops." },
    { q: "Where is the SAFEST place to be during an earthquake indoors?", options: ["In a doorway", "Near a window", "Under a sturdy table away from windows", "On the roof"], answer: 2, explanation: "The old doorway advice is outdated. The safest spot is under a sturdy table away from windows, glass and exterior walls." },
    { q: "What percentage of India's land area is vulnerable to earthquakes?", options: ["25%", "40%", "59%", "75%"], answer: 2, explanation: "About 59% of India's land area is in earthquake-prone zones, making it one of the most seismically active countries in the world." },
    { q: "After an earthquake, why should you NOT use elevators?", options: ["They use too much electricity", "They may be structurally damaged and can fail", "They are too slow", "Government rules prohibit it"], answer: 1, explanation: "Elevators may be structurally damaged after a quake and can fail mid-journey trapping you inside. Always use stairs after an earthquake." },
    { q: "The 2001 earthquake that devastated Gujarat was centered in which district?", options: ["Surat", "Vadodara", "Bhuj (Kutch)", "Rajkot"], answer: 2, explanation: "The 2001 Gujarat earthquake was centered in Bhuj, Kutch district. It measured 7.7 magnitude and killed over 20,000 people." },
  ],
  cyclone: [
    { q: "How many hours of advance notice does India's cyclone early warning system provide?", options: ["12 hours", "24 hours", "48 hours", "72 hours"], answer: 3, explanation: "India's IMD cyclone early warning system now provides up to 72 hours of advance notice, significantly reducing casualties in recent cyclones." },
    { q: "During a cyclone, what is a 'storm surge'?", options: ["A sudden increase in wind speed", "A rise in sea level caused by cyclone winds pushing water ashore", "Heavy rainfall during cyclone", "Lightning storm during cyclone"], answer: 1, explanation: "Storm surge is the abnormal rise of seawater caused by a cyclone pushing water toward shore. It causes more deaths than cyclone winds." },
    { q: "If you are outdoors and cannot reach shelter during a cyclone, what should you do?", options: ["Stand under a large tree", "Lie flat on the ground in a low area", "Run toward the nearest building", "Stand near a power line for support"], answer: 1, explanation: "If caught outside, lie flat on the ground in a ditch or low-lying area away from trees and power lines to reduce wind exposure." },
    { q: "Which sea generates most cyclones that hit India?", options: ["Arabian Sea", "Bay of Bengal", "Indian Ocean", "Red Sea"], answer: 1, explanation: "The Bay of Bengal generates about 6 cyclones per year and is responsible for most cyclones that hit India's east coast including Odisha, AP and Tamil Nadu." },
    { q: "Why is it DANGEROUS to go outside when the 'eye' of a cyclone passes over?", options: ["It is too dark", "Winds will return suddenly with full force", "Heavy rain continues", "Ground is too wet"], answer: 1, explanation: "The eye of a cyclone is deceptively calm. After the eye passes, the eyewall with the most violent winds arrives from the opposite direction suddenly." },
  ],
  tsunami: [
    { q: "What is the most important natural warning sign of an approaching tsunami?", options: ["Dark clouds forming over sea", "The sea suddenly pulling back from the shore", "Strong winds from the ocean", "Fish jumping out of water"], answer: 1, explanation: "When the sea suddenly recedes exposing the ocean floor, RUN immediately — this is nature's warning that a massive wave is coming within minutes." },
    { q: "At what speed can a tsunami travel in the open ocean?", options: ["100 km/h", "300 km/h", "800 km/h", "50 km/h"], answer: 2, explanation: "Tsunamis travel at up to 800 km/h in deep ocean — as fast as a jet aircraft. When they reach shallow water they slow down but grow dramatically in height." },
    { q: "How high above sea level should you move to be safe from a tsunami?", options: ["5 meters", "10 meters", "30 meters", "15 meters"], answer: 2, explanation: "You should move to at least 30 meters above sea level or 3 km inland. The 2004 tsunami waves reached 30 meters in some areas of India and Indonesia." },
    { q: "How many people did the 2004 Indian Ocean Tsunami kill across all countries?", options: ["50,000", "1,00,000", "2,30,000", "10,000"], answer: 2, explanation: "The 2004 Indian Ocean Tsunami killed approximately 2,30,000 people across 14 countries making it one of the deadliest natural disasters in recorded history." },
    { q: "Which Indian organization operates the 24x7 Tsunami Early Warning Centre?", options: ["NDRF", "INCOIS (Indian National Centre for Ocean Information Services)", "IMD", "ISRO"], answer: 1, explanation: "INCOIS in Hyderabad operates India's 24x7 Tsunami Early Warning Centre since 2007, monitoring seismic activity and sea levels across the Indian Ocean." },
  ],
  forest_fire: [
    { q: "What percentage of forest fires in India are caused by human activities?", options: ["50%", "70%", "90%", "30%"], answer: 2, explanation: "Over 90% of forest fires in India are human-caused through activities like agricultural burning, campfires, discarded cigarettes and deliberate burning." },
    { q: "Which months are peak forest fire season in India?", options: ["November to January", "March to June", "July to September", "October to December"], answer: 1, explanation: "March to June is peak forest fire season in India when vegetation is dry after winter and before monsoon rains. Temperatures are also at their highest." },
    { q: "If you are trapped by a forest fire and cannot escape, where should you go?", options: ["Climb the tallest tree", "Run through the fire", "Lie face down in a ditch or depression and cover with soil", "Stand in a river"], answer: 2, explanation: "Lie face down in a ditch, depression or cleared area. Cover yourself with soil. Fire travels over low depressions and the soil provides insulation." },
    { q: "What number should you call to report a forest fire in India?", options: ["100", "101", "108", "112"], answer: 1, explanation: "101 is the Fire Service number in India. You can also call 112 (general emergency) or the Forest Department helpline 1800-180-3344." },
    { q: "What should you use to protect yourself from smoke during a forest fire?", options: ["A dry cloth over nose", "A wet cloth over nose and mouth", "Nothing — just run fast", "Sun glasses"], answer: 1, explanation: "A wet cloth over nose and mouth filters smoke particles. N95 masks are even better. Breathe low where smoke concentration is less." },
  ],
  heatwave: [
    { q: "At what temperature is a heatwave officially declared in India?", options: ["40 degrees C", "42 degrees C", "45 degrees C or 4.5 above normal", "50 degrees C"], answer: 2, explanation: "IMD declares a heatwave when temperature reaches 45 degrees C or is 4.5 degrees above the normal temperature for that area and season." },
    { q: "What are the first signs of heat stroke?", options: ["Sweating heavily and feeling cold", "Hot dry skin, confusion, no sweating", "Mild headache and tiredness", "Stomach pain and vomiting"], answer: 1, explanation: "Heat stroke signs include hot DRY skin (sweating stops), confusion, rapid pulse and high body temperature. It is a medical emergency — call 108 immediately." },
    { q: "What should you drink during a heatwave to replace lost electrolytes?", options: ["Cold soft drinks", "ORS (Oral Rehydration Salts) solution", "Fruit juice with sugar", "Cold coffee or tea"], answer: 1, explanation: "ORS replaces sodium, potassium and other electrolytes lost through sweating. Soft drinks, tea and coffee actually increase dehydration." },
    { q: "During which hours should you avoid outdoor work during a heatwave?", options: ["6 AM to 9 AM", "11 AM to 4 PM", "4 PM to 7 PM", "8 PM to 10 PM"], answer: 1, explanation: "11 AM to 4 PM is the peak heat period when sun is directly overhead. Outdoor work during these hours during a heatwave is extremely dangerous." },
    { q: "Which Indian state recorded the highest ever temperature of 51 degrees C?", options: ["Bihar", "Rajasthan (Phalodi)", "Telangana", "UP"], answer: 1, explanation: "Phalodi in Rajasthan recorded 51 degrees C on May 19, 2016 — the highest temperature ever recorded in India. Rajasthan, UP and Bihar are most heatwave-prone." },
  ],
  landslide: [
    { q: "What percentage of global landslide fatalities occur in India?", options: ["10%", "20%", "30%", "50%"], answer: 2, explanation: "India accounts for approximately 30% of global landslide fatalities making it one of the most landslide-prone countries in the world." },
    { q: "Which season sees the most landslides in India?", options: ["Winter (Dec-Feb)", "Summer (Mar-May)", "Monsoon (Jul-Sep)", "Post-monsoon (Oct-Nov)"], answer: 2, explanation: "July to September monsoon season sees the most landslides as heavy rainfall saturates soil and destabilizes slopes. The Himalayas and Western Ghats are most affected." },
    { q: "If a landslide is coming toward you, which direction should you run?", options: ["Straight ahead away from it", "Sideways — perpendicular to the slide path", "Back up the hill", "Downhill as fast as possible"], answer: 1, explanation: "Move sideways — perpendicular to the slide path. A landslide moves in one direction so moving to the side gets you out of its path quickly." },
    { q: "Which early warning sign indicates a landslide may be coming?", options: ["Birds flying away from the area", "New cracks appearing in walls or ground", "Sudden increase in temperature", "Unusual animal behavior"], answer: 1, explanation: "New cracks in walls, bulging ground, tilting trees and small rockfalls are all warning signs that a larger landslide may be imminent. Evacuate immediately." },
    { q: "The 2013 Kedarnath disaster that killed 5000+ people was caused by?", options: ["Earthquake only", "Flood only", "Combination of cloudburst, flood and landslides", "Cyclone"], answer: 2, explanation: "The 2013 Kedarnath disaster was caused by a devastating combination of cloudburst, flash floods and multiple landslides that buried the entire valley." },
  ],
  first_aid: [
    { q: "In CPR, what is the correct ratio of chest compressions to rescue breaths?", options: ["15:2", "30:2", "20:1", "10:2"], answer: 1, explanation: "The correct CPR ratio is 30 chest compressions followed by 2 rescue breaths. Push hard and fast — at least 5cm deep at 100-120 compressions per minute." },
    { q: "How long should you cool a burn under running water?", options: ["2 minutes", "5 minutes", "10 minutes", "20 minutes"], answer: 2, explanation: "Cool a burn under cool (not cold) running water for a full 10 minutes. Never use ice, butter or toothpaste — these cause more damage." },
    { q: "What is the emergency ambulance number in India?", options: ["100", "101", "108", "112"], answer: 2, explanation: "108 is the emergency ambulance number in India. 112 is the general emergency number that can connect you to ambulance, fire and police services." },
    { q: "What should you do if someone has a suspected spinal injury?", options: ["Move them to a comfortable position", "Do NOT move them — keep still and call 108", "Give them water to drink", "Massage the affected area"], answer: 1, explanation: "Never move someone with a suspected spinal injury — movement can cause permanent paralysis. Keep them still, reassure them and call 108 immediately." },
    { q: "Within how many minutes does brain damage begin without blood circulation?", options: ["10-15 minutes", "4-6 minutes", "20 minutes", "1-2 minutes"], answer: 1, explanation: "Brain damage begins within 4-6 minutes without blood circulation. This is why starting CPR immediately is critical — every second matters in cardiac arrest." },
  ],
};

const TOPICS = [
  { id: "flood",       title: "Floods",        icon: "🌊", color: "#06B6D4", bg: "rgba(6,182,212,0.12)",   border: "rgba(6,182,212,0.4)"   },
  { id: "earthquake",  title: "Earthquakes",   icon: "🏚️", color: "#F59E0B", bg: "rgba(245,158,11,0.12)",  border: "rgba(245,158,11,0.4)"  },
  { id: "cyclone",     title: "Cyclones",      icon: "🌀", color: "#A855F7", bg: "rgba(168,85,247,0.12)",  border: "rgba(168,85,247,0.4)"  },
  { id: "tsunami",     title: "Tsunamis",      icon: "🌊", color: "#3B82F6", bg: "rgba(59,130,246,0.12)",  border: "rgba(59,130,246,0.4)"  },
  { id: "forest_fire", title: "Forest Fires",  icon: "🔥", color: "#EF4444", bg: "rgba(239,68,68,0.12)",   border: "rgba(239,68,68,0.4)"   },
  { id: "heatwave",    title: "Heatwave",      icon: "🌡️", color: "#F97316", bg: "rgba(249,115,22,0.12)",  border: "rgba(249,115,22,0.4)"  },
  { id: "landslide",   title: "Landslides",    icon: "⛰️", color: "#84CC16", bg: "rgba(132,204,22,0.12)",  border: "rgba(132,204,22,0.4)"  },
  { id: "first_aid",   title: "First Aid",     icon: "🏥", color: "#EC4899", bg: "rgba(236,72,153,0.12)",  border: "rgba(236,72,153,0.4)"  },
];

const GRADE = (pct) => {
  if (pct >= 90) return { g: "A+", label: "Outstanding!", color: "#22C55E", emoji: "🏆" };
  if (pct >= 75) return { g: "A",  label: "Excellent!",   color: "#06B6D4", emoji: "🥇" };
  if (pct >= 60) return { g: "B",  label: "Good Job!",    color: "#F59E0B", emoji: "🥈" };
  if (pct >= 45) return { g: "C",  label: "Keep Learning",color: "#F97316", emoji: "🥉" };
  return               { g: "F",  label: "Study More!",  color: "#EF4444", emoji: "📚" };
};

function Quiz({ topic, questions, onBack }) {
  const [current, setCurrent]   = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers]   = useState([]);
  const [showExp, setShowExp]   = useState(false);
  const [done, setDone]         = useState(false);
  const [aiQ, setAiQ]           = useState(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const q = current < questions.length ? questions[current] : aiQ;
  const isAiRound = current >= questions.length;
  const total = questions.length + (aiQ ? 1 : 0);

  const fetchAiQuestion = async () => {
    setLoadingAi(true);
    try {
      const res = await fetch("http://localhost:5001/api/quiz/ai-question", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + localStorage.getItem("token") },
        body: JSON.stringify({ topic: topic.title }),
      });
      const data = await res.json();
      if (data.question) setAiQ(data.question);
      else setDone(true);
    } catch { setDone(true); }
    setLoadingAi(false);
  };

  const handleSelect = (idx) => {
    if (selected !== null) return;
    setSelected(idx);
    setShowExp(true);
  };

  const handleNext = () => {
    const newAnswers = [...answers, { q: q.q, selected, correct: q.answer, isAi: isAiRound }];
    setAnswers(newAnswers);
    setSelected(null);
    setShowExp(false);

    if (!isAiRound && current === questions.length - 1) {
      fetchAiQuestion();
      setCurrent(c => c + 1);
    } else {
      setDone(true);
    }
  };

  // Results screen
  if (done) {
    const score = answers.filter(a => a.selected === a.correct).length;
    const pct   = Math.round(score / answers.length * 100);
    const grade = GRADE(pct);
    return (
      <div style={{ maxWidth: "700px", margin: "0 auto", padding: "20px" }}>
        {/* Grade card */}
        <div style={{ background: "#1E293B", border: "2px solid " + grade.color + "60", borderRadius: "28px", padding: "40px", textAlign: "center", marginBottom: "20px" }}>
          <div style={{ fontSize: "72px", marginBottom: "8px" }}>{grade.emoji}</div>
          <div style={{ fontSize: "80px", fontWeight: "900", color: grade.color, lineHeight: 1 }}>{grade.g}</div>
          <div style={{ fontSize: "22px", fontWeight: "700", color: "#E2E8F0", margin: "8px 0 4px" }}>{grade.label}</div>
          <div style={{ fontSize: "15px", color: "#64748B", marginBottom: "24px" }}>You scored {score} out of {answers.length} ({pct}%)</div>
          <div style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
            {[["Score", score + "/" + answers.length, "#06B6D4"], ["Percentage", pct + "%", grade.color], ["Topic", topic.title, topic.color]].map(([label, val, c]) => (
              <div key={label} style={{ background: "#0F172A", borderRadius: "16px", padding: "16px 24px", minWidth: "100px" }}>
                <div style={{ fontSize: "22px", fontWeight: "900", color: c }}>{val}</div>
                <div style={{ fontSize: "11px", color: "#64748B" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Review answers */}
        <div style={{ background: "#1E293B", borderRadius: "24px", padding: "24px", marginBottom: "16px" }}>
          <h3 style={{ color: "#E2E8F0", fontWeight: "900", marginBottom: "16px", fontSize: "16px" }}>Answer Review</h3>
          {answers.map((a, i) => (
            <div key={i} style={{ padding: "12px 16px", borderRadius: "14px", marginBottom: "8px", display: "flex", gap: "12px", alignItems: "flex-start",
              background: a.selected === a.correct ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)",
              border: "1px solid " + (a.selected === a.correct ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)") }}>
              <span style={{ fontSize: "18px", flexShrink: 0, marginTop: "2px" }}>{a.selected === a.correct ? "✅" : "❌"}</span>
              <div>
                <div style={{ color: "#E2E8F0", fontSize: "13px", fontWeight: "600", marginBottom: "2px" }}>{a.isAi && "🤖 AI Bonus: "}{a.q}</div>
                {a.selected !== a.correct && (
                  <div style={{ color: "#EF4444", fontSize: "12px" }}>Your answer was wrong — correct answer was option {a.correct + 1}</div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={onBack} style={{ flex: 1, padding: "14px", borderRadius: "16px", fontWeight: "800", fontSize: "14px", background: "#1E293B", color: "#94A3B8", border: "1px solid #334155", cursor: "pointer" }}>
            ← Back to Quizzes
          </button>
          <button onClick={() => { setCurrent(0); setSelected(null); setAnswers([]); setShowExp(false); setDone(false); setAiQ(null); }}
            style={{ flex: 1, padding: "14px", borderRadius: "16px", fontWeight: "800", fontSize: "14px", background: topic.color, color: "#fff", border: "none", cursor: "pointer" }}>
            🔄 Retry Quiz
          </button>
        </div>
      </div>
    );
  }

  // AI loading
  if (loadingAi || (isAiRound && !aiQ)) {
    return (
      <div style={{ maxWidth: "700px", margin: "80px auto", textAlign: "center" }}>
        <div style={{ fontSize: "56px", marginBottom: "16px" }}>🤖</div>
        <div style={{ color: "#E2E8F0", fontSize: "20px", fontWeight: "800", marginBottom: "8px" }}>Generating AI Bonus Question...</div>
        <div style={{ color: "#64748B", fontSize: "14px" }}>Groq AI is crafting a unique question just for you</div>
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "24px" }}>
          {[0,1,2].map(i => (
            <div key={i} style={{ width: "10px", height: "10px", borderRadius: "50%", background: topic.color, animation: "bounce 1s infinite", animationDelay: i * 0.2 + "s" }} />
          ))}
        </div>
        <style>{`@keyframes bounce { 0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)} }`}</style>
      </div>
    );
  }

  if (!q) return null;

  const progress = ((current + (showExp ? 1 : 0)) / (questions.length + 1)) * 100;

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "28px" }}>{topic.icon}</span>
          <div>
            <div style={{ color: "#E2E8F0", fontWeight: "800", fontSize: "15px" }}>{topic.title} Quiz</div>
            <div style={{ color: "#64748B", fontSize: "12px" }}>Question {current + 1} of {questions.length + 1} {isAiRound && "🤖 AI Bonus"}</div>
          </div>
        </div>
        <div style={{ color: topic.color, fontWeight: "800", fontSize: "15px" }}>
          {answers.filter(a => a.selected === a.correct).length}/{answers.length} ✓
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: "6px", background: "#1E293B", borderRadius: "999px", marginBottom: "24px", overflow: "hidden" }}>
        <div style={{ height: "100%", background: topic.color, borderRadius: "999px", width: progress + "%", transition: "width 0.4s" }} />
      </div>

      {/* Question card */}
      <div style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: "24px", padding: "28px", marginBottom: "16px" }}>
        {isAiRound && (
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(168,85,247,0.15)", color: "#A855F7", border: "1px solid rgba(168,85,247,0.3)", borderRadius: "999px", padding: "4px 12px", fontSize: "11px", fontWeight: "800", marginBottom: "14px" }}>
            🤖 AI GENERATED BONUS QUESTION
          </div>
        )}
        <h2 style={{ color: "#E2E8F0", fontSize: "18px", fontWeight: "700", lineHeight: "1.5", margin: "0 0 24px" }}>{q.q}</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {q.options.map((opt, i) => {
            let bg = "#0F172A", border = "#334155", color = "#94A3B8";
            if (selected !== null) {
              if (i === q.answer)       { bg = "rgba(34,197,94,0.12)";  border = "#22C55E"; color = "#22C55E"; }
              else if (i === selected)  { bg = "rgba(239,68,68,0.12)";  border = "#EF4444"; color = "#EF4444"; }
            } else if (selected === null) {
              bg = "#0F172A"; border = "#334155"; color = "#94A3B8";
            }
            return (
              <button key={i} onClick={() => handleSelect(i)}
                style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 18px", borderRadius: "16px", cursor: selected !== null ? "default" : "pointer", transition: "all 0.2s", background: bg, border: "1.5px solid " + border, color, textAlign: "left", fontSize: "14px", fontWeight: "600" }}
                onMouseEnter={e => { if (selected === null) e.currentTarget.style.borderColor = topic.color; }}
                onMouseLeave={e => { if (selected === null) e.currentTarget.style.borderColor = "#334155"; }}>
                <span style={{ width: "28px", height: "28px", borderRadius: "50%", background: selected !== null && i === q.answer ? "#22C55E" : selected !== null && i === selected ? "#EF4444" : "#1E293B", color: selected !== null && (i === q.answer || i === selected) ? "#fff" : "#64748B", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900", fontSize: "12px", flexShrink: 0, border: "2px solid " + (selected !== null && i === q.answer ? "#22C55E" : selected !== null && i === selected ? "#EF4444" : "#334155") }}>
                  {selected !== null && i === q.answer ? "✓" : selected !== null && i === selected ? "✗" : ["A","B","C","D"][i]}
                </span>
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      {/* Explanation */}
      {showExp && (
        <div style={{ padding: "18px 20px", borderRadius: "18px", marginBottom: "16px", background: selected === q.answer ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", border: "1px solid " + (selected === q.answer ? "rgba(34,197,94,0.4)" : "rgba(239,68,68,0.4)") }}>
          <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
            <span style={{ fontSize: "20px", flexShrink: 0 }}>{selected === q.answer ? "✅" : "❌"}</span>
            <div>
              <div style={{ fontWeight: "800", fontSize: "14px", color: selected === q.answer ? "#22C55E" : "#EF4444", marginBottom: "4px" }}>
                {selected === q.answer ? "Correct!" : "Wrong Answer"}
              </div>
              <div style={{ color: "#94A3B8", fontSize: "13px", lineHeight: "1.6" }}>{q.explanation}</div>
            </div>
          </div>
          <button onClick={handleNext}
            style={{ marginTop: "14px", width: "100%", padding: "12px", borderRadius: "14px", fontWeight: "800", fontSize: "13px", background: topic.color, color: "#fff", border: "none", cursor: "pointer" }}>
            {current < questions.length - 1 ? "Next Question →" : isAiRound ? "See Results 🏆" : "AI Bonus Question 🤖"}
          </button>
        </div>
      )}
    </div>
  );
}

export default function QuizPage() {
  const [selected, setSelected] = useState(null);

  if (selected) {
    const qs = QUESTION_BANK[selected.id] || [];
    return (
      <Layout title={selected.title + " Quiz"}>
        <Quiz topic={selected} questions={qs} onBack={() => setSelected(null)} />
      
    );
  }

  return (
    <Layout title="Quiz Center">
      <div style={{ marginBottom: "32px" }}>
        <p style={{ color: "#475569", fontSize: "13px", marginBottom: "4px" }}>Test Your Knowledge</p>
        <h2 style={{ color: "#E2E8F0", fontSize: "28px", fontWeight: "900", margin: "0 0 6px" }}>Disaster Preparedness Quizzes</h2>
        <p style={{ color: "#64748B", fontSize: "13px", margin: 0 }}>5 fixed questions + 1 AI-generated bonus question per topic. Get explanations after every answer!</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
        {TOPICS.map(t => (
          <div key={t.id} onClick={() => setSelected(t)}
            style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: "20px", padding: "24px", cursor: "pointer", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = t.color + "80"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "#334155"; }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>{t.icon}</div>
            <h3 style={{ color: "#E2E8F0", fontWeight: "900", fontSize: "16px", margin: "0 0 6px" }}>{t.title}</h3>
            <p style={{ color: "#64748B", fontSize: "12px", margin: "0 0 16px" }}>5 questions + 1 AI bonus</p>
            <div style={{ display: "flex", gap: "6px", marginBottom: "16px" }}>
              <span style={{ fontSize: "11px", padding: "4px 10px", borderRadius: "8px", fontWeight: "700", background: t.bg, color: t.color, border: "1px solid " + t.border }}>5 Questions</span>
              <span style={{ fontSize: "11px", padding: "4px 10px", borderRadius: "8px", fontWeight: "700", background: "rgba(168,85,247,0.1)", color: "#A855F7", border: "1px solid rgba(168,85,247,0.3)" }}>🤖 AI Bonus</span>
            </div>
            <div style={{ width: "100%", padding: "10px", borderRadius: "12px", fontWeight: "800", fontSize: "13px", background: t.color, color: "#fff", textAlign: "center" }}>
              Start Quiz →
            </div>
          </div>
        ))}
      </div>
    
  );
}
