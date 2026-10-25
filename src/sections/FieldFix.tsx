import Section from '../components/Section';
import { Card, Reveal, Stat } from '../components/ui';

const STORY = [
  ['What I saw', 'After the first real upload, the Dashboard showed 0 / 12 pairs. In 16 patients both scans were labeled Baseline, and 6 more were swapped.'],
  ['Why', "RIDER often stores a patient's test and retest in one study, and the files carry no reliable time. A per-study label can't tell them apart."],
  ['The fix', "Labels per series; the upload asks when the files can't tell. The 59 live series were relabeled from RIDER's own TEST/RETEST segmentation references, after a dry run and the lab owner's approval."],
];

export default function FieldFix() {
  return (
    <Section id="field-fix" eyebrow="Found in the field" title="Real data broke an assumption, and the fix went live the same day">
      <Reveal className="grid gap-4 md:grid-cols-3">
        {STORY.map(([t, d]) => (
          <Card key={t}>
            <h3 className="mb-2 text-lg font-semibold">{t}</h3>
            <p className="text-[15px] text-[var(--color-text-dim)]">{d}</p>
          </Card>
        ))}
      </Reveal>
      <Reveal delay={0.1} className="mt-5 grid gap-4 md:grid-cols-3">
        <Stat label="Patients with both scans" value="12 → 28" />
        <Stat label="Series relabeled" value="29" unit="/ 59" />
        <Stat label="Mismatches after" value="0" />
      </Reveal>
    </Section>
  );
}
