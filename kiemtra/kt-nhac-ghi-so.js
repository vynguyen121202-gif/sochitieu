const fs=require('fs'), path=require('path'), vm=require('vm');
let code=fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8');
code=code.slice(0,code.indexOf("try{\n  const mf="));
code+=`
globalThis.__set=(db,cur)=>{DB=db;cursor=cur;tab='home';open={};msg='';memoClear();};
globalThis.__g=()=>chuaGhiSo();
globalThis.__v=()=>vHome();
globalThis.__ok=()=>ngayKhongTieu();
globalThis.__db=()=>DB;`;
function san(HOM){
  const R=Date, FD=class extends R{constructor(...a){if(!a.length)super(HOM);else super(...a);}
    static now(){return new R(HOM).getTime();}};
  const el={innerHTML:'',scrollIntoView(){},appendChild(){},click(){},remove(){},style:{},value:''};
  const ctx={console,Intl,Date:FD,Math,JSON,Object,Array,String,Number,isNaN,parseInt,parseFloat,
    setTimeout:()=>0,clearTimeout(){},localStorage:{getItem:()=>null,setItem(){}},navigator:{},
    Blob:function(){},File:function(){},URL:{createObjectURL:()=>'x'},confirm:()=>true,
    document:{getElementById:()=>el,createElement:()=>el,head:el,body:el,documentElement:el}};
  ctx.window=ctx;ctx.globalThis=ctx;ctx.window.matchMedia=()=>({matches:false,addEventListener(){}});
  ctx.window.scrollTo=()=>{};ctx.window.scrollY=0;
  vm.createContext(ctx);vm.runInContext(code,ctx);return ctx;
}
let loi=0;
const ok=(d,t,x)=>{if(d)console.log('  ✓ '+t);else{loi++;console.log('  ✗ '+t+(x?'\n      → '+x:''));}};
/* id mang moc thoi gian that: 15/09/2026 20:15 */
const IDNGAY=(y,m,d,h,mi)=>new Date(y,m-1,d,h,mi).getTime()+0.5;
const so=(ngay,extra)=>({txns:ngay.map(([d,id])=>({id,d,t:'chi',a:50000,c:'an_ngoai',s:'bidv',n:'GD'})),
  v:10,debts:[],budgets:{},bm:{},goals:[],fixedItems:[],roll:{},offsets:[],draws:[],income:0,
  rules:{},opens:{},checks:{},opts:{},chainOK:{},goalPlan:{},payDays:{},...(extra||{})});
const T=new Date(2026,8,1);

console.log('\nA · Hom qua CO giao dich -> im lang');
let c=san('2026-09-19T10:00:00');
c.__set(so([['2026-09-18',IDNGAY(2026,9,18,20,15)]]),T);
ok(c.__g()===null,'khong bao gi');
ok(c.__v().indexOf('chưa ghi nhận giao dịch')<0,'man hinh khong co khoi nhac');

console.log('\nB · Trong dung 1 ngay (18/09)');
c=san('2026-09-19T10:00:00');
c.__set(so([['2026-09-17',IDNGAY(2026,9,17,20,15)]]),T);
let g=c.__g();
ok(g&&g.so===1,'dem 1 ngay trong','ra '+(g&&g.so));
ok(g.trong[0]==='2026-09-18','dung ngay 18/09','ra '+g.trong[0]);
let h=c.__v();
ok(h.includes('Ngày 18/09 chưa ghi nhận giao dịch'),'dung cau chu 1 ngay');
ok(h.includes('Lần cuối: 17/09 20:15'),'co ngay VA gio lan cuoi','khong thay');
ok(h.includes('Không phát sinh giao dịch'),'co nut xac nhan');
ok(h.includes("go('add')"),'co nut mo tab Nhap');

console.log('\nC · Trong 4 ngay');
c=san('2026-09-19T10:00:00');
c.__set(so([['2026-09-14',IDNGAY(2026,9,15,20,15)]]),T);
g=c.__g();
ok(g.so===4,'dem 4 ngay (15,16,17,18)','ra '+g.so);
h=c.__v();
ok(h.includes('Đã 4 ngày chưa cập nhật giao dịch'),'dung cau chu nhieu ngay');
ok(h.includes('Lần cuối: 15/09 20:15'),'lan cuoi theo luc BAM LUU (15/09 20:15) chu khong phai ngay GD (14/09)');

console.log('\nD · Bam "khong phat sinh giao dich"');
c.__ok();
ok(Object.keys(c.__db().ngayOK).length===4,'danh dau ca 4 ngay','ra '+Object.keys(c.__db().ngayOK).length);
ok(c.__g()===null,'thoi nhac');
ok(c.__v().indexOf('chưa cập nhật giao dịch')<0,'khoi nhac bien mat');

console.log('\nE · Ngay da xac nhan thi bo qua nhung van dem tiep ve truoc');
c=san('2026-09-19T10:00:00');
c.__set(so([['2026-09-16',IDNGAY(2026,9,16,9,0)]],{ngayOK:{'2026-09-18':1}}),T);
g=c.__g();
ok(g&&g.so===1&&g.trong[0]==='2026-09-17','bo qua 18/09 da xac nhan, van bao 17/09',
   JSON.stringify(g&&g.trong));

console.log('\nF · Mung 1: hom qua thuoc thang truoc');
c=san('2026-10-01T10:00:00');
c.__set(so([['2026-09-28',IDNGAY(2026,9,28,18,0)]]),new Date(2026,9,1));
g=c.__g();
ok(g&&g.so===2&&g.trong[0]==='2026-09-30'&&g.trong[1]==='2026-09-29','quet ca sang thang truoc: dem dung 2 ngay 29+30/09','ra '+JSON.stringify(g&&g.trong));
ok(c.__v().includes('Đã 2 ngày chưa cập nhật giao dịch'),'mung 1 van hien khoi nhac');

console.log('\nG · So trong / truoc ngay ghi chep dau tien');
c=san('2026-09-19T10:00:00');
c.__set(so([]),T);
ok(c.__g()===null,'so chua co giao dich nao thi khong nhac');
c=san('2026-09-19T10:00:00');
c.__set(so([['2026-09-19',IDNGAY(2026,9,19,8,0)]]),T);
ok(c.__g()===null,'so bat dau tu hom nay thi khong nhac lui ve qua khu');

console.log('\nH · Xem thang cu thi TUYET DOI khong hien');
c=san('2026-09-19T10:00:00');
c.__set(so([['2026-09-14',IDNGAY(2026,9,15,20,15)]]),new Date(2026,7,1));
ok(c.__v().indexOf('chưa cập nhật giao dịch')<0,'thang 8 khong co khoi nhac');

console.log('\nI · id khong phai moc thoi gian thi chi hien ngay');
c=san('2026-09-19T10:00:00');
c.__set(so([['2026-09-15',7]]),T);
g=c.__g();
ok(g.coGio===false,'nhan ra id khong hop le');
ok(g.lanCuoi==='15/09','chi hien ngay, khong bia ra gio','ra "'+g.lanCuoi+'"');

console.log('\n'+(loi?'✗ CON '+loi+' LOI':'✓ TAT CA DEU DAT'));
process.exit(loi?1:0);
