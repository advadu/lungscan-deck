import Section from '../components/Section';
import { Bullets, Card, Reveal } from '../components/ui';

const DECISIONS = [
  ['Sign-in', 'Google'],
  ['Files', 'DICOM only, accepted by content'],
  ['Data retention', 'Kept for the pilot'],
  ['Suggestions', 'Kept; Daniel decides'],
  ['Assignment', 'Manual, simple worklist'],
  ['Notifications', 'Weekly email to Naomi; no alerts'],
  ['Outside AI assistants (MCP)', 'Not now'],
];

export default function Discovery() {
  return (
    <Section id="discovery" eyebrow="Discovery" title="I started with the lab's workflow, not with the code">
      <div className="grid gap-6 md:grid-cols-2">
        <Reveal>
          <blockquote className="mb-6 border-l-4 border-[var(--color-brand)] pl-5 text-lg md:text-xl">
            "Matching on follow-ups is the hardest part; I look for landmarks like vessels or fissures… it
            adds about 10 minutes per scan."
            <span className="mt-1 block text-sm text-[var(--color-text-dim)]">— Daniel</span>
          </blockquote>
          <Bullets
            items={[
              <><b>Their sheet, column by column:</b> 18 columns and a sample row. The export matches it exactly.</>,
              <><b>Their rules:</b> every nodule of 4 mm or more; mean diameter = (long + short) / 2; doubling time left blank when stable.</>,
              <><b>The hard cases:</b> a walkthrough of Daniel's teaching file.</>,
            ]}
          />
        </Reveal>
        <Reveal delay={0.1}>
          <Card>
            <h3 className="mb-3 text-lg font-semibold">Decisions the lab made</h3>
            <dl className="divide-y divide-[var(--color-border)] text-[15px]">
              {DECISIONS.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[140px_1fr] gap-3 py-2">
                  <dt className="text-[var(--color-text-dim)]">{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </Card>
        </Reveal>
      </div>
    </Section>
  );
}
