import Section from '../components/Section';
import { Bullets, Card, Chip, Reveal } from '../components/ui';

const PHASES = [
  { when: 'Shipped', title: 'Since the first demo', items: ['Weekly summary email to the Director', 'Assistant for the Director and Admin', 'Quality check before sign-off'] },
  { when: 'Now', title: 'Handover', items: ['Training session with Daniel and Naomi, using the user guide', 'Lab user testing'] },
  { when: 'Next', title: 'Faster follow-ups', items: ['Carry baseline tumors forward: outlines proposed at the matched spot, one click to accept', 'Manual scan assignment when more reviewers join'] },
  { when: 'Later', title: 'Harder tumors', items: ["A trained model for ground-glass and wall-touching tumors, validated on the lab's own outlined cases", 'More than two scans per patient; solid-component measurement'] },
];

export default function NextSteps() {
  return (
    <Section id="next" title="Next steps">
      <Reveal className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {PHASES.map((p) => (
          <Card key={p.when}>
            <Chip tone="info">{p.when}</Chip>
            <h3 className="mb-3 mt-3 text-lg font-semibold">{p.title}</h3>
            <Bullets items={p.items} />
          </Card>
        ))}
      </Reveal>
    </Section>
  );
}
