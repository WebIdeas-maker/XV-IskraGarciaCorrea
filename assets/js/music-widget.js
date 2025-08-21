(function(){
  const audio = document.getElementById('bgm');
  if(!audio) return;
  const widget = document.querySelector('.music-widget');
  const btn = document.getElementById('music-toggle');
  const muteBtn = document.getElementById('music-mute');
  const vol = document.getElementById('music-vol');
  const status = document.getElementById('music-status');
  const LS_KEY = 'music-pref';

  const pref = JSON.parse(localStorage.getItem(LS_KEY) || '{}');
  let desiredVolume = typeof pref.volume === 'number' ? pref.volume : 0.6;
  let userWantsOn = !!pref.on;
  audio.volume = desiredVolume;
  audio.muted = !!pref.muted;
  if (vol) vol.value = desiredVolume;
  if (pref.on) setPlayingUI(false); else setPausedUI();

  if ('mediaSession' in navigator) {
    try { navigator.mediaSession.metadata = new MediaMetadata({ title: 'Fiesta de 15', artist: '—', album: '—' }); } catch(e){}
  }

  if (btn) btn.addEventListener('click', async () => {
    if (audio.paused) { await playWithFade(); userWantsOn = true; persist(); }
    else { audio.pause(); setPausedUI(); userWantsOn = false; persist(); }
  });
  if (muteBtn) muteBtn.addEventListener('click', () => { audio.muted = !audio.muted; persist(); muteBtn.classList.toggle('is-muted', audio.muted); });
  if (vol) vol.addEventListener('input', () => { desiredVolume = Number(vol.value); audio.volume = desiredVolume; persist(); });

  const firstGesture = () => { if (userWantsOn && audio.paused) playWithFade().catch(()=>{}); window.removeEventListener('pointerdown', firstGesture, {capture:true}); };
  window.addEventListener('pointerdown', firstGesture, {capture:true, once:true});

  function persist(){ localStorage.setItem(LS_KEY, JSON.stringify({ on: userWantsOn, volume: desiredVolume, muted: audio.muted })); }
  function setPlayingUI(justPlayed=true){ if (!widget||!btn||!status) return; widget.classList.add('playing'); btn.setAttribute('aria-pressed','true'); status.textContent='on'; if (justPlayed) btn.setAttribute('aria-label','Pausar música'); }
  function setPausedUI(){ if (!widget||!btn||!status) return; widget.classList.remove('playing'); btn.setAttribute('aria-pressed','false'); status.textContent='off'; btn.setAttribute('aria-label','Reproducir música'); }
  async function playWithFade(){ try{ const target=desiredVolume; audio.volume=0; audio.muted=false; await audio.play(); setPlayingUI(); let v=0; const steps=10, step=target/steps, iv=40; const t=setInterval(()=>{ v=Math.min(target, v+step); audio.volume=v; if(v>=target) clearInterval(t); }, iv);} catch(e){ setPausedUI(); throw e; } }
})();