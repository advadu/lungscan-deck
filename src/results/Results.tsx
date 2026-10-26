import { Chip, Stat } from '../components/ui';
import { A, Block, DocPage, List, Table } from '../components/doc';
import { code } from '../components/code';

const TOC = [
  { id: 'summary', label: 'Summary' },
  { id: 'method', label: 'How it was tested' },
  { id: 'accuracy', label: 'Measurement accuracy' },
  { id: 'cases', label: 'The 5 test cases' },
  { id: 'detection', label: 'Finding tumors' },
  { id: 'top3', label: 'Top 3 suggestions' },
  { id: 'alignment', label: 'Matching across scans' },
  { id: 'time', label: 'How time saved is measured' },
  { id: 'limits', label: 'Limitations' },
  { id: 'reproduce', label: 'Reproduce it' },
];

const n = (s: string) => <span className="font-mono tabular-nums">{s}</span>;
const ok = <Chip tone="good">OK</Chip>;
const warn = (label: string) => <Chip tone="warn">{label}</Chip>;

export default function Results() {
  return (
    <DocPage
      eyebrow="Results"
      title="What works, what fails, and how time saved is measured"
      lead={<>The app's own outlining and measuring code, run on the public RIDER Lung CT scans and compared with the expert tumor outlines from RIDER-LungCT-Seg. Results from 21 October 2026, default settings. For research use only.</>}
      toc={TOC}
      intro={
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          <Stat label="Median volume error" value="11.5%" note="Expert's own repeat: ~17%" />
          <Stat label="Same-day consistency" value="8.8%" note="Expert: 15.8% (26 pairs)" />
          <Stat label="Expert's tumor in top 3" value="40" unit="/ 59" note="Suggestions shown first" />
          <Stat label="Matching across scans" value="6.8" unit="mm" note="Median; 28 of 28 within 20 mm" />
        </div>
      }
    >
      <Block id="summary" title="Summary">
        <List items={[
          <><b>Works:</b> on solid tumors the tool's volume is as close to the expert's as the expert is to their own repeat reading, and it is more consistent between two same-day scans than the expert.</>,
          <><b>Works:</b> the two scans of a patient are aligned to within a median 6.8 mm, which takes most of the work out of finding the same tumor again.</>,
          <><b>Fails:</b> ground-glass tumors (no clear edge) and tumors touching the mediastinum or chest wall (same density, so the outline leaks). The reviewer corrects them, and the quality check flags large deviations.</>,
          <><b>Time saved:</b> measured in the app, per scan and per tumor, against the lab's manual baseline.</>,
        ]} />
      </Block>

      <Block id="method" title="How it was tested">
        <p>
          {code('validation/score.js')} runs the same outlining code the app uses ({code('src/lib/tumor/')}) on the public scans,
          and decodes DICOM with the app's own decoder, so these results describe what the app runs. The data:{' '}
          <A href="https://www.cancerimagingarchive.net/collection/rider-lung-ct/">RIDER Lung CT</A> and{' '}
          <A href="https://www.cancerimagingarchive.net/analysis-result/rider-lungct-seg/">RIDER-LungCT-Seg</A> (TCIA).
        </p>
        <List items={[
          <>The simulated click is the centre of the expert outline on its largest slice.</>,
          <>Each expert outline is also measured with the app's own code. This reproduces the answer key exactly (0.00% volume, 0.00 mm long axis), so both sides use one set of definitions.</>,
          <><b>Volume:</b> voxels × voxel size. <b>Long axis:</b> the longest in-plane diameter, on the slice where it is longest. <b>Short axis:</b> the longest extent perpendicular to it.</>,
          <>55 scans are scored: 2 patients are excluded because their own test and retest outlines disagree.</>,
        ]} />
      </Block>

      <Block id="accuracy" title="Measurement accuracy">
        <Table head={['Measure', 'Tool vs expert', 'Reference']} rows={[
          ['Median volume error', n('11.5%'), "Expert's own same-day test-retest: about 17%"],
          ['Scans within 17%', n('35 / 55'), ''],
          ['Median long-axis error', n('3.7 mm'), "Expert's test-retest: about 2.3 mm"],
          ['Median overlap (Dice)', n('0.80'), "Dataset's own automatic outline: 0.92"],
          ['Test-retest volume change (26 pairs)', <>Tool {n('8.8%')}</>, <>Expert {n('15.8%')}</>],
          ['Click sensitivity (5 clicks per tumor)', <>Median {n('15%')} spread, worst {n('214%')}</>, ''],
          ['Outline time', <>Median {n('0.17 s')}, max {n('1.7 s')}</>, ''],
          ['Scan load in the browser', <>{n('0.15–0.6 s')} for 189–253 slices</>, 'Target: under 30 s'],
        ]} />
        <p>
          The most important line for the lab's research is consistency: the same tumor scanned twice on the same day should
          measure the same. The tool's volumes change by 8.8% between the two scans; the expert's change by 15.8%.
        </p>
      </Block>

      <Block id="cases" title="The 5 test cases">
        <p>Five proof-of-concept cases that cover the hard tumor types. Volume error against the expert, on the first (TEST) and second (RETEST) scan:</p>
        <Table head={['Case', 'TEST', 'RETEST', '']} rows={[
          ['1 · Solid, isolated', n('−5%'), n('+11%'), ok],
          ['2 · Small', n('+6%'), n('+9%'), ok],
          ['3 · Ground-glass-like', n('−1%'), n('−63%'), warn('Unstable')],
          ['4 · Touching the mediastinum', n('+184%'), n('+276%'), warn('Fails')],
          ['5 · Spiculated', n('+22%'), n('−41%'), warn('Unstable')],
        ]} />
        <List items={[
          <><b>Ground-glass:</b> barely denser than the lung around it, so there is no clear edge; the result depends on where the reader clicks.</>,
          <><b>Touching the mediastinum:</b> the same density as the mediastinum, so the outline leaks. The reviewer trims it with the 3D Erase brush; a reliable fix needs a trained model.</>,        ]} />
      </Block>

      <Block id="detection" title="Finding tumors">
        <p>
          The detector proposes up to 20 places to look per scan, in the browser, with no ML. A hit is a candidate within 3 mm of
          the expert outline.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <Table head={['Expert tumor found in', 'Scans of 59']} rows={[
            ['Top 1', n('13 (22%)')], ['Top 5', n('30 (51%)')], ['Top 10', n('43 (73%)')], ['Top 20', n('50 (85%)')], ['Top 80', n('57 (97%)')],
          ]} />
          <Table head={['By size (top 20)', 'Found']} rows={[
            ['20 mm or more', n('44 / 47 (94%)')], ['Under 20 mm', n('6 / 12 (50%)')],
          ]} />
        </div>
        <p>
          <b>Missed:</b> ground-glass (Case 3), small tumors of 12–15 mm, and a tumor touching the wall. The weak result under 20 mm
          matters most: the lab's early-stage tumors are usually small, and finding them reliably needs a trained detector.
        </p>
      </Block>

      <Block id="top3" title="Top 3 suggestions">
        <p>
          The app shows the 3 most likely tumors first. Each candidate is outlined and scored by its volume, how much of its
          surface touches lung air, and how much of it reaches the chest wall, so large tumors win unless they are the heart,
          mediastinum or wall. The weights were chosen leave-one-patient-out.
        </p>
        <Table head={['', 'Expert tumor found']} rows={[
          ['First in the list', n('24 (41%)')],
          ['In the top 3', <>{n('40 (68%)')}; leave-one-patient-out estimate {n('39')}</>],
          ['In the top 5', n('44')],
        ]} />
        <p>
          For comparison, the detector's own order gets 23 into the top 3, and ranking by volume alone 16. When the tumor is in the
          top 3, its measurements have a median error of 13% in volume and 5.2 mm in long axis.
        </p>
      </Block>

      <Block id="alignment" title="Matching across scans">
        <p>
          On a follow-up, the other scan follows the tumor. The two scans are aligned by the lungs' shape along the body; this test
          maps each first-scan tumor onto the second scan and measures the distance to the expert's tumor there.
        </p>
        <Table head={['', 'Aligned', 'Without alignment']} rows={[
          ['Median distance to the expert tumor', n('6.8 mm'), n('18.8 mm')],
          ['Within 15 mm', n('27 of 28'), ''],
          ['Within 20 mm', n('28 of 28'), ''],
          ['Time per pair', n('under 0.4 s'), ''],
        ]} />
        <p>The match hint therefore looks 20 mm around the mapped point. It is a reading aid: the reader confirms every match.</p>
      </Block>

      <Block id="time" title="How time saved is measured">
        <p>The lab's goal is to cut 25–40 minutes of manual work per scan to about 12–20, without hurting measurement quality. The app measures it as the work happens:</p>
        <List items={[
          <><b>Per scan:</b> the seconds the scan is on screen, from opening to sign-off. Time in another tab doesn't count.</>,
          <><b>Per tumor:</b> the correction time, from the outline appearing to its save, and the number of correction steps, by tumor type.</>,
          <><b>Against a baseline:</b> today the baseline is the lab's own estimate, 32.5 minutes (the middle of 25–40). Daniel's own manual timings will replace it.</>,
        ]} />
        <p>
          The results show on the Dashboard and in the export, by tumor type. Correction time is measured per tumor because tools
          that pre-fill measurements can slow readers down when they have to fix them.
        </p>
      </Block>

      <Block id="limits" title="Limitations">
        <List items={[
          <><b>Tuned on the same scans:</b> the settings were chosen on these 59 outlines, so expect somewhat weaker results on new data.</>,
          <><b>Large tumors:</b> RIDER's tumors are large (median long axis about 30 mm); the lab's are usually smaller.</>,
          <><b>False alarms are unknown:</b> RIDER outlines one tumor per scan, so other suggestions may be real nodules or not.</>,
          <><b>The measurement slice</b> is often 2 or more slices off the expert's, because neighbouring slices have almost the same long axis.</>,
          <><b>The reader stays in control:</b> every outline is reviewed and can be corrected, and the app records whether the tool's proposal was edited.</>,
        ]} />
      </Block>

      <Block id="reproduce" title="Reproduce it">
        <p>
          From the root of the <A href="https://github.com/advadu/lungscan-research">source repository</A> (private: ask for an
          invite), with the RIDER scans and the expert answer key on disk:
        </p>
        <pre className="overflow-x-auto rounded-xl bg-[#14181D] p-4 font-mono text-[13px] leading-relaxed text-[#E6EDF3]">{`export RIDER_ROOT=/path/to/RIDER/scans
export ANSWER_KEY=/path/to/expert_measurements.json
node validation/score.js          # the 5 test cases, test and retest
node validation/score.js --all    # all 59 expert outlines
node validation/detect.js         # finding tumors
node validation/top3.js           # the top 3 suggestions
node validation/align.js          # matching across scans`}</pre>
      </Block>
    </DocPage>
  );
}
