import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { CheckCircle2, ClipboardCopy, ExternalLink, Printer, RotateCcw } from 'lucide-react';

// The lab's training and acceptance-test page. Its own look (warm paper, teal, serif headings),
// so it reads as a handover document rather than part of the presentation.
const THEME = {
  '--t-paper': '#F7F6F2',
  '--t-card': '#FFFFFF',
  '--t-ink': '#14211F',
  '--t-dim': '#4D5B58',
  '--t-faint': '#7A8784',
  '--t-line': '#E3E1D9',
  '--t-accent': '#0F766E',
  '--t-accent-dark': '#115E59',
  '--t-tint': '#E3F3EF',
  '--t-pass': '#1A6B3D',
  '--t-pass-tint': '#DCF0E3',
  '--t-fail': '#9F3A16',
  '--t-fail-tint': '#FDECE4',
  '--t-block': '#6B5A12',
  '--t-block-tint': '#F7EFD0',
} as CSSProperties;

const APP = 'https://lungscan-research.base44.app';
const serif = { fontFamily: "'Source Serif 4', Georgia, serif" };

type Role = 'Reviewer' | 'Director' | 'Admin' | 'Everyone';
type Case = { id: string; role: Role; title: string; steps: ReactNode[]; expect: ReactNode };

const GROUPS: { title: string; cases: Case[] }[] = [
  {
    title: 'Getting in',
    cases: [
      { id: 'T01', role: 'Everyone', title: 'Sign in', steps: [<>Open <b>lungscan-research.base44.app</b>.</>, 'Sign in with Google, using the invited account.'], expect: 'The Dashboard opens, and your name and role show at the bottom of the sidebar. A one-time "For research use only" notice appears at the top.' },
      { id: 'T02', role: 'Everyone', title: 'Pages match your role', steps: ['Look at the sidebar.'], expect: 'Reviewer: Dashboard, Backlog, Measurements, Data Set. Director: the same, plus Assistant and Settings › Emails. Admin: everything, including Team and Permissions.' },
    ],
  },
  {
    title: 'Measuring a scan',
    cases: [
      { id: 'T03', role: 'Reviewer', title: 'Open the next scan', steps: [<>On the Dashboard, choose <b>Open next scan</b>.</>], expect: 'The scanner opens the first scan in the Backlog. Its images load within a few seconds.' },
      { id: 'T04', role: 'Reviewer', title: 'Measure a solid tumor from a suggestion', steps: [<>Open <b>RIDER-1867199702</b> (Data Set › folder › Open in Scanner).</>, <>Click the first item under <b>System suggestions</b>.</>, 'Check the outline on a few slices around the tumor.'], expect: 'A New tumor card shows the long axis, short axis and volume. The outline follows the tumor without spilling into vessels.' },
      { id: 'T05', role: 'Reviewer', title: 'Outline a tumor by clicking it', steps: ['Scroll to a tumor that is not in the suggestions.', 'Click its centre.'], expect: 'The tool outlines it in 3D and fills a New tumor card. Under 4 mm, the app warns but lets you save.' },
      { id: 'T06', role: 'Reviewer', title: 'Correct an outline', steps: [<>Use <b>Erase</b> to remove part of the outline, then <b>Grow</b>, <b>Shrink</b> and <b>Clean up</b>.</>, <>Choose <b>Undo</b>.</>], expect: 'Each step changes the outline and the measurements right away. Undo reverses the last step.' },
      { id: 'T07', role: 'Reviewer', title: 'Save a tumor', steps: ['Leave lobe or type empty and try to save.', <>Fill lobe and type (and match to prior on a follow-up), then <b>Save tumor</b>.</>], expect: 'Save stays unavailable until the required fields are filled. After saving, the tumor appears under Tumors on this scan.' },
      { id: 'T08', role: 'Reviewer', title: "Add a tumor you can't outline", steps: [<>Under <b>Tumor you can't outline</b>, choose <b>Add tumor</b>.</>, 'Type its measurements and save.'], expect: 'A card with no outline is saved with the typed measurements.' },
      { id: 'T09', role: 'Reviewer', title: 'Leave with unsaved work', steps: ['Outline a tumor, then go to the Dashboard without saving.'], expect: 'The app asks whether to keep it as a draft or dismiss it. A draft is still there when you return.' },
      { id: 'T10', role: 'Reviewer', title: 'See a tumor\'s history', steps: ['On a saved tumor, choose its history button.'], expect: 'The history shows what the tool proposed and every change, with who made it and when.' },
    ],
  },
  {
    title: 'Hard cases',
    cases: [
      { id: 'T11', role: 'Reviewer', title: 'Ground-glass tumor', steps: [<>Open <b>RIDER-2541949645</b> and outline its tumor.</>, 'Click a second time at a slightly different spot.'], expect: 'The outline may differ between clicks: this is a known weakness. Correct it with the brush until it matches what you see.' },
      { id: 'T12', role: 'Reviewer', title: 'Tumor touching the mediastinum', steps: [<>Open <b>RIDER-2073083717</b> and outline its tumor.</>, <>Trim the leak with the 3D <b>Erase</b> brush.</>], expect: 'The first outline leaks into the mediastinum (known failure). After trimming, the volume is plausible and the edit is recorded.' },
      { id: 'T13', role: 'Reviewer', title: 'Spiculated tumor', steps: [<>Open <b>RIDER-1760553574</b> and outline its tumor.</>], expect: 'Check whether the spikes are included as you would include them. Note any difference in the comments.' },
    ],
  },
  {
    title: 'Follow-up scans',
    cases: [
      { id: 'T14', role: 'Reviewer', title: 'Compare with the Baseline', steps: [<>Open the Follow-up of a patient whose Baseline is signed off.</>, 'Move through the slices with Follow on.'], expect: 'The Baseline opens beside it and moves to the matching spot as you scroll.' },
      { id: 'T15', role: 'Reviewer', title: 'Match a tumor to the Baseline', steps: ['Outline the same tumor on the Follow-up.'], expect: 'The Baseline tumor (within 20 mm) is preselected as the same tumor. You can confirm it or pick another.' },
    ],
  },
  {
    title: 'Sign-off',
    cases: [
      { id: 'T16', role: 'Reviewer', title: 'Quality check catches a problem', steps: ['Save a tumor with something flagged (for example, an uncertain match to prior).', <>Choose <b>Sign off scan</b>.</>], expect: 'A warning icon shows on the tumor card. "Before you sign off" lists the flag with a short explanation. Back to fix it returns to the scan.' },
      { id: 'T17', role: 'Reviewer', title: 'Sign off and go on', steps: ['Sign off a scan (fix the flags or choose Sign off anyway).'], expect: 'The scan is signed off and the app offers the next scan. After a Baseline, it offers that patient\'s Follow-up.' },
      { id: 'T18', role: 'Reviewer', title: 'Backlog order', steps: ['Open the Backlog and read the order.'], expect: 'Started scans first, then follow-ups that complete a pair, then baselines, then follow-ups still waiting. Opening a scan further down asks first.' },
    ],
  },
  {
    title: 'Results and reporting',
    cases: [
      { id: 'T19', role: 'Director', title: 'Read the change between scans', steps: ['Open Measurements and find a patient with both scans signed off.'], expect: 'The follow-up row shows the change from the Baseline and the volume doubling time (empty when the tumor is stable or shrinking).' },
      { id: 'T20', role: 'Director', title: 'Export to the lab sheet', steps: [<>Choose <b>Export</b>, then <b>Signed off only</b>.</>, 'Open the CSV and paste the rows into the lab spreadsheet.'], expect: 'The first 18 columns match the sheet\'s columns, in the same order and names. Only signed-off rows are included.' },
      { id: 'T21', role: 'Director', title: 'Track progress', steps: ['Open the Dashboard.'], expect: 'Signed off, In progress, Backlog and Pairs complete match what you see in the Backlog and Data Set. Efficiency and time saved shows time per scan and correction time by tumor type.' },
      { id: 'T22', role: 'Director', title: 'Weekly summary email', steps: [<>Open <b>Settings › Emails</b> and open the weekly summary.</>, 'Check recipients and schedule.'], expect: 'The weekly summary goes out Sundays at 08:00 to the listed recipients. Its send log shows past sends.' },
      { id: 'T23', role: 'Director', title: 'Ask the Assistant', steps: [<>Open <b>Assistant</b> and ask: "How far along is the lab? How many pairs are complete?"</>, 'Then ask: "Sign off RIDER-1825099523 for me."'], expect: 'The first answer matches the Dashboard numbers. To the second, it explains it can only read and points to the scanner.' },
    ],
  },
  {
    title: 'Running the lab',
    cases: [
      { id: 'T24', role: 'Admin', title: 'Invite a member and set a role', steps: [<>In <b>Settings › Team</b>, invite a test email.</>, 'After they sign in, set their lab role to Reviewer.'], expect: 'They see only the Reviewer pages, and can measure and sign off.' },
      { id: 'T25', role: 'Admin', title: 'Change what a role can open', steps: [<>In <b>Settings › Permissions</b>, untick a page for Reviewer, then tick it back.</>], expect: 'The change applies right away for Reviewers.' },
      { id: 'T26', role: 'Admin', title: 'Upload a new patient', steps: [<>In <b>Data Set</b>, choose <b>Upload folder</b> and pick a patient's DICOM folder.</>], expect: 'The series appear with Baseline or Follow-up labels (the app asks when the files can\'t tell), and the scans enter the Backlog.' },
    ],
  },
];

const ALL = GROUPS.flatMap((g) => g.cases);
type Status = 'pass' | 'fail' | 'blocked';
const KEY = 'lungscan.training.results.v1';
const load = (): Record<string, Status> => { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; } };

const STATUS: Record<Status, { label: string; on: string }> = {
  pass: { label: 'Pass', on: 'bg-[var(--t-pass-tint)] text-[var(--t-pass)] border-[var(--t-pass)]' },
  fail: { label: 'Fail', on: 'bg-[var(--t-fail-tint)] text-[var(--t-fail)] border-[var(--t-fail)]' },
  blocked: { label: 'Blocked', on: 'bg-[var(--t-block-tint)] text-[var(--t-block)] border-[var(--t-block)]' },
};

const ROLE_COLOR: Record<Role, string> = {
  Reviewer: 'bg-[var(--t-tint)] text-[var(--t-accent-dark)]',
  Director: 'bg-[#EEEAF8] text-[#4B3A8C]',
  Admin: 'bg-[#F1EFE8] text-[#5F5E5A]',
  Everyone: 'bg-[#F1EFE8] text-[#5F5E5A]',
};

function Module({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  return (
    <section className="grid gap-6 border-t border-[var(--t-line)] py-10 md:grid-cols-[120px_minmax(0,1fr)]">
      <div className="text-5xl font-semibold text-[var(--t-accent)]" style={serif}>{n}</div>
      <div>
        <h2 className="mb-4 text-3xl font-semibold" style={serif}>{title}</h2>
        <div className="space-y-3 text-[16px] leading-relaxed text-[var(--t-dim)] [&_b]:text-[var(--t-ink)]">{children}</div>
      </div>
    </section>
  );
}

const Steps = ({ items }: { items: ReactNode[] }) => (
  <ol className="list-decimal space-y-1.5 pl-5 marker:font-semibold marker:text-[var(--t-accent)]">{items.map((s, i) => <li key={i}>{s}</li>)}</ol>
);

export default function Training() {
  const [results, setResults] = useState<Record<string, Status>>({});
  const [copied, setCopied] = useState(false);
  useEffect(() => setResults(load()), []);
  const set = (id: string, s: Status) => {
    const next = { ...results };
    if (next[id] === s) delete next[id]; else next[id] = s;
    setResults(next);
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* storage blocked: kept for this visit */ }
  };
  const counts = useMemo(() => {
    const c = { pass: 0, fail: 0, blocked: 0 };
    Object.values(results).forEach((s) => { c[s] += 1; });
    return c;
  }, [results]);
  const done = counts.pass + counts.fail + counts.blocked;

  const copy = async () => {
    const lines = [`LungScan Research test results: ${counts.pass} pass, ${counts.fail} fail, ${counts.blocked} blocked, ${ALL.length - done} not run`];
    ALL.forEach((c) => lines.push(`${c.id} ${c.title}: ${results[c.id] ? STATUS[results[c.id]].label : 'Not run'}`));
    try { await navigator.clipboard.writeText(lines.join('\n')); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* clipboard blocked */ }
  };
  const reset = () => { setResults({}); try { localStorage.removeItem(KEY); } catch { /* ignore */ } };

  return (
    <div style={THEME} className="h-screen overflow-y-auto bg-[var(--t-paper)] text-[var(--t-ink)] print:h-auto print:overflow-visible">
      <header className="bg-[var(--t-ink)] text-white">
        <div className="mx-auto max-w-5xl px-5 py-14 md:py-20">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7DD3C0]">Harbor Medical Center · Thoracic Oncology Research Lab</div>
          <h1 className="mt-4 text-4xl font-semibold leading-tight md:text-6xl" style={serif}>LungScan Research<br />training and acceptance tests</h1>
          <p className="mt-5 max-w-2xl text-lg text-[#C9D3D1]">
            For Dr. Naomi Hart and Dr. Daniel Reyes: how to use the tool day to day, and the tests to run before the lab
            relies on it. For research use only; it makes no clinical claims.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 print:hidden">
            <a href={APP} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#7DD3C0] px-5 py-2.5 font-semibold text-[var(--t-ink)] hover:opacity-90">Open the app <ExternalLink size={16} /></a>
            <a href="#tests" className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-2.5 font-semibold text-white hover:bg-white/10">Go to the tests</a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5">
        <Module n="01" title="Before you start">
          <p>Sign in at <b>lungscan-research.base44.app</b> with the Google account that was invited. Each person has a lab role:</p>
          <div className="grid gap-3 md:grid-cols-3">
            {[
              ['Reviewer', 'Daniel', 'Measures tumors and signs off scans.'],
              ['Director', 'Naomi', 'Follows progress, reads results, exports, and gets the weekly summary and the Assistant.'],
              ['Admin', 'Lab admin', 'Invites members, sets roles and permissions, uploads new scans.'],
            ].map(([r, who, what]) => (
              <div key={r} className="rounded-xl border border-[var(--t-line)] bg-[var(--t-card)] p-4">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${ROLE_COLOR[r as Role]}`}>{r}</span>
                <div className="mt-2 font-semibold text-[var(--t-ink)]">{who}</div>
                <p className="mt-1 text-[15px]">{what}</p>
              </div>
            ))}
          </div>
          <p>The library already holds the public RIDER Lung CT scans: 59 series in 31 patient folders, 28 of them with both a Baseline and a Follow-up. Everything you do there is real data and is kept in the audit log, so test freely.</p>
        </Module>

        <Module n="02" title="Daily routine for the reviewer">
          <Steps items={[
            <>Open the <b>Dashboard</b> and choose <b>Open next scan</b>. The Backlog decides the order: finish started scans, then complete pairs, then new patients.</>,
            <>In the scanner, start from <b>System suggestions</b> (the 3 most likely tumors of 4 mm or more), or click a tumor on the image.</>,
            <>Check the outline on a few slices. Correct it with the brush, <b>Grow</b>, <b>Shrink</b> or <b>Clean up</b>.</>,
            <>Fill in lobe, type, match to prior (on a follow-up) and, for part-solid tumors, the solid component. <b>Save tumor</b>.</>,
            <>On a follow-up, use <b>Compare with the Baseline scan</b> to confirm it is the same tumor.</>,
            <><b>Sign off scan</b>. Fix anything the quality check flags, or sign off anyway if you disagree. The next scan opens.</>,
          ]} />
          <p className="rounded-xl border-l-4 border-[var(--t-accent)] bg-[var(--t-tint)] px-4 py-3 text-[var(--t-ink)]">
            The tool proposes; you decide. Every number stored is measured by the server on your saved outline, and every change is recorded.
          </p>
        </Module>

        <Module n="03" title="For the director">
          <Steps items={[
            <><b>Dashboard:</b> progress, pairs complete, sign-offs per day, and time per scan and correction time by tumor type.</>,
            <><b>Measurements:</b> one row per tumor per scan, with the change between scans and doubling time. <b>Export</b> signed-off rows (or all) as a CSV in the lab sheet's 18 columns.</>,
            <><b>Weekly summary:</b> sent every Sunday at 08:00. Change recipients or schedule in <b>Settings › Emails</b>.</>,
            <><b>Assistant:</b> ask questions about progress and results in plain language. It only reads, and never gives clinical advice.</>,
          ]} />
        </Module>

        <Module n="04" title="Known limits to keep in mind">
          <ul className="list-disc space-y-1.5 pl-5 marker:text-[var(--t-accent)]">
            <li><b>Ground-glass tumors</b> have no clear edge, so the outline depends on where you click. Check it carefully.</li>
            <li><b>Tumors touching the mediastinum or chest wall</b> can leak. Trim with the 3D Erase brush.</li>
            <li><b>Suggestions can miss</b> small and ground-glass tumors: always read the whole scan.</li>
          </ul>
        </Module>

        <section id="tests" className="scroll-mt-4 border-t border-[var(--t-line)] py-10">
          <div className="grid gap-6 md:grid-cols-[120px_minmax(0,1fr)]">
            <div className="text-5xl font-semibold text-[var(--t-accent)]" style={serif}>05</div>
            <div>
              <h2 className="text-3xl font-semibold" style={serif}>Acceptance tests</h2>
              <p className="mt-3 text-[16px] leading-relaxed text-[var(--t-dim)]">
                {ALL.length} short tests, grouped by task. Run the ones for your role, mark each one, and send the results back
                with <b className="text-[var(--t-ink)]">Copy results</b>. Marks are kept in this browser only.
              </p>
            </div>
          </div>

          <div className="sticky top-0 z-10 mt-6 rounded-2xl border border-[var(--t-line)] bg-[var(--t-card)]/95 p-4 backdrop-blur print:static">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm text-[var(--t-dim)]">
                <b className="text-[var(--t-ink)]">{done} of {ALL.length}</b> run · <span className="text-[var(--t-pass)]">{counts.pass} pass</span> · <span className="text-[var(--t-fail)]">{counts.fail} fail</span> · <span className="text-[var(--t-block)]">{counts.blocked} blocked</span>
              </div>
              <div className="flex gap-2 print:hidden">
                <button type="button" onClick={copy} className="inline-flex items-center gap-1.5 rounded-full bg-[var(--t-accent)] px-4 py-1.5 text-sm font-semibold text-white hover:bg-[var(--t-accent-dark)]">
                  {copied ? <CheckCircle2 size={15} /> : <ClipboardCopy size={15} />}{copied ? 'Copied' : 'Copy results'}
                </button>
                <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-1.5 rounded-full border border-[var(--t-line)] px-3 py-1.5 text-sm font-semibold text-[var(--t-dim)] hover:text-[var(--t-ink)]"><Printer size={15} />Print</button>
                <button type="button" onClick={reset} className="inline-flex items-center gap-1.5 rounded-full border border-[var(--t-line)] px-3 py-1.5 text-sm font-semibold text-[var(--t-dim)] hover:text-[var(--t-ink)]"><RotateCcw size={15} />Reset</button>
              </div>
            </div>
            <div className="mt-3 flex h-2 overflow-hidden rounded-full bg-[var(--t-line)]">
              <div className="bg-[var(--t-pass)]" style={{ width: `${(counts.pass / ALL.length) * 100}%` }} />
              <div className="bg-[var(--t-fail)]" style={{ width: `${(counts.fail / ALL.length) * 100}%` }} />
              <div className="bg-[var(--t-block)]" style={{ width: `${(counts.blocked / ALL.length) * 100}%` }} />
            </div>
          </div>

          <div className="mt-8 space-y-10">
            {GROUPS.map((g) => (
              <div key={g.title}>
                <h3 className="mb-3 text-xl font-semibold" style={serif}>{g.title}</h3>
                <div className="space-y-3">
                  {g.cases.map((c) => (
                    <article key={c.id} className="break-inside-avoid rounded-2xl border border-[var(--t-line)] bg-[var(--t-card)] p-5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-sm font-semibold text-[var(--t-faint)]">{c.id}</span>
                          <h4 className="text-lg font-semibold">{c.title}</h4>
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${ROLE_COLOR[c.role]}`}>{c.role}</span>
                        </div>
                        <div className="flex gap-1.5" role="group" aria-label={`Result for ${c.id}`}>
                          {(Object.keys(STATUS) as Status[]).map((s) => (
                            <button key={s} type="button" aria-pressed={results[c.id] === s} onClick={() => set(c.id, s)}
                              className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${results[c.id] === s ? STATUS[s].on : 'border-[var(--t-line)] text-[var(--t-faint)] hover:text-[var(--t-ink)]'}`}>
                              {STATUS[s].label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="mt-3 grid gap-4 text-[15px] leading-relaxed md:grid-cols-2">
                        <div>
                          <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-[var(--t-faint)]">Steps</div>
                          <div className="text-[var(--t-dim)] [&_b]:text-[var(--t-ink)]"><Steps items={c.steps} /></div>
                        </div>
                        <div>
                          <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-[var(--t-faint)]">Expected</div>
                          <p className="text-[var(--t-dim)]">{c.expect}</p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <Module n="06" title="Questions and problems">
          <p>
            Post in the lab's Slack channel with the test ID (for example <b>T12</b>), the patient ID and a screenshot if you can.
            For access problems, email <a href="mailto:advadu@wix.com" className="font-semibold text-[var(--t-accent)] hover:underline">advadu@wix.com</a>.
            A page-by-page guide is in the <a href="./guide.html" className="font-semibold text-[var(--t-accent)] hover:underline">user guide</a>.
          </p>
        </Module>
      </main>

      <footer className="border-t border-[var(--t-line)] py-8 text-center text-sm text-[var(--t-faint)]">LungScan Research · For research use only. No clinical claims.</footer>
    </div>
  );
}
