import Section from '../components/Section';
import { Reveal, Shot } from '../components/ui';

const STEPS = [
  'Upload a folder. Series are packed in the browser; likely tumors are found during upload.',
  'Open next scan. The queue orders scans so pairs complete first.',
  'Click a suggestion or a tumor. The tool outlines it in 3D.',
  'Correct with brush, Grow, Shrink, Clean up. The server re-measures.',
  'On a follow-up, the other scan follows the tumor and suggests the match.',
  "A quality check, then sign off and go to the next scan. Export the lab's 18 columns.",
];

export default function Workflow() {
  return (
    <Section id="workflow" eyebrow="The workflow" title="From upload to export">
      <Reveal className="grid grid-cols-2 gap-3 md:grid-cols-6">
        {STEPS.map((s, i) => (
          <div key={i} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3 text-sm">
            <div className="mb-1 font-mono text-xs font-semibold text-[var(--color-brand)]">0{i + 1}</div>
            {s}
          </div>
        ))}
      </Reveal>
      <Reveal delay={0.1} className="mx-auto mt-6 grid w-full max-w-4xl gap-5 md:grid-cols-2">
        <Shot src="dashboard.jpg" label="Dashboard" alt="Dashboard: library progress, Open next scan, the queue and sign-offs per day" />
        <Shot src="backlog.jpg" label="Backlog" alt="Backlog: every scan not signed off, in the order they come up" />
      </Reveal>
    </Section>
  );
}
