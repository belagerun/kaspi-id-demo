if ('serviceWorker' in navigator && window.isSecureContext) {
  const hadController = Boolean(navigator.serviceWorker.controller);
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (hadController && !refreshing) {
      refreshing = true;
      window.location.reload();
    }
  });

  window.addEventListener('load', () => {
    const scriptUrl = document.currentScript?.src || document.querySelector('script[src*="pwa.js"]').src;
    const workerUrl = new URL('service-worker.js?v=20261110-35', scriptUrl);
    navigator.serviceWorker.register(workerUrl, {
      scope: new URL('./', scriptUrl).pathname,
      updateViaCache: 'none'
    }).then((registration) => registration.update())
      .catch((error) => console.error('Offline support could not be enabled:', error));
  });
}
