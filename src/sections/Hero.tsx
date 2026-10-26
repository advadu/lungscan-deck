import { motion } from 'framer-motion';
import Section from '../components/Section';

const META = [
  ['Client', 'Dr. Naomi Hart, Research Director · Dr. Daniel Reyes, Research Fellow'],
  ['Built on', 'Base44 (TanStack Start), custom code and in-browser image processing'],
  ['Data', 'RIDER Lung CT and RIDER-LungCT-Seg (TCIA, public)'],
];

export default function Hero() {
  return (
    <Section id="hero" bgClassName="grid-bg">
      <div className="absolute inset-0 dot-grid opacity-30" />
      <div className="relative flex flex-1 flex-col justify-center">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-bold tracking-tight md:text-7xl"
        >
          LungScan <span className="bg-gradient-brand bg-clip-text text-transparent">Research</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-6 max-w-3xl text-lg text-[var(--color-text-dim)] md:text-2xl"
        >
          A tool that cuts the manual work of finding and measuring lung tumors on CT scans, built with
          and for the Thoracic Oncology Research Lab at Harbor Medical Center.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-12 grid gap-6 text-sm md:grid-cols-3 md:text-base"
        >
          {META.map(([k, v]) => (
            <div key={k}>
              <div className="font-semibold">{k}</div>
              <div className="text-[var(--color-text-dim)]">{v}</div>
            </div>
          ))}
        </motion.div>
        <p className="mt-10 text-sm text-[var(--color-text-faint)]">Adva Dubovi Avni · Forward Deployed Engineer home assignment, part 1 · October 2026 · For research use only. No clinical claims.</p>
      </div>
    </Section>
  );
}
