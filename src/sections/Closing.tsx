import Section from '../components/Section';
import { Reveal } from '../components/ui';

export default function Closing() {
  return (
    <Section id="closing" eyebrow="Thank you" bgClassName="grid-bg">
      <div className="absolute inset-0 dot-grid opacity-30" />
      <Reveal className="relative flex flex-1 flex-col justify-center">
        <h2 className="text-5xl font-bold tracking-tight md:text-7xl">Questions?</h2>
        <p className="mt-10 text-sm text-[var(--color-text-faint)]">For research use only. No clinical claims.</p>
      </Reveal>
    </Section>
  );
}
