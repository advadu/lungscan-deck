import type { ReactNode } from 'react';

// The lab's acceptance tests, grouped by task. Patients are from the public RIDER set already in the library.
export type Role = 'Reviewer' | 'Director' | 'Admin' | 'Everyone';
export type Case = { id: string; role: Role; title: string; steps: ReactNode[]; expect: ReactNode };

export const GROUPS: { title: string; cases: Case[] }[] = [
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
      { id: 'T13', role: 'Reviewer', title: 'Spiculated tumor', steps: [<>Open <b>RIDER-1760553574</b> and outline its tumor.</>], expect: 'Check whether the spikes are included as you would include them. Note any difference in the notes.' },
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

export const ALL = GROUPS.flatMap((g) => g.cases);
