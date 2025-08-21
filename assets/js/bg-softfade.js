
(function(){
  function getBgUrl(el){
    const st = window.getComputedStyle(el);
    const v = st.backgroundImage || "";
    const m = v.match(/url\(["']?(.*?)["']?\)/);
    return m ? m[1] : null;
  }
  function preload(url, cb){
    if(!url) return cb();
    const img = new Image();
    img.onload = cb;
    img.onerror = cb;
    img.src = url;
  }
  function init(){
    const hero = document.querySelector('.imgPortada');
    if(!hero){ document.body.classList.add('bg-loaded'); return; }
    let url = getBgUrl(hero);
    preload(url, function(){ document.body.classList.add('bg-loaded'); });
    // Fallback in case style wasn't ready
    setTimeout(function(){ document.body.classList.add('bg-loaded'); }, 1500);
  }
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init, {once:true});
  } else {
    init();
  }
})();
