import Section from '../components/Section';
import { Bullets, Reveal, Shot } from '../components/ui';

export default function Output() {
  return (
    <Section id="output" eyebrow="Output" title="Results in the lab's own format">
      <div className="grid items-start gap-8 md:grid-cols-2">
        <Reveal>
          <Shot src="measurements.jpg" label="Measurements" alt="Measurements: one row per tumor per scan with change between scans and CSV export" />
        </Reveal>
        <Reveal delay={0.1}>
          <Bullets
            items={[
              <><b>One row per tumor per scan</b>, with change from baseline to follow-up and volume doubling time.</>,
              <><b>CSV export</b> starts with Daniel's 18 columns, in his order and names, so rows paste into his sheet.</>,
              <><b>Export all rows or only signed-off ones</b>: the reviewer chooses.</>,
              <><b>History per tumor:</b> the tool's proposal and every change, read-only.</>,
            ]}
          />
          <Shot src="dataset.jpg" label="Data Set" alt="Data Set: patient folders with Baseline and Follow-up per series" className="mt-5 max-w-md" />
        </Reveal>
      </div>
    </Section>
  );
}
