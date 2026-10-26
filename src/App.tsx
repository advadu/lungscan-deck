import { useCallback, useEffect, useRef, useState } from 'react';
import Hero from './sections/Hero';
import References from './sections/References';
import QualityCheck from './sections/QualityCheck';
import Assistant from './sections/Assistant';
import LabAdmin from './sections/LabAdmin';
import Problem from './sections/Problem';
import Discovery from './sections/Discovery';
import Workflow from './sections/Workflow';
import Scanner from './sections/Scanner';
import Compare from './sections/Compare';
import Quality from './sections/Quality';
import Failures from './sections/Failures';
import TimeSaved from './sections/TimeSaved';
import Output from './sections/Output';
import Base44Feedback from './sections/Base44Feedback';
import NextSteps from './sections/NextSteps';
import Closing from './sections/Closing';
import ProgressDots from './components/ProgressDots';

const SECTIONS = [
  { id: 'hero', label: 'Intro' },
  { id: 'references', label: 'Deliverables' },
  { id: 'problem', label: 'The problem' },
  { id: 'discovery', label: 'Discovery' },
  { id: 'workflow', label: 'The workflow' },
  { id: 'scanner', label: 'The scanner' },
  { id: 'compare', label: 'Comparing scans' },
  { id: 'quality-check', label: 'Quality check' },
  { id: 'output', label: 'Output' },
  { id: 'assistant', label: 'Assistant' },
  { id: 'lab-admin', label: 'Lab settings' },
  { id: 'quality', label: 'Quality' },
  { id: 'failures', label: 'What fails' },
  { id: 'time-saved', label: 'Time saved' },
  { id: 'base44-feedback', label: 'Base44 feedback' },
  { id: 'next', label: 'Next steps' },
  { id: 'closing', label: 'Questions' },
];

const NEXT_KEYS = ['ArrowRight', 'ArrowDown', 'PageDown', ' '];
const PREV_KEYS = ['ArrowLeft', 'ArrowUp', 'PageUp'];

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  // Target of the last keyboard/dot jump, so repeated keys don't read a mid-animation scroll position.
  const targetRef = useRef(0);

  const scrollTo = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(SECTIONS.length - 1, index));
    targetRef.current = clamped;
    setActive(clamped);
    document.getElementById(SECTIONS[clamped].id)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let settle: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      clearTimeout(settle);
      settle = setTimeout(() => {
        const mid = container.scrollTop + container.clientHeight / 2;
        let closest = 0;
        let minDist = Infinity;
        SECTIONS.forEach((section, idx) => {
          const el = document.getElementById(section.id);
          if (!el) return;
          const sectionMid = el.offsetTop + el.offsetHeight / 2;
          const dist = Math.abs(mid - sectionMid);
          if (dist < minDist) {
            minDist = dist;
            closest = idx;
          }
        });
        targetRef.current = closest;
        setActive(closest);
      }, 120);
    };

    const onKey = (e: KeyboardEvent) => {
      if (NEXT_KEYS.includes(e.key)) scrollTo(targetRef.current + 1);
      else if (PREV_KEYS.includes(e.key)) scrollTo(targetRef.current - 1);
      else if (e.key === 'Home') scrollTo(0);
      else if (e.key === 'End') scrollTo(SECTIONS.length - 1);
      else return;
      e.preventDefault();
    };

    container.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(settle);
      container.removeEventListener('scroll', onScroll);
      window.removeEventListener('keydown', onKey);
    };
  }, [scrollTo]);

  return (
    <>
      <div
        ref={containerRef}
        className="h-screen snap-y snap-mandatory overflow-y-scroll scroll-smooth"
      >
        <Hero />
        <References />
        <Problem />
        <Discovery />
        <Workflow />
        <Scanner />
        <Compare />
        <QualityCheck />
        <Output />
        <Assistant />
        <LabAdmin />
        <Quality />
        <Failures />
        <TimeSaved />
        <Base44Feedback />
        <NextSteps />
        <Closing />
      </div>
      <ProgressDots
        sections={SECTIONS}
        active={active}
        onSelect={scrollTo}
      />
      <div
        aria-live="polite"
        className="pointer-events-none fixed bottom-5 right-6 z-50 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)]/80 px-3 py-1 font-mono text-xs tabular-nums text-[var(--color-text-dim)] backdrop-blur"
      >
        {active + 1} / {SECTIONS.length}
      </div>
    </>
  );
}
