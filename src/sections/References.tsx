import { BookOpen, Code2, Database, ExternalLink, FlaskConical, KeyRound, MonitorPlay } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import Section from '../components/Section';
import { Card, Reveal } from '../components/ui';

const Link = ({ href, children }: { href: string; children: ReactNode }) => (
  <a href={href} target={href.startsWith('#') ? undefined : '_blank'} rel="noreferrer"
    className="inline-flex items-center gap-1 font-medium text-[var(--color-brand)] hover:underline">
    {children} {!href.startsWith('#') && <ExternalLink size={13} />}
  </a>
);

const REFS: { icon: LucideIcon; title: string; body: ReactNode }[] = [
  {
    icon: MonitorPlay,
    title: 'Running tool',
    body: <><Link href="https://lungscan-research.base44.app">lungscan-research.base44.app</Link><br />Invite-only, Google sign-in.</>,
  },
  {
    icon: KeyRound,
    title: 'Access',
    body: <>Email <Link href="mailto:advadu@wix.com">advadu@wix.com</Link> the Google account to invite. You get the Admin role, so every page is open to you.</>,
  },
  {
    icon: BookOpen,
    title: 'How to use it',
    body: <><Link href="./guide.html">Step-by-step guide</Link>: every page, with screenshots and things to try.</>,
  },
  {
    icon: Code2,
    title: 'Source code',
    body: <><Link href="https://github.com/advadu/lungscan-research">github.com/advadu/lungscan-research</Link><br />Private: repository invite on request. Run instructions in its README.</>,
  },
  {
    icon: FlaskConical,
    title: 'Results',
    body: <><Link href="./results.html">Full results</Link>: what works, what fails and how time saved is measured, with the test method. Summary in this deck: <Link href="#quality">quality</Link>, <Link href="#failures">failures</Link>, <Link href="#time-saved">time saved</Link>.</>,
  },
  {
    icon: Database,
    title: 'Data',
    body: <><Link href="https://www.cancerimagingarchive.net/collection/rider-lung-ct/">RIDER Lung CT</Link> and <Link href="https://www.cancerimagingarchive.net/analysis-result/rider-lungct-seg/">RIDER-LungCT-Seg</Link> (TCIA, public).</>,
  },
];

export default function References() {
  return (
    <Section id="references" eyebrow="Deliverables" title="Links and access">
      <Reveal className="grid gap-4 md:grid-cols-3">
        {REFS.map(({ icon: Icon, title, body }) => (
          <Card key={title}>
            <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold">
              <Icon size={18} className="text-[var(--color-brand)]" /> {title}
            </h3>
            <p className="text-[15px] leading-relaxed text-[var(--color-text-dim)]">{body}</p>
          </Card>
        ))}
      </Reveal>
      <p className="mt-5 text-sm text-[var(--color-text-faint)]">This presentation: advadu.github.io/lungscan-deck</p>
    </Section>
  );
}
