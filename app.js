import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getFirestore,collection,addDoc,query,where,orderBy,limit,onSnapshot,serverTimestamp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
const firebaseConfig={apiKey:"AIzaSyA9dEr5JvvGo-xQ-6llmV6rCt_5P258YR0",authDomain:"punarasarmela.firebaseapp.com",projectId:"punarasarmela",storageBucket:"punarasarmela.firebasestorage.app",messagingSenderId:"368252030672",appId:"1:368252030672:web:531a9c3307271819e698d5",measurementId:"G-YMC3Y69L6H"};
const app=initializeApp(firebaseConfig); const db=getFirestore(app); const $=s=>document.querySelector(s);
const INSTAGRAM_URL='https://www.instagram.com/bhaktbabaka5555/';
const SITE_IMAGES={hero:'assets/karni-temple-original.jpg.avif',darshan:'assets/karni-mata-murti-original.jpg.png',toran:'assets/karni-temple-original.jpg.avif',poster:'assets/karni-mata-murti-original.jpg.png'};
let galleryFilter='all';
const POSTER_BASE_IMAGE=SITE_IMAGES.poster;
const posterStyles={classic:['#5b0909','#a62b17','#2b0808'],royal:['#21120a','#6b4515','#120a06'],minimal:['#3b1712','#b85a2b','#24100c']};
const wishCanvas=$('#wishPosterCanvas');
const heroEl=$('.hero');
const kodamVisualImg=document.querySelector('.kodam-visual img');
if(heroEl){heroEl.style.backgroundImage="linear-gradient(180deg,rgba(48,11,11,.25),rgba(48,11,11,.72)),url('"+SITE_IMAGES.hero+"')";heroEl.style.backgroundSize='cover';heroEl.style.backgroundPosition='center';}
if(kodamVisualImg){kodamVisualImg.src=SITE_IMAGES.hero;}
const darshanSection=$('#darshan');
if(darshanSection){const img=document.createElement('img');img.src=SITE_IMAGES.darshan;img.alt='माँ करणी माता देशनोक जी के मूल दर्शन';img.className='section-reference-image';darshanSection.querySelector('.wrap')?.insertBefore(img,darshanSection.querySelector('.grid'));}
const padyatraSection=$('#padyatra');
if(padyatraSection){const img=document.createElement('img');img.src=SITE_IMAGES.toran;img.alt='देशनोक करणी माता मंदिर';img.className='section-reference-image';padyatraSection.querySelector('.wrap')?.insertBefore(img,padyatraSection.querySelector('.grid'));}
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
  const done=value=>{if(settled)return;settled=true;clearTimeout(timer);resolve(value)};
  const timer=setTimeout(()=>done(null),9000);
  img.onload=()=>done(img);
  img.onerror=()=>done(null);
  if(allowCors)img.crossOrigin='anonymous';
  img.src=src;
 });
}

async function drawWishPoster(){
 if(!wishCtx)return;
 const W=1080,H=1920;
 wishCtx.clearRect(0,0,W,H);
 const g=wishCtx.createLinearGradient(0,0,W,H);
 g.addColorStop(0,'#4a0d13');g.addColorStop(.4,'#761b22');g.addColorStop(.8,'#300b0b');g.addColorStop(1,'#1a0404');
 wishCtx.fillStyle=g;wishCtx.fillRect(0,0,W,H);
 const [imgMurti,imgToran]=await Promise.all([loadPosterImage(POSTER_MURTI_IMAGE,false),loadPosterImage(POSTER_TORAN_IMAGE,false)]);
 drawMergedPosterCanvas(imgMurti,imgToran);
}

function drawMergedPosterCanvas(imgMurti,imgToran){
 const W=1080,H=1920;
 wishCtx.strokeStyle='#f2cf79';wishCtx.lineWidth=12;roundedRect(wishCtx,30,30,W-60,H-60,32);wishCtx.stroke();
 wishCtx.strokeStyle='rgba(118,27,34,0.8)';wishCtx.lineWidth=4;roundedRect(wishCtx,42,42,W-84,H-84,24);wishCtx.stroke();

 // Original murti image: full image preserved inside a premium frame, no crop/distortion.
 if(imgMurti){
  const mx=55,my=70,mw=475,mh=650;
  wishCtx.save();roundedRect(wishCtx,mx,my,mw,mh,22);wishCtx.clip();
  const s=Math.min(mw/imgMurti.width,mh/imgMurti.height);const nw=imgMurti.width*s,nh=imgMurti.height*s;
  wishCtx.drawImage(imgMurti,mx+(mw-nw)/2,my+(mh-nh)/2,nw,nh);wishCtx.restore();
  wishCtx.strokeStyle='#f2cf79';wishCtx.lineWidth=5;roundedRect(wishCtx,mx,my,mw,mh,22);wishCtx.stroke();
 }

 // Original outside-temple image: full image preserved inside a premium frame, no crop/distortion.
 if(imgToran){
  const tx=55,ty=745,tw=475,th=350;
  wishCtx.save();roundedRect(wishCtx,tx,ty,tw,th,22);wishCtx.clip();
  const s=Math.min(tw/imgToran.width,th/imgToran.height);const nw=imgToran.width*s,nh=imgToran.height*s;
  wishCtx.drawImage(imgToran,tx+(tw-nw)/2,ty+(th-nh)/2,nw,nh);wishCtx.restore();
  wishCtx.strokeStyle='#f2cf79';wishCtx.lineWidth=5;roundedRect(wishCtx,tx,ty,tw,th,22);wishCtx.stroke();
 }

 wishCtx.textAlign='right';wishCtx.fillStyle='#ffe2a0';wishCtx.font='bold 38px "Noto Sans Devanagari",sans-serif';wishCtx.fillText('🚩 जय माँ करणी री 🚩',W-70,105);
 wishCtx.fillStyle='#fff8ed';wishCtx.font='bold 45px "Noto Sans Devanagari",sans-serif';wishCtx.fillText('आ गई है...',W-70,180);
 wishCtx.fillStyle='#ffb21f';wishCtx.font='bold 62px "Noto Sans Devanagari",sans-serif';wishCtx.fillText('देशनोक करणी माता',W-70,270);
 wishCtx.fillStyle='#ffffff';wishCtx.font='bold 48px "Noto Sans Devanagari",sans-serif';wishCtx.fillText('मेला 2026 की Website',W-70,345);

 const bx=585,by=405,bw=425,bh=170;
 wishCtx.fillStyle='rgba(60,8,8,.95)';roundedRect(wishCtx,bx,by,bw,bh,22);wishCtx.fill();wishCtx.strokeStyle='#f2cf79';wishCtx.lineWidth=3;roundedRect(wishCtx,bx,by,bw,bh,22);wishCtx.stroke();
 wishCtx.textAlign='center';wishCtx.fillStyle='#ffe2a0';wishCtx.font='bold 34px "Noto Sans Devanagari",sans-serif';wishCtx.fillText('📅 मेला प्रारंभ',bx+bw/2,455);
 wishCtx.fillStyle='#ffffff';wishCtx.font='bold 52px "Noto Sans Devanagari",sans-serif';wishCtx.fillText('11 अक्टूबर 2026 से',bx+bw/2,525);

 const px=585,py=610,pw=425,ph=430;
 wishCtx.fillStyle='rgba(215,140,50,.16)';roundedRect(wishCtx,px,py,pw,ph,24);wishCtx.fill();wishCtx.strokeStyle='#f2cf79';wishCtx.lineWidth=3;roundedRect(wishCtx,px,py,pw,ph,24);wishCtx.stroke();
 if(wishPhotoData){
  const im=new Image();im.onload=()=>{const imgX=px+25,imgY=py+25,imgW=pw-50,imgH=ph-110;wishCtx.save();roundedRect(wishCtx,imgX,imgY,imgW,imgH,16);wishCtx.clip();const s=Math.min(imgW/im.width,imgH/im.height);const nw=im.width*s,nh=im.height*s;wishCtx.drawImage(im,imgX+(imgW-nw)/2,imgY+(imgH-nh)/2,nw,nh);wishCtx.restore();drawMergedPosterFooter(px,py,pw,ph)};im.src=wishPhotoData;
 }else{wishCtx.fillStyle='#ffe09a';wishCtx.font='bold 28px "Noto Sans Devanagari",sans-serif';wishCtx.textAlign='center';wishCtx.fillText('👤 अपनी फोटो यहाँ लगाएं',px+pw/2,py+ph/2);drawMergedPosterFooter(px,py,pw,ph)}
}

function drawMergedPosterFooter(px,py,pw,ph){
 const W=1080;const nameText=$('#wishName')?.value.trim()||'आपका नाम / दुकान';
 wishCtx.fillStyle='#761b22';roundedRect(wishCtx,px+15,py+ph-90,pw-30,72,16);wishCtx.fill();wishCtx.strokeStyle='#f2cf79';wishCtx.lineWidth=3;roundedRect(wishCtx,px+15,py+ph-90,pw-30,72,16);wishCtx.stroke();
 wishCtx.textAlign='center';wishCtx.fillStyle='#ffe2a0';wishCtx.font='bold 31px "Noto Sans Devanagari",sans-serif';wishCtx.fillText(nameText,px+pw/2,py+ph-44);
 wishCtx.fillStyle='#f2cf79';wishCtx.font='bold 38px "Tiro Devanagari Sanskrit",sans-serif';wishCtx.fillText('आ गई है देशनोक करणी माता मेला 2026 की Website',W/2,1160);
 wishCtx.fillStyle='#ffffff';wishCtx.font='bold 34px "Noto Sans Devanagari",sans-serif';wishCtx.fillText('🔗 Link Bio में है',W/2,1225);
 wishCtx.fillStyle='#f8dfb3';wishCtx.font='bold 28px Arial,sans-serif';wishCtx.fillText('@bhaktbabaka5555',W/2,1285);
 wishCtx.fillStyle='#f2cf79';wishCtx.font='bold 31px "Noto Sans Devanagari",sans-serif';wishCtx.fillText('जय माँ करणी री 🚩',W/2,1350);
}

// The rest of the existing application logic remains unchanged below this point.
