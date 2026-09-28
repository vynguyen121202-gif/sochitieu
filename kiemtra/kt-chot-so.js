/* Kiểm tra chốt sổ tháng (v=10). Đồng hồ giả, sổ dựng tay để biết trước từng con số. */
const fs=require('fs'), path=require('path'), vm=require('vm');
const SRC_APP=fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8');
let code=SRC_APP.slice(0,SRC_APP.indexOf("try{\n  const mf="));
code+=`
globalThis.__set=(db,cur)=>{DB=db;cursor=cur||new Date();tab='home';open={};msg='';chotXN={};chotThat={};memoClear();};
globalThis.__f={chotCan,khoiChot,vHome,khongTieu,chotKhop,chotSo,chotDieuChinh,hoiChot,del,setDate,balAt,migrate,
  bangTien,khoiTongKet};
globalThis.__that=(s,v)=>{chotThat[s]=v;};
globalThis.__cur=d=>{cursor=d;memoClear();};
globalThis.__fp=(it,d)=>fixedPaid(it,d);
globalThis.__pace=d=>pace(d);`;

let HOM='2026-10-01', hoi=[], traLoi=true;
const R=Date, FD=class extends R{constructor(...a){if(!a.length)super(HOM+'T09:00:00');else super(...a);}
  static now(){return new R(HOM+'T09:00:00').getTime();}};
const el={innerHTML:'',scrollIntoView(){},appendChild(){},click(){},remove(){},style:{},dataset:{},value:''};
const ctx={console,Intl,Date:FD,Math,JSON,Object,Array,String,Number,isNaN,parseInt,parseFloat,
  setTimeout:()=>0,clearTimeout(){},localStorage:{getItem:()=>null,setItem(){}},navigator:{},
  Blob:function(){},File:function(){},URL:{createObjectURL:()=>'x',revokeObjectURL(){}},
  confirm:q=>{hoi.push(q);return traLoi;}, prompt:()=>null,
  document:{getElementById:()=>el,createElement:()=>el,querySelector:()=>null,head:el,body:el,documentElement:el}};
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

console.log('\nD · Chốt rồi: con số đứng yên, sửa phải hỏi lại');
{
  HOM='2026-10-05'; const db=so(); db.ngayOK={'2026-09-14':1,'2026-09-21':1,'2026-09-30':1};
  db.chot={'2026-09':{luc:new Date('2026-10-01T09:12:00').getTime(),bidv:6000000,vi:0,tm:-70000+0,tong:5930000}};
  ctx.__set(db,T9);
  let h=F.vHome();
  ok(h.includes('đã chốt 01/10'),'Tổng kết tháng 9 ghi "đã chốt 01/10"');
  ok(!h.includes('sau đó sửa'),'chưa sửa gì → KHÔNG có dòng "sau đó sửa"');
  const id=String(db.txns[0].id);
  hoi=[]; traLoi=false; F.del(id);
  ok(hoi.length===1&&/tháng 9\/2026 đã chốt sổ/i.test(hoi[0]),'xóa giao dịch tháng đã chốt → hỏi lại',hoi[0]);
  ok(db.txns.some(t=>String(t.id)===id),'bấm "Thôi" → KHÔNG xóa');
  hoi=[]; traLoi=false; F.setDate(String(db.txns[1].id),'05/10/26');
  ok(hoi.length===1&&db.txns[1].d==='2026-09-02','dời ngày giao dịch ra khỏi tháng đã chốt → hỏi; bấm Thôi thì giữ nguyên');
  hoi=[]; traLoi=true; F.del(id); ctx.__set(db,T9);
  ok(!db.txns.some(t=>String(t.id)===id),'bấm "Vẫn làm" → xóa');
  h=F.vHome();
  ok(h.includes('Đã chốt '+M(5930000)+' · sau đó sửa, nay '+M(5940000)+' · lệch +'+M(10000)),'Tổng kết ghi cả số đã chốt lẫn số hiện tại, lệch +10.000');
  eq(db.chot['2026-09'].tong,5930000,'số đã chốt ĐỨNG YÊN, không tự đổi theo giao dịch');
  hoi=[]; F.setDate(String(db.txns[2].id),'03/10/26');
  hoi=[]; const t10={id:nid++,d:'2026-10-02',t:'chi',a:1,c:'an_ngoai',s:'tm',n:'x'}; db.txns.push(t10);
  hoi=[]; traLoi=true; F.del(String(t10.id));
  eq(hoi.length,0,'xóa giao dịch tháng CHƯA chốt → KHÔNG hỏi');
  ok(F.hoiChot(['2026-10-02'])===true&&hoi.length===0,'hoiChot với tháng chưa chốt → cho làm luôn, không hỏi');
}

console.log('\nE · Sổ cũ');
{
  const cu=F.migrate({txns:[],v:10,goals:[],opens:{}});
  ok(cu.v===11&&cu.chot&&!Object.keys(cu.chot).length,'sổ v10 qua migrate → v11, chot rỗng (chưa chốt tháng nào)');
  ok(SRC_APP.includes("if((d.v||1)<11)d=migrate(d);"),'load và khôi phục sao lưu đều chạy migrate khi sổ dưới v11');
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

console.log(loi?'\n✗ '+loi+' lỗi':'\n✓ đạt hết');
process.exit(loi?1:0);
