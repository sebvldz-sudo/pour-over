const CACHE='pourlab-static-v1';
const ASSETS=['./','./index.html','./styles.css','./app.js','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',event=>{
 event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
 event.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))),self.clients.claim()]));
});
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET')return;
 const url=new URL(event.request.url);
 if(url.origin!==location.origin)return;
 event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(res=>{
  if(res.ok){const copy=res.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy)).catch(()=>{});}return res;
 }).catch(()=>event.request.mode==='navigate'?caches.match('./index.html'):Response.error())));
});
