import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getFirestore,collection,query,where,onSnapshot,doc,updateDoc,deleteDoc,addDoc,serverTimestamp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import { getAuth,GoogleAuthProvider,signInWithPopup,onAuthStateChanged,signOut } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { getStorage,ref,deleteObject } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-storage.js";

const firebaseConfig={apiKey:"AIzaSyA9dEr5JvvGo-xQ-6llmV6rCt_5P258YR0",authDomain:"punarasarmela.firebaseapp.com",projectId:"punarasarmela",storageBucket:"punarasarmela.firebasestorage.app",messagingSenderId:"368252030672",appId:"1:368252030672:web:531a9c3307271819e698d5",measurementId:"G-YMC3Y69L6H"};
const ADMIN_EMAIL="jbn1jbn0101@gmail.com";

const app=initializeApp(firebaseConfig),db=getFirestore(app),storage=getStorage(app),auth=getAuth(app),provider=new GoogleAuthProvider();
const $=s=>document.querySelector(s);
let allPending=[];
let publishedMedia=[];
let filter='all';

function showError(e){
  console.error(e);
  const msg=e?.code?e.code+': '+(e.message||''):String(e);
  $('#authText').textContent='Login error: '+msg;
  alert('Google Login error:\n'+msg)
}

$('#loginBtn').onclick=async()=>{try{await signInWithPopup(auth,provider)}catch(e){showError(e)}};
$('#logoutBtn').onclick=()=>signOut(auth);

onAuthStateChanged(auth,user=>{
  if(user){
    if((user.email||'').toLowerCase()!==ADMIN_EMAIL){
      alert('यह Google account Admin Panel के लिए authorized नहीं है।');
      signOut(auth);
      return
    }
    $('#authText').textContent='Admin: '+user.email;
    $('#loginBtn').hidden=true;
    $('#logoutBtn').hidden=false;
    $('#adminMain').hidden=false;
    listenPending(); listenPublishedMedia()
  }else{
    $('#authText').textContent='Authorized Google account से sign in करें।';
    $('#loginBtn').hidden=false;
    $('#logoutBtn').hidden=true;
    $('#adminMain').hidden=true
  }
});

function listenPublishedMedia(){const q=query(collection(db,'media'),where('status','==','approved'));onSnapshot(q,s=>{publishedMedia=s.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0));renderPublishedMedia()},e=>console.error('Published media:',e))}
function renderPublishedMedia(){const box=$('#publishedMediaList');if(!box)return;box.innerHTML='';$('#publishedMediaCount').textContent=publishedMedia.length;if(!publishedMedia.length){box.innerHTML='<div class="empty-song">अभी website पर कोई approved Photo/Video नहीं है।</div>';return}publishedMedia.slice(0,60).forEach(x=>{const a=document.createElement('article');a.className='admin-item';const view=driveViewUrl(x.url),preview=drivePreviewUrl(x.url);a.innerHTML='<div class="admin-icon">'+(x.type==='video'?'🎥':'📸')+'</div><div><b>'+esc(x.title||'साझा कंटेंट')+'</b><p>'+esc(x.name||'श्रद्धालु')+' • '+esc(x.caption||'')+'</p>'+(x.type==='video'?'<a class="btn light" target="_blank" rel="noopener" href="'+view+'">🎥 वीडियो देखें</a>':'<a target="_blank" rel="noopener" href="'+view+'"><img class="admin-preview" src="'+preview+'" alt="Published photo"></a>')+'</div><div class="admin-actions"><button class="reject" data-hide-media="'+esc(x.id)+'">🌐 Website से हटाएँ</button></div>';box.append(a)})}
function listenPending(){
  const collections=['songs','media','seva'];
  allPending=[];
  collections.forEach(collectionName=>{
    const q=query(collection(db,collectionName),where('status','==','pending'));
    onSnapshot(q,s=>{
      allPending=allPending.filter(x=>x.collection!==collectionName);
      s.forEach(d=>allPending.push({collection:collectionName,id:d.id,...d.data()}));
      allPending.sort((a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0));
      render()
    },e=>{
      console.error(collectionName,e);
      $('#authText').textContent='Database error: '+e.message
    })
  })
}

function render(){
  const box=$('#pendingList');
  const arr=allPending.filter(x=>filter==='all'||x.collection===filter);
  $('#pendingCount').textContent=allPending.length;
  box.innerHTML='';

  if(!arr.length){
    box.innerHTML='<div class="empty-song">अभी कोई pending submission नहीं है। 👍</div>';
    return
  }

  arr.forEach(x=>{
    const a=document.createElement('article');
    a.className='admin-item';
    let body='';

    if(x.collection==='songs')
      body='<div class="admin-icon">🎵</div><div><b>'+esc(x.title)+'</b><p>'+esc(x.name)+' • '+label(x.category)+'</p><a target="_blank" rel="noopener" href="https://www.youtube.com/watch?v='+esc(x.youtubeId)+'">YouTube खोलें</a></div>';

    if(x.collection==='media'){
      const view=driveViewUrl(x.url), preview=drivePreviewUrl(x.url);
      body='<div class="admin-icon">'+(x.type==='video'?'🎥':'📸')+'</div><div><b>'+esc(x.title)+'</b><p>'+esc(x.name)+'</p><p>'+esc(x.caption||'')+'</p>'+(x.url?(x.type==='video'?'<div class="media-video-placeholder">🎥<br><a class="btn light" target="_blank" rel="noopener" href="'+view+'">वीडियो Drive में खोलें</a></div>':'<a target="_blank" rel="noopener" href="'+view+'"><img class="admin-preview" src="'+preview+'" alt="Submitted photo"></a>'):'')+'<p><a target="_blank" rel="noopener" href="'+view+'">📂 Original file खोलें</a></p></div>';
    }

    if(x.collection==='seva')
      body='<div class="admin-icon">🚩</div><div><b>'+esc(x.name)+'</b><p>'+esc(x.type||'सेवा')+' • '+esc(x.location)+'</p><p>'+esc(x.time)+' • '+esc(x.phone)+'</p><p>'+esc(x.note||'')+'</p>'+(x.mediaUrl?(x.mediaType==='video'?'<video class="admin-preview" controls preload="metadata" src="'+safe(x.mediaUrl)+'"></video>':'<img class="admin-preview" src="'+safe(x.mediaUrl)+'" alt="Seva photo">'):'')+'</div>';

    a.innerHTML=body+'<div class="admin-actions"><button class="approve" data-action="approve">✅ Approve</button><button class="reject" data-action="reject">❌ Reject</button></div>';
    a.querySelector('[data-action="approve"]').onclick=()=>change(x,'approved');
    a.querySelector('[data-action="reject"]').onclick=()=>change(x,'rejected');
    box.append(a)
  })
}

async function hideMedia(id){try{await updateDoc(doc(db,'media',id),{status:'hidden',hiddenAt:serverTimestamp()})}catch(e){console.error(e);alert('Photo/Video website से हट नहीं पाया: '+e.message)}}

async function change(x,status){
  try{
    if(status==='rejected'){
      if(x.storagePath){
        try{await deleteObject(ref(storage,x.storagePath))}
        catch(e){console.warn('Storage cleanup:',e)}
      }
      await deleteDoc(doc(db,x.collection,x.id));
    }else{
      await updateDoc(doc(db,x.collection,x.id),{
        status:'approved',
        approvedAt:serverTimestamp()
      })
    }
  }catch(e){
    console.error(e);
    alert('Action नहीं हो पाई: '+e.message)
  }
}

$('#adminMain').addEventListener('click',e=>{const hide=e.target.closest('[data-hide-media]');if(hide){hideMedia(hide.dataset.hideMedia);return}
  const b=e.target.closest('.admin-tabs button');
  if(b){
    filter=b.dataset.type;
    document.querySelectorAll('.admin-tabs button').forEach(x=>x.classList.toggle('active',x===b));
    render()
  }
});

$('#posterForm').onsubmit=async e=>{
  e.preventDefault();
  const s=$('#posterStatus');
  s.textContent='Poster publish हो रहा है…';
  try{
    await addDoc(collection(db,'posters'),{
      tag:$('#posterTag').value.trim()||'🚩 मेला संदेश',
      title:$('#posterTitle').value.trim(),
      text:$('#posterText').value.trim(),
      imageUrl:safe($('#posterImage').value.trim()),
      status:'approved',
      createdAt:serverTimestamp()
    });
    e.target.reset();
    $('#posterTag').value='🚩 मेला संदेश';
    s.textContent='Poster website पर publish हो गया ❤️'
  }catch(err){
    console.error(err);
    s.textContent='Poster publish नहीं हुआ: '+err.message
  }
};

function label(c){return c==='bhajan'?'🙏 भजन':c==='padayatra'?'🚩 पदयात्रा गीत':'🪔 आरती'}
function driveFileId(u){try{const s=String(u||'');const m=s.match(/[?&]id=([^&]+)/)||s.match(/\/d\/([^/]+)/);return m?m[1]:''}catch(e){return ''}}
function drivePreviewUrl(u){const id=driveFileId(u);return id?'https://drive.google.com/thumbnail?id='+encodeURIComponent(id)+'&sz=w1200':safe(u)}
function driveViewUrl(u){const id=driveFileId(u);return id?'https://drive.google.com/file/d/'+encodeURIComponent(id)+'/view':safe(u)}
function safe(u){try{const x=new URL(u);return ['http:','https:'].includes(x.protocol)?x.href:'#'}catch{return '#'}}
function esc(v){const d=document.createElement('div');d.textContent=v??'';return d.innerHTML}
