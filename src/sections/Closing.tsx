import { ExternalLink } from 'lucide-react';
import Section from '../components/Section';
import { Reveal } from '../components/ui';

const LINKS = [
  ['Live tool', 'lungscan-research.base44.app', 'https://lungscan-research.base44.app'],
  ['Source', 'github.com/advadu/lungscan-research', 'https://github.com/advadu/lungscan-research'],
  ['How to use it', 'Step-by-step guide', './guide.html'],
];

export default function Closing() {
  return (
    <Section id="closing" eyebrow="Thank you" bgClassName="grid-bg">
      <div className="absolute inset-0 dot-grid opacity-30" />
      <Reveal className="relative flex flex-1 flex-col justify-center">
        <h2 className="text-5xl font-bold tracking-tight md:text-7xl">Questions?</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {LINKS.map(([k, label, href]) => (
            <div key={k}>
              <div className="font-semibold">{k}</div>
              <a href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[var(--color-brand)] hover:underline">
                {label} <ExternalLink size={14} />
              </a>
            </div>
          ))}
          <div>
            <div className="font-semibold">Data</div>
            <div className="text-[var(--color-text-dim)]">RIDER Lung CT · RIDER-LungCT-Seg (TCIA)</div>
          </div>
        </div>
        <p className="mt-10 text-sm text-[var(--color-text-faint)]">For research use only. No clinical claims.</p>
      </Reveal>
    </Section>
  );
}
