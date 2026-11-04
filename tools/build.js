// Zostaví zverejniteľnú aplikáciu z src/app.html do koreňa projektu (index.html, manifest, sw.js).
// Spustenie: node tools/build.js   (bez ďalších závislostí)
process.env.TZ=process.env.TZ||'Europe/Bratislava';
const fs=require('fs'), path=require('path');
const root=path.join(__dirname,'..');
const pkg={name:'EduMind',short:'EduMind',version:process.argv[2]||String(Date.now())};
const src=fs.readFileSync(path.join(root,'src/app.html'),'utf8');
const i=src.indexOf('<div class="page">');
if(i<0) throw new Error('V src/app.html chýba <div class="page">');
const head='<!doctype html>\n<html lang="sk">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
 +'<meta name="robots" content="noindex, nofollow">\n<meta name="theme-color" content="#7C4DFF">\n<meta name="mobile-web-app-capable" content="yes">\n'
 +'<meta name="apple-mobile-web-app-capable" content="yes">\n<meta name="apple-mobile-web-app-title" content="'+pkg.short+'">\n'
 +'<link rel="manifest" href="manifest.webmanifest">\n<link rel="icon" href="icons/icon-192.png">\n<link rel="apple-touch-icon" href="icons/icon-180.png">\n'
 +'<style>:root{padding:env(safe-area-inset-top,0px) 0 env(safe-area-inset-bottom,0px)}body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>\n';
const d=new Date(+pkg.version||Date.now()), verLabel=d.getDate()+'. '+(d.getMonth()+1)+'. '+d.getFullYear()+' '+String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');
const reg='\n<script>window.EDU_VER='+JSON.stringify(verLabel)+';if("serviceWorker" in navigator){window.addEventListener("load",function(){navigator.serviceWorker.register("sw.js").catch(function(){});});}</script>\n';
fs.writeFileSync(path.join(root,'index.html'),head+src.slice(0,i)+'</head>\n<body>\n'+src.slice(i)+reg+'</body>\n</html>\n');
fs.writeFileSync(path.join(root,'manifest.webmanifest'),JSON.stringify({name:pkg.name,short_name:pkg.short,lang:'sk',start_url:'./',scope:'./',display:'standalone',
  background_color:'#F1F4FF',theme_color:'#7C4DFF',icons:[{src:'icons/icon-192.png',sizes:'192x192',type:'image/png',purpose:'any maskable'},
  {src:'icons/icon-512.png',sizes:'512x512',type:'image/png',purpose:'any maskable'}]},null,1)+'\n');
fs.writeFileSync(path.join(root,'sw.js'),`// Generované nástrojom tools/build.js – neupravovať ručne.
const C='edumind-${pkg.version}';
const SHELL=['./','index.html','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png','icons/icon-180.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const r=e.request; if(r.method!=='GET') return;
  const u=new URL(r.url);
  if(u.origin===location.origin){
    // najprv internet (nová verzia hneď), bez internetu uložená kópia
    e.respondWith(fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp));}return res;})
      .catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||caches.match('index.html'))));
  }else if(/fonts\\.(googleapis|gstatic)\\.com$/.test(u.hostname)){
    e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put(r,cp));return res;})));
  }
});
`);
console.log('Hotovo: index.html, manifest.webmanifest, sw.js (verzia '+pkg.version+')');
