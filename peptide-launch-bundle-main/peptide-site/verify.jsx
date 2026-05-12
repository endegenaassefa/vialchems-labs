/* verify.jsx — researcher verification stepper */
const { useState: vS } = React;

function VerifyApp() {
  const [step, setStep] = vS(0);
  const [data, setData] = vS({
    org:'', orgType:'University lab', country:'United States', address:'',
    name:'', title:'Principal Investigator', email:'', phone:'',
    research:'', restricted:false,
    ruoAttest:false, noHumanAttest:false, complianceAttest:false,
  });
  const update = (k,v) => setData(d => ({...d, [k]:v}));

  const steps = ['Organization','Researcher','Research use','Attestation','Review'];
  const canNext = () => {
    if (step===0) return data.org && data.address;
    if (step===1) return data.name && data.email;
    if (step===2) return data.research.length > 20;
    if (step===3) return data.ruoAttest && data.noHumanAttest && data.complianceAttest;
    return true;
  };

  return (
    <div>
      <Nav active="verify"/>
      <div className="container" style={{padding:'48px 24px 80px',maxWidth:1080}}>
        <div className="eyebrow" style={{marginBottom:8}}>· Researcher access</div>
        <h2 style={{marginBottom:32}}>Request verified research access.</h2>

        {/* Stepper */}
        <div style={{display:'grid',gridTemplateColumns:`repeat(${steps.length}, 1fr)`,gap:0,marginBottom:48,position:'relative'}}>
          <div style={{position:'absolute',top:14,left:14,right:14,height:1,background:'var(--line)'}}></div>
          <div style={{position:'absolute',top:14,left:14,height:1,background:'var(--accent-hi)',width:`calc(${(step/(steps.length-1))*100}% - 28px)`,transition:'width 400ms var(--ease)'}}></div>
          {steps.map((s, i) => (
            <button key={i} onClick={()=>i<step&&setStep(i)} style={{background:'transparent',border:'none',padding:0,textAlign:'left',cursor:i<=step?'pointer':'default'}}>
              <div style={{width:28,height:28,borderRadius:'50%',background:i<=step?'var(--accent)':'var(--bg-elevated)',color:i<=step?'#fff':'var(--fg-muted)',border:'1px solid '+(i<=step?'var(--accent)':'var(--line-strong)'),display:'grid',placeItems:'center',fontFamily:'var(--font-mono)',fontSize:11,fontWeight:500,position:'relative',zIndex:1,marginBottom:10,transition:'all 300ms'}}>
                {i<step ? <Icon.check width="12" height="12"/> : (i+1).toString().padStart(2,'0')}
              </div>
              <div style={{fontSize:12,fontWeight:500,color:i<=step?'var(--fg)':'var(--fg-muted)'}}>{s}</div>
            </button>
          ))}
        </div>

        <div className="card" style={{padding:40,minHeight:440}}>
          {step===0 && (
            <Section title="Organization" sub="Enter the legal entity that will hold the verified account.">
              <Field label="Organization name"><input className="input" value={data.org} onChange={e=>update('org',e.target.value)} placeholder="e.g. Vail Institute Biochemistry Lab"/></Field>
              <Row>
                <Field label="Organization type"><select className="input" value={data.orgType} onChange={e=>update('orgType',e.target.value)}><option>University lab</option><option>Biotech / pharma</option><option>Contract research org</option><option>Government / public health</option></select></Field>
                <Field label="Country"><select className="input" value={data.country} onChange={e=>update('country',e.target.value)}><option>United States</option><option>Canada</option><option>United Kingdom</option><option>Germany</option><option>Australia</option></select></Field>
              </Row>
              <Field label="Registered address"><textarea className="input" rows="3" value={data.address} onChange={e=>update('address',e.target.value)} placeholder="Street, city, state/province, postal code"></textarea></Field>
            </Section>
          )}
          {step===1 && (
            <Section title="Researcher" sub="The primary point of contact for this verified account.">
              <Row>
                <Field label="Full name"><input className="input" value={data.name} onChange={e=>update('name',e.target.value)} placeholder="First and last"/></Field>
                <Field label="Role / title"><select className="input" value={data.title} onChange={e=>update('title',e.target.value)}><option>Principal Investigator</option><option>Lab Director</option><option>Senior Researcher</option><option>Postdoctoral Fellow</option><option>Research Associate</option><option>Procurement Officer</option></select></Field>
              </Row>
              <Row>
                <Field label="Institutional email"><input className="input" value={data.email} onChange={e=>update('email',e.target.value)} placeholder="you@institution.edu"/></Field>
                <Field label="Phone"><input className="input" value={data.phone} onChange={e=>update('phone',e.target.value)} placeholder="+1 555 555 0123"/></Field>
              </Row>
              <div style={{padding:'14px 16px',background:'var(--bg-sunken)',borderRadius:'var(--r-sm)',fontSize:13,color:'var(--fg-muted)'}}>
                <Icon.shield/> &nbsp; We verify the email domain matches your stated organization. Personal email domains will be rejected.
              </div>
            </Section>
          )}
          {step===2 && (
            <Section title="Research use" sub="Describe how your laboratory will use these materials.">
              <Field label="Intended research scope"><textarea className="input" rows="6" value={data.research} onChange={e=>update('research',e.target.value)} placeholder="Briefly describe the research program these materials will support. Avoid clinical, therapeutic, or treatment language."></textarea></Field>
              <label style={{display:'flex',alignItems:'flex-start',gap:10,padding:'14px 16px',border:'1px solid var(--line)',borderRadius:'var(--r-sm)',cursor:'pointer'}}>
                <input type="checkbox" checked={data.restricted} onChange={e=>update('restricted',e.target.checked)} style={{marginTop:3}}/>
                <span style={{fontSize:13}}><strong>Request access to restricted catalog</strong><br/><span style={{color:'var(--fg-muted)'}}>Restricted materials require additional review and may extend verification time by 1–3 days.</span></span>
              </label>
            </Section>
          )}
          {step===3 && (
            <Section title="Attestations" sub="Each verified account must accept the following attestations.">
              <Attest checked={data.ruoAttest} onChange={v=>update('ruoAttest',v)} title="Research-use-only attestation">
                I confirm all materials procured through vailchem.labs will be used solely for laboratory research purposes by qualified personnel within a controlled research environment.
              </Attest>
              <Attest checked={data.noHumanAttest} onChange={v=>update('noHumanAttest',v)} title="No human or animal use">
                Materials will not be administered to, consumed by, or applied to any human or animal subject, and will not be used to diagnose, treat, cure, or prevent any condition.
              </Attest>
              <Attest checked={data.complianceAttest} onChange={v=>update('complianceAttest',v)} title="Compliance & documentation">
                I will maintain procurement records, retain batch documentation as required by my organization, and comply with all applicable laws and regulations governing research-material handling in my jurisdiction.
              </Attest>
            </Section>
          )}
          {step===4 && (
            <Section title="Review & submit" sub="Confirm the information below. Verification typically completes within one business day.">
              <Review label="Organization" value={`${data.org || '—'} · ${data.orgType}`}/>
              <Review label="Researcher" value={`${data.name || '—'} · ${data.title}`}/>
              <Review label="Email / phone" value={`${data.email || '—'} · ${data.phone || '—'}`}/>
              <Review label="Research scope" value={data.research || '—'}/>
              <Review label="Restricted access" value={data.restricted ? 'Requested' : 'Not requested'}/>
              <Review label="Attestations" value="Research use only · No human or animal use · Compliance"/>
            </Section>
          )}

          {/* Nav */}
          <div style={{display:'flex',justifyContent:'space-between',marginTop:32,paddingTop:24,borderTop:'1px solid var(--line)'}}>
            <button className="btn btn-ghost" onClick={()=>setStep(Math.max(0,step-1))} disabled={step===0} style={{opacity:step===0?0.4:1}}>← Back</button>
            {step<steps.length-1 ? (
              <button className="btn btn-accent" onClick={()=>canNext()&&setStep(step+1)} disabled={!canNext()} style={{opacity:canNext()?1:0.5}}>Continue <Icon.arrow/></button>
            ) : (
              <button className="btn btn-accent" onClick={()=>alert('Submitted (mock)')}>Submit for verification <Icon.arrow/></button>
            )}
          </div>
        </div>
      </div>

      <Footer/>
      <ThemeTweaks/>
    </div>
  );
}

const Section = ({title, sub, children}) => (
  <div>
    <h3 style={{marginBottom:6}}>{title}</h3>
    <p style={{fontSize:14,color:'var(--fg-muted)',marginBottom:24}}>{sub}</p>
    <div style={{display:'flex',flexDirection:'column',gap:18}}>{children}</div>
  </div>
);
const Field = ({label, children}) => <div style={{flex:1}}><div className="label">{label}</div>{children}</div>;
const Row = ({children}) => <div style={{display:'flex',gap:16}}>{children}</div>;
const Attest = ({checked, onChange, title, children}) => (
  <label style={{display:'flex',gap:14,padding:'18px 20px',border:'1px solid '+(checked?'var(--accent)':'var(--line)'),borderRadius:'var(--r-sm)',cursor:'pointer',background:checked?'var(--accent-soft)':'transparent',transition:'all 200ms'}}>
    <input type="checkbox" checked={checked} onChange={e=>onChange(e.target.checked)} style={{marginTop:3}}/>
    <div><div style={{fontSize:14,fontWeight:500,marginBottom:4}}>{title}</div><div style={{fontSize:13,color:'var(--fg-muted)',lineHeight:1.5}}>{children}</div></div>
  </label>
);
const Review = ({label,value}) => (
  <div style={{display:'grid',gridTemplateColumns:'180px 1fr',gap:24,padding:'14px 0',borderBottom:'1px solid var(--line-faint)'}}>
    <div className="label" style={{margin:0}}>{label}</div>
    <div style={{fontSize:14,color:'var(--fg)'}}>{value}</div>
  </div>
);

ReactDOM.createRoot(document.getElementById('root')).render(<VerifyApp/>);
