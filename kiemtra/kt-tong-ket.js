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
globalThis.__f={vHome,bangTien,bangChiTiet,theDaChi,vInfo};`;
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

console.log(loi?'\n✗ '+loi+' điểm sai':'\n✓ tất cả đạt');
process.exitCode=loi?1:0;
