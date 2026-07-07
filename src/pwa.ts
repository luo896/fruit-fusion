export function registerServiceWorker(): void {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  window.addEventListener("load", () => {
    const serviceWorkerUrl = new URL("sw.js", window.location.href);
    navigator.serviceWorker.register(serviceWorkerUrl).catch((error: unknown) => {
      console.warn("Service worker registration failed.", error);
    });
  });
}
