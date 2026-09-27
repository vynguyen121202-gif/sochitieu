/* BAN PHAC THAO — cong 8791.
   App THAT, nhung app.js va style.css duoc va TRONG BO NHO. Thu muc du an KHONG bi sua.
   So that nhung san vao localStorage cua cong 8791.
     8790/tq = ban hien nay   ·   8791/ = ban phac thao
   Cac diem da ap dung: (2) moi so co mau so · (3) mot dinh dang so · (4) mot so chinh
   moi man · (6) nut xo khong ve lai ca trang. */
const http = require('http'), fs = require('fs'), path = require('path'), url = require('url');
const ROOT = path.join(__dirname, '..');
const SO = path.join(ROOT, 'so-chi-tieu-2026-09-26-1_1.json');
const PORT = 8791;

/* ══════════ CSS cho nut xo — tien to .xo- de khong dung ten co san ══════════ */
const CSS_XO = `
/* ===== nut xo (ban phac thao) ===== */
.xo{border-top:1px solid var(--line-2)}
.xo-bt{width:100%;display:flex;align-items:center;gap:12px;padding:13px 14px;min-height:56px;
  text-align:left;background:none;border:0;transition:background .16s ease}
.xo-bt:active{background:var(--rowb)}
.xo-ch{flex:0 0 16px;width:16px;height:16px;display:grid;place-items:center;color:var(--ink-3);
  transition:transform .3s cubic-bezier(.2,.8,.2,1),color .18s ease}
.xo[data-open="1"] .xo-ch{transform:rotate(90deg);color:var(--tinttx)}
.xo-mid{flex:1;min-width:0}
.xo-t{font-size:14px;font-weight:600;letter-spacing:-.005em;display:block}
.xo-c{font-size:11.5px;color:var(--ink-3);margin-top:2px;line-height:1.35;display:block}
.xo-v{font-size:16px;font-weight:700;letter-spacing:-.02em;white-space:nowrap;text-align:right}
.xo-v small{display:block;font-size:11px;font-weight:600;letter-spacing:0;margin-top:1px}
.xo-bd{height:0;overflow:hidden;contain:layout paint;backface-visibility:hidden}
.xo[data-open="1"]>.xo-bd{height:auto}
.xo-in{padding:0 14px 11px}
.xo-nest{border-left:2px solid var(--tintbd);padding-left:13px;margin-left:1px;
  opacity:0;transform:translateY(-8px);
  transition:opacity .22s ease,transform .3s cubic-bezier(.2,.8,.2,1)}
.xo[data-open="1"] .xo-nest{opacity:1;transform:none}
.xo-sub{display:flex;justify-content:space-between;align-items:baseline;gap:11px;padding:8px 0}
.xo-sub+.xo-sub{border-top:1px solid var(--line-2)}
.xo-sub .l{font-size:13px;min-width:0}
.xo-sub .c{font-size:11px;color:var(--ink-3);margin-top:1px;line-height:1.35}
.xo-sub .n{font-size:13px;font-weight:600;white-space:nowrap}
.xo-sub.tt{border-top:1px solid var(--line);margin-top:2px;padding-top:9px}
.xo-sub.tt .l{font-weight:700;font-size:11.5px;letter-spacing:.03em;text-transform:uppercase;color:var(--ink-2)}
.xo-sub.tt .n{font-size:14.5px;font-weight:700}
.xo-sub.gap{border-top:0;margin-top:6px}
.xo-mau{font-weight:500;color:var(--ink-3)}
/* ===== hai so ke nhau khi co khoan thu du kien ve ===== */
.hai{display:flex;align-items:flex-start;gap:8px;margin:5px 0 3px}
.hai .mot{flex:1;min-width:0}
.hai .so{font-size:22px;font-weight:700;letter-spacing:-.025em;line-height:1.15}
.hai .nhan{font-size:10.5px;color:var(--ink-3);margin-top:3px;line-height:1.3}
.hai .mui{flex:0 0 auto;color:var(--ink-3);font-size:15px;font-weight:700;padding-top:4px}
.so1{font-size:26px;font-weight:700;letter-spacing:-.025em;margin:2px 0;line-height:1.15}
/* ===== vo boc cho MOI khoi xo xuong cua app =====
   contain: gioi han pham vi tinh lai bo cuc trong vo, nen moi khung hinh trinh
   duyet khong phai do lai ca trang — day la thu lam no muot tren dien thoai. */
/* Noi dung LUC NAO CUNG duoc dung san, dong thi cao 0. Nho vay luc bam khong
   phai ve lai trang — do moi la nguyen nhan that su lam chuyen dong giat. */
.xow{overflow:hidden;contain:layout paint;backface-visibility:hidden}
html.xo-chay .tm,html.xo-chay .panel,html.xo-chay .detail{contain:layout}
.xow[data-open="0"]{height:0;content-visibility:hidden}
.xow.chay[data-open="0"]{content-visibility:visible}
.xow[data-open="1"]{height:auto}
.xow>*{transition:opacity .22s ease,transform .3s cubic-bezier(.2,.8,.2,1)}
.xow.an>*{opacity:0;transform:translateY(-8px)}
.xow.chay{pointer-events:none}
.xow.chay>*{will-change:transform,opacity;transform:translateZ(0)}
.xow.an.chay>*{transform:translate3d(0,-8px,0)}
/* ===== THU PHAM THAT SU CUA GIAT =====
   style.css bat backdrop-filter:blur(12px) cho .panel .fold .strip nav ... o man toi.
   Moi khung hinh bo cuc xe dich, MOI o mo do phai lay mau lai ca anh nen phia sau
   roi lam mo lai — tren dien thoai la vai chuc lan mo anh moi giay. Tat trong luc
   chay, bat lai khi xong. Mat mo nen 300ms, doi lay chuyen dong khong rot khung. */
html.xo-chay :is(.panel,.kpi,.gtile,.fold,.strip,.empty,.days,.days-x,.alerts,.chip,
  .arrow,.gear,.btn.ghost,.btn.danger,.warn,.err,.ok,nav){
  backdrop-filter:none!important;-webkit-backdrop-filter:none!important}
/* ===== tieu de hai muc trong danh sach no =====
   KHONG dung .daygroup dg-sub: luat .daygroup[class*="dg-"] manh hon nen no keo
   nen xanh dac vao, chu do/xanh la dat tren do bi chim hoan toan. */
.nohd{display:flex;align-items:center;gap:8px;padding:9px 14px;
  font-size:11px;font-weight:800;letter-spacing:.05em;
  background:var(--row);border-bottom:1px solid var(--line-2)}
.nohd i{width:3px;height:13px;border-radius:2px;display:block;flex:none}
.nohd.ra{color:var(--brick)} .nohd.ra i{background:var(--brick)}
.nohd.vao{color:var(--pos)} .nohd.vao i{background:var(--pos)}
/* Bo goc noi lien nut bam voi khoi dang mo — truoc lam bang style noi tuyen,
   gio khong ve lai trang nua nen de CSS tu quyet theo trang thai cua vo. */
.strip:has(+.xow[data-open="1"]),
.fold:has(+.xow[data-open="1"]),
.panel:has(+.xow[data-open="1"]){border-radius:var(--r) var(--r) 0 0}
/* ===== khoi No: hai ben, hai mau, hai chieu mui ten ===== */
.nohai{display:flex;gap:10px;margin-top:0}
.nomot{flex:1;min-width:0;background:var(--card);border-radius:var(--r);
  box-shadow:var(--shadow);padding:12px 13px;border-left:3px solid transparent}
.nomot.ra{border-left-color:var(--brick)}
.nomot.vao{border-left-color:var(--pos)}
.nonhan{font-size:9.5px;font-weight:700;letter-spacing:.04em;line-height:1.3}
.nomot.ra .nonhan{color:var(--brick)}
.nomot.vao .nonhan{color:var(--pos)}
.noso{font-size:19px;font-weight:700;letter-spacing:-.02em;margin-top:5px;line-height:1.15}
.nomot.ra .noso{color:var(--brick)}
.nomot.vao .noso{color:var(--pos)}
.noph{font-size:10.5px;color:var(--ink-3);margin-top:3px;line-height:1.3}
@media (prefers-reduced-motion:reduce){
  .xo-bd,.xo-ch,.xo-nest,.xow,.xow>*{transition-duration:.01ms!important}}
`;

/* ══════════ 1. cac ham moi ══════════ */
const HAM = [
'/* ---------- thanh khoan kha dung ---------- */',
'function thanhKhoan(d){',
'  d=d||cursor;',
'  const mk="tk2"+ym(d); if(mk in _memo)return _memo[mk];',
'  const b=balances(), tien=(b.bidv||0)+(b.vi||0)+(b.tm||0);',
'  const pp=payPeriods(d), mt=metrics(d);',
'  const luongChuaVe=Math.max(0,pp.duKien-mt.thu);',
'  const dd=debtDue(d), noConPhai=dd.rows.reduce((s,r)=>s+r.conPhai,0);',
'  const gids={}; fixedItems().forEach(it=>{gids[groupOf(it.code).id]=1;});',
'  let cdLeft=0; Object.keys(gids).forEach(g=>{cdLeft+=fixedOfGroup(g,d).left;});',
'  const k=ym(d); let henTong=0, henNgay="", henCuoi="", henSo=0, treo=[];',
'  (DB.debts||[]).forEach(x=>{',
'    if(x.kind!=="cho")return;',
'    const i=debtInfo(x); if(i.left<=0)return;',
'    if(x.due&&x.due.slice(0,7)===k){henTong+=i.left; henSo++; if(!henNgay||x.due<henNgay)henNgay=x.due; if(!henCuoi||x.due>henCuoi)henCuoi=x.due;}',
'    else treo.push({n:x.name,a:i.left});',
'  });',
'  const A0=tien+luongChuaVe-noConPhai-cdLeft, A1=A0+henTong;',
'  const B=Math.max(0,bud("tk",d)-spentOf("tk",d))+goalMonthly();',
'  return _memo[mk]={tien,luongChuaVe,noConPhai,cdLeft,henTong,henNgay,henCuoi,henSo,treo,A0,A1,B,',
'    tuDo:Math.max(0,A1-B), lan:Math.max(0,B-A1)};',
'}',
'/* So du cuoi thang cua d — dung cho thang da dong so. Khong lay balances()',
'   vi balances() la so du HIEN TAI, thang sau co giao dich la sai ngay. */',
'function balAt(d){',
'  const k=ym(d), mk="ba"+k; if(mk in _memo)return _memo[mk];',
'  const b={bidv:+DB.opens.bidv||0, vi:+DB.opens.vi||0, tm:+DB.opens.tm||0};',
'  DB.txns.forEach(t=>{',
'    if((t.d||"").slice(0,7)>k)return;',
'    const s2=t.s||"bidv";',
'    if(t.t==="mv"){b[s2]=(b[s2]||0)-t.a; const to=t.s2||"tm"; b[to]=(b[to]||0)+t.a;}',
'    else if(t.t==="dc"){b[s2]=(b[s2]||0)+(t.dir==="-"?-t.a:t.a);}',
'    else b[s2]=(b[s2]||0)+(t.t==="thu"?t.a:-t.a);',
'  });',
'  return _memo[mk]=(b.bidv||0)+(b.vi||0)+(b.tm||0);',
'}',
'/* ---------- moi dong tien that vao / ra, cong ve dung so du ---------- */',
'function bangTien(d){',
'  d=d||cursor;',
'  const mk="bt"+ym(d); if(mk in _memo)return _memo[mk];',
'  const list=monthTx(d);',
'  const gs=id=>sum(list.filter(x=>x.t==="thu"&&groupOf(x.c).id===id));',
'  const tien=balAt(d);',
'  let bien=0;',
'  list.forEach(t=>{ if(t.t==="mv")return;',
'    else if(t.t==="dc")bien+=(t.dir==="-"?-t.a:t.a);',
'    else bien+=(t.t==="thu"?t.a:-t.a); });',
'  const dauThang=tien-bien;',
'  const dc=list.filter(t=>t.t==="dc").reduce((s,t)=>s+(t.dir==="-"?-t.a:t.a),0);',
'  const pp=payPeriods(d), vao=[];',
'  const luong=gs("luong"), thuong=gs("thuong"), tkhac=gs("tkhac");',
'  let ke=0;',
'  (pp.ky||[]).forEach(k=>{ if(k.nhan){vao.push({n:"Lương kỳ "+k.i,a:k.nhan,s:"đã nhận"});ke+=k.nhan;} });',
'  if(luong>ke)vao.push({n:"Lương khác",a:luong-ke,s:""});',
'  if(thuong)vao.push({n:"Thưởng",a:thuong,s:""});',
'  if(tkhac)vao.push({n:"Thu khác",a:tkhac,',
'    s:list.filter(x=>x.t==="thu"&&groupOf(x.c).id==="tkhac").map(x=>esc(x.n)).slice(0,3).join(" · ")});',
'  const thuno=gs("thuno"), divay=gs("divay");',
'  if(thuno)vao.push({n:"Thu nợ đã về",a:thuno,s:"tiền cho mượn quay lại — không phải thu nhập mới"});',
'  if(divay)vao.push({n:"Đi vay",a:divay,s:"tiền của người khác, phải trả lại"});',
'  if(dc)vao.push({n:"Điều chỉnh số dư",a:dc,s:"sửa sổ cho khớp sao kê — không phải tiền mới"});',
'  /* Thu nhap = luong (du kien neu chua ve / thuc te neu da ve) + thuong + thu khac */',
'  const thuNhap=Math.max(luong+thuong+tkhac,pp.duKien);',
'  const tongVao=vao.reduce((s,x)=>s+x.a,0);',
'  const pa=pace(d), gids={};',
'  fixedItems().forEach(it=>{gids[groupOf(it.code).id]=1;});',
'  let cdThat=0;',
'  Object.keys(gids).forEach(g=>{const fo=fixedOfGroup(g,d);cdThat+=Math.min(fo.plan,fo.chi);});',
'  const ra=[];',
'  if(pa.daChi)ra.push({n:"Chi linh hoạt",a:pa.daChi,s:"phần trừ vào ngân sách khả dụng"});',
'  if(cdThat)ra.push({n:"Chi phí cố định",a:cdThat,s:fixedItems().map(i=>esc(i.name)).join(" · ")});',
'  const muon=spentOf("muon",d), trano=spentOf("trano",d), tk=spentOf("tk",d);',
'  if(muon)ra.push({n:"Cho mượn",a:muon,s:"tiền ra khỏi túi, sẽ thu lại — không phải tiêu dùng"});',
'  if(trano)ra.push({n:"Trả nợ",a:trano,s:"nghĩa vụ đã trả trong tháng — không phải tiêu dùng"});',
'  if(tk)ra.push({n:"Chuyển vào tiết kiệm",a:tk,s:"đổi chỗ để tiền, không phải tiêu mất"});',
'  const tongRa=ra.reduce((s,x)=>s+x.a,0);',
'  return _memo[mk]={dauThang,vao,tongVao,ra,tongRa,thuNhap,tien,',
'    tieuThat:pa.daChi+cdThat, muonNo:muon+trano, cuoi:dauThang+tongVao-tongRa};',
'}',
'/* ---------- nut xo: doi cach xem thi KHONG ve lai ca trang (diem 6) ----------',
'   Trang thai giu trong XO nen lan ve lai sau (doi thang, ghi giao dich) cac khoi',
'   tro ve dung cho Vy dang mo. */',
'var XO={};',
'/* Bon nut xo moi dung CHUNG duong cong va cach tinh thoi luong voi toggle(). */',
'function xoTog(bt){',
'  var box=bt.parentNode, bd=box.querySelector(".xo-bd"), k=box.getAttribute("data-k");',
'  var mo=box.getAttribute("data-open")==="1";',
'  var h=mo?bd.scrollHeight:0, xong=false;',
'  xoBat();',
'  if(mo){',
'    var d=Math.round(XODUR(h)*0.82);',
'    bd.style.willChange="height";',
'    bd.style.transition="none"; bd.style.height=h+"px";',
'    bd.getBoundingClientRect();',
'    box.setAttribute("data-open","0"); bt.setAttribute("aria-expanded","false"); XO[k]=0;',
'    bd.style.transition="height "+d+"ms "+XOVAO;',
'    bd.style.height="0px";',
'    var h1=function(){ if(xong)return; xong=true;',
'      bd.removeEventListener("transitionend",t1); xoTat();',
'      bd.style.transition=""; bd.style.willChange=""; };',
'    var t1=function(e){ if(e.propertyName==="height")h1(); };',
'    bd.addEventListener("transitionend",t1); setTimeout(h1,d+140);',
'  }else{',
'    box.setAttribute("data-open","1"); bt.setAttribute("aria-expanded","true"); XO[k]=1;',
'    bd.style.transition="none"; bd.style.height="auto";',
'    var hh=bd.scrollHeight, du=XODUR(hh);',
'    bd.style.height="0px"; bd.style.willChange="height";',
'    bd.getBoundingClientRect();',
'    bd.style.transition="height "+du+"ms "+XORA;',
'    bd.style.height=hh+"px";',
'    var h2=function(){ if(xong)return; xong=true;',
'      bd.removeEventListener("transitionend",t2); xoTat();',
'      bd.style.height="auto"; bd.style.transition=""; bd.style.willChange=""; };',
'    var t2=function(e){ if(e.propertyName==="height")h2(); };',
'    bd.addEventListener("transitionend",t2); setTimeout(h2,du+140);',
'  }',
'}',
'const XOCH=\'<span class="xo-ch"><svg width="9" height="13" viewBox="0 0 10 14" fill="none">\'',
'  +\'<path d="M2 1.5 L8 7 L2 12.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>\';',
'function xoBox(k,t,c,v,vc,vs,inner){',
'  var op=XO[k]?1:0;',
'  return \'<div class="xo" data-k="\'+k+\'" data-open="\'+op+\'">\'',
'    +\'<button class="xo-bt" onclick="xoTog(this)" aria-expanded="\'+(op?"true":"false")+\'">\'+XOCH',
'    +\'<span class="xo-mid"><span class="xo-t">\'+t+\'</span>\'',
'      +(c?\'<span class="xo-c">\'+c+\'</span>\':\'\')+\'</span>\'',
'    +\'<span class="xo-v \'+(vc||"")+\'">\'+v',
'      +(vs?\'<small class="\'+(vs[1]||"")+\'">\'+vs[0]+\'</small>\':\'\')+\'</span></button>\'',
'    +\'<div class="xo-bd"><div class="xo-in"><div class="xo-nest">\'+inner+\'</div></div></div></div>\';',
'}',
'function xoSub(l,c,v,vc){return \'<div class="xo-sub"><div class="l">\'+l',
'  +(c?\'<div class="c">\'+c+\'</div>\':\'\')+\'</div><div class="n \'+(vc||"")+\'">\'+v+\'</div></div>\';}',
'function xoTt(l,v,vc){return \'<div class="xo-sub tt"><div class="l">\'+l',
'  +\'</div><div class="n \'+(vc||"")+\'">\'+v+\'</div></div>\';}',
'const xoTS=(a,b2)=>money(a)+\' <span class="xo-mau">/ \'+money(b2)+\'</span>\';',
'/* ---------- khoi dau cua Tong ket thang da dong so ----------',
'   Dung dung cau truc nhu khoi Tong quan thang: so du dau -> Thuc thu -> Thuc chi',
'   -> so du cuoi thang. So cuoi lay balAt() nen dung ca khi thang sau da co giao dich. */',
'function khoiTongKet(){',
'  var t=bangTien(cursor), thang=MONTH(cursor.getMonth()).toLowerCase();',
'  var x=\'<div class="panel">\';',
'  x+=LN("Số dư đầu "+thang,t.dauThang,"tiền còn lại từ tháng trước mang sang");',
'  x+=xoBox("tkvao","Thực thu","trong đó Thu nhập "+money(t.thuNhap),',
'    money(t.tongVao),"",null,',
'    t.vao.map(function(v){return xoSub(v.n,v.s,money(v.a));}).join("")',
'    +xoTt("Tổng tiền đã vào",money(t.tongVao)));',
'  x+=xoBox("tkra","Thực chi","trong đó cho mượn và trả nợ "+money(t.muonNo),',
'    money(t.tongRa),"",null,',
'    t.ra.map(function(v){return xoSub(v.n,v.s,money(v.a));}).join("")',
'    +xoTt("Tổng tiền đã ra",money(t.tongRa)));',
'  x+=\'<div class="src total"><div><div class="src-n">Số dư cuối \'+thang+\'</div>\'',
'    +\'<div class="src-m">\'+money(t.dauThang)+\' + \'+money(t.tongVao)+\' − \'+money(t.tongRa)+\'</div></div>\'',
'    +\'<div class="src-a" style="color:\'+(t.cuoi<0?"var(--brick)":"var(--pos)")+\'">\'',
'    +money(t.cuoi)+\'</div></div>\';',
'  return x+\'</div>\';',
'}',
'/* ---------- ban giai thich moi ---------- */',
'function paceWhy2(pa){',
'  var t=bangTien(cursor), q=thanhKhoan(cursor);',
'  var dm=s=>s?s.slice(8,10)+"/"+s.slice(5,7):"";',
'  var x=\'<div class="panel" style="border-radius:0 0 var(--r) var(--r);border-top:0">\';',
'  /* --- 1. tong quan thang nay --- */',
'  x+=\'<div class="daygroup dg-neu">TỔNG QUAN THÁNG NÀY</div>\';',
'  x+=LN("Số dư đầu "+MONTH(cursor.getMonth()).toLowerCase(),t.dauThang,',
'    "tiền còn lại từ tháng trước mang sang");',
'  x+=xoBox("vao","Thực thu","trong đó Thu nhập "+money(t.thuNhap),',
'    money(t.tongVao),"",null,',
'    t.vao.map(v=>xoSub(v.n,v.s,money(v.a))).join("")',
'    +xoTt("Tổng tiền đã vào",money(t.tongVao)));',
'  x+=xoBox("ra","Thực chi","trong đó cho mượn và trả nợ "+money(t.muonNo),',
'    money(t.tongRa),"",null,',
'    t.ra.map(v=>xoSub(v.n,v.s,money(v.a))).join("")',
'    +xoTt("Tổng tiền đã ra",money(t.tongRa)));',
'  x+=\'<div class="src total"><div><div class="src-n">SỐ DƯ HIỆN TẠI</div>\'',
'    +\'<div class="src-m">\'+money(t.dauThang)+\' + \'+money(t.tongVao)+\' − \'+money(t.tongRa)',
'    +(Math.round(t.cuoi)===Math.round(t.tien)?" · khớp sao kê":" · CHƯA khớp sao kê")+\'</div></div>\'',
'    +\'<div class="src-a" style="color:\'+(t.cuoi<0?"var(--brick)":"var(--pos)")+\'">\'+money(t.cuoi)+\'</div></div>\';',
'  /* --- 2. tong ngan sach kha dung: moi nhom dang da tieu / han muc --- */',
'  x+=\'<div class="daygroup dg-bud">HẠN MỨC LINH HOẠT</div>\';',
'  var rows="", sB=0, sV=0;',
'  pa.bd.gr.forEach(function(g){',
'    var fo=fixedOfGroup(g.id,cursor);',
'    var bLh=avail(g.id,cursor)-fo.plan;',
'    var vLh=Math.max(0,spentOf(g.id,cursor)-Math.min(fo.chi,fo.plan));',
'    sB+=bLh; sV+=vLh;',
'    if(!bLh&&!vLh)return;',
'    var d2=vLh-bLh;',
'    rows+=xoSub(esc(g.n),(d2>0?"vượt "+money(d2):d2<0?"còn "+money(-d2):"đã hết")',
'      +(g.o?" · bù "+(g.o>0?"sang +":"đi ")+money(Math.abs(g.o)):""),',
'      xoTS(vLh,bLh), d2>0?"neg":"");',
'  });',
'  var vuot=sV-sB, ty=sB?Math.min(1,sV/sB):0;',
'  x+=xoBox("hm","Đã tiêu / hạn mức",(vuot>0?"vượt ":"còn ")+money(Math.abs(vuot)),',
'    xoTS(sV,sB), vuot>0?"neg":"pos",',
'    [(vuot>0?"vượt ":"còn ")+money(Math.abs(vuot)), vuot>0?"neg":"pos"],',
'    rows+xoTt("Cộng lại",xoTS(sV,sB),vuot>0?"neg":"pos"));',
'  x+=\'<div style="padding:9px 14px 13px"><div class="pace"><i style="width:\'+(ty*100)',
'    +\'%;background:\'+(vuot>0?"var(--brick)":"var(--jade)")+\'"></i></div></div>\';',
'  if(pa.bd.khongHM.length){',
'    x+=\'<div class="daygroup dg-sub">ĐÃ TIÊU MÀ CHƯA ĐẶT HẠN MỨC</div>\';',
'    pa.bd.khongHM.forEach(function(k){x+=LN(esc(k.n),k.a,"đang trừ vào ngân sách chung");});',
'  }',
'  /* --- 3. ket qua --- */',
'  x+=\'<div class="daygroup dg-kq">KẾT QUẢ</div>\';',
'  var b2=\'\';',
'  b2+=xoSub("Tiền thật đang có","",money(q.tien));',
'  b2+=xoSub("+ Lương kế hoạch chưa về","",money(q.luongChuaVe));',
'  b2+=xoSub("+ Thu nợ đã hẹn ngày trong tháng",',
'    q.henNgay?("gần nhất "+dm(q.henNgay)):"chưa khoản nào hẹn ngày",money(q.henTong));',
'  b2+=xoSub("− Nợ còn phải trả","",money(q.noConPhai));',
'  b2+=xoSub("− Chi phí cố định chưa trả","",money(q.cdLeft));',
'  b2+=xoTt("Số tiền còn lại được dùng để chi",money(q.A1));',
'  b2+=\'<div class="xo-sub gap"><div class="l">Cần để dành<div class="c">Tiết kiệm &amp; Đầu tư \'',
'    +money(Math.max(0,bud("tk",cursor)-spentOf("tk",cursor)))+\' + Quỹ dự phòng \'',
'    +money(goalMonthly())+\'</div></div><div class="n">\'+money(q.B)+\'</div></div>\';',
'  b2+=xoTt(q.lan?"Vượt quá số cần để dành":"Còn dư sau khi để dành",',
'    money(q.lan||q.tuDo), q.lan?"neg":"pos");',
'  if(q.treo.length)b2+=\'<div class="xo-sub gap"><div class="l"><span class="c" style="margin:0">\'',
'    +\'Chưa tính: \'+q.treo.length+\' khoản cho vay chưa thu, chưa hẹn ngày — \'',
'    +q.treo.map(function(v){return esc(v.n)+" "+money(v.a);}).join(" · ")+\'</span></div><div class="n"></div></div>\';',
'  x+=xoBox("kq","Số tiền còn lại được dùng để chi",',
'    money(q.A1)+" / "+money(q.B)+" cần để dành · "+(q.lan?"vượt "+money(q.lan):"dư "+money(q.tuDo)),',
'    money(q.A1), q.A1<0?"neg":"pos",',
'    [q.lan?"vượt "+money(q.lan):"dư "+money(q.tuDo), q.lan?"neg":"pos"], b2);',
'  return x+\'</div>\';',
'}',
''].join('\n');

/* ══════════ 2. o lon tren The nhip chi ══════════ */
const CU_O = [
'        <div style="text-align:center">',
'          <div class="src-m">Số tiền còn lại được dùng để chi tiêu ${open.pw?\'▾\':\'▸\'}</div>',
'          <div style="font-size:32px;font-weight:600;letter-spacing:-.025em;margin:2px 0;color:${pa.conDuoc<0?\'var(--brick)\':\'var(--pos)\'}">${money(pa.conDuoc)}</div>',
'          <div class="src-m">Còn ${pa.conLai} ngày · Đã tiêu ${money(pa.daChi)} / ${money(pa.duTru)}</div></div>'
].join('\n');

const MOI_O = [
'        ${(()=>{',
'          const q=thanhKhoan(cursor);',
'          const dm=s=>s?s.slice(8,10)+"/"+s.slice(5,7):"";',
'          const mau=v=>v<0?"var(--brick)":"var(--pos)";',
'          let r=\'<div style="text-align:center">\'',
'            +\'<div class="src-m">Số tiền còn lại được dùng để chi \'+(open.pw?"▾":"▸")+\'</div>\';',
'          /* Co khoan thu du kien ve -> HAI SO KE NHAU: bay gio va sau khi thu ve.',
'             Khong co thi mot so nhu cu. */',
'          if(q.henTong)r+=\'<div class="hai">\'',
'            +\'<div class="mot"><div class="so" style="color:\'+mau(q.A0)+\'">\'+money(q.A0)+\'</div>\'',
'              +\'<div class="nhan">hiện tại · \'+dm(iso(new Date()))+\'</div></div>\'',
'            +\'<div class="mui">→</div>\'',
'            +\'<div class="mot"><div class="so" style="color:\'+mau(q.A1)+\'">\'+money(q.A1)+\'</div>\'',
'              +\'<div class="nhan">từ \'+dm(q.henCuoi)+(q.henSo>1?" · thu đủ ":" · thu về ")',
'                +money(q.henTong)+(q.henSo>1?" qua "+q.henSo+" đợt":"")+\'</div></div>\'',
'            +\'</div>\';',
'          else r+=\'<div class="so1" style="color:\'+mau(q.A1)+\'">\'+money(q.A1)+\'</div>\';',
'          /* diem 2: khong bao gio de mot so tran — luon co mau so ben canh */',
'          r+=\'<div class="src-m" style="margin-top:3px">\'+money(q.A1)+\' / \'+money(q.B)+\' cần để dành · \'',
'            +\'<b style="color:\'+(q.lan?"var(--brick)":"var(--pos)")+\'">\'',
'            +(q.lan?"vượt "+money(q.lan):"dư "+money(q.tuDo))+\'</b></div>\';',
'          if(q.treo.length)r+=\'<div class="src-m" style="margin-top:4px">Chưa tính \'+q.treo.length',
'            +\' khoản cho vay chưa thu · \'+money(q.treo.reduce((s,v)=>s+v.a,0))+\' — chưa hẹn ngày</div>\';',
'          r+=\'<div class="src-m" style="margin-top:4px">Còn \'+pa.conLai+\' ngày · Đã tiêu \'',
'            +money(pa.daChi)+\' / \'+money(pa.duTru)+\' hạn mức</div>\';',
'          return r+\'</div>\';})()}'
].join('\n');

/* ══════════ 3. goi ban giai thich moi ══════════ */
const CU_GOI = 'if(open.pw)h+=paceWhy(pa);';
const MOI_GOI = 'if(open.pw)h+=paceWhy2(pa);';

/* ══════════ 4+5. diem 3 — mot dinh dang so duy nhat ══════════ */
const CU_STRIP = "      <span>${SRC.map(x=>esc(x.n.replace('Ví điện tử','Ví'))+' <b>'+short(bal[x.id]||0)+'</b>').join(' · ')}</span>";
const MOI_STRIP = "      <span>${SRC.map(x=>esc(x.n.replace('Ví điện tử','Ví'))+' <b>'+money(bal[x.id]||0)+'</b>').join(' · ')}</span>";

const CU_HERO = [
"      <div class=\"sub\">${list.filter(t=>t.t==='chi').length} giao dịch · ${",
"        /* mùng 1 mới qua một ngày, chia cho 1 chưa phải trung bình */",
"        passed===1?`Đã chi <b>${short(chi)}</b> hôm nay`:`Trung bình <b>${short(chi/passed)}</b> mỗi ngày`}`",
"      +(thuNhap?` · Thu nhập <b>${short(thuNhap)}</b>`:'')+`</div></div>`;"
].join('\n');
const MOI_HERO = [
"      <div class=\"sub\">${list.filter(t=>t.t==='chi').length} giao dịch`",
"      +(thuNhap?` · Thu nhập <b>${money(thuNhap)}</b>`:'')+`</div></div>`;"
].join('\n');

/* ══════════ 6. khoi dau cua Tong ket thang -> dang nut xo ══════════ */
const CU_TK = [
"  let h=`<h2 class=\"hl\"><i style=\"background:${gcA('#47897A')}\"></i><b>Tổng kết ${MONTH(cursor.getMonth()).toLowerCase()}</b><em>đã đóng sổ</em></h2>",
"    <div class=\"panel\">",
"      ${R('Thực thu',co(s.thu,t5.thu,true),money(s.thu))}",
"      ${R('− Thực chi','<div class=\"src-m\">cố định, nợ và mọi nhóm chi — không kể tiền góp vào Tiết kiệm &amp; đầu tư</div>'",
"        +co(s.tieuThat,t5.tieuThat,false),money(s.tieuThat))}",
"      <div class=\"src total\"><div><div class=\"src-n\">Để dành được</div>${co(s.deDanh,t5.deDanh,true)}</div>",
"        <div class=\"src-a\" style=\"color:${s.deDanh>=s.mucTieu?'var(--pos)':'var(--amber)'}\">${money(s.deDanh)}</div></div>",
"    </div>`;"
].join('\n');
const MOI_TK = [
"  let h=`<h2 class=\"hl\"><i style=\"background:${gcA('#47897A')}\"></i><b>Tổng kết ${MONTH(cursor.getMonth()).toLowerCase()}</b><em>đã đóng sổ</em></h2>`",
"    +khoiTongKet();"
].join('\n');

/* ══════════ 8. Khoi No: tach hai ben cho ro ══════════ */
const CU_NO = [
"    h+=`<h2 class=\"hl\"><i style=\"background:${gcA('#CF4640')}\"></i><b>Nợ</b>",
"      <em><b style=\"color:var(--brick)\">${short(dt.no)}</b> phải trả${dt.cho?' · '+short(dt.cho)+' phải thu':''}${soon?' · '+soon+' sắp hạn':''}</em></h2>`;"
].join('\n');
const MOI_NO = [
"    h+=`<h2 class=\"hl\"><i style=\"background:${gcA('#CF4640')}\"></i><b>Nợ</b>",
"      <em>${soon?soon+' sắp hạn':''}</em></h2>`;",
"    h+=`<div class=\"nohai\">",
"      <div class=\"nomot ra\"><div class=\"nonhan\">↑ KHOẢN PHẢI TRẢ</div>",
"        <div class=\"noso\">${money(dt.no)}</div>",
"        <div class=\"noph\">${DB.debts.filter(x=>x.kind!=='cho'&&debtInfo(x).left>0).length} khoản · tiền sẽ ra</div></div>",
"      <div class=\"nomot vao\"><div class=\"nonhan\">↓ KHOẢN CHỜ THU</div>",
"        <div class=\"noso\">${money(dt.cho)}</div>",
"        <div class=\"noph\">${DB.debts.filter(x=>x.kind==='cho'&&debtInfo(x).left>0).length} khoản · tiền sẽ vào</div></div>",
"    </div>`;"
].join('\n');

/* danh sach tung khoan: chia hai muc co tieu de rieng */
const CU_NOLIST = "      DB.debts.forEach(d=>h+=debtRow(d));";
const MOI_NOLIST = [
"      /* chi liet ke khoan CHUA XONG — khoan da tat toan xem o tab No */",
"      const _con=x=>debtInfo(x).left>0;",
"      const _no=DB.debts.filter(x=>x.kind!=='cho'&&_con(x));",
"      const _cho=DB.debts.filter(x=>x.kind==='cho'&&_con(x));",
"      const _xong=DB.debts.length-_no.length-_cho.length;",
"      if(_no.length){h+=`<div class=\"nohd ra\"><i></i><span>↑ KHOẢN PHẢI TRẢ</span>`",
"        +`<span style=\"margin-left:auto;font-weight:700\">${money(dt.no)}</span></div>`;",
"        _no.forEach(d=>h+=debtRow(d));}",
"      if(_cho.length){h+=`<div class=\"nohd vao\"><i></i><span>↓ KHOẢN CHỜ THU</span>`",
"        +`<span style=\"margin-left:auto;font-weight:700\">${money(dt.cho)}</span></div>`;",
"        _cho.forEach(d=>h+=debtRow(d));}",
"      if(!_no.length&&!_cho.length)h+=`<div class=\"src\" style=\"padding:13px 14px\">`",
"        +`<div class=\"src-m\">Không còn khoản nợ nào chưa xong.</div></div>`;",
"      if(_xong)h+=`<div class=\"src\" style=\"padding:10px 14px\">`",
"        +`<div class=\"src-m\">${_xong} khoản đã tất toán — xem ở tab Nợ.</div></div>`;"
].join('\n');

/* ══════════ 7. MOI khoi xo xuong deu co motion ══════════
   App dang vieet theo mau:   if(open.X){  ...noi vao h...  }
   Boc phan than bang <div class="xow" data-xo="X"> de toggle() co cai ma cham vao
   va chay chieu cao. Tim dau dong `}` co DUNG muc thut nhu dong `if(open.X){`. */
function bocXo(s) {
  const d = s.split('\n'), ra = [], da = [];
  for (let i = 0; i < d.length; i++) {
    const m = d[i].match(/^(\s*)if\(open(?:\.([a-zA-Z]+)|\['([a-z_]+)'\+([a-zA-Z.]+)\])\)\{\s*$/);
    if (!m) { ra.push(d[i]); continue; }
    /* txCode KHONG phai co dung/sai — no giu MA NHOM dang mo, va khong di qua
       toggle(). Boc no thanh luon-mo se lam hong panel loc o Co cau chi tieu. */
    if (m[2] === 'txCode' || m[2] === 'zoom' || m[2] === 'chain') { ra.push(d[i]); continue; }
    const thut = m[1];
    const idJS = m[2] ? JSON.stringify(m[2]) : '"' + m[3] + '"+' + m[4];
    const coJS = m[2] ? 'open.' + m[2] : 'open[\'' + m[3] + '\'+' + m[4] + ']';
    let j = -1;
    for (let k = i + 1; k < d.length; k++) {
      if (d[k] === thut + '}') { j = k; break; }
      if (d[k].length <= thut.length && d[k].trim() === '}') { j = k; break; }
    }
    if (j < 0) { ra.push(d[i]); continue; }
    /* Bo dieu kien: than khoi LUC NAO CUNG duoc dung, dong hay mo do data-open quyet dinh. */
    ra.push(thut + 'if(1){ h+=\'<div class="xow" data-xo="\'+(' + idJS +
      ')+\'" data-open="\'+((' + coJS + ')?1:0)+\'">\';');
    for (let k = i + 1; k < j; k++) ra.push(d[k]);
    ra.push(thut + '  h+=\'</div>\';');
    ra.push(d[j]);
    da.push(m[2] || m[3] + '*');
    i = j;
  }
  return { src: ra.join('\n'), da };
}

/* toggle() moi: mo thi chay 0 -> chieu cao that, dong thi chay ve 0 ROI moi ve lai.
   Day la diem 6 ap cho toan app, khong chi rieng cac nut xo moi. */
const CU_TOGGLE = 'function toggle(id){open[id]=!open[id];render()}';
const MOI_TOGGLE = [
'/* Thoi luong theo QUANG DUONG, khong co dinh: khoi cao thi chay lau hon mot chut',
'   nen van toc cam nhan gan nhu khong doi. Do la thu tao cam giac "muot". */',
'const XODUR=px=>Math.min(480,Math.max(210,Math.round(px*0.55+150)));',
'const XORA="cubic-bezier(.2,.8,.2,1)";    /* mo: giam toc deu, khong le the o cuoi */',
'const XOVAO="cubic-bezier(.4,0,.75,.2)";  /* dong: nhanh dan roi dut khoat */',
'var XODEM=0;',
'function xoBat(){ XODEM++; document.documentElement.classList.add("xo-chay"); }',
'function xoTat(){ if(--XODEM<=0){ XODEM=0;',
'  document.documentElement.classList.remove("xo-chay"); } }',
'function xoMui(id,mo){',
'  var m=document.querySelectorAll(\'.xomui[data-mui="\'+id+\'"]\');',
'  for(var i=0;i<m.length;i++)m[i].textContent=m[i].getAttribute(mo?"data-a":"data-b");',
'}',
'function xoXong(el,d,xong){',
'  var roi=false;',
'  var het=function(){ if(roi)return; roi=true;',
'    el.removeEventListener("transitionend",tr); xoTat(); xong(); };',
'  var tr=function(e){ if(e.propertyName==="height")het(); };',
'  el.addEventListener("transitionend",tr); setTimeout(het,d+140);',
'}',
'/* Khong con render() truoc khi chay. Than khoi da nam san trong trang,',
'   bam chi doi chieu cao — trinh duyet khong phai dung lai ca man hinh.',
'   Chi ve lai MOT lan SAU khi chuyen dong xong, de cap nhat mui ten. */',
'function toggle(id){',
'  var el=document.querySelector(\'[data-xo="\'+id+\'"]\');',
'  if(!el){ open[id]=!open[id]; render(); return; }',
'  if(el.classList.contains("chay"))return;',
'  var mo=el.getAttribute("data-open")==="1";',
'  open[id]=!mo;',
'  xoMui(id,!mo);',
'  xoBat();',
'  if(mo){',
'    var h0=el.scrollHeight, d0=Math.round(XODUR(h0)*0.82);',
'    el.style.transition="none"; el.style.height=h0+"px";',
'    el.getBoundingClientRect();',
'    el.classList.add("an","chay");',
'    el.style.transition="height "+d0+"ms "+XOVAO;',
'    el.style.height="0px";',
'    xoXong(el,d0,function(){',
'      el.setAttribute("data-open","0");',
'      el.classList.remove("an","chay");',
'      el.style.transition=""; el.style.height="";',
'    });',
'  }else{',
'    el.setAttribute("data-open","1");',
'    el.style.transition="none"; el.style.height="auto";',
'    var h1=el.scrollHeight, d1=XODUR(h1);',
'    el.classList.add("an","chay");',
'    el.style.height="0px";',
'    el.getBoundingClientRect();',
'    el.style.transition="height "+d1+"ms "+XORA;',
'    el.style.height=h1+"px";',
'    el.classList.remove("an");',
'    xoXong(el,d1,function(){',
'      el.classList.remove("chay");',
'      el.style.transition=""; el.style.height="";',
'    });',
'  }',
'}'
].join('\n');

/* ba cho viet mot dong, boc rieng */
const MOT_DONG = [
  ["if(open.chain)h+=`<div class=\"sp\"></div>`+chainPanel(open.chain);",
   "if(open.chain)h+='<div class=\"xow\" data-xo=\"chain\">'+`<div class=\"sp\"></div>`+chainPanel(open.chain)+'</div>';"],
  ["if(open.pw)h+=paceWhy2(pa);",
   "h+='<div class=\"xow\" data-xo=\"pw\" data-open=\"'+(open.pw?1:0)+'\">'+paceWhy2(pa)+'</div>';"],
  ["      if(open.fcd)h+=`<div class=\"sp\"></div><div class=\"detail\">",
   "      h+='<div class=\"xow\" data-xo=\"fcd\" data-open=\"'+(open.fcd?1:0)+'\">'+`<div class=\"sp\"></div><div class=\"detail\">"],
  ["<div class=\"detail-hd\">▾ CHI TIẾT TỪNG NHÓM CỦA DỰ BÁO Ở TRÊN</div>`+fcDetail(f)+`</div>`;",
   "<div class=\"detail-hd\">▾ CHI TIẾT TỪNG NHÓM CỦA DỰ BÁO Ở TRÊN</div>`+fcDetail(f)+`</div>`+'</div>';"],
  /* tung nhom trong tab Ngan sach */
  ["      ${op?hmDetail(g):''}",
   "      <div class=\"xow\" data-xo=\"hm_${g.id}\" data-open=\"${op?1:0}\">${hmDetail(g)}</div>"],
];

function appVa() {
  let s = fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8');
  const log = [];
  const doi = (cu, moi, ten) => {
    if (s.indexOf(cu) < 0) throw new Error('khong tim thay: ' + ten);
    s = s.replace(cu, moi); log.push(ten);
  };
  if (s.indexOf('function pace(d){') < 0) throw new Error('khong tim thay pace()');
  s = s.replace('function pace(d){', HAM + 'function pace(d){');
  log.push('chen ham moi');
  doi(CU_O, MOI_O, 'o lon');
  doi(CU_GOI, MOI_GOI, 'goi paceWhy2');
  doi(CU_STRIP, MOI_STRIP, 'so du day du (diem 3)');
  doi(CU_HERO, MOI_HERO, 'hero: bo trung binh ngay');
  doi(CU_TK, MOI_TK, 'Tong ket thang -> nut xo');
  /* motion cho MOI khoi xo xuong */
  doi(CU_NO, MOI_NO, 'khoi No: tach hai ben');
  doi(CU_NOLIST, MOI_NOLIST, 'danh sach no: chia hai muc');
  doi(CU_TOGGLE, MOI_TOGGLE, 'toggle() khong ve lai truoc khi chay');
  MOT_DONG.forEach(function (x, i) { doi(x[0], x[1], 'boc mot dong #' + (i + 1)); });
  const bx = bocXo(s); s = bx.src;
  log.push('boc ' + bx.da.length + ' khoi xo: ' + bx.da.join(', '));

  /* --- bo goc: chuyen sang CSS, vi khong con ve lai de cap nhat style noi tuyen --- */
  const _t = s.length;
  s = s.replace(/\$\{open\.[a-zA-Z]+\?';border-radius:var\(--r\) var\(--r\) 0 0':''\}/g, '');
  log.push(_t > s.length ? 'bo goc -> CSS' : 'khong thay bo goc noi tuyen');

  /* --- mui ten: boc vao the de doi TAI CHO, khong phai ve lai ca trang --- */
  let nMui = 0;
  s = s.replace(/\$\{open\.([a-zA-Z]+)\?'([^']*)':'([^']*)'\}/g, function (_, id, a, b) {
    if(/[:;<>]/.test(a)||/[:;<>]/.test(b)||(!a&&!b))return _;   /* khong phai nhan */
    nMui++;
    return '<span class="xomui" data-mui="' + id + '" data-a="' + a + '" data-b="' + b +
      '">${open.' + id + "?'" + a + "':'" + b + "'}</span>";
  });
  s = s.split("${op?'▴':'▾'}").join(
    '<span class="xomui" data-mui="hm_${g.id}" data-a="▴" data-b="▾">'
    + "${op?'▴':'▾'}" + '</span>');
  s = s.split("'+(open.pw?\"▾\":\"▸\")+'").join(
    '<span class="xomui" data-mui="pw" data-a="▾" data-b="▸">' + "'+(open.pw?\"▾\":\"▸\")+'" + '</span>');
  log.push('boc ' + nMui + ' mui ten');
  console.log('[va] ' + log.join(' · '));
  return s;
}
function cssVa() {
  return fs.readFileSync(path.join(ROOT, 'style.css'), 'utf8') + CSS_XO;
}

const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.jpg': 'image/jpeg', '.png': 'image/png', '.json': 'application/json' };

/* Ban sao cua so, dien san NGAY DU KIEN THU cho hai khoan cho vay con treo.
   Chi de XEM THU — so that tren dia khong bi sua. */
function soCoHen() {
  const d = JSON.parse(fs.readFileSync(SO, 'utf8'));
  /* Dien ngay du kien thu cho MOI khoan cho vay con treo: ngay cuoi thang dang xem.
     Khong khop theo so tien cu the de file nay khong mang du lieu rieng cua Vy. */
  const cuoiThang = function (iso) {
    const d = new Date(iso + 'T00:00'), n = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    return n.getFullYear() + '-' + String(n.getMonth() + 1).padStart(2, '0') +
           '-' + String(n.getDate()).padStart(2, '0');
  };
  (d.debts || []).forEach(function (x) {
    if (x.kind !== 'cho' || x.due || !x.start) return;
    x.due = cuoiThang(x.start);
  });
  return JSON.stringify(d);
}

function trangApp(book, nhan, mau) {
  const shell = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const nhung = '<script>try{localStorage.setItem("sochi:data",' +
    JSON.stringify(book) + ');}catch(e){}</script>\n' +
    '<div style="position:fixed;z-index:99;left:0;right:0;top:0;text-align:center;' +
    'font:600 11px/19px system-ui,sans-serif;background:' + (mau || '#8a6100') + ';color:#fff">' +
    nhan + '</div>\n';
  return shell.replace('<script src="app.js', nhung + '<script src="app.js');
}

http.createServer(function (req, res) {
  let p = decodeURIComponent(url.parse(req.url).pathname).split('?')[0];
  const goi = (b, ct) => { res.writeHead(200, { 'Content-Type': ct, 'Cache-Control': 'no-store' }); res.end(b); };
  try {
    if (p === '/' || p === '/index.html') return goi(
      trangApp(fs.readFileSync(SO, 'utf8'),
        'BẢN PHÁC THẢO · sổ thật · chưa khoản cho vay nào hẹn ngày'), MIME['.html']);
    if (p === '/hen') return goi(
      trangApp(soCoHen(),
        'BẢN PHÁC THẢO · đã điền ngày dự kiến thu cho mọi khoản cho vay còn treo', '#1c7a5e'),
      MIME['.html']);
    if (p === '/app.js') return goi(appVa(), MIME['.js']);
    if (p === '/style.css') return goi(cssVa(), MIME['.css']);
  } catch (e) {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('Loi va: ' + e.stack);
  }
  const f = path.join(ROOT, p);
  if (!path.resolve(f).startsWith(path.resolve(ROOT))) { res.writeHead(403); return res.end('no'); }
  fs.readFile(f, function (e, b) {
    if (e) { res.writeHead(404); return res.end('404 ' + p); }
    goi(b, MIME[path.extname(f).toLowerCase()] || 'application/octet-stream');
  });
}).listen(PORT, function () {
  try { appVa(); } catch (e) { console.log('LOI: ' + e.message); }
  console.log('ban phac thao: http://localhost:' + PORT + '/');
});
