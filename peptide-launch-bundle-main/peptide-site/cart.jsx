/* cart.jsx + checkout.jsx combined view */
const { useState: kS } = React;

function CartApp() {
  const [items, setItems] = kS([
    { code:'VC-014', name:'SEMAX', mass:'10 mg', lot:'VC-014-A2604', price:148, qty:2, restricted:false },
    { code:'VC-031', name:'GHK-Cu', mass:'50 mg', lot:'VC-031-A2603', price:120, qty:1, restricted:false },
  ]);
  const sub = items.reduce((s,i)=>s+i.price*i.qty,0);
  const ship = 24;
  const total = sub + ship;

  return (
    <div>
      <Nav active="cart" cartCount={items.reduce((s,i)=>s+i.qty,0)}/>
      <div className="container" style={{padding:'40px 24px 24px'}}>
        <div className="eyebrow" style={{marginBottom:6}}>· Cart</div>
        <h2 style={{marginBottom:8}}>Review your peptide order.</h2>
        <p style={{color:'var(--fg-muted)',fontSize:14,marginBottom:32}}>{items.length} peptides · {items.reduce((s,i)=>s+i.qty,0)} vials</p>
      </div>
      <div className="container" style={{padding:'0 24px 80px',display:'grid',gridTemplateColumns:'1.6fr 1fr',gap:48,alignItems:'flex-start'}}>
        <div className="card" style={{padding:0,overflow:'hidden'}}>
          <div className="mono" style={{display:'grid',gridTemplateColumns:'80px 1fr 100px 110px 110px 32px',padding:'12px 20px',borderBottom:'1px solid var(--line)',fontSize:10,letterSpacing:'0.08em',textTransform:'uppercase',color:'var(--fg-muted)'}}>
            <span></span><span>Material</span><span>Unit</span><span>Qty</span><span>Subtotal</span><span></span>
          </div>
          {items.map((it, idx) => (
            <div key={it.code} style={{display:'grid',gridTemplateColumns:'80px 1fr 100px 110px 110px 32px',padding:'18px 20px',borderBottom:idx<items.length-1?'1px solid var(--line)':'none',alignItems:'center',gap:14}}>
              <div style={{width:60,height:80}}><VialMock label={it.name} code={it.code} mass={it.mass}/></div>
              <div>
                <div style={{fontSize:14,fontWeight:500,marginBottom:3}}>{it.name}</div>
                <div className="mono" style={{fontSize:10,color:'var(--fg-muted)',letterSpacing:'0.04em',marginBottom:6}}>{it.code} · LOT {it.lot}</div>
                <div style={{display:'flex',gap:5}}>
                  <span className="badge badge-ruo">RESEARCH USE</span>
                  <span className="badge badge-coa">COA</span>
                  {it.restricted && <span className="badge badge-restricted">RESTRICTED</span>}
                </div>
              </div>
              <div className="mono" style={{fontSize:13}}>${it.price}.00</div>
              <div style={{display:'flex',alignItems:'center',border:'1px solid var(--line-strong)',borderRadius:'var(--r-sm)',width:96}}>
                <button className="icon-btn" onClick={()=>setItems(s=>s.map(x=>x.code===it.code?{...x,qty:Math.max(1,x.qty-1)}:x))} style={{border:'none',width:30}}><Icon.minus/></button>
                <span style={{flex:1,textAlign:'center',fontFamily:'var(--font-mono)',fontSize:13}}>{it.qty}</span>
                <button className="icon-btn" onClick={()=>setItems(s=>s.map(x=>x.code===it.code?{...x,qty:x.qty+1}:x))} style={{border:'none',width:30}}><Icon.plus/></button>
              </div>
              <div className="mono" style={{fontSize:14,fontWeight:500}}>${(it.price*it.qty).toFixed(2)}</div>
              <button className="btn btn-link" onClick={()=>setItems(s=>s.filter(x=>x.code!==it.code))} style={{color:'var(--fg-muted)'}}>×</button>
            </div>
          ))}
          <div style={{padding:'14px 20px',background:'var(--bg-sunken)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <a className="btn btn-link" href="catalog.html">← Continue browsing</a>
            <span className="mono" style={{fontSize:11,color:'var(--fg-muted)',letterSpacing:'0.05em'}}>· EVERY VIAL SHIPS WITH ITS COA</span>
          </div>
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:16,position:'sticky',top:80}}>
          <div className="card" style={{padding:24}}>
            <div className="eyebrow" style={{marginBottom:14}}>Order summary</div>
            <Row2 l="Subtotal" v={`$${sub.toFixed(2)}`}/>
            <Row2 l="Documentation prep" v="Included"/>
            <Row2 l="Bonded shipping" v={`$${ship.toFixed(2)}`}/>
            <div style={{borderTop:'1px solid var(--line)',marginTop:14,paddingTop:14}}>
              <Row2 l="Total" v={`$${total.toFixed(2)}`} bold/>
            </div>
            <a href="checkout.html" className="btn btn-accent" style={{width:'100%',justifyContent:'center',marginTop:16}}>Continue to checkout <Icon.arrow/></a>
          </div>
          <div className="card" style={{padding:18,borderLeft:'3px solid var(--accent-hi)'}}>
            <div style={{display:'flex',gap:10}}><Icon.shield/><div>
              <div style={{fontSize:13,fontWeight:500,marginBottom:4}}>Verification status: Active</div>
              <div style={{fontSize:12,color:'var(--fg-muted)'}}>vail-institute-biochem · approved Mar 04, 2026 · restricted catalog enabled.</div>
            </div></div>
          </div>
        </div>
      </div>
      <Footer/>
      <ThemeTweaks/>
    </div>
  );
}

const Row2 = ({l,v,bold}) => (
  <div style={{display:'flex',justifyContent:'space-between',padding:'6px 0',fontSize:bold?16:13,fontWeight:bold?500:400,color:'var(--fg)'}}>
    <span style={{color:bold?'var(--fg)':'var(--fg-muted)'}}>{l}</span>
    <span className="mono">{v}</span>
  </div>
);

ReactDOM.createRoot(document.getElementById('root')).render(<CartApp/>);
