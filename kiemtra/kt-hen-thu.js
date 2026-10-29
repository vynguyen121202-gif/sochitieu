/* Kiểm tra lịch hẹn thu nhiều đợt (Vy duyệt phác thảo đợt 5, 29/10/2026).
   Ví dụ Vy đã duyệt: A mượn 1.000.000, hẹn 500.000 ngày 20/10 + 500.000 ngày 05/11
   → tháng 10 chỉ cộng 500.000 vào vế (b). Đồng hồ giả, đổi được giữa các bước. */
const fs=require('fs'), path=require('path'), vm=require('vm');
const SRC_APP=fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8');
let code=SRC_APP.slice(0,SRC_APP.indexOf("try{\n  const mf="));
code+=`
globalThis.__set=(db,cur)=>{DB=db;cursor=cur;tab='debt';open={};msg='';nF=null;htF=null;memoClear();};
globalThis.__f={thanhKhoan,lichNg,debtInfo,vDebt,luuLich,luuTenNg,gopNguoi,migrate,nguoiNo,memoClear};
globalThis.__mo=()=>{nguoiNo().forEach(p=>{open['ng_'+p.khoa]=1;});};
globalThis.__moNh=k=>{open['nh_'+k]=1;};
globalThis.__ht=v=>{htF=v;};
globalThis.__NGK=()=>NGK;
globalThis.__db=()=>DB;`;

let HOM='2026-10-15';
const R=Date, FD=class extends R{constructor(...a){if(!a.length)super(HOM+'T10:00:00');else super(...a);}
  static now(){return new R(HOM+'T10:00:00').getTime();}};
let O={};
const el0={innerHTML:'',scrollIntoView(){},appendChild(){},click(){},remove(){},style:{},dataset:{},value:''};
const ctx={console,Intl,Date:FD,Math,JSON,Object,Array,String,Number,isNaN,parseInt,parseFloat,
  setTimeout:()=>0,clearTimeout(){},localStorage:{getItem:()=>null,setItem(){}},navigator:{},
  Blob:function(){},File:function(){},URL:{createObjectURL:()=>'x',revokeObjectURL(){}},
  confirm:()=>true, prompt:()=>null,
  document:{getElementById:id=>O[id]||(id==='app'||id==='nav'?el0:null),createElement:()=>el0,
    querySelector:()=>null,head:el0,body:el0,documentElement:el0}};
ctx.window=ctx; ctx.globalThis=ctx;
ctx.window.matchMedia=()=>({matches:false,addEventListener(){},addListener(){}});
ctx.window.scrollTo=()=>{}; ctx.window.scrollY=0;
vm.createContext(ctx); vm.runInContext(code,ctx,{filename:'app.js'});
const F=ctx.__f;

let loi=0;
const ok=(dk,t,them)=>{if(dk)console.log('  ✓ '+t);else{loi++;console.log('  ✗ '+t+(them?'\n      → '+them:''));}};
const eq=(a,b,t)=>ok(JSON.stringify(a)===JSON.stringify(b),t,'được '+JSON.stringify(a)+', cần '+JSON.stringify(b));
const oLoi=()=>{O={'loi-ht':{hidden:true,textContent:''}};};

const soMoi=()=>({v:15,txns:[
    {id:1,d:'2026-10-01',t:'thu',a:9000000,c:'luong',s:'bidv',n:'Luong'},
    {id:2,d:'2026-10-02',t:'chi',a:1000000,c:'muon',s:'bidv',n:'Cho A muon'}],
  debts:[{id:'d1',name:'A',kind:'cho',mode:'canhan',principal:1000000,start:'2026-10-02'}],
  budgets:{},bm:{},goals:[],fixedItems:[],roll:{},offsets:[],draws:[],income:0,rules:{},
  opens:{bidv:0,vi:0,tm:0},checks:{},opts:{},chainOK:{},goalPlan:{},payDays:{k1:[5,10],k2:[15,25]},
  ngayOK:{},chot:{},chotLS:[],nsChot:{},lichThu:{},batDau:'2026-10-01'});
const T10=new Date(2026,9,1), T11=new Date(2026,10,1);
/* đặt lịch qua đúng nút "Lưu lịch hẹn" */
function datLich(dot,khoa){
  F.vDebt(); const i=ctx.__NGK().indexOf(khoa||'cho|A');
  ctx.__ht({khoa:khoa||'cho|A',dot}); oLoi(); F.luuLich(i); return O['loi-ht'];
}
const db=soMoi();

console.log('\nA · Chưa có lịch: giữ nguyên như trước');
ctx.__set(db,T10);
{const q=F.thanhKhoan(T10);
  eq(q.henTong,0,'chưa hẹn ngày → không cộng gì');
  eq(q.treo,[{n:'A',a:1000000}],'khoản A nằm ở danh sách chưa tính');
  eq(F.lichNg('cho|A'),null,'chưa có lịch → lichNg trả null');}

console.log('\nB · Lưu lịch 2 đợt: 20/10 và 05/11 (ví dụ Vy duyệt)');
ctx.__set(db,T10);
{const e=datLich([{d:'20/10/26',a:'500.000'},{d:'05/11/26',a:'500.000'}]);
  ok(e.hidden,'lưu được, không báo lỗi',e.textContent);
  eq(db.lichThu['cho|A'],{goc:0,dot:[{d:'2026-10-20',a:500000},{d:'2026-11-05',a:500000}]},'sổ ghi lịch theo người, goc = đã thu lúc lưu = 0');
  eq(db.debts[0].due,'2026-10-20','ô due cũ của khoản = đợt đầu (cho các chỗ cũ còn đọc due)');
  const q=F.thanhKhoan(T10);
  eq(q.henTong,500000,'tháng 10 chỉ cộng đợt 20/10 = 500.000');
  eq(q.A1-q.A0,500000,'A1 − A0 = 500.000');
  eq(q.treo,[{n:'A',a:500000}],'đợt 05/11 (500.000) là "chưa tính" trong tháng 10');
  eq(q.henNgay,'2026-10-20','ngày hẹn gần nhất 20/10');
  const i=F.debtInfo(db.debts[0]);
  eq([i.nextDate,i.nextAmt],['2026-10-20',500000],'khoản A: hẹn tới 20/10, số 500.000');
  ctx.__mo(); const h=F.vDebt();
  ok(h.includes('hẹn thu 2 đợt · đợt tới 20/10'),'thẻ đóng ghi "hẹn thu 2 đợt · đợt tới 20/10"');
  ok(h.includes('Lịch hẹn thu'),'thẻ mở có danh sách Lịch hẹn thu');
  ok(!h.includes('đã qua ngày hẹn'),'KHÔNG ghi "đã qua ngày hẹn" khi đợt chưa tới');}

console.log('\nC · Thu về 300.000 trước đợt 1 → trừ vào đợt sớm nhất');
db.txns.push({id:3,d:'2026-10-15',t:'thu',a:300000,c:'thuno',s:'bidv',n:'A tra',debt:'d1'});
ctx.__set(db,T10);
{const L=F.lichNg('cho|A');
  eq(L.dot.map(o=>[o.thu,o.con]),[[300000,200000],[0,500000]],'đợt 20/10: đã thu 300.000, còn 200.000; đợt 05/11 chưa đụng');
  eq(F.thanhKhoan(T10).henTong,200000,'tháng 10 còn cộng 200.000');
  ctx.__mo(); const h=F.vDebt();
  ok(h.includes('đã thu 300.000')&&h.includes('còn 200.000'),'thẻ ghi "đã thu 300.000 · còn 200.000"');}

console.log('\nD · Qua 20/10 mà chưa thu đủ → thôi cộng (quy tắc 27/09)');
HOM='2026-10-21'; ctx.__set(db,T10);
{const q=F.thanhKhoan(T10);
  eq(q.henTong,0,'21/10: không cộng gì nữa');
  eq(q.treo,[{n:'A',a:700000}],'cả 700.000 còn lại về danh sách chưa tính');
  ctx.__mo(); const h=F.vDebt();
  ok(h.includes('đã qua ngày hẹn thu 20/10'),'thẻ ghi "đã qua ngày hẹn thu 20/10"');
  ok(!h.includes('quá hạn'),'KHÔNG ghi chữ "quá hạn" cho khoản chờ thu');}

console.log('\nE · Sang tháng 11: chỉ đợt 05/11 được cộng, phần sót của đợt 1 thì không');
HOM='2026-11-01'; ctx.__set(db,T11);
eq(F.thanhKhoan(T11).henTong,500000,'tháng 11 cộng 500.000 (đợt 05/11), không cộng 200.000 sót của đợt 20/10');

console.log('\nF · Thu nốt thì hết lịch, không cộng gì');
db.txns.push({id:4,d:'2026-11-01',t:'thu',a:700000,c:'thuno',s:'bidv',n:'A tra not',debt:'d1'});
ctx.__set(db,T11);
{const q=F.thanhKhoan(T11);
  eq([q.henTong,q.treo.length],[0,0],'A đã trả đủ → không cộng, không treo');
  ok(F.lichNg('cho|A').dot.every(o=>o.con===0),'mọi đợt đã thu đủ');}
db.txns.pop();

console.log('\nG · Lưu lịch sai thì báo ngay trong form, sổ không đổi');
HOM='2026-10-15'; ctx.__set(db,T10);
{const truoc=JSON.stringify(db.lichThu);
  let e=datLich([{d:'20/10/26',a:'500.000'},{d:'05/11/26',a:'400.000'}]);
  ok(!e.hidden&&/nhiều hơn số còn chờ thu 700\.000/.test(e.textContent),'cộng 900.000 > còn chờ thu 700.000 → báo lỗi',e.textContent);
  e=datLich([{d:'32/10',a:'500.000'}]);
  ok(!e.hidden&&/ngày chưa đúng/.test(e.textContent),'ngày không có thật → báo lỗi',e.textContent);
  e=datLich([{d:'25/10/26',a:''}]);
  ok(!e.hidden&&/chưa có số tiền/.test(e.textContent),'thiếu số tiền → báo lỗi',e.textContent);
  eq(JSON.stringify(db.lichThu),truoc,'sau ba lần lỗi, lịch trong sổ không đổi');}

console.log('\nH · Sửa lịch: số tiền mỗi đợt tính trên phần CÒN chờ thu, goc chụp lại');
{const e=datLich([{d:'25/10/26',a:'700.000'}]);
  ok(e.hidden,'một đợt 700.000 ngày 25/10 lưu được');
  eq(db.lichThu['cho|A'],{goc:300000,dot:[{d:'2026-10-25',a:700000}]},'goc = 300.000 đã thu trước lúc sửa');
  eq(F.lichNg('cho|A').dot[0].con,700000,'300.000 thu trước KHÔNG bị trừ lần nữa vào đợt mới');
  eq(F.thanhKhoan(T10).henTong,700000,'tháng 10 cộng 700.000');
  ctx.__mo(); ok(F.vDebt().includes('hẹn thu 25/10'),'một đợt thì ghi như cũ "hẹn thu 25/10"');}

console.log('\nI · Bỏ hết các đợt = bỏ lịch');
{datLich([]);
  ok(!('cho|A' in db.lichThu),'lịch đã xóa');
  ok(!db.debts[0].due,'ô due của khoản cũng xóa');
  eq(F.thanhKhoan(T10).henTong,0,'không cộng gì');}

console.log('\nJ · Đổi tên và gộp người: lịch đi theo');
datLich([{d:'25/10/26',a:'700.000'}]);
{F.vDebt(); const i=ctx.__NGK().indexOf('cho|A');
  O={['ngten-'+i]:{value:'Chị A'}}; F.luuTenNg(i);
  ok(db.lichThu['cho|Chị A']&&!db.lichThu['cho|A'],'đổi tên A → Chị A: lịch sang khóa mới');
  eq(F.thanhKhoan(T10).henTong,700000,'vẫn cộng 700.000 sau khi đổi tên');}
db.debts.push({id:'d2',name:'BAN A',kind:'cho',mode:'canhan',principal:200000,start:'2026-10-05'});
db.txns.push({id:5,d:'2026-10-05',t:'chi',a:200000,c:'muon',s:'bidv',n:'Cho BAN A'},
             {id:6,d:'2026-10-10',t:'thu',a:100000,c:'thuno',s:'bidv',n:'BAN A tra',debt:'d2'});
ctx.__set(db,T10);
{F.vDebt(); const K=ctx.__NGK(), i=K.indexOf('cho|BAN A'), j=K.indexOf('cho|Chị A');
  F.gopNguoi(i,j);
  eq(db.lichThu['cho|Chị A'].goc,400000,'gộp BAN A vào Chị A: goc cộng thêm 100.000 BAN A đã trả');
  eq(F.lichNg('cho|Chị A').dot[0].con,700000,'100.000 cũ của BAN A KHÔNG bị tính là thu theo lịch');
  const q=F.thanhKhoan(T10);
  eq(q.henTong,700000,'cộng 700.000 theo lịch');
  eq(q.treo,[{n:'Chị A',a:100000}],'100.000 còn của khoản BAN A chưa hẹn → chưa tính');}

console.log('\nK · Sổ cũ v14 lên v15');
{const cu=soMoi(); delete cu.lichThu; cu.v=14; cu.debts[0].due='2026-10-20';
  const m=F.migrate(JSON.parse(JSON.stringify(cu)));
  eq([m.v,m.lichThu],[15,{}],'v15, lichThu rỗng');
  delete m.lichThu; m.v=14; eq(JSON.stringify(m),JSON.stringify(cu),'không đụng gì khác trong sổ');
  ctx.__set(F.migrate(cu),T10);
  eq(F.thanhKhoan(T10).henTong,1000000,'khoản cũ có due, không có lịch → vẫn cộng như trước');}

console.log('\n'+(loi?'✗ '+loi+' LỖI':'✓ ĐẠT HẾT'));
process.exit(loi?1:0);
