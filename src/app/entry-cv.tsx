import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { CvPage } from '@/features/cv';
import { track, trackClicks } from '@/shared/lib/analytics';
import '@/features/cv/cv.css';

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
trackClicks();

if (new URLSearchParams(location.search).has('print')) {
  track('cv_print', 'download');
  document.fonts.ready.then(() => setTimeout(() => window.print(), 400));
}
