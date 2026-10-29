import Section from '../components/Section';
import { Bullets, Reveal } from '../components/ui';

// Every write takes the same path: the browser proposes, a server function checks and measures,
// and only then the data is stored. Writing straight to the tables is blocked by their access rules.
const CHECKS = [
  'Signed in?',
  'Input well-formed? (outline inside the scan)',
  'Allowed? (Reviewer or Admin)',
  'Scan still open? (not signed off)',
  'Measure again on the stored scan',
  'Write the data and the audit log',
];

export default function ServerPath() {
  return (
    <Section id="server-path" title="Every change goes through the server">
      <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)]">
        <Reveal>
          <svg viewBox="0 0 1060 580" className="h-auto w-full" role="img"
            aria-label="Browser sends a proposal to a server function, which runs six checks before writing to the Base44 tables; a direct write from the browser is blocked">
            <defs>
              <marker id="sp-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0 0 L10 5 L0 10 z" fill="var(--color-text-dim)" />
              </marker>
              <marker id="sp-block" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0 0 L10 5 L0 10 z" fill="var(--color-warn)" />
              </marker>
            </defs>

            {/* Browser */}
            <rect x={10} y={120} width={230} height={200} rx={14} fill="var(--color-surface)" stroke="var(--color-border-strong)" strokeWidth={2} />
            <text x={30} y={158} fontSize={22} fontWeight={600} fill="var(--color-text)">Browser</text>
            <foreignObject x={30} y={170} width={196} height={140}>
              <div style={{ fontSize: 15, lineHeight: 1.4, color: 'var(--color-text-dim)' }}>
                Outlines and edits the tumor, shows a live preview. <b style={{ color: 'var(--color-text)' }}>Proposes only.</b>
              </div>
            </foreignObject>

            {/* Server function */}
            <rect x={330} y={20} width={400} height={480} rx={14} fill="var(--color-brand-tint)" stroke="var(--color-brand)" strokeWidth={2} />
            <text x={354} y={60} fontSize={22} fontWeight={600} fill="var(--color-text)">Server function</text>
            {CHECKS.map((c, i) => (
              <g key={c}>
                <rect x={354} y={80 + i * 68} width={352} height={54} rx={10} fill="var(--color-surface)" />
                <circle cx={380} cy={107 + i * 68} r={14} fill="var(--color-brand)" />
                <text x={380} y={112 + i * 68} fontSize={14} fontWeight={600} fill="#fff" textAnchor="middle">{i + 1}</text>
                <text x={404} y={113 + i * 68} fontSize={16} fill="var(--color-text)">{c}</text>
              </g>
            ))}

            {/* Base44 tables */}
            <rect x={820} y={120} width={230} height={200} rx={14} fill="var(--color-warn-tint)" stroke="var(--color-warn)" strokeWidth={2} />
            <text x={840} y={158} fontSize={22} fontWeight={600} fill="var(--color-text)">Base44 tables</text>
            <foreignObject x={840} y={170} width={196} height={140}>
              <div style={{ fontSize: 15, lineHeight: 1.4, color: 'var(--color-text-dim)' }}>
                Measurement, Tumor, EditLog. Their access rules allow <b style={{ color: 'var(--color-text)' }}>no direct writes</b>.
              </div>
            </foreignObject>

            {/* Allowed path */}
            <line x1={240} y1={200} x2={326} y2={200} stroke="var(--color-text-dim)" strokeWidth={2} markerEnd="url(#sp-arrow)" />
            <text x={248} y={190} fontSize={14} fill="var(--color-text-dim)">proposal</text>
            <line x1={730} y1={200} x2={816} y2={200} stroke="var(--color-text-dim)" strokeWidth={2} markerEnd="url(#sp-arrow)" />
            <text x={740} y={190} fontSize={14} fill="var(--color-text-dim)">checked</text>

            {/* Blocked direct path */}
            <path d="M125 320 L125 548 L935 548 L935 324" fill="none" stroke="var(--color-warn)" strokeWidth={2} strokeDasharray="7 6" markerEnd="url(#sp-block)" />
            <rect x={760} y={530} width={150} height={36} rx={18} fill="var(--color-surface)" stroke="var(--color-warn)" />
            <text x={835} y={554} fontSize={15} fontWeight={600} fill="var(--color-warn)" textAnchor="middle">✕ blocked</text>
            <text x={140} y={538} fontSize={14} fill="var(--color-warn)">direct write through the API</text>
          </svg>
        </Reveal>
        <Reveal delay={0.1}>
          <Bullets
            items={[
              <><b>The browser proposes:</b> outlines, edits and previews run there for speed, but nothing it computes is stored as-is.</>,
              <><b>The server decides:</b> each save, edit and sign-off runs the same checks, then measures the outline again on the stored scan.</>,
              <><b>No way around it:</b> the tables' access rules block direct writes, even with a valid login.</>,
              <><b>Every change is logged:</b> who, when, and the value before and after, in an audit log no one can edit.</>,
            ]}
          />
        </Reveal>
      </div>
    </Section>
  );
}
