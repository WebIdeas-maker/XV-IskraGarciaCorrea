
function s5_getClipRect(el){
  // Find the nearest ancestor that clips (overflow != 'visible')
  var cur = el && el.parentElement;
  while(cur){
    var cs = getComputedStyle(cur);
    var clipY = (cs.overflowY && cs.overflowY !== 'visible') || (cs.overflow && cs.overflow !== 'visible');
    if(clipY){
      var r = cur.getBoundingClientRect();
      return r;
    }
    cur = cur.parentElement;
  }
  // Fallback to section rect
  return el.closest ? el.closest('section').getBoundingClientRect() : el.getBoundingClientRect();
}


(function(){
  function initS5(){
    var sec = document.querySelector('#\\35'); // id="5" escaped
    if(!sec) return;
    var box = sec.querySelector('.sobre-lluvia');
    if(!box) return;
    var nombre = (box.getAttribute('data-nombre')||'').trim();
    var cuenta = (box.getAttribute('data-cuenta')||'').trim();

    // Populate texts
    var titularP = sec.querySelector('.sobre-titular');
    var cuentaCode = sec.querySelector('#cuenta-num');
    if(titularP && nombre){
      // Replace only the text node after <strong>
      var strong = titularP.querySelector('strong');
      if(strong){
        // Keep "Titular:" strong, set rest of line
        var tail = titularP.childNodes[titularP.childNodes.length-1];
        titularP.innerHTML = '<strong>Titular:</strong> ' + nombre;
      }
    }
    if(cuentaCode && cuenta){
      cuentaCode.textContent = cuenta;
    }

    // Copy button
    var copyBtn = sec.querySelector('.s5-copy');
    if(copyBtn && cuentaCode){
      copyBtn.addEventListener('click', function(){
        var txt = cuentaCode.textContent.trim();
        if(!txt) return;
        navigator.clipboard.writeText(txt).then(function(){
          copyBtn.textContent = '¡Copiado!';
          copyBtn.setAttribute('aria-live','polite');
          setTimeout(function(){ copyBtn.textContent = 'Copiar'; }, 1200);
        }).catch(function(){
          // Fallback
          try{
            var r = document.createRange();
            r.selectNodeContents(cuentaCode);
            var sel = window.getSelection();
            sel.removeAllRanges(); sel.addRange(r);
            document.execCommand('copy');
            sel.removeAllRanges();
            copyBtn.textContent = '¡Copiado!';
            setTimeout(function(){ copyBtn.textContent = 'Copiar'; }, 1200);
          }catch(e){}
        });
      });
    }

    // Toggle aria-expanded on the label
    var toggle = sec.querySelector('#s5-toggle');
    var label = sec.querySelector('label[for="s5-toggle"]');
    var panel = sec.querySelector('#s5-panel');
    function syncAria(){
      var exp = !!(toggle && toggle.checked);
      if(label) label.setAttribute('aria-expanded', exp ? 'true':'false');
      if(panel) panel.setAttribute('aria-hidden', exp ? 'false':'true');
    }
    if(toggle){
      toggle.addEventListener('change', syncAria);
      syncAria();
    }
  }
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', initS5);
  }else{
    initS5();
  }
})();


// === AUTO-FIT: ensure the panel fits within the clipped frame regardless of OS scaling/zoom ===
(function(){
  function qs(s,root){ return (root||document).querySelector(s); }
  function adjust(){
    var sec = qs('#\\35'); if(!sec) return;
    var box = qs('.sobre-lluvia', sec);
    var pnl = qs('#s5-panel', sec);
    var tgl = qs('#s5-toggle', sec);
    if(!box) return;
    // Reset transform before measuring
    box.style.transform = 'none';
    if(!(tgl && tgl.checked) || !pnl){ return; }

    var secR = s5_getClipRect(sec);
    var pnlR = pnl.getBoundingClientRect();

    // Estimate any bottom nav overlap
    var nav = qs('nav'); var navH = 0;
    if(nav){
      var n = nav.getBoundingClientRect();
      if(n.top < secR.bottom && n.bottom > secR.top){
        navH = n.height;
      }
    }
    var safeBottom = secR.bottom - navH - 16;
    var overflow = pnlR.bottom - safeBottom;
    var safeTop = secR.top + 12;
    var overflowTop = safeTop - pnlR.top;

    var shift = 0;
    if(overflow > 0) shift += overflow;
    if(overflowTop > 0) shift -= overflowTop;

    if(Math.abs(shift) > 1){
      box.style.transform = 'translateY(' + (-shift) + 'px)';
    }else{
      box.style.transform = 'none';
    }
  }
  function onChange(){
    setTimeout(adjust, 10);
  }
  window.addEventListener('resize', adjust);
  window.addEventListener('orientationchange', adjust);
  document.addEventListener('DOMContentLoaded', adjust);
  // Wire checkbox
  (function(){
    var sec = qs('#\\35'); if(!sec) return;
    var tgl = qs('#s5-toggle', sec);
    if(tgl){ tgl.addEventListener('change', onChange); }
  })();
})();


// === Medir barra de secciones y actualizar --navH ===
function s5_updateNavH(){
  try{
    var candidates = Array.from(document.querySelectorAll('nav, .nav, .numbers, .bottom-navigation, .menu, .scroll_number, .scroll_num, .sections + *'));
    var h = 0;
    var sec = document.querySelector('#\\35');
    var secRect = sec ? sec.getBoundingClientRect() : null;
    candidates.forEach(function(el){
      var r = el.getBoundingClientRect();
      // Considera elementos que toquen la parte baja de la sección
      if(!secRect || (r.top < secRect.bottom && r.bottom > secRect.bottom - 200)){
        h = Math.max(h, r.height);
      }
    });
    if(h > 0){
      document.documentElement.style.setProperty('--navH', (Math.round(h)+8) + 'px');
    }
  }catch(e){/* no-op */}
}


(function(){
  function initNavMeasure(){
    s5_updateNavH();
    window.addEventListener('resize', s5_updateNavH);
    window.addEventListener('orientationchange', s5_updateNavH);
    // medir cuando cambia el checkbox
    var sec = document.querySelector('#\35');
    if(sec){
      var t = sec.querySelector('#s5-toggle');
      if(t) t.addEventListener('change', s5_updateNavH);
    }
    // medir de nuevo tras fuente/carga de imagenes
    setTimeout(s5_updateNavH, 200);
  }
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', initNavMeasure);
  }else{ initNavMeasure(); }
})();


// === Keep envelope/panel clear of bottom nav by lifting the section block if needed ===
function s5_adjustClearance(){
  var SAFE_GAP_PX = 42;
  var sec = document.querySelector('#\\35'); if(!sec) return;
  var box = sec.querySelector('.sobre-lluvia');
  if(!box){ return; }
  // reset transform before measuring
  box.style.transform = 'none';

  var env = sec.querySelector('.s5-center');
  var pnl = sec.querySelector('#s5-panel');
  var tgl = sec.querySelector('#s5-toggle');

  var secR = s5_getClipRect(sec);
  var navR = null, navH = 0;
  var nav = document.querySelector('nav') || document.querySelector('.numbers') || document.querySelector('.bottom-navigation');
  if(nav){
    navR = nav.getBoundingClientRect();
    if(navR.top < secR.bottom && navR.bottom >= secR.bottom - 240){
      navH = navR.height;
    }
  }

  var safeBottom = secR.bottom - (navH || 0) - SAFE_GAP_PX; // breathing
  var shift = 0;

  if(env){
    var eR = env.getBoundingClientRect();
    var overlapEnv = eR.bottom - safeBottom;
    if(overlapEnv > 0) shift = Math.max(shift, overlapEnv);
  }
  if(pnl && tgl && tgl.checked){
    var pR = pnl.getBoundingClientRect();
    var overlapP = pR.bottom - safeBottom;
    if(overlapP > 0) shift = Math.max(shift, overlapP);
  }

  if(Math.abs(shift) > 1){
    box.style.transform = 'translateY(' + (-shift) + 'px)';
  }else{
    box.style.transform = 'none';
  }
}



(function(){
  function onReady(){
    s5_updateNavH && s5_updateNavH();
    s5_adjustClearance();
    var sec = document.querySelector('#\\35'); if(!sec) return;
    var tgl = sec.querySelector('#s5-toggle');
    if(tgl){ tgl.addEventListener('change', function(){ setTimeout(s5_adjustClearance, 10); }); }
    window.addEventListener('resize', s5_adjustClearance);
    window.addEventListener('orientationchange', s5_adjustClearance);
    setTimeout(s5_adjustClearance, 250); // once more after fonts/images
  }
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', onReady);
  }else{ onReady(); }
})();

