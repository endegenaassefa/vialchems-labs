/* shared.jsx — nav, footer, atoms, page chrome */

const { useState, useEffect, useRef, useMemo } = React;

/* ============ ICONS ============ */
const Icon = {
  search: (p) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" {...p}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>,
  cart: (p) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 4h2l2.5 12.5a2 2 0 0 0 2 1.5h8a2 2 0 0 0 2-1.5L21 8H6"/><circle cx="10" cy="21" r="1"/><circle cx="18" cy="21" r="1"/></svg>,
  user: (p) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" {...p}><circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"/></svg>,
  arrow: (p) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" {...p}><path d="M5 12h14"/><path d="m13 5 7 7-7 7"/></svg>,
  check: (p) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 13l4 4L19 7"/></svg>,
  download: (p) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 4v12"/><path d="m7 11 5 5 5-5"/><path d="M5 20h14"/></svg>,
  qr: (p) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM20 14v3M14 20h3M20 20v1"/></svg>,
  shield: (p) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 3 4 6v6c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V6l-8-3z"/><path d="m9 12 2 2 4-4"/></svg>,
  doc: (p) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M9 13h6M9 17h6"/></svg>,
  beaker: (p) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M9 3h6M10 3v6L4.5 18a2 2 0 0 0 1.7 3h11.6a2 2 0 0 0 1.7-3L14 9V3"/><path d="M7 14h10"/></svg>,
  link: (p) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1.5 1.5"/><path d="M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 1 0 5.66 5.66l1.5-1.5"/></svg>,
  chevron: (p) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="m9 6 6 6-6 6"/></svg>,
  plus: (p) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" {...p}><path d="M12 5v14M5 12h14"/></svg>,
  minus: (p) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" {...p}><path d="M5 12h14"/></svg>,
  filter: (p) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" {...p}><path d="M3 5h18M6 12h12M10 19h4"/></svg>,
  sun: (p) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" {...p}><circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4"/></svg>,
  moon: (p) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M21 13a8 8 0 1 1-10-10 6 6 0 0 0 10 10z"/></svg>,
};

/* ============ NAV ============ */
function SiteThemeSwitch() {
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('vc.theme') || 'light'; }
    catch { return 'light'; }
  });

  const nextTheme = theme === 'dark' ? 'light' : 'dark';

  const toggleTheme = () => {
    const accent = (() => {
      try { return localStorage.getItem('vc.accent') || 'cyan-navy'; }
      catch { return 'cyan-navy'; }
    })();
    setTheme(nextTheme);
    applyTheme(nextTheme, accent);
    try {
      localStorage.setItem('vc.theme', nextTheme);
      localStorage.setItem('vc.accent', accent);
    } catch (e) {}
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${nextTheme} theme`}
      aria-pressed={theme === 'dark'}
      title={`Switch to ${nextTheme} theme`}
      style={{
        height: 34,
        minWidth: 118,
        padding: '0 10px',
        border: '1px solid color-mix(in oklab, var(--accent-hi) 46%, var(--line))',
        borderRadius: 'var(--r-pill)',
        background: 'var(--accent-soft)',
        color: 'var(--accent-hi)',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        transition: 'all var(--dur-fast) var(--ease)',
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
      }}
    >
      {theme === 'dark' ? <Icon.moon/> : <Icon.sun/>}
      <span>Theme · {theme}</span>
      <span style={{
        width: 24,
        height: 14,
        borderRadius: 'var(--r-pill)',
        border: '1px solid var(--line-strong)',
        background: 'var(--bg-sunken)',
        position: 'relative',
      }}>
        <span style={{
          position: 'absolute',
          top: 2,
          left: theme === 'dark' ? 12 : 2,
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: 'var(--accent-hi)',
          transition: 'left var(--dur-fast) var(--ease)',
        }} />
      </span>
    </button>
  );
}

function Nav({ active, cartCount = 2 }) {
  return (
    <nav className="nav">
      <div className="container nav-inner">
        <a href="index.html" className="brand">
          <span className="brand-mark"></span>
          <span>vailchem<span style={{color:'var(--fg-muted)'}}>.labs</span></span>
        </a>
        <div className="nav-links">
          <a href="catalog.html" className={active==='catalog'?'active':''}>Shop Peptides</a>
          <a href="coa-lookup.html" className={active==='coa'?'active':''}>Verify a Vial</a>
          <a href="verify.html" className={active==='verify'?'active':''}>Get Verified</a>
          <a href="account.html" className={active==='account'?'active':''}>My Lab</a>
        </div>
        <div className="nav-spacer"></div>
        <div className="nav-actions">
          <SiteThemeSwitch/>
          <button className="icon-btn" aria-label="Search" onClick={() => alert('Search')}><Icon.search/></button>
          <a className="icon-btn" href="account.html" aria-label="Account"><Icon.user/></a>
          <a className="icon-btn" href="cart.html" aria-label="Cart" style={{position:'relative'}}>
            <Icon.cart/>
            {cartCount > 0 && <span style={{position:'absolute',top:-4,right:-4,minWidth:16,height:16,padding:'0 4px',background:'var(--accent)',color:'#fff',borderRadius:8,fontSize:10,fontFamily:'var(--font-mono)',display:'grid',placeItems:'center',fontWeight:500}}>{cartCount}</span>}
          </a>
          <a className="btn btn-primary btn-sm" href="verify.html">Get Verified <Icon.arrow/></a>
        </div>
      </div>
    </nav>
  );
}

/* ============ FOOTER ============ */
function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="foot-grid">
          <div className="foot-col">
            <div className="brand" style={{marginBottom:16}}>
              <span className="brand-mark"></span>
              <span>vailchem<span style={{color:'var(--fg-muted)'}}>.labs</span></span>
            </div>
            <p style={{color:'var(--fg-muted)',fontSize:13,maxWidth:300,marginBottom:16}}>
              Research-grade peptides synthesized in-house and sold only to verified laboratories.
            </p>
            <div className="badge badge-ruo"><span className="badge-dot"></span>RESEARCH USE ONLY</div>
          </div>
          <div className="foot-col">
            <h5>Shop</h5>
            <ul>
              <li><a href="catalog.html">Peptide Catalog</a></li>
              <li><a href="coa-lookup.html">Verify a Vial</a></li>
              <li><a href="verify.html">Get Verified</a></li>
              <li><a href="account.html">My Lab</a></li>
            </ul>
          </div>
          <div className="foot-col">
            <h5>Compliance</h5>
            <ul>
              <li><a>Research Use Policy</a></li>
              <li><a>Restricted Materials</a></li>
              <li><a>Quality Standards</a></li>
              <li><a>Documentation</a></li>
            </ul>
          </div>
          <div className="foot-col">
            <h5>Organization</h5>
            <ul>
              <li><a>About</a></li>
              <li><a>Suppliers</a></li>
              <li><a>Partners</a></li>
              <li><a>Contact</a></li>
            </ul>
          </div>
          <div className="foot-col">
            <h5>Legal</h5>
            <ul>
              <li><a>Terms of Use</a></li>
              <li><a>Privacy</a></li>
              <li><a>Research Use Attestation</a></li>
              <li><a>Acceptable Use</a></li>
            </ul>
          </div>
        </div>
        <div className="foot-base">
          <span>© 2026 VAILCHEM LABS — RESEARCH USE ONLY · NOT FOR HUMAN OR ANIMAL USE</span>
          <span>BUILD 26.04 · STATUS: OPERATIONAL</span>
        </div>
      </div>
    </footer>
  );
}

/* ============ MOLECULE BACKGROUND ============ */
function MoleculeBg() {
  // generate a sparse network of nodes/edges
  const { nodes, edges } = useMemo(() => {
    const seed = 7;
    const rand = (s) => { let x = Math.sin(s) * 10000; return x - Math.floor(x); };
    const ns = [];
    for (let i = 0; i < 32; i++) {
      ns.push({ x: rand(seed + i*1.7) * 1400, y: rand(seed + i*2.3) * 700, r: 1.5 + rand(i*0.7) * 1.5 });
    }
    const es = [];
    for (let i = 0; i < ns.length; i++) {
      for (let j = i+1; j < ns.length; j++) {
        const dx = ns[i].x - ns[j].x;
        const dy = ns[i].y - ns[j].y;
        const d = Math.sqrt(dx*dx+dy*dy);
        if (d < 160) es.push({ a: i, b: j, d });
      }
    }
    return { nodes: ns, edges: es };
  }, []);
  return (
    <svg className="molecule-bg" viewBox="0 0 1400 700" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="fade" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="var(--fg)" stopOpacity="0.10"/>
          <stop offset="100%" stopColor="var(--fg)" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <rect width="1400" height="700" fill="url(#fade)"/>
      {edges.map((e, i) => (
        <line key={i} x1={nodes[e.a].x} y1={nodes[e.a].y} x2={nodes[e.b].x} y2={nodes[e.b].y}
              stroke="var(--line-strong)" strokeWidth="0.5" opacity={1 - e.d/160}/>
      ))}
      {nodes.map((n, i) => (
        <circle key={i} cx={n.x} cy={n.y} r={n.r} fill="var(--accent-hi)" opacity="0.6">
          <animate attributeName="opacity" values="0.3;0.8;0.3" dur={`${3 + (i%4)}s`} repeatCount="indefinite"/>
        </circle>
      ))}
    </svg>
  );
}

/* ============ SCROLL REVEAL ============ */
function Reveal({ children, delay = 0, as = 'div', ...rest }) {
  const ref = useRef();
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { setTimeout(() => setShown(true), delay); io.disconnect(); }});
    }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);
  const Tag = as;
  return <Tag ref={ref} className={'reveal' + (shown ? ' in' : '') + (rest.className ? ' ' + rest.className : '')} style={rest.style}>{children}</Tag>;
}

/* ============ PRODUCT MOCK CARD (vial label placeholder) ============ */
function VialMock({ label = 'SEMAX', code = 'VC-014', mass = '10 mg', tone = 'accent' }) {
  return (
    <div style={{
      width: '100%',
      aspectRatio: '3/4',
      background: 'var(--bg-sunken)',
      borderRadius: 'var(--r-sm)',
      position: 'relative',
      overflow: 'hidden',
      display: 'grid',
      placeItems: 'center',
      border: '1px solid var(--line)',
    }}>
      {/* striped placeholder pattern */}
      <svg style={{position:'absolute',inset:0,width:'100%',height:'100%',opacity:0.5}} preserveAspectRatio="none">
        <defs>
          <pattern id={`st-${code}`} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="8" stroke="var(--line)" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#st-${code})`}/>
      </svg>
      {/* vial silhouette */}
      <svg viewBox="0 0 100 140" style={{width:'40%',height:'auto',position:'relative',zIndex:1}}>
        <rect x="38" y="6" width="24" height="10" rx="1" fill="var(--fg-muted)"/>
        <rect x="36" y="14" width="28" height="6" fill="var(--line-strong)"/>
        <path d="M30 22 L30 124 Q30 134 40 134 L60 134 Q70 134 70 124 L70 22 Z"
              fill="var(--bg-elevated)" stroke="var(--fg)" strokeWidth="1.5"/>
        <rect x="34" y="58" width="32" height="62" fill="var(--accent-soft)"/>
        <rect x="34" y="58" width="32" height="2" fill={tone==='accent' ? 'var(--accent)' : 'var(--fg)'}/>
        <text x="50" y="80" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="6" fontWeight="600" fill="var(--fg)">{label}</text>
        <text x="50" y="92" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="4" fill="var(--fg-muted)">{code}</text>
        <text x="50" y="104" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="4" fill="var(--fg-muted)">{mass}</text>
      </svg>
      {/* mono caption */}
      <div style={{position:'absolute',bottom:8,left:10,fontFamily:'var(--font-mono)',fontSize:9,color:'var(--fg-subtle)',letterSpacing:'0.05em',textTransform:'uppercase'}}>
        product mockup · {code}
      </div>
    </div>
  );
}

/* ============ THEME INIT ============ */
function applyTheme(theme, accent) {
  document.documentElement.setAttribute('data-theme', theme || 'light');
  document.documentElement.setAttribute('data-accent', accent || 'cyan-navy');
}
// read from localStorage on every page
(function initTheme(){
  try {
    const t = localStorage.getItem('vc.theme') || 'light';
    const a = localStorage.getItem('vc.accent') || 'cyan-navy';
    applyTheme(t, a);
  } catch (e) {}
})();

/* ============ THEME / TWEAKS PANEL (visible when toggled by host) ============ */
function ThemeTweaks() {
  const [theme, setTheme] = useState(() => { try { return localStorage.getItem('vc.theme') || 'light'; } catch { return 'light'; }});
  const [accent, setAccent] = useState(() => { try { return localStorage.getItem('vc.accent') || 'cyan-navy'; } catch { return 'cyan-navy'; }});
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onMsg = (e) => {
      if (!e.data || typeof e.data !== 'object') return;
      if (e.data.type === '__activate_edit_mode') setOpen(true);
      if (e.data.type === '__deactivate_edit_mode') setOpen(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({type:'__edit_mode_available'}, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);

  useEffect(() => { applyTheme(theme, accent); try { localStorage.setItem('vc.theme', theme); localStorage.setItem('vc.accent', accent); } catch(e){} }, [theme, accent]);

  if (!open) return null;
  const accents = [
    { id: 'cyan-navy', label: 'Cyan / Navy', sw: ['#0f3a5f','#06b6d4'] },
    { id: 'cyan', label: 'Cyan', sw: ['#0891b2','#22d3ee'] },
    { id: 'cobalt', label: 'Cobalt', sw: ['#0B5FFF','#4d8bff'] },
    { id: 'forest', label: 'Forest', sw: ['#0f5132','#1f8a5b'] },
    { id: 'graphite', label: 'Graphite', sw: ['#111111','#444444'] },
  ];
  return (
    <div style={{position:'fixed',bottom:24,right:24,zIndex:200,width:280,background:'var(--bg-elevated)',border:'1px solid var(--line-strong)',borderRadius:'var(--r-md)',boxShadow:'var(--shadow-lg)',padding:16,fontFamily:'var(--font-sans)'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
        <span style={{fontFamily:'var(--font-mono)',fontSize:11,letterSpacing:'0.08em',textTransform:'uppercase',color:'var(--fg-muted)'}}>Tweaks</span>
        <button className="icon-btn" onClick={() => { setOpen(false); window.parent.postMessage({type:'__edit_mode_dismissed'},'*'); }} style={{width:24,height:24,fontSize:12}}>×</button>
      </div>
      <div style={{marginBottom:16}}>
        <div className="label">Theme</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6}}>
          {[{id:'light',l:'Light',i:<Icon.sun/>},{id:'dark',l:'Dark',i:<Icon.moon/>}].map(o => (
            <button key={o.id} onClick={() => setTheme(o.id)}
              style={{padding:'8px',border:'1px solid '+(theme===o.id?'var(--fg)':'var(--line)'),background:theme===o.id?'var(--bg-sunken)':'transparent',color:'var(--fg)',borderRadius:'var(--r-sm)',cursor:'pointer',display:'flex',gap:6,alignItems:'center',justifyContent:'center',fontSize:13}}>
              {o.i}{o.l}
            </button>
          ))}
        </div>
      </div>
      <div>
        <div className="label">Accent</div>
        <div style={{display:'flex',flexDirection:'column',gap:4}}>
          {accents.map(a => (
            <button key={a.id} onClick={() => setAccent(a.id)} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 10px',border:'1px solid '+(accent===a.id?'var(--fg)':'var(--line)'),background:accent===a.id?'var(--bg-sunken)':'transparent',borderRadius:'var(--r-sm)',cursor:'pointer',color:'var(--fg)',fontSize:13}}>
              <span style={{display:'flex'}}>
                <span style={{width:14,height:14,borderRadius:3,background:a.sw[0]}}></span>
                <span style={{width:14,height:14,borderRadius:3,background:a.sw[1],marginLeft:-4,border:'1px solid var(--bg-elevated)'}}></span>
              </span>
              {a.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============ EXPORT ============ */
Object.assign(window, { Icon, Nav, Footer, MoleculeBg, Reveal, VialMock, ThemeTweaks, SiteThemeSwitch });
