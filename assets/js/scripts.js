////  Quitar carta de intro y mantener fade-in de portada
// Forzamos --time-chrome: 9s para que el body no demore y la portada siga con su fade-in (≈0.5s)
document.documentElement.style.setProperty("--time-chrome", "9s");
const firstAnimation = document.getElementById("firstAnimation");
if (firstAnimation) firstAnimation.remove();

////  Cuenta regresiva (20 septiembre 2025 - 19:00)
var fechaCuentaRegresiva = "2025-09-20T19:00:00"; // Formato ISO local (7:00 pm)
var countDownDate = new Date(fechaCuentaRegresiva).getTime();

var x = setInterval(function () {
  var now = new Date().getTime();
  var distance = countDownDate - now;

  if (distance <= 0) {
    clearInterval(x);
    var reloj = document.getElementById("reloj");
    if (reloj) reloj.innerHTML = "¡LLEGÓ EL GRAN DÍA!";
    if (window.jQuery) $("#reloj").prev("p").html("Listo...");
    return;
  }

  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  var reloj = document.getElementById("reloj");
  if (reloj) {
    reloj.innerHTML =
      days + " días " + hours + "hs " + minutes + "m " + seconds + "s";
  }
}, 1000);

////  Variables --vh y --vw
document.documentElement.style.setProperty("--vh", `${window.innerHeight * 0.01}px`);
document.documentElement.style.setProperty("--vw", `${window.innerWidth * 0.01}px`);

////  Confetti
function confetti() {
  $.each($(".confetti"), function () {
    var confetticount = ($(this).width() / 50) * 8;
    for (var i = 0; i <= confetticount; i++) {
      $(this).append(
        '<span class="particle c' +
          $.rnd(1, 2, 0) +
          '" style="top:' +
          $.rnd(10, 40, 0) +
          "%; left:" +
          $.rnd(0, 100, 0) +
          "%;width: calc(" +
          $.rnd(0.025, 0.875, 3) +
          "vw + 8px) ; height: calc(" +
          $.rnd(0.012, 0.437, 3) +
          "vw + 5px);animation-delay: " +
          $.rnd(25, 45, 0) / 10 +
          's;"></span>'
      );
    }
  });
}

jQuery.rnd = function (m, n, decimales) {
  var precision = Math.pow(10, decimales);
  m = m * precision;
  n = n * precision;
  return Math.floor(Math.random() * (n - m + 1) + m) / precision;
};

confetti();

////  Scroll Transform Gold
let windowHeight = window.innerHeight;
let $mavi_gold = $("#mavi_gold");
let $mis_quince_gold = $("#mis_quince_gold");
let $mis_quince_gray = $("#mis_quince_gray");
let $marco_gold = $("#marco_gold");

window.onscroll = function () {
  let $letterContent = $(".letter_content");
  if ($letterContent.length === 0) return;

  let letter_num2 = windowHeight * 1.08 - $letterContent.offset().top;
  let letter_num = letter_num2 > 0 ? letter_num2 / (windowHeight * 0.38) : 0;

  if (window.scrollY < 300) {
    $mavi_gold.css("opacity", 1 - letter_num);
    $mis_quince_gold.css("opacity", letter_num);
    $mis_quince_gray.css("opacity", 1 - letter_num);
    $marco_gold.css("opacity", 1 - letter_num);
  }
};

////  Horizontal Scroll
$(function () {
  function showSlide(n) {
    $body.unbind("mousewheel");
    currSlide = Math.min(Math.max(0, currSlide + n), $slide.length - 1);
    var displacment = $(window).width() * 0.85 * currSlide;
    $slides.css("transform", "translateX(-" + displacment + "px)");
    setTimeout(bind, 500);

    $("a.active").removeClass("active");
    $($(".nav_a")[currSlide]).addClass("active");
  }

  function bind() {
    $body.bind("mousewheel", mouseEvent);
  }

  function mouseEvent(e, delta) {
    showSlide(delta >= 0 ? -1 : 1);
    e.preventDefault();
  }

  $("nav a").click(function (e) {
    var newslide = parseInt($(this).attr("href")[1], 10);
    var diff = newslide - currSlide - 1;
    showSlide(diff);
    e.preventDefault();
  });

  $(window).resize(function () {
    var displacment = $(window).width() * 0.85 * currSlide;
    $slides.css("transform", "translateX(-" + displacment + "px)");
  });

  var $body = $(".scroll");
  var currSlide = 0;
  var $slides = $(".sections");
  var $slide = $("section");

  $($("nav a")[0]).addClass("active");
  $body.bind("mousewheel", mouseEvent);

  var ts;
  $body.on("touchstart", function (e) {
    ts = e.originalEvent.touches[0].clientX;
  });

  $body.on("touchend", function (e) {
    var te = e.originalEvent.changedTouches[0].clientX;
    if (ts - 15 > te) {
      showSlide(1);
    } else if (te - 15 > ts) {
      showSlide(-1);
    }
  });
});


















/* === Injected: toggle brand colors on carta visibility === */
document.addEventListener('DOMContentLoaded', () => {
  const target = document.querySelector('.letter');
  if (!target) return;
  const rootEl = document.documentElement;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) rootEl.classList.add('in-menu');
      else rootEl.classList.remove('in-menu');
    });
  }, { threshold: 0.25, rootMargin: '-5% 0% -5% 0%' });
  io.observe(target);
});
/* === End Injected === */


/* === Section 5: Lluvia de sobres interactions (refined) === */
document.addEventListener('DOMContentLoaded', function () {
  const section = document.querySelector('section[id="5"] .sobre-lluvia');
  if (!section) return;
  const nombre = section.getAttribute('data-nombre') || 'Nombre Apellido';
  const cuenta = section.getAttribute('data-cuenta') || '0000 0000 0000 0000';
  const nombreEl = document.getElementById('sobre-nombre');
  const cuentaEl = document.getElementById('cuenta-num');
  if (nombreEl) nombreEl.textContent = nombre;
  if (cuentaEl) cuentaEl.textContent = cuenta;

  const btn = document.getElementById('btn-sobre');
  const datos = document.getElementById('sobre-datos');
  const copyBtn = wrapper.querySelector('.s5-copy');

  btn?.addEventListener('click', () => {
    btn.style.display = 'none';
    datos.classList.add('show');
    datos.removeAttribute('hidden');
  });

  copyBtn?.addEventListener('click', async () => {
    const text = cuentaEl?.textContent?.trim() || '';
    try {
      await navigator.clipboard.writeText(text);
      copyBtn.textContent = '¡Copiado!';
      setTimeout(() => (copyBtn.textContent = 'Copiar número'), 1600);
    } catch (e) {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      copyBtn.textContent = '¡Copiado!';
      setTimeout(() => (copyBtn.textContent = 'Copiar número'), 1600);
    }
  });
});
/* === End Section 5 === */


/* === Section 5: refined interactions === */
document.addEventListener('DOMContentLoaded', function () {
  const wrapper = document.querySelector('section[id="5"] .sobre-lluvia');
  if (!wrapper) return;

  const nombre = wrapper.getAttribute('data-nombre') || 'Nombre Apellido';
  const cuenta = wrapper.getAttribute('data-cuenta') || '0000 0000 0000 0000';
  const nombreEl = document.getElementById('sobre-nombre');
  const cuentaEl = document.getElementById('cuenta-num');
  if (nombreEl) nombreEl.textContent = nombre;
  if (cuentaEl) cuentaEl.textContent = cuenta;

  const btn = document.getElementById('btn-sobre');
  const datos = document.getElementById('sobre-datos');
  const copyBtn = wrapper.querySelector('.s5-copy');
  const lluvia = wrapper.querySelector('.envelope-rain');

  // Build rain when visible
  const makeEnvelope = () => {
    const span = document.createElement('span');
    span.className = 'sobre-particle';
    const size = Math.random() * 0.8 + 0.6;
    const left = Math.random() * 100;
    const dur = Math.random() * 6 + 8;
    const delay = Math.random() * 4;
    span.style.cssText = `position:absolute; top:-10%; left:${left}%; width:calc(${size}vw + 10px); height:calc(${size*0.7}vw + 7px); opacity:${Math.random()*0.4 + 0.35}; animation: sobreFall ${dur}s linear ${delay}s infinite; transform: rotate(${Math.random()*20-10}deg);`;
    span.innerHTML = '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor" aria-hidden="true"><path d="M3 6h18a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1zm0 2v.2l9 5.4 9-5.4V8L12 13 3 8z"/></svg>';
    return span;
  };
  const ensureRain = () => {
    if (!lluvia || lluvia.childElementCount) return;
    const count = Math.max(14, Math.floor(window.innerWidth / 60));
    const frag = document.createDocumentFragment();
    for (let i=0; i<count; i++) frag.appendChild(makeEnvelope());
    lluvia.appendChild(frag);
  };
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) ensureRain(); });
  }, { threshold: .2 });
  io.observe(wrapper);

  // Morph: hide button and show datos
  btn?.addEventListener('click', () => {
    if (!datos) return;
    btn.style.transition = 'opacity .25s ease, transform .25s ease';
    btn.style.opacity = '0';
    btn.style.transform = 'scale(.92)';
    setTimeout(() => { btn.style.display = 'none'; }, 250);
    datos.removeAttribute('hidden');
    // trigger CSS transition via class
    requestAnimationFrame(() => datos.classList.add('show'));
  });

  // Copy account number
  copyBtn?.addEventListener('click', async () => {
    const text = cuentaEl?.textContent?.trim() || '';
    try {
      await navigator.clipboard.writeText(text);
      copyBtn.textContent = '¡Copiado!';
      setTimeout(() => (copyBtn.textContent = 'Copiar número'), 1600);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      copyBtn.textContent = '¡Copiado!';
      setTimeout(() => (copyBtn.textContent = 'Copiar número'), 1600);
    }
  });
});

// Keyframes + color
(() => {
  const style = document.createElement('style');
  style.textContent = `
    #5 .sobre-particle { color: var(--pink_accent); }
    @keyframes sobreFall { 0%{ transform: translateY(-10%) rotate(0deg);} 100%{ transform: translateY(120vh) rotate(180deg);} }
  `;
  document.head.appendChild(style);
})();
/* === End Section 5 refined === */



/* --- Robust morph with forced reflow (Section 5) --- */
document.addEventListener('DOMContentLoaded', function () {
  const btn = document.getElementById('btn-sobre');
  const datos = document.getElementById('sobre-datos');
  if (!btn || !datos) return;
  if (btn.__s5_wired) return;
  btn.__s5_wired = true;

  btn.addEventListener('click', () => {
    // Fade out button
    btn.classList.add('fade-out');
    setTimeout(() => { btn.style.display = 'none'; }, 250);

    // Prepare target
    datos.hidden = false;     // remove display:none
    datos.classList.remove('show');
    datos.style.opacity = '0';
    datos.style.transform = 'translateY(-6px)';

    // Force reflow so browser registers the starting state
    void datos.offsetWidth; // <-- key line

    // Trigger the transition to the final state
    datos.classList.add('show');
  });
});

