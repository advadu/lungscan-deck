import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { ArrowLeft, ExternalLink } from 'lucide-react';

// Shared layout for the site's document pages (user guide, results).
export const A = ({ href, children }: { href: string; children: ReactNode }) => (
  <a href={href} target="_blank" rel="noreferrer" className="font-medium text-[var(--color-brand)] hover:underline">
    {children}
  </a>
);

export function Block({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-[var(--color-border)] pt-10 first:border-0 first:pt-0">
      <h2 className="mb-4 text-2xl font-bold tracking-tight">{title}</h2>
      <div className="space-y-4 text-[16px] leading-relaxed text-[var(--color-text-dim)] [&_b]:text-[var(--color-text)]">{children}</div>
    </section>
  );
}

export function List({ items, ordered }: { items: ReactNode[]; ordered?: boolean }) {
  const Tag = ordered ? 'ol' : 'ul';
  return (
    <Tag className={`space-y-2 pl-5 ${ordered ? 'list-decimal' : 'list-disc'} marker:text-[var(--color-brand)]`}>
      {items.map((it, i) => <li key={i} className="pl-1">{it}</li>)}
    </Tag>
  );
}

export function Table({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
      <table className="w-full border-collapse text-left text-[15px]">
        <thead>
          <tr className="bg-[var(--color-surface-2)]">
            {head.map((h) => <th key={h} className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-dim)]">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-[var(--color-border)]">
              {r.map((c, j) => <td key={j} className="px-4 py-2.5 align-top text-[var(--color-text)]">{c}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const code = (s: string) => <code className="rounded bg-[var(--color-surface-2)] px-1.5 py-0.5 font-mono text-[13px]">{s}</code>;


export function DocPage({ eyebrow, title, lead, intro, toc, children }: {
  eyebrow: string;
  title: string;
  lead: ReactNode;
  intro?: ReactNode;
  toc: { id: string; label: string }[];
  children: ReactNode;
}) {
  const [active, setActive] = useState(toc[0]?.id);
  useEffect(() => {
    const root = document.getElementById('doc-scroll');
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { root, rootMargin: '-20% 0px -70% 0px' },
    );
    toc.forEach(({ id }) => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [toc]);

  return (
    <div id="doc-scroll" className="h-screen overflow-y-auto scroll-smooth">
      <header className="sticky top-0 z-20 border-b border-[var(--color-border)] bg-[var(--color-bg)]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
          <a href="./" className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-text-dim)] hover:text-[var(--color-brand)]">
            <ArrowLeft size={16} /> Presentation
          </a>
          <span className="hidden text-sm font-semibold sm:block">LungScan Research · {title}</span>
          <a href="https://lungscan-research.base44.app" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-brand)] px-3 py-1.5 text-sm font-semibold text-white hover:opacity-90">
            Open the app <ExternalLink size={14} />
          </a>
        </div>
      </header>

      <div>
        <div className="mx-auto max-w-6xl px-5 pb-10 pt-14">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-brand)]">{eyebrow}</div>
          <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">{title}</h1>
          <p className="mt-4 max-w-3xl text-lg text-[var(--color-text-dim)]">{lead}</p>
          {intro}
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)] gap-10 px-5 py-12 lg:grid-cols-[200px_minmax(0,1fr)]">
        <nav aria-label="Contents" className="hidden lg:block">
          <ul className="sticky top-24 space-y-1 text-sm">
            {toc.map(({ id, label }) => (
              <li key={id}>
                <a href={`#${id}`} className={`block rounded-md px-3 py-1.5 ${active === id ? 'bg-[var(--color-brand-tint)] font-semibold text-[var(--color-brand)]' : 'text-[var(--color-text-dim)] hover:text-[var(--color-text)]'}`}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <main className="min-w-0 space-y-12">{children}</main>
      </div>

      <footer className="border-t border-[var(--color-border)] py-8 text-center text-sm text-[var(--color-text-faint)]">
        LungScan Research · For research use only. No clinical claims. · <a href="./" className="hover:underline">Back to the presentation</a>
      </footer>
    </div>
  );
}
