/* home.jsx */

const { useState: uS, useEffect: uE, useRef: uR } = React;

/* ===== HERO ===== */
function Hero() {
  return (
    <section style={{position:'relative',overflow:'hidden',borderBottom:'1px solid var(--line)'}}>
      <div style={{position:'absolute',inset:0}}><MoleculeBg/></div>
      <div className="container" style={{position:'relative',padding:'72px 24px 96px',display:'grid',gridTemplateColumns:'1.1fr 1fr',gap:64,alignItems:'center',minHeight:640}}>
        <div>
          <div className="badge badge-ruo" style={{marginBottom:24}}>
            <span className="badge-dot"></span>VAILCHEM.LABS · RESEARCH USE ONLY
          </div>
          <h1 style={{marginBottom:24}}>
            Research-grade peptides, <em style={{fontStyle:'normal',color:'var(--fg-muted)'}}>shipped with the COA.</em>
          </h1>
          <p style={{fontSize:18,color:'var(--fg-muted)',maxWidth:520,marginBottom:32,lineHeight:1.5}}>
            Synthesized in-house, HPLC-verified at &ge;99% purity, and sold only to verified research organizations. Every vial ships with its batch-specific certificate of analysis.
          </p>
          <div style={{display:'flex',gap:12,marginBottom:40}}>
            <a className="btn btn-accent btn-lg" href="verify.html">Request Research Access <Icon.arrow/></a>
            <a className="btn btn-ghost btn-lg" href="catalog.html">Browse Catalog</a>
          </div>
          <div style={{display:'flex',gap:32,flexWrap:'wrap',fontFamily:'var(--font-mono)',fontSize:11,color:'var(--fg-muted)',letterSpacing:'0.05em',textTransform:'uppercase'}}>
            <span>· 1,240+ verified labs served</span>
            <span>· &ge;99% HPLC purity</span>
            <span>· COA on every vial</span>
          </div>
        </div>
        <FloatingCards/>
      </div>
    </section>
  );
}

function FloatingCards() {
  const [verified, setVerified] = uS(false);
  uE(() => { const t = setTimeout(() => setVerified(true), 1800); return () => clearTimeout(t); }, []);

  return (
    <div style={{position:'relative',height:560,perspective:1200}}>
      {/* ambient glow */}
      <div style={{position:'absolute',inset:'10% 10%',background:'radial-gradient(circle, var(--accent-soft), transparent 70%)',filter:'blur(40px)'}}></div>

      {/* Card 1 — Product card */}
      <div style={{position:'absolute',top:20,left:20,width:240,animation:'float-y 6s ease-in-out infinite',animationDelay:'0s'}}>
        <div className="card" style={{padding:14,boxShadow:'var(--shadow-lg)'}}>
          <div style={{display:'flex',gap:6,marginBottom:10}}>
            <span className="badge badge-ruo">RESEARCH USE</span>
            <span className="badge badge-coa">COA</span>
          </div>
          <div style={{height:140,marginBottom:10}}>
            <VialMock label="SEMAX" code="VC-014" mass="10 mg"/>
          </div>
          <div style={{fontSize:13,fontWeight:500,marginBottom:2}}>SEMAX</div>
          <div style={{fontFamily:'var(--font-mono)',fontSize:10,color:'var(--fg-muted)',letterSpacing:'0.05em'}}>C₃₇H₅₁N₉O₁₀ · 10 mg</div>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:10,paddingTop:10,borderTop:'1px solid var(--line)'}}>
            <span style={{fontFamily:'var(--font-mono)',fontSize:13,fontWeight:500}}>$148.00</span>
            <span style={{fontFamily:'var(--font-mono)',fontSize:10,color:'var(--ok)'}}>· IN STOCK</span>
          </div>
        </div>
      </div>

      {/* Card 2 — COA verification */}
      <div style={{position:'absolute',top:80,right:0,width:280,animation:'float-y 7s ease-in-out infinite',animationDelay:'0.5s'}}>
        <div className="card" style={{padding:16,boxShadow:'var(--shadow-lg)'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
            <span className="eyebrow">COA · Verification</span>
            <Icon.shield/>
          </div>
          <div style={{fontFamily:'var(--font-mono)',fontSize:13,marginBottom:14,padding:'8px 10px',background:'var(--bg-sunken)',borderRadius:'var(--r-sm)',display:'flex',justifyContent:'space-between'}}>
            <span style={{color:'var(--fg-muted)'}}>LOT</span>
            <span>VC-014-A2604</span>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:14}}>
            <Stat label="PURITY" value="99.4%" highlight={verified}/>
            <Stat label="MASS DEV" value="±0.02"/>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:8,padding:'10px 12px',border:'1px solid '+(verified?'var(--ok)':'var(--line)'),borderRadius:'var(--r-sm)',background:verified?'var(--ok-soft)':'transparent',transition:'all 600ms var(--ease)'}}>
            <div style={{width:18,height:18,borderRadius:'50%',background:verified?'var(--ok)':'var(--line-strong)',display:'grid',placeItems:'center',color:'#fff',transition:'all 400ms var(--ease)'}}>
              {verified ? <Icon.check width="11" height="11"/> : <span style={{width:6,height:6,borderRadius:'50%',background:'#fff'}}></span>}
            </div>
            <span style={{fontFamily:'var(--font-mono)',fontSize:11,letterSpacing:'0.05em',color:verified?'var(--ok)':'var(--fg-muted)'}}>
              {verified ? 'VERIFIED · RELEASED' : 'VERIFYING SIGNATURE…'}
            </span>
          </div>
        </div>
      </div>

      {/* Card 3 — Batch traceability timeline */}
      <div style={{position:'absolute',bottom:0,left:60,right:60,animation:'float-y 8s ease-in-out infinite',animationDelay:'1s'}}>
        <div className="card" style={{padding:18,boxShadow:'var(--shadow-lg)'}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:16}}>
            <span className="eyebrow">Batch Traceability</span>
            <span style={{fontFamily:'var(--font-mono)',fontSize:10,color:'var(--fg-muted)'}}>VC-014-A2604</span>
          </div>
          <Timeline/>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, highlight }) {
  return (
    <div style={{padding:'8px 10px',background:'var(--bg-sunken)',borderRadius:'var(--r-sm)'}}>
      <div style={{fontFamily:'var(--font-mono)',fontSize:9,letterSpacing:'0.08em',color:'var(--fg-subtle)',marginBottom:2}}>{label}</div>
      <div style={{fontFamily:'var(--font-mono)',fontSize:14,fontWeight:500,color:highlight?'var(--ok)':'var(--fg)',transition:'color 400ms var(--ease)'}}>{value}</div>
    </div>
  );
}

function Timeline() {
  const steps = [
    { l: 'Synthesized', d: 'MAR 12' },
    { l: 'HPLC Tested', d: 'MAR 14' },
    { l: 'QC Released', d: 'MAR 18' },
    { l: 'Inventoried', d: 'MAR 22' },
    { l: 'Available', d: 'NOW' },
  ];
  const [active, setActive] = uS(0);
  uE(() => {
    const id = setInterval(() => setActive(a => (a + 1) % (steps.length + 2)), 900);
    return () => clearInterval(id);
  }, []);
  return (
    <div style={{position:'relative'}}>
      <div style={{position:'absolute',top:8,left:8,right:8,height:1,background:'var(--line)'}}></div>
      <div style={{position:'absolute',top:8,left:8,height:1,background:'var(--accent-hi)',width:`calc(${Math.min(active, steps.length-1)/(steps.length-1)*100}% - ${active>=steps.length-1?16:0}px)`,transition:'width 900ms var(--ease)'}}></div>
      <div style={{display:'grid',gridTemplateColumns:`repeat(${steps.length}, 1fr)`,gap:8,position:'relative'}}>
        {steps.map((s, i) => (
          <div key={i} style={{textAlign:'left'}}>
            <div style={{width:16,height:16,borderRadius:'50%',background:i<=active?'var(--accent-hi)':'var(--bg-elevated)',border:'1px solid '+(i<=active?'var(--accent-hi)':'var(--line-strong)'),marginBottom:10,display:'grid',placeItems:'center',transition:'all 300ms var(--ease)'}}>
              {i<=active && <span style={{width:5,height:5,borderRadius:'50%',background:'var(--bg-elevated)'}}></span>}
            </div>
            <div style={{fontSize:11,fontWeight:500,marginBottom:2}}>{s.l}</div>
            <div style={{fontFamily:'var(--font-mono)',fontSize:9,color:'var(--fg-muted)',letterSpacing:'0.05em'}}>{s.d}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ===== HOW IT WORKS ===== */
function HowItWorks() {
  const steps = [
    { n: '01', t: 'Get Verified', d: 'Submit organization details, role, and a research-use attestation. Reviewed within one business day.' },
    { n: '02', t: 'Browse the Catalog', d: 'Full peptide catalog — including restricted SKUs — unlocks once your organization is verified.' },
    { n: '03', t: 'Order Your Peptides', d: 'Add vials to cart, accept the research-use terms, and check out with PO, Net 30, ACH, or card.' },
    { n: '04', t: 'Receive With COA', d: 'Cold-pack shipping. Every vial arrives with its batch-specific certificate of analysis.' },
    { n: '05', t: 'Verify Anytime', d: 'Scan the QR on the label or look up the lot online to re-confirm purity at any point.' },
  ];
  return (
    <section className="section">
      <div className="container">
        <Reveal><div className="section-hd">
          <div className="hd-l">
            <div className="eyebrow">How it works</div>
            <h2>From verified access to vial in five steps.</h2>
          </div>
          <div style={{maxWidth:280,fontSize:14,color:'var(--fg-muted)'}}>
            A peptide supplier built for labs that need documentation, not promises.
          </div>
        </div></Reveal>
        <div style={{display:'grid',gridTemplateColumns:'repeat(5, 1fr)',gap:0,borderTop:'1px solid var(--line)',borderBottom:'1px solid var(--line)'}}>
          {steps.map((s, i) => (
            <Reveal key={i} delay={i*80}>
              <div style={{padding:'32px 20px',borderRight:i<steps.length-1?'1px solid var(--line)':'none',position:'relative',minHeight:220}}>
                <div style={{fontFamily:'var(--font-mono)',fontSize:11,color:'var(--accent-hi)',letterSpacing:'0.08em',marginBottom:24}}>{s.n}</div>
                <h4 style={{marginBottom:8}}>{s.t}</h4>
                <p style={{fontSize:13,color:'var(--fg-muted)',lineHeight:1.5}}>{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===== FEATURES ===== */
function Features() {
  const fs = [
    { t: 'In-House Synthesis', d: 'Solid-phase peptide synthesis at our own facility — no resold, no relabeled inventory.', i: <Icon.beaker width="20" height="20"/> },
    { t: 'HPLC-Verified Purity', d: 'Every batch tested by reverse-phase HPLC and ESI-MS. Typical purity ≥ 99%.', i: <Icon.shield width="20" height="20"/> },
    { t: 'COA With Every Vial', d: 'Each shipment includes the batch-specific certificate of analysis. No exceptions.', i: <Icon.doc width="20" height="20"/> },
    { t: 'Verified Buyers Only', d: 'We only sell to verified research organizations. A research-use attestation is required at signup.', i: <Icon.link width="20" height="20"/> },
    { t: 'Cold-Chain Shipping', d: 'Lyophilized peptides packed cold and shipped overnight to your registered lab address.', i: <Icon.download width="20" height="20"/> },
    { t: 'Re-Verify Anytime', d: 'Scan the QR on any vial label — or enter the lot number — to re-confirm purity online.', i: <Icon.qr width="20" height="20"/> },
  ];
  return (
    <section className="section" style={{background:'var(--bg-sunken)'}}>
      <div className="container">
        <Reveal><div className="section-hd">
          <div className="hd-l">
            <div className="eyebrow">Platform</div>
            <h2>Documentation, not promises.</h2>
          </div>
        </div></Reveal>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3, 1fr)',gap:0,border:'1px solid var(--line)',background:'var(--bg-elevated)',borderRadius:'var(--r-md)'}}>
          {fs.map((f, i) => (
            <Reveal key={i} delay={i*60}>
              <div style={{padding:32,borderRight:(i%3<2)?'1px solid var(--line)':'none',borderBottom:(i<3)?'1px solid var(--line)':'none',minHeight:200}}>
                <div style={{color:'var(--accent)',marginBottom:20}}>{f.i}</div>
                <h4 style={{marginBottom:8}}>{f.t}</h4>
                <p style={{fontSize:13,color:'var(--fg-muted)',lineHeight:1.5}}>{f.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===== PRODUCT PREVIEW ===== */
function ProductPreview() {
  const products = [
    { name: 'SEMAX', code: 'VC-014', formula: 'C₃₇H₅₁N₉O₁₀', mass: '10 mg', price: '148.00', restricted: false, stock: true },
    { name: 'SELANK', code: 'VC-021', formula: 'C₃₃H₅₇N₁₁O₉', mass: '5 mg', price: '92.00', restricted: false, stock: true },
    { name: 'EPITALON', code: 'VC-008', formula: 'C₁₄H₂₂N₄O₉', mass: '20 mg', price: '74.00', restricted: false, stock: true },
    { name: 'GHK-Cu', code: 'VC-031', formula: 'C₁₄H₂₄CuN₆O₄', mass: '50 mg', price: '120.00', restricted: false, stock: true },
    { name: 'TB-500 (frag)', code: 'VC-042', formula: 'C₂₁₂H₃₅₀…', mass: '2 mg', price: '210.00', restricted: true, stock: true },
    { name: 'PT-141', code: 'VC-055', formula: 'C₅₀H₆₈N₁₄O₁₀', mass: '10 mg', price: '188.00', restricted: true, stock: false },
  ];
  return (
    <section className="section">
      <div className="container">
        <Reveal><div className="section-hd">
          <div className="hd-l">
            <div className="eyebrow">Catalog preview</div>
            <h2>In stock now.</h2>
          </div>
          <a className="btn btn-ghost" href="catalog.html">View full catalog <Icon.arrow/></a>
        </div></Reveal>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3, 1fr)',gap:16}}>
          {products.map((p, i) => (
            <Reveal key={i} delay={i*40}>
              <a href="product.html" className="card card-hover" style={{padding:16,display:'block',cursor:'pointer'}}>
                <div style={{display:'flex',gap:6,marginBottom:12,flexWrap:'wrap'}}>
                  <span className="badge badge-ruo">RESEARCH USE</span>
                  <span className="badge badge-coa">COA</span>
                  {p.restricted && <span className="badge badge-restricted">RESTRICTED</span>}
                </div>
                <div style={{height:200,marginBottom:14}}>
                  <VialMock label={p.name} code={p.code} mass={p.mass}/>
                </div>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:6}}>
                  <h4>{p.name}</h4>
                  <span style={{fontFamily:'var(--font-mono)',fontSize:13,fontWeight:500}}>${p.price}</span>
                </div>
                <div style={{fontFamily:'var(--font-mono)',fontSize:11,color:'var(--fg-muted)',letterSpacing:'0.03em',marginBottom:14}}>
                  {p.code} · {p.formula} · {p.mass}
                </div>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',paddingTop:14,borderTop:'1px solid var(--line)'}}>
                  <span style={{fontFamily:'var(--font-mono)',fontSize:10,letterSpacing:'0.05em',color:p.stock?'var(--ok)':'var(--fg-muted)'}}>
                    · {p.stock?'IN STOCK':'BACKORDER'}
                  </span>
                  <span style={{fontSize:13,color:'var(--fg-muted)',display:'flex',alignItems:'center',gap:4}}>View details <Icon.arrow/></span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===== COA SECTION ===== */
function COASection() {
  const [lot, setLot] = uS('VC-014-A2604');
  const [scanning, setScanning] = uS(false);
  return (
    <section className="section" style={{background:'var(--bg-sunken)'}}>
      <div className="container">
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:64,alignItems:'center'}}>
          <Reveal>
            <div className="eyebrow">Re-verify any vial</div>
            <h2 style={{margin:'12px 0 20px'}}>Already have a vial? Confirm it in seconds.</h2>
            <p style={{fontSize:16,color:'var(--fg-muted)',marginBottom:24,maxWidth:480}}>
              Scan the QR on the vial label — or enter the lot number — to retrieve the signed COA, release status, and full chain of documentation for the peptide you received.
            </p>
            <div style={{display:'flex',gap:12,marginBottom:16}}>
              <input className="input mono" value={lot} onChange={e=>setLot(e.target.value)} placeholder="Lot number, e.g. VC-014-A2604" style={{flex:1}}/>
              <a className="btn btn-accent" href={`coa-lookup.html?lot=${encodeURIComponent(lot)}`}>Verify</a>
            </div>
            <button className="btn btn-link" onClick={() => setScanning(!scanning)}>
              <Icon.qr/> {scanning ? 'Stop scanner' : 'Scan QR code instead'}
            </button>
          </Reveal>
          <Reveal delay={120}>
            <COAWidget scanning={scanning}/>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function COAWidget({ scanning }) {
  return (
    <div className="card" style={{padding:20,position:'relative',overflow:'hidden'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
        <span className="eyebrow">Live verification</span>
        <span className="badge badge-verified"><span className="badge-dot"></span>VERIFIED</span>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'120px 1fr',gap:20,alignItems:'start'}}>
        <div style={{aspectRatio:'1',position:'relative',background:'var(--bg-sunken)',border:'1px solid var(--line)',borderRadius:'var(--r-sm)',overflow:'hidden'}}>
          <QRPattern/>
          {scanning && <div style={{position:'absolute',top:'50%',left:'50%',width:'120%',height:'2px',background:'var(--accent-hi)',boxShadow:'0 0 8px var(--accent-hi)',animation:'scan 1.6s ease-in-out infinite',transformOrigin:'center'}}></div>}
        </div>
        <div>
          <table className="spec-table">
            <tbody>
              <tr><td>Product</td><td>SEMAX · VC-014</td></tr>
              <tr><td>Lot</td><td>VC-014-A2604</td></tr>
              <tr><td>Purity (HPLC)</td><td style={{color:'var(--ok)'}}>99.42%</td></tr>
              <tr><td>Released</td><td>MAR 18, 2026</td></tr>
              <tr><td>Status</td><td style={{color:'var(--ok)'}}>RELEASED</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div style={{display:'flex',gap:8,marginTop:18,paddingTop:18,borderTop:'1px solid var(--line)'}}>
        <button className="btn btn-ghost btn-sm"><Icon.download/> COA.pdf</button>
        <button className="btn btn-ghost btn-sm"><Icon.download/> SDS.pdf</button>
        <div style={{flex:1}}></div>
        <a className="btn btn-link" href="coa-lookup.html">Open in lookup <Icon.arrow/></a>
      </div>
    </div>
  );
}

function QRPattern() {
  // deterministic-looking QR
  const cells = [];
  for (let y = 0; y < 21; y++) for (let x = 0; x < 21; x++) {
    const seed = Math.sin(x * 7.3 + y * 3.1 + 2) * 10000;
    const on = (seed - Math.floor(seed)) > 0.45;
    if (on) cells.push({ x, y });
  }
  // corner finders
  const finder = (cx, cy) => (
    <g key={`f${cx}${cy}`}>
      <rect x={cx} y={cy} width="7" height="7" fill="var(--fg)"/>
      <rect x={cx+1} y={cy+1} width="5" height="5" fill="var(--bg-sunken)"/>
      <rect x={cx+2} y={cy+2} width="3" height="3" fill="var(--fg)"/>
    </g>
  );
  return (
    <svg viewBox="0 0 21 21" style={{width:'100%',height:'100%',padding:8}}>
      {cells.map((c, i) => {
        // skip cells under finders
        const inFinder = (c.x < 7 && c.y < 7) || (c.x > 13 && c.y < 7) || (c.x < 7 && c.y > 13);
        if (inFinder) return null;
        return <rect key={i} x={c.x} y={c.y} width="1" height="1" fill="var(--fg)"/>;
      })}
      {finder(0,0)}{finder(14,0)}{finder(0,14)}
    </svg>
  );
}

/* ===== RUO NOTICE ===== */
function RUONotice() {
  return (
    <section style={{padding:'48px 0',borderTop:'1px solid var(--line)',borderBottom:'1px solid var(--line)'}}>
      <div className="container">
        <Reveal>
          <div style={{display:'flex',gap:24,alignItems:'flex-start',padding:'24px 28px',border:'1px solid var(--line)',borderLeft:'3px solid var(--accent-hi)',borderRadius:'var(--r-sm)',background:'var(--bg-elevated)'}}>
            <div style={{color:'var(--accent)',marginTop:2}}><Icon.shield width="20" height="20"/></div>
            <div style={{flex:1}}>
              <div className="eyebrow" style={{marginBottom:6}}>Research Use Only · Notice</div>
              <p style={{fontSize:14,color:'var(--fg)',lineHeight:1.55,maxWidth:880}}>
                All materials available through this platform are intended for laboratory research use only by qualified organizations. Materials are not for human or animal use, are not intended to diagnose, treat, cure, or prevent any condition, and may not be administered, consumed, or applied outside of a controlled research environment.
              </p>
            </div>
            <a className="btn btn-link" href="#">Read full policy <Icon.arrow/></a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ===== FINAL CTA ===== */
function FinalCTA() {
  return (
    <section style={{padding:'120px 0',position:'relative',overflow:'hidden'}}>
      <div style={{position:'absolute',inset:0}}><MoleculeBg/></div>
      <div className="container" style={{position:'relative',textAlign:'center'}}>
        <Reveal>
          <div className="eyebrow" style={{marginBottom:16}}>· Get verified</div>
          <h2 style={{maxWidth:780,margin:'0 auto 24px'}}>
            Order peptides with the documentation your lab already requires.
          </h2>
          <p style={{fontSize:17,color:'var(--fg-muted)',maxWidth:560,margin:'0 auto 36px'}}>
            Verification typically completes within one business day. Full catalog access — including restricted peptides — activates immediately on approval.
          </p>
          <div style={{display:'flex',gap:12,justifyContent:'center'}}>
            <a className="btn btn-accent btn-lg" href="verify.html">Request Research Access <Icon.arrow/></a>
            <a className="btn btn-ghost btn-lg" href="catalog.html">Browse Catalog</a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ===== APP ===== */
function App() {
  return (
    <div>
      <Nav active="home"/>
      <Hero/>
      <HowItWorks/>
      <Features/>
      <ProductPreview/>
      <COASection/>
      <RUONotice/>
      <FinalCTA/>
      <Footer/>
      <ThemeTweaks/>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
