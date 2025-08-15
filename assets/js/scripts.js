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
