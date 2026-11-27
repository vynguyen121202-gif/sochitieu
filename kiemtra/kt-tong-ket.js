/* Tháng đã chốt (Vy duyệt 25/11/2026):
   1. Không có dải số dư hôm nay (BIDV · Ví · Tiền mặt); tháng đang chạy vẫn có.
   2. Thẻ "Đã chi": Thực chi, tỷ lệ Thực chi ÷ Thu nhập, Thu nhập, Còn lại = Thu nhập − Thực chi.
   3. Bảng (1)…(5) của Tổng kết: mục con xổ ra giao dịch; cộng dòng con = dòng cha ở MỌI tầng.
   Sổ giả, tên giả. */
const fs=require('fs'), path=require('path'), vm=require('vm');
const {soMau,lamMoiHat}=require('./so-mau.js');
let code=fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8');
code=code.slice(0,code.indexOf("try{\n  const mf="));
code+=`
globalThis.__set=(db,cur)=>{DB=migrate(db);cursor=cur;tab='home';open={};msg='';memoClear();};
globalThis.__f={vHome,bangTien,bangChiTiet,theDaChi,vInfo,tongKet,alerts,khoiMucTieu};
globalThis.__cur=d=>{cursor=d;memoClear();};`;
function sanKhau(HOM){
  const R=Date, FD=class extends R{constructor(...a){if(!a.length)super(HOM+'T10:00:00');else super(...a);}
    static now(){return new R(HOM+'T10:00:00').getTime();}};
  const el={innerHTML:'',scrollIntoView(){},appendChild(){},click(){},remove(){},style:{}};
  const ctx={console,Intl,Date:FD,Math,JSON,Object,Array,String,Number,isNaN,parseInt,parseFloat,
    setTimeout:()=>0,clearTimeout(){},localStorage:{getItem:()=>null,setItem(){}},navigator:{},
    Blob:function(){},File:function(){},URL:{createObjectURL:()=>'x',revokeObjectURL(){}},confirm:()=>true,
    document:{getElementById:()=>el,createElement:()=>el,head:el,body:el,documentElement:el}};
  ctx.window=ctx; ctx.globalThis=ctx;
  ctx.window.matchMedia=()=>({matches:false,addEventListener(){},addListener(){}});
  vm.createContext(ctx); vm.runInContext(code,ctx,{filename:'app.js'});
  return ctx;
}
let loi=0;
const ok=(dk,t,them)=>{if(dk)console.log('  ✓ '+t);else{loi++;console.log('  ✗ '+t+(them?'\n      → '+them:''));}};
const eq=(a,b,t)=>ok(a===b,t,'được '+JSON.stringify(a)+', cần '+JSON.stringify(b));
const M=n=>new Intl.NumberFormat('vi-VN').format(Math.round(n));
const sum=l=>l.reduce((s,t)=>s+t.a,0);

/* ---- A · sổ mẫu: tháng trước so với tháng này ---- */
lamMoiHat();
const nay=new Date();
const HOM=nay.getFullYear()+'-'+String(nay.getMonth()+1).padStart(2,'0')+'-'+String(nay.getDate()).padStart(2,'0');
const c=sanKhau(HOM), F=c.__f;
const T0=new Date(nay.getFullYear(),nay.getMonth(),1), T1=new Date(nay.getFullYear(),nay.getMonth()-1,1);

console.log('\nA · Dải số dư hôm nay');
c.__set(soMau(),T0);
const h0=F.vHome();
ok(h0.includes('id="sec-bal"'),'tháng đang chạy VẪN có dải số dư');
ok(!h0.includes('class="dc'),'tháng đang chạy KHÔNG có thẻ Đã chi mới');
ok(h0.includes('class="hero"'),'tháng đang chạy giữ ô Đã chi cũ');
c.__set(soMau(),T1);
const h1=F.vHome();
ok(!h1.includes('id="sec-bal"'),'tháng đã qua KHÔNG có dải số dư hôm nay');
ok(!h1.includes('class="hero"'),'tháng đã qua KHÔNG còn ô Đã chi cũ');
ok(h1.includes('class="dc"'),'tháng đã qua có thẻ Đã chi');
ok(!h1.includes('₫'),'không có ký hiệu ₫');
ok(h1.indexOf('class="dc"')<h1.indexOf('Tổng kết'),'thẻ Đã chi nằm trên Tổng kết');

console.log('\nB · Cộng dòng con = dòng cha (sổ mẫu, tháng trước)');
const t=F.bangTien(T1), b=F.bangChiTiet(t,T1);
b.vao.forEach(v=>{ if(v.l.length)eq(sum(v.l),v.a,'Thực thu › '+v.n+' = '+M(v.a)); });
b.ra.forEach(v=>{
  if(v.nhom){eq(v.nhom.reduce((s,g)=>s+g.a,0),v.a,'Thực chi › '+v.n+' = Σ '+v.nhom.length+' nhóm');
    v.nhom.forEach(g=>eq(sum(g.l),g.a,'   '+v.n+' › '+g.n));}
  else if(v.l.length)eq(sum(v.l),v.a,'Thực chi › '+v.n);
});
eq(sum(b.muon),t.muon,'Cho mượn'); eq(sum(b.thuno),t.thuno,'Thu nợ');
eq(sum(b.traCN),t.traCN,'Trả nợ cá nhân'); eq(sum(b.divay),t.divay,'Đi vay');
ok(b.ra.some(v=>v.nhom&&v.n==='Chi linh hoạt'),'Chi linh hoạt xổ ra nhóm');
ok(!h1.includes('data-k="c3rundefined"'),'không có khóa xổ hỏng');

/* ---- C · sổ tự dựng: số kiểm được bằng tay ---- */
console.log('\nC · Thẻ Đã chi — số tính tay');
const c2=sanKhau('2026-11-25'), G=c2.__f;
const so=chi=>({v:15,txns:[
  {id:1,d:'2026-10-07',t:'thu',a:8000000,c:'luong',s:'bidv',n:'Lương kỳ 1'},
  {id:2,d:'2026-10-20',t:'thu',a:7000000,c:'luong',s:'bidv',n:'Lương kỳ 2'},
  {id:3,d:'2026-10-17',t:'thu',a:1000000,c:'tkhac',s:'bidv',n:'Tiền công đoàn'},
  {id:4,d:'2026-10-25',t:'thu',a:259,c:'tkhac',s:'bidv',n:'Lãi tháng 10'},
  {id:5,d:'2026-10-10',t:'chi',a:chi,c:'an',s:'bidv',n:'Ăn trưa'},
  {id:6,d:'2026-10-11',t:'chi',a:500000,c:'muon',s:'bidv',n:'Cho bạn A mượn'},
  {id:7,d:'2026-10-12',t:'thu',a:200000,c:'thuno',s:'bidv',n:'Bạn A trả'}],
  debts:[],budgets:{},bm:{},goals:[],fixedItems:[],roll:{},offsets:[],draws:[],income:0,rules:{},
  opens:{bidv:1000000,vi:0,tm:0},checks:{},opts:{},chainOK:{},goalPlan:{},payDays:{k1:[5,10],k2:[15,25]},
  ngayOK:{},chot:{},chotLS:[],nsChot:{},lichThu:{},batDau:'2026-10-01'});
const T10=new Date(2026,9,1);
c2.__set(so(12000000),T10);
let h=G.vHome();
ok(h.includes('<span class="dc-n">12.000.000</span>'),'Thực chi 12.000.000');
ok(h.includes('<span class="dc-n">16.000.259</span>'),'Thu nhập 16.000.259 (lương + thu khác, KHÔNG thu nợ)');
ok(h.includes('75,0%'),'tỷ lệ 12.000.000 ÷ 16.000.259 = 75,0%');
ok(h.includes('dc-pc vua'),'75% → màu cam');
ok(h.includes('Còn lại</span><b class="duong"><span class="dc-n">4.000.259'),'Còn lại 4.000.259, xanh lá');
ok(!h.includes('Chi vượt thu nhập'),'không ghi "Chi vượt" khi còn dư');
const tk=G.bangChiTiet(G.bangTien(T10),T10), tkh=tk.vao.find(v=>v.n==='Thu khác');
eq(tkh&&tkh.l.map(x=>x.n).join(' · '),'Tiền công đoàn · Lãi tháng 10','Thu khác xổ ra hai khoản');
ok(h.includes('Tiền công đoàn'),'giao dịch Thu khác có trong bảng');
ok(h.includes('<span class="c2-t">Thu khác<i>2 khoản</i>'),'dòng Thu khác ghi "2 khoản"');
c2.__set(so(17000000),T10); h=G.vHome();
ok(h.includes('Chi vượt thu nhập</span><b class="am"><span class="dc-n">−999.741'),'chi vượt: −999.741, đỏ');
ok(h.includes('dc-pc vuot'),'trên 100% → đỏ');
c2.__set(so(5000000),T10); h=G.vHome();
ok(h.includes('dc-pc tot'),'31% → xanh');

console.log('\nD · Bảng Cách tính');
c2.__set(so(12000000),T10);
const vi=G.vInfo();
ok(vi.includes('Tỷ lệ chi tiêu / thu nhập'),'có dòng Tỷ lệ chi tiêu / thu nhập');
ok(vi.includes('KHÔNG phải số dư cuối tháng'),'dòng Còn lại nói rõ không phải số dư');

/* ---- E · đợt 3 (Vy duyệt 27/11/2026) ---- */
console.log('\nE · Điều chỉnh: cộng ở Thực thu, giảm ở Thực chi (Vy duyệt A)');
const so3=()=>{const d=so(12000000);
  d.txns.push({id:20,d:'2026-10-31',t:'dc',dir:'-',a:571000,s:'tm',n:'Điều chỉnh khi chốt sổ tháng 10'},
    {id:21,d:'2026-10-05',t:'dc',dir:'+',a:300000,s:'bidv',n:'Điều chỉnh số dư BIDV'});
  d.opens={bidv:1000000,vi:0,tm:1000000};return d;};
c2.__set(so3(),T10);
let bt=G.bangTien(T10);
eq(bt.tongVao,16000259+300000,'Thực thu = thu nhập 16.000.259 + điều chỉnh cộng 300.000');
eq(bt.tongRa,12000000+571000,'Thực chi = 12.000.000 + điều chỉnh giảm 571.000');
eq(bt.cuoi,bt.dauThang+bt.tongVao-bt.tongRa-bt.choRong-bt.vayRong,'bảng vẫn cộng về đúng số dư cuối');
eq(bt.cuoi,2000000+16000259+300000-12000000-571000-500000+200000,'số dư cuối = 5.429.259, không đổi so với cách cũ');
ok(bt.ra.some(v=>v.n==='Điều chỉnh số dư'&&v.a===571000)&&bt.vao.some(v=>v.n==='Điều chỉnh số dư'&&v.a===300000),'mỗi phía một dòng "Điều chỉnh số dư"');
h=G.vHome();
ok(h.includes('Điều chỉnh khi chốt sổ tháng 10'),'dòng điều chỉnh giảm xổ ra giao dịch của nó');

console.log('\nF · Hoàn tiền chỉ hiện số ròng');
const so4=()=>{const d=so(12000000);
  d.txns.push({id:30,d:'2026-10-18',t:'chi',a:120000,c:'gd_sn',s:'bidv',n:'Mua bánh kem'},
    {id:31,d:'2026-10-20',t:'thu',a:40000,c:'tkhac_hoan',s:'bidv',n:'Bạn gửi lại tiền bánh',hoan:30});return d;};
c2.__set(so4(),T10); h=G.vHome();
ok(h.includes('<span class="c3-n">Mua bánh kem</span><b>80.000</b>'),'bánh kem 120.000 − hoàn 40.000 → một dòng 80.000');
ok(!h.includes('Bạn gửi lại tiền bánh'),'KHÔNG hiện dòng hoàn tiền riêng');

console.log('\nG · Thứ tự khối, Tiết kiệm gọn, không còn nút mắt');
c2.__set(so(12000000),T10); h=G.vHome();
const iSo=h.indexOf('Số dư cuối'), iCC=h.indexOf('<b>Cơ cấu chi tiêu</b>'), iTK=h.indexOf('<b>Tiết kiệm &amp; Đầu tư</b>');
ok(iSo>0&&iCC>iSo,'Cơ cấu chi tiêu nằm SAU Số dư cuối tháng');
ok(iTK<0||iTK>iCC,'Tiết kiệm & Đầu tư nằm sau Cơ cấu chi tiêu');
ok(!h.includes('dc-mat')&&!h.includes('anSo'),'KHÔNG còn nút ẩn số');
ok(h.includes('<span class="tk-tag chua">Chưa chốt sổ</span>'),'chưa chốt → tag xám "Chưa chốt sổ"');
const s5=so(12000000); s5.budgets={tk:3000000}; c2.__set(s5,T10); h=G.vHome();
ok(h.includes('<b>0</b><span> / 3.000.000</span>')&&h.includes('thiếu 3.000.000'),'chưa chuyển tiết kiệm → thẻ gọn "0 / 3.000.000 · thiếu 3.000.000"');
ok(!h.includes('Sửa mức góp'),'thẻ gọn KHÔNG có thẻ mục tiêu');

console.log('\nH · Khoản chờ thu tính theo người (Vy duyệt B)');
const so6=()=>{const d=so(12000000);
  d.debts=[{id:'k1',name:'Cô B',kind:'cho',mode:'canhan',principal:1500000,start:'2026-10-02'},
           {id:'k2',name:'Cô B',kind:'cho',mode:'canhan',principal:1000000,start:'2026-10-03'}];
  d.txns.push({id:40,d:'2026-10-02',t:'chi',a:1500000,c:'muon',s:'bidv',n:'Cô B'},
    {id:41,d:'2026-10-03',t:'chi',a:1000000,c:'muon',s:'bidv',n:'Cô B'},
    {id:42,d:'2026-10-23',t:'thu',a:2500000,c:'thuno',s:'bidv',n:'Cô B trả',debt:'k1'});return d;};
c2.__set(so6(),T10); h=G.vHome();
ok(h.includes('↓ KHOẢN CHỜ THU <span class="nox-ch">▾</span></div><div class="noso">0</div>'),'trả dư khoản 1 bù khoản 2 → còn chờ thu 0 (cách cũ ra 1.000.000)');
ok(h.includes('>thu đủ 23/10</div>'),'Cô B ghi "thu đủ 23/10"');

console.log('\nI · Hẹn chuyển tiết kiệm lúc chốt sổ — tiền đi ngày nào ghi ngày đó (Vy 27/11/2026)');
const so7=nov=>{const d=so(12000000); d.budgets={tk:3000000};
  d.chot={'2026-10':{luc:Date.now(),bidv:1,vi:0,tm:0,tong:1,tk:{ds:[{s:'bidv',a:1000000}],tong:1000000}}};
  if(nov)d.txns.push({id:50,d:'2026-11-05',t:'chi',a:nov,c:'tk',s:'bidv',n:'Chuyển tiết kiệm'});return d;};
const T11=new Date(2026,10,1);
c2.__set(so7(0),T10);
eq(G.tongKet(T10).vaoTK,1000000,'tháng 10: Tiết kiệm = số hẹn lúc chốt 1.000.000');
eq(G.bangTien(T10).tongRa,12000000,'…nhưng (3) Thực chi tháng 10 KHÔNG đổi — hẹn không phải giao dịch');
ok(G.vHome().includes('Hẹn chuyển lúc chốt sổ'),'Tổng kết tháng 10 có dòng "Hẹn chuyển lúc chốt sổ"');
c2.__cur(T11);
ok(G.alerts().some(a=>a.t.includes('còn 1.000.000 chưa thấy trong sổ')),'tháng 11 chưa chuyển → nhắc "còn 1.000.000 chưa thấy trong sổ"');
ok(G.khoiMucTieu().includes('<b>0</b>'),'Mục tiêu tháng 11: tiết kiệm 0, KHÔNG âm');
c2.__set(so7(1500000),T11);
ok(!G.alerts().some(a=>a.t.includes('chưa thấy trong sổ')),'chuyển 1.500.000 ngày 05/11 → hết nhắc');
eq(G.tongKet(T11).vaoTK,500000,'tháng 11: 1.500.000 − 1.000.000 trả cho lời hẹn tháng 10 = 500.000');
eq(G.tongKet(T10).vaoTK,1000000,'tháng 10 vẫn 1.000.000');
ok(G.khoiMucTieu().includes('<b>500.000</b>'),'Mục tiêu tháng 11 đếm 500.000');
c2.__set(so7(600000),T11);
ok(G.alerts().some(a=>a.t.includes('còn 400.000')),'mới chuyển 600.000 → còn nhắc 400.000');
eq(G.tongKet(T11).vaoTK,0,'tháng 11: cả 600.000 trả cho lời hẹn → tháng 11 chưa có tiết kiệm riêng');

console.log(loi?'\n✗ '+loi+' điểm sai':'\n✓ tất cả đạt');
process.exitCode=loi?1:0;
