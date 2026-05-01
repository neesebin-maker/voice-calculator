const CACHE = 'vc-v2'

// Cache all assets on first load
self.addEventListener('install', (e) => {
  self.skipWaiting()
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  )
})

// Cache-first with network fallback — auto-caches everything the user visits
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cached) => {
      // Also fetch from network to update cache (if online)
      const fetched = fetch(e.request).then((response) => {
        if (response.ok) {
          const clone = response.clone()
          caches.open(CACHE).then((c) => c.put(e.request, clone))
        }
        return response
      }).catch(() => null)
      return cached || fetched
    })
  )
})
