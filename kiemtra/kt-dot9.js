/* Đợt 27/11/2026 (Vy duyệt bằng số):
   1. Ứng trước (Cho mượn › Ứng trước) — phải nhận lại đủ; trong lúc chờ tính như cho mượn; tiền trả lại
      (tiền mặt hay chuyển khoản, nhiều lần) bắt buộc gắn khoản ứng; nhắc từ ngày thứ 2.
      Ví dụ Vy duyệt: bữa ăn 300.000 = Ăn uống 100.000 + Ứng trước 200.000 (05/11); nhận 80.000 tiền mặt (06/11)
      + 120.000 chuyển khoản (08/11) → Thực chi chỉ 100.000, (4) 120.000 rồi về 0.
   2. SPayLater — hóa đơn là khoản phải trả (dự trù tháng có hạn); khoản BIDV trả hóa đơn tách theo món, ghi
      ngày trả, mang tag; trả xong sang Lịch sử. Tên món, số tiền lấy từ hóa đơn Vy gửi (không có dữ liệu riêng). */
const fs=require('fs'), path=require('path'), vm=require('vm');
let code=fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8');
code=code.slice(0,code.indexOf("try{\n  const mf="));
code+=`
globalThis.__set=(db,cur)=>{DB=db;cursor=cur;tab='home';open={};msg='';pending=null;splMo=null;splNhap='';splLoi='';mNhap={a:'',n:'',s:'',d:'',han:''};memoClear();};
globalThis.__pend=p=>{pending=p;};
globalThis.__mo=id=>{splMo=id;};
globalThis.__f={bangTien,alerts,commit,vImport,needUng,ungCon,vList,vDebt,vLsNo,splDoc,splLuuHD,splTach,splDanTach,debtDue,thanhKhoan,
  coSpl,loaiNg,promptText,khoiUngTay,balAt,monthTx,doPaste};
globalThis.__bq=()=>boQua;globalThis.__pd=()=>pending;globalThis.__msg=()=>msg;
globalThis.__row=id=>{rowOpen=id;};
globalThis.__db=()=>DB;`;
let HOM='2026-11-07';
const R=Date, FD=class extends R{constructor(...a){if(!a.length)super(HOM+'T10:00:00');else super(...a);}
  static now(){return new R(HOM+'T10:00:00').getTime();}};
const el0={innerHTML:'',scrollIntoView(){},appendChild(){},click(){},remove(){},style:{},dataset:{},value:''};
const ctx={console,Intl,Date:FD,Math,JSON,Object,Array,String,Number,isNaN,parseInt,parseFloat,
  setTimeout:()=>0,clearTimeout(){},localStorage:{getItem:()=>null,setItem(){}},navigator:{},
  Blob:function(){},File:function(){},URL:{createObjectURL:()=>'x',revokeObjectURL(){}},confirm:()=>true,prompt:()=>null,
  document:{getElementById:id=>el0,createElement:()=>el0,querySelector:()=>null,querySelectorAll:()=>[],head:el0,body:el0,documentElement:el0}};
ctx.window=ctx; ctx.globalThis=ctx;
ctx.window.matchMedia=()=>({matches:false,addEventListener(){},addListener(){}});
ctx.window.scrollTo=()=>{}; ctx.window.scrollY=0;
vm.createContext(ctx); vm.runInContext(code,ctx,{filename:'app.js'});
const F=ctx.__f;
let loi=0;
const ok=(dk,t,them)=>{if(dk)console.log('  ✓ '+t);else{loi++;console.log('  ✗ '+t+(them?'\n      → '+them:''));}};
const eq=(a,b,t)=>ok(JSON.stringify(a)===JSON.stringify(b),t,'được '+JSON.stringify(a)+', cần '+JSON.stringify(b));
const T11=new Date(2026,10,1), T12=new Date(2026,11,1);
const so=()=>({v:15,txns:[
    {id:1,d:'2026-11-01',t:'thu',a:9000000,c:'luong',s:'bidv',n:'Lương'},
    {id:2,d:'2026-11-05',tm:'19:30',t:'chi',a:100000,c:'an',s:'bidv',n:'Bữa ăn nhóm',sg:'s1'},
    {id:3,d:'2026-11-05',tm:'19:30',t:'chi',a:200000,c:'muon_ung',s:'bidv',n:'Bữa ăn nhóm',sg:'s1'}],
  debts:[],budgets:{},bm:{},goals:[],fixedItems:[],roll:{},offsets:[],draws:[],income:0,rules:{},
  opens:{bidv:1000000,vi:0,tm:500000},checks:{},opts:{},chainOK:{},goalPlan:{},payDays:{k1:[5,10],k2:[15,25]},
  ngayOK:{},chot:{},chotLS:[],nsChot:{},lichThu:{},batDau:'2026-11-01'});

console.log('\nA · Ứng trước: trong lúc chờ tính như cho mượn');
let db=so(); HOM='2026-11-06'; ctx.__set(db,T11);
let b=F.bangTien(T11);
eq(b.tongRa,100000,'(3) Thực chi chỉ 100.000 — phần ứng 200.000 không vào');
eq([b.muon,b.choRong],[200000,200000],'(4) Tiền cho vay ròng 200.000');
eq(b.cuoi,F.balAt(T11),'bảng vẫn cộng về đúng số dư');
ok(!F.alerts().some(a=>a.t.includes('Ứng trước')),'06/11 (mới 1 ngày) → CHƯA nhắc');
HOM='2026-11-07'; ctx.__set(db,T11);
ok(F.alerts().some(a=>a.t==='Ứng trước "Bữa ăn nhóm": còn 200.000 chưa nhận lại · 2 ngày'),'07/11 (ngày thứ 2) → nhắc "còn 200.000 · 2 ngày"');
eq(F.loaiNg({t:'chi',c:'muon_ung'}),null,'ứng trước KHÔNG hỏi người, KHÔNG tạo thẻ ở tab Nợ');

console.log('\nB · Nhận lại tiền mặt 80.000 (Ghi tay) + chuyển khoản 120.000 (tab Nhập)');
db.txns.push({id:4,d:'2026-11-06',t:'thu',a:80000,c:'thuno_ung',s:'tm',n:'Bạn A trả tiền mặt',ung:'3'});
ctx.__set(db,T11); b=F.bangTien(T11);
eq(b.choRong,120000,'(4) = 200.000 − 80.000 = 120.000');
eq(b.tongVao,9000000,'(2) Thực thu KHÔNG cộng tiền ứng trả lại');
ok(F.alerts().some(a=>a.t.includes('còn 120.000 chưa nhận lại')),'nhắc còn 120.000');
ctx.__row('3'); ok(F.vList().includes('chờ nhận lại 120.000')&&F.vList().includes('đã nhận 80.000'),'tab Giao dịch: "chờ nhận lại 120.000 · đã nhận 80.000"');
let p=[{d:'2026-11-08',tm:'14:20',t:'thu',a:150000,c:'thuno_ung',s:'bidv',n:'Bạn B chuyển tiền ăn',keep:true}];
ctx.__pend(p);
let h=F.vImport();
ok(h.includes('Nhận lại cho khoản ứng nào?')&&h.includes('Khoản ứng đang chờ')&&h.includes('còn 120.000'),'tab Nhập: hộp bắt buộc, liệt kê khoản ứng đang chờ "còn 120.000"');
ok(/class="btn" disabled onclick="commit\(\)"/.test(h),'chưa gắn → nút Lưu khóa');
p[0].ungP='3'; ok(F.needUng(p[0]),'nhận 150.000 > còn 120.000 → VẪN bắt buộc sửa');
ok(F.vImport().includes('nhiều hơn số còn chờ'),'báo "nhiều hơn số còn chờ"');
const n0=db.txns.length; F.commit(); eq(db.txns.length,n0,'nhận dư → KHÔNG lưu');
p[0].a=120000; ok(!F.needUng(p[0]),'nhận đúng 120.000 → hợp lệ');
ok(F.vImport().includes('khoản ứng đã nhận đủ ✓'),'hộp báo "khoản ứng đã nhận đủ ✓"');
HOM='2026-11-08'; F.commit(); db=ctx.__db(); ctx.__set(db,T11);
const ve=db.txns.find(x=>x.n==='Bạn B chuyển tiền ăn');
eq(ve&&ve.ung,'3','lưu xong gắn đúng khoản ứng');
b=F.bangTien(T11);
eq(b.choRong,0,'(4) về 0 khi nhận đủ');
eq(b.tongRa,100000,'Thực chi vẫn 100.000');
eq(b.cuoi,1000000+500000+9000000-100000,'số dư giảm ròng đúng 100.000 = phần của Vy');
ok(!F.alerts().some(a=>a.t.includes('Ứng trước')),'nhận đủ → hết nhắc');
ctx.__row('3'); ok(F.vList().includes('đã nhận lại đủ'),'tag xanh "đã nhận lại đủ"');
eq(db.debts.length,0,'không có thẻ nào ở tab Nợ');

console.log('\nC · Ứng trước và nhận lại trong CÙNG lần nhập');
db=so(); db.txns=db.txns.slice(0,1); HOM='2026-11-07'; ctx.__set(db,T11);
p=[{d:'2026-11-07',t:'chi',a:50000,c:'muon_ung',s:'bidv',n:'Ứng tiền nước',keep:true},
   {d:'2026-11-07',t:'thu',a:50000,c:'thuno_ung',s:'bidv',n:'Bạn trả tiền nước',keep:true,ungP:'p0'}];
ctx.__pend(p); ok(!F.needUng(p[1]),'gắn được vào khoản ứng cùng lần nhập');
F.commit(); db=ctx.__db(); ctx.__set(db,T11);
const u=db.txns.find(x=>x.n==='Ứng tiền nước'), r=db.txns.find(x=>x.n==='Bạn trả tiền nước');
ok(u&&r&&r.ung===String(u.id),'lưu xong: khoản nhận lại trỏ đúng id khoản ứng vừa ghi');
eq(db.debts.length,0,'ứng trước qua tab Nhập KHÔNG tạo khoản nợ');

console.log('\nD · SPayLater: đọc hóa đơn tháng 11 (11 món, 1.311.850, hạn 10/12)');
const HD11=`splhd | 2026-11 | 2026-12-10 | 1311850
spl | Tranh cát chuyển động 3D | 97538 | gdu
spl | Trà chanh mật ong Hantae | 135200 | an
spl | Sách Liễu Phàm Tứ Huấn | 16057 | ht_sach | 1/3
spl | Son kem lì Dinto | 72757 | ld | 1/3
spl | Kem dưỡng Angel's Liquid | 124750 | ld | 1/3
spl | Mặt nạ ngủ môi Laneige | 105000 | ld | 1/3
spl | Angel's Liquid 60ml | 127250 | ld | 1/3
spl | Máy tăm nước Halio | 253225 | sk | 1/3
spl | Kem dưỡng cấp ẩm đa tầng | 95333 | ld | 1/3
spl | Tẩy trang Cocoon combo 2 | 89790 | ld | 1/3
spl | Mũ bảo hiểm Royal M239 | 194950 | qa_tui | 2/2`;
let x=F.splDoc(HD11);
eq([x.k,x.han,x.tong,x.mon.length,x.loi.length],['2026-11','2026-12-10',1311850,11,0],'đọc đúng: tháng 11, hạn 10/12, 11 món, không lỗi');
eq(x.mon.filter(m=>m.gop).length,9,'9 món trả góp, 2 món trả sau 1 kỳ');
ok(F.splDoc(HD11.replace('97538','97539')).loi.some(l=>l.includes('khác tổng hóa đơn')),'lệch 1 đồng → báo lỗi, không lưu');
db=so(); db.txns=db.txns.slice(0,1); HOM='2026-11-27'; ctx.__set(db,T11);
el0.value=HD11; F.splLuuHD(); el0.value=''; db=ctx.__db(); ctx.__set(db,T11);
eq((db.spl||[]).length,1,'ghi hóa đơn vào sổ');
h=F.vDebt();
ok(h.includes('<b>SPayLater</b>')&&h.includes('CHƯA TRẢ')&&h.includes('HẠN GẦN NHẤT · 10/12')&&h.includes('còn 13 ngày'),'tab Nợ: khối SPayLater, hai ô, "còn 13 ngày"');
ok(h.includes('Trả sau 1 kỳ')&&h.includes('232.738')&&h.includes('Trả góp')&&h.includes('1.079.112'),'bảng: Trả sau 1 kỳ 232.738 · Trả góp 1.079.112');
ok(!h.includes('ước tính'),'KHÔNG có hóa đơn ước tính');
ctx.__set(db,T12);
ok(F.debtDue(T12).rows.some(r=>r.name==='SPayLater HĐ tháng 11'&&r.conPhai===1311850),'tháng 12: dự trù nợ còn phải trả 1.311.850');
ctx.__set(db,T11);
ok(!F.debtDue(T11).rows.some(r=>r.name.includes('SPayLater')),'tháng 11: KHÔNG tính (hạn ở tháng 12)');

console.log('\nE · Ngày 10/12: BIDV trả 1.311.850 → tách theo hóa đơn');
HOM='2026-12-10';
db.txns.push({id:9,d:'2026-12-10',tm:'08:15',t:'chi',a:1311850,c:'',s:'bidv',n:'Thanh toán ShopeePay',b:5000000});
ctx.__set(db,T12);
ok(F.coSpl(db.txns.find(t=>t.id===9)),'dòng BIDV có nút "Đây là SPayLater"');
ctx.__mo('9'); ctx.__row('9');
ok(F.vList().includes('Khớp SPayLater HĐ tháng 11')&&F.vList().includes('Tách thành 11 khoản'),'app tự khớp hóa đơn cùng số tiền');
F.splTach('9','2026-11'); db=ctx.__db(); ctx.__set(db,T12);
const phan=db.txns.filter(t=>t.spl==='2026-11');
eq([phan.length,phan.reduce((s,t)=>s+t.a,0)],[11,1311850],'11 khoản, cộng đúng 1.311.850');
ok(phan.every(t=>t.d==='2026-12-10'&&t.s==='bidv'&&t.b===5000000&&t.sg),'giữ ngày trả, nguồn BIDV, số dư BIDV, chung nhóm tách');
ok(!db.txns.some(t=>t.id===9),'dòng gộp cũ được thay');
eq(db.spl[0].tra.d,'2026-12-10','hóa đơn ghi đã trả');
eq(F.bangTien(T12).tongRa,1311850,'Thực chi tháng 12 cộng 1.311.850 (chi tiêu tính tháng trả)');
ok(F.monthTx(T12).filter(t=>t.c==='ld').reduce((s,t)=>s+t.a,0)===614880,'Làm đẹp nhận đúng 6 món = 614.880');
ok(!F.debtDue(T12).rows.some(r=>r.name.includes('SPayLater')),'trả rồi → hết dự trù nợ');
h=F.vList(); ok(h.includes('SPayLater · góp 1/3')&&h.includes('SPayLater · HĐ T11'),'tag "SPayLater · góp 1/3" / "SPayLater · HĐ T11"');
h=F.vDebt(); ok(!h.includes('CHƯA TRẢ')&&h.includes('1 hóa đơn SPayLater'),'tab Nợ: hết hóa đơn chưa trả, nút Lịch sử "1 hóa đơn SPayLater"');
ok(F.vLsNo().includes('SPAYLATER ĐÃ TRẢ')&&F.vLsNo().includes('trả 10/12 · 11 món'),'Lịch sử: "SPayLater đã trả · trả 10/12 · 11 món"');

console.log('\nF · Trả mà chưa có hóa đơn: dán ngay tại dòng (HĐ tháng 10, 748.456)');
db.txns.push({id:10,d:'2026-11-10',t:'chi',a:748456,c:'',s:'bidv',n:'Thanh toán ShopeePay'});
ctx.__set(db,T11); ctx.__mo('10'); ctx.__row('10');
ok(F.vList().includes('Hóa đơn SPayLater gồm những gì?'),'không có hóa đơn khớp → mở ô dán');
el0.value=`splhd | 2026-10 | 2026-11-10 | 748456
spl | Dầu gội SUPER MiLD | 153086 | ld
spl | Khăn lau đa năng | 35000 | gdu
spl | Nạo sợi rau củ | 69420 | gdu
spl | Khăn dạ len unisex | 183200 | qa_tui
spl | Cà phê Trung Nguyên Legend | 112800 | an
spl | Mũ bảo hiểm Royal M239 | 194950 | qa_tui | 1/2`;
F.splDanTach('10'); el0.value=''; db=ctx.__db(); ctx.__set(db,T11);
eq(db.txns.filter(t=>t.spl==='2026-10').reduce((s,t)=>s+t.a,0),748456,'tách 6 món, cộng 748.456');
ok(db.spl.find(x=>x.k==='2026-10').tra,'hóa đơn tháng 10 vào sổ, đã trả');

console.log('\nH · Dán ở tab Nhập: kết quả A.I lẫn giao dịch + hóa đơn SPayLater (Vy test 27/11/2026)');
db=so(); db.txns=db.txns.slice(0,1); HOM='2026-11-27'; ctx.__set(db,T11);
el0.value=`2026-11-26 09:05 | bidv | chi | 56000 | Trà sữa | an_cafe | 4000000 |
splhd | 2026-12 | 2027-01-11 | 995516
spl | Worry Thỏ Hà Lan Lùn | 111354 | gt
spl | Sách Liễu Phàm Tứ Huấn | 16057 | ht_sach | 2/3
spl | Son kem Dinto | 72757 | ld | 2/3
spl | Kem dưỡng Angel's Liquid | 124750 | ld | 2/3
spl | Mặt nạ ngủ môi Laneige | 105000 | ld | 2/3
spl | Angel's Liquid 60ml | 127250 | ld | 2/3
spl | Máy tăm nước Halio | 253225 | ld | 2/3
spl | Kem dưỡng cấp ẩm Angel's Liquid | 95333 | ld | 2/3
spl | Nước tẩy trang Cocoon | 89790 | ld | 2/3
Sửa 3 dòng cũ (đây là chữ A.I tự thêm)`;
F.doPaste(); el0.value=''; db=ctx.__db();
ok(!ctx.__bq().some(b=>/spl/.test(b.goc)),'KHÔNG còn báo "không đọc được ngày từ spl"');
eq(ctx.__bq().length,1,'chỉ dòng chữ A.I tự thêm bị bỏ qua');
eq((db.spl||[]).find(x=>x.k==='2026-12').mon.length,9,'hóa đơn tháng 12 (9 món, 995.516) vào khối SPayLater');
eq((ctx.__pd()||[]).length,1,'giao dịch Trà sữa vẫn vào bước kiểm tra');
ok(F.vImport().includes('Đã ghi hóa đơn SPayLater vào tab Nợ: HĐ tháng 12'),'màn kiểm tra báo đã ghi hóa đơn');
db=so(); db.txns=db.txns.slice(0,1); ctx.__set(db,T11);
el0.value='splhd | 2026-12 | 2027-01-11 | 995516\nspl | Worry Thỏ | 111354 | gt'; F.doPaste(); el0.value=''; db=ctx.__db();
ok(!(db.spl||[]).length&&ctx.__bq().some(b=>b.ly.includes('khác tổng hóa đơn')),'hóa đơn thiếu món (tổng lệch) → KHÔNG ghi, báo lý do');
db=so(); db.txns=db.txns.slice(0,1); ctx.__set(db,T11);
el0.value=HD11; F.doPaste(); el0.value=''; db=ctx.__db();
ok((db.spl||[]).length===1&&!ctx.__pd()&&ctx.__msg().includes('HĐ tháng 11 · 11 món · 1.311.850'),'chỉ dán hóa đơn → ghi luôn, báo "HĐ tháng 11 · 11 món · 1.311.850"');
ok(F.splDoc('splhd | 2026-12 | 2027-01-11 | 72757\nspl | Son kem Dinto | 72757 | Id | 2/3').mon[0].c==='ld','mã "Id" (I hoa) được hiểu là ld (Làm đẹp)');

console.log('\nG · Câu lệnh A.I');
ok(F.promptText().includes('splhd | YYYY-MM')&&F.promptText().includes('muon_ung=')&&F.promptText().includes('thuno_ung='),'câu lệnh có dạng hóa đơn SPayLater và mã Ứng trước / Nhận lại tiền ứng');

console.log('\n'+(loi?'✗ '+loi+' LỖI':'✓ ĐẠT HẾT'));
process.exit(loi?1:0);
