const studentList = "dev-student-list"
const assets = [
    "/",
    "/index.html",
    "/build/bundle.js",
    "/global.css",
    "/build/bundle.css",
    "/android-chrome-192x192.png",
    "/android-chrome-512x512.png",
    "/apple-touch-icon.png",
    "/favicon.png"
]

self.addEventListener("install", installEvent => {
    installEvent.waitUntil(
        caches.open(studentList).then(cache => {
            cache.addAll(assets)
        })
    )
})

self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
        caches.match(fetchEvent.request).then(res => {
            return res || fetch(fetchEvent.request)
        })
    )
})