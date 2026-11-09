if ('serviceWorker' in navigator && location.protocol === 'https:') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(new URL('./service-worker.js', document.currentScript.src), { scope: './' }).catch((error) => {
      console.error('Service worker registration failed:', error);
    });
  });
}
