/* Kiểm tra hỏi "Thay khoản cũ / Giữ cả hai" khi nhập (Vy 09/11/2026):
   cùng nội dung, cùng số tiền nhưng khác giờ hoặc khác số dư sau giao dịch là HAI lần chi thật,
   không được hỏi. Chỉ hỏi khi có dấu hiệu đọc sai ngày: số dư (hoặc giờ) y nguyên. */
const fs=require('fs'), path=require('path'), vm=require('vm');
const SRC_APP=fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8');
let code=SRC_APP.slice(0,SRC_APP.indexOf("try{\n  const mf="));
code+=`
globalThis.__set=db=>{DB=db;memoClear();};
globalThis.__fr=t=>findReplace(t);`;
const el0={innerHTML:'',scrollIntoView(){},appendChild(){},click(){},remove(){},style:{},dataset:{},value:''};
const ctx={console,Intl,Date,Math,JSON,Object,Array,String,Number,isNaN,parseInt,parseFloat,
  setTimeout:()=>0,clearTimeout(){},localStorage:{getItem:()=>null,setItem(){}},navigator:{},
  Blob:function(){},File:function(){},URL:{createObjectURL:()=>'x',revokeObjectURL(){}},
  confirm:()=>true, prompt:()=>null,
  document:{getElementById:()=>el0,createElement:()=>el0,querySelector:()=>null,head:el0,body:el0,documentElement:el0}};
ctx.window=ctx; ctx.globalThis=ctx;
ctx.window.matchMedia=()=>({matches:false,addEventListener(){},addListener(){}});
vm.createContext(ctx); vm.runInContext(code,ctx,{filename:'app.js'});

let loi=0;
const ok=(dk,t,them)=>{if(dk)console.log('  ✓ '+t);else{loi++;console.log('  ✗ '+t+(them?'\n      → '+them:''));}};

const cu={id:1,d:'2026-10-14',tm:'13:29',t:'chi',a:15000,s:'bidv',c:'an_cafe',n:'Chuyển tiền tra lai',p:'1111111111',b:7000000};
const so=()=>({txns:[Object.assign({},cu)],debts:[],rules:{},opts:{}});
const moi=x=>Object.assign({t:'chi',a:15000,s:'bidv',n:'Chuyển tiền tra lai',p:'1111111111'},x);

console.log('\nA · Hai lần chi thật — KHÔNG hỏi');
ctx.__set(so());
ok(!ctx.__fr(moi({d:'2026-10-15',tm:'13:34',b:6985000})),'trà lài 15.000 ngày khác, giờ khác, số dư khác → không hỏi');
ok(!ctx.__fr(moi({d:'2026-10-15',tm:'13:29',b:6985000})),'cùng giờ nhưng số dư khác → không hỏi (số dư quyết định)');
ok(!ctx.__fr(moi({d:'2026-10-15',tm:'13:34'})),'dòng mới không có số dư, giờ khác → không hỏi');

console.log('\nB · Có dấu hiệu đọc sai ngày — VẪN hỏi');
ctx.__set(so());
ok(ctx.__fr(moi({d:'2026-10-15',tm:'13:29',b:7000000})),'ngày lệch, số dư y nguyên → hỏi');
ok(ctx.__fr(moi({d:'2026-10-15',tm:'13:34',b:7000000})),'số dư y nguyên dù giờ khác → hỏi (AI đọc sai cả giờ)');
ok(ctx.__fr(moi({d:'2026-10-15',tm:'13:29'})),'không có số dư, cùng giờ → hỏi');
ok(ctx.__fr(moi({d:'2026-10-15'})),'không số dư, không giờ → hỏi như trước');
{const s=so(); delete s.txns[0].b; delete s.txns[0].tm; ctx.__set(s);
  ok(ctx.__fr(moi({d:'2026-10-15',tm:'13:34',b:6985000})),'khoản cũ ghi tay không có giờ lẫn số dư → hỏi như trước');}

console.log('\nC · Các điều kiện cũ giữ nguyên');
ctx.__set(so());
ok(!ctx.__fr(moi({d:'2026-10-15',a:16000,tm:'13:29',b:7000000})),'khác số tiền → không hỏi');
ok(!ctx.__fr(moi({d:'2026-10-30',tm:'13:29',b:7000000})),'lệch quá 10 ngày → không hỏi');
ok(!ctx.__fr(moi({d:'2026-10-15',tm:'13:29',b:7000000,p:'999'})),'khác đối tác → không hỏi');

console.log('\n'+(loi?'✗ '+loi+' LỖI':'✓ ĐẠT HẾT'));
process.exit(loi?1:0);
