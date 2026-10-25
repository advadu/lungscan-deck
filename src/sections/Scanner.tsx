import Section from '../components/Section';
import { Bullets, Reveal, Shot } from '../components/ui';

export default function Scanner() {
  return (
    <Section id="scanner" eyebrow="The scanner" title="Click, check, correct, sign off">
      <div className="grid items-start gap-8 md:grid-cols-2">
        <Reveal>
          <Shot src="scanner.jpg" label="Scanner" alt="Scanner: a tumor outlined in 3D with long and short axes and its measurements" />
        </Reveal>
        <Reveal delay={0.1}>
          <Bullets
            items={[
              <><b>Click-to-outline in 3D</b>, with leak control for vessels and the chest wall.</>,
              <><b>3 likely tumors of 4 mm or more</b>, ranked and found at upload.</>,
              <><b>Correction tools:</b> 2D and 3D brush, Grow, Shrink, Clean up, re-outline at another sensitivity.</>,
              <><b>Server-authoritative:</b> the browser proposes an outline; the server checks it and measures it on the scan's own geometry.</>,
              <><b>Every change is audited:</b> what the tool proposed and what the reviewer changed, with name and time.</>,
            ]}
          />
        </Reveal>
      </div>
    </Section>
  );
}
