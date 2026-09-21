/* Máy chủ xem thử — phục vụ THẲNG thư mục dự án thật, cổng 8765. */
const http=require('http'), fs=require('fs'), path=require('path'), url=require('url');
const ROOT=require('path').join(__dirname,'..');
const MIME={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8',
  '.css':'text/css; charset=utf-8','.jpg':'image/jpeg','.png':'image/png','.json':'application/json'};
http.createServer((req,res)=>{
  let p=decodeURIComponent(url.parse(req.url).pathname);
  if(p==='/')p='/index.html';
  const f=path.join(ROOT,p);
  if(!path.resolve(f).startsWith(path.resolve(ROOT))){res.writeHead(403);return res.end('no');}
  fs.readFile(f,(e,b)=>{
    if(e){res.writeHead(404);return res.end('404 '+p);}
    res.writeHead(200,{'Content-Type':MIME[path.extname(f).toLowerCase()]||'application/octet-stream',
      'Cache-Control':'no-store'});
    res.end(b);
  });
}).listen(8765,()=>console.log('http://localhost:8765'));
