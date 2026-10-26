import Section from '../components/Section';
import { Bullets, Chip, DataTable, Reveal } from '../components/ui';

const row = (name: string, err: string, tone: 'good' | 'warn', label: string) => [
  name,
  <span className="flex items-center gap-2 font-mono tabular-nums">{err} <Chip tone={tone}>{label}</Chip></span>,
];

export default function Failures() {
  return (
    <Section id="failures" eyebrow="Results" title="Where the tool falls short">
      <div className="grid items-start gap-8 md:grid-cols-2">
        <Reveal>
          <DataTable
            head={['Test case', 'Volume error, test / retest']}
            rows={[
              row('1 · Solid, isolated', '−5% / +11%', 'good', 'OK'),
              row('2 · Small', '+6% / +9%', 'good', 'OK'),
              row('3 · Ground-glass-like', '−1% / −63%', 'warn', 'Unstable'),
              row('4 · Touching the mediastinum', '+184% / +276%', 'warn', 'Fails'),
              row('5 · Spiculated', '+22% / −41%', 'warn', 'Unstable'),
            ]}
          />
        </Reveal>
        <Reveal delay={0.1}>
          <Bullets
            items={[
              <><b>Ground-glass:</b> barely denser than the lung around it, so there's no clear edge. The result depends on where the reviewer clicks.</>,
              <><b>Touching the wall or mediastinum:</b> the same density as the wall, so the outline leaks. The tool warns, and the reviewer trims it with 3D Erase.</>,
              <><b>Suggestions miss</b> some small and ground-glass tumors. The reviewer still reads the whole scan.</>,
              <><b>A reliable fix</b> needs a trained model and the lab's own outlined cases: a next phase, not this pilot.</>,
            ]}
          />
        </Reveal>
      </div>
    </Section>
  );
}
