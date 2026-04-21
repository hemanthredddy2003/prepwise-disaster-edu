import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';

const ACCENT = { Flood:'#00D4FF', Earthquake:'#FFB020', Cyclone:'#8B5CF6', Landslide:'#84CC16', Tsunami:'#3B82F6', Fire:'#FF3B3B', Heatwave:'#FF6B00', Avalanche:'#A0C4FF', Dust:'#C8A96E' };
const DIFF_COLOR = { Easy:'var(--green)', Medium:'var(--amber)', Hard:'var(--red)' };

export default function SimulationList() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [sims, setSims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCat, setFilterCat] = useState('All');
  const [filterDiff, setFilterDiff] = useState('All');

  useEffect(() => {
    axios.get(import.meta.env.VITE_API_BASE_URL + '/simulations', {
      headers: { Authorization: 'Bearer ' + token }
}).then(r => {
      const d = r.data;
      const list = d?.data?.scenarios || d?.message?.scenarios || d?.scenarios || [];
      setSims(list);
    }).catch(e => { console.error(e); setSims([]); })
    .finally(() => setLoading(false));
  }, []);

  const cats = ['All', ...new Set(sims.map(s => s.category).filter(Boolean))];
  const diffs = ['All', 'Easy', 'Medium', 'Hard'];

  const filtered = sims.filter(s =>
    (filterCat === 'All' || s.category === filterCat) &&
    (filterDiff === 'All' || s.difficulty === filterDiff)
  );

  const getAccent = (cat) => {
    const key = Object.keys(ACCENT).find(k => (cat || '').includes(k));
    return key ? ACCENT[key] : '#666';
  };

  return (
    
      <style>{".sc:hover{background:var(--raised)!important;border-top-color:var(--ac)!important;}.sc:hover .cta{opacity:1!important;}"}</style>

      <div style={{borderBottom:'1px solid var(--border)',paddingBottom:'20px',marginBottom:'24px'}}>
        <div style={{fontFamily:'var(--font-mono)',fontSize:'10px',color:'var(--dim)',letterSpacing:'0.15em',marginBottom:'6px'}}>AI POWERED</div>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end'}}>
          <h2 style={{fontFamily:'var(--font-display)',fontSize:'48px',color:'var(--white)',lineHeight:0.9}}>SIMULATIONS</h2>
          <div style={{fontFamily:'var(--font-display)',fontSize:'60px',color:'var(--border)',lineHeight:1}}>{String(filtered.length).padStart(2,'0')}</div>
        </div>
      </div>

      <div style={{display:'flex',gap:'20px',marginBottom:'24px',flexWrap:'wrap'}}>
        <div style={{display:'flex',gap:'2px',flexWrap:'wrap'}}>
          {cats.map(c=>(
            <button key={c} onClick={()=>setFilterCat(c)} style={{padding:'6px 12px',background:filterCat===c?'var(--cyan)':'transparent',color:filterCat===c?'var(--ink)':'var(--dim)',border:'1px solid '+(filterCat===c?'var(--cyan)':'var(--border)'),borderRadius:'2px',fontWeight:'700',fontSize:'9px',cursor:'pointer',fontFamily:'var(--font-mono)',letterSpacing:'0.1em'}}>{c.toUpperCase()}</button>
          ))}
        </div>
        <div style={{display:'flex',gap:'2px'}}>
          {diffs.map(d=>(
            <button key={d} onClick={()=>setFilterDiff(d)} style={{padding:'6px 12px',background:filterDiff===d?(DIFF_COLOR[d]||'var(--cyan)'):'transparent',color:filterDiff===d?'var(--ink)':'var(--dim)',border:'1px solid '+(filterDiff===d?(DIFF_COLOR[d]||'var(--cyan)'):'var(--border)'),borderRadius:'2px',fontWeight:'700',fontSize:'9px',cursor:'pointer',fontFamily:'var(--font-mono)',letterSpacing:'0.1em'}}>{d.toUpperCase()}</button>
          ))}
        </div>
      </div>

      {loading && <div style={{textAlign:'center',padding:'80px',fontFamily:'var(--font-mono)',color:'var(--dim)'}}>LOADING...</div>}

      {!loading && filtered.length === 0 && (
        <div style={{textAlign:'center',padding:'80px',fontFamily:'var(--font-mono)',color:'var(--dim)'}}>NO SIMULATIONS FOUND</div>
      )}

      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1px',background:'var(--border)'}}>
        {filtered.map((sim,i) => {
          const accent = getAccent(sim.category);
          const dColor = DIFF_COLOR[sim.difficulty] || 'var(--dim)';
          return (
            <div key={sim.id || i} className="sc"
              style={{'--ac':accent,background:'var(--surface)',padding:'24px',cursor:'pointer',transition:'background 0.15s',borderTop:'2px solid transparent'}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:'12px'}}>
                <span style={{fontFamily:'var(--font-mono)',fontSize:'9px',color:accent,letterSpacing:'0.15em'}}>{(sim.category||'DISASTER').toUpperCase()}</span>
                <span style={{fontFamily:'var(--font-mono)',fontSize:'9px',color:dColor,background:dColor+'20',padding:'2px 7px',borderRadius:'2px'}}>{(sim.difficulty||'MEDIUM').toUpperCase()}</span>
              </div>
              <h3 style={{fontFamily:'var(--font-display)',fontSize:'20px',color:'var(--white)',lineHeight:1.1,marginBottom:'6px'}}>{(sim.title||'').toUpperCase()}</h3>
              <div style={{fontFamily:'var(--font-mono)',fontSize:'10px',color:'var(--dim)',marginBottom:'8px'}}>{sim.location||'India'}</div>
              <p style={{fontSize:'12px',color:'var(--body)',lineHeight:'1.6',marginBottom:'16px',minHeight:'40px'}}>{(sim.description||'').slice(0,90)}...</p>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <span style={{fontFamily:'var(--font-mono)',fontSize:'10px',color:'var(--dim)'}}>{sim.duration||'15 min'}</span>
                <button className="cta" onClick={()=>navigate('/simulations/'+sim.id)}
                  style={{padding:'7px 16px',background:accent,color:'var(--ink)',fontWeight:'700',fontSize:'10px',border:'none',borderRadius:'3px',cursor:'pointer',fontFamily:'var(--font-mono)',opacity:0,transition:'opacity 0.15s'}}>START</button>
              </div>
            </div>
          );
        })}
      </div>
    
  );
}
