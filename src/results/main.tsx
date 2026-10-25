import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../index.css';
import Results from './Results.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Results />
  </StrictMode>,
);
