if ('serviceWorker' in navigator && window.isSecureContext) {
  window.addEventListener('load', () => {
    const scriptUrl = document.currentScript?.src || document.querySelector('script[src*="pwa.js"]').src;
    const workerUrl = new URL('service-worker.js', scriptUrl);
    navigator.serviceWorker.register(workerUrl, { scope: new URL('./', scriptUrl).pathname })
      .catch((error) => console.error('Offline support could not be enabled:', error));
  });
}
