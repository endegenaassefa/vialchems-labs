/* checkout.jsx */
const { useState: chS } = React;

function CheckoutApp() {
  const [step, setStep] = chS(0);
  const [terms, setTerms] = chS(false);
  const [restAck, setRestAck] = chS(true);

  return (
    <div>
      <Nav active="cart" cartCount={3}/>
      <div className="container" style={{padding:'40px 24px 24px'}}>
        <div className="eyebrow" style={{marginBottom:6}}>· Restricted checkout</div>
        <h2>Compliance-gated checkout.</h2>
      </div>
      <div className="container" style={{padding:'24px 24px 80px',display:'grid',gridTemplateColumns:'1.6fr 1fr',gap:48,alignItems:'flex-start'}}>
        {/* Steps */}
        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          <Verification/>
          <Block n="01" title="Shipping address" expanded={step===0} onToggle={()=>setStep(0)}>
            <Row><Field label="Organization"><input className="input" defaultValue="Vail Institute Biochemistry Lab"/></Field></Row>
            <Row><Field label="Recipient"><input className="input" defaultValue="Dr. M. Hayes · Lab 314"/></Field></Row>
            <Row><Field label="Street"><input className="input" defaultValue="412 University Drive"/></Field></Row>
            <Row>
              <Field label="City"><input className="input" defaultValue="Boulder"/></Field>
              <Field label="State"><input className="input" defaultValue="CO"/></Field>
              <Field label="ZIP"><input className="input mono" defaultValue="80302"/></Field>
            </Row>
            <button className="btn btn-accent" onClick={()=>setStep(1)} style={{alignSelf:'flex-end'}}>Continue <Icon.arrow/></button>
          </Block>

          <Block n="02" title="Payment & PO" expanded={step===1} onToggle={()=>setStep(1)} disabled={step<1}>
            <div style={{display:'flex',gap:8,marginBottom:14}}>
              {['Purchase order','Net 30','ACH / Wire','Card'].map((m,i) => (
                <button key={m} className="btn btn-ghost btn-sm" style={{borderColor:i===0?'var(--fg)':'var(--line)'}}>{m}</button>
              ))}
            </div>
            <Row>
              <Field label="PO number"><input className="input mono" defaultValue="VIB-2026-0418"/></Field>
              <Field label="Reference"><input className="input mono" defaultValue="GRANT-NIH-44102"/></Field>
            </Row>
            <Row><Field label="Billing email"><input className="input" defaultValue="procurement@vailinst.edu"/></Field></Row>
            <button className="btn btn-accent" onClick={()=>setStep(2)} style={{alignSelf:'flex-end'}}>Continue <Icon.arrow/></button>
          </Block>

          <Block n="03" title="Review & terms" expanded={step===2} onToggle={()=>setStep(2)} disabled={step<2}>
            <div style={{padding:'14px 16px',border:'1px solid var(--warn)',background:'var(--warn-soft)',borderRadius:'var(--r-sm)',marginBottom:14}}>
              <div style={{display:'flex',gap:10,alignItems:'flex-start'}}>
                <div style={{color:'var(--warn)',marginTop:2}}><Icon.shield/></div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:500,marginBottom:4}}>This order contains restricted materials.</div>
                  <div style={{fontSize:12,color:'var(--fg-muted)',marginBottom:10}}>Restricted SKUs require explicit acknowledgement before checkout. Documentation is filed with your organization's record.</div>
                  <label style={{display:'flex',gap:8,fontSize:13,cursor:'pointer'}}>
                    <input type="checkbox" checked={restAck} onChange={e=>setRestAck(e.target.checked)}/>
                    I confirm restricted materials in this order will be used research-use-only by qualified personnel.
                  </label>
                </div>
              </div>
            </div>
            <label style={{display:'flex',gap:10,padding:'14px 16px',border:'1px solid '+(terms?'var(--accent)':'var(--line)'),borderRadius:'var(--r-sm)',cursor:'pointer',background:terms?'var(--accent-soft)':'transparent'}}>
              <input type="checkbox" checked={terms} onChange={e=>setTerms(e.target.checked)} style={{marginTop:3}}/>
              <div style={{fontSize:13}}>I accept the <a style={{textDecoration:'underline'}}>Terms of Sale</a>, <a style={{textDecoration:'underline'}}>Research Use Policy</a>, and confirm the shipping address is a verified research facility associated with my organization.</div>
            </label>
            <button className="btn btn-accent btn-lg" disabled={!terms||!restAck} style={{opacity:terms&&restAck?1:0.5,marginTop:8,alignSelf:'flex-start'}} onClick={()=>window.location.href='order.html'}>
              Place order · $440.00 <Icon.arrow/>
            </button>
          </Block>
        </div>

        {/* Summary */}
        <div className="card" style={{padding:24,position:'sticky',top:80}}>
          <div className="eyebrow" style={{marginBottom:14}}>Order summary · 3 units</div>
          {[
            { code:'VC-014', name:'SEMAX', mass:'10 mg', lot:'VC-014-A2604', price:148, qty:2 },
            { code:'VC-031', name:'GHK-Cu', mass:'50 mg', lot:'VC-031-A2603', price:120, qty:1 },
          ].map(it => (
            <div key={it.code} style={{display:'grid',gridTemplateColumns:'48px 1fr auto',gap:12,padding:'10px 0',borderBottom:'1px solid var(--line-faint)',alignItems:'center'}}>
              <div style={{width:36,height:50}}><VialMock label={it.name} code={it.code} mass={it.mass}/></div>
              <div>
                <div style={{fontSize:13,fontWeight:500}}>{it.name} <span style={{color:'var(--fg-muted)',fontWeight:400}}>×{it.qty}</span></div>
                <div className="mono" style={{fontSize:10,color:'var(--fg-muted)'}}>{it.code} · {it.mass}</div>
              </div>
              <div className="mono" style={{fontSize:13,fontWeight:500}}>${(it.price*it.qty).toFixed(2)}</div>
            </div>
          ))}
          <div style={{paddingTop:14,marginTop:8}}>
            <Row2 l="Subtotal" v="$416.00"/>
            <Row2 l="Bonded shipping" v="$24.00"/>
            <div style={{borderTop:'1px solid var(--line)',marginTop:10,paddingTop:10}}><Row2 l="Total" v="$440.00" bold/></div>
          </div>
        </div>
      </div>
      <Footer/>
      <ThemeTweaks/>
    </div>
  );
}

function Verification() {
  return (
    <div className="card" style={{padding:18,display:'flex',gap:14,alignItems:'center',borderLeft:'3px solid var(--ok)'}}>
      <div style={{width:36,height:36,borderRadius:'50%',background:'var(--ok-soft)',color:'var(--ok)',display:'grid',placeItems:'center'}}><Icon.check width="18" height="18"/></div>
      <div style={{flex:1}}>
        <div style={{fontSize:14,fontWeight:500}}>Organization verified</div>
        <div className="mono" style={{fontSize:11,color:'var(--fg-muted)',letterSpacing:'0.04em'}}>VAIL-INST-BIOCHEM · APPROVED MAR 04, 2026 · RESTRICTED ENABLED</div>
      </div>
      <span className="badge badge-verified"><span className="badge-dot"></span>VERIFIED</span>
    </div>
  );
}

const Block = ({n, title, expanded, onToggle, disabled, children}) => (
  <div className="card" style={{padding:0,opacity:disabled?0.5:1,pointerEvents:disabled?'none':'auto'}}>
    <button onClick={onToggle} style={{display:'flex',width:'100%',padding:'18px 24px',background:'transparent',border:'none',alignItems:'center',gap:14,cursor:'pointer',fontFamily:'inherit',color:'var(--fg)'}}>
      <span className="mono" style={{fontSize:11,color:'var(--accent-hi)',letterSpacing:'0.08em'}}>{n}</span>
      <span style={{fontSize:15,fontWeight:500}}>{title}</span>
      <span style={{flex:1}}></span>
      <span style={{transform:expanded?'rotate(90deg)':'none',transition:'transform 200ms',color:'var(--fg-muted)'}}><Icon.chevron/></span>
    </button>
    {expanded && <div style={{padding:'0 24px 24px',display:'flex',flexDirection:'column',gap:14,borderTop:'1px solid var(--line-faint)',paddingTop:18}}>{children}</div>}
  </div>
);

ReactDOM.createRoot(document.getElementById('root')).render(<CheckoutApp/>);
