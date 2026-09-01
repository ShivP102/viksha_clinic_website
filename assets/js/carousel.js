(function () {
  const carousels = document.querySelectorAll('[data-carousel]');

  carousels.forEach(function (root) {
    const track = root.querySelector('.carousel__track');
    const prev = root.querySelector('[data-carousel-prev]');
    const next = root.querySelector('[data-carousel-next]');
    if (!track) return;

    function scrollBySlide(dir) {
      const slide = track.querySelector('.carousel__slide');
      const amount = slide ? slide.getBoundingClientRect().width + 24 : 320;
      track.scrollBy({ left: dir * amount, behavior: 'smooth' });
    }

    if (prev) prev.addEventListener('click', function () { scrollBySlide(-1); });
    if (next) next.addEventListener('click', function () { scrollBySlide(1); });
  });
})();
