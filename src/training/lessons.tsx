import type { ReactNode } from 'react';
import type { Role } from './tests';

// One lesson per screen of the app, in the order a new lab member meets them.
export type Lesson = {
  id: string;
  group: string;
  title: string;
  roles: Role[];
  shots?: { src: string; label: string; alt: string }[];
  what: ReactNode;
  how?: ReactNode[];
  tips?: ReactNode[];
};

export const LESSONS: Lesson[] = [
  {
    id: 'sign-in',
    group: 'Getting started',
    title: 'Signing in and your role',
    roles: ['Everyone'],
    shots: [{ src: 'dashboard.jpg', label: 'Dashboard', alt: 'The Dashboard, the first page after sign-in' }],
    what: <>LungScan Research is invite-only. Each person has a lab role that decides which pages they see and what they can change.</>,
    how: [
      <>Open <b>lungscan-research.base44.app</b> and sign in with Google, using the account that was invited.</>,
      <>The <b>Dashboard</b> opens. Your name and role show at the bottom of the sidebar, with the sign-out button.</>,
      <>Close the one-time <b>For research use only</b> notice with the ×. It doesn't come back on this browser.</>,
    ],
    tips: [
      <><b>Reviewer</b> (Daniel): measures tumors and signs off scans. <b>Director</b> (Naomi): follows progress, reads results, exports, gets the weekly summary and the Assistant. <b>Admin</b>: manages the team, permissions and uploads.</>,
      <><b>Collapse</b> at the bottom of the sidebar narrows it to icons, to give the scanner more room.</>,
      <>If you see <b>Access not granted</b>, you signed in with a Google account that wasn't invited.</>,
    ],
  },
  {
    id: 'dashboard',
    group: 'Getting started',
    title: 'Dashboard',
    roles: ['Everyone'],
    shots: [{ src: 'dashboard.jpg', label: 'Dashboard', alt: 'Dashboard: library progress, cards, Up next and sign-offs per day' }],
    what: <>Where the library stands today, and the fastest way into the next piece of work.</>,
    how: [
      <><b>Open next scan</b> (top right) opens the first scan in the Backlog, so you never have to choose what to read next.</>,
      <>The <b>library bar</b> shows how many scans are signed off, in progress and still to do.</>,
      <>The four cards: <b>Signed off</b> (and how many in the last 7 days), <b>In progress</b> (started, not signed off), <b>Backlog</b> (not started; click it to open the Backlog) and <b>Pairs complete</b> (patients whose Baseline and Follow-up are both signed off).</>,
      <><b>Up next</b> lists the next scans in the queue. <b>Signed off per day</b> shows the last 10 working days.</>,
    ],
    tips: [<>Pairs complete is the number that matters for the research: change over time needs both scans of a patient.</>],
  },
  {
    id: 'efficiency',
    group: 'Getting started',
    title: 'Efficiency and time saved',
    roles: ['Director', 'Admin'],
    shots: [{ src: 'dashboard-efficiency.jpg', label: 'Dashboard › Efficiency and time saved', alt: 'Efficiency cards and correction time by tumor type' }],
    what: <>Lower on the Dashboard, for Directors and Admins: how long the work takes with the tool, compared with the lab's manual benchmark of 25–40 minutes per scan.</>,
    how: [
      <><b>Minutes per scan:</b> the time each scan was on screen before sign-off. Time in another tab doesn't count.</>,
      <><b>Hours saved:</b> against 32.5 minutes per scan by hand, the middle of the lab's 25–40.</>,
      <><b>Tool proposals kept:</b> how many tool outlines were accepted without edits.</>,
      <><b>Correction time by tumor type:</b> per tumor, from the outline appearing to its save, with the number of correction steps. It shows where the tool helps and where it doesn't.</>,
    ],
    tips: [<>Expect ground-glass and part-solid tumors to take longer: that's where the outline needs the most correction.</>],
  },
  {
    id: 'backlog',
    group: 'Getting started',
    title: 'Backlog',
    roles: ['Everyone'],
    shots: [{ src: 'backlog.jpg', label: 'Backlog', alt: 'Backlog: every scan not signed off, in priority order' }],
    what: <>Every scan not signed off yet, in the order the lab works through them. The # column is that order.</>,
    how: [
      <>Choose <b>Open in Scanner</b> on any row. Opening a scan further down the list asks first, because others come before it.</>,
      <>Search by patient ID, scan or series; filter by status; sort by priority, last activity or folder.</>,
    ],
    tips: [
      <>The order: <b>1.</b> scans already started, <b>2.</b> follow-ups whose Baseline is signed off (they complete a pair), <b>3.</b> baselines not started, <b>4.</b> follow-ups still waiting for their Baseline. Within each group, the oldest scan first.</>,
      <>After you sign off a Baseline, the app offers that patient's Follow-up next, while the case is fresh.</>,
    ],
  },
  {
    id: 'scanner',
    group: 'Measuring',
    title: 'The scanner',
    roles: ['Reviewer'],
    shots: [{ src: 'scanner-suggestions.jpg', label: 'Scanner', alt: 'Scanner: the image, the toolbar, System suggestions and an empty New tumor card' }],
    what: <>Where a scan is measured. The image is in the middle, the toolbar above it, and the tumor panel on the right.</>,
    how: [
      <><b>Top bar:</b> the patient, Baseline or Follow-up, the series, the scan's status and <b>Sign off scan</b>.</>,
      <><b>Toolbar:</b> Outline, Add and Erase brushes, Pan, Undo, brush size, Grow, Shrink, Clean up, and the outline Sensitivity.</>,
      <><b>Moving around:</b> scroll, or ↑ ↓, to change slices; Page Up / Page Down jump 10; Ctrl/Cmd + scroll zooms. <b>Lung</b> and <b>Mediastinum</b> change the contrast; <b>Fit</b> resets the zoom.</>,
      <><b>Right panel:</b> System suggestions, the New tumor card, and the tumors already saved on this scan.</>,
    ],
    tips: [<>The first time a scan opens, its images download (a few seconds). After that they're kept in the browser, and the next scan in the queue is downloaded in the background.</>],
  },
  {
    id: 'measure',
    group: 'Measuring',
    title: 'Measuring a tumor',
    roles: ['Reviewer'],
    shots: [{ src: 'scanner-draft.jpg', label: 'Scanner', alt: 'A tumor outlined from a suggestion, with its measurements in the New tumor card' }],
    what: <>From a click to a saved measurement. The tool proposes the outline; you check it, correct it and save it.</>,
    how: [
      <><b>Find the tumor:</b> click one of the <b>System suggestions</b> (the 3 most likely tumors of 4 mm or more, with their size and image number), or click a tumor on the image.</>,
      <><b>Check the outline</b> on a few slices. The New tumor card already shows the long axis, short axis, volume and the image where it's longest.</>,
      <><b>Correct it if needed:</b> Erase removes, Add adds (2D on this slice, or 3D across slices), Grow and Shrink move the edge, Clean up drops loose fragments, and Sensitivity outlines it again. Undo reverses a step.</>,
      <><b>Fill in</b> lobe, type (solid, part-solid, ground-glass), match to prior (follow-ups only) and, for part-solid tumors, the solid component. Notes are optional.</>,
      <><b>Save tumor.</b> It stays disabled until the required fields are filled. The server then measures the outline again on the scan's own geometry; those are the numbers that are stored.</>,
    ],
    tips: [
      <>A yellow note warns when the outline touches the wall or mediastinum: check it and trim it with Erase.</>,
      <>Outlines under 4 mm get a warning but can still be saved: you decide.</>,
      <>For a tumor that can't be outlined, <b>Tumor you can't outline › Add tumor</b> lets you type its measurements by hand.</>,
    ],
  },
  {
    id: 'saved',
    group: 'Measuring',
    title: 'Saved tumors and their history',
    roles: ['Reviewer'],
    shots: [{ src: 'scanner.jpg', label: 'Scanner', alt: 'Tumors on this scan, with their measurements and the history button' }],
    what: <>Under <b>Tumors on this scan</b>, every saved tumor (N1, N2…) with its measurements, lobe, type and notes.</>,
    how: [
      <>The eye button shows its outline on the image. The clock button opens its history.</>,
      <>Until the scan is signed off, a saved tumor can be opened and corrected again.</>,
      <>When you change the tool's outline, the card says <b>Tool · edited</b> and shows the tool's original numbers beside yours.</>,
    ],
    tips: [<>The history is append-only: what the tool proposed and every change, with who made it and when. It can't be edited or deleted.</>],
  },
  {
    id: 'unsaved',
    group: 'Measuring',
    title: 'Leaving with unsaved work',
    roles: ['Reviewer'],
    shots: [{ src: 'leave-dialog.jpg', label: 'Scanner', alt: 'This tumor isn\'t saved: Dismiss changes or Save as draft' }],
    what: <>If you leave the scanner with an outline you haven't saved, the app asks what to do with it.</>,
    how: [
      <><b>Save as draft</b> keeps it on the scan, editable until the scan is signed off.</>,
      <><b>Dismiss changes</b> throws it away.</>,
    ],
    tips: [<>Closing the browser tab gets the browser's own "leave site?" warning.</>],
  },
  {
    id: 'quality',
    group: 'Measuring',
    title: 'Quality check before sign-off',
    roles: ['Reviewer'],
    shots: [{ src: 'quality-flags.jpg', label: 'Scanner', alt: 'A warning icon next to a tumor, listing what is missing' }],
    what: <>Before a scan is signed off, the app checks every tumor on it and flags anything that may need another look.</>,
    how: [
      <>A <b>warning icon</b> appears next to a tumor's name as soon as a flag applies. Point at it to see the flags. Red means fix, amber means check.</>,
      <><b>Fix:</b> lobe or type missing; solid component missing on a part-solid tumor; match to prior missing on a follow-up.</>,
      <><b>Check:</b> uncertain match to prior; volume change of 25% or more since the Baseline; long axis under 4 mm; saved volume 30% or more off the tool's.</>,
      <>With flags, <b>Sign off scan</b> opens <b>Before you sign off</b>: the flags by tumor, each with a short explanation. Choose <b>Back to fix it</b> or <b>Sign off anyway</b>.</>,
    ],
    tips: [<>The flags come from fixed rules. The explanations are written by AI from the numbers; if the AI is unavailable, fixed sentences are shown instead.</>],
  },
  {
    id: 'compare',
    group: 'Measuring',
    title: 'Comparing Baseline and Follow-up',
    roles: ['Reviewer'],
    shots: [{ src: 'compare.jpg', label: 'Scanner › Compare', alt: 'A follow-up scan with its Baseline open beside it, both showing the same tumor' }],
    what: <>On a follow-up, the patient's Baseline opens beside it, so you can confirm you're measuring the same tumor.</>,
    how: [
      <>Choose <b>Compare with the Baseline scan</b> in the top bar. If the Baseline is already signed off, it opens there on its own.</>,
      <>With <b>Follow</b> on, the Baseline moves to the matching spot as you move through the follow-up. The scans are aligned by the shape of the lungs.</>,
      <>A tumor measured on both scans shows where it was outlined; anywhere else, a dashed circle marks the approximate spot.</>,
      <>When you outline a tumor on the follow-up, the nearest Baseline tumor (within 20 mm) is preselected as the same tumor. Confirm it or pick another, and set <b>Match to prior</b> to confident or uncertain.</>,
    ],
    tips: [<>Try it on <b>RIDER-1825099523</b>, the first complete pair.</>],
  },
  {
    id: 'measurements',
    group: 'Results',
    title: 'Measurements',
    roles: ['Everyone'],
    shots: [{ src: 'measurements.jpg', label: 'Measurements', alt: 'Measurements: one row per tumor per scan' }],
    what: <>One row per tumor per scan, for every scan: in progress, reviewed and signed off.</>,
    how: [
      <><b>Columns:</b> patient ID, tumor, scan (date, B or F, series), lobe and type, long and short axis and their mean (mm), volume (mm³), and on a follow-up the change from the Baseline and the volume doubling time.</>,
      <><b>Filters:</b> search by patient, tumor or series; filter by status; limit to a date range with From and To.</>,
    ],
    tips: [<>Doubling time is shown only when the tumor grew. It stays empty when the tumor is stable or shrinking, or when both scans are from the same day.</>],
  },
  {
    id: 'export',
    group: 'Results',
    title: 'Exporting to the lab sheet',
    roles: ['Director', 'Admin'],
    shots: [{ src: 'export-dialog.jpg', label: 'Measurements › Export', alt: 'Export: Signed off only, or All' }],
    what: <>A CSV that pastes straight into the lab's spreadsheet.</>,
    how: [
      <>On Measurements, choose <b>Export</b>.</>,
      <>Choose <b>Signed off only</b> for the research sheet, or <b>All</b> to include work in progress. Each button shows how many records it exports.</>,
      <>Open the file. The first 18 columns are the lab sheet's columns, in its order and names. Doubling time and correction details follow.</>,
    ],
  },
  {
    id: 'history',
    group: 'Results',
    title: 'A measurement\'s history',
    roles: ['Everyone'],
    shots: [{ src: 'history.jpg', label: 'Measurements › History', alt: 'History of a measurement: the tool proposal and each change' }],
    what: <>Click any row on Measurements to see where its numbers came from.</>,
    how: [
      <><b>Tool proposal:</b> the slice, axes, volume, lobe and type the tool first proposed.</>,
      <>Below it, every change, with the date, the action and who made it.</>,
    ],
    tips: [<>The record is append-only: entries can't be changed or deleted.</>],
  },
  {
    id: 'data-set',
    group: 'Results',
    title: 'Data Set',
    roles: ['Everyone'],
    shots: [{ src: 'dataset.jpg', label: 'Data Set', alt: 'Data Set: patient folders, with a folder\'s Baseline and Follow-up on the right' }],
    what: <>The patient folders and their scans: 59 series in 31 folders from the public RIDER Lung CT set.</>,
    how: [
      <>Each folder shows its status (Not started, In progress, Complete), its studies and its series as <b>B</b> and <b>F</b> chips, colored by each scan's status.</>,
      <>Search by patient ID or series folder, and filter by one or more statuses.</>,
      <>Click a folder to open its panel: each series with its date, number of files, status and <b>Open in Scanner</b>.</>,
    ],
  },
  {
    id: 'assistant',
    group: 'Results',
    title: 'Assistant',
    roles: ['Director', 'Admin'],
    shots: [{ src: 'assistant.jpg', label: 'Assistant', alt: 'The Assistant answering how far along the lab is' }],
    what: <>Ask questions about the lab's progress and results in plain language. It reads the lab's data and nothing else.</>,
    how: [
      <>Type a question and choose <b>Send</b>. It fetches the current numbers before every answer.</>,
      <>Try: "Which scans were started but not touched for a week?", "Show RIDER-1825099523's tumors and their change between scans", "What was signed off in the last 7 days?"</>,
    ],
    tips: [
      <>It only reads: asked to sign off or export, it points you to the right page.</>,
      <>It never gives clinical advice, and says when results include measurements not signed off yet. It answers in the language you ask in.</>,
    ],
  },
  {
    id: 'team',
    group: 'Running the lab',
    title: 'Team',
    roles: ['Admin'],
    shots: [{ src: 'team.jpg', label: 'Settings › Team', alt: 'Team: invite members and set their lab roles' }],
    what: <>Who can sign in, and what each person does.</>,
    how: [
      <>Invite a member with their name, email and access (<b>Member</b> or <b>Admin</b>), then choose <b>Invite</b>.</>,
      <>After they sign in, set their <b>Lab role</b>: Reviewer, Director or Admin.</>,
    ],
    tips: [<>New members start view-only until they get a role.</>],
  },
  {
    id: 'emails',
    group: 'Running the lab',
    title: 'Weekly summary email',
    roles: ['Director', 'Admin'],
    shots: [
      { src: 'emails.jpg', label: 'Settings › Emails', alt: 'Emails: the scheduled weekly summary' },
      { src: 'email-edit.jpg', label: 'Settings › Emails › Weekly summary', alt: 'Editing the weekly summary: recipients, subject, body and preview' },
    ],
    what: <>Scheduled emails to the lab. One is set up: the weekly summary, every Sunday at 08:00 Israel time.</>,
    how: [
      <>Open <b>Settings › Emails</b> and click the weekly summary.</>,
      <>Turn it on or off, and change its recipients, CC, subject, body and schedule. The preview shows the email as it will look; its log shows past sends.</>,
      <><b>Add new</b> creates another scheduled email.</>,
    ],
    tips: [<>The summary holds lab-level progress: scans signed off this week and in total, complete Baseline/Follow-up pairs, and started scans untouched for 7 days or more, with a link to the tool.</>],
  },
  {
    id: 'permissions',
    group: 'Running the lab',
    title: 'Permissions',
    roles: ['Admin'],
    shots: [{ src: 'permissions.jpg', label: 'Settings › Permissions', alt: 'Permissions: which pages each role can open' }],
    what: <>Which pages each role can open, as a grid of checkboxes.</>,
    how: [<>Tick or untick a page for a role. The change applies right away.</>],
    tips: [<>Team and Permissions are always Admin only.</>],
  },
  {
    id: 'upload',
    group: 'Running the lab',
    title: 'Uploading new scans',
    roles: ['Admin'],
    shots: [{ src: 'dataset.jpg', label: 'Data Set', alt: 'Data Set with the Upload folder button' }],
    what: <>Adding a patient's DICOM folder to the library.</>,
    how: [
      <>On <b>Data Set</b>, choose <b>Upload folder</b> and pick the patient's folder.</>,
      <>The browser reads the files and labels each series Baseline or Follow-up. When the files can't tell, it asks you.</>,
      <>Likely tumors are found during the upload, so the suggestions are ready when the scan is opened.</>,
    ],
    tips: [<>The DICOM files themselves are not stored, only a compressed copy of the image volume.</>],
  },
  {
    id: 'limits',
    group: 'Running the lab',
    title: 'Known limits',
    roles: ['Everyone'],
    what: <>Where the tool needs the reviewer most. These are expected, and the acceptance tests include them.</>,
    how: [
      <><b>Ground-glass tumors</b> have no clear edge, so the outline depends on where you click. Check it carefully (RIDER-2541949645).</>,
      <><b>Tumors touching the mediastinum or chest wall</b> can leak: trim with the 3D Erase brush (RIDER-2073083717).</>,
      <><b>Suggestions can miss</b> small and ground-glass tumors: always read the whole scan.</>,
    ],
    tips: [<>For research use only. The tool makes no clinical claims, and every number is reviewed by a person before it's signed off.</>],
  },
];
