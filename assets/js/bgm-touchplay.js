
// Touch-to-play (LOUD) — make sure *any* play path ends up unmuted and loud.
// - Forces volume on 'play' & 'playing'
// - Keeps enforcing loudness for the first few seconds (unless user changes volume)
// - Respects user volume afterwards (detect via isTrusted on 'volumechange')
(function(){
  const AID = "bgm";
  const TARGET = 0.85;      // desired loud volume
  const FADE_MS = 220;      // quick fade on unlock
  const ENFORCE_MS = 3500;  // keep it loud for N ms after play
  const OPT = { once:true, passive:true };
  let enforceUntil = 0;
  let userAdjusted = false;

  function $(id){ return document.getElementById(id); }
  function now(){ return (window.performance && performance.now) ? performance.now() : Date.now(); }

  function fadeTo(a, to, ms){
    const from = a.volume, t0 = now();
    function step(t){ const k = Math.min(1,(t - t0)/ms); a.volume = from + (to - from)*k; if(k<1) requestAnimationFrame(step); }
    requestAnimationFrame(step);
  }
  function safePlay(a){ try{ return a.play(); } catch(e){ return Promise.reject(e); } }
  function forceLoud(a){
    a.muted = false;
    a.volume = TARGET;
  }
  function onPlayGeneric(){
    const a = $(AID); if(!a) return;
    forceLoud(a);
    enforceUntil = now() + ENFORCE_MS;
  }
  function onTimeUpdate(){
    const a = $(AID); if(!a) return;
    if (!userAdjusted && now() < enforceUntil){
      a.muted = false;
      if (a.volume < TARGET * 0.95) a.volume = TARGET;
    }else{
      // stop enforcing
      a.removeEventListener('timeupdate', onTimeUpdate, true);
    }
  }
  function onVolumeChange(ev){
    // If the event is from the user, stop enforcing
    if (ev && ev.isTrusted) userAdjusted = true;
  }

  function unlock(){
    const a = $(AID); if(!a) return unbind();
    a.muted = false;
    if (a.paused) safePlay(a).catch(()=>{});
    if (a.volume < 0.2) a.volume = 0.2;
    fadeTo(a, TARGET, FADE_MS);
    enforceUntil = now() + ENFORCE_MS;
    a.addEventListener('timeupdate', onTimeUpdate, true);
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
    const a = $(AID); if(!a) return;
    a.setAttribute('preload','auto');
    a.setAttribute('playsinline','');
    a.setAttribute('autoplay','');
    a.muted = true;
    a.volume = 0.01;

    // Try muted autoplay (desktop)
    safePlay(a).catch(()=>{});

    // Enforce loudness on any play path
    a.addEventListener('play', onPlayGeneric, true);
    a.addEventListener('playing', onPlayGeneric, true);
    a.addEventListener('volumechange', onVolumeChange, true);

    // Start listening to enforce during the first seconds
    a.addEventListener('timeupdate', onTimeUpdate, true);

    // Set up unlock for mobile
    bind();
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init, {once:true});
  } else { init(); }
})();
