const dynamicCacheName = "v1-dynamic";
const staticCacheName = "v1-static";

const staticAssets = [
  "/",
  "index.html",
  "styles.css",
  "js/app.js",
  "images/icons/icon-72x72.png",
  "images/icons/icon-96x96.png",
  "images/icons/icon-128x128.png",
  "images/icons/icon-144x144.png",
  "images/icons/icon-152x152.png",
  "images/icons/icon-192x192.png",
  "images/icons/icon-384x384.png",
  "images/icons/icon-512x512.png",
  "images/logo.png",
  "https://fonts.googleapis.com/css?family=Roboto:regular,bold,italic,thin,light,bolditalic,black,medium&amp;lang=en",
  "https://code.getmdl.io/1.3.0/material.grey-pink.min.css",
];

self.addEventListener("install", (e) => {
  console.log("Service Worker: install");
  e.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      console.log("Caching static assets/shell app");
      return cache.addAll(staticAssets);
    })
  );
});

self.addEventListener("activate", (e) => {
  console.log("Service Worker: activate");
  e
    .waitUntil
    // caches.keys().then(function (keyList) {
    //   return Promise.all(
    //     keyList.map(function (key) {
    //       if (key !== staticAssets && key !== dynamicCacheName) {
    //         console.log("[Service Worker] Removing old cache.", key);
    //         return caches.delete(key);
    //       }
    //     })
    //   );
    // })
    ();
  return self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  console.log("Service Worker: fetch");
  e.respondWith(
    caches.match(e.request).then((cacheRes) => {
      return (
        cacheRes ||
        fetch(e.request).then((fetchRes) => {
          return caches.open(dynamicCacheName).then((cache) => {
            // const myRequest = new Request(e.request.url);
            // myRequest.headers.delete('range');
            cache.put(e.request.url, fetchRes.clone());
            return fetchRes;
          });
        })
      );
    })
  );
});
