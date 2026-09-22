import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getFirestore,collection,addDoc,query,where,orderBy,limit,onSnapshot,serverTimestamp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
const firebaseConfig={apiKey:"AIzaSyA9dEr5JvvGo-xQ-6llmV6rCt_5P258YR0",authDomain:"punarasarmela.firebaseapp.com",projectId:"punarasarmela",storageBucket:"punarasarmela.firebasestorage.app",messagingSenderId:"368252030672",appId:"1:368252030672:web:531a9c3307271819e698d5",measurementId:"G-YMC3Y69L6H"};
const app=initializeApp(firebaseConfig); const db=getFirestore(app); const $=s=>document.querySelector(s);
const INSTAGRAM_URL='https://www.instagram.com/bhaktbabaka5555/';
const SITE_IMAGES={hero:'https://drive.google.com/thumbnail?id=1cJOiDSAvkK-UddEKVYM6SH8gcBGNw94a&sz=w2000',darshan:'https://drive.google.com/thumbnail?id=1mbbQ3vQW7xatLUdvAStCxrsH-Emi6eGQ&sz=w2000',toran:'https://drive.google.com/thumbnail?id=1GFXHXpUJAm1Zep4AJ0ixYGg74w5CqHVI&sz=w2000',poster:'https://drive.google.com/thumbnail?id=169km1j5fE9acB6Z-03qtaIyhunKffCaD&sz=w2000'};
let galleryFilter='all';
const POSTER_BASE_IMAGE=SITE_IMAGES.poster;
const posterStyles={classic:['#5b0909','#a62b17','#2b0808'],royal:['#21120a','#6b4515','#120a06'],minimal:['#3b1712','#b85a2b','#24100c']};
const wishCanvas=$('#wishPosterCanvas');
const heroEl=$('.hero');
const kodamVisualImg=document.querySelector('.kodam-visual img');
if(heroEl){heroEl.style.backgroundImage="linear-gradient(180deg,rgba(48,11,11,.25),rgba(48,11,11,.72)),url('"+SITE_IMAGES.hero+"')";heroEl.style.backgroundSize='cover';heroEl.style.backgroundPosition='center';}
if(kodamVisualImg){kodamVisualImg.src=SITE_IMAGES.hero;}
const darshanSection=$('#darshan');
if(darshanSection){const img=document.createElement('img');img.src=SITE_IMAGES.darshan;img.alt='कोडमदेसर भैरूनाथ जी के दर्शन';img.className='section-reference-image';darshanSection.querySelector('.wrap')?.insertBefore(img,darshanSection.querySelector('.grid'));}
const padyatraSection=$('#padyatra');
if(padyatraSection){const img=document.createElement('img');img.src=SITE_IMAGES.toran;img.alt='कोडमदेसर धाम का तोरण द्वार';img.className='section-reference-image';padyatraSection.querySelector('.wrap')?.insertBefore(img,padyatraSection.querySelector('.grid'));}
const wishCtx=wishCanvas?.getContext('2d');
let wishPhotoData=null,wishGenerated=false,wishFollowed=false;
if($('#instagramFollowBtn')) $('#instagramFollowBtn').href=INSTAGRAM_URL;
function roundedRect(ctx,x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath()}
const POSTER_MURTI_IMAGE=SITE_IMAGES.darshan;
const POSTER_TORAN_IMAGE=SITE_IMAGES.toran;

function loadPosterImage(src,allowCors=true){
 return new Promise(resolve=>{
  if(!src){resolve(null);return}
  const img=new Image();
  let settled=false;
  const done=value=>{
   if(settled)return;
   settled=true;
   clearTimeout(timer);
   resolve(value);
  };
  const timer=setTimeout(()=>done(null),9000);
  img.onload=()=>done(img);
  img.onerror=()=>{
   if(allowCors){
    const retry=new Image();
    retry.onload=()=>done(retry);
    retry.onerror=()=>done(null);
    retry.src=src;
   }else done(null);
  };
  if(allowCors)img.crossOrigin='anonymous';
  img.src=src;
 });
}

async function drawWishPoster(){
 if(!wishCtx)return;
 const W=1080,H=1920;
 wishCtx.clearRect(0,0,W,H);

 const g=wishCtx.createLinearGradient(0,0,W,H);
 g.addColorStop(0,'#4a0d13');
 g.addColorStop(.4,'#761b22');
 g.addColorStop(.8,'#300b0b');
 g.addColorStop(1,'#1a0404');
 wishCtx.fillStyle=g;
 wishCtx.fillRect(0,0,W,H);

 const [imgMurti,imgToran]=await Promise.all([
  loadPosterImage(POSTER_MURTI_IMAGE,true).then(x=>x||loadPosterImage('assets/kodamdesar-bhairunath-original.jpg',false)),
  loadPosterImage(POSTER_TORAN_IMAGE,true)
 ]);
 drawMergedPosterCanvas(imgMurti,imgToran);
}

function drawMergedPosterCanvas(imgMurti,imgToran){
 const W=1080,H=1920;

 wishCtx.strokeStyle='#f2cf79';
 wishCtx.lineWidth=12;
 roundedRect(wishCtx,30,30,W-60,H-60,32);
 wishCtx.stroke();
 wishCtx.strokeStyle='rgba(118,27,34,0.8)';
 wishCtx.lineWidth=4;
 roundedRect(wishCtx,42,42,W-84,H-84,24);
 wishCtx.stroke();

 if(imgMurti){
  const mx=50,my=80,mw=490,mh=620;
  wishCtx.save();
  wishCtx.globalAlpha=.92;
  const s=Math.max(mw/imgMurti.width,mh/imgMurti.height);
  const nw=imgMurti.width*s,nh=imgMurti.height*s;
  wishCtx.drawImage(imgMurti,mx+(mw-nw)/2,my+(mh-nh)/2,nw,nh);
  wishCtx.restore();

  const mGrad=wishCtx.createLinearGradient(mx,my+mh-120,mx,my+mh);
  mGrad.addColorStop(0,'rgba(48,11,11,0)');
  mGrad.addColorStop(1,'rgba(48,11,11,.95)');
  wishCtx.fillStyle=mGrad;
  wishCtx.fillRect(mx,my+mh-120,mw,120);
 }

 if(imgToran){
  const tx=50,ty=720,tw=490,th=430;
  wishCtx.save();
  wishCtx.globalAlpha=.90;
  const s=Math.min(tw/imgToran.width,th/imgToran.height);
  const nw=imgToran.width*s,nh=imgToran.height*s;
  wishCtx.drawImage(imgToran,tx+(tw-nw)/2,ty+(th-nh)/2,nw,nh);
  wishCtx.restore();

  const tGrad=wishCtx.createLinearGradient(tx,ty,tx,ty+80);
  tGrad.addColorStop(0,'rgba(48,11,11,.9)');
  tGrad.addColorStop(1,'rgba(48,11,11,0)');
  wishCtx.fillStyle=tGrad;
  wishCtx.fillRect(tx,ty,tw,80);
 }

 const divGrad=wishCtx.createLinearGradient(560,80,560,1180);
 divGrad.addColorStop(0,'rgba(242,207,121,0)');
 divGrad.addColorStop(.2,'rgba(242,207,121,.6)');
 divGrad.addColorStop(.8,'rgba(242,207,121,.6)');
 divGrad.addColorStop(1,'rgba(242,207,121,0)');
 wishCtx.strokeStyle=divGrad;
 wishCtx.lineWidth=3;
 wishCtx.beginPath();
 wishCtx.moveTo(560,80);
 wishCtx.lineTo(560,1180);
 wishCtx.stroke();

 wishCtx.textAlign='right';
 wishCtx.fillStyle='#ffe2a0';
 wishCtx.font='bold 42px "Noto Sans Devanagari",sans-serif';
 wishCtx.fillText('🚩 जय श्री भैरूनाथ 🚩',W-70,120);

 wishCtx.fillStyle='#fff8ed';
 wishCtx.font='bold 50px "Noto Sans Devanagari",sans-serif';
 wishCtx.fillText('सभी बीकानेर वासियों को',W-70,195);

 wishCtx.fillStyle='#ffb21f';
 wishCtx.font='bold 66px "Noto Sans Devanagari",sans-serif';
 wishCtx.fillText('कोडमदेसर भैरूनाथ',W-70,285);

 wishCtx.fillStyle='#ffffff';
 wishCtx.font='bold 48px "Noto Sans Devanagari",sans-serif';
 wishCtx.fillText('मेला 2026 की हार्दिक शुभकामनाएं',W-70,365);

 wishCtx.fillStyle='rgba(60,8,8,.95)';
 roundedRect(wishCtx,580,415,430,70,16);
 wishCtx.fill();
 wishCtx.strokeStyle='#f2cf79';
 wishCtx.lineWidth=2;
 roundedRect(wishCtx,580,415,430,70,16);
 wishCtx.stroke();
 wishCtx.textAlign='center';
 wishCtx.fillStyle='#ffe2a0';
 wishCtx.font='bold 32px "Noto Sans Devanagari",sans-serif';
 wishCtx.fillText('📅 24–25 सितम्बर 2026',795,462);

 const px=580,py=510,pw=430,ph=580;
 const userCardBg=wishCtx.createRadialGradient(px+pw/2,py+ph/2,50,px+pw/2,py+ph/2,300);
 userCardBg.addColorStop(0,'rgba(215,140,50,.25)');
 userCardBg.addColorStop(1,'rgba(48,11,11,.6)');
 wishCtx.fillStyle=userCardBg;
 roundedRect(wishCtx,px,py,pw,ph,24);
 wishCtx.fill();
 wishCtx.strokeStyle='#f2cf79';
 wishCtx.lineWidth=3;
 roundedRect(wishCtx,px,py,pw,ph,24);
 wishCtx.stroke();

 if(wishPhotoData){
  const im=new Image();
  im.onload=()=>{
   const imgX=px+25,imgY=py+25,imgW=pw-50,imgH=ph-130;
   wishCtx.save();
   roundedRect(wishCtx,imgX,imgY,imgW,imgH,16);
   wishCtx.clip();
   const s=Math.max(imgW/im.width,imgH/im.height);
   const nw=im.width*s,nh=im.height*s;
   wishCtx.drawImage(im,imgX+(imgW-nw)/2,imgY+(imgH-nh)/2,nw,nh);
   wishCtx.restore();

   wishCtx.strokeStyle='#f2cf79';
   wishCtx.lineWidth=3;
   roundedRect(wishCtx,imgX,imgY,imgW,imgH,16);
   wishCtx.stroke();
   drawMergedPosterFooter(px,py,pw,ph);
  };
  im.src=wishPhotoData;
 }else{
  wishCtx.fillStyle='#ffe09a';
  wishCtx.font='bold 28px "Noto Sans Devanagari",sans-serif';
  wishCtx.textAlign='center';
  wishCtx.fillText('👤 अपनी फोटो यहाँ लगाएं',px+pw/2,py+ph/2-40);
  drawMergedPosterFooter(px,py,pw,ph);
 }
}

function drawMergedPosterFooter(px,py,pw,ph){
 const W=1080;
 const nameText=$('#wishName')?.value.trim()||'आपका नाम / दुकान';

 wishCtx.fillStyle='#761b22';
 roundedRect(wishCtx,px+15,py+ph-90,pw-30,72,16);
 wishCtx.fill();
 wishCtx.strokeStyle='#f2cf79';
 wishCtx.lineWidth=3;
 roundedRect(wishCtx,px+15,py+ph-90,pw-30,72,16);
 wishCtx.stroke();

 wishCtx.textAlign='center';
 wishCtx.fillStyle='#ffe2a0';
 wishCtx.font='bold 34px "Noto Sans Devanagari",sans-serif';
 wishCtx.fillText(nameText,px+pw/2,py+ph-44);

 wishCtx.fillStyle='#f2cf79';
 wishCtx.font='bold 38px "Tiro Devanagari Sanskrit",sans-serif';
 wishCtx.fillText('कोडमदेसर भैरूनाथ धाम • बीकानेर 🚩',W/2,1250);

 wishCtx.fillStyle='#f8dfb3';
 wishCtx.font='26px Arial,sans-serif';
 wishCtx.fillText('@bhaktbabaka5555  |  Kodamdesar Mela 2026',W/2,1310);
}

const target=new Date('2026-09-24T00:00:00+05:30').getTime();function countdown(){const d=Math.max(0,target-Date.now());$('#days').textContent=String(Math.floor(d/86400000)).padStart(2,'0');$('#hours').textContent=String(d%86400000/3600000|0).padStart(2,'0');$('#minutes').textContent=String(d%3600000/60000|0).padStart(2,'0');$('#seconds').textContent=String(d%60000/1000|0).padStart(2,'0')}countdown();setInterval(countdown,1000);
const darkBtn=$('#darkModeBtn');if(darkBtn){darkBtn.addEventListener('click',()=>{document.body.classList.toggle('dark-mode');darkBtn.textContent=document.body.classList.contains('dark-mode')?'☀️':'🌙'})}
const tickers=['24–25 सितम्बर 2026 • कोडमदेसर भैरूनाथ मेला','🚩 जय श्री भैरूनाथ • श्रद्धालु Photo/Video शेयर करें','🎨 Free Poster Maker से अपनी शुभकामना poster बनाएं','🙏 सेवा समिति में अपनी सेवा की जानकारी भेजें'];let ti=0;setInterval(()=>{const t=$('#tickerText');if(t){ti=(ti+1)%tickers.length;t.textContent=tickers[ti]}},4500);
$('#shareBtn')?.addEventListener('click',async()=>{const x={title:'श्री कोडमदेसर भैरूनाथ मेला 2026',text:'24–25 सितम्बर 2026 • जय श्री भैरूनाथ 🚩',url:location.href};try{navigator.share?await navigator.share(x):window.open('https://wa.me/?text='+encodeURIComponent(x.title+'\n'+x.text+'\n'+x.url),'_blank')}catch(e){}});
$('#messageForm').addEventListener('submit',async e=>{e.preventDefault();const s=$('#status');s.textContent='संदेश भेजा जा रहा है…';try{await addDoc(collection(db,'messages'),{name:$('#name').value.trim(),text:$('#text').value.trim(),createdAt:serverTimestamp()});e.target.reset();s.textContent='संदेश सफलतापूर्वक भेज दिया गया ❤️'}catch(err){console.error(err);s.textContent='अभी संदेश नहीं भेजा जा सका।'}});
const mq=query(collection(db,'messages'),orderBy('createdAt','desc'),limit(30));onSnapshot(mq,s=>{$('#messages').innerHTML='';s.forEach(d=>{const x=d.data(),a=document.createElement('article');a.className='message';a.innerHTML='<strong>🚩 '+esc(x.name||'श्रद्धालु')+'</strong><p>'+esc(x.text||'')+'</p>';$('#messages').append(a)})},console.error);
function esc(v){const d=document.createElement('div');d.textContent=v;return d.innerHTML}function safeUrl(u){try{const x=new URL(u);return ['http:','https:'].includes(x.protocol)?x.href:'#'}catch{return '#'}}
const DRIVE_UPLOAD_URL='https://script.google.com/macros/s/AKfycbz0YMuppBaJeoFUJjpH6MYlJ0uh_LAQBGLb0Keho0Gi1AX8dBix4ltSLCIO-4ltPqAJ/exec';
function openDriveUploadModal(context){
  if(document.getElementById('driveUploadModal')){document.getElementById('driveUploadModal').classList.add('show');return}
  if(!document.getElementById('driveUploadModalStyle')){const st=document.createElement('style');st.id='driveUploadModalStyle';st.textContent='.drive-upload-modal{position:fixed;inset:0;z-index:10080;display:none}.drive-upload-modal.show{display:block}.drive-upload-backdrop{position:absolute;inset:0;background:rgba(35,5,8,.72);backdrop-filter:blur(5px)}.drive-upload-panel{position:relative;z-index:2;width:min(94vw,900px);height:min(92vh,820px);margin:4vh auto;background:#fff8ed;border:1px solid #e4b85d;border-radius:22px;box-shadow:0 24px 70px rgba(0,0,0,.35);overflow:hidden;display:flex;flex-direction:column}.drive-upload-head{display:flex;align-items:center;justify-content:space-between;padding:14px 18px;background:#4d0e15;color:#ffe4a4}.drive-upload-head button{width:38px;height:38px;border:0;border-radius:50%;background:#ffffff18;color:#fff;font-size:18px;cursor:pointer}.drive-upload-note{padding:10px 16px;background:#fff0d7;color:#6c2618;font-weight:700;font-size:14px}.drive-upload-panel iframe{width:100%;height:100%;border:0;background:#fff}@media(max-width:600px){.drive-upload-panel{width:96vw;height:94vh;margin:3vh auto;border-radius:16px}}';document.head.append(st)}
  const m=document.createElement('div');
  m.id='driveUploadModal';
  m.className='drive-upload-modal';
  m.innerHTML='<div class="drive-upload-backdrop"></div><div class="drive-upload-panel" role="dialog" aria-modal="true" aria-label="Direct Photo Video Upload"><div class="drive-upload-head"><b>📤 Direct Photo / Video Upload</b><button type="button" id="driveUploadClose">✕</button></div><div class="drive-upload-note">आपकी पिछली जानकारी इसी पेज पर बनी रहेगी। Upload पूरा होने के बाद नीचे Close दबाकर वापस आएँ।</div><iframe src="'+DRIVE_UPLOAD_URL+'" title="Google Drive Direct Upload" loading="lazy"></iframe></div>';
  document.body.append(m);
  const close=()=>m.classList.remove('show');
  m.querySelector('#driveUploadClose').addEventListener('click',close);
  m.querySelector('.drive-upload-backdrop').addEventListener('click',close);
  m.classList.add('show');
}
window.__openDriveUploadModal=openDriveUploadModal;
$('#sevaPhotoUploadBtn')?.addEventListener('click',()=>openDriveUploadModal('seva'));
$('#driveFallbackOpen')?.addEventListener('click',()=>openDriveUploadModal('media'));
function youtubeId(raw){try{const u=new URL(raw.trim());if(u.hostname.includes('youtu.be'))return u.pathname.slice(1).split('/')[0].slice(0,11);if(u.hostname.includes('youtube.com')){if(u.pathname==='/watch')return u.searchParams.get('v')?.slice(0,11)||'';if(u.pathname.startsWith('/shorts/'))return u.pathname.split('/')[2]?.slice(0,11)||'';if(u.pathname.startsWith('/embed/'))return u.pathname.split('/')[2]?.slice(0,11)||''}}catch(e){}return ''}
let activeCat='all';let songs=[];function catLabel(c){return c==='bhajan'?'🙏 भजन':c==='padayatra'?'🚩 पदयात्रा गीत':'🪔 आरती'}
function renderSongs(){const box=$('#songsList');box.innerHTML='';const arr=songs.filter(x=>activeCat==='all'||x.category===activeCat);if(!arr.length){box.innerHTML='<div class="empty-song">अभी इस श्रेणी में कोई गीत नहीं है। पहला गीत आप भेजें 🎵</div>';return}arr.forEach(x=>{const a=document.createElement('article');a.className='song-card';a.innerHTML='<div><span class="song-cat">'+catLabel(x.category)+'</span><h3>'+esc(x.title||'मेला भजन')+'</h3><small>🚩 '+esc(x.name||'श्रद्धालु')+'</small></div><button class="play-song" data-id="'+esc(x.youtubeId)+'" data-title="'+esc(x.title||'मेला भजन')+'" data-cat="'+esc(catLabel(x.category))+'">▶ चलाएँ</button>';box.append(a)})}
function stopNostalgiaScene(){
  document.body.classList.remove('nostalgia-playing');
  $('#camelCart')?.classList.remove('moving');
  $('#nostalgiaScene')?.classList.remove('active');
}
function startNostalgiaScene(title,cat){
  let scene=$('#nostalgiaScene');
  if(!scene){
    scene=document.createElement('div');
    scene.id='nostalgiaScene';
    scene.className='nostalgia-scene';
    scene.innerHTML='<div class="nostalgia-sky"></div><div class="nostalgia-sun"></div><div class="nostalgia-dunes"></div><div class="nostalgia-stars">✦　·　✧　·　✦</div><div class="nostalgia-village"><span>🏕️</span><span>🏕️</span><span>🪔</span></div><div class="nostalgia-road"></div><div class="nostalgia-cart"><span class="nostalgia-dhוואजा">🚩</span><span class="nostalgia-cart-icon">🐪</span><span class="nostalgia-cart-body">🛞</span></div><div class="nostalgia-caption"><b>पुरानी यादें • मेला • भक्ति</b><small></small></div>';
    document.body.append(scene);
  }
  scene.querySelector('.nostalgia-caption small').textContent=(cat||'🎵 मेला भजन')+' • '+(title||'स्मृतियों का गीत');
  scene.classList.add('active');
  document.body.classList.add('nostalgia-playing');
}
function playSong(id,title,cat){
  if(!id)return;
  $('#nowTitle').textContent=title;
  $('#nowCategory').textContent=cat;
  startNostalgiaScene(title,cat);
  $('#camelCart')?.classList.add('moving');
  $('#youtubeBox').innerHTML='<iframe src="https://www.youtube.com/embed/'+encodeURIComponent(id)+'?autoplay=1&rel=0" title="'+esc(title)+'" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>';
  document.querySelector('#music').scrollIntoView({behavior:'smooth',block:'start'});
}
$('#musicTabs').addEventListener('click',e=>{const b=e.target.closest('button[data-cat]');if(!b)return;activeCat=b.dataset.cat;document.querySelectorAll('#musicTabs button').forEach(x=>x.classList.toggle('active',x===b));renderSongs()});
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopNostalgiaScene()});
$('#songsList').addEventListener('click',e=>{const b=e.target.closest('.play-song');if(b)playSong(b.dataset.id,b.dataset.title,b.dataset.cat)});
$('#songForm').addEventListener('submit',async e=>{e.preventDefault();const s=$('#songStatus'),id=youtubeId($('#songUrl').value);s.textContent='';if(!id||id.length!==11){s.textContent='सही YouTube वीडियो लिंक डालें।';return}s.textContent='गीत भेजा जा रहा है…';try{await addDoc(collection(db,'songs'),{name:$('#songName').value.trim(),category:$('#songCategory').value,title:$('#songTitle').value.trim(),youtubeId:id,status:'pending',createdAt:serverTimestamp()});e.target.reset();s.textContent='गीत सफलतापूर्वक भेज दिया गया ❤️'}catch(err){console.error(err);s.textContent='अभी गीत नहीं भेजा जा सका।'}});
const sq=query(collection(db,'songs'),where('status','==','approved'));onSnapshot(sq,s=>{songs=[];s.forEach(d=>songs.push(d.data()));songs.sort((a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0));songs=songs.slice(0,60);renderSongs()},err=>{console.error('Songs:',err);$('#songsList').innerHTML='<div class="empty-song">गीत अभी लोड नहीं हो पाए।</div>'});
$('#galleryFilters')?.addEventListener('click',e=>{const b=e.target.closest('button[data-filter]');if(!b)return;galleryFilter=b.dataset.filter;document.querySelectorAll('#galleryFilters button').forEach(x=>x.classList.toggle('active',x===b));renderMedia()});
function driveFileId(u){try{const s=String(u||'');const m=s.match(/[?&]id=([^&]+)/)||s.match(/\/d\/([^/]+)/);return m?m[1]:''}catch(e){return ''}}
function drivePreviewUrl(u){const id=driveFileId(u);return id?'https://drive.google.com/thumbnail?id='+encodeURIComponent(id)+'&sz=w1600':safeUrl(u)}
function driveViewUrl(u){const id=driveFileId(u);return id?'https://drive.google.com/file/d/'+encodeURIComponent(id)+'/view':safeUrl(u)}
function driveDirectUrl(u){const id=driveFileId(u);return id?'https://drive.google.com/uc?export=view&id='+encodeURIComponent(id):safeUrl(u)}
let mediaCache=[];
let mediaLikes={};
const likedMedia=new Set(JSON.parse(localStorage.getItem('kodamLikedMedia')||'[]'));
function loadMediaInteractions(){mediaCache.forEach(x=>{const id=x.id;if(!id)return;const q=query(collection(db,'mediaLikes'),where('mediaId','==',id));onSnapshot(q,s=>{mediaLikes[id]=s.size;document.querySelectorAll('[data-like-count="'+id+'"]').forEach(el=>el.textContent=String(s.size))})})}
async function toggleJaibaba(id,btn){if(!id)return;if(likedMedia.has(id)){btn.classList.add('liked');return}try{await addDoc(collection(db,'mediaLikes'),{mediaId:id,createdAt:serverTimestamp()});likedMedia.add(id);localStorage.setItem('kodamLikedMedia',JSON.stringify([...likedMedia]));btn.classList.add('liked');btn.querySelector('.like-label').textContent='जय बाबे री ❤️';}catch(e){console.error(e)}}
async function submitMediaComment(id,name,text,statusEl){try{await addDoc(collection(db,'mediaComments'),{mediaId:id,name:name||'श्रद्धालु',text,createdAt:serverTimestamp(),status:'approved'});statusEl.textContent='जय बाबे री 🙏 संदेश जुड़ गया ❤️';}catch(e){console.error(e);statusEl.textContent='Comment अभी नहीं जुड़ पाया।'}}

let previewItems=[],previewIndex=0;function ensureMediaPreview(){if($('#mediaPreviewModal'))return;const m=document.createElement('div');m.id='mediaPreviewModal';m.className='media-modal';m.innerHTML='<div class="media-modal-backdrop" data-close-preview></div><div class="media-modal-panel"><button class="media-modal-close" type="button" data-close-preview>✕</button><button class="media-modal-prev" type="button" data-preview-prev>‹</button><div id="mediaPreviewContent"></div><button class="media-modal-next" type="button" data-preview-next>›</button></div>';document.body.append(m)}function openMediaPreview(i){ensureMediaPreview();previewItems=mediaCache.filter(x=>galleryFilter==='all'||x.type===galleryFilter||(x.caption||'').toLowerCase().includes(galleryFilter==='padyatra'?'पदयात्र':galleryFilter==='mandir'?'मंदिर':'भंडारा')).slice(0,30);previewIndex=Math.max(0,Math.min(Number(i)||0,previewItems.length-1));renderPreview();document.body.classList.add('media-preview-open')}function renderPreview(){const x=previewItems[previewIndex],box=$('#mediaPreviewContent');if(!x||!box)return;const view=driveViewUrl(x.url),direct=driveDirectUrl(x.url);box.innerHTML=(x.type==='photo'?'<img class="media-modal-image" src="'+drivePreviewUrl(x.url)+'" data-fallback="'+direct+'" alt="'+esc(x.title||'Photo')+'" onerror="this.onerror=null;this.src=this.dataset.fallback">':'<iframe class="media-modal-video" src="'+view+'" title="'+esc(x.title||'Video')+'" allow="autoplay; fullscreen" allowfullscreen></iframe>')+'<div class="media-modal-info"><b>'+esc(x.title||'साझा कंटेंट')+'</b><p>'+esc(x.caption||'')+'</p><span>🚩 '+esc(x.name||'श्रद्धालु')+'</span><a target="_blank" rel="noopener" href="'+view+'">📂 Original file</a><div class="media-actions preview-actions"><button type="button" class="media-like '+(likedMedia.has(x.id)?'liked':'')+'" data-preview-like>🚩 <span class="like-label">'+(likedMedia.has(x.id)?'जय बाबे री ❤️':'जय बाबे री')+'</span> <span data-preview-count>'+String(mediaLikes[x.id]||0)+'</span></button><button type="button" class="media-comment-btn" data-preview-comment>💬 जय बाबे री</button><button type="button" class="media-share" data-preview-share>↗ शेयर</button></div><div class="media-comment-box" id="previewCommentBox" hidden><input id="previewCommentName" placeholder="आपका नाम"><input id="previewCommentText" placeholder="जय बाबे री 🙏 अपना संदेश"><button type="button" class="btn" data-preview-send>🚩 भेजें</button><small id="previewCommentStatus"></small></div></div>'}
function closeMediaPreview(){document.body.classList.remove('media-preview-open')}document.addEventListener('click',e=>{const p=e.target.closest('[data-preview]');if(p){openMediaPreview(p.dataset.preview);return}if(e.target.closest('[data-close-preview]'))closeMediaPreview();if(e.target.closest('[data-preview-prev]')){previewIndex=(previewIndex-1+previewItems.length)%previewItems.length;renderPreview()}if(e.target.closest('[data-preview-next]')){previewIndex=(previewIndex+1)%previewItems.length;renderPreview()}});document.addEventListener('keydown',e=>{if(!document.body.classList.contains('media-preview-open'))return;if(e.key==='Escape')closeMediaPreview();if(e.key==='ArrowLeft'){previewIndex=(previewIndex-1+previewItems.length)%previewItems.length;renderPreview()}if(e.key==='ArrowRight'){previewIndex=(previewIndex+1)%previewItems.length;renderPreview()}});
function renderMedia(){const box=$('#mediaList');if(!box)return;box.innerHTML='';let arr=mediaCache.filter(x=>galleryFilter==='all'||x.type===galleryFilter||(x.caption||'').toLowerCase().includes(galleryFilter==='padyatra'?'पदयात्र':galleryFilter==='mandir'?'मंदिर':'भंडारा')).slice(0,30);if(!arr.length){box.innerHTML='<div class="empty-song">अभी कोई Photo/Video नहीं मिला। 📸</div>';return}arr.forEach((x,i)=>{const a=document.createElement('article');a.className='card media-card';const preview=drivePreviewUrl(x.url),direct=driveDirectUrl(x.url);const media=x.type==='photo'?'<button type="button" class="media-open" data-preview="'+i+'"><img loading="lazy" class="media-preview" src="'+preview+'" data-fallback="'+direct+'" alt="'+esc(x.title||'साझा फोटो')+'" onerror="this.onerror=null;this.src=this.dataset.fallback"></button>':'<button type="button" class="media-open video-thumb" data-preview="'+i+'"><span>🎥</span><small>वीडियो Preview</small></button>';a.innerHTML=media+'<strong>'+(x.type==='video'?'🎥 ':'📸 ')+esc(x.title||'साझा कंटेंट')+'</strong><p>'+esc(x.caption||'')+'</p><div class="media-actions"><button type="button" class="media-like '+(likedMedia.has(x.id)?'liked':'')+'" data-like="'+esc(x.id)+'">🚩 <span class="like-label">'+(likedMedia.has(x.id)?'जय बाबे री ❤️':'जय बाबे री')+'</span> <span data-like-count="'+esc(x.id)+'">'+(mediaLikes[x.id]||0)+'</span></button><button type="button" class="media-comment-btn" data-comment="'+esc(x.id)+'">💬 जय बाबे री</button><button type="button" class="media-share" data-share="'+i+'">↗ शेयर</button></div><div class="media-comment-box" id="comment-'+esc(x.id)+'" hidden><input class="comment-name" placeholder="आपका नाम" maxlength="60"><input class="comment-text" placeholder="जय बाबे री 🙏 अपना संदेश लिखें" maxlength="300"><button type="button" class="btn comment-send">🚩 भेजें</button><small class="comment-status"></small></div><div class="meta">🚩 '+esc(x.name||'श्रद्धालु')+'</div>';a.querySelector('[data-like]').onclick=()=>toggleJaibaba(x.id,a.querySelector('[data-like]'));a.querySelector('[data-comment]').onclick=()=>{const b=a.querySelector('.media-comment-box');b.hidden=!b.hidden};a.querySelector('.comment-send').onclick=()=>{const b=a.querySelector('.media-comment-box');submitMediaComment(x.id,b.querySelector('.comment-name').value.trim(),b.querySelector('.comment-text').value.trim(),b.querySelector('.comment-status'))};a.querySelector('[data-share]').onclick=async()=>{const u=driveViewUrl(x.url);try{await navigator.share?.({title:x.title||'कोडमदेसर भैरूनाथ मेला',text:'🚩 जय बाबे री',url:u})||window.open('https://wa.me/?text='+encodeURIComponent((x.title||'मेला Photo')+' 🚩 जय बाबे री '+u),'_blank')}catch(e){}};box.append(a)})}
const mediaQuery=query(collection(db,'media'),where('status','==','approved'));
onSnapshot(mediaQuery,s=>{mediaCache=s.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0)).slice(0,60);renderMedia();loadMediaInteractions()},err=>{console.error('Media:',err);const box=$('#mediaList');if(box)box.innerHTML='<div class="empty-song">Photo/Video लोड नहीं हो पाया। कृपया page refresh करें।</div>'});
// Media uploads are handled by royal-ui.js. Keep Firestore-only seva submission here.
$('#sevaForm').addEventListener('submit',async e=>{e.preventDefault();const s=$('#sevaStatus');s.textContent='';try{await addDoc(collection(db,'seva'),{name:$('#sevaName').value.trim(),type:$('#sevaType').value,location:$('#sevaLocation').value.trim(),time:$('#sevaTime').value.trim(),phone:$('#sevaPhone').value.trim(),note:$('#sevaNote').value.trim(),status:'pending',createdAt:serverTimestamp()});e.target.reset();s.textContent='सेवा जानकारी सफलतापूर्वक भेज दी गई ❤️'}catch(err){console.error(err);s.textContent='अभी भेजा नहीं जा सका। कृपया दोबारा कोशिश करें।'}});const svq=query(collection(db,'seva'),where('status','==','approved'));onSnapshot(svq,s=>{const box=$('#sevaList');if(!box)return;box.innerHTML='';s=[...s.docs].sort((a,b)=>(b.data().createdAt?.seconds||0)-(a.data().createdAt?.seconds||0)).slice(0,30);s.forEach(d=>{const x=d.data(),a=document.createElement('article');a.className='seva-professional-card';const note=x.note?'<div class="seva-detail-note"><span>📝</span><p>'+esc(x.note)+'</p></div>':'';a.innerHTML='<div class="seva-card-top"><div class="seva-card-icon">🙏</div><div><span class="seva-card-label">सेवा समिति</span><h3>'+esc(x.name||'सेवा समिति')+'</h3></div></div><div class="seva-card-service"><span>सेवा का प्रकार</span><strong>'+esc(x.type||'सेवा')+'</strong></div><div class="seva-card-details"><div><small>📍 स्थान</small><b>'+esc(x.location||'जानकारी उपलब्ध नहीं')+'</b></div><div><small>🕐 कब / समय</small><b>'+esc(x.time||'जानकारी उपलब्ध नहीं')+'</b></div></div>'+note+'<div class="seva-card-footer"><a href="tel:'+esc(x.phone||'')+'">📞 '+esc(x.phone||'संपर्क करें')+'</a><span>🚩 जय श्री भैरूनाथ</span></div><div class="seva-card-poster"><div class="poster-flag">🚩</div><div><b>सेवा समिति</b><small>श्रद्धालुओं की सेवा • कोडमदेसर भैरूनाथ मेला 2026</small></div></div>';box.append(a)})},err=>{console.error('Seva:',err);const box=$('#sevaList');if(box)box.innerHTML='<div class="empty-song">सेवा समिति की जानकारी अभी लोड नहीं हो पाई।</div>'});const pq=query(collection(db,'posters'),where('status','==','approved'));onSnapshot(pq,s=>{const box=$('#posterList');box.innerHTML='';s=[...s.docs].sort((a,b)=>(b.data().createdAt?.seconds||0)-(a.data().createdAt?.seconds||0)).slice(0,12);s.forEach(d=>{const x=d.data(),a=document.createElement('article');a.className='poster-card';a.innerHTML=(x.imageUrl?'<img loading="lazy" src="'+safeUrl(x.imageUrl)+'" alt="'+esc(x.title||'मेला पोस्टर')+'">':'')+'<div class="poster-copy"><span>'+esc(x.tag||'🚩 मेला संदेश')+'</span><h3>'+esc(x.title||'कोडमदेसर भैरूनाथ धाम')+'</h3><p>'+esc(x.text||'')+'</p></div>';box.append(a)})},()=>{});
document.addEventListener('click',e=>{if(e.target.closest('[data-preview-like]'))toggleJaibaba(previewItems[previewIndex]?.id,e.target.closest('[data-preview-like]'));if(e.target.closest('[data-preview-comment]')){const b=$('#previewCommentBox');if(b)b.hidden=!b.hidden}if(e.target.closest('[data-preview-send]')){const x=previewItems[previewIndex],n=$('#previewCommentName')?.value.trim(),t=$('#previewCommentText')?.value.trim();if(t)submitMediaComment(x.id,n,t,$('#previewCommentStatus'))}if(e.target.closest('[data-preview-share]')){const x=previewItems[previewIndex];if(x)window.open('https://wa.me/?text='+encodeURIComponent((x.title||'मेला Photo')+' 🚩 जय बाबे री '+driveViewUrl(x.url)),'_blank')}});

const wishPosterForm=$('#wishPosterForm');
if(wishPosterForm){
 wishPosterForm.addEventListener('submit',e=>{e.preventDefault();wishGenerated=true;drawWishPoster();const st=$('#wishPosterStatus');if(st)st.textContent='Poster तैयार है ❤️ नीचे preview देखें।';$('#posterGate')?.classList.add('show')});
 $('#wishPhoto')?.addEventListener('change',e=>{const file=e.target.files?.[0];if(!file){wishPhotoData=null;$('#wishPhotoPreview').innerHTML='👤<span>अपनी फोटो यहाँ दिखाई देगी</span>';if(wishGenerated)drawWishPoster();return}if(file.size>10*1024*1024){e.target.value='';wishPhotoData=null;const st=$('#wishPosterStatus');if(st)st.textContent='Photo 10 MB तक रखें।';return}const reader=new FileReader();reader.onload=()=>{wishPhotoData=reader.result;const pv=$('#wishPhotoPreview');if(pv)pv.innerHTML='<img src="'+wishPhotoData+'" alt="आपकी फोटो"><span>फोटो तैयार है</span>';if(wishGenerated)drawWishPoster()};reader.readAsDataURL(file)});
 $('#wishName')?.addEventListener('input',()=>{if(wishGenerated)drawWishPoster()});
 $('#posterStyle')?.addEventListener('change',()=>{if(wishGenerated)drawWishPoster()});
 $('#posterFrame')?.addEventListener('change',()=>{if(wishGenerated)drawWishPoster()});
 $('#instagramConfirmBtn')?.addEventListener('click',()=>{wishFollowed=true;$('#posterGate')?.classList.remove('show');const d=$('#downloadWishPoster'),s=$('#shareWishPoster');if(d)d.disabled=false;if(s)s.disabled=false});
 $('#downloadWishPoster')?.addEventListener('click',()=>{if(!wishGenerated)return;try{const a=document.createElement('a');a.download='Kodamdesar-Bhairunath-Mela-2026.png';a.href=wishCanvas.toDataURL('image/png',1);a.click()}catch(err){const st=$('#wishPosterStatus');if(st)st.textContent='Poster तैयार है, लेकिन original reference image की वजह से browser download block कर रहा है।';console.error('Poster download:',err)}});
 $('#shareWishPoster')?.addEventListener('click',async()=>{if(!wishGenerated)return;try{const data=wishCanvas.toDataURL('image/png',.95);const blob=await(await fetch(data)).blob();const file=new File([blob],'Kodamdesar-Bhairunath-Mela-2026.png',{type:'image/png'});if(navigator.share&&navigator.canShare?.({files:[file]}))await navigator.share({title:'कोडमदेसर भैरूनाथ मेला 2026',text:'🚩 जय श्री भैरूनाथ',files:[file]});else window.open('https://wa.me/?text='+encodeURIComponent('🚩 कोडमदेसर भैरूनाथ मेला 2026 • जय श्री भैरूनाथ'),'_blank')}catch(err){console.error('Poster share:',err)}});
}


/* DIGITAL JAAP COUNTER — local device only */
(()=>{
  const display=document.querySelector('#jaapCount');
  const btn=document.querySelector('#jaapBtn');
  const reset=document.querySelector('#jaapReset');
  if(!display||!btn)return;
  let count=Number(localStorage.getItem('bhairavJaapCount')||0);
  if(!Number.isFinite(count)||count<0)count=0;
  count=Math.floor(count);
  const render=()=>{display.textContent=count.toLocaleString('en-IN');};
  render();
  btn.addEventListener('click',()=>{count++;localStorage.setItem('bhairavJaapCount',String(count));render();btn.animate?.([{transform:'scale(.95)'},{transform:'scale(1)'}],{duration:120,easing:'ease-out'});});
  reset?.addEventListener('click',()=>{if(confirm('क्या आप जाप काउंटर रीसेट करना चाहते हैं?')){count=0;localStorage.setItem('bhairavJaapCount','0');render();}});
})();
