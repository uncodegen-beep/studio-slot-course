import { setupWorker } from 'msw/browser';

import { createHandlers } from './handlers';

/** Service Worker из public/mockServiceWorker.js перехватывает запросы браузера к /api */
export const worker = setupWorker(...createHandlers());
