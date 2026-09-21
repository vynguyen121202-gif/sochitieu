/* Kiểm tra bản Tổng quan MỚI bằng máy, không cần mở trình duyệt.
   Chạy app.js của BẢN SAO dưới Node với DOM giả, theo đúng công thức trong CLAUDE.md. */
const fs=require('fs'), path=require('path'), vm=require('vm');
const {soMau,lamMoiHat}=require('./so-mau.js');

let code=fs.readFileSync(path.join('D:\\\\Website Sổ chi tiêu','app.js'),'utf8');
code=code.slice(0,code.indexOf("try{\n  const mf="));
code+=`
globalThis.__set=(db,cur,mo)=>{DB=db;cursor=cur;tab='home';open=mo||{};msg='';memoClear();};
globalThis.__vHome=()=>vHome();
globalThis.__pace=()=>pace(cursor);
globalThis.__fc=()=>forecast();
globalThis.__m=()=>metrics(cursor);
globalThis.__hmcy=()=>hanMucChuY(cursor);
globalThis.__alerts=()=>alerts();
globalThis.__spent=(g,d)=>spentOf(g,d);`;

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
ok(pa.conDuoc===pa.duTru-pa.daChi-pa.choMuon,
  'còn lại = ngân sách − chi linh hoạt − cho mượn',
  M(pa.duTru)+' − '+M(pa.daChi)+' − '+M(pa.choMuon)+' ≠ '+M(pa.conDuoc));
console.log('      ('+M(pa.duTru)+' − '+M(pa.daChi)+' − '+M(pa.choMuon)+' = '+M(pa.conDuoc)+')');
ok(pa.conDuoc!==Math.max(0,pa.duTru-pa.daChi),'khác hẳn công thức cũ (cũ ra '+M(Math.max(0,pa.duTru-pa.daChi))+')');

console.log('\nB · Mục 6 — năm dòng chi tiêu cộng lại đúng bằng tổng chi');
const b=pa.bd;
const cong=pa.daChi+b.coDinh+b.ngoai.tk+b.ngoai.muon+b.ngoai.trano;
ok(cong===b.chiTong,'linh hoạt + cố định + tiết kiệm + cho mượn + trả nợ = tổng chi',
  M(cong)+' ≠ '+M(b.chiTong));
console.log('      linh hoạt '+M(pa.daChi)+' · cố định '+M(b.coDinh)+' · tiết kiệm '+M(b.ngoai.tk)
  +' · cho mượn '+M(b.ngoai.muon)+' · trả nợ '+M(b.ngoai.trano)+' = '+M(b.chiTong));

console.log('\nC · Tốc độ chi linh hoạt theo từng nhóm — số không được đổi');
const f=c.__fc();
const tongNhom=f.bd.filter(g=>g.lh).reduce((s,g)=>s+g.lh/(f.passed||1),0);
ok(Math.abs(tongNhom-f.rate)<1,'cộng tốc độ từng nhóm = tốc độ chung',
  M(tongNhom)+' ≠ '+M(f.rate));
console.log('      '+f.bd.filter(g=>g.lh).length+' nhóm, tốc độ chung '+M(f.rate)+' mỗi ngày');

console.log('\nD · Mục 11.1 — Dự báo 1 KHÔNG trừ góp mục tiêu (theo lựa chọn của Vy)');
ok(f.keHoach===f.inc-f.raPlan,'để dành được = thu nhập − dự chi, y như cũ',
  M(f.inc)+' − '+M(f.raPlan)+' ≠ '+M(f.keHoach));

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
ok(h.indexOf('TỔNG QUAN THÁNG NÀY')<h.indexOf('TỔNG NGÂN SÁCH KHẢ DỤNG'),
  'thực thu − thực chi nằm TRƯỚC tổng ngân sách');
ok(h.indexOf('DỰ BÁO 1')>=0&&h.indexOf('DỰ BÁO 2')>=0,'đã đổi Cách 1/2 thành Dự báo 1/2');
ok(h.indexOf('Dự chi trong tháng')>=0,'đã đổi "Sẽ chi cả tháng" thành "Dự chi trong tháng"');
ok(h.indexOf('Trong đó cần góp mục tiêu tài chính')>=0,'có dòng góp mục tiêu tài chính');
ok(h.indexOf('CHI TIẾT TỪNG NHÓM CỦA DỰ BÁO Ở TRÊN')>=0,'bảng chi tiết có nhãn nói rõ là con của khối trên');
ok(h.indexOf('dg-bud')>=0&&h.indexOf('dg-chi')>=0&&h.indexOf('dg-kq')>=0,'ba khối trong bảng có ba màu khác nhau');
const m=c.__m();
ok(h.indexOf(M(m.thu-m.chi))>=0,'số thực thu − thực chi có mặt trên trang ('+M(m.thu-m.chi)+')');

console.log('\nE2 · Vòng sửa 2');
ok(h.indexOf('dg-db1')>=0&&h.indexOf('dg-db2')>=0,'Dự báo 1 và Dự báo 2 đều có tiêu đề khối');
ok(h.indexOf('Tiêu vừa đủ hạn mức sẽ để dành được')>=0,'có dòng tổng quát "tiêu vừa đủ hạn mức…"');
ok(h.indexOf('Nếu giữ đà đang tiêu sẽ để dành được')>=0,'có dòng tổng quát "nếu giữ đà đang tiêu…"');
ok(h.indexOf('fcsum-1')<h.indexOf('id="sec-fc"'),'hai dòng tổng quát nằm NGOÀI/TRƯỚC ô xổ xuống');
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
{ /* KẾT QUẢ: ba số phải được tô màu, không còn dùng LN trắng trơn */
  const i=h.indexOf('dg-kq'), doan=h.slice(i,i+2600);
  ok((doan.match(/font-weight:700;color:var\(--/g)||[]).length===3,
    'ba số trong KẾT QUẢ đều được tô màu như ô lớn',
    'đếm được '+((doan.match(/font-weight:700;color:var\(--/g)||[]).length));
  ok(doan.indexOf('so với định mức ngày')>=0,'Thực tế được tiêu có ghi hụt/dôi so với định mức ngày');
}
{ /* tiêu đề khối: phân biệt bằng MÀU CHỮ, không tô nền/viền ngoài */
  const cs=fs.readFileSync(path.join('D:\\\\Website Sổ chi tiêu','style.css'),'utf8');
  const js2=fs.readFileSync(path.join('D:\\\\Website Sổ chi tiêu','app.js'),'utf8');
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
               'Dự báo để dành','Nợ','Mục tiêu đang thực hiện'];
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
  const cs=fs.readFileSync(path.join('D:\\\\Website Sổ chi tiêu','style.css'),'utf8');
  const iA=cs.indexOf('.alerts{margin-top:12px'), khung=cs.slice(iA,iA+230);
  ok(khung.indexOf('border-radius:var(--r)')>=0&&khung.indexOf('background:var(--card)')>=0,
    'các cảnh báo nằm chung trong MỘT khung như .panel');
  const i=cs.indexOf('  .al{display:flex'), doan=cs.slice(i,i+430);
  ok(doan.indexOf('border-radius:0')>=0,'từng cảnh báo không còn là thẻ bo góc riêng');
  ok(doan.indexOf('margin:0')>=0,'không còn khoảng hở giữa các cảnh báo');
  ok(/\.al \.tx\{[^}]*white-space:nowrap/.test(cs),'mỗi cảnh báo gói gọn một dòng');
  ok(/\.al \.tx\{[^}]*text-overflow:ellipsis/.test(cs),'chữ dài thì cắt bằng dấu …, không xuống dòng');
  const pAl=+doan.match(/padding:(\d+)px/)[1];
  ok(pAl<=8,'lề dọc cảnh báo ≤ 8px, mỏng hơn hẳn các hàng khác','đang '+pAl+'px');
  /* mọi cảnh báo phải cao bằng nhau -> không câu nào được dài quá một dòng ở khổ 390px.
     ~44 ký tự là ngưỡng an toàn cho 12.5px trong cột 390px trừ lề. */
  const dai=c.__alerts().map(a=>a.t).filter(t=>t.replace(/<[^>]*>/g,'').length>52);
  ok(dai.length===0,'không câu cảnh báo nào dài quá một dòng',dai.join(' | '));
}
{ /* KHÔNG ảnh nền nào được ép sai tỷ lệ — cả hai ảnh đều là ảnh dọc 561x1000 */
  const cs=fs.readFileSync(path.join('D:\\\\Website Sổ chi tiêu','style.css'),'utf8');
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
  const c=fs.readFileSync(path.join('D:\\\\Website Sổ chi tiêu','style.css'),'utf8');
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
ok(h2.indexOf('Dự báo để dành')<0,'KHÔNG còn Dự báo để dành');
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
ok(pa2.conLai===0,'còn 0 ngày');
ok(h3.indexOf('Ngày cuối tháng, còn bao nhiêu tiêu nốt bấy nhiêu')>=0||h3.indexOf('Thực tế được tiêu')>=0,
  'ô Thực tế được tiêu không rơi về 0 vô lý');

console.log('\n'+(loi?'✗ CÒN '+loi+' LỖI':'✓ TẤT CẢ ĐỀU ĐẠT'));
process.exit(loi?1:0);
