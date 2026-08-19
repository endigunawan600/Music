const CACHE_NAME = 'music-player-v1';

// Daftar semua file yang akan disimpan di cache lokal
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/manifest.json',
  '/audio/lagu1.mp3' // Memastikan file MP3 tersimpan untuk offline
];

// Tahap Install: Memasukkan semua aset ke dalam cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Menyimpan aset ke cache offline...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Tahap Fetch: Mencegat koneksi internet. Jika offline, ambil dari cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse; // Gunakan file dari cache
      }
      return fetch(event.request); // Jika ada koneksi, ambil dari server
    })
  );
});
