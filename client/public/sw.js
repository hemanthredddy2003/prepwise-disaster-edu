const CACHE_NAME = "prepwise-v1";
const OFFLINE_CACHE = "prepwise-offline-v1";
const APP_SHELL = ["/", "/index.html", "/offline.html"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME && k !== OFFLINE_CACHE).map((k) => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== "GET") return;
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(fetch(request).then((response) => { if (response.ok) { const clone = response.clone(); caches.open(OFFLINE_CACHE).then((cache) => cache.put(request, clone)); } return response; }).catch(() => caches.match(request)));
    return;
  }
  event.respondWith(fetch(request).then((response) => { if (response.ok) { const clone = response.clone(); caches.open(CACHE_NAME).then((cache) => cache.put(request, clone)); } return response; }).catch(() => caches.match(request).then((cached) => cached || caches.match("/offline.html"))));
});

self.addEventListener("push", (event) => {
  if (!event.data) return;
  const data = event.data.json();
  event.waitUntil(self.registration.showNotification(data.title || "PrepWise Alert", { body: data.body || "New emergency alert in your area", icon: "/icons/icon-192.png", tag: data.tag || "prepwise-alert", data: { url: data.url || "/" } }));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data?.url || "/"));
});
