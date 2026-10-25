import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { ArrowLeft, ExternalLink, KeyRound, LogIn, MonitorPlay } from 'lucide-react';
import { Card, Chip, Shot } from '../components/ui';

const APP = 'https://lungscan-research.base44.app';

const TOC = [
  { id: 'getting-started', label: 'Getting started' },
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'backlog', label: 'Backlog' },
  { id: 'scanner', label: 'Scanner' },
  { id: 'quality-check', label: 'Quality check' },
  { id: 'compare', label: 'Comparing scans' },
  { id: 'measurements', label: 'Measurements' },
  { id: 'data-set', label: 'Data Set' },
  { id: 'assistant', label: 'Assistant' },
  { id: 'settings', label: 'Settings' },
  { id: 'upload', label: 'Upload new scans' },
  { id: 'code', label: 'Source code map' },
  { id: 'help', label: 'If something goes wrong' },
];

const A = ({ href, children }: { href: string; children: ReactNode }) => (
  <a href={href} target="_blank" rel="noreferrer" className="font-medium text-[var(--color-brand)] hover:underline">
    {children}
  </a>
);

function Block({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-[var(--color-border)] pt-10 first:border-0 first:pt-0">
      <h2 className="mb-4 text-2xl font-bold tracking-tight">{title}</h2>
      <div className="space-y-4 text-[16px] leading-relaxed text-[var(--color-text-dim)] [&_b]:text-[var(--color-text)]">{children}</div>
    </section>
  );
}

function List({ items, ordered }: { items: ReactNode[]; ordered?: boolean }) {
  const Tag = ordered ? 'ol' : 'ul';
  return (
    <Tag className={`space-y-2 pl-5 ${ordered ? 'list-decimal' : 'list-disc'} marker:text-[var(--color-brand)]`}>
      {items.map((it, i) => <li key={i} className="pl-1">{it}</li>)}
    </Tag>
  );
}

function Table({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
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

const code = (s: string) => <code className="rounded bg-[var(--color-surface-2)] px-1.5 py-0.5 font-mono text-[13px]">{s}</code>;

export default function Guide() {
  const [active, setActive] = useState(TOC[0].id);
  useEffect(() => {
    const root = document.getElementById('guide-scroll');
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { root, rootMargin: '-20% 0px -70% 0px' },
    );
    TOC.forEach(({ id }) => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  return (
    <div id="guide-scroll" className="h-screen overflow-y-auto scroll-smooth">
      <header className="sticky top-0 z-20 border-b border-[var(--color-border)] bg-[var(--color-bg)]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
          <a href="./" className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-text-dim)] hover:text-[var(--color-brand)]">
            <ArrowLeft size={16} /> Presentation
          </a>
          <span className="hidden text-sm font-semibold sm:block">LungScan Research · How to use it</span>
          <a href={APP} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-brand)] px-3 py-1.5 text-sm font-semibold text-white hover:opacity-90">
            Open the app <ExternalLink size={14} />
          </a>
        </div>
      </header>

      <div className="grid-bg">
        <div className="mx-auto max-w-6xl px-5 pb-10 pt-14">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-brand)]">User guide</div>
          <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">How to use LungScan Research</h1>
          <p className="mt-4 max-w-3xl text-lg text-[var(--color-text-dim)]">
            A tool that cuts the manual work of finding and measuring lung tumors on CT scans, built on Base44 for the
            (simulated) Thoracic Oncology Research Lab at Harbor Medical Center. For research use only; it makes no clinical claims.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              { icon: KeyRound, title: '1. Get access', body: <>Email <A href="mailto:advadu@wix.com">advadu@wix.com</A> the Google account to invite. You get the Admin role, so every page is open to you.</> },
              { icon: LogIn, title: '2. Sign in', body: <>Open <A href={APP}>lungscan-research.base44.app</A> and sign in with Google, using the invited account.</> },
              { icon: MonitorPlay, title: '3. Explore', body: <>The library already holds the public RIDER Lung CT scans. Measure and sign off freely: every change is audited.</> },
            ].map(({ icon: Icon, title, body }) => (
              <Card key={title}>
                <h3 className="mb-2 flex items-center gap-2 font-semibold"><Icon size={18} className="text-[var(--color-brand)]" />{title}</h3>
                <p className="text-[15px] text-[var(--color-text-dim)]">{body}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)] gap-10 px-5 py-12 lg:grid-cols-[200px_minmax(0,1fr)]">
        <nav aria-label="Contents" className="hidden lg:block">
          <ul className="sticky top-24 space-y-1 text-sm">
            {TOC.map(({ id, label }) => (
              <li key={id}>
                <a href={`#${id}`} className={`block rounded-md px-3 py-1.5 ${active === id ? 'bg-[var(--color-brand-tint)] font-semibold text-[var(--color-brand)]' : 'text-[var(--color-text-dim)] hover:text-[var(--color-text)]'}`}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <main className="max-w-3xl space-y-12">
          <Block id="getting-started" title="Getting started">
            <p>
              The library holds the public RIDER Lung CT practice set: <b>59 series in 31 patient folders</b>, with 28 patients
              that have both a Baseline and a Follow-up scan. Only the scans are loaded, from The Cancer Imaging Archive (TCIA):{' '}
              <A href="https://www.cancerimagingarchive.net/collection/rider-lung-ct/">RIDER Lung CT</A>.
            </p>
            <p>
              The sidebar holds every page: Dashboard, Backlog, Measurements, Data Set, Assistant and Settings. <b>Collapse</b> at
              the bottom makes it narrow, to give the scanner more room. A one-time "For research use only" notice appears at the
              top; close it with the ×.
            </p>
          </Block>

          <Block id="dashboard" title="Dashboard">
            <Shot src="dashboard.jpg" label="Dashboard" alt="Dashboard: measuring progress, Up next and sign-offs per day" />
            <p>Where the library stands today, and the fastest way into the work.</p>
            <List items={[
              <><b>Open next scan</b> (top right) opens the first scan in the Backlog, so you never have to choose.</>,
              <><b>Library bar:</b> how many scans are signed off, in progress and still to do.</>,
              <><b>Cards:</b> Signed off (and how many in the last 7 days), In progress, Backlog (click it to open the Backlog), and <b>Pairs complete</b>: patients whose Baseline and Follow-up are both signed off.</>,
              <><b>Up next:</b> the next scans in the queue. <b>Signed off per day:</b> the last 10 working days.</>,
              <><b>Efficiency and time saved</b> (lower down, Directors and Admins): the time each scan was open before sign-off, and the correction time per tumor by tumor type. This is how the time saved is measured.</>,
            ]} />
          </Block>

          <Block id="backlog" title="Backlog">
            <Shot src="backlog.jpg" label="Backlog" alt="Backlog: every scan not signed off, in priority order" />
            <p>
              Every scan not signed off yet, in the order the lab works through them. Choose <b>Open in Scanner</b> on any row;
              opening a scan further down the list asks you first, because others come before it.
            </p>
            <p>The order (column #) puts finishing work before starting new work:</p>
            <List ordered items={[
              <><b>Started:</b> scans already in progress, the earliest started first.</>,
              <><b>Completes a pair:</b> follow-ups whose Baseline is signed off.</>,
              <><b>Baseline scans</b> that haven't been started.</>,
              <><b>Follow-ups still waiting</b> for their Baseline to be signed off.</>,
            ]} />
            <p>
              <b>Why this order:</b> the research measures how tumors change, which needs both scans of a patient. Within each
              group the oldest scan date comes first, and after a Baseline is signed off the app offers that patient's follow-up
              next, while the case is fresh. Above the table: search by patient ID, scan or series; filter by status; sort by
              priority, last activity or folder.
            </p>
          </Block>

          <Block id="scanner" title="Scanner">
            <Shot src="scanner.jpg" label="Scanner" alt="Scanner: a tumor outlined on the CT image, with its measurements on the right" />
            <p>
              Where a scan is measured: the image in the middle, the tumor panel on the right. The first open of a scan
              downloads its images (a few seconds); later opens are instant.
            </p>
            <p><b>Find your way around the image</b></p>
            <List items={[
              <>Scroll, or ↑ ↓, to move through the slices. Page Up / Page Down jump 10. Ctrl/Cmd + scroll zooms.</>,
              <><b>Lung</b> and <b>Mediastinum</b> (bottom right of the image) change the contrast. <b>Fit</b> resets the zoom.</>,
            ]} />
            <p><b>Measure a tumor</b></p>
            <List ordered items={[
              <><b>Find it:</b> <b>System suggestions</b> lists the 3 most likely tumors of 4 mm or more, found when the scan was uploaded. Click one, or click a tumor on the image.</>,
              <><b>Check the outline:</b> the tool outlines it in 3D and shows its long axis, short axis and volume in a <b>New tumor</b> card.</>,
              <><b>Correct it if needed:</b> Add and Erase brushes (2D, or 3D across slices), <b>Grow</b>, <b>Shrink</b>, <b>Clean up</b> and a sensitivity setting. Every step can be undone.</>,
              <><b>Fill in the details:</b> lobe, type (solid, part-solid, ground-glass), match to prior (on a follow-up) and, for a part-solid tumor, the solid component.</>,
              <><b>Save tumor.</b> The server measures the outline again on the scan's own geometry; those are the stored numbers.</>,
              <><b>Sign off scan</b> (top right) when every tumor is saved. The quality check runs first; then the app offers the next scan.</>,
            ]} />
            <p>
              A tumor that can't be outlined gets a card where you type its measurements by hand. Leaving with unsaved work asks
              whether to keep it as a draft. Each saved tumor has a history button: what the tool proposed and every change, with
              who and when.
            </p>
          </Block>

          <Block id="quality-check" title="Quality check before sign-off">
            <Shot src="quality-flags.jpg" label="Scanner" alt="A warning icon next to a tumor, listing what is missing" />
            <p>
              Before a scan is signed off, the app checks every tumor on it. A warning icon next to a tumor's name shows the
              flags as soon as they apply; point at it to see them. <Chip tone="warn">Fix</Chip> must be fixed,{' '}
              <Chip tone="info">Check</Chip> is worth another look.
            </p>
            <Table head={['Flag', 'Kind', 'When']} rows={[
              ['Lobe or type missing', 'Fix', 'The tumor has no lobe or no type'],
              ['Solid component missing', 'Fix', 'A part-solid tumor has no solid component'],
              ['Match to prior missing', 'Fix', "A follow-up measurement doesn't say whether it is the same tumor"],
              ['Uncertain match to prior', 'Check', 'The reader marked the match as uncertain'],
              ['Large volume change', 'Check', 'The volume changed by 25% or more since the Baseline'],
              ['Below measuring threshold', 'Check', "The long axis is under the lab's 4 mm minimum"],
              ["Far from the tool's volume", 'Check', 'The saved volume differs by 30% or more from what the tool proposed'],
            ]} />
            <p>
              With flags, <b>Sign off scan</b> opens a <b>Before you sign off</b> window: the flags by tumor, each with a short
              explanation written by AI from the numbers. Choose <b>Back to fix it</b> or <b>Sign off anyway</b>; the reader
              always decides. Rules raise the flags, not AI, and if the AI is unavailable each flag gets a fixed explanation.
            </p>
          </Block>

          <Block id="compare" title="Comparing Baseline and Follow-up">
            <Shot src="compare.jpg" label="Compare with the Baseline scan" alt="A follow-up scan with its Baseline open beside it" />
            <p>
              On a <b>follow-up</b> scan, <b>Compare with the Baseline scan</b> (top bar) opens the patient's Baseline beside it,
              read-only. If the Baseline is already signed off, it opens there on its own.
            </p>
            <List items={[
              <><b>Follow</b> (on by default) keeps the Baseline in step: it moves to the matching spot as you move. The scans are aligned by the shape of the lungs.</>,
              <>A tumor measured on both scans shows where it was outlined; anywhere else, a dashed circle marks the approximate spot.</>,
              <>A new outline on the follow-up preselects the nearest Baseline tumor (within 20 mm) as the same tumor. You confirm it or pick another.</>,
            ]} />
            <p>Try it on <b>RIDER-1825099523</b>, the first complete pair: Data Set › RIDER-1825099523 › Follow-up › Open in Scanner.</p>
          </Block>

          <Block id="measurements" title="Measurements">
            <Shot src="measurements.jpg" label="Measurements" alt="Measurements: one row per tumor per scan" />
            <p>One row per tumor per scan, for every scan: in progress, reviewed and signed off.</p>
            <List items={[
              <><b>Columns:</b> patient ID, tumor (N1, N2…), scan (date, Baseline B or Follow-up F, series), lobe and type, long and short axis and their mean (mm), volume (mm³), and on a follow-up the change from the Baseline and the volume doubling time.</>,
              <><b>Filters:</b> search by patient ID, tumor or series; filter by status; limit to a date range with From and To.</>,
              <><b>History:</b> click a row to see what the tool proposed and every change.</>,
              <><b>Export:</b> a CSV in the lab's own 18 columns, in the order and names of their spreadsheet. Choose all rows or only the signed-off ones.</>,
            ]} />
          </Block>

          <Block id="data-set" title="Data Set">
            <Shot src="dataset.jpg" label="Data Set" alt="Data Set: patient folders, with a folder's Baseline and Follow-up on the right" />
            <p>The patient folders, with the Baseline (B) and Follow-up (F) series of each one.</p>
            <List items={[
              <><b>Status per folder:</b> Not started, In progress or Complete (both scans signed off). The B and F chips are colored by each scan's status.</>,
              <><b>Search</b> by patient ID or series folder, and filter by one or more statuses.</>,
              <><b>Click a folder</b> to open its panel: each series with its date, number of files, status and <b>Open in Scanner</b>.</>,
              <><b>Last sync</b> shows when the folder last changed; sort by it or by patient ID.</>,
            ]} />
          </Block>

          <Block id="assistant" title="Assistant">
            <Shot src="assistant.jpg" label="Assistant" alt="The Assistant answering how far along the lab is" />
            <p>
              A chat assistant that answers questions about the lab's progress and results in plain language. It is a Base44
              agent that reads the lab's data and nothing else.
            </p>
            <List items={[
              <><b>Who can use it:</b> Admins and Directors.</>,
              <><b>Read-only:</b> it can't measure, sign off, change data or export; it points you to the right page.</>,
              <><b>From the data only:</b> it fetches the current numbers before every answer and says when results aren't signed off yet.</>,
              <><b>No clinical advice:</b> asked whether a tumor is malignant, it says this is a research tool. It answers in the language you ask in.</>,
            ]} />
            <p><b>Questions to try</b></p>
            <List items={[
              'How far along is the lab? How many pairs are complete?',
              'Which scans were started but not touched for a week?',
              "Show RIDER-1825099523's tumors and their change between scans.",
              'Which follow-up measurements have an uncertain match to prior?',
              'Sign off RIDER-1825099523 for me. (It explains that it can only read.)',
            ]} />
          </Block>

          <Block id="settings" title="Settings">
            <p>Open <b>Settings</b> in the sidebar for its three pages.</p>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-3">
                <Shot src="team.jpg" label="Settings › Team" alt="Team: invite members and set their lab roles" />
                <p><b>Team:</b> invite a member by name and email, then set their lab role: <b>Reviewer</b> measures and signs off, <b>Director</b> views results and exports, <b>Admin</b> manages the team and settings.</p>
              </div>
              <div className="space-y-3">
                <Shot src="emails.jpg" label="Settings › Emails" alt="Emails: the scheduled weekly summary" />
                <p><b>Emails:</b> scheduled emails. The weekly summary goes out on Sundays at 08:00; edit its recipients, content and schedule, and see its send log.</p>
              </div>
            </div>
            <Shot src="permissions.jpg" label="Settings › Permissions" alt="Permissions: which pages each role can open" />
            <p><b>Permissions:</b> which pages each role can open, as checkboxes. Changes apply right away; Team and Permissions are always Admin only.</p>
          </Block>

          <Block id="upload" title="Upload new scans">
            <p>
              Upload needs DICOM files. Download one patient with the{' '}
              <A href="https://wiki.cancerimagingarchive.net/display/NBIA/Downloading+TCIA+Images">NBIA Data Retriever</A>, then
              go to <b>Data Set</b>, choose <b>Upload folder</b> and pick the patient's folder. The browser reads the files and finds
              likely tumors during the upload. The DICOM files themselves are not stored, only a compressed copy of the image volume.
            </p>
          </Block>

          <Block id="code" title="Source code map">
            <p>
              For reviewers of the source code on <A href="https://github.com/advadu/lungscan-research">GitHub</A> (private: ask for
              an invite). Run instructions are in its README.
            </p>
            <Table head={['What', 'Where']} rows={[
              ['Pages', code('src/routes/_authed/')],
              ['Scanner and how its tools work', <>{code('src/components/scanner/')} · {code('docs/scanner.md')}</>],
              ['Tumor outlining, detection and measurement (in the browser)', code('src/lib/tumor/')],
              ['Server checks: every scanner write is validated and measured again', <>{code('src/lib/scanner-fns.js')} · {code('src/lib/scannerRules.js')}</>],
              ['Quality flags and their AI explanations', <>{code('src/lib/qualityFlags.js')} · {code('src/lib/quality-fns.js')}</>],
              ['The Assistant agent', code('base44/agents/lab_assistant.jsonc')],
              ['Data tables and their access rules', code('base44/entities/')],
              ['Lab rules, such as the 4 mm minimum', code('src/lib/labPolicy.js')],
              ['Accuracy checks against expert outlines', code('validation/')],
            ]} />
          </Block>

          <Block id="help" title="If something goes wrong">
            <List items={[
              <><b>"Access not granted" after sign-in:</b> the email hasn't been invited yet, or you signed in with a different Google account. Ask Adva to invite the exact address.</>,
              <><b>The Scanner takes a few seconds to open the first time:</b> it downloads the scan's images once and keeps them in the browser, so later visits are faster.</>,
            ]} />
          </Block>
        </main>
      </div>

      <footer className="border-t border-[var(--color-border)] py-8 text-center text-sm text-[var(--color-text-faint)]">
        LungScan Research · For research use only. No clinical claims. · <a href="./" className="hover:underline">Back to the presentation</a>
      </footer>
    </div>
  );
}
