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
let DB={txns:[],debts:[],budgets:{},bm:{},goals:[],fixedItems:[],roll:{},offsets:[],draws:[],income:0,rules:{},opens:{bidv:0,vi:0,tm:0},checks:{},opts:{ab:'off'},chainOK:{},efTarget:0,goalPlan:{mode:'auto',a:0},payDays:{k1:[5,10],k2:[15,25]},lastBackup:0,v:5};
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
  d.v=10; return d;
}
async function load(){try{const raw=await store.get();if(raw){let d=JSON.parse(raw);
  if((d.v||1)<10)d=migrate(d);
  DB=Object.assign({},d,{txns:Array.isArray(d.txns)?d.txns:[],debts:Array.isArray(d.debts)?d.debts:[],
    budgets:d.budgets||{},bm:d.bm||{},goals:Array.isArray(d.goals)?d.goals:[],fixedItems:Array.isArray(d.fixedItems)?d.fixedItems:[],roll:d.roll||{},offsets:Array.isArray(d.offsets)?d.offsets:[],draws:Array.isArray(d.draws)?d.draws:[],income:d.income||0,rules:d.rules||{},
    opens:Object.assign({bidv:0,vi:0,tm:0},d.opens||{}),checks:d.checks||{},
    opts:Object.assign({ab:'off'},d.opts||{}),chainOK:d.chainOK||{},
    efTarget:d.efTarget||0,efGop:d.efGop||0,goalPlan:Object.assign({mode:'auto',a:0},d.goalPlan||{}),
    payDays:Object.assign({k1:[5,10],k2:[15,25]},d.payDays||{}),
    lastBackup:d.lastBackup||0,v:10});}}catch(e){}}
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
2026-08-22 10:07 | vi | chi | 20000 | Nạp data Viettel | hd_dt |  | 0981980039
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
function parsePaste(raw){
  const out=[]; let txt=String(raw).replace(/```[a-z]*|```/g,'').trim();
  const today=new Date();
  txt.split(/\r?\n/).forEach(line=>{
    let s=line.trim().replace(/^\|/,'').replace(/\|$/,'').trim();
    if(!s||!s.includes('|'))return;
    const p=s.split('|').map(x=>x.trim());
    if(p.length<4)return;
    if(/^[-: ]+$/.test(p[0]))return;
    if(/ngay|ngày|date/.test(noAccent(p[0]))&&/nguon|source/.test(noAccent(p[1]||'')))return;

    let d=null, dm=p[0].match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
    if(dm) d=dm[1]+'-'+dm[2].padStart(2,'0')+'-'+dm[3].padStart(2,'0');
    else{
      const dm2=p[0].match(/(\d{1,2})[\/.-](\d{1,2})(?:[\/.-](\d{2,4}))?/);
      if(!dm2)return;
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
    const a=parseAmt(p[3]); if(!a||isNaN(a))return;
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
    if(t.w)o.w=t.w; if(t.q)o.q=1; if(t.sg)o.sg=t.sg; if(t.n0&&t.n0!==t.n)o.n0=t.n0;
    return o;});
  const drop=new Set(pending.filter(t=>t.keep&&t.rep&&t.repDo===1).map(t=>t.rep.id));
  if(drop.size)DB.txns=DB.txns.filter(x=>!drop.has(String(x.id)));
  DB.txns=DB.txns.concat(add);
  add.forEach(t=>{
    const g=groupOf(t.c).id;
    if((g==='divay'&&t.t==='thu')||(g==='muon'&&t.t==='chi')){
      const d={id:'d'+Date.now()+Math.random().toString(36).slice(2,6),
        name:cleanName(t.n), kind:g==='divay'?'no':'cho', mode:'canhan',
        principal:t.a, start:t.d};
      DB.debts.push(d);
    }
  });
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
  return _memo[mk]={duTru,daChi,nd,qua,conLai,choMuon:ngoai.muon,
    bd:{gr,chiTong,fx,coDinh,ngoai,khongHM},
    tyChi:duTru?daChi/duTru:0, tyNgay:qua/nd,
    moiNgay:qua?daChi/qua:0, chuan:duTru/nd,
    /* tiền cho mượn đã ra khỏi túi nên trừ luôn; để âm cho thấy đang tiêu lố */
    conDuoc:duTru-daChi-ngoai.muon};
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

/* ==================== dự trù số dư cuối tháng ==================== */
/* Dự trù cuối tháng = SỐ ĐỂ DÀNH ĐƯỢC, chứ không phải số dư còn lại.
   Tiết kiệm là phần còn lại sau khi mọi thứ khác đã tiêu, nên nếu mọi nhóm
   tiêu vừa đủ hạn mức thì con số này đúng bằng hạn mức Tiết kiệm.
   Thấp hơn là cảnh báo: tháng này sẽ để dành được ít hơn dự tính. */
function forecast(){
  if('fc' in _memo)return _memo.fc;
  const now=new Date();
  const nd=daysIn(now), passed=now.getDate(), conLai=nd-passed;
  const pp=payPeriods(now);
  const incKH=pp.kh, daNhan=pp.daNhan+pp.ngoai, inc=pp.duKien;
  const tkKeHoach=bud('tk',now)+goalMonthly();
  let raPlan=0, daChi=0, cdConLai=0, lhDaChi=0; const bd=[];
  GROUPS.filter(g=>g.k==='chi'&&g.id!=='tk').forEach(g=>{
    const a=avail(g.id,now), v=spentOf(g.id,now), fo=fixedOfGroup(g.id,now);
    const ra=Math.max(a,v);           /* cả tháng nhóm này sẽ ra: đã lỡ tiêu quá thì tính số đã tiêu */
    raPlan+=ra; daChi+=v;
    /* khoản trả một lần: cố định chưa trả và nợ còn phải trả — không ngoại suy theo ngày */
    const cd=fo.left+(g.id==='trano'?Math.max(0,a-v):0);
    cdConLai+=cd;
    /* Trả nợ và Cho mượn là khoản một lần, nhân lên cho cả tháng là sai */
    const lh=(g.id==='trano'||g.id==='muon')?0:Math.max(0,v-Math.min(fo.chi,fo.plan));
    lhDaChi+=lh;
    if(ra||v||cd||lh)bd.push({id:g.id,n:g.n,a,v,ra,vuot:v>a,fo,cd,lh,noBud:!a&&lh>0});
  });
  const rate=passed?lhDaChi/passed:0, lhConLai=rate*conLai;
  return _memo.fc={inc,incKH,daNhan,pp,tkKeHoach,raPlan,daChi,cdConLai,lhDaChi,lhConLai,rate,conLai,passed,bd,
    choMuon:spentOf('muon',now),
    duocUoc:passed>=5,
    keHoach:inc-raPlan,
    theoDa:inc-daChi-cdConLai-lhConLai};
}

/* ==================== ngân sách ====================
   Thu nhập − khoản cố định − nợ phải trả tháng này = số còn lại để chia hạn mức.
   Hạn mức Vy đặt là phần LINH HOẠT; hạn mức thật của một nhóm bằng
   phần linh hoạt cộng các khoản cố định nằm trong nhóm đó. */
const fixedItems=()=>Array.isArray(DB.fixedItems)?DB.fixedItems:[];
/* một giao dịch có thuộc về khoản cố định này không */
function hitFixed(it,t){
  if(t.t!=='chi'||!it.mp)return false;
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

  let h=`<h2 class="hl"><i style="background:${gcA('#47897A')}"></i><b>Tổng kết ${MONTH(cursor.getMonth()).toLowerCase()}</b><em>đã đóng sổ</em></h2>
    <div class="panel">
      ${R('Thực thu',co(s.thu,t5.thu,true),money(s.thu))}
      ${R('− Thực chi','<div class="src-m">cố định, nợ và mọi nhóm chi — không kể tiền góp vào Tiết kiệm &amp; đầu tư</div>'
        +co(s.tieuThat,t5.tieuThat,false),money(s.tieuThat))}
      <div class="src total"><div><div class="src-n">Để dành được</div>${co(s.deDanh,t5.deDanh,true)}</div>
        <div class="src-a" style="color:${s.deDanh>=s.mucTieu?'var(--pos)':'var(--amber)'}">${money(s.deDanh)}</div></div>
    </div>`;
  h+=bao('Góp mục tiêu tài chính',s.gop,s.gopKH);
  h+=bao('Tiết kiệm và đầu tư',s.tkCon,s.budTK);

  /* --- phân bổ --- */
  h+=`<h2 class="hl"><i style="background:${gcA('#5476C4')}"></i><b>Phân bổ tiền để dành</b><em>${money(s.deDanh)}</em></h2>
    <div class="panel">
    ${R('1 · Góp mục tiêu tài chính','<div class="src-m">kế hoạch '+money(s.gopKH)+' mỗi tháng</div>',money(s.gop))}`;
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
  h+=R('2 · Tiết kiệm &amp; đầu tư','<div class="src-m">hạn mức '+money(s.budTK)+'</div>',money(s.tkCon));
  s.subRows.forEach(r=>h+=CON(esc(r.n)+'<span style="font-size:11px;color:var(--ink-3)"> · tổng đã góp '+money(r.tong)+'</span>',money(r.phan)));
  h+=R('3 · Số dư trong tài khoản','<div class="src-m">tiền nhàn rỗi</div>',
      (s.soDu<0?'−'+money(-s.soDu):money(s.soDu)),s.soDu<0?'var(--brick)':'');
  h+=`<div class="src total"><div class="src-n">Cộng lại</div>
    <div class="src-a" style="font-size:16px">${money(s.gop+s.tkCon+s.soDu)}</div></div></div>`;
  if(s.soDu<0)h+=`<div class="sp"></div><div class="warn">Góp vào Tiết kiệm &amp; đầu tư ${money(s.vaoTK)} trong khi chỉ dư ra ${money(s.deDanh)} — chênh <b>${money(-s.soDu)}</b> lấy từ tiền các tháng trước.</div>`;
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
   Để dành được = thực thu − thực chi, trong đó thực chi KHÔNG tính tiền chuyển vào
   nhóm Tiết kiệm & đầu tư — cất tiền sang tiết kiệm là dời chỗ, không phải tiêu.
   Cùng cách với khối Dự trù để dành chạy trong tháng, nên hai con số so được với nhau.
   Phân bổ ba mục, cộng lại đúng bằng để dành:
     1 góp mục tiêu tài chính — lấy từ tiền đã góp vào nhóm Tiết kiệm & đầu tư
     2 phần góp thêm còn lại của nhóm đó
     3 số dư còn trong tài khoản = thu − chi, ĐƯỢC PHÉP ÂM khi tháng đó góp vào
       tiết kiệm nhiều hơn phần dư ra, tức phải bù bằng tiền các tháng trước. */
function tongKet(d){
  d=d||cursor;
  const mk='tket'+ym(d); if(mk in _memo)return _memo[mk];
  const l=monthTx(d);
  const thu=sum(l.filter(t=>t.t==='thu'&&['luong','thuong','tkhac'].includes(groupOf(t.c).id)));
  const chi=sumChi(l);
  const tkRows=l.filter(t=>t.t==='chi'&&groupOf(t.c).id==='tk');
  const vaoTK=sum(tkRows);
  const sub={}; tkRows.forEach(t=>{const k=labelOf(t.c);sub[k]=(sub[k]||0)+t.a;});
  const tieuThat=chi-vaoTK, deDanh=thu-tieuThat, soDu=thu-chi;
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
  return _memo[mk]={thu,chi,vaoTK,sub,subRows,tieuThat,deDanh,soDu,gopKH,budTK,gop,tkCon,vuot,
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
      <input id="fxm" value="${ed&&ed.mp?esc(ed.mp):''}" placeholder="7600371502"></div>
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
        <span style="color:var(--ink-3)">${open.bfx?'▴':'▾'}</span></span></button>`;
  if(open.bfx){
    h+=`<div style="padding:0 12px 12px 15px">
      <div class="cat-meta" style="padding:9px 0"><span>đã chi ${money(fxDa)} / ${money(fxTong)}</span></div>`;
    items.forEach(it=>{const pd=fixedPaid(it,cursor), tay=fxMarked(it,cursor);
      h+=`<div class="cat-meta" style="padding:7px 0;border-top:1px solid var(--line-2)">
        <span>${esc(it.name)}${tay&&!pd.tien?' · tự đánh dấu':''}</span>
        <span style="display:flex;gap:9px;align-items:center;white-space:nowrap">${pd.tien?money(pd.tien)+' / '+money(it.a):tay?'đã trả · '+money(it.a):'chưa chi · '+money(it.a)}
        ${pd.tien?'':`<button class="chk-btn" style="color:var(--ink-3)" onclick="toggleFxDone('${it.id}')">${tay?'bỏ dấu':'đã trả'}</button>`}</span></div>`;});
    if(!items.length)h+=`<div class="cat-meta" style="padding:7px 0"><span>chưa khai khoản cố định nào</span></div>`;
    h+=`</div>`;
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
        <span style="color:var(--ink-3)">${open.bhm?'▴':'▾'}</span></span></button>`;
  if(open.bhm){
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
        <div class="cat-meta"><span style="color:var(--ink);font-size:12.5px">${esc(g.n)} <span style="color:var(--ink-3);font-size:10px">${op?'▴':'▾'}</span></span>
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
      ${op?hmDetail(g):''}
      </div>`;
    });
    h+=`</div>`;
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
      <div style="display:flex;gap:14px;flex-wrap:wrap;margin-top:10px;padding-top:9px;border-top:1px solid var(--line-2)">
        <button class="chk-btn" onclick="payDebt('${d.id}')">${cho?'Ghi thu hồi':'Ghi thanh toán'}</button>
        <button class="chk-btn" style="${debtPick===d.id?'font-weight:700;text-decoration:underline':''}" onclick="pickForDebt('${d.id}')">Đối chiếu</button>
        <button class="chk-btn" onclick="editDebt('${d.id}')">Sửa</button>
        <button class="chk-btn" style="color:var(--ink-3)" onclick="toggle('h_${d.id}')">Lịch sử</button>
        <button class="chk-btn" style="color:var(--brick);margin-left:auto" onclick="delDebt('${d.id}')">Xóa</button></div>`;
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
    if(open['h_'+d.id]){
      const ps=debtTxns(d.id).slice().sort((a,b)=>b.d.localeCompare(a.d));
      x+=ps.length?ps.map(pp=>`<div class="cat-meta" style="margin-top:7px">
          <span style="min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${ddmm(pp.d)} · ${esc(pp.n)}${pp.debt?'':' · tự nhận'}</span>
          <span style="display:flex;gap:9px;align-items:center;white-space:nowrap"><b>${money(pp.a)}</b>
          <button class="chk-btn" style="color:var(--ink-3)" onclick="unlinkDebt('${pp.id}')">gỡ</button></span></div>`).join('')
        :`<div class="cat-meta" style="margin-top:7px"><span>chưa có lần thanh toán nào</span></div>`;
    }
    return x+`</div>`;
  };

  if(noList.length){ h+=`<h2>Nợ phải trả</h2>`; noList.slice().sort(sortByDue).forEach(d=>h+=card(d)); }
  if(choList.length){ h+=`<h2>Nợ phải thu</h2>`; choList.slice().sort(sortByDue).forEach(d=>h+=card(d)); }
  if(!DB.debts.length)h+=`<div class="sp"></div><div class="empty"><b>Chưa có khoản nào</b>Ghi một giao dịch nhóm Đi vay hoặc Cho mượn, app sẽ tự tạo khoản ở đây.</div>`;
  h+=`<div class="sp"></div><button class="btn ghost" onclick="newDebt()">+ Thêm khoản</button>`;
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
const sMau=(v,mt)=>v<0?'var(--brick)':(mt&&v<mt)?'var(--amber)':'var(--pos)';
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
/* Số tiền còn lại được dùng để chi tiêu — số nào trừ số nào */
function paceWhy(pa){
  const b=pa.bd;
  const m=metrics(cursor), hieu=m.thu-m.chi;
  let x=`<div class="panel" style="border-radius:0 0 var(--r) var(--r);border-top:0">
    <div class="daygroup dg-neu">TỔNG QUAN THÁNG NÀY</div>`;
  x+=LN('Thực thu',m.thu,'Lương, thưởng, thu khác — không tính đi vay và thu nợ');
  x+=LN('Thực chi',m.chi,'Mọi giao dịch chi trong tháng',1);
  x+=`<div class="src total"><div><div class="src-n">THỰC THU − THỰC CHI</div>
      <div class="src-m">${money(m.thu)} − ${money(m.chi)}</div></div>
      <div class="src-a" style="color:${hieu<0?'var(--brick)':'var(--pos)'}">${money(hieu)}</div></div>
    <div class="daygroup dg-bud">TỔNG NGÂN SÁCH KHẢ DỤNG</div>`;
  b.gr.forEach(g=>{
    const extra=[g.o?(g.o>0?'bù sang +':'bù đi ')+money(g.o):'',g.dr?'rút từ tồn +'+money(g.dr):'']
      .filter(Boolean).join(' · ');
    x+=LN(esc(g.n),g.tot,extra?'hạn mức '+money(g.b)+' · '+extra:'');
  });
  if(!b.gr.length)x+=`<div class="src" style="padding:9px 14px"><div class="src-m">Chưa đặt hạn mức nhóm nào.</div></div>`;
  x+=`<div class="src total"><div><div class="src-n">TỔNG NGÂN SÁCH KHẢ DỤNG</div>
      <div class="src-m">Tổng hạn mức các khoản linh hoạt — không gồm Tiết kiệm, Trả nợ, Cho mượn và chi phí cố định</div></div>
      <div class="src-a">${money(pa.duTru)}</div></div>
    <div class="daygroup dg-chi">CHI TIÊU</div>`;
  /* đúng từng phân loại mục, không gom lại — cộng đủ năm dòng ra tổng chi tháng */
  x+=LN('Chi linh hoạt',pa.daChi,'Phần trừ vào ngân sách khả dụng ở trên');
  if(b.coDinh)x+=LN('Chi phí cố định',b.coDinh,
    b.fx.length+' khoản đã khớp: '+b.fx.map(f=>esc(f.it.name||f.t.n||'không tên')).join(', '));
  if(b.ngoai.tk)x+=LN('Tiết kiệm & đầu tư',b.ngoai.tk,'Chuyển sang tiết kiệm, không phải tiêu mất');
  if(b.ngoai.muon)x+=LN('Cho mượn',b.ngoai.muon,'Tiền ra khỏi túi, sẽ thu lại sau');
  if(b.ngoai.trano)x+=LN('Trả nợ',b.ngoai.trano,'Nghĩa vụ nợ đã trả trong tháng');
  x+=`<div class="src total"><div><div class="src-n">TỔNG CHI THÁNG NÀY</div>
      <div class="src-m">${[pa.daChi,b.coDinh,b.ngoai.tk,b.ngoai.muon,b.ngoai.trano].filter(Boolean).map(short).join(' + ')}</div></div>
      <div class="src-a">${money(b.chiTong)}</div></div>`;
  if(b.khongHM.length){
    x+=`<div class="daygroup dg-sub">ĐÃ TIÊU MÀ CHƯA ĐẶT HẠN MỨC</div>`;
    b.khongHM.forEach(k=>x+=LN(esc(k.n),k.a,'đang trừ vào ngân sách chung'));
  }
  x+=`<div class="daygroup dg-kq">KẾT QUẢ</div>`;
  /* ba số này tô đúng màu của ba ô lớn phía trên: còn lại (xanh/đỏ) · định mức ngày (xanh dương)
     · thực tế được tiêu (so với định mức ngày, hụt thì đỏ) */
  const dmn=Math.round(pa.duTru/pa.nd);
  const ttd=pa.conLai?Math.round(pa.conDuoc/pa.conLai):pa.conDuoc;
  x+=LNC('Số tiền còn lại được dùng để chi tiêu',pa.conDuoc,
    money(pa.duTru)+' − '+money(pa.daChi)+' (chi linh hoạt)'
    +(pa.choMuon?' − '+money(pa.choMuon)+' (cho mượn)':''),
    pa.conDuoc<0?'var(--brick)':'var(--pos)');
  x+=LNC('Định mức ngày',dmn,money(pa.duTru)+' ÷ '+pa.nd+' ngày trong tháng','var(--tinttx)');
  x+=LNC('Thực tế được tiêu',ttd,
    (pa.conLai?money(pa.conDuoc)+' ÷ '+pa.conLai+' ngày còn lại':'Ngày cuối tháng, còn bao nhiêu tiêu nốt bấy nhiêu')
    +' · '+(ttd<dmn?'↓ Hụt '+money(dmn-ttd):'↑ Dôi ra '+money(ttd-dmn))+' so với định mức ngày',
    ttd<dmn?'var(--brick)':'var(--pos)');
  x+=`</div>`;
  if(b.khongHM.length)x+=`<div class="sp"></div><div class="stack-note"><span>${b.khongHM.length} nhóm đang tiêu mà chưa có hạn mức riêng, nên phần đó ăn vào ngân sách chung. Đặt hạn mức cho chúng ở tab Ngân sách thì con số sẽ sát hơn.</span></div>`;
  return x;
}
/* Dự trù để dành — chi tiết từng nhóm cho cả hai cách */
function fcDetail(f){
  const trong=`<div class="src" style="padding:9px 14px"><div class="src-m">Không có nhóm nào.</div></div>`;
  let x=`<div class="panel" style="border-radius:0 0 var(--r) var(--r);border-top:0">
    <div class="daygroup">THU NHẬP THÁNG NÀY</div>`;
  (f.pp?f.pp.ky:[]).forEach(k=>x+=LN('Lương kỳ '+k.i,k.xong?k.nhan:k.uoc,
    k.xong?'đã nhận, chốt số này':(k.tre?'chưa về dù đã qua ngày '+k.den+' — đang ước':'dự kiến về khoảng ngày '+k.tu+'–'+k.den)));
  if(f.pp&&f.pp.ngoai)x+=LN('Thưởng và thu khác',f.pp.ngoai,'đã nhận');
  x+=`<div class="src total"><div><div class="src-n" style="color:var(--pos)">THU NHẬP</div>
      <div class="src-m">${f.pp&&f.pp.xongCa?'cả hai kỳ đã về nên đây là số thật'
        :'kế hoạch '+money(f.incKH)+' · kỳ chưa về vẫn đang ước'}</div></div>
      <div class="src-a" style="color:var(--pos)">${money(f.inc)}</div></div>
    <div class="daygroup dg-db1">DỰ BÁO 1 — DỰ CHI TRONG THÁNG</div>`;
  const c1=f.bd.filter(g=>g.ra);
  c1.forEach(g=>x+=LN(esc(g.n),g.ra,g.vuot
    ?'đã tiêu '+money(g.v)+' vượt hạn mức '+money(g.a)+', lấy số đã tiêu'
    :'hạn mức '+money(g.a)+' · đã tiêu '+money(g.v)));
  x+=(c1.length?'':trong)+`<div class="src total"><div class="src-n">CỘNG LẠI</div>
      <div class="src-a">${money(f.raPlan)}</div></div>
    <div class="daygroup dg-db2">DỰ BÁO 2 — CỐ ĐỊNH VÀ NỢ CÒN PHẢI TRẢ</div>`;
  const c2=f.bd.filter(g=>g.cd);
  c2.forEach(g=>x+=LN(esc(g.n),g.cd,g.id==='trano'
    ?'nghĩa vụ nợ '+money(g.a)+' − đã trả '+money(Math.min(g.v,g.a))
    :'kế hoạch '+money(g.fo.plan)+' − đã trả '+money(g.fo.da)));
  x+=(c2.length?'':trong)+`<div class="src total"><div class="src-n">CỘNG LẠI</div>
      <div class="src-a">${money(f.cdConLai)}</div></div>
    <div class="daygroup dg-db2">DỰ BÁO 2 — TỐC ĐỘ CHI LINH HOẠT MỖI NGÀY</div>`;
  /* tốc độ của từng nhóm = nhóm đó đã tiêu ÷ số ngày đã qua; cộng lại đúng bằng tốc độ chung */
  const c3=f.bd.filter(g=>g.lh).sort((a,b)=>b.lh-a.lh);
  c3.forEach(g=>x+=LN(esc(g.n),Math.round(g.lh/(f.passed||1)),
    money(g.lh)+' ÷ '+f.passed+' ngày đã qua'+(g.noBud?' · chưa đặt hạn mức':'')));
  x+=(c3.length?'':trong)+`<div class="src total"><div><div class="src-n">TỐC ĐỘ MỖI NGÀY</div>
      <div class="src-m">Cộng tốc độ của ${c3.length} nhóm — bằng ${money(f.lhDaChi)} ÷ ${f.passed} ngày đã qua</div></div>
      <div class="src-a">${money(Math.round(f.rate))}</div></div>
    <div class="src total"><div><div class="src-n">CÒN PHẢI TIÊU</div>
      <div class="src-m">${money(Math.round(f.rate))} × ${f.conLai} ngày còn lại</div></div>
      <div class="src-a">${money(Math.round(f.lhConLai))}</div></div></div>
    <div class="sp"></div><div class="stack-note"><span>Dòng "đã chi tới hôm nay" của Dự báo 2 chính là phần Cơ cấu chi tiêu ở trên, nên không lặp lại ở đây.</span></div>`;
  return x;
}
function vHome(){
  const list=monthTx(cursor), chi=sumChi(list);
  const thuNhap=sum(list.filter(t=>t.t==='thu'&&['luong','thuong','tkhac'].includes(groupOf(t.c).id)));
  const now=new Date(), cur=ym(cursor)===ym(now);
  const passed=cur?now.getDate():daysIn(cursor);
  let h='';
  const bal=balances(), chk=bidvCheck();
  const tongDu=SRC.reduce((s2,x)=>s2+(bal[x.id]||0),0);
  h+=`<button class="strip" id="sec-bal" onclick="toggle('bal')">
      <span>${SRC.map(x=>esc(x.n.replace('Ví điện tử','Ví'))+' <b>'+short(bal[x.id]||0)+'</b>').join(' · ')}</span>
      <span class="strip-r">${money(tongDu)} ${open.bal?'▲':'▼'}</span></button>`;
  if(open.bal){
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
  }


  if(!list.length) h+=`<div class="empty"><b>Tháng này chưa có gì</b>Mở BIDV và ví, chụp giao dịch trong ngày, gửi vào chat của tháng rồi dán kết quả ở tab Nhập.</div>`;
  else{
    h+=`<div class="hero"><div class="lead">Đã chi trong ${MONTH(cursor.getMonth()).toLowerCase()}</div>
      <div class="sum">${money(chi)}</div>
      <div class="sub">${list.filter(t=>t.t==='chi').length} giao dịch · ${
        /* mùng 1 mới qua một ngày, chia cho 1 chưa phải trung bình */
        passed===1?`Đã chi <b>${short(chi)}</b> hôm nay`:`Trung bình <b>${short(chi/passed)}</b> mỗi ngày`}`
      +(thuNhap?` · Thu nhập <b>${short(thuNhap)}</b>`:'')+`</div></div>`;

    /* Cảnh báo lên ngay dưới ô tổng chi: việc gấp phải nằm trên, không bị đẩy xuống
       dưới bản đồ khối như trước. Nền màu để không lẫn với các khối trắng bên dưới. */
    if(cur){
      const al=alerts();
      if(al.length)h+=`<div class="alerts">`
        +al.map(a=>`<button class="al ${a.cls}" onclick="jump('${a.k}')">
          <span class="ic">${a.cls==='grey'?'i':'!'}</span><span class="tx">${a.t}</span><span>›</span></button>`).join('')+`</div>`;
      if(open.chain)h+=`<div class="sp"></div>`+chainPanel(open.chain);
    }

    const pa=pace(cursor);
    /* tháng đã đóng sổ thì nhịp chi hết nghĩa ("còn 0 ngày") — thay bằng bản tổng kết */
    if(!cur)h+=vTongKet();
    if(cur&&pa.duTru>0){
      const nhanh=pa.tyChi>pa.tyNgay;
      /* ngày cuối tháng không còn ngày nào để chia: còn bao nhiêu tiêu nốt bấy nhiêu hôm nay */
      const chuan=pa.chuan, tuNay=pa.conLai?pa.conDuoc/pa.conLai:pa.conDuoc, lech=tuNay-chuan;
      h+=`<h2 class="hl"><i style="background:${gcA('#5476C4')}"></i><b>Tổng ngân sách khả dụng</b>
        <em>${pa.conLai?'còn '+pa.conLai+' ngày':'ngày cuối tháng'}</em></h2>`;
      h+=`<div class="panel" style="padding:14px${open.pw?';border-radius:var(--r) var(--r) 0 0':''}" onclick="toggle('pw')">
        <div style="text-align:center">
          <div class="src-m">Số tiền còn lại được dùng để chi tiêu ${open.pw?'▾':'▸'}</div>
          <div style="font-size:32px;font-weight:600;letter-spacing:-.025em;margin:2px 0;color:${pa.conDuoc<0?'var(--brick)':'var(--pos)'}">${money(pa.conDuoc)}</div>
          <div class="src-m">Còn ${pa.conLai} ngày · Đã tiêu ${money(pa.daChi)} / ${money(pa.duTru)}</div></div>
        <div class="pace" style="margin-top:13px"><i style="width:${Math.min(100,pa.tyChi*100)}%;background:${nhanh?'var(--amber)':'var(--jade)'}"></i>
          <u style="left:${Math.min(100,pa.tyNgay*100)}%"></u></div>
        <div style="display:flex;gap:8px;margin-top:13px">
          <div style="flex:1;text-align:center;padding:10px 4px;border-radius:8px;background:var(--tint)">
            <div style="font-size:10.5px;color:var(--tinttx2)">ĐỊNH MỨC NGÀY</div>
            <div style="font-size:18px;font-weight:600;margin-top:3px;color:var(--tinttx)">${money(chuan)}</div>
            <div style="font-size:11px;color:var(--tinttx2)">Cố định cả tháng</div></div>
          <div style="flex:1;text-align:center;padding:10px 4px">
            <div style="font-size:10.5px;color:var(--ink-3)">THỰC TẾ ĐƯỢC TIÊU</div>
            <div style="font-size:18px;font-weight:600;margin-top:3px">${money(tuNay)}</div>
            <div style="font-size:11px;font-weight:500;color:${lech<0?'var(--brick)':'var(--pos)'}">${lech<0?'↓ Hụt '+money(-lech):'↑ Dôi ra '+money(lech)}</div></div>
        </div></div>`;
      if(open.pw)h+=paceWhy(pa);

      /* nhóm nào sắp hết hoặc đã hết hạn mức — để quyết định nhanh có chi tiếp hay không */
      const hm=hanMucChuY(cursor);
      if(hm.length){
        const nHet=hm.filter(x=>x.xau).length, nSap=hm.length-nHet;
        const hu=(n,t,bg,tx)=>n?`<span style="font-size:10.5px;padding:2px 8px;border-radius:20px;font-weight:600;
          white-space:nowrap;background:var(--${bg});color:var(--${tx})">${n} ${t}</span>`:'';
        h+=`<h2 class="hl"><i style="background:${gcA('#E0801A')}"></i><b>Hạn mức cần chú ý</b>
          <span style="display:flex;gap:5px">${hu(nHet,'đã hết','errbg','errtx')}${hu(nSap,'sắp hết','warnbg','warntx')}</span></h2>`;
        {
          h+=`<div class="panel" style="padding:2px 14px 12px">`;
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
            <button class="chk-btn" style="color:var(--ink-3)" onclick="jump('over')">Xem chi tiết ở Ngân sách →</button></div></div>`;
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
    const hut=f.tkKeHoach-f.keHoach;   /* thấp hơn mục tiêu tiết kiệm bao nhiêu */
    const mau=f.keHoach<0?'var(--brick)':hut>0?'var(--amber)':'var(--pos)';
    h+=`<h2 class="hl"><i style="background:${gcA('#47897A')}"></i><b>Dự báo để dành</b>
      ${f.tkKeHoach?'<em>mục tiêu '+short(f.tkKeHoach)+'</em>':''}</h2>`;
    /* hai dòng tổng quát đứng NGOÀI ô xổ xuống: đóng lại vẫn đọc được kết luận */
    h+=`<div class="panel"><div class="fcsum fcsum-1"><span>Tiêu vừa đủ hạn mức sẽ để dành được</span>
      <b style="color:${sMau(f.keHoach,f.tkKeHoach)}">${money(f.keHoach)}</b></div>
      <div class="fcsum fcsum-2"><span>Nếu giữ đà đang tiêu sẽ để dành được</span>
      <b style="color:${f.duocUoc?sMau(f.theoDa,f.tkKeHoach):'var(--ink-3)'}">${f.duocUoc?money(f.theoDa):'chưa ước được'}</b></div></div>`;
    h+=`<button class="fold" id="sec-fc" style="margin-top:8px${open.fc?';border-radius:var(--r) var(--r) 0 0':''}" onclick="toggle('fc')">
      <span style="font-size:13.5px">${open.fc?'▾':'▸'} Xem hai dự báo tính ra sao</span></button>`;
    if(open.fc){
      const R=(t,v,g,neg)=>`<div class="src" style="padding:10px 14px"><div style="min-width:0">
        <div class="src-n" style="font-size:13.5px">${t}</div>${g?`<div class="src-m">${g}</div>`:''}</div>
        <div class="src-a ${neg?'neg':''}" style="font-size:14px">${v}</div></div>`;
      h+=`<div class="panel" style="border-radius:0 0 var(--r) var(--r);border-top:0">
        <div class="daygroup dg-db1">DỰ BÁO 1 — NẾU TIÊU VỪA ĐỦ HẠN MỨC</div>
        ${R('Thu nhập',money(f.inc),payNote(f.pp))}
        ${R('− Dự chi trong tháng',money(f.raPlan),'mọi nhóm trừ Tiết kiệm, nhóm nào lỡ tiêu quá hạn mức thì tính số đã tiêu',1)}
        <div class="src total"><div><div class="src-n">ĐỂ DÀNH ĐƯỢC</div>
          <div class="src-m">${short(f.inc)} − ${short(f.raPlan)}${f.tkKeHoach?' · mục tiêu '+short(f.tkKeHoach):''}</div></div>
          <div class="src-a" style="color:${sMau(f.keHoach,f.tkKeHoach)}">${money(f.keHoach)}</div></div>
        ${goalMonthly()?`<div class="src" style="background:var(--row)"><div style="min-width:0">
          <div class="src-n" style="font-size:12.5px;font-weight:500;color:var(--ink-2)">Trong đó cần góp mục tiêu tài chính</div>
          <div class="src-m">Chỉ để biết, không trừ vào số trên</div></div>
          <div class="src-a" style="font-size:13px;color:var(--ink-2)">${money(goalMonthly())}</div></div>`:''}

        <div class="daygroup dg-db2">DỰ BÁO 2 — NẾU GIỮ ĐÀ ĐANG TIÊU</div>
        ${f.duocUoc?`
        ${R('Thu nhập',money(f.inc),payNote(f.pp))}
        ${R('− Đã chi tới hôm nay',money(f.daChi),(f.choMuon?'gồm cả '+money(f.choMuon)+' cho mượn · ':'')+'không kể tiền chuyển vào Tiết kiệm',1)}
        ${R('− Cố định và nợ còn phải trả',money(f.cdConLai),'các khoản trả một lần, không ngoại suy',1)}
        ${R('− Chi linh hoạt còn lại',money(f.lhConLai),short(f.rate)+' mỗi ngày × '+f.conLai+' ngày còn lại',1)}
        <div class="src total"><div><div class="src-n">ĐỂ DÀNH ĐƯỢC</div>
          <div class="src-m">${short(f.inc)} − ${short(f.daChi)} − ${short(f.cdConLai)} − ${short(f.rate)}×${f.conLai}</div></div>
          <div class="src-a" style="color:${sMau(f.theoDa,f.tkKeHoach)}">${money(f.theoDa)}</div></div>`
        :`<div class="src" style="padding:10px 14px"><div class="src-m">Chưa đủ ngày để ước tốc độ, đợi qua mùng 5.</div></div>`}
      </div>
      <div class="sp"></div><div class="stack-note"><span>Tiết kiệm là phần còn lại sau khi mọi nhóm khác tiêu xong. Tiêu vừa đủ hạn mức thì Cách 1 đúng bằng hạn mức Tiết kiệm; thấp hơn là tháng này để dành hụt.</span>
        <span><button style="background:none;border:0;padding:0;color:var(--jade);font-weight:600;font-size:12.5px" onclick="toggle('fcd')">${open.fcd?'thu gọn':'chi tiết từng nhóm'}</button></span></div>`;
      if(open.fcd)h+=`<div class="sp"></div><div class="detail">
        <div class="detail-hd">▾ CHI TIẾT TỪNG NHÓM CỦA DỰ BÁO Ở TRÊN</div>`+fcDetail(f)+`</div>`;
    }
    const xau=f.duocUoc?Math.min(f.keHoach,f.theoDa):f.keHoach;
    if(xau<0)h+=`<div class="sp"></div><div class="err">Theo đà này tháng nay không để dành được đồng nào, còn thiếu ${money(-xau)}. Cần cắt bớt ở nhóm linh hoạt ngay từ bây giờ.</div>`;
    else if(f.tkKeHoach&&xau<f.tkKeHoach)h+=`<div class="sp"></div><div class="warn">Sẽ để dành được ${money(xau)}, hụt ${money(f.tkKeHoach-xau)} so với mục tiêu tiết kiệm ${money(f.tkKeHoach)}.</div>`;
  }

  const dt=debtTotals();
  if(DB.debts.length){
    const soon=DB.debts.map(d=>dueLevel(debtInfo(d)))
      .filter(lv=>lv.k==='over'||lv.k==='now'||lv.k==='soon').length;
    h+=`<h2 class="hl"><i style="background:${gcA('#CF4640')}"></i><b>Nợ</b>
      <em><b style="color:var(--brick)">${short(dt.no)}</b> phải trả${dt.cho?' · '+short(dt.cho)+' phải thu':''}${soon?' · '+soon+' sắp hạn':''}</em></h2>`;
    h+=`<button class="fold" id="sec-debt" style="margin-top:0${open.nono?';border-radius:var(--r) var(--r) 0 0':''}" onclick="toggle('nono')">
      <span style="font-size:13.5px">${open.nono?'▾':'▸'} Xem từng khoản</span></button>`;
    if(open.nono){
      h+=`<div class="panel" style="border-radius:0 0 var(--r) var(--r);border-top:0">`;
      DB.debts.forEach(d=>h+=debtRow(d));
      h+=`</div><div class="sp"></div><button class="btn ghost" onclick="go('debt')">Mở sổ nợ</button>`;
    }
  }

  const gp=goalProgress().filter(x=>x.thieu>0).slice(0,2);
  if(gp.length){
    h+=`<h2 class="hl"><i style="background:${gcA('#9A6B95')}"></i><b>Mục tiêu đang thực hiện</b>
      <button style="background:none;border:0;padding:0;font-size:12px;font-weight:600;color:var(--jade)" onclick="go('trend')">xem tất cả</button></h2><div class="panel">`;
    gp.forEach(x=>{const pct=x.g.target?Math.min(100,x.co/x.g.target*100):0;
      h+=`<div style="padding:12px;border-bottom:1px solid var(--line-2)">
        <div class="cat-top"><span style="font-size:13.5px;font-weight:500">${esc(x.g.name)}</span>
          <span style="font-size:13px;font-weight:500">${money(x.co)}</span></div>
        <div class="track" style="height:6px;margin:8px 0 6px"><i style="width:${pct}%;background:var(--jade)"></i></div>
        <div class="cat-meta"><span>mục tiêu ${money(x.g.target)}</span>
          <span>${x.eta?'đủ vào '+x.eta.slice(5,7)+'/'+x.eta.slice(0,4):'chưa đặt mức tiết kiệm'}</span></div></div>`;});
    h+=`</div>`;
  }

  /* nhắc sao lưu đã nằm trong alerts() ở trên, bấm được để sang Cài đặt — không nhắc lại lần hai */
  if(msg)h+=`<div class="${msgType==='ok'?'ok':'err'}">${esc(msg)}</div>`;
  return h;
}

function vImport(){
  if(pending){
    const on=pending.filter(t=>t.keep), miss=pending.filter(needCat).length,
          ask=pending.filter(needRep).length;
    let h=`<h2>Kiểm tra trước khi lưu</h2><div class="panel">`;
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
               ${t.w?`<div class="tag">qua ví ${esc(t.w)}</div>`:''}`}
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
    if(miss)h+=`<div class="err">Còn ${miss} giao dịch chưa chọn nhóm.</div><div class="sp"></div>`;
    if(ask)h+=`<div class="err">Còn ${ask} giao dịch chưa chọn thay khoản cũ hay giữ cả hai.</div><div class="sp"></div>`;
    h+=`<button class="btn" ${on.length&&!miss&&!ask?'':'disabled'} onclick="commit()">Lưu ${on.length} giao dịch</button>
      <div class="sp"></div><button class="btn ghost" onclick="pending=null;render()">Quay lại</button>`;
    return h;
  }
  let h=`<h2>Dán kết quả từ Claude</h2>
    <div class="stack-note"><span>Mở BIDV và ví, chụp các giao dịch trong ngày, thả vào chat của tháng, chép kết quả rồi dán xuống đây.</span></div>
    <div class="sp"></div>
    <textarea id="paste" rows="7" placeholder="2026-08-22 10:07 | vi | chi | 20000 | Nạp data Viettel | hd_dt |  | 0981980039"></textarea>
    <div class="sp"></div><button class="btn" onclick="doPaste()">Đọc kết quả</button>`;
  if(msg)h+=`<div class="${msgType==='ok'?'ok':'err'}">${esc(msg)}</div>`;

  h+=`<h2>Ghi tay</h2><div class="panel">
    <div class="two">
      <div class="fld"><span>Loại</span><select id="mt" onchange="_mt=this.value;render()">
        ${[['chi','Chi'],['thu','Thu'],['mv','Chuyển tiền']].map(([v,n])=>`<option value="${v}" ${_mt===v?'selected':''}>${n}</option>`).join('')}</select></div>
      <div class="fld"><span>Số tiền</span><input id="ma" inputmode="text" placeholder="50k"></div>
    </div>
    <div class="fld"><span>Nội dung</span><input id="mn" placeholder="${_mt==='mv'?'Rút tiền mặt':'Cà phê sáng'}"></div>
    <div class="two">
      <div class="fld"><span>${_mt==='mv'?'Từ nguồn':'Nguồn tiền'}</span>
        <select id="msrc">${SRC.map(s=>`<option value="${s.id}" ${s.id===(_mt==='chi'?'tm':'bidv')?'selected':''}>${s.n}</option>`).join('')}</select></div>
      <div class="fld"><span>${_mt==='mv'?'Sang nguồn':'Nhóm'}</span>
        ${_mt==='mv'
          ? `<select id="ms2">${SRC.map(s=>`<option value="${s.id}" ${s.id==='tm'?'selected':''}>${s.n}</option>`).join('')}</select>`
          : catBtn(manualCode,_mt,'manual','0')}</div>
    </div>
    <div class="fld"><span>Ngày</span><input id="md" type="date" value="${iso(new Date())}"></div>
  </div><div class="sp"></div><button class="btn ghost" onclick="addManual()">Thêm giao dịch</button>`;
  return h;
}
let _mt='chi';

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
            <input type="date" value="${t.d}" onchange="setDate('${t.id}',this.value)"
              style="width:100%;padding:8px 9px;border:1px solid var(--line);border-radius:7px;background:var(--field);font-size:13px"></div>
          <div style="width:112px"><div class="cat-meta" style="margin:0 0 5px"><span>Giờ</span></div>
            <input type="time" value="${t.tm||''}" onchange="setTime('${t.id}',this.value)"
              style="width:100%;padding:8px 9px;border:1px solid var(--line);border-radius:7px;background:var(--field);font-size:13px"></div>
        </div>
        <div style="display:flex;gap:16px;margin-top:11px">
          <button class="chk-btn" onclick="event.stopPropagation();editName('${t.id}')">Sửa nội dung</button>
          <button class="chk-btn" onclick="event.stopPropagation();editDate('${t.id}')">Sửa ngày giờ</button>
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
    <button class="chk-btn" onclick="toggle('gadd')">${open.gadd?'đóng':'+ Thêm'}</button></div>
    <div class="stack-note" style="margin-bottom:8px"><span>Góp mỗi tháng <b>${money(goalMonthly())}</b>
      · ${(DB.goalPlan||{}).mode==='each'?'Vy đặt riêng từng mục tiêu':(DB.goalPlan||{}).mode==='manual'?'Vy tự đặt một số chung':'app tự tính từ mục tiêu có hạn'}
      <button style="background:none;border:0;padding:0 0 0 6px;color:var(--jade);font-weight:600;font-size:12.5px;text-decoration:underline" onclick="editGoalPlan()">sửa</button></span>
      <span>Khoản này bị trừ ngay sau chi phí cố định và trả nợ, trước khi chia hạn mức linh hoạt.</span></div>`;
  if(open.gadd){
    h+=`<div class="panel" style="margin-bottom:10px">
      <div class="fld"><span>Tên mục tiêu</span><input id="gn" placeholder="Tiết kiệm 100 triệu"></div>
      <div class="two"><div class="fld"><span>Số tiền</span><input id="ga" inputmode="text" placeholder="100tr"></div>
        <div class="fld"><span>Mong muốn đạt</span><input id="gd" type="month"></div></div>
    </div><button class="btn ghost" onclick="addGoal()">Thêm mục tiêu</button><div class="sp"></div>`;
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
      <span>${open.sos?'▾':'▸'} So nhóm với tháng trước</span>
      <span style="font-size:12px;color:${mxCh&&mxCh.d>0?'var(--amber)':'var(--ink-3)'}">${mxCh?esc(mxCh.n)+' '+(mxCh.d>0?'+':'')+Math.round(mxCh.d)+'%':a.length+' nhóm'}</span></button>`;
    if(open.sos){
      h+=`<div class="panel" style="border-radius:0 0 var(--r) var(--r);border-top:0">`;
      a.forEach(([id,v])=>{const g=groupOf(id), pv=bMap[id]||0, dd2=pv?(v-pv)/pv*100:null;
        h+=`<div class="cat"><span class="spine" style="background:${gcA(g.c)}"></span><span class="cat-body">
          <span class="cat-top"><span class="cat-name">${esc(g.n)}</span><span class="cat-amt">${money(v)}</span></span>
          <span class="cat-meta"><span>tháng trước ${pv?money(pv):'—'}</span>
          <span style="color:${dd2===null?'var(--ink-3)':Math.abs(dd2)<10?'var(--ink-3)':dd2>0?'var(--amber)':'var(--pos)'};font-weight:500">${dd2===null?'mới':(dd2>0?'+':'')+Math.round(dd2)+'%'}</span>
          </span></span></div>`;});
      h+=`</div>`;
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
   ['Tổng quan tháng này','thực thu trừ thực chi. Thực thu chỉ gồm Lương, Thưởng, Thu khác — đi vay và thu nợ không phải thu nhập. Thực chi là mọi giao dịch chi trong tháng, kể cả cố định, tiết kiệm, cho mượn và trả nợ. Dương là tháng này tiền vào nhiều hơn tiền ra.'],
   ['Tổng ngân sách khả dụng','tổng hạn mức các nhóm linh hoạt, trừ Tiết kiệm, trừ Trả nợ, trừ Cho mượn, cộng khoản bù qua lại giữa các nhóm và phần hạn mức tồn đã chủ động rút trong tháng. Tên cũ là "Được tiêu cả tháng".'],
   ['Chi tiêu — năm dòng','chia đúng theo phân loại mục, không gom: chi linh hoạt · chi phí cố định (các giao dịch đã khớp khoản cố định) · Tiết kiệm & đầu tư · Cho mượn · Trả nợ. Năm dòng cộng lại đúng bằng tổng chi tháng.'],
   ['Số tiền còn lại được dùng để chi tiêu','tổng ngân sách khả dụng trừ số đã chi linh hoạt, trừ tiếp số đã cho mượn — tiền cho mượn đã ra khỏi túi nên không tiêu được nữa. Không gồm Tiết kiệm, Trả nợ và các khoản cố định đã khớp. Tiêu lố thì số này xuống âm và hiện màu đỏ, để Vy thấy đang lố bao nhiêu.'],
   ['Hạn mức cần chú ý','xét riêng phần linh hoạt của từng nhóm: hạn mức trừ đi khoản cố định của nhóm, đã chi trừ đi phần cố định đã trả. Nhóm hiện lên khi tiêu quá hạn mức (đã vượt), tiêu vừa hết (đã hết), đã dùng từ 80% trở lên (sắp hết), hoặc đã dùng vượt nhịp tháng quá 15 điểm phần trăm (tiêu nhanh). Nhóm thuần chi phí cố định không xét. Xếp nhóm dùng nhiều phần trăm nhất lên đầu.'],
   ['Nhịp tiêu — mẫu số','tổng hạn mức các nhóm linh hoạt, trừ Tiết kiệm, trừ Trả nợ, trừ Cho mượn, cộng khoản bù qua lại giữa các nhóm và phần hạn mức tồn đã chủ động rút trong tháng.'],
   ['Nhịp tiêu — tử số','tổng chi cùng phạm vi, loại giao dịch đã khớp chi phí cố định — kể cả khoản cố định chưa gắn mã, khớp theo số tiền xấp xỉ 15%. Chạm vào khối Số tiền còn lại được dùng để chi tiêu để xem bảng số nào trừ số nào.'],
   ['Định mức ngày','mẫu số chia số ngày trong tháng, cố định suốt tháng.'],
   ['Thực tế được tiêu','ngân sách còn lại chia số ngày còn lại, đổi theo thực tế mỗi ngày. Ngày cuối tháng không còn ngày nào để chia thì lấy thẳng ngân sách còn lại — còn bao nhiêu tiêu nốt bấy nhiêu trong hôm đó.'],
   ['Dự báo 1 — nếu tiêu vừa đủ hạn mức','thu nhập tháng trừ dự chi trong tháng. Dòng "Trong đó cần góp mục tiêu tài chính" chỉ hiện ra cho biết, KHÔNG trừ vào kết quả, vì tiền góp mục tiêu vẫn nằm trong phần để dành. Tên cũ là "Cách 1 — sẽ chi cả tháng".'],
   ['Dự báo 2 — tốc độ chi linh hoạt','mỗi nhóm lấy số đã tiêu chia số ngày đã qua ra tốc độ riêng của nhóm, rồi cộng tốc độ các nhóm lại. Bằng đúng tổng đã tiêu chia số ngày đã qua, chỉ bày ra cho biết nhóm nào đang chạy nhanh. Trả nợ và Cho mượn là khoản một lần nên không tính vào tốc độ, nhưng tiền đã cho mượn vẫn nằm trong dòng "đã chi tới hôm nay".'],
   ['So với tháng trước','trong khối Hạn mức cần chú ý, mỗi nhóm so tổng chi từ đầu tháng tới hôm nay với TỔNG CẢ THÁNG trước của chính nhóm đó. Hai vế cùng lấy tổng chi thô của nhóm, không trừ khoản cố định ở vế nào. Vì tháng này còn đang chạy nên app chỉ báo khi đã vượt hẳn tháng trước — tiêu ít hơn thì không nhắc, và tháng trước nhóm đó chưa tiêu đồng nào thì không có gì để so.'],
   ['Màu của số để dành','số âm mới tô đỏ. Số dương mà chưa đạt mục tiêu tiết kiệm thì tô vàng, đạt rồi thì tô xanh — để không nhầm "để dành ít hơn mong muốn" với "âm tiền".'],
   ['Hạn mức một nhóm','chi phí cố định thuộc nhóm đó cộng phần linh hoạt đã phân bổ. Riêng Trả nợ lấy đúng kỳ nợ đến hạn trong tháng. Hạn mức lưu riêng từng tháng, tháng chưa đặt thì thừa kế tháng gần nhất trước đó.'],
   ['Chi phí cố định đã chi chưa','cộng mọi giao dịch trong tháng có mã đối tác trùng mã nhận diện. Nếu bật tùy chọn xấp xỉ thì chỉ tính giao dịch lệch không quá 15%.'],
   ['Hạn mức tồn','cộng phần dư của tối đa 6 kỳ gần nhất, chỉ tính tháng có ghi chép, trần bằng 6 lần hạn mức tháng. Chỉ áp cho nhóm bật cộng dồn. Kỳ trước tiêu vượt thì thành số âm và bị trừ vào hạn mức tháng này.'],
   ['Rút hạn mức tồn','không tự cộng vào hạn mức. Chỉ khi Vy bấm rút thì phần rút mới vào hạn mức khả dụng và vào mẫu số nhịp tiêu.'],
   ['Thu nhập trong dự trù','tách giao dịch nhóm Lương thành hai kỳ theo ngày, lấy ngày đầu của kỳ 2 làm ranh giới. Kỳ đã về thì lấy đúng số thật; kỳ chưa về thì ước bằng trung bình kỳ đó của tối đa 3 tháng có ghi chép, chưa có lịch sử mới lấy phần còn thiếu so với kế hoạch. Thưởng và thu khác cộng thêm, không giữ chỗ. Cả hai kỳ đã về thì thu nhập tháng chốt bằng số thực nhận, dù cao hay thấp hơn kế hoạch.'],
   ['Dự trù để dành theo kế hoạch','thu nhập tháng − tổng số mọi nhóm (trừ Tiết kiệm) sẽ chi cả tháng, mỗi nhóm lấy số lớn hơn giữa hạn mức khả dụng và số đã tiêu. Tiêu vừa đủ hạn mức thì bằng đúng hạn mức Tiết kiệm.'],
   ['Dự trù để dành theo đà','thu nhập tháng − đã chi tới hôm nay − cố định và nợ còn phải trả − tốc độ chi linh hoạt nhân số ngày còn lại. Trước ngày 5 không ước.'],
   ['Tổng kết tháng đã đóng','mở lại một tháng đã qua thì khối nhịp tiêu biến mất, thay bằng bản tổng kết. Để dành được = thực thu − thực chi, trong đó thực chi gồm cố định, nợ và mọi nhóm chi nhưng KHÔNG tính tiền góp vào Tiết kiệm & đầu tư — cất tiền sang tiết kiệm là dời chỗ, không phải tiêu. Cùng cách tính với khối Dự trù để dành chạy trong tháng, nên hai con số so được với nhau. Mỗi dòng có cờ so với tháng liền trước, màu theo ý nghĩa: chi giảm là xanh, thu và để dành tăng là xanh.'],
   ['Phân bổ tiền để dành','chia làm ba mục, cộng lại đúng bằng số để dành. Một là góp mục tiêu tài chính, lấy từ tiền đã góp vào nhóm Tiết kiệm & đầu tư, tối đa bằng mức góp kế hoạch. Hai là phần góp thêm còn lại của nhóm đó; các tiểu mục như Gửi tiết kiệm, Mua vàng chia theo đúng tỷ lệ phần còn lại này, dòng cuối nhận phần dư cho khỏi lệch làm tròn. Ba là số dư còn trong tài khoản, bằng thu trừ chi — số này ÂM khi tháng đó góp vào tiết kiệm nhiều hơn phần dư ra, tức phải bù bằng tiền các tháng trước.'],
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
  let h=`<h2>Số dư ban đầu</h2>
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
    <details><summary style="font-size:13px;color:var(--ink-3);padding:4px 0">Xem lại câu lệnh đặt trong project</summary>
      <div class="sp"></div><textarea class="mono" rows="5" readonly onclick="this.select()">${esc(promptText())}</textarea>
      <div class="sp"></div><button class="btn ghost" onclick="copyPrompt()">Chép câu lệnh</button></details>`;

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
function toggle(id){open[id]=!open[id];render()}
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
function newDebt(kind,name,amount){
  const k=kind||(confirm('Đây là khoản Vy đi vay?\nOK = tôi đi vay · Hủy = tôi cho người khác mượn')?'no':'cho');
  const nm=name||prompt('Tên khoản nợ (tên người hoặc tên món):','');
  if(!nm)return null;
  const a=amount||parseAmt(prompt('Số tiền gốc:','')||'');
  if(!a||isNaN(a))return null;
  const gop=k==='no'&&confirm('Đây là khoản trả góp hàng tháng?\nOK = trả góp · Hủy = trả một lần');
  const d={id:'d'+Date.now(),name:nm.slice(0,40),kind:k,mode:gop?'gop':'canhan',
    principal:a,start:iso(new Date())};
  if(gop){
    d.periods=parseInt(prompt('Trả trong bao nhiêu kỳ (tháng)?','12'),10)||12;
    d.per=parseAmt(prompt('Mỗi kỳ trả bao nhiêu?','')||'')||Math.round(a/d.periods);
    const day=parseInt(prompt('Ngày trả hàng tháng (1-28):','15'),10)||15;
    d.start=iso(new Date()).slice(0,8)+String(Math.min(28,Math.max(1,day))).padStart(2,'0');
  }else{
    const du=prompt('Ngày dự kiến trả (YYYY-MM-DD), để trống nếu chưa biết:','');
    if(du&&/^\d{4}-\d{2}-\d{2}$/.test(du.trim()))d.due=du.trim();
  }
  DB.debts.push(d);save();render();return d;
}
function editDebt(id){
  const d=DB.debts.find(x=>x.id===id);if(!d)return;
  const nm=prompt('Tên khoản nợ:',d.name); if(nm)d.name=nm.slice(0,40);
  if(d.mode==='gop'){
    const p=parseInt(prompt('Số kỳ:',d.periods),10); if(p)d.periods=p;
    const per=parseAmt(prompt('Mỗi kỳ trả bao nhiêu:',money(d.per))||''); if(per)d.per=per;
    const g=parseAmt(prompt('Số tiền gốc:',money(d.principal))||''); if(g)d.principal=g;
    const day=parseInt(prompt('Ngày trả hàng tháng (1-28):',d.start.slice(8,10)),10);
    if(day)d.start=d.start.slice(0,8)+String(Math.min(28,Math.max(1,day))).padStart(2,'0');
  }else{
    const g=parseAmt(prompt('Số tiền gốc:',money(d.principal))||''); if(g)d.principal=g;
    const du=prompt('Ngày dự kiến trả (YYYY-MM-DD):',d.due||'');
    if(du&&/^\d{4}-\d{2}-\d{2}$/.test(du.trim()))d.due=du.trim(); else if(du==='')delete d.due;
  }
  save();flash('Đã cập nhật.','ok');
}
function delDebt(id){
  const d=DB.debts.find(x=>x.id===id);if(!d)return;
  if(!confirm('Xóa khoản "'+d.name+'"? Các giao dịch đã ghi vẫn giữ nguyên.'))return;
  DB.txns.forEach(t=>{if(t.debt===id)delete t.debt;});
  DB.debts=DB.debts.filter(x=>x.id!==id);save();render();
}
function payDebt(id){
  const d=DB.debts.find(x=>x.id===id);if(!d)return;
  const i=debtInfo(d);
  const a=parseAmt(prompt((d.kind==='cho'?'Thu về':'Trả')+' bao nhiêu?',money(i.nextAmt||i.left))||'');
  if(!a||isNaN(a)){flash('Số tiền chưa hợp lệ.','err');return;}
  const sc=(prompt('Từ nguồn nào? gõ 1 BIDV, 2 Ví, 3 Tiền mặt','1')||'1').trim();
  const s=sc==='2'?'vi':sc==='3'?'tm':'bidv';
  DB.txns.push({id:Date.now()+Math.random(),d:iso(new Date()),a,
    t:d.kind==='cho'?'thu':'chi', c:d.kind==='cho'?'thuno':(d.mode==='gop'?'trano_gop':'trano_cn'),
    s, n:(d.kind==='cho'?'Thu về từ ':'Trả nợ ')+d.name, debt:d.id});
  save();flash('Đã ghi '+money(a)+'.','ok');
}
function tog(i){pending[i].keep=!pending[i].keep;render()}
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
function del(id){DB.txns=DB.txns.filter(x=>String(x.id)!==id);save();render()}
function setDate(id,v){
  if(!/^\d{4}-\d{2}-\d{2}$/.test(v))return;
  const t=DB.txns.find(x=>String(x.id)===id); if(!t)return;
  t.d=v; save(); flash('Đã đổi ngày thành '+v.slice(8,10)+'/'+v.slice(5,7)+'.','ok');
}
function setTime(id,v){
  const t=DB.txns.find(x=>String(x.id)===id); if(!t)return;
  if(/^\d{2}:\d{2}$/.test(v))t.tm=v; else delete t.tm;
  save(); render();
}
function editDate(id){
  const t=DB.txns.find(x=>String(x.id)===id); if(!t)return;
  const d1=prompt('Ngày giao dịch (YYYY-MM-DD):',t.d); if(d1===null)return;
  if(!/^\d{4}-\d{2}-\d{2}$/.test(d1.trim())){flash('Ngày chưa đúng dạng.','err');return;}
  const t1=prompt('Giờ (HH:MM), để trống nếu không có:',t.tm||''); if(t1===null)return;
  t.d=d1.trim();
  if(t1.trim()&&/^\d{1,2}:\d{2}$/.test(t1.trim()))t.tm=t1.trim().padStart(5,'0'); else delete t.tm;
  save(); flash('Đã sửa ngày giờ.','ok');
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
  const o={id:Date.now()+Math.random(),d:document.getElementById('md').value||iso(new Date()),
    a,t:type,n:n||(type==='mv'?'Chuyển tiền':'Giao dịch'),s:document.getElementById('msrc').value};
  if(type==='mv'){o.s2=document.getElementById('ms2').value;
    if(o.s2===o.s){flash('Hai nguồn phải khác nhau.','err');return;}}
  else{o.c=manualCode;
    if(!o.c){flash('Chưa chọn nhóm.','err');return;}}
  DB.txns.push(o);manualCode='';save();msg='';cursor=new Date();go('home');autoBackup();
}
function applyBackup(d){
  if(!d||!Array.isArray(d.txns))throw 0;
  if((d.v||1)<10)d=migrate(d);
  DB=Object.assign({},d,{txns:d.txns,debts:Array.isArray(d.debts)?d.debts:[],budgets:d.budgets||{},
    fixedItems:Array.isArray(d.fixedItems)?d.fixedItems:[],roll:d.roll||{},offsets:Array.isArray(d.offsets)?d.offsets:[],draws:Array.isArray(d.draws)?d.draws:[],income:d.income||0,rules:d.rules||{},
    opens:Object.assign({bidv:0,vi:0,tm:0},d.opens||{}),checks:d.checks||{},
    opts:Object.assign({ab:'off'},d.opts||{}),efGop:d.efGop||0,lastBackup:d.lastBackup||0,v:10});
  save();flash('Đã khôi phục '+d.txns.length+' giao dịch.','ok');
}
function restoreFile(el){const f=el.files&&el.files[0];if(!f)return;
  const r=new FileReader();
  r.onload=()=>{try{applyBackup(JSON.parse(r.result));}catch(e){flash('File sao lưu không đọc được.','err');}};
  r.onerror=()=>flash('Không mở được file.','err'); r.readAsText(f);}
function doRestore(){try{applyBackup(JSON.parse(document.getElementById('restore').value));}
  catch(e){flash('Bản sao lưu không đọc được.','err');}}
function wipe(){if(confirm('Xóa hết giao dịch, hạn mức và quy tắc? Không khôi phục được.')){
  DB={txns:[],debts:[],budgets:{},bm:{},goals:[],fixedItems:DB.fixedItems,roll:DB.roll,offsets:[],draws:[],income:DB.income,rules:{},opens:DB.opens,checks:{},opts:DB.opts,efGop:0,lastBackup:0,v:10};save();msg='';go('home');}}
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
