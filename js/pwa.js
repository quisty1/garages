// Register and periodically check the Service Worker without forced reloads.
function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;

  navigator.serviceWorker
    .register('./sw.js')
    .then((registration) => {
      const checkForUpdate = () => {
        registration.update().catch((error) => {
          console.warn('[MM33] Service Worker update check failed.', error);
        });
      };
      checkForUpdate();

      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          checkForUpdate();
        }
      });
    })
    .catch((error) => {
      console.warn('[MM33] Service Worker registration failed.', error);
    });
}

export { registerServiceWorker };
