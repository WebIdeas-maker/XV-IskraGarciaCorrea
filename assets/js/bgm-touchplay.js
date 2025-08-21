
// Touch-to-play (LOUD): unmute + play on first gesture, quick fade to high volume.
(function(){
  const AID = "bgm";
  const TARGET = 0.85;   // louder final volume
  const FADE_MS = 200;   // quick fade
  const OPT = { once:true, passive:true };
  function $(id){ return document.getElementById(id); }
  function fadeTo(a, to, ms){
    const from = a.volume, t0 = performance.now();
    function step(t){ const k = Math.min(1,(t - t0)/ms); a.volume = from + (to - from)*k; if(k<1) requestAnimationFrame(step); }
    requestAnimationFrame(step);
  }
  function safePlay(a){ try{ return a.play(); } catch(e){ return Promise.reject(e); } }
  function forceLoud(a){ a.muted = false; a.volume = TARGET; }
  function onPlay(){ const a = $('bgm'); if(!a) return; forceLoud(a); }
  function unlock(){
    const a = $('bgm'); if(!a) return unbind();
    a.muted = false;
    if (a.paused) safePlay(a).catch(()=>{});
    if (a.volume < 0.2) a.volume = 0.2;
    fadeTo(a, TARGET, FADE_MS);
    unbind();
  }
  function bind(){
    window.addEventListener('touchstart', unlock, OPT);
    window.addEventListener('pointerdown', unlock, OPT);
    window.addEventListener('click', unlock, OPT);
    window.addEventListener('scroll', unlock, OPT);
    document.addEventListener('keydown', unlock, true);
  }
  function unbind(){
    window.removeEventListener('touchstart', unlock, OPT);
    window.removeEventListener('pointerdown', unlock, OPT);
    window.removeEventListener('click', unlock, OPT);
    window.removeEventListener('scroll', unlock, OPT);
    document.removeEventListener('keydown', unlock, true);
  }
  function init(){
    const a = $('bgm'); if(!a) return;
    a.setAttribute('preload','auto');
    a.setAttribute('playsinline','');
    a.setAttribute('autoplay','');
    a.muted = true;
    a.volume = 0.01;
    // Try muted autoplay; harmless if blocked
    safePlay(a).catch(()=>{});
    // Enforce loud volume whenever "play" is triggered (e.g., media button)
    a.addEventListener('play', onPlay, {capture:true});
    bind();
  }
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init, {once:true});
  } else { init(); }
})();
