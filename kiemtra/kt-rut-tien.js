/* Kiểm tra rút tiền mặt ATM và mục Phí ngân hàng, rút tiền (Vy 24/11/2026).
   Chuyện thật: "Giao dịch thẻ" 1.000.000 lúc 11:39 là rút ATM, kèm "Phí giao dịch thẻ" 1.100 cùng giờ.
   A.I từng ghi khoản rút thành chi Túi xách và phí thành Biếu bố mẹ. */
const fs=require('fs'), path=require('path'), vm=require('vm');
const SRC_APP=fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8');
let code=SRC_APP.slice(0,SRC_APP.indexOf("try{\n  const mf="));
code+=`
globalThis.__set=db=>{DB=db;cursor=new Date(2026,9,1);tab='list';open={};chotHoi=null;memoClear();};
globalThis.__mo=id=>{rowOpen=id;};
globalThis.__ch=()=>chotHoi;
globalThis.__f={parsePaste,groupOf,labelOf,codeList,promptText,doiRut,vList,balances};`;
const el0={innerHTML:'',scrollIntoView(){},appendChild(){},click(){},remove(){},style:{},dataset:{},value:''};
const ctx={console,Intl,Date,Math,JSON,Object,Array,String,Number,isNaN,parseInt,parseFloat,
  setTimeout:()=>0,clearTimeout(){},localStorage:{getItem:()=>null,setItem(){}},navigator:{},
  Blob:function(){},File:function(){},URL:{createObjectURL:()=>'x',revokeObjectURL(){}},
  confirm:()=>true, prompt:()=>null,
  document:{getElementById:()=>el0,createElement:()=>el0,querySelector:()=>null,head:el0,body:el0,documentElement:el0}};
ctx.window=ctx; ctx.globalThis=ctx;
ctx.window.matchMedia=()=>({matches:false,addEventListener(){},addListener(){}});
ctx.window.scrollTo=()=>{}; ctx.window.scrollY=0;
vm.createContext(ctx); vm.runInContext(code,ctx,{filename:'app.js'});
const F=ctx.__f;

let loi=0;
const ok=(dk,t,them)=>{if(dk)console.log('  ✓ '+t);else{loi++;console.log('  ✗ '+t+(them?'\n      → '+them:''));}};
const eq=(a,b,t)=>ok(JSON.stringify(a)===JSON.stringify(b),t,'được '+JSON.stringify(a)+', cần '+JSON.stringify(b));
ctx.__set({txns:[],debts:[],rules:{},opts:{}});
const doc=s=>F.parsePaste(s);

console.log('\nA · Mục mới Phí ngân hàng, rút tiền');
eq(F.groupOf('hd_phi').id,'hd','hd_phi nằm trong nhóm Hóa đơn & tiện ích');
eq(F.labelOf('hd_phi'),'Phí ngân hàng, rút tiền','tên mục hiện đúng');
ok(F.codeList('chi').includes('hd_phi=Hóa đơn & tiện ích › Phí ngân hàng, rút tiền'),'mã hd_phi có trong danh sách gửi A.I');
ok(F.promptText().includes('ghi mã nhóm là ruttm')&&F.promptText().includes('ghi mã nhóm là hd_phi'),'câu lệnh A.I có quy tắc rút tiền ATM và phí');

console.log('\nB · Dán dòng A.I trả về');
{const r=doc('2026-10-24 11:39 | bidv | chi | 1000000 | Giao dịch thẻ | ruttm | 5000000 | \n2026-10-24 11:39 | bidv | chi | 1100 | Phí giao dịch thẻ | hd_phi | 4998900 | ');
  eq([r[0].t,r[0].s,r[0].s2,r[0].a,r[0].c,r[0].b],['mv','bidv','tm',1000000,'',5000000],'ruttm → chuyển nguồn BIDV → Tiền mặt, giữ số dư ngân hàng');
  eq([r[1].t,r[1].c,r[1].a],['chi','hd_phi',1100],'phí 1.100 → chi, mục Phí ngân hàng, rút tiền');}

console.log('\nC · Không đổi nhầm');
{const r=doc('2026-10-24 11:39 | bidv | thu | 1000000 | Nhận tiền | ruttm |  | \n2026-10-24 11:39 | tm | chi | 50000 | Gì đó | ruttm |  | ');
  eq([r[0].t,r[0].c],['thu',''],'dòng THU mang mã ruttm → không thành rút tiền, để trống nhóm');
  eq([r[1].t,r[1].s,r[1].c],['chi','tm',''],'dòng từ Tiền mặt mang mã ruttm → không thành rút tiền');}

console.log('\nD · Tab Giao dịch: sửa dòng đã lưu (phác thảo đợt 7)');
const so=()=>({v:15,txns:[
    {id:1,d:'2026-10-24',tm:'11:39',t:'chi',a:1000000,c:'qa_tui',s:'bidv',n:'Giao dịch thẻ',b:5000000},
    {id:2,d:'2026-10-24',tm:'11:39',t:'chi',a:1100,c:'gd_bome',s:'bidv',n:'Phí giao dịch thẻ',b:4998900},
    {id:3,d:'2026-10-20',t:'chi',a:50000,c:'an_ngoai',s:'tm',n:'Ăn trưa'},
    {id:4,d:'2026-10-21',t:'chi',a:200000,c:'muon',s:'bidv',n:'Cho bạn mượn'},
    {id:5,d:'2026-10-22',t:'thu',a:300000,c:'tkhac',s:'bidv',n:'Nhận tiền'}],
  debts:[],budgets:{},bm:{},goals:[],fixedItems:[],roll:{},offsets:[],draws:[],income:0,
  rules:{'k:giao dich the':'qa_tui','k:phi giao dich the':'gd_bome','k:an trua':'an_ngoai'},
  opens:{bidv:6000000,vi:0,tm:500000},checks:{},opts:{},chainOK:{},goalPlan:{},payDays:{k1:[5,10],k2:[15,25]},
  ngayOK:{},chot:{},chotLS:[],nsChot:{},lichThu:{},batDau:'2026-10-01'});
let db=so(); ctx.__set(db);
{const nut=id=>{ctx.__mo(String(id));return F.vList();};
  ok(nut(1).includes('Đây là rút tiền mặt')&&nut(1).includes('Ứng trước · nhận lại tiền mặt'),'dòng chi BIDV có hai nút mới');
  ok(!nut(3).includes('Đây là rút tiền mặt'),'dòng chi Tiền mặt KHÔNG có nút');
  ok(!nut(4).includes('Đây là rút tiền mặt'),'dòng Cho mượn KHÔNG có nút (gắn với sổ nợ)');
  ok(!nut(5).includes('Đây là rút tiền mặt'),'dòng thu KHÔNG có nút');
  const b0=F.balances(); F.doiRut('1',0); ctx.__set(db);
  const r=db.txns.find(x=>x.id===1);
  eq([r.t,r.s,r.s2,r.a,'c' in r,r.tm,r.b,!!r.doi],['mv','bidv','tm',1000000,false,'11:39',5000000,false],'đổi thành rút tiền mặt BIDV → Tiền mặt, giữ giờ và số dư ngân hàng');
  const b1=F.balances();
  eq([b1.bidv-b0.bidv,b1.tm-b0.tm],[0,1000000],'BIDV không đổi, Tiền mặt +1.000.000');
  ok(!('k:giao dich the' in db.rules),'bỏ quy tắc học sai "giao dich the → Túi xách"');
  eq([db.rules['k:phi giao dich the'],db.rules['k:an trua']],['gd_bome','an_ngoai'],'các quy tắc khác giữ nguyên');}
db=so(); ctx.__set(db);
{F.doiRut('1',1); const r=db.txns.find(x=>x.id===1);
  eq([r.t,r.s2,!!r.doi],['mv','tm',true],'nút ứng trước: cũng là BIDV → Tiền mặt, đánh dấu đổi tiền mặt');}
db=so(); db.chot={'2026-10':{luc:1,bidv:0,vi:0,tm:0,tong:0}}; ctx.__set(db);
{F.doiRut('1',0);
  ok(!!ctx.__ch()&&db.txns.find(x=>x.id===1).t==='chi','tháng đã chốt: hỏi trước, chưa đổi sổ');}

console.log('\n'+(loi?'✗ '+loi+' LỖI':'✓ ĐẠT HẾT'));
process.exit(loi?1:0);
