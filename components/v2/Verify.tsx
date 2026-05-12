import Link from 'next/link';
import { Icon } from './icons';
import { V2Footer, V2Header } from './Shell';

const steps = [
  ['01', 'Submit qualification', 'Create an account and provide organization, role, and research-use context.'],
  ['02', 'Compliance review', 'Buyer details, shipping eligibility, and research-use acknowledgement are reviewed.'],
  ['03', 'Unlock catalog access', 'Restricted materials and order flow become available to qualified accounts.'],
  ['04', 'Verify each vial', 'Match the lot code on the vial to the public COA record before bench intake.'],
];

export function V2Verify() {
  return (
    <>
      <V2Header />
      <main id="main">
        <section style={{ position: 'relative', overflow: 'hidden', borderBottom: '1px solid var(--line)' }}>
          <div className="container" style={{ padding: '72px 24px 90px', display: 'grid', gridTemplateColumns: 'minmax(0, 1.15fr) 360px', gap: 48, alignItems: 'start' }}>
            <div>
              <div className="badge badge-ruo" style={{ marginBottom: 24 }}>
                <span className="badge-dot" />
                Verified research access
              </div>
              <h1 style={{ marginBottom: 22 }}>Qualified research access. Batch-level vial verification.</h1>
              <p style={{ color: 'var(--fg-muted)', fontSize: 18, lineHeight: 1.6, maxWidth: 660, marginBottom: 30 }}>
                vailchem.labs sells research materials only to qualified laboratory and analytical buyers. Verification keeps the buyer, shipment, and vial lot tied to the published COA.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link href="/signup" className="btn btn-accent btn-lg">Start verification <Icon.arrow size={14} strokeWidth={1.5} /></Link>
                <Link href="/coa" className="btn btn-ghost btn-lg">Verify a vial lot</Link>
              </div>
            </div>
            <div className="card" style={{ padding: 20, boxShadow: 'var(--shadow-lg)' }}>
              <div className="eyebrow" style={{ marginBottom: 16 }}>Required before order access</div>
              <table className="spec-table">
                <tbody>
                  <tr><td>Age gate</td><td>21+ only</td></tr>
                  <tr><td>Use case</td><td>Laboratory research only</td></tr>
                  <tr><td>Shipping</td><td>Eligible US jurisdictions</td></tr>
                  <tr><td>Lot check</td><td>COA before bench use</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-hd">
              <div className="hd-l">
                <div className="eyebrow">Access flow</div>
                <h2>Built for documented research procurement.</h2>
              </div>
            </div>
            <div className="v2-steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
              {steps.map(([n, title, body], index) => (
                <div key={n} style={{ padding: '32px 20px', minHeight: 220, borderRight: index < steps.length - 1 ? '1px solid var(--line)' : 'none' }}>
                  <div className="mono" style={{ fontSize: 11, color: 'var(--accent-hi)', marginBottom: 24 }}>{n}</div>
                  <h2 style={{ fontSize: 18, marginBottom: 10 }}>{title}</h2>
                  <p style={{ fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.5 }}>{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <V2Footer />
    </>
  );
}
