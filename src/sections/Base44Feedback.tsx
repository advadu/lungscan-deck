import Section from '../components/Section';
import { DataTable, Reveal } from '../components/ui';

const c = (s: string) => <code className="rounded bg-[var(--color-surface-2)] px-1 font-mono text-[13px]">{s}</code>;

export default function Base44Feedback() {
  return (
    <Section id="base44-feedback" title="Base44 feedback">
      <Reveal>
        <DataTable
          head={['Found', 'Impact', 'Suggestion']}
          rows={[
            [<>{c('base44 deploy')} fails for TanStack Start apps: "Missing index.html at root of archive"</>, 'CLI deploy unusable; publishing only from the builder', 'Support the server build output, or say so in the CLI'],
            ["Builder doesn't pick up new GitHub commits until synced by hand", 'A publish shipped old code twice', 'Show the commit being published; warn when GitHub is ahead'],
            [<>{c('base44 exec')} needs Deno and a reachable npm registry</>, 'Blocked on a corporate network until VPN', "Bundle the SDK, or fall back to the project's node_modules"],
            ['App MCP hidden by workspace Governance, with no hint in the dashboard', 'Looked like a missing feature', 'Show the item disabled, with who can turn it on'],
            ['Local backend wipes all data on any entity change; no transactions or bulk update', 'Re-seeding during development; manual consistency checks', 'Keep data across schema changes; add transactions'],
            [<>{c('base44 agents push')} replaces every agent on the app with the local files</>, 'An agent made in the editor is deleted unless pulled first', 'Push one agent at a time, or warn before deleting'],
          ]}
        />
      </Reveal>
    </Section>
  );
}
