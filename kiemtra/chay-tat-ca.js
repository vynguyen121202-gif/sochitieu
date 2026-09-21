/* Chạy hết bài kiểm tra: node kiemtra/chay-tat-ca.js */
const {execFileSync}=require('child_process'), path=require('path');
const bo=['kt-tongquan.js','kt-nhap-tong.js','kt-nhap-loi.js','kt-nhac-ghi-so.js'];
let loi=0, diem=0;
for(const f of bo){
  let r;
  try{ r=execFileSync(process.execPath,[path.join(__dirname,f)],{encoding:'utf8'}); }
  catch(e){ r=(e.stdout||'')+(e.stderr||''); loi++; }
  const d=(r.match(/✓ /g)||[]).length; diem+=d;
  const x=r.split('\n').filter(l=>l.includes('✗'));
  console.log((x.length?'✗':'✓')+'  '+f.padEnd(20)+d+' điểm');
  x.forEach(l=>console.log('      '+l.trim()));
  if(x.length)loi++;
}
console.log('\n'+(loi?'✗ CÒN LỖI':'✓ TẤT CẢ ĐỀU ĐẠT')+' — tổng '+diem+' điểm');
process.exit(loi?1:0);
