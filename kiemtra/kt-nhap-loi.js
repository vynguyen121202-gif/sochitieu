const fs=require('fs'), path=require('path'), vm=require('vm');
let code=fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8');
code=code.slice(0,code.indexOf("try{\n  const mf="));
code+=`
globalThis.__set=(db)=>{DB=db;cursor=new Date();tab='import';open={};msg='';memoClear();};
globalThis.__parse=r=>parsePaste(r);
globalThis.__bo=()=>boQua;
globalThis.__pend=p=>{pending=p;};
globalThis.__v=()=>vImport();
globalThis.__vset=()=>vSet();`;
const el={innerHTML:'',scrollIntoView(){},appendChild(){},click(){},remove(){},style:{},value:''};
const ctx={console,Intl,Date,Math,JSON,Object,Array,String,Number,isNaN,parseInt,parseFloat,
  setTimeout:()=>0,clearTimeout(){},localStorage:{getItem:()=>null,setItem(){}},navigator:{},
  Blob:function(){},File:function(){},URL:{createObjectURL:()=>'x'},confirm:()=>true,
  document:{getElementById:()=>el,createElement:()=>el,head:el,body:el,documentElement:el}};
ctx.window=ctx;ctx.globalThis=ctx;ctx.window.matchMedia=()=>({matches:false,addEventListener(){}});
ctx.window.scrollTo=()=>{};ctx.window.scrollY=0;
vm.createContext(ctx);vm.runInContext(code,ctx);

let loi=0;
const ok=(d,t,x)=>{if(d)console.log('  ✓ '+t);else{loi++;console.log('  ✗ '+t+(x?'\n      → '+x:''));}};
ctx.__set({txns:[],v:10,debts:[],budgets:{},bm:{},goals:[],fixedItems:[],roll:{},offsets:[],
  draws:[],income:0,rules:{},opens:{},checks:{},opts:{},chainOK:{},goalPlan:{},payDays:{}});

const dan=`ngày | nguồn | loại | số tiền | nội dung | nhóm | số dư | mã
--- | --- | --- | --- | --- | --- | --- | ---
2026-09-20 10:07 | bidv | chi | 120000 | Com trua | an_ngoai |  | 
2026-09-20 11:00 | vi | chi | 80k | Xang | di_xang |  | 
dong nay khong co dau gach dung nao ca
2026-09-20 | bidv | chi | mot tram nghin | Sai tien | an_ngoai |  | 
khong-phai-ngay | bidv | chi | 50000 | Sai ngay | an_ngoai |  | 
2026-09-19 | bidv | thu
2026-09-19 | bidv | thu | 9000000 | Luong | luong |  | `;

console.log('\nA · Doc duoc bao nhieu, bo bao nhieu');
const rows=ctx.__parse(dan);
const bo=ctx.__bo();
ok(rows.length===3,'doc duoc 3 dong hop le','duoc '+rows.length);
ok(bo.length===4,'bao dung 4 dong hong','bao '+bo.length+': '+bo.map(x=>x.so).join(','));
bo.forEach(x=>console.log('      dong '+x.so+': '+x.ly));

console.log('\nB · Dong tieu de va dong ke ngang KHONG bi bao nham');
ok(!bo.some(x=>x.so===1),'dong tieu de bang bo lang le');
ok(!bo.some(x=>x.so===2),'dong ke ngang bo lang le');

console.log('\nC · Dung ly do cho dung dong');
const ly=s=>(bo.find(x=>x.so===s)||{}).ly||'(khong bao)';
ok(/dấu \|/.test(ly(5)),'dong 5: thieu dau |','ra: '+ly(5));
ok(/số tiền/.test(ly(6)),'dong 6: so tien sai','ra: '+ly(6));
ok(/ngày/.test(ly(7)),'dong 7: ngay sai','ra: '+ly(7));
ok(/cột/.test(ly(8)),'dong 8: thieu cot','ra: '+ly(8));

console.log('\nD · Hien tren man hinh');
ctx.__pend(rows.map(r=>({...r,keep:true})));
let h=ctx.__v();
ok(h.includes('4 dòng không đọc được'),'man kiem tra co khoi canh bao');
ok(h.includes('khong co dau gach dung nao ca'),'co nguyen van dong hong de Vy sua');
ok(h.indexOf('dòng không đọc được')<h.indexOf('giao dịch đang được chọn'),'khoi canh bao nam TREN danh sach');
ctx.__pend(null);
let h2=ctx.__v();
ok(h2.includes('Dán kết quả đọc chi tiêu từ A.I'),'da doi tieu de');
ok(!h2.includes('Dán kết quả từ Claude'),'khong con ten cu');
ok(h2.includes('4 dòng không đọc được'),'man dan cung hien khoi canh bao');

console.log('\nE · Dan sach se thi khong bao gi');
ctx.__parse('2026-09-20 | bidv | chi | 50000 | Cafe | an_cafe |  | ');
ok(ctx.__bo().length===0,'khong co dong hong thi danh sach rong');
ok(ctx.__v().indexOf('không đọc được')<0,'va khong hien khoi canh bao');

console.log('\nF · Cai dat: cau lenh AI mo san');
const s=ctx.__vset();
ok(s.includes('Câu lệnh cho AI'),'van co muc Cau lenh cho AI');
{const i=s.indexOf('Câu lệnh cho AI'),j=s.indexOf('Chép câu lệnh');
  ok(i>=0&&j>i&&s.slice(i,j).indexOf('<details>')<0,'muc Cau lenh cho AI khong con giau trong khoi gap');}
ok(s.includes('Chép câu lệnh'),'van co nut chep');
ok(s.includes('gửi kèm ảnh chụp giao dịch'),'co dong huong dan dung khi nao');

console.log('\n'+(loi?'✗ CON '+loi+' LOI':'✓ TAT CA DEU DAT'));
process.exit(loi?1:0);
