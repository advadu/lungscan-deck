import Section from '../components/Section';
import { Bullets, Card, Reveal, Stat } from '../components/ui';

export default function Problem() {
  return (
    <Section id="problem" title="The problem">
      <Reveal className="grid gap-4 md:grid-cols-4">
        <Stat label="Manual time per scan" value="25–40" unit="min" note="Image by image, by hand" />
        <Stat label="Scans per week" value="12–15" note="1–2 tumors per scan" />
        <Stat label="Backlog" value="~540" note="+30 follow-ups a month" />
        <Stat label="Finding the tumor again" value="~10" unit="min" note="Per follow-up scan" />
      </Reveal>
      <Reveal delay={0.1} className="mt-5 grid gap-4 md:grid-cols-2">
        <Card>
          <h3 className="mb-2 text-lg font-semibold">Goal</h3>
          <p className="text-[var(--color-text-dim)]">
            Halve the manual time per scan, from 25–40 to about 12–20 minutes, without making the
            measurements worse.
          </p>
        </Card>
        <Card>
          <h3 className="mb-2 text-lg font-semibold">What makes it hard</h3>
          <Bullets
            items={[
              'Only 1 in 5 tumors gets a full volume outline today: it takes too long.',
              'Breathing shifts the slices, so matching a tumor across scans is slow.',
              'Ground-glass, spiculated and wall-touching tumors need judgment.',
            ]}
          />
        </Card>
      </Reveal>
    </Section>
  );
}
