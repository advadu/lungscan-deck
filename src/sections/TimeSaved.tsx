import Section from '../components/Section';
import { Card, Reveal } from '../components/ui';

const HOW = [
  ['Per scan', 'Seconds the scan is on screen, from opening to sign-off. Time in another tab doesn\'t count.'],
  ['Per tumor', 'Correction time from the outline appearing to its save, and the number of correction steps, by tumor type.'],
  ['Against a baseline', "Today the baseline is the lab's estimate, 32.5 min (middle of 25–40). Daniel's own manual timings will replace it."],
];

export default function TimeSaved() {
  return (
    <Section id="time-saved" eyebrow="Results" title="Measuring time saved">
      <Reveal className="grid gap-4 md:grid-cols-3">
        {HOW.map(([t, d]) => (
          <Card key={t}>
            <h3 className="mb-2 text-lg font-semibold">{t}</h3>
            <p className="text-[15px] text-[var(--color-text-dim)]">{d}</p>
          </Card>
        ))}
      </Reveal>
      <Reveal delay={0.1} className="mt-5">
        <p className="text-sm text-[var(--color-text-faint)]">
          Literature caution: tools that pre-fill measurements can slow readers when they have to fix them.
          That's why correction time is measured per tumor, not assumed.
        </p>
      </Reveal>
    </Section>
  );
}
