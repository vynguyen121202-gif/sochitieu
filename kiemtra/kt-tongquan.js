/* Kiểm tra bản Tổng quan MỚI bằng máy, không cần mở trình duyệt.
   Chạy app.js của BẢN SAO dưới Node với DOM giả, theo đúng công thức trong CLAUDE.md. */
const fs=require('fs'), path=require('path'), vm=require('vm');
const {soMau,lamMoiHat}=require('./so-mau.js');

let code=fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8');
code=code.slice(0,code.indexOf("try{\n  const mf="));
code+=`
globalThis.__set=(db,cur,mo)=>{DB=db;cursor=cur;tab='home';open=mo||{};msg='';memoClear();};
globalThis.__vHome=()=>vHome();
globalThis.__pace=()=>pace(cursor);
globalThis.__fc=()=>forecast();
globalThis.__ks=ds=>{DB.opts=Object.assign({},DB.opts);if(ds===undefined)delete DB.opts.khongKS;else DB.opts.khongKS=ds;memoClear();};
globalThis.__m=()=>metrics(cursor);
globalThis.__hmcy=()=>hanMucChuY(cursor);
globalThis.__alerts=()=>alerts();
globalThis.__spent=(g,d)=>spentOf(g,d);
globalThis.__bangTien=()=>bangTien(cursor);
globalThis.__thanhKhoan=()=>thanhKhoan(cursor);`;

function sanKhau(HOM){
  const R=Date, FD=class extends R{constructor(...a){if(!a.length)super(HOM+'T10:00:00');else super(...a);}
    static now(){return new R(HOM+'T10:00:00').getTime();}};
  const el={innerHTML:'',scrollIntoView(){},appendChild(){},click(){},remove(){},style:{}};
  const ctx={console,Intl,Date:FD,Math,JSON,Object,Array,String,Number,isNaN,parseInt,parseFloat,
    setTimeout:()=>0,clearTimeout(){},localStorage:{getItem:()=>null,setItem(){}},navigator:{},
    Blob:function(){},File:function(){},URL:{createObjectURL:()=>'x',revokeObjectURL(){}},
    confirm:()=>true,
    document:{getElementById:()=>el,createElement:()=>el,head:el,body:el,documentElement:el}};
  ctx.window=ctx; ctx.globalThis=ctx;
  ctx.window.matchMedia=()=>({matches:false,addEventListener(){},addListener(){}});
  vm.createContext(ctx); vm.runInContext(code,ctx,{filename:'app.js'});
  return ctx;
}
let loi=0;
const ok=(dk,t,them)=>{if(dk)console.log('  ✓ '+t);else{loi++;console.log('  ✗ '+t+(them?'\n      → '+them:''));}};
const M=n=>new Intl.NumberFormat('vi-VN').format(Math.round(n));
const eq2=(a,b,t)=>ok(a===b,t,'được '+JSON.stringify(a)+', cần '+JSON.stringify(b));

lamMoiHat();
const db=soMau();
const nay=new Date();
const HOM=nay.getFullYear()+'-'+String(nay.getMonth()+1).padStart(2,'0')+'-'+String(nay.getDate()).padStart(2,'0');
const thangNay=new Date(nay.getFullYear(),nay.getMonth(),1);
const thangTruoc=new Date(nay.getFullYear(),nay.getMonth()-1,1);

const c=sanKhau(HOM);
c.__set(db,thangNay,{pw:true,fc:true,fcd:true,nono:true});

console.log('\nA · Mục 7 — số còn lại được tiêu đã trừ cho mượn');
const pa=c.__pace();
ok(pa.choMuon===2000000,'cho mượn tháng này = 2.000.000','ra '+M(pa.choMuon));
/* từ v=11 (Vy duyệt 28/09): Thực tế được tiêu tính từ TIỀN THẬT, không từ hạn mức */
{
  const q=c.__thanhKhoan(), tu=pa.ngayCon?q.tuDo/pa.ngayCon:0, h=c.__vHome();
  eq2(pa.ngayCon,pa.nd-pa.qua+1,'số ngày còn lại TÍNH CẢ HÔM NAY = '+pa.nd+' − '+pa.qua+' + 1');
  ok(!('conDuoc' in pa)&&!('moiNgay' in pa),'pace() KHÔNG còn conDuoc (công thức cũ từ hạn mức) và moiNgay (bỏ từ v=8)');
  ok(h.includes('<span>THỰC TẾ ĐƯỢC TIÊU</span><b>'+M(tu)+'</b>'),'ô THỰC TẾ ĐƯỢC TIÊU = tiêu tự do '+M(q.tuDo)+' ÷ '+pa.ngayCon+' ngày = '+M(tu));
  ok(h.includes('<span>ĐỊNH MỨC NGÀY</span><b>'+M(pa.chuan)+'</b><small>kế hoạch</small>'),'ô ĐỊNH MỨC NGÀY giữ nguyên = hạn mức linh hoạt ÷ số ngày, ghi "kế hoạch"');
  ok(!/Hụt |Dôi ra/.test(h.slice(h.indexOf('THỰC TẾ ĐƯỢC TIÊU'),h.indexOf('THỰC TẾ ĐƯỢC TIÊU')+600)),'không còn chữ "Hụt / Dôi ra" kiểu cũ ở ô Thực tế');
}

console.log('\nB · Mục 6 — năm dòng chi tiêu cộng lại đúng bằng tổng chi');
const b=pa.bd;
const cong=pa.daChi+b.coDinh+b.ngoai.tk+b.ngoai.muon+b.ngoai.trano;
ok(cong===b.chiTong,'linh hoạt + cố định + tiết kiệm + cho mượn + trả nợ = tổng chi',
  M(cong)+' ≠ '+M(b.chiTong));
console.log('      linh hoạt '+M(pa.daChi)+' · cố định '+M(b.coDinh)+' · tiết kiệm '+M(b.ngoai.tk)
  +' · cho mượn '+M(b.ngoai.muon)+' · trả nợ '+M(b.ngoai.trano)+' = '+M(b.chiTong));

console.log('\nC · Dự báo cuối tháng (v=12, Vy duyệt 28/09) — đoán SỐ DƯ CUỐI THÁNG, khởi từ A1');
const f=c.__fc();
{
  const q=c.__thanhKhoan();
  eq2(f.A1,q.A1,'khởi từ A1 của Số tiền còn lại được dùng để chi');
  eq2(f.B,q.B,'so với B = phần cần để dành');
  eq2(f.du1,f.A1-f.r1.reduce((s,r)=>s+r.a,0),'tiêu đủ hạn mức = A1 − Σ hạn mức linh hoạt còn của từng nhóm');
  eq2(f.du2,f.A1-f.r2.reduce((s,r)=>s+r.a,0),'theo đà = A1 − Σ từng nhóm — các dòng cộng khớp từng đồng');
  ok(f.r1.concat(f.r2).every(r=>Number.isInteger(r.a)),'mỗi nhóm đã làm tròn ra đồng TRƯỚC khi cộng');
  ok(!f.r1.concat(f.r2).some(r=>['tk','muon','trano'].includes(r.id)),'KHÔNG tính Tiết kiệm, Cho mượn, Trả nợ vào phần sẽ chi');
  ok(!('keHoach' in f)&&!('theoDa' in f)&&!('inc' in f),'KHÔNG còn công thức cũ "thu nhập − chi"');
  const an=f.r2.find(r=>r.id==='an');
  ok(!an||an.cach==='da','Ăn uống (mặc định không kiểm soát) tính theo đà');
}

console.log('\nD · Chọn khoản không kiểm soát được');
{
  const truoc=c.__fc().du2;
  c.__ks(['an','cho','di_xang']); const f0=c.__fc();
  c.__ks([]); const fKhong=c.__fc();
  ok(fKhong.r2.every(r=>r.cach==='hm')&&fKhong.du2===fKhong.du1,'không chọn khoản nào → theo đà = tiêu đủ hạn mức');
  c.__ks(['di_xang']); const fx=c.__fc(), di=fx.r2.find(r=>r.id==='di');
  ok(!di||di.a>=(fx.r1.find(r=>r.id==='di')||{a:0}).a,'chỉ chọn Xăng xe → Di chuyển lấy số LỚN HƠN giữa đà xăng và hạn mức còn');
  c.__ks(undefined); eq2(c.__fc().du2,f0.du2,'chưa chọn gì (sổ cũ) → mặc định Ăn uống, Chợ, Xăng xe');
  eq2(truoc,f0.du2,'mặc định cho cùng kết quả với danh sách đặt tay giống hệt');
}

console.log('\nE · Tháng đang theo dõi — thứ tự và nội dung trang');
const h=c.__vHome();
ok(h.indexOf('₫')<0,'không còn ký hiệu đ nào');
ok(h.indexOf('class="alerts"')>=0,'có khối cảnh báo');
ok(h.indexOf('CẦN XỬ LÝ')<0,'đã bỏ dòng tiêu đề "CẦN XỬ LÝ"');
ok(h.indexOf('class="alerts"')<h.indexOf('Cơ cấu chi tiêu'),'cảnh báo nằm TRÊN Cơ cấu chi tiêu');
ok(h.indexOf('class="alerts"')<h.indexOf('Tổng ngân sách khả dụng'),'cảnh báo nằm TRÊN khối ngân sách');
ok(h.indexOf('vượt hạn mức')>=0,'có cảnh báo vượt hạn mức (Sức khỏe)');
ok(h.indexOf('Tiền mặt')>=0&&h.indexOf('>Mặt ')<0,'thanh số dư ghi "Tiền mặt", không còn "Mặt"');
ok(h.indexOf('Trung bình')>=0||h.indexOf('Đã chi')>=0,'ô tổng chi viết hoa đầu câu');
ok(h.indexOf('TỔNG QUAN THÁNG NÀY')>=0,'có khối thực thu − thực chi (mục 8)');
/* v=12: Hạn mức linh hoạt chỉ còn MỘT chỗ — trong thẻ, TRƯỚC nút Cách tính; bảng Cách tính không lặp lại */
ok(h.indexOf('Hạn mức linh hoạt')<h.indexOf('TỔNG QUAN THÁNG NÀY'),'Hạn mức linh hoạt nằm trong thẻ, trên bảng Cách tính');
ok(h.indexOf('HẠN MỨC LINH HOẠT')<0&&h.indexOf('dg-bud')<0,'bảng Cách tính KHÔNG còn lặp phần Hạn mức linh hoạt');
ok((h.match(/Hạn mức linh hoạt/g)||[]).length===1,'chữ "Hạn mức linh hoạt" xuất hiện đúng MỘT lần');
ok(h.indexOf('TIÊU ĐỦ HẠN MỨC')>=0&&h.indexOf('THEO NHỊP TIÊU')>=0&&h.indexOf('THEO ĐÀ')<0&&h.indexOf('Theo đà')<0,'bảng có hai phần: tiêu đủ hạn mức · theo nhịp tiêu (không còn chữ "theo đà")');
ok(h.indexOf('KHÔNG KIỂM SOÁT ĐƯỢC')>=0&&(h.match(/class="fc-sw on"/g)||[]).length===3,'có danh sách chọn khoản không kiểm soát, bật sẵn đúng 3');
ok(h.indexOf('Để dành được')<0&&h.indexOf('để dành được')<0,'KHÔNG còn chữ "để dành được" (công thức cũ)');
ok(h.indexOf('dg-neu')>=0&&h.indexOf('dg-kq')>=0,'hai khối trong bảng Cách tính có tiêu đề riêng');
ok(h.indexOf('dg-chi')<0,'khối CHI TIÊU cũ đã gộp vào nút xổ Thực chi, không còn đếm hai lần');
const m=c.__m();
{ /* Thuc thu / Thuc chi phai CONG VE dung so du — day la ly do doi cach tinh */
  const bt=c.__bangTien();
  /* từ v=9 (Vy chốt 28/09): cho vay và vay đi ra hai dòng ròng riêng, vẫn phải cộng về đúng số dư */
  ok(bt.dauThang+bt.tongVao-bt.tongRa-bt.choRong-bt.vayRong===bt.cuoi,
    'số dư đầu + thực thu − thực chi − cho vay ròng − trả nợ cá nhân ròng = số dư cuối');
  ok(bt.choRong===bt.muon-bt.thuno&&bt.vayRong===bt.traCN-bt.divay,'hai dòng ròng = cho mượn − thu nợ · trả nợ cá nhân − đi vay');
  ok(!bt.vao.some(v=>/Thu nợ|Đi vay/.test(v.n)),'Thực thu KHÔNG còn Thu nợ, Đi vay');
  ok(!bt.ra.some(v=>/Cho mượn|Trả nợ/.test(v.n)),'Thực chi KHÔNG còn Cho mượn, Trả nợ cá nhân');
  ok(h.indexOf('cho mượn và trả nợ')<0,'không còn chú thích "trong đó cho mượn và trả nợ"');
  ok(bt.cuoi===bt.tien,'số dư cuối khớp balances() ('+M(bt.cuoi)+')');
  ok(h.indexOf(M(bt.cuoi))>=0,'số dư hiện tại có mặt trên trang ('+M(bt.cuoi)+')');
  ok(/số dư hiện tại/i.test(h),'có dòng Số dư hiện tại');
  ok(h.indexOf(M(m.thu-m.chi))<0||m.thu-m.chi===bt.cuoi,
    'KHÔNG còn hiệu thực thu − thực chi lơ lửng không giải thích được');
}

console.log('\nE2 · Vòng sửa 2');
ok(h.indexOf('dg-db1')>=0&&h.indexOf('dg-db2')>=0,'hai phần của bảng Cách tính đều có tiêu đề');
{ const fq=c.__fc();
  ok(h.includes('<b class="">'+M(fq.du1)+'</b> <span>/ '+M(fq.B)+'</span>')||h.includes('<b class="am">'+M(fq.du1)+'</b>'),
    'dòng "Tiêu đủ hạn mức" ghi dạng x / y: '+M(fq.du1)+' / '+M(fq.B));
  ok(h.includes((fq.du1<fq.B?'thiếu '+M(fq.B-fq.du1):'dư '+M(fq.du1-fq.B))),'ngay dưới ghi thiếu / dư đúng số');
  ok(h.indexOf('Tiêu đủ hạn mức')<h.indexOf('id="sec-fc"'),'hai dòng tóm tắt nằm TRƯỚC nút "Cách tính"');
  ok(!/class="bar"/.test(h),'KHÔNG có thanh tiến độ (Vy bỏ)'); }
ok(h.indexOf('🚩')<0,'đã bỏ cờ 🚩');
ok(h.indexOf('cùng kỳ tháng trước')<0,'không còn so cùng kỳ');
ok(h.indexOf('Thấp hơn')<0,'KHÔNG báo khi tiêu ít hơn tháng trước');
{ /* so với tổng cả tháng trước, và chỉ báo khi vượt */
  const hm=c.__hmcy();
  const sai=hm.filter(x=>x.pcT!==null&&!(x.truocKy>0&&x.nayKy>x.truocKy));
  ok(sai.length===0,'chỉ gắn % cho nhóm thật sự vượt tổng cả tháng trước',
    sai.map(x=>x.g.n).join(', '));
  const baoc=hm.filter(x=>x.pcT!==null);
  console.log('      '+hm.length+' nhóm cần chú ý, '+baoc.length+' nhóm đã vượt tháng trước'
    +(baoc.length?': '+baoc.map(x=>x.g.n+' +'+Math.round(x.pcT*100)+'%').join(' · '):''));
  ok(baoc.every(x=>x.nayKy===c.__spent(x.g.id,thangNay)),'vế "tháng này" lấy tổng cả tháng đang chạy');
}
{ /* KẾT QUẢ: mot nut xo, con so chinh nam ngay tren tieu de */
  const i=h.indexOf('dg-kq'), doan=h.slice(i,i+3400);
  /* v=12: KẾT QUẢ trải phẳng, có ký hiệu (6)…(9), "Còn được dùng để chi" MỘT dòng */
  ok(doan.indexOf('Số tiền còn lại được dùng để chi')>=0,'KẾT QUẢ có dòng Số tiền còn lại được dùng để chi');
  /* chỉnh 28/09: KẾT QUẢ dừng ở Còn được dùng để chi; Lương chưa về = 0 thì ẩn */
  ok(doan.indexOf('Cần để dành')<0&&doan.indexOf('>Thiếu<')<0&&doan.indexOf('>Dư<')<0,'KẾT QUẢ KHÔNG còn Cần để dành / Thiếu / Dư');
  { const q=c.__thanhKhoan();
    ok(q.luongChuaVe?doan.indexOf('Lương chưa về')>=0:doan.indexOf('Lương chưa về')<0,'Lương chưa về: có thì hiện, bằng 0 thì ẩn'); }
  ok(h.indexOf('(1) + (2) − (3) − (4) − (5)')>=0,'Số dư hiện tại ghi công thức bằng ký hiệu (1)…(5)');
  ok(h.indexOf('<span class="ct-sy">4</span><span class="ct-t">Tiền đang cho vay</span> <span class="ct-f">cho mượn − thu nợ</span>')>=0,'(4) Tiền đang cho vay, chú thích "cho mượn − thu nợ"');
  ok(h.indexOf('<span class="ct-sy">5</span><span class="ct-t">Trả nợ</span> <span class="ct-f">trả nợ − đi vay</span>')>=0,'(5) Trả nợ, chú thích "trả nợ − đi vay"');
  ok(['ct2','ct3','ct4','ct5'].every(k=>h.indexOf('class="xo ct-xo" data-k="'+k+'"')>=0||k==='ct4'||k==='ct5'),'(2) Thực thu, (3) Thực chi có nút xổ như bản cũ');
  ok(h.indexOf('data-k="ct1"')<0,'(1) Số dư đầu tháng không có gì để xổ');
  ok(h.indexOf('Xem chi tiết</span></button>')>=0&&h.indexOf(' Cách tính</span>')<0,'nút "Cách tính" đổi thành "Xem chi tiết"');
  ok(h.indexOf('class="fold xct" style="margin-top:8px" onclick="toggle(\'hmcy\')"')>=0||h.indexOf('Hạn mức cần chú ý')<0,'Hạn mức cần chú ý có nút xổ');
  ok(h.indexOf('data-xo="hmcy" data-open="0"')>=0||h.indexOf('Hạn mức cần chú ý')<0,'Hạn mức cần chú ý THU GỌN mặc định');
  ok(h.indexOf('<span class="nw">Tiền mặt <b>')>=0,'thanh số dư: "Tiền mặt 309.000" là một khối không bẻ đôi');
  ok(h.indexOf('Trả nợ cá nhân − đi vay')<0&&h.indexOf('không tính là chi hay thu')<0,'KHÔNG còn chú thích dài kiểu cũ');
  ok(doan.indexOf('vượt ')>=0||doan.indexOf('dư ')>=0,'có nói vượt hay dư so với số cần để dành');
  const q=c.__thanhKhoan();
  ok(!(q.lan>0&&q.tuDo>0),'luôn đúng một trong hai bằng 0 — không có cú nhảy ở ranh giới');
  ok(q.A1===q.A0+q.henTong,'mốc sau = mốc hiện tại + thu nợ đã hẹn ngày');
}
{ /* tiêu đề khối: phân biệt bằng MÀU CHỮ, không tô nền/viền ngoài */
  const cs=fs.readFileSync(path.join(__dirname,'..','style.css'),'utf8');
  const js2=fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8');
  { const i=cs.indexOf('.daygroup[class*="dg-"]'), doan=cs.slice(i,cs.indexOf('.fcsum{',i));
    ok(doan.indexOf('border-left')<0,'tiêu đề khối không còn vạch màu mỗi khối một kiểu'); }
  ok(/\.dg-neu,\.dg-bud,\.dg-chi,\.dg-kq,\.dg-db1,\.dg-db2\{color:var\(--hdtx\)\}/.test(cs),
    'cả sáu tiêu đề khối dùng chữ trắng');
  ok(/\.daygroup\[class\*="dg-"\]\{background:var\(--hdbg\);color:var\(--hdtx\)/.test(cs),
    'nền highlight là dải xanh đặc');
  ok((cs.match(/--hdtx:#FFFFFF/g)||[]).length===2,
    'cả màn sáng lẫn màn tối đều có chữ trắng thật (#FFFFFF), không trắng bợt');
  { /* dải đục 80% -> phải hoà với nền thẻ phía sau rồi mới đo tương phản chữ trắng */
    const lin=v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4);};
    const tp=c=>1.05/((.2126*lin(c[0])+.7152*lin(c[1])+.0722*lin(c[2]))+.05);
    const hoa=(f,a,b)=>f.map((v,i)=>a*v+(1-a)*b[i]);
    const rgba=[...cs.matchAll(/--hdbg:rgba\((\d+),(\d+),(\d+),\.(\d)\)/g)]
      .map(m=>({c:[+m[1],+m[2],+m[3]],a:+('.'+m[4])}));
    ok(rgba.length===2&&rgba.every(x=>Math.abs(x.a-.8)<.001),'dải highlight đặt đục 80% ở cả hai màn');
    /* nền sau dải: màn sáng là thẻ trắng; màn tối là thẻ navy trong suốt trên nền --paper */
    const nen=[[255,255,255],[13.6,21.4,48]];
    rgba.forEach((x,i)=>{
      const k=tp(hoa(x.c,x.a,nen[i]));
      console.log('      '+(i?'màn tối ':'màn sáng')+': chữ trắng trên dải sau khi hoà = '+k.toFixed(2)+':1'
        +(k>=4.5?' (đạt AA)':k>=3?' (dưới AA cho chữ thường)':' (QUÁ THẤP)'));
      ok(k>=3,'chữ trắng trên dải '+(i?'màn tối':'màn sáng')+' còn đọc được','chỉ '+k.toFixed(2)+':1');
    });
  }
  { /* Sáu khối CÙNG XUẤT HIỆN trên Tổng quan tháng đang theo dõi phải khác tông nhau.
       (Các tiêu đề trong khối Tổng kết tháng cũ nằm ở màn khác nên không xét chung.) */
    const TEN=['Tổng ngân sách khả dụng','Hạn mức cần chú ý','Cơ cấu chi tiêu',
               'Dự báo cuối tháng','Nợ','Mục tiêu'];
    const ma=[...js2.matchAll(/gcA\('(#[0-9A-Fa-f]{6})'\)}"><\/i><b>([^<]+)<\/b>/g)]
      .map(m=>({m:m[1],t:m[2]})).filter(x=>TEN.includes(x.t));
    /* So bằng HSL chứ không bằng khoảng cách RGB thô: hai màu cùng sắc nhưng khác
       hẳn độ bão hoà (xanh đậm vs xám lam) thì mắt vẫn phân biệt được. */
    const hsl=hex=>{
      const r=parseInt(hex.slice(1,3),16)/255,g=parseInt(hex.slice(3,5),16)/255,b=parseInt(hex.slice(5,7),16)/255;
      const mx=Math.max(r,g,b),mn=Math.min(r,g,b),l=(mx+mn)/2,d=mx-mn;
      let h=0; if(d){ h=mx===r?((g-b)/d+(g<b?6:0)):mx===g?((b-r)/d+2):((r-g)/d+4); h*=60; }
      return {h,s:d?d/(1-Math.abs(2*l-1)):0,l};
    };
    const trung=[];
    ma.forEach((a,i)=>ma.slice(i+1).forEach(b=>{
      const A=hsl(a.m),B=hsl(b.m);
      let dh=Math.abs(A.h-B.h); if(dh>180)dh=360-dh;
      if(dh<25&&Math.abs(A.s-B.s)<.25&&Math.abs(A.l-B.l)<.2)
        trung.push(a.t+' ('+a.m+') ~ '+b.t+' ('+b.m+')');
    }));
    ok(ma.length===6,'tìm đủ 6 khối cùng cấp trên Tổng quan','thấy '+ma.length);
    ma.forEach(x=>{const H=hsl(x.m);
      console.log('      '+x.t.padEnd(24)+' '+x.m+'  sắc '+Math.round(H.h)+'° · bão hoà '+H.s.toFixed(2));});
    ok(trung.length===0,'không có hai khối cùng cấp nào trùng tông màu',trung.join(' | '));
  }
  ok(cs.indexOf('.dg-sub{background:var(--row);color:var(--ink-3)')>=0,
    'dòng phụ vẫn mờ, không bị hoá xanh theo');
}
{ /* cảnh báo phải là HÀNG trong một khung, cùng cỡ với hàng .fcsum bên dưới */
  const cs=fs.readFileSync(path.join(__dirname,'..','style.css'),'utf8');
  const iA=cs.indexOf('.alerts{margin-top:12px'), khung=cs.slice(iA,iA+230);
  ok(khung.indexOf('border-radius:var(--r)')>=0&&khung.indexOf('background:var(--card)')>=0,
    'các cảnh báo nằm chung trong MỘT khung như .panel');
  const i=cs.indexOf('  .al{display:flex'), doan=cs.slice(i,i+430);
  ok(doan.indexOf('border-radius:0')>=0,'từng cảnh báo không còn là thẻ bo góc riêng');
  ok(doan.indexOf('margin:0')>=0,'không còn khoảng hở giữa các cảnh báo');
  ok(/\.al \.al-tx\{[^}]*white-space:nowrap/.test(cs),'mỗi cảnh báo gói gọn một dòng');
  ok(/padding:5px 12px;min-height:34px/.test(cs),'cảnh báo mỏng: cao 34px (Vy 28/09)');
  ok(fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8').indexOf('<span class="tx">${a.t}')<0,'cảnh báo KHÔNG còn dùng class .tx (trùng dòng giao dịch, làm phình 27px)');
  ok(/\.al \.al-tx\{[^}]*text-overflow:ellipsis/.test(cs),'chữ dài thì cắt bằng dấu …, không xuống dòng');
  const pAl=+doan.match(/padding:(\d+)px/)[1];
  ok(pAl<=8,'lề dọc cảnh báo ≤ 8px, mỏng hơn hẳn các hàng khác','đang '+pAl+'px');
  /* mọi cảnh báo phải cao bằng nhau -> không câu nào được dài quá một dòng ở khổ 390px.
     ~44 ký tự là ngưỡng an toàn cho 12.5px trong cột 390px trừ lề. */
  const dai=c.__alerts().map(a=>a.t).filter(t=>t.replace(/<[^>]*>/g,'').length>52);
  ok(dai.length===0,'không câu cảnh báo nào dài quá một dòng',dai.join(' | '));
}
{ /* KHÔNG ảnh nền nào được ép sai tỷ lệ — cả hai ảnh đều là ảnh dọc 561x1000 */
  const cs=fs.readFileSync(path.join(__dirname,'..','style.css'),'utf8');
  const iT=cs.indexOf('dark"] body::before'), doanT=cs.slice(iT,iT+520);
  ok(doanT.indexOf('background-size:cover,cover')>=0,
    'nền tối khai lại background-size:cover,cover — không bị kéo ngang');
  const iS=cs.indexOf('body::before{content'), doanS=cs.slice(iS,iS+900);
  ok(/background-size:cover,cover/.test(doanS),
    'nền sáng phủ kín màn hình như màn tối');
  { /* diem dung cuoi cua lop phu khong duoc dat alpha 1: duc han la nua duoi thanh trang phang */
    const k=doanS.indexOf(') 100%');
    const al=k>0?doanS.slice(doanS.lastIndexOf(',',k)+1,k):'';
    ok(k>0&&parseFloat(al)>0&&parseFloat(al)<1,
      'lop phu man sang KHONG duc han o diem dung cuoi (alpha='+al+')'); }
  ok(!/var(--paper) 38%/.test(doanS),
    'không còn điểm dừng --paper đục 100% ở 38%');
  ok(!/background-size:[^;]*\d+px\s+\d+px/.test(cs)&&!/background-size:[^;]*100% \d+px/.test(cs),
    'không còn chỗ nào ép cả hai chiều của ảnh nền');
}
{ /* nền sáng phải phủ kín màn, không còn dải 330px */
  const c=fs.readFileSync(path.join(__dirname,'..','style.css'),'utf8');
  const i=c.indexOf('body::before{content'), doan=c.slice(i,i+260);
  ok(doan.indexOf('position:fixed')>=0,'nền sáng dùng position:fixed');
  ok(doan.indexOf('height:330px')<0,'không còn dải cao 330px');
  ok(doan.indexOf('inset:0')>=0,'nền sáng phủ kín màn hình');
}

console.log('\nF · Tháng đã qua — dừng ở Cơ cấu chi tiêu');
c.__set(db,thangTruoc,{pw:true,fc:true});
const h2=c.__vHome();
ok(h2.indexOf('Cơ cấu chi tiêu')>=0,'vẫn có Cơ cấu chi tiêu');
ok(h2.indexOf('Tổng kết')>=0,'vẫn có Tổng kết tháng');
ok(h2.indexOf('CẦN XỬ LÝ')<0,'KHÔNG còn cảnh báo vượt hạn mức');
ok(h2.indexOf('Hạn mức cần chú ý')<0,'KHÔNG còn Hạn mức cần chú ý');
ok(h2.indexOf('Dự báo cuối tháng')<0,'tháng cũ KHÔNG hiện Dự báo cuối tháng');
ok(h2.indexOf('<b>Nợ</b>')<0,'KHÔNG còn khối Nợ');
ok(h2.indexOf('Mục tiêu đang thực hiện')<0,'KHÔNG còn Mục tiêu');
ok(h2.trimEnd().endsWith('</div>'),'trang kết thúc gọn sau Cơ cấu chi tiêu');
ok(h2.indexOf('₫')<0,'tháng cũ cũng không còn ký hiệu đ');

console.log('\nG · Ngày cuối tháng — không được vỡ');
const cuoi=new Date(nay.getFullYear(),nay.getMonth()+1,0);
const c2=sanKhau(cuoi.getFullYear()+'-'+String(cuoi.getMonth()+1).padStart(2,'0')+'-'+String(cuoi.getDate()).padStart(2,'0'));
c2.__set(soMau(),new Date(cuoi.getFullYear(),cuoi.getMonth(),1),{pw:true});
let h3=''; try{h3=c2.__vHome(); ok(true,'vHome() ngày cuối tháng chạy được');}catch(e){ok(false,'vHome() ngày cuối tháng','lỗi: '+e.message);}
const pa2=c2.__pace();
ok(pa2.conLai===0&&pa2.ngayCon===1,'ngày cuối: còn 1 ngày tính cả hôm nay (không còn nhánh "0 ngày")');
ok(h3.includes('ngày cuối tháng')&&!h3.includes('Infinity')&&!h3.includes('NaN'),'ngày cuối tháng: không chia cho 0');
ok(h3.indexOf('THỰC TẾ ĐƯỢC TIÊU')>=0||h3.indexOf('Số tiền còn lại được dùng để chi')>=0,
  'ngày cuối tháng vẫn hiện được số còn lại, không rơi về 0 vô lý');


console.log('\nH · Bản v=8 — bảng từ, khối Nợ, nút xổ');
{ /* bang tu da chot: mot khai niem mot ten */
  ok(h.indexOf('Hạn mức linh hoạt')>=0,'dùng "Hạn mức linh hoạt"');
  ok(h.indexOf('Số tiền còn lại được dùng để chi')>=0&&h.indexOf('>Còn được dùng để chi')<0,'dùng đúng tên "Số tiền còn lại được dùng để chi" (Vy đổi lại 28/09)');
  ok(h.indexOf('Số tiền còn lại được tiêu')<0,'KHÔNG còn tên cũ "Số tiền còn lại được tiêu"');
  ok(h.indexOf('tiêu dùng thật')<0,'KHÔNG đặt tên riêng cho cố định + linh hoạt (Vy chốt)');
  ok(h.indexOf('Trung bình')<0,'đã bỏ "trung bình mỗi ngày" ở ô tổng chi');
}
{ /* khoi No: hai ben ro rang, chi hien khoan con */
  ok(h.indexOf('KHOẢN PHẢI TRẢ')>=0&&h.indexOf('KHOẢN CHỜ THU')>=0,'khối Nợ tách hai bên');
  ok(h.indexOf('TÔI PHẢI TRẢ')<0,'KHÔNG dùng tên cũ "Tôi phải trả"');
  ok(h.indexOf('class="nohd')>=0,'tiêu đề hai mục dùng class riêng, không mượn daygroup');
  ok(h.indexOf('nohd ra" style')<0&&h.indexOf('daygroup dg-sub" style="color')<0,
    'KHÔNG đặt chữ màu lên dải xanh đặc (chữ sẽ chìm)');
}
{ /* moi khoi xo deu co vo chay chuyen dong, va KHONG boc nham co giu gia tri */
  const vo=(h.match(/data-xo="/g)||[]).length;
  ok(vo>=4,'các khối xổ đều có vỏ chuyển động ('+vo+' vỏ)');
  ok((h.match(/data-open="/g)||[]).length>=4,'mỗi vỏ khai báo trạng thái đóng/mở');
  const js=fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8');
  ok(js.indexOf('if(open.txCode){')>=0,
    'open.txCode GIỮ NGUYÊN điều kiện — nó là mã nhóm, không phải cờ đúng/sai');
  ok(h.indexOf('data-xo="txCode"')<0,'KHÔNG bọc txCode (bọc là panel lọc luôn mở với mã rỗng)');
  ok(js.indexOf('xo-chay')>=0,'có tắt backdrop-filter trong lúc chạy chuyển động');
  ok(js.indexOf('class="xomui"')>=0,'mũi tên bọc thẻ riêng để đổi tại chỗ, không vẽ lại trang');
}
{ /* thanh so du: so day du, doi chieu sao ke duoc */
  ok(h.indexOf('Tiền mặt')>=0,'thanh số dư vẫn ghi "Tiền mặt" đầy đủ');
  const b=c.__bangTien();
  ok(h.indexOf(M(b.tien))>=0,'số dư tổng hiện dạng đầy đủ, không rút gọn');
}
console.log('\n'+(loi?'✗ CÒN '+loi+' LỖI':'✓ TẤT CẢ ĐỀU ĐẠT'));
process.exit(loi?1:0);
