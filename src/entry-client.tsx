import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const root = document.getElementById('root')!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// Production HTML is prerendered (scripts/prerender.ts) → hydrate. Dev server serves an empty root → render.
if (root.firstElementChild) hydrateRoot(root, app);
else createRoot(root).render(app);
