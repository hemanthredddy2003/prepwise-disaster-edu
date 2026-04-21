import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';

const PHASE_COLORS = ['var(--cyan)', 'var(--amber)', 'var(--red)', 'var(--purple)', 'var(--green)'];

export default function SimulationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [sim, setSim]           = useState(null);
  const [loading, setLoading]   = useState(true);
  const [phase, setPhase]       = useState(0);       // 0=briefing, 1..N=decision phases, N+1=result
  const [choices, setChoices]   = useState([]);      // selected option per phase
  const [score, setScore]       = useState(0);
  const [timer, setTimer]       = useState(0);
  const [running, setRunning]   = useState(false);
  const [survived, setSurvived] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    axios.get(import.meta.env.VITE_API_BASE_URL + '/simulations/' + id, {
      headers: { Authorization: 'Bearer ' + token }
    }).then(r => {
      const d = r.data.message?.scenario || r.data.data?.scenario || r.data.scenario || r.data.data || r.data;
      setSim(d);
    }).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  // timer
  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [running]);

  const startSim = () => { setPhase(1); setRunning(true); setTimer(0); };

  const choose = (phaseIdx, optionIdx, points) => {
    if (choices[phaseIdx] !== undefined) return;
    const newChoices = [...choices];
    newChoices[phaseIdx] = optionIdx;
    setChoices(newChoices);
    setScore(s => s + (points || 0));
  };

  const fmt = (s) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

  if (loading) return (
    
      <div style={{textAlign:'center',padding:'120px',fontFamily:'var(--font-mono)',color:'var(--dim)',letterSpacing:'0.1em'}}>
        LOADING SIMULATION...
      </div>
    
  );

  if (!sim) return (
    
      <div style={{textAlign:'center',padding:'80px',fontFamily:'var(--font-mono)',color:'var(--red)'}}>
        SIMULATION NOT FOUND
        <div style={{marginTop:'16px'}}><button onClick={()=>navigate('/simulations')} style={{padding:'8px 16px',background:'var(--surface)',border:'1px solid var(--border)',color:'var(--dim)',borderRadius:'4px',cursor:'pointer',fontFamily:'var(--font-mono)',fontSize:'11px'}}>BACK</button></div>
      </div>
    
  );

  const steps = sim.steps || sim.phases || [];
  const currentStep = steps[phase - 1];
  const totalPhases = steps.length;
  const maxScore = totalPhases * 10;

  // ── BRIEFING ──────────────────────────────────────────────────────────
  if (phase === 0) return (
    
      <button onClick={()=>navigate('/simulations')} style={{marginBottom:'20px',background:'none',border:'none',color:'var(--dim)',fontFamily:'var(--font-mono)',fontSize:'11px',cursor:'pointer',letterSpacing:'0.08em'}}>
        ← BACK TO SIMULATIONS
      </button>

      <div style={{display:'grid',gridTemplateColumns:'1fr 320px',gap:'1px',background:'var(--border)',borderRadius:'4px',overflow:'hidden',marginBottom:'1px'}}>
        {/* Left — briefing */}
        <div style={{background:'var(--surface)',padding:'32px'}}>
          <div style={{fontFamily:'var(--font-mono)',fontSize:'10px',color:'var(--dim)',letterSpacing:'0.15em',marginBottom:'8px'}}>
            SCENARIO BRIEFING — {(sim.location||'').toUpperCase()}
          </div>
          <h1 style={{fontFamily:'var(--font-display)',fontSize:'42px',letterSpacing:'0.04em',color:'var(--white)',lineHeight:0.95,marginBottom:'20px'}}>
            {(sim.title||'').toUpperCase()}
          </h1>
          <p style={{fontSize:'14px',color:'var(--body)',lineHeight:'1.8',marginBottom:'24px',borderLeft:'2px solid var(--cyan)',paddingLeft:'16px'}}>
            {sim.description}
          </p>
          {sim.background && (
            <p style={{fontSize:'13px',color:'var(--dim)',lineHeight:'1.7',marginBottom:'24px'}}>{sim.background}</p>
          )}
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1px',background:'var(--border)',borderRadius:'3px',overflow:'hidden',marginBottom:'28px'}}>
            {[
              ['DIFFICULTY', sim.difficulty||'Medium'],
              ['DURATION',   (sim.duration||sim.duration_minutes||15)+' min'],
              ['SCENARIOS',  totalPhases+' phases'],
            ].map(([l,v])=>(
              <div key={l} style={{background:'var(--ink)',padding:'12px 16px'}}>
                <div style={{fontFamily:'var(--font-mono)',fontSize:'9px',color:'var(--dim)',letterSpacing:'0.12em',marginBottom:'4px'}}>{l}</div>
                <div style={{fontFamily:'var(--font-display)',fontSize:'18px',color:'var(--white)',letterSpacing:'0.04em'}}>{v}</div>
              </div>
            ))}
          </div>
          <button onClick={startSim} style={{
            padding:'14px 32px',background:'var(--cyan)',color:'var(--ink)',border:'none',
            fontFamily:'var(--font-display)',fontSize:'20px',letterSpacing:'0.08em',
            borderRadius:'4px',cursor:'pointer',transition:'opacity 0.15s'
          }}
          onMouseEnter={e=>e.target.style.opacity='0.85'}
          onMouseLeave={e=>e.target.style.opacity='1'}>
            START SIMULATION
          </button>
        </div>

        {/* Right — meta */}
        <div style={{background:'var(--ink)',padding:'28px',display:'flex',flexDirection:'column',gap:'20px'}}>
          <div>
            <div style={{fontFamily:'var(--font-mono)',fontSize:'9px',color:'var(--dim)',letterSpacing:'0.12em',marginBottom:'8px'}}>WHAT YOU WILL LEARN</div>
            <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
              {(sim.objectives||['Make critical decisions under pressure','Understand evacuation procedures','Learn resource management','Coordinate with emergency services']).map((o,i)=>(
                <div key={i} style={{display:'flex',gap:'8px',alignItems:'flex-start'}}>
                  <div style={{width:'4px',height:'4px',borderRadius:'50%',background:'var(--cyan)',marginTop:'6px',flexShrink:0}} />
                  <span style={{fontSize:'12px',color:'var(--body)',lineHeight:'1.5'}}>{o}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{borderTop:'1px solid var(--border)',paddingTop:'16px'}}>
            <div style={{fontFamily:'var(--font-mono)',fontSize:'9px',color:'var(--dim)',letterSpacing:'0.12em',marginBottom:'8px'}}>REGION</div>
            <div style={{fontSize:'13px',color:'var(--white)'}}>{sim.location}</div>
            {sim.region && <div style={{fontSize:'11px',color:'var(--dim)',marginTop:'3px'}}>{sim.region}</div>}
          </div>
          <div style={{borderTop:'1px solid var(--border)',paddingTop:'16px'}}>
            <div style={{fontFamily:'var(--font-mono)',fontSize:'9px',color:'var(--amber)',letterSpacing:'0.12em',marginBottom:'6px'}}>WARNING</div>
            <div style={{fontSize:'11px',color:'var(--dim)',lineHeight:'1.6'}}>
              This simulation contains realistic disaster scenarios. Your decisions will affect the outcome. Choose carefully.
            </div>
          </div>
        </div>
      </div>
    
  );

  // ── RESULT ────────────────────────────────────────────────────────────
  if (phase === totalPhases + 1) {
    const pct = Math.round(score / Math.max(maxScore, 1) * 100);
    const grade = pct >= 80 ? 'EXCELLENT' : pct >= 60 ? 'GOOD' : pct >= 40 ? 'AVERAGE' : 'NEEDS WORK';
    const gradeColor = pct >= 80 ? 'var(--green)' : pct >= 60 ? 'var(--cyan)' : pct >= 40 ? 'var(--amber)' : 'var(--red)';

    return (
      
        <div style={{maxWidth:'700px',margin:'0 auto'}}>
          <div style={{textAlign:'center',padding:'40px 0 32px',borderBottom:'1px solid var(--border)',marginBottom:'32px'}}>
            <div style={{fontFamily:'var(--font-mono)',fontSize:'10px',color:'var(--dim)',letterSpacing:'0.15em',marginBottom:'8px'}}>SIMULATION COMPLETE</div>
            <h1 style={{fontFamily:'var(--font-display)',fontSize:'56px',letterSpacing:'0.04em',color:gradeColor,lineHeight:0.9,marginBottom:'8px'}}>{grade}</h1>
            <div style={{fontFamily:'var(--font-display)',fontSize:'80px',color:'var(--white)',lineHeight:1}}>{pct}%</div>
            <div style={{fontFamily:'var(--font-mono)',fontSize:'11px',color:'var(--dim)',marginTop:'4px'}}>{score} / {maxScore} POINTS — {fmt(timer)}</div>
          </div>

          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1px',background:'var(--border)',borderRadius:'4px',overflow:'hidden',marginBottom:'24px'}}>
            {[
              ['SCENARIO', sim.title, 'var(--white)'],
              ['OUTCOME', survived ? 'SURVIVED' : 'DID NOT SURVIVE', survived ? 'var(--green)' : 'var(--red)'],
              ['TIME', fmt(timer), 'var(--cyan)'],
            ].map(([l,v,c])=>(
              <div key={l} style={{background:'var(--surface)',padding:'16px 20px'}}>
                <div style={{fontFamily:'var(--font-mono)',fontSize:'9px',color:'var(--dim)',letterSpacing:'0.12em',marginBottom:'6px'}}>{l}</div>
                <div style={{fontFamily:'var(--font-display)',fontSize:'16px',color:c,letterSpacing:'0.04em'}}>{(v||'').toUpperCase()}</div>
              </div>
            ))}
          </div>

          <div style={{marginBottom:'24px'}}>
            <div style={{fontFamily:'var(--font-mono)',fontSize:'10px',color:'var(--dim)',letterSpacing:'0.12em',marginBottom:'12px'}}>YOUR DECISIONS</div>
            <div style={{border:'1px solid var(--border)',borderRadius:'4px',overflow:'hidden'}}>
              {steps.map((step, i) => {
                const chosen = choices[i];
                const opt = step.options?.[chosen];
                const correct = opt?.points >= 10;
                return (
                  <div key={i} style={{padding:'12px 16px',borderBottom:i<steps.length-1?'1px solid var(--border)':'none',background:'var(--surface)',display:'flex',gap:'12px',alignItems:'center'}}>
                    <div style={{fontFamily:'var(--font-mono)',fontSize:'9px',color:'var(--dim)',minWidth:'24px'}}>#{i+1}</div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:'12px',color:'var(--body)',marginBottom:'2px'}}>{step.situation||step.title}</div>
                      <div style={{fontFamily:'var(--font-mono)',fontSize:'10px',color:correct?'var(--green)':'var(--amber)'}}>{opt?.text||'No choice'}</div>
                    </div>
                    <div style={{fontFamily:'var(--font-display)',fontSize:'16px',color:correct?'var(--green)':'var(--amber)'}}>{opt?.points||0}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{display:'flex',gap:'8px'}}>
            <button onClick={()=>{setPhase(0);setChoices([]);setScore(0);setTimer(0);setSurvived(null);}} style={{flex:1,padding:'12px',background:'var(--surface)',border:'1px solid var(--border)',color:'var(--text)',fontFamily:'var(--font-display)',fontSize:'16px',letterSpacing:'0.06em',borderRadius:'4px',cursor:'pointer'}}>
              RETRY
            </button>
            <button onClick={()=>navigate('/simulations')} style={{flex:1,padding:'12px',background:'var(--cyan)',border:'none',color:'var(--ink)',fontFamily:'var(--font-display)',fontSize:'16px',letterSpacing:'0.06em',borderRadius:'4px',cursor:'pointer'}}>
              ALL SIMULATIONS
            </button>
          </div>
        </div>
      
    );
  }

  // ── ACTIVE PHASE ──────────────────────────────────────────────────────
  const phaseColor = PHASE_COLORS[(phase - 1) % PHASE_COLORS.length];
  const progress = ((phase - 1) / totalPhases) * 100;
  const alreadyChosen = choices[phase - 1] !== undefined;

  return (
    
      {/* Top bar */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px',paddingBottom:'16px',borderBottom:'1px solid var(--border)'}}>
        <div style={{display:'flex',gap:'16px',alignItems:'center'}}>
          <div style={{fontFamily:'var(--font-mono)',fontSize:'11px',color:'var(--dim)',letterSpacing:'0.1em'}}>
            PHASE {phase}/{totalPhases}
          </div>
          <div style={{width:'160px',height:'3px',background:'var(--border)',borderRadius:'1px',overflow:'hidden'}}>
            <div style={{height:'100%',width:progress+'%',background:phaseColor,transition:'width 0.4s'}} />
          </div>
        </div>
        <div style={{display:'flex',gap:'20px',alignItems:'center'}}>
          <div style={{fontFamily:'var(--font-mono)',fontSize:'14px',color:'var(--cyan)',letterSpacing:'0.08em'}}>{fmt(timer)}</div>
          <div style={{fontFamily:'var(--font-mono)',fontSize:'11px',color:'var(--dim)'}}>SCORE: <span style={{color:'var(--white)'}}>{score}</span></div>
        </div>
      </div>

      {/* Situation */}
      <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderLeft:'3px solid '+phaseColor,borderRadius:'4px',padding:'24px',marginBottom:'20px'}}>
        <div style={{fontFamily:'var(--font-mono)',fontSize:'9px',color:phaseColor,letterSpacing:'0.15em',marginBottom:'10px'}}>
          SITUATION — PHASE {phase}
        </div>
        <h2 style={{fontFamily:'var(--font-display)',fontSize:'26px',letterSpacing:'0.04em',color:'var(--white)',lineHeight:1.1,marginBottom:'12px'}}>
          {(currentStep?.title||currentStep?.situation_title||'CRITICAL DECISION').toUpperCase()}
        </h2>
        <p style={{fontSize:'14px',color:'var(--body)',lineHeight:'1.8'}}>
          {currentStep?.situation || currentStep?.description || 'What do you do?'}
        </p>
      </div>

      {/* Options */}
      {alreadyChosen && (
        <div style={{marginBottom:'16px'}}>
          <button onClick={() => {
            const steps = sim.steps || [];
            if (phase >= steps.length) {
              setRunning(false);
              setSurvived(score >= (steps.length * 10 * 0.6));
              setPhase(steps.length + 1);
            } else {
              setPhase(phase + 1);
            }
          }} style={{
            padding:'12px 32px', background:'var(--cyan)', color:'var(--ink)',
            border:'none', borderRadius:'4px', cursor:'pointer',
            fontFamily:'var(--font-display)', fontSize:'18px', letterSpacing:'0.06em'
          }}>
            {phase >= (sim.steps||[]).length ? 'VIEW RESULTS →' : 'NEXT PHASE →'}
          </button>
        </div>
      )}
      <div style={{fontFamily:'var(--font-mono)',fontSize:'10px',color:'var(--dim)',letterSpacing:'0.12em',marginBottom:'12px'}}>
        CHOOSE YOUR ACTION:
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
        {(currentStep?.options||[]).map((opt, i) => {
          const chosen = choices[phase-1] === i;
          const showResult = alreadyChosen;
          const isCorrect = opt.points >= 10;
          let bg = 'var(--surface)', border = 'var(--border)', color = 'var(--body)';
          if (showResult && chosen) { bg = isCorrect ? 'rgba(0,232,122,0.08)' : 'rgba(255,59,59,0.08)'; border = isCorrect ? 'var(--green)' : 'var(--red)'; color = 'var(--white)'; }
          else if (showResult && isCorrect) { border = 'rgba(0,232,122,0.3)'; }

          return (
            <button key={i} onClick={()=>!alreadyChosen && choose(phase-1, i, opt.points||0)}
              style={{padding:'16px 20px',background:bg,border:'1px solid '+border,borderRadius:'4px',cursor:alreadyChosen?'default':'pointer',textAlign:'left',transition:'all 0.2s',display:'flex',gap:'16px',alignItems:'center'}}
              onMouseEnter={e=>{ if(!alreadyChosen){ e.currentTarget.style.background='var(--raised)'; e.currentTarget.style.borderColor=phaseColor; }}}
              onMouseLeave={e=>{ if(!alreadyChosen){ e.currentTarget.style.background='var(--surface)'; e.currentTarget.style.borderColor='var(--border)'; }}}>
              <div style={{width:'28px',height:'28px',borderRadius:'50%',border:'1px solid '+(chosen?border:'var(--border)'),display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--font-mono)',fontSize:'11px',color:chosen?'var(--white)':'var(--dim)',flexShrink:0}}>
                {String.fromCharCode(65+i)}
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:'13px',color,lineHeight:'1.5'}}>{opt.text||opt.action}</div>
                {showResult && <div style={{fontFamily:'var(--font-mono)',fontSize:'10px',color:isCorrect?'var(--green)':'var(--dim)',marginTop:'4px'}}>{opt.explanation||''}</div>}
              </div>
              {showResult && <div style={{fontFamily:'var(--font-display)',fontSize:'18px',color:opt.points>=10?'var(--green)':'var(--amber)',flexShrink:0}}>+{opt.points||0}</div>}
            </button>
          );
        })}
      </div>
    
  );
}
