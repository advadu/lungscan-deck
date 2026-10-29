import Section from '../components/Section';
import { Bullets, Reveal } from '../components/ui';

type Box = { x: number; y: number; name: string; fields: string; server?: boolean };

// The app's Base44 entities and how they link. Coral boxes are written only by the server.
const BOXES: Record<string, Box> = {
  patient: { x: 10, y: 40, name: 'Patient', fields: 'patient ID' },
  study: { x: 300, y: 40, name: 'Study', fields: 'date, label' },
  scan: { x: 590, y: 40, name: 'Scan', fields: 'one CT series · status, geometry, image files' },
  tumor: { x: 300, y: 250, name: 'Tumor', fields: 'N1, N2… · lobe, type', server: true },
  measurement: { x: 590, y: 250, name: 'Measurement', fields: 'one tumor on one scan · outline, volume, axes', server: true },
  editlog: { x: 590, y: 430, name: 'EditLog', fields: 'every change · before, after, who, when', server: true },
};
const LAB = ['User · lab role', 'TeamInvite', 'RolePermission', 'EmailConfig', 'EmailLog'];

const W = 220, H = 96;

function Node({ b }: { b: Box }) {
  return (
    <g>
      <rect x={b.x} y={b.y} width={W} height={H} rx={12}
        fill={b.server ? 'var(--color-warn-tint)' : 'var(--color-brand-tint)'}
        stroke={b.server ? 'var(--color-warn)' : 'var(--color-brand)'} strokeWidth={2} />
      <text x={b.x + 16} y={b.y + 32} fontSize={22} fontWeight={600} fill="var(--color-text)">{b.name}</text>
      <foreignObject x={b.x + 16} y={b.y + 42} width={W - 28} height={H - 46}>
        <div style={{ fontSize: 15, lineHeight: 1.3, color: 'var(--color-text-dim)' }}>{b.fields}</div>
      </foreignObject>
    </g>
  );
}

// An arrow from one box edge to another, with a short label.
function Link({ x1, y1, x2, y2, label, lx, ly }: { x1: number; y1: number; x2: number; y2: number; label: string; lx: number; ly: number }) {
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--color-text-faint)" strokeWidth={1.5} markerEnd="url(#arrow)" />
      <text x={lx} y={ly} fontSize={15} fill="var(--color-text-faint)">{label}</text>
    </g>
  );
}

export default function DataModel() {
  const B = BOXES;
  return (
    <Section id="data-model" title="Data model">
      <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)]">
        <Reveal>
          <svg viewBox="0 0 1060 540" className="h-auto w-full" role="img" aria-label="Entities: Patient, Study, Scan, Tumor, Measurement, EditLog, and the lab tables">
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0 0 L10 5 L0 10 z" fill="var(--color-text-faint)" />
              </marker>
            </defs>
            <Link x1={B.patient.x + W} y1={88} x2={B.study.x - 4} y2={88} label="has" lx={B.patient.x + W + 18} ly={78} />
            <Link x1={B.study.x + W} y1={88} x2={B.scan.x - 4} y2={88} label="has" lx={B.study.x + W + 18} ly={78} />
            <Link x1={B.patient.x + W / 2} y1={B.patient.y + H} x2={B.tumor.x - 4} y2={B.tumor.y + 30} label="has" lx={150} ly={225} />
            <Link x1={B.scan.x + W / 2} y1={B.scan.y + H} x2={B.measurement.x + W / 2} y2={B.measurement.y - 4} label="measured on" lx={B.scan.x + W / 2 + 10} ly={200} />
            <Link x1={B.tumor.x + W} y1={B.tumor.y + H / 2} x2={B.measurement.x - 4} y2={B.measurement.y + H / 2} label="of" lx={B.tumor.x + W + 26} ly={B.tumor.y + H / 2 - 10} />
            <Link x1={B.measurement.x + W / 2} y1={B.measurement.y + H} x2={B.editlog.x + W / 2} y2={B.editlog.y - 4} label="changes logged" lx={B.measurement.x + W / 2 + 10} ly={B.measurement.y + H + 48} />
            {Object.values(B).map((b) => <Node key={b.name} b={b} />)}

            <rect x={860} y={40} width={190} height={486} rx={12} fill="var(--color-surface)" stroke="var(--color-border)" />
            <text x={878} y={74} fontSize={14} fontWeight={600} fill="var(--color-text-dim)" letterSpacing="1">RUNNING THE LAB</text>
            {LAB.map((t, i) => (
              <g key={t}>
                <rect x={876} y={92 + i * 84} width={158} height={64} rx={8} fill="var(--color-surface-2)" />
                <text x={890} y={130 + i * 84} fontSize={17} fill="var(--color-text)">{t}</text>
              </g>
            ))}
          </svg>
          <div className="mt-2 flex flex-wrap gap-4 text-sm text-[var(--color-text-dim)]">
            <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-sm border border-[var(--color-brand)] bg-[var(--color-brand-tint)]" /> Created by the Admin at upload</span>
            <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-sm border border-[var(--color-warn)] bg-[var(--color-warn-tint)]" /> Written only by the server</span>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <Bullets
            items={[
              <><b>Patient → Study → Scan:</b> one Scan is one CT series. Its images sit in private file storage; the record keeps the geometry, status and file list.</>,
              <><b>Tumor</b> follows a patient across scans. A <b>Measurement</b> is one tumor on one scan: its outline and numbers.</>,
              <><b>Server only:</b> tumors, measurements and the audit log can't be written through the API. Every change goes through server checks and is logged.</>,
              <><b>Running the lab:</b> roles, invites, page permissions and the scheduled emails.</>,
            ]}
          />
        </Reveal>
      </div>
    </Section>
  );
}
