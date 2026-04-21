import { useState } from "react";

const QUIZZES = {
  earthquake: {
    label: "Earthquake Scenarios", icon: "🌍", color: "#DC2626", bg: "#FEF2F2",
    questions: [
      { scenario: "You are sitting at your office desk on the 5th floor when the building starts shaking violently.", question: "What is the FIRST thing you should do?",
        options: [
          { text: "Run to the staircase immediately to evacuate", correct: false, explanation: "Running during shaking is dangerous — you can fall and be hit by debris." },
          { text: "DROP to knees, take COVER under desk, HOLD ON until shaking stops", correct: true, explanation: "✅ Correct! Drop-Cover-Hold On is the safest action. Most injuries come from falling objects." },
          { text: "Stand in the doorway for protection", correct: false, explanation: "Outdated advice. Doorframes offer no special protection in modern buildings." },
          { text: "Call family members to warn them", correct: false, explanation: "Your phone won't help if debris falls on you. Safety first — call after." },
        ]},
      { scenario: "Shaking has stopped. You're in your office and notice a strong smell of gas.", question: "What should you do?",
        options: [
          { text: "Turn on the lights to check where the smell is coming from", correct: false, explanation: "Never! Switching lights on can spark an explosion — even a small spark ignites gas." },
          { text: "Open windows, don't touch any switches, leave the building immediately", correct: true, explanation: "✅ Correct! Ventilate, avoid all switches, evacuate. Call gas helpline from outside only." },
          { text: "Wait for aftershocks to stop before doing anything", correct: false, explanation: "Gas leaks can ignite at any moment. Don't wait for anything." },
          { text: "Use your mobile torch to check for the source", correct: false, explanation: "Some phones can spark. Leave immediately and call from outside." },
        ]},
      { scenario: "You evacuated safely outside. Your building looks undamaged. Your important documents are inside.", question: "Should you go back in to retrieve them?",
        options: [
          { text: "Yes, the building looks safe and it will only take 2 minutes", correct: false, explanation: "Aftershocks occur without warning. Structures can collapse even if they look fine externally." },
          { text: "No — wait for structural engineers to declare the building safe", correct: true, explanation: "✅ Correct! Only structural engineers can declare a building safe — not your eyes." },
          { text: "Yes, if a security guard allows it", correct: false, explanation: "Security guards cannot assess structural integrity. Wait for engineers." },
          { text: "Wait 30 minutes then go in quickly", correct: false, explanation: "There is no safe time rule. Aftershocks can occur hours or days later." },
        ]},
    ],
  },
  flood: {
    label: "Flood Scenarios", icon: "🌊", color: "#2563EB", bg: "#EFF6FF",
    questions: [
      { scenario: "Heavy rain for 6 hours. You receive an official alert that your area may flood. Water hasn't reached your street yet.", question: "What should you do right now?",
        options: [
          { text: "Wait and monitor — water hasn't reached your house yet", correct: false, explanation: "By the time water reaches your door, evacuation routes may already be blocked." },
          { text: "Move to the upper floor and wait for rescue teams", correct: false, explanation: "If evacuation is still possible, leaving now is always safer than being trapped." },
          { text: "Prepare your emergency kit and move to higher ground immediately", correct: true, explanation: "✅ Correct! Early evacuation is always safer. Roads flood within minutes." },
          { text: "Sandbag your doors and windows", correct: false, explanation: "Sandbags only delay water entry. Use that time to evacuate instead." },
        ]},
      { scenario: "You're driving home and find a road with 30cm of floodwater. Other cars appear to have crossed it.", question: "What do you do?",
        options: [
          { text: "Drive slowly through — 30cm isn't that deep", correct: false, explanation: "30cm of moving water can sweep a car off the road. Never drive through floodwater." },
          { text: "Wait to see if the water level drops", correct: false, explanation: "Flood levels rise rapidly — waiting could trap you completely." },
          { text: "Turn around and find an alternate route", correct: true, explanation: "✅ Correct! Turn Around, Don't Drown. You cannot judge flood depth from a car." },
          { text: "Follow other cars who successfully crossed", correct: false, explanation: "Those cars may get swept away too. Don't follow others into danger." },
        ]},
      { scenario: "Floodwater has entered your home and is rising fast. You cannot evacuate now.", question: "What should you do?",
        options: [
          { text: "Try to swim out through the front door", correct: false, explanation: "Moving floodwater is extremely powerful — even strong swimmers can be swept away." },
          { text: "Move to the highest floor, signal rescuers with bright cloth, call 112", correct: true, explanation: "✅ Correct! Move up, signal for help, and wait for rescue. Stay visible." },
          { text: "Drink some water from the floor to stay hydrated", correct: false, explanation: "Floodwater is contaminated with sewage, chemicals and bacteria — never drink it." },
          { text: "Open all windows to let water flow through faster", correct: false, explanation: "Opening windows increases flooding. Stay on upper floors and signal for help." },
        ]},
    ],
  },
  fire: {
    label: "Fire Scenarios", icon: "🔥", color: "#EA580C", bg: "#FFF7ED",
    questions: [
      { scenario: "You smell smoke and see fire in the corridor outside your hotel room door at 2am.", question: "What is the FIRST thing you should do?",
        options: [
          { text: "Open the door quickly and run to the staircase", correct: false, explanation: "Feel the door first! If hot, opening it allows fire and deadly smoke to rush in." },
          { text: "Feel the door with back of hand — if cool, evacuate low; if hot, stay and signal", correct: true, explanation: "✅ Correct! Feel before opening. Crawl low under smoke. If door is hot, stay and call for help." },
          { text: "Open the window and jump to safety", correct: false, explanation: "Only jump as absolute last resort. Signal from window and wait for rescue first." },
          { text: "Hide under the bed until fire passes", correct: false, explanation: "Smoke rises and fills rooms quickly. Hiding under bed is not safe." },
        ]},
      { scenario: "Your clothes have caught fire while cooking.", question: "What do you do immediately?",
        options: [
          { text: "Run to the bathroom for water", correct: false, explanation: "Running fans the flames and makes the fire worse. Never run." },
          { text: "STOP where you are, DROP to the ground, ROLL to smother flames", correct: true, explanation: "✅ Correct! Stop-Drop-Roll is the only correct response to clothing fire." },
          { text: "Remove the burning clothing quickly", correct: false, explanation: "Burning fabric can cause more burns when removed. Stop-Drop-Roll instead." },
          { text: "Wave arms to cool the flames", correct: false, explanation: "Waving arms feeds oxygen to fire. Stop-Drop-Roll immediately." },
        ]},
      { scenario: "There is heavy smoke in a corridor you need to cross to evacuate a building.", question: "How should you move through it?",
        options: [
          { text: "Run as fast as possible through the smoke", correct: false, explanation: "Running increases smoke inhalation. Smoke can incapacitate in seconds." },
          { text: "Hold your breath and walk upright quickly", correct: false, explanation: "Clean air is near the floor, not at standing height. Crawl low." },
          { text: "Crawl on hands and knees with wet cloth covering nose and mouth", correct: true, explanation: "✅ Correct! Air near the floor is cleaner. Wet cloth filters some smoke particles." },
          { text: "Wait for smoke to clear before moving", correct: false, explanation: "Smoke levels rise rapidly and can become lethal within minutes." },
        ]},
    ],
  },
  heatwave: {
    label: "Heatwave Scenarios", icon: "🌡️", color: "#D97706", bg: "#FFFBEB",
    questions: [
      { scenario: "Temperature is 46°C. Your elderly neighbour (72 years old) is found sitting outdoors, confused and not sweating.", question: "What is happening and what should you do?",
        options: [
          { text: "Give them water and ask them to rest inside", correct: false, explanation: "This person shows signs of heat stroke — a medical emergency. Water alone is not enough." },
          { text: "Call 108 immediately. Move them to shade. Cool with wet cloth on neck and armpits", correct: true, explanation: "✅ Correct! Heat stroke is a medical emergency. Cool rapidly and call ambulance immediately." },
          { text: "Fan them vigorously with a newspaper", correct: false, explanation: "Fanning alone is insufficient for heat stroke. Call 108 and cool actively." },
          { text: "Give them a cold drink and check again in 30 minutes", correct: false, explanation: "Heat stroke can be fatal within minutes. This is an emergency requiring immediate action." },
        ]},
      { scenario: "You need to travel outdoors at 2pm during a severe heatwave (44°C). Your trip will take 1 hour.", question: "What precautions should you take?",
        options: [
          { text: "Wear black clothes to absorb heat and stay warm", correct: false, explanation: "Dark colours absorb more heat. Wear light-coloured, loose cotton clothing." },
          { text: "Postpone the trip, or go before 10am or after 6pm", correct: true, explanation: "✅ Correct! Avoid 11am-5pm during heatwaves. If unavoidable — white cotton, water, ORS, umbrella." },
          { text: "Drink a cold soft drink before leaving for energy", correct: false, explanation: "Sugary carbonated drinks dehydrate you. Drink plain water or ORS." },
          { text: "Exercise before going out to build heat tolerance", correct: false, explanation: "Exercise increases body temperature. Rest before going out in extreme heat." },
        ]},
    ],
  },
};

export default function DisasterQuiz() {
  const [selected, setSelected] = useState(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [finished, setFinished] = useState(false);

  const quiz = selected ? QUIZZES[selected] : null;
  const q = quiz ? quiz.questions[current] : null;
  const answered = answers[current];
  const score = quiz ? quiz.questions.filter((_, i) => {
    const ans = answers[i];
    return ans !== undefined && quiz.questions[i].options[ans]?.correct;
  }).length : 0;

  function selectAnswer(idx) {
    if (answered !== undefined) return;
    setAnswers(prev => ({ ...prev, [current]: idx }));
    setShowResult(true);
  }

  function next() {
    if (current < quiz.questions.length - 1) {
      setCurrent(c => c + 1);
      setShowResult(false);
    } else {
      setFinished(true);
    }
  }

  function restart() {
    setSelected(null); setCurrent(0); setAnswers({}); setShowResult(false); setFinished(false);
  }

  return (
    <div style={{ padding: "24px 28px", maxWidth: 800, margin: "0 auto", fontFamily: "Inter, system-ui" }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: "#6B7280", letterSpacing: "0.1em", marginBottom: 4 }}>LEARN — SCENARIO QUIZ</div>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111827", margin: 0 }}>🧠 Disaster Preparedness Quiz</h1>
        <p style={{ fontSize: 13, color: "#6B7280", margin: "4px 0 0" }}>Real-world scenarios. Test what you would actually do in an emergency.</p>
      </div>

      {!selected && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {Object.entries(QUIZZES).map(([key, q]) => (
              <button key={key} onClick={() => setSelected(key)} style={{
                padding: "24px", borderRadius: 16, border: `1px solid ${q.color}30`,
                background: q.bg, cursor: "pointer", textAlign: "left", transition: "all 0.2s",
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)"
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 8px 24px ${q.color}20`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)"; }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>{q.icon}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: q.color, marginBottom: 4 }}>{q.label}</div>
                <div style={{ fontSize: 12, color: "#6B7280" }}>{q.questions.length} scenario-based questions</div>
                <div style={{ marginTop: 12, fontSize: 11, color: q.color, fontWeight: 600 }}>Start Quiz →</div>
              </button>
            ))}
          </div>
          <div style={{ marginTop: 20, padding: "16px 20px", background: "#F0FDF4", border: "1px solid #86EFAC", borderRadius: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#065F46", marginBottom: 4 }}>💡 How this quiz works</div>
            <div style={{ fontSize: 12, color: "#374151", lineHeight: 1.6 }}>Each question presents a real emergency scenario. Choose what you would do. Get instant feedback with expert explanation. Learn the right action for every disaster situation.</div>
          </div>
        </div>
      )}

      {selected && !finished && q && (
        <div>
          {/* Progress */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ display: "flex", gap: 6 }}>
              {quiz.questions.map((_, i) => (
                <div key={i} style={{ width: 32, height: 6, borderRadius: 3, background: i < current ? quiz.color : i === current ? quiz.color + "60" : "#E5E7EB" }} />
              ))}
            </div>
            <span style={{ fontSize: 12, color: "#6B7280", fontWeight: 600 }}>Question {current + 1} of {quiz.questions.length}</span>
          </div>

          {/* Question card */}
          <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 20, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", marginBottom: 16 }}>
            <div style={{ padding: "20px 24px", background: quiz.bg, borderBottom: "1px solid #E5E7EB" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: quiz.color, letterSpacing: "0.1em", marginBottom: 8 }}>📍 SCENARIO</div>
              <div style={{ fontSize: 14, color: "#374151", lineHeight: 1.7, fontStyle: "italic" }}>{q.scenario}</div>
            </div>
            <div style={{ padding: "20px 24px" }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 20 }}>{q.question}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {q.options.map((opt, i) => {
                  let bg = "#F9FAFB", border = "#E5E7EB", color = "#374151";
                  if (answered !== undefined) {
                    if (opt.correct) { bg = "#F0FDF4"; border = "#86EFAC"; color = "#065F46"; }
                    else if (i === answered && !opt.correct) { bg = "#FEF2F2"; border = "#FECACA"; color = "#991B1B"; }
                  }
                  return (
                    <button key={i} onClick={() => selectAnswer(i)} style={{
                      padding: "14px 18px", borderRadius: 12, border: `2px solid ${border}`,
                      background: bg, cursor: answered !== undefined ? "default" : "pointer",
                      textAlign: "left", fontSize: 13, color, fontWeight: 500, lineHeight: 1.5, transition: "all 0.2s"
                    }}>
                      <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                        <span style={{ width: 24, height: 24, borderRadius: "50%", background: answered !== undefined ? (opt.correct ? "#16A34A" : i === answered ? "#DC2626" : "#E5E7EB") : "#E5E7EB", color: answered !== undefined ? (opt.correct || i === answered ? "#fff" : "#6B7280") : "#6B7280", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                          {answered !== undefined ? (opt.correct ? "✓" : i === answered ? "✗" : String.fromCharCode(65 + i)) : String.fromCharCode(65 + i)}
                        </span>
                        <span>{opt.text}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Explanation */}
          {showResult && answered !== undefined && (
            <div style={{ background: q.options[answered].correct ? "#F0FDF4" : "#FEF2F2", border: `1px solid ${q.options[answered].correct ? "#86EFAC" : "#FECACA"}`, borderRadius: 14, padding: "16px 20px", marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: q.options[answered].correct ? "#065F46" : "#991B1B", marginBottom: 6 }}>
                {q.options[answered].correct ? "✅ Correct!" : "❌ Incorrect"}
              </div>
              <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.6 }}>{q.options[answered].explanation}</div>
            </div>
          )}

          <div style={{ display: "flex", gap: 10 }}>
            {showResult && (
              <button onClick={next} style={{ padding: "12px 28px", background: quiz.color, color: "#fff", border: "none", borderRadius: 12, cursor: "pointer", fontWeight: 700, fontSize: 14 }}>
                {current < quiz.questions.length - 1 ? "Next Question →" : "See Results"}
              </button>
            )}
            <button onClick={restart} style={{ padding: "12px 20px", background: "#F9FAFB", color: "#374151", border: "1px solid #E5E7EB", borderRadius: 12, cursor: "pointer", fontWeight: 600, fontSize: 13 }}>← Change Topic</button>
          </div>
        </div>
      )}

      {finished && quiz && (
        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 20, padding: "40px", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <div style={{ fontSize: 60, marginBottom: 16 }}>{score === quiz.questions.length ? "🏆" : score >= quiz.questions.length / 2 ? "👍" : "📖"}</div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: "#111827", marginBottom: 8 }}>Quiz Complete!</h2>
          <div style={{ fontSize: 48, fontWeight: 800, color: quiz.color, marginBottom: 4 }}>{score}/{quiz.questions.length}</div>
          <div style={{ fontSize: 14, color: "#6B7280", marginBottom: 24 }}>
            {score === quiz.questions.length ? "Perfect score! You are well-prepared." : score >= quiz.questions.length / 2 ? "Good effort! Review the explanations to improve." : "Keep learning — every lesson could save a life."}
          </div>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button onClick={() => { setCurrent(0); setAnswers({}); setShowResult(false); setFinished(false); }} style={{ padding: "12px 24px", background: quiz.color, color: "#fff", border: "none", borderRadius: 12, cursor: "pointer", fontWeight: 700 }}>Try Again</button>
            <button onClick={restart} style={{ padding: "12px 24px", background: "#F9FAFB", color: "#374151", border: "1px solid #E5E7EB", borderRadius: 12, cursor: "pointer", fontWeight: 600 }}>Other Topics</button>
          </div>
        </div>
      )}
    </div>
  );
}
