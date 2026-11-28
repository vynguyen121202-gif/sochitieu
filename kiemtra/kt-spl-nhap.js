/* Vy test 28/11/2026: dán kết quả A.I gồm giao dịch + 3 hóa đơn SPayLater (T10 đã trả, để trống hạn; T11, T12)
   + câu A.I tự viết "Sửa 3 dòng cũ" + 3 dòng cũ chép lại. Bốn lỗi:
   1. hóa đơn vào sổ ngay lúc dán, chưa chờ Vy bấm Lưu  → giờ chờ Lưu
   2. HĐ T10 bị từ chối vì trống hạn                     → nhận khi cùng lần dán có khoản trả đúng tổng
   3. khoản "Thanh toán SPayLater" bị A.I gán Trả nợ     → tự tách theo món khi Lưu (Vy: "tự tách luôn")
   4. câu A.I tự viết bị báo lỗi; 3 dòng cũ chép lại thành giao dịch trùng (khác mã đối tác)
      → câu không mở đầu bằng ngày bỏ lặng lẽ; cùng ngày + số tiền + nguồn + SỐ DƯ = đã có trong sổ.
   Giao dịch, số dư, mã đối tác trong file này là số GIẢ (kho công khai); món hóa đơn lấy từ kt-dot9. */
const fs=require('fs'), path=require('path'), vm=require('vm');
let code=fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8');
code=code.slice(0,code.indexOf("try{\n  const mf="));
code+=`
globalThis.__set=(db,cur)=>{DB=db;cursor=cur;tab='home';open={};msg='';pending=null;splCho=[];splMo=null;memoClear();};
globalThis.__f={doPaste,commit,vImport,needCat,splBoP,coSpl,promptText,bangTien,tog};
globalThis.__bq=()=>boQua;globalThis.__pd=()=>pending;globalThis.__msg=()=>msg;globalThis.__cho=()=>splCho;
globalThis.__db=()=>DB;`;
let HOM='2026-11-07';
const R=Date, FD=class extends R{constructor(...a){if(!a.length)super(HOM+'T10:00:00');else super(...a);}
  static now(){return new R(HOM+'T10:00:00').getTime();}};
const el0={innerHTML:'',scrollIntoView(){},appendChild(){},click(){},remove(){},style:{},dataset:{},value:''};
const ctx={console,Intl,Date:FD,Math,JSON,Object,Array,String,Number,isNaN,parseInt,parseFloat,
  setTimeout:()=>0,clearTimeout(){},localStorage:{getItem:()=>null,setItem(){}},navigator:{},
  Blob:function(){},File:function(){},URL:{createObjectURL:()=>'x',revokeObjectURL(){}},confirm:()=>true,prompt:()=>null,
  document:{getElementById:id=>el0,createElement:()=>el0,querySelector:()=>null,querySelectorAll:()=>[],head:el0,body:el0,documentElement:el0}};
ctx.window=ctx; ctx.globalThis=ctx;
ctx.window.matchMedia=()=>({matches:false,addEventListener(){},addListener(){}});
ctx.window.scrollTo=()=>{}; ctx.window.scrollY=0;
vm.createContext(ctx); vm.runInContext(code,ctx,{filename:'app.js'});
const F=ctx.__f;
let loi=0;
const ok=(dk,t,them)=>{if(dk)console.log('  ✓ '+t);else{loi++;console.log('  ✗ '+t+(them?'\n      → '+them:''));}};
const eq=(a,b,t)=>ok(JSON.stringify(a)===JSON.stringify(b),t,'được '+JSON.stringify(a)+', cần '+JSON.stringify(b));
const T11=new Date(2026,10,1);
const so=()=>({v:15,txns:[
    {id:1,d:'2026-11-01',t:'thu',a:9000000,c:'luong',s:'bidv',n:'Lương'},
    /* dòng cũ ghi nhầm mã đối tác (số tài khoản của chính Vy) */
    {id:2,d:'2026-11-02',tm:'13:33',t:'chi',a:15000,c:'an',s:'bidv',n:'Chuyển tiền trả lại quán',b:8985000,p:'1112223334'},
    /* dòng cũ đã tách hai mục, chung sg, cùng số dư */
    {id:3,d:'2026-11-03',tm:'12:00',t:'chi',a:60000,c:'an',s:'bidv',n:'Bữa trưa',b:8925000,sg:'s9',split:1},
    {id:4,d:'2026-11-03',tm:'12:00',t:'chi',a:40000,c:'cho',s:'bidv',n:'Bữa trưa',b:8925000,sg:'s9',split:1}],
  debts:[],budgets:{},bm:{},goals:[],fixedItems:[],roll:{},offsets:[],draws:[],income:0,rules:{},
  opens:{bidv:0,vi:0,tm:0},checks:{},opts:{},chainOK:{},goalPlan:{},payDays:{k1:[5,10],k2:[15,25]},
  ngayOK:{},chot:{},chotLS:[],nsChot:{},lichThu:{},batDau:'2026-11-01'});
const HD10=`splhd | 2026-10 |  | 748456
spl | Dầu gội Super Mild | 153086 | ld |
spl | Khăn lau đa năng | 35000 | gdu |
spl | Nạo sợi rau củ | 69420 | gdu |
spl | Khăn quàng len | 183200 | qa_tui |
spl | Cà phê Trung Nguyên Legend | 112800 | an_cafe |
spl | Mũ bảo hiểm Royal M239 | 194950 | di | 1/2`;
const HD11=`splhd | 2026-11 | 2026-12-10 | 1311850
spl | Tranh cát chuyển động 3D | 97538 |  |
spl | Trà chanh mật ong Hantae | 135200 | cho |
spl | Sách Liễu Phàm Tứ Huấn | 16057 | ht_sach | 1/3
spl | Son kem Dinto | 72757 | ld | 1/3
spl | Kem dưỡng Angel's Liquid | 124750 | ld | 1/3
spl | Mặt nạ ngủ môi Laneige | 105000 | ld | 1/3
spl | Angel's Liquid 60ml | 127250 | ld | 1/3
spl | Máy tăm nước Halio | 253225 | ld | 1/3
spl | Kem dưỡng cấp ẩm Angel's Liquid | 95333 | ld | 1/3
spl | Nước tẩy trang Cocoon | 89790 | ld | 1/3
spl | Mũ bảo hiểm Royal M239 | 194950 | di | 2/2`;
const HD12=`splhd | 2026-12 | 2027-01-11 | 995516
spl | Thỏ Worry móc khóa | 111354 |  |
spl | Sách Liễu Phàm Tứ Huấn | 16057 | ht_sach | 2/3
spl | Son kem Dinto | 72757 | ld | 2/3
spl | Kem dưỡng Angel's Liquid | 124750 | ld | 2/3
spl | Mặt nạ ngủ môi Laneige | 105000 | ld | 2/3
spl | Angel's Liquid 60ml | 127250 | ld | 2/3
spl | Máy tăm nước Halio | 253225 | ld | 2/3
spl | Kem dưỡng cấp ẩm Angel's Liquid | 95333 | ld | 2/3
spl | Nước tẩy trang Cocoon | 89790 | ld | 2/3`;
const GD=`2026-11-06 07:10 | bidv | chi | 15000 | Kimbap | an_sang | 8910000 | 555000111
2026-11-06 19:01 | bidv | chi | 748456 | Thanh toán SPayLater Shopee | trano | 8161544 | 0900000000`;
const CU=`Sửa 3 dòng cũ (1112223334 là số tài khoản của Vy, không phải của đối tác):
2026-11-02 13:33 | bidv | chi | 15000 | Chuyển tiền trả lại quán |  | 8985000 |
2026-11-03 12:00 | bidv | chi | 100000 | Bữa trưa |  | 8925000 |`;
const dan=s=>{el0.value=s; F.doPaste(); el0.value='';};

console.log('\nA · Đúng kiểu Vy dán: giao dịch + 3 hóa đơn + câu A.I + dòng cũ chép lại');
let db=so(); ctx.__set(db,T11);
dan(GD+'\n\n'+HD10+'\n\n'+HD11+'\n\n'+HD12+'\n\n'+CU);
eq(ctx.__bq().length,0,'không dòng nào bị báo lỗi (câu A.I tự viết bỏ lặng lẽ, HĐ T10 trống hạn vẫn nhận)');
ok(!(ctx.__db().spl||[]).length,'mới dán: CHƯA hóa đơn nào vào sổ');
const pd=ctx.__pd();
eq(pd.length,4,'4 dòng vào màn kiểm tra');
const tra=pd.find(t=>t.a===748456), cu1=pd.find(t=>t.d==='2026-11-02'), cu2=pd.find(t=>t.d==='2026-11-03');
eq(tra.splK,'2026-10','khoản 748.456 ngày 06/11 ghép với HĐ tháng 10');
ok(!F.needCat(tra),'khoản đó KHÔNG đòi chọn nhóm (A.I gán Trả nợ cũng không sao)');
ok(cu1.dup&&!cu1.keep,'dòng cũ chép lại, khác mã đối tác nhưng cùng số dư → "Đã có trong sổ", bỏ chọn sẵn');
ok(cu2.dup&&!cu2.keep,'dòng cũ đã tách 2 mục (60.000 + 40.000), chép lại 100.000 cùng số dư → đã có trong sổ');
let h=F.vImport();
ok(h.includes('HÓA ĐƠN SPAYLATER · GHI VÀO TAB NỢ KHI LƯU'),'màn kiểm tra có khối hóa đơn chờ Lưu');
ok(h.includes('trả bằng khoản 06/11 19:01 · tách thành 6 món khi lưu'),'HĐ T10: "trả bằng khoản 06/11 19:01 · tách thành 6 món khi lưu"');
ok(h.includes('hạn trả 10/12')&&h.includes('hạn trả 11/01'),'HĐ T11, T12 ghi hạn trả');
ok(h.includes('Lưu 2 giao dịch · 3 hóa đơn SPayLater'),'nút "Lưu 2 giao dịch · 3 hóa đơn SPayLater"');
F.commit(); db=ctx.__db(); const baoA=ctx.__msg(); ctx.__set(db,T11);
eq(db.spl.map(x=>x.k).sort(),['2026-10','2026-11','2026-12'],'bấm Lưu → 3 hóa đơn vào tab Nợ');
eq(db.spl.find(x=>x.k==='2026-10').tra&&db.spl.find(x=>x.k==='2026-10').tra.d,'2026-11-06','HĐ T10 ghi đã trả ngày 06/11');
ok(!db.spl.find(x=>x.k==='2026-11').tra&&!db.spl.find(x=>x.k==='2026-12').tra,'HĐ T11, T12 chưa trả');
const mon=db.txns.filter(t=>t.spl==='2026-10');
eq([mon.length,mon.reduce((s,t)=>s+t.a,0)],[6,748456],'khoản 748.456 tách thành 6 món, cộng đúng 748.456');
ok(mon.every(t=>t.d==='2026-11-06'&&t.b===8161544&&t.sg===mon[0].sg&&t.c!=='trano'),'mỗi món giữ ngày, số dư BIDV, chung sg; không còn nhóm Trả nợ');
eq(mon.find(t=>t.n==='Mũ bảo hiểm Royal M239').gop,'1/2','món trả góp mang kỳ góp 1/2');
ok(!db.txns.some(t=>t.a===748456),'không còn dòng 748.456 nguyên khối');
eq(db.txns.length,4+1+6,'sổ: 4 dòng cũ + Kimbap + 6 món — không thêm dòng trùng');
eq(F.bangTien(T11).tongRa,15000+60000+40000+15000+748456,'(3) Thực chi tháng 11 = các khoản chi + 6 món (748.456 vào chi tiêu, không vào Trả nợ)');
ok(baoA.includes('Đã ghi HĐ tháng 10, HĐ tháng 11, HĐ tháng 12 vào tab Nợ')&&baoA.includes('Đã tách 1 khoản thanh toán SPayLater'),'báo đã ghi 3 hóa đơn và đã tách 1 khoản');

console.log('\nB · Bấm Quay lại: không gì vào sổ');
db=so(); ctx.__set(db,T11); dan(GD+'\n'+HD10+'\n'+HD11);
ctx.__set(ctx.__db(),T11);
ok(!(ctx.__db().spl||[]).length&&!ctx.__cho().length,'Quay lại / rời màn → không hóa đơn nào vào sổ');

console.log('\nC · Bỏ chọn khoản thanh toán → HĐ T10 (trống hạn) không ghi');
db=so(); ctx.__set(db,T11); dan(GD+'\n'+HD10+'\n'+HD11);
F.tog(ctx.__pd().findIndex(t=>t.a===748456));
h=F.vImport();
ok(h.includes('chưa có hạn trả — chỉ ghi khi giữ khoản thanh toán của nó'),'khối hóa đơn: T10 mờ, "chỉ ghi khi giữ khoản thanh toán của nó"');
ok(h.includes('Lưu 1 giao dịch · 1 hóa đơn SPayLater'),'nút "Lưu 1 giao dịch · 1 hóa đơn SPayLater"');
F.commit(); db=ctx.__db();
eq(db.spl.map(x=>x.k),['2026-11'],'chỉ HĐ T11 vào sổ');

console.log('\nD · "không phải trả SPayLater" → thôi tách, đòi chọn nhóm như thường');
db=so(); ctx.__set(db,T11); dan(GD+'\n'+HD10.replace('|  |','| 2026-11-10 |'));
let i=ctx.__pd().findIndex(t=>t.a===748456); F.splBoP(i);
const t1=ctx.__pd()[i];
ok(!t1.splK&&F.needCat(Object.assign({},t1,{c:''})),'dòng hết ghép, phải chọn nhóm');
ok(F.vImport().includes('hạn trả 10/11'),'HĐ T10 có hạn thì vẫn ghi (chưa trả)');

console.log('\nE · Phủ định: không ghép bừa');
db=so(); ctx.__set(db,T11); dan(HD10);
ok(ctx.__bq().some(b=>b.ly.includes('HĐ tháng 10 chưa có hạn trả, và lần dán này không có khoản thanh toán đúng 748.456')),'HĐ trống hạn, không có khoản trả → báo lý do, không ghi');
db=so(); ctx.__set(db,T11);
dan('2026-11-20 09:00 | bidv | chi | 1311850 | Thanh toán SPayLater | | 7000000 |\n'+HD11);
ok(!ctx.__pd()[0].splK,'trả CÙNG tháng hóa đơn (20/11 cho HĐ T11) → không ghép');
db=so(); db.spl=[{k:'2026-11',han:'2026-12-10',tong:1311850,mon:[{n:'Món',a:1311850,c:'ld',gop:''}],tra:null}]; ctx.__set(db,T11);
dan('2026-12-10 09:00 | bidv | chi | 1311850 | Chuyển tiền bạn | | 7000000 |');
ok(!ctx.__pd()[0].splK,'HĐ đã có trong sổ + khoản cùng số tiền nhưng không có chữ SPayLater/Shopee → không ghép');
dan('2026-12-10 09:00 | bidv | chi | 1311850 | Thanh toán SPayLater | trano | 7000000 |');
eq(ctx.__pd()[0].splK,'2026-11','HĐ đã có trong sổ + khoản "Thanh toán SPayLater" đúng tổng → ghép, tách khi Lưu');
F.commit(); db=ctx.__db();
ok(db.spl[0].tra&&db.txns.filter(t=>t.spl==='2026-11').length===1,'Lưu → HĐ T11 ghi đã trả, khoản tách theo món');
db=so(); ctx.__set(db,T11);
dan('2026-11-06 07:10 bidv chi 15000 Kimbap');
ok(ctx.__bq().some(b=>b.ly.includes('không có dấu |')),'dòng MỞ ĐẦU BẰNG NGÀY mà thiếu dấu | → vẫn báo');
dan('2026-11-02 13:40 | bidv | chi | 15000 | Chuyển tiền trả lại quán |  | 8970000 |');
ok(!ctx.__pd()[0].dup,'cùng ngày, cùng số tiền nhưng KHÁC số dư → giao dịch mới, không coi là trùng');

console.log('\nF · Nút "Đây là SPayLater" ở tab Giao dịch');
ok(F.coSpl({t:'chi',s:'bidv',c:'trano',n:'Thanh toán SPayLater Shopee'}),'dòng nhóm Trả nợ tên "Thanh toán SPayLater" → có nút');
ok(!F.coSpl({t:'chi',s:'bidv',c:'trano',n:'Trả nợ bạn A'}),'dòng Trả nợ khác → không có nút');
ok(!F.coSpl({t:'chi',s:'bidv',c:'trano',n:'Thanh toán SPayLater',debt:'d1'}),'dòng đã gắn khoản nợ → không có nút');

console.log('\nG · Câu lệnh A.I');
const p=F.promptText();
ok(p.includes('thanh toán hóa đơn SPayLater / ShopeePay trả sau: để trống mã nhóm'),'dặn để trống mã nhóm dòng thanh toán SPayLater');
ok(p.includes('Hóa đơn đã thanh toán (không còn ngày đến hạn) thì để trống ô ngày đến hạn'),'dặn để trống hạn hóa đơn đã trả');
ok(p.includes('kể cả để sửa dòng cũ'),'dặn không chép lại dòng cũ để sửa');

console.log('\n'+(loi?'✗ '+loi+' LỖI':'✓ ĐẠT HẾT'));
process.exit(loi?1:0);
