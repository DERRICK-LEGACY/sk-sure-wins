self.addEventListener("install", (e) => {
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (e) => {
  // A simple pass-through fetch handler is required by Chrome to trigger the PWA install prompt.
  e.respondWith(
    fetch(e.request).catch(() => {
      // Basic offline fallback
      return new Response("You are currently offline. Please connect to the internet to view SK Sure Wins.", { 
        status: 503,
        headers: { "Content-Type": "text/plain" }
      });
    })
  );
});
