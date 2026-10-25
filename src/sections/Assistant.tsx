import Section from '../components/Section';
import { Bullets, Reveal, Shot } from '../components/ui';

export default function Assistant() {
  return (
    <Section id="assistant" eyebrow="New · for the Director" title="Ask the lab's data a question">
      <div className="grid items-start gap-8 md:grid-cols-2">
        <Reveal>
          <Shot src="assistant.jpg" label="Assistant" alt="The Assistant answering how far along the lab is" />
        </Reveal>
        <Reveal delay={0.1}>
          <Bullets
            items={[
              <><b>A Base44 agent</b> with one tool: a read-only function that returns the lab's progress, scans, measurements and per-tumor change as compact tables.</>,
              <><b>Numbers come from the data:</b> change and doubling time are calculated by tested code, not by the model. It says when results aren't signed off yet.</>,
              <><b>Read-only:</b> asked to sign off or export, it points to the right page.</>,
              <><b>No clinical advice:</b> asked whether a tumor is malignant, it says this is a research tool.</>,
              <><b>Director and Admin only.</b> Try: "Which scans were started but not touched for a week?"</>,
            ]}
          />
        </Reveal>
      </div>
    </Section>
  );
}
