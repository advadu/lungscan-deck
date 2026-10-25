import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

export function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Card({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

export function Stat({
  label,
  value,
  unit,
  note,
}: {
  label: string;
  value: string;
  unit?: string;
  note?: string;
}) {
  return (
    <Card>
      <div className="text-sm text-[var(--color-text-dim)]">{label}</div>
      <div className="mt-1 font-mono text-3xl font-semibold tabular-nums md:text-4xl">
        {value}
        {unit && (
          <span className="ml-1 text-base font-medium text-[var(--color-text-faint)]">
            {unit}
          </span>
        )}
      </div>
      {note && (
        <div className="mt-1 text-sm text-[var(--color-text-faint)]">{note}</div>
      )}
    </Card>
  );
}

const CHIP = {
  good: 'bg-[var(--color-good-tint)] text-[var(--color-good)]',
  warn: 'bg-[var(--color-warn-tint)] text-[var(--color-warn)]',
  info: 'bg-[var(--color-brand-tint)] text-[var(--color-brand)]',
};

export function Chip({
  tone,
  children,
}: {
  tone: keyof typeof CHIP;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ${CHIP[tone]}`}
    >
      {children}
    </span>
  );
}

// A screenshot of the live app, framed as a browser window.
export function Shot({
  src,
  label,
  alt,
  className = '',
}: {
  src: string;
  label: string;
  alt: string;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-lg ${className}`}
    >
      <div className="flex items-center gap-1.5 border-b border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-border-strong)]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-border-strong)]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-border-strong)]" />
        <span className="ml-2 font-mono text-xs text-[var(--color-text-dim)]">
          {label}
        </span>
      </div>
      <img
        src={`${import.meta.env.BASE_URL}screens/${src}`}
        alt={alt}
        className="block h-auto w-full"
      />
    </div>
  );
}

export function Bullets({ items }: { items: ReactNode[] }) {
  return (
    <ul className="space-y-2.5 text-[15px] leading-relaxed md:text-base">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3">
          <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-brand" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function DataTable({
  head,
  rows,
}: {
  head: string[];
  rows: ReactNode[][];
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm">
      <table className="w-full border-collapse text-left text-sm md:text-[15px]">
        <thead>
          <tr className="bg-[var(--color-surface-2)]">
            {head.map((h) => (
              <th
                key={h}
                className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-dim)]"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-[var(--color-border)]">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-2.5 align-top">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
