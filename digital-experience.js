/* Safe additive layer: Digital Mela Experience. Does not touch Firebase, Firestore, Storage, auth, uploads or existing app logic. */
(() => {
  'use strict';

  const addStyles = () => {
    if (document.getElementById('digitalMelaStyles')) return;
    const s = document.createElement('style');
    s.id = 'digitalMelaStyles';
    s.textContent = `
      .dm-intro-progress{width:min(320px,78%);height:5px;margin:20px auto 0;border-radius:99px;overflow:hidden;background:rgba(255,255,255,.16);border:1px solid rgba(242,207,121,.22)}\n      .dm-intro-progress span{display:block;height:100%;width:0;background:linear-gradient(90deg,#c75a19,#f2cf79);animation:dmProgress 2.5s linear forwards}@keyframes dmProgress{to{width:100%}}\n      .dm-intro{position:fixed;inset:0;z-index:12000;display:grid;place-items:center;background:radial-gradient(circle at 50% 35%,rgba(198,142,48,.18),transparent 28%),linear-gradient(145deg,#4b0d14,#7b1d22 52%,#a64a22);color:#fff;opacity:1;transition:opacity .45s ease}
      .dm-intro.hide{opacity:0;pointer-events:none}
      .dm-intro-card{width:min(92vw,560px);text-align:center;padding:34px 22px}
      .dm-intro-flag{font-size:58px;filter:drop-shadow(0 8px 14px rgba(0,0,0,.25));animation:dmFlag 1.2s ease-in-out infinite alternate}
      .dm-intro h2{font-family:"Tiro Devanagari Sanskrit","Rozha One",serif;font-size:clamp(32px,7vw,58px);line-height:1.15;color:#ffe0a0;margin:14px 0 8px;text-shadow:0 3px 14px rgba(0,0,0,.3)}
      .dm-intro p{font-size:17px;color:#fff0d2;margin:0}
      .dm-intro-line{width:min(300px,75%);height:1px;margin:20px auto;background:linear-gradient(90deg,transparent,#f2cf79,transparent)}
      .dm-intro-skip{margin-top:22px;border:1px solid rgba(255,255,255,.28);background:rgba(255,255,255,.08);color:#fff;padding:9px 15px;border-radius:999px;cursor:pointer}
      @keyframes dmFlag{to{transform:translateY(-5px) rotate(-2deg)}}

      .dm-journey{padding:58px 0 68px;background:linear-gradient(180deg,#fff8ed,#fff1dc);border-block:1px solid rgba(201,154,59,.22)}
      .dm-journey-head{text-align:center;max-width:760px;margin:0 auto 30px}
      .dm-journey-head span{color:#c75a19;font-weight:900;letter-spacing:.5px}
      .dm-journey-head h2{font-family:"Tiro Devanagari Sanskrit","Rozha One",serif;color:#761b22;font-size:clamp(29px,4vw,46px);margin:7px 0}
      .dm-journey-head p{color:#765f52}
      .dm-journey-track{position:relative;display:grid;grid-template-columns:repeat(5,1fr);gap:12px;max-width:1050px;margin:auto}
      .dm-journey-track:before{content:"";position:absolute;left:9%;right:9%;top:42px;height:2px;background:linear-gradient(90deg,#c75a19,#c99a3b,#761b22);opacity:.35}
      .dm-stop{position:relative;z-index:1;text-align:center;background:#fffdf8;border:1px solid rgba(201,154,59,.35);border-radius:22px;padding:18px 10px;min-height:140px;box-shadow:0 10px 28px rgba(93,38,20,.06);transition:.2s}
      .dm-stop:hover{transform:translateY(-6px);border-color:#c99a3b}
      .dm-stop b{display:grid;place-items:center;width:48px;height:48px;margin:0 auto 10px;border-radius:50%;background:linear-gradient(135deg,#761b22,#b84b22);color:#ffe0a0;font-size:24px;border:2px solid #f2cf79}
      .dm-stop strong{display:block;color:#761b22;font-family:"Tiro Devanagari Sanskrit",serif;font-size:19px}
      .dm-stop small{display:block;color:#765f52;margin-top:4px;line-height:1.4}

      .dm-live{padding:58px 0;background:#fffaf4}
      .dm-live-head{text-align:center;margin-bottom:26px}
      .dm-live-head span{color:#c75a19;font-weight:900}
      .dm-live-head h2{font-family:"Tiro Devanagari Sanskrit","Rozha One",serif;color:#761b22;font-size:clamp(29px,4vw,44px);margin:7px 0}
      .dm-live-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
      .dm-live-card{background:linear-gradient(145deg,#fffdf8,#fff1dc);border:1px solid rgba(201,154,59,.28);border-radius:20px;padding:18px;min-height:150px}
      .dm-live-card .dm-live-dot{display:inline-block;width:9px;height:9px;border-radius:50%;background:#d36b27;margin-right:7px;box-shadow:0 0 0 5px rgba(211,107,39,.10)}
      .dm-live-card h3{margin:10px 0 5px;color:#761b22;font-size:19px}
      .dm-live-card p{margin:0;color:#765f52;font-size:14px;line-height:1.55}
      .dm-live-note{max-width:800px;margin:18px auto 0;text-align:center;color:#8a6b58;font-size:13px}

      .dm-bottom-nav{display:none}
      .dm-mini-player{position:fixed;left:50%;bottom:14px;transform:translate(-50%,120px);z-index:9000;width:min(760px,calc(100% - 28px));background:rgba(67,9,15,.96);border:1px solid rgba(242,207,121,.45);color:#fff;border-radius:18px;padding:10px 14px;box-shadow:0 16px 45px rgba(45,5,10,.28);backdrop-filter:blur(12px);transition:transform .3s ease}
      .dm-mini-player.show{transform:translate(-50%,0)}
      .dm-mini-inner{display:flex;align-items:center;gap:11px}
      .dm-mini-icon{width:40px;height:40px;border-radius:50%;display:grid;place-items:center;background:radial-gradient(circle,#f2cf79 0 9%,#5a1118 10% 25%,#c99a3b 26% 31%,#3b0b11 32% 100%);color:#ffe0a0;flex:none}
      .dm-mini-copy{min-width:0;flex:1}.dm-mini-copy strong{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.dm-mini-copy small{color:#f2dcb6}
      .dm-mini-close{border:0;background:transparent;color:#fff;font-size:18px;cursor:pointer;padding:8px}

      .royal-media-section #mediaList{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;max-width:1100px}
      .royal-media-section #mediaList .media-card{margin:0}
      @media(max-width:900px){
        .dm-journey-track{grid-template-columns:repeat(3,1fr)}
        .dm-journey-track:before{display:none}
        .dm-live-grid{grid-template-columns:repeat(2,1fr)}
        .royal-media-section #mediaList{grid-template-columns:repeat(2,1fr)}
      }
      @media(max-width:650px){
        .dm-journey{padding:44px 0 52px}
        .dm-journey-track{grid-template-columns:repeat(2,1fr);gap:10px}
        .dm-stop{min-height:125px;padding:15px 8px}
        .dm-stop b{width:42px;height:42px;font-size:21px}
        .dm-stop strong{font-size:17px}
        .dm-live-grid{grid-template-columns:1fr 1fr;gap:10px}
        .dm-live-card{min-height:135px;padding:15px}
        .royal-media-section #mediaList{grid-template-columns:1fr 1fr;gap:11px}
        .dm-bottom-nav{position:fixed;display:grid;grid-template-columns:repeat(5,1fr);left:0;right:0;bottom:0;z-index:8500;background:rgba(70,8,14,.97);border-top:1px solid rgba(242,207,121,.35);padding:6px 5px calc(6px + env(safe-area-inset-bottom));box-shadow:0 -8px 25px rgba(45,5,10,.2)}
        .dm-bottom-nav a{color:#fff4dd;text-decoration:none;text-align:center;font-size:11px;font-weight:800;padding:6px 2px;border-radius:12px}
        .dm-bottom-nav a b{display:block;font-size:20px;line-height:1.05;margin-bottom:3px}
        .dm-bottom-nav a.active{background:rgba(242,207,121,.15);color:#ffe0a0}
        body{padding-bottom:68px}
        .dm-mini-player{bottom:78px}
      }
      @media(prefers-reduced-motion:reduce){
        .dm-intro-flag{animation:none}.dm-stop{transition:none}.dm-mini-player{transition:none}
      }
    `;
    document.head.appendChild(s);
  };

  const createIntro = () => {
    if (document.getElementById('dmIntro')) return;
    const el = document.createElement('div');
    el.id = 'dmIntro';
    el.className = 'dm-intro';
    el.innerHTML = `
      <div class="dm-intro-card" role="dialog" aria-label="कोडमदेसर भैरूनाथ मेला 2026">
        <div class="dm-intro-flag">🚩</div>
        <h2>श्री कोडमदेसर भैरूनाथ मेला 2026</h2>
        <div class="dm-intro-line"></div>
        <p>24–25 सितंबर 2026<br>बाबा के दरबार में आस्था का महासंगम</p>
        <button class="dm-intro-skip" type="button">वेबसाइट खोलें</button>
      </div>`;
    document.body.appendChild(el);
    const close = () => { el.classList.add('hide'); setTimeout(() => el.remove(), 500); };
    el.querySelector('.dm-intro-skip').addEventListener('click', close);
    setTimeout(close, 2500);
  };

  const insertJourney = () => {
    if (document.getElementById('digitalJourney')) return;
    const anchor = document.getElementById('categories') || document.getElementById('darshan');
    if (!anchor || !anchor.parentNode) return;
    const sec = document.createElement('section');
    sec.id = 'digitalJourney';
    sec.className = 'dm-journey';
    sec.innerHTML = `
      <div class="wrap">
        <div class="dm-journey-head">
          <span>🚩 बाबा के दरबार की यात्रा</span>
          <h2>आस्था से दर्शन तक — पूरा मेला अनुभव</h2>
          <p>वेबसाइट के मुख्य अनुभव एक ही सुंदर यात्रा में जुड़े हुए हैं।</p>
        </div>
        <div class="dm-journey-track">
          <a class="dm-stop" href="#info"><b>📅</b><strong>मेला</strong><small>24–25 सितंबर 2026</small></a>
          <a class="dm-stop" href="#padyatra"><b>🚩</b><strong>पदयात्रा</strong><small>ध्वजा और श्रद्धा यात्रा</small></a>
          <a class="dm-stop" href="#darshan"><b>🛕</b><strong>दर्शन</strong><small>कोडमदेसर भैरूनाथ धाम</small></a>
          <a class="dm-stop" href="#music"><b>🎵</b><strong>भजन</strong><small>भजन • पदयात्रा गीत • आरती</small></a>
          <a class="dm-stop" href="#media"><b>📸</b><strong>यादें</strong><small>Photo • Video • Gallery</small></a>
        </div>
      </div>`;
    anchor.parentNode.insertBefore(sec, anchor);
  };

  const insertLive = () => {
    if (document.getElementById('dmLive')) return;
    const anchor = document.getElementById('media') || document.getElementById('seva');
    if (!anchor || !anchor.parentNode) return;
    const sec = document.createElement('section');
    sec.id = 'dmLive';
    sec.className = 'dm-live';
    sec.innerHTML = `
      <div class="wrap">
        <div class="dm-live-head">
          <span>🔴 LIVE MELA UPDATES</span>
          <h2>मेले की जरूरी जानकारी</h2>
        </div>
        <div class="dm-live-grid">
          <article class="dm-live-card"><span class="dm-live-dot"></span><b>पदयात्रा</b><h3>यात्रा अपडेट</h3><p>पदयात्रा से जुड़ी नई जानकारी यहाँ दिखाई जाएगी।</p></article>
          <article class="dm-live-card"><span class="dm-live-dot"></span><b>दर्शन</b><h3>दर्शन व्यवस्था</h3><p>दर्शन व्यवस्था और परिसर से जुड़ी सूचना यहाँ रखी जाएगी।</p></article>
          <article class="dm-live-card"><span class="dm-live-dot"></span><b>सुविधा</b><h3>Parking • Medical • पानी</h3><p>जरूरी सुविधा संबंधी अपडेट के लिए यह स्थान तैयार है।</p></article>
          <article class="dm-live-card"><span class="dm-live-dot"></span><b>जरूरी सूचना</b><h3>मेला सूचना</h3><p>विशेष घोषणा और आवश्यक सूचना यहाँ दिखाई जा सकती है।</p></article>
        </div>
        <p class="dm-live-note">यह नया visual update area है; मौजूदा Firebase/Admin व्यवस्था को छुआ नहीं गया है।</p>
      </div>`;
    anchor.parentNode.insertBefore(sec, anchor);
  };

  const createBottomNav = () => {
    if (document.getElementById('dmBottomNav')) return;
    const nav = document.createElement('nav');
    nav.id = 'dmBottomNav';
    nav.className = 'dm-bottom-nav';
    nav.setAttribute('aria-label','Mobile navigation');
    nav.innerHTML = `
      <a href="#home" class="active"><b>🏠</b>Home</a>
      <a href="#darshan"><b>🛕</b>दर्शन</a>
      <a href="#digitalJourney"><b>🚩</b>मेला</a>
      <a href="#music"><b>🎵</b>भजन</a>
      <a href="#media"><b>📸</b>Gallery</a>`;
    document.body.appendChild(nav);
    nav.addEventListener('click', e => {
      const a = e.target.closest('a');
      if (!a) return;
      nav.querySelectorAll('a').forEach(x => x.classList.toggle('active', x === a));
    });
  };

  const createMiniPlayer = () => {
    if (document.getElementById('dmMiniPlayer')) return;
    const bar = document.createElement('div');
    bar.id = 'dmMiniPlayer';
    bar.className = 'dm-mini-player';
    bar.innerHTML = `
      <div class="dm-mini-inner">
        <div class="dm-mini-icon">♪</div>
        <div class="dm-mini-copy"><strong id="dmMiniTitle">भजन चल रहा है</strong><small id="dmMiniCat">जय श्री भैरूनाथ 🚩</small></div>
        <button class="dm-mini-close" type="button" aria-label="Mini player बंद करें">✕</button>
      </div>`;
    document.body.appendChild(bar);
    bar.querySelector('.dm-mini-close').addEventListener('click', () => bar.classList.remove('show'));

    document.addEventListener('click', e => {
      const b = e.target.closest('.play-song');
      if (!b) return;
      const title = b.dataset.title || document.getElementById('nowTitle')?.textContent || 'भजन';
      const cat = b.dataset.cat || 'जय श्री भैरूनाथ 🚩';
      document.getElementById('dmMiniTitle').textContent = title;
      document.getElementById('dmMiniCat').textContent = cat;
      bar.classList.add('show');
    });
  };

  const init = () => {
    addStyles();
    createIntro();
    insertJourney();
    insertLive();
    createBottomNav();
    createMiniPlayer();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, {once:true});
  } else {
    init();
  }
})();
