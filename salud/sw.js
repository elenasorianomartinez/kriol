const C="salud-v12";
const FILES=["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png","apple-touch-icon.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(FILES)));self.skipWaiting();});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.startsWith("salud-")&&x!==C).map(x=>caches.delete(x)))));self.clients.claim();});
// La app (HTML) se pide primero a internet para ver siempre la última versión; sin red, la copia guardada.
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET") return;
  const nav=e.request.mode==="navigate"||e.request.url.endsWith("/index.html");
  e.respondWith(caches.open(C).then(c=>{
    const net=fetch(e.request,{cache:"no-cache"}).then(r=>{if(r.ok&&new URL(e.request.url).origin===location.origin)c.put(e.request,r.clone());return r;});
    if(nav) return net.catch(()=>c.match(e.request,{ignoreSearch:true}).then(h=>h||c.match("index.html")));
    return c.match(e.request,{ignoreSearch:true}).then(hit=>hit||net.catch(()=>c.match("index.html")));
  }));
});
