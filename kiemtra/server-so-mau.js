/* Máy chủ xem thử CÓ SỔ MẪU — cổng 8767.
   Phục vụ thẳng thư mục dự án nên luôn là code mới nhất.
   Cổng riêng => kho dữ liệu trình duyệt tách hẳn khỏi cổng 8765 và khỏi github.io,
   nghịch ở đây không bao giờ đụng vào sổ thật.
   Mở http://localhost:8767/nap một lần để nạp sổ mẫu. */
const http=require('http'), fs=require('fs'), path=require('path'), url=require('url');
const ROOT=path.join(__dirname,'..');
const MIME={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8',
  '.css':'text/css; charset=utf-8','.jpg':'image/jpeg','.png':'image/png','.json':'application/json'};
const {soMau}=require('./so-mau.js');
const LAY=()=>soMau({trong:3});

const TRANG='<!doctype html><meta charset="utf-8"><title>Nap so mau</title>'
+'<meta name="viewport" content="width=device-width,initial-scale=1">'
+'<style>body{font-family:system-ui,sans-serif;max-width:560px;margin:60px auto;padding:0 20px;line-height:1.6}'
+'b{color:#1B8A50}code{background:#eef;padding:2px 6px;border-radius:4px}</style>'
+'<h2>Dang nap so mau...</h2>'
+'<p>Trang nay chi chay o <code>localhost:8767</code>. Kho du lieu trinh duyet tach theo cong, '
+'nen so that cua Vy o cho khac <b>khong he bi dung toi</b>.</p>'
+'<script>'
+'fetch("/so-mau.json").then(r=>r.json()).then(d=>{'
+'localStorage.setItem("sochi:data",JSON.stringify(d));location.href="/";'
+'}).catch(e=>{document.body.innerHTML+="<p style=\\"color:#c00\\">Loi: "+e+"</p>";});'
+'</script>';

  http.createServer((req,res)=>{
    let p=decodeURIComponent(url.parse(req.url).pathname);
    if(p==='/nap'){res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});return res.end(TRANG);}
    if(p==='/so-mau.json'){res.writeHead(200,{'Content-Type':'application/json'});
      return res.end(JSON.stringify(LAY()));}
    if(p==='/')p='/index.html';
    const f=path.join(ROOT,p);
    if(!path.resolve(f).startsWith(path.resolve(ROOT))){res.writeHead(403);return res.end('no');}
    fs.readFile(f,(e,b)=>{
      if(e){res.writeHead(404);return res.end('404 '+p);}
      res.writeHead(200,{'Content-Type':MIME[path.extname(f).toLowerCase()]||'application/octet-stream',
        'Cache-Control':'no-store'});
      res.end(b);
    });
  }).listen(8767,()=>console.log('http://localhost:8767/nap'));
