import { StrictMode, type ReactNode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';
import { CvPage } from '@/features/cv';

const html = (node: ReactNode) => renderToString(<StrictMode>{node}</StrictMode>);

/** Prerender targets: output HTML file (relative to dist/) → markup. */
export const pages = {
  'index.html': () => html(<App />),
  'cv/index.html': () => html(<CvPage />),
};
