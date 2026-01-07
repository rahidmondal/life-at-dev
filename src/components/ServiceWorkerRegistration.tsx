'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then(registration => {
            console.info('[SW] Service worker registered:', registration.scope);
          })
          .catch((error: unknown) => {
            console.warn('[SW] Service worker registration failed:', error);
          });
      });
    }
  }, []);

  return null;
}
