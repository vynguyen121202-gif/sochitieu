/* Sổ mẫu dùng chung cho bài kiểm tra và máy chủ xem thử.
   Hạt giống cố định nên chạy bao nhiêu lần cũng ra đúng một sổ.
   soMau({trong:3}) để trống 3 ngày gần nhất — dùng khi muốn thấy khối nhắc ghi sổ.
   id của mỗi giao dịch là mốc thời gian thật, để khối "Lần cuối cập nhật" có giờ. */
let _s=20260920;
const ran=()=>{_s=(_s*1103515245+12345)&0x7fffffff;return _s/0x7fffffff;};


function soMau(opt){
  const TRONG=(opt&&opt.trong)||0;
  _s=20260920;
  const txns=[]; const nay=new Date(), Y=nay.getFullYear(), Mo=nay.getMonth();
  const P=(y,m,d)=>y+'-'+String(m).padStart(2,'0')+'-'+String(Math.min(d,28)).padStart(2,'0');
  const rnd=(a,b)=>Math.round((a+ran()*(b-a))/1000)*1000;
  /* id = mốc thời gian lúc "bấm Lưu", để khối nhắc hiện được cả giờ */
  const idCua=(y,m,d,h,mi)=>new Date(y,m-1,d,h,mi).getTime()+ran();
  const MA=['an_sang','an_ngoai','an_cafe','cho_vat','cho_giavi','di_xang','di_grab','di_guixe',
    'gt_ban','gt_phim','qa_ao','ld','sk_thuoc','ht_sach','gd_qua','gdu','tt'];
  const hetThangNay=Math.max(1,nay.getDate()-TRONG);

  for(let k=7;k>=0;k--){
    const d0=new Date(Y,Mo-k,1), y=d0.getFullYear(), m=d0.getMonth()+1;
    const het=k===0?hetThangNay:28;
    const add=(day,t,a,c,s,extra)=>{ if(day>het)return;
      const h=8+Math.floor(ran()*12), mi=Math.floor(ran()*60);
      txns.push(Object.assign({id:idCua(y,m,Math.min(day,28),h,mi),d:P(y,m,day),t,a,c,
        s:s||'bidv',n:'GD '+c,n0:'GD '+c},extra||{}));};
    add(5,'thu',rnd(8600000,9400000),'luong',null,{tm:'09:15'});
    add(20,'thu',rnd(6600000,7400000),'luong',null,{tm:'09:25'});
    add(7,'chi',3000000,'hd',null,{p:'1234567890',n:'Tien nha',n0:'Tien nha'});
    add(10,'chi',250000,'hd',null,{n:'Internet',n0:'Internet'});
    add(15,'chi',800000,'hd',null,{n:'Bao hiem',n0:'Bao hiem'});
    add(18,'chi',1500000,'trano_gop',null,{n:'Tra gop dien thoai',n0:'Tra gop dien thoai'});
    add(6,'chi',rnd(1000000,2200000),'tk_gui');
    if(k%2===0)add(21,'chi',rnd(800000,2000000),'tk_vang');
    const n=18+Math.floor(ran()*8);
    for(let i=0;i<n;i++)add(1+Math.floor(ran()*27),'chi',rnd(35000,450000),
      MA[Math.floor(ran()*MA.length)],['bidv','vi','tm'][i%3]);
    if(k===0){
      add(12,'chi',2000000,'muon',null,{n:'Cho Lan muon',n0:'Cho Lan muon'});
      add(9,'chi',700000,'sk_thuoc','vi',{n:'Kham rang',n0:'Kham rang'});
      add(14,'chi',450000,'sk_thuoc',null,{n:'Thuoc',n0:'Thuoc'});
    }
  }
  const hn=new Date();
  return {txns,v:10,
    debts:[{id:'d1',name:'Tra gop dien thoai',kind:'no',mode:'gop',per:1500000,periods:12,
            principal:16000000,start:P(hn.getFullYear(),hn.getMonth()-5||1,18)},
           {id:'d2',name:'Muon chi Ha',kind:'no',mode:'don',principal:5000000,
            due:P(hn.getFullYear(),hn.getMonth()+3>12?12:hn.getMonth()+3,28)},
           {id:'d3',name:'Cho Lan muon',kind:'cho',mode:'don',principal:2000000,
            due:P(hn.getFullYear(),hn.getMonth()+2>12?12:hn.getMonth()+2,15)}],
    budgets:{an:4000000,cho:1500000,di:1500000,hd:3500000,qa:1000000,gt:1200000,ld:800000,
             sk:600000,ht:700000,tt:300000,gdu:400000,gd:1000000,tk:3000000},
    bm:{},
    goals:[{id:'g1',name:'Mua xe',target:60000000,due:'2028-12',gop:500000},
           {id:'g2',name:'Hoc thac si',target:40000000,due:'2029-06',gop:200000}],
    fixedItems:[{id:'f1',name:'Tien nha',a:3000000,code:'hd',mp:'1234567890',day:5},
                {id:'f2',name:'Internet',a:250000,code:'hd',mp:'',day:10},
                {id:'f3',name:'Bao hiem',a:800000,code:'hd',mp:'',day:15}],
    roll:{gt:1,gd:1,qa:1,gdu:1,ht:1,sk:1,tt:1},offsets:[],draws:[],ngayOK:{},
    income:16000000,rules:{},opens:{bidv:5000000,vi:500000,tm:300000},checks:{},
    opts:{ab:'off'},chainOK:{},efTarget:0,efGop:800000,
    goalPlan:{mode:'each',a:0},payDays:{k1:[5,10],k2:[15,25]},
    lastBackup:Date.now(),fxDone:{}};
}

module.exports={soMau,lamMoiHat:()=>{_s=20260920;}};
