/* Kiểm tra chốt sổ tháng (v=10). Đồng hồ giả, sổ dựng tay để biết trước từng con số. */
const fs=require('fs'), path=require('path'), vm=require('vm');
const SRC_APP=fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8');
let code=SRC_APP.slice(0,SRC_APP.indexOf("try{\n  const mf="));
code+=`
globalThis.__set=(db,cur)=>{DB=db;cursor=cur||new Date();tab='home';open={};msg='';chotXN={};chotThat={};chotHoi=null;memoClear();};
globalThis.__f={chotCan,khoiChot,vHome,khongTieu,chotKhop,chotSo,chotDieuChinh,hoiChot,del,setDate,balAt,migrate,
  bangTien,khoiTongKet,chotHoiOK,chotHoiHuy,khoiChotHoi,chotVe,chotLan,balSrcAt,chotGhiLech,vBudget};
globalThis.__tab=t=>{tab=t;};
globalThis.__cc=d=>coCau(d);
globalThis.__no=d=>noThang(d);
globalThis.__nv=(g,d)=>noVuot(g,d);
globalThis.__tv=(g,d)=>truVuot(g,d);
globalThis.__ci=(g,d)=>carryIn(g,d);
globalThis.__lf=()=>listFiltered();
globalThis.__list=()=>vList();
globalThis.__loc=()=>loc;
globalThis.__move=n=>move(n);
Object.assign(globalThis.__f,{locNhom,locNguon,locNgay,locXoa,locCon,nsCan,chotNS});
globalThis.__mct=d=>muonChuaThu(d);
globalThis.__moV=(k,v)=>{open[k]=v;};
globalThis.__picker=v=>{if(v)openPicker('manual',0,'chi');else closePicker();};
globalThis.__trend=()=>vTrend();
globalThis.__hoi=()=>chotHoi;
globalThis.__mo=k=>{open[k]=1;};
globalThis.__db=()=>DB;
globalThis.__that=(s,v)=>{chotThat[s]=v;};
globalThis.__cur=d=>{cursor=d;memoClear();};
globalThis.__fp=(it,d)=>fixedPaid(it,d);
globalThis.__pace=d=>pace(d);
globalThis.__goiY=()=>goiYBatDau();
globalThis.__luuBD=()=>luuBatDau();
globalThis.__moBD=()=>{open.batDau=1;};
globalThis.__render=()=>render();`;

let HOM='2026-10-01', hoi=[], traLoi=true;
const R=Date, FD=class extends R{constructor(...a){if(!a.length)super(HOM+'T09:00:00');else super(...a);}
  static now(){return new R(HOM+'T09:00:00').getTime();}};
let O={};
const o=(id,value)=>{O[id]={id,value:value||'',dataset:{},hidden:false,textContent:''};};
const appEl={innerHTML:''}, navEl={innerHTML:''};
const el={innerHTML:'',scrollIntoView(){},appendChild(){},click(){},remove(){},style:{},dataset:{},value:''};
const ctx={console,Intl,Date:FD,Math,JSON,Object,Array,String,Number,isNaN,parseInt,parseFloat,
  setTimeout:()=>0,clearTimeout(){},localStorage:{getItem:()=>null,setItem(){}},navigator:{},
  Blob:function(){},File:function(){},URL:{createObjectURL:()=>'x',revokeObjectURL(){}},
  confirm:q=>{hoi.push(q);return traLoi;}, prompt:()=>null,
  document:{getElementById:id=>id==='app'?appEl:id==='nav'?navEl:(O[id]||el),createElement:()=>el,querySelector:()=>null,head:el,body:el,documentElement:el}};
ctx.window=ctx; ctx.globalThis=ctx;
ctx.window.matchMedia=()=>({matches:false,addEventListener(){},addListener(){}});
ctx.window.scrollTo=()=>{}; ctx.window.scrollY=0;
vm.createContext(ctx); vm.runInContext(code,ctx,{filename:'app.js'});
const F=ctx.__f;

let loi=0;
const ok=(dk,t,them)=>{if(dk)console.log('  ✓ '+t);else{loi++;console.log('  ✗ '+t+(them?'\n      → '+them:''));}};
const eq=(a,b,t)=>ok(a===b,t,'được '+JSON.stringify(a)+', cần '+JSON.stringify(b));
const M=n=>new Intl.NumberFormat('vi-VN').format(Math.round(n));

/* Sổ tháng 9: có giao dịch mọi ngày TRỪ 14, 21, 30. Mở sổ BIDV 1.000.000, Tiền mặt 200.000. */
let nid=1;
function so(){
  const txns=[];
  for(let d=1;d<=30;d++){ if([14,21,30].includes(d))continue;
    txns.push({id:nid++,d:'2026-09-'+String(d).padStart(2,'0'),t:'chi',a:10000,c:'an_ngoai',s:'tm',n:'Ăn'}); }
  txns.push({id:nid++,d:'2026-09-07',t:'thu',a:5000000,c:'luong',s:'bidv',n:'Lương'});
  return F.migrate({txns,v:10,debts:[],budgets:{},bm:{},goals:[],fixedItems:[],roll:{},offsets:[],draws:[],income:0,
    rules:{},opens:{bidv:1000000,vi:0,tm:200000},checks:{},opts:{},chainOK:{},goalPlan:{},
    payDays:{k1:[5,10],k2:[15,25]},ngayOK:{}});
}
const T10=new Date(2026,9,1), T9=new Date(2026,8,1);

console.log('\nA · Khi nào hiện');
{
  HOM='2026-09-30'; let db=so(); ctx.__set(db,T9);
  ok(F.chotCan()===null,'ngày 30/09: chỉ xét tháng 8, mà sổ bắt đầu tháng 9 → KHÔNG hiện khối',JSON.stringify(F.chotCan()));
  ok(!F.vHome().includes('Chốt sổ'),'ngày cuối tháng 9 KHÔNG hiện khối chốt sổ tháng 9');
  HOM='2026-10-01'; db=so(); ctx.__set(db,T10);
  ok(F.vHome().includes('Chốt sổ tháng 9'),'mùng 1/10: khối "Chốt sổ tháng 9" hiện trên Tổng quan tháng 10');
  ok(F.vHome().indexOf('Chốt sổ tháng 9')<F.vHome().indexOf('id="sec-bal"'),'khối nằm TRÊN CÙNG, trước thanh số dư');
  ctx.__cur(T9);
  ok(!F.vHome().includes('chot-hd'),'đang xem tháng 9 (tháng cũ) → KHÔNG hiện khối chốt');
  ok(!/để sau|Để sau/.test(F.khoiChot()),'KHÔNG có nút "để sau"');
  HOM='2026-11-03'; db=so(); ctx.__set(db,new Date(2026,10,1));
  eq(F.chotCan()&&F.chotCan().k,'2026-10','sang tháng 11 mà tháng 9 chưa chốt → chỉ nhắc tháng 10, không dồn tháng 9');
}

console.log('\nB · Ba điều kiện');
{
  HOM='2026-10-01'; const db=so(); ctx.__set(db,T10);
  let c=F.chotCan();
  eq(c.trong.join(','),'2026-09-14,2026-09-21,2026-09-30','đúng ba ngày trống 14, 21, 30');
  ok(!c.du,'còn ngày trống → CHƯA đủ điều kiện');
  let h=F.khoiChot();
  ok(h.includes('Thứ Hai, 14/09')&&h.includes('Thứ Hai, 21/09')&&h.includes('Thứ Tư, 30/09'),'ghi thứ đúng: 14 và 21 là thứ Hai, 30 là thứ Tư');
  ok(/<button class="btn chot-btn" disabled>Còn 3 ngày trống/.test(h),'nút chốt bị khóa, ghi rõ còn 3 ngày trống');
  ok(!h.includes('Khớp</button>'),'chưa đủ điều kiện → CHƯA hiện bước xác nhận số dư');
  F.khongTieu('2026-09-14');
  eq(db.ngayOK['2026-09-14'],1,'bấm "Không tiêu" cho 14/09 (ngày lẻ giữa tháng) → ghi vào ngayOK');
  eq(F.chotCan().trong.join(','),'2026-09-21,2026-09-30','14/09 biến khỏi danh sách');
  db.txns.push({id:nid++,d:'2026-09-21',t:'chi',a:5000,c:'',s:'tm',n:'Chưa nhóm'});
  F.khongTieu('2026-09-30'); ctx.__set(db,T10);
  c=F.chotCan();
  ok(!c.trong.length&&c.thieuNhom===1&&!c.du,'hết ngày trống nhưng còn 1 giao dịch chưa nhóm → vẫn CHƯA đủ');
  ok(F.khoiChot().includes('Còn <b>1</b> giao dịch chưa có nhóm'),'báo rõ còn 1 giao dịch chưa có nhóm');
  db.txns[db.txns.length-1].c='an_ngoai'; ctx.__set(db,T10);
  ok(F.chotCan().du,'sửa nhóm xong → đủ 3 điều kiện');
  h=F.khoiChot();
  ok(h.includes('Số dư cuối ngày 30/09')&&(h.match(/>Khớp<\/button>/g)||[]).length===3,'hiện bước xác nhận: ba nguồn, mỗi nguồn một nút Khớp');
}

console.log('\nC · Xác nhận số dư rồi chốt');
{
  HOM='2026-10-01'; const db=so(); db.ngayOK={'2026-09-14':1,'2026-09-21':1,'2026-09-30':1}; db.opens.tm=1000000; ctx.__set(db,T10);
  const c=F.chotCan(), tong=1000000+5000000+1000000-27*10000;
  eq(c.tong,tong,'số dư cuối tháng 9 = BIDV 1.000.000 + lương 5.000.000 + tiền mặt 1.000.000 − 27 × 10.000 = '+M(tong));
  eq(c.bs.bidv+c.bs.vi+c.bs.tm,c.tong,'ba nguồn cộng lại đúng bằng số dư cuối');
  F.chotKhop('bidv','y'); F.chotKhop('vi','y');
  ok(/chot-btn" disabled/.test(F.khoiChot()),'mới khớp 2/3 nguồn → nút chốt còn khóa');
  F.chotSo();
  ok(!db.chot['2026-09'],'bấm chốt khi chưa đủ 3 nguồn → KHÔNG chốt');
  F.chotKhop('tm','x'); eq(c.bs.tm,730000,'tiền mặt trong app = 1.000.000 − 27 × 10.000 = 730.000'); ctx.__that('tm','700.000');
  ok(F.khoiChot().includes('app tính NHIỀU hơn tiền thật')||F.khoiChot().includes('app tính ÍT hơn tiền thật'),'bấm Lệch + gõ số thật → giải thích chiều lệch');
  const dc0=db.txns.length;
  F.chotDieuChinh('tm');
  const dc=db.txns[dc0];
  ok(dc&&dc.t==='dc'&&dc.s==='tm'&&dc.a===30000&&dc.dir==='-'&&dc.d==='2026-09-30'&&/Điều chỉnh khi chốt sổ tháng 9/.test(dc.n),
    'ghi điều chỉnh −30.000 (730.000 app → 700.000 thật), ngày 30/09, tên rõ ràng',JSON.stringify(dc));
  ctx.__set(db,T10); F.chotKhop('bidv','y'); F.chotKhop('vi','y'); F.chotKhop('tm','y');
  hoi=[]; F.chotSo();
  const x=db.chot['2026-09'];
  ok(x&&x.tong===tong-30000&&x.tm===700000,'chốt: lưu số dư '+M(tong-30000)+', tiền mặt 700.000',JSON.stringify(x));
  eq(hoi.length,0,'chốt sổ KHÔNG bật hộp thoại nào');
  ctx.__set(db,T10);
  ok(F.chotCan()===null,'chốt xong → khối chốt biến mất');
  /* từ v=21: chốt sổ xong thì BẮT BUỘC sang bước 2 lập ngân sách — bước 1 hiện dấu ✓ */
  { const hh=F.vHome();
    ok(hh.includes('Sang tháng 10')&&hh.includes('Chốt sổ tháng 9<small>')&&hh.includes('moLapNS()'),'chốt xong → khối "Sang tháng 10": ✓ Chốt sổ tháng 9, nút Lập ngân sách tháng 10');
    ok(!hh.includes('chotSo()'),'…khối chốt sổ KHÔNG còn'); }
  HOM='2026-10-05'; ctx.__set(db,T10);
  ok(!F.vHome().includes('Đã chốt sổ tháng 9'),'4 ngày sau dải xanh tự ẩn');
  ok(!F.vHome().includes('chotSo()'),'…và khối chốt sổ KHÔNG quay lại');
}

console.log('\nD · Sửa sau khi chốt: hộp xác nhận, bản chốt đi theo số mới (v=15, Vy duyệt 11/10/2026)');
const K9='2026-09', dem=(s,x)=>s.split(x).length-1;
{
  HOM='2026-10-05'; let db=so(); db.ngayOK={'2026-09-14':1,'2026-09-21':1,'2026-09-30':1};
  /* sổ v12 đã chốt, chưa có `goc` — đi qua migrate như sổ thật trên điện thoại */
  db.chot={[K9]:{luc:new Date('2026-10-01T09:12:00').getTime(),bidv:6000000,vi:0,tm:-70000,tong:5930000}};
  db.v=12; db=F.migrate(db);
  eq(JSON.stringify(db.chot[K9].goc),JSON.stringify({luc:db.chot[K9].luc,bidv:6000000,vi:0,tm:-70000,tong:5930000}),'migrate v12 → v13: lần 1 = đúng bản chốt đang có');
  ok(db.v===14&&Array.isArray(db.chotLS)&&!db.chotLS.length&&db.nsChot&&!Object.keys(db.nsChot).length,'…sổ lên v14, nhật ký chốt rỗng, chưa chốt ngân sách tháng nào');
  ctx.__set(db,T9);
  let h=F.vHome();
  ok(h.includes('đã chốt 01/10'),'Tổng kết tháng 9 ghi "đã chốt 01/10"');
  ok(!h.includes('sau đó sửa'),'chưa sửa gì → KHÔNG có dòng "sau đó sửa"');
  ok(h.includes('Lịch sử chốt')&&h.includes('1 lần'),'có nút "Lịch sử chốt · 1 lần"');

  const goc0=JSON.stringify(db.txns[0]), id=String(db.txns[0].id);
  hoi=[]; F.del(id);
  ok(ctx.__hoi()&&db.txns.some(t=>String(t.id)===id),'xóa giao dịch tháng đã chốt → hộp xác nhận mở, CHƯA xóa gì');
  let x=F.khoiChotHoi();
  ok(x.includes('Tháng 9 đã chốt sổ')&&x.includes('Ghi nhận lần chốt 2'),'hộp ghi "Tháng 9 đã chốt sổ", nút "Ghi nhận lần chốt 2"');
  ok(x.includes('<small>Xóa giao dịch</small>')&&x.includes('<b>Ăn · 01/09 · Tiền mặt · 10.000</b>'),'nhãn "Xóa giao dịch" + đúng khoản sắp xóa');
  ok(!/Vy sắp làm/i.test(x),'KHÔNG còn nhãn "Vy sắp làm"');
  ok(x.includes('<s>'+M(-70000)+'</s> → <b>'+M(-60000)+'</b>'),'Tiền mặt −70.000 → −60.000');
  ok(x.includes(M(6000000)+' · không đổi'),'BIDV 6.000.000 · không đổi');
  ok(x.includes('<s>'+M(5930000)+'</s> → <b>'+M(5940000)+'</b>')&&x.includes('tăng '+M(10000)),'Tổng 5.930.000 → 5.940.000, tăng 10.000');
  ok(x.includes('Lần 1 Vy đã bấm Khớp Tiền mặt '+M(-70000)+' theo app ngân hàng. Số mới '+M(-60000)+' chưa được đối chiếu lại.'),'nhắc số mới chưa đối chiếu lại');
  ok(!x.includes('Tháng sau thay đổi'),'chỉ tháng 9 đã chốt → KHÔNG có khối "Tháng sau thay đổi"');
  F.chotHoiHuy();
  ok(!ctx.__hoi()&&db.txns.some(t=>String(t.id)===id)&&ctx.__db().chot[K9].tong===5930000&&!ctx.__db().chotLS.length,
    'bấm Hủy → không xóa, bản chốt và nhật ký nguyên vẹn');

  F.setDate(String(db.txns[1].id),'05/10/26');
  x=F.khoiChotHoi();
  ok(x.includes('<small>Sửa giao dịch</small>')&&x.includes('Ăn · 02/09 → 05/10 · Tiền mặt · 10.000'),'dời ngày ra khỏi tháng đã chốt → hộp ghi "Sửa giao dịch · 02/09 → 05/10"');
  F.chotHoiHuy();
  eq(db.txns[1].d,'2026-09-02','Hủy → ngày giữ nguyên');
  F.setDate(String(db.txns[2].id),'04/09/26');
  ok(!ctx.__hoi()&&db.txns[2].d==='2026-09-04','dời ngày TRONG cùng tháng: số dư cuối tháng không đổi → KHÔNG hỏi');

  F.del(id); F.chotHoiOK(); db=ctx.__db();
  ok(!db.txns.some(t=>String(t.id)===id),'bấm "Ghi nhận lần chốt 2" → xóa');
  ok(db.chot[K9].tong===5940000&&db.chot[K9].tm===-60000,'bản chốt ĐI THEO số mới: 5.940.000, tiền mặt −60.000');
  eq(db.chot[K9].goc.tong,5930000,'lần 1 (đã đối chiếu ngân hàng) vẫn giữ 5.930.000');
  eq(db.chotLS.length,1,'nhật ký có đúng 1 dòng');
  ctx.__cur(T9); h=F.vHome();
  ok(!h.includes('sau đó sửa'),'KHÔNG còn dòng vàng "sau đó sửa · lệch"');
  ok(h.includes('chốt lần 2 · 05/10'),'tiêu đề Tổng kết ghi "chốt lần 2 · 05/10"');
  ok(h.includes('chốt lần 2 · sửa sau khi chốt, chưa đối chiếu lại'),'dòng Số dư cuối ghi rõ chưa đối chiếu lại');
  ok(h.includes('Đã ghi nhận lần chốt 2 · số dư cuối tháng 9: '+M(5940000)),'báo "Đã ghi nhận lần chốt 2 · số dư cuối tháng 9: 5.940.000"');
  ok(h.includes('2 lần')&&!h.includes('ls-lan'),'lịch sử thu gọn mặc định');
  eq(hoi.length,0,'suốt phần D KHÔNG bật hộp confirm() nào của trình duyệt');
}

console.log('\nD2 · Lịch sử chốt và quay về');
{
  let db=ctx.__db(); ctx.__mo('lsChot'); let h=F.khoiTongKet();
  ok(h.includes('Lần 2')&&h.includes('Sửa sau khi chốt')&&h.includes('Xóa <b>Ăn · 01/09 · Tiền mặt · 10.000</b>'),'lần 2: nhãn "Sửa sau khi chốt" + việc đã làm');
  eq(dem(h,'Đã đối chiếu ngân hàng'),1,'chỉ lần 1 mang nhãn "Đã đối chiếu ngân hàng"');
  eq(dem(h,'>Đang dùng<'),1,'đúng một lần mang nhãn "Đang dùng"');
  ok(h.includes("chotVe('2026-09',1)")&&!h.includes("chotVe('2026-09',2)"),'nút "Quay về lần 1" có; lần đang dùng KHÔNG có nút');
  const truocVe=db.txns.length;
  F.chotVe(K9,1);
  let x=F.khoiChotHoi();
  ok(x.includes('Quay về lần chốt 1?')&&x.includes('<small>App sẽ đưa lại vào sổ</small>')&&x.includes('Ăn · 01/09 · Tiền mặt · 10.000'),'hộp quay về nói rõ khoản được đưa lại vào sổ');
  ok(x.includes('<s>'+M(5940000)+'</s> → <b>'+M(5930000)+'</b>')&&x.includes('giảm '+M(10000)),'Tổng 5.940.000 → 5.930.000');
  ok(!x.includes('xc-ghi'),'về đúng số đã đối chiếu → KHÔNG nhắc "chưa đối chiếu lại"');
  eq(db.txns.length,truocVe,'chưa bấm xác nhận → sổ chưa đổi');
  F.chotHoiOK(); db=ctx.__db();
  const lai=db.txns.find(t=>t.d==='2026-09-01'&&t.s==='tm');
  ok(lai&&lai.a===10000&&lai.n==='Ăn'&&lai.c==='an_ngoai','quay về lần 1 → giao dịch 01/09 trở lại sổ, đủ số tiền, nhóm, nội dung');
  ok(db.chot[K9].tong===5930000&&F.balAt(T9)===5930000,'bản chốt và sổ cùng về 5.930.000');
  eq(F.chotLan(K9).length,3,'quay về được ghi thành LẦN 3, lần 2 không bị xóa');
  ctx.__cur(T9); ctx.__mo('lsChot'); h=F.khoiTongKet();
  ok(h.includes('chốt lần 3 · quay về lần 1 · khớp BIDV, Ví, Tiền mặt'),'dòng Số dư cuối: "chốt lần 3 · quay về lần 1 · khớp…"');
  ok(h.includes('Quay về lần 1</span>')&&h.includes('Đưa lại <b>Ăn · 01/09'),'lần 3: nhãn "Quay về lần 1" + "Đưa lại …"');
  eq(dem(h,'Đã đối chiếu ngân hàng'),2,'lần 1 và lần 3 cùng mang nhãn "Đã đối chiếu ngân hàng"');
  ok(h.includes("chotVe('2026-09',2)")&&!h.includes("chotVe('2026-09',1)"),'giờ có nút "Quay về lần 2"; lần 1 trùng với lần đang dùng nên KHÔNG có nút');
  F.chotVe(K9,2); F.chotHoiOK(); db=ctx.__db();
  ok(!db.txns.some(t=>t.d==='2026-09-01'&&t.s==='tm')&&db.chot[K9].tong===5940000,'quay về lần 2 → khoản 01/09 lại được gỡ, số dư 5.940.000');
  eq(F.chotLan(K9).length,4,'thành lần 4 — nhật ký chỉ nối thêm');
  F.chotVe(K9,4);
  ok(!ctx.__hoi(),'quay về chính trạng thái đang có → không mở hộp');
}

console.log('\nD3 · Sửa tháng cũ kéo theo tháng đã chốt phía sau');
{
  HOM='2026-11-05'; let db=ctx.__db();
  db.txns.push({id:nid++,d:'2026-10-10',t:'chi',a:50000,c:'an_ngoai',s:'bidv',n:'Ăn tháng 10'});
  ctx.__set(db,T10);
  const b10=F.balSrcAt(T10), t10=b10.bidv+b10.vi+b10.tm;
  db.chot['2026-10']={luc:new Date('2026-11-01T08:00:00').getTime(),bidv:b10.bidv,vi:b10.vi,tm:b10.tm,tong:t10,
    goc:{luc:1,bidv:b10.bidv,vi:b10.vi,tm:b10.tm,tong:t10}};
  ctx.__set(db,T9);
  const t=db.txns.find(q=>q.d==='2026-09-05');
  F.del(String(t.id));
  let x=F.khoiChotHoi();
  ok(x.includes('Tháng sau thay đổi')&&x.includes('<span>Tháng 10</span>'),'hộp có khối "Tháng sau thay đổi" với dòng "Tháng 10"');
  ok(x.includes('<s>'+M(t10)+'</s> → <b>'+M(t10+10000)+'</b>'),'tháng 10: '+M(t10)+' → '+M(t10+10000));
  ok(!/Tháng 10[^<]*đã chốt/.test(x)&&!x.includes('Tháng sau cũng đổi theo'),'KHÔNG ghi "đã chốt" cạnh tháng 10, KHÔNG còn chữ "cũng đổi theo"');
  F.chotHoiOK(); db=ctx.__db();
  ok(db.chot['2026-10'].tong===t10+10000&&F.chotLan('2026-10').length===2,'tháng 10 cũng thành lần chốt 2, số mới '+M(t10+10000));
  eq(F.chotLan(K9).length,5,'tháng 9 thành lần 5');
  ok(Object.keys(db.chot).every(k=>db.chot[k].tong===F.balAt(new Date(+k.slice(0,4),+k.slice(5)-1,1))),'mọi tháng đã chốt: số chốt = số sổ tính ra, không lệch đồng nào');
  const t11={id:nid++,d:'2026-11-02',t:'chi',a:1,c:'an_ngoai',s:'tm',n:'x'}; db.txns.push(t11);
  F.del(String(t11.id));
  ok(!ctx.__hoi()&&!ctx.__db().txns.some(q=>q.id===t11.id),'xóa giao dịch tháng CHƯA chốt → KHÔNG hỏi, xóa luôn');
  eq(hoi.length,0,'không hộp confirm() nào của trình duyệt');
}

console.log('\nD4 · Bản chốt lệch có sẵn từ trước bản v=15: nút ghi nhận (lỗi sổ thật 11/10/2026)');
{
  /* Chốt 20:28 ngày 01/10 với tiền mặt −70.000; vài phút sau ghi thêm 2 khoản tiền mặt của tháng 9
     bằng bản app cũ → bản chốt đứng yên, sổ lệch 35.000. */
  const LUC=new Date('2026-10-01T20:28:00').getTime();
  const dung=()=>{HOM='2026-10-11'; const db=so(); db.ngayOK={'2026-09-14':1,'2026-09-21':1,'2026-09-30':1};
    db.chot={[K9]:{luc:LUC,bidv:6000000,vi:0,tm:-70000,tong:5930000}}; db.v=12; return F.migrate(db);};
  let db=dung();
  db.txns.push({id:LUC+480000.5,d:'2026-09-29',t:'chi',a:20000,c:'di_xang',s:'tm',n:'Xăng xe'},
               {id:LUC+540000.5,d:'2026-09-27',t:'chi',a:15000,c:'an_cafe',s:'tm',n:'Cà phê'});
  ctx.__set(db,T9);
  let h=F.vHome();
  ok(h.includes('Đã chốt '+M(5930000)+' · sau đó sửa, nay '+M(5895000)+' · lệch −'+M(35000)),'dòng vàng báo lệch −35.000');
  ok(h.includes('Ghi nhận số hiện tại thành lần chốt 2')&&h.includes('chotGhiLech()'),'có nút "Ghi nhận số hiện tại thành lần chốt 2"');
  F.chotGhiLech(); db=ctx.__db();
  ok(db.chot[K9].tong===5895000&&db.chot[K9].tm===-105000&&db.chot[K9].goc.tong===5930000,'bấm nút → bản chốt 5.895.000, lần 1 vẫn 5.930.000');
  ok(db.chotLS.length===1&&!db.chotLS[0].lech&&db.chotLS[0].sau.length===2,'hai khoản ghi sau lúc chốt giải thích ĐÚNG phần lệch → ghi vào nhật ký như khoản thêm');
  ctx.__cur(T9); ctx.__mo('lsChot'); h=F.vHome();
  ok(!h.includes('sau đó sửa')&&!h.includes('chotGhiLech'),'dòng vàng và nút biến mất');
  ok(h.includes('Thêm <b>Xăng xe · 29/09 · Tiền mặt · 20.000</b>')&&h.includes("chotVe('2026-09',1)"),'lịch sử ghi rõ hai khoản, vẫn quay về lần 1 được');
  F.chotVe(K9,1); F.chotHoiOK(); db=ctx.__db();
  ok(db.chot[K9].tong===5930000&&!db.txns.some(t=>t.n==='Xăng xe'),'quay về lần 1 → gỡ đúng hai khoản, số dư 5.930.000');

  /* lệch KHÔNG giải thích được: một khoản cũ bị xóa (không để lại dấu) */
  db=dung(); db.txns.splice(0,1); ctx.__set(db,T9);
  F.chotGhiLech(); db=ctx.__db();
  ok(db.chot[K9].tong===5940000&&db.chotLS.length===1&&db.chotLS[0].lech===1&&!db.chotLS[0].sau.length,'lệch do xóa khoản cũ → vẫn ghi nhận, đánh dấu lech, KHÔNG bịa ra khoản nào');
  ctx.__cur(T9); ctx.__mo('lsChot'); h=F.khoiTongKet();
  ok(h.includes('không rõ từng khoản')&&!h.includes('chotVe('),'lịch sử ghi "không rõ từng khoản" và KHÔNG có nút quay về lần 1');
  eq(hoi.length,0,'không hộp confirm() nào');
}

console.log('\nD5 · Cho mượn không phải khoản hạn mức (Vy 11/10/2026)');
{
  HOM='2026-10-05'; const db=so(); db.batDau='2026-09-01'; db.income=15000000; db.budgets={an:1000000};
  db.txns.push({id:nid++,d:'2026-10-02',t:'chi',a:500000,c:'muon',s:'bidv',n:'Cho bạn mượn'});
  ctx.__set(db,T10); ctx.__tab('budget'); const h=F.vBudget(); ctx.__tab('home');
  ok(h.includes('Hạn mức Ăn uống'),'tab Ngân sách vẫn có ô hạn mức Ăn uống');
  ok(!h.includes('Hạn mức Cho mượn')&&!h.includes("setB('muon'")&&!h.includes("toggleRoll('muon')"),'KHÔNG có ô hạn mức, KHÔNG có chip cộng dồn cho Cho mượn');
  ok(!h.includes('Hạn mức Trả nợ'),'Trả nợ cũng không có ô hạn mức');
  ok(F.vHome().includes('Tiền đang cho vay'),'tiền cho mượn vẫn hiện ở dòng (4) Tiền đang cho vay');
}

console.log('\nE · Sổ cũ');
{
  const cu=F.migrate({txns:[],v:10,goals:[],opens:{}});
  ok(cu.v===14&&cu.nsChot&&cu.chot&&!Object.keys(cu.chot).length&&cu.batDau===''&&Array.isArray(cu.chotLS),'sổ v10 qua migrate → v14, chot rỗng, batDau trống (sẽ hỏi), nhật ký chốt rỗng');
  ok((SRC_APP.match(/if\(\(d\.v\|\|1\)<14\)d=migrate\(d\);/g)||[]).length===2,'load VÀ khôi phục sao lưu đều chạy migrate khi sổ dưới v14');
}

console.log('\nF · Khoản cố định chỉ khớp giao dịch CÙNG NHÓM (lỗi 26/09/2026)');
{
  HOM='2026-09-28'; const db=so();
  db.fixedItems=[{id:'fx1',name:'Tiền ăn gửi nhà',code:'an',a:3000000,mp:'7600000000'}];
  db.txns.push({id:nid++,d:'2026-09-07',t:'chi',a:1500000,c:'an_ngoai',s:'bidv',p:'7600000000',n:'Chuyển tiền ăn'},
               {id:nid++,d:'2026-09-17',t:'chi',a:1500000,c:'an_ngoai',s:'bidv',p:'7600000000',n:'Chuyển tiền ăn'},
               {id:nid++,d:'2026-09-26',t:'chi',a:1500000,c:'muon',s:'bidv',p:'7600000000',n:'Cho mẹ mượn'});
  ctx.__set(db,T9);
  const fp=ctx.__fp(db.fixedItems[0],T9), p=ctx.__pace(T9);
  eq(fp.tien,3000000,'tiền ăn đã trả = 1.500.000 × 2 = 3.000.000 (KHÔNG phải 4.500.000)');
  ok(!fp.rows.some(t=>t.c==='muon'),'khoản Cho mượn cùng số tài khoản KHÔNG bị tính là tiền ăn');
  eq(p.choMuon,1500000,'nhịp tiêu thấy đủ 1.500.000 cho mượn');
}

console.log('\nG · Bắt đầu theo dõi từ (v=12) — lỗi 28/09: một giao dịch gõ nhầm ngày 09/04 làm app yêu cầu chốt tháng 8');
{
  HOM='2026-09-28'; const db=so(); db.ngayOK={'2026-09-14':1,'2026-09-21':1};
  db.txns.push({id:nid++,d:'2026-04-09',t:'mv',a:10000,s:'bidv',s2:'vi',n:'Nạp ví (gõ nhầm ngày)'});
  ctx.__set(db,T9);
  ok(F.chotCan()&&F.chotCan().k==='2026-08','CHƯA đặt ngày bắt đầu: tái hiện đúng lỗi — app yêu cầu chốt tháng 8');
  eq(ctx.__goiY(),'2026-09-01','gợi ý = 01/09: tháng đầu tiên có từ 10 giao dịch, bỏ qua giao dịch lẻ tháng 4');
  appEl.innerHTML=""; ctx.__render();
  ok(appEl.innerHTML.includes('Bắt đầu theo dõi từ ngày nào?'),'chưa đặt → hộp thoại hiện lên');
  ok(!appEl.innerHTML.includes('bd-huy'),'hộp thoại BẮT BUỘC: không có nút Hủy');
  ok(appEl.innerHTML.includes('không yêu cầu chốt sổ')&&!/đòi chốt|không bắt/.test(appEl.innerHTML),'chữ "không yêu cầu", không "đòi", không "bắt"');
  O={}; o('bd-ngay','01/10/26'); o('bd-loi','');
  ctx.__luuBD(); ok(!db.batDau&&/chưa tới/.test(O['bd-loi'].textContent),'ngày chưa tới (01/10) → không lưu, báo ngay trong hộp thoại');
  O={}; o('bd-ngay','01/09/26'); o('bd-loi','');
  ctx.__luuBD(); eq(db.batDau,'2026-09-01','lưu 01/09/26 → 2026-09-01');
  ctx.__set(db,T9);
  ok(F.chotCan()===null,'đặt 01/09 rồi → ngày 28/09 KHÔNG yêu cầu chốt tháng 8 nữa');
  appEl.innerHTML=""; ctx.__render();
  ok(!appEl.innerHTML.includes('Bắt đầu theo dõi từ ngày nào?'),'đã đặt → hộp thoại không hiện nữa');
  HOM='2026-10-01'; ctx.__set(db,T10);
  const c=F.chotCan();
  ok(c&&c.k==='2026-09'&&!c.trong.includes('2026-04-09'),'ngày 01/10 vẫn yêu cầu chốt tháng 9 như thường');
  HOM='2026-09-28'; db.batDau='2026-09-10'; ctx.__set(db,T10);
  HOM='2026-10-01'; ctx.__set(db,T10);
  ok(!F.chotCan().trong.some(d=>d<'2026-09-10'),'ngày trống TRƯỚC ngày bắt đầu không bị kể là chưa ghi');
  ctx.__moBD(); appEl.innerHTML=""; ctx.__render();
  ok(appEl.innerHTML.includes('bd-huy')&&appEl.innerHTML.includes('value="10/09/26"'),'mở lại từ Cài đặt: có nút Hủy, điền sẵn ngày đang đặt');
}

console.log('\nH · Tổng quan gọn (v=12)');
{
  HOM='2026-09-28'; const db=so(); db.batDau='2026-09-01';
  db.bm={'2026-09':{tk:2000000}}; db.budgets={tk:2000000};
  db.txns.push({id:nid++,d:'2026-09-10',t:'chi',a:300000,c:'muon',s:'bidv',n:'Cho mượn'},
               {id:nid++,d:'2026-09-12',t:'chi',a:500000,c:'tk_gui',s:'bidv',n:'Gửi tiết kiệm'});
  ctx.__set(db,T9); const h=F.vHome(), bt=F.bangTien(T9);
  ok(h.includes('<div class="sum">'+M(bt.tongRa)+'</div>'),'"Đã chi" = đúng dòng (3) Thực chi '+M(bt.tongRa));
  ok(!h.includes('<div class="sum">'+M(bt.tongRa+300000)+'</div>'),'"Đã chi" KHÔNG gồm 300.000 cho mượn');
  ok(h.indexOf('<b>Mục tiêu</b>')>=0&&h.indexOf('<b>Mục tiêu</b>')<h.indexOf('id="sec-bal"'),'khối Mục tiêu nằm ĐẦU trang, trên thanh số dư');
  ok(h.includes('<span class="l">Tiết kiệm tháng 9</span>')&&h.includes('<b>'+M(500000)+'</b> <span>/ '+M(2000000)+'</span>'),'dòng Tiết kiệm tháng 9: 500.000 / 2.000.000');
  ok(h.includes('<span class="mt-pc thieu">25%</span>'),'mỗi mục tiêu MỘT dòng, kèm phần trăm 25%');
  ok(!h.includes('Mục tiêu đang thực hiện'),'KHÔNG còn khối "Mục tiêu đang thực hiện" ở cuối trang');
}

console.log('\nI · Cơ cấu chi tiêu và Xu hướng = Thực chi + cho mượn chưa thu về (Vy duyệt 11/10/2026)');
{
  HOM='2026-10-08'; const db=so(); db.batDau='2026-09-01';
  db.txns.push(
    {id:nid++,d:'2026-09-10',t:'chi',a:500000,c:'muon',s:'bidv',n:'Cho bạn mượn'},
    {id:nid++,d:'2026-09-20',t:'thu',a:200000,c:'thuno',s:'bidv',n:'Bạn trả bớt'},
    {id:nid++,d:'2026-09-12',t:'chi',a:300000,c:'trano_cn',s:'bidv',n:'Trả nợ chị Hà'},
    {id:nid++,d:'2026-09-25',t:'chi',a:150000,c:'trano_gop',s:'bidv',n:'Trả góp'},
    {id:nid++,d:'2026-10-02',t:'chi',a:40000,c:'an_ngoai',s:'tm',n:'Ăn'},
    {id:nid++,d:'2026-10-03',t:'chi',a:50000,c:'muon',s:'bidv',n:'Cho mượn tháng 10'},
    {id:nid++,d:'2026-10-05',t:'thu',a:80000,c:'thuno',s:'bidv',n:'Thu nợ tháng 10'});
  ctx.__set(db,T9);
  const c9=ctx.__cc(T9), b9=F.bangTien(T9), nh=Object.fromEntries(c9.nhom);
  eq(c9.tong,720000,'tháng 9: ăn 270.000 + trả góp 150.000 + cho mượn chưa thu về 300.000 = 720.000');
  eq(c9.tong,b9.tongRa+Math.max(0,b9.choRong),'…đúng bằng (3) Thực chi + (4) Tiền đang cho vay');
  eq(nh.muon,300000,'ô Cho mượn = 500.000 − 200.000 đã thu về = 300.000 (KHÔNG phải 500.000)');
  eq(nh.trano,150000,'ô Trả nợ chỉ còn trả góp 150.000; trả nợ cá nhân 300.000 KHÔNG tính');
  let h=F.vHome();
  ok(h.includes('<b>Cơ cấu chi tiêu</b><em>'+M(720000)+'</em>'),'Tổng quan tháng 9 ghi Cơ cấu chi tiêu 720.000');
  ok(!h.includes('<em>'+M(1220000)+'</em>'),'KHÔNG còn con số cũ 1.220.000 (cộng mọi khoản chi)');
  ctx.__set(db,T10);
  const c10=ctx.__cc(T10);
  ok(c10.tong===40000&&!c10.nhom.some(x=>x[0]==='muon'),'tháng 10: thu nợ 80.000 nhiều hơn cho mượn 50.000 → KHÔNG có ô Cho mượn, tổng 40.000');
  ctx.__tab('trend'); h=ctx.__trend(); ctx.__tab('home');
  ok(h.includes('>'+M(760000)+'<'),'Xu hướng: tổng sáu tháng 720.000 + 40.000 = 760.000');
  ok(h.includes('trung bình '+M(380000)+' mỗi tháng · tính trên 2 tháng có ghi chép'),'trung bình 380.000 = 760.000 ÷ 2 tháng có ghi chép');
  ok(!h.includes('trung bình '+M(Math.round(760000/6))+' mỗi tháng'),'KHÔNG còn chia cứng cho 6 (126.667)');
  ok(h.includes('Đường đứt là mức trung bình 2 tháng có ghi chép'),'chú thích đường đứt ghi đúng 2 tháng');
}

console.log('\nJ · Nợ và cho vay: tháng nào tính tháng đó; ô Cho mượn chỉ liệt kê khoản chưa thu (Vy 11/10/2026)');
{
  HOM='2026-10-08'; const db=so(); db.batDau='2026-09-01';
  db.debts=[{id:'dA',name:'Lan',kind:'cho',mode:'canhan',principal:500000,start:'2026-09-10'},
            {id:'dB',name:'Minh',kind:'cho',mode:'canhan',principal:70000,start:'2026-09-15'},
            {id:'dC',name:'Hoa thang muoi',kind:'cho',mode:'canhan',principal:50000,start:'2026-10-03'}];
  db.txns.push(
    {id:nid++,d:'2026-09-10',t:'chi',a:500000,c:'muon',s:'bidv',n:'Lan'},
    {id:nid++,d:'2026-09-15',t:'chi',a:70000,c:'muon',s:'bidv',n:'Minh'},
    {id:nid++,d:'2026-09-18',t:'thu',a:70000,c:'thuno',s:'bidv',n:'Minh tra',debt:'dB'},
    {id:nid++,d:'2026-09-20',t:'thu',a:200000,c:'thuno',s:'bidv',n:'Lan tra bot',debt:'dA'},
    {id:nid++,d:'2026-10-03',t:'chi',a:50000,c:'muon',s:'bidv',n:'Hoa thang muoi'},
    {id:nid++,d:'2026-10-05',t:'thu',a:100000,c:'thuno',s:'bidv',n:'Lan tra tiep',debt:'dA'});
  ctx.__set(db,T9);
  const n9=ctx.__no(T9);
  eq(n9.cho.length,2,'Tổng kết tháng 9: chỉ 2 khoản cho vay của tháng 9, KHÔNG có khoản tháng 10');
  ok(n9.cvTong===570000&&n9.cvThu===270000&&n9.tong.cho===300000,'đã cho vay 570.000 · đã thu tới hết tháng 9: 270.000 · còn phải thu 300.000');
  ok(n9.cho.find(x=>x.dt.id==='dA').paid===200000,'khoản Lan: tiền thu ngày 05/10 KHÔNG tính vào tháng 9 (200.000, không phải 300.000)');
  eq(n9.tong.cho,F.bangTien(T9).choRong,'còn phải thu cuối tháng 9 = dòng (4) của tháng 9');
  ok(!F.vHome().includes('Hoa thang muoi'),'trang tháng 9 KHÔNG nhắc tới khoản cho vay của tháng 10');
  const n10=ctx.__no(T10);
  ok(n10.cho.length===3&&n10.tong.cho===250000,'Tổng kết tính tới hết tháng 10: 3 khoản, còn phải thu 250.000');
  const m=ctx.__mct(T9);
  ok(m.rows.length===1&&m.rows[0].a===500000&&m.le===200000,'ô Cho mượn tháng 9: khoản Minh đã thu đủ nên KHÔNG liệt kê; còn khoản Lan 500.000 và dòng "đã thu về một phần" 200.000');
  eq(m.rows.reduce((s,t)=>s+t.a,0)-m.le,ctx.__cc(T9).muon,'tổng các dòng − phần thu lẻ = con số trên ô Cho mượn');
  ctx.__mo('txCode'); ctx.__moV('txCode','muon'); const h=F.vHome();
  ok(h.includes('1 khoản chưa thu về · '+M(300000))&&h.includes('Đã thu về một phần'),'chạm ô Cho mượn: tiêu đề "1 khoản chưa thu về · 300.000"');
  ok(!h.includes('<div class="tx-n">Minh</div>'),'KHÔNG liệt kê khoản đã thu về');
}

console.log('\nK · Chọn nhóm xong không nhảy về đầu trang (lỗi Vy báo 11/10/2026)');
{
  const db=so(); db.batDau='2026-09-01'; ctx.__set(db,T9);
  const cuon=[]; ctx.scrollTo=(x,y)=>{cuon.push(y);ctx.scrollY=y;};
  ctx.__render(); ctx.scrollY=900;
  ctx.__picker(1);
  eq(cuon[cuon.length-1],0,'mở bảng chọn nhóm: bảng hiện từ đầu');
  ctx.scrollY=40; ctx.__picker(0);
  eq(cuon[cuon.length-1],900,'chọn xong: trang trở về đúng chỗ đang xem (900), KHÔNG về đầu trang');
  ctx.scrollY=900; ctx.__render();
  eq(cuon[cuon.length-1],900,'bấm trong trang (tick chọn) vẫn giữ nguyên chỗ');
  ctx.scrollTo=()=>{}; ctx.scrollY=0;
}

console.log('\nL · Vượt hạn mức chưa bù thì trừ vào hạn mức tháng sau (Vy duyệt 11/10/2026)');
{
  HOM='2026-10-08'; const db=so(); db.batDau='2026-09-01';
  db.budgets={an:200000,cho:100000,di:100000};
  /* Chợ vượt 50.000 nhưng đã bù từ Di chuyển → KHÔNG bị trừ */
  db.txns.push({id:nid++,d:'2026-09-05',t:'chi',a:150000,c:'cho_vat',s:'bidv',n:'Chợ'});
  db.offsets=[{m:'2026-09',from:'di',to:'cho',a:50000}];
  db.bm={'2026-10':{an:30000}};
  ctx.__set(db,T10);
  eq(ctx.__nv('an',T10),70000,'Ăn uống tháng 9: chi 270.000 − hạn mức 200.000 = vượt 70.000 phải trừ');
  eq(ctx.__tv('an',T10),30000,'tháng 10 hạn mức Ăn uống chỉ 30.000 → trừ được 30.000');
  eq(ctx.__nv('an',new Date(2026,10,1)),40000,'phần chưa trừ hết 40.000 dồn sang tháng 11');
  eq(ctx.__nv('cho',T10),0,'Chợ vượt nhưng đã bù đủ từ Di chuyển → KHÔNG trừ');
  eq(ctx.__nv('di',T10),0,'Di chuyển không vượt → không trừ');
  eq(ctx.__pace(T10).duTru,0+100000+100000,'hạn mức linh hoạt tháng 10 = Ăn uống 30.000 − 30.000 + Chợ 100.000 + Di chuyển 100.000');
  eq(ctx.__nv('an',T9),0,'tháng 9 là tháng bắt đầu theo dõi: không có gì từ tháng 8 trừ sang');
  db.roll={an:1}; ctx.__set(db,T10);
  ok(ctx.__ci('an',new Date(2026,10,1))>=0,'nhóm bật cộng dồn: phần vượt KHÔNG bị trừ lần hai qua hạn mức tồn');
  ctx.__set(db,T9); const h=F.vHome();
  ok(h.includes('Trừ vào hạn mức tháng 10')&&h.includes('Trừ vào tháng 10 tổng cộng')&&h.includes('−'+M(70000)),'Tổng kết tháng 9: dòng "Trừ vào hạn mức tháng 10" và tổng −70.000');
  ok(!/Chưa bù/.test(h)&&!/bị trừ tổng cộng/.test(h),'KHÔNG còn chữ "Chưa bù", KHÔNG còn "Tháng 10 bị trừ tổng cộng"');
  ctx.__set(db,T10); const h10=F.vHome();
  ok(!h10.includes('tr-bao')&&!/bị trừ vì tháng 9 vượt/.test(h10),'Tổng quan tháng 10 KHÔNG có khối báo trừ ở đầu trang');
}

console.log('\nM · Bộ lọc tab Giao dịch: nhóm, nguồn tiền, ngày (Vy duyệt 11/10/2026)');
{
  HOM='2026-10-08'; const db=so(); db.batDau='2026-09-01';
  db.txns.push({id:nid++,d:'2026-10-02',t:'chi',a:40000,c:'an_ngoai',s:'bidv',n:'Cơm'},
    {id:nid++,d:'2026-10-03',t:'chi',a:60000,c:'an_cafe',s:'tm',n:'Cà phê'},
    {id:nid++,d:'2026-10-05',t:'chi',a:90000,c:'cho_vat',s:'tm',n:'Chợ'},
    {id:nid++,d:'2026-10-06',t:'mv',a:100000,s:'bidv',s2:'vi',n:'Nạp ví'},
    {id:nid++,d:'2026-10-07',t:'thu',a:5000000,c:'luong',s:'bidv',n:'Lương'});
  ctx.__set(db,T10); ctx.__tab('list'); F.locXoa();
  const ten=()=>ctx.__lf().map(t=>t.n).sort().join(',');
  F.locNhom('an'); eq(ten(),'Cà phê,Cơm','lọc nhóm Ăn uống: Cơm + Cà phê (cả hai mục con)');
  F.locNhom('cho'); eq(ten(),'Chợ,Cà phê,Cơm','chọn thêm Chợ: được nhiều nhóm cùng lúc');
  F.locNguon('tm'); eq(ten(),'Chợ,Cà phê','thêm nguồn Tiền mặt: chỉ còn khoản trả tiền mặt');
  F.locXoa(); F.locNguon('vi'); eq(ten(),'Nạp ví','nguồn Ví: có cả khoản chuyển BIDV → Ví');
  F.locXoa(); F.locNgay('2026-10-03','2026-10-05'); eq(ten(),'Chợ,Cà phê','khoảng ngày 03/10 → 05/10');
  ctx.__moV('loc',1); const h=ctx.__list();
  ok(h.includes('Ăn uống <small>2</small>')&&h.includes('Lương <small>1</small>'),'bảng lọc liệt kê nhóm có giao dịch, kèm số giao dịch');
  ok(!h.includes('Di chuyển <small>'),'KHÔNG hiện nhóm không có giao dịch trong tháng');
  ok(h.includes('Lọc · 1')&&h.includes('03/10 → 05/10 ✕')&&h.includes('Xóa hết bộ lọc'),'nút "Lọc · 1" và nhãn bộ lọc đang bật có ✕');
  F.locNhom('an'); ctx.__move(-1);
  ok(ctx.__loc().tu===''&&ctx.__loc().nhom.join()==='an','sang tháng khác: bỏ khoảng ngày, giữ nhóm đang lọc');
  ctx.__tab('home'); F.locXoa();
}

console.log('\nN · Tổng kết: khối Nợ giống Tổng quan (Vy duyệt 11/10/2026)');
{
  HOM='2026-10-08'; const db=so(); db.batDau='2026-09-01';
  db.debts=[{id:'dA',name:'Lan',kind:'cho',mode:'canhan',principal:500000,start:'2026-09-10'},
            {id:'dN',name:'Trả góp máy',kind:'no',mode:'gop',per:100000,periods:10,principal:1000000,start:'2026-09-25'}];
  db.txns.push({id:nid++,d:'2026-09-10',t:'chi',a:500000,c:'muon',s:'bidv',n:'Lan'},
    {id:nid++,d:'2026-09-25',t:'chi',a:100000,c:'trano_gop',s:'bidv',n:'Trả góp máy',debt:'dN'});
  ctx.__set(db,T9); const h=F.vHome();
  ok(h.includes('<b>Nợ</b><em>tính tới hết 30/09</em>'),'tiêu đề "Nợ · tính tới hết 30/09"');
  ok(h.includes('↑ KHOẢN PHẢI TRẢ</div>\n          <div class="noso">'+M(900000))&&h.includes('↓ KHOẢN CHỜ THU</div>\n          <div class="noso">'+M(500000)),'hai ô: phải trả 900.000 · chờ thu 500.000');
  ok(h.includes('Xem từng khoản'),'có nút "Xem từng khoản"');
  ok(!h.includes('Tổng đã cho vay')&&!h.includes('<b>Đã cho vay</b>')&&!h.includes('<b>Khoản nợ</b>'),'KHÔNG còn hai khối cũ "Khoản nợ" / "Đã cho vay"');
}

console.log('\nO · Cộng dồn với hạn mức chung từ bản cũ; Tổng kết liệt kê đủ khoản nợ (Vy 11/10/2026)');
{
  HOM='2026-10-08'; const db=so(); db.batDau='2026-09-01';
  db.budgets={sk:200000}; db.bm={}; db.roll={sk:1};
  db.txns.push({id:nid++,d:'2026-09-12',t:'chi',a:132000,c:'sk_thuoc',s:'bidv',n:'Thuốc'});
  ctx.__set(db,T10);
  eq(ctx.__ci('sk',T10),68000,'Sức khỏe hạn mức chung 200.000 (chưa từng gõ theo tháng), chi 132.000 → tháng 10 hạn mức tồn 68.000');
  db.roll={}; ctx.__set(db,T10);
  eq(ctx.__ci('sk',T10),0,'tắt cộng dồn → KHÔNG có hạn mức tồn');
  db.batDau='2026-10-01'; db.roll={sk:1}; ctx.__set(db,T10);
  eq(ctx.__ci('sk',T10),0,'tháng 9 trước ngày bắt đầu theo dõi → KHÔNG dồn');

  const d2=so(); d2.batDau='2026-09-01';
  d2.debts=[{id:'dX',name:'Hà',kind:'cho',mode:'canhan',principal:70000,start:'2026-09-15'},
            {id:'dY',name:'Lan',kind:'cho',mode:'canhan',principal:500000,start:'2026-09-10'}];
  d2.txns.push({id:nid++,d:'2026-09-15',t:'chi',a:70000,c:'muon',s:'bidv',n:'Hà'},
    {id:nid++,d:'2026-09-18',t:'thu',a:70000,c:'thuno',s:'bidv',n:'Hà trả',debt:'dX'},
    {id:nid++,d:'2026-09-10',t:'chi',a:500000,c:'muon',s:'bidv',n:'Lan'});
  ctx.__set(d2,T9); const h=F.vHome();
  ok(h.includes('<div class="src-n">Hà</div>')&&h.includes('>đã xong</div>'),'Tổng kết: khoản Hà đã thu đủ VẪN được liệt kê, ghi "đã xong"');
  ok(h.indexOf('<div class="src-n">Lan</div>')<h.indexOf('<div class="src-n">Hà</div>'),'khoản còn dở (Lan) đứng trước khoản đã xong');
  ok(h.includes('1 khoản · tiền sẽ vào'),'ô Khoản chờ thu vẫn chỉ đếm khoản còn dở');
}

console.log('\nP · Sang tháng mới: chốt sổ xong thì bắt buộc lập và chốt ngân sách (Vy duyệt 11/10/2026)');
{
  HOM='2026-10-08'; const db=so(); db.batDau='2026-09-01'; db.income=10000000;
  db.budgets={an:200000,di:300000,tk:1000000}; db.roll={di:1};
  ctx.__set(db,T10);
  ok(!F.nsCan(),'tháng 9 CHƯA chốt sổ → chưa đòi lập ngân sách (bước 1 trước)');
  ok(!F.vHome().includes('ns-mo'),'…và Tổng quan KHÔNG bị làm mờ');
  db.chot={'2026-09':{luc:new Date('2026-10-01T20:28:00').getTime(),bidv:6000000,vi:0,tm:-70000,tong:5930000}};
  ctx.__set(db,T10);
  ok(F.nsCan()&&F.nsCan().k==='2026-10','chốt sổ tháng 9 rồi → tháng 10 cần chốt ngân sách');
  ctx.__render(); const a=appEl.innerHTML;
  ok(a.includes('Sang tháng 10')&&a.includes('Lập ngân sách tháng 10 →'),'đầu Tổng quan: khối "Sang tháng 10" và nút Lập ngân sách');
  ok(a.includes('Tháng 9 có <b>1 nhóm vượt</b> chưa bù (trừ '+M(70000)+' vào tháng 10), <b>1 nhóm dư</b> được cộng dồn (Di chuyển '+M(300000)+').'),'tóm tắt: 1 nhóm vượt (trừ 70.000), 1 nhóm dư cộng dồn (Di chuyển 300.000)');
  ok(a.indexOf('<div class="ns-mo" aria-hidden="true">')>a.indexOf('Lập ngân sách tháng 10 →'),'phần dưới khối bị làm mờ, khối thì không');
  ok(!/để sau|Để sau/.test(a),'KHÔNG có nút "để sau"');
  ctx.__tab('list'); ctx.__render(); ok(!appEl.innerHTML.includes('ns-mo'),'tab Giao dịch vẫn dùng bình thường, không mờ'); ctx.__tab('home');
  ctx.__moV('lns',1); ctx.__render(); const l=appEl.innerHTML;
  ok(l.includes('Lập ngân sách tháng 10')&&l.includes('chotNS()'),'màn Lập ngân sách tháng 10 có nút Chốt');
  ok(l.includes('Nguồn để chia</span><b>'+M(10000000-0-0)),'nguồn để chia 10.000.000 (không cố định, không nợ, không góp)');
  ok(l.includes('trong đó trừ vượt tháng 9</span><b>−'+M(70000))&&l.includes('Hạn mức sau khi bù trừ</span><b>'+M(430000)),'trừ vượt −70.000 · hạn mức sau khi bù trừ 500.000 − 70.000 = 430.000');
  ok(l.includes('Còn chưa chia</span><b><span style="color:var(--pos)">'+M(8500000)),'còn chưa chia = 10.000.000 − 500.000 − 1.000.000 = 8.500.000 (phần trừ vượt KHÔNG thành tiền chưa chia)');
  ok(l.includes('chi <b>'+M(270000)+'</b> → <span class="lns-kq am">vượt '+M(70000)+'</span>, không bù'),'thẻ Ăn uống: chi 270.000 → vượt 70.000, không bù');
  ok(l.includes('<span class="lns-kq duong">dư '+M(300000)+'</span>')&&l.includes('+ tồn '+M(300000)+' (rút khi cần)'),'thẻ Di chuyển: dư 300.000, tháng 10 có tồn 300.000');
  ok(l.includes('value="'+M(200000)+'"')&&l.includes('còn <b>'+M(130000)+'</b>'),'ô tháng 10 điền sẵn 200.000, còn 130.000 sau trừ vượt');
  F.chotNS(); const d2=ctx.__db();
  ok(d2.nsChot['2026-10']&&d2.nsChot['2026-10'].lh===430000,'chốt ngân sách: lưu lúc chốt và hạn mức linh hoạt 430.000');
  ctx.__render(); const b=appEl.innerHTML;
  ok(!b.includes('ns-mo')&&!b.includes('moLapNS()'),'chốt rồi: Tổng quan hết mờ, khối Sang tháng 10 biến mất');
  ok(b.includes('Đã chốt ngân sách tháng 10'),'dải xanh "Đã chốt ngân sách tháng 10"');
  HOM='2026-10-12'; ctx.__set(d2,T10); ctx.__render();
  ok(!appEl.innerHTML.includes('Đã chốt ngân sách tháng 10'),'4 ngày sau dải xanh tự ẩn');
  eq(hoi.length,0,'không hộp confirm() nào');
}

console.log('\nQ · Tab Nợ: hai ô giống Tổng quan, chỉ khoản tồn đọng, lịch sử ở màn riêng');
{
  HOM='2026-10-08'; const db=so(); db.batDau='2026-09-01';
  db.debts=[{id:'dA',name:'Lan',kind:'cho',mode:'canhan',principal:500000,start:'2026-09-10'},
            {id:'dB',name:'Minh',kind:'cho',mode:'canhan',principal:70000,start:'2026-09-15'},
            {id:'dC',name:'Chị Hà',kind:'no',mode:'canhan',principal:200000,start:'2026-09-02'}];
  db.txns.push({id:nid++,d:'2026-09-18',t:'thu',a:70000,c:'thuno',s:'bidv',n:'Minh trả',debt:'dB'},
               {id:nid++,d:'2026-09-07',t:'chi',a:200000,c:'trano_cn',s:'bidv',n:'Trả chị Hà',debt:'dC'});
  ctx.__set(db,T10); ctx.__tab('debt'); ctx.__render(); let h=appEl.innerHTML;
  ok(h.includes('↓ KHOẢN CHỜ THU</div><div class="noso">'+M(500000))&&h.includes('1 khoản · tiền sẽ vào')&&h.includes('0 khoản · tiền sẽ ra'),'hai ô: chờ thu 500.000 (1 khoản), phải trả 0');
  ok(h.includes('>Lan<')&&!h.includes('>Minh<')&&!h.includes('>Chị Hà<'),'danh sách chỉ còn khoản tồn đọng (Lan)');
  ok(h.includes('Lịch sử · 2 khoản đã xong')&&h.includes('moLsNo()'),'nút "Lịch sử · 2 khoản đã xong"');
  ctx.__moV('lsNo',1); ctx.__render(); h=appEl.innerHTML;
  ok(h.includes('Khoản nợ đã xong')&&h.includes('dongLsNo()'),'màn Lịch sử riêng, có nút ✕ đóng');
  ok(h.includes('↑ ĐÃ TRẢ XONG')&&h.includes('Chị Hà')&&h.includes('xong 07/09'),'phần Đã trả xong: Chị Hà, xong 07/09');
  ok(h.includes('↓ ĐÃ THU ĐỦ')&&h.includes('Minh')&&h.includes('thu đủ 18/09'),'phần Đã thu đủ: Minh, thu đủ 18/09');
  ok(!h.includes('>Lan<'),'khoản còn dở KHÔNG nằm trong lịch sử');
  ctx.__moV('lsNo',0); ctx.__tab('home');
}

console.log('\nR · Lọc giao dịch theo mục con (Vy duyệt 11/10/2026)');
{
  HOM='2026-10-08'; const db=so(); db.batDau='2026-09-01';
  db.txns.push({id:nid++,d:'2026-10-02',t:'chi',a:40000,c:'an_ngoai',s:'bidv',n:'Cơm'},
    {id:nid++,d:'2026-10-03',t:'chi',a:30000,c:'an_cafe',s:'tm',n:'Cà phê'},
    {id:nid++,d:'2026-10-04',t:'chi',a:35000,c:'an_cafe',s:'bidv',n:'Trà sữa'},
    {id:nid++,d:'2026-10-05',t:'chi',a:90000,c:'cho_vat',s:'tm',n:'Chợ'});
  ctx.__set(db,T10); ctx.__tab('list'); F.locXoa();
  const ten=()=>ctx.__lf().map(t=>t.n).sort().join(',');
  F.locNhom('an'); eq(ten(),'Cà phê,Cơm,Trà sữa','chạm Ăn uống: cả nhóm');
  ctx.__moV('loc',1); let h=ctx.__list();
  ok(h.includes('Ăn uống gồm')&&h.includes('Cả nhóm <small>3</small>')&&h.includes('Cà phê, trà chiều <small>2</small>'),'mở hàng mục con: Cả nhóm 3 · Cà phê, trà chiều 2');
  ok(!h.includes('Chợ, siêu thị gồm'),'nhóm chưa chọn thì KHÔNG mở hàng mục con');
  F.locCon('an','an_cafe'); eq(ten(),'Cà phê,Trà sữa','chọn mục Cà phê, trà: chỉ còn hai khoản đó');
  h=ctx.__list(); ok(h.includes('Ăn uống › Cà phê, trà chiều ✕'),'nhãn đang lọc "Ăn uống › Cà phê, trà chiều ✕"');
  F.locCon('an','an'); eq(ten(),'Cà phê,Cơm,Trà sữa','bấm "Cả nhóm": trở về cả nhóm');
  F.locNhom('an'); ok(!ctx.__loc().nhom.length,'chạm lại Ăn uống: bỏ chọn cả nhóm và mục con');
  F.locCon('an','an_ngoai'); F.locNhom('cho'); eq(ten(),'Chợ,Cơm','mục con của nhóm này + cả nhóm khác cùng lúc');
  ctx.__tab('home'); F.locXoa();
}

console.log(loi?'\n✗ '+loi+' lỗi':'\n✓ đạt hết');
process.exit(loi?1:0);
