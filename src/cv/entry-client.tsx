import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { CvPage } from './CvPage';
import './cv.css';

const root = document.getElementById('root')!;
const app = (
  <StrictMode>
    <CvPage />
  </StrictMode>
);

if (root.firstElementChild) hydrateRoot(root, app);
else createRoot(root).render(app);

// "Download CV" links here with ?print=1 → open the print dialog once fonts are ready
// (printing before webfonts load produces fallback-font PDFs).
if (new URLSearchParams(location.search).has('print')) {
  document.fonts.ready.then(() => setTimeout(() => window.print(), 400));
}
