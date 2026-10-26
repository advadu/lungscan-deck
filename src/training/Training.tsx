import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { ArrowRight, BookOpen, Check, CheckCircle2, ChevronDown, ClipboardCheck, ClipboardCopy, ExternalLink, Printer, RotateCcw } from 'lucide-react';
import { Shot } from '../components/ui';
import { LESSONS } from './lessons';
import { ALL, GROUPS } from './tests';
import type { Role } from './tests';

// The lab's training and acceptance tests, as a guided runner in the app's own colors:
// one screen or one test at a time, with a rail for where you are.
const THEME = {
  '--r-side': '#14181D',
  '--r-side-2': '#1E242B',
  '--r-side-text': '#C9CFD6',
  '--r-bg': '#EEF0F3',
  '--r-card': '#FFFFFF',
  '--r-ink': '#14181D',
  '--r-dim': '#525B66',
  '--r-faint': '#8A929C',
  '--r-line': '#D5D9DF',
  '--r-accent': '#4338CA',
  '--r-accent-tint': '#E0E7FF',
  '--r-coral': '#E0622E',
  '--r-pass': '#1A6B3D',
  '--r-pass-tint': '#DCF0E3',
  '--r-fail': '#9F3A16',
  '--r-fail-tint': '#FDECE4',
  '--r-block': '#6B5A12',
  '--r-block-tint': '#F7EFD0',
} as CSSProperties;

const APP = 'https://lungscan-research.base44.app';
type Status = 'pass' | 'fail' | 'blocked';
type Saved = { results: Record<string, Status>; notes: Record<string, string>; tab: 'learn' | 'test'; lesson: number; test: number };
const KEY = 'lungscan.training.v2';
const read = (): Partial<Saved> => { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; } };

const STATUS: Record<Status, { label: string; chip: string; dot: string }> = {
  pass: { label: 'Pass', chip: 'bg-[var(--r-pass-tint)] text-[var(--r-pass)] border-[var(--r-pass)]', dot: 'bg-[var(--r-pass)]' },
  fail: { label: 'Fail', chip: 'bg-[var(--r-fail-tint)] text-[var(--r-fail)] border-[var(--r-fail)]', dot: 'bg-[var(--r-fail)]' },
  blocked: { label: 'Blocked', chip: 'bg-[var(--r-block-tint)] text-[var(--r-block)] border-[var(--r-block)]', dot: 'bg-[var(--r-block)]' },
};

const ROLE: Record<Role, string> = {
  Reviewer: 'bg-[var(--r-accent-tint)] text-[var(--r-accent)]',
  Director: 'bg-[#FDECE4] text-[#9F3A16]',
  Admin: 'bg-[#E6E9ED] text-[#3A424C]',
  Everyone: 'bg-[#E6E9ED] text-[#3A424C]',
};

const RoleChip = ({ role }: { role: Role }) => (
  <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${ROLE[role]}`}>{role}</span>
);

const Label = ({ children }: { children: ReactNode }) => (
  <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--r-faint)]">{children}</div>
);

// Screenshots shrink with the window, so a lesson's text and images fit one screen.
const shotWidth = (n: number) => (n > 1 ? {} : { maxWidth: 'min(100%, calc((100vh - 280px) * 1.69))' });

const Numbered = ({ items }: { items: ReactNode[] }) => (
  <ol className="space-y-1.5 text-[14px] leading-relaxed text-[var(--r-dim)] [&_b]:text-[var(--r-ink)]">
    {items.map((h, i) => (
      <li key={i} className="flex gap-2.5">
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--r-accent-tint)] text-[11px] font-semibold text-[var(--r-accent)]">{i + 1}</span>
        <span>{h}</span>
      </li>
    ))}
  </ol>
);

// One full-screen page in the scroll; snaps into place on wide screens.
function Page({ id, children }: { id: string; children: ReactNode }) {
  return (
    <section id={id} data-page className="flex min-h-full snap-start items-center px-5 py-8 lg:h-full lg:px-10 lg:py-3">
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}

export default function Training() {
  // Start where this browser left off (the page has no server render, so storage is readable here).
  const [saved] = useState(read);
  const [tab, setTab] = useState<'learn' | 'test'>(saved.tab || 'learn');
  const [lesson, setLesson] = useState(typeof saved.lesson === 'number' && saved.lesson < LESSONS.length ? saved.lesson : 0);
  const [test, setTest] = useState(typeof saved.test === 'number' && saved.test < ALL.length ? saved.test : 0);
  const [results, setResults] = useState<Record<string, Status>>(saved.results || {});
  const [notes, setNotes] = useState<Record<string, string>>(saved.notes || {});
  const [copied, setCopied] = useState(false);
  const loaded = true;
  const mainRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!loaded) return;
    try { localStorage.setItem(KEY, JSON.stringify({ results, notes, tab, lesson, test })); } catch { /* storage blocked: kept for this visit */ }
  }, [results, notes, tab, lesson, test, loaded]);

  const pageId = (t: 'learn' | 'test', i: number) => (t === 'learn' ? `lesson-${LESSONS[i].id}` : `test-${ALL[i].id}`);
  // The page being moved to; repeated keys count from it, not from a mid-scroll position.
  const target = useRef({ i: 0, at: 0 });
  const go = (i: number, smooth = true) => {
    target.current = { i, at: Date.now() };
    document.getElementById(pageId(tab, i))?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
  };

  // On load and on a tab switch, open at the page last seen in that tab.
  useEffect(() => {
    if (!loaded) return;
    if (tab === 'learn') requestAnimationFrame(() => go(lesson, false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, loaded]);

  // The page in view drives the rail and the saved position.
  useEffect(() => {
    const root = mainRef.current;
    if (!root || !loaded) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const id = e.target.id;
        const i = id.startsWith('lesson-') ? LESSONS.findIndex((l) => `lesson-${l.id}` === id) : ALL.findIndex((c) => `test-${c.id}` === id);
        if (id.startsWith('lesson-')) setLesson(i); else setTest(i);
        if (Date.now() - target.current.at > 800) target.current = { i, at: 0 };
      });
    }, { root, threshold: 0.55 });
    root.querySelectorAll('[data-page]').forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [tab, loaded]);

  // Arrow keys move a page at a time, like the presentation.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (tab !== 'learn' || (e.target as HTMLElement).closest('textarea, input, select')) return;
      const i = target.current.i;
      const n = tab === 'learn' ? LESSONS.length : ALL.length;
      if (['ArrowDown', 'ArrowRight', 'PageDown'].includes(e.key) && i < n - 1) { e.preventDefault(); go(i + 1); }
      if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(e.key) && i > 0) { e.preventDefault(); go(i - 1); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const counts = useMemo(() => {
    const c = { pass: 0, fail: 0, blocked: 0 };
    Object.values(results).forEach((s) => { c[s] += 1; });
    return c;
  }, [results]);
  const done = counts.pass + counts.fail + counts.blocked;

  // Clicking the chosen result again clears it.
  const mark = (id: string, s: Status) => setResults((r) => {
    const next = { ...r };
    if (next[id] === s) delete next[id]; else next[id] = s;
    return next;
  });
  const copy = async () => {
    const lines = [`LungScan Research test results: ${counts.pass} pass, ${counts.fail} fail, ${counts.blocked} blocked, ${ALL.length - done} not run`];
    ALL.forEach((c) => {
      lines.push(`${c.id} ${c.title}: ${results[c.id] ? STATUS[results[c.id]].label : 'Not run'}${notes[c.id] ? ` · ${notes[c.id]}` : ''}`);
    });
    try { await navigator.clipboard.writeText(lines.join('\n')); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* clipboard blocked */ }
  };
  const reset = () => { setResults({}); setNotes({}); mainRef.current?.scrollTo({ top: 0 }); };

  const rail = tab === 'learn' ? (
    <div className="space-y-5">
      {[...new Set(LESSONS.map((l) => l.group))].map((g) => (
        <div key={g}>
          <div className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-[#8A929C]">{g}</div>
          {LESSONS.map((l, i) => l.group === g && (
            <button key={l.id} type="button" onClick={() => go(i)}
              className={`flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-left text-sm ${i === lesson ? 'bg-[var(--r-accent)] font-semibold text-white' : 'hover:bg-[var(--r-side-2)]'}`}>
              <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] ${i < lesson ? 'bg-[#2A3A33] text-[#7DD3A0]' : i === lesson ? 'bg-white/20' : 'bg-[var(--r-side-2)]'}`}>
                {i < lesson ? <Check size={11} /> : i + 1}
              </span>
              {l.title}
            </button>
          ))}
        </div>
      ))}
    </div>
  ) : (
    <div className="space-y-5">
      <div className="px-3">
        <div className="flex h-1.5 overflow-hidden rounded-full bg-[var(--r-side-2)]">
          <div className="bg-[#3FA06B]" style={{ width: `${(counts.pass / ALL.length) * 100}%` }} />
          <div className="bg-[var(--r-coral)]" style={{ width: `${(counts.fail / ALL.length) * 100}%` }} />
          <div className="bg-[#C9A227]" style={{ width: `${(counts.blocked / ALL.length) * 100}%` }} />
        </div>
        <div className="mt-2 text-xs">{done} of {ALL.length} run · {counts.pass} pass · {counts.fail} fail · {counts.blocked} blocked</div>
      </div>
      {GROUPS.map((g) => (
        <div key={g.title}>
          <div className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-[#8A929C]">{g.title}</div>
          {g.cases.map((c) => {
            const i = ALL.indexOf(c);
            const s = results[c.id];
            return (
              <button key={c.id} type="button" onClick={() => { setTest(i); go(i); }}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-left text-sm ${i === test ? 'bg-[var(--r-accent)] font-semibold text-white' : 'hover:bg-[var(--r-side-2)]'}`}>
                <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${s ? STATUS[s].dot : 'border border-[#5A626C]'}`} />
                <span className="font-mono text-xs opacity-70">{c.id}</span>
                <span className="truncate">{c.title}</span>
              </button>
            );
          })}
        </div>
      ))}
      <div className="flex flex-wrap gap-2 px-3 pb-2">
        <button type="button" onClick={copy} className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-[var(--r-ink)]">
          {copied ? <CheckCircle2 size={14} /> : <ClipboardCopy size={14} />}{copied ? 'Copied' : 'Copy results'}
        </button>
        <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-1.5 rounded-lg border border-[#3A424C] px-3 py-1.5 text-xs font-semibold"><Printer size={14} />Print</button>
        <button type="button" onClick={reset} className="inline-flex items-center gap-1.5 rounded-lg border border-[#3A424C] px-3 py-1.5 text-xs font-semibold"><RotateCcw size={14} />Reset</button>
      </div>
    </div>
  );

  const lessons = LESSONS.map((L, i) => {
    const n = L.shots?.length || 0;
    return (
      <Page key={L.id} id={`lesson-${L.id}`}>
        <div className={`grid items-center gap-8 ${n ? 'lg:grid-cols-2' : 'max-w-3xl'}`}>
          <div className="min-w-0">
            <div className="text-xs font-semibold uppercase tracking-wider text-[var(--r-coral)]">{L.group} · {i + 1} of {LESSONS.length}</div>
            <h2 className="mt-1.5 text-2xl font-bold tracking-tight lg:text-3xl">{L.title}</h2>
            <div className="mt-2 flex flex-wrap gap-1.5">{L.roles.map((r) => <RoleChip key={r} role={r} />)}</div>
            <p className="mt-3 text-[16px] text-[var(--r-dim)] [&_b]:text-[var(--r-ink)]">{L.what}</p>
            {n > 0 && (
              <div className={`mt-5 grid gap-3 ${n > 1 ? 'sm:grid-cols-2' : ''}`}>
                {L.shots!.map((s) => <div key={s.src} style={shotWidth(n)}><Shot src={s.src} label={s.label} alt={s.alt} /></div>)}
              </div>
            )}
          </div>
          <div className="min-w-0 space-y-3">
            {L.how && (
              <div className="rounded-xl border border-[var(--r-line)] bg-[var(--r-card)] p-4">
                <Label>How to use it</Label>
                <Numbered items={L.how} />
              </div>
            )}
            {L.tips && (
              <div className="rounded-xl border-l-4 border-[var(--r-coral)] bg-[#FDF5F1] p-4">
                <Label>Good to know</Label>
                <ul className="space-y-2 text-[14px] leading-relaxed text-[var(--r-dim)] [&_b]:text-[var(--r-ink)]">
                  {L.tips.map((t, k) => <li key={k}>{t}</li>)}
                </ul>
              </div>
            )}
            {i === LESSONS.length - 1 && (
              <button type="button" onClick={() => setTab('test')} className="w-full rounded-xl bg-[var(--r-side)] px-5 py-4 text-left text-white">
                <div className="text-xs font-semibold uppercase tracking-wider text-[var(--r-side-text)]">Done with the screens</div>
                <div className="mt-1 flex items-center gap-2 text-lg font-semibold">Run the {ALL.length} acceptance tests <ArrowRight size={18} /></div>
              </button>
            )}
          </div>
        </div>
        {i === 0 && <div className="mt-6 hidden items-center gap-1.5 text-sm text-[var(--r-faint)] lg:flex"><ChevronDown size={16} /> Scroll for the next screen</div>}
      </Page>
    );
  });

  const resultButtons = (id: string) => (
    <div className="flex flex-wrap gap-1" role="group" aria-label={`Result for ${id}`}>
      {(Object.keys(STATUS) as Status[]).map((k) => (
        <button key={k} type="button" aria-pressed={results[id] === k} onClick={() => mark(id, k)}
          className={`rounded-md border px-2 py-1 text-xs font-semibold ${results[id] === k ? STATUS[k].chip : 'border-[var(--r-line)] bg-[var(--r-card)] text-[var(--r-faint)] hover:text-[var(--r-ink)]'}`}>
          {STATUS[k].label}
        </button>
      ))}
    </div>
  );

  // All tests in one table: steps, expected result, result and notes per row, grouped by task.
  const COLS = 'lg:grid-cols-[64px_minmax(0,1fr)_minmax(0,1.5fr)_minmax(0,1.3fr)_188px]';
  const tests = (
    <div className="mx-auto max-w-[1400px] px-4 py-6 lg:px-8">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-[var(--r-coral)]">Acceptance tests</div>
          <h2 className="mt-1 text-2xl font-bold tracking-tight lg:text-3xl">{ALL.length} tests, grouped by task</h2>
          <p className="mt-1 text-sm text-[var(--r-dim)]">Run the tests for your role, mark each one, add a note when something is off, and send the results with Copy results. Marks are kept in this browser only.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-[var(--r-dim)]"><b className="text-[var(--r-ink)]">{done} of {ALL.length}</b> run · <span className="text-[var(--r-pass)]">{counts.pass} pass</span> · <span className="text-[var(--r-fail)]">{counts.fail} fail</span> · <span className="text-[var(--r-block)]">{counts.blocked} blocked</span></span>
          <button type="button" onClick={copy} className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--r-accent)] px-3 py-2 text-sm font-semibold text-white hover:opacity-90">
            {copied ? <CheckCircle2 size={15} /> : <ClipboardCopy size={15} />}{copied ? 'Copied' : 'Copy results'}
          </button>
        </div>
      </div>

      <div className="overflow-clip rounded-xl border border-[var(--r-line)] bg-[var(--r-card)]">
        <div className={`sticky top-0 z-10 hidden gap-4 border-b border-[var(--r-line)] bg-[#F6F7F9] px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[var(--r-faint)] lg:grid ${COLS}`}>
          <div>ID</div><div>Test</div><div>Steps</div><div>Expected result</div><div>Result and notes</div>
        </div>
        {GROUPS.map((g) => (
          <div key={g.title}>
            <div className="border-b border-[var(--r-line)] bg-[var(--r-bg)] px-4 py-2 text-sm font-semibold">
              {g.title} <span className="font-normal text-[var(--r-faint)]">· {g.cases.filter((c) => results[c.id]).length} of {g.cases.length} run</span>
            </div>
            {g.cases.map((T) => {
              const i = ALL.indexOf(T);
              return (
                <div key={T.id} id={`test-${T.id}`}
                  className={`grid scroll-mt-12 gap-3 border-b border-[var(--r-line)] px-4 py-3.5 text-[14px] leading-relaxed last:border-0 lg:gap-4 ${COLS} ${i === test ? 'bg-[#F7F8FF]' : ''}`}>
                  <div className="font-mono text-sm font-semibold text-[var(--r-faint)]">{T.id}</div>
                  <div>
                    <div className="font-semibold">{T.title}</div>
                    <div className="mt-1"><RoleChip role={T.role} /></div>
                  </div>
                  <div className="text-[var(--r-dim)]"><Numbered items={T.steps} /></div>
                  <div className="text-[var(--r-dim)]">
                    <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[var(--r-faint)] lg:hidden">Expected</span>
                    {T.expect}
                  </div>
                  <div className="space-y-2">
                    {resultButtons(T.id)}
                    <textarea value={notes[T.id] || ''} onChange={(e) => setNotes((m) => ({ ...m, [T.id]: e.target.value }))} rows={2}
                      placeholder="Notes" aria-label={`Notes for ${T.id}`}
                      className="w-full rounded-md border border-[var(--r-line)] bg-[var(--r-bg)] px-2 py-1.5 text-[13px] outline-none focus:border-[var(--r-accent)]" />
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
    <div style={THEME} className="flex h-screen flex-col bg-[var(--r-bg)] text-[var(--r-ink)] print:hidden">
      <header className="flex shrink-0 flex-wrap items-center gap-3 bg-[var(--r-side)] px-4 py-3 text-white">
        <div className="mr-auto">
          <div className="text-sm font-semibold">LungScan Research · Training</div>
          <div className="text-xs text-[var(--r-side-text)]">Thoracic Oncology Research Lab · For research use only</div>
        </div>
        <div className="flex rounded-lg bg-[var(--r-side-2)] p-1" role="tablist">
          {([['learn', 'Learn the screens', BookOpen], ['test', 'Run the tests', ClipboardCheck]] as const).map(([k, label, Icon]) => (
            <button key={k} type="button" role="tab" aria-selected={tab === k} onClick={() => setTab(k)}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-semibold ${tab === k ? 'bg-[var(--r-accent)] text-white' : 'text-[var(--r-side-text)] hover:text-white'}`}>
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>
        <a href={APP} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-[var(--r-ink)] hover:opacity-90">
          Open the app <ExternalLink size={14} />
        </a>
      </header>

      <div className="shrink-0 border-b border-[var(--r-line)] bg-[var(--r-card)] px-4 py-2 lg:hidden">
        <select aria-label={tab === 'learn' ? 'Screen' : 'Test'} value={tab === 'learn' ? lesson : test} onChange={(e) => go(Number(e.target.value))}
          className="w-full rounded-lg border border-[var(--r-line)] bg-[var(--r-bg)] px-3 py-2 text-sm">
          {tab === 'learn'
            ? LESSONS.map((l, i) => <option key={l.id} value={i}>{i + 1}. {l.title}</option>)
            : ALL.map((c, i) => <option key={c.id} value={i}>{c.id} {c.title}{results[c.id] ? ` · ${STATUS[results[c.id]].label}` : ''}</option>)}
        </select>
      </div>

      <div className="flex min-h-0 flex-1">
        <aside className="hidden w-72 shrink-0 overflow-y-auto bg-[var(--r-side)] py-4 pr-2 pl-2 text-[var(--r-side-text)] lg:block">{rail}</aside>
        <main ref={mainRef} key={tab} className={`min-w-0 flex-1 overflow-y-auto ${tab === 'learn' ? 'lg:snap-y lg:snap-mandatory' : ''}`}>
          {tab === 'learn' ? lessons : tests}
        </main>
      </div>
    </div>
    <PrintSheet results={results} notes={notes} />
    </>
  );
}

// Printed checklist: every test with its result and notes, one after another.
function PrintSheet({ results, notes }: { results: Record<string, Status>; notes: Record<string, string> }) {
  return (
    <div className="hidden print:block">
      <h1 className="text-2xl font-bold">LungScan Research · Acceptance tests</h1>
      <p className="mb-4 text-sm">Tester: ____________________ &nbsp;&nbsp; Date: ____________</p>
      {GROUPS.map((g) => (
        <div key={g.title} className="mb-4">
          <h2 className="mb-2 text-lg font-semibold">{g.title}</h2>
          {g.cases.map((c) => (
            <div key={c.id} className="mb-3 break-inside-avoid border-b border-gray-300 pb-2 text-sm">
              <div className="font-semibold">{c.id} · {c.title} ({c.role}) · {results[c.id] ? STATUS[results[c.id]].label : '☐ Pass ☐ Fail ☐ Blocked'}</div>
              <ol className="ml-5 list-decimal">{c.steps.map((s, i) => <li key={i}>{s}</li>)}</ol>
              <div><b>Expected:</b> {c.expect}</div>
              {notes[c.id] && <div><b>Notes:</b> {notes[c.id]}</div>}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
