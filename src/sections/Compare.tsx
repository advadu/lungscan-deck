import Section from '../components/Section';
import { Reveal, Shot, Stat } from '../components/ui';

export default function Compare() {
  return (
    <Section id="compare" eyebrow="Follow-up scans" title="Finding the same tumor on both scans">
      <div className="grid items-start gap-8 md:grid-cols-2">
        <Reveal>
          <Shot src="compare.jpg" label="Compare with the follow-up" alt="Baseline and follow-up side by side, the follow-up marking the matching position" />
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-[var(--color-text-dim)] md:text-lg">
            The two scans are aligned by the lungs' shape along the body, so a point on one can be found on
            the other. The other scan jumps to the matching spot and the likely match is preselected when
            saving.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Stat label="Distance from the expert's tumor" value="6.8" unit="mm" note="Median, 28 RIDER pairs (18.8 mm unaligned)" />
            <Stat label="Pairs within 20 mm" value="28" unit="/ 28" note="Alignment in under 0.4 s" />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
