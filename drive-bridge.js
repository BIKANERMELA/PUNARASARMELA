import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const firebaseConfig={
  apiKey:"AIzaSyA9dEr5JvvGo-xQ-6llmV6rCt_5P258YR0",
  authDomain:"punarasarmela.firebaseapp.com",
  projectId:"punarasarmela",
  storageBucket:"punarasarmela.firebasestorage.app",
  messagingSenderId:"368252030672",
  appId:"1:368252030672:web:531a9c3307271819e698d5",
  measurementId:"G-YMC3Y69L6H"
};

const bridgeApp=initializeApp(firebaseConfig,"driveBridge");
const db=getFirestore(bridgeApp);
const $=s=>document.querySelector(s);

function safeDriveUrl(value){
  try{
    const raw=value.trim();
    if(raw.length>500) return "";
    const u=new URL(raw);
    return u.protocol==="https:" && u.hostname==="drive.google.com" ? u.href : "";
  }catch{return ""}
}

/*
  Fast no-Blaze mode:
  Visitors upload their photo/video to Google Drive and paste the
  share link here. The website stores only the link + metadata in Firestore.
  Admin approval remains unchanged.
*/
document.addEventListener("submit",async event=>{
  const form=event.target;
  if(form.id!=="mediaForm" && form.id!=="sevaForm") return;

  event.preventDefault();
  event.stopImmediatePropagation();

  const status=$(form.id==="mediaForm" ? "#mediaStatus" : "#sevaStatus");
  status.textContent="";

  try{
    if(form.id==="mediaForm"){
      const url=safeDriveUrl($("#mediaDriveUrl").value);
      if(!url){
        status.textContent="कृपया Google Drive का सही share link डालें।";
        return;
      }

      status.textContent="फोटो/वीडियो की जानकारी भेजी जा रही है…";
      await addDoc(collection(db,"media"),{
        name:$("#mediaName").value.trim(),
        type:$("#mediaType").value,
        title:$("#mediaTitle").value.trim(),
        url,
        caption:$("#mediaCaption").value.trim(),
        storagePath:"",
        status:"pending",
        createdAt:serverTimestamp()
      });

      form.reset();
      status.textContent="Drive link भेज दिया गया ❤️ Admin approval के बाद website पर दिखाई देगा।";
      return;
    }

    const mediaUrl=safeDriveUrl($("#sevaDriveUrl").value);
    if($("#sevaDriveUrl").value.trim() && !mediaUrl){
      status.textContent="कृपया Google Drive का सही share link डालें।";
      return;
    }

    status.textContent="सेवा जानकारी भेजी जा रही है…";
    await addDoc(collection(db,"seva"),{
      name:$("#sevaName").value.trim(),
      type:$("#sevaType").value,
      location:$("#sevaLocation").value.trim(),
      time:$("#sevaTime").value.trim(),
      phone:$("#sevaPhone").value.trim(),
      note:$("#sevaNote").value.trim(),
      mediaUrl:mediaUrl,
      mediaType:mediaUrl ? "photo" : "",
      storagePath:"",
      status:"pending",
      createdAt:serverTimestamp()
    });

    form.reset();
    status.textContent="सेवा जानकारी भेज दी गई ❤️ Admin approval के बाद public होगी।";
  }catch(error){
    console.error(error);
    status.textContent="अभी submit नहीं हो सका। कृपया दोबारा कोशिश करें।";
  }
},true);
