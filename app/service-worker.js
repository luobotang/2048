var cacheFiles = [
  '/',
  '/index.html',
  '/jquery-2.1.1.min.js',
  '/app.css',
  '/app.js',
  '/404.html'
];

if (location.protocal === 'https') {
  cacheFiles = cacheFiles.map(function (path) {
    return '/2048/app' + path;
  });
}

this.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('v1').then(function(cache) {
      return cache.addAll(cacheFiles);
    })
  );
});

this.addEventListener('fetch', function(event) {
  var response;
  event.respondWith(caches.match(event.request).catch(function() {
    return fetch(event.request);
  }).then(function(r) {
    response = r;
    caches.open('v1').then(function(cache) {
      cache.put(event.request, response);
    }).catch(function (e) {
      console.error(e);
    });
    return response.clone();
  }).catch(function() {
    return caches.match('/404.html');
  }));
});
