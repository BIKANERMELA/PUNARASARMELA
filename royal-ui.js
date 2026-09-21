import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getFirestore,collection,addDoc,serverTimestamp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import { getStorage,ref,uploadBytes,getDownloadURL } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-storage.js";

const firebaseConfig={apiKey:"AIzaSyA9dEr5JvvGo-xQ-6llmV6rCt_5P258YR0",authDomain:"punarasarmela.firebaseapp.com",projectId:"punarasarmela",storageBucket:"punarasarmela.firebasestorage.app",messagingSenderId:"368252030672",appId:"1:368252030672:web:531a9c3307271819e698d5",measurementId:"G-YMC3Y69L6H"};
const app=initializeApp(firebaseConfig,"royalUI");
const db=getFirestore(app);
const storage=getStorage(app);
const $=s=>document.querySelector(s);

function esc(v){const d=document.createElement("div");d.textContent=v??"";return d.innerHTML}
function safeDriveUrl(v){try{const u=new URL(String(v||"").trim());return u.protocol==="https:"&&u.hostname==="drive.google.com"?u.href:""}catch{return""}}

function welcomeModal(){
  if($("#royalWelcomeModal"))return;
  const m=document.createElement("div");
  m.id="royalWelcomeModal";m.className="royal-welcome-modal";
  m.innerHTML='<div class="royal-welcome-card" role="dialog" aria-modal="true" aria-labelledby="welcomeTitle"><button class="royal-modal-close" type="button" aria-label="बंद करें">✕</button><div class="welcome-flag">🚩</div><h2 id="welcomeTitle">श्री कोडमदेसर भैरूनाथ मेला 2026</h2><div class="welcome-divider"></div><p>जय श्री भैरूनाथ 🙏<br>मेले की Daily Reels, दर्शन अपडेट और Live जानकारी के लिए हमारे Official Instagram से जुड़ें।</p><div class="welcome-actions"><a class="btn instagram-btn" href="https://www.instagram.com/" target="_blank" rel="noopener">📸 Instagram पर फॉलो करें</a><button class="btn light welcome-close" type="button">वेबसाइट देखें</button></div></div>';
  document.body.append(m);
  const close=()=>{m.classList.remove("show");document.body.style.overflow=""};
  m.querySelector(".royal-modal-close").onclick=close;m.querySelector(".welcome-close").onclick=close;
  m.addEventListener("click",e=>{if(e.target===m)close()});
  document.addEventListener("keydown",e=>{if(e.key==="Escape")close()},{once:false});
  setTimeout(()=>{m.classList.add("show");document.body.style.overflow="hidden"},420);
}

async function submitFirebaseMedia(e){
  e.preventDefault();
  const form=e.currentTarget,status=$("#mediaStatus"),bar=$("#mediaProgressBar"),file=$("#mediaFile");
  if(!form||!status||!file)return;
  const f=file.files?.[0], drive=safeDriveUrl($("#mediaDriveUrl")?.value);
  status.textContent="";if(bar)bar.style.width="0%";
  if(!f&&!drive){status.textContent="Photo/Video चुनें या Google Drive share link दें।";return}
  const type=$("#mediaType").value;
  const category=$("#mediaCategory").value;
  const name=$("#mediaName").value.trim();
  const title=$("#mediaTitle").value.trim();
  const caption=$("#mediaCaption").value.trim();
  if(f){
    const photo=/^image\/(jpeg|png|webp)$/.test(f.type);
    const video=/^video\/(mp4|webm)$/.test(f.type);
    if(type==="photo"&&!photo){status.textContent="Photo के लिए JPG, PNG या WEBP चुनें।";return}
    if(type==="video"&&!video){status.textContent="Video के लिए MP4 या WEBM चुनें।";return}
    const max=type==="video"?100*1024*1024:15*1024*1024;
    if(f.size>max){status.textContent=type==="video"?"Video maximum 100 MB रखें।":"Photo maximum 15 MB रखें।";return}
  }
  try{
    let url=drive,storagePath="";
    if(f){
      status.textContent="Firebase में file upload हो रही है…";
      const safeName=f.name.replace(/[^a-zA-Z0-9._-]/g,"_");
      storagePath="media/"+Date.now()+"-"+Math.random().toString(36).slice(2)+"-"+safeName;
      const snap=await uploadBytes(ref(storage,storagePath),f,{contentType:f.type,customMetadata:{category,name}});
      url=await getDownloadURL(snap.ref);
      if(bar)bar.style.width="100%";
    }
    await addDoc(collection(db,"media"),{name,type,title,url:url||"",caption:(category?("["+category+"] "):"")+caption,category,storagePath,status:"pending",createdAt:serverTimestamp()});
    form.reset();if(bar)bar.style.width="100%";
    status.textContent=f?"Photo/Video सफलतापूर्वक भेज दिया गया ❤️":"Google Drive link सफलतापूर्वक भेज दिया गया ❤️";
  }catch(err){
    console.error(err);
    if(err?.code==="storage/quota-exceeded"||err?.code==="storage/unauthorized"||String(err?.message||"").includes("402")||String(err?.message||"").includes("Blaze")){
      status.innerHTML="Firebase Storage अभी उपलब्ध नहीं है। <a href="https://script.google.com/macros/s/AKfycbz0YMuppBaJeoFUJjpH6MYlJ0uh_LAQBGLb0Keho0Gi1AX8dBix4ltSLCIO-4ltPqAJ/exec" target="_blank" rel="noopener">Google Drive Direct Upload</a> इस्तेमाल करें।";
    }else status.textContent="Upload नहीं हो पाया: "+(err?.message||"कृपया दोबारा कोशिश करें।");
    if(bar)bar.style.width="0%";
  }
}

function cleanupOldDriveBridge(){
  const s=document.querySelector('script[src*="drive-bridge.js"]');if(s)s.remove();
}

document.addEventListener("DOMContentLoaded",()=>{
  cleanupOldDriveBridge();
  welcomeModal();
  $("#mediaForm")?.addEventListener("submit",submitFirebaseMedia);
  document.body.classList.remove("dark-mode");
});
