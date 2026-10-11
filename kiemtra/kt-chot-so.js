/* Kiểm tra chốt sổ tháng (v=10). Đồng hồ giả, sổ dựng tay để biết trước từng con số. */
const fs=require('fs'), path=require('path'), vm=require('vm');
const SRC_APP=fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8');
let code=SRC_APP.slice(0,SRC_APP.indexOf("try{\n  const mf="));
code+=`
globalThis.__set=(db,cur)=>{DB=db;cursor=cur||new Date();tab='home';open={};msg='';chotXN={};chotThat={};chotHoi=null;memoClear();};
globalThis.__f={chotCan,khoiChot,vHome,khongTieu,chotKhop,chotSo,chotDieuChinh,hoiChot,del,setDate,balAt,migrate,
  bangTien,khoiTongKet,chotHoiOK,chotHoiHuy,khoiChotHoi,chotVe,chotLan,balSrcAt};
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
  ok(F.vHome().includes('Đã chốt sổ tháng 9'),'hiện dải xanh "Đã chốt sổ tháng 9"');
  HOM='2026-10-05'; ctx.__set(db,T10);
  ok(!F.vHome().includes('Đã chốt sổ tháng 9'),'4 ngày sau dải xanh tự ẩn');
  ok(!F.vHome().includes('chot-hd'),'…và khối chốt KHÔNG quay lại');
}

console.log('\nD · Sửa sau khi chốt: hộp xác nhận, bản chốt đi theo số mới (v=15, Vy duyệt 11/10/2026)');
const K9='2026-09', dem=(s,x)=>s.split(x).length-1;
{
  HOM='2026-10-05'; let db=so(); db.ngayOK={'2026-09-14':1,'2026-09-21':1,'2026-09-30':1};
  /* sổ v12 đã chốt, chưa có `goc` — đi qua migrate như sổ thật trên điện thoại */
  db.chot={[K9]:{luc:new Date('2026-10-01T09:12:00').getTime(),bidv:6000000,vi:0,tm:-70000,tong:5930000}};
  db.v=12; db=F.migrate(db);
  eq(JSON.stringify(db.chot[K9].goc),JSON.stringify({luc:db.chot[K9].luc,bidv:6000000,vi:0,tm:-70000,tong:5930000}),'migrate v12 → v13: lần 1 = đúng bản chốt đang có');
  ok(db.v===13&&Array.isArray(db.chotLS)&&!db.chotLS.length,'…sổ lên v13, nhật ký chốt rỗng');
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

console.log('\nE · Sổ cũ');
{
  const cu=F.migrate({txns:[],v:10,goals:[],opens:{}});
  ok(cu.v===13&&cu.chot&&!Object.keys(cu.chot).length&&cu.batDau===''&&Array.isArray(cu.chotLS),'sổ v10 qua migrate → v13, chot rỗng, batDau trống (sẽ hỏi), nhật ký chốt rỗng');
  ok((SRC_APP.match(/if\(\(d\.v\|\|1\)<13\)d=migrate\(d\);/g)||[]).length===2,'load VÀ khôi phục sao lưu đều chạy migrate khi sổ dưới v13');
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

console.log(loi?'\n✗ '+loi+' lỗi':'\n✓ đạt hết');
process.exit(loi?1:0);
