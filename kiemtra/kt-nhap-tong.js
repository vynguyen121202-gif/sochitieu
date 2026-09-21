const fs=require('fs'), path=require('path'), vm=require('vm');
let code=fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8');
code=code.slice(0,code.indexOf("try{\n  const mf="));
code+=`
globalThis.__set=(db)=>{DB=db;cursor=new Date();tab='import';open={};msg='';memoClear();};
globalThis.__pend=p=>{pending=p;};
globalThis.__v=()=>vImport();
globalThis.__togAll=v=>togAll(v);
globalThis.__peek=()=>pending;`;
const el={innerHTML:'',scrollIntoView(){},appendChild(){},click(){},remove(){},style:{}};
const ctx={console,Intl,Date,Math,JSON,Object,Array,String,Number,isNaN,parseInt,parseFloat,
  setTimeout:()=>0,clearTimeout(){},localStorage:{getItem:()=>null,setItem(){}},navigator:{},
  Blob:function(){},File:function(){},URL:{createObjectURL:()=>'x'},confirm:()=>true,
  document:{getElementById:()=>el,createElement:()=>el,head:el,body:el,documentElement:el}};
ctx.window=ctx;ctx.globalThis=ctx;ctx.window.matchMedia=()=>({matches:false,addEventListener(){}});
ctx.window.scrollTo=()=>{};ctx.window.scrollY=0;ctx.window.pageYOffset=0;
vm.createContext(ctx);vm.runInContext(code,ctx);

let loi=0;
const ok=(d,t,x)=>{if(d)console.log('  ✓ '+t);else{loi++;console.log('  ✗ '+t+(x?'\n      → '+x:''));}};
const M=n=>new Intl.NumberFormat('vi-VN').format(Math.round(n));

ctx.__set({txns:[],v:10,debts:[],budgets:{},bm:{},goals:[],fixedItems:[],roll:{},offsets:[],
  draws:[],income:0,rules:{},opens:{},checks:{},opts:{},chainOK:{},goalPlan:{},payDays:{}});

const P=[
 {id:1,d:'2026-09-20',t:'chi',a:120000,c:'an_ngoai',s:'bidv',n:'Com trua',keep:true},
 {id:2,d:'2026-09-20',t:'chi',a:80000,c:'di_xang',s:'tm',n:'Xang',keep:true},
 {id:3,d:'2026-09-19',t:'thu',a:9000000,c:'luong',s:'bidv',n:'Luong',keep:true},
 {id:4,d:'2026-09-19',t:'mv',a:500000,s:'bidv',s2:'tm',n:'Rut tien',keep:true,decided:1},
 {id:5,d:'2026-09-18',t:'chi',a:45000,c:'an_cafe',s:'vi',n:'Cafe',keep:false},
];
ctx.__pend(P.map(x=>({...x})));

console.log('\nA · Dong tong');
let h=ctx.__v();
ok(h.includes('SẮP GHI VÀO SỔ'),'co khoi tong');
ok(h.includes(M(200000)),'tien ra = 200.000 (120k+80k, KHONG tinh dong bo chon)','khong thay '+M(200000));
ok(h.includes(M(9000000)),'tien vao = 9.000.000');
ok(h.includes(M(500000)),'chuyen nguon = 500.000');
ok(!h.includes('>'+M(245000)),'khong cong nham dong da bo chon (45.000)');
ok(h.indexOf('SẮP GHI VÀO SỔ')<h.indexOf('Lưu '),'khoi tong nam TRUOC nut Luu');

console.log('\nB · Chon tat ca / bo chon tat ca');
ok(h.includes('4/5 giao dịch đang được chọn'),'dem dung 4/5','khong thay');
ok(h.includes('chọn tất cả'),'dang hien "chon tat ca" vi chua du');
ctx.__togAll(1);
h=ctx.__v();
ok(ctx.__peek().every(t=>t.keep),'togAll(1) chon het');
ok(h.includes('5/5 giao dịch đang được chọn'),'dem dung 5/5');
ok(h.includes('bỏ chọn tất cả'),'da doi thanh "bo chon tat ca"');
ok(h.includes(M(245000)),'tien ra gio = 245.000 (da gom dong thu 5)');
ctx.__togAll(0);
h=ctx.__v();
ok(ctx.__peek().every(t=>!t.keep),'togAll(0) bo het');
ok(h.includes('0/5 giao dịch đang được chọn'),'dem dung 0/5');
ok(!h.includes('SẮP GHI VÀO SỔ'),'khong con dong nao thi an khoi tong');

console.log('\nC · Man dan (chua co pending) khong vo');
ctx.__pend(null);
let h2=''; try{h2=ctx.__v(); ok(true,'vImport() man dan chay duoc');}catch(e){ok(false,'man dan',e.message);}
ok(h2.includes('Dán kết quả'),'van co o dan');
ok(h2.includes('Ghi tay'),'van co form ghi tay');

console.log('\n'+(loi?'✗ CON '+loi+' LOI':'✓ TAT CA DEU DAT'));
process.exit(loi?1:0);
