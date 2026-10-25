import { Cloud, Monitor, Server } from 'lucide-react';
import Section from '../components/Section';
import { Bullets, Card, Reveal, Stat } from '../components/ui';

const LAYERS = [
  { icon: Monitor, title: 'In the browser', items: ['DICOM decoded and packed into compressed volumes. The DICOM files are never stored.', 'Tumor detection and 3D outlining in Web Workers.', 'Scans cached and preloaded, so the next one opens at once.'] },
  { icon: Server, title: 'On the server', items: ["Every write goes through server functions that check the role and the scan's state.", "Outlines re-measured on the stored geometry: the browser's numbers are never stored.", 'Append-only audit log.'] },
  { icon: Cloud, title: 'On Base44', items: ["Entities with row-level rules: measurements can't be written directly.", 'Google sign-in, roles (Admin, Reviewer, Director) and per-page permissions, private file storage.', 'A Base44 agent behind the Assistant; the AI integration explains sign-off flags; a scheduled workflow sends the weekly email.'] },
];

export default function Architecture() {
  return (
    <Section id="architecture" eyebrow="How it's built" title="Base44 for the platform, custom code where it counts">
      <Reveal className="grid gap-4 md:grid-cols-3">
        {LAYERS.map(({ icon: Icon, title, items }) => (
          <Card key={title}>
            <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold">
              <Icon size={18} className="text-[var(--color-brand)]" /> {title}
            </h3>
            <Bullets items={items} />
          </Card>
        ))}
      </Reveal>
      <Reveal delay={0.1} className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat label="Automated tests" value="61" />
        <Stat label="Expert outlines validated" value="59" />
        <Stat label="Live library" value="59" unit="scans" />
        <Stat label="Patients with both scans" value="28" />
      </Reveal>
    </Section>
  );
}
