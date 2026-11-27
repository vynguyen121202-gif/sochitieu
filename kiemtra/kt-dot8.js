/* Kiểm tra phác thảo đợt 8 (Vy duyệt 24/11/2026):
   1. Tách nhiều mục, mỗi mục chọn nhóm bất kỳ, kể cả "Ứng trước · nhận lại tiền mặt" / "Đổi tiền mặt".
   2. Nút ★ Thành tựu + bộ lọc.
   3. Gắn khoản hoàn vào khoản chi gốc: hoàn là chi âm trong nhóm gốc, tính vào tháng nhận hoàn.
   Ví dụ Vy duyệt: tiền xe 300.000 (05/10) − hoàn 70.000 (11/10) → Học tập 530.000 trên 600.000,
   Thực thu −70.000, Thực chi −70.000, số dư không đổi. Tên người là tên giả. */
const fs=require('fs'), path=require('path'), vm=require('vm');
const SRC_APP=fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8');
let code=SRC_APP.slice(0,SRC_APP.indexOf("try{\n  const mf="));
code+=`
globalThis.__set=(db,cur)=>{DB=db;cursor=cur;tab='list';open={};msg='';splitting=null;pending=null;chotHoi=null;hoanQ='';listF='all';rowOpen='';memoClear();};
globalThis.__sp=()=>splitting;
globalThis.__pend=p=>{pending=p;};
globalThis.__peek=()=>pending;
globalThis.__mo=id=>{rowOpen=id;};
globalThis.__lf=v=>{listF=v;};
globalThis.__f2={setAi,setAiP,commit,fixedOfGroup,applyBackup,vImport,needHoan,khoiHoanTay,hoanUngVien};
globalThis.__mn=o=>{mNhap=Object.assign(mNhap,o);};
globalThis.__msg=()=>msg;
globalThis.__f={splitStart,splitSet,splitMa,splitThem,splitXoa,splitSave,vSplit,coTach,togTT,vList,
  hoanUngVien,ganHoan,boHoan,daHoan,hoanGoc,balances,balAt,bangTien,spentOf,coCau,metrics,monthTx,monthRaw,groupOf,labelOf,codeList};`;
const R=Date, FD=class extends R{constructor(...a){if(!a.length)super('2026-11-24T10:00:00');else super(...a);}
  static now(){return new R('2026-11-24T10:00:00').getTime();}};
const el0={innerHTML:'',scrollIntoView(){},appendChild(){},click(){},remove(){},style:{},dataset:{},value:''};
const ctx={console,Intl,Date:FD,Math,JSON,Object,Array,String,Number,isNaN,parseInt,parseFloat,
  setTimeout:()=>0,clearTimeout(){},localStorage:{getItem:()=>null,setItem(){}},navigator:{},
  Blob:function(){},File:function(){},URL:{createObjectURL:()=>'x',revokeObjectURL(){}},
  confirm:()=>true, prompt:()=>null,
  document:{getElementById:id=>(id==='app'||id==='nav'||id==='hop'?el0:null),createElement:()=>el0,querySelector:()=>null,head:el0,body:el0,documentElement:el0}};
ctx.window=ctx; ctx.globalThis=ctx;
ctx.window.matchMedia=()=>({matches:false,addEventListener(){},addListener(){}});
ctx.window.scrollTo=()=>{}; ctx.window.scrollY=0;
vm.createContext(ctx); vm.runInContext(code,ctx,{filename:'app.js'});
const F=ctx.__f;

let loi=0;
const ok=(dk,t,them)=>{if(dk)console.log('  ✓ '+t);else{loi++;console.log('  ✗ '+t+(them?'\n      → '+them:''));}};
const eq=(a,b,t)=>ok(JSON.stringify(a)===JSON.stringify(b),t,'được '+JSON.stringify(a)+', cần '+JSON.stringify(b));
const T10=new Date(2026,9,1), T11=new Date(2026,10,1);

const so=()=>({v:15,txns:[
    {id:1,d:'2026-10-26',tm:'13:32',t:'chi',a:56000,c:'an_cafe',s:'bidv',n:'Trà sữa',b:5000000},
    {id:2,d:'2026-10-20',tm:'20:24',t:'thu',a:240000,c:'tkhac_hoan',s:'bidv',n:'Nhận tiền từ bạn C',b:5240000},
    {id:3,d:'2026-10-18',tm:'10:33',t:'chi',a:120000,c:'gd_sn',s:'bidv',n:'Mua bánh kem'},
    {id:4,d:'2026-10-05',tm:'11:46',t:'chi',a:300000,c:'ht',s:'bidv',n:'Tiền xe đi thiền khứ hồi'},
    {id:5,d:'2026-10-03',tm:'21:48',t:'chi',a:300000,c:'ht',s:'bidv',n:'Tiền xe đi thiền'},
    {id:6,d:'2026-10-11',tm:'15:33',t:'thu',a:70000,c:'tkhac_hoan',s:'bidv',n:'Tiền xe dư'},
    {id:7,d:'2026-10-10',t:'chi',a:500000,c:'muon',s:'bidv',n:'Cho bạn mượn'},
    {id:8,d:'2026-10-01',t:'thu',a:9000000,c:'luong',s:'bidv',n:'Lương'},
    {id:9,d:'2026-11-03',tm:'09:00',t:'thu',a:50000,c:'tkhac_hoan',s:'bidv',n:'Hoàn tiền Shopee'},
    {id:10,d:'2026-10-29',tm:'07:22',t:'chi',a:2000000,c:'gd',s:'bidv',n:'Chuyển tiền cho em mua xe'}],
  debts:[],budgets:{},bm:{},goals:[],fixedItems:[],roll:{},offsets:[],draws:[],income:0,rules:{},
  opens:{bidv:1000000,vi:0,tm:300000},checks:{},opts:{},chainOK:{},goalPlan:{},payDays:{k1:[5,10],k2:[15,25]},
  ngayOK:{},chot:{},chotLS:[],nsChot:{},lichThu:{},batDau:'2026-10-01'});
const tim=(db,f)=>db.txns.filter(f);
const khop=(d,ten)=>{const t=F.bangTien(d);eq(t.cuoi,F.balAt(d),ten||'bảng (1)…(5) vẫn cộng về đúng số dư cuối tháng');};

console.log('\nA · Mục mới Sinh nhật');
eq([F.groupOf('gd_sn').id,F.labelOf('gd_sn')],['gd','Sinh nhật'],'gd_sn = Gia đình & hiếu hỉ › Sinh nhật');
ok(F.codeList('chi').includes('gd_sn=Gia đình & hiếu hỉ › Sinh nhật'),'mã gd_sn có trong câu lệnh A.I');

console.log('\nB · Tách 56.000 = Cà phê 28.000 + Ứng trước 28.000');
let db=so(); ctx.__set(db,T10);
{const b0=F.balances(), an0=F.spentOf('an',T10);
  F.splitStart('txn','1');
  eq(ctx.__sp().rows.map(r=>[r.code,r.a]),[['an_cafe',28000],['',28000]],'mở ra hai mục: nhóm cũ + một mục trống, chia đôi');
  let h=F.vSplit();
  ok(h.includes('Ứng trước · nhận lại tiền mặt')&&h.includes('label="Gia đình &amp; hiếu hỉ"')&&h.includes('label="Sức khỏe"'),'ô chọn có MỌI nhóm chi + mục Ứng trước');
  ok(!h.includes('label="Lương"'),'dòng chi KHÔNG hiện nhóm thu');
  ok(/disabled onclick="splitSave\(\)"/.test(h),'mục chưa chọn nhóm → khóa nút Lưu');
  F.splitMa(1,'__ung'); h=F.vSplit();
  ok(!/disabled onclick="splitSave\(\)"/.test(h)&&h.includes('Tổng khớp 56.000.'),'chọn xong, tổng khớp → mở nút Lưu');
  F.splitSave(); ctx.__set(db,T10);
  const p=tim(db,x=>x.sg&&x.d==='2026-10-26');
  eq(p.map(x=>[x.t,x.c||'',x.s,x.s2||'',x.a,!!x.doi,x.tm,x.b]).sort(),
     [['chi','an_cafe','bidv','',28000,false,'13:32',5000000],['mv','','bidv','tm',28000,true,'13:32',5000000]].sort(),'lưu thành Cà phê 28.000 + BIDV → Tiền mặt 28.000, giữ giờ và số dư ngân hàng');
  ok(p[0].sg===p[1].sg&&!tim(db,x=>x.id===1).length,'hai mục chung nhóm tách, dòng gốc đã thay');
  const b1=F.balances();
  eq([b1.bidv-b0.bidv,b1.tm-b0.tm],[0,28000],'BIDV không đổi, Tiền mặt +28.000');
  eq(an0-F.spentOf('an',T10),28000,'Ăn uống bớt 28.000');
  khop(T10);}

console.log('\nC · Tách 240.000 = Hoàn tiền 40.000 + Đổi tiền mặt 200.000');
db=so(); ctx.__set(db,T10);
{const b0=F.balances();
  F.splitStart('txn','2'); let h=F.vSplit();
  ok(h.includes('Đổi tiền mặt')&&!h.includes('Ứng trước · nhận lại'),'dòng thu có mục Đổi tiền mặt, không có Ứng trước');
  ok(h.includes('label="Thu khác"')&&!h.includes('label="Ăn uống"'),'dòng thu chỉ hiện nhóm thu');
  F.splitSet(0,'40.000'); F.splitSet(1,'200.000'); F.splitMa(1,'__doi'); F.splitSave(); ctx.__set(db,T10);
  const p=tim(db,x=>x.sg&&x.d==='2026-10-20').map(x=>[x.t,x.c||'',x.s,x.s2||'',x.a]).sort();
  eq(p,[['mv','','tm','bidv',200000],['thu','tkhac_hoan','bidv','',40000]].sort(),'lưu thành Hoàn tiền 40.000 + Tiền mặt → BIDV 200.000');
  const b1=F.balances(); eq([b1.bidv-b0.bidv,b1.tm-b0.tm],[0,-200000],'BIDV không đổi, Tiền mặt −200.000');
  khop(T10);}

console.log('\nD · Tách: điều kiện và giới hạn');
db=so(); ctx.__set(db,T10);
{F.splitStart('txn','10'); F.splitThem(); eq(ctx.__sp().rows.length,3,'+ Thêm mục: ba mục');
  F.splitMa(1,'gd_sn'); F.splitMa(2,'gt_dichoi'); F.splitSet(0,'1.000.000'); F.splitSet(1,'500.000'); F.splitSet(2,'400.000');
  ok(F.vSplit().includes('Còn thiếu 100.000 chưa phân.'),'tổng thiếu → báo còn thiếu');
  F.splitSet(2,'500.000'); F.splitSave(); ctx.__set(db,T10);
  eq(tim(db,x=>x.d==='2026-10-29').map(x=>x.c).sort(),['gd','gd_sn','gt_dichoi'],'ba mục ba nhóm khác nhau');}
db=so(); ctx.__set(db,T10);
{F.splitStart('txn','1'); F.splitXoa(0); eq(ctx.__sp().rows.length,2,'không bỏ được xuống dưới 2 mục');}
{const t={t:'thu',a:1,c:'thuno',debt:'d1'}; ok(!F.coTach(t),'dòng đã gắn sổ nợ không có nút tách');
  ok(!F.coTach({t:'mv',a:1}),'dòng chuyển nguồn không có nút tách');}
db=so(); ctx.__set(db,T10);
{ctx.__pend([Object.assign({},db.txns[0],{keep:true})]); F.splitStart('pending',0); F.splitMa(1,'__ung'); F.splitSave();
  eq(ctx.__peek().map(x=>[x.t,x.a,x.s2||'']),[['chi',28000,''],['mv',28000,'tm']],'tab Nhập: tách trước khi lưu cũng được');}

console.log('\nE · ★ Thành tựu');
db=so(); ctx.__set(db,T10);
{F.togTT('10'); ok(db.txns.find(x=>x.id===10).tt===1,'bấm → đánh dấu');
  ctx.__mo('10'); let h=F.vList(); ok(h.includes('★ Thành tựu</span>')&&h.includes('Bỏ ★ Thành tựu'),'dòng có huy hiệu, nút đổi thành Bỏ');
  ctx.__lf('tt'); h=F.vList(); ok(h.includes('Chuyển tiền cho em mua xe')&&!h.includes('Trà sữa'),'bộ lọc ★ Thành tựu chỉ hiện dòng đã đánh dấu');
  F.togTT('10'); ok(!('tt' in db.txns.find(x=>x.id===10)),'bấm lần nữa → bỏ đánh dấu');}

console.log('\nF · Gắn khoản hoàn — ví dụ Vy duyệt (tiền xe)');
db=so(); ctx.__set(db,T10);
{const t0=F.bangTien(T10), b0=F.balances(), cc0=F.coCau(T10).tong, m0=F.metrics(T10).thu;
  const uv=F.hoanUngVien(db.txns.find(x=>x.id===6)).map(x=>x.id);
  eq(uv,[4,5],'gợi ý: khoản chi trong 60 ngày trước, ≥ 70.000, mới nhất trước');
  ok(!uv.includes(7),'KHÔNG gợi ý khoản cho mượn');
  ok(!uv.includes(3),'KHÔNG gợi ý khoản chi SAU ngày nhận hoàn (bánh kem 18/10)');
  F.ganHoan('6','4'); ctx.__set(db,T10);
  const t1=F.bangTien(T10), b1=F.balances();
  eq(t0.tongVao-t1.tongVao,70000,'(2) Thực thu bớt 70.000');
  eq(t0.tongRa-t1.tongRa,70000,'(3) Thực chi bớt 70.000');
  eq(F.spentOf('ht',T10),530000,'Học tập 600.000 → 530.000');
  eq([b1.bidv,b1.tm],[b0.bidv,b0.tm],'số dư từng nguồn không đổi');
  eq(cc0-F.coCau(T10).tong,70000,'Cơ cấu chi tiêu bớt 70.000');
  eq(m0-F.metrics(T10).thu,70000,'thu nhập (lương + thưởng + thu khác) bớt 70.000 — hoàn không phải tiền kiếm được');
  khop(T10);
  ctx.__mo('4'); let h=F.vList();
  ok(h.includes('>đã hoàn 70.000</div>')&&h.includes('<span class="tx-tc">thực chi 230.000</span>'),'khoản gốc ghi "đã hoàn 70.000"; "thực chi 230.000" nằm bên phải, dưới số tiền');
  ok(!h.includes('đã hoàn 70.000 · thực chi'),'KHÔNG còn "thực chi" nằm bên trái');
  ok(h.includes('hoàn cho "Tiền xe đi thiền khứ hồi"'),'khoản hoàn ghi đang hoàn cho khoản nào');
  eq(F.monthRaw(T10).find(x=>x.id===6).t,'thu','danh sách Giao dịch vẫn hiện khoản hoàn là dòng THU như đã ghi');
  F.boHoan('6'); ctx.__set(db,T10); eq(F.spentOf('ht',T10),600000,'Bỏ gắn → về như cũ');}

console.log('\nG · Hoàn về tháng sau: trừ vào THÁNG NHẬN HOÀN');
db=so(); ctx.__set(db,T10);
{const gd10=F.spentOf('gd',T10); F.ganHoan('9','3'); ctx.__set(db,T10);
  eq(F.spentOf('gd',T10),gd10,'tháng 10 (tháng chi) KHÔNG đổi');
  eq(F.spentOf('gd',T11),-50000,'tháng 11 nhóm Gia đình −50.000');
  ok(!F.coCau(T11).nhom.some(n=>n[1]<=0),'Cơ cấu chi tiêu không vẽ ô âm');
  khop(T11,'bảng tháng 11 vẫn cộng về đúng số dư');}

console.log('\nH · Khoản gốc bị xóa → khoản hoàn trở lại là thu bình thường');
db=so(); ctx.__set(db,T10);
{F.ganHoan('6','4'); db.txns=db.txns.filter(x=>x.id!==4); ctx.__set(db,T10);
  ok(!F.hoanGoc(db.txns.find(x=>x.id===6)),'không còn gắn');
  ok(F.monthTx(T10).find(x=>x.id===6).t==='thu','tính lại là thu');}

console.log('\nI · Tách khoản gốc đã có khoản hoàn: khoản hoàn đi theo mục chi đầu tiên');
db=so(); ctx.__set(db,T10);
{F.ganHoan('2','10'); F.splitStart('txn','10'); F.splitSet(0,'1.500.000'); F.splitSet(1,'500.000'); F.splitMa(1,'gd_sn'); F.splitSave(); ctx.__set(db,T10);
  const r=db.txns.find(x=>x.id===2), g=F.hoanGoc(r);
  ok(g&&g.c==='gd'&&g.a===1500000,'khoản hoàn gắn sang mục Gia đình 1.500.000');}

console.log('\nK · Hai lần tách cùng một mili-giây vẫn ra hai nhóm khác nhau');
db=so(); ctx.__set(db,T10);
{F.splitStart('txn','1'); F.splitMa(1,'__ung'); F.splitSave();
  F.splitStart('txn','2'); F.splitSet(0,'40.000'); F.splitSet(1,'200.000'); F.splitMa(1,'__doi'); F.splitSave(); ctx.__set(db,T10);
  const sg=[...new Set(db.txns.filter(x=>x.sg).map(x=>x.sg))];
  eq(sg.length,2,'đồng hồ đứng yên mà vẫn ra 2 mã nhóm tách');}

console.log('\nL · Không còn đánh dấu "đã trả" bằng tay — phải có giao dịch');
db=so(); db.fixedItems=[{id:'fy',name:'Học phí yoga',a:550000,code:'ld',mp:'999'}];
db.fxDone={'2026-10':{fy:1}}; ctx.__set(db,T10);
{eq(ctx.__f2.fixedOfGroup('ld',T10).da,0,'sổ cũ còn dấu tay mà không có giao dịch → KHÔNG tính là đã trả');
  khop(T10,'bảng (1)…(5) vẫn khớp số dư dù sổ cũ còn dấu tay');
  db.txns.push({id:20,d:'2026-10-12',tm:'20:08',t:'chi',a:550000,c:'ld',s:'bidv',n:'Học phí yoga'}); ctx.__set(db,T10);
  eq(ctx.__f2.fixedOfGroup('ld',T10).da,550000,'có giao dịch thật → đã trả 550.000');
  khop(T10,'có giao dịch thật: bảng vẫn khớp');
  ok(!SRC_APP.includes('toggleFxDone'),'app không còn nút "đã trả" bấm tay');}

console.log('\nM · Khôi phục báo kèm tên file');
{const msg=[]; const fl=ctx.flash; ctx.__set(so(),T10);
  ctx.__f2.applyBackup(so(),'so-chi-tieu-sua.json');
  ok(/Đã khôi phục 10 giao dịch từ file "so-chi-tieu-sua\.json"\./.test(ctx.__msg()),'câu báo có số giao dịch VÀ tên file',ctx.__msg());}

console.log('\nJ · Sinh nhật của ai');
db=so(); ctx.__set(db,T10);
{ctx.__mo('3'); let h=F.vList(); ok(h.includes('placeholder="Sinh nhật của ai?"'),'dòng Sinh nhật mở ra có ô "Sinh nhật của ai?"');
  ctx.__mo('4'); ok(!F.vList().includes('Sinh nhật của ai?'),'dòng nhóm khác KHÔNG có ô này');
  ctx.__f2.setAi('3','  Bạn D  '); ctx.__set(db,T10);
  eq(db.txns.find(x=>x.id===3).ai,'Bạn D','lưu tên, bỏ khoảng trắng thừa');
  ok(F.vList().includes('Sinh nhật Bạn D'),'dòng ghi "Sinh nhật Bạn D"');
  ctx.__f2.setAi('3',''); ok(!('ai' in db.txns.find(x=>x.id===3)),'xóa trống → bỏ tên');
  ctx.__pend([{d:'2026-10-18',t:'chi',a:120000,c:'gd_sn',s:'bidv',n:'Bánh kem',keep:true}]); ctx.__f2.setAiP(0,'Bạn E');
  ctx.__f2.commit(); ctx.__set(db,T10);
  eq(db.txns.filter(x=>x.ai==='Bạn E').length,1,'tab Nhập: tên đi theo khi Lưu');}

console.log('\nK · Tab Nhập: khoản Hoàn tiền BẮT BUỘC gắn khoản chi gốc, kể cả khoản cùng lần nhập (Vy 27/11/2026)');
{db=so(); ctx.__set(db,T10); const n0=db.txns.length;
  const P=()=>[{d:'2026-10-26',tm:'18:10',t:'chi',a:120000,c:'gd_sn',s:'bidv',n:'Mua bánh kem cùng ngày',keep:true},
    {d:'2026-10-26',tm:'09:05',t:'chi',a:56000,c:'an_cafe',s:'bidv',n:'Trà sữa sáng',keep:true},
    {d:'2026-10-26',tm:'21:40',t:'thu',a:40000,c:'tkhac_hoan',s:'bidv',n:'Bạn gửi lại tiền bánh',keep:true},
    {d:'2026-10-26',tm:'22:00',t:'thu',a:259,c:'tkhac_lai',s:'bidv',n:'Lãi tháng',keep:true}];
  let p=P(); ctx.__pend(p);
  let h=ctx.__f2.vImport();
  ok(h.includes('Hoàn cho khoản chi nào?')&&h.includes('Cùng lần nhập này')&&h.includes('Mua bánh kem cùng ngày<small>26/10 · cùng ngày'),'hộp gắn hoàn hiện khoản chi CÙNG LẦN NHẬP, ghi "cùng ngày"');
  ok(h.includes('Trà sữa sáng<small>'),'khoản chi khác ≥ số hoàn cũng được gợi ý (Trà sữa 56.000)');
  ctx.__pend(P().concat([{d:'2026-10-26',t:'chi',a:30000,c:'an_cafe',s:'bidv',n:'Kẹo nhỏ',keep:true}]));
  ok(!ctx.__f2.vImport().includes('Kẹo nhỏ<small>'),'khoản chi NHỎ HƠN số hoàn (30.000 < 40.000) KHÔNG được gợi ý');
  ctx.__pend(p);
  eq((h.match(/Hoàn cho khoản chi nào\?/g)||[]).length,1,'chỉ dòng Hoàn tiền bị hỏi, dòng Lãi tháng KHÔNG');
  ok(/class="btn" disabled onclick="commit\(\)"/.test(h)&&h.includes('Còn 1 khoản hoàn tiền chưa chọn'),'chưa chọn → nút Lưu khóa, có dòng đỏ nhắc');
  ok(h.includes('Dòng tiền ròng')&&h.includes('−135.741'),'Dòng tiền ròng = 40.259 − 176.000 = −135.741');
  ctx.__f2.commit(); eq(db.txns.length,n0,'chưa chọn mà gọi Lưu → KHÔNG ghi gì');
  p[2].hoanP='p0'; ok(!ctx.__f2.needHoan(p[2]),'chọn khoản cùng lần nhập → hết bắt buộc');
  p[0].keep=false; ok(ctx.__f2.needHoan(p[2]),'bỏ chọn khoản gốc → lại bắt buộc');
  p[0].keep=true; ok(ctx.__f2.vImport().includes('chỉ còn tính <b>80.000</b>'),'hộp báo "chỉ còn tính 80.000"');
  ctx.__f2.commit(); ctx.__set(db,T10);
  const goc=db.txns.find(x=>x.n==='Mua bánh kem cùng ngày'), hoan=db.txns.find(x=>x.n==='Bạn gửi lại tiền bánh');
  ok(goc&&hoan&&String(hoan.hoan)===String(goc.id),'lưu xong: khoản hoàn gắn đúng id khoản chi vừa ghi');
  eq(F.monthTx(T10).filter(x=>x.n==='Mua bánh kem cùng ngày'||x.n==='Bạn gửi lại tiền bánh').reduce((s,x)=>s+(x.t==='chi'?x.a:-x.a),0),80000,
    'nhóm Sinh nhật tính ròng 120.000 − 40.000 = 80.000');
  ok(!db.txns.find(x=>x.n==='Lãi tháng').hoan,'dòng Lãi KHÔNG bị gắn');
  db=so(); ctx.__set(db,T10); p=P(); p[2].hoanP='khong'; ctx.__pend(p); ctx.__f2.commit(); ctx.__set(db,T10);
  ok(!('hoan' in db.txns.find(x=>x.n==='Bạn gửi lại tiền bánh')),'"Không thuộc khoản nào trong sổ" → lưu, không gắn');
  db=so(); ctx.__set(db,T10); p=P(); p[2].hoanP='4'; ctx.__pend(p); ctx.__f2.commit(); ctx.__set(db,T10);
  eq(String(db.txns.find(x=>x.n==='Bạn gửi lại tiền bánh').hoan),'4','chọn khoản đã có trong sổ → gắn đúng id đó');
  ctx.__mn({a:'40.000',d:'2026-10-26',hoan:'',hq:''});
  ok(ctx.__f2.khoiHoanTay().includes('Hoàn cho khoản chi nào?')&&ctx.__f2.khoiHoanTay().includes('bắt buộc'),'Ghi tay: cùng hộp bắt buộc');}

console.log('\n'+(loi?'✗ '+loi+' LỖI':'✓ ĐẠT HẾT'));
process.exit(loi?1:0);
