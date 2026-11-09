/* Kiểm tra thu nợ nhiều hơn số còn nợ (Vy duyệt phác thảo đợt 6, 09/11/2026).
   Dựng theo đúng chuyện thật: cho mượn 1.500.000 (26/09) + 1.000.000 (23/10 14:03),
   người đó chuyển về 3.500.000 lúc 15:47 — 2.500.000 trả nợ, 1.000.000 nhờ rút tiền mặt.
   Tên người là tên giả (kho công khai). */
const fs=require('fs'), path=require('path'), vm=require('vm');
const SRC_APP=fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8');
let code=SRC_APP.slice(0,SRC_APP.indexOf("try{\n  const mf="));
code+=`
globalThis.__set=(db,cur)=>{DB=db;cursor=cur;tab='list';open={};msg='';duMo=null;pending=null;chotHoi=null;memoClear();};
globalThis.__f={duCho,duDaLuu,duMoL,duChonL,duTachL,duChonP,vList,vImport,commit,balances,bangTien,nguoiNo,chainRows,needDu,memoClear};
globalThis.__pend=p=>{pending=p;};
globalThis.__ch=()=>chotHoi;
globalThis.__db=()=>DB;`;

const HOM='2026-11-09';
const R=Date, FD=class extends R{constructor(...a){if(!a.length)super(HOM+'T10:00:00');else super(...a);}
  static now(){return new R(HOM+'T10:00:00').getTime();}};
const el0={innerHTML:'',scrollIntoView(){},appendChild(){},click(){},remove(){},style:{},dataset:{},value:''};
const ctx={console,Intl,Date:FD,Math,JSON,Object,Array,String,Number,isNaN,parseInt,parseFloat,
  setTimeout:()=>0,clearTimeout(){},localStorage:{getItem:()=>null,setItem(){}},navigator:{},
  Blob:function(){},File:function(){},URL:{createObjectURL:()=>'x',revokeObjectURL(){}},
  confirm:()=>true, prompt:()=>null,
  document:{getElementById:id=>(id==='app'||id==='nav'||id==='hop'?el0:null),createElement:()=>el0,
    querySelector:()=>null,head:el0,body:el0,documentElement:el0}};
ctx.window=ctx; ctx.globalThis=ctx;
ctx.window.matchMedia=()=>({matches:false,addEventListener(){},addListener(){}});
ctx.window.scrollTo=()=>{}; ctx.window.scrollY=0;
vm.createContext(ctx); vm.runInContext(code,ctx,{filename:'app.js'});
const F=ctx.__f;

let loi=0;
const ok=(dk,t,them)=>{if(dk)console.log('  ✓ '+t);else{loi++;console.log('  ✗ '+t+(them?'\n      → '+them:''));}};
const eq=(a,b,t)=>ok(JSON.stringify(a)===JSON.stringify(b),t,'được '+JSON.stringify(a)+', cần '+JSON.stringify(b));
const T10=new Date(2026,9,1);

const THU={id:300,d:'2026-10-23',tm:'15:47',t:'thu',a:3500000,c:'thuno',s:'bidv',n:'Nhan tien tu Ba B',b:5000000,p:'1234',debt:'d1'};
function so(coThu){
  const db={v:15,txns:[
      {id:100,d:'2026-09-26',tm:'09:10',t:'chi',a:1500000,c:'muon',s:'bidv',n:'Chuyen tien ba B'},
      {id:200,d:'2026-10-23',tm:'14:03',t:'chi',a:1000000,c:'muon',s:'bidv',n:'Chuyen tien ba B'},
      {id:250,d:'2026-10-10',t:'thu',a:500000,c:'tkhac',s:'tm',n:'Tien mat'}],
    debts:[{id:'d1',name:'bà B',kind:'cho',mode:'canhan',principal:1500000,start:'2026-09-26'},
           {id:'d2',name:'bà B',kind:'cho',mode:'canhan',principal:1000000,start:'2026-10-23'}],
    budgets:{},bm:{},goals:[],fixedItems:[],roll:{},offsets:[],draws:[],income:0,rules:{},
    opens:{bidv:3000000,vi:0,tm:2000000},checks:{},opts:{},chainOK:{},goalPlan:{},payDays:{k1:[5,10],k2:[15,25]},
    ngayOK:{},chot:{},chotLS:[],nsChot:{},lichThu:{},batDau:'2026-09-01'};
  if(coThu)db.txns.push(Object.assign({},THU));
  return db;
}
const tim=(db,f)=>db.txns.filter(f);

console.log('\nA · Khoản đã lưu: nhận ra phần dư');
let db=so(true); ctx.__set(db,T10);
{const t=db.txns.find(x=>x.id===300);
  eq(F.duDaLuu(t),1000000,'thu 3.500.000, còn nợ 2.500.000 → dư 1.000.000');
  ok(db.txns.filter(x=>x.id!==300).every(x=>F.duDaLuu(x)===0),'các dòng khác không bị báo dư');
  const h=F.vList();
  ok(h.includes('thu dư 1.000.000 so với số còn nợ'),'tab Giao dịch hiện "thu dư 1.000.000 so với số còn nợ · tách"');
  F.duMoL('300'); const h2=F.vList();
  ok(h2.includes('bà B chỉ còn nợ <b>2.500.000</b>. Phần dư <b>1.000.000</b> là gì?'),'bấm tách → hỏi đúng câu, đúng số');
  ok(!h2.includes('Tách thành 2 dòng'),'chưa chọn thì chưa có nút Tách');}

console.log('\nB · Chọn "Nhờ rút tiền mặt" rồi tách');
{const b0=F.balances(), tien0=F.bangTien(T10);
  F.duChonL('doi'); ok(F.vList().includes('Tách thành 2 dòng'),'chọn xong mới hiện nút Tách thành 2 dòng');
  F.duTachL();
  const a=tim(db,x=>x.id===300)[0], m=tim(db,x=>x.doi&&x.d==='2026-10-23')[0];
  eq([a.t,a.a,a.c,a.debt,a.tm,a.b],['thu',2500000,'thuno','d1','15:47',5000000],'dòng thu nợ còn 2.500.000, giữ mã, giờ, số dư, khoản nợ');
  eq([m.t,m.s,m.s2,m.a,m.tm,m.b,!!m.c],['mv','tm','bidv',1000000,'15:47',5000000,false],'dòng đổi tiền mặt 1.000.000: Tiền mặt → BIDV, cùng giờ, không nhóm');
  ok(a.sg&&a.sg===m.sg,'hai dòng chung một nhóm tách (sg)');
  ctx.__set(db,T10); const b1=F.balances(), tien1=F.bangTien(T10);
  eq(b1.bidv,b0.bidv,'BIDV không đổi (vẫn nhận đủ 3.500.000)');
  eq(b0.tm-b1.tm,1000000,'Tiền mặt bớt 1.000.000');
  eq(tien0.thuno-tien1.thuno,1000000,'thu nợ tháng 10 bớt 1.000.000');
  eq(tien1.choRong-tien0.choRong,1000000,'(4) Tiền đang cho vay tăng 1.000.000 (từ −1.000.000 về 0)');
  eq(tien1.tongVao,tien0.tongVao,'(2) Thực thu không đổi — đổi tiền mặt không phải thu');
  eq(tien1.cuoi,b1.bidv+b1.vi+b1.tm,'bảng (1)…(5) vẫn cộng về đúng số dư');
  const p=F.nguoiNo().find(x=>x.ten==='bà B');
  eq([p.total,p.paid,p.left,p.done],[2500000,2500000,0,true],'bà B: cho mượn 2.500.000, đã thu 2.500.000, xong');
  ok(db.txns.every(x=>F.duDaLuu(x)===0),'sau khi tách, không còn dòng nào báo dư');
  const r=F.chainRows().filter(x=>x.d==='2026-10-23'&&x.tm==='15:47');
  eq(r.map(x=>x.delta),[3500000],'chuỗi đối chiếu BIDV thấy đúng MỘT lần nhận 3.500.000');}

console.log('\nC · Chọn "Thu khác"');
db=so(true); ctx.__set(db,T10);
{const tien0=F.bangTien(T10); F.duMoL('300'); F.duChonL('khac'); F.duTachL(); ctx.__set(db,T10);
  const k=tim(db,x=>x.c==='tkhac'&&x.d==='2026-10-23')[0];
  eq([k&&k.t,k&&k.a,k&&k.s],['thu',1000000,'bidv'],'dòng thu khác 1.000.000 vào BIDV');
  eq(F.bangTien(T10).tongVao-tien0.tongVao,1000000,'(2) Thực thu tăng 1.000.000');}

console.log('\nD · Chọn "Đúng, thu hết là trả nợ"');
db=so(true); ctx.__set(db,T10);
{F.duMoL('300'); F.duChonL('no'); ok(F.vList().includes('Giữ nguyên, thôi hỏi'),'nút ghi "Giữ nguyên, thôi hỏi"');
  F.duTachL(); ctx.__set(db,T10);
  eq(db.txns.length,4,'không tách, không thêm dòng');
  ok(!F.vList().includes('thu dư'),'thôi báo dư');}

console.log('\nE · Tab Nhập: hỏi ngay khi xem lại, chưa chọn thì không cho lưu');
db=so(false); ctx.__set(db,T10);
{const p=Object.assign({},THU,{keep:true,ng:'cho|bà B'}); delete p.id; delete p.debt;
  ctx.__pend([p]);
  eq(F.duCho(p),1000000,'dòng mới 3.500.000, bà B còn chờ thu 2.500.000 → dư 1.000.000');
  let h=F.vImport();
  ok(h.includes('chỉ còn nợ <b>2.500.000</b>'),'hiện hộp hỏi phần dư');
  ok(/Còn 1 khoản thu nợ nhiều hơn số còn nợ/.test(h)&&/class="btn" disabled onclick="commit\(\)"/.test(h),'chưa chọn → báo và khóa nút Lưu');
  F.duChonP(0,'doi'); h=F.vImport();
  ok(h.includes('Lưu sẽ thành 2 dòng. BIDV vẫn nhận đủ 3.500.000, Tiền mặt bớt 1.000.000.'),'chọn xong hiện trước 2 dòng sẽ lưu');
  ok(!/class="btn" disabled onclick="commit\(\)"/.test(h),'chọn xong thì mở nút Lưu');
  F.commit(); ctx.__set(db,T10);
  const a=tim(db,x=>x.c==='thuno'), m=tim(db,x=>x.doi);
  eq([a.length,a[0]&&a[0].a,m.length,m[0]&&m[0].a],[1,2500000,1,1000000],'lưu thành 2 dòng: thu nợ 2.500.000 + đổi tiền mặt 1.000.000');
  ok(a[0]&&a[0].debt,'dòng thu nợ được gắn vào khoản của bà B');
  eq(F.nguoiNo().find(x=>x.ten==='bà B').left,0,'bà B đã trả xong');}

console.log('\nF · Không hỏi khi không dư');
db=so(false); ctx.__set(db,T10);
{const mk=(a,ng,c)=>Object.assign({},THU,{a,keep:true,ng,c:c||'thuno'});
  eq(F.duCho(mk(2500000,'cho|bà B')),0,'thu đúng 2.500.000 → không hỏi');
  eq(F.duCho(mk(1000000,'cho|bà B')),0,'thu một phần → không hỏi');
  eq(F.duCho(mk(3500000,'')),0,'chưa chọn người → không hỏi');
  eq(F.duCho(mk(3500000,'cho|bà B','tkhac')),0,'không phải thu nợ → không hỏi');
  ok(!F.needDu(Object.assign(mk(3500000,'cho|bà B'),{keep:false})),'dòng đã bỏ chọn → không chặn nút Lưu');
  ctx.__set(so(true),T10); const d2=ctx.__db(); d2.txns.find(x=>x.id===300).a=2500000; ctx.__set(d2,T10);
  ok(!F.vList().includes('thu dư'),'khoản đã lưu thu vừa đủ → không báo');}

console.log('\nG · Tháng đã chốt: tách mà đổi số dư thì hỏi trước, chưa đụng sổ');
db=so(true); db.chot={'2026-10':{luc:Date.now(),bidv:0,vi:0,tm:0,tong:0}}; ctx.__set(db,T10);
{F.duMoL('300'); F.duChonL('doi'); F.duTachL();
  ok(!!ctx.__ch(),'mở hộp xác nhận sửa tháng đã chốt');
  eq(db.txns.length,4,'chưa xác nhận thì sổ chưa đổi');}

console.log('\n'+(loi?'✗ '+loi+' LỖI':'✓ ĐẠT HẾT'));
process.exit(loi?1:0);
