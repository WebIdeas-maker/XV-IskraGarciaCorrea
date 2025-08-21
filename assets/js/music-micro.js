
(function(){
  const SRC = "assets/audio/somethin-stupid.mp3";
  const TARGET_VOL = 0.35, FADE_MS = 2600;

  // Ensure audio element
  let a = document.getElementById("bgm");
  if(!a){
    a = document.createElement("audio");
    a.id = "bgm"; a.preload = "metadata"; a.setAttribute("playsinline","");
    const s = document.createElement("source"); s.src = SRC; s.type = "audio/mpeg";
    a.appendChild(s); document.body.appendChild(a);
  }

  // Create UI: wrapper + button + label
  let wrap = document.querySelector(".play-wrap");
  if(!wrap){
    wrap = document.createElement("div"); wrap.className = "play-wrap";
    const btn = document.createElement("button"); btn.className = "play-micro"; btn.type = "button"; btn.setAttribute("aria-label","Play/Stop");
    const lab = document.createElement("span"); lab.className = "play-label"; lab.textContent = "música";
    wrap.appendChild(btn); wrap.appendChild(lab);
    document.body.appendChild(wrap);
  }
  const btn = wrap.querySelector(".play-micro");

  let playing = false;
  function setState(p){ playing = p; btn.classList.toggle("is-playing", p); }
  function fadeTo(target, ms){
    const start = a.volume; const t0 = performance.now();
    function step(t){ const k = Math.min(1,(t-t0)/ms); a.volume = start + (target-start)*k; if(k<1) requestAnimationFrame(step); }
    requestAnimationFrame(step);
  }
  function playSoft(){
    a.muted = false; a.volume = Math.min(0.03, TARGET_VOL*0.12);
    return a.play().then(()=>{ setState(true); fadeTo(TARGET_VOL, FADE_MS); }).catch(()=>{});
  }
  function pause(){ a.pause(); setState(false); }

  // Toggle by click
  btn.addEventListener("click", ()=>{ playing ? pause() : playSoft(); });

  // Best-effort autoplay on load (may be blocked), retry on first gesture/scroll/visibility
  function tryAuto(){ if(!playing){ playSoft(); } }
  if(document.readyState === "complete" || document.readyState === "interactive"){
    setTimeout(tryAuto, 80);
  }else{
    document.addEventListener("DOMContentLoaded", ()=> setTimeout(tryAuto, 80));
  }
  const unlock = ()=>{ tryAuto(); unbind(); };
  function unbind(){
    window.removeEventListener("pointerdown", unlock);
    window.removeEventListener("touchstart", unlock);
    window.removeEventListener("click", unlock);
    window.removeEventListener("scroll", unlock);
    document.removeEventListener("visibilitychange", vis);
  }
  function vis(){ if(!document.hidden) tryAuto(); }
  window.addEventListener("pointerdown", unlock, {once:true, passive:true});
  window.addEventListener("touchstart", unlock, {once:true, passive:true});
  window.addEventListener("click", unlock, {once:true, passive:true});
  window.addEventListener("scroll", unlock, {once:true, passive:true});
  document.addEventListener("visibilitychange", vis, {passive:true});

  // Initialize icon state
  setState(false);
})();
