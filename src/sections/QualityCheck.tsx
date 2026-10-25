import Section from '../components/Section';
import { Bullets, Chip, Reveal, Shot } from '../components/ui';

export default function QualityCheck() {
  return (
    <Section id="quality-check" eyebrow="Protecting quality" title="A quality check before every sign-off">
      <div className="grid items-start gap-8 md:grid-cols-2">
        <Reveal>
          <Shot src="quality-flags.jpg" label="Scanner" alt="A warning icon next to a tumor, listing what is missing" />
        </Reveal>
        <Reveal delay={0.1}>
          <Bullets
            items={[
              <><Chip tone="warn">Fix</Chip> lobe or type missing, solid component missing, match to prior missing.</>,
              <><Chip tone="info">Check</Chip> uncertain match, volume change of 25% or more, under the 4 mm minimum, 30% or more off the tool's volume.</>,
              <><b>On the tumor card:</b> a warning icon as soon as a flag applies.</>,
              <><b>At sign-off:</b> a "Before you sign off" window lists the flags, each with a one-line explanation written by AI from the numbers. <b>Back to fix it</b> or <b>Sign off anyway</b>: the reviewer decides.</>,
              <><b>Rules, not AI, raise the flags.</b> If the AI is unavailable, fixed sentences explain them, so sign-off never depends on it.</>,
            ]}
          />
        </Reveal>
      </div>
    </Section>
  );
}
