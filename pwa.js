if ('serviceWorker' in navigator && window.isSecureContext) {
  window.addEventListener('load', () => {
    const scriptUrl = document.currentScript?.src || document.querySelector('script[src*="pwa.js"]').src;
    const workerUrl = new URL('service-worker.js?v=20261110-29', scriptUrl);
    navigator.serviceWorker.register(workerUrl, {
      scope: new URL('./', scriptUrl).pathname,
      updateViaCache: 'none'
    }).then((registration) => registration.update())
      .catch((error) => console.error('Offline support could not be enabled:', error));
  });
}
