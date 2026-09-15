import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getFirestore, collection, addDoc, query, orderBy, limit, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const firebaseConfig={apiKey:"AIzaSyA9dEr5JvvGo-xQ-6llmV6rCt_5P258YR0",authDomain:"punarasarmela.firebaseapp.com",projectId:"punarasarmela",storageBucket:"punarasarmela.firebasestorage.app",messagingSenderId:"368252030672",appId:"1:368252030672:web:531a9c3307271819e698d5",measurementId:"G-YMC3Y69L6H"};
const app=initializeApp(firebaseConfig); const db=getFirestore(app);

// Live countdown to 19 September 2026, 00:00 IST
const target=new Date('2026-09-19T00:00:00+05:30').getTime();
function countdown(){const now=Date.now(),d=Math.max(0,target-now),days=Math.floor(d/86400000),hours=Math.floor(d%86400000/3600000),minutes=Math.floor(d%3600000/60000),seconds=Math.floor(d%60000/1000);document.querySelector('#days').textContent=String(days).padStart(2,'0');document.querySelector('#hours').textContent=String(hours).padStart(2,'0');document.querySelector('#minutes').textContent=String(minutes).padStart(2,'0');document.querySelector('#seconds').textContent=String(seconds).padStart(2,'0');}
countdown();setInterval(countdown,1000);

const shareBtn=document.querySelector('#shareBtn');
shareBtn?.addEventListener('click',async()=>{const data={title:'पूनरासर भव्य भादवा मेला 2026',text:'19 सितम्बर 2026 • जय बाबे री 🚩',url:location.href};try{if(navigator.share) await navigator.share(data);else window.open('https://wa.me/?text='+encodeURIComponent(data.title+'\n'+data.text+'\n'+data.url),'_blank');}catch(e){}});

const form=document.querySelector('#messageForm'),status=document.querySelector('#status'),list=document.querySelector('#messages');
form.addEventListener('submit',async e=>{e.preventDefault();status.textContent='संदेश भेजा जा रहा है…';try{const name=document.querySelector('#name').value.trim(),text=document.querySelector('#text').value.trim();if(!name||!text)return;await addDoc(collection(db,'messages'),{name,text,createdAt:serverTimestamp()});form.reset();status.textContent='संदेश सफलतापूर्वक भेज दिया गया ❤️';}catch(err){console.error(err);status.textContent='अभी संदेश नहीं भेजा जा सका। Firebase rules की जरूरत है।';}});
const q=query(collection(db,'messages'),orderBy('createdAt','desc'),limit(30));
onSnapshot(q,snap=>{list.innerHTML='';snap.forEach(d=>{const x=d.data(),el=document.createElement('article');el.className='message';const n=document.createElement('strong');n.textContent='🚩 '+(x.name||'श्रद्धालु');const p=document.createElement('p');p.textContent=x.text||'';el.append(n,p);list.appendChild(el);});},err=>console.error('Firestore:',err));