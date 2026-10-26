import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { SECTIONS } from '../slides';

type SectionProps = {
  id: string;
  children: ReactNode;
  eyebrow?: string;
  title?: ReactNode;
  subtitle?: ReactNode;
  bgClassName?: string;
};

export default function Section({
  id,
  children,
  eyebrow,
  title,
  subtitle,
  bgClassName = '',
}: SectionProps) {
  // Slides with a title show their number above it, where a label would go.
  const n = SECTIONS.findIndex((x) => x.id === id) + 1;
  if (!eyebrow && title && n > 0) eyebrow = `${n}.`;
  return (
    <section
      id={id}
      className={`relative h-screen w-screen snap-start overflow-hidden ${bgClassName}`}
    >
      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col px-8 py-14 md:px-16 md:py-20">
        {(eyebrow || title || subtitle) && (
          <header className="mb-8 md:mb-12">
            {eyebrow && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.4 }}
                transition={{ duration: 0.5 }}
                className="mb-3 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)]/60 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-[var(--color-text-dim)] backdrop-blur"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-gradient-brand" />
                {eyebrow}
              </motion.div>
            )}
            {title && (
              <motion.h2
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.4 }}
                transition={{ duration: 0.55, delay: 0.05 }}
                className="text-3xl font-bold tracking-tight md:text-5xl"
              >
                {title}
              </motion.h2>
            )}
            {subtitle && (
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.4 }}
                transition={{ duration: 0.55, delay: 0.1 }}
                className="mt-3 max-w-3xl text-base text-[var(--color-text-dim)] md:text-lg"
              >
                {subtitle}
              </motion.p>
            )}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
