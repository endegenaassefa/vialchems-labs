/* account.jsx + order.jsx */
const { useState: aS } = React;

function AccountApp() {
  const [tab, setTab] = aS('orders');
  return (
    <div>
      <Nav active="account"/>
      <div style={{borderBottom:'1px solid var(--line)',padding:'40px 0',background:'var(--bg-elevated)'}}>
        <div className="container" style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',gap:24,flexWrap:'wrap'}}>
          <div>
            <div className="eyebrow" style={{marginBottom:8}}>· My lab</div>
            <h2 style={{fontSize:36,marginBottom:8}}>Vail Institute Biochemistry Lab</h2>
            <div style={{display:'flex',gap:14,alignItems:'center'}}>
              <span className="badge badge-verified"><span className="badge-dot"></span>VERIFIED</span>
              <span className="mono" style={{fontSize:11,color:'var(--fg-muted)',letterSpacing:'0.05em'}}>VAIL-INST-BIOCHEM · UNIVERSITY LAB · CO, USA</span>
            </div>
          </div>
          <div style={{display:'flex',gap:8}}>
            <a className="btn btn-ghost btn-sm" href="catalog.html">Browse catalog</a>
            <a className="btn btn-primary btn-sm" href="coa-lookup.html">Verify a vial <Icon.arrow/></a>
          </div>
        </div>
      </div>

      <div className="container" style={{padding:'32px 24px 24px'}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4, 1fr)',gap:0,border:'1px solid var(--line)',background:'var(--bg-elevated)',borderRadius:'var(--r-md)'}}>
          <KPI label="Active orders" v="3" sub="In transit" color="var(--accent-hi)"/>
          <KPI label="Vials on hand" v="14" sub="Across 9 peptides"/>
          <KPI label="COAs archived" v="142" sub="COA · SDS · HPLC trace"/>
          <KPI label="Restricted access" v="Active" sub="Renewed Mar 04" color="var(--ok)"/>
        </div>
      </div>

      <div className="container" style={{padding:'24px 24px 80px',display:'grid',gridTemplateColumns:'220px 1fr',gap:48,alignItems:'flex-start'}}>
        <aside>
          {[
            {id:'orders',l:'Orders',c:8},
            {id:'docs',l:'Documents',c:142},
            {id:'lots',l:'Lots on file',c:14},
            {id:'team',l:'Team & access',c:5},
            {id:'org',l:'Organization',c:null},
            {id:'attest',l:'Attestations',c:null},
          ].map(t => (
            <button key={t.id} onClick={()=>setTab(t.id)} style={{display:'flex',width:'100%',padding:'10px 14px',background:tab===t.id?'var(--bg-sunken)':'transparent',border:'1px solid '+(tab===t.id?'var(--line)':'transparent'),borderRadius:'var(--r-sm)',fontFamily:'inherit',fontSize:14,color:'var(--fg)',cursor:'pointer',alignItems:'center',marginBottom:2,textAlign:'left'}}>
              <span style={{flex:1}}>{t.l}</span>
              {t.c!==null && <span className="mono" style={{fontSize:11,color:'var(--fg-subtle)'}}>{t.c}</span>}
            </button>
          ))}
        </aside>

        <div>
          {tab==='orders' && <Orders/>}
          {tab==='docs' && <Documents/>}
          {tab==='lots' && <Lots/>}
          {tab==='team' && <Team/>}
          {tab==='org' && <OrgInfo/>}
          {tab==='attest' && <Attestations/>}
        </div>
      </div>

      <Footer/>
      <ThemeTweaks/>
    </div>
  );
}

const KPI = ({label, v, sub, color}) => (
  <div style={{padding:24,borderRight:'1px solid var(--line)'}}>
    <div className="eyebrow" style={{marginBottom:8}}>{label}</div>
    <div className="mono" style={{fontSize:32,fontWeight:500,color:color||'var(--fg)',marginBottom:4,letterSpacing:'-0.02em'}}>{v}</div>
    <div style={{fontSize:12,color:'var(--fg-muted)'}}>{sub}</div>
  </div>
);

function Orders() {
  const orders = [
    { id:'VC-2604-0418', date:'APR 18, 2026', items:3, total:440.00, status:'In transit', color:'var(--accent-hi)' },
    { id:'VC-2604-0402', date:'APR 02, 2026', items:1, total:148.00, status:'Delivered', color:'var(--ok)' },
    { id:'VC-2603-0314', date:'MAR 14, 2026', items:5, total:892.00, status:'Delivered', color:'var(--ok)' },
    { id:'VC-2603-0301', date:'MAR 01, 2026', items:2, total:240.00, status:'Delivered', color:'var(--ok)' },
    { id:'VC-2602-0218', date:'FEB 18, 2026', items:4, total:618.00, status:'Delivered', color:'var(--ok)' },
  ];
  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:20}}>
        <h3>Recent orders</h3>
        <button className="btn btn-link">Export ledger <Icon.download/></button>
      </div>
      <div className="card" style={{padding:0,overflow:'hidden'}}>
        <div className="mono" style={{display:'grid',gridTemplateColumns:'1.4fr 1fr 80px 100px 120px 60px',padding:'10px 20px',borderBottom:'1px solid var(--line)',fontSize:10,letterSpacing:'0.08em',textTransform:'uppercase',color:'var(--fg-muted)'}}>
          <span>Order</span><span>Date</span><span>Items</span><span>Total</span><span>Status</span><span></span>
        </div>
        {orders.map((o, i) => (
          <a key={o.id} href="order.html" style={{display:'grid',gridTemplateColumns:'1.4fr 1fr 80px 100px 120px 60px',padding:'14px 20px',borderBottom:i<orders.length-1?'1px solid var(--line)':'none',alignItems:'center',color:'var(--fg)',transition:'background 100ms'}}
            onMouseEnter={e=>e.currentTarget.style.background='var(--bg-sunken)'}
            onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
            <span className="mono" style={{fontSize:13,fontWeight:500}}>{o.id}</span>
            <span className="mono" style={{fontSize:12,color:'var(--fg-muted)'}}>{o.date}</span>
            <span className="mono" style={{fontSize:12}}>{o.items}</span>
            <span className="mono" style={{fontSize:13,fontWeight:500}}>${o.total.toFixed(2)}</span>
            <span style={{display:'flex',alignItems:'center',gap:6,fontSize:12}}>
              <span style={{width:6,height:6,borderRadius:'50%',background:o.color}}></span>{o.status}
            </span>
            <span style={{textAlign:'right',color:'var(--fg-muted)'}}><Icon.arrow/></span>
          </a>
        ))}
      </div>
    </div>
  );
}

function Documents() {
  const docs = [
    { n:'COA · VC-014-A2604', t:'COA', d:'Mar 18, 2026', s:'184 KB' },
    { n:'COA · VC-031-A2603', t:'COA', d:'Mar 02, 2026', s:'192 KB' },
    { n:'SDS · SEMAX v3.2', t:'SDS', d:'Jan 12, 2026', s:'218 KB' },
    { n:'Lot Release · A2604', t:'REL', d:'Mar 18, 2026', s:'64 KB' },
    { n:'Procurement Ledger Q1', t:'LDG', d:'Apr 02, 2026', s:'412 KB' },
  ];
  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:20}}>
        <h3>Documents on file</h3>
        <div style={{display:'flex',gap:8}}>
          <input className="input mono" placeholder="Search documents…" style={{width:240}}/>
        </div>
      </div>
      <div className="card" style={{padding:0,overflow:'hidden'}}>
        {docs.map((d, i) => (
          <div key={i} style={{display:'grid',gridTemplateColumns:'24px 1fr 80px 130px 100px 80px',gap:14,padding:'14px 20px',borderBottom:i<docs.length-1?'1px solid var(--line)':'none',alignItems:'center'}}>
            <Icon.doc width="18" height="18"/>
            <span style={{fontSize:14,fontWeight:500}}>{d.n}</span>
            <span className="badge">{d.t}</span>
            <span className="mono" style={{fontSize:11,color:'var(--fg-muted)'}}>{d.d}</span>
            <span className="mono" style={{fontSize:11,color:'var(--fg-muted)'}}>{d.s}</span>
            <button className="btn btn-link"><Icon.download/></button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Lots() {
  const lots = [
    { l:'VC-014-A2604', p:'SEMAX', purity:'99.42%', received:'Mar 22, 2026', stat:'In stock' },
    { l:'VC-031-A2603', p:'GHK-Cu', purity:'99.18%', received:'Mar 08, 2026', stat:'In stock' },
    { l:'VC-008-A2511', p:'EPITALON', purity:'99.04%', received:'Nov 25, 2025', stat:'Depleting' },
  ];
  return (
    <div>
      <h3 style={{marginBottom:20}}>Lots on file</h3>
      <div className="card" style={{padding:0,overflow:'hidden'}}>
        <div className="mono" style={{display:'grid',gridTemplateColumns:'1.4fr 1fr 1fr 1fr 1fr 60px',padding:'10px 20px',borderBottom:'1px solid var(--line)',fontSize:10,letterSpacing:'0.08em',textTransform:'uppercase',color:'var(--fg-muted)'}}>
          <span>Lot</span><span>Material</span><span>Purity</span><span>Received</span><span>Status</span><span></span>
        </div>
        {lots.map((l, i) => (
          <div key={l.l} style={{display:'grid',gridTemplateColumns:'1.4fr 1fr 1fr 1fr 1fr 60px',padding:'14px 20px',borderBottom:i<lots.length-1?'1px solid var(--line)':'none',alignItems:'center'}}>
            <span className="mono" style={{fontSize:13,fontWeight:500}}>{l.l}</span>
            <span style={{fontSize:13}}>{l.p}</span>
            <span className="mono" style={{fontSize:12,color:'var(--ok)'}}>{l.purity}</span>
            <span className="mono" style={{fontSize:12,color:'var(--fg-muted)'}}>{l.received}</span>
            <span style={{fontSize:12}}>{l.stat}</span>
            <button className="btn btn-link" style={{justifySelf:'end'}}>COA <Icon.arrow/></button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Team() {
  const team = [
    { n:'Dr. Marcus Hayes', r:'Principal Investigator · Owner', e:'m.hayes@vailinst.edu', a:true },
    { n:'Dr. Lin Zhao', r:'Senior Researcher', e:'l.zhao@vailinst.edu', a:true },
    { n:'Sara Patel', r:'Procurement Officer', e:'s.patel@vailinst.edu', a:true },
    { n:'James Kim', r:'Research Associate', e:'j.kim@vailinst.edu', a:false },
  ];
  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:20}}>
        <h3>Team & access</h3>
        <button className="btn btn-accent btn-sm"><Icon.plus/> Invite member</button>
      </div>
      <div className="card" style={{padding:0,overflow:'hidden'}}>
        {team.map((m, i) => (
          <div key={i} style={{display:'grid',gridTemplateColumns:'40px 1fr 1fr 110px 60px',gap:14,padding:'14px 20px',borderBottom:i<team.length-1?'1px solid var(--line)':'none',alignItems:'center'}}>
            <div style={{width:32,height:32,borderRadius:'50%',background:'var(--bg-sunken)',border:'1px solid var(--line)',display:'grid',placeItems:'center',fontFamily:'var(--font-mono)',fontSize:11,color:'var(--fg-muted)'}}>{m.n.split(' ').map(p=>p[0]).join('').slice(0,2)}</div>
            <div>
              <div style={{fontSize:14,fontWeight:500}}>{m.n}</div>
              <div style={{fontSize:12,color:'var(--fg-muted)'}}>{m.r}</div>
            </div>
            <span className="mono" style={{fontSize:12,color:'var(--fg-muted)'}}>{m.e}</span>
            <span className="badge" style={{borderColor:m.a?'var(--ok)':'var(--line-strong)',color:m.a?'var(--ok)':'var(--fg-muted)',background:m.a?'var(--ok-soft)':'var(--bg-elevated)'}}>{m.a?'ACTIVE':'PENDING'}</span>
            <button className="btn btn-link" style={{justifySelf:'end',color:'var(--fg-muted)'}}>···</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function OrgInfo() {
  return (
    <div>
      <h3 style={{marginBottom:20}}>Organization</h3>
      <div className="card" style={{padding:24}}>
        <table className="spec-table">
          <tbody>
            <tr><td>Legal name</td><td>Vail Institute Biochemistry Lab</td></tr>
            <tr><td>Type</td><td>University lab</td></tr>
            <tr><td>Country</td><td>United States</td></tr>
            <tr><td>Address</td><td>412 University Drive · Boulder, CO 80302</td></tr>
            <tr><td>Verified</td><td style={{color:'var(--ok)'}}>MAR 04, 2026</td></tr>
            <tr><td>Renews</td><td>MAR 04, 2027</td></tr>
            <tr><td>Restricted access</td><td style={{color:'var(--ok)'}}>ENABLED</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Attestations() {
  const items = [
    {t:'Research-use-only',d:'Signed Mar 04, 2026 · Dr. M. Hayes'},
    {t:'No human or animal use',d:'Signed Mar 04, 2026 · Dr. M. Hayes'},
    {t:'Compliance & documentation',d:'Signed Mar 04, 2026 · Dr. M. Hayes'},
  ];
  return (
    <div>
      <h3 style={{marginBottom:20}}>Attestations on file</h3>
      <div style={{display:'flex',flexDirection:'column',gap:12}}>
        {items.map((a,i)=>(
          <div key={i} className="card" style={{padding:'18px 20px',display:'flex',gap:14,alignItems:'center'}}>
            <div style={{width:32,height:32,borderRadius:'50%',background:'var(--ok-soft)',color:'var(--ok)',display:'grid',placeItems:'center'}}><Icon.check/></div>
            <div style={{flex:1}}>
              <div style={{fontSize:14,fontWeight:500}}>{a.t}</div>
              <div className="mono" style={{fontSize:11,color:'var(--fg-muted)',letterSpacing:'0.04em'}}>{a.d}</div>
            </div>
            <button className="btn btn-link"><Icon.download/> View</button>
          </div>
        ))}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<AccountApp/>);
