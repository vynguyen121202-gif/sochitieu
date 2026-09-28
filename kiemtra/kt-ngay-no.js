/* Kiểm tra v=9: ô ngày dd/mm/yy, nhập nợ ngay trong trang, Tổng kết kết ở Số dư cuối tháng.
   Đồng hồ giả 28/09/2026 10:00 để mọi phép "bỏ năm" ra đúng một kết quả. */
const fs=require('fs'), path=require('path'), vm=require('vm');
const {soMau,lamMoiHat}=require('./so-mau.js');
const SRC_APP=fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8');
let code=SRC_APP.slice(0,SRC_APP.indexOf("try{\n  const mf="));
code+=`
globalThis.__set=(db,cur,t)=>{DB=db;cursor=cur||new Date();tab=t||'home';open={};msg='';nF=null;pending=null;memoClear();};
globalThis.__f={dtFmt,dtRead,vnd,ngayLuongToi,balAt,balSrcAt,vDebt,vImport,vList,vHome,commit,addManual,
  luuNoMoi,luuSuaNo,luuHan,payDebt,setDate,setHanP};
globalThis.__nF=v=>{nF=v;};
globalThis.__pend=p=>{pending=p;};
globalThis.__man=(c,t)=>{manualCode=c;_mt=t||'chi';mNhap={a:'',n:'',s:'',d:'',han:''};};
globalThis.__db=()=>DB;
globalThis.__msg=()=>msg;`;

const HOM='2026-09-28';
const R=Date, FD=class extends R{constructor(...a){if(!a.length)super(HOM+'T10:00:00');else super(...a);}
  static now(){return new R(HOM+'T10:00:00').getTime();}};
/* DOM giả có ô thật: getElementById trả đúng ô theo id, để đọc được giá trị như trên trình duyệt */
let O={};
const el0={innerHTML:'',scrollIntoView(){},appendChild(){},click(){},remove(){},style:{},dataset:{},value:''};
let hoi=0;
const ctx={console,Intl,Date:FD,Math,JSON,Object,Array,String,Number,isNaN,parseInt,parseFloat,
  setTimeout:()=>0,clearTimeout(){},localStorage:{getItem:()=>null,setItem(){}},navigator:{},
  Blob:function(){},File:function(){},URL:{createObjectURL:()=>'x',revokeObjectURL(){}},
  confirm:()=>{hoi++;return true;}, prompt:()=>{hoi++;return null;},
  document:{getElementById:id=>O[id]||(id==='app'||id==='nav'?el0:null),createElement:()=>el0,
    querySelector:()=>null,head:el0,body:el0,documentElement:el0}};
ctx.window=ctx; ctx.globalThis=ctx;
ctx.window.matchMedia=()=>({matches:false,addEventListener(){},addListener(){}});
ctx.window.scrollTo=()=>{}; ctx.window.scrollY=0;
vm.createContext(ctx); vm.runInContext(code,ctx,{filename:'app.js'});
const F=ctx.__f;
const o=(id,value,ds)=>{O[id]={id,value:value||'',dataset:ds||{},hidden:false,textContent:''};};

let loi=0;
const ok=(dk,t,them)=>{if(dk)console.log('  ✓ '+t);else{loi++;console.log('  ✗ '+t+(them?'\n      → '+them:''));}};
const eq=(a,b,t)=>ok(a===b,t,'được '+JSON.stringify(a)+', cần '+JSON.stringify(b));

const trong=()=>({txns:[],v:10,debts:[],budgets:{},bm:{},goals:[],fixedItems:[],roll:{},offsets:[],draws:[],
  income:0,rules:{},opens:{bidv:1000000,vi:0,tm:200000},checks:{},opts:{},chainOK:{},goalPlan:{},
  payDays:{k1:[5,10],k2:[15,25]},ngayOK:{}});

console.log('\nA · Gõ ngày dd/mm/yy — tự chèn dấu /');
eq(F.dtFmt('7'),'07','gõ 7 → 07 (ngày bắt đầu bằng 4-9 là ngày một chữ số)');
eq(F.dtFmt('710'),'07/10','gõ 710 → 07/10');
eq(F.dtFmt('71026'),'07/10/26','gõ 71026 → 07/10/26');
eq(F.dtFmt('0710'),'07/10','gõ 0710 → 07/10');
eq(F.dtFmt('1512'),'15/12','gõ 1512 → 15/12');
eq(F.dtFmt('311'),'31/1','gõ 311 → 31/1 (chưa đủ, chờ gõ tiếp)');
eq(F.dtFmt('07/10/2026'),'07/10/20','dán cả năm 4 số thì chỉ lấy 2 số đầu — KHÔNG tự hiểu thành 2026');
eq(F.dtFmt(''),'','ô trống vẫn trống');

console.log('\nB · Đọc ngày — bỏ năm thì theo hướng');
eq(F.dtRead('07/10','toi'),'2026-10-07','hẹn 07/10 (chưa tới) → năm nay');
eq(F.dtRead('07/09','toi'),'2027-09-07','hẹn 07/09 (đã qua) → năm sau');
eq(F.dtRead('28/09','toi'),'2026-09-28','hẹn đúng hôm nay → hôm nay, KHÔNG nhảy sang năm sau');
eq(F.dtRead('04/09','qua'),'2026-09-04','giao dịch 04/09 (đã qua) → năm nay');
eq(F.dtRead('15/12','qua'),'2025-12-15','giao dịch 15/12 (chưa tới) → năm ngoái');
eq(F.dtRead('07/10/26','qua'),'2026-10-07','có ghi năm thì giữ đúng năm, không tự đổi');
eq(F.dtRead('7/10','toi'),'2026-10-07','gõ ngày một chữ số có dấu / vẫn đọc được');
eq(F.dtRead('31/02/27','toi'),null,'31/02 không có thật → null');
eq(F.dtRead('29/02/26','qua'),null,'29/02/2026 không có thật (năm không nhuận) → null');
eq(F.dtRead('29/02','toi'),'2028-02-29','29/02 bỏ năm, hướng tới → năm nhuận 2028');
eq(F.dtRead('31/1','toi'),'2027-01-31','31/1 là ngày có thật (31 tháng 1) → nhận, năm sau vì đã qua');
eq(F.dtRead('29/02','qua'),'2024-02-29','29/02 bỏ năm, hướng đã qua → năm nhuận 2024');
eq(F.dtRead('','toi'),'','ô trống → chuỗi rỗng (khác với sai)');
eq(F.vnd('2026-10-07'),'07/10/26','hiện lại ngày đã lưu theo dd/mm/yy');
eq(F.vnd(''),'','ngày trống hiện trống');

console.log('\nC · Ngày lương tới lấy từ ngày lương thật trong sổ');
{
  const db=trong();
  db.txns.push({id:1,d:'2026-09-07',t:'thu',a:8e6,c:'luong',s:'bidv',n:'Lương kỳ 1'},
               {id:2,d:'2026-09-17',t:'thu',a:6e6,c:'luong',s:'bidv',n:'Lương kỳ 2'});
  ctx.__set(db);
  eq(F.ngayLuongToi(),'2026-10-07','lương về 7/9 và 17/9, hôm nay 28/9 → 07/10');
  ctx.__set(trong());
  eq(F.ngayLuongToi(),'2026-10-05','sổ chưa có lương → lấy đầu khung ngày lương (05/10)');
}

console.log('\nD · Tab Nợ: thêm khoản ngay trong trang, không hộp thoại');
{
  hoi=0;
  const db=trong(); ctx.__set(db,null,'debt');
  let h=F.vDebt();
  ok(h.includes("moNo('moi','cho')")&&h.includes("moNo('moi','no')"),'có hai nút "+ Cho mượn" và "+ Đi vay"');
  ok(!h.includes('newDebt('),'KHÔNG còn nút gọi newDebt() cũ');
  ctx.__nF({m:'moi',k:'cho'}); h=F.vDebt();
  ok(h.includes('Khoản cho mượn mới')&&h.includes('Ngày dự kiến thu'),'form cho mượn: tiêu đề + ô Ngày dự kiến thu');
  ok(!h.includes('nf-cach'),'form cho mượn KHÔNG có nút gạt Trả một lần / Trả góp');
  ok(h.includes('Ngày lương tới')&&h.includes('Cuối tháng')&&h.includes('Chưa biết'),'có ba nút chọn nhanh');
  ok(h.includes('placeholder="dd/mm/yy"'),'ô ngày ghi gợi ý dd/mm/yy');
  ctx.__nF({m:'moi',k:'no'}); h=F.vDebt();
  ok(h.includes('Khoản đi vay mới')&&h.includes('nf-cach')&&h.includes('Ngày dự kiến trả'),'form đi vay: có Trả một lần / Trả góp, ô Ngày dự kiến trả');

  O={}; ctx.__nF({m:'moi',k:'cho'});
  o('nf-ten','Chị Mai'); o('nf-tien','1.000.000'); o('nf-han','07/10');
  F.luuNoMoi();
  const d=db.debts[0];
  ok(d&&d.kind==='cho'&&d.principal===1000000&&d.due==='2026-10-07','lưu: cho mượn 1.000.000, hẹn 2026-10-07',JSON.stringify(d));

  O={}; ctx.__nF({m:'moi',k:'no'});
  o('nf-ten','Máy tính'); o('nf-tien','24.000.000'); o('nf-cach','',{v:'gop'});
  o('nf-ky','12'); o('nf-kytien','2.000.000'); o('nf-ngay','25');
  F.luuNoMoi();
  const g=db.debts[1];
  ok(g&&g.mode==='gop'&&g.periods===12&&g.per===2000000&&g.start==='2026-09-25','lưu trả góp: 12 kỳ × 2.000.000, ngày 25',JSON.stringify(g));

  O={}; ctx.__nF({m:'moi',k:'cho'}); const n0=db.debts.length;
  o('nf-ten','Anh Nam'); o('nf-tien','500k'); o('nf-han','31/02/27'); o('nf-loi','');
  F.luuNoMoi();
  eq(db.debts.length,n0,'ngày sai (31/02) → KHÔNG lưu khoản');
  ok(O['nf-loi'].textContent.includes('dd/mm/yy')&&!O['nf-loi'].hidden,'ngày sai → báo lỗi NGAY trong form (không vẽ lại trang làm mất chữ)');

  O={}; ctx.__nF({m:'moi',k:'cho'});
  o('nf-ten','Anh Nam'); o('nf-tien','500k'); o('nf-han','');
  F.luuNoMoi();
  const nam=db.debts[db.debts.length-1];
  ok(nam.name==='Anh Nam'&&nam.principal===500000&&!('due' in nam),'gõ "500k", bỏ trống ngày → vẫn lưu, không có hạn');
  eq(new Set(db.debts.map(x=>x.id)).size,db.debts.length,'ba khoản lưu cùng một mili-giây vẫn có mã KHÁC nhau');

  ctx.__nF(null); h=F.vDebt();
  ok(h.includes('han-'+nam.id)&&h.includes('Chưa có <b>ngày dự kiến thu</b>'),'khoản chưa có ngày → hiện ô điền ngày ngay trên thẻ');
  ok(!h.includes('han-'+d.id),'khoản ĐÃ có ngày → KHÔNG hiện ô điền ngày');
  {const the=h.slice(h.indexOf('>Anh Nam<'));const i=the.indexOf('data-xo="h_'+nam.id+'"');
   ok(i>0&&the.indexOf('chưa có lần thanh toán nào',i)>i,'Lịch sử nằm TRONG khung xổ của chính thẻ đó (lỗi v=8: luôn hiện, bấm không đóng)');
   ok(!/<div class="xow"[^>]*><\/div>/.test(h),'KHÔNG còn khung xổ Lịch sử rỗng nằm lạc ngoài thẻ');}
  ok(!h.includes('han-'+g.id),'khoản trả góp → KHÔNG hiện ô điền ngày (có ngày trả hằng tháng rồi)');
  O={}; o('han-'+nam.id,'15/10');
  F.luuHan(nam.id);
  eq(nam.due,'2026-10-15','điền ngày trên thẻ → lưu 2026-10-15');

  O={}; ctx.__nF({m:'sua',id:d.id}); h=F.vDebt();
  ok(h.includes('value="07/10/26"'),'form Sửa hiện ngày hẹn đang lưu theo dd/mm/yy');
  o('nf-ten','Chị Mai'); o('nf-tien','1.000.000'); o('nf-han','');
  F.luuSuaNo();
  ok(!('due' in d),'Sửa, xóa trống ô ngày → bỏ hạn');

  O={}; ctx.__nF({m:'thu',id:d.id}); h=F.vDebt();
  ok(h.includes('Thu về bao nhiêu')&&h.includes('Tiền vào nguồn nào')&&h.includes('Ngày thu'),'form Ghi thu hồi: số tiền, nguồn, ngày');
  ok(h.includes('value="28/09/26"'),'ngày thu điền sẵn hôm nay 28/09/26');
  const t0=db.txns.length;
  o('nf-a','400.000'); o('nf-src','',{v:'tm'}); o('nf-d','26/09');
  F.payDebt();
  const tt=db.txns[t0];
  ok(tt&&tt.a===400000&&tt.s==='tm'&&tt.d==='2026-09-26'&&tt.t==='thu'&&tt.c==='thuno'&&tt.debt===d.id,
    'ghi thu hồi 400.000 vào Tiền mặt ngày 26/09, gắn đúng khoản',JSON.stringify(tt));
  eq(hoi,0,'suốt cả phần D: KHÔNG một hộp thoại confirm/prompt nào bật lên');
}

console.log('\nE · Tab Nhập: ghi Cho mượn là tạo luôn khoản nợ kèm ngày hẹn');
{
  const db=trong(); ctx.__set(db,null,'add');
  ctx.__man('muon','chi'); let h=F.vImport();
  ok(h.includes('id="mhan"')&&h.includes('Ngày dự kiến thu'),'chọn nhóm Cho mượn → hiện ô Ngày dự kiến thu');
  ok(!h.includes('type="date"'),'ô ngày KHÔNG còn là ô lịch type="date"');
  ctx.__man('an_ngoai','chi'); h=F.vImport();
  ok(!h.includes('id="mhan"'),'nhóm Ăn uống → KHÔNG có ô ngày hẹn');
  ctx.__man('divay','thu'); h=F.vImport();
  ok(h.includes('id="mhan"')&&h.includes('Ngày dự kiến trả'),'nhóm Đi vay → ô Ngày dự kiến trả');

  O={}; ctx.__man('muon','chi');
  o('mt','chi'); o('ma','1tr'); o('mn','Chuyển chị Mai mượn'); o('msrc','bidv'); o('md','28/09'); o('mhan','07/10');
  F.addManual();
  eq(db.txns.length,1,'ghi 1 giao dịch');
  eq(db.txns[0].d,'2026-09-28','ngày giao dịch lưu 2026-09-28');
  ok(db.debts.length===1&&db.debts[0].kind==='cho'&&db.debts[0].principal===1000000&&db.debts[0].due==='2026-10-07',
    'VÀ tạo khoản chờ thu 1.000.000 hẹn 07/10 (trước v=9 ghi tay KHÔNG tạo khoản nào)',JSON.stringify(db.debts));

  O={}; ctx.__man('an_ngoai','chi');
  o('mt','chi'); o('ma','45k'); o('mn','Cơm'); o('msrc','tm'); o('md','29/02/26');
  F.addManual();
  eq(db.txns.length,1,'ngày 29/02/26 không có thật → KHÔNG ghi');

  O={}; ctx.__man('an_ngoai','chi');
  o('mt','chi'); o('ma','45k'); o('mn','Cơm'); o('msrc','tm'); o('md','27/09');
  F.addManual();
  ok(db.txns.length===2&&db.debts.length===1,'ghi Ăn uống → KHÔNG tạo khoản nợ nào');
}

console.log('\nF · Màn xem lại (dán từ AI): ngày hẹn cho dòng Cho mượn / Đi vay');
{
  const db=trong(); ctx.__set(db,null,'add');
  ctx.__pend([
    {id:1,d:'2026-09-27',t:'chi',a:1000000,c:'muon',s:'bidv',n:'Chuyen chi Mai',keep:true},
    {id:2,d:'2026-09-27',t:'thu',a:500000,c:'divay',s:'bidv',n:'Me cho muon',keep:true},
    {id:3,d:'2026-09-27',t:'chi',a:45000,c:'an_ngoai',s:'tm',n:'Com',keep:true}]);
  const h=F.vImport();
  ok(h.includes('id="phan-0"')&&h.includes('Dự kiến thu lại ngày'),'dòng Cho mượn có ô "Dự kiến thu lại ngày"');
  ok(h.includes('id="phan-1"')&&h.includes('Dự kiến trả ngày'),'dòng Đi vay có ô "Dự kiến trả ngày"');
  ok(!h.includes('id="phan-2"'),'dòng Ăn uống KHÔNG có ô ngày hẹn');
  F.setHanP(0,'071026'.replace(/^(\d\d)(\d\d)(\d\d)$/,'$1/$2/$3'));
  F.commit();
  const cho=db.debts.find(x=>x.kind==='cho'), vay=db.debts.find(x=>x.kind==='no');
  ok(cho&&cho.due==='2026-10-07','Cho mượn lưu kèm hạn 2026-10-07',JSON.stringify(cho));
  ok(vay&&!('due' in vay),'Đi vay để trống ngày → không có hạn');
  ok(db.txns.every(t=>!('_han' in t)),'KHÔNG để sót trường tạm _han trong giao dịch đã lưu');
}

console.log('\nG · Tab Giao dịch: sửa ngày một dòng');
{
  const db=trong();
  db.txns.push({id:77,d:'2026-04-09',tm:'15:14',t:'chi',a:10000,c:'an_ngoai',s:'bidv',n:'Nạp ví'});
  ctx.__set(db,new Date(2026,3,1),'list');
  F.setDate('77','04/09/26');
  eq(db.txns[0].d,'2026-09-04','gõ 04/09/26 → 2026-09-04 (đúng vụ ShopeePay gõ đảo)');
  F.setDate('77','31/09/26');
  eq(db.txns[0].d,'2026-09-04','31/09 không có thật → giữ nguyên ngày cũ');
  ok(!SRC_APP.includes("function editDate"),'đã bỏ hộp thoại "Sửa ngày giờ" (YYYY-MM-DD)');
  ok(!SRC_APP.includes('type="date"'),'app.js KHÔNG còn ô lịch type="date" nào');
  ok(!/prompt\([^)]*YYYY/.test(SRC_APP),'KHÔNG còn hộp thoại nào bắt gõ YYYY-MM-DD');
  ok(!/prompt\([^)]*(Thu về|Trả'\)|Từ nguồn nào|Tên khoản nợ|Số tiền gốc|Số kỳ|Mỗi kỳ trả|Ngày trả hàng tháng)/.test(SRC_APP),'KHÔNG còn hộp thoại nhập nợ nào');
  ok(!/confirm\([^)]*(đi vay|trả góp)/.test(SRC_APP),'KHÔNG còn hộp thoại OK/Hủy hỏi đi vay hay trả góp');
}

console.log('\nH · Tổng kết tháng đã đóng: kết ở Số dư cuối tháng');
{
  lamMoiHat(); const db=soMau();
  const T8=new Date(2026,7,1);
  ctx.__set(db,T8,'home');
  const h=F.vHome(), b=F.balSrcAt(T8), tong=(b.bidv||0)+(b.vi||0)+(b.tm||0);
  const M=n=>new Intl.NumberFormat('vi-VN').format(Math.round(n));
  ok(h.includes('Số dư cuối tháng 8'),'có dòng "Số dư cuối tháng 8"');
  eq(tong,F.balAt(T8),'BIDV + Ví + Tiền mặt cộng lại ĐÚNG bằng Số dư cuối tháng');
  ok(h.includes('Cộng ba nguồn')&&h.includes(M(b.bidv))&&h.includes(M(b.tm)),'xổ ra thấy số từng nguồn');
  ok(h.includes('Tiết kiệm &amp; Đầu tư')&&h.includes('1 · Góp mục tiêu tài chính')&&h.includes('2 · Tiết kiệm riêng'),
    'khối Tiết kiệm & Đầu tư: góp mục tiêu trước, tiết kiệm riêng sau');
  ok(h.indexOf('1 · Góp mục tiêu')<h.indexOf('2 · Tiết kiệm riêng'),'đúng thứ tự: mục tiêu đứng trước');
  ok(!h.includes('Phân bổ tiền để dành'),'KHÔNG còn "Phân bổ tiền để dành"');
  ok(!h.includes('Số dư trong tài khoản'),'KHÔNG còn bậc 3 "Số dư trong tài khoản"');
  ok(!h.includes('lấy từ tiền các tháng trước'),'KHÔNG còn cảnh báo đỏ "lấy từ tiền các tháng trước"');
  ok(!h.includes('Cộng lại</div>'),'KHÔNG còn dòng "Cộng lại"');
  ok(!/Để dành được/.test(h),'KHÔNG còn chữ "Để dành được" ở màn tháng đã đóng');
}

console.log(loi?'\n✗ '+loi+' lỗi':'\n✓ đạt hết');
process.exit(loi?1:0);
