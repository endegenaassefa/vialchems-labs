/* order.jsx — order detail */
function OrderApp() {
  const items = [
    { code:'VC-014', name:'SEMAX', mass:'10 mg', lot:'VC-014-A2604', price:148, qty:2 },
    { code:'VC-031', name:'GHK-Cu', mass:'50 mg', lot:'VC-031-A2603', price:120, qty:1 },
  ];
  return (
    <div>
      <Nav active="account" cartCount={0}/>
      <div className="container" style={{padding:'40px 24px 24px',fontFamily:'var(--font-mono)',fontSize:11,color:'var(--fg-muted)',letterSpacing:'0.04em'}}>
        <a href="account.html">Documentation</a> <span style={{margin:'0 8px'}}>/</span> Orders <span style={{margin:'0 8px'}}>/</span> <span style={{color:'var(--fg)'}}>VC-2604-0418</span>
      </div>
      <div className="container" style={{padding:'8px 24px 32px'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',gap:24,flexWrap:'wrap'}}>
          <div>
            <div className="eyebrow" style={{marginBottom:8}}>· Order detail</div>
            <h2 className="mono" style={{fontSize:32}}>VC-2604-0418</h2>
            <div style={{display:'flex',gap:14,alignItems:'center',marginTop:8}}>
              <span className="badge badge-verified"><span className="badge-dot"></span>IN TRANSIT</span>
              <span className="mono" style={{fontSize:11,color:'var(--fg-muted)',letterSpacing:'0.05em'}}>PLACED APR 18, 2026 · 09:42</span>
            </div>
          </div>
          <div style={{display:'flex',gap:8}}>
            <button className="btn btn-ghost btn-sm"><Icon.download/> Order PDF</button>
            <button className="btn btn-ghost btn-sm"><Icon.download/> All COAs</button>
            <button className="btn btn-primary btn-sm">Reorder</button>
          </div>
        </div>
      </div>

      <div className="container" style={{padding:'24px 24px 80px',display:'grid',gridTemplateColumns:'1.6fr 1fr',gap:48,alignItems:'flex-start'}}>
        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          <div className="card" style={{padding:0,overflow:'hidden'}}>
            <div style={{padding:'16px 20px',borderBottom:'1px solid var(--line)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div className="eyebrow">Items · 3 units</div>
              <span className="mono" style={{fontSize:11,color:'var(--fg-muted)'}}>$416.00 SUB</span>
            </div>
            {items.map((it, i) => (
              <div key={it.code} style={{display:'grid',gridTemplateColumns:'80px 1fr 100px 80px 100px',padding:'18px 20px',borderBottom:i<items.length-1?'1px solid var(--line)':'none',alignItems:'center',gap:14}}>
                <div style={{width:60,height:80}}><VialMock label={it.name} code={it.code} mass={it.mass}/></div>
                <div>
                  <div style={{fontSize:14,fontWeight:500,marginBottom:3}}>{it.name}</div>
                  <div className="mono" style={{fontSize:10,color:'var(--fg-muted)',letterSpacing:'0.04em',marginBottom:8}}>{it.code} · LOT {it.lot}</div>
                  <div style={{display:'flex',gap:6}}>
                    <button className="btn btn-link"><Icon.download/> COA</button>
                    <button className="btn btn-link"><Icon.download/> SDS</button>
                  </div>
                </div>
                <div className="mono" style={{fontSize:13}}>${it.price}.00</div>
                <div className="mono" style={{fontSize:13}}>×{it.qty}</div>
                <div className="mono" style={{fontSize:14,fontWeight:500}}>${(it.price*it.qty).toFixed(2)}</div>
              </div>
            ))}
          </div>

          {/* Tracking timeline */}
          <div className="card" style={{padding:24}}>
            <div className="eyebrow" style={{marginBottom:18}}>Order timeline</div>
            {[
              { l:'Order placed', d:'APR 18, 2026 · 09:42', s:'done' },
              { l:'Documentation prepared', d:'APR 18, 2026 · 14:08', s:'done' },
              { l:'Released from bonded storage', d:'APR 19, 2026 · 11:30', s:'done' },
              { l:'In transit', d:'APR 20, 2026 · estimated', s:'active' },
              { l:'Delivery', d:'APR 22, 2026 · estimated', s:'pending' },
            ].map((s, i, arr) => (
              <div key={i} style={{display:'grid',gridTemplateColumns:'24px 200px 1fr',gap:14,padding:'12px 0',borderBottom:i<arr.length-1?'1px solid var(--line-faint)':'none',alignItems:'flex-start'}}>
                <div style={{position:'relative'}}>
                  <div style={{width:14,height:14,borderRadius:'50%',marginTop:4,background:s.s==='done'?'var(--accent-hi)':s.s==='active'?'var(--accent-hi)':'var(--bg-elevated)',border:'1px solid '+(s.s==='pending'?'var(--line-strong)':'var(--accent-hi)'),boxShadow:s.s==='active'?'0 0 0 4px var(--accent-soft)':'none',animation:s.s==='active'?'pulse-soft 1.6s ease-in-out infinite':'none'}}></div>
                  {i<arr.length-1 && <div style={{position:'absolute',left:7,top:18,bottom:-12,width:1,background:'var(--line)'}}></div>}
                </div>
                <div className="mono" style={{fontSize:11,color:'var(--fg-muted)',letterSpacing:'0.04em',paddingTop:4}}>{s.d}</div>
                <div style={{fontSize:14,fontWeight:s.s==='active'?500:400,color:s.s==='pending'?'var(--fg-muted)':'var(--fg)',paddingTop:3}}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          <div className="card" style={{padding:24}}>
            <div className="eyebrow" style={{marginBottom:14}}>Summary</div>
            <Row2 l="Subtotal" v="$416.00"/>
            <Row2 l="Bonded shipping" v="$24.00"/>
            <Row2 l="Documentation" v="Included"/>
            <div style={{borderTop:'1px solid var(--line)',marginTop:10,paddingTop:10}}><Row2 l="Total" v="$440.00" bold/></div>
          </div>
          <div className="card" style={{padding:20}}>
            <div className="eyebrow" style={{marginBottom:10}}>Ship to</div>
            <div style={{fontSize:14,fontWeight:500,marginBottom:4}}>Vail Institute Biochemistry Lab</div>
            <div style={{fontSize:13,color:'var(--fg-muted)',lineHeight:1.5}}>
              Dr. M. Hayes · Lab 314<br/>412 University Drive<br/>Boulder, CO 80302<br/>United States
            </div>
          </div>
          <div className="card" style={{padding:20}}>
            <div className="eyebrow" style={{marginBottom:10}}>Procurement</div>
            <table className="spec-table">
              <tbody>
                <tr><td>PO</td><td>VIB-2026-0418</td></tr>
                <tr><td>Reference</td><td>GRANT-NIH-44102</td></tr>
                <tr><td>Method</td><td>Purchase order</td></tr>
                <tr><td>Terms</td><td>Net 30</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Footer/>
      <ThemeTweaks/>
    </div>
  );
}

const Row2 = ({l,v,bold}) => (
  <div style={{display:'flex',justifyContent:'space-between',padding:'6px 0',fontSize:bold?16:13,fontWeight:bold?500:400}}>
    <span style={{color:bold?'var(--fg)':'var(--fg-muted)'}}>{l}</span>
    <span className="mono">{v}</span>
  </div>
);

ReactDOM.createRoot(document.getElementById('root')).render(<OrderApp/>);
