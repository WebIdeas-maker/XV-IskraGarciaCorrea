
// Tiny Music FAB: click to play/pause; long-press to open volume popup
(function(){
  const AID = "bgm";
  const LS_ENABLED = "mp_enabled";
  const LS_VOL = "mp_volume";

  let audio = document.getElementById(AID);
  if(!audio){
    audio = document.createElement("audio");
    audio.id = AID;
    audio.preload = "metadata";
    audio.setAttribute("playsinline","");
    const source = document.createElement("source");
    source.src = "assets/audio/somethin-stupid.mp3";
    source.type = "audio/mpeg";
    audio.appendChild(source);
    document.body.appendChild(audio);
  }

  // Create UI if missing
  let fab = document.querySelector(".mp-fab");
  if(!fab){
    fab = document.createElement("button");
    fab.className = "mp-fab";
    fab.type = "button";
    fab.setAttribute("aria-label","Música");
    fab.textContent = "►";
    document.body.appendChild(fab);
  }
  let pop = document.querySelector(".mp-pop");
  if(!pop){
    pop = document.createElement("div");
    pop.className = "mp-pop";
    pop.innerHTML = '<label>Volumen</label><input type="range" min="0" max="1" step="0.05" value="0.60">';
    document.body.appendChild(pop);
  }
  const slider = pop.querySelector("input[type=range]");

  // Restore state
  const savedV = Math.min(1, Math.max(0, parseFloat(localStorage.getItem(LS_VOL) || "0.6")));
  audio.volume = isFinite(savedV) ? savedV : 0.6; slider.value = audio.volume.toFixed(2);
  let enabled = localStorage.getItem(LS_ENABLED) === "1";
  let playing = false;

  function setIcon(){ fab.textContent = playing ? "❚❚" : "►"; }

  function tryPlay(){
    audio.muted = false;
    return audio.play().then(()=>{
      playing = true; setIcon();
      enabled = true; localStorage.setItem(LS_ENABLED,"1");
    }).catch(()=>{});
  }
  function tryPause(){
    audio.pause(); playing = false; setIcon();
    enabled = false; localStorage.setItem(LS_ENABLED,"0");
  }

  // Click toggles play
  fab.addEventListener("click", ()=>{
    if(playing){ tryPause(); } else { tryPlay(); }
  });

  // Long press (or right-click) opens volume pop
  let pressTimer = null;
  const openPop = ()=>{ pop.classList.add("show"); };
  const closePop = ()=>{ pop.classList.remove("show"); };
  const startPress = ()=>{ pressTimer = setTimeout(openPop, 450); };
  const endPress = ()=>{ clearTimeout(pressTimer); };
  fab.addEventListener("mousedown", startPress);
  fab.addEventListener("touchstart", startPress, {passive:true});
  ["mouseup","mouseleave","touchend","touchcancel"].forEach(ev=> fab.addEventListener(ev, endPress));
  fab.addEventListener("contextmenu", (e)=>{ e.preventDefault(); openPop(); });

  // Close on outside click
  document.addEventListener("click", (e)=>{
    if(pop.classList.contains("show") && !pop.contains(e.target) && e.target!==fab) closePop();
  });

  // Volume
  slider.addEventListener("input", ()=>{
    audio.volume = parseFloat(slider.value || "0.6");
    localStorage.setItem(LS_VOL, String(audio.volume));
  });

  // First gesture unlock: if user had left it enabled last time, auto-play on first click anywhere
  function unlockOnce(){
    if(localStorage.getItem(LS_ENABLED) === "1"){ tryPlay(); }
    window.removeEventListener("pointerdown", unlockOnce);
    window.removeEventListener("touchstart", unlockOnce);
    window.removeEventListener("click", unlockOnce);
  }
  window.addEventListener("pointerdown", unlockOnce, {once:true, passive:true});
  window.addEventListener("touchstart", unlockOnce, {once:true, passive:true});
  window.addEventListener("click", unlockOnce, {once:true, passive:true});

  
  // Default to enabled on first run
  if(localStorage.getItem(LS_ENABLED) === null){ localStorage.setItem(LS_ENABLED,"1"); }

  // Try autoplay as soon as possible (may be blocked silently by the browser)
  function tryAutoplay(){
    if(localStorage.getItem(LS_ENABLED) === "1"){
      tryPlay();
    }
  }
  if(document.readyState === "complete" || document.readyState === "interactive"){
    setTimeout(tryAutoplay, 120);
  }else{
    document.addEventListener("DOMContentLoaded", ()=> setTimeout(tryAutoplay, 120));
  }
  document.addEventListener("visibilitychange", ()=>{
    if(!document.hidden) setTimeout(tryAutoplay, 100);
  }, {passive:true});
  window.addEventListener("scroll", tryAutoplay, {once:true, passive:true});

  // initial icon
  setIcon();
})();
