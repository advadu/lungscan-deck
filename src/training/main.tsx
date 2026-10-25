import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../index.css';
import Training from './Training.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Training />
  </StrictMode>,
);
