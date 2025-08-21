
(function(){
  const SRC = "assets/audio/somethin-stupid.mp3";
  const TARGET = 0.38, FADE_MS = 1200;

  // hidden audio
  let a = document.getElementById("bgm");
  if(!a){
    a = document.createElement("audio");
    a.id = "bgm"; a.preload = "auto"; a.setAttribute("playsinline",""); a.style.display="none";
    const s = document.createElement("source"); s.src = SRC; s.type = "audio/mpeg";
    a.appendChild(s); document.body.appendChild(a);
  }

  // small button
  let btn = document.querySelector(".music-circle");
  if(!btn){
    btn = document.createElement("button");
    btn.className = "music-circle"; btn.type = "button"; btn.setAttribute("aria-label","Música");
    document.body.appendChild(btn);
  }

  let playing = false;
  function setState(p){ playing = p; btn.classList.toggle("is-playing", p); }
  function fadeTo(target, ms){
    const start = a.volume, t0 = performance.now();
    function step(t){ const k = Math.min(1, (t - t0)/ms); a.volume = start + (target - start)*k; if(k < 1) requestAnimationFrame(step); }
    requestAnimationFrame(step);
  }
  function startAuto(){
    a.muted = true; a.volume = 0.0;
    a.play().then(()=>{
      setState(true);
      setTimeout(()=>{ a.muted = false; fadeTo(TARGET, FADE_MS); }, 120);
    }).catch(()=>{});
  }
  function playSoft(){
    a.muted = false; a.volume = Math.min(0.03, TARGET*0.12);
    a.play().then(()=>{ setState(true); fadeTo(TARGET, FADE_MS); }).catch(()=>{});
  }
  function pause(){ a.pause(); setState(false); }

  btn.addEventListener("click", ()=>{ playing ? pause() : playSoft(); });

  // Autoplay on load, fallback on first user gesture
  if(document.readyState === "complete" || document.readyState === "interactive"){
    setTimeout(startAuto, 50);
  }else{
    document.addEventListener("DOMContentLoaded", ()=> setTimeout(startAuto, 50));
  }
  const unlock = ()=>{ playSoft(); unbind(); };
  function unbind(){
    window.removeEventListener("pointerdown", unlock);
    window.removeEventListener("touchstart", unlock);
    window.removeEventListener("click", unlock);
    window.removeEventListener("scroll", unlock);
  }
  window.addEventListener("pointerdown", unlock, {once:true, passive:true});
  window.addEventListener("touchstart", unlock, {once:true, passive:true});
  window.addEventListener("click", unlock, {once:true, passive:true});
  window.addEventListener("scroll", unlock, {once:true, passive:true});
})();
