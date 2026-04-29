// Landing.jsx — ClinAI Scroll-Driven Premium Product Story
const { useState, useEffect } = React;

// ── Utilities ─────────────────────────────────────────────────────────
const lerp  = (a, b, t) => a + (b - a) * t;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const eio   = t => t < 0.5 ? 2*t*t : 1 - (-2*t+2)**2/2;

// ── Window size hook ──────────────────────────────────────────────────
function useWindowSize() {
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight });
  useEffect(() => {
    const update = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return size;
}

const CHAPTER_VH  = 1.4;
const PHASE_COUNT = 5;

// ── Module data ───────────────────────────────────────────────────────
const MODULES = [
  { id:1, title:'Breaking Difficult News', category:'Empathy & Disclosure',
    desc:'Master the SPIKES protocol. Practice delivering serious diagnoses with compassion, clarity, and composure.',
    duration:'~18 min', available:true, accentColor:'var(--accent)',
    scenario:{ name:'Mr. Rodriguez', age:58, context:'Awaiting biopsy results' } },
  { id:2, title:'Motivational Interviewing', category:'Behavior Change',
    desc:'Guide patients toward meaningful change using reflective listening and strategic questioning.',
    duration:'~22 min', available:false, accentColor:'var(--teal)' },
  { id:3, title:'Managing Conflict', category:'Interpersonal Skills',
    desc:'De-escalate tension with colleagues, patients, and families. Stay grounded under pressure.',
    duration:'~20 min', available:false, accentColor:'var(--gold)' },
  { id:4, title:'Cultural Humility', category:'Patient-Centered Care',
    desc:'Navigate cultural differences with sensitivity, curiosity, and respect for patient identity.',
    duration:'~25 min', available:false, accentColor:'oklch(60% 0.13 320)' },
  { id:5, title:'Social Determinants of Health', category:'Global Health & SDOH',
    desc:'Explore how structural forces shape health outcomes. Practice culturally sensitive interviewing with a patient navigating real barriers to care.',
    duration:'~30 min', available:true, accentColor:'var(--teal)',
    scenario:{ name:'Amina Juma', age:34, context:'Son with femur fracture — Mwanza, Tanzania' } },
  { id:6, title:'Reading EKGs', category:'Cardiology',
    desc:'Master EKG interpretation with an interactive 12-lead viewer, wave annotations, caliper tools, and AI-guided practice cases.',
    duration:'~25 min', available:true, underConstruction:true, accentColor:'oklch(52% 0.16 15)' },
];

// ── Scroll-phase hook ─────────────────────────────────────────────────
function useScrollPhase() {
  const [state, setState] = useState({ phase:0, progress:0, scrollY:0 });
  useEffect(() => {
    const update = () => {
      const sy  = window.scrollY;
      const vh  = window.innerHeight;
      const chPx = CHAPTER_VH * vh;
      const raw  = sy / chPx;
      setState({
        phase:    clamp(Math.floor(raw), 0, PHASE_COUNT - 1),
        progress: clamp(raw - Math.floor(raw), 0, 1),
        scrollY:  sy,
      });
    };
    window.addEventListener('scroll', update, { passive:true });
    update();
    return () => window.removeEventListener('scroll', update);
  }, []);
  return state;
}

// ── HoverButton ───────────────────────────────────────────────────────
function HoverButton({ children, onClick, primary, large }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{
      fontFamily:'var(--font-sans)', fontSize: large ? 16 : 14, fontWeight:500,
      background: primary ? (h ? 'var(--accent)' : 'var(--text)') : (h ? 'var(--surface-sub)' : 'transparent'),
      color: primary ? 'white' : (h ? 'var(--text)' : 'var(--text-muted)'),
      border: primary ? 'none' : '1px solid var(--border)',
      padding: large ? '14px 32px' : '10px 22px',
      borderRadius:100, cursor:'pointer',
      transition:'all 0.28s var(--ease-spring)',
      transform: h ? 'scale(1.03)' : 'scale(1)',
      letterSpacing:'-0.01em', whiteSpace:'nowrap',
    }}>{children}</button>
  );
}

// ── Nav ───────────────────────────────────────────────────────────────
function Nav({ onEnterModule, phase }) {
  return (
    <nav style={{
      position:'fixed', top:0, left:0, right:0, zIndex:200, height:60,
      display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 48px',
      background:'oklch(98.5% 0.006 240 / 0.88)', backdropFilter:'blur(24px)',
      borderBottom:'1px solid oklch(88% 0.008 240 / 0.55)',
    }}>
      <div style={{ display:'flex', alignItems:'center', gap:9 }}>
        <div style={{ width:26, height:26, borderRadius:7, background:'var(--accent)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M7 1v12M1 7h12" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
        </div>
        <span style={{ fontFamily:'var(--font-sans)', fontWeight:600, fontSize:15, letterSpacing:'-0.02em' }}>ClinAI</span>
      </div>

      {/* Chapter dots */}
      <div style={{ display:'flex', gap:7, alignItems:'center' }}>
        {Array.from({ length: PHASE_COUNT }).map((_, i) => (
          <div key={i} style={{
            width: i === phase ? 20 : 5, height:5, borderRadius:3,
            background: i === phase ? 'var(--accent)' : 'var(--border)',
            transition:'all 0.5s var(--ease-spring)',
          }} />
        ))}
      </div>

      <button onClick={() => onEnterModule(MODULES[0])} style={{
        fontFamily:'var(--font-sans)', fontSize:13, fontWeight:500,
        background:'var(--text)', color:'var(--bg)', border:'none',
        padding:'8px 20px', borderRadius:100, cursor:'pointer', transition:'all 0.25s',
      }}
        onMouseEnter={e => e.target.style.background = 'var(--accent)'}
        onMouseLeave={e => e.target.style.background = 'var(--text)'}>
        Start training
      </button>
    </nav>
  );
}

// ── Card Face: Hero ────────────────────────────────────────────────────
function CardFaceHero({ show, progress }) {
  const p = show ? progress : 0;
  const meta = clamp(p * 2.2, 0, 1);
  const patient = clamp((p - 0.3) * 2.8, 0, 1);
  return (
    <div style={{ position:'absolute', inset:0, padding:'28px', display:'flex', flexDirection:'column', opacity: show ? 1 : 0, transition:'opacity 0.55s ease' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
        <span style={{ fontFamily:'var(--font-sans)', fontSize:9, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--accent)', fontWeight:500 }}>Empathy &amp; Disclosure</span>
        <span style={{ fontFamily:'var(--font-sans)', fontSize:9, color:'var(--text-subtle)', letterSpacing:'0.06em' }}>Module 01</span>
      </div>
      <div style={{ height:1, background:'var(--border)', marginBottom:22 }} />
      <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', gap:12 }}>
        <div style={{ fontFamily:'var(--font-serif)', fontSize:26, fontWeight:600, lineHeight:1.1, letterSpacing:'-0.02em' }}>Breaking Difficult News</div>
        <p style={{ fontFamily:'var(--font-sans)', fontSize:12, color:'var(--text-muted)', lineHeight:1.65, fontWeight:300, maxWidth:290 }}>
          Master the SPIKES protocol through realistic AI-driven simulation and live coaching.
        </p>
        <div style={{
          padding:'12px 14px', background:'var(--surface-sub)', border:'1px solid var(--border)', borderRadius:8, marginTop:4,
          opacity: patient,
          transform:`translateY(${lerp(8, 0, eio(patient))}px)`,
        }}>
          <div style={{ fontFamily:'var(--font-sans)', fontSize:9, color:'var(--text-subtle)', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:5 }}>Your patient</div>
          <div style={{ fontFamily:'var(--font-serif)', fontSize:15, fontWeight:600 }}>Mr. Rodriguez, 58</div>
          <div style={{ fontFamily:'var(--font-sans)', fontSize:11, color:'var(--text-muted)', marginTop:2 }}>Awaiting biopsy results</div>
        </div>
      </div>
      <div style={{ height:1, background:'var(--border)', marginBottom:14, opacity:meta }} />
      <div style={{ display:'flex', gap:18, opacity:meta }}>
        {[['~18 min','○'],['3 lessons','◦'],['SPIKES','◈']].map(([l,ic],i) => (
          <div key={i} style={{ fontFamily:'var(--font-sans)', fontSize:10, color:'var(--text-subtle)', display:'flex', alignItems:'center', gap:4 }}>
            <span style={{ color:'var(--accent)' }}>{ic}</span>{l}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Card Face: Learn ───────────────────────────────────────────────────
function CardFaceLearn({ show, progress }) {
  const items = [
    { l:'S', label:'Setting',    desc:'Create a calm, private environment' },
    { l:'P', label:'Perception', desc:'Assess what the patient already knows' },
    { l:'I', label:'Invitation', desc:'Ask how much detail they want' },
    { l:'K', label:'Knowledge',  desc:'Deliver news in plain language' },
    { l:'E', label:'Empathy',    desc:'Acknowledge emotion without rushing' },
    { l:'S', label:'Summary',    desc:'Outline next steps together' },
  ];
  return (
    <div style={{ position:'absolute', inset:0, padding:'22px 26px', display:'flex', flexDirection:'column', opacity: show ? 1 : 0, transition:'opacity 0.55s ease' }}>
      <div style={{ fontFamily:'var(--font-sans)', fontSize:9, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--accent)', fontWeight:500, marginBottom:10 }}>Lesson 01 · SPIKES Protocol</div>
      <div style={{ height:1, background:'var(--border)', marginBottom:16 }} />
      <div style={{ display:'flex', flexDirection:'column', gap:9, flex:1 }}>
        {items.map((item, i) => {
          const t = i / items.length;
          const vis = show ? clamp((progress - t) * items.length * 1.3, 0, 1) : 0;
          return (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:10, opacity:vis, transform:`translateY(${lerp(6,0,eio(vis))}px)` }}>
              <div style={{ width:22, height:22, borderRadius:5, flexShrink:0, background:'var(--accent)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-serif)', fontSize:13, fontWeight:700, color:'white' }}>{item.l}</div>
              <div>
                <div style={{ fontFamily:'var(--font-sans)', fontSize:12, fontWeight:500, color:'var(--text)' }}>{item.label}</div>
                <div style={{ fontFamily:'var(--font-sans)', fontSize:10, color:'var(--text-muted)', lineHeight:1.4 }}>{item.desc}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Card Face: Practice ────────────────────────────────────────────────
function CardFacePractice({ show, progress, compact }) {
  const fs  = compact ? 11 : 13;
  const pad = compact ? '14px 16px' : '22px 26px';
  const gap = compact ? 8 : 12;
  const msgs = [
    { from:'patient', text:"I'm scared. What did the results show?" },
    { from:'doctor',  text:"Before I share, can I ask what you've been thinking about these tests?" },
    { from:'patient', text:"I've been thinking the worst. Please, just tell me." },
  ];
  return (
    <div style={{ position:'absolute', inset:0, padding:pad, display:'flex', flexDirection:'column', opacity: show ? 1 : 0, transition:'opacity 0.55s ease' }}>
      <style>{`@keyframes waveBar{0%,100%{transform:scaleY(.4)}50%{transform:scaleY(1)}} @keyframes livePulse{0%,100%{opacity:.4}50%{opacity:1}}`}</style>
      <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom: compact ? 10 : 16 }}>
        <div style={{ width:6, height:6, borderRadius:'50%', background:'var(--teal)', animation: show ? 'livePulse 2s ease-in-out infinite' : 'none' }} />
        <span style={{ fontFamily:'var(--font-sans)', fontSize:9, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--teal)', fontWeight:500 }}>Live · Mr. Rodriguez, 58</span>
      </div>
      <div style={{ height:1, background:'var(--border)', marginBottom: compact ? 10 : 16 }} />
      <div style={{ flex:1, display:'flex', flexDirection:'column', gap, overflow:'hidden' }}>
        {msgs.map((msg, i) => {
          const vis = compact ? 1 : show ? clamp((progress - (i+0.5)/(msgs.length+1)) * 4, 0, 1) : 0;
          return (
            <div key={i} style={{ display:'flex', justifyContent: msg.from === 'doctor' ? 'flex-end' : 'flex-start', opacity:vis }}>
              <div style={{
                maxWidth:'80%', padding: compact ? '7px 10px' : '10px 13px',
                background: msg.from === 'doctor' ? 'var(--accent)' : 'var(--surface-sub)',
                color: msg.from === 'doctor' ? 'white' : 'var(--text)',
                border: msg.from === 'patient' ? '1px solid var(--border)' : 'none',
                borderRadius: msg.from === 'doctor' ? '12px 12px 3px 12px' : '12px 12px 12px 3px',
                fontFamily:'var(--font-sans)', fontSize:fs, lineHeight:1.55, fontWeight:300,
              }}>{msg.text}</div>
            </div>
          );
        })}
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:3, marginTop: compact ? 8 : 12, opacity: compact ? 0.55 : (show && progress > 0.8 ? 0.7 : 0), transition:'opacity 0.5s' }}>
        {[0,1,2,3,4].map(i => (
          <div key={i} style={{ width:2, borderRadius:1, height: compact ? `${5+i*2}px` : `${9+i*3}px`, background:'var(--teal)', animation:`waveBar ${0.65+i*0.08}s ease-in-out infinite`, animationDelay:`${i*0.1}s` }} />
        ))}
        <span style={{ fontFamily:'var(--font-sans)', fontSize:9, color:'var(--teal)', marginLeft:5, letterSpacing:'0.04em' }}>Speaking…</span>
      </div>
    </div>
  );
}

// ── Card Face: Progress ────────────────────────────────────────────────
function CardFaceProgress({ show, progress }) {
  const dims = [
    { label:'Checking understanding',   score:82, color:'var(--accent)' },
    { label:'Emotional acknowledgment', score:74, color:'var(--teal)' },
    { label:'Plain language',           score:90, color:'var(--gold)' },
    { label:'Pacing & silence',         score:68, color:'oklch(60% 0.13 320)' },
  ];
  return (
    <div style={{ position:'absolute', inset:0, padding:'22px 26px', display:'flex', flexDirection:'column', opacity: show ? 1 : 0, transition:'opacity 0.55s ease' }}>
      <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:10 }}>
        <div style={{ width:16, height:16, borderRadius:'50%', background:'var(--teal)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <svg width="8" height="8" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <span style={{ fontFamily:'var(--font-sans)', fontSize:9, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--teal)', fontWeight:500 }}>Module complete</span>
      </div>
      <div style={{ fontFamily:'var(--font-serif)', fontSize:17, fontWeight:600, letterSpacing:'-0.01em', marginBottom:14 }}>Breaking Difficult News</div>
      <div style={{ height:1, background:'var(--border)', marginBottom:16 }} />
      <div style={{ flex:1, display:'flex', flexDirection:'column', gap:12 }}>
        {dims.map((d, i) => {
          const t = i / dims.length;
          const vis = show ? clamp((progress - t) * dims.length * 1.2, 0, 1) : 0;
          const barW = show ? d.score * eio(clamp((progress - t - 0.1) * dims.length, 0, 1)) : 0;
          return (
            <div key={i} style={{ opacity:vis }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                <span style={{ fontFamily:'var(--font-sans)', fontSize:10, color:'var(--text-muted)' }}>{d.label}</span>
                <span style={{ fontFamily:'var(--font-sans)', fontSize:10, fontWeight:500, color:d.color }}>{d.score}</span>
              </div>
              <div style={{ height:3, background:'var(--border)', borderRadius:2, overflow:'hidden' }}>
                <div style={{ height:'100%', background:d.color, borderRadius:2, width:`${barW}%` }} />
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ height:1, background:'var(--border)', margin:'14px 0', opacity: show ? clamp(progress * 2.5, 0, 1) : 0 }} />
      <div style={{ fontFamily:'var(--font-sans)', fontSize:11, color:'var(--accent)', fontWeight:500, opacity: show && progress > 0.82 ? 1 : 0, transition:'opacity 0.5s' }}>
        Begin next module →
      </div>
    </div>
  );
}

// ── Coach Panel ───────────────────────────────────────────────────────
function CoachPanel({ show, progress, cardH }) {
  return (
    <div style={{
      width:256, height:cardH, background:'var(--dark)', border:'1px solid var(--border-dark)',
      borderRadius:14, overflow:'hidden', flexShrink:0,
      opacity: show ? 1 : 0,
      transform: show ? 'translateX(0)' : 'translateX(24px)',
      transition:'opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)',
    }}>
      <div style={{ padding:'16px 18px', borderBottom:'1px solid var(--border-dark)', display:'flex', alignItems:'center', gap:8 }}>
        <div style={{ width:6, height:6, borderRadius:'50%', background:'var(--teal)', animation: show ? 'livePulse 2s ease-in-out infinite' : 'none' }} />
        <span style={{ fontFamily:'var(--font-sans)', fontSize:10, color:'oklch(58% 0.01 240)', letterSpacing:'0.08em', textTransform:'uppercase', fontWeight:500 }}>ClinAI Coach</span>
      </div>
      <div style={{ padding:'14px 16px', display:'flex', flexDirection:'column', gap:10 }}>
        {[
          { color:'var(--teal)', label:'After exchange 1', text:'Good — you checked in first. Now ask what he already knows before continuing.' },
          { color:'var(--gold)', label:'Pacing',           text:'Allow silence after delivering news. Let the patient lead; do not fill the space.' },
        ].map((note, i) => (
          <div key={i} style={{
            background:'oklch(13% 0.02 245)', border:'1px solid var(--border-dark)',
            borderLeft:`2px solid ${note.color}`, padding:'12px',
            opacity: show && progress > (i * 0.4 + 0.15) ? 1 : 0, transition:'opacity 0.6s',
          }}>
            <div style={{ fontFamily:'var(--font-sans)', fontSize:8, color:note.color, fontWeight:500, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:7 }}>{note.label}</div>
            <p style={{ fontFamily:'var(--font-sans)', fontSize:11, color:'oklch(64% 0.01 240)', lineHeight:1.6, fontWeight:300 }}>{note.text}</p>
          </div>
        ))}
        <div style={{ marginTop:2 }}>
          <div style={{ fontFamily:'var(--font-sans)', fontSize:8, color:'oklch(30% 0.01 240)', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:7 }}>SPIKES ref</div>
          <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
            {['Setting','Perception','Invitation','Knowledge','Empathy','Summary'].map((s,i) => (
              <div key={i} style={{ fontFamily:'var(--font-sans)', fontSize:9, color:'oklch(38% 0.01 240)', background:'oklch(12% 0.02 245)', padding:'2px 7px', borderRadius:100, border:'1px solid oklch(18% 0.015 245)' }}>
                <strong style={{ color:'var(--teal)' }}>{s[0]}</strong>{s.slice(1)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Animated card stage ────────────────────────────────────────────────
function AnimatedCardStage({ phase, progress, visible, panelW, panelH }) {
  const W = [420, 480, 520, 300, 460];
  const H = [285, 392, 420, 420, 342];
  const isCoach = phase === 3;

  const nw = W[Math.min(phase, 4)];  // natural card width
  const nh = H[Math.min(phase, 4)];  // natural card height
  const stageNW = isCoach ? nw + 16 + 256 : nw;  // natural stage width

  // Compute scale so the stage fits in the available panel space.
  // transform: scale() does NOT affect layout, so we set explicit wrapper
  // dimensions equal to (naturalSize × scale) and position content inside.
  const availW = Math.max(1, panelW - 48);
  const availH = Math.max(1, panelH - 80);
  const scale  = Math.min(1, availW / stageNW, availH / nh);

  const displayW = stageNW * scale;
  const displayH = nh * scale;

  return (
    <div style={{
      opacity: visible ? 1 : 0, transition:'opacity 0.8s',
      position:'relative', flexShrink:0,
      width: displayW, height: displayH,
    }}>
      {/* Depth shadow layers — sized and offset in scaled space */}
      {!isCoach && (
        <div style={{ position:'absolute', inset:0, pointerEvents:'none', overflow:'visible' }}>
          <div style={{
            position:'absolute', width:nw*scale, height:nh*scale,
            background:'white', borderRadius:14, border:'1px solid oklch(93% 0.005 240)',
            transform:`translate(${-5*scale}px,${14*scale}px) scale(0.94)`,
            transformOrigin:'center center',
            opacity:0.3, transition:'all 0.8s cubic-bezier(0.16,1,0.3,1)',
          }} />
          <div style={{
            position:'absolute', width:nw*scale, height:nh*scale,
            background:'white', borderRadius:14, border:'1px solid oklch(90% 0.006 240)',
            transform:`translate(${-3*scale}px,${8*scale}px) scale(0.97)`,
            transformOrigin:'center center',
            opacity:0.55, boxShadow:'0 4px 20px oklch(0% 0 0 / 0.04)',
            transition:'all 0.8s cubic-bezier(0.16,1,0.3,1)',
          }} />
        </div>
      )}

      {/* Content rendered at natural size, scaled from top-left so it
          fills exactly displayW × displayH without overflowing the wrapper. */}
      <div style={{
        position:'absolute', top:0, left:0,
        display:'flex', alignItems:'flex-start',
        transformOrigin:'top left',
        transform:`scale(${scale})`,
        transition:'transform 0.8s cubic-bezier(0.16,1,0.3,1)',
      }}>
        {/* Main card */}
        <div style={{
          position:'relative', zIndex:2, flexShrink:0, overflow:'hidden',
          width:nw, height:nh,
          background:'white', border:'1px solid oklch(88% 0.008 240)', borderRadius:14,
          boxShadow:'0 12px 72px oklch(0% 0 0 / 0.1), 0 2px 16px oklch(0% 0 0 / 0.05)',
          transition:'all 0.8s cubic-bezier(0.16,1,0.3,1)',
        }}>
          <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'var(--accent)', opacity: phase === 0 ? clamp(progress * 2, 0, 1) : 1, transition:'opacity 0.5s' }} />
          <CardFaceHero     show={phase === 0} progress={progress} />
          <CardFaceLearn    show={phase === 1} progress={progress} />
          <CardFacePractice show={phase === 2} progress={progress} />
          <CardFacePractice show={phase === 3} progress={1} compact />
          <CardFaceProgress show={phase === 4} progress={progress} />
        </div>

        {/* Coach panel — only mounted when active to keep stage width tight */}
        {isCoach && (
          <>
            <div style={{ width:16, flexShrink:0 }} />
            <CoachPanel show progress={progress} cardH={nh} />
          </>
        )}
      </div>
    </div>
  );
}

// ── Narrative chapters ─────────────────────────────────────────────────
const CHAPTERS = [
  { tag:null, lines:[{text:'The art of medicine,'},{text:'practiced.',accent:true,italic:true}],
    body:'Immersive simulation. Real-time AI coaching. A new standard for clinical communication.', cta:true },
  { tag:'01 — Learn', lines:[{text:'One concept.'},{text:'Deeply'},{text:'understood.'}],
    body:'Each module opens with a single precise lesson — only what matters, explained with clinical clarity.' },
  { tag:'02 — Practice', lines:[{text:'Enter the'},{text:'scenario.'}],
    body:'Step into a realistic patient interaction. The AI responds with emotional nuance, memory, and human unpredictability.' },
  { tag:'03 — Coach', lines:[{text:'Your coach'},{text:'never stops'},{text:'watching.'}],
    body:'A second AI observes every exchange — speaking at exactly the right moment with specific, actionable clinical insight.' },
  { tag:'04 — Progress', lines:[{text:'Master it.'},{text:'Module by'},{text:'module.'}],
    body:'Each session scored across dimensions that matter: empathy, clarity, pacing. See exactly how you grow.' },
];

function NarrativeText({ phase, progress, onEnterModule, vw }) {
  const lPad = Math.max(24, Math.min(80, vw * 0.06));
  return (
    <div style={{ position:'relative', height:'100%', width:'100%' }}>
      {CHAPTERS.map((ch, i) => {
        const active = phase === i;
        return (
          <div key={i} style={{
            position:'absolute', inset:0, display:'flex', flexDirection:'column', justifyContent:'center',
            padding:`0 16px 0 ${lPad}px`,
            opacity: active ? 1 : 0,
            transform: active ? 'translateY(0)' : phase < i ? 'translateY(18px)' : 'translateY(-18px)',
            transition:'opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)',
            pointerEvents: active ? 'auto' : 'none',
          }}>
            {ch.tag && (
              <div style={{ fontFamily:'var(--font-sans)', fontSize:11, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--accent)', fontWeight:500, marginBottom:28 }}>{ch.tag}</div>
            )}
            <h2 style={{ fontFamily:'var(--font-serif)', fontWeight:600, fontSize:'clamp(44px,4.2vw,70px)', lineHeight:1.03, letterSpacing:'-0.025em', marginBottom:28 }}>
              {ch.lines.map((line, li) => (
                <span key={li} style={{ display:'block', color: line.accent ? 'var(--accent)' : 'inherit', fontStyle: line.italic ? 'italic' : 'normal' }}>
                  {line.text}
                </span>
              ))}
            </h2>
            <p style={{ fontFamily:'var(--font-sans)', fontSize:16, color:'var(--text-muted)', lineHeight:1.7, fontWeight:300, maxWidth:360, marginBottom: ch.cta ? 44 : 0 }}>{ch.body}</p>
            {ch.cta && (
              <div style={{ display:'flex', gap:12 }}>
                <HoverButton primary onClick={() => onEnterModule(MODULES[0])}>Begin training →</HoverButton>
                <HoverButton onClick={() => { const el = document.getElementById('post-story'); if (el) el.scrollIntoView({ behavior:'smooth' }); }}>
                  Explore modules
                </HoverButton>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Ambient glow ──────────────────────────────────────────────────────
function AmbientGlow({ phase }) {
  const gs = [
    'radial-gradient(ellipse 55% 55% at 68% 48%, oklch(52% 0.16 235 / 0.055), transparent 70%)',
    'radial-gradient(ellipse 55% 55% at 70% 46%, oklch(52% 0.16 235 / 0.065), transparent 70%)',
    'radial-gradient(ellipse 55% 55% at 72% 48%, oklch(58% 0.13 185 / 0.065), transparent 70%)',
    'radial-gradient(ellipse 60% 60% at 75% 48%, oklch(58% 0.13 185 / 0.08),  transparent 70%)',
    'radial-gradient(ellipse 55% 55% at 68% 50%, oklch(58% 0.13 185 / 0.05),  transparent 70%)',
  ];
  return (
    <div style={{
      position:'fixed', inset:0, zIndex:0, pointerEvents:'none',
      background: gs[Math.min(phase, 4)],
      transition:'background 1.4s ease',
    }} />
  );
}

// ── Vertical story divider ────────────────────────────────────────────
function StoryDivider({ visible, left }) {
  return (
    <div style={{
      position:'fixed', top:60, left:`${left || 44}%`, width:1, height:'calc(100vh - 60px)',
      background:'var(--border)', zIndex:8, pointerEvents:'none',
      opacity: visible ? 1 : 0, transition:'opacity 0.8s',
    }} />
  );
}

// ── Scroll hint ────────────────────────────────────────────────────────
function ScrollHint({ visible, left }) {
  return (
    <div style={{
      position:'fixed', bottom:36, left: left || 48, zIndex:100, pointerEvents:'none',
      opacity: visible ? 0.5 : 0, transition:'opacity 1s',
      display:'flex', flexDirection:'column', gap:8,
    }}>
      <span style={{ fontFamily:'var(--font-sans)', fontSize:10, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--text-subtle)' }}>Scroll</span>
      <div style={{ width:1, height:36, background:'linear-gradient(var(--text-subtle), transparent)' }} />
    </div>
  );
}

// ── Module card (post-story) ──────────────────────────────────────────
function ModuleCard({ module: m, onEnter }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} onClick={() => m.available && onEnter(m)} style={{
      padding:'36px 32px', background:'var(--surface)', border:'1px solid var(--border)',
      cursor: m.available ? 'pointer' : 'default', position:'relative', overflow:'hidden',
      transition:'all 0.4s var(--ease-spring)',
      transform: hov && m.available ? 'translateY(-5px)' : 'none',
      boxShadow: hov && m.available ? '0 20px 60px oklch(0% 0 0 / 0.07)' : 'none',
    }}>
      <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:m.accentColor, transform: hov && m.available ? 'scaleX(1)' : 'scaleX(0.2)', transformOrigin:'left', transition:'transform 0.5s var(--ease-spring)' }} />
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 }}>
        <div>
          <div style={{ fontFamily:'var(--font-sans)', fontSize:10, letterSpacing:'0.08em', textTransform:'uppercase', color:m.accentColor, marginBottom:8, fontWeight:500 }}>{m.category}</div>
          <h3 style={{ fontFamily:'var(--font-serif)', fontSize:22, fontWeight:600, lineHeight:1.15, letterSpacing:'-0.01em' }}>{m.title}</h3>
        </div>
        {!m.available && <div style={{ fontFamily:'var(--font-sans)', fontSize:10, background:'var(--surface-sub)', color:'var(--text-subtle)', padding:'3px 10px', borderRadius:100, fontWeight:500, whiteSpace:'nowrap' }}>Coming soon</div>}
        {m.underConstruction && <div style={{ fontFamily:'var(--font-sans)', fontSize:10, background:'oklch(97% 0.07 72)', color:'oklch(52% 0.14 72)', border:'1px solid oklch(85% 0.1 72)', padding:'3px 10px', borderRadius:100, fontWeight:600, whiteSpace:'nowrap' }}>🚧 Under construction</div>}
      </div>
      <p style={{ fontFamily:'var(--font-sans)', fontSize:13, color:'var(--text-muted)', lineHeight:1.65, fontWeight:300, marginBottom:24 }}>{m.desc}</p>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <span style={{ fontFamily:'var(--font-sans)', fontSize:11, color:'var(--text-subtle)' }}>{m.duration}</span>
        {m.available && <span style={{ fontFamily:'var(--font-sans)', fontSize:12, color:m.accentColor, fontWeight:500, transform: hov ? 'translateX(4px)' : 'none', transition:'transform 0.3s var(--ease-spring)', display:'inline-block' }}>Begin →</span>}
      </div>
    </div>
  );
}

// ── Post-story sections ────────────────────────────────────────────────
function PostStory({ onEnterModule }) {
  return (
    <div id="post-story" style={{ position:'relative', zIndex:20, background:'var(--bg)' }}>
      <div style={{ padding:'140px 80px', background:'var(--bg-alt)' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ marginBottom:64 }}>
            <div style={{ fontFamily:'var(--font-sans)', fontSize:11, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--text-subtle)', marginBottom:16 }}>All modules</div>
            <h2 style={{ fontFamily:'var(--font-serif)', fontSize:'clamp(36px,4vw,52px)', fontWeight:600, lineHeight:1.05, letterSpacing:'-0.02em' }}>
              One skill. One session.<br /><em style={{ fontStyle:'italic', color:'var(--accent)' }}>Mastered.</em>
            </h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:12 }}>
            {MODULES.map(m => <ModuleCard key={m.id} module={m} onEnter={onEnterModule} />)}
          </div>
        </div>
      </div>

      <div style={{ padding:'140px 80px', textAlign:'center', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:700, height:500, background:'radial-gradient(ellipse, oklch(52% 0.16 235 / 0.05) 0%, transparent 70%)', pointerEvents:'none' }} />
        <h2 style={{ fontFamily:'var(--font-serif)', fontSize:'clamp(44px,6vw,80px)', fontWeight:600, lineHeight:1.03, letterSpacing:'-0.025em', marginBottom:28, position:'relative' }}>
          Train like it matters.<br /><em style={{ fontStyle:'italic', color:'var(--accent)' }}>Because it does.</em>
        </h2>
        <p style={{ fontFamily:'var(--font-sans)', fontSize:16, color:'var(--text-muted)', maxWidth:420, margin:'0 auto 48px', lineHeight:1.7, fontWeight:300 }}>
          The conversations that define patient care don't happen in a textbook.
        </p>
        <HoverButton primary large onClick={() => onEnterModule(MODULES[0])}>
          Open "Breaking Difficult News" →
        </HoverButton>
      </div>

      <footer style={{ borderTop:'1px solid var(--border)', padding:'32px 80px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <div style={{ width:20, height:20, borderRadius:5, background:'var(--accent)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="10" height="10" viewBox="0 0 14 14" fill="none"><path d="M7 1v12M1 7h12" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
          </div>
          <span style={{ fontFamily:'var(--font-sans)', fontWeight:600, fontSize:13 }}>ClinAI</span>
        </div>
        <div style={{ fontFamily:'var(--font-sans)', fontSize:12, color:'var(--text-subtle)' }}>© 2026 ClinAI. Designed for medical excellence.</div>
      </footer>
    </div>
  );
}

// ── Landing Page ──────────────────────────────────────────────────────
function LandingPage({ onEnterModule }) {
  const { phase, progress, scrollY } = useScrollPhase();
  const { w: vw, h: vh } = useWindowSize();
  const storyH = PHASE_COUNT * CHAPTER_VH * vh;
  const storyVisible = scrollY < storyH + vh * 0.4;
  const isMobile = vw < 700;

  // Split percentages — widen left on narrower screens so text has room
  const leftPct  = isMobile ? 100 : vw < 1000 ? 46 : 44;
  const rightPct = 100 - leftPct;
  const leftPx   = vw * leftPct / 100;
  const panelW   = vw * rightPct / 100;
  const panelH   = vh - 60;
  const lPad     = Math.max(24, Math.min(80, vw * 0.06));

  return (
    <div>
      <Nav onEnterModule={onEnterModule} phase={phase} />
      <AmbientGlow phase={phase} />
      {!isMobile && <StoryDivider visible={storyVisible} left={leftPct} />}

      {/* Narrative text — fixed left panel */}
      <div style={{ position:'fixed', top:60, left:0, width:`${leftPct}%`, height:`${panelH}px`, zIndex:15, pointerEvents:'none' }}>
        <NarrativeText phase={phase} progress={progress} onEnterModule={onEnterModule} vw={vw} />
      </div>

      {/* Animated card — fixed right panel (hidden on mobile) */}
      {!isMobile && (
        <div style={{ position:'fixed', top:60, right:0, width:`${rightPct}%`, height:`${panelH}px`, zIndex:10, display:'flex', alignItems:'center', justifyContent:'center', pointerEvents:'none' }}>
          <AnimatedCardStage phase={phase} progress={progress} visible={storyVisible} panelW={panelW} panelH={panelH} />
        </div>
      )}

      <ScrollHint visible={storyVisible && phase === 0 && progress < 0.3} left={lPad} />

      {/* Scroll spacer */}
      <div style={{ height:`${PHASE_COUNT * CHAPTER_VH * 100}vh` }} />

      <PostStory onEnterModule={onEnterModule} />
    </div>
  );
}

Object.assign(window, { LandingPage, MODULES, HoverButton });
