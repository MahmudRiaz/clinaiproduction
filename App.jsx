// App.jsx — ClinAI root router
const { useState } = React;

const TWEAK_DEFAULTS = {
  accentHue: 235,
  fontHeading: 'Cormorant Garamond',
  darkMode: false,
};

function App() {
  const [view, setView] = useState('landing');
  const [selectedModule, setSelectedModule] = useState(null);
  const [tweaks, setTweaks] = useState(TWEAK_DEFAULTS);
  const [tweakOpen, setTweakOpen] = useState(false);

  React.useEffect(() => {
    const handler = (e) => {
      if (e.data?.type === '__activate_edit_mode') setTweakOpen(true);
      if (e.data?.type === '__deactivate_edit_mode') setTweakOpen(false);
    };
    window.addEventListener('message', handler);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', handler);
  }, []);

  const applyTweak = (key, val) => {
    const next = { ...tweaks, [key]: val };
    setTweaks(next);
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { [key]: val } }, '*');
    if (key === 'accentHue') {
      document.documentElement.style.setProperty('--accent', `oklch(52% 0.16 ${val})`);
      document.documentElement.style.setProperty('--accent-light', `oklch(94% 0.04 ${val})`);
    }
    if (key === 'darkMode') {
      document.documentElement.style.setProperty('--bg', val ? 'oklch(9% 0.022 245)' : 'oklch(98.5% 0.006 240)');
      document.documentElement.style.setProperty('--bg-alt', val ? 'oklch(12% 0.02 245)' : 'oklch(96.5% 0.008 240)');
      document.documentElement.style.setProperty('--text', val ? 'oklch(92% 0.006 240)' : 'oklch(11% 0.02 245)');
      document.documentElement.style.setProperty('--text-muted', val ? 'oklch(60% 0.012 240)' : 'oklch(44% 0.016 240)');
      document.documentElement.style.setProperty('--border', val ? 'oklch(22% 0.018 245)' : 'oklch(88% 0.008 240)');
      document.documentElement.style.setProperty('--surface', val ? 'oklch(13% 0.02 245)' : 'oklch(100% 0 0)');
      document.documentElement.style.setProperty('--surface-sub', val ? 'oklch(16% 0.02 245)' : 'oklch(97% 0.006 240)');
    }
  };

  const enterModule = (mod) => { setSelectedModule(mod); setView('module'); window.scrollTo(0, 0); };
  const backToLanding = () => { setView('landing'); setSelectedModule(null); window.scrollTo(0, 0); };

  return (
    <>
      {view === 'landing'
        ? <LandingPage onEnterModule={enterModule} />
        : (selectedModule && selectedModule.id === 5
            ? <SDOHModuleExperience module={selectedModule} onBack={backToLanding} />
            : <ModuleExperience module={selectedModule} onBack={backToLanding} />)
      }

      {/* Tweaks panel */}
      {tweakOpen && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
          background: 'oklch(100% 0 0)', border: '1px solid oklch(88% 0.008 240)',
          boxShadow: '0 20px 60px oklch(0% 0 0 / 0.12)',
          padding: '24px', width: 260, fontFamily: 'var(--font-sans)',
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 20, letterSpacing: '-0.01em' }}>Tweaks</div>

          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 11, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Accent color</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {[
                { hue: 235, label: 'Blue' },
                { hue: 185, label: 'Teal' },
                { hue: 280, label: 'Violet' },
                { hue: 160, label: 'Green' },
              ].map(c => (
                <div key={c.hue} title={c.label} onClick={() => applyTweak('accentHue', c.hue)} style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: `oklch(52% 0.16 ${c.hue})`,
                  cursor: 'pointer', border: tweaks.accentHue === c.hue ? '2px solid var(--text)' : '2px solid transparent',
                  boxSizing: 'border-box', transition: 'transform 0.2s',
                }}
                  onMouseEnter={e => e.target.style.transform = 'scale(1.15)'}
                  onMouseLeave={e => e.target.style.transform = 'none'} />
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 11, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Dark mode</div>
            <div onClick={() => applyTweak('darkMode', !tweaks.darkMode)} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer',
            }}>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{tweaks.darkMode ? 'On' : 'Off'}</span>
              <div style={{
                width: 40, height: 22, borderRadius: 100,
                background: tweaks.darkMode ? 'var(--accent)' : 'var(--border)',
                position: 'relative', transition: 'background 0.3s',
              }}>
                <div style={{
                  position: 'absolute', top: 3, left: tweaks.darkMode ? 21 : 3,
                  width: 16, height: 16, borderRadius: '50%', background: 'white',
                  transition: 'left 0.3s var(--ease-spring)',
                }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
