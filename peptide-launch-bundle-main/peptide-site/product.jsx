/* product.jsx */
const { useState: pS } = React;

function ProductApp() {
  const [qty, setQty] = pS(1);
  const [tab, setTab] = pS('coa');

  return (
    <div>
      <Nav active="catalog"/>
      <div className="container" style={{padding:'24px 24px 8px',fontFamily:'var(--font-mono)',fontSize:11,color:'var(--fg-muted)',letterSpacing:'0.04em'}}>
        <a href="catalog.html">Catalog</a> <span style={{margin:'0 8px'}}>/</span> Heptapeptide <span style={{margin:'0 8px'}}>/</span> <span style={{color:'var(--fg)'}}>SEMAX · VC-014</span>
      </div>

      <div className="container" style={{padding:'24px 24px 64px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:64}}>
        {/* Left: image + gallery */}
        <div>
          <div style={{height:540,marginBottom:12,background:'var(--bg-elevated)',border:'1px solid var(--line)',borderRadius:'var(--r-md)',padding:48}}>
            <VialMock label="SEMAX" code="VC-014" mass="10 mg"/>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12}}>
            {[1,2,3,4].map(i => (
              <div key={i} style={{height:96,border:'1px solid '+(i===1?'var(--fg)':'var(--line)'),borderRadius:'var(--r-sm)',padding:12,cursor:'pointer',background:'var(--bg-elevated)'}}>
                <VialMock label="SEMAX" code={`VC-014`} mass="10 mg"/>
              </div>
            ))}
          </div>
        </div>

        {/* Right: details */}
        <div>
          <div style={{display:'flex',gap:6,marginBottom:16,flexWrap:'wrap'}}>
            <span className="badge badge-ruo">RESEARCH USE ONLY</span>
            <span className="badge badge-coa"><span className="badge-dot"></span>COA AVAILABLE</span>
            <span className="badge">SDS · v3.2</span>
          </div>
          <h2 style={{fontSize:40,marginBottom:8}}>SEMAX</h2>
          <div className="mono" style={{fontSize:13,color:'var(--fg-muted)',letterSpacing:'0.03em',marginBottom:24}}>
            VC-014 · C₃₇H₅₁N₉O₁₀ · MW 813.91 · Heptapeptide reference material
          </div>

          <table className="spec-table" style={{marginBottom:24}}>
            <tbody>
              <tr><td>Sequence</td><td>Met-Glu-His-Phe-Pro-Gly-Pro</td></tr>
              <tr><td>Purity (HPLC)</td><td style={{color:'var(--ok)'}}>≥ 99.0%</td></tr>
              <tr><td>Mass deviation</td><td>± 0.05 Da</td></tr>
              <tr><td>Storage</td><td>2–8 °C, dry, dark</td></tr>
              <tr><td>Mass per unit</td><td>10 mg lyophilized</td></tr>
              <tr><td>Form</td><td>Off-white powder</td></tr>
              <tr><td>Origin</td><td>Solid-phase synthesis</td></tr>
            </tbody>
          </table>

          <div style={{padding:20,border:'1px solid var(--line)',borderRadius:'var(--r-md)',background:'var(--bg-elevated)',marginBottom:16}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
              <div className="mono" style={{fontSize:24,fontWeight:500}}>$148.00</div>
              <div className="mono" style={{fontSize:11,color:'var(--ok)',letterSpacing:'0.05em'}}>· 24 UNITS · LOT VC-014-A2604</div>
            </div>
            <div style={{display:'flex',gap:8,marginBottom:12}}>
              <div style={{display:'flex',alignItems:'center',border:'1px solid var(--line-strong)',borderRadius:'var(--r-sm)'}}>
                <button className="icon-btn" onClick={()=>setQty(Math.max(1,qty-1))} style={{border:'none',width:36}}><Icon.minus/></button>
                <span style={{padding:'0 14px',fontFamily:'var(--font-mono)',fontSize:14,minWidth:24,textAlign:'center'}}>{qty}</span>
                <button className="icon-btn" onClick={()=>setQty(qty+1)} style={{border:'none',width:36}}><Icon.plus/></button>
              </div>
              <a href="cart.html" className="btn btn-accent" style={{flex:1,justifyContent:'center'}}>Add to cart · ${(148*qty).toFixed(2)}</a>
            </div>
            <div style={{display:'flex',gap:8}}>
              <button className="btn btn-ghost btn-sm" style={{flex:1,justifyContent:'center'}}>Request quote</button>
              <button className="btn btn-ghost btn-sm" style={{flex:1,justifyContent:'center'}}>Save to project</button>
            </div>
          </div>

          <div style={{padding:'12px 16px',border:'1px solid var(--accent)',borderLeft:'3px solid var(--accent)',background:'var(--accent-soft)',borderRadius:'var(--r-sm)',display:'flex',gap:10,fontSize:12,color:'var(--fg)'}}>
            <Icon.shield/>
            <span>Research use only. Not for human or animal use. Restricted to verified organizations.</span>
          </div>
        </div>
      </div>

      {/* Tabs section */}
      <div style={{borderTop:'1px solid var(--line)',background:'var(--bg-sunken)'}}>
        <div className="container" style={{padding:'48px 24px 80px'}}>
          <div style={{display:'flex',gap:0,borderBottom:'1px solid var(--line)',marginBottom:32}}>
            {[
              {id:'coa',l:'COA · Lot Traceability'},
              {id:'specs',l:'Full Specifications'},
              {id:'docs',l:'Supplier Documentation'},
              {id:'related',l:'Related Materials'},
            ].map(t => (
              <button key={t.id} onClick={()=>setTab(t.id)} style={{padding:'12px 20px',background:'transparent',border:'none',borderBottom:'2px solid '+(tab===t.id?'var(--fg)':'transparent'),fontFamily:'inherit',fontSize:13,color:tab===t.id?'var(--fg)':'var(--fg-muted)',cursor:'pointer',marginBottom:-1}}>
                {t.l}
              </button>
            ))}
          </div>

          {tab === 'coa' && <COATab/>}
          {tab === 'specs' && <SpecsTab/>}
          {tab === 'docs' && <DocsTab/>}
          {tab === 'related' && <RelatedTab/>}
        </div>
      </div>

      <Footer/>
      <ThemeTweaks/>
    </div>
  );
}

function COATab() {
  const lots = [
    { lot: 'VC-014-A2604', date: 'MAR 18, 2026', purity: '99.42%', status: 'RELEASED', current: true },
    { lot: 'VC-014-Z2511', date: 'NOV 22, 2025', purity: '99.18%', status: 'EXHAUSTED' },
    { lot: 'VC-014-Y2508', date: 'AUG 04, 2025', purity: '99.27%', status: 'EXHAUSTED' },
  ];
  return (
    <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:32}}>
      <div>
        <h3 style={{marginBottom:16}}>Lot history</h3>
        <div style={{border:'1px solid var(--line)',borderRadius:'var(--r-md)',background:'var(--bg-elevated)',overflow:'hidden'}}>
          <div className="mono" style={{display:'grid',gridTemplateColumns:'1.4fr 1fr 1fr 1fr 100px',padding:'10px 16px',borderBottom:'1px solid var(--line)',fontSize:10,letterSpacing:'0.08em',textTransform:'uppercase',color:'var(--fg-muted)'}}>
            <span>Lot</span><span>Released</span><span>Purity</span><span>Status</span><span></span>
          </div>
          {lots.map((l, i) => (
            <div key={l.lot} className="mono" style={{display:'grid',gridTemplateColumns:'1.4fr 1fr 1fr 1fr 100px',padding:'14px 16px',borderBottom:i<lots.length-1?'1px solid var(--line)':'none',fontSize:12,alignItems:'center',background:l.current?'var(--accent-soft)':'transparent'}}>
              <span style={{fontWeight:500}}>{l.lot}{l.current && <span className="badge badge-verified" style={{marginLeft:8}}>CURRENT</span>}</span>
              <span style={{color:'var(--fg-muted)'}}>{l.date}</span>
              <span style={{color:'var(--ok)'}}>{l.purity}</span>
              <span style={{color:l.status==='RELEASED'?'var(--ok)':'var(--fg-muted)'}}>{l.status}</span>
              <button className="btn btn-link" style={{justifySelf:'end'}}><Icon.download/> COA</button>
            </div>
          ))}
        </div>
      </div>
      <div className="card" style={{padding:20}}>
        <div className="eyebrow" style={{marginBottom:12}}>Current lot · VC-014-A2604</div>
        <table className="spec-table" style={{marginBottom:16}}>
          <tbody>
            <tr><td>HPLC</td><td style={{color:'var(--ok)'}}>99.42%</td></tr>
            <tr><td>MS confirm</td><td>813.91 ± 0.02</td></tr>
            <tr><td>Endotoxin</td><td>&lt; 0.5 EU/mg</td></tr>
            <tr><td>Solubility</td><td>Soluble in H₂O</td></tr>
            <tr><td>Released by</td><td>QC-04 · J. Morales</td></tr>
            <tr><td>Released on</td><td>MAR 18, 2026</td></tr>
          </tbody>
        </table>
        <div style={{display:'flex',gap:8}}>
          <button className="btn btn-ghost btn-sm" style={{flex:1,justifyContent:'center'}}><Icon.download/> COA.pdf</button>
          <button className="btn btn-ghost btn-sm" style={{flex:1,justifyContent:'center'}}><Icon.download/> SDS.pdf</button>
        </div>
      </div>
    </div>
  );
}

function SpecsTab() {
  return (
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:32}}>
      <div className="card" style={{padding:20}}>
        <div className="eyebrow" style={{marginBottom:12}}>Identity</div>
        <table className="spec-table">
          <tbody>
            <tr><td>CAS</td><td>80714-61-0</td></tr>
            <tr><td>Sequence</td><td>Met-Glu-His-Phe-Pro-Gly-Pro</td></tr>
            <tr><td>Length</td><td>7 residues</td></tr>
            <tr><td>Net charge</td><td>–1</td></tr>
            <tr><td>Iso-electric</td><td>5.4</td></tr>
          </tbody>
        </table>
      </div>
      <div className="card" style={{padding:20}}>
        <div className="eyebrow" style={{marginBottom:12}}>Physical</div>
        <table className="spec-table">
          <tbody>
            <tr><td>Form</td><td>Lyophilized powder</td></tr>
            <tr><td>Color</td><td>Off-white</td></tr>
            <tr><td>Solubility</td><td>≥ 5 mg/mL in H₂O</td></tr>
            <tr><td>Storage</td><td>2–8 °C dry</td></tr>
            <tr><td>Shelf life</td><td>24 mo. sealed</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DocsTab() {
  const docs = [
    { n: 'Certificate of Analysis · Lot A2604', t: 'COA', s: '184 KB' },
    { n: 'Safety Data Sheet · v3.2', t: 'SDS', s: '218 KB' },
    { n: 'Supplier Quality Statement', t: 'QSTAT', s: '92 KB' },
    { n: 'Lot Release Record', t: 'REL', s: '64 KB' },
    { n: 'HPLC Trace · Lot A2604', t: 'TRACE', s: '316 KB' },
  ];
  return (
    <div style={{border:'1px solid var(--line)',borderRadius:'var(--r-md)',background:'var(--bg-elevated)',maxWidth:720}}>
      {docs.map((d, i) => (
        <div key={i} style={{display:'flex',padding:'14px 18px',borderBottom:i<docs.length-1?'1px solid var(--line)':'none',alignItems:'center',gap:14}}>
          <Icon.doc width="18" height="18"/>
          <div style={{flex:1}}>
            <div style={{fontSize:14,fontWeight:500}}>{d.n}</div>
            <div className="mono" style={{fontSize:10,color:'var(--fg-muted)',letterSpacing:'0.05em'}}>{d.t} · PDF · {d.s}</div>
          </div>
          <button className="btn btn-ghost btn-sm"><Icon.download/></button>
        </div>
      ))}
    </div>
  );
}

function RelatedTab() {
  const rel = [
    { name: 'SELANK', code: 'VC-021', mass: '5 mg', price: 92 },
    { name: 'EPITALON', code: 'VC-008', mass: '20 mg', price: 74 },
    { name: 'BPC-157 (ref)', code: 'VC-073', mass: '5 mg', price: 142 },
    { name: 'GHK-Cu', code: 'VC-031', mass: '50 mg', price: 120 },
  ];
  return (
    <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14}}>
      {rel.map(p => (
        <a key={p.code} href="product.html" className="card card-hover" style={{padding:14,display:'block'}}>
          <div style={{display:'flex',gap:5,marginBottom:10}}><span className="badge badge-ruo">RESEARCH USE</span><span className="badge badge-coa">COA</span></div>
          <div style={{height:160,marginBottom:10}}><VialMock label={p.name} code={p.code} mass={p.mass}/></div>
          <div style={{display:'flex',justifyContent:'space-between'}}>
            <h4 style={{fontSize:14}}>{p.name}</h4>
            <span className="mono" style={{fontSize:13,fontWeight:500}}>${p.price}</span>
          </div>
          <div className="mono" style={{fontSize:10,color:'var(--fg-muted)',marginTop:4}}>{p.code} · {p.mass}</div>
        </a>
      ))}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<ProductApp/>);
