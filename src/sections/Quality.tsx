import Section from '../components/Section';
import { DataTable, Reveal } from '../components/ui';

const n = (s: string) => <span className="font-mono tabular-nums">{s}</span>;

export default function Quality() {
  return (
    <Section id="quality" eyebrow="Results · quality" title="As accurate as the expert's own repeat, and more consistent">
      <Reveal>
        <DataTable
          head={['Measure (public RIDER scans)', 'Tool', 'Reference']}
          rows={[
            ['Median volume error vs expert outline', <>{n('11.5%')} <span className="text-[var(--color-text-faint)]">(55 scans)</span></>, "Expert's own same-day repeat: ~17%"],
            ["Scans within 17% of the expert's volume", n('35 / 55'), ''],
            ['Median long-axis error', n('3.7 mm'), "Expert's repeat: ~2.3 mm"],
            ['Overlap with the expert outline (Dice)', n('0.80'), "Dataset's own auto outline: 0.92"],
            ["Expert's tumor among the 3 suggestions", n('≥ 40 / 59'), ''],
            [<b>Same tumor on two same-day scans, change in volume</b>, <b>{n('8.8%')}</b>, <><b>Expert: 15.8%</b> (26 pairs)</>],
          ]}
        />
        <p className="mt-4 text-sm text-[var(--color-text-faint)]">
          Validation runs the app's own outlining and measurement code against the expert outlines
          (RIDER-LungCT-Seg). The settings were tuned on these same scans, so expect somewhat weaker numbers
          on new data.
        </p>
      </Reveal>
    </Section>
  );
}
