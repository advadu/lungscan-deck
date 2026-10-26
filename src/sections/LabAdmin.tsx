import Section from '../components/Section';
import { Reveal, Shot } from '../components/ui';

export default function LabAdmin() {
  return (
    <Section id="lab-admin" title="Lab settings">
      <div className="grid items-start gap-6 md:grid-cols-2">
        <Reveal>
          <Shot src="emails.jpg" label="Settings › Emails" alt="Emails: the scheduled weekly summary" />
          <p className="mt-3 text-[15px] text-[var(--color-text-dim)]">
            <b className="text-[var(--color-text)]">The weekly summary Naomi asked for:</b> progress, pairs completed and
            untouched scans, every Sunday at 08:00. Recipients, content and schedule are editable, with a send log.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <Shot src="permissions.jpg" label="Settings › Permissions" alt="Permissions: which pages each role can open" />
          <p className="mt-3 text-[15px] text-[var(--color-text-dim)]">
            <b className="text-[var(--color-text)]">Roles the lab assigns by hand:</b> Reviewers measure and sign off,
            the Director views and exports, the Admin manages the team. Which pages each role opens is a checkbox.
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
