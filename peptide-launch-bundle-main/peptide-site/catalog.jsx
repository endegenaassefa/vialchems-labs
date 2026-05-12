/* catalog.jsx */
const { useState: cS, useMemo: cM } = React;

const PRODUCTS = [
  { name: 'SEMAX', code: 'VC-014', formula: 'C₃₇H₅₁N₉O₁₀', mw: '813.91', mass: '10 mg', price: 148, stock: 24, restricted: false, family: 'Heptapeptide' },
  { name: 'SELANK', code: 'VC-021', formula: 'C₃₃H₅₇N₁₁O₉', mw: '751.86', mass: '5 mg', price: 92, stock: 18, restricted: false, family: 'Heptapeptide' },
  { name: 'EPITALON', code: 'VC-008', formula: 'C₁₄H₂₂N₄O₉', mw: '390.36', mass: '20 mg', price: 74, stock: 41, restricted: false, family: 'Tetrapeptide' },
  { name: 'GHK-Cu', code: 'VC-031', formula: 'C₁₄H₂₄CuN₆O₄', mw: '403.93', mass: '50 mg', price: 120, stock: 12, restricted: false, family: 'Tripeptide complex' },
  { name: 'TB-500 (frag)', code: 'VC-042', formula: 'C₂₁₂H₃₅₀…', mw: '4963.4', mass: '2 mg', price: 210, stock: 6, restricted: true, family: 'Polypeptide' },
  { name: 'PT-141', code: 'VC-055', formula: 'C₅₀H₆₈N₁₄O₁₀', mw: '1025.18', mass: '10 mg', price: 188, stock: 0, restricted: true, family: 'Cyclic heptapeptide' },
  { name: 'KISSPEPTIN-10', code: 'VC-067', formula: 'C₆₃H₈₃N₁₇O₁₄', mw: '1302.45', mass: '5 mg', price: 165, stock: 9, restricted: true, family: 'Decapeptide' },
  { name: 'BPC-157 (ref)', code: 'VC-073', formula: 'C₆₂H₉₈N₁₆O₂₂', mw: '1419.55', mass: '5 mg', price: 142, stock: 22, restricted: false, family: 'Pentadecapeptide' },
  { name: 'OXYTOCIN (ref)', code: 'VC-088', formula: 'C₄₃H₆₆N₁₂O₁₂S₂', mw: '1007.19', mass: '2 mg', price: 96, stock: 31, restricted: true, family: 'Nonapeptide' },
];

function Filter({ title, children }) {
  return (
    <div style={{paddingBottom:20,marginBottom:20,borderBottom:'1px solid var(--line)'}}>
      <div className="label">{title}</div>
      {children}
    </div>
  );
}

function Check({ checked, onChange, label, count }) {
  return (
    <label style={{display:'flex',alignItems:'center',gap:8,padding:'5px 0',cursor:'pointer',fontSize:13}}>
      <span onClick={onChange} style={{width:14,height:14,border:'1px solid '+(checked?'var(--fg)':'var(--line-strong)'),background:checked?'var(--fg)':'transparent',borderRadius:2,display:'grid',placeItems:'center',color:'var(--bg)',transition:'all 100ms'}}>
        {checked && <Icon.check width="10" height="10"/>}
      </span>
      <span style={{flex:1}}>{label}</span>
      {count !== undefined && <span style={{fontFamily:'var(--font-mono)',fontSize:10,color:'var(--fg-subtle)'}}>{count}</span>}
    </label>
  );
}

function CatalogApp() {
  const [q, setQ] = cS('');
  const [families, setFamilies] = cS({});
  const [showRestricted, setShowRestricted] = cS(true);
  const [inStock, setInStock] = cS(false);
  const [view, setView] = cS('grid');
  const [sort, setSort] = cS('Newest');

  const allFamilies = cM(() => [...new Set(PRODUCTS.map(p=>p.family))], []);
  const filtered = cM(() => PRODUCTS.filter(p => {
    if (q && !(p.name.toLowerCase().includes(q.toLowerCase()) || p.code.toLowerCase().includes(q.toLowerCase()) || p.formula.toLowerCase().includes(q.toLowerCase()))) return false;
    const anyFamily = Object.values(families).some(Boolean);
    if (anyFamily && !families[p.family]) return false;
    if (!showRestricted && p.restricted) return false;
    if (inStock && p.stock === 0) return false;
    return true;
  }), [q, families, showRestricted, inStock]);

  return (
    <div>
      <Nav active="catalog"/>
      {/* Header strip */}
      <div style={{borderBottom:'1px solid var(--line)',padding:'40px 0 32px',background:'var(--bg-elevated)'}}>
        <div className="container">
          <div className="eyebrow" style={{marginBottom:8}}>· Catalog</div>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',gap:24,flexWrap:'wrap'}}>
            <div>
              <h2 style={{fontSize:36,marginBottom:8}}>Research materials</h2>
              <p style={{fontSize:14,color:'var(--fg-muted)'}}>{filtered.length} of {PRODUCTS.length} peptides · all research use only · batch-traceable</p>
            </div>
            <div style={{display:'flex',gap:8,alignItems:'center'}}>
              <div style={{position:'relative',width:360}}>
                <span style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'var(--fg-muted)'}}><Icon.search/></span>
                <input className="input mono" placeholder="Search product, sequence, formula, lot…" value={q} onChange={e=>setQ(e.target.value)} style={{paddingLeft:36}}/>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{padding:'32px 24px 64px',display:'grid',gridTemplateColumns:'240px 1fr',gap:48}}>
        {/* Sidebar */}
        <aside style={{position:'sticky',top:80,alignSelf:'start',maxHeight:'calc(100vh - 100px)',overflowY:'auto'}}>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:16}}>
            <Icon.filter/>
            <span className="eyebrow">Filters</span>
          </div>
          <Filter title="Family">
            {allFamilies.map(f => (
              <Check key={f} checked={!!families[f]} onChange={()=>setFamilies(s=>({...s,[f]:!s[f]}))} label={f} count={PRODUCTS.filter(p=>p.family===f).length}/>
            ))}
          </Filter>
          <Filter title="Documentation">
            <Check checked={true} label="COA available" count={PRODUCTS.length}/>
            <Check checked={true} label="SDS available" count={PRODUCTS.length}/>
            <Check checked={true} label="Lot traceability" count={PRODUCTS.length}/>
          </Filter>
          <Filter title="Access">
            <Check checked={showRestricted} onChange={()=>setShowRestricted(!showRestricted)} label="Show restricted" count={PRODUCTS.filter(p=>p.restricted).length}/>
            <Check checked={inStock} onChange={()=>setInStock(!inStock)} label="In stock only" count={PRODUCTS.filter(p=>p.stock>0).length}/>
          </Filter>
          <Filter title="Mass">
            <Check checked={false} label="< 10 mg"/>
            <Check checked={false} label="10–25 mg"/>
            <Check checked={false} label="> 25 mg"/>
          </Filter>
        </aside>

        {/* Results */}
        <div>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20,paddingBottom:16,borderBottom:'1px solid var(--line)'}}>
            <div style={{display:'flex',gap:8}}>
              {['grid','list'].map(v => (
                <button key={v} onClick={()=>setView(v)} className="btn btn-ghost btn-sm" style={{borderColor:view===v?'var(--fg)':'var(--line)',color:'var(--fg)'}}>{v.toUpperCase()}</button>
              ))}
            </div>
            <select className="input mono" style={{width:'auto',padding:'6px 10px',fontSize:12}} value={sort} onChange={e=>setSort(e.target.value)}>
              <option>Newest</option><option>Price ↑</option><option>Price ↓</option><option>Mass</option>
            </select>
          </div>

          {view === 'grid' ? (
            <div style={{display:'grid',gridTemplateColumns:'repeat(3, 1fr)',gap:14}}>
              {filtered.map((p, i) => (
                <Reveal key={p.code} delay={i*30}>
                  <a href="product.html" className="card card-hover" style={{padding:14,display:'block'}}>
                    <div style={{display:'flex',gap:5,marginBottom:10,flexWrap:'wrap'}}>
                      <span className="badge badge-ruo">RESEARCH USE</span>
                      <span className="badge badge-coa">COA</span>
                      {p.restricted && <span className="badge badge-restricted">RESTRICTED</span>}
                    </div>
                    <div style={{height:170,marginBottom:12}}><VialMock label={p.name} code={p.code} mass={p.mass}/></div>
                    <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                      <h4 style={{fontSize:14}}>{p.name}</h4>
                      <span style={{fontFamily:'var(--font-mono)',fontSize:13,fontWeight:500}}>${p.price}</span>
                    </div>
                    <div style={{fontFamily:'var(--font-mono)',fontSize:10,color:'var(--fg-muted)',letterSpacing:'0.03em',marginBottom:10}}>{p.code} · {p.mass} · MW {p.mw}</div>
                    <div style={{display:'flex',justifyContent:'space-between',paddingTop:10,borderTop:'1px solid var(--line)',fontFamily:'var(--font-mono)',fontSize:10,letterSpacing:'0.05em'}}>
                      <span style={{color:p.stock>0?'var(--ok)':'var(--fg-muted)'}}>· {p.stock>0?`${p.stock} IN STOCK`:'BACKORDER'}</span>
                      <span style={{color:'var(--fg-muted)'}}>VIEW →</span>
                    </div>
                  </a>
                </Reveal>
              ))}
            </div>
          ) : (
            <div style={{border:'1px solid var(--line)',borderRadius:'var(--r-md)',background:'var(--bg-elevated)',overflow:'hidden'}}>
              <div style={{display:'grid',gridTemplateColumns:'56px 1.4fr 1.6fr 100px 110px 100px 100px',padding:'10px 16px',borderBottom:'1px solid var(--line)',fontFamily:'var(--font-mono)',fontSize:10,letterSpacing:'0.08em',textTransform:'uppercase',color:'var(--fg-muted)'}}>
                <div></div><div>Material</div><div>Formula · MW</div><div>Mass</div><div>Stock</div><div>Price</div><div></div>
              </div>
              {filtered.map((p, i) => (
                <a key={p.code} href="product.html" style={{display:'grid',gridTemplateColumns:'56px 1.4fr 1.6fr 100px 110px 100px 100px',padding:'14px 16px',borderBottom:i<filtered.length-1?'1px solid var(--line)':'none',alignItems:'center',color:'var(--fg)',transition:'background 100ms'}}
                  onMouseEnter={e=>e.currentTarget.style.background='var(--bg-sunken)'}
                  onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                  <div style={{width:36,height:48}}><VialMock label={p.name} code={p.code} mass={p.mass}/></div>
                  <div>
                    <div style={{fontSize:14,fontWeight:500,marginBottom:3}}>{p.name}</div>
                    <div style={{display:'flex',gap:4}}>
                      <span className="badge badge-ruo">RESEARCH USE</span>
                      {p.restricted && <span className="badge badge-restricted">R</span>}
                    </div>
                  </div>
                  <div className="mono" style={{fontSize:11,color:'var(--fg-muted)'}}>{p.code} · {p.formula}<br/>MW {p.mw}</div>
                  <div className="mono" style={{fontSize:12}}>{p.mass}</div>
                  <div className="mono" style={{fontSize:11,color:p.stock>0?'var(--ok)':'var(--fg-muted)'}}>{p.stock>0?`${p.stock} units`:'Backorder'}</div>
                  <div className="mono" style={{fontSize:13,fontWeight:500}}>${p.price}.00</div>
                  <div style={{textAlign:'right',color:'var(--fg-muted)'}}><Icon.arrow/></div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer/>
      <ThemeTweaks/>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<CatalogApp/>);
