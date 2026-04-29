// Module.jsx — ClinAI Module Experience
const { useState, useEffect, useRef } = React;

// ─── Lesson slides data ───────────────────────────────────────────────
const LESSON_SLIDES = [
  {
    tag: 'Framework',
    headline: 'The SPIKES Protocol',
    sub: 'A six-step structure for delivering serious medical news with compassion and clarity.',
    body: null,
    visual: [
      { letter: 'S', label: 'Setting',    desc: 'Create a private, calm environment.' },
      { letter: 'P', label: 'Perception', desc: "Assess what the patient already knows." },
      { letter: 'I', label: 'Invitation', desc: 'Ask how much information they want.' },
      { letter: 'K', label: 'Knowledge',  desc: 'Deliver the news with plain language.' },
      { letter: 'E', label: 'Empathy',    desc: 'Acknowledge emotions without rushing.' },
      { letter: 'S', label: 'Summary',    desc: 'Outline next steps together.' },
    ],
  },
  {
    tag: 'Principle',
    headline: 'Check before you speak.',
    sub: 'The most common mistake is delivering information before understanding where the patient is emotionally.',
    body: `"Before I share what I found, can I ask what you\u2019ve been thinking about these tests?" \u2014 This one question changes everything.`,
    visual: null,
  },
  {
    tag: 'Technique',
    headline: 'Silence is clinical.',
    sub: 'After delivering difficult news, the pause is not empty — it is an act of care.',
    body: 'Resist the urge to fill silence with reassurance. Let the patient process. They will tell you what they need next.',
    visual: null,
  },
];

// ─── Scripted demo responses (replaces window.claude.complete) ────────
const PATIENT_RESPONSES = [
  "I see… I've been trying not to think the worst, but part of me knew something wasn't right. Can you tell me more?",
  "That's… a lot to take in. What does this mean for me? Am I going to be okay?",
  "I just — I have a family. Two kids. What do we do next? Is there treatment?",
  "I appreciate you being honest with me, doctor. What are my options?",
  "Okay. Okay, I need a moment. Can you give me a moment?",
];

const COACH_RESPONSES = [
  "Good opening — you created space before delivering information. Next, use the 'Invitation' step: ask explicitly how much detail Mr. Rodriguez wants right now.",
  "You acknowledged his fear without dismissing it. Consider using a short empathic statement before moving to clinical information — 'That makes complete sense to feel that way.'",
  "Strong use of plain language. Watch your pacing here — after mentioning treatment options, pause and let him absorb. Silence is therapeutic.",
  "Excellent — you followed his lead rather than driving the conversation. This reflects SPIKES well. Continue checking his understanding before adding more information.",
  "Well handled. Consider ending this exchange with a clear summary of the next concrete step so he leaves with something actionable to hold on to.",
];

let patientResponseIdx = 0;
let coachResponseIdx = 0;

async function simulateComplete(prompt) {
  await new Promise(r => setTimeout(r, 900 + Math.random() * 600));
  if (prompt.includes('Mr. Rodriguez responds')) {
    const reply = PATIENT_RESPONSES[patientResponseIdx % PATIENT_RESPONSES.length];
    patientResponseIdx++;
    return reply;
  } else {
    const reply = COACH_RESPONSES[coachResponseIdx % COACH_RESPONSES.length];
    coachResponseIdx++;
    return reply;
  }
}

// ─── Module Intro ─────────────────────────────────────────────────────
function ModuleIntro({ module: m, onStart, onBack }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 60); }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <div style={{ height: 64, display: 'flex', alignItems: 'center', padding: '0 48px', borderBottom: '1px solid var(--border)', justifyContent: 'space-between' }}>
        <button onClick={onBack} style={{ fontFamily: 'var(--font-sans)', fontSize: 14, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
          ← Back
        </button>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-subtle)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Module {m.id} of 14
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '60px 48px' }}>
        <div style={{
          maxWidth: 680, width: '100%', textAlign: 'center',
          opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(24px)',
          transition: 'all 0.8s var(--ease-spring)',
        }}>
          <div style={{ display: 'inline-block', background: 'var(--accent-light)', color: 'var(--accent)', fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '6px 16px', borderRadius: 100, marginBottom: 36 }}>
            {m.category}
          </div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(44px, 6vw, 72px)', fontWeight: 600, lineHeight: 1.04, letterSpacing: '-0.025em', marginBottom: 24 }}>
            {m.title}
          </h1>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 17, color: 'var(--text-muted)', lineHeight: 1.7, fontWeight: 300, marginBottom: 56 }}>
            {m.desc}
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 40, marginBottom: 56, paddingBottom: 56, borderBottom: '1px solid var(--border)' }}>
            {[
              { label: 'Duration', val: m.duration },
              { label: 'Slides', val: '3 lessons' },
              { label: 'Practice', val: '1 scenario' },
            ].map((item, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em', marginBottom: 4 }}>{item.val}</div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.label}</div>
              </div>
            ))}
          </div>

          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '28px 32px', marginBottom: 48, textAlign: 'left', display: 'flex', gap: 20, alignItems: 'center' }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--surface-sub)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>👤</div>
            <div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--text-subtle)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Your patient today</div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em' }}>{m.scenario.name}, {m.scenario.age}</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{m.scenario.context}</div>
            </div>
          </div>

          <HoverButton primary large onClick={onStart}>Begin module</HoverButton>
        </div>
      </div>
    </div>
  );
}

// ─── Lesson slide ─────────────────────────────────────────────────────
function LessonView({ onNext, onBack, slideIdx }) {
  const slide = LESSON_SLIDES[slideIdx];
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(false); setTimeout(() => setMounted(true), 50); }, [slideIdx]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <div style={{ height: 3, background: 'var(--border)' }}>
        <div style={{ height: '100%', background: 'var(--accent)', width: `${((slideIdx + 1) / LESSON_SLIDES.length) * 100}%`, transition: 'width 0.6s var(--ease-spring)' }} />
      </div>

      <div style={{ height: 60, display: 'flex', alignItems: 'center', padding: '0 48px', borderBottom: '1px solid var(--border)', justifyContent: 'space-between' }}>
        <button onClick={onBack} style={{ fontFamily: 'var(--font-sans)', fontSize: 13, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>← Back</button>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-subtle)' }}>
          Lesson {slideIdx + 1} of {LESSON_SLIDES.length}
        </div>
        <div style={{ width: 60 }} />
      </div>

      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '60px 48px',
        opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(20px)',
        transition: 'all 0.6s var(--ease-spring)',
      }}>
        <div style={{ maxWidth: 800, width: '100%' }}>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--accent)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500, marginBottom: 24 }}>{slide.tag}</div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 600, lineHeight: 1.06, letterSpacing: '-0.02em', marginBottom: 20, maxWidth: 640 }}>{slide.headline}</h2>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 17, color: 'var(--text-muted)', lineHeight: 1.7, fontWeight: 300, marginBottom: slide.body || slide.visual ? 48 : 0, maxWidth: 560 }}>{slide.sub}</p>

          {slide.visual && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {slide.visual.map((item, i) => (
                <div key={i} style={{
                  padding: '24px', background: 'var(--surface)', border: '1px solid var(--border)',
                  transition: 'all 0.3s var(--ease-spring)',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 700 }}>{item.letter}</div>
                    <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 14, color: 'var(--text)' }}>{item.label}</span>
                  </div>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, fontWeight: 300 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          )}

          {slide.body && !slide.visual && (
            <div style={{ borderLeft: '3px solid var(--accent)', paddingLeft: 24 }}>
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: 22, color: 'var(--text)', lineHeight: 1.6, fontStyle: 'italic', fontWeight: 500 }}>{slide.body}</p>
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: '24px 48px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end' }}>
        <HoverButton primary onClick={onNext}>
          {slideIdx < LESSON_SLIDES.length - 1 ? 'Next →' : 'Begin simulation →'}
        </HoverButton>
      </div>
    </div>
  );
}

// ─── Bridge screen ────────────────────────────────────────────────────
function BridgeScreen({ module: m, onEnter }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 60); }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 48px' }}>
      <div style={{
        textAlign: 'center', maxWidth: 580,
        opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(24px)',
        transition: 'all 0.9s var(--ease-spring)',
      }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'oklch(14% 0.02 245)', border: '1px solid var(--border-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 36px', fontSize: 28 }}>👤</div>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--teal)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500, marginBottom: 20 }}>Simulation begins</div>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 600, lineHeight: 1.06, letterSpacing: '-0.02em', color: 'oklch(94% 0.008 240)', marginBottom: 20 }}>
          You're about to meet<br />{m.scenario.name}.
        </h2>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 16, color: 'oklch(52% 0.012 240)', lineHeight: 1.7, fontWeight: 300, marginBottom: 48 }}>
          He's 58, anxious, and waiting for results. Your coach will be watching silently — intervening only when it counts. There are no wrong moves, only moments to learn from.
        </p>
        <button onClick={onEnter} style={{
          fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 500,
          background: 'var(--teal)', color: 'white', border: 'none',
          padding: '14px 36px', borderRadius: 100, cursor: 'pointer',
          transition: 'all 0.28s var(--ease-spring)',
        }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = '0 8px 32px oklch(58% 0.13 185 / 0.35)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
          Enter simulation →
        </button>
      </div>
    </div>
  );
}

// ─── Conversation ─────────────────────────────────────────────────────
function ConversationView({ module: m, onFinish }) {
  const [messages, setMessages] = useState([
    { role: 'patient', text: "Doctor… is everything okay? They said you needed to talk to me after the labs came back." }
  ]);
  const [coachNotes, setCoachNotes] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [coachLoading, setCoachLoading] = useState(false);
  const [turnCount, setTurnCount] = useState(0);
  const chatRef = useRef();

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, coachNotes]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    const newMessages = [...messages, { role: 'student', text: userMsg }];
    setMessages(newMessages);
    setLoading(true);
    setCoachLoading(true);

    const complete = (window.claude && window.claude.complete) ? window.claude.complete : simulateComplete;

    try {
      const patientPrompt = `[System: You are Mr. Rodriguez, a 58-year-old construction supervisor. You've come in for your follow-up appointment. You're anxious about your test results but trying to stay composed. Respond naturally and emotionally in 2-3 sentences.]\n\nConversation so far:\n${newMessages.map(msg => `${msg.role === 'student' ? 'Doctor' : 'Mr. Rodriguez'}: ${msg.text}`).join('\n')}\n\nMr. Rodriguez responds:`;

      const patientReply = await complete({ messages: [{ role: 'user', content: patientPrompt }] });
      const updatedMsgs = [...newMessages, { role: 'patient', text: patientReply }];
      setMessages(updatedMsgs);
      setLoading(false);

      if (turnCount < 3 || turnCount % 2 === 0) {
        const coachPrompt = `[System: You are a clinical communication coach. After each student message, provide ONE specific actionable tip in 2 sentences referencing SPIKES when relevant.]\n\nConversation:\n${updatedMsgs.map(msg => `${msg.role === 'student' ? 'Student' : 'Mr. Rodriguez'}: ${msg.text}`).join('\n')}\n\nCoach feedback on the student's last message:`;

        const coachReply = await complete({ messages: [{ role: 'user', content: coachPrompt }] });
        setCoachNotes(cn => [...cn, { text: coachReply, turn: turnCount }]);
      }
      setCoachLoading(false);
      setTurnCount(t => t + 1);
    } catch (err) {
      setLoading(false);
      setCoachLoading(false);
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <div style={{ height: 60, flexShrink: 0, display: 'flex', alignItems: 'center', padding: '0 32px', borderBottom: '1px solid var(--border)', justifyContent: 'space-between', background: 'var(--surface)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--teal)' }} />
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>Live simulation — {m.scenario.name}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-subtle)' }}>{turnCount} exchange{turnCount !== 1 ? 's' : ''}</span>
          <button onClick={onFinish} style={{ fontFamily: 'var(--font-sans)', fontSize: 13, background: 'var(--surface-sub)', border: '1px solid var(--border)', color: 'var(--text-muted)', padding: '7px 18px', borderRadius: 100, cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--text)'; e.currentTarget.style.color = 'var(--bg)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface-sub)'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
            End &amp; review
          </button>
        </div>
      </div>

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 340px', overflow: 'hidden' }}>
        <div style={{ display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--border)' }}>
          <div ref={chatRef} style={{ flex: 1, overflow: 'auto', padding: '32px 40px', display: 'flex', flexDirection: 'column', gap: 18 }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: msg.role === 'student' ? 'flex-end' : 'flex-start',
                animation: 'fadeUp 0.4s var(--ease-spring)',
              }}>
                {msg.role === 'patient' && (
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--surface-sub)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, marginRight: 10, flexShrink: 0, alignSelf: 'flex-end' }}>👤</div>
                )}
                <div style={{
                  maxWidth: '68%', padding: '14px 18px',
                  background: msg.role === 'student' ? 'var(--accent)' : 'var(--surface)',
                  color: msg.role === 'student' ? 'white' : 'var(--text)',
                  border: msg.role === 'patient' ? '1px solid var(--border)' : 'none',
                  borderRadius: msg.role === 'student' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  fontFamily: 'var(--font-sans)', fontSize: 15, lineHeight: 1.65, fontWeight: 300,
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--surface-sub)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0 }}>👤</div>
                <div style={{ padding: '14px 20px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '18px 18px 18px 4px', display: 'flex', gap: 5, alignItems: 'center' }}>
                  {[0,1,2].map(i => (
                    <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-subtle)', animation: `pulse 1.2s ${i * 0.2}s ease-in-out infinite` }} />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div style={{ padding: '20px 32px', borderTop: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', gap: 12, alignItems: 'center' }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
              placeholder="Respond as the doctor…"
              disabled={loading}
              style={{
                flex: 1, fontFamily: 'var(--font-sans)', fontSize: 15, background: 'var(--bg)', border: '1px solid var(--border)',
                borderRadius: 12, padding: '12px 18px', color: 'var(--text)', outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
            <button onClick={send} disabled={loading || !input.trim()} style={{
              width: 44, height: 44, borderRadius: '50%', background: input.trim() && !loading ? 'var(--accent)' : 'var(--border)',
              border: 'none', cursor: input.trim() && !loading ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.25s var(--ease-spring)',
              transform: input.trim() && !loading ? 'scale(1)' : 'scale(0.9)',
            }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 2.5v11M3 8l5-5.5L13 8" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        <div style={{ background: 'var(--dark)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '24px 24px 20px', borderBottom: '1px solid var(--border-dark)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--teal)', animation: 'pulse 2s ease-in-out infinite' }} />
            <div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 500, color: 'oklch(88% 0.01 240)' }}>ClinAI Coach</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'oklch(44% 0.01 240)' }}>Observing your session</div>
            </div>
          </div>
          <div style={{ flex: 1, overflow: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {coachNotes.length === 0 && !coachLoading && (
              <div style={{ padding: '20px', opacity: 0.5 }}>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'oklch(50% 0.01 240)', lineHeight: 1.6, fontWeight: 300 }}>
                  Begin the conversation. Your coach will surface insights as you go.
                </p>
              </div>
            )}
            {coachNotes.map((note, i) => (
              <div key={i} style={{
                padding: '16px', background: 'oklch(13% 0.02 245)', border: '1px solid var(--border-dark)', borderLeft: '3px solid var(--teal)',
                animation: 'fadeUp 0.5s var(--ease-spring)',
              }}>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: 10, color: 'var(--teal)', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>
                  After exchange {note.turn + 1}
                </div>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'oklch(72% 0.01 240)', lineHeight: 1.65, fontWeight: 300 }}>{note.text}</p>
              </div>
            ))}
            {coachLoading && (
              <div style={{ padding: '14px 16px', background: 'oklch(13% 0.02 245)', border: '1px solid var(--border-dark)', display: 'flex', gap: 5, alignItems: 'center' }}>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--teal)', marginRight: 8 }}>Analyzing…</div>
                {[0,1,2].map(i => (
                  <div key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--teal)', opacity: 0.6, animation: `pulse 1.2s ${i * 0.2}s ease-in-out infinite` }} />
                ))}
              </div>
            )}
          </div>

          <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border-dark)' }}>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 10, color: 'oklch(35% 0.01 240)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>SPIKES ref</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {['Setting', 'Perception', 'Invitation', 'Knowledge', 'Empathy', 'Summary'].map((s, i) => (
                <div key={i} style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'oklch(48% 0.012 240)', background: 'oklch(12% 0.02 245)', padding: '3px 10px', borderRadius: 100, border: '1px solid var(--border-dark)' }}>
                  <strong style={{ color: 'var(--teal)', marginRight: 3 }}>{s[0]}</strong>{s.slice(1)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`@keyframes fadeUp { from { opacity:0;transform:translateY(10px); } to { opacity:1;transform:none; } } @keyframes pulse { 0%,100%{opacity:.4} 50%{opacity:1} }`}</style>
    </div>
  );
}

// ─── Feedback ─────────────────────────────────────────────────────────
function FeedbackView({ module: m, onRetry, onBack }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 80); }, []);
  const dims = [
    { label: 'Checking for understanding', score: 82, color: 'var(--accent)' },
    { label: 'Emotional acknowledgment',   score: 74, color: 'var(--teal)' },
    { label: 'Plain language use',         score: 90, color: 'var(--gold)' },
    { label: 'Pacing and silence',         score: 68, color: 'oklch(60% 0.13 320)' },
  ];
  const overall = Math.round(dims.reduce((a, d) => a + d.score, 0) / dims.length);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 60, display: 'flex', alignItems: 'center', padding: '0 48px', borderBottom: '1px solid var(--border)', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>Session complete</div>
        <button onClick={onBack} style={{ fontFamily: 'var(--font-sans)', fontSize: 13, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
          Back to modules
        </button>
      </div>

      <div style={{ flex: 1, maxWidth: 720, margin: '0 auto', padding: '60px 48px', width: '100%',
        opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(20px)', transition: 'all 0.8s var(--ease-spring)' }}>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--teal)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500, marginBottom: 20 }}>
          Module complete
        </div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 600, lineHeight: 1.06, letterSpacing: '-0.02em', marginBottom: 8 }}>
          {m.title}
        </h1>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 15, color: 'var(--text-muted)', marginBottom: 56 }}>Here's how your session went.</p>

        <div style={{ display: 'flex', alignItems: 'center', gap: 40, marginBottom: 56, padding: '36px 40px', background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div style={{ position: 'relative', width: 100, height: 100, flexShrink: 0 }}>
            <svg width="100" height="100" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="var(--border)" strokeWidth="8" />
              <circle cx="50" cy="50" r="42" fill="none" stroke="var(--accent)" strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 42}`}
                strokeDashoffset={`${2 * Math.PI * 42 * (1 - overall / 100)}`}
                strokeLinecap="round" transform="rotate(-90 50 50)"
                style={{ transition: 'stroke-dashoffset 1.2s var(--ease-spring)' }} />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 26, fontWeight: 600, lineHeight: 1 }}>{overall}</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 10, color: 'var(--text-subtle)' }}>/100</div>
            </div>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 600, marginBottom: 8 }}>Strong session.</div>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.65, fontWeight: 300 }}>
              You demonstrated good use of open-ended questions and empathetic phrasing. Focus area: give more space after delivering information.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 48 }}>
          {dims.map((d, i) => (
            <div key={i}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text)', fontWeight: 400 }}>{d.label}</span>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: d.color, fontWeight: 500 }}>{d.score}</span>
              </div>
              <div style={{ height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: mounted ? `${d.score}%` : '0%', background: d.color, borderRadius: 2, transition: `width 0.9s ${0.1 * i + 0.3}s var(--ease-spring)` }} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <HoverButton primary onClick={onRetry}>Retry simulation</HoverButton>
          <HoverButton onClick={onBack}>Back to modules</HoverButton>
        </div>
      </div>
    </div>
  );
}

// ─── Module experience router ─────────────────────────────────────────
function ModuleExperience({ module: m, onBack }) {
  const [phase, setPhase] = useState('intro');
  const [slideIdx, setSlideIdx] = useState(0);

  const goLesson = () => setPhase('lesson');
  const nextSlide = () => {
    if (slideIdx < LESSON_SLIDES.length - 1) { setSlideIdx(i => i + 1); }
    else { setPhase('bridge'); }
  };
  const prevSlide = () => {
    if (slideIdx > 0) { setSlideIdx(i => i - 1); }
    else { setPhase('intro'); }
  };

  if (phase === 'intro') return <ModuleIntro module={m} onStart={goLesson} onBack={onBack} />;
  if (phase === 'lesson') return <LessonView slideIdx={slideIdx} onNext={nextSlide} onBack={prevSlide} />;
  if (phase === 'bridge') return <BridgeScreen module={m} onEnter={() => setPhase('conversation')} />;
  if (phase === 'conversation') return <ConversationView module={m} onFinish={() => setPhase('feedback')} />;
  if (phase === 'feedback') return <FeedbackView module={m} onRetry={() => { setSlideIdx(0); setPhase('conversation'); }} onBack={onBack} />;
}

Object.assign(window, { ModuleExperience });
