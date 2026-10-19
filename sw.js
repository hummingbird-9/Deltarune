const CACHE_NAME = 'deltarune-v1';

const ASSETS_TO_CACHE = [
  'index.html',
  'style.css',
  'logo.png',
  'font.otf',
  'audios/AUDIO_DRONE.ogg',
  'audios/snd_menumove.mp3',
  'audios/snd_select.mp3',
  'icons/1.png',
  'icons/2.png',
  'icons/3.png',
  'icons/4.png',
  'icons/5.png',
  'icons/0.png',
  'chapter1/index.html',
  'chapter2/index.html',
  'chapter3/index.html',
  'chapter4/index.html',
  'chapter5/index.html'
];

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(clients.claim());
});

self.addEventListener('message', e => {
  if (e.data.action === 'DOWNLOAD_ALL') {
    caches.open(CACHE_NAME).then(async cache => {
      let done = 0;
      for (const url of ASSETS_TO_CACHE) {
        try {
          await cache.add(url);
          done++;
          e.source.postMessage({ type: 'STATUS', msg: `Downloading: ${Math.round((done / ASSETS_TO_CACHE.length) * 100)}%` });
        } catch (err) {
          console.error(`Failed to cache asset: ${url}`, err);
        }
      }
      e.source.postMessage({ type: 'STATUS', msg: 'Game Assets Fully Downloaded!' });
      e.source.postMessage({ type: 'DONE' });
    });
  }
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cachedResponse => {
      return cachedResponse || fetch(e.request);
    })
  );
});
