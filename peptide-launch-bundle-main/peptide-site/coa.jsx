/* coa.jsx */
const { useState: lS, useEffect: lE } = React;

function COAApp() {
  const [lot, setLot] = lS('VC-014-A2604');
  const [mode, setMode] = lS('lot'); // 'lot' or 'qr'
  const [verifying, setVerifying] = lS(false);
  const [result, setResult] = lS(null);

  const verify = () => {
    setVerifying(true); setResult(null);
    setTimeout(() => { setVerifying(false); setResult({
      ok: true, lot, product: 'SEMAX · VC-014', purity: '99.42%', released: 'MAR 18, 2026', status: 'RELEASED', massDev: '±0.02 Da', endotoxin: '< 0.5 EU/mg'
    });}, 1400);
  };

  lE(() => { verify(); }, []);

  return (
    <div>
      <Nav active="coa"/>
      <div style={{padding:'80px 0 40px',position:'relative',overflow:'hidden',borderBottom:'1px solid var(--line)'}}>
        <div style={{position:'absolute',inset:0}}><MoleculeBg/></div>
        <div className="container" style={{position:'relative',textAlign:'center'}}>
          <div className="eyebrow" style={{marginBottom:14}}>· Verify a vial</div>
          <h2 style={{fontSize:48,marginBottom:14,maxWidth:720,margin:'0 auto 14px'}}>Confirm the peptide you received.</h2>
          <p style={{fontSize:16,color:'var(--fg-muted)',maxWidth:560,margin:'0 auto'}}>Scan the QR on the vial label, or type the lot number printed beneath it. We return the signed COA, HPLC trace, and the full release record for the peptide you ordered.</p>
        </div>
      </div>

      <div className="container" style={{padding:'48px 24px 80px',display:'grid',gridTemplateColumns:'440px 1fr',gap:48,alignItems:'flex-start'}}>
        {/* Left: scan/lot panel */}
        <div className="card" style={{padding:24,position:'sticky',top:80}}>
          <div style={{display:'flex',gap:0,marginBottom:20,padding:4,background:'var(--bg-sunken)',borderRadius:'var(--r-sm)'}}>
            {[{id:'lot',l:'Lot number',i:<Icon.search/>},{id:'qr',l:'Scan QR',i:<Icon.qr/>}].map(m => (
              <button key={m.id} onClick={()=>setMode(m.id)} style={{flex:1,padding:'8px 12px',background:mode===m.id?'var(--bg-elevated)':'transparent',border:mode===m.id?'1px solid var(--line)':'1px solid transparent',borderRadius:'var(--r-xs)',fontFamily:'inherit',fontSize:13,color:'var(--fg)',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:6,boxShadow:mode===m.id?'var(--shadow-sm)':'none'}}>
                {m.i} {m.l}
              </button>
            ))}
          </div>

          {mode === 'lot' ? (
            <div>
              <label className="label">Lot number</label>
              <input className="input mono" value={lot} onChange={e=>setLot(e.target.value)} placeholder="VC-014-A2604" style={{marginBottom:12}}/>
              <button className="btn btn-accent w-full" onClick={verify} style={{width:'100%',justifyContent:'center'}}>Verify lot <Icon.arrow/></button>
              <div style={{marginTop:24,paddingTop:20,borderTop:'1px solid var(--line)'}}>
                <div className="label" style={{marginBottom:10}}>Recent lookups</div>
                {['VC-014-A2604','VC-008-A2511','VC-031-A2603'].map(l => (
                  <button key={l} onClick={()=>{setLot(l); setMode('lot');}} className="mono" style={{display:'block',width:'100%',textAlign:'left',padding:'8px 10px',marginBottom:4,background:'transparent',border:'1px solid var(--line)',borderRadius:'var(--r-sm)',fontSize:12,color:'var(--fg-muted)',cursor:'pointer'}}>{l}</button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <div style={{aspectRatio:'1',position:'relative',background:'#000',borderRadius:'var(--r-sm)',overflow:'hidden',marginBottom:14}}>
                <div style={{position:'absolute',inset:24,border:'1px solid rgba(255,255,255,0.2)'}}></div>
                {/* corner brackets */}
                {[[8,8,'top-left'],[8,8,'top-right'],[8,8,'bottom-left'],[8,8,'bottom-right']].map((_, i) => {
                  const pos = ['top:24px;left:24px','top:24px;right:24px','bottom:24px;left:24px','bottom:24px;right:24px'][i];
                  return <div key={i} style={{position:'absolute',width:24,height:24,borderColor:'var(--accent-hi)',borderStyle:'solid',borderWidth:`${i<2?2:0}px ${i%2===1?2:0}px ${i>=2?2:0}px ${i%2===0?2:0}px`,...Object.fromEntries(pos.split(';').map(p => p.split(':').map(s=>s.trim())))}}></div>;
                })}
                <div style={{position:'absolute',top:'50%',left:24,right:24,height:2,background:'var(--accent-hi)',boxShadow:'0 0 12px var(--accent-hi)',animation:'scan 2s ease-in-out infinite'}}></div>
                <div style={{position:'absolute',bottom:8,left:0,right:0,textAlign:'center',color:'rgba(255,255,255,0.6)',fontFamily:'var(--font-mono)',fontSize:10,letterSpacing:'0.08em'}}>· SCANNING ·</div>
              </div>
              <p style={{fontSize:13,color:'var(--fg-muted)',textAlign:'center'}}>Point your camera at the QR code printed on the supplier label.</p>
            </div>
          )}
        </div>

        {/* Right: result */}
        <div>
          {verifying && (
            <div className="card" style={{padding:48,textAlign:'center'}}>
              <div style={{width:48,height:48,margin:'0 auto 16px',border:'2px solid var(--line)',borderTopColor:'var(--accent)',borderRadius:'50%',animation:'spin 0.8s linear infinite'}}></div>
              <div className="mono" style={{fontSize:11,letterSpacing:'0.08em',color:'var(--fg-muted)'}}>VERIFYING SIGNATURE …</div>
            </div>
          )}
          {!verifying && result && (
            <div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
                <div>
                  <div className="eyebrow">Verification result</div>
                  <h3 style={{marginTop:6}}>{result.product}</h3>
                </div>
                <span className="badge badge-verified" style={{padding:'8px 14px',fontSize:11}}><span className="badge-dot"></span>VERIFIED · RELEASED</span>
              </div>

              <div className="card" style={{padding:24,marginBottom:16}}>
                <div style={{display:'grid',gridTemplateColumns:'140px 1fr',gap:24}}>
                  <div style={{aspectRatio:'1',background:'var(--bg-sunken)',border:'1px solid var(--line)',borderRadius:'var(--r-sm)'}}>
                    <svg viewBox="0 0 21 21" style={{width:'100%',height:'100%',padding:6}}>
                      {Array.from({length:300}).map((_, i) => {
                        const s = Math.sin(i*7.3+2)*10000; const on = (s-Math.floor(s))>0.45;
                        if (!on) return null;
                        const x = i%21; const y = Math.floor(i/21);
                        if (y >= 21) return null;
                        const f = (x<7&&y<7)||(x>13&&y<7)||(x<7&&y>13);
                        if (f) return null;
                        return <rect key={i} x={x} y={y} width="1" height="1" fill="var(--fg)"/>;
                      })}
                      {[[0,0],[14,0],[0,14]].map(([cx,cy],i) => (
                        <g key={i}><rect x={cx} y={cy} width="7" height="7" fill="var(--fg)"/><rect x={cx+1} y={cy+1} width="5" height="5" fill="var(--bg-sunken)"/><rect x={cx+2} y={cy+2} width="3" height="3" fill="var(--fg)"/></g>
                      ))}
                    </svg>
                  </div>
                  <table className="spec-table">
                    <tbody>
                      <tr><td>Lot</td><td>{result.lot}</td></tr>
                      <tr><td>Product</td><td>{result.product}</td></tr>
                      <tr><td>Purity (HPLC)</td><td style={{color:'var(--ok)'}}>{result.purity}</td></tr>
                      <tr><td>Mass deviation</td><td>{result.massDev}</td></tr>
                      <tr><td>Endotoxin</td><td>{result.endotoxin}</td></tr>
                      <tr><td>Released</td><td>{result.released}</td></tr>
                      <tr><td>Status</td><td style={{color:'var(--ok)'}}>{result.status}</td></tr>
                    </tbody>
                  </table>
                </div>
                <div style={{display:'flex',gap:8,marginTop:20,paddingTop:20,borderTop:'1px solid var(--line)'}}>
                  <button className="btn btn-ghost btn-sm"><Icon.download/> COA.pdf</button>
                  <button className="btn btn-ghost btn-sm"><Icon.download/> SDS.pdf</button>
                  <button className="btn btn-ghost btn-sm"><Icon.download/> HPLC trace</button>
                  <div style={{flex:1}}></div>
                  <a className="btn btn-link" href="product.html">Open product page <Icon.arrow/></a>
                </div>
              </div>

              <div className="card" style={{padding:24}}>
                <div className="eyebrow" style={{marginBottom:18}}>Chain of custody</div>
                <div style={{display:'flex',flexDirection:'column',gap:0,position:'relative'}}>
                  {[
                    { l:'Synthesized', d:'MAR 12, 2026 · 09:14', m:'Solid-phase synthesis · Reactor R-04' },
                    { l:'HPLC tested', d:'MAR 14, 2026 · 11:42', m:'C18 column · purity 99.42%' },
                    { l:'MS confirmed', d:'MAR 15, 2026 · 14:08', m:'ESI-MS · 813.91 ± 0.02 Da' },
                    { l:'QC released', d:'MAR 18, 2026 · 16:30', m:'Approved by J. Morales · QC-04' },
                    { l:'Inventoried', d:'MAR 22, 2026 · 08:00', m:'Bonded storage · Vault 02' },
                  ].map((s, i, arr) => (
                    <div key={i} style={{display:'grid',gridTemplateColumns:'24px 160px 1fr',gap:14,padding:'12px 0',borderBottom:i<arr.length-1?'1px solid var(--line-faint)':'none',alignItems:'flex-start'}}>
                      <div style={{position:'relative'}}>
                        <div style={{width:14,height:14,borderRadius:'50%',background:'var(--accent-hi)',marginTop:4}}></div>
                        {i<arr.length-1 && <div style={{position:'absolute',left:7,top:18,bottom:-12,width:1,background:'var(--line)'}}></div>}
                      </div>
                      <div className="mono" style={{fontSize:11,color:'var(--fg-muted)',letterSpacing:'0.04em',paddingTop:4}}>{s.d}</div>
                      <div>
                        <div style={{fontWeight:500,fontSize:14,marginBottom:2}}>{s.l}</div>
                        <div style={{fontSize:13,color:'var(--fg-muted)'}}>{s.m}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer/>
      <ThemeTweaks/>
      <style>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<COAApp/>);
