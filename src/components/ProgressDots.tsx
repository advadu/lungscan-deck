type ProgressDotsProps = {
  sections: { id: string; label: string }[];
  active: number;
  onSelect: (index: number) => void;
};

export default function ProgressDots({
  sections,
  active,
  onSelect,
}: ProgressDotsProps) {
  return (
    <nav
      aria-label="Section navigation"
      className="pointer-events-none fixed right-6 top-1/2 z-50 -translate-y-1/2"
    >
      <ul className="pointer-events-auto flex flex-col gap-3">
        {sections.map((section, idx) => {
          const isActive = idx === active;
          return (
            <li key={section.id}>
              <button
                type="button"
                onClick={() => onSelect(idx)}
                aria-label={`Go to ${section.label}`}
                className="group relative flex h-3 w-3 items-center justify-center"
              >
                <span
                  className={`block h-2 w-2 rounded-full transition-all ${
                    isActive
                      ? 'h-2.5 w-2.5 bg-gradient-brand shadow-[0_0_12px_color-mix(in_oklab,var(--color-brand)_60%,transparent)]'
                      : 'bg-[var(--color-border-strong)] group-hover:bg-[var(--color-text-dim)]'
                  }`}
                />
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
