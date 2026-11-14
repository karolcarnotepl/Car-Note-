/* ============ SERVICE WORKER — działanie bez internetu ============
   Ten skrypt działa w tle, pomiędzy aplikacją a internetem.
   - Pliki aplikacji: najpierw próbujemy pobrać świeże z internetu i odkładamy
     kopię do schowka (cache). Gdy internetu nie ma — podajemy kopię ze schowka.
   - Czcionki Google: raz pobrane bierzemy ze schowka (rzadko się zmieniają). */

// Nazwa schowka. Zmiana nazwy (np. na v2) usuwa stary schowek przy następnym uruchomieniu.
var CACHE = 'car-note-v1';

// Pliki odkładane do schowka od razu przy instalacji
var PLIKI = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png'
];

// Instalacja: odkładamy pliki do schowka
self.addEventListener('install', function(event){
  event.waitUntil(
    caches.open(CACHE).then(function(cache){ return cache.addAll(PLIKI); })
  );
  self.skipWaiting(); // nowa wersja service workera zaczyna działać od razu
});

// Aktywacja: usuwamy stare schowki (o innej nazwie niż CACHE)
self.addEventListener('activate', function(event){
  event.waitUntil(
    caches.keys().then(function(nazwy){
      return Promise.all(nazwy.filter(function(n){ return n !== CACHE; })
                              .map(function(n){ return caches.delete(n); }));
    }).then(function(){ return self.clients.claim(); })
  );
});

// Każde zapytanie aplikacji o plik przechodzi przez tę funkcję
self.addEventListener('fetch', function(event){
  var req = event.request;
  if(req.method !== 'GET') return; // zapisujemy tylko pobieranie plików

  var url = new URL(req.url);

  // Czcionki Google: najpierw schowek, a jak ich tam nie ma — internet + zapis do schowka
  if(url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com'){
    event.respondWith(
      caches.match(req).then(function(zeSchowka){
        return zeSchowka || fetch(req).then(function(res){
          var kopia = res.clone();
          caches.open(CACHE).then(function(cache){ cache.put(req, kopia); });
          return res;
        });
      })
    );
    return;
  }

  // Inne strony (spoza naszej aplikacji) — nie ruszamy
  if(url.origin !== self.location.origin) return;

  // Pliki aplikacji: najpierw internet, a gdy go nie ma — schowek
  event.respondWith(
    fetch(req).then(function(res){
      if(res.ok){
        var kopia = res.clone();
        caches.open(CACHE).then(function(cache){ cache.put(req, kopia); });
      }
      return res;
    }).catch(function(){
      return caches.match(req).then(function(zeSchowka){
        if(zeSchowka) return zeSchowka;
        // Otwieranie strony bez internetu (np. z ikony na telefonie) — podajemy index.html
        if(req.mode === 'navigate') return caches.match('./index.html');
        return Response.error();
      });
    })
  );
});
