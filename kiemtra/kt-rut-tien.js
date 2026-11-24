/* Kiểm tra rút tiền mặt ATM và mục Phí ngân hàng, rút tiền (Vy 24/11/2026).
   Chuyện thật: "Giao dịch thẻ" 1.000.000 lúc 11:39 là rút ATM, kèm "Phí giao dịch thẻ" 1.100 cùng giờ.
   A.I từng ghi khoản rút thành chi Túi xách và phí thành Biếu bố mẹ. */
const fs=require('fs'), path=require('path'), vm=require('vm');
const SRC_APP=fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8');
let code=SRC_APP.slice(0,SRC_APP.indexOf("try{\n  const mf="));
code+=`
globalThis.__set=db=>{DB=db;memoClear();};
globalThis.__f={parsePaste,groupOf,labelOf,codeList,promptText};`;
const el0={innerHTML:'',scrollIntoView(){},appendChild(){},click(){},remove(){},style:{},dataset:{},value:''};
const ctx={console,Intl,Date,Math,JSON,Object,Array,String,Number,isNaN,parseInt,parseFloat,
  setTimeout:()=>0,clearTimeout(){},localStorage:{getItem:()=>null,setItem(){}},navigator:{},
  Blob:function(){},File:function(){},URL:{createObjectURL:()=>'x',revokeObjectURL(){}},
  confirm:()=>true, prompt:()=>null,
  document:{getElementById:()=>el0,createElement:()=>el0,querySelector:()=>null,head:el0,body:el0,documentElement:el0}};
ctx.window=ctx; ctx.globalThis=ctx;
ctx.window.matchMedia=()=>({matches:false,addEventListener(){},addListener(){}});
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

console.log('\n'+(loi?'✗ '+loi+' LỖI':'✓ ĐẠT HẾT'));
process.exit(loi?1:0);
