import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Check, CheckCircle2, ClipboardCheck, ClipboardCopy, ExternalLink, Printer, RotateCcw } from 'lucide-react';
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

function NavButtons({ i, n, onGo, nextLabel }: { i: number; n: number; onGo: (i: number) => void; nextLabel: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <button type="button" disabled={i === 0} onClick={() => onGo(i - 1)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--r-line)] bg-[var(--r-card)] px-3 py-2 text-sm font-semibold text-[var(--r-dim)] hover:text-[var(--r-ink)] disabled:opacity-40">
        <ArrowLeft size={15} /> Back
      </button>
      <span className="text-sm text-[var(--r-faint)]">{i + 1} of {n}</span>
      <button type="button" disabled={i === n - 1} onClick={() => onGo(i + 1)}
        className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--r-accent)] px-3 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-40">
        {nextLabel} <ArrowRight size={15} />
      </button>
    </div>
  );
}

export default function Training() {
  const [tab, setTab] = useState<'learn' | 'test'>('learn');
  const [lesson, setLesson] = useState(0);
  const [test, setTest] = useState(0);
  const [results, setResults] = useState<Record<string, Status>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const s = read();
    if (s.tab) setTab(s.tab);
    if (typeof s.lesson === 'number' && s.lesson < LESSONS.length) setLesson(s.lesson);
    if (typeof s.test === 'number' && s.test < ALL.length) setTest(s.test);
    setResults(s.results || {});
    setNotes(s.notes || {});
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (!loaded) return;
    try { localStorage.setItem(KEY, JSON.stringify({ results, notes, tab, lesson, test })); } catch { /* storage blocked: kept for this visit */ }
  }, [results, notes, tab, lesson, test, loaded]);
  useEffect(() => { document.getElementById('runner-main')?.scrollTo({ top: 0 }); }, [tab, lesson, test]);

  const counts = useMemo(() => {
    const c = { pass: 0, fail: 0, blocked: 0 };
    Object.values(results).forEach((s) => { c[s] += 1; });
    return c;
  }, [results]);
  const done = counts.pass + counts.fail + counts.blocked;

  const mark = (id: string, s: Status, advance: boolean) => {
    setResults((r) => ({ ...r, [id]: s }));
    if (advance && test < ALL.length - 1) setTest(test + 1);
  };
  const copy = async () => {
    const lines = [`LungScan Research test results: ${counts.pass} pass, ${counts.fail} fail, ${counts.blocked} blocked, ${ALL.length - done} not run`];
    ALL.forEach((c) => {
      lines.push(`${c.id} ${c.title}: ${results[c.id] ? STATUS[results[c.id]].label : 'Not run'}${notes[c.id] ? ` · ${notes[c.id]}` : ''}`);
    });
    try { await navigator.clipboard.writeText(lines.join('\n')); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* clipboard blocked */ }
  };
  const reset = () => { setResults({}); setNotes({}); setTest(0); };

  const L = LESSONS[lesson];
  const T = ALL[test];

  const rail = tab === 'learn' ? (
    <div className="space-y-5">
      {[...new Set(LESSONS.map((l) => l.group))].map((g) => (
        <div key={g}>
          <div className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-[#8A929C]">{g}</div>
          {LESSONS.map((l, i) => l.group === g && (
            <button key={l.id} type="button" onClick={() => setLesson(i)}
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
              <button key={c.id} type="button" onClick={() => setTest(i)}
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

      <div className="flex min-h-0 flex-1">
        <aside className="hidden w-72 shrink-0 overflow-y-auto bg-[var(--r-side)] py-4 pr-2 pl-2 text-[var(--r-side-text)] lg:block">{rail}</aside>

        <main id="runner-main" className="min-w-0 flex-1 overflow-y-auto">
          <div className="mx-auto max-w-4xl px-5 py-8">
            <div className="mb-5 lg:hidden">
              <select aria-label={tab === 'learn' ? 'Screen' : 'Test'} value={tab === 'learn' ? lesson : test}
                onChange={(e) => (tab === 'learn' ? setLesson : setTest)(Number(e.target.value))}
                className="w-full rounded-lg border border-[var(--r-line)] bg-[var(--r-card)] px-3 py-2 text-sm">
                {tab === 'learn'
                  ? LESSONS.map((l, i) => <option key={l.id} value={i}>{i + 1}. {l.title}</option>)
                  : ALL.map((c, i) => <option key={c.id} value={i}>{c.id} {c.title}{results[c.id] ? ` · ${STATUS[results[c.id]].label}` : ''}</option>)}
              </select>
              {tab === 'test' && <div className="mt-2 text-xs text-[var(--r-dim)]">{done} of {ALL.length} run · {counts.pass} pass · {counts.fail} fail · {counts.blocked} blocked</div>}
            </div>

            {tab === 'learn' ? (
              <article className="space-y-6">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-[var(--r-coral)]">{L.group} · {lesson + 1} of {LESSONS.length}</div>
                  <h1 className="mt-2 text-3xl font-bold tracking-tight">{L.title}</h1>
                  <div className="mt-3 flex flex-wrap gap-1.5">{L.roles.map((r) => <RoleChip key={r} role={r} />)}</div>
                  <p className="mt-4 text-lg text-[var(--r-dim)] [&_b]:text-[var(--r-ink)]">{L.what}</p>
                </div>
                {L.shots?.map((s) => <Shot key={s.src} src={s.src} label={s.label} alt={s.alt} />)}
                <div className="grid gap-4 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
                  {L.how && (
                    <div className="rounded-xl border border-[var(--r-line)] bg-[var(--r-card)] p-5">
                      <Label>How to use it</Label>
                      <ol className="space-y-2.5 text-[15px] leading-relaxed text-[var(--r-dim)] [&_b]:text-[var(--r-ink)]">
                        {L.how.map((h, i) => (
                          <li key={i} className="flex gap-3">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--r-accent-tint)] text-xs font-semibold text-[var(--r-accent)]">{i + 1}</span>
                            <span>{h}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                  {L.tips && (
                    <div className="rounded-xl border-l-4 border-[var(--r-coral)] bg-[#FDF5F1] p-5">
                      <Label>Good to know</Label>
                      <ul className="space-y-2.5 text-[15px] leading-relaxed text-[var(--r-dim)] [&_b]:text-[var(--r-ink)]">
                        {L.tips.map((t, i) => <li key={i}>{t}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
                <NavButtons i={lesson} n={LESSONS.length} onGo={setLesson} nextLabel="Next screen" />
                {lesson === LESSONS.length - 1 && (
                  <button type="button" onClick={() => setTab('test')} className="w-full rounded-xl bg-[var(--r-side)] px-5 py-4 text-left text-white">
                    <div className="text-xs font-semibold uppercase tracking-wider text-[var(--r-side-text)]">Done with the screens</div>
                    <div className="mt-1 flex items-center gap-2 text-lg font-semibold">Run the {ALL.length} acceptance tests <ArrowRight size={18} /></div>
                  </button>
                )}
              </article>
            ) : (
              <article className="space-y-6">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-[var(--r-coral)]">
                    {GROUPS.find((g) => g.cases.includes(T))?.title} · test {test + 1} of {ALL.length}
                  </div>
                  <h1 className="mt-2 flex flex-wrap items-center gap-3 text-3xl font-bold tracking-tight">
                    <span className="font-mono text-xl text-[var(--r-faint)]">{T.id}</span>{T.title}
                  </h1>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <RoleChip role={T.role} />
                    {results[T.id] && <span className={`rounded-md border px-2 py-0.5 text-xs font-semibold ${STATUS[results[T.id]].chip}`}>{STATUS[results[T.id]].label}</span>}
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl border border-[var(--r-line)] bg-[var(--r-card)] p-5">
                    <Label>Steps</Label>
                    <ol className="space-y-2.5 text-[15px] leading-relaxed text-[var(--r-dim)] [&_b]:text-[var(--r-ink)]">
                      {T.steps.map((s, i) => (
                        <li key={i} className="flex gap-3">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--r-accent-tint)] text-xs font-semibold text-[var(--r-accent)]">{i + 1}</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                  <div className="rounded-xl border border-[var(--r-line)] bg-[var(--r-card)] p-5">
                    <Label>Expected result</Label>
                    <p className="text-[15px] leading-relaxed text-[var(--r-dim)]">{T.expect}</p>
                  </div>
                </div>
                <div className="rounded-xl border border-[var(--r-line)] bg-[var(--r-card)] p-5">
                  <Label>Notes (optional)</Label>
                  <textarea value={notes[T.id] || ''} onChange={(e) => setNotes((n) => ({ ...n, [T.id]: e.target.value }))} rows={3}
                    placeholder="What you saw, the patient ID, anything unexpected"
                    className="w-full rounded-lg border border-[var(--r-line)] bg-[var(--r-bg)] px-3 py-2 text-[15px] outline-none focus:border-[var(--r-accent)]" />
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => mark(T.id, 'pass', true)} className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--r-accent)] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90">
                    <Check size={16} /> Pass{test < ALL.length - 1 ? ', next' : ''} {test < ALL.length - 1 && <ArrowRight size={15} />}
                  </button>
                  <button type="button" onClick={() => mark(T.id, 'fail', false)} className={`rounded-lg border px-4 py-2.5 text-sm font-semibold ${results[T.id] === 'fail' ? STATUS.fail.chip : 'border-[var(--r-line)] bg-[var(--r-card)] text-[var(--r-dim)]'}`}>Fail</button>
                  <button type="button" onClick={() => mark(T.id, 'blocked', false)} className={`rounded-lg border px-4 py-2.5 text-sm font-semibold ${results[T.id] === 'blocked' ? STATUS.blocked.chip : 'border-[var(--r-line)] bg-[var(--r-card)] text-[var(--r-dim)]'}`}>Blocked</button>
                </div>
                <p className="text-sm text-[var(--r-faint)]">On Fail or Blocked, add a note, then move on with Next. Marks and notes are kept in this browser only: send them with <b>Copy results</b>.</p>
                <NavButtons i={test} n={ALL.length} onGo={setTest} nextLabel="Next test" />
                <div className="flex flex-wrap gap-2 lg:hidden">
                  <button type="button" onClick={copy} className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--r-side)] px-3 py-2 text-sm font-semibold text-white">
                    {copied ? <CheckCircle2 size={15} /> : <ClipboardCopy size={15} />}{copied ? 'Copied' : 'Copy results'}
                  </button>
                  <button type="button" onClick={reset} className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--r-line)] px-3 py-2 text-sm font-semibold"><RotateCcw size={15} />Reset</button>
                </div>
              </article>
            )}

            <footer className="mt-12 border-t border-[var(--r-line)] pt-5 text-sm text-[var(--r-faint)]">
              Questions or problems: post in the lab's Slack channel with the test ID and patient ID, or email{' '}
              <a href="mailto:advadu@wix.com" className="font-semibold text-[var(--r-accent)] hover:underline">advadu@wix.com</a>.
            </footer>
          </div>
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
