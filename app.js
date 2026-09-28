/* ==================== CÂY NHÓM — mã cố định vĩnh viễn ==================== */
const GROUPS=[
 {id:'an', k:'chi', n:'Ăn uống', c:'#C0766B', subs:[['an_sang','Ăn sáng'],['an_ngoai','Ăn ngoài'],['an_cafe','Cà phê, trà chiều']]},
 {id:'cho',sn:'Chợ, siêu thị', k:'chi', n:'Chợ & siêu thị', c:'#7E9455', subs:[['cho_vat','Ăn vặt'],['cho_giavi','Gia vị'],['cho_mi','Mì gói']]},
 {id:'di', k:'chi', n:'Di chuyển', c:'#5F86AE', subs:[['di_xang','Xăng xe'],['di_grab','Grab, taxi'],['di_guixe','Gửi xe'],['di_suaxe','Sửa xe'],['di_ve','Vé xe, vé máy bay']]},
 {id:'hd', sn:'Hóa đơn', k:'chi', n:'Hóa đơn & tiện ích', c:'#5C87C4', subs:[['hd_dt','Điện thoại'],['hd_ai','A.I']]},
 {id:'qa', sn:'Quần áo', k:'chi', n:'Quần áo & giày dép', c:'#8E76AB', subs:[['qa_ao','Quần áo'],['qa_giay','Giày dép'],['qa_tui','Túi xách, phụ kiện']]},
 {id:'gdu',sn:'Gia dụng', k:'chi', n:'Đồ gia dụng', c:'#71809A', subs:[]},
 {id:'ld', sn:'Làm đẹp', k:'chi', n:'Làm đẹp & chăm sóc bản thân', c:'#B4709A', subs:[]},
 {id:'sk', k:'chi', n:'Sức khỏe', c:'#C07470', subs:[['sk_thuoc','Thuốc'],['sk_tpcn','Thực phẩm chức năng'],['sk_kham','Khám bệnh']]},
 {id:'gt', k:'chi', n:'Giải trí', c:'#C08F4E', subs:[['gt_dichoi','Đi chơi, du lịch'],['gt_phim','Phim, sách, game'],['gt_ban','Đi ăn với bạn bè']]},
 {id:'gd', sn:'Gia đình', k:'chi', n:'Gia đình & hiếu hỉ', c:'#A96A58', subs:[['gd_bome','Biếu bố mẹ'],['gd_cuoi','Cưới hỏi'],['gd_ma','Ma chay'],['gd_qua','Quà tặng']]},
 {id:'ht', k:'chi', n:'Học tập', c:'#7A9470', subs:[['ht_khoa','Khóa học'],['ht_sach','Sách'],['ht_thi','Thi chứng chỉ']]},
 {id:'tk', sn:'Tiết kiệm', k:'chi', n:'Tiết kiệm & đầu tư (tiền nhàn rỗi)', c:'#47897A', subs:[['tk_gui','Gửi tiết kiệm'],['tk_vang','Mua vàng']]},
 {id:'tt',  k:'chi', n:'Từ thiện', c:'#9A6B95', subs:[]},
 {id:'muon',sn:'Cho mượn', k:'chi',n:'Cho mượn', c:'#97885F', subs:[]},
 {id:'trano',sn:'Trả nợ', k:'chi',n:'Trả nợ', c:'#8A7D6C', subs:[['trano_cn','Trả nợ cá nhân'],['trano_gop','Trả góp']]},
 {id:'luong', k:'thu', n:'Lương', c:'#56937F', subs:[]},
 {id:'thuong',sn:'Thưởng', k:'thu', n:'Thưởng', c:'#7E9E6A', subs:[['thuong_tet','Thưởng lễ Tết'],['thuong_hq','Thưởng hiệu quả']]},
 {id:'thuno', sn:'Thu nợ', k:'thu', n:'Thu nợ', c:'#97885F', subs:[]},
 {id:'divay', sn:'Đi vay', k:'thu', n:'Đi vay', c:'#B4709A', subs:[]},
 {id:'tkhac', sn:'Thu khác', k:'thu', n:'Thu khác', c:'#8794A0', subs:[['tkhac_hoan','Hoàn tiền'],['tkhac_ban','Bán đồ cũ'],['tkhac_cho','Người nhà cho'],['tkhac_lai','Lãi tiết kiệm, cổ tức']]}
];
const SRC=[{id:'bidv',n:'BIDV'},{id:'vi',n:'Ví điện tử'},{id:'tm',n:'Tiền mặt'}];
const srcOf=id=>SRC.find(s=>s.id===id)||SRC[0];
const NOGROUP={id:'',n:'Chưa chọn nhóm',c:'var(--ink-3)',subs:[],k:'chi'};
function groupOf(code){
  if(!code)return NOGROUP;
  return GROUPS.find(g=>g.id===code||g.subs.some(s=>s[0]===code))||NOGROUP;
}
function labelOf(code){
  const g=groupOf(code); if(!code)return g.n;
  const s=g.subs.find(x=>x[0]===code);
  return s?s[1]:g.n;
}
const validCode=(code,kind)=>{const g=groupOf(code);return !!code&&g.id&&(!kind||g.k===kind);};

const KEY='sochi:data';
const VERSION='17.4';
let DB={txns:[],debts:[],budgets:{},bm:{},goals:[],fixedItems:[],roll:{},offsets:[],draws:[],income:0,rules:{},opens:{bidv:0,vi:0,tm:0},checks:{},opts:{ab:'off'},chainOK:{},chot:{},efTarget:0,goalPlan:{mode:'auto',a:0},payDays:{k1:[5,10],k2:[15,25]},lastBackup:0,v:5};
let tab='home', cursor=new Date(), pending=null, msg='', msgType='err', open={};

/* ==================== tiện ích ==================== */
const money=n=>new Intl.NumberFormat('vi-VN').format(Math.round(n));
const short=n=>{const g=n<0?'-':'';n=Math.abs(n);
  return g+(n>=1e9?(n/1e9).toFixed(n%1e9?1:0)+' tỷ':n>=1e6?(n/1e6).toFixed(n>=1e7?0:1)+' tr':n>=1e3?Math.round(n/1e3)+'k':String(Math.round(n)));};
const ym=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0');
const iso=d=>ym(d)+'-'+String(d.getDate()).padStart(2,'0');
const esc=s=>String(s).replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
const MONTH=m=>'Tháng '+(m+1);
const daysIn=d=>new Date(d.getFullYear(),d.getMonth()+1,0).getDate();
const noAccent=s=>String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d');
function merchantKey(s){
  return noAccent(s).replace(/[^a-z0-9\s]/g,' ').replace(/\d+/g,' ').replace(/\s+/g,' ').trim()
    .split(' ').filter(w=>w.length>1).slice(0,4).join(' ');
}
const fid=t=>t.d+'|'+t.a+'|'+(t.p||merchantKey(t.n0||t.n).slice(0,24));
const ddmm=s=>String(s).slice(8,10)+'/'+String(s).slice(5,7);
/* ---- Ô nhập ngày kiểu Việt Nam dd/mm/yy — mọi ô ngày trong app dùng chung ----
   Chỉ cần gõ số, app tự chèn dấu "/". Ngày bắt đầu bằng 4-9 thì chắc chắn là ngày
   một chữ số (7 -> 07); tháng bắt đầu bằng 2-9 cũng vậy. Bỏ năm thì:
   hướng "toi" (ngày hẹn thu/trả) lấy lần gần nhất CHƯA qua, hướng "qua" (ngày giao
   dịch) lấy lần gần nhất ĐÃ qua. Sổ vẫn lưu YYYY-MM-DD, chỉ cách gõ và cách hiện đổi. */
const vnd=s=>s?String(s).slice(8,10)+'/'+String(s).slice(5,7)+'/'+String(s).slice(2,4):'';
function dtFmt(v){
  let s=String(v).replace(/\D/g,''); if(!s)return '';
  const d1=s[0]>'3'; const dd=d1?'0'+s[0]:s.slice(0,2); s=s.slice(d1?1:2);
  if(!s)return dd;
  const m1=s[0]>'1'; const mm=m1?'0'+s[0]:s.slice(0,2); s=s.slice(m1?1:2);
  return dd+'/'+mm+(s?'/'+s.slice(0,2):'');
}
/* trả về 'YYYY-MM-DD', '' nếu ô trống, null nếu chưa đủ hoặc không có ngày đó */
function dtRead(v,huong){
  v=String(v||'').trim(); if(!v)return '';
  const m=v.match(/^(\d{1,2})\/(\d{1,2})(?:\/(\d{2}))?$/); if(!m)return null;
  const dd=+m[1], mm=+m[2], nay=new Date(), hn=iso(nay);
  const mk=y=>{const t=new Date(y,mm-1,dd);return t.getDate()===dd&&t.getMonth()===mm-1?iso(t):null;};
  if(m[3])return mk(2000+ +m[3]);
  const y=nay.getFullYear(); let r=mk(y);
  if(!r&&dd===29&&mm===2){                /* 29/02 bỏ năm: lấy năm nhuận gần nhất theo hướng */
    for(let k=1;k<=4&&!r;k++)r=mk(huong==='qua'?y-k:y+k); return r;}
  if(!r)return null;
  if(huong==='toi'&&r<hn)r=mk(y+1);
  if(huong==='qua'&&r>hn)r=mk(y-1);
  return r;
}
const THU=['Chủ nhật','Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm','Thứ Sáu','Thứ Bảy'];
function dtHint(el){
  const h=el.nextElementSibling; if(!h||!h.classList.contains('dt-h'))return;
  const v=el.value.trim(); h.className='dt-h';
  if(!v){h.textContent='';return;}
  const r=/^\d\d\/\d\d(\/\d\d)?$/.test(v)?dtRead(v,el.dataset.huong):null;
  if(r===null){
    if(/^\d\d\/\d\d(\/\d\d)?$/.test(v)){h.classList.add('bad');h.textContent='Không có ngày này trong lịch.';}
    else h.textContent='gõ tiếp: ngày, tháng, năm (năm có thể bỏ)';
    return;}
  const t=new Date(r+'T00:00'), n=Math.round((t-new Date(iso(new Date())+'T00:00'))/864e5);
  h.classList.add('ok');
  h.textContent='→ '+THU[t.getDay()]+', '+r.slice(8,10)+'/'+r.slice(5,7)+'/'+r.slice(0,4)
    +(n>0?' · còn '+n+' ngày':n===0?' · hôm nay':' · '+(-n)+' ngày trước');
}
function dtGo(el,e){ if(!e||!/^delete/.test(e.inputType||''))el.value=dtFmt(el.value); dtHint(el); }
/* vẽ một ô ngày: id, ngày đang lưu (ISO), hướng 'toi' | 'qua', thuộc tính thêm */
function dtInput(id,val,huong,them){
  return '<input class="dt" id="'+id+'" inputmode="numeric" maxlength="8" autocomplete="off"'
    +(/placeholder=/.test(them||'')?'':' placeholder="dd/mm/yy"')
    +' data-huong="'+(huong||'qua')+'" value="'+vnd(val)+'" oninput="dtGo(this,event)" '+(them||'')+'>'
    +'<div class="dt-h"></div>';
}
function dtSet(id,v){const el=document.getElementById(id);if(!el)return;el.value=v?vnd(v):'';dtHint(el);
  el.dispatchEvent(new Event('change'));}
/* ngày lương tới: lấy ngày thật của hai kỳ lương gần nhất trong sổ, không có thì lấy đầu khung ngày lương */
function ngayLuongToi(){
  const w=PAY(), ls=DB.txns.filter(t=>t.t==='thu'&&groupOf(t.c).id==='luong').map(t=>t.d).sort();
  const lay=(k)=>{const x=ls.filter(d=>{const n=+d.slice(8,10);return n>=k[0]&&n<=k[1];}).pop();return x?+x.slice(8,10):k[0];};
  const ngay=[lay(w.k1),lay(w.k2)].sort((a,b)=>a-b), hn=iso(new Date()), n=new Date();
  for(let i=0;i<3;i++)for(const d of ngay){
    const t=iso(new Date(n.getFullYear(),n.getMonth()+i,Math.min(d,28)));
    if(t>hn)return t;}
  return '';
}
/* nút chọn nhanh dưới ô ngày hẹn */
function dtChips(id){
  const n=new Date(), sau=n.getDate()>20, c=new Date(n.getFullYear(),n.getMonth()+(sau?2:1),0), l=ngayLuongToi();
  return '<div class="dt-chips">'
    +(l?'<button type="button" onclick="dtSet(\''+id+'\',\''+l+'\')">Ngày lương tới · '+ddmm(l)+'</button>':'')
    +'<button type="button" onclick="dtSet(\''+id+'\',\''+iso(c)+'\')">Cuối tháng '+(c.getMonth()+1)+'</button>'
    +'<button type="button" onclick="dtSet(\''+id+'\',\'\')">Chưa biết</button></div>';
}
/* cùng đối tác: ưu tiên mã đối tác, không có mã thì so tên nơi bán */
function samePartner(a,b){
  if(a.p&&b.p)return a.p===b.p;
  if(a.p||b.p)return false;
  const ka=merchantKey(a.n0||a.n),kb=merchantKey(b.n0||b.n);
  return !!ka&&ka===kb;
}
/* khoản đã có trong sổ: cùng số tiền, cùng đối tác, chỉ lệch ngày → nghi bị đọc sai ngày */
const REP_DAYS=10;
function findReplace(t,taken){
  if(t.t!=='chi'&&t.t!=='thu')return null;
  let best=null,bd=1e9;
  DB.txns.forEach(x=>{
    if(x.t!==t.t||x.a!==t.a||x.d===t.d)return;
    if(x.sg||x.debt)return;
    if(taken&&taken.has(String(x.id)))return;
    if(!samePartner(t,x))return;
    const dd=Math.abs((new Date(x.d+'T00:00')-new Date(t.d+'T00:00'))/864e5);
    if(dd>REP_DAYS||dd>=bd)return;
    bd=dd;best=x;
  });
  return best;
}
function parseAmt(v){
  let s=noAccent(v).replace(/[\s+]/g,'').replace(/vnd|dong/g,'').replace(/d$/,'').replace(/^[-−–—]/,'');
  if(/^\d{1,3}(,\d{3})+/.test(s)) s=s.replace(/,/g,'');
  else if(/^\d{1,3}(\.\d{3})+/.test(s)) s=s.replace(/\./g,'');
  else s=s.replace(/,/g,'.');
  const m=s.match(/^(\d+(?:\.\d+)?)(tr|trieu|k|m)?(\d*)$/); if(!m)return NaN;
  let b=parseFloat(m[1]); if(isNaN(b))return NaN; const u=m[2];
  if(u==='tr'||u==='trieu'||u==='m'){b*=1e6; if(m[3])b+=parseFloat(m[3])*1e6/Math.pow(10,m[3].length);}
  else if(u==='k'){b*=1e3; if(m[3])b+=parseFloat(m[3])*1e3/Math.pow(10,m[3].length);}
  return Math.round(b);
}

/* ==================== lưu trữ ==================== */
const store={
  async get(){ if(window.storage){try{const r=await window.storage.get(KEY);return r&&r.value;}catch(e){}}
    try{return localStorage.getItem(KEY);}catch(e){return null;} },
  async set(v){ if(window.storage){try{await window.storage.set(KEY,v);return true;}catch(e){}}
    try{localStorage.setItem(KEY,v);return true;}catch(e){return false;} }
};
function migrate(d){
  const v=d.v||1;
  if(v<2)(d.txns||[]).forEach(t=>{
    if(!t.s)t.s='bidv';
    if(t.x){t.t='mv';t.s2=t.w?'vi':'tm';delete t.x;delete t.c;}
    else if(t.c==='ms')t.c='qa'; else if(t.c==='ck'||t.c==='kh')t.c='';
  });
  if(v<3){const M={vay:'muon',no:'thuno'};
    (d.txns||[]).forEach(t=>{if(t.c&&M[t.c])t.c=M[t.c];
      if(t.c&&!groupOf(t.c).id)t.c='';});
    const nb={}; Object.entries(d.budgets||{}).forEach(([k,v2])=>{nb[M[k]||k]=v2;}); d.budgets=nb;}
  if(v<4){ d.debts=d.debts||[]; }
  if(v<5){ d.income=d.income||0; }
  if(v<6){ d.fixedItems=d.fixedItems||[]; delete d.fixed; d.budgets=d.budgets||{}; }
  if(v<7){ d.roll=d.roll||{gt:1,gd:1,qa:1,gdu:1,ht:1,sk:1,tt:1}; d.offsets=d.offsets||[]; }
  if(v<8){ d.draws=d.draws||[]; }
  if(v<9){ d.bm=d.bm||{}; d.goals=d.goals||[]; }
  /* mức góp riêng cho từng mục tiêu; để 0 và giữ nguyên goalPlan.mode thì mọi thứ
     vẫn chạy y như cũ, chỉ khi Vy đặt mức riêng mới chuyển sang mode 'each' */
  if(v<10){ (d.goals||[]).forEach(g=>{ if(g.gop===undefined)g.gop=0; }); d.efGop=d.efGop||0; }
  if(v<11){ d.chot=d.chot||{}; }            /* v11: tháng đã chốt sổ — sổ cũ chưa chốt tháng nào */
  if(v<12){ d.batDau=d.batDau||''; }        /* v12: bắt đầu theo dõi từ — trống thì hộp thoại hỏi */
  d.v=12; return d;
}
async function load(){try{const raw=await store.get();if(raw){let d=JSON.parse(raw);
  if((d.v||1)<12)d=migrate(d);
  DB=Object.assign({},d,{txns:Array.isArray(d.txns)?d.txns:[],debts:Array.isArray(d.debts)?d.debts:[],
    budgets:d.budgets||{},bm:d.bm||{},goals:Array.isArray(d.goals)?d.goals:[],fixedItems:Array.isArray(d.fixedItems)?d.fixedItems:[],roll:d.roll||{},offsets:Array.isArray(d.offsets)?d.offsets:[],draws:Array.isArray(d.draws)?d.draws:[],income:d.income||0,rules:d.rules||{},
    opens:Object.assign({bidv:0,vi:0,tm:0},d.opens||{}),checks:d.checks||{},
    opts:Object.assign({ab:'off'},d.opts||{}),chainOK:d.chainOK||{},ngayOK:d.ngayOK||{},
    efTarget:d.efTarget||0,efGop:d.efGop||0,goalPlan:Object.assign({mode:'auto',a:0},d.goalPlan||{}),
    payDays:Object.assign({k1:[5,10],k2:[15,25]},d.payDays||{}),
    chot:d.chot||{},batDau:d.batDau||'',lastBackup:d.lastBackup||0,v:12});}}catch(e){}}
/* ==================== nhớ tạm trong một lượt vẽ ====================
   render() dựng lại cả trang, nên cùng một phép tính bị gọi lại hàng chục lần:
   pace() hai lượt, balances() hai lượt, fixedPaid() ba lượt cho mỗi khoản cố định.
   Nhớ kết quả lại trong lượt vẽ đó rồi dọn sạch ở đầu render() và mỗi khi DB đổi,
   nên không bao giờ đọc phải số cũ. Chỉ nhớ những hàm thuần đọc, không sửa gì. */
let _memo={};
function memoClear(){_memo={};_dl=null;_first=null;}
let saveT=null;
function save(){memoClear();clearTimeout(saveT);saveT=setTimeout(()=>store.set(JSON.stringify(DB)),200);}

/* ==================== sao lưu ==================== */
const backupName=()=>'so-chi-tieu-'+iso(new Date())+'.json';
const daysSinceBackup=()=>DB.lastBackup?Math.floor((Date.now()-DB.lastBackup)/864e5):null;
function backupFile(){const body=JSON.stringify(DB);
  try{return new File([body],backupName(),{type:'application/json'});}
  catch(e){return new Blob([body],{type:'application/json'});}}
function download(f){const url=URL.createObjectURL(f),a=document.createElement('a');
  a.href=url;a.download=f.name||backupName();document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),3000);}
function runBackup(mode,quiet){
  const f=backupFile();
  const done=()=>{DB.lastBackup=Date.now();save();if(!quiet)flash('Đã tạo bản sao lưu.','ok');else render();};
  if(mode==='share'&&navigator.canShare&&navigator.share){
    try{if(navigator.canShare({files:[f]})){
      navigator.share({files:[f],title:'Sao lưu sổ chi tiêu'}).then(done)
        .catch(e=>{if(e&&e.name!=='AbortError'){try{download(f);done();}catch(_){}}});
      return;}}catch(e){}}
  try{download(f);done();}catch(e){if(!quiet)flash('Trình duyệt chặn tải file.','err');}
}
function autoBackup(){const m=(DB.opts&&DB.opts.ab)||'off';if(m!=='off')runBackup(m,true);}
function flash(t,k){msg=t;msgType=k||'err';render();}

/* ==================== số dư & đối chiếu ==================== */
function balances(){
  if('bal' in _memo)return _memo.bal;
  const b={bidv:+DB.opens.bidv||0, vi:+DB.opens.vi||0, tm:+DB.opens.tm||0};
  DB.txns.forEach(t=>{
    const s=t.s||'bidv';
    if(t.t==='mv'){ b[s]=(b[s]||0)-t.a; const to=t.s2||'tm'; b[to]=(b[to]||0)+t.a; }
    else if(t.t==='dc'){ b[s]=(b[s]||0)+(t.dir==='-'?-t.a:t.a); }
    else b[s]=(b[s]||0)+(t.t==='thu'?t.a:-t.a);
  });
  return _memo.bal=b;
}
function reportedBidv(){
  const rows=DB.txns.filter(t=>t.b&&(t.s||'bidv')==='bidv')
    .sort((x,y)=>(x.d+' '+(x.tm||'00:00')).localeCompare(y.d+' '+(y.tm||'00:00')));
  return rows.length?rows[rows.length-1]:null;
}
function bidvCheck(){
  if('chk' in _memo)return _memo.chk;
  const rep=reportedBidv(); if(!rep)return _memo.chk=null;
  const cut=rep.d+' '+(rep.tm||'00:00');
  let v=+DB.opens.bidv||0;
  DB.txns.forEach(t=>{
    if((t.d+' '+(t.tm||'00:00'))>cut)return;
    const s=t.s||'bidv';
    if(t.t==='mv'){ if(s==='bidv')v-=t.a; if(t.s2==='bidv')v+=t.a; }
    else if(s!=='bidv')return;
    else if(t.t==='dc')v+=(t.dir==='-'?-t.a:t.a);
    else v+=(t.t==='thu'?t.a:-t.a);
  });
  return _memo.chk={computed:v,reported:rep.b,diff:v-rep.b,at:rep};
}
/* gộp các mảnh của một giao dịch đã tách lại thành một dòng */
function chainRows(){
  const map={}, out=[];
  DB.txns.forEach(t=>{
    if((t.s||'bidv')!=='bidv'&&t.s2!=='bidv')return;
    if(t.t==='dc')return;                      // dòng điều chỉnh không phải giao dịch ngân hàng
    const k=t.sg||(t.b?('b'+t.d+(t.tm||'')+t.b):('x'+t.id));
    if(!map[k]){map[k]={d:t.d,tm:t.tm||'',delta:0,b:0,name:t.n||'',ids:[]};out.push(map[k]);}
    const own=(t.s||'bidv')==='bidv';
    map[k].delta+= t.t==='thu'?t.a : t.t==='mv'?(own?-t.a:t.a) : -t.a;
    map[k].ids.push(t.id);
    if(t.b)map[k].b=t.b;
    if(!map[k].tm&&t.tm)map[k].tm=t.tm;
    if(!map[k].name&&t.n)map[k].name=t.n;
  });
  return out.sort((x,y)=>(x.d+' '+(x.tm||'00:00')).localeCompare(y.d+' '+(y.tm||'00:00')));
}
/* Chuỗi số dư: cộng dồn MỌI giao dịch giữa hai mốc có số dư ngân hàng,
   kể cả giao dịch không kèm số dư, nếu không sẽ báo thiếu oan. */
function chainGaps(){
  if('cg' in _memo)return _memo.cg;
  const rows=chainRows(), out=[];
  let last=null, acc=0, from=null, fromB=0, bucket=[];
  rows.forEach(r=>{
    acc+=r.delta; bucket.push(r);
    if(r.b){
      if(last!==null){
        const exp=last+acc;
        if(Math.abs(exp-r.b)>=1)out.push({d:r.d,tm:r.tm,gap:r.b-exp,exp,b:r.b,
          from,fromB,rows:bucket.slice()});
      }
      last=r.b; acc=0; from=r.d+(r.tm?' '+r.tm:''); fromB=r.b; bucket=[];
    }
  });
  /* Giao dịch không ghi giờ bị xếp vào 00:00 nên có thể rơi nhầm sang khoảng trước.
     Nếu trong khoảng có đúng một dòng thiếu giờ bù vừa khít phần lệch thì đây là
     lỗi thứ tự, không phải thiếu giao dịch. */
  out.forEach((g,i)=>{
    let c=g.rows.find(r=>!r.tm&&Math.abs(r.delta+g.gap)<1);
    if(!c){const nx=out[i+1];
      if(nx)c=nx.rows.find(r=>!r.tm&&Math.abs(r.delta-g.gap)<1);}
    if(c){g.why='gio';g.culprit=c;}
    g.key=g.d+'|'+(g.tm||'')+'|'+Math.round(g.gap);
    g.ok=!!(DB.chainOK&&DB.chainOK[g.key]);
  });
  /* lệch do thứ tự luôn đi thành cặp bù nhau: khoảng sau cũng là cùng một chuyện */
  out.forEach((g,i)=>{const n2=out[i+1];
    if(g.why==='gio'&&n2&&!n2.why&&Math.abs(g.gap+n2.gap)<1){n2.why='gio';n2.culprit=g.culprit;n2.mirror=1;}});
  return _memo.cg=out;
}
const chainGap=key=>chainGaps().find(g=>g.key===key)||null;
/* Số dư lệch mà Vy chắc chắn đã nhập đủ giao dịch thì lỗi nằm ở chỗ khác:
   ghi sai ngày, ghi nhầm nguồn tiền, nhập trùng, hoặc thiếu giờ nên rơi nhầm khoảng.
   Hàm này dò trong sổ xem khoản nào bù vừa khít phần lệch. */
function chainSuspects(g){
  const need=g.gap;                      /* cần cộng thêm bấy nhiêu vào khoảng này */
  const inIds={}; g.rows.forEach(r=>(r.ids||[]).forEach(i=>{inIds[i]=1;}));
  const dTu=(g.from||g.d).slice(0,10), dDen=g.d;
  const nudge=(ds,n)=>{const x=new Date(ds+'T00:00:00');x.setDate(x.getDate()+n);return iso(x);};
  const som=nudge(dTu,-3), muon=nudge(dDen,3);
  const out=[];
  DB.txns.forEach(t=>{
    if(t.t==='dc')return;
    const own=(t.s||'bidv')==='bidv';
    const delta=t.t==='thu'?t.a : t.t==='mv'?(own?-t.a:t.a) : -t.a;
    const laB=own||t.s2==='bidv';
    if(inIds[t.id]){
      /* đang nằm trong khoảng — bỏ ra hoặc xóa đi thì hết lệch */
      if(Math.abs(delta+need)<1)
        out.push({t,delta,ly:t.tm?'có thể bị nhập trùng, hoặc thật ra thuộc khoảng sau':'chưa ghi giờ nên có thể rơi nhầm khoảng'});
      return;
    }
    if(t.d<som||t.d>muon)return;
    if(Math.abs(delta-need)>=1)return;
    /* nằm ngoài khoảng — kéo vào thì hết lệch */
    out.push({t,delta,ly:laB?'có thể bị ghi sai ngày, đúng ra thuộc khoảng này':'đang ghi ở '+srcOf(t.s).n+', có thể thật ra là giao dịch BIDV'});
  });
  return out.slice(0,6);
}
function chainAck(key){
  const all=chainGaps(), i=all.findIndex(g=>g.key===key);
  DB.chainOK=Object.assign({},DB.chainOK||{}); DB.chainOK[key]=1;
  if(i>=0&&all[i].why==='gio')[all[i-1],all[i+1]].forEach(n=>{
    if(n&&Math.abs(n.gap+all[i].gap)<1)DB.chainOK[n.key]=1;});
  open.chain=''; save();
  flash('Đã ghi nhận. Mốc này sẽ không báo nữa.','ok');
}
function chainReset(){ DB.chainOK={}; save(); flash('Đã bỏ xác nhận toàn bộ mốc số dư.','ok'); }
/* ==================== khoản nợ ==================== */
const addMonths=(isoD,k)=>{const [y,m,dd]=isoD.split('-').map(Number);
  const t=new Date(y,m-1+k,1), last=new Date(t.getFullYear(),t.getMonth()+1,0).getDate();
  return t.getFullYear()+'-'+String(t.getMonth()+1).padStart(2,'0')+'-'+String(Math.min(dd,last)).padStart(2,'0');};
const cleanName=s=>String(s).replace(/chuy[eể]?[nể]?\s*ti[eề]n/gi,'')
  .replace(/\s{2,}/g,' ').replace(/^[\s·,-]+|[\s·,-]+$/g,'').slice(0,40)||'Khoản nợ';
/* ---- tự nhận diện giao dịch trả nợ / thu nợ theo NỘI DUNG + SỐ TIỀN ----
   Giao dịch nhóm Trả nợ (chi) hoặc Thu nợ (thu) mà nội dung có tên khoản nợ
   thì tự tính vào khoản đó, khỏi phải bấm "Ghi thanh toán". */
const wordsOf=s2=>' '+noAccent(s2).replace(/[^a-z0-9]+/g,' ').trim()+' ';
function debtNameHit(name,t){
  const n=noAccent(name).replace(/[^a-z0-9]+/g,' ').trim();
  if(!n)return 0;
  const hay=wordsOf(t.n0||t.n)+wordsOf(t.n);
  if(hay.indexOf(' '+n+' ')>=0)return n.length+5;
  const ws=n.split(' ').filter(w=>w.length>1);
  if(!ws.length||(ws.length===1&&ws[0].length<3))return 0;   /* tên quá ngắn thì không đoán */
  return ws.every(w=>hay.indexOf(' '+w+' ')>=0)?n.length:0;
}
function debtMatch(t){
  if(t.nodebt)return null;
  if(t.debt)return t.debt;
  const gid=groupOf(t.c).id;
  const kind=(t.t==='chi'&&gid==='trano')?'no':(t.t==='thu'&&gid==='thuno')?'cho':null;
  if(!kind)return null;
  let best=null,bs=0;
  (DB.debts||[]).forEach(dt=>{
    if(dt.kind!==kind)return;
    let sc=debtNameHit(dt.name,t); if(!sc)return;
    const per=dt.mode==='gop'?(dt.per||0):(dt.principal||0);
    if(per&&Math.abs(t.a-per)<=Math.max(1000,per*0.02))sc+=100;   /* khớp cả số tiền */
    if(sc>bs){bs=sc;best=dt.id;}
  });
  return best;
}
let _dl=null;
function debtLinks(){
  if(_dl)return _dl;
  const m={}; DB.txns.forEach(t=>{const id=debtMatch(t);if(id)m[String(t.id)]=id;});
  _dl=m; return m;
}
const debtTxns=id=>{const m=debtLinks();return DB.txns.filter(t=>m[String(t.id)]===id);};
const paidOf=id=>{const mk='paid'+id; if(mk in _memo)return _memo[mk];
  return _memo[mk]=debtTxns(id).reduce((s,t)=>s+t.a,0);};
/* ---- gán tay: chọn một giao dịch ĐÃ CÓ trong sổ để tính vào khoản nợ,
   thay vì bấm Ghi thanh toán (vốn tạo thêm một dòng chi mới, làm đội chi phí) ---- */
let debtPick='', debtPickQ='';
function pickForDebt(id){debtPick=debtPick===id?'':id;debtPickQ='';render();}
function setDebtPickQ(v){debtPickQ=v;render();}
function debtCandidates(dt){
  const m=debtLinks(), want=dt.kind==='cho'?'thu':'chi';
  const q=noAccent(String(debtPickQ).trim()), qn=q.replace(/\D/g,'');
  const gid=dt.kind==='cho'?'thuno':'trano';
  return DB.txns.filter(t=>{
    if(t.t!==want||m[String(t.id)])return false;
    if(!q)return true;
    return noAccent(t.n).indexOf(q)>=0||(qn.length>=3&&String(t.a).indexOf(qn)>=0);
  }).sort((a,b)=>{
    const ga=groupOf(a.c).id===gid?0:1, gb=groupOf(b.c).id===gid?0:1;
    return ga!==gb?ga-gb:(b.d+' '+(b.tm||'')).localeCompare(a.d+' '+(a.tm||''));
  }).slice(0,30);
}
function linkTx(did,tid){
  const t=DB.txns.find(x=>String(x.id)===String(tid)); if(!t)return;
  t.debt=did; delete t.nodebt; _dl=null; save();
  flash('Đã tính '+money(t.a)+' ngày '+ddmm(t.d)+' vào khoản này.','ok');
}
/* gỡ một giao dịch bị ghép nhầm ra khỏi khoản nợ */
function unlinkDebt(tid){
  const t=DB.txns.find(x=>String(x.id)===String(tid)); if(!t)return;
  t.nodebt=1; delete t.debt; _dl=null; save(); flash('Đã bỏ khoản này khỏi sổ nợ.','ok');
}
function debtInfo(dt){
  const total=dt.mode==='gop'?(dt.periods||0)*(dt.per||0):(dt.principal||0);
  const paid=paidOf(dt.id), left=Math.max(0,total-paid);
  const lai=dt.mode==='gop'?Math.max(0,total-(dt.principal||0)):0;
  let nextDate='', nextAmt=0, kyDone=0;
  if(dt.mode==='gop'&&dt.per){
    kyDone=Math.min(dt.periods||0,Math.floor(paid/dt.per));
    if(left>0){nextDate=addMonths(dt.start||iso(new Date()),kyDone);
      nextAmt=Math.min(left,Math.max(0,dt.per*(kyDone+1)-paid));}
  }else if(left>0){nextDate=dt.due||'';nextAmt=left;}
  const days=nextDate?Math.ceil((new Date(nextDate+'T00:00')-new Date(iso(new Date())+'T00:00'))/864e5):null;
  return {total,paid,left,lai,nextDate,nextAmt,kyDone,days,done:left<=0};
}
/* mức độ gấp của một khoản nợ, dùng chung cho Tổng quan và tab Nợ */
function dueLevel(i){
  if(i.done)return {k:'done',cls:'grey',txt:'đã trả xong'};
  if(!i.nextDate)return {k:'none',cls:'grey',txt:'chưa đặt hạn trả'};
  const d=i.days;
  if(d<0)  return {k:'over', cls:'red',   txt:'quá hạn '+(-d)+' ngày'};
  if(d<=3) return {k:'now',  cls:'red',   txt:d===0?'đến hạn hôm nay':'còn '+d+' ngày'};
  if(d<=15)return {k:'soon', cls:'amber', txt:'còn '+d+' ngày'};
  return {k:'far', cls:'grey', txt:'hạn '+i.nextDate.slice(8,10)+'/'+i.nextDate.slice(5,7)};
}
function debtRow(d){
  const i=debtInfo(d), lv=dueLevel(i);
  const ky=d.mode==='gop'&&!i.done?`kỳ ${i.kyDone+1}/${d.periods}`:'';
  return `<div class="src"><div style="min-width:0"><div class="src-n">${esc(d.name)}</div>
    ${ky?`<div class="src-m">${ky}</div>`:''}
    <span class="due ${lv.cls}">${lv.txt}</span></div>
    <div class="src-a ${d.kind==='cho'?'':'neg'}">${money(i.left)}</div></div>`;
}

const debtTotals=()=>{
  let no=0,cho=0;
  DB.debts.forEach(d=>{const i=debtInfo(d);if(d.kind==='cho')cho+=i.left;else no+=i.left;});
  return {no,cho};
};
function reconcile(sid){
  const bal=balances(), cur=bal[sid]||0;
  const raw=prompt(srcOf(sid).n+' — app tính '+money(cur)+'.\nNếu khớp thì bấm OK. Nếu không, gõ số dư thật:', money(cur));
  if(raw===null)return;
  const n=parseAmt(raw);
  DB.checks=DB.checks||{};
  if(isNaN(n)||n===cur){ DB.checks[sid]=Date.now(); save(); flash('Đã ghi nhận '+srcOf(sid).n+' khớp.','ok'); return; }
  const diff=n-cur;
  DB.txns.push({id:Date.now()+Math.random(),d:iso(new Date()),t:'dc',s:sid,
    a:Math.abs(diff),dir:diff>0?'+':'-',n:'Điều chỉnh số dư '+srcOf(sid).n});
  DB.checks[sid]=Date.now(); save();
  flash('Đã ghi chênh lệch '+(diff>0?'+':'-')+money(Math.abs(diff))+'. Nếu nhớ ra khoản nào thiếu, xóa dòng điều chỉnh rồi nhập lại cho đúng.','ok');
}

/* ==================== câu lệnh cho AI ==================== */
function codeList(kind){
  return GROUPS.filter(g=>g.k===kind).map(g=>
    g.subs.length? g.subs.map(s=>s[0]+'='+g.n+' › '+s[1]).join(', ')+', '+g.id+'='+g.n+' (chung)'
                 : g.id+'='+g.n).join(', ');
}
function promptText(){
  return `Tôi tên NGUYEN THI THAO VY. Mỗi ngày tôi gửi ảnh chụp màn hình chi tiết giao dịch, có thể từ app BIDV hoặc từ app ví điện tử (MoMo, ZaloPay). Với mỗi ảnh trả về đúng một dòng theo định dạng sau, không viết gì thêm:

YYYY-MM-DD HH:MM | nguồn | chi hoặc thu | số tiền | nội dung | mã nhóm | số dư | mã đối tác

Quy ước:
- nguồn: ghi "bidv" nếu ảnh từ app BIDV, ghi "vi" nếu ảnh từ ví điện tử.
- số tiền và số dư: chỉ giữ chữ số, bỏ dấu phân cách và chữ VND hay đ. Số tiền lấy giá trị dương. Ảnh nào không hiện số dư thì để trống ô đó.
- chi hay thu: số màu đỏ hoặc có dấu trừ là "chi"; màu xanh hoặc có dấu cộng là "thu".
- nội dung: rút gọn thành nơi nhận hoặc mục đích dễ hiểu, bỏ số tài khoản và mã tham chiếu dài. Nếu thấy tên NGUYEN THI THAO VY trong nội dung thì bỏ tên đó đi, vì đó là tên tôi chứ không phải đối tác.
- mã đối tác: số tài khoản của người nhận hoặc người gửi, hoặc số điện thoại nếu là nạp điện thoại. Không có thì để trống.
- Nếu là chuyển tiền từ BIDV vào ví điện tử (nội dung có CASHIN hoặc tên ví), ghi mã nhóm là napvi.
- Nếu chỉ có mã QR không rõ nơi bán: nội dung ghi "Thanh toán QR", mã nhóm để trống.
- Nếu không chắc chắn nhóm nào thì để trống mã nhóm, đừng đoán bừa.

Mã nhóm chi: ${codeList('chi')}
Mã nhóm thu: ${codeList('thu')}

Cách làm việc:
- Mỗi lần tôi gửi ảnh, chỉ trả về các dòng của đúng những ảnh vừa gửi, không nhắc lại dòng cũ.
- Không chào hỏi, không giải thích, không hỏi lại.
- Nếu một ảnh mờ hoặc thiếu thông tin, thay dòng đó bằng: KHÔNG ĐỌC ĐƯỢC | lý do ngắn gọn. Tuyệt đối không đoán số.

Ví dụ:
2026-08-22 10:07 | vi | chi | 20000 | Nạp data Viettel | hd_dt |  | 0900000000
2026-09-02 14:23 | bidv | chi | 950000 | Chuyển tiền đi chơi Phước Hải | gt_dichoi | 235490 | 7170145678910`;
}
async function copyPrompt(){
  try{await navigator.clipboard.writeText(promptText());flash('Đã chép câu lệnh.','ok');}
  catch(e){flash('Trình duyệt chặn chép tự động, Vy chép tay trong ô nhé.','err');}
}

/* ==================== nhận diện ==================== */
const WALLETS=[[/momo/,'MoMo'],[/zalo ?pay/,'ZaloPay'],[/shopee ?pay/,'ShopeePay'],
  [/viettel ?pay/,'ViettelPay'],[/vnpay/,'VNPay'],[/moca/,'Moca'],[/payoo/,'Payoo']];
function walletOf(t){const s=noAccent(t.n0||t.n);
  for(const [re,name] of WALLETS) if(re.test(s)) return name; return '';}
const isQR=t=>/(^|[^a-z])v?qr([^a-z]|$)|quet ma/.test(noAccent(t.n0||t.n));
const KW=[
 ['an_cafe', /ca phe|cafe|coffee|tra sua|tra chanh|tra dao|highlands|phuc long|katinat|milano|starbucks|the coffee/],
 ['an_ngoai',/com |quan |nha hang|lau |nuong|bun |pho |hu tieu|mi cay|banh canh|banh mi|grabfood|shopeefood|beamin/],
 ['cho_mi',  /mi goi|hao hao|omachi|mi tom/],
 ['cho_vat', /an vat|snack|banh keo|keo /],
 ['cho_giavi',/gia vi|nuoc mam|dau an|bot ngot/],
 ['di_xang', /xang|petrolimex|pvoil|petro/],
 ['di_grab', /grab|be group|xanh sm|taxi|gojek|mai linh|vinasun/],
 ['di_guixe',/gui xe|giu xe|bai xe|parking/],
 ['di_suaxe',/sua xe|thay nhot|bao duong|vo xe|lop xe/],
 ['di_ve',   /ve xe|ve may bay|vexere|vietjet|bamboo|vietnam airlines|phuong trang/],
 ['hd_dt',   /nap data|nap tien dien thoai|the cao|viettel|mobifone|vinaphone|vietnamobile|nap dien thoai/],
 ['hd_ai',   /claude|chatgpt|openai|anthropic|gemini|copilot|cursor|perplexity|midjourney/],
 ['sk_thuoc',/nha thuoc|pharmacity|long chau|an khang|thuoc tay|pharmacy/],
 ['sk_kham', /benh vien|phong kham|kham benh|xet nghiem|sieu am/],
 ['sk_tpcn', /vitamin|thuc pham chuc nang|collagen|omega/],
 ['ld',      /hasaki|guardian|watsons|innisfree|the face shop|my pham|skincare|kem chong nang|sua rua mat|cat toc|lam toc|nail|spa|massage|mieng dan mun/],
 ['gt_phim', /cgv|lotte cinema|galaxy cine|beta cinema|netflix|spotify|steam|youtube premium|rap phim/],
 ['gt_dichoi',/du lich|resort|khach san|homestay|vinpearl|dam sen|suoi tien|di choi/],
 ['tk_vang', /vang |pnj|sjc|doji|mi hong/],
 ['tk_gui',  /tiet kiem/],
 ['ht_sach', /nha sach|fahasa|tiki sach|sach /],
 ['ht_khoa', /khoa hoc|hoc phi|udemy|coursera/],
 ['gd_bome', /bieu bo me|bieu me|bieu ba|gui bo me/],
 ['gd_cuoi', /mung cuoi|dam cuoi|cuoi hoi/],
 ['gd_ma',   /dam tang|phung dieu|dam ma/],
 ['gd_qua',  /qua tang|sinh nhat me|qua sinh nhat/],
 ['qa_ao',   /quan ao|ao |vay |dam |uniqlo|zara|canifa|routine/],
 ['qa_giay', /giay |dep |sneaker|bitis|vascara/],
 ['gt_ban',  /ban be|tu tap|lien hoan|nhau |sinh nhat ban/]
];
function guessCode(t){
  const s=noAccent(t.n0||t.n);
  for(const [code,re] of KW) if(re.test(s)) return code;
  return '';
}
/* Ăn uống trước 9 giờ sáng mặc định là Ăn sáng */
function refineByTime(code,tm){
  if(code==='an'&&tm&&tm<'09:00')return 'an_sang';
  return code;
}

/* ==================== đọc kết quả dán ==================== */
/* Những dòng dán vào mà không đọc được — báo cho Vy thay vì nuốt im lặng.
   Chỉ ghi lỗi THẬT; dòng trống, dòng kẻ ngang, dòng tiêu đề bảng thì bỏ qua lặng lẽ
   vì AI nào cũng hay trả kèm mấy thứ đó. */
let boQua=[];
function parsePaste(raw){
  const out=[]; let txt=String(raw).replace(/```[a-z]*|```/g,'').trim();
  const today=new Date();
  boQua=[];
  txt.split(/\r?\n/).forEach((line,i)=>{
    const hong=ly=>{boQua.push({so:i+1,ly,goc:line.trim()});};
    let s=line.trim().replace(/^\|/,'').replace(/\|$/,'').trim();
    if(!s)return;
    if(!s.includes('|')){hong('không có dấu | nào để tách cột');return;}
    const p=s.split('|').map(x=>x.trim());
    if(/^[-: ]+$/.test(p[0]))return;
    if(/ngay|ngày|date/.test(noAccent(p[0]))&&/nguon|source/.test(noAccent(p[1]||'')))return;
    if(p.length<4){hong('chỉ có '+p.length+' cột, cần ít nhất 4');return;}

    let d=null, dm=p[0].match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
    if(dm) d=dm[1]+'-'+dm[2].padStart(2,'0')+'-'+dm[3].padStart(2,'0');
    else{
      const dm2=p[0].match(/(\d{1,2})[\/.-](\d{1,2})(?:[\/.-](\d{2,4}))?/);
      if(!dm2){hong('không đọc được ngày từ "'+p[0]+'"');return;}
      let y=dm2[3]?(dm2[3].length===2?'20'+dm2[3]:dm2[3]):String(today.getFullYear());
      if(!dm2[3]&&+dm2[2]>today.getMonth()+1)y=String(today.getFullYear()-1);
      d=y+'-'+dm2[2].padStart(2,'0')+'-'+dm2[1].padStart(2,'0');
    }
    const tmm=p[0].match(/(\d{1,2}):(\d{2})/);
    const tm=tmm?tmm[1].padStart(2,'0')+':'+tmm[2]:'';
    const sr=noAccent(p[1]||'bidv');
    const s0=sr.includes('vi')||sr.includes('momo')?'vi':sr.includes('mat')||sr==='tm'?'tm':'bidv';
    const kind=noAccent(p[2]||'chi');
    let t=(kind.includes('thu')||kind.includes('vao'))?'thu':'chi';
    const a=parseAmt(p[3]); if(!a||isNaN(a)){hong('không đọc được số tiền từ "'+p[3]+'"');return;}
    const n=(p[4]||'Giao dịch').slice(0,60);
    let code=(p[5]||'').trim().toLowerCase();
    const b=p[6]?parseAmt(p[6]):NaN;
    const party=(p[7]||'').replace(/\D/g,'').slice(0,20);

    const row={d,tm,a,t,n,n0:n,s:s0,c:''};
    if(!isNaN(b)&&b)row.b=b;
    if(party)row.p=party;
    if(code==='napvi'){row.t='mv';row.s='bidv';row.s2='vi';row.c='';}
    else if(validCode(code,t))row.c=code;
    out.push(row);
  });
  return out;
}
/* Liệt kê nguyên văn dòng hỏng kèm lý do, để Vy sửa tay hoặc chép lại. */
function khoiBoQua(){
  if(!boQua.length)return '';
  return `<div class="warn" style="margin-top:0">
    <b>${boQua.length} dòng không đọc được nên đã bỏ qua</b>
    <div style="margin-top:4px">Sổ sẽ thiếu đúng những khoản này. Sửa lại rồi dán thêm, hoặc ghi tay ở dưới.</div>
    ${boQua.map(x=>`<div style="margin-top:9px;padding-top:9px;border-top:1px solid var(--warnbd)">
      <div style="font-size:12px;font-weight:600">Dòng ${x.so} — ${esc(x.ly)}</div>
      <div class="mono" style="margin-top:4px;padding:7px 9px;border-radius:8px;
        word-break:break-all;white-space:pre-wrap;background:rgba(0,0,0,.05)">${esc(x.goc)}</div>
    </div>`).join('')}
  </div>`;
}
function doPaste(){
  const raw=document.getElementById('paste').value;
  const rows=parsePaste(raw);
  if(!rows.length){flash('Chưa đọc được dòng nào. Mỗi dòng cần đủ: ngày | nguồn | chi/thu | số tiền | nội dung | nhóm | số dư | mã đối tác','err');return;}
  const seen=new Set(DB.txns.map(fid)), have=new Set(), taken=new Set();
  pending=[];
  rows.forEach(t=>{
    t.w=walletOf(t); t.q=isQR(t);
    if(t.t!=='mv'&&!t.c){
      if(t.p&&DB.rules['p:'+t.p]) t.c=DB.rules['p:'+t.p];
      else if(!t.q){
        const k=merchantKey(t.n0||t.n);
        t.c=DB.rules['k:'+k]||guessCode(t)||'';
      }
      t.c=refineByTime(t.c,t.tm);
      if(t.c&&groupOf(t.c).k!==t.t)t.c='';
    }
    const f=fid(t); if(have.has(f))return; have.add(f);
    t.dup=seen.has(f); t.keep=!t.dup;
    if(t.dup)t.warn='Đã có trong sổ, bỏ chọn sẵn';
    else{
      const old=findReplace(t,taken);
      if(old){
        t.rep={id:String(old.id),d:old.d,n:old.n,c:old.c||''};
        t.repDo=null; taken.add(String(old.id));
      }else if(t.s==='vi'&&t.t==='chi'){
        const near=DB.txns.find(x=>x.t==='chi'&&x.w&&x.a===t.a&&
          Math.abs((new Date(x.d)-new Date(t.d))/864e5)<=2);
        if(near)t.warn='Có thể trùng: đã ghi một khoản '+money(t.a)+' qua ví từ BIDV ngày '+ddmm(near.d);
      }
    }
    pending.push(t);
  });
  pending.sort((a,b)=>(b.d+' '+(b.tm||'')).localeCompare(a.d+' '+(a.tm||'')));
  msg=''; render();
}
const needCat=t=>t.keep&&((t.t!=='mv'&&!t.c)||(t.t==='mv'&&t.s2==='vi'&&!t.decided));
const needRep=t=>t.keep&&!!t.rep&&t.repDo===null;
function repYes(i){const t=pending[i];t.repDo=1;
  if(!t.c&&t.rep&&t.rep.c&&groupOf(t.rep.c).k===t.t)t.c=t.rep.c;
  render();}
function repNo(i){pending[i].repDo=0;render();}
/* khoản cố định chưa có mã mà giao dịch này trông giống nó thì gợi ý gắn */
function suggestFixed(t){
  if(!t.p||t.t!=='chi'||!t.c)return null;
  const g=groupOf(t.c).id;
  return fixedItems().find(it=>!it.mp&&groupOf(it.code).id===g
    &&it.a&&t.a>=it.a*0.3&&t.a<=it.a*1.1)||null;
}
function bindFixed(id,mp){
  DB.fixedItems=fixedItems().map(x=>x.id===id?Object.assign({},x,{mp}):x);
  save(); render();
}
function commit(){
  const add=pending.filter(t=>t.keep).map(t=>{
    const o={id:Date.now()+Math.random(),d:t.d,a:t.a,t:t.t,n:t.n,s:t.s||'bidv'};
    if(t.t==='mv')o.s2=t.s2||'vi'; else o.c=t.c;
    if(t.tm)o.tm=t.tm; if(t.b)o.b=t.b; if(t.p)o.p=t.p;
    if(t.han)o._han=t.han;
    if(t.w)o.w=t.w; if(t.q)o.q=1; if(t.sg)o.sg=t.sg; if(t.n0&&t.n0!==t.n)o.n0=t.n0;
    return o;});
  const drop=new Set(pending.filter(t=>t.keep&&t.rep&&t.repDo===1).map(t=>t.rep.id));
  if(!hoiChot(add.map(t=>t.d).concat(DB.txns.filter(x=>drop.has(String(x.id))).map(x=>x.d))))return;
  if(drop.size)DB.txns=DB.txns.filter(x=>!drop.has(String(x.id)));
  DB.txns=DB.txns.concat(add);
  add.forEach(t=>noTuGD(t,t._han)); add.forEach(t=>delete t._han);
  save();
  const nDrop=drop.size;
  pending=null; msg=''; cursor=new Date(); go('home'); autoBackup();
  if(nDrop)flash('Đã thay '+nDrop+' khoản cũ bằng khoản mới.','ok');
}

/* ==================== tính toán ==================== */
const monthTx=d=>{const k=ym(d), mk='mt'+k;
  if(mk in _memo)return _memo[mk];
  return _memo[mk]=DB.txns.filter(t=>t.d.slice(0,7)===k)};
const sum=l=>l.reduce((s,t)=>s+t.a,0);
const sumChi=l=>sum(l.filter(t=>t.t==='chi'));
const sumThu=l=>sum(l.filter(t=>t.t==='thu'));
function byGroup(list){
  const m={}; list.filter(t=>t.t==='chi').forEach(t=>{const g=groupOf(t.c).id;m[g]=(m[g]||0)+t.a;});
  return Object.entries(m).sort((a,b)=>b[1]-a[1]);
}
function bySub(list,gid){
  const m={}; list.filter(t=>t.t==='chi'&&groupOf(t.c).id===gid).forEach(t=>{m[t.c]=(m[t.c]||0)+t.a;});
  return Object.entries(m).sort((a,b)=>b[1]-a[1]);
}

/* ==================== bản đồ khối ==================== */
/* Ô lớn nhất chiếm cột trái, phần còn lại xếp chồng bên phải.
   Ô nhỏ được cấp chiều cao tối thiểu để luôn đọc và bấm được; phần trăm in trong ô
   luôn là con số thật, nên dù diện tích có xê dịch chút thì thông tin vẫn đúng. */
function layoutBlocks(items,W,H){
  if(!items.length)return [];
  if(items.length===1)return [Object.assign({},items[0],{x:0,y:0,w:W,h:H})];
  let list=items.slice().sort((a,b)=>b.v-a.v);
  /* tối đa 6 ô, thừa thì dồn vào Khác */
  if(list.length>6){
    const tailv=list.slice(5).reduce((s,x)=>s+x.v,0);
    const merged=list.slice(5);
    list=list.slice(0,5).concat([{id:'__o',name:'Khác',v:tailv,col:gcA('#8794A0'),sub:true,merged}]);
  }
  const oi=list.findIndex(x=>x.id==='__o');
  if(oi>-1&&oi<list.length-1)list.push(list.splice(oi,1)[0]);

  const total=list.reduce((s,i)=>s+i.v,0), share=list[0].v/total, rest=total-list[0].v;
  const w0=Math.round(Math.max(0.30,Math.min(0.60,share))*W);
  const out=[Object.assign({},list[0],{x:0,y:0,w:w0,h:H})];
  const tail=list.slice(1), MINH=26;
  /* chiều cao thô theo tiền, kê sàn tối thiểu rồi chuẩn hóa lại cho vừa khung */
  let raw=tail.map(it=>Math.max(MINH,rest?it.v/rest*H:H/tail.length));
  const sumRaw=raw.reduce((a,b)=>a+b,0);
  raw=raw.map(r=>r/sumRaw*H);
  let y=0;
  tail.forEach((it,i)=>{
    const hh=i===tail.length-1?H-y:Math.round(raw[i]);
    out.push(Object.assign({},it,{x:w0,y,w:W-w0,h:hh})); y+=hh;
  });
  return out;
}
/* nền tối: nét và thanh nhỏ sáng lên cho rực, mảng lớn trầm xuống cho đỡ chói */
let DARK=false;
function sysDark(){try{return window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches;}catch(e){return false;}}
function applyTheme(){
  const m=(DB.opts&&DB.opts.theme)||'auto';
  DARK=m==='dark'?true:m==='light'?false:sysDark();
  try{document.documentElement.setAttribute('data-theme',DARK?'dark':'light');}catch(e){}
  try{const tc=document.getElementById('themeColorMeta');if(tc)tc.setAttribute('content',DARK?'#0C1330':'#F3F6FB');}catch(e){}
}
function setTheme(v){DB.opts=Object.assign({},DB.opts,{theme:v});save();applyTheme();render();}
function mixc(hex,to,k){
  const a=parseInt(hex.slice(1),16), b=parseInt(to.slice(1),16);
  const r=Math.round((((a>>16)&255)*(1-k)+((b>>16)&255)*k));
  const g=Math.round((((a>>8)&255)*(1-k)+((b>>8)&255)*k));
  const c=Math.round(((a&255)*(1-k)+(b&255)*k));
  return '#'+((1<<24)+(r<<16)+(g<<8)+c).toString(16).slice(1);
}
const gcA=h=>DARK&&h[0]==='#'?mixc(h,'#FFFFFF',0.16):h;
const gcF=h=>DARK&&h[0]==='#'?mixc(h,'#0C1330',0.20):h;
function shade(hex,k){
  const n=parseInt(hex.slice(1),16);
  const r=Math.round(((n>>16)&255)*(1-k)+255*k), g=Math.round(((n>>8)&255)*(1-k)+255*k), b=Math.round((n&255)*(1-k)+255*k);
  return '#'+((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1);
}
function treemap(list,chi){
  const W=350,H=178,G=3;
  let items,back='',crumb='';
  if(open.zoom==='__o'){
    const gs=byGroup(list).filter(([id,v])=>v/chi<0.03);
    const tot=gs.reduce((s,x)=>s+x[1],0);
    items=gs.map(([id,v])=>({id,name:groupOf(id).sn||groupOf(id).n,v,col:gcA(groupOf(id).c),
      pc:Math.max(1,Math.round(v/chi*100)),sub:false}));
    crumb='Các nhóm nhỏ';
  }else if(open.zoom){
    const g=groupOf(open.zoom), subs=bySub(list,open.zoom);
    items=subs.map(([code,v],i)=>({id:code,name:code===open.zoom?'chưa phân chi tiết':labelOf(code),
      v,col:gcA(shade(g.c,i*0.17)),sub:false}));
    crumb=g.n;
  }else{
    const gs=byGroup(list); let big=[],nho=0;
    gs.forEach(([id,v])=>{ if(v/chi>=0.03)big.push({id,name:groupOf(id).sn||groupOf(id).n,v,
      col:gcA(groupOf(id).c),sub:groupOf(id).subs.length>0}); else nho+=v; });
    if(nho>0)big.push({id:'__o',name:'Khác',v:nho,col:gcA('#8794A0'),sub:true});
    items=big;
  }
  if(!items.length)return '';
  if(crumb)back=`<div class="stack-note" style="margin-bottom:8px"><span><button style="background:none;border:0;padding:0;color:var(--jade);font-weight:600;font-size:12.5px" onclick="zoomOut()">‹ tất cả nhóm</button> · ${esc(crumb)}</span></div>`;
  const boxes=layoutBlocks(items,W,H);
  let sv='';
  boxes.forEach(b=>{
    b.pc=Math.max(1,Math.round(b.v/chi*100));
    const w=Math.max(0,b.w-G), h=Math.max(0,b.h-G);
    /* ô có cấp 2 thì mở ra, ô còn lại nhảy sang danh sách giao dịch */
    const act=b.id==='__o'?`zoomIn('__o')`:`pickTx('${b.id}')`;
    sv+=`<g style="cursor:pointer" onclick="${act}">
      <rect x="${b.x.toFixed(1)}" y="${b.y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" rx="4" fill="${gcF(b.col)}"></rect>`;
    if(w>=64&&h>=52){
      sv+=`<text x="${(b.x+11).toFixed(1)}" y="${(b.y+24).toFixed(1)}" font-size="13" fill="#fff">${esc(b.name)}</text>
        <text x="${(b.x+11).toFixed(1)}" y="${(b.y+45).toFixed(1)}" font-size="18" font-weight="600" fill="#fff">${b.pc}%</text>`;
      if(h>=70)sv+=`<text x="${(b.x+11).toFixed(1)}" y="${(b.y+63).toFixed(1)}" font-size="11.5" fill="#ffffffcc">${money(b.v)}</text>`;
      if(!open.zoom&&b.sub&&h>=88)sv+=`<text x="${(b.x+11).toFixed(1)}" y="${(b.y+81).toFixed(1)}" font-size="10.5" fill="#ffffffaa">chạm để xem chi tiết</text>`;
    }else if(w>=56&&h>=32){
      sv+=`<text x="${(b.x+9).toFixed(1)}" y="${(b.y+17).toFixed(1)}" font-size="11" fill="#fff">${esc(b.name)}</text>
        <text x="${(b.x+9).toFixed(1)}" y="${(b.y+32).toFixed(1)}" font-size="13" font-weight="600" fill="#fff">${b.pc}%</text>`;
    }else if(w>=46&&h>=18){
      sv+=`<text x="${(b.x+7).toFixed(1)}" y="${(b.y+14).toFixed(1)}" font-size="11" fill="#fff">${esc(b.name)} ${b.pc}%</text>`;
    }
    sv+=`</g>`;
  });
  return back+`<svg viewBox="0 0 ${W} ${H}" width="100%" style="display:block" role="img">
    <title>Cơ cấu chi tiêu theo nhóm</title>${sv}</svg>`;
}
/* ==================== chia một giao dịch thành nhiều mục ==================== */
let splitting=null;
function splitStart(mode,ref){
  const t=mode==='pending'?pending[ref]:DB.txns.find(x=>String(x.id)===ref);
  if(!t)return;
  const g=groupOf(t.c);
  if(!g.id){flash('Chọn nhóm trước đã.','err');return;}
  if(!g.subs.length){flash('Nhóm '+g.n+' không có mục chi tiết để chia.','err');return;}
  splitting={mode,ref,gid:g.id,total:t.a,name:t.n,
    rows:g.subs.map(([code,name])=>({code,name,on:code===t.c,a:0}))};
  if(!splitting.rows.some(r=>r.on))splitting.rows[0].on=true;
  splitEven(); render();
}
function splitEven(){
  const on=splitting.rows.filter(r=>r.on); if(!on.length)return;
  const base=Math.floor(splitting.total/on.length/1000)*1000;
  on.forEach((r,i)=>r.a=i===on.length-1?splitting.total-base*(on.length-1):base);
  splitting.rows.filter(r=>!r.on).forEach(r=>r.a=0);
}
function splitToggle(i){const r=splitting.rows[i];r.on=!r.on;splitEven();render();}
function splitSet(i,v){const n=parseAmt(v);splitting.rows[i].a=isNaN(n)?0:n;render();}
function splitCancel(){splitting=null;render();}
function splitSave(){
  const on=splitting.rows.filter(r=>r.on&&r.a>0);
  const sum=on.reduce((s,r)=>s+r.a,0);
  if(on.length<2){flash('Cần ít nhất hai mục có số tiền.','err');return;}
  if(sum!==splitting.total){flash('Tổng các mục là '+money(sum)+', phải bằng '+money(splitting.total)+'.','err');return;}
  if(splitting.mode==='pending'){
    const t=pending[splitting.ref];
    const sg='s'+Date.now();
    const parts=on.map(r=>Object.assign({},t,{c:r.code,a:r.a,split:1,sg}));
    pending.splice(splitting.ref,1,...parts);
  }else{
    const t=DB.txns.find(x=>String(x.id)===splitting.ref);
    const sg=t.sg||('s'+Date.now());
    const parts=on.map(r=>Object.assign({},t,{c:r.code,a:r.a,id:Date.now()+Math.random(),split:1,sg}));
    DB.txns=DB.txns.filter(x=>String(x.id)!==splitting.ref).concat(parts);
    save();
  }
  splitting=null; flash('Đã chia thành '+on.length+' mục.','ok');
}
function vSplit(){
  const on=splitting.rows.filter(r=>r.on), sum=on.reduce((s,r)=>s+r.a,0), left=splitting.total-sum;
  let h=`<h2>Chia giao dịch</h2>
    <div class="panel"><div style="padding:13px 14px">
      <div class="src-n">${esc(splitting.name)}</div>
      <div class="src-m">${money(splitting.total)} · ${esc(groupOf(splitting.gid).n)}</div></div>`;
  splitting.rows.forEach((r,i)=>{
    h+=`<div class="rev">
      <button class="chk ${r.on?'on':''}" onclick="splitToggle(${i})" aria-label="Chọn mục">${r.on?'✓':''}</button>
      <div class="tx-body"><div class="tx-n">${esc(r.name)}</div>
        ${r.on?`<input class="rename" inputmode="text" value="${r.a?money(r.a):''}" placeholder="0" onchange="splitSet(${i},this.value)">`:''}</div>
      </div>`;
  });
  h+=`</div><div class="sp"></div>
    <div class="${left===0?'ok':'err'}">${left===0?'Tổng khớp '+money(splitting.total)+'.'
      :left>0?'Còn thiếu '+money(left)+' chưa phân.':'Thừa '+money(-left)+' so với số tiền giao dịch.'}</div>
    <div class="sp"></div>
    <button class="btn" ${left===0&&on.length>1?'':'disabled'} onclick="splitSave()">Lưu ${on.length} mục</button>
    <div class="sp"></div><button class="btn ghost" onclick="splitEven();render()">Chia đều lại</button>
    <div class="sp"></div><button class="btn ghost" onclick="splitCancel()">Hủy</button>`;
  return h;
}

/* ==================== chỉ số tài chính ==================== */
const isFixed=gid=>fixedInGroup(gid)>0;
/* Nhịp tiêu: chỉ đo phần Vy chủ động điều chỉnh được.
   Mẫu số = tổng hạn mức linh hoạt trừ Tiết kiệm.
   Tử số  = chi thực tế cùng phạm vi, bỏ giao dịch đã khớp khoản cố định. */
/* ---------- thanh khoan kha dung ---------- */
function thanhKhoan(d){
  d=d||cursor;
  const mk="tk2"+ym(d); if(mk in _memo)return _memo[mk];
  const b=balances(), tien=(b.bidv||0)+(b.vi||0)+(b.tm||0);
  const pp=payPeriods(d), mt=metrics(d);
  const luongChuaVe=Math.max(0,pp.duKien-mt.thu);
  const dd=debtDue(d), noConPhai=dd.rows.reduce((s,r)=>s+r.conPhai,0);
  const gids={}; fixedItems().forEach(it=>{gids[groupOf(it.code).id]=1;});
  let cdLeft=0; Object.keys(gids).forEach(g=>{cdLeft+=fixedOfGroup(g,d).left;});
  const k=ym(d); let henTong=0, henNgay="", henCuoi="", henSo=0, treo=[];
  (DB.debts||[]).forEach(x=>{
    if(x.kind!=="cho")return;
    const i=debtInfo(x); if(i.left<=0)return;
    if(x.due&&x.due.slice(0,7)===k){henTong+=i.left; henSo++; if(!henNgay||x.due<henNgay)henNgay=x.due; if(!henCuoi||x.due>henCuoi)henCuoi=x.due;}
    else treo.push({n:x.name,a:i.left});
  });
  const A0=tien+luongChuaVe-noConPhai-cdLeft, A1=A0+henTong;
  const B=Math.max(0,bud("tk",d)-spentOf("tk",d))+goalMonthly();
  return _memo[mk]={tien,luongChuaVe,noConPhai,cdLeft,henTong,henNgay,henCuoi,henSo,treo,A0,A1,B,
    tuDo:Math.max(0,A1-B), lan:Math.max(0,B-A1)};
}
/* So du cuoi thang cua d — dung cho thang da dong so. Khong lay balances()
   vi balances() la so du HIEN TAI, thang sau co giao dich la sai ngay. */
function balAt(d){ const b=balSrcAt(d); return (b.bidv||0)+(b.vi||0)+(b.tm||0); }
/* cùng phép cộng như balAt nhưng giữ riêng từng nguồn, để xổ Số dư cuối tháng ra BIDV / Ví / Tiền mặt */
function balSrcAt(d){
  const k=ym(d), mk="bs"+k; if(mk in _memo)return _memo[mk];
  const b={bidv:+DB.opens.bidv||0, vi:+DB.opens.vi||0, tm:+DB.opens.tm||0};
  DB.txns.forEach(t=>{
    if((t.d||"").slice(0,7)>k)return;
    const s2=t.s||"bidv";
    if(t.t==="mv"){b[s2]=(b[s2]||0)-t.a; const to=t.s2||"tm"; b[to]=(b[to]||0)+t.a;}
    else if(t.t==="dc"){b[s2]=(b[s2]||0)+(t.dir==="-"?-t.a:t.a);}
    else b[s2]=(b[s2]||0)+(t.t==="thu"?t.a:-t.a);
  });
  return _memo[mk]=b;
}
/* ---------- moi dong tien that vao / ra, cong ve dung so du ---------- */
function bangTien(d){
  d=d||cursor;
  const mk="bt"+ym(d); if(mk in _memo)return _memo[mk];
  const list=monthTx(d);
  const gs=id=>sum(list.filter(x=>x.t==="thu"&&groupOf(x.c).id===id));
  const tien=balAt(d);
  let bien=0;
  list.forEach(t=>{ if(t.t==="mv")return;
    else if(t.t==="dc")bien+=(t.dir==="-"?-t.a:t.a);
    else bien+=(t.t==="thu"?t.a:-t.a); });
  const dauThang=tien-bien;
  const dc=list.filter(t=>t.t==="dc").reduce((s,t)=>s+(t.dir==="-"?-t.a:t.a),0);
  const pp=payPeriods(d), vao=[];
  const luong=gs("luong"), thuong=gs("thuong"), tkhac=gs("tkhac");
  let ke=0;
  (pp.ky||[]).forEach(k=>{ if(k.nhan){vao.push({n:"Lương kỳ "+k.i,a:k.nhan,s:"đã nhận"});ke+=k.nhan;} });
  if(luong>ke)vao.push({n:"Lương khác",a:luong-ke,s:""});
  if(thuong)vao.push({n:"Thưởng",a:thuong,s:""});
  if(tkhac)vao.push({n:"Thu khác",a:tkhac,
    s:list.filter(x=>x.t==="thu"&&groupOf(x.c).id==="tkhac").map(x=>esc(x.n)).slice(0,3).join(" · ")});
  /* Thu nợ và Đi vay KHÔNG tính vào Thực thu (Vy chốt 28/09/2026): tiền cho mượn quay về hay
     tiền mượn của người khác đều không phải tiền Vy kiếm được, để vào làm Thực thu phồng lên.
     Chúng đi sang hai dòng ròng bên dưới cùng với Cho mượn và Trả nợ cá nhân. */
  const thuno=gs("thuno"), divay=gs("divay");
  if(dc)vao.push({n:"Điều chỉnh số dư",a:dc,s:"sửa sổ cho khớp sao kê — không phải tiền mới"});
  /* Thu nhap = luong (du kien neu chua ve / thuc te neu da ve) + thuong + thu khac */
  const thuNhap=Math.max(luong+thuong+tkhac,pp.duKien);
  const tongVao=vao.reduce((s,x)=>s+x.a,0);
  const pa=pace(d), gids={};
  fixedItems().forEach(it=>{gids[groupOf(it.code).id]=1;});
  let cdThat=0;
  Object.keys(gids).forEach(g=>{const fo=fixedOfGroup(g,d);cdThat+=Math.min(fo.plan,fo.chi);});
  const ra=[];
  if(pa.daChi)ra.push({n:"Chi linh hoạt",a:pa.daChi,s:"phần trừ vào ngân sách khả dụng"});
  if(cdThat)ra.push({n:"Chi phí cố định",a:cdThat,s:fixedItems().map(i=>esc(i.name)).join(" · ")});
  /* Trả góp ở lại Thực chi — tiền mất hẳn mỗi tháng. Trả nợ cá nhân (mọi mã Trả nợ không phải
     trano_gop) ra khỏi Thực chi, đi cặp với Đi vay. Cho mượn ra khỏi Thực chi, đi cặp với Thu nợ. */
  const muon=spentOf("muon",d), tk=spentOf("tk",d);
  const traGop=sum(list.filter(x=>x.t==="chi"&&x.c==="trano_gop"));
  const traCN=spentOf("trano",d)-traGop;
  if(traGop)ra.push({n:"Trả góp",a:traGop,s:"kỳ trả góp trong tháng — tiền đi hẳn"});
  if(tk)ra.push({n:"Chuyển vào tiết kiệm",a:tk,s:"đổi chỗ để tiền, không phải tiêu mất"});
  const tongRa=ra.reduce((s,x)=>s+x.a,0);
  /* hai dòng ròng: dương = tiền ra khỏi túi, âm = tiền về túi. Luôn cộng về đúng số dư:
     đầu + Thực thu − Thực chi − cho vay ròng − trả nợ cá nhân ròng = cuối */
  const choRong=muon-thuno, vayRong=traCN-divay;
  return _memo[mk]={dauThang,vao,tongVao,ra,tongRa,thuNhap,tien,
    tieuThat:pa.daChi+cdThat, traGop, muon, thuno, traCN, divay, choRong, vayRong,
    cuoi:dauThang+tongVao-tongRa-choRong-vayRong};
}
/* ---------- nut xo: doi cach xem thi KHONG ve lai ca trang (diem 6) ----------
   Trang thai giu trong XO nen lan ve lai sau (doi thang, ghi giao dich) cac khoi
   tro ve dung cho Vy dang mo. */
var XO={};
/* Bon nut xo moi dung CHUNG duong cong va cach tinh thoi luong voi toggle(). */
function xoTog(bt){
  var box=bt.parentNode, bd=box.querySelector(".xo-bd"), k=box.getAttribute("data-k");
  var mo=box.getAttribute("data-open")==="1";
  var h=mo?bd.scrollHeight:0, xong=false;
  xoBat();
  if(mo){
    var d=Math.round(XODUR(h)*0.82);
    bd.style.willChange="height";
    bd.style.transition="none"; bd.style.height=h+"px";
    bd.getBoundingClientRect();
    box.setAttribute("data-open","0"); bt.setAttribute("aria-expanded","false"); XO[k]=0;
    bd.style.transition="height "+d+"ms "+XOVAO;
    bd.style.height="0px";
    var h1=function(){ if(xong)return; xong=true;
      bd.removeEventListener("transitionend",t1); xoTat();
      bd.style.transition=""; bd.style.willChange=""; };
    var t1=function(e){ if(e.propertyName==="height")h1(); };
    bd.addEventListener("transitionend",t1); setTimeout(h1,d+140);
  }else{
    box.setAttribute("data-open","1"); bt.setAttribute("aria-expanded","true"); XO[k]=1;
    bd.style.transition="none"; bd.style.height="auto";
    var hh=bd.scrollHeight, du=XODUR(hh);
    bd.style.height="0px"; bd.style.willChange="height";
    bd.getBoundingClientRect();
    bd.style.transition="height "+du+"ms "+XORA;
    bd.style.height=hh+"px";
    var h2=function(){ if(xong)return; xong=true;
      bd.removeEventListener("transitionend",t2); xoTat();
      bd.style.height="auto"; bd.style.transition=""; bd.style.willChange=""; };
    var t2=function(e){ if(e.propertyName==="height")h2(); };
    bd.addEventListener("transitionend",t2); setTimeout(h2,du+140);
  }
}
const XOCH='<span class="xo-ch"><svg width="9" height="13" viewBox="0 0 10 14" fill="none">'
  +'<path d="M2 1.5 L8 7 L2 12.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>';
function xoBox(k,t,c,v,vc,vs,inner){
  var op=XO[k]?1:0;
  return '<div class="xo" data-k="'+k+'" data-open="'+op+'">'
    +'<button class="xo-bt" onclick="xoTog(this)" aria-expanded="'+(op?"true":"false")+'">'+XOCH
    +'<span class="xo-mid"><span class="xo-t">'+t+'</span>'
      +(c?'<span class="xo-c">'+c+'</span>':'')+'</span>'
    +'<span class="xo-v '+(vc||"")+'">'+v
      +(vs?'<small class="'+(vs[1]||"")+'">'+vs[0]+'</small>':'')+'</span></button>'
    +'<div class="xo-bd"><div class="xo-in"><div class="xo-nest">'+inner+'</div></div></div></div>';
}
function xoSub(l,c,v,vc){return '<div class="xo-sub"><div class="l">'+l
  +(c?'<div class="c">'+c+'</div>':'')+'</div><div class="n '+(vc||"")+'">'+v+'</div></div>';}
function xoTt(l,v,vc){return '<div class="xo-sub tt"><div class="l">'+l
  +'</div><div class="n '+(vc||"")+'">'+v+'</div></div>';}
const xoTS=(a,b2)=>money(a)+' <span class="xo-mau">/ '+money(b2)+'</span>';
/* ---------- Bảng tính có KÝ HIỆU (Vy duyệt 28/09/2026) ----------
   Không ghi "số nào + số nào" nữa: mỗi dòng mang một ký hiệu (1), (2)… và dòng tổng ghi
   công thức bằng ký hiệu. Dòng con liệt kê thẳng bên dưới, không phải bấm mới thấy.
   (4) Tiền đang cho vay = cho mượn − thu nợ · (5) Trả nợ = trả nợ cá nhân − đi vay.
   Hai dòng này mang dấu: âm là tiền về túi nhiều hơn ra. Trả góp nằm trong (3) Thực chi. */
const soAm=v=>v<0?'−'+money(-v):money(v);
/* tên và chú thích mỗi cái là MỘT khối không bẻ đôi (ct-t, ct-f nowrap): thiếu chỗ thì cả khối
   xuống dòng, không để một chữ lẻ loi ở dòng dưới (Vy 28/09) */
function ctN(sy,ten,f){return '<span class="ct-n">'+(sy?'<span class="ct-sy">'+sy+'</span>':'')
  +'<span class="ct-t">'+ten+'</span>'+(f?' <span class="ct-f">'+f+'</span>':'')+'</span>';}
function ctR(sy,ten,v,f){return '<div class="ct-r">'+ctN(sy,ten,f)+'<b>'+soAm(v)+'</b></div>';}
function ctS(ten,v){return '<div class="ct-r sub"><span>'+ten+'</span><b>'+soAm(v)+'</b></div>';}
function ctT(ten,f,giaTri){return '<div class="ct-r tot">'+ctN('',ten,f)+giaTri+'</div>';}
/* dòng có khoản con: bấm để xổ, CÙNG cơ chế chuyển động xoTog() với các nút xổ cũ.
   Đóng lại vẫn đọc được ký hiệu, tên, chú thích và số. */
function ctX(k,sy,ten,v,f,con){
  if(!con)return ctR(sy,ten,v,f);
  var op=XO[k]?1:0;
  return '<div class="xo ct-xo" data-k="'+k+'" data-open="'+op+'">'
    +'<button class="xo-bt ct-bt" onclick="xoTog(this)" aria-expanded="'+(op?'true':'false')+'">'+XOCH
    +ctN(sy,ten,f)+'<b>'+soAm(v)+'</b></button>'
    +'<div class="xo-bd"><div class="xo-in ct-in">'+con+'</div></div></div>';
}
const CT_SODU='(1) + (2) − (3) − (4) − (5)';
/* dòng (1)…(5), dùng chung cho tháng đang chạy và tháng đã đóng sổ */
function bangSoDu(t,thang){
  var x=ctR(1,'Số dư đầu '+thang,t.dauThang), c;
  x+=ctX('ct2',2,'Thực thu',t.tongVao,'',t.vao.map(function(v){return ctS(esc(v.n),v.a);}).join(''));
  x+=ctX('ct3',3,'Thực chi',t.tongRa,'',t.ra.map(function(v){return ctS(esc(v.n),v.a);}).join(''));
  c=(t.muon?ctS('Cho mượn',t.muon):'')+(t.thuno?ctS('Thu nợ',-t.thuno):'');
  x+=ctX('ct4',4,'Tiền đang cho vay',t.choRong,'cho mượn − thu nợ',c);
  c=(t.traCN?ctS('Trả nợ cá nhân',t.traCN):'')+(t.divay?ctS('Đi vay',-t.divay):'');
  x+=ctX('ct5',5,'Trả nợ',t.vayRong,'trả nợ − đi vay',c);
  return x;
}
/* ---------- khoi dau cua Tong ket thang da dong so ----------
   Cùng bảng (1)…(5) như Tổng quan tháng; dòng cuối là Số dư cuối tháng, xổ ra từng nguồn.
   Số cuối lấy balAt() nên đúng cả khi tháng sau đã có giao dịch. */
function khoiTongKet(){
  var t=bangTien(cursor), thang=MONTH(cursor.getMonth()).toLowerCase();
  var x='<div class="panel">'+bangSoDu(t,thang);
  /* Số dư cuối tháng = chính là phần giữ lại được của tháng đã đóng (Vy chốt 28/09/2026).
     Xổ ra từng nguồn; cộng các nguồn phải ra đúng số đầu dòng. */
  var bs=balSrcAt(cursor), ch=(DB.chot||{})[ym(cursor)];
  x+='<div class="xo-cuoi">'+xoBox("tkcuoi","Số dư cuối "+thang,
    (ch?'đã chốt · khớp BIDV, Ví, Tiền mặt':CT_SODU),
    money(t.cuoi),t.cuoi<0?"neg":"pos",null,
    SRC.map(function(s){return xoSub(s.n,"",money(bs[s.id]||0),(bs[s.id]||0)<0?"neg":"");}).join("")
    +xoTt("Cộng ba nguồn",money(t.cuoi)))+'</div>';
  /* chốt rồi mà sau đó có sửa: luôn cho thấy số đã chốt và số hiện tại lệch nhau bao nhiêu */
  if(ch&&Math.round(ch.tong)!==Math.round(t.cuoi))
    x+='<div class="chot-sua">Đã chốt '+money(ch.tong)+' · sau đó sửa, nay '+money(t.cuoi)
      +' · lệch '+(t.cuoi<ch.tong?'−':'+')+money(Math.abs(t.cuoi-ch.tong))+'</div>';
  return x+'</div>';
}
/* ---------- bảng "Cách tính" dưới thẻ Tổng ngân sách khả dụng ----------
   Hạn mức linh hoạt KHÔNG còn ở đây — nó nằm một chỗ duy nhất trong thẻ (Vy 28/09). */
function paceWhy2(pa){
  var t=bangTien(cursor), q=thanhKhoan(cursor), thang=MONTH(cursor.getMonth()).toLowerCase();
  var dm=function(s){return s?s.slice(8,10)+"/"+s.slice(5,7):"";};
  var x='<div class="panel ct" style="border-radius:0 0 var(--r) var(--r);border-top:0">';
  x+='<div class="daygroup dg-neu">TỔNG QUAN THÁNG NÀY</div>'+bangSoDu(t,thang);
  x+=ctT('Số dư hiện tại',CT_SODU+(Math.round(t.cuoi)===Math.round(t.tien)?' · khớp sao kê':' · CHƯA khớp sao kê'),
    '<b class="'+(t.cuoi<0?'am':'duong')+'">'+money(t.cuoi)+'</b>');
  /* KẾT QUẢ dừng ở "Số tiền còn lại được dùng để chi" (Vy 28/09) — phần cần để dành đã nằm trên thẻ.
     Dòng bằng 0 của Lương chưa về thì ẩn; ký hiệu đánh số theo đúng những dòng đang hiện. */
  x+='<div class="daygroup dg-kq">KẾT QUẢ</div>';
  var so=6, cong=[], tru=[], hen='';
  if(q.luongChuaVe){x+=ctR(so,'Lương chưa về',q.luongChuaVe);cong.push('('+so+')');so++;}
  x+=ctR(so,'Nợ, cố định chưa trả',q.noConPhai+q.cdLeft);tru.push('('+so+')');so++;
  if(q.henTong){x+=ctR(so,'Thu nợ đã hẹn',q.henTong,q.henNgay?'gần nhất '+dm(q.henNgay):'');hen='('+so+')';}
  var f='số dư'+cong.map(function(s){return ' + '+s;}).join('')+tru.map(function(s){return ' − '+s;}).join('')
    +(hen?' · sau khi thu + '+hen:'');
  /* hiện tại và sau khi thu đặt CẠNH NHAU, hai màu khác nhau (Vy 28/09) */
  x+=ctT('Số tiền còn lại được dùng để chi',f,q.henTong
    ?'<span class="ct-hai"><b class="'+(q.A0<0?'am':'duong')+'">'+money(q.A0)+'</b> <i>→</i> <b class="sau">'+money(q.A1)+'</b></span>'
    :'<b class="'+(q.A1<0?'am':'duong')+'">'+money(q.A1)+'</b>');
  return x+'</div>';
}
/* Hạn mức linh hoạt — MỘT chỗ duy nhất, trong thẻ Tổng ngân sách khả dụng.
   Chỉ phần linh hoạt: bỏ khoản cố định khỏi cả tử lẫn mẫu, như Hạn mức cần chú ý. */
function hmLinhHoat(pa){
  var rows='', sB=0, sV=0;
  pa.bd.gr.forEach(function(g){
    var fo=fixedOfGroup(g.id,cursor);
    var bLh=avail(g.id,cursor)-fo.plan;
    var vLh=Math.max(0,spentOf(g.id,cursor)-Math.min(fo.chi,fo.plan));
    sB+=bLh; sV+=vLh;
    if(!bLh&&!vLh)return;
    var d2=vLh-bLh;
    rows+='<div class="kd-g"><span>'+esc(g.n)+'<small class="'+(d2>0?'am':d2<0?'duong':'')+'">'
      +(d2>0?'vượt '+money(d2):d2<0?'còn '+money(-d2):'đã hết')
      +(g.o?' · bù '+(g.o>0?'sang +':'đi ')+money(Math.abs(g.o)):'')+'</small></span>'
      +'<span class="fc-so"><b>'+money(vLh)+'</b> <span>/ '+money(bLh)+'</span></span></div>';
  });
  var vuot=sV-sB;
  rows+='<div class="kd-g tt"><span>Cộng lại<small class="'+(vuot>0?'am':'duong')+'">'
    +(vuot>0?'vượt ':'còn ')+money(Math.abs(vuot))+'</small></span>'
    +'<span class="fc-so"><b>'+money(sV)+'</b> <span>/ '+money(sB)+'</span></span></div>';
  if(pa.bd.khongHM.length){
    rows+='<div class="kd-g0">Đã tiêu mà chưa đặt hạn mức</div>';
    pa.bd.khongHM.forEach(function(k){rows+='<div class="kd-g"><span>'+esc(k.n)+'</span><span class="fc-so"><b>'+money(k.a)+'</b></span></div>';});
  }
  return {sB:sB, sV:sV, vuot:vuot, html:'<div class="kd-hmx">'+rows+'</div>'};
}
function pace(d){
  d=d||cursor;
  const mk='pace'+ym(d); if(mk in _memo)return _memo[mk];
  /* mẫu số: hạn mức linh hoạt, trừ Tiết kiệm, trừ Cho mượn; cộng phần tích lũy đã rút */
  const NGOAI={tk:1,trano:1,muon:1};
  let duTru=0; const gr=[];
  FLEX().forEach(g=>{ if(NGOAI[g.id])return;
    const b=bud(g.id,d), o=offsetNet(g.id,d), dr=drawn(g.id,d), tot=b+o+dr;
    duTru+=tot; if(b||tot)gr.push({id:g.id,n:g.n,b,o,dr,tot});
  });
  const skip=fixedTxIds(d);
  /* tách chi của tháng làm ba rổ, để bảng giải thích nói được số nào trừ số nào */
  const all=monthTx(d).filter(t=>t.t==='chi');
  const fx=[], spent={}, ngoai={tk:0,muon:0,trano:0};
  let daChi=0, chiTong=0, coDinh=0;
  all.forEach(t=>{
    chiTong+=t.a;
    const gid=groupOf(t.c).id;
    if(skip[t.id]){fx.push({t,it:skip[t.id]});coDinh+=t.a;return;}
    if(NGOAI[gid]){ngoai[gid]+=t.a;return;}
    daChi+=t.a; spent[gid]=(spent[gid]||0)+t.a;
  });
  const khongHM=Object.keys(spent).filter(gid=>!bud(gid,d)&&!drawn(gid,d))
    .map(gid=>({id:gid,n:groupOf(gid).n,a:spent[gid]})).sort((x,y)=>y.a-x.a);
  const now=new Date(), nd=daysIn(d), cur=ym(d)===ym(now);
  const qua=cur?now.getDate():nd, conLai=Math.max(0,nd-qua);
  /* ngayCon TÍNH CẢ HÔM NAY: tiền còn lại phải nuôi nốt hôm nay lẫn các ngày sau.
     Ngày cuối tháng = 1, nên không cần nhánh riêng "còn 0 ngày" nữa. */
  const ngayCon=cur?nd-qua+1:0;
  return _memo[mk]={duTru,daChi,nd,qua,conLai,ngayCon,choMuon:ngoai.muon,
    bd:{gr,chiTong,fx,coDinh,ngoai,khongHM},
    tyChi:duTru?daChi/duTru:0, tyNgay:qua/nd,
    /* Định mức ngày: KẾ HOẠCH, cố định cả tháng. Thực tế được tiêu thì tính từ tiền thật
       ở thanhKhoan() (tiêu tự do ÷ ngayCon), không từ hạn mức — Vy duyệt 28/09/2026. */
    chuan:duTru/nd};
}
function metrics(d){
  const list=monthTx(d);
  const thu=sum(list.filter(t=>t.t==='thu'&&['luong','thuong','tkhac'].includes(groupOf(t.c).id)));
  const chi=sumChi(list);
  const tk=sum(list.filter(t=>t.t==='chi'&&groupOf(t.c).id==='tk'));
  const no=sum(list.filter(t=>t.t==='chi'&&groupOf(t.c).id==='trano'));
  const codinh=sum(list.filter(t=>t.t==='chi'&&isFixed(groupOf(t.c).id)));
  const linhhoat=Math.max(0,chi-codinh-tk);
  const base=thu||DB.income||0;
  return {thu,chi,tk,no,codinh,linhhoat,base,
    rTK:base?tk/base:0, rCD:base?codinh/base:0, rNo:base?no/base:0, rLH:base?linhhoat/base:0,
    duy:base?(base-chi)/base:0};
}
/* quỹ khẩn cấp cộng dồn: mọi khoản đã bỏ vào Tiết kiệm & đầu tư từ trước tới nay */
/* Chi trung bình một tháng, lấy tối đa 3 tháng CÓ ghi chép trong 6 tháng gần nhất.
   Sổ mới chưa có tháng nào đủ thì tạm quy đổi tháng đang chạy theo số ngày đã qua,
   còn hơn để bằng 0 rồi báo mục tiêu đã đủ. */
function emergencyFund(){
  if('ef' in _memo)return _memo.ef;
  const q=sum(DB.txns.filter(t=>t.t==='chi'&&groupOf(t.c).id==='tk'));
  const chiCua=l=>sumChi(l)-sum(l.filter(t=>t.t==='chi'&&groupOf(t.c).id==='tk'));
  const now=new Date(), months=[];
  for(let i=1;i<=6&&months.length<3;i++){
    const d=new Date(now.getFullYear(),now.getMonth()-i,1);
    const l=monthTx(d); if(!l.length)continue;
    const c=chiCua(l); if(c>0)months.push(c);
  }
  let tam=false;
  if(!months.length){
    const c=chiCua(monthTx(now)), qua=now.getDate();
    if(c>0){months.push(c/qua*daysIn(now));tam=true;}
  }
  const avg=months.length?months.reduce((a,b)=>a+b,0)/months.length:0;
  return _memo.ef={quy:q, avg, n:months.length, tam, thang:avg?q/avg:0};
}
/* Vy đặt tay thì lấy số đó, để trống thì app tự tính bằng 3 lần chi phí trung bình */
const efAuto=()=>Math.round(emergencyFund().avg*3);
const efTarget=()=>Math.max(0,DB.efTarget||0)||efAuto();
/* trung bình ba tháng gần nhất của một nhóm, không tính tháng đang xem */
function avg3(gid,d){
  const v=[];
  for(let i=1;i<=3;i++){const m=new Date(d.getFullYear(),d.getMonth()-i,1);
    v.push(sum(monthTx(m).filter(t=>t.t==='chi'&&groupOf(t.c).id===gid)));}
  const used=v.filter(x=>x>0);
  return used.length?used.reduce((a,b)=>a+b,0)/used.length:0;
}
function budgetTotals(){
  const cd=fixedTotal()+debtDue(cursor).tong;
  const tk=bud('tk',cursor);
  let lh=0; FLEX().forEach(g=>{if(g.id!=='tk')lh+=bud(g.id,cursor);});
  return {cd,tk,lh,tong:cd+tk+lh};
}

/* ==================== dự báo số dư cuối tháng (Vy duyệt 28/09/2026) ====================
   Đoán SỐ DƯ CUỐI THÁNG — đúng con số mà tháng đóng sổ kết ở đó — khởi từ A1 của thanhKhoan():
   số dư thật + lương chưa về − nợ còn phải trả − cố định chưa trả + thu nợ đã hẹn ngày.
   Dự báo 1 (tiêu đủ hạn mức): mọi nhóm linh hoạt tiêu vừa hết phần hạn mức còn lại.
   Dự báo 2 (theo đà hiện tại): khoản KHÔNG KIỂM SOÁT ĐƯỢC — Vy chọn, mặc định Ăn uống, Chợ &
   siêu thị, Xăng xe — chạy theo đà: đã tiêu ÷ số ngày đã qua × số ngày còn lại. Khoản khác chỉ
   tiêu trong phần hạn mức còn lại (hết hạn mức thì Vy thôi chi). Nhóm chỉ có vài MỤC CON không
   kiểm soát (Xăng trong Di chuyển) thì lấy số lớn hơn giữa đà của các mục đó và hạn mức còn của
   cả nhóm. Mỗi nhóm làm tròn ra đồng TRƯỚC khi cộng, để bảng chi tiết cộng khớp từng đồng.
   So với B = phần cần để dành (Tiết kiệm & Đầu tư còn phải chuyển + góp quỹ). */
const KS_MAC_DINH=['an','cho','di_xang'];
const khongKS=()=>Array.isArray((DB.opts||{}).khongKS)?DB.opts.khongKS:KS_MAC_DINH;
/* bật/tắt một nhóm hoặc mục con trong danh sách không kiểm soát được */
function togKS(code){
  const ds=khongKS().slice(), i=ds.indexOf(code), g=groupOf(code);
  if(i>=0)ds.splice(i,1);
  else{ds.push(code);
    /* bật cả nhóm thì các mục con của nó thừa — bỏ đi cho gọn */
    if(g.id===code)g.subs.forEach(s=>{const j=ds.indexOf(s[0]);if(j>=0)ds.splice(j,1);});}
  DB.opts=Object.assign({},DB.opts,{khongKS:ds}); save(); render();
}
function forecast(){
  if('fc' in _memo)return _memo.fc;
  const now=new Date(), nd=daysIn(now), passed=now.getDate(), conLai=nd-passed;
  const q=thanhKhoan(now), ks=khongKS(), l=monthTx(now);
  const r1=[], r2=[]; let t1=0, t2=0;
  GROUPS.filter(g=>g.k==='chi'&&!['tk','muon','trano'].includes(g.id)).forEach(g=>{
    const a=avail(g.id,now), v=spentOf(g.id,now), fo=fixedOfGroup(g.id,now);
    const vLh=Math.max(0,v-Math.min(fo.chi,fo.plan));        /* phần linh hoạt đã tiêu */
    const conHM=Math.max(0,a-fo.plan-vLh);                      /* hạn mức linh hoạt còn lại */
    let x2=conHM, cach='hm', da=0;
    if(ks.includes(g.id)){da=vLh; x2=Math.round(vLh/passed*conLai); cach='da';}
    else{
      const subs=g.subs.map(s=>s[0]).filter(c=>ks.includes(c));
      if(subs.length){da=sum(l.filter(t=>t.t==='chi'&&subs.includes(t.c)));
        const theoDa=Math.round(da/passed*conLai);
        if(theoDa>conHM){x2=theoDa;cach='da';}}
    }
    if(conHM){t1+=conHM; r1.push({id:g.id,n:g.sn||g.n,a:conHM});}
    if(x2){t2+=x2; r2.push({id:g.id,n:g.sn||g.n,a:x2,cach,da});}
  });
  return _memo.fc={A1:q.A1,B:q.B,nd,passed,conLai,duocUoc:passed>=5,
    r1,t1,du1:q.A1-t1, r2,t2,du2:q.A1-t2};
}

/* ==================== ngân sách ====================
   Thu nhập − khoản cố định − nợ phải trả tháng này = số còn lại để chia hạn mức.
   Hạn mức Vy đặt là phần LINH HOẠT; hạn mức thật của một nhóm bằng
   phần linh hoạt cộng các khoản cố định nằm trong nhóm đó. */
const fixedItems=()=>Array.isArray(DB.fixedItems)?DB.fixedItems:[];
/* một giao dịch có thuộc về khoản cố định này không */
function hitFixed(it,t){
  if(t.t!=='chi'||!it.mp)return false;
  /* phải CÙNG NHÓM với khoản cố định: một tài khoản có thể nhận cả tiền ăn lẫn tiền cho mượn
     (lỗi 26/09/2026) — khớp theo mã đối tác suông thì cho mượn bị tính thành tiền ăn */
  if(!t.c||groupOf(t.c).id!==groupOf(it.code).id)return false;
  const key=String(it.mp).trim(); if(!key)return false;
  const inP=t.p&&String(t.p).indexOf(key)>=0;
  const inN=noAccent(t.n0||t.n).indexOf(noAccent(key))>=0;
  if(!inP&&!inN)return false;
  if(it.ma&&it.a)return Math.abs(t.a-it.a)/it.a<=0.15;
  return true;
}
/* đã trả bao nhiêu trong tháng đang xem */
/* Nhận diện tự động có lúc trượt (giao dịch không kèm mã, số tiền tháng này khác
   kế hoạch). Cho phép tự đánh dấu "đã trả" theo từng tháng để khỏi giữ chỗ oan. */
const fxMarked=(it,d)=>!!(((DB.fxDone||{})[ym(d||cursor)]||{})[it.id]);
function toggleFxDone(id){
  const k=ym(cursor); DB.fxDone=DB.fxDone||{};
  const m=DB.fxDone[k]=DB.fxDone[k]||{};
  if(m[id])delete m[id]; else m[id]=1;
  save();
}
function fixedPaid(it,d){
  const mk='fp'+it.id+'|'+ym(d||cursor); if(mk in _memo)return _memo[mk];
  const rows=monthTx(d||cursor).filter(t=>hitFixed(it,t));
  return _memo[mk]={tien:rows.reduce((s2,t)=>s2+t.a,0), rows};
}
/* id các giao dịch đã được tính là khoản cố định, để loại khỏi phần linh hoạt.
   Gồm cả khoản CHƯA gắn mã: khớp theo số tiền xấp xỉ 15% giống fixedOfGroup,
   nếu không thì khoản đó bị đếm nhầm thành chi linh hoạt. */
function fixedTxIds(d){
  const set={}, gids={};
  fixedItems().forEach(it=>{gids[groupOf(it.code).id]=1;});
  Object.keys(gids).forEach(gid=>{
    const ids=fixedOfGroup(gid,d).ids||{};
    Object.keys(ids).forEach(k=>{set[k]=ids[k];});
  });
  return set;
}
/* Cố định trong một nhóm: kế hoạch bao nhiêu, đã trả bao nhiêu, còn phải trả bao nhiêu.
   Phần chưa trả coi như đã tiêu — nó chắc chắn sẽ ra khỏi hạn mức nhóm đó.
   Khoản chưa gắn mã nhận diện thì đoán theo số tiền xấp xỉ, để không giữ chỗ hai lần. */
function fixedOfGroup(gid,d){
  d=d||cursor;
  const mk='fog'+gid+'|'+ym(d); if(mk in _memo)return _memo[mk];
  const its=fixedItems().filter(it=>groupOf(it.code).id===gid);
  if(!its.length)return _memo[mk]={plan:0,da:0,chi:0,left:0,rows:[],ids:{}};
  const used={}, rows=[];
  its.forEach(it=>{ if(it.mp)fixedPaid(it,d).rows.forEach(t=>{used[t.id]={name:it.name,by:'ma',a:it.a||0};}); });
  let plan=0,da=0,chi=0;
  its.forEach(it=>{
    const a=it.a||0; plan+=a; let tra=0, doan=false;
    let tay=false;
    if(it.mp)tra=Math.min(a,fixedPaid(it,d).tien);
    if(it.mp)chi+=fixedPaid(it,d).tien;
    if(!tra&&fxMarked(it,d)){tra=a;chi+=a;tay=true;}
    if(!tra){
      /* chưa nhận ra bằng mã (chưa gắn mã, hoặc giao dịch dán về không kèm mã)
         → dò theo số tiền xấp xỉ trong nhóm, để không giữ chỗ cho khoản đã trả */
      const hit=monthTx(d).find(t=>t.t==='chi'&&!used[t.id]&&groupOf(t.c).id===gid
        &&a&&Math.abs(t.a-a)<=a*0.15);
      if(hit){used[hit.id]={name:it.name,by:'tien',a};tra=Math.min(a,hit.a);chi+=hit.a;doan=true;}
    }
    if(a&&tra>=a*0.85)tra=a;         /* trả gần đủ thì coi như xong, khỏi giữ chỗ phần lẻ */
    da+=tra; rows.push({id:it.id,name:it.name,a,tra,mp:!!it.mp,doan,tay});
  });
  return _memo[mk]={plan,da,chi,left:Math.max(0,plan-da),rows,ids:used};
}
const fixedTotal=()=>fixedItems().reduce((s,x)=>s+(x.a||0),0);
const fixedInGroup=gid=>fixedItems().filter(x=>groupOf(x.code).id===gid).reduce((s,x)=>s+(x.a||0),0);
/* các kỳ nợ rơi vào tháng đang xem */
/* Nghĩa vụ nợ trong kỳ = phần ĐÃ TRẢ trong tháng + phần còn phải trả của tháng.
   Trả rồi không có nghĩa là tháng đó hết nghĩa vụ — tiền đã ra khỏi túi,
   nên nguồn khả dụng không được phình lên sau khi trả. */
function debtDue(d){
  const k=ym(d||cursor); const mk='dd'+k; if(mk in _memo)return _memo[mk];
  let tong=0; const rows=[];
  DB.debts.forEach(dt=>{
    if(dt.kind==='cho')return;
    const i=debtInfo(dt);
    const daTra=debtTxns(dt.id).filter(t=>t.d.slice(0,7)===k).reduce((s2,t)=>s2+t.a,0);
    const conPhai=(!i.done&&i.nextDate&&i.nextDate.slice(0,7)===k)?i.nextAmt:0;
    const a=daTra+conPhai;
    if(a<=0)return;
    tong+=a; rows.push({name:dt.name,a,d:i.nextDate||'',daTra,conPhai});
  });
  return _memo[mk]={tong,rows};
}
const FLEX=()=>GROUPS.filter(g=>g.k==='chi'&&g.id!=='trano');
/* ---- hạn mức cuốn chiếu ----
   Dư của tháng trước cộng sang, vượt thì chuyển âm. Chỉ tính 6 tháng gần nhất
   và chỉ những tháng thực sự có ghi chép, trần bằng 6 lần hạn mức tháng. */
const canRoll=gid=>!!(DB.roll&&DB.roll[gid]);
const spentOf=(gid,d)=>{const mk='sp'+gid+'|'+ym(d); if(mk in _memo)return _memo[mk];
  return _memo[mk]=sum(monthTx(d).filter(t=>t.t==='chi'&&groupOf(t.c).id===gid));};
function offsetNet(gid,d){
  const k=ym(d);
  return (DB.offsets||[]).reduce((s2,o)=>s2+(o.m===k?(o.to===gid?o.a:(o.from===gid?-o.a:0)):0),0);
}
/* ngày ghi chép đầu tiên trong sổ */
let _first=null;
function firstTxDate(){
  if(_first!==null)return _first;
  let k=''; DB.txns.forEach(t=>{if(t.d&&(!k||t.d<k))k=t.d;});
  _first=k; return k;
}
/* đã từng đặt hạn mức cho nhóm này tính tới tháng đó chưa */
function budSetBy(gid,m){
  const k=ym(m), bm=DB.bm||{};
  return Object.keys(bm).some(x=>x<=k&&bm[x][gid]!==undefined);
}
/* tháng có đủ dữ liệu để mang số dư sang tháng sau: ghi chép trọn tháng
   (tháng đầu dùng app mà bắt đầu từ giữa tháng thì không tính) và đã đặt hạn mức */
function trackedMonth(gid,m){
  if(!monthTx(m).length)return false;
  const f=firstTxDate(); if(!f)return false;
  const k=ym(m), fk=f.slice(0,7);
  if(k<fk)return false;
  if(k===fk&&+f.slice(8,10)>3)return false;
  return budSetBy(gid,m);
}
function carryIn(gid,d){
  if(!canRoll(gid))return 0;
  const mk='ci'+gid+'|'+ym(d); if(mk in _memo)return _memo[mk];
  let tot=0;
  for(let i=1;i<=6;i++){
    const m=new Date(d.getFullYear(),d.getMonth()-i,1);
    if(!trackedMonth(gid,m))continue;            // tháng chưa theo dõi đủ thì bỏ qua
    tot+=budgetOf(gid,m)+offsetNet(gid,m)-spentOf(gid,m);
  }
  const tran=budgetOf(gid,d)*6;
  return _memo[mk]=tot>tran?tran:tot;
}
/* tổng hạn mức dùng được trong tháng */
/* phần tích lũy đã chủ động rút trong tháng */
function drawn(gid,d){
  const k=ym(d);
  return (DB.draws||[]).reduce((s2,x)=>s2+(x.m===k&&x.g===gid?x.a:0),0);
}
/* dự trữ tích lũy còn lại chưa rút */
function carryLeft(gid,d){ return Math.max(0,carryIn(gid,d)-drawn(gid,d)); }
/* hạn mức dùng được: KHÔNG tự cộng tích lũy, chỉ cộng phần đã rút */
function avail(gid,d){ return budgetOf(gid,d)+offsetNet(gid,d)+drawn(gid,d); }
/* bỏ phần bù và phần rút của nhóm này trong tháng đang xem */
/* Bản tổng kết tháng đã đóng, vẽ ở Tổng quan thay cho khối nhịp chi. */
function vTongKet(){
  const s=tongKet(cursor);
  if(!s.thu&&!s.chi)return '';
  const truoc=new Date(cursor.getFullYear(),cursor.getMonth()-1,1);
  const t5=tongKet(truoc);
  const thangTruoc=MONTH(truoc.getMonth()).toLowerCase();
  const {gs,tongCan}=mucTieuThang(s.gop);
  const no=noThang(cursor);
  /* cờ so tháng trước — màu theo ý nghĩa: chi giảm là tốt, thu và để dành tăng là tốt */
  const co=(a,b,tot,nho)=>{
    if(!b)return `<div class="co" style="color:var(--ink-3)">${thangTruoc} chưa có số</div>`;
    const p=Math.round((a-b)/b*100);
    if(p===0)return `<div class="co" style="color:var(--ink-3)">bằng ${thangTruoc}</div>`;
    const hay=tot?p>0:p<0;
    return `<div class="co" style="color:${hay?'var(--pos)':'var(--amber)'}${nho?';font-size:11px':''}">${
      p>0?'▲':'▼'} ${Math.abs(p)}% so ${thangTruoc}</div>`;
  };
  const bao=(ten,duoc,ke)=>{
    if(!ke)return '';
    const du=duoc>=ke, k=duoc-ke;
    return `<div class="sp"></div><div class="${du?'ok':'warn'}">${du?'✓ ':''}${ten} đạt <b>${money(duoc)} / ${money(ke)}</b> — ${
      du?(k>0?'dôi <b>'+money(k)+'</b>':'đủ'):'thiếu <b>'+money(-k)+'</b>'}.</div>`;
  };
  const R=(t,g,v,mau)=>`<div class="src" style="padding:11px 14px"><div style="min-width:0">
    <div class="src-n" style="font-size:13.5px">${t}</div>${g}</div>
    <div class="src-a" style="font-size:14px${mau?';color:'+mau:''}">${v}</div></div>`;
  const CON=(t,v)=>`<div style="padding:9px 14px 9px 24px;border-bottom:1px solid var(--line-2);
    border-left:2px solid var(--tintbd);display:flex;justify-content:space-between;gap:10px;align-items:baseline">
    <span style="font-size:13px">${t}</span>
    <span style="font-size:13px;font-weight:600;white-space:nowrap">${v}</span></div>`;

  let h=`<h2 class="hl"><i style="background:${gcA('#47897A')}"></i><b>Tổng kết ${MONTH(cursor.getMonth()).toLowerCase()}</b><em>${
    (DB.chot||{})[ym(cursor)]?'đã chốt '+vnd(iso(new Date(DB.chot[ym(cursor)].luc))).slice(0,5):'chưa chốt sổ'}</em></h2>`
    +khoiTongKet();
  h+=bao('Góp mục tiêu tài chính',s.gop,s.gopKH);
  h+=bao('Tiết kiệm và đầu tư',s.tkCon,s.budTK);

  /* --- Tiết kiệm & Đầu tư: phần còn dư cuối cùng Vy chuyển đi, trích góp mục tiêu TRƯỚC,
     còn lại mới tới tiết kiệm riêng (vàng, gửi tiết kiệm). Tiền này đã rời BIDV / Ví / Tiền mặt
     nên KHÔNG nằm trong Số dư cuối tháng ở trên, và không cộng hai số với nhau. --- */
  h+=`<h2 class="hl"><i style="background:${gcA('#5476C4')}"></i><b>Tiết kiệm &amp; Đầu tư</b><em>${money(s.vaoTK)} / ${money(s.mucTieu)}</em></h2>
    <div class="panel">
    ${R('Đã chuyển trong '+MONTH(cursor.getMonth()).toLowerCase(),'<div class="src-m">'+(s.vaoTK?'phần còn dư cuối cùng':'chưa chuyển khoản nào')+'</div>',
      money(s.vaoTK),s.vaoTK<s.mucTieu?'var(--brick)':'var(--pos)')}
    ${CON('1 · Góp mục tiêu tài chính<span style="font-size:11px;color:var(--ink-3)"> · trích trước · kế hoạch '+money(s.gopKH)+'</span>',money(s.gop))}`;
  gs.forEach(x=>{
    h+=`<div style="padding:11px 14px 11px 24px;border-bottom:1px solid var(--line-2);border-left:2px solid var(--tintbd)">
      <div class="cat-meta"><span style="color:var(--ink);font-size:13px;font-weight:500">${esc(x.g.name)}</span>
        <span style="font-size:10.5px;padding:2px 8px;border-radius:20px;font-weight:600;white-space:nowrap;
          background:var(--${x.du?'okbg':'warnbg'});color:var(--${x.du?'pos':'warntx'})">${
          x.du?'góp đủ tháng':'thiếu '+money(x.can-x.duoc)}</span></div>
      <div class="track" style="height:6px;margin-top:7px"><i style="width:${x.pc}%;background:var(--jade)"></i></div>
      <div class="cat-meta" style="margin-top:6px"><span>${money(x.co)} / ${money(x.g.target)}</span>
        <span>${Math.round(x.pc)}%</span></div>
      <div class="cat-meta" style="margin-top:4px">
        <span>tháng này góp <b style="color:var(--ink)">${money(x.duoc)}</b> · cần ${money(x.can)}/tháng</span>
        <span style="${x.tre?'color:var(--amber);font-weight:500':''}">${x.den?'góp đến '+x.den.slice(5)+'/'+x.den.slice(0,4):'chưa ước được'}</span></div>
      ${x.g.due?`<div class="cat-meta" style="margin-top:3px"><span>Vy mong đạt ${x.g.due.slice(5)}/${x.g.due.slice(0,4)}</span></div>`:''}
      <div style="margin-top:8px"><button class="chk-btn" onclick="suaMucGop('${x.g.id}')">Sửa mức góp</button>
        ${x.tre&&x.den&&!x.g.auto?`<button class="chk-btn" style="margin-left:16px" onclick="gianHan('${x.g.id}','${x.den}')">Giãn hạn đến ${x.den.slice(5)}/${x.den.slice(0,4)}</button>`:''}</div>
    </div>`;});
  h+=CON('2 · Tiết kiệm riêng<span style="font-size:11px;color:var(--ink-3)"> · vàng, gửi tiết kiệm… — phần còn lại · hạn mức '+money(s.budTK)+'</span>',money(s.tkCon));
  s.subRows.forEach(r=>h+=CON('<span style="padding-left:12px">'+esc(r.n)+'</span><span style="font-size:11px;color:var(--ink-3)"> · tổng đã góp '+money(r.tong)+'</span>',money(r.phan)));
  h+=`</div>`;
  if(tongCan>s.gopKH&&s.gopKH)h+=`<div class="sp"></div><div class="warn">${gs.length} mục tiêu cần tổng <b>${money(tongCan)}</b> mỗi tháng mới kịp hạn, đang góp ${money(s.gopKH)} — thiếu <b>${money(tongCan-s.gopKH)}</b>. Cần giãn hạn, hạ mục tiêu, hoặc tăng mức góp.</div>`;

  /* --- khoản nợ --- */
  if(no.no.length||no.cho.length){
    const DR=(x,mau)=>{const pc=x.total?Math.min(100,x.paid/x.total*100):0;
      return `<div style="padding:12px 14px;border-bottom:1px solid var(--line-2)">
        <div class="cat-meta"><span style="color:var(--ink);font-size:13.5px;font-weight:500">${esc(x.dt.name)}</span>
          <span style="font-size:13.5px;font-weight:600;color:${x.done?'var(--pos)':'var(--ink)'}">${
            x.done?'đã xong':'còn '+money(x.left)}</span></div>
        <div class="track" style="height:6px;margin-top:8px"><i style="width:${pc}%;background:${mau}"></i></div>
        <div class="cat-meta" style="margin-top:6px"><span>${money(x.paid)} / ${money(x.total)}${
          x.dt.periods?' · kỳ '+x.kyDone+'/'+x.dt.periods:''}</span><span>${Math.round(pc)}%</span></div></div>`;};
    if(no.no.length){
      h+=`<h2 class="hl"><i style="background:${gcA('#8A7D6C')}"></i><b>Khoản nợ</b></h2>
        <div class="panel">
        ${R('Đã trả trong tháng','<div class="src-m">tổng chi nhóm Trả nợ</div>',money(no.traTrongThang))}
        ${R('Còn phải trả','<div class="src-m">'+no.no.filter(x=>!x.done).length+' khoản chưa xong</div>',money(no.tong.no),'var(--brick)')}
        </div><div class="sp"></div><div class="panel">`;
      no.no.forEach(x=>h+=DR(x,'var(--jade)'));
      h+=`</div>`;
    }
    if(no.cho.length){
      h+=`<h2 class="hl"><i style="background:${gcA('#56937F')}"></i><b>Đã cho vay</b><em>${no.cho.length} khoản</em></h2>
        <div class="panel">
        ${R('Tổng đã cho vay','',money(no.cvTong))}
        <div class="src" style="padding:11px 14px"><div><div class="src-n" style="font-size:13.5px">Đã thu về</div>
          <div class="src-m">còn phải thu ${money(no.cvTong-no.cvThu)}</div></div>
          <div style="text-align:right"><div class="src-a" style="font-size:14px;color:${no.cvThu?'var(--pos)':'var(--ink-3)'}">${money(no.cvThu)}</div>
            <div class="src-m">${Math.round(no.cvPc)}%</div></div></div>
        </div><div class="sp"></div><div class="panel">`;
      no.cho.forEach(x=>h+=DR(x,'var(--pos)'));
      h+=`</div>`;
    }
  }

  /* --- nhóm vượt hạn mức --- */
  if(s.vuot.length){
    h+=`<h2 class="hl"><i style="background:${gcA('#C0766B')}"></i><b>Nhóm vượt hạn mức</b><em>${s.vuot.length} nhóm</em></h2>
      <div class="panel">`;
    s.vuot.forEach(x=>{const qpc=Math.round(x.pc*100), trong=100/x.pc;
      h+=`<div style="padding:12px 14px;border-bottom:1px solid var(--line-2)">
        <div class="cat-meta"><span style="color:var(--ink);font-size:13.5px;font-weight:500">${esc(x.g.sn||x.g.n)}</span>
          <span style="font-size:10.5px;padding:2px 8px;border-radius:20px;font-weight:600;
            background:var(--errbg);color:var(--errtx)">${qpc}% hạn mức</span></div>
        <div class="track" style="height:7px;margin-top:8px;display:flex">
          <i style="width:${trong}%;background:${gcA(x.g.c)};opacity:.55"></i>
          <i style="width:${100-trong}%;background:var(--brick)"></i></div>
        <div class="cat-meta" style="margin-top:6px"><span>${money(x.v)} / ${money(x.b)}</span>
          <span style="color:var(--brick);font-weight:600">quá ${money(x.chenh)}</span></div>
        ${co(x.v,x.v5,false,1)}</div>`;});
    h+=`</div>`;
  }
  return h;
}
/* giãn hạn một mục tiêu tới tháng mà đà góp hiện tại đạt được */
function gianHan(id,den){
  const g=(DB.goals||[]).find(x=>x.id===id); if(!g)return;
  if(!confirm('Giãn hạn "'+g.name+'" tới '+den.slice(5)+'/'+den.slice(0,4)+'?'))return;
  g.due=den; save(); flash('Đã giãn hạn mục tiêu.','ok');
}
/* ---- Tổng kết một tháng đã đóng sổ ----
   Phần giữ lại được của tháng CHÍNH LÀ Số dư cuối tháng (balAt), vẽ ở khoiTongKet() —
   Vy chốt 28/09/2026, bỏ hẳn "để dành = thu − chi" vì nó không cộng về được số dư thật.
   Hàm này chỉ còn lo khối Tiết kiệm & Đầu tư: tiền Vy chuyển vào nhóm đó (phần dư cuối
   cùng) trích góp mục tiêu TRƯỚC, tối đa bằng mức góp kế hoạch; phần còn lại mới chia cho
   tiết kiệm riêng (vàng, gửi tiết kiệm) theo đúng tỷ lệ số đã chuyển vào từng mục. */
function tongKet(d){
  d=d||cursor;
  const mk='tket'+ym(d); if(mk in _memo)return _memo[mk];
  const l=monthTx(d);
  const thu=sum(l.filter(t=>t.t==='thu'&&['luong','thuong','tkhac'].includes(groupOf(t.c).id)));
  const chi=sumChi(l);
  const tkRows=l.filter(t=>t.t==='chi'&&groupOf(t.c).id==='tk');
  const vaoTK=sum(tkRows);
  const sub={}; tkRows.forEach(t=>{const k=labelOf(t.c);sub[k]=(sub[k]||0)+t.a;});
  const gopKH=goalMonthly(), budTK=bud('tk',d);
  const gop=Math.min(vaoTK,gopKH), tkCon=vaoTK-gop;
  /* chia tiểu mục theo đúng tỷ lệ phần còn lại, dòng cuối nhận phần dư cho khỏi lệch làm tròn */
  const ds=Object.entries(sub), ty=vaoTK?tkCon/vaoTK:0;
  let con=tkCon; const subRows=[];
  ds.forEach(([k,v],i)=>{const phan=i===ds.length-1?con:Math.round(v*ty);con-=phan;subRows.push({n:k,tong:v,phan});});
  /* nhóm vượt hạn mức trong tháng đó, kèm số tháng trước để so */
  const truoc=new Date(d.getFullYear(),d.getMonth()-1,1);
  const vuot=FLEX().filter(g=>g.id!=='tk').map(g=>{
    const b=avail(g.id,d), v=spentOf(g.id,d);
    return {g,b,v,chenh:v-b,pc:b?v/b:0,v5:spentOf(g.id,truoc)};})
    .filter(x=>x.b>0&&x.chenh>0).sort((a,b)=>b.chenh-a.chenh);
  return _memo[mk]={thu,chi,vaoTK,sub,subRows,gopKH,budTK,gop,tkCon,vuot,
    mucTieu:budTK+gopKH,soGD:l.filter(t=>t.t==='chi').length};
}
/* Mục tiêu chạy song song: mỗi mục tiêu có mức cần mỗi tháng riêng, tiền góp chia theo
   tỷ lệ mức cần nên mục tiêu nào cũng nhích. Mục tiêu không ghi hạn (Quỹ dự phòng) thì
   lấy mốc 12 tháng để có mức cần mà so. */
function mucTieuThang(gop){
  const rieng=(DB.goalPlan||{}).mode==='each';
  const gs=goalProgress().filter(x=>x.thieu>0)
    /* Vy đặt mức riêng thì lấy đúng mức đó làm mức cần; không thì suy từ hạn mong muốn */
    .map(x=>({g:x.g,co:x.co,thieu:x.thieu,
      can:rieng?gopCua(x.g):(x.canMonth||Math.round(x.thieu/12))}));
  const tongCan=gs.reduce((s,x)=>s+x.can,0);
  const hnay=iso(new Date());
  gs.forEach(x=>{
    x.duoc=tongCan?Math.round(gop*x.can/tongCan):0;
    x.du=x.duoc>=x.can;
    x.soThang=x.duoc>0?Math.ceil(x.thieu/x.duoc):null;
    x.den=x.soThang?addMonths(hnay,x.soThang).slice(0,7):'';
    x.tre=!!(x.g.due&&x.den&&x.den>x.g.due);
    x.pc=x.g.target?Math.min(100,x.co/x.g.target*100):0;
  });
  return {gs,tongCan};
}
/* thống kê khoản nợ và khoản đã cho vay của tháng */
function noThang(d){
  d=d||cursor;
  const mk='noth'+ym(d); if(mk in _memo)return _memo[mk];
  const traTrongThang=sum(monthTx(d).filter(t=>t.t==='chi'&&groupOf(t.c).id==='trano'));
  const ds=(DB.debts||[]).map(dt=>Object.assign({dt},debtInfo(dt)));
  const no=ds.filter(x=>x.dt.kind!=='cho'), cho=ds.filter(x=>x.dt.kind==='cho');
  const cvTong=cho.reduce((s,x)=>s+x.total,0), cvThu=cho.reduce((s,x)=>s+x.paid,0);
  return _memo[mk]={traTrongThang,no,cho,cvTong,cvThu,
    tong:debtTotals(),cvPc:cvTong?cvThu/cvTong*100:0};
}
/* ---- Hạn mức cần chú ý, cho Tổng quan ----
   Chỉ xét PHẦN LINH HOẠT của mỗi nhóm: bỏ khoản cố định khỏi cả tử lẫn mẫu, vì cố định
   là khoản trả một lần, để trong đó thì nhóm nào có tiền nhà cũng bị báo oan.
   Bỏ luôn Tiết kiệm, Trả nợ, Cho mượn — cùng phạm vi với nhịp tiêu.
   Bốn trạng thái: đã vượt · đã hết · sắp hết (từ 80% hạn mức) · tiêu nhanh (vượt nhịp quá 15 điểm %). */
function hanMucChuY(d){
  d=d||cursor;
  const mk='hmcy'+ym(d); if(mk in _memo)return _memo[mk];
  const NGOAI={tk:1,trano:1,muon:1};
  const nd=daysIn(d), now=new Date(), qua=ym(d)===ym(now)?now.getDate():nd, nhip=qua/nd;
  const truoc=new Date(d.getFullYear(),d.getMonth()-1,1);
  const out=[];
  FLEX().forEach(g=>{
    if(NGOAI[g.id])return;
    const fo=fixedOfGroup(g.id,d);
    const bLh=avail(g.id,d)-fo.plan;                       /* hạn mức phần linh hoạt */
    if(bLh<=0)return;                                      /* nhóm thuần cố định thì không xét */
    const vLh=Math.max(0,spentOf(g.id,d)-Math.min(fo.chi,fo.plan));
    const pc=vLh/bLh, con=bLh-vLh;
    /* So với TỔNG CẢ THÁNG TRƯỚC của chính nhóm này. Đây là tháng đang theo dõi nên
       phần lớn thời gian sẽ còn thấp hơn — chỉ báo khi đã VƯỢT, giảm thì không nhắc. */
    const nayKy=spentOf(g.id,d), truocKy=spentOf(g.id,truoc);
    const pcT=(truocKy>0&&nayKy>truocKy)?(nayKy-truocKy)/truocKy:null;
    const vuot=con<0, het=!vuot&&con===0, sapHet=con>0&&pc>=0.8, nhanh=con>0&&!sapHet&&pc>nhip+0.15;
    if(vuot||het||sapHet||nhanh)out.push({g,vLh,bLh,pc,con,xau:vuot||het,vuot,nayKy,truocKy,pcT,
      tag:vuot?'đã vượt':het?'đã hết':sapHet?'sắp hết':'tiêu nhanh'});
  });
  return _memo[mk]=out.sort((a,b)=>b.pc-a.pc);
}
/* mở tab Ngân sách, bung sẵn nhóm đầu tiên đang vượt để thấy ngay ô bù từ nhóm khác */
function buTuNhom(){
  const x=hanMucChuY(cursor).find(r=>r.xau)||hanMucChuY(cursor)[0];
  bTab='run'; open.bhm=true; if(x)open['hm_'+x.g.id]=true;
  go('budget');
}
function undoAdjust(gid){
  const k=ym(cursor);
  DB.offsets=(DB.offsets||[]).filter(x=>!(x.m===k&&(x.to===gid||x.from===gid)));
  DB.draws=(DB.draws||[]).filter(x=>!(x.m===k&&x.g===gid));
  save(); render();
}
function drawCarry(gid,a){
  DB.draws=(DB.draws||[]).concat([{m:ym(cursor),g:gid,a:Math.round(a)}]);
  save(); render();
}
/* các nhóm đang vượt hạn mức trong tháng đang xem */
function overGroups(d){
  return GROUPS.filter(g=>g.k==='chi').map(g=>{
    const a=avail(g.id,d), v=spentOf(g.id,d);
    return {g,a,v,over:v-a};
  }).filter(x=>x.over>0&&x.a>0);
}
/* các nhóm còn dư, dùng để bù */
function roomGroups(d,exclude){
  return GROUPS.filter(g=>g.k==='chi'&&g.id!==exclude&&g.id!=='tk'&&g.id!=='trano').map(g=>{
    const a=avail(g.id,d), v=spentOf(g.id,d);
    return {g,room:a-v-fixedOfGroup(g.id,d).left};
  }).filter(x=>x.room>0);
}
const gname=id=>{const g=GROUPS.find(x=>x.id===id);return g?(g.sn||g.n):id;};
/* các khoản bù của một nhóm trong tháng: nhận về và cho đi */
function offsetRows(gid,d){
  const k=ym(d||cursor), inn=[], out=[];
  (DB.offsets||[]).forEach(o=>{
    if(o.m!==k)return;
    if(o.to===gid)inn.push({g:o.from,a:o.a});
    else if(o.from===gid)out.push({g:o.to,a:o.a});
  });
  return {inn,out};
}
/* câu ngắn kê nguồn bù, quá hai nguồn thì rút gọn */
function offsetLine(list,verb){
  if(!list.length)return '';
  const tong=list.reduce((s2,x)=>s2+x.a,0);
  const ke=list.slice(0,2).map(x=>esc(gname(x.g))+' '+money(x.a)).join(' · ');
  return verb+' '+money(tong)+' — '+ke+(list.length>2?' · và '+(list.length-2)+' nhóm khác':'');
}
/* gỡ đúng một khoản bù */
function dropOffset(from,to,a){
  const k=ym(cursor), arr=(DB.offsets||[]).slice();
  const i=arr.findIndex(o=>o.m===k&&o.from===from&&o.to===to&&Math.round(o.a)===Math.round(Number(a)));
  if(i<0)return;
  arr.splice(i,1); DB.offsets=arr; save();
  flash('Đã gỡ khoản bù '+money(Number(a))+'.','ok');
}
function addOffset(from,to,a){
  DB.offsets=(DB.offsets||[]).concat([{m:ym(cursor),from,to,a}]);
  save(); render();
}
/* phần tiết kiệm thật ra đang bị các nhóm cuốn chiếu giữ chỗ */
function earmarked(d){
  return GROUPS.filter(g=>g.k==='chi'&&canRoll(g.id))
    .reduce((s2,g)=>s2+Math.max(0,carryIn(g.id,d)),0);
}
function rollTable(gid,d){
  const rows=[];
  for(let i=5;i>=1;i--){
    const m=new Date(d.getFullYear(),d.getMonth()-i,1);
    if(!monthTx(m).length)continue;
    const b=budgetOf(gid,m)+offsetNet(gid,m), v=spentOf(gid,m);
    rows.push({m,b,v,du:b-v,used:trackedMonth(gid,m)});
  }
  return rows;
}
/* hạn mức lưu riêng từng tháng; tháng chưa đặt thì thừa kế tháng gần nhất trước đó */
function bud(gid,d){
  d=d||cursor; const k=ym(d);
  if(DB.bm&&DB.bm[k]&&DB.bm[k][gid]!==undefined)return DB.bm[k][gid];
  const keys=Object.keys(DB.bm||{}).filter(x=>x<k).sort();
  for(let i=keys.length-1;i>=0;i--){const v=DB.bm[keys[i]][gid];if(v!==undefined)return v;}
  return DB.budgets[gid]||0;
}
function setBud(gid,v,d){
  const k=ym(d||cursor);
  memoClear();   /* sửa hạn mức là số cũ trong đệm hết đúng — fillSuggest() đọc lại bud() ngay sau đây */
  DB.bm=DB.bm||{}; DB.bm[k]=Object.assign({},DB.bm[k]||{});
  if(v===null)delete DB.bm[k][gid]; else DB.bm[k][gid]=v;
}
const flexTotal=(d)=>FLEX().reduce((s,g)=>s+bud(g.id,d),0);
function budgetOf(gid,d){
  if(gid==='trano')return debtDue(d||cursor).tong;
  return bud(gid,d)+fixedInGroup(gid);
}
/* Thứ tự ưu tiên: chi phí cố định → trả nợ → góp mục tiêu → chi linh hoạt →
   phần còn thừa là tiền nhàn rỗi. */
/* ==================== lương hai kỳ ====================
   Kỳ 1 thường về ngày 5–10, kỳ 2 ngày 15–25. Tính theo công nhật nên mỗi kỳ
   một khác và tổng cả tháng có thể cao hoặc thấp hơn kế hoạch. Kỳ nào đã về thì
   lấy đúng số thật; kỳ chưa về mới ước, ưu tiên trung bình kỳ đó của các tháng
   trước, không có lịch sử mới lấy phần còn thiếu so với kế hoạch.
   Cả hai kỳ đã về thì thu nhập tháng đó CHỐT bằng số thực nhận, không giữ chỗ nữa. */
const PAY=()=>Object.assign({k1:[5,10],k2:[15,25]},DB.payDays||{});
function payPeriods(d){
  d=d||cursor;
  const mk='pp'+ym(d); if(mk in _memo)return _memo[mk];
  const w=PAY(), moc=w.k2[0], l=monthTx(d);
  const luong=l.filter(t=>t.t==='thu'&&groupOf(t.c).id==='luong');
  const ngoai=sum(l.filter(t=>t.t==='thu'&&['thuong','tkhac'].includes(groupOf(t.c).id)));
  const r1=luong.filter(t=>+t.d.slice(8,10)<moc), r2=luong.filter(t=>+t.d.slice(8,10)>=moc);
  const n1=sum(r1), n2=sum(r2), kh=DB.income||0;
  const hom=ym(d)===ym(new Date())?new Date().getDate():99;
  /* trung bình kỳ này của tối đa 3 tháng có ghi chép */
  const tb=k=>{
    const v=[];
    for(let i=1;i<=6&&v.length<3;i++){
      const m=new Date(d.getFullYear(),d.getMonth()-i,1);
      if(!monthTx(m).length)continue;
      const a=sum(monthTx(m).filter(t=>t.t==='thu'&&groupOf(t.c).id==='luong'
        &&((+t.d.slice(8,10)<moc)===(k===1))));
      if(a>0)v.push(a);
    }
    return v.length?Math.round(v.reduce((x,y)=>x+y,0)/v.length):0;
  };
  const ky=[{i:1,nhan:n1,xong:r1.length>0,tu:w.k1[0],den:w.k1[1]},
            {i:2,nhan:n2,xong:r2.length>0,tu:w.k2[0],den:w.k2[1]}];
  ky.forEach(k=>{k.uoc=k.xong?0:tb(k.i); k.tre=!k.xong&&hom>k.den+3;});
  const chuaBiet=ky.filter(k=>!k.xong&&!k.uoc);
  if(chuaBiet.length){
    const daBiet=n1+n2+ngoai+ky.reduce((s2,k)=>s2+k.uoc,0);
    const con=Math.max(0,kh-daBiet);
    chuaBiet.forEach(k=>{k.uoc=Math.round(con/chuaBiet.length);});
  }
  const daNhan=n1+n2;
  return _memo[mk]={ky,daNhan,ngoai,kh,xongCa:ky.every(k=>k.xong),
    duKien:daNhan+ngoai+ky.reduce((s2,k)=>s2+k.uoc,0)};
}
function editPayDays(){
  const w=PAY();
  const v=prompt('Lương về khoảng ngày nào? Ghi hai khoảng, cách nhau dấu phẩy:',
    w.k1[0]+'-'+w.k1[1]+', '+w.k2[0]+'-'+w.k2[1]);
  if(v===null)return;
  const m=(v||'').match(/(\d+)\s*-\s*(\d+)\s*,\s*(\d+)\s*-\s*(\d+)/);
  if(!m){flash('Chưa đúng dạng, ví dụ: 5-10, 15-25','err');return;}
  const n=m.slice(1).map(Number);
  if(n.some(x=>x<1||x>31)||n[0]>n[1]||n[2]>n[3]||n[1]>=n[2]){flash('Khoảng ngày chưa hợp lý.','err');return;}
  DB.payDays={k1:[n[0],n[1]],k2:[n[2],n[3]]};
  save();flash('Đã đặt lịch lương.','ok');
}
function budgetPlan(d){
  const inc=DB.income||0, cd=fixedTotal(), no=debtDue(d||cursor).tong, gop=goalMonthly();
  const conLai=inc-cd-no-gop, daChia=flexTotal(d);
  return {inc,cd,no,gop,conLai,daChia,thua:conLai-daChia};
}
/* mẫu chia phần linh hoạt, tính theo % của số còn lại */
const MAUFLEX={an:18,cho:11,di:13,ld:10,gt:15,qa:9,sk:6,ht:9,tt:6,gdu:3};

let bTab='plan';
function setBTab(v){bTab=v;render();}

function vFixed(){
  const ed=fxEdit?fixedItems().find(x=>x.id===fxEdit):null;
  let h=`<h2>Chi phí cố định</h2>
    <div class="stack-note"><span>Khoản tháng nào cũng trả đúng một số. Gắn mã nhận diện để app tự biết đã chi chưa.</span></div>
    <div class="sp"></div>`;
  if(fixedItems().length){
    h+=`<div class="panel">`;
    fixedItems().forEach(it=>{
      const pd=fixedPaid(it,cursor), tyle=it.a?Math.min(100,Math.round(pd.tien/it.a*100)):0, xong=pd.tien>=it.a-1;
      h+=`<div style="padding:12px 14px;border-bottom:1px solid var(--line-2)">
        <div style="display:flex;justify-content:space-between;gap:10px">
          <div style="min-width:0"><div class="src-n">${esc(it.name)}</div>
            <div class="src-m">${esc(labelOf(it.code))}${it.day?' · ngày '+it.day:''}${it.mp?'':' · chưa gắn mã'}</div></div>
          <div class="src-a">${money(it.a)}</div></div>
        ${it.mp?`<div class="track" style="height:5px;margin-top:8px"><i style="width:${tyle}%;background:${xong?'var(--pos)':'var(--amber)'}"></i></div>
          <div class="cat-meta" style="margin-top:5px"><span>${xong?'đã chi đủ tháng này':'đã chi '+money(pd.tien)+' / '+money(it.a)}</span><span>${pd.rows.length} giao dịch</span></div>`:''}
        <div style="margin-top:8px"><button class="chk-btn" onclick="editFixed('${it.id}')">sửa</button>
          <button class="chk-btn" style="color:var(--brick);margin-left:14px" onclick="delFixed('${it.id}')">xóa</button></div></div>`;});
    h+=`</div><div class="sp"></div>`;
  }else h+=`<div class="empty">Chưa có khoản nào.</div><div class="sp"></div>`;
  h+=`<div class="panel">
    ${ed?`<div class="daygroup">Đang sửa: ${esc(ed.name)}</div>`:''}
    <div class="fld"><span>Tên khoản</span><input id="fxn" value="${ed?esc(ed.name):''}" placeholder="Tiền ăn gửi mẹ"></div>
    <div class="two">
      <div class="fld"><span>Số tiền</span><input id="fxa" inputmode="text" value="${ed?money(ed.a):''}" placeholder="3tr"></div>
      <div class="fld"><span>Ngày trả</span><input id="fxd" inputmode="numeric" value="${ed&&ed.day?ed.day:''}" placeholder="5"></div></div>
    <div class="fld"><span>Thuộc nhóm</span>${catBtn(fxCode||(ed?ed.code:''),'chi','fixed','0')}</div>
    <div class="fld"><span>Mã nhận diện — số tài khoản hoặc số ví</span>
      <input id="fxm" value="${ed&&ed.mp?esc(ed.mp):''}" placeholder="VD: 1234567890"></div>
    <div class="fld"><label style="display:flex;align-items:center;gap:9px;font-size:13.5px;color:var(--ink-2)">
      <button class="chk ${fxAmt?'on':''}" style="width:18px;height:18px;font-size:11px;margin:0" onclick="fxAmt=!fxAmt;render()">${fxAmt?'✓':''}</button>
      Chỉ khớp khi số tiền xấp xỉ</label></div>
  </div><div class="sp"></div>
  <button class="btn ghost" onclick="saveFixed()">${ed?'Lưu thay đổi':'Thêm khoản'}</button>
  ${ed?`<div class="sp"></div><button class="btn ghost" onclick="fxEdit=null;fxCode='';render()">Hủy sửa</button>`:''}
  <div class="sp"></div><button class="btn ghost" onclick="go('budget')">Quay lại Ngân sách</button>`;
  if(msg)h+=`<div class="${msgType==='ok'?'ok':'err'}">${esc(msg)}</div>`;
  return h;
}

function vBudget(){
  const p=budgetPlan(cursor), dd=debtDue(cursor), inc=p.inc;
  let h=`<div style="display:flex;gap:6px;margin-bottom:14px">
    ${[['plan','Lập ngân sách'],['run','Tình hình thực hiện']].map(([k,n])=>
      `<button style="flex:1;padding:9px;border-radius:8px;font-size:12.5px;border:1px solid ${bTab===k?'var(--jade)':'var(--line)'};
        background:${bTab===k?'var(--jade)':'var(--card)'};color:${bTab===k?'var(--onacc)':'var(--ink)'}" onclick="setBTab('${k}')">${n}</button>`).join('')}
  </div>`;
  return h+(bTab==='plan'?vBudPlan(p,dd,inc):vBudRun(inc));
}

function vBudPlan(p,dd,inc){
  const pc=v=>inc?Math.round(v/inc*100)+'%':'';
  let h=`<div class="panel"><div class="fld"><span>Tổng thu nhập — lấy tháng thấp nhất cho chắc</span>
    <input inputmode="text" value="${inc?money(inc):''}" placeholder="14.800.000" onchange="setIncome(this.value)"></div></div>`;
  const pp=payPeriods(cursor);
  if(inc)h+=`<div class="stack-note" style="margin-top:8px"><span>Tháng này dự kiến thực nhận <b>${money(pp.duKien)}</b>${
    pp.xongCa?' — cả hai kỳ đã về':' — '+payNote(pp)}
    <button style="background:none;border:0;padding:0 0 0 6px;color:var(--jade);font-weight:600;font-size:12.5px;text-decoration:underline" onclick="editPayDays()">lịch lương</button></span>
    <span>Hạn mức vẫn chia theo con số kế hoạch ở trên. Phần chênh giữa thực nhận và kế hoạch rơi vào tiền nhàn rỗi cuối tháng.</span></div>`;
  if(!inc)return h+`<div class="sp"></div><div class="empty"><b>Điền thu nhập trước</b>Mọi phép chia hạn mức đều dựa trên con số này.</div>`;

  h+=`<div class="sp"></div><div class="panel" style="border-left:3px solid var(--jade);padding:12px 14px">
    <div class="cat-meta"><span>Tổng thu nhập</span><span style="color:var(--ink);font-weight:500">${money(inc)}</span></div>
    <div class="cat-meta" style="margin-top:5px"><span>− Chi phí cố định (${fixedItems().length})</span><span>${money(p.cd)}</span></div>
    <div class="cat-meta" style="margin-top:5px"><span>− Nghĩa vụ nợ trong kỳ (${dd.rows.length})</span><span>${money(p.no)}</span></div>
    <div class="cat-meta" style="margin-top:5px"><span>− Góp mục tiêu tháng này
      <button style="background:none;border:0;padding:0 0 0 6px;color:var(--jade);font-weight:600;font-size:11.5px" onclick="editGoalPlan()">sửa</button></span>
      <span>${money(p.gop)}</span></div>
    ${goalProgress().filter(x=>x.thieu>0).slice(0,4).map(x=>`<div class="cat-meta" style="margin-top:3px;padding-left:10px">
      <span style="color:var(--ink-3)">${esc(x.g.name)}${x.g.due?' · hạn '+x.g.due.slice(5)+'/'+x.g.due.slice(0,4):' · chưa đặt hạn'}</span>
      <span style="color:var(--ink-3)">${x.canMonth?money(x.canMonth)+'/th':'—'}</span></div>`).join('')}
    ${dd.rows.map(r=>`<div class="cat-meta" style="margin-top:3px;padding-left:10px"><span style="color:var(--ink-3)">${esc(r.name)}${
      r.daTra?(r.conPhai?' · đã trả '+money(r.daTra)+', còn '+money(r.conPhai):' · đã trả'):''}</span>
      <span style="color:var(--ink-3)">${money(r.a)}</span></div>`).join('')}
    <div style="display:flex;justify-content:space-between;align-items:baseline;margin-top:9px;padding-top:9px;border-top:1px solid var(--line-2)">
      <span style="font-size:11.5px;font-weight:600;color:var(--ink-2)">NGUỒN KHẢ DỤNG</span>
      <span style="font-size:18px;font-weight:600${p.conLai<0?';color:var(--brick)':''}">${money(p.conLai)}</span></div>
    <div class="cat-meta" style="margin-top:6px"><span style="color:var(--ink-3)">phần này chia cho các nhóm linh hoạt, chia xong còn thừa bao nhiêu là tiền nhàn rỗi</span></div></div>`;

  const km=ym(new Date(cursor.getFullYear(),cursor.getMonth()-1,1));
  const coTruoc=!!(DB.bm&&DB.bm[km]);
  const daDat=!!(DB.bm&&DB.bm[ym(cursor)]);
  h+=`<div class="sp"></div><div style="display:flex;gap:8px">
    <button class="btn ghost" style="padding:11px" onclick="go('fixed')">Quản lý chi phí cố định</button>
    <button class="btn ghost" style="padding:11px" onclick="fillSuggest()">Phân bổ theo mẫu</button></div>
    <div class="sp"></div><div style="display:flex;gap:8px">
    ${coTruoc?`<button class="btn ghost" style="padding:11px" onclick="copyPrevBudget()">Lấy y hệt tháng ${km.slice(5)}</button>`:''}
    <button class="btn ghost" style="padding:11px;color:var(--brick)" onclick="resetBudget()">${daDat?'Đặt lại hạn mức tháng này':'Xóa hết hạn mức'}</button></div>`;

  /* dải cơ cấu chi tiêu dự kiến, không gồm tiết kiệm */
  const spend=FLEX().filter(g=>g.id!=='tk').map(g=>({g,v:bud(g.id,cursor)})).filter(x=>x.v>0).sort((a,b)=>b.v-a.v);
  const tong=spend.reduce((s2,x)=>s2+x.v,0);
  if(tong>0){
    h+=`<div style="display:flex;justify-content:space-between;align-items:baseline;margin:20px 0 8px">
      <span style="font-size:12.5px;color:var(--ink-2)">Cơ cấu chi tiêu dự kiến</span>
      <span style="font-size:11.5px;color:${p.thua===0?'var(--pos)':'var(--amber)'}">${p.thua===0?'Đã phân bổ đủ':p.thua>0?'Chưa chia '+short(p.thua):'Vượt '+short(-p.thua)}</span></div>
      <div style="display:flex;height:24px;border-radius:6px;overflow:hidden;gap:2px">`
      +spend.map(x=>{const w=x.v/tong*100;
        return `<div style="width:${w}%;background:${x.g.c};display:flex;align-items:center;justify-content:center;font-size:${w>=9?'11':'10'}px;color:#fff">${w>=7?Math.round(w)+(w>=9?'%':''):''}</div>`;}).join('')
      +`</div>
      <div class="cat-meta" style="margin-top:7px"><span>Trên ${money(tong)} dự kiến chi, chưa gồm góp mục tiêu và tiền nhàn rỗi</span>
        <span>${esc(spend[0].g.sn||spend[0].g.n)} dẫn đầu</span></div>`;
  }

  /* danh sách hạn mức, gom ba tiêu đề */
  const KHOI=[
    ['Nhóm có chi phí cố định', g=>fixedInGroup(g.id)>0],
    ['Hạn mức có thể cộng dồn', g=>fixedInGroup(g.id)===0&&canRoll(g.id)],
    ['Nhóm linh hoạt',          g=>fixedInGroup(g.id)===0&&!canRoll(g.id)]
  ];
  h+=`<div style="margin-top:18px"></div>`;
  KHOI.forEach(([ten,loc])=>{
    const gs=FLEX().filter(loc); if(!gs.length)return;
    h+=`<div class="daygroup" style="border:1px solid var(--line);border-bottom:0;border-radius:var(--r) var(--r) 0 0;margin-top:12px">${ten}</div>
      <div class="panel" style="border-radius:0 0 var(--r) var(--r)">`;
    gs.forEach(g=>{
      const fx=fixedInGroup(g.id), flex=bud(g.id,cursor);
      h+=`<div style="padding:11px 12px;border-bottom:1px solid var(--line-2)">
        <div style="display:flex;align-items:center;gap:8px">
          <span class="spine" style="background:${gcA(g.c)};height:16px"></span>
          <span style="flex:1;min-width:0;font-size:14px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(g.n)}</span>
          <button style="background:none;border:0;padding:2px 6px;border-radius:20px;font-size:10.5px;font-weight:600;
            background:${canRoll(g.id)?'var(--tintb)':'var(--greybg)'};color:${canRoll(g.id)?'var(--tinttx)':'var(--ink-3)'}"
            onclick="toggleRoll('${g.id}')">cộng dồn</button>
          <span style="font-size:11px;color:var(--ink-3);min-width:30px;text-align:right">${flex&&p.conLai>0?Math.round(flex/p.conLai*100)+'%':''}</span>
          <input inputmode="text" value="${flex?short(flex):''}" placeholder="—" onchange="setB('${g.id}',this.value)"
            style="width:96px;text-align:right;padding:7px 9px;border:1px solid var(--line);border-radius:7px;background:var(--field)"></div>
        ${fx?`<div class="cat-meta" style="margin-top:5px"><span>+ ${money(fx)} cố định = ${money(fx+flex)}</span></div>`:''}
      </div>`;
    });
    h+=`</div>`;
  });
  if(p.thua!==0)h+=`<div class="sp"></div><button class="btn ghost" onclick="balanceNow()">${p.thua>0?'Dồn '+money(p.thua)+' chưa chia vào Tiết kiệm':'Bớt '+money(-p.thua)+' khỏi Tiết kiệm'}</button>`;
  if(msg)h+=`<div class="${msgType==='ok'?'ok':'err'}">${esc(msg)}</div>`;
  return h;
}

/* chi tiết một nhóm hạn mức: hạn mức ghép từ đâu, đã chi những gì, tồn từ tháng nào */
function hmDetail(g){
  const gid=g.id, d=cursor, fxIds=fixedTxIds(d);
  const flex=bud(gid,d), fx=fixedInGroup(gid), off=offsetNet(gid,d), drw=drawn(gid,d);
  const rows=monthTx(d).filter(t=>t.t==='chi'&&groupOf(t.c).id===gid)
    .sort((a,b)=>(b.d+' '+(b.tm||'')).localeCompare(a.d+' '+(a.tm||'')));
  let x=`<div style="margin-top:9px;padding:9px 0 2px;border-top:1px dashed var(--line-2)" onclick="event.stopPropagation()">
    <div class="cat-meta" style="padding:3px 0"><span style="color:var(--ink)">Hạn mức ghép từ</span>
      <span>${money(flex)} linh hoạt${fx?' + '+money(fx)+' cố định':''}${off>0?' + '+money(off)+' bù sang':off<0?' − '+money(-off)+' bù đi':''}${drw?' + '+money(drw)+' rút từ tồn':''} = <b>${money(flex+fx+off+drw)}</b></span></div>
    <div class="cat-meta" style="padding:7px 0 3px;border-top:1px solid var(--line-2)">
      <span style="color:var(--ink)">Đã chi ${rows.length} giao dịch</span><span><b>${money(sum(rows))}</b></span></div>`;
  const fo=fixedOfGroup(gid,d);
  if(fo.plan){
    x+=`<div class="cat-meta" style="padding:5px 0"><span style="color:var(--ink)">Trong đó linh hoạt</span>
      <span>${money(Math.max(0,sum(rows)-Math.min(fo.chi,fo.plan)))} / ${money(flex+off+drw)}</span></div>`;
    x+=`<div class="cat-meta" style="padding:5px 0"><span style="color:var(--ink)">Trong đó cố định</span>
      <span>đã trả ${money(fo.da)} / ${money(fo.plan)} · còn giữ <b>${money(fo.left)}</b></span></div>`;
    fo.rows.forEach(r=>x+=`<div class="cat-meta" style="padding:3px 0 3px 10px">
      <span style="color:var(--ink-3)">${esc(r.name)}${r.tay?' · tự đánh dấu':r.doan?' · nhận ra theo số tiền':r.mp?'':' · chưa gắn mã'}</span>
      <span style="display:flex;gap:9px;align-items:center;color:var(--ink-3);white-space:nowrap">${r.tra>=r.a-1?'đã trả':r.tra?money(r.tra)+' / '+money(r.a):'chưa trả · '+money(r.a)}
        ${r.tay||r.tra<r.a-1?`<button class="chk-btn" style="color:var(--ink-3)" onclick="toggleFxDone('${r.id}')">${r.tay?'bỏ dấu':'đã trả'}</button>`:''}</span></div>`);
  }
  if(!rows.length)x+=`<div class="cat-meta" style="padding:5px 0"><span>chưa chi khoản nào trong tháng</span></div>`;
  rows.slice(0,25).forEach(t=>{
    const sub=t.c&&t.c!==gid?' · '+labelOf(t.c):'';
    x+=`<div class="cat-meta" style="padding:5px 0;border-top:1px solid var(--line-2)">
      <span style="min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${ddmm(t.d)} · ${esc(t.n)}${esc(sub)}${fxIds[t.id]?' · cố định':''}</span>
      <span style="white-space:nowrap"><b>${money(t.a)}</b></span></div>`;});
  if(rows.length>25)x+=`<div class="cat-meta" style="padding:5px 0"><span>… còn ${rows.length-25} giao dịch nữa</span></div>`;
  if(canRoll(gid)){
    const ci=carryIn(gid,d), rt=rollTable(gid,d), used=rt.filter(r=>r.used);
    x+=`<div class="cat-meta" style="padding:8px 0 3px;border-top:1px solid var(--line-2)">
      <span style="color:var(--ink)">Hạn mức tồn</span><span><b>${money(ci)}</b>${drw?' · đã rút '+money(drw):''}</span></div>`;
    if(!used.length)x+=`<div class="cat-meta" style="padding:4px 0"><span>chưa tháng nào đủ dữ liệu để cộng dồn</span></div>`;
    used.forEach(r=>x+=`<div class="cat-meta" style="padding:4px 0">
      <span>${MONTH(r.m.getMonth())}/${r.m.getFullYear()}</span>
      <span>chi ${money(r.v)} / ${money(r.b)} · <b style="color:${r.du>=0?'var(--pos)':'var(--brick)'}">${r.du>=0?'dư '+money(r.du):'vượt '+money(-r.du)}</b></span></div>`);
    rt.filter(r=>!r.used).forEach(r=>x+=`<div class="cat-meta" style="padding:4px 0">
      <span>${MONTH(r.m.getMonth())}/${r.m.getFullYear()}</span><span>không tính — chưa theo dõi đủ tháng</span></div>`);
  }
  const or=offsetRows(gid,d);
  if(or.inn.length||or.out.length){
    x+=`<div class="cat-meta" style="padding:8px 0 3px;border-top:1px solid var(--line-2)">
      <span style="color:var(--ink)">Bù trừ trong tháng</span><span>${off>0?'+'+money(off):money(off)}</span></div>`;
    or.inn.forEach(o=>x+=`<div class="cat-meta" style="padding:4px 0">
      <span style="color:var(--pos)">nhận từ ${esc(gname(o.g))}</span>
      <span style="display:flex;gap:9px;align-items:center"><b>+${money(o.a)}</b>
        <button class="chk-btn" style="color:var(--ink-3)" onclick="dropOffset('${o.g}','${gid}',${o.a})">gỡ</button></span></div>`);
    or.out.forEach(o=>x+=`<div class="cat-meta" style="padding:4px 0">
      <span style="color:var(--ink-3)">bù cho ${esc(gname(o.g))}</span>
      <span style="display:flex;gap:9px;align-items:center"><b>−${money(o.a)}</b>
        <button class="chk-btn" style="color:var(--ink-3)" onclick="dropOffset('${gid}','${o.g}',${o.a})">gỡ</button></span></div>`);
  }
  x+=`<div style="margin-top:9px"><button class="chk-btn" onclick="seeList('${gid}')">Mở nhóm này trong tab Giao dịch</button></div></div>`;
  return x;
}

function vBudRun(inc){
  const items=fixedItems();
  const fxTong=items.reduce((s2,x)=>s2+x.a,0);
  const fxDa=items.reduce((s2,x)=>s2+(fxMarked(x,cursor)?x.a:Math.min(x.a,fixedPaid(x,cursor).tien)),0);
  const fxPc=fxTong?Math.round(fxDa/fxTong*100):0;
  let h=`<div class="panel" style="margin-bottom:10px">
    <button class="fold" style="margin:0;border:0;border-left:3px solid var(--info);border-radius:var(--r)" onclick="toggle('bfx')">
      <span>Chi phí cố định</span>
      <span style="display:flex;align-items:center;gap:8px">
        <span style="font-size:12px;padding:3px 9px;border-radius:20px;background:${fxPc>=100?'var(--tintb)':'var(--warnbg)'};color:${fxPc>=100?'var(--tinttx)':'var(--warntx)'};font-weight:600">${fxPc}%</span>
        <span style="color:var(--ink-3)"><span class="xomui" data-mui="bfx" data-a="▴" data-b="▾">${open.bfx?'▴':'▾'}</span></span></span></button>`;
  if(1){ h+='<div class="xow" data-xo="'+("bfx")+'" data-open="'+((open.bfx)?1:0)+'">';
    h+=`<div style="padding:0 12px 12px 15px">
      <div class="cat-meta" style="padding:9px 0"><span>đã chi ${money(fxDa)} / ${money(fxTong)}</span></div>`;
    items.forEach(it=>{const pd=fixedPaid(it,cursor), tay=fxMarked(it,cursor);
      h+=`<div class="cat-meta" style="padding:7px 0;border-top:1px solid var(--line-2)">
        <span>${esc(it.name)}${tay&&!pd.tien?' · tự đánh dấu':''}</span>
        <span style="display:flex;gap:9px;align-items:center;white-space:nowrap">${pd.tien?money(pd.tien)+' / '+money(it.a):tay?'đã trả · '+money(it.a):'chưa chi · '+money(it.a)}
        ${pd.tien?'':`<button class="chk-btn" style="color:var(--ink-3)" onclick="toggleFxDone('${it.id}')">${tay?'bỏ dấu':'đã trả'}</button>`}</span></div>`;});
    if(!items.length)h+=`<div class="cat-meta" style="padding:7px 0"><span>chưa khai khoản cố định nào</span></div>`;
    h+=`</div>`;
    h+='</div>';
  }
  h+=`</div>`;

  /* khối Hạn mức */
  const rows=FLEX().map(g=>{const fo=fixedOfGroup(g.id,cursor);
    return {g,b:avail(g.id,cursor),v:spentOf(g.id,cursor),ci:carryLeft(g.id,cursor),
      off:offsetNet(g.id,cursor),drw:drawn(g.id,cursor),fxl:fo.left,fxp:fo.plan,
      fxc:Math.min(fo.chi,fo.plan)};})   /* trả dôi hơn kế hoạch thì phần dôi tính vào linh hoạt */
    .filter(x=>x.b>0||x.v>0);
  const tb=rows.reduce((s2,x)=>s2+x.b,0), tv=rows.reduce((s2,x)=>s2+x.v,0);
  /* phần linh hoạt: bỏ cố định ra ngoài, và bỏ luôn Tiết kiệm
     — tiết kiệm là phần còn lại chứ không phải tiền tiêu */
  const lh=rows.filter(x=>x.g.id!=='tk');
  const tlb=lh.reduce((s2,x)=>s2+(x.b-x.fxp),0),
        tlv=lh.reduce((s2,x)=>s2+Math.max(0,x.v-x.fxc),0);
  const now=new Date(), nd=daysIn(cursor), qua=ym(cursor)===ym(now)?now.getDate():nd, pace2=qua/nd;
  h+=`<div class="panel">
    <button class="fold" style="margin:0;border:0;border-left:3px solid var(--amber);border-radius:var(--r)" onclick="toggle('bhm')">
      <span>Hạn mức</span>
      <span style="display:flex;align-items:center;gap:8px">
        ${(()=>{const n2=rows.filter(x=>x.b-x.v-x.fxl<0).length;return n2?`<span style="font-size:11.5px;padding:3px 9px;border-radius:20px;background:var(--errbg);color:var(--errtx);font-weight:600">${n2} nhóm vượt</span>`:'';})()}
        <span style="font-size:12px;padding:3px 9px;border-radius:20px;background:var(--greybg);color:var(--info);font-weight:600">${tb?Math.round(tv/tb*100):0}%</span>
        <span style="color:var(--ink-3)"><span class="xomui" data-mui="bhm" data-a="▴" data-b="▾">${open.bhm?'▴':'▾'}</span></span></span></button>`;
  if(1){ h+='<div class="xow" data-xo="'+("bhm")+'" data-open="'+((open.bhm)?1:0)+'">';
    h+=`<div style="padding:0 12px 12px 15px">`;
    if(lh.length)h+=`<div class="cat-meta" style="padding:9px 0 2px"><span style="color:var(--ink)">Chi linh hoạt (không kể cố định, tiết kiệm)</span>
      <span><span style="color:var(--ink-3)">${money(tlv)} / </span><b>${money(tlb)}</b></span></div>`;
    rows.forEach(({g,b,v,ci,off,drw,fxl,fxp,fxc})=>{
      const vLh=Math.max(0,v-fxc), bLh=b-fxp;      /* đã chi / hạn mức phần linh hoạt */
      const conLai=b-v-fxl;                       /* còn tiêu được sau khi chừa cố định chưa trả */
      const het=v>b, cang=!het&&conLai<0, gan=!het&&!cang&&b&&(v+fxl)/b>=0.8;
      const wAll=b?Math.min(100,(v+fxl)/b*100):0; /* đã chi + phần giữ chỗ */
      const wRes=(v+fxl)?fxl/(v+fxl)*100:0;       /* phần giữ chỗ nằm cuối dải */
      const op=!!open['hm_'+g.id];
      h+=`<div style="padding:10px 0;border-top:1px solid var(--line-2);cursor:pointer" onclick="toggle('hm_${g.id}')">
        <div class="cat-meta"><span style="color:var(--ink);font-size:12.5px">${esc(g.n)} <span style="color:var(--ink-3);font-size:10px"><span class="xomui" data-mui="hm_${g.id}" data-a="▴" data-b="▾">${op?'▴':'▾'}</span></span></span>
          <span><span style="color:var(--ink-3)">${money(v)} / </span><b>${money(b)}</b></span></div>
        <div class="track" style="height:7px;margin-top:7px"><i style="width:${wAll}%;background:linear-gradient(rgba(255,255,255,.55),rgba(255,255,255,.55)) no-repeat right/${wRes}% 100%, ${het?'var(--brick)':cang||gan?'var(--amber)':g.c}"></i>
          <u style="left:${Math.min(100,pace2*100)}%;background:var(--ink)"></u></div>
        <div class="cat-meta" style="margin-top:5px">
          <span style="${het||cang?'color:var(--brick)':gan?'color:var(--amber)':''}">${het?'vượt '+money(v-b):conLai>=0?'còn '+money(conLai):'hụt '+money(-conLai)}</span>
          <span style="font-weight:500;${ci>0?'color:var(--pos)':ci<0?'color:var(--brick)':'color:transparent'}">${
            ci>0?'hạn mức tồn '+money(ci):ci<0?'đã trừ '+money(-ci)+' chi vượt tháng '+(new Date(cursor.getFullYear(),cursor.getMonth()-1,1).getMonth()+1):''}</span></div>
        ${fxp>0?`<div class="cat-meta" style="margin-top:3px"><span style="color:var(--ink-3)">linh hoạt ${money(vLh)} / ${money(bLh)}${
          fxl>0?' · giữ '+money(fxl)+' cho cố định chưa trả':' · cố định đã trả '+money(fxc)}${
          conLai<0?' → còn thiếu '+money(-conLai):''}</span></div>`:''}
        ${(off||drw)?`<div class="cat-meta" style="margin-top:3px"><span style="color:var(--jade)">${money(budgetOf(g.id,cursor))} gốc${
          offsetRows(g.id,cursor).inn.map(o=>' + '+money(o.a)+' từ '+esc(gname(o.g))).join('')}${
          offsetRows(g.id,cursor).out.map(o=>' − '+money(o.a)+' cho '+esc(gname(o.g))).join('')}${drw?' + '+money(drw)+' rút từ tồn':''} = ${money(b)}</span>
          <button class="chk-btn" style="color:var(--brick)" onclick="event.stopPropagation();undoAdjust('${g.id}')">hoàn tác</button></div>`:''}
        ${(drw||off)?(()=>{const or=offsetRows(g.id,cursor);
          const line=[drw?'đã rút '+money(drw)+' từ hạn mức tồn':'',
            offsetLine(or.inn,'được bù'),offsetLine(or.out,'đã bù')].filter(Boolean).join(' · ');
          return `<div class="cat-meta" style="margin-top:3px"><span style="color:var(--jade)">${line}</span></div>`;})():''}
      ${conLai<0?(()=>{
        const over=-conLai, cl=carryLeft(g.id,cursor), room=roomGroups(cursor,g.id);
        let x=`<div class="ask" style="margin-top:9px"><div>${het?'Vượt '+money(v-b):'Sẽ hụt '+money(over)+' khi trả nốt cố định'}${
          het&&fxl?', cộng '+money(fxl)+' cố định chưa trả là thiếu '+money(over):''}. Lấy từ đâu bù vào?</div>`;
        if(cl>0)x+=`<button onclick="event.stopPropagation();drawCarry('${g.id}',${Math.min(over,cl)})">Rút ${short(Math.min(over,cl))} từ hạn mức tồn</button>`;
        if(room.length)x+=`<select class="pill" style="margin-top:8px;width:100%" onclick="event.stopPropagation()" onchange="if(this.value)addOffset(this.value,'${g.id}',Math.min(${over},Number(this.options[this.selectedIndex].dataset.room)))">
            <option value="">— bù từ nhóm khác —</option>
            ${room.map(r=>`<option value="${r.g.id}" data-room="${Math.round(r.room)}">${esc(r.g.sn||r.g.n)} — còn ${short(r.room)}</option>`).join('')}</select>`;
        x+=`<div style="margin-top:7px;font-size:11.5px">Không chọn gì thì khoản vượt tự trừ vào hạn mức tháng sau.</div></div>`;
        return x;})():''}
      <div class="xow" data-xo="hm_${g.id}" data-open="${op?1:0}">${hmDetail(g)}</div>
      </div>`;
    });
    h+=`</div>`;
    h+='</div>';
  }
  h+=`</div><div class="sp"></div><div class="stack-note"><span>Vạch đen là mốc thời gian đã qua trong tháng</span></div>`;

  const em=earmarked(cursor), quy=emergencyFund().quy;
  if(em>0)h+=`<div class="sp"></div><div class="${em>quy?'err':'warn'}">Số dư tiết kiệm ${money(quy)}, trong đó <b>${money(em)}</b> các nhóm đang giữ chỗ. Tiết kiệm khả dụng ${money(Math.max(0,quy-em))}.</div>`;
  if(msg)h+=`<div class="${msgType==='ok'?'ok':'err'}">${esc(msg)}</div>`;
  return h;
}

function vDebt(){
  const tot=debtTotals();
  const noList=DB.debts.filter(d=>d.kind!=='cho'), choList=DB.debts.filter(d=>d.kind==='cho');
  const sortByDue=(a,b)=>{
    const ia=debtInfo(a), ib=debtInfo(b);
    if(!ia.nextDate)return 1; if(!ib.nextDate)return -1;
    return ia.nextDate.localeCompare(ib.nextDate);
  };
  let h=`<div style="display:flex;gap:9px">
    <div class="panel" style="flex:1;padding:11px 12px">
      <div style="font-size:11px;color:var(--ink-2);letter-spacing:.02em">NỢ PHẢI TRẢ</div>
      <div style="font-size:19px;font-weight:700;margin-top:3px">${money(tot.no)}</div>
      <div class="src-m">${noList.length} khoản</div></div>
    <div class="panel" style="flex:1;padding:11px 12px">
      <div style="font-size:11px;color:var(--ink-2);letter-spacing:.02em">NỢ PHẢI THU</div>
      <div style="font-size:19px;font-weight:700;margin-top:3px">${money(tot.cho)}</div>
      <div class="src-m">${choList.length} khoản</div></div></div>`;

  DB.debts.map(d=>({d,i:debtInfo(d),lv:dueLevel(debtInfo(d))}))
    .filter(x=>x.lv.k==='over'||x.lv.k==='now'||x.lv.k==='soon')
    .sort((a,b)=>a.i.days-b.i.days)
    .forEach(x=>{h+=`<div class="al ${x.lv.cls==='red'?'red':'amber'}" style="margin-top:10px;border-radius:6px">
      <span>${esc(x.d.name)} — ${x.lv.txt}, phải trả ${money(x.i.nextAmt)}</span></div>`;});

  const card=(d)=>{
    const i=debtInfo(d), lv=dueLevel(i), pct=i.total?Math.min(100,i.paid/i.total*100):0;
    const cho=d.kind==='cho';
    const col=cho?'var(--pos)':i.done?'var(--ink-3)':'var(--amber)';
    const phi=d.mode==='gop'?Math.max(0,i.total-(d.principal||0)):0;
    let x=`<div class="panel" style="padding:13px;margin-bottom:9px">
      <div class="cat-top"><span style="font-size:15px;font-weight:500">${esc(d.name)}</span>
        <span style="font-size:15px;font-weight:600;${cho?'color:var(--pos)':''}">${money(i.left)}</span></div>
      <div class="src-m" style="margin-top:3px">${cho?'Cho mượn':d.mode==='gop'?'Trả góp · kỳ '+i.kyDone+'/'+d.periods:'Vay cá nhân'}${
        d.mode==='gop'?' · gốc '+money(d.principal||0)+(phi?' + phí thu hộ '+money(phi):''):' · không phí'}</div>
      <div class="track" style="height:5px;margin:9px 0 7px"><i style="width:${pct}%;background:${gcA(col)}"></i></div>
      <div class="cat-meta"><span>Đã ${cho?'thu hồi':'thanh toán'} ${money(i.paid)} / ${money(i.total)}</span>
        <span class="${lv.cls==='red'?'over':''}">${i.done?'đã tất toán':i.nextDate?(d.mode==='gop'?'Kỳ kế tiếp ':'Đến hạn ')+i.nextDate.slice(8,10)+'/'+i.nextDate.slice(5,7)+(lv.k!=='far'?' · '+lv.txt:''):'Chưa xác định ngày'}</span></div>
      ${d.mode!=='gop'&&!i.done&&!d.due&&!(nF&&nF.id===d.id)?`<div class="han-thieu">
        Chưa có <b>${cho?'ngày dự kiến thu':'ngày dự kiến trả'}</b>${cho?' — có ngày thì app mới tính khoản này vào "Số tiền còn lại được dùng để chi".':'.'}
        <div class="han-in"><div class="han-o">${dtInput('han-'+d.id,'','toi')}</div>
          <button class="btn" onclick="luuHan('${d.id}')">Lưu</button></div>
        <div class="err" id="loi-han-${d.id}" hidden></div></div>`:''}
      <div style="display:flex;gap:14px;flex-wrap:wrap;margin-top:10px;padding-top:9px;border-top:1px solid var(--line-2)">
        <button class="chk-btn" onclick="moNo('thu','${d.id}')">${cho?'Ghi thu hồi':'Ghi thanh toán'}</button>
        <button class="chk-btn" style="${debtPick===d.id?'font-weight:700;text-decoration:underline':''}" onclick="pickForDebt('${d.id}')">Đối chiếu</button>
        <button class="chk-btn" onclick="moNo('sua','${d.id}')">Sửa</button>
        <button class="chk-btn" style="color:var(--ink-3)" onclick="toggle('h_${d.id}')">Lịch sử</button>
        <button class="chk-btn" style="color:var(--brick);margin-left:auto" onclick="delDebt('${d.id}')">Xóa</button></div>`;
    if(nF&&nF.id===d.id)x+=formNo(d);
    if(debtPick===d.id){
      const cands=debtCandidates(d);
      x+=`<div class="ask" style="margin-top:9px">
        <div>Chọn giao dịch đã ghi trong sổ để tính vào khoản này — khỏi ghi thêm dòng mới làm đội chi phí.</div>
        <input class="rename" style="margin:9px 0 2px" value="${esc(debtPickQ)}" placeholder="Tìm theo nội dung hoặc số tiền" oninput="setDebtPickQ(this.value)">`;
      if(!cands.length)x+=`<div class="cat-meta" style="padding:8px 0"><span>không còn giao dịch ${cho?'tiền vào':'tiền ra'} nào chưa gán</span></div>`;
      cands.forEach(t=>{
        const khop=i.nextAmt&&Math.abs(t.a-i.nextAmt)<=Math.max(1000,i.nextAmt*0.02);
        x+=`<button class="src" style="width:100%;border:0;border-top:1px solid var(--line-2);text-align:left;padding:8px 0" onclick="linkTx('${d.id}','${t.id}')">
          <span style="min-width:0"><span class="src-n" style="font-size:13px">${ddmm(t.d)} · ${esc(t.n)}</span>
            <span class="src-m">${esc(labelOf(t.c))} · ${esc(srcOf(t.s).n)}${khop?' · khớp kỳ tới':''}</span></span>
          <span class="src-a">${money(t.a)}</span></button>`;});
      x+=`</div>`;
    }
    if(1){ x+='<div class="xow" data-xo="'+("h_"+d.id)+'" data-open="'+((open['h_'+d.id])?1:0)+'">';
      const ps=debtTxns(d.id).slice().sort((a,b)=>b.d.localeCompare(a.d));
      x+=ps.length?ps.map(pp=>`<div class="cat-meta" style="margin-top:7px">
          <span style="min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${ddmm(pp.d)} · ${esc(pp.n)}${pp.debt?'':' · tự nhận'}</span>
          <span style="display:flex;gap:9px;align-items:center;white-space:nowrap"><b>${money(pp.a)}</b>
          <button class="chk-btn" style="color:var(--ink-3)" onclick="unlinkDebt('${pp.id}')">gỡ</button></span></div>`).join('')
        :`<div class="cat-meta" style="margin-top:7px"><span>chưa có lần thanh toán nào</span></div>`;
      x+='</div>';
    }
    return x+`</div>`;
  };

  if(noList.length){ h+=`<h2>Nợ phải trả</h2>`; noList.slice().sort(sortByDue).forEach(d=>h+=card(d)); }
  if(choList.length){ h+=`<h2>Nợ phải thu</h2>`; choList.slice().sort(sortByDue).forEach(d=>h+=card(d)); }
  if(!DB.debts.length)h+=`<div class="sp"></div><div class="empty"><b>Chưa có khoản nào</b>Ghi một giao dịch nhóm Đi vay hoặc Cho mượn, app sẽ tự tạo khoản ở đây.</div>`;
  h+=`<div class="sp"></div>`+(nF&&nF.m==='moi'?`<div class="panel" style="padding:13px">${formNo(null)}</div>`
    :`<div class="nf-btns"><button class="btn ghost" onclick="moNo('moi','cho')">+ Cho mượn</button>
      <button class="btn ghost" onclick="moNo('moi','no')">+ Đi vay</button></div>`);
  if(msg)h+=`<div class="${msgType==='ok'?'ok':'err'}">${esc(msg)}</div>`;
  return h;
}

/* bảng chọn nhóm hai bước, có hàng hay dùng và ô lọc */
let picker=null;
function openPicker(mode,ref,kind){ picker={mode,ref,kind:kind||'chi',g:'',q:''}; render(); }
function closePicker(){ picker=null; render(); }
function pickerStep(g){ picker.g=g; render(); }
function pickerQ(v){ picker.q=v; render(); }
function pickCode(code){
  const pk=picker; picker=null;
  if(pk.mode==='pending')setCat(pk.ref,code);
  else if(pk.mode==='txn')reCat(pk.ref,code);
  else if(pk.mode==='manual'){manualCode=code;render();}
  else if(pk.mode==='fixed'){fxCode=code;render();}
}
/* mã hay dùng: đếm 3 tháng gần nhất */
function topCodes(kind){
  const cnt={}, lim=new Date(); lim.setMonth(lim.getMonth()-3);
  DB.txns.forEach(t=>{
    if(t.t!==kind||!t.c)return;
    if(new Date(t.d+'T00:00')<lim)return;
    cnt[t.c]=(cnt[t.c]||0)+1;
  });
  return Object.entries(cnt).sort((a,b)=>b[1]-a[1]).slice(0,4).map(x=>x[0]);
}
function vPicker(){
  const pk=picker, gs=GROUPS.filter(g=>g.k===pk.kind);
  let h=`<h2>Chọn nhóm</h2>`;
  if(!pk.g){
    const q=noAccent(pk.q||'');
    if(q){
      const hits=[];
      gs.forEach(g=>{ if(noAccent(g.n).indexOf(q)>=0)hits.push([g.id,g.n,g.c]);
        g.subs.forEach(([c2,n2])=>{ if(noAccent(n2).indexOf(q)>=0)hits.push([c2,g.n+' › '+n2,g.c]); }); });
      h+=`<input class="rename" style="margin:0 0 10px" value="${esc(pk.q)}" placeholder="Gõ để lọc" oninput="pickerQ(this.value)">
        <div class="panel">`+(hits.length?hits.map(([c2,n2,col])=>
        `<button class="src" style="width:100%;border:0;text-align:left" onclick="pickCode('${c2}')">
          <span><span class="spine" style="background:${gcA(col)};height:14px;display:inline-block;margin-right:8px"></span>${esc(n2)}</span></button>`).join('')
        :`<div class="empty">Không có mục nào khớp</div>`)+`</div>`;
    }else{
      const top=topCodes(pk.kind);
      if(top.length){
        h+=`<div class="stack-note"><span>HAY DÙNG</span></div><div style="display:flex;gap:6px;flex-wrap:wrap;margin:8px 0 14px">`
          +top.map(c2=>`<button class="chip" style="margin-top:0;background:var(--tintb);border-color:var(--tintbd);color:var(--tinttx)" onclick="pickCode('${c2}')">${esc(labelOf(c2))}</button>`).join('')+`</div>`;
      }
      h+=`<input class="rename" style="margin:0 0 10px" placeholder="Gõ để lọc" oninput="pickerQ(this.value)">
        <div class="grid3">`+gs.map(g=>
        `<button class="gtile" style="border-left-color:${gcA(g.c)}" onclick="${g.subs.length?`pickerStep('${g.id}')`:`pickCode('${g.id}')`}">${esc(g.sn||g.n)}</button>`).join('')+`</div>`;
    }
  }else{
    const g=groupOf(pk.g);
    h+=`<div class="stack-note" style="margin-bottom:10px"><span>
      <button style="background:none;border:0;padding:0;color:var(--jade);font-weight:600;font-size:12.5px" onclick="pickerStep('')">‹ tất cả nhóm</button>
      · ${esc(g.n)}</span></div><div class="panel">`
      +`<button class="src" style="width:100%;border:0;text-align:left;background:var(--tintb)" onclick="pickCode('${g.id}')"><span>${esc(g.n)}</span></button>`
      +g.subs.map(([c2,n2])=>`<button class="src" style="width:100%;border:0;text-align:left" onclick="pickCode('${c2}')"><span>${esc(n2)}</span></button>`).join('')
      +`</div>`;
  }
  return h+`<div class="sp"></div><button class="btn ghost" onclick="closePicker()">Hủy</button>`;
}
/* nút mở bảng chọn, thay cho thẻ select cũ */
function catBtn(val,kind,mode,ref){
  const lab=val?labelOf(val):'chọn nhóm';
  return `<button class="pill ${val?'':'need'}" style="max-width:100%;text-align:left" onclick="openPicker('${mode}','${ref}','${kind}')">${esc(lab)} ▾</button>`;
}

/* những việc cần Vy để mắt, gom lên đầu Tổng quan */
/* ---- Nhắc ghi sổ ----
   Đếm từ HÔM QUA lùi dần xem có bao nhiêu ngày liên tiếp sổ không có giao dịch nào.
   Ngày nào Vy đã bấm "không phát sinh giao dịch" thì bỏ qua nhưng vẫn đếm tiếp về trước.
   Dừng khi gặp ngày có giao dịch, hoặc khi lùi quá ngày ghi chép đầu tiên của sổ.

   "Lần cuối cập nhật" lấy từ id giao dịch: id sinh bằng Date.now()+Math.random() nên
   nó đã sẵn là mốc thời gian lúc bấm Lưu. Giao dịch nào có id không phải mốc thời gian
   (sổ cũ, dữ liệu nhập từ nơi khác) thì bỏ qua, khi đó chỉ hiện ngày chứ không có giờ. */
function chuaGhiSo(){
  if('cgs' in _memo)return _memo.cgs;
  if(!DB.txns.length)return _memo.cgs=null;
  const dau=ngayBatDau(); if(!dau)return _memo.cgs=null;
  const co={}; DB.txns.forEach(t=>{if(t.d)co[t.d]=1;});
  const daOK=DB.ngayOK||{};
  const now=new Date(), trong=[];
  for(let i=1;i<=60;i++){
    const k=iso(new Date(now.getFullYear(),now.getMonth(),now.getDate()-i));
    if(k<dau)break;
    if(co[k])break;
    if(!daOK[k])trong.push(k);
  }
  if(!trong.length)return _memo.cgs=null;
  /* lần cuối bấm Lưu — suy từ id, chỉ nhận mốc thời gian hợp lý */
  let ms=0; const gioHan=Date.now();
  DB.txns.forEach(t=>{const v=Math.floor(Number(t.id));
    if(v>15e11&&v<=gioHan&&v>ms)ms=v;});
  let lanCuoi='';
  if(ms){const z=new Date(ms);
    lanCuoi=String(z.getDate()).padStart(2,'0')+'/'+String(z.getMonth()+1).padStart(2,'0')
      +' '+String(z.getHours()).padStart(2,'0')+':'+String(z.getMinutes()).padStart(2,'0');}
  else{const dc=DB.txns.map(t=>t.d).filter(Boolean).sort().pop(); if(dc)lanCuoi=ddmm(dc);}
  return _memo.cgs={trong,so:trong.length,lanCuoi,coGio:!!ms};
}
/* Vy xác nhận mấy ngày đó thật sự không tiêu gì — thôi không nhắc nữa */
function ngayKhongTieu(){
  const g=chuaGhiSo(); if(!g)return;
  DB.ngayOK=Object.assign({},DB.ngayOK||{});
  g.trong.forEach(k=>{DB.ngayOK[k]=1;});
  save(); render();
}
/* Khối nhắc ghi sổ — để riêng chứ không nhét vào dãy cảnh báo, vì câu dài hơn một dòng
   và nó cần tới hai nút bấm. */
/* ---- Chốt sổ tháng (v=9, Vy duyệt 28/09/2026) ----
   Hiện từ NGÀY 1 tháng sau, không phải ngày cuối tháng — chốt lúc sáng ngày 30 thì bữa tối
   ngày 30 rơi ra ngoài. Chỉ nhắc tháng LIỀN TRƯỚC. Không có nút "để sau".
   Ba điều app tự kiểm: (1) ngày nào cũng có giao dịch hoặc đã xác nhận không tiêu,
   (2) giao dịch nào cũng có nhóm, (3) chuỗi số dư BIDV không còn chỗ đứt chưa xử lý.
   Đạt đủ mới tới bước Vy xác nhận ba số dư cuối ngày cuối tháng. Chốt rồi thì con số
   đứng yên trong DB.chot[tháng]; thêm/sửa/xóa giao dịch tháng đó phải hỏi lại (hoiChot). */
function chotCan(){
  const now=new Date(), tr=new Date(now.getFullYear(),now.getMonth()-1,1), k=ym(tr);
  const mk='chot'+k; if(mk in _memo)return _memo[mk];
  const dau=ngayBatDau();
  if(!dau||dau.slice(0,7)>k||(DB.chot||{})[k])return _memo[mk]=null;
  const co={}; DB.txns.forEach(t=>{if(t.d)co[t.d]=1;});
  const daOK=DB.ngayOK||{}, trong=[];
  for(let i=1;i<=daysIn(tr);i++){
    const d=iso(new Date(tr.getFullYear(),tr.getMonth(),i));
    if(d>=dau&&!co[d]&&!daOK[d])trong.push(d);
  }
  const l=monthTx(tr);
  const thieuNhom=l.filter(t=>(t.t==='chi'||t.t==='thu')&&!t.c).length;
  const dut=chainGaps().filter(g=>g.d.slice(0,7)===k&&!g.ok&&!g.mirror);
  const daOKChuoi=chainGaps().filter(g=>g.d.slice(0,7)===k&&g.ok);
  const bs=balSrcAt(tr);
  return _memo[mk]={k,thang:tr,trong,soGD:l.length,thieuNhom,dut,daOKChuoi,bs,
    tong:(bs.bidv||0)+(bs.vi||0)+(bs.tm||0),cuoi:iso(new Date(tr.getFullYear(),tr.getMonth()+1,0)),
    du:!trong.length&&!thieuNhom&&!dut.length};
}
/* Vy bấm Khớp / Lệch cho từng nguồn — chỉ giữ trong phiên, chưa ghi vào sổ cho tới khi chốt */
let chotXN={}, chotThat={};
function khongTieu(d){DB.ngayOK=Object.assign({},DB.ngayOK||{});DB.ngayOK[d]=1;save();render();}
function chotKhop(s,v){chotXN[s]=v;if(v==='y')delete chotThat[s];render();}
function chotNhapThat(s,el){chotThat[s]=el.value;
  /* chỉ cập nhật dòng lệch tại chỗ, không vẽ lại — vẽ lại thì mất con trỏ trong ô */
  const c=chotCan(), a=parseAmt(el.value), o=document.getElementById('chot-lech-'+s); if(!c||!o)return;
  o.innerHTML=isNaN(a)?'':chotLechTxt(a-(c.bs[s]||0));}
function chotLechTxt(k){
  if(!k)return 'Khớp rồi — bấm "Khớp" ở trên.';
  return 'Lệch <b>'+money(Math.abs(k))+'</b> — '+(k<0
    ?'app tính NHIỀU hơn tiền thật, nghĩa là có khoản chi chưa ghi.'
    :'app tính ÍT hơn tiền thật, nghĩa là có khoản thu chưa ghi.');}
/* ghi phần lệch thành một dòng điều chỉnh có tên rõ ràng, ngày cuối tháng — chỗ lệch không bị giấu */
function chotDieuChinh(s){
  const c=chotCan(); if(!c)return;
  const a=parseAmt(chotThat[s]||''); if(isNaN(a)){flash('Chưa gõ số tiền thật.','err');return;}
  const k=a-(c.bs[s]||0); if(!k){chotKhop(s,'y');return;}
  DB.txns.push({id:Date.now()+Math.random(),d:c.cuoi,t:'dc',s,a:Math.abs(k),dir:k<0?'-':'+',
    n:'Điều chỉnh khi chốt sổ '+MONTH(c.thang.getMonth()).toLowerCase()});
  chotXN[s]='y'; delete chotThat[s]; save(); flash('Đã ghi điều chỉnh '+(k<0?'−':'+')+money(Math.abs(k))+'.','ok');
}
function chotSo(){
  const c=chotCan(); if(!c||!c.du)return;
  if(SRC.some(x=>chotXN[x.id]!=='y'))return;
  DB.chot=Object.assign({},DB.chot||{});
  DB.chot[c.k]={luc:Date.now(),bidv:c.bs.bidv||0,vi:c.bs.vi||0,tm:c.bs.tm||0,tong:c.tong};
  chotXN={}; chotThat={}; save(); flash('Đã chốt sổ '+MONTH(c.thang.getMonth()).toLowerCase()+'.','ok');
}
/* hỏi lại trước khi thêm / sửa ngày / sửa tiền / xóa giao dịch thuộc tháng đã chốt.
   ds: danh sách ngày ISO bị đụng tới. Trả về true nếu được làm tiếp. */
function hoiChot(ds){
  const ks=[...new Set(ds.filter(Boolean).map(d=>d.slice(0,7)))].filter(k=>(DB.chot||{})[k]).sort();
  if(!ks.length)return true;
  const ten=ks.map(k=>'tháng '+(+k.slice(5))+'/'+k.slice(0,4)).join(', ');
  const so=ks.map(k=>money(DB.chot[k].tong)).join(', ');
  return confirm((ks.length>1?'Các '+ten:ten.charAt(0).toUpperCase()+ten.slice(1))+' đã chốt sổ.\n'
    +'Làm việc này sẽ làm số dư cuối tháng khác số đã chốt ('+so+'). Vẫn làm?');
}
/* ---- Bắt đầu theo dõi từ (v=12, Vy 28/09/2026) ----
   Trước ngày này app KHÔNG nhắc ghi sổ, KHÔNG yêu cầu chốt sổ. Trước đây app lấy ngày giao dịch
   sớm nhất trong sổ làm mốc — một giao dịch gõ nhầm ngày 09/04 làm app yêu cầu chốt cả tháng 8.
   Sổ chưa đặt thì hộp thoại hiện lên BẮT BUỘC, không có nút bỏ qua. */
const ngayBatDau=()=>DB.batDau||firstTxDate();
/* gợi ý: mùng 1 của tháng đầu tiên có từ 10 giao dịch — bỏ qua giao dịch lẻ gõ nhầm ngày */
function goiYBatDau(){
  const m={}; DB.txns.forEach(t=>{if(t.d){const k=t.d.slice(0,7);m[k]=(m[k]||0)+1;}});
  const ks=Object.keys(m).sort(), k=ks.find(x=>m[x]>=10)||ks[0];
  return k?k+'-01':iso(new Date(new Date().getFullYear(),new Date().getMonth(),1));
}
function moBatDau(){open.batDau=1;render();setTimeout(()=>{const e=document.getElementById('bd-ngay');if(e)e.focus();},0);}
function dongBatDau(){delete open.batDau;render();}
function luuBatDau(){
  const el=document.getElementById('bd-ngay'), r=dtRead(el?el.value:'','qua');
  const loi=t=>loiO('bd-loi',t);
  if(!r){loi(r===''?'Chưa gõ ngày.':'Ngày chưa đúng — gõ dạng dd/mm/yy.');return;}
  if(r>iso(new Date())){loi('Ngày này chưa tới.');return;}
  DB.batDau=r; delete open.batDau; memoClear(); save(); flash('Bắt đầu theo dõi từ '+vnd(r)+'.','ok');
}
function khoiBatDau(){
  const batBuoc=!DB.batDau, g=goiYBatDau(), v=DB.batDau||g;
  return `<div class="bd-veil"><div class="bd-hop" role="dialog" aria-modal="true" aria-labelledby="bd-t">
    <h3 id="bd-t">Bắt đầu theo dõi từ ngày nào?</h3>
    <p>Trước ngày này app không nhắc ghi sổ, không yêu cầu chốt sổ.</p>
    ${dtInput('bd-ngay',v,'qua')}
    <div class="dt-chips bd-chips"><button type="button" onclick="dtSet('bd-ngay','${g}')">${vnd(g)} · tháng có giao dịch đầu tiên</button></div>
    <div class="err" id="bd-loi" hidden></div>
    <button class="btn" onclick="luuBatDau()">Lưu</button>
    ${batBuoc?'':'<button class="btn ghost bd-huy" onclick="dongBatDau()">Hủy</button>'}
  </div></div>`;
}
function khoiChot(){
  const c=chotCan();
  if(!c){
    /* vừa chốt xong: dải xanh 3 ngày rồi tự ẩn */
    const now=new Date(), k=ym(new Date(now.getFullYear(),now.getMonth()-1,1)), x=(DB.chot||{})[k];
    if(x&&Date.now()-x.luc<3*864e5)return `<div class="chot-xong"><span>✓</span><span><b>Đã chốt sổ ${MONTH(+k.slice(5)-1).toLowerCase()}</b> · ${
      vnd(iso(new Date(x.luc))).slice(0,5)} ${String(new Date(x.luc).getHours()).padStart(2,'0')}:${String(new Date(x.luc).getMinutes()).padStart(2,'0')} · số dư ${money(x.tong)}</span></div>`;
    return '';
  }
  const th=MONTH(c.thang.getMonth()).toLowerCase();
  const DK=(ok,t,m)=>`<div class="chot-dk"><span class="chot-ic ${ok?'chot-ic-ok':'chot-ic-no'}">${ok
    ?'<svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M2.5 6.3 L5 8.8 L9.5 3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    :'!'}</span><div style="flex:1;min-width:0">
    <div class="chot-t">${t}</div>${m||''}</div></div>`;
  let x=`<div class="panel chot"><div class="chot-hd"><b>Chốt sổ ${th}</b><div>${c.du
    ?'Đủ 3 điều kiện. Vy mở app ngân hàng, ví, đếm tiền mặt rồi xác nhận.'
    :MONTH(c.thang.getMonth())+' đã hết. Kiểm đủ 3 điều dưới đây rồi Vy xác nhận số dư là xong.'}</div></div>`;
  x+=DK(!c.trong.length,c.trong.length?`Còn <b>${c.trong.length}</b> ngày chưa có giao dịch`
      :'Ngày nào cũng có giao dịch hoặc đã xác nhận không tiêu',
    c.trong.length?`<div class="chot-m">Ngày nào không tiêu thì bấm "Không tiêu". Ngày nào quên ghi thì mở tab Nhập.</div>
      <div class="chot-days">${c.trong.map(d=>`<div class="chot-day"><span>${THU[new Date(d+'T00:00').getDay()]}, ${ddmm(d)}</span>
        <button onclick="khongTieu('${d}')">Không tiêu</button></div>`).join('')}</div>
      <button class="chk-btn" onclick="go('add')">Mở tab Nhập →</button>`:'');
  x+=DK(!c.thieuNhom,c.thieuNhom?`Còn <b>${c.thieuNhom}</b> giao dịch chưa có nhóm`:`${c.soGD} giao dịch đều đã có nhóm`,
    c.thieuNhom?`<button class="chk-btn" onclick="go('list')">Mở tab Giao dịch →</button>`:'');
  x+=DK(!c.dut.length,c.dut.length?`Chuỗi số dư BIDV còn <b>${c.dut.length}</b> chỗ đứt`:'Chuỗi số dư BIDV liền mạch',
    c.dut.length?`<div class="chot-m">${c.dut.map(g=>ddmm(g.d)+' lệch '+(g.gap<0?'−':'+')+money(Math.abs(g.gap))).join(' · ')} — có giao dịch BIDV chưa ghi hoặc ghi sai.</div>
      <button class="chk-btn" onclick="jump('bal')">Xem chỗ đứt →</button>`
    :c.daOKChuoi.length?`<div class="chot-m">${c.daOKChuoi.length} chỗ lệch Vy đã xác nhận: ${c.daOKChuoi.map(g=>ddmm(g.d)+' '+(g.gap<0?'−':'+')+money(Math.abs(g.gap))).join(' · ')}</div>`:'');
  if(!c.du){
    const con=[c.trong.length?c.trong.length+' ngày trống':'',c.thieuNhom?c.thieuNhom+' giao dịch chưa có nhóm':'',
      c.dut.length?c.dut.length+' chỗ đứt chuỗi':''].filter(Boolean).join(', ');
    return x+`<button class="btn chot-btn" disabled>Còn ${con} — chưa chốt được</button></div>`;
  }
  x+=`<div class="chot-dk" style="padding-bottom:4px"><div class="chot-t"><b>Số dư cuối ngày ${ddmm(c.cuoi)} — có khớp không?</b></div></div>`;
  let lech='';
  SRC.forEach(s=>{
    const v=c.bs[s.id]||0, xn=chotXN[s.id];
    x+=`<div class="chot-bal"><span class="n">${s.n}</span><span class="a ${v<0?'neg':''}">${money(v)}</span>
      <span class="chot-sw"><button class="${xn==='y'?'on y':''}" onclick="chotKhop('${s.id}','y')">Khớp</button>
        <button class="${xn==='x'?'on x':''}" onclick="chotKhop('${s.id}','x')">Lệch</button></span></div>`;
    if(xn==='x'){const a=parseAmt(chotThat[s.id]||'');
      x+=`<div class="chot-fix">${s.n} thật đang có bao nhiêu?
        <input inputmode="numeric" value="${esc(chotThat[s.id]||'')}" placeholder="gõ số dư thật" oninput="this.value=fmtTien(this.value);chotNhapThat('${s.id}',this)">
        <div id="chot-lech-${s.id}">${isNaN(a)?'':chotLechTxt(a-v)}</div>
        <div class="chot-row2"><button class="chk-btn" onclick="go('add')">Mở tab Nhập ghi khoản thiếu →</button>
          <button class="chk-btn" style="color:var(--errtx)" onclick="chotDieuChinh('${s.id}')">Không nhớ — ghi điều chỉnh ngày ${ddmm(c.cuoi)}</button></div></div>`;
      lech=s.n;}
  });
  const du3=SRC.every(s=>chotXN[s.id]==='y');
  x+=`<div class="chot-sum"><span>Số dư cuối ${th}</span><span>${money(c.tong)}</span></div>`;
  x+=`<button class="btn chot-btn" ${du3?'':'disabled'} onclick="chotSo()">${
    lech&&!du3?lech+' còn lệch — chưa chốt được':'Chốt sổ '+th}</button>`;
  x+=`<div class="chot-note">${du3?'Chốt xong, số dư cuối '+th+' đứng yên ở '+money(c.tong)+'.':'Bấm "Khớp" đủ cả ba nguồn thì nút mới mở.'}</div>`;
  return x+`</div>`;
}
function khoiNhacGhi(){
  const g=chuaGhiSo(); if(!g)return '';
  /* khối chốt sổ đã liệt kê ngày trống của tháng trước — đừng báo trùng */
  const c=chotCan(); if(c&&g.trong.every(d=>d.slice(0,7)===c.k))return '';
  return `<div class="warn">
    <b>${g.so===1?'Ngày '+ddmm(g.trong[0])+' chưa ghi nhận giao dịch'
                  :'Đã '+g.so+' ngày chưa cập nhật giao dịch'}</b>
    ${g.lanCuoi?`<div style="margin-top:3px">Lần cuối: ${g.lanCuoi}</div>`:''}
    <div style="display:flex;gap:14px;margin-top:9px">
      <button class="chk-btn" onclick="go('add')">Mở tab Nhập</button>
      <button class="chk-btn" style="color:var(--ink-3)" onclick="ngayKhongTieu()">Không phát sinh giao dịch</button>
    </div></div>`;
}
function alerts(){
  const out=[], d=cursor;
  /* Tiết kiệm, Trả nợ, Cho mượn trả một lần đầu tháng nên không đo theo nhịp */
  const KHONGNHIP={tk:1,trano:1,muon:1};
  FLEX().forEach(g=>{
    if(KHONGNHIP[g.id])return;
    const b=avail(g.id,d); if(!b)return;
    const v=spentOf(g.id,d);
    /* chỉ còn cảnh báo đỏ; "tiêu nhanh hơn nhịp" đã chuyển vào khối Hạn mức cần chú ý ở Tổng quan */
    if(v>b)out.push({cls:'red',t:esc(g.sn||g.n)+' vượt hạn mức '+money(v-b),k:'over',g:g.id});
  });
  DB.debts.forEach(dt=>{const i=debtInfo(dt), lv=dueLevel(i);
    if(lv.k==='over'||lv.k==='now')out.push({cls:'red',t:esc(dt.name)+' — '+lv.txt,k:'debt'});
    else if(lv.k==='soon')out.push({cls:'amber',t:esc(dt.name)+' — '+lv.txt,k:'debt'});});
  const chk=bidvCheck();
  if(chk&&chk.diff!==0)out.push({cls:'red',t:'Số dư BIDV lệch '+money(Math.abs(chk.diff))+' so với ngân hàng',k:'bal'});
  /* giữ câu ngắn: khối này mỗi cảnh báo chỉ được một dòng, dài quá sẽ bị cắt cụt */
  chainGaps().filter(g=>g.d.slice(0,7)===ym(d)&&!g.ok&&!g.mirror).slice(0,2).forEach(g=>out.push({
    cls:g.why==='gio'?'grey':'amber',
    t:g.why==='gio'
      ? 'Số dư lệch '+money(Math.abs(g.gap))+' trước '+ddmm(g.d)+' — có giao dịch chưa ghi giờ'
      : 'Thiếu một khoản '+(g.gap<0?'chi':'thu')+' khoảng '+money(Math.abs(g.gap))+' trước '+ddmm(g.d),
    k:'chain:'+g.key}));
  const chuaMa=fixedItems().filter(x=>!x.mp);
  if(ym(d)===ym(new Date())&&(DB.income||0)>0)payPeriods(d).ky.filter(k=>k.tre).forEach(k=>
    out.push({cls:'grey',t:'Lương kỳ '+k.i+' chưa về — dự trù đang tạm ước '+money(k.uoc),k:'budget'}));
  if(chuaMa.length)out.push({cls:'grey',t:chuaMa.length+' khoản cố định chưa gắn mã nhận diện',k:'budget'});
  const ds=daysSinceBackup();
  if(DB.txns.length>=10&&(ds===null||ds>30))out.push({cls:'grey',t:ds===null?'Sổ chưa từng được sao lưu':'Đã '+ds+' ngày chưa sao lưu',k:'backup'});
  return out;
}
function jump(k){
  if(k.slice(0,6)==='chain:'){open.chain=k.slice(6);render();
    setTimeout(()=>{const e=document.getElementById('sec-chain');if(e)e.scrollIntoView({block:'start'});},30);return;}
  if(k==='over'){bTab='run';open.bhm=true;go('budget');return;}
  if(k==='bal')open.bal=true;
  if(k==='backup'){go('set');return;}
  if(k==='budget'){go('budget');return;}
  if(k==='debt'){go('debt');return;}
  render();
  setTimeout(()=>{const e=document.getElementById('sec-'+k);if(e)e.scrollIntoView({block:'start'});},30);
}
/* một dòng gọn cho biết hai kỳ lương đang ở đâu */
function payNote(pp){
  if(!pp)return '';
  const ph=pp.ky.map(k=>'kỳ '+k.i+' '+(k.xong?'đã nhận '+money(k.nhan):(k.tre?'chưa về, đã qua ngày '+k.den+', ước ':'ước ')+money(k.uoc)));
  if(pp.ngoai)ph.push('thưởng và thu khác '+money(pp.ngoai));
  return ph.join(' · ')+(pp.xongCa?' · đã chốt':'');
}
function chainClose(){open.chain='';render();}
/* một dòng trong bảng giải thích: tên · ghi chú nhỏ · số tiền */
function LN(t,v,sub,neg){
  return `<div class="src" style="padding:9px 14px"><div style="min-width:0">
    <div class="src-n" style="font-size:13.5px">${t}</div>${sub?`<div class="src-m">${sub}</div>`:''}</div>
    <div class="src-a ${neg||v<0?'neg':''}" style="font-size:14px">${neg?'−':''}${money(v)}</div></div>`;
}
/* Số dương mà chưa đạt mục tiêu thì vàng, đạt thì xanh. Chỉ số ÂM mới được tô đỏ,
   để Vy không nhầm "để dành ít hơn mong muốn" với "âm tiền". */
/* dòng có số tô màu đúng bằng màu của ô lớn tương ứng phía trên, để đọc là biết tốt hay xấu */
function LNC(t,v,sub,mau){
  return `<div class="src" style="padding:9px 14px"><div style="min-width:0">
    <div class="src-n" style="font-size:13.5px">${t}</div>${sub?`<div class="src-m">${sub}</div>`:''}</div>
    <div class="src-a" style="font-size:15px;font-weight:700;color:${mau}">${money(v)}</div></div>`;
}
/* Soi một mốc số dư lệch: mốc trước → các giao dịch ở giữa → mốc sau. */
function chainPanel(key){
  const g=chainGap(key);
  if(!g)return `<div class="ok">Mốc số dư này đã khớp lại rồi.</div>`;
  const dt=s2=>s2?ddmm(s2.slice(0,10))+(s2.length>10?' '+s2.slice(11):''):'';
  let x=`<h2 class="hl" id="sec-chain"><i style="background:var(--info)"></i><b>Soi chuỗi số dư</b>
    <button style="background:none;border:0;padding:0;font-size:12px;font-weight:600;color:var(--jade)" onclick="chainClose()">đóng</button></h2>
    <div class="panel">
    <div class="daygroup">NGÂN HÀNG BÁO LÚC ${esc(dt(g.from))}</div>
    ${LN('Số dư gốc',g.fromB,'')}
    <div class="daygroup">${g.rows.length} GIAO DỊCH GIỮA HAI MỐC</div>`;
  g.rows.forEach(r=>{
    const nghi=g.culprit&&r===g.culprit;
    x+=`<div class="src" style="padding:9px 14px${nghi?';background:var(--tint)':''}"><div style="min-width:0">
      <div class="src-n" style="font-size:13.5px">${esc(r.name||'(không tên)')}</div>
      <div class="src-m">${ddmm(r.d)}${r.tm?' '+r.tm:' · <b>chưa ghi giờ</b>'}${r.b?' · ngân hàng báo số dư '+money(r.b):''}${nghi?' · nghi rơi nhầm khoảng':''}</div></div>
      <div class="src-a ${r.delta<0?'neg':''}" style="font-size:14px">${r.delta<0?'−':'+'}${money(Math.abs(r.delta))}</div></div>`;});
  x+=`<div class="src total"><div><div class="src-n">APP TÍNH RA</div>
      <div class="src-m">${short(g.fromB)} ${g.exp-g.fromB<0?'−':'+'} ${short(Math.abs(g.exp-g.fromB))}</div></div>
      <div class="src-a">${money(g.exp)}</div></div>
    <div class="src total"><div><div class="src-n">NGÂN HÀNG BÁO LÚC ${ddmm(g.d)}${g.tm?' '+g.tm:''}</div>
      <div class="src-m">lệch ${money(Math.abs(g.gap))} — ${g.gap<0?'app tính dư, tức sổ đang thiếu một khoản chi':'app tính thiếu, tức sổ đang thiếu một khoản thu'}</div></div>
      <div class="src-a">${money(g.b)}</div></div></div>
    <div class="sp"></div>`;
  const nghi=chainSuspects(g);
  if(nghi.length){
    x+=`<div class="stack-note" style="margin-bottom:8px"><span>Dò trong sổ thấy ${nghi.length} khoản bù vừa khít ${money(Math.abs(g.gap))}. Nếu Vy đã đối chiếu và chắc là không thiếu giao dịch nào, thì lệch nhiều khả năng do một trong những khoản này.</span></div>
      <div class="panel">`;
    nghi.forEach(k=>{x+=`<div class="src" style="padding:9px 14px"><div style="min-width:0">
      <div class="src-n" style="font-size:13.5px">${esc(k.t.n||'(không tên)')}</div>
      <div class="src-m">${ddmm(k.t.d)}${k.t.tm?' '+k.t.tm:''} · ${esc(srcOf(k.t.s).n)} · ${esc(k.ly)}</div></div>
      <div class="src-a ${k.delta<0?'neg':''}" style="font-size:14px">${k.delta<0?'−':'+'}${money(Math.abs(k.delta))}</div></div>`;});
    x+=`</div><div class="sp"></div>`;
  }
  x+=`<div class="stack-note"><span>`;
  if(g.why==='gio')x+=`Khoản <b>${esc(g.culprit.name||'không tên')}</b> chưa ghi giờ nên app xếp nó vào lúc 00:00 và tính vào khoảng này. Nếu thật ra nó xảy ra sau mốc trên thì chuỗi không hề thiếu gì — mở giao dịch đó điền giờ là hết lệch, hoặc bấm nút dưới để khỏi báo nữa.`;
  else if(nghi.length)x+=`Ngoài mấy khoản trên, lệch còn có thể do một giao dịch trong khoảng bị nhập thiếu hoặc thừa đúng ${money(Math.abs(g.gap))}, hoặc do số dư ${money(g.b)} ở mốc dưới gõ nhầm.`;
  else x+=`Không có khoản nào trong sổ bù vừa khít ${money(Math.abs(g.gap))}. Vậy hoặc là thiếu hẳn một giao dịch chưa nhập, hoặc một giao dịch trong khoảng bị nhập sai số tiền đúng ${money(Math.abs(g.gap))}, hoặc số dư ${money(g.b)} ở mốc dưới gõ nhầm. Đối chiếu danh sách trên với app BIDV là ra.`;
  x+=`</span></div>
    <div class="sp"></div><button class="btn ghost" onclick="chainAck('${esc(key)}')">Đã kiểm tra, không báo mốc này nữa</button>`;
  return x;
}
/* Bảng "Cách tính" của Dự báo cuối tháng + chỗ Vy chọn khoản không kiểm soát được.
   Chỉ tên và số — Vy muốn gọn, không dòng giải thích. */
function cachTinhFc(f){
  const R=(t,v,cls)=>`<div class="fc-row ${cls||''}"><span>${t}</span><b>${money(v)}</b></div>`;
  let x=`<div class="panel fc-det">
    <div class="daygroup dg-db1">TIÊU ĐỦ HẠN MỨC</div>
    ${R('Còn được chi',f.A1)}
    ${f.r1.map(r=>R('− '+esc(r.n),r.a,'sub')).join('')}
    ${R('CUỐI THÁNG',f.du1,'tot')}
    <div class="daygroup dg-db2">THEO NHỊP TIÊU · CÒN ${f.conLai} NGÀY</div>`;
  x+=f.duocUoc?R('Còn được chi',f.A1)+f.r2.map(r=>R('− '+esc(r.n)+(r.cach==='da'?' <i>theo nhịp tiêu</i>':''),r.a,'sub')).join('')+R('CUỐI THÁNG',f.du2,'tot')
    :`<div class="fc-row"><span>chưa ước được, đợi qua mùng 5</span></div>`;
  const ks=khongKS(), SW=(code,ten,sub)=>{const on=ks.includes(code);
    return `<div class="fc-ks ${sub?'sub':''}"><span>${esc(ten)}</span>
      <button class="fc-sw ${on?'on':''}" role="switch" aria-checked="${on}" aria-label="${esc(ten)}" onclick="togKS('${code}')"></button></div>`;};
  x+=`<div class="daygroup fc-ksh">KHÔNG KIỂM SOÁT ĐƯỢC · tính theo nhịp tiêu</div>`;
  GROUPS.filter(g=>g.k==='chi'&&!['tk','muon','trano'].includes(g.id)).forEach(g=>{
    x+=SW(g.id,g.n,0);
    if(!ks.includes(g.id))g.subs.forEach(s=>{x+=SW(s[0],s[1],1);});
  });
  return x+`</div>`;
}
/* Mục tiêu — ĐẦU trang Tổng quan để Vy tự nhắc mình (28/09/2026). Mỗi mục tiêu MỘT dòng:
   tên · đã có / mục tiêu · phần trăm. Dòng đầu là tiết kiệm của chính tháng này:
   đã chuyển vào nhóm Tiết kiệm & Đầu tư / hạn mức Tiết kiệm + góp mục tiêu. */
function khoiMucTieu(){
  const th=MONTH(cursor.getMonth()).toLowerCase();
  const can=bud('tk',cursor)+goalMonthly(), da=spentOf('tk',cursor);
  const ds=[];
  if(can)ds.push({n:'Tiết kiệm '+th,co:da,can});
  goalProgress().filter(x=>x.thieu>0).forEach(x=>ds.push({n:x.g.name,co:x.co,can:x.g.target}));
  if(!ds.length)return '';
  return `<h2 class="hl"><i style="background:${gcA('#9A6B95')}"></i><b>Mục tiêu</b></h2><div class="panel">`
    +ds.map(x=>{const pc=x.can?Math.floor(x.co/x.can*100):0;
      return `<button class="mt1" onclick="go('trend')"><span class="l">${esc(x.n)}</span>
        <span class="fc-so"><b>${money(x.co)}</b> <span>/ ${money(x.can)}</span></span>
        <span class="mt-pc ${pc>=100?'du':'thieu'}">${pc}%</span></button>`;}).join('')+`</div>`;
}
/* nút "Xem chi tiết" chữ xanh (cùng màu "Mở tab Nhập") — thay chữ "Cách tính" (Vy 28/09) */
function nutXem(k,id){
  return `<button class="fold xct"${id?` id="${id}"`:''} style="margin-top:8px" onclick="toggle('${k}')">
    <span><span class="xomui" data-mui="${k}" data-a="▾" data-b="▸">${open[k]?'▾':'▸'}</span> Xem chi tiết</span></button>`;
}
function vHome(){
  const list=monthTx(cursor), chi=sumChi(list);
  const thuNhap=sum(list.filter(t=>t.t==='thu'&&['luong','thuong','tkhac'].includes(groupOf(t.c).id)));
  const now=new Date(), cur=ym(cursor)===ym(now);
  const passed=cur?now.getDate():daysIn(cursor);
  let h=cur?khoiChot()+khoiMucTieu():'';
  const bal=balances(), chk=bidvCheck();
  const tongDu=SRC.reduce((s2,x)=>s2+(bal[x.id]||0),0);
  h+=`<button class="strip" id="sec-bal" onclick="toggle('bal')">
      <span>${SRC.map(x=>'<span class="nw">'+esc(x.n.replace('Ví điện tử','Ví'))+' <b>'+money(bal[x.id]||0)+'</b></span>').join(' · ')}</span>
      <span class="strip-r">${money(tongDu)} <span class="xomui" data-mui="bal" data-a="▲" data-b="▼">${open.bal?'▲':'▼'}</span></span></button>`;
  if(1){ h+='<div class="xow" data-xo="'+("bal")+'" data-open="'+((open.bal)?1:0)+'">';
    h+=`<div class="sp"></div><div class="panel">`;
    SRC.forEach(x=>{
      const v=bal[x.id]||0;
      let note;
      if(x.id==='bidv'&&chk) note=chk.diff===0
        ? `<span class="khop">khớp ngân hàng lúc ${chk.at.d.slice(8,10)}/${chk.at.d.slice(5,7)}${chk.at.tm?' '+chk.at.tm:''}</span>`
        : `<span class="lech">lệch ${short(Math.abs(chk.diff))} so với ngân hàng</span>`;
      else{const c=DB.checks&&DB.checks[x.id];
        const ng=c?Math.floor((Date.now()-c)/864e5):null;
        note=c?(ng===0?'đã đối chiếu hôm nay':'đã đối chiếu '+ng+' ngày trước'):'chưa đối chiếu lần nào';}
      h+=`<div class="src"><div><div class="src-n">${x.n}</div><div class="src-m">${note}</div></div>
        <div><div class="src-a ${v<0?'neg':''}">${money(v)}</div>
        <button class="chk-btn" onclick="reconcile('${x.id}')">đối chiếu</button></div></div>`;
    });
    h+=`</div>`;
    h+='</div>';
  }


  /* Nhắc ghi sổ phải đứng ngoài nhánh if/else: tháng mới sang chưa có giao dịch nào
     thì vẫn phải nhắc, đó mới chính là lúc dễ quên nhất. */
  if(cur)h+=khoiNhacGhi();
  if(!list.length) h+=`<div class="empty"><b>Tháng này chưa có gì</b>Mở BIDV và ví, chụp giao dịch trong ngày, gửi vào chat của tháng rồi dán kết quả ở tab Nhập.</div>`;
  else{
    /* "Đã chi" = đúng dòng (3) Thực chi: cùng một chữ "chi" thì cùng một con số ở mọi chỗ.
       Không gồm cho mượn và trả nợ cá nhân; trả góp thì có (Vy 28/09/2026). */
    h+=`<div class="hero"><div class="lead">Đã chi trong ${MONTH(cursor.getMonth()).toLowerCase()}</div>
      <div class="sum">${money(bangTien(cursor).tongRa)}</div>
      <div class="sub">Thực chi`
      +(thuNhap?` · Thu nhập <b>${money(thuNhap)}</b>`:'')+`</div></div>`;

    /* Cảnh báo lên ngay dưới ô tổng chi: việc gấp phải nằm trên, không bị đẩy xuống
       dưới bản đồ khối như trước. Nền màu để không lẫn với các khối trắng bên dưới. */
    if(cur){
      const al=alerts();
      if(al.length)h+=`<div class="alerts">`
        +al.map(a=>`<button class="al ${a.cls}" onclick="jump('${a.k}')">
          <span class="ic">${a.cls==='grey'?'i':'!'}</span><span class="al-tx">${a.t}</span><span>›</span></button>`).join('')+`</div>`;
      if(open.chain)h+='<div class="xow" data-xo="chain">'+`<div class="sp"></div>`+chainPanel(open.chain)+'</div>';
    }

    const pa=pace(cursor);
    /* tháng đã đóng sổ thì nhịp chi hết nghĩa ("còn 0 ngày") — thay bằng bản tổng kết */
    if(!cur)h+=vTongKet();
    if(cur&&pa.duTru>0){
      const nhanh=pa.tyChi>pa.tyNgay;
      /* ngày cuối tháng không còn ngày nào để chia: còn bao nhiêu tiêu nốt bấy nhiêu hôm nay */
      /* Thực tế được tiêu = tiêu tự do ÷ số ngày còn lại tính cả hôm nay. Tiêu tự do = max(0, A1 − B)
         — tiền thật đã trừ nợ, cố định và phần phải để dành, cùng con số ở dòng trên của thẻ. */
      const qk=thanhKhoan(cursor);
      const chuan=pa.chuan, tuNay=pa.ngayCon?qk.tuDo/pa.ngayCon:0, lech=tuNay-chuan;
      /* Thẻ gọn (Vy duyệt 28/09): cặp số hiện tại → sau khi thu, một dòng cần để dành,
         hạn mức linh hoạt MỘT chỗ (bấm để xổ từng nhóm), hai ô ngày. Bảng tính nằm ở nút Cách tính. */
      const q=qk, dm=s=>s?s.slice(8,10)+"/"+s.slice(5,7):"", hmR=hmLinhHoat(pa);
      h+=`<h2 class="hl"><i style="background:${gcA('#5476C4')}"></i><b>Tổng ngân sách khả dụng</b>
        <em>${pa.ngayCon>1?'còn '+pa.ngayCon+' ngày':'ngày cuối tháng'}</em></h2>`;
      h+=`<div class="panel kd">
        <div class="kd-lb">Số tiền còn lại được dùng để chi</div>
        ${q.henTong
          ?`<div class="kd-hai"><div><b class="${q.A0<0?'am':'duong'}">${money(q.A0)}</b><span>hiện tại</span></div>
              <i>→</i><div><b class="sau">${money(q.A1)}</b><span>sau khi thu ${dm(q.henCuoi)}</span></div></div>`
          :`<div class="kd-mot"><b class="${q.A1<0?'am':'duong'}">${money(q.A1)}</b></div>`}
        ${q.B?`<div class="kd-need"><span class="fc-so"><span>cần để dành</span> <b>${money(q.B)}</b></span> · <span class="fc-k ${q.lan?'thieu':'du'}">${
          q.lan?'thiếu '+money(q.lan):'dư '+money(q.tuDo)}</span></div>`:''}
        ${q.treo.length?`<div class="kd-chip"><button onclick="go('debt')">${q.treo.length} khoản cho vay chưa hẹn ngày thu ›</button></div>`:''}
        <button class="kd-hm" onclick="toggle('hmk')"><span><span class="xomui" data-mui="hmk" data-a="▾" data-b="▸">${open.hmk?'▾':'▸'}</span> Hạn mức linh hoạt</span>
          <span class="fc-so"><b>${money(hmR.sV)}</b> <span>/ ${money(hmR.sB)}</span></span></button>
        <div class="pace kd-bar"><i style="width:${hmR.sB?Math.min(100,hmR.sV/hmR.sB*100):0}%;background:${hmR.vuot>0?'var(--brick)':nhanh?'var(--amber)':'var(--jade)'}"></i>
          <u style="left:${Math.min(100,pa.tyNgay*100)}%"></u></div>
        <div class="xow" data-xo="hmk" data-open="${open.hmk?1:0}">${hmR.html}</div>
        <div class="kd-tiles">
          <div class="kd-tile xanh"><span>ĐỊNH MỨC NGÀY</span><b>${money(chuan)}</b><small>kế hoạch</small></div>
          <div class="kd-tile"><span>THỰC TẾ ĐƯỢC TIÊU</span><b>${money(tuNay)}</b><small class="${qk.lan||lech<0?'am':'duong'}">${
            qk.lan?'đang lấn tiết kiệm':lech<0?'thấp hơn kế hoạch':'cao hơn kế hoạch'}</small></div>
        </div></div>`;
      h+=nutXem('pw');
      h+='<div class="xow" data-xo="pw" data-open="'+(open.pw?1:0)+'">'+paceWhy2(pa)+'</div>';

      /* nhóm nào sắp hết hoặc đã hết hạn mức — để quyết định nhanh có chi tiếp hay không */
      const hm=hanMucChuY(cursor);
      if(hm.length){
        const nHet=hm.filter(x=>x.xau).length, nSap=hm.length-nHet;
        const hu=(n,t,bg,tx)=>n?`<span style="font-size:10.5px;padding:2px 8px;border-radius:20px;font-weight:600;
          white-space:nowrap;background:var(--${bg});color:var(--${tx})">${n} ${t}</span>`:'';
        h+=`<h2 class="hl"><i style="background:${gcA('#E0801A')}"></i><b>Hạn mức cần chú ý</b>
          <span style="display:flex;gap:5px">${hu(nHet,'đã hết','errbg','errtx')}${hu(nSap,'sắp hết','warnbg','warntx')}</span></h2>`;
        /* thu gọn mặc định — Tổng quan quá dài (Vy 28/09); số nhóm đã hết / sắp hết vẫn ở tiêu đề */
        h+=nutXem('hmcy');
        {
          h+=`<div class="xow" data-xo="hmcy" data-open="${open.hmcy?1:0}"><div class="panel xct-bd" style="padding:2px 14px 12px">`;
          hm.forEach((x,i)=>{
            const bg=x.xau?'errbg':'warnbg', tx=x.xau?'errtx':'warntx';
            h+=`<div style="display:flex;align-items:flex-start;gap:10px;padding:12px 0${i?';border-top:1px solid var(--line-2)':''}">
              <span style="min-width:0;flex:1">
                <span style="display:flex;align-items:center;gap:7px;font-size:13.5px;font-weight:500;line-height:1.35">
                  <span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(x.g.sn||x.g.n)}</span>
                  <span style="font-size:10.5px;padding:2px 8px;border-radius:20px;font-weight:600;white-space:nowrap;
                    background:var(--${bg});color:var(--${tx})">${x.tag}</span></span>
                <span style="display:block;font-size:11.5px;color:var(--ink-3);margin-top:3px">${money(x.vLh)} / ${money(x.bLh)}</span>
                ${x.pcT===null?'':`<span style="display:block;font-size:11px;font-weight:600;margin-top:3px;
                     color:var(--brick)">▲ Vượt tháng trước ${Math.round(x.pcT*100)}%
                     <span style="color:var(--ink-3);font-weight:400">(${money(x.nayKy)} / ${money(x.truocKy)})</span></span>`}</span>
              <span style="text-align:right;white-space:nowrap">
                <span style="display:block;font-size:16px;font-weight:600;letter-spacing:-.02em;line-height:1.2;
                  color:${x.con<=0?'var(--brick)':'var(--ink)'}">${x.con<0?'−'+money(-x.con):money(x.con)}</span>
                <span style="display:block;font-size:10.5px;color:var(--ink-3);margin-top:2px">Còn lại</span></span></div>`;
          });
          h+=`<div style="display:flex;justify-content:space-between;gap:10px;align-items:center;
            margin-top:4px;padding-top:11px;border-top:1px solid var(--line-2)">
            <button class="chk-btn" onclick="buTuNhom()">Bù từ nhóm khác</button>
            <button class="chk-btn" style="color:var(--ink-3)" onclick="jump('over')">Xem ở tab Ngân sách →</button></div></div></div>`;
        }
      }
    }
    if(chi){
      h+=`<h2 class="hl"><i style="background:${gcA('#6E7480')}"></i><b>Cơ cấu chi tiêu</b><em>${money(chi)}</em></h2>${treemap(list,chi)}
        <div class="sp"></div><div class="stack-note"><span>Chạm một ô để xem giao dịch của nhóm đó.</span>
          ${!open.zoom&&byGroup(list).some(([id])=>groupOf(id).subs.length)?`<span>
            <button style="background:none;border:0;padding:0;color:var(--jade);font-weight:600;font-size:12.5px" onclick="askZoom()">chia nhỏ theo mục</button></span>`:''}</div>`;

  /* bấm ô cuối trong bản đồ khối thì hiện thẳng giao dịch tại đây */
      if(open.txCode){
        const gg=groupOf(open.txCode), isSub=open.txCode!==gg.id;
        const rows=list.filter(t=>t.t==='chi'&&(isSub?t.c===open.txCode:groupOf(t.c).id===open.txCode))
          .sort((a,b)=>(b.d+' '+(b.tm||'')).localeCompare(a.d+' '+(a.tm||'')));
        h+=`<div class="sp"></div><div class="stack-note" style="margin-bottom:8px"><span>
          <span class="spine" style="background:${gcA(gg.c)};height:12px;display:inline-block;margin-right:6px"></span>
          ${esc(labelOf(open.txCode))} · ${rows.length} giao dịch · ${money(sum(rows))}
          <button style="background:none;border:0;padding:0 0 0 8px;color:var(--jade);font-weight:600;font-size:12.5px" onclick="pickTx('')">đóng</button></span></div>
          <div class="panel">`;
        rows.forEach(t=>{h+=`<div class="tx"><span class="spine" style="background:${gg.c}"></span>
          <div class="tx-body"><div class="tx-n">${esc(t.n)}</div>
            <div class="tx-m">${t.d.slice(8,10)}/${t.d.slice(5,7)}${t.tm?' '+t.tm:''} · ${esc(srcOf(t.s).n)}</div></div>
          <div class="tx-a">−${money(t.a)}</div></div>`;});
        if(!rows.length)h+=`<div class="empty">Không có giao dịch</div>`;
        h+=`</div>`;
      }
    }
  }

  /* Tháng đã qua dừng lại ở Cơ cấu chi tiêu: bản tổng kết ở trên đã nói hết,
     cảnh báo hạn mức của tháng cũ không còn xử lý được nữa nên không hiện. */
  if(!cur){ if(msg)h+=`<div class="${msgType==='ok'?'ok':'err'}">${esc(msg)}</div>`; return h; }

  if((DB.income||0)>0){
    const f=forecast();
    /* Hai dòng: số dự báo IN ĐẬM cùng cỡ với số cần để dành (Vy: đậm hơn, không to hơn),
       thiếu / dư nằm ngay dưới. Không có kế hoạch để dành thì chỉ hiện số dự báo. */
    const HANG=(t,v,chua)=>{
      if(chua)return `<div class="fc-h"><span class="fc-l">${t}</span><div class="fc-r"><div class="fc-k">chưa ước được, đợi qua mùng 5</div></div></div>`;
      const k=v-f.B;
      return `<div class="fc-h"><span class="fc-l">${t}</span><div class="fc-r">
        <div class="fc-so"><b class="${v<0?'am':''}">${money(v)}</b>${f.B?` <span>/ ${money(f.B)}</span>`:''}</div>
        ${f.B?`<div class="fc-k ${k<0?'thieu':'du'}">${k<0?'thiếu '+money(-k):k?'dư '+money(k):'vừa đủ'}</div>`:''}</div></div>`;};
    h+=`<h2 class="hl"><i style="background:${gcA('#47897A')}"></i><b>Dự báo cuối tháng</b></h2>
      <div class="panel">${HANG('Tiêu đủ hạn mức',f.du1)}${HANG('Theo nhịp tiêu',f.du2,!f.duocUoc)}</div>`;
    h+=nutXem('fc','sec-fc');
    h+='<div class="xow" data-xo="fc" data-open="'+(open.fc?1:0)+'">'+cachTinhFc(f)+'</div>';
  }


  const dt=debtTotals();
  if(DB.debts.length){
    const soon=DB.debts.map(d=>dueLevel(debtInfo(d)))
      .filter(lv=>lv.k==='over'||lv.k==='now'||lv.k==='soon').length;
    h+=`<h2 class="hl"><i style="background:${gcA('#CF4640')}"></i><b>Nợ</b>
      <em>${soon?soon+' sắp hạn':''}</em></h2>`;
    h+=`<div class="nohai">
      <div class="nomot ra"><div class="nonhan">↑ KHOẢN PHẢI TRẢ</div>
        <div class="noso">${money(dt.no)}</div>
        <div class="noph">${DB.debts.filter(x=>x.kind!=='cho'&&debtInfo(x).left>0).length} khoản · tiền sẽ ra</div></div>
      <div class="nomot vao"><div class="nonhan">↓ KHOẢN CHỜ THU</div>
        <div class="noso">${money(dt.cho)}</div>
        <div class="noph">${DB.debts.filter(x=>x.kind==='cho'&&debtInfo(x).left>0).length} khoản · tiền sẽ vào</div></div>
    </div>`;
    h+=`<button class="fold" id="sec-debt" style="margin-top:0" onclick="toggle('nono')">
      <span style="font-size:13.5px"><span class="xomui" data-mui="nono" data-a="▾" data-b="▸">${open.nono?'▾':'▸'}</span> Xem từng khoản</span></button>`;
    if(1){ h+='<div class="xow" data-xo="'+("nono")+'" data-open="'+((open.nono)?1:0)+'">';
      h+=`<div class="panel" style="border-radius:0 0 var(--r) var(--r);border-top:0">`;
      /* chi liet ke khoan CHUA XONG — khoan da tat toan xem o tab No */
      const _con=x=>debtInfo(x).left>0;
      const _no=DB.debts.filter(x=>x.kind!=='cho'&&_con(x));
      const _cho=DB.debts.filter(x=>x.kind==='cho'&&_con(x));
      const _xong=DB.debts.length-_no.length-_cho.length;
      if(_no.length){h+=`<div class="nohd ra"><i></i><span>↑ KHOẢN PHẢI TRẢ</span>`
        +`<span style="margin-left:auto;font-weight:700">${money(dt.no)}</span></div>`;
        _no.forEach(d=>h+=debtRow(d));}
      if(_cho.length){h+=`<div class="nohd vao"><i></i><span>↓ KHOẢN CHỜ THU</span>`
        +`<span style="margin-left:auto;font-weight:700">${money(dt.cho)}</span></div>`;
        _cho.forEach(d=>h+=debtRow(d));}
      if(!_no.length&&!_cho.length)h+=`<div class="src" style="padding:13px 14px">`
        +`<div class="src-m">Không còn khoản nợ nào chưa xong.</div></div>`;
      if(_xong)h+=`<div class="src" style="padding:10px 14px">`
        +`<div class="src-m">${_xong} khoản đã tất toán — xem ở tab Nợ.</div></div>`;
      h+=`</div><div class="sp"></div><button class="btn ghost" onclick="go('debt')">Mở sổ nợ</button>`;
      h+='</div>';
    }
  }

  /* nhắc sao lưu đã nằm trong alerts() ở trên, bấm được để sang Cài đặt — không nhắc lại lần hai */
  if(msg)h+=`<div class="${msgType==='ok'?'ok':'err'}">${esc(msg)}</div>`;
  return h;
}

function vImport(){
  if(pending){
    const on=pending.filter(t=>t.keep), miss=pending.filter(needCat).length,
          ask=pending.filter(needRep).length;
    const tatCa=pending.length&&on.length===pending.length;
    let h=`<h2>Kiểm tra trước khi lưu</h2>`;
    h+=khoiBoQua();
    if(boQua.length)h+=`<div class="sp"></div>`;
    h+=`<div class="stack-note" style="margin-bottom:8px">
        <span>${on.length}/${pending.length} giao dịch đang được chọn</span>
        <span><button class="chk-btn" style="padding:0" onclick="togAll(${tatCa?0:1})">${
          tatCa?'bỏ chọn tất cả':'chọn tất cả'}</button></span></div>
      <div class="panel">`;
    pending.forEach((t,i)=>{
      h+=`<div class="rev ${t.keep?'':'off'}">
        <button class="chk ${t.keep?'on':''}" onclick="tog(${i})" aria-label="Chọn">${t.keep?'✓':''}</button>
        <div class="tx-body"><div class="tx-n">${esc(t.n)}</div>
          <div class="tx-m">${t.d.slice(8,10)}/${t.d.slice(5,7)}${t.tm?' '+t.tm:''} · ${srcOf(t.s).n} · ${t.t==='thu'?'tiền vào':t.t==='mv'?'chuyển tiền':'tiền ra'}</div>
          ${t.t==='mv'&&t.s2==='vi'&&!t.decided
            ? `<div class="ask">
                <div>Trả qua ví. Tiền đã bị trừ khỏi BIDV rồi — giờ nó đi đâu?</div>
                <button onclick="askSpend(${i})">Đã tiêu — tôi tự ghi mua gì</button>
                <button onclick="askKeep(${i})">Mới nạp, chưa tiêu</button>
              </div>`
          : t.t==='mv'
            ? `<div class="tag">BIDV → ${esc(srcOf(t.s2).n)} · tiền vẫn của Vy, chưa tính là chi</div>`
            : `${t.q?`<div class="hint">Quét QR nên không có tên nơi bán — Vy điền giúp.</div>`:''}
               <input class="rename" value="${esc(t.n)}" placeholder="${t.q?'Mua gì, ở đâu?':'Nội dung'}" onchange="setName(${i},this.value)">
               ${catBtn(t.c,t.t,'pending',i)}
               ${t.c&&groupOf(t.c).subs.length?`<button class="chk-btn" style="margin-left:8px" onclick="splitStart('pending',${i})">chia nhiều mục</button>`:''}
               ${t.w?`<div class="tag">qua ví ${esc(t.w)}</div>`:''}
               ${(()=>{const g=t.c?groupOf(t.c).id:'';const cho=g==='muon'&&t.t==='chi', vay=g==='divay'&&t.t==='thu';
                 return cho||vay?`<div class="rev-han"><div class="cat-meta" style="margin:8px 0 5px"><span>${cho?'Dự kiến thu lại ngày':'Dự kiến trả ngày'}</span></div>
                   ${dtInput('phan-'+i,t.han||'','toi','placeholder="dd/mm/yy · để trống nếu chưa biết" onchange="setHanP('+i+',this.value)"')}</div>`:'';})()}`}
          ${(()=>{const sf=suggestFixed(t);return sf?`<div class="ask" style="margin-top:8px">
            <div>Đây có phải khoản cố định "${esc(sf.name)}"? Gắn mã ${esc(t.p)} để tháng sau app tự nhận.</div>
            <button onclick="bindFixed('${sf.id}','${esc(t.p)}')">Gắn mã</button></div>`:'';})()}
          ${t.rep?`<div class="ask" style="margin-top:8px">
            <div>Sổ đã có khoản ${money(t.a)} cùng đối tác ngày <b>${ddmm(t.rep.d)}</b>${t.rep.n?' — "'+esc(t.rep.n)+'"':''}. Có thể ngày bị đọc sai.</div>
            <button style="${t.repDo===1?'font-weight:700;text-decoration:underline':''}" onclick="repYes(${i})">Thay khoản cũ</button>
            <button style="${t.repDo===0?'font-weight:700;text-decoration:underline':''}" onclick="repNo(${i})">Giữ cả hai</button>
            ${t.repDo===1?`<div class="hint" style="margin-top:6px">Sẽ xóa khoản ngày ${ddmm(t.rep.d)} khi lưu.</div>`
              :t.repDo===0?`<div class="hint" style="margin-top:6px">Sẽ ghi thêm một dòng, khoản cũ giữ nguyên.</div>`:''}
          </div>`:''}
          ${t.warn?`<div class="dup">${esc(t.warn)}</div>`:''}
                  </div>
        <div class="tx-a ${t.t==='thu'?'in':t.t==='mv'?'mv':''}">${t.t==='thu'?'+':''}${money(t.a)}</div></div>`;
    });
    h+=`</div><div class="sp"></div>`;
    /* Tổng của những dòng ĐANG ĐƯỢC CHỌN, để đối chiếu với app ngân hàng trước khi lưu.
       Chuyển tiền tách riêng vì nó không phải chi cũng không phải thu. */
    {
      const oChi=on.filter(t=>t.t==='chi'), oThu=on.filter(t=>t.t==='thu'), oMv=on.filter(t=>t.t==='mv');
      const sChi=oChi.reduce((s,t)=>s+t.a,0), sThu=oThu.reduce((s,t)=>s+t.a,0), sMv=oMv.reduce((s,t)=>s+t.a,0);
      const D=(nhan,soKhoan,tien,mau)=>soKhoan?`<div class="src" style="padding:10px 14px">
        <div><div class="src-n" style="font-size:13.5px">${nhan}</div>
          <div class="src-m">${soKhoan} giao dịch</div></div>
        <div class="src-a" style="font-size:15px;font-weight:700;color:${mau}">${money(tien)}</div></div>`:'';
      if(on.length)h+=`<div class="panel">
        <div class="daygroup dg-neu">SẮP GHI VÀO SỔ</div>
        ${D('Tiền ra',oChi.length,sChi,'var(--brick)')}
        ${D('Tiền vào',oThu.length,sThu,'var(--pos)')}
        ${D('Chuyển giữa các nguồn',oMv.length,sMv,'var(--ink-2)')}
        </div><div class="sp"></div>`;
    }
    if(miss)h+=`<div class="err">Còn ${miss} giao dịch chưa chọn nhóm.</div><div class="sp"></div>`;
    if(ask)h+=`<div class="err">Còn ${ask} giao dịch chưa chọn thay khoản cũ hay giữ cả hai.</div><div class="sp"></div>`;
    h+=`<button class="btn" ${on.length&&!miss&&!ask?'':'disabled'} onclick="commit()">Lưu ${on.length} giao dịch</button>
      <div class="sp"></div><button class="btn ghost" onclick="pending=null;render()">Quay lại</button>`;
    return h;
  }
  let h=`<h2>Dán kết quả đọc chi tiêu từ A.I</h2>
    <div class="stack-note"><span>Mở BIDV và ví, chụp các giao dịch trong ngày, thả vào chat của tháng, chép kết quả rồi dán xuống đây.</span></div>
    <div class="sp"></div>
    <textarea id="paste" rows="7" placeholder="2026-08-22 10:07 | vi | chi | 20000 | Nạp data Viettel | hd_dt |  | 0900000000"></textarea>
    <div class="sp"></div><button class="btn" onclick="doPaste()">Đọc kết quả</button>`;
  h+=khoiBoQua();
  if(msg)h+=`<div class="${msgType==='ok'?'ok':'err'}">${esc(msg)}</div>`;

  h+=`<h2>Ghi tay</h2><div class="panel">
    <div class="two">
      <div class="fld"><span>Loại</span><select id="mt" onchange="_mt=this.value;render()">
        ${[['chi','Chi'],['thu','Thu'],['mv','Chuyển tiền']].map(([v,n])=>`<option value="${v}" ${_mt===v?'selected':''}>${n}</option>`).join('')}</select></div>
      <div class="fld"><span>Số tiền</span><input id="ma" inputmode="text" placeholder="50k" value="${esc(mNhap.a)}" oninput="mNhap.a=this.value"></div>
    </div>
    <div class="fld"><span>Nội dung</span><input id="mn" placeholder="${_mt==='mv'?'Rút tiền mặt':'Cà phê sáng'}" value="${esc(mNhap.n)}" oninput="mNhap.n=this.value"></div>
    <div class="two">
      <div class="fld"><span>${_mt==='mv'?'Từ nguồn':'Nguồn tiền'}</span>
        <select id="msrc" onchange="mNhap.s=this.value">${SRC.map(s=>`<option value="${s.id}" ${s.id===(mNhap.s||(_mt==='chi'?'tm':'bidv'))?'selected':''}>${s.n}</option>`).join('')}</select></div>
      <div class="fld"><span>${_mt==='mv'?'Sang nguồn':'Nhóm'}</span>
        ${_mt==='mv'
          ? `<select id="ms2">${SRC.map(s=>`<option value="${s.id}" ${s.id==='tm'?'selected':''}>${s.n}</option>`).join('')}</select>`
          : catBtn(manualCode,_mt,'manual','0')}</div>
    </div>
    <div class="fld"><span>Ngày</span>${dtInput('md',mNhap.d||iso(new Date()),'qua','onchange="mNhapNgay(this)"')}</div>
    ${(()=>{const g=manualCode&&_mt!=='mv'?groupOf(manualCode).id:'';
      const vay=g==='divay'&&_mt==='thu', cho=g==='muon'&&_mt==='chi';
      return vay||cho?`<div class="fld fld-han"><span>${cho?'Ngày dự kiến thu':'Ngày dự kiến trả'}
        <em>— app tạo luôn khoản ${cho?'chờ thu':'phải trả'} bên tab Nợ</em></span>
        ${dtInput('mhan',mNhap.han,'toi','placeholder="dd/mm/yy · để trống nếu chưa biết" onchange="mNhapNgay(this)"')}${dtChips('mhan')}</div>`:'';})()}
  </div><div class="sp"></div><button class="btn ghost" onclick="addManual()">Thêm giao dịch</button>`;
  return h;
}
let _mt='chi';
/* chữ đang gõ ở phần Ghi tay — giữ lại khi mở bảng chọn nhóm rồi quay về, vì trang vẽ lại từ đầu */
let mNhap={a:'',n:'',s:'',d:'',han:''};
function mNhapNgay(el){const r=dtRead(el.value,el.dataset.huong);if(r!==null)mNhap[el.id==='mhan'?'han':'d']=r;}

let listF='all', listQ='', rowOpen='', selMode=false, selIds={};
function setListF(v){listF=v;render();}
function setListQ(v){listQ=v;render();}
function toggleRow(id){rowOpen=rowOpen===id?'':id;render();}
/* chọn nhiều dòng để xóa */
const selCount=()=>Object.keys(selIds).length;
function selStart(){selMode=true;rowOpen='';render();}
function selStop(){selMode=false;selIds={};render();}
function toggleSel(id){id=String(id);if(selIds[id])delete selIds[id];else selIds[id]=1;render();}
function selAll(){listFiltered().forEach(t=>selIds[String(t.id)]=1);render();}
function selNone(){selIds={};render();}
function delSel(){
  const ids=Object.keys(selIds);
  if(!ids.length){flash('Chưa chọn dòng nào.','err');return;}
  if(!confirm('Xóa '+ids.length+' giao dịch đã chọn? Không khôi phục được.'))return;
  const s=new Set(ids);
  if(!hoiChot(DB.txns.filter(x=>s.has(String(x.id))).map(x=>x.d)))return;
  DB.txns=DB.txns.filter(x=>!s.has(String(x.id)));
  selIds={}; selMode=false; save(); flash('Đã xóa '+ids.length+' giao dịch.','ok');
}
function listFiltered(){
  let list=monthTx(cursor).slice().sort((a,b)=>(b.d+' '+(b.tm||'')).localeCompare(a.d+' '+(a.tm||'')));
  if(filterCode){
    const g=groupOf(filterCode), isSub=filterCode!==g.id;
    list=list.filter(t=>isSub?t.c===filterCode:groupOf(t.c).id===filterCode);
  }
  if(listF!=='all')list=list.filter(t=>listF==='mv'?(t.t==='mv'||t.t==='dc'):t.t===listF);
  const q=noAccent(listQ.trim());
  if(q)list=list.filter(t=>noAccent(t.n).indexOf(q)>=0||noAccent(labelOf(t.c)).indexOf(q)>=0);
  return list;
}
function vList(){
  const list=listFiltered();
  let chip='';
  if(filterCode){
    const g=groupOf(filterCode), isSub=filterCode!==g.id;
    chip=`<button class="chip" onclick="clearFilter()">
      <span class="spine" style="background:${gcA(g.c)};height:14px"></span>
      ${esc(g.n)}${isSub?' › '+esc(labelOf(filterCode)):''} · ${money(sumChi(list))} <b>✕</b></button>`;
  }

  let h=chip+`<div style="display:flex;gap:6px;margin:14px 0 9px">`
    +[['all','Tất cả'],['chi','Chi'],['thu','Thu'],['mv','Chuyển']].map(([k,n])=>
      `<button class="chip" style="margin-top:0;padding:6px 12px;font-size:12px;${listF===k?'background:var(--jade);color:var(--onacc);border-color:var(--jade)':''}" onclick="setListF('${k}')">${n}</button>`).join('')
    +`<button class="chip" style="margin-top:0;margin-left:auto;padding:6px 12px;font-size:12px;${selMode?'background:var(--jade);color:var(--onacc);border-color:var(--jade)':''}" onclick="${selMode?'selStop()':'selStart()'}">${selMode?'Xong':'Chọn nhiều'}</button>`
    +`</div><input class="rename" style="margin:0 0 12px" value="${esc(listQ)}" placeholder="Tìm theo nội dung" oninput="setListQ(this.value)">`;
  if(selMode){
    const n=selCount();
    h+=`<div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:10px;padding:10px 12px;
        background:var(--row);border:1px solid var(--line);border-radius:10px;font-size:13px">
      <span>Đã chọn <b>${n}</b></span>
      <button class="chk-btn" onclick="selAll()">Chọn tất cả</button>
      <button class="chk-btn" onclick="selNone()">Bỏ chọn</button>
      <button class="chk-btn" style="color:var(--brick);margin-left:auto;${n?'':'opacity:.4'}" onclick="delSel()">Xóa ${n?n+' dòng':''}</button>
    </div>`;
  }

  if(!list.length)return h+`<div class="empty"><b>Không có giao dịch</b>Thử bỏ bớt bộ lọc.</div>`;
  h+=`<div class="stack-note" style="margin-bottom:8px"><span>${list.length} giao dịch · chi ${money(sumChi(list))}</span></div><div class="panel">`;
  let last=''; const DOW=['Chủ nhật','Thứ hai','Thứ ba','Thứ tư','Thứ năm','Thứ sáu','Thứ bảy'];
  list.forEach(t=>{
    if(t.d!==last){last=t.d;const dd=new Date(t.d+'T00:00');
      h+=`<div class="daygroup">${DOW[dd.getDay()]}, ${dd.getDate()}/${dd.getMonth()+1} — ${money(sumChi(list.filter(x=>x.d===t.d)))}</div>`;}
    const g=groupOf(t.c), col=t.t==='thu'?'var(--pos)':(t.t==='mv'||t.t==='dc')?'var(--ink-3)':g.c;
    const meta=[t.tm, t.t==='mv'?srcOf(t.s).n+' → '+srcOf(t.s2).n:t.t==='dc'?'điều chỉnh':srcOf(t.s).n, t.w?'ví '+esc(t.w):''].filter(Boolean).join(' · ');
    const sign=t.t==='thu'?'+':t.t==='mv'?'':t.t==='dc'?(t.dir==='-'?'−':'+'):'−';
    const picked=!!selIds[String(t.id)];
    h+=`<div class="tx" style="cursor:pointer${picked?';background:var(--row)':''}" onclick="${selMode?`toggleSel('${t.id}')`:`toggleRow('${t.id}')`}">
      ${selMode
        ? `<button class="chk ${picked?'on':''}" style="flex:none;margin-right:10px" aria-label="Chọn" onclick="event.stopPropagation();toggleSel('${t.id}')">${picked?'✓':''}</button>`
        : `<span class="spine" style="background:${gcA(col)}"></span>`}
      <div class="tx-body"><div class="tx-n">${esc(t.n)}</div>
        <div class="tx-m">${meta}${(t.t==='chi'||t.t==='thu')?' · <span style="color:var(--ink-2)">'+esc(labelOf(t.c))+'</span>':''}</div></div>
      <div class="tx-a ${t.t==='thu'?'in':(t.t==='mv'||t.t==='dc')?'mv':''}">${sign}${money(t.a)}</div></div>`;
    if(!selMode&&rowOpen===String(t.id)){
      h+=`<div style="padding:0 14px 13px 28px;background:var(--row);border-bottom:1px solid var(--line-2)">
        ${(t.t==='chi'||t.t==='thu')?`<div class="cat-meta" style="margin:0 0 7px"><span>Nhóm</span></div>${catBtn(t.c,t.t,'txn',t.id)}`:''}
        <div style="display:flex;gap:8px;margin-top:9px" onclick="event.stopPropagation()">
          <div style="flex:1"><div class="cat-meta" style="margin:0 0 5px"><span>Ngày</span></div>
            ${dtInput('td-'+t.id,t.d,'qua',`onchange="setDate('${t.id}',this.value)"`)}</div>
          <div style="width:112px"><div class="cat-meta" style="margin:0 0 5px"><span>Giờ</span></div>
            <input type="time" value="${t.tm||''}" onchange="setTime('${t.id}',this.value)"
              class="dt" style="width:100%"></div>
        </div>
        <div style="display:flex;gap:16px;margin-top:11px">
          <button class="chk-btn" onclick="event.stopPropagation();editName('${t.id}')">Sửa nội dung</button>
          ${(t.t==='chi'||t.t==='thu')&&groupOf(t.c).subs.length?`<button class="chk-btn" onclick="event.stopPropagation();splitStart('txn','${t.id}')">Tách nhiều mục</button>`:''}
          <button class="chk-btn" style="color:var(--brick);margin-left:auto" onclick="event.stopPropagation();del('${t.id}')">Xóa</button></div></div>`;
    }
  });
  return h+`</div>`;
}

/* ==================== mục tiêu tài chính ==================== */
function goalList(){
  return [{id:'__ef',name:'Quỹ dự phòng',target:efTarget(),auto:1}].concat(DB.goals||[]);
}
/* số tháng từ tháng này tới hạn mong muốn, ít nhất là 1 */
function monthsTo(due){
  if(!due)return 0;
  const now=new Date();
  const k=(+due.slice(0,4)-now.getFullYear())*12+(+due.slice(5,7)-1-now.getMonth());
  return Math.max(1,k);
}
/* tiền đã có rót lần lượt theo thứ tự ưu tiên, đầy mục tiêu trước mới sang sau */
function goalFill(){
  let con=Math.max(0,emergencyFund().quy-earmarked(cursor));
  return goalList().map(g=>{
    const co=Math.min(con,g.target||0); con-=co;
    return {g,co,thieu:Math.max(0,(g.target||0)-co)};
  });
}
/* Góp mục tiêu mỗi tháng — MỘT con số duy nhất, hoặc Vy đặt tay hoặc app tự tính
   từ các mục tiêu có ghi hạn. Khoản này ưu tiên như chi phí cố định: trừ ngay từ
   đầu để biết còn được chi bao nhiêu, chứ không phải phần thừa cuối tháng. */
const gopCua=g=>Math.max(0,(g.auto?DB.efGop:g.gop)||0);   /* mức góp riêng của một mục tiêu */
function goalMonthly(){
  const gp=DB.goalPlan||{};
  /* Vy đặt mức riêng cho từng mục tiêu thì tổng góp là tổng các mức đó */
  if(gp.mode==='each')return goalList().reduce((s,g)=>s+gopCua(g),0);
  if(gp.mode==='manual')return Math.max(0,gp.a||0);
  let t=0;
  goalFill().forEach(x=>{ if(x.thieu&&x.g.due)t+=x.thieu/monthsTo(x.g.due); });
  return Math.round(t/1000)*1000;
}
/* đặt mức góp riêng cho một mục tiêu, tự chuyển sang chế độ góp riêng */
function suaMucGop(id){
  const g=goalList().find(x=>x.id===id); if(!g)return;
  const cu=gopCua(g);
  const s=prompt('Mỗi tháng góp bao nhiêu cho "'+g.name+'"?', cu?money(cu):'');
  if(s===null)return;
  const n=parseAmt(s);
  if(String(s).trim()&&isNaN(n)){flash('Không đọc được số tiền.','err');return;}
  const v=String(s).trim()?Math.max(0,n):0;
  if(g.auto)DB.efGop=v; else{const t=(DB.goals||[]).find(x=>x.id===id); if(t)t.gop=v;}
  DB.goalPlan=Object.assign({},DB.goalPlan,{mode:'each'});
  save(); flash('Đã đặt mức góp '+money(v)+' mỗi tháng cho '+g.name+'.','ok');
}
function goalProgress(){
  const thang=goalMonthly();
  let don=0;
  return goalFill().map(x=>{
    don+=x.thieu;
    const soThang=thang?Math.ceil(don/thang):null;
    const eta=soThang!==null&&x.thieu>0?addMonths(iso(new Date()),soThang):'';
    const canMonth=x.g.due&&x.thieu?Math.ceil(x.thieu/monthsTo(x.g.due)/1000)*1000:0;
    return Object.assign({},x,{thang,soThang,eta,canMonth});
  });
}
function editEf(){
  const v=prompt('Mục tiêu quỹ dự phòng — để trống thì app tự tính bằng 3 lần chi phí trung bình ('+money(efAuto())+'):',
    DB.efTarget?money(DB.efTarget):'');
  if(v===null)return;
  const t=(v||'').trim();
  if(!t){DB.efTarget=0;save();flash('Quỹ dự phòng quay về tự tính.','ok');return;}
  const a=parseAmt(t);
  if(!a||isNaN(a)){flash('Số tiền chưa hợp lệ.','err');return;}
  DB.efTarget=a;save();flash('Đã đặt mục tiêu quỹ dự phòng.','ok');
}
function editGoalPlan(){
  const gp=DB.goalPlan||{};
  const v=prompt('Góp mục tiêu mỗi tháng — để trống thì app tự tính từ các mục tiêu có ghi hạn:',
    gp.mode==='manual'?money(gp.a||0):'');
  if(v===null)return;
  const t=(v||'').trim();
  if(!t){DB.goalPlan={mode:'auto',a:0};save();flash('Mức góp quay về tự tính.','ok');return;}
  const a=parseAmt(t);
  if(isNaN(a)){flash('Số tiền chưa hợp lệ.','err');return;}
  DB.goalPlan={mode:'manual',a:Math.max(0,a)};save();flash('Đã đặt mức góp mỗi tháng.','ok');
}
function addGoal(){
  const n=(document.getElementById('gn').value||'').trim();
  const a=parseAmt(document.getElementById('ga').value||'');
  const du=(document.getElementById('gd').value||'').trim();
  if(!n){flash('Chưa đặt tên mục tiêu.','err');return;}
  if(!a||isNaN(a)){flash('Số tiền chưa hợp lệ.','err');return;}
  DB.goals=(DB.goals||[]).concat([{id:'g'+Date.now(),name:n.slice(0,40),target:a,due:du||''}]);
  save();flash('Đã thêm mục tiêu.','ok');
}
function delGoal(id){DB.goals=(DB.goals||[]).filter(x=>x.id!==id);save();render();}
function moveGoal(id,dir){
  const gs=(DB.goals||[]).slice(), i2=gs.findIndex(x=>x.id===id);
  if(i2<0)return; const j2=i2+dir; if(j2<0||j2>=gs.length)return;
  const t=gs[i2];gs[i2]=gs[j2];gs[j2]=t;DB.goals=gs;save();render();
}

function vTrend(){
  const months=[];
  for(let k=5;k>=0;k--){const d=new Date(cursor.getFullYear(),cursor.getMonth()-k,1);
    const chi=sumChi(monthTx(d));
    const thu=sum(monthTx(d).filter(t=>t.t==='thu'&&['luong','thuong','tkhac'].includes(groupOf(t.c).id)));
    const tk=sum(monthTx(d).filter(t=>t.t==='chi'&&groupOf(t.c).id==='tk'));
    months.push({d,chi,thu,tk,ty:thu?tk/thu:0});
  }
  const co=months.some(m=>m.chi||m.thu);
  if(!co)return `<div class="empty"><b>Chưa đủ dữ liệu</b>Sau vài tháng ghi chép, xu hướng sẽ hiện ở đây.</div>`;

  const tong=months.reduce((s2,m)=>s2+m.chi,0), tb=tong/6, mx=Math.max(...months.map(m=>m.chi),1);
  let h=`<div style="margin-bottom:14px">
    <div class="src-m">Chi tiêu sáu tháng gần nhất</div>
    <div style="font-size:27px;font-weight:600;letter-spacing:-.02em;margin:2px 0">${money(tong)}</div>
    <div class="src-m">trung bình ${money(tb)} mỗi tháng</div></div>
    <div style="position:relative;display:flex;align-items:flex-end;gap:9px;height:96px">
      <div style="position:absolute;left:0;right:0;bottom:${(tb/mx*100).toFixed(1)}%;border-top:1px dashed var(--line)"></div>`;
  months.forEach((m,k)=>{h+=`<div class="bcol"><em>${m.chi?short(m.chi):''}</em>
    <i class="${k===5?'cur':''}" style="height:${m.chi/mx*100}%"></i></div>`;});
  h+=`</div><div style="display:flex;gap:9px;margin-top:5px">`
    +months.map((m,k)=>`<span style="flex:1;text-align:center;font-size:10.5px;color:${k===5?'var(--ink)':'var(--ink-3)'}">${m.d.getMonth()+1}</span>`).join('')
    +`</div><div class="stack-note" style="margin-top:7px"><span>Đường đứt là mức trung bình sáu tháng</span></div>`;

  /* tỷ lệ tiết kiệm */
  const dat=months.filter(m=>m.thu&&m.ty>=0.25).length, coThu=months.filter(m=>m.thu).length;
  if(coThu){
    const mxt=Math.max(0.35,...months.map(m=>m.ty));
    h+=`<h2>Tỷ lệ tiết kiệm theo tháng</h2>
      <div style="position:relative;display:flex;align-items:flex-end;gap:9px;height:64px">
        <div style="position:absolute;left:0;right:0;bottom:${(0.25/mxt*100).toFixed(1)}%;border-top:1px dashed var(--jade)"></div>`;
    months.forEach(m=>{h+=`<div class="bcol"><em>${m.thu?Math.round(m.ty*100)+'%':''}</em>
      <i style="height:${m.thu?(m.ty/mxt*100):0}%;background:${m.ty>=0.25?'var(--jade)':'var(--tinttx2)'};opacity:1"></i></div>`;});
    h+=`</div><div class="stack-note" style="margin-top:7px"><span>Đường đứt là mục tiêu 25% · đạt ${dat} trong ${coThu} tháng</span></div>`;
  }

  /* mục tiêu tài chính */
  const gp=goalProgress(), f2inc=DB.income||0;
  h+=`<div style="display:flex;justify-content:space-between;align-items:baseline;margin:26px 0 8px">
    <span style="font-size:13.5px;font-weight:600;color:var(--ink-2)">Mục tiêu tài chính</span>
    <button class="chk-btn" onclick="toggle('gadd')"><span class="xomui" data-mui="gadd" data-a="đóng" data-b="+ Thêm">${open.gadd?'đóng':'+ Thêm'}</span></button></div>
    <div class="stack-note" style="margin-bottom:8px"><span>Góp mỗi tháng <b>${money(goalMonthly())}</b>
      · ${(DB.goalPlan||{}).mode==='each'?'Vy đặt riêng từng mục tiêu':(DB.goalPlan||{}).mode==='manual'?'Vy tự đặt một số chung':'app tự tính từ mục tiêu có hạn'}
      <button style="background:none;border:0;padding:0 0 0 6px;color:var(--jade);font-weight:600;font-size:12.5px;text-decoration:underline" onclick="editGoalPlan()">sửa</button></span>
      <span>Khoản này bị trừ ngay sau chi phí cố định và trả nợ, trước khi chia hạn mức linh hoạt.</span></div>`;
  if(1){ h+='<div class="xow" data-xo="'+("gadd")+'" data-open="'+((open.gadd)?1:0)+'">';
    h+=`<div class="panel" style="margin-bottom:10px">
      <div class="fld"><span>Tên mục tiêu</span><input id="gn" placeholder="Tiết kiệm 100 triệu"></div>
      <div class="two"><div class="fld"><span>Số tiền</span><input id="ga" inputmode="text" placeholder="100tr"></div>
        <div class="fld"><span>Mong muốn đạt</span><input id="gd" type="month"></div></div>
    </div><button class="btn ghost" onclick="addGoal()">Thêm mục tiêu</button><div class="sp"></div>`;
    h+='</div>';
  }
  const xong=gp.filter(x=>x.thieu<=0), dang=gp.filter(x=>x.thieu>0);
  if(dang.length)h+=`<div class="stack-note" style="margin-bottom:6px"><span>ĐANG THỰC HIỆN</span></div>`;
  h+=`<div class="panel">`;
  gp.sort((a,b)=>(a.thieu>0?0:1)-(b.thieu>0?0:1)).forEach((x,k)=>{
    const g=x.g, pct=g.target?Math.min(100,x.co/g.target*100):0, xong=g.target>0&&x.thieu<=0;
    const tre=g.due&&x.eta&&x.eta.slice(0,7)>g.due;
    h+=`<div style="padding:12px;border-bottom:1px solid var(--line-2);border-left:3px solid ${x.co>0?'var(--jade)':'var(--ink-3)'}">
      <div class="cat-top"><span style="font-size:13.5px;font-weight:500">${k+1} · ${esc(g.name)}</span>
        <span style="font-size:13px;font-weight:500;${x.co?'':'color:var(--ink-3)'}">${money(x.co)}</span></div>
      <div class="track" style="height:6px;margin:8px 0 6px"><i style="width:${pct}%;background:${xong?'var(--pos)':'var(--jade)'}"></i></div>
      <div class="cat-meta"><span>mục tiêu ${g.target?money(g.target):'chưa đặt'}${g.auto?(DB.efTarget?' · Vy tự đặt':' · 3 tháng chi phí'):''}${g.due?' · mong muốn '+g.due.slice(5)+'/'+g.due.slice(0,4):''}</span>
        <span style="${tre?'color:var(--amber);font-weight:500':''}">${!g.target?'chưa đủ dữ liệu':xong?'đã đủ':x.eta?'đủ vào '+x.eta.slice(5,7)+'/'+x.eta.slice(0,4):'chưa đặt mức góp'}</span></div>
      ${g.target&&x.thieu?`<div class="cat-meta" style="margin-top:3px"><span style="color:var(--tinttx)">${
        x.canMonth?'cần góp '+money(x.canMonth)+' mỗi tháng cho kịp hạn'+(f2inc?' · '+Math.round(x.canMonth/f2inc*100)+'% thu nhập':'')
        :x.thang?'với '+money(x.thang)+' mỗi tháng thì còn '+x.soThang+' tháng nữa'
        :'chưa đặt mức góp nên chưa ước được'}</span></div>`:''}
      ${g.auto?`<div class="cat-meta" style="margin-top:3px"><span>${DB.efTarget?'Vy tự đặt':'app tự tính bằng 3 lần chi phí trung bình'+(emergencyFund().tam?', tạm lấy tháng đang chạy vì chưa đủ tháng cũ':emergencyFund().n<3?', tạm tính từ '+emergencyFund().n+' tháng':'')}</span>
          <button class="chk-btn" onclick="editEf()">sửa mức</button></div>`
        :`<div style="margin-top:7px"><button class="chk-btn" onclick="moveGoal('${g.id}',-1)">▲</button>
          <button class="chk-btn" style="margin-left:10px" onclick="moveGoal('${g.id}',1)">▼</button>
          <button class="chk-btn" style="color:var(--brick);margin-left:14px" onclick="delGoal('${g.id}')">xóa</button></div>`}
    </div>`;
  });
  h+=`</div>`;
  const quy=emergencyFund().quy, em=earmarked(cursor);
  h+=`<div class="sp"></div><div class="panel" style="padding:11px 12px">
    <div class="cat-meta"><span>Số dư tiết kiệm</span><span style="color:var(--ink);font-weight:500">${money(quy)}</span></div>
    <div class="cat-meta" style="margin-top:5px"><span>− Hạn mức tồn các nhóm giữ chỗ</span><span>${money(em)}</span></div>
    <div class="cat-meta" style="margin-top:7px;padding-top:7px;border-top:1px solid var(--line-2)">
      <span>Dành cho mục tiêu</span><span style="color:var(--ink);font-weight:600">${money(Math.max(0,quy-em))}</span></div></div>`;

  /* so nhóm với tháng trước */
  const nowL=monthTx(months[5].d), prevL=monthTx(months[4].d);
  const a=byGroup(nowL), bMap=Object.fromEntries(byGroup(prevL));
  if(a.length){
    let mxCh=null;
    a.forEach(([id,v])=>{const pv=bMap[id]||0;if(pv){const d2=(v-pv)/pv*100;if(!mxCh||Math.abs(d2)>Math.abs(mxCh.d))mxCh={n:groupOf(id).sn||groupOf(id).n,d:d2};}});
    h+=`<button class="fold" onclick="toggle('sos')">
      <span><span class="xomui" data-mui="sos" data-a="▾" data-b="▸">${open.sos?'▾':'▸'}</span> So nhóm với tháng trước</span>
      <span style="font-size:12px;color:${mxCh&&mxCh.d>0?'var(--amber)':'var(--ink-3)'}">${mxCh?esc(mxCh.n)+' '+(mxCh.d>0?'+':'')+Math.round(mxCh.d)+'%':a.length+' nhóm'}</span></button>`;
    if(1){ h+='<div class="xow" data-xo="'+("sos")+'" data-open="'+((open.sos)?1:0)+'">';
      h+=`<div class="panel" style="border-radius:0 0 var(--r) var(--r);border-top:0">`;
      a.forEach(([id,v])=>{const g=groupOf(id), pv=bMap[id]||0, dd2=pv?(v-pv)/pv*100:null;
        h+=`<div class="cat"><span class="spine" style="background:${gcA(g.c)}"></span><span class="cat-body">
          <span class="cat-top"><span class="cat-name">${esc(g.n)}</span><span class="cat-amt">${money(v)}</span></span>
          <span class="cat-meta"><span>tháng trước ${pv?money(pv):'—'}</span>
          <span style="color:${dd2===null?'var(--ink-3)':Math.abs(dd2)<10?'var(--ink-3)':dd2>0?'var(--amber)':'var(--pos)'};font-weight:500">${dd2===null?'mới':(dd2>0?'+':'')+Math.round(dd2)+'%'}</span>
          </span></span></div>`;});
      h+=`</div>`;
      h+='</div>';
    }
  }
  if(msg)h+=`<div class="${msgType==='ok'?'ok':'err'}">${esc(msg)}</div>`;
  return h;
}

function vInfo(){
  const R=[
   ['Số dư mỗi nguồn','số dư ban đầu + tiền vào − tiền ra ± chuyển giữa các nguồn ± dòng điều chỉnh khi đối chiếu.'],
   ['Đối chiếu BIDV','so số app tính tại đúng thời điểm ngân hàng báo số dư với số dư đó, không so với hôm nay.'],
   ['Chuỗi số dư','lấy hai mốc ngân hàng có báo số dư, cộng dồn mọi giao dịch BIDV ở giữa xem có ra số dư sau không. Các mảnh của một giao dịch đã tách được gộp lại, dòng điều chỉnh không tính. Giao dịch chưa ghi giờ bị xếp vào 00:00 nên có thể rơi nhầm khoảng — app tự nhận ra và nói rõ trong cảnh báo. Bấm vào cảnh báo để soi từng khoảng; xác nhận rồi thì mốc đó không báo lại.'],
   ['Thu nhập','chỉ cộng ba nhóm Lương, Thưởng, Thu khác. Đi vay và Thu nợ không phải thu nhập.'],
   ['Nguồn khả dụng','tổng thu nhập − chi phí cố định − nghĩa vụ nợ trong kỳ. Đây là phần Vy có quyền chia.'],
   ['Tổng quan tháng này','số dư đầu tháng + Thực thu − Thực chi − Tiền đang cho vay − Trả nợ cá nhân, ra đúng số dư hiện tại. Kiểm được bằng cách so với sao kê.'],
   ['Thực thu','tiền đã vào trong tháng: lương từng kỳ, thưởng, thu khác, và dòng điều chỉnh khi đối chiếu. KHÔNG tính thu nợ và tiền đi vay — đó không phải tiền Vy kiếm được, để vào làm Thực thu phồng lên. Trong đó lương + thưởng + thu khác là Thu nhập, app ghi riêng ngay dưới tiêu đề.'],
   ['Thực chi','tiền đã ra trong tháng: chi linh hoạt · chi phí cố định · trả góp · chuyển vào Tiết kiệm & Đầu tư. KHÔNG tính cho mượn và trả nợ cá nhân — hai khoản đó sang hai dòng riêng. Trả góp vẫn ở đây vì đó là tiền đi hẳn mỗi tháng.'],
   ['Tiền đang cho vay','cho mượn trong tháng trừ thu nợ đã về. Dương là tiền còn nằm ở người khác, trừ vào số dư. Tháng nào thu về nhiều hơn cho mượn thì dòng đổi tên thành "Thu nợ về" và cộng vào.'],
   ['Trả nợ cá nhân','trả nợ cá nhân trong tháng trừ tiền đi vay. Dương là nợ giảm được, trừ vào số dư. Tháng nào vay nhiều hơn trả thì dòng đổi tên thành "Đi vay" và cộng vào. Trả góp không nằm ở đây mà ở Thực chi.'],
   ['Chi linh hoạt','tổng mọi giao dịch chi trong tháng sau khi bỏ ra bốn thứ: các khoản đã khớp chi phí cố định, nhóm Tiết kiệm & Đầu tư, nhóm Trả nợ, nhóm Cho mượn. Đây là phần Vy tự quyết định tiêu, và là con số mà Hạn mức linh hoạt dùng để kiểm soát.'],
   ['Số dư cuối tháng','cộng lại từ số dư đầu sổ, chỉ lấy giao dịch tới hết tháng đang xem. Không lấy số dư hôm nay, vì xem lại tháng cũ mà lấy số dư hôm nay là sai ngay khi tháng sau đã có giao dịch.'],
   ['Hạn mức linh hoạt','tổng hạn mức các nhóm linh hoạt, trừ Tiết kiệm, trừ Trả nợ, trừ Cho mượn, cộng khoản bù qua lại giữa các nhóm và phần hạn mức tồn đã chủ động rút trong tháng. Tên cũ là "Được tiêu cả tháng".'],

   ['Số tiền còn lại được dùng để chi','khởi từ TIỀN THẬT, không khởi từ hạn mức. Lấy số dư hiện tại, cộng lương kế hoạch chưa về, trừ nợ CÒN PHẢI trả trong tháng, trừ chi phí cố định CHƯA trả. Nếu có khoản cho vay đã hẹn ngày thu trong tháng thì cộng thêm, và app hiện hai số cạnh nhau: bây giờ và sau khi thu về. Khoản cho vay chưa hẹn ngày KHÔNG được cộng — app chỉ ghi nhận là còn khoản chưa thu.'],
   ['Cần để dành','tiền Tiết kiệm & Đầu tư còn phải chuyển trong tháng, cộng mức góp Quỹ dự phòng. Đem so với Số tiền còn lại được dùng để chi: dư ra thì tiêu tự do phần dư mà vẫn để dành đủ; thiếu thì app ghi đang vượt quá số cần để dành bao nhiêu. Luôn chỉ một trong hai dòng có số, dòng kia bằng 0.'],
   ['Hạn mức cần chú ý','xét riêng phần linh hoạt của từng nhóm: hạn mức trừ đi khoản cố định của nhóm, đã chi trừ đi phần cố định đã trả. Nhóm hiện lên khi tiêu quá hạn mức (đã vượt), tiêu vừa hết (đã hết), đã dùng từ 80% trở lên (sắp hết), hoặc đã dùng vượt nhịp tháng quá 15 điểm phần trăm (tiêu nhanh). Nhóm thuần chi phí cố định không xét. Xếp nhóm dùng nhiều phần trăm nhất lên đầu.'],
   ['Nhịp tiêu — mẫu số','tổng hạn mức các nhóm linh hoạt, trừ Tiết kiệm, trừ Trả nợ, trừ Cho mượn, cộng khoản bù qua lại giữa các nhóm và phần hạn mức tồn đã chủ động rút trong tháng.'],
   ['Nhịp tiêu — tử số','tổng chi cùng phạm vi, loại giao dịch đã khớp chi phí cố định — kể cả khoản cố định chưa gắn mã, khớp theo số tiền xấp xỉ 15%. Chạm vào khối Số tiền còn lại được dùng để chi để xem bảng số nào trừ số nào.'],
   ['Định mức ngày','KẾ HOẠCH mỗi ngày: hạn mức linh hoạt chia số ngày trong tháng, cố định suốt tháng. Ví dụ 5.050.000 ÷ 30 = 168.333.'],
   ['Thực tế được tiêu','tiền THẬT còn tiêu tự do chia số ngày còn lại, TÍNH CẢ HÔM NAY. Tiêu tự do là Số tiền còn lại được dùng để chi trừ phần cần để dành — đúng con số ở dòng trên cùng thẻ. Khi đang lấn phần để dành thì ô này bằng 0 và ghi rõ đang lấn bao nhiêu. So với Định mức ngày: thấp hơn là đỏ, cao hơn là xanh. Ngày cuối tháng chia cho 1 ngày.'],
   ['Dự báo cuối tháng — tiêu đủ hạn mức','đoán SỐ DƯ CUỐI THÁNG, đúng con số tháng đóng sổ kết ở đó. Lấy Số tiền còn lại được dùng để chi (tiền thật đã trừ nợ, cố định chưa trả, cộng thu nợ đã hẹn) trừ hạn mức linh hoạt còn lại của từng nhóm. Đặt cạnh phần cần để dành: thấp hơn thì ghi thiếu bao nhiêu, cao hơn thì ghi dư.'],
   ['Dự báo cuối tháng — theo nhịp tiêu','như trên, nhưng khoản Vy đánh dấu KHÔNG KIỂM SOÁT ĐƯỢC (mặc định Ăn uống, Chợ & siêu thị, Xăng xe) tính theo đà: đã tiêu chia số ngày đã qua nhân số ngày còn lại. Khoản khác chỉ tiêu trong phần hạn mức còn lại, vì hết hạn mức thì Vy thôi chi. Nhóm chỉ có vài mục con không kiểm soát thì lấy số lớn hơn giữa đà của các mục đó và hạn mức còn của cả nhóm. Mỗi nhóm làm tròn ra đồng rồi mới cộng. Trước ngày 5 không ước. Chọn khoản không kiểm soát ở cuối bảng Cách tính của khối dự báo.'],
   ['So với tháng trước','trong khối Hạn mức cần chú ý, mỗi nhóm so tổng chi từ đầu tháng tới hôm nay với TỔNG CẢ THÁNG trước của chính nhóm đó. Hai vế cùng lấy tổng chi thô của nhóm, không trừ khoản cố định ở vế nào. Vì tháng này còn đang chạy nên app chỉ báo khi đã vượt hẳn tháng trước — tiêu ít hơn thì không nhắc, và tháng trước nhóm đó chưa tiêu đồng nào thì không có gì để so.'],
   ['Nhắc ghi sổ','đếm từ hôm qua lùi dần xem có bao nhiêu ngày liên tiếp sổ không có giao dịch nào, dừng khi gặp ngày có ghi chép. Một ngày trống thì nhắc đúng ngày đó; từ hai ngày trở lên thì báo số ngày kèm lần cuối cập nhật. "Lần cuối" là lúc Vy bấm Lưu, không phải giờ của khoản chi — app suy ra từ mã giao dịch vốn đã mang sẵn mốc thời gian. Bấm "Không phát sinh giao dịch" thì những ngày đang bị nhắc được đánh dấu là ngày thật sự không tiêu gì và thôi nhắc. Chỉ hiện khi xem tháng hiện tại.'],
   ['Hạn mức một nhóm','chi phí cố định thuộc nhóm đó cộng phần linh hoạt đã phân bổ. Riêng Trả nợ lấy đúng kỳ nợ đến hạn trong tháng. Hạn mức lưu riêng từng tháng, tháng chưa đặt thì thừa kế tháng gần nhất trước đó.'],
   ['Chi phí cố định đã chi chưa','cộng mọi giao dịch trong tháng có mã đối tác trùng mã nhận diện. Nếu bật tùy chọn xấp xỉ thì chỉ tính giao dịch lệch không quá 15%.'],
   ['Hạn mức tồn','cộng phần dư của tối đa 6 kỳ gần nhất, chỉ tính tháng có ghi chép, trần bằng 6 lần hạn mức tháng. Chỉ áp cho nhóm bật cộng dồn. Kỳ trước tiêu vượt thì thành số âm và bị trừ vào hạn mức tháng này.'],
   ['Rút hạn mức tồn','không tự cộng vào hạn mức. Chỉ khi Vy bấm rút thì phần rút mới vào hạn mức khả dụng và vào mẫu số nhịp tiêu.'],
   ['Thu nhập trong dự trù','tách giao dịch nhóm Lương thành hai kỳ theo ngày, lấy ngày đầu của kỳ 2 làm ranh giới. Kỳ đã về thì lấy đúng số thật; kỳ chưa về thì ước bằng trung bình kỳ đó của tối đa 3 tháng có ghi chép, chưa có lịch sử mới lấy phần còn thiếu so với kế hoạch. Thưởng và thu khác cộng thêm, không giữ chỗ. Cả hai kỳ đã về thì thu nhập tháng chốt bằng số thực nhận, dù cao hay thấp hơn kế hoạch.'],
   ['Tổng kết tháng đã đóng','mở lại một tháng đã qua thì khối nhịp tiêu biến mất, thay bằng bản tổng kết: số dư đầu tháng + Thực thu − Thực chi = Số dư cuối tháng. Số dư cuối tháng chính là phần Vy giữ lại được của tháng đó. Bấm vào nó để xem tiền nằm ở BIDV, Ví và Tiền mặt bao nhiêu; ba nguồn cộng lại phải đúng bằng số đầu dòng. Số này cộng lại từ đầu sổ tới hết tháng, không lấy số dư hôm nay, nên xem lại tháng cũ vẫn đúng.'],
   ['Tiết kiệm & Đầu tư (tháng đã đóng)','tiền Vy chuyển vào nhóm Tiết kiệm & Đầu tư trong tháng — tức phần còn dư cuối cùng. Chia theo thứ tự: một là góp mục tiêu tài chính, trích trước, tối đa bằng mức góp kế hoạch; hai là tiết kiệm riêng như vàng, gửi tiết kiệm, nhận phần còn lại, chia theo đúng tỷ lệ số đã chuyển vào từng mục. Tiền này đã rời ba nguồn nên KHÔNG nằm trong Số dư cuối tháng, hai số không cộng với nhau.'],
   ['Chốt sổ tháng','từ ngày 1 tháng sau, đầu Tổng quan hiện khối chốt sổ tháng vừa qua và nằm đó tới khi Vy chốt. App tự kiểm ba điều: ngày nào trong tháng cũng có giao dịch hoặc Vy đã bấm Không tiêu; giao dịch nào cũng có nhóm; chuỗi số dư BIDV không còn chỗ đứt chưa xử lý. Đủ ba điều thì Vy so ba số dư cuối ngày cuối tháng với app ngân hàng, ví và tiền mặt. Lệch thì ghi khoản còn thiếu, hoặc ghi một dòng điều chỉnh có tên rõ ràng — không giấu chỗ lệch. Chốt xong số dư cuối tháng đứng yên; thêm, sửa ngày hay xóa giao dịch của tháng đó app sẽ hỏi lại, và nếu có sửa thì Tổng kết ghi cả số đã chốt lẫn số hiện tại. Chỉ nhắc tháng liền trước.'],
   ['Ngày gõ tay','mọi ô ngày gõ theo kiểu dd/mm/yy, chỉ cần gõ số, app tự thêm dấu /. Bỏ năm thì: ngày hẹn thu/trả lấy lần gần nhất chưa tới, ngày giao dịch lấy lần gần nhất đã qua. Dưới ô luôn hiện app đã hiểu thành thứ mấy, ngày nào, để Vy kiểm tra trước khi lưu.'],
   ['Mục tiêu chạy song song','mỗi mục tiêu có mức cần mỗi tháng riêng: mục tiêu ghi hạn thì lấy phần còn thiếu chia số tháng còn lại, mục tiêu không ghi hạn thì lấy mốc 12 tháng. Tiền góp mỗi tháng chia cho các mục tiêu theo tỷ lệ mức cần, nên mục tiêu nào cũng nhích chứ không phải đợi mục tiêu trước đầy. Góp đến là tháng đạt đủ nếu giữ mức góp đang có; góp đến muộn hơn hạn mong muốn thì báo màu vàng.'],
   ['Khoản trả góp','tổng phải trả = số kỳ nhân tiền mỗi kỳ. Phí thu hộ = tổng phải trả − gốc. Kỳ kế tiếp = ngày kỳ đầu cộng số kỳ đã thanh toán.'],
   ['Tỷ lệ tiết kiệm','chi nhóm Tiết kiệm chia thu nhập. Mục tiêu từ 25% trở lên.'],
   ['Quỹ dự phòng','cộng dồn mọi khoản đã ghi vào nhóm Tiết kiệm. Mục tiêu mặc định bằng 3 lần chi phí trung bình, lấy tối đa 3 tháng có ghi chép trong 6 tháng gần nhất và đã trừ phần tiết kiệm; chưa có tháng cũ nào thì tạm quy đổi tháng đang chạy theo số ngày đã qua. Vy đặt tay thì lấy số đặt tay.'],
   ['Góp mục tiêu mỗi tháng','ba cách. Để trống thì app cộng phần còn thiếu của từng mục tiêu có ghi hạn chia cho số tháng còn lại; đặt tay một số chung thì lấy đúng số đó; đặt riêng cho từng mục tiêu thì tổng góp bằng tổng các mức riêng, và mức riêng đó cũng là mức cần mỗi tháng của mục tiêu. Khoản này trừ ngay sau chi phí cố định và nghĩa vụ nợ, trước khi chia hạn mức linh hoạt.'],
   ['Tiền nhàn rỗi','phần còn thừa sau khi trừ cố định, nợ, góp mục tiêu và chia hết hạn mức linh hoạt. Đây là hạn mức nhóm Tiết kiệm & đầu tư.'],
   ['Mục tiêu tài chính','tiền tiết kiệm rót lần lượt theo thứ tự ưu tiên, đầy mục tiêu trước mới sang mục tiêu sau. Mục tiêu có ghi hạn thì app nói cần góp bao nhiêu mỗi tháng và bằng bao nhiêu phần trăm thu nhập; không ghi hạn thì app lấy mức góp mỗi tháng để tính còn bao lâu.'],
   ['Tiết kiệm khả dụng','số dư tiết kiệm trừ phần hạn mức tồn các nhóm đang giữ chỗ.'],
   ['Chống trùng khi nhập','trùng nếu cùng ngày, cùng số tiền và cùng mã đối tác hoặc cùng nội dung gốc. Đổi tên sau đó vẫn nhận ra vì app giữ nội dung gốc từ ngân hàng.'],
   ['Học quy tắc','chỉ học từ giao dịch có mã đối tác rõ ràng. Quét QR và nạp ví không bao giờ được học.']
  ];
  return `<h2>Cách app tính các con số</h2>
    <div class="stack-note"><span>Ghi lại để sau này Vy đọc số nào cũng biết nó từ đâu ra.</span></div>
    <div class="sp"></div><div class="panel">`
    +R.map(([k,v])=>`<div style="padding:12px 14px;border-bottom:1px solid var(--line-2)">
      <div class="src-n">${k}</div><div class="src-m" style="margin-top:4px;line-height:1.5">${v}</div></div>`).join('')
    +`</div><div class="sp"></div><button class="btn ghost" onclick="go('set')">Quay lại Cài đặt</button>`;
}

function vSet(){
  const ab=(DB.opts&&DB.opts.ab)||'off', ds=daysSinceBackup(), rules=Object.entries(DB.rules);
  let h=`<h2>Bắt đầu theo dõi</h2><div class="panel"><div class="row bd-row"><label>Bắt đầu theo dõi từ</label>
    <span><span class="bd-v">${DB.batDau?vnd(DB.batDau).slice(0,6)+DB.batDau.slice(0,4):'chưa đặt'}</span>
    <button class="chk-btn" onclick="moBatDau()">Sửa</button></span></div></div>`;
  h+=`<h2>Số dư ban đầu</h2>
    <div class="stack-note"><span>Số tiền có trong mỗi nguồn ngay trước giao dịch đầu tiên ghi vào sổ. Điền một lần rồi thôi.</span></div>
    <div class="sp"></div><div class="panel">`;
  SRC.forEach(s=>{h+=`<div class="row"><label>${s.n}</label>
    <input inputmode="text" value="${DB.opens[s.id]?money(DB.opens[s.id]):''}" placeholder="0" onchange="setOpen('${s.id}',this.value)"></div>`;});
  h+=`</div>`;

  h+=`<h2>Ngân sách</h2>
    <div class="empty" style="text-align:left">Thu nhập, khoản cố định và hạn mức đã chuyển sang tab <b>Ngân sách</b> ở thanh dưới.
    <div class="sp"></div><button class="btn ghost" onclick="go('budget')">Mở tab Ngân sách</button></div>`;

  h+=`<h2>Quy tắc đã học (${rules.length})</h2>`;
  h+= rules.length
    ? `<div class="panel">`+rules.map(([k,v])=>`<div class="row"><label style="font-size:13.5px">${esc(k.startsWith('p:')?'TK '+k.slice(2):k.slice(2))} → ${esc(labelOf(v))}</label>
        <button style="background:none;border:0;color:var(--ink-3);font-size:13px" onclick="delRule('${esc(k)}')">Bỏ</button></div>`).join('')+`</div>`
    : `<div class="empty">Sửa nhóm của một giao dịch có số tài khoản đối tác, app ghi nhớ để lần sau xếp đúng.</div>`;

  const th=(DB.opts&&DB.opts.theme)||'auto';
  h+=`<h2>Giao diện</h2><div class="panel"><div class="fld"><span>Nền sáng hay tối</span>
    <select onchange="setTheme(this.value)">
      ${[['auto','Theo cài đặt máy'],['light','Luôn nền sáng'],['dark','Luôn nền tối']].map(([v,n])=>
        `<option value="${v}" ${v===th?'selected':''}>${n}</option>`).join('')}</select></div></div>`;

  const MODES=[['off','Tắt'],['share','Mở bảng chia sẻ'],['file','Tải file về máy']];
  h+=`<h2>Sao lưu</h2><div class="panel">
      <div class="fld"><span>Sau mỗi lần lưu giao dịch</span>
      <select onchange="setAB(this.value)">${MODES.map(([v,n])=>`<option value="${v}" ${v===ab?'selected':''}>${n}</option>`).join('')}</select></div>
      <div class="row"><label style="font-size:13.5px;color:var(--ink-2)">Sao lưu gần nhất</label>
        <span style="font-size:13.5px;color:${ds===null||ds>30?'var(--amber)':'var(--ink-2)'}">${ds===null?'chưa lần nào':ds===0?'hôm nay':ds+' ngày trước'}</span></div>
    </div><div class="sp"></div>
    <button class="btn ghost" onclick="runBackup('${ab==='off'?'share':ab}')">Sao lưu ngay</button>
    <div class="sp"></div>
    <div class="panel"><div class="fld"><span>Khôi phục từ file sao lưu</span>
      <input type="file" accept=".json,application/json" onchange="restoreFile(this)"></div></div>
    <div class="sp"></div>
    <details><summary style="font-size:13px;color:var(--ink-3);padding:4px 0">Chép tay bản sao lưu</summary>
      <div class="sp"></div><textarea class="mono" rows="3" readonly onclick="this.select()">${esc(JSON.stringify(DB))}</textarea>
      <div class="sp"></div><textarea id="restore" rows="2" placeholder="Dán bản sao lưu vào đây"></textarea>
      <div class="sp"></div><button class="btn ghost" onclick="doRestore()">Khôi phục từ đoạn đã dán</button></details>`;

  const TH=[['auto','Theo máy'],['light','Luôn sáng'],['dark','Luôn tối']];
  const cur=(DB.opts&&DB.opts.theme)||'auto';
  h+=`<h2>Giao diện</h2><div class="panel"><div class="fld"><span>Nền sáng hay tối</span>
    <select onchange="setTheme(this.value)">${TH.map(([v,n])=>`<option value="${v}" ${v===cur?'selected':''}>${n}</option>`).join('')}</select></div></div>
    <div class="sp"></div><div class="stack-note"><span>Chọn "Theo máy" thì app đổi theo cài đặt điện thoại. Nếu bật tiết kiệm pin mà app không đổi, chọn thẳng "Luôn tối".</span></div>`;

  h+=`<h2>Cách tính</h2>
    <div class="empty" style="text-align:left">Toàn bộ công thức app đang dùng: số dư, nhịp tiêu, hạn mức, dự trù, chỉ số.
    <div class="sp"></div><button class="btn ghost" onclick="go('info')">Mở ghi chú cách tính</button></div>`;

  h+=`<h2>Câu lệnh cho AI</h2>
    <div class="stack-note"><span>Chép câu lệnh này, gửi kèm ảnh chụp giao dịch cho AI, rồi dán kết quả vào tab Nhập. Chạm vào ô để chọn hết.</span></div>
      <div class="sp"></div><textarea class="mono" rows="8" readonly onclick="this.select()">${esc(promptText())}</textarea>
      <div class="sp"></div><button class="btn ghost" onclick="copyPrompt()">Chép câu lệnh</button>`;

  if(msg)h+=`<div class="${msgType==='ok'?'ok':'err'}">${esc(msg)}</div>`;
  const w=PAY();
  h+=`<h2>Lịch lương</h2><div class="panel" style="padding:12px 14px">
    <div class="cat-meta"><span>Kỳ 1</span><span style="color:var(--ink)">ngày ${w.k1[0]}–${w.k1[1]}</span></div>
    <div class="cat-meta" style="margin-top:5px"><span>Kỳ 2</span><span style="color:var(--ink)">ngày ${w.k2[0]}–${w.k2[1]}</span></div></div>
    <div class="sp"></div><button class="btn ghost" onclick="editPayDays()">Sửa lịch lương</button>
    <div class="sp"></div><div class="stack-note"><span>App dùng ranh giới ngày ${w.k2[0]} để tách giao dịch nhóm Lương thành hai kỳ, và dùng khoảng ngày để biết kỳ nào đã trễ.</span></div>
    <div class="sp"></div>`;
  h+=`<h2>Dữ liệu</h2><div class="empty" style="text-align:left">${DB.txns.length} giao dịch đang lưu.<br>
    <span style="font-size:12.5px;color:var(--ink-3)">Phiên bản ${VERSION} · lưu tại ${window.storage?'kho của Claude':'trình duyệt máy này'}</span></div>
    <div class="sp"></div>`;
  const nOK=Object.keys(DB.chainOK||{}).length;
  if(nOK)h+=`<div class="stack-note"><span>Đã xác nhận ${nOK} mốc số dư lệch, app không báo lại nữa.
    <button style="background:none;border:0;padding:0;color:var(--jade);font-weight:600;font-size:12.5px;text-decoration:underline" onclick="chainReset()">Bỏ xác nhận</button></span></div>
    <div class="sp"></div>`;
  h+=`<button class="btn danger" onclick="wipe()">Xóa toàn bộ dữ liệu</button>`;
  return h;
}

/* ==================== hành động ==================== */
/* Thoi luong theo QUANG DUONG, khong co dinh: khoi cao thi chay lau hon mot chut
   nen van toc cam nhan gan nhu khong doi. Do la thu tao cam giac "muot". */
const XODUR=px=>Math.min(480,Math.max(210,Math.round(px*0.55+150)));
const XORA="cubic-bezier(.2,.8,.2,1)";    /* mo: giam toc deu, khong le the o cuoi */
const XOVAO="cubic-bezier(.4,0,.75,.2)";  /* dong: nhanh dan roi dut khoat */
var XODEM=0;
function xoBat(){ XODEM++; document.documentElement.classList.add("xo-chay"); }
function xoTat(){ if(--XODEM<=0){ XODEM=0;
  document.documentElement.classList.remove("xo-chay"); } }
function xoMui(id,mo){
  var m=document.querySelectorAll('.xomui[data-mui="'+id+'"]');
  for(var i=0;i<m.length;i++)m[i].textContent=m[i].getAttribute(mo?"data-a":"data-b");
}
function xoXong(el,d,xong){
  var roi=false;
  var het=function(){ if(roi)return; roi=true;
    el.removeEventListener("transitionend",tr); xoTat(); xong(); };
  var tr=function(e){ if(e.propertyName==="height")het(); };
  el.addEventListener("transitionend",tr); setTimeout(het,d+140);
}
/* Khong con render() truoc khi chay. Than khoi da nam san trong trang,
   bam chi doi chieu cao — trinh duyet khong phai dung lai ca man hinh.
   Chi ve lai MOT lan SAU khi chuyen dong xong, de cap nhat mui ten. */
function toggle(id){
  var el=document.querySelector('[data-xo="'+id+'"]');
  if(!el){ open[id]=!open[id]; render(); return; }
  if(el.classList.contains("chay"))return;
  var mo=el.getAttribute("data-open")==="1";
  open[id]=!mo;
  xoMui(id,!mo);
  xoBat();
  if(mo){
    var h0=el.scrollHeight, d0=Math.round(XODUR(h0)*0.82);
    el.style.transition="none"; el.style.height=h0+"px";
    el.getBoundingClientRect();
    el.classList.add("an","chay");
    el.style.transition="height "+d0+"ms "+XOVAO;
    el.style.height="0px";
    xoXong(el,d0,function(){
      el.setAttribute("data-open","0");
      el.classList.remove("an","chay");
      el.style.transition=""; el.style.height="";
    });
  }else{
    el.setAttribute("data-open","1");
    el.style.transition="none"; el.style.height="auto";
    var h1=el.scrollHeight, d1=XODUR(h1);
    el.classList.add("an","chay");
    el.style.height="0px";
    el.getBoundingClientRect();
    el.style.transition="height "+d1+"ms "+XORA;
    el.style.height=h1+"px";
    el.classList.remove("an");
    xoXong(el,d1,function(){
      el.classList.remove("chay");
      el.style.transition=""; el.style.height="";
    });
  }
}
function toggleRoll(g){DB.roll=DB.roll||{};if(DB.roll[g])delete DB.roll[g];else DB.roll[g]=1;save();render()}
function zoomIn(id){open.zoom=id;render()}
function zoomOut(){open.zoom=null;render()}
let filterCode='';
function seeList(code){filterCode=code;go('list');}
function pickTx(code){
  const g=groupOf(code);
  /* chạm ô nhóm lớn: nếu nhóm có mục con và đang ở mức nhóm thì mở giao dịch cả nhóm */
  open.txCode=open.txCode===code?'':code; render();
}
/* xổ bản đồ khối xuống cấp 2 */
function askZoom(){
  const first=byGroup(monthTx(cursor)).find(([id])=>groupOf(id).subs.length);
  if(first){open.zoom=first[0];open.txCode='';render();}
}
function clearFilter(){filterCode='';render();}
/* ---- khoản nợ ---- */
/* ---- Nhập khoản nợ ngay trong trang, không còn hộp thoại ----
   nF: form đang mở — {m:'moi',k:'cho'|'no'} · {m:'sua',id} · {m:'thu',id}. Chỉ một form mở một lúc.
   Giá trị đọc thẳng từ ô lúc bấm Lưu, nên đổi lựa chọn trong form không cần vẽ lại trang. */
let nF=null;
/* báo lỗi ngay trong form, KHÔNG vẽ lại trang — vẽ lại thì mất hết chữ Vy vừa gõ */
function loiO(id,t){const e=document.getElementById(id);if(!e){flash(t,'err');return;}e.textContent=t;e.hidden=false;}
const nfLoi=t=>loiO('nf-loi',t);
function moNo(m,x){nF=m==='moi'?{m,k:x}:{m,id:x};msg='';render();
  setTimeout(()=>{const el=document.querySelector('.nform input');if(el&&m!=='thu')el.focus();},0);}
function dongNo(){nF=null;render();}
/* nút gạt: ghi lựa chọn vào data-v của khung, bật/tắt các phần có data-when="khung:giá trị" */
function segChon(b){
  const p=b.parentElement, f=p.closest('.nform')||document;
  p.dataset.v=b.dataset.v; [...p.children].forEach(x=>x.classList.toggle('on',x===b));
  f.querySelectorAll('[data-when^="'+p.id+':"]').forEach(e=>{e.hidden=e.dataset.when!==p.id+':'+b.dataset.v;});
}
const nfv=id=>{const e=document.getElementById(id);return e?e.value:'';};
/* tạo khoản nợ từ một giao dịch Đi vay / Cho mượn — dùng chung cho dán từ AI và ghi tay */
function noTuGD(t,han){
  const g=groupOf(t.c).id;
  if(!((g==='divay'&&t.t==='thu')||(g==='muon'&&t.t==='chi')))return null;
  const d={id:'d'+Date.now()+Math.random().toString(36).slice(2,6),
    name:cleanName(t.n), kind:g==='divay'?'no':'cho', mode:'canhan', principal:t.a, start:t.d};
  if(han)d.due=han;
  DB.debts.push(d); return d;
}
function luuNoMoi(){
  const k=nF.k, nm=nfv('nf-ten').trim(), a=parseAmt(nfv('nf-tien'));
  if(!nm){nfLoi('Chưa ghi tên người hoặc tên món.');return;}
  if(!a||isNaN(a)){nfLoi('Số tiền chưa hợp lệ.');return;}
  const gop=k==='no'&&(document.getElementById('nf-cach')||{dataset:{}}).dataset.v==='gop';
  const d={id:'d'+Date.now()+Math.random().toString(36).slice(2,6),name:nm.slice(0,40),kind:k,mode:gop?'gop':'canhan',principal:a,start:iso(new Date())};
  if(gop){
    d.periods=parseInt(nfv('nf-ky'),10)||12;
    d.per=parseAmt(nfv('nf-kytien'))||Math.round(a/d.periods);
    const day=parseInt(nfv('nf-ngay'),10)||15;
    d.start=iso(new Date()).slice(0,8)+String(Math.min(28,Math.max(1,day))).padStart(2,'0');
  }else{
    const h=dtRead(nfv('nf-han'),'toi'); if(h===null){nfLoi('Ngày hẹn chưa đúng — gõ dạng dd/mm/yy.');return;}
    if(h)d.due=h;
  }
  DB.debts.push(d); nF=null; save(); flash('Đã thêm khoản "'+d.name+'".','ok');
}
function luuSuaNo(){
  const d=DB.debts.find(x=>x.id===nF.id); if(!d)return;
  const nm=nfv('nf-ten').trim(); if(nm)d.name=nm.slice(0,40);
  const g=parseAmt(nfv('nf-tien')); if(g&&!isNaN(g))d.principal=g;
  if(d.mode==='gop'){
    const p=parseInt(nfv('nf-ky'),10); if(p)d.periods=p;
    const per=parseAmt(nfv('nf-kytien')); if(per&&!isNaN(per))d.per=per;
    const day=parseInt(nfv('nf-ngay'),10);
    if(day)d.start=d.start.slice(0,8)+String(Math.min(28,Math.max(1,day))).padStart(2,'0');
  }else{
    const h=dtRead(nfv('nf-han'),'toi'); if(h===null){nfLoi('Ngày hẹn chưa đúng — gõ dạng dd/mm/yy.');return;}
    if(h)d.due=h; else delete d.due;
  }
  nF=null; save(); flash('Đã cập nhật.','ok');
}
/* điền ngày hẹn thẳng trên thẻ, cho khoản tạo tự động chưa có ngày */
function luuHan(id){
  const nfLoi=t=>loiO('loi-han-'+id,t);
  const d=DB.debts.find(x=>x.id===id); if(!d)return;
  const h=dtRead(nfv('han-'+id),'toi');
  if(!h){nfLoi(h===''?'Chưa gõ ngày.':'Ngày chưa đúng — gõ dạng dd/mm/yy.');return;}
  d.due=h; save(); flash('Đã đặt ngày hẹn '+vnd(h)+'.','ok');
}
/* các form vẽ trong thẻ nợ */
function formNo(d){
  const cho=(nF.m==='moi'?nF.k:d.kind)==='cho', gop=d&&d.mode==='gop';
  const F=(nhan,o)=>'<div class="nf"><label>'+nhan+'</label>'+o+'</div>';
  const IN=(id,v,them)=>'<input id="'+id+'" value="'+esc(v==null?'':v)+'" '+(them||'')+'>';
  const tien=(id,v,ph)=>IN(id,v?money(v):'','inputmode="numeric" placeholder="'+(ph||'0')+'" oninput="this.value=fmtTien(this.value)"');
  const han=(v)=>F(cho?'Ngày dự kiến thu':'Ngày dự kiến trả',dtInput('nf-han',v,'toi')+dtChips('nf-han'));
  const gopF=(p)=>'<div class="two2">'+F('Số kỳ (tháng)',IN('nf-ky',p.periods||12,'inputmode="numeric"'))
    +F('Ngày trả hằng tháng',IN('nf-ngay',p.day||25,'inputmode="numeric"'))+'</div>'
    +F('Mỗi kỳ trả',tien('nf-kytien',p.per,'để trống = chia đều'));
  const nut=(ten,fn)=>'<div class="err" id="nf-loi" hidden></div><div class="nf-btns"><button class="btn" onclick="'+fn+'()">'+ten+'</button>'
    +'<button class="btn ghost" onclick="dongNo()">Hủy</button></div>';
  let x='<div class="nform">';
  if(nF.m==='moi'){
    x+='<div class="nf-ttl">'+(cho?'Khoản cho mượn mới':'Khoản đi vay mới')+'</div>'
      +F('Tên người hoặc tên món',IN('nf-ten','','placeholder="VD: Chị Mai" autocomplete="off"'))
      +F('Số tiền',tien('nf-tien',0));
    if(!cho)x+=F('Cách trả','<div class="seg" id="nf-cach" data-v="1">'
        +'<button type="button" class="on" data-v="1" onclick="segChon(this)">Trả một lần</button>'
        +'<button type="button" data-v="gop" onclick="segChon(this)">Trả góp</button></div>')
      +'<div data-when="nf-cach:gop" hidden>'+gopF({})+'</div>';
    x+='<div'+(cho?'':' data-when="nf-cach:1"')+'>'+han('')+'</div>'+nut('Lưu khoản','luuNoMoi');
  }else if(nF.m==='sua'){
    x+=F('Tên người hoặc tên món',IN('nf-ten',d.name,'autocomplete="off"'))+F('Số tiền gốc',tien('nf-tien',d.principal));
    x+=gop?gopF({periods:d.periods,per:d.per,day:+String(d.start).slice(8,10)}):han(d.due||'');
    x+=nut('Lưu thay đổi','luuSuaNo');
  }else{
    const i=debtInfo(d);
    x+=F(cho?'Thu về bao nhiêu':'Trả bao nhiêu',tien('nf-a',i.nextAmt||i.left))
      +F(cho?'Tiền vào nguồn nào':'Trả từ nguồn nào','<div class="seg" id="nf-src" data-v="bidv">'
        +SRC.map((s,k)=>'<button type="button" class="'+(k?'':'on')+'" data-v="'+s.id+'" onclick="segChon(this)">'+s.n+'</button>').join('')+'</div>')
      +F(cho?'Ngày thu':'Ngày trả',dtInput('nf-d',iso(new Date()),'qua'))
      +nut(cho?'Ghi thu hồi':'Ghi thanh toán','payDebt');
  }
  return x+'</div>';
}
/* gõ toàn số thì tự chấm hàng nghìn; gõ kiểu "1tr", "500k" thì để nguyên, parseAmt đọc được */
const fmtTien=v=>{v=String(v);if(!/^[\d.]*$/.test(v))return v;const d=v.replace(/\D/g,'');return d?money(+d):'';};
function delDebt(id){
  const d=DB.debts.find(x=>x.id===id);if(!d)return;
  if(!confirm('Xóa khoản "'+d.name+'"? Các giao dịch đã ghi vẫn giữ nguyên.'))return;
  DB.txns.forEach(t=>{if(t.debt===id)delete t.debt;});
  DB.debts=DB.debts.filter(x=>x.id!==id);save();render();
}
function payDebt(){
  const d=DB.debts.find(x=>x.id===nF.id);if(!d)return;
  const a=parseAmt(nfv('nf-a'));
  if(!a||isNaN(a)){nfLoi('Số tiền chưa hợp lệ.');return;}
  const s=(document.getElementById('nf-src')||{dataset:{}}).dataset.v||'bidv';
  const ngay=dtRead(nfv('nf-d'),'qua');
  if(!ngay){nfLoi('Ngày chưa đúng — gõ dạng dd/mm/yy.');return;}
  if(!hoiChot([ngay]))return;
  nF=null;
  DB.txns.push({id:Date.now()+Math.random(),d:ngay,a,
    t:d.kind==='cho'?'thu':'chi', c:d.kind==='cho'?'thuno':(d.mode==='gop'?'trano_gop':'trano_cn'),
    s, n:(d.kind==='cho'?'Thu về từ ':'Trả nợ ')+d.name, debt:d.id});
  save();flash('Đã ghi '+money(a)+'.','ok');
}
function tog(i){pending[i].keep=!pending[i].keep;render()}
/* ngày hẹn cho dòng Cho mượn / Đi vay trong màn xem lại — lưu vào dòng chờ, KHÔNG vẽ lại */
function setHanP(i,v){const h=dtRead(v,'toi');if(h===null)return;if(h)pending[i].han=h;else delete pending[i].han;}
/* chọn hoặc bỏ chọn cả danh sách một lượt */
function togAll(v){pending.forEach(t=>{t.keep=!!v});render()}
function askSpend(i){const t=pending[i];t.t='chi';t.s='bidv';delete t.s2;t.decided=1;t.spend=true;t.c='';render()}
function askKeep(i){const t=pending[i];t.decided=1;render()}
function setName(i,v){const t=pending[i],s=String(v).trim().slice(0,60);
  if(s){t.n=s;t.named=true;}else{t.n=t.n0||t.n;t.named=false;}}
function learn(t,code){
  if(!code)return;
  if(t.p)DB.rules['p:'+t.p]=code;
  else if(!t.q&&!t.w)DB.rules['k:'+merchantKey(t.n0||t.n)]=code;
}
function setCat(i,v){const t=pending[i];t.c=v;learn(t,v);save();render()}
function reCat(id,v){const t=DB.txns.find(x=>String(x.id)===id);if(!t)return;t.c=v;learn(t,v);save();render()}
function del(id){const t=DB.txns.find(x=>String(x.id)===id);if(t&&!hoiChot([t.d]))return;
  DB.txns=DB.txns.filter(x=>String(x.id)!==id);save();render()}
function setDate(id,v){
  v=dtRead(v,'qua'); if(v===null||v===''){if(v===null)flash('Ngày chưa đúng — gõ dạng dd/mm/yy.','err');return;}
  const t=DB.txns.find(x=>String(x.id)===id); if(!t||t.d===v)return;
  if(!hoiChot([t.d,v])){render();return;}
  t.d=v; save(); flash('Đã đổi ngày thành '+vnd(v)+'.','ok');
}
function setTime(id,v){
  const t=DB.txns.find(x=>String(x.id)===id); if(!t)return;
  if(/^\d{2}:\d{2}$/.test(v))t.tm=v; else delete t.tm;
  save(); render();
}
function editName(id){const t=DB.txns.find(x=>String(x.id)===id);if(!t)return;
  const v=prompt('Nội dung giao dịch:',t.n); if(v===null)return;
  const s2=v.trim().slice(0,60); if(s2){t.n=s2;save();render();}}
function delRule(k){delete DB.rules[k];save();render()}
function setB(id,v){
  const raw=String(v).trim();
  if(!raw){setBud(id,null);save();render();return;}
  if(raw.includes('%')){
    const p=parseFloat(raw.replace('%','').replace(',','.'));
    const base=budgetPlan(cursor).conLai;
    if(!isNaN(p)&&base>0){setBud(id,Math.round(base*p/100/10000)*10000);save();render();return;}
  }
  const n=parseAmt(raw); if(!isNaN(n))setBud(id,n);
  save();render();
}
function setOpen(id,v){const n=parseAmt(v);DB.opens[id]=(!String(v).trim()||isNaN(n))?0:n;save();render()}
function setAB(v){DB.opts=Object.assign({},DB.opts,{ab:v});save();render()}
/* mẫu phân bổ đề xuất, tính theo % thu nhập — hợp với người không phải trả tiền thuê nhà */
function fillSuggest(){
  const p=budgetPlan(cursor);
  if(!p.inc){flash('Điền thu nhập trước đã.','err');return;}
  if(p.conLai<=0){flash('Cố định và nợ đã ăn hết thu nhập, không còn gì để chia.','err');return;}
  if(flexTotal(cursor)&&!confirm('Ghi đè hạn mức tháng này bằng mẫu đề xuất?'))return;
  DB.bm=DB.bm||{}; DB.bm[ym(cursor)]={};
  Object.entries(MAUFLEX).forEach(([g,r])=>{setBud(g,Math.round(p.conLai*r/100/10000)*10000);});
  balanceToSavings(); save(); flash('Đã chia theo mẫu. Vy chỉnh lại dòng nào thấy chưa hợp.','ok');
}
/* dồn phần chưa chia vào Tiết kiệm để tổng luôn khớp số còn lại */
function balanceToSavings(){
  const p=budgetPlan(cursor); if(!p.inc)return;
  let other=0;
  FLEX().forEach(g=>{if(g.id!=='tk')other+=bud(g.id,cursor);});
  setBud('tk',Math.max(0,p.conLai-other));
}
function balanceNow(){balanceToSavings();save();render();}
/* lấy y hệt hạn mức tháng trước cho tháng đang xem */
function copyPrevBudget(){
  const km=ym(new Date(cursor.getFullYear(),cursor.getMonth()-1,1));
  if(!DB.bm||!DB.bm[km]){flash('Tháng trước chưa đặt hạn mức.','err');return;}
  if(DB.bm[ym(cursor)]&&!confirm('Ghi đè hạn mức tháng này bằng hạn mức tháng '+km.slice(5)+'?'))return;
  DB.bm[ym(cursor)]=Object.assign({},DB.bm[km]);
  save();flash('Đã lấy hạn mức tháng '+km.slice(5)+'.','ok');
}
/* xóa hạn mức riêng của tháng đang xem, quay về thừa kế tháng trước */
function resetBudget(){
  if(!confirm('Xóa hạn mức riêng của tháng này? App sẽ thừa kế lại tháng gần nhất trước đó.'))return;
  if(DB.bm)delete DB.bm[ym(cursor)];
  save();flash('Đã đặt lại hạn mức tháng này.','ok');
}
let fxEdit=null, fxAmt=false, fxCode='', manualCode='';
function editFixed(id){const it=fixedItems().find(x=>x.id===id);fxEdit=id;fxAmt=!!(it&&it.ma);fxCode=it?it.code:'';render();}
function saveFixed(){
  const n=(document.getElementById('fxn').value||'').trim();
  const a=parseAmt(document.getElementById('fxa').value||'');
  const day=parseInt(document.getElementById('fxd').value,10);
  const code=fxCode||'';
  if(!n){flash('Chưa đặt tên khoản.','err');return;}
  if(!a||isNaN(a)){flash('Số tiền chưa hợp lệ.','err');return;}
  if(!code){flash('Chưa chọn nhóm cho khoản này.','err');return;}
  const mp=(document.getElementById('fxm').value||'').trim();
  const rec={name:n.slice(0,40),a,code,day:(day>=1&&day<=31)?day:0,mp,ma:fxAmt?1:0};
  if(fxEdit){
    DB.fixedItems=fixedItems().map(x=>x.id===fxEdit?Object.assign({},x,rec):x);
    fxEdit=null; fxAmt=false; fxCode=''; balanceToSavings(); save(); flash('Đã cập nhật khoản cố định.','ok');
  }else{
    DB.fixedItems=fixedItems().concat([Object.assign({id:'f'+Date.now()},rec)]);
    fxAmt=false; fxCode=''; balanceToSavings(); save(); flash('Đã thêm khoản cố định.','ok');
  }
}
function delFixed(id){
  if(fxEdit===id)fxEdit=null;
  DB.fixedItems=fixedItems().filter(x=>x.id!==id);
  balanceToSavings(); save(); render();
}
function setIncome(v){const n=parseAmt(v);DB.income=(!String(v).trim()||isNaN(n))?0:n;save();render()}
function addManual(){
  const type=document.getElementById('mt').value;
  const a=parseAmt(document.getElementById('ma').value), n=document.getElementById('mn').value.trim();
  if(!a||isNaN(a)){flash('Số tiền chưa hợp lệ.','err');return;}
  const ngay=dtRead(document.getElementById('md').value,'qua');
  if(!ngay){flash(ngay===''?'Chưa gõ ngày.':'Ngày chưa đúng — gõ dạng dd/mm/yy.','err');return;}
  const hEl=document.getElementById('mhan'), han=hEl?dtRead(hEl.value,'toi'):'';
  if(han===null){flash('Ngày hẹn chưa đúng — gõ dạng dd/mm/yy.','err');return;}
  const o={id:Date.now()+Math.random(),d:ngay,
    a,t:type,n:n||(type==='mv'?'Chuyển tiền':'Giao dịch'),s:document.getElementById('msrc').value};
  if(type==='mv'){o.s2=document.getElementById('ms2').value;
    if(o.s2===o.s){flash('Hai nguồn phải khác nhau.','err');return;}}
  else{o.c=manualCode;
    if(!o.c){flash('Chưa chọn nhóm.','err');return;}}
  if(!hoiChot([o.d]))return;
  DB.txns.push(o); noTuGD(o,han);
  manualCode=''; mNhap={a:'',n:'',s:'',d:'',han:''}; save();msg='';cursor=new Date();go('home');autoBackup();
}
function applyBackup(d){
  if(!d||!Array.isArray(d.txns))throw 0;
  if((d.v||1)<12)d=migrate(d);
  DB=Object.assign({},d,{txns:d.txns,debts:Array.isArray(d.debts)?d.debts:[],budgets:d.budgets||{},
    fixedItems:Array.isArray(d.fixedItems)?d.fixedItems:[],roll:d.roll||{},offsets:Array.isArray(d.offsets)?d.offsets:[],draws:Array.isArray(d.draws)?d.draws:[],income:d.income||0,rules:d.rules||{},
    opens:Object.assign({bidv:0,vi:0,tm:0},d.opens||{}),checks:d.checks||{},
    opts:Object.assign({ab:'off'},d.opts||{}),efGop:d.efGop||0,chot:d.chot||{},batDau:d.batDau||'',lastBackup:d.lastBackup||0,v:12});
  save();flash('Đã khôi phục '+d.txns.length+' giao dịch.','ok');
}
function restoreFile(el){const f=el.files&&el.files[0];if(!f)return;
  const r=new FileReader();
  r.onload=()=>{try{applyBackup(JSON.parse(r.result));}catch(e){flash('File sao lưu không đọc được.','err');}};
  r.onerror=()=>flash('Không mở được file.','err'); r.readAsText(f);}
function doRestore(){try{applyBackup(JSON.parse(document.getElementById('restore').value));}
  catch(e){flash('Bản sao lưu không đọc được.','err');}}
function wipe(){if(confirm('Xóa hết giao dịch, hạn mức và quy tắc? Không khôi phục được.')){
  DB={txns:[],debts:[],budgets:{},bm:{},goals:[],fixedItems:DB.fixedItems,roll:DB.roll,offsets:[],draws:[],income:DB.income,rules:{},opens:DB.opens,checks:{},opts:DB.opts,efGop:0,chot:{},batDau:DB.batDau||'',lastBackup:0,v:12};save();msg='';go('home');}}
function move(n){cursor=new Date(cursor.getFullYear(),cursor.getMonth()+n,1);selIds={};toTop=true;render()}

/* ==================== vẽ ==================== */
const TABS=[['home','Tổng quan','◉'],['add','Nhập','＋'],['list','Giao dịch','☰'],['debt','Nợ','◈'],['budget','Ngân sách','◐'],['trend','Xu hướng','◪']];
let toTop=true;
function render(){
  memoClear();
  const y=window.scrollY||window.pageYOffset||0;
  const showMonth=tab==='home'||tab==='list';
  let h=`<div class="top">`;
  h+= showMonth
    ? `<div class="month"><button class="arrow" onclick="move(-1)" aria-label="Tháng trước">‹</button>
       <h1>${MONTH(cursor.getMonth())}, ${cursor.getFullYear()}</h1>
       <button class="arrow" onclick="move(1)" ${ym(cursor)>=ym(new Date())?'disabled':''} aria-label="Tháng sau">›</button></div>`
    : `<h1 style="font-size:17px;font-weight:600;margin:0">${tab==='add'?'Nhập chi tiêu':tab==='trend'?'Xu hướng':tab==='debt'?'Sổ nợ':tab==='budget'?'Ngân sách':tab==='fixed'?'Chi phí cố định':tab==='info'?'Cách tính':'Cài đặt'}</h1>`;
  h+=`<button class="gear" onclick="go('${tab==='set'?'home':'set'}')" aria-label="Cài đặt">${tab==='set'?'✕':'⚙'}</button></div>`;
  h+=`<div class="view">`+(picker?vPicker():splitting?vSplit():
      tab==='home'?vHome():tab==='add'?vImport():tab==='list'?vList():
      tab==='debt'?vDebt():tab==='budget'?vBudget():tab==='fixed'?vFixed():tab==='trend'?vTrend():tab==='info'?vInfo():vSet())+`</div>`;
  /* sổ chưa có ngày bắt đầu theo dõi → hộp thoại bắt buộc, phủ lên mọi tab */
  if(!DB.batDau||open.batDau)h+=khoiBatDau();
  document.getElementById('app').innerHTML=h;
  document.getElementById('nav').innerHTML=TABS.map(([k,n,i])=>
    `<button class="${tab===k?'on':''}" onclick="goTab('${k}')"><b>${i}</b>${n}</button>`).join('');
  window.scrollTo(0, toTop?0:y);
  toTop=false;
}
/* đổi tab hay đổi tháng mới cuộn lên đầu; bấm trong trang thì giữ nguyên chỗ đang xem */
function go(t){msg='';tab=t;toTop=true;render();}
function goTab(t){if(t!=='list'){filterCode='';selMode=false;selIds={};}go(t);}
try{
  const mf={name:'Sổ chi tiêu',short_name:'Sổ chi',display:'standalone',start_url:'.',
    background_color:'#F3F6FB',theme_color:'#F3F6FB',
    icons:[{src:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAWgAAAFoCAYAAAB65WHVAAAIvUlEQVR4nO3dzXEaSxiGUVB5LW0UnhSBFI4dgR2eN3YCugsX1xjxM0BPf2/PnBMA091FPfrcRmK74azHt5eP6jXAUv3+9mNbvYZkDmcjwpBIvFcaaEGG8awx2KvYsCDD8qwh2IvdoCjDeiw11ovalCgDS4r1IjYizMChJYR66A0IM3DJyKEecuHCDFxrxFAPtWBhBu41UqiHWKgwA62NEOroBQozMLfkUD9UL+AUcQZ6SG5N3E+O5MMCli1tmo6aoMUZqJTWoIifFmmHApAwTZdP0OIMJEpoU2mgEw4A4JTqRpWM8NWbBrhWxZVH9wlanIERVbSra6DFGRhZ74Z1C7Q4A0vQs2VdAi3OwJL0atrsgRZnYIl6tG3WQIszsGRzN262QIszsAZztm6WQIszsCZzNa95oMUZWKM52tc00OIMrFnrBjYLtDgDtG1h+V+zA+C4JoE2PQP81aqJdwdanAE+a9HGuwItzgCn3dtId9AAoW4OtOkZ4LJ7WnlToMUZYLpbm+mKAyDU1YE2PQNc75Z2XhVocQa43bUNdcUBEGpyoE3PAPe7pqUmaIBQkwJtegZoZ2pTTdAAoS4G2vQM0N6UtpqgAUKdDbTpGWA+lxprggYIdTLQpmeA+Z1rrQkaINTRQJueAfo51VwTNEAogQYI9SnQrjcA+jvWXhM0QCiBBgj1T6BdbwDUOWywCRoglEADhBJogFD/B9r9M0C9/RaboAFCCTRAKIEGCPWw2bh/Bkiya7IJGiCUQAOEEmiAUAINEEqgAUIJNECorY/YAWQyQQOEEmiAUAINEEqgAUIJNEAogQYIJdAAoQQaIJRAA4QSaIBQAg0QSqABQgk0QCiBBggl0AChBBoglEADhBJogFACDRBKoAFCCTRAKIEGCCXQAKEEGiCUQAOEEmiAUAINEEqgAUIJNEAogQYIJdAAoQQaIJRAA4QSaIBQAg0QSqABQgk0QCiBBgj1pXoBADu/vn7/2fo1n95fn1u/Zi/bx7eXj+pFAOs2R5gPjRhqVxxAqR5x7vmclgQaKNM7mqNFWqCBElWxHCnSAg10Vx3J6udPJdAAoQQa6Cplek1ZxzkCDRBKoAFCCTRAKIEGCCXQAKEEGiCUQAOEEmiAUAINEEqgAUIJNEAogQYIJdAAoQQaIJRAA4QSaIBQAg0QSqABQgk0QCiBBggl0AChBBoglEADhBJogFACDRBKoAFCCTRAKIEGCCXQAKEEGiDUl+oFwM6vr99/tn7Np/fX59avCb0INOXmCPPhaws1I3LFQak541zxHGhJoCnTO5oizWgEmhJVsRRpRiLQdFcdyernw1QCDRBKoOkqZXpNWQecI9AAoQQaIJRAA4QSaIBQAg0QSqABQgk0QCiBBggl0AChBBoglEADhBJogFACDRBKoAFCCTRAKIEGCCXQAKEEGiCUQAOEEmiAUAINEOpL9QKAv+b4tvGn99fn1q9JHwINAeYI8+FrC/V4XHFAsTnjXPEc2hFoKNQ7miI9FoGGIlWxFOlxCDQUqI5k9fOZRqABQgk0dJYyvaasg9MEGiCUQAOEEmiAUAINEEqgAUIJNEAogQYIJdAAoQQaIJRAA4TyB/tD+CYN4JBAF/NNGsAprjgK+SYN4ByBLuKbNIBLBLqAb9IAphDozqojWf18YDqBBggl0B2lTK8p6wDOE2iAUAINEEqgAUIJNEAogQYIJdAAoQQaIJRAA4QSaIBQAg0QSqABQgk0QCiBBggl0AChBBoglEADhBJogFACDRBKoAFCCTRAKIEGCCXQAKEEGiCUQAOEEmiAUAINEEqgAUIJNEAogQYIJdAAoQQaIJRAA4QSaIBQAg0QSqABQgk0QCiBBggl0AChBBoglEADhBJogFACDRBKoAFCCTRAKIEGCCXQAKEEGiCUQAOEEmiAUAINEEqgAUIJNEAogQYIJdAAoQQaIJRAA4QSaIBQAg0QSqABQgk0QCiBBggl0AChBLqjp/fX5+o1bDa163AGzmDt+7+GQAOEEujOqn9qVz8/YQ3Vz09Yg+fXvwemEOgCa/+n5WbjDDYbZ7D2/U8h0EV6v0kS35TOwBmsff+XCHShXm+W5DelM3AGa9//OdvHt5eP6kWw2fz6+v1n69cc7Q3pDJzB2vd/SKABQrniAAgl0AChBBoglEADhBJogFACDRBKoAFCCTRAKIEGCCXQAKEEGiCUQAOEEmiAUAINEOrh97cf2+pFAPCv399+bE3QAKEEGiCUQAOEEmiAUAINEEqgAUI9bDZ/Ps5RvRAA/tg12QQNEEqgAUIJNECo/wPtHhqg3n6LTdAAoQQaIJRAA4T6J9DuoQHqHDbYBA0QSqABQn0KtGsOgP6OtdcEDRBKoAFCHQ20aw6Afk411wQNEOpkoE3RAPM711oTNECos4E2RQPM51JjTdAAoS4G2hQN0N6UtpqgAUJNCrQpGqCdqU01QQOEmhxoUzTA/a5pqQkaINRVgTZFA9zu2oZePUGLNMD1bmmnKw6AUDcF2hQNMN2tzbx5ghZpgMvuaaUrDoBQdwXaFA1w2r2NvHuCFmmAz1q0sckVh0gD/NWqie6gAUI1C7QpGqBtC5tO0CINrFnrBja/4hBpYI3maN8sd9AiDazJXM2b7T8JRRpYgzlbN+unOEQaWLK5Gzf7x+xEGliiHm3r8jlokQaWpFfTuv2iikgDS9CzZV1/k1CkgZH1blj3X/UWaWBEFe0qjeXj28tH5fMBLqkcKkv/WJJpGkhW3ajyv2ZXfQAAxyS0qXwB+1x5ANUSwrxTPkHvSzoYYH3SGhS1mH2maaCXtDDvRE3Q+1IPDFiW5NbELmyfaRpoLTnMO/EL3CfUwL1GCPPOMAvdJ9TAtUYK885wC94n1MAlI4Z5Z9iF7xNq4NDIYd4ZfgP7hBpYQph3FrORQ2IN67GkKO9b5KYOiTUsz1KjvG/xGzxGsGE8awjyodVt+BjBhjxrDPKh1R/AJeIN8xHh8/4DSbVbwJ9tnKUAAAAASUVORK5CYII=',sizes:'360x360',type:'image/png',purpose:'any'}]};
  const l=document.createElement('link'); l.rel='manifest';
  l.href=URL.createObjectURL(new Blob([JSON.stringify(mf)],{type:'application/manifest+json'}));
  document.head.appendChild(l);
}catch(e){}
try{const mq=window.matchMedia('(prefers-color-scheme: dark)');
  const on=()=>{applyTheme();render();};
  mq.addEventListener?mq.addEventListener('change',on):mq.addListener(on);}catch(e){}
load().then(()=>{applyTheme();render();});
