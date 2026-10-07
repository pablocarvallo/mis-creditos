/* Permite abrir la app sin conexión.
   Estrategia: primero la red (para recibir siempre la versión más nueva) y, si no responde, la copia guardada. */
const CACHE = 'mis-creditos-v1';
const ARCHIVOS = [
  './',
  'index.html',
  'manifest.webmanifest',
  'icons/apple-touch-icon.png',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'fonts/bricolage-grotesque.woff2',
  'fonts/figtree.woff2',
  'fonts/jetbrains-mono.woff2'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARCHIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function deLaCopia(req) {
  return caches.match(req, { ignoreSearch: true }).then(r => r || (req.mode === 'navigate' ? caches.match('index.html') : undefined));
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(new Promise((resolver, rechazar) => {
    let listo = false;
    const usarCopia = () => deLaCopia(req).then(r => { if (!listo && r) { listo = true; resolver(r); } return r; });
    // si la red tarda más de 3 s, se muestra la copia guardada
    const espera = setTimeout(usarCopia, 3000);
    fetch(req).then(res => {
      clearTimeout(espera);
      if (res && res.ok) { const copia = res.clone(); caches.open(CACHE).then(c => c.put(req, copia)); }
      if (!listo) { listo = true; resolver(res); }
    }).catch(() => {
      clearTimeout(espera);
      usarCopia().then(r => { if (!listo) { listo = true; r ? resolver(r) : rechazar(new TypeError('sin conexión')); } });
    });
  }));
});
