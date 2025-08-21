(function(){
  const candidates = [
    'assets/img/galeria/2.jpg',
    'assets/img/galeria/2.jpeg',
    'assets/img/2.jpg',
    'assets/img/2.jpeg',
    'assets/img/galeria/Iskra.jpeg',
    'assets/img/Iskra.jpeg',
    'assets/img/iskra.jpg'
  ];
  function apply(path){
    const targets = document.querySelectorAll('.imgPortada, .hero, .banner, .portada, #home, body');
    targets.forEach(el => {
      el.style.backgroundImage = `url('${path}')`;
      el.style.backgroundSize = 'cover';
      el.style.backgroundRepeat = 'no-repeat';
      el.style.backgroundPosition = 'center 42%';
      if (getComputedStyle(el).backgroundColor !== 'rgba(0, 0, 0, 0)') {
        el.style.backgroundColor = 'transparent';
      }
    });
  }
  function tryNext(i){
    if (i >= candidates.length) return;
    const path = candidates[i];
    const img = new Image();
    img.onload = () => apply(path);
    img.onerror = () => tryNext(i+1);
    img.src = path + '?v=' + Date.now();
  }
  tryNext(0);
})();