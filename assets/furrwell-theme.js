document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Mobile nav ---------- */
  document.querySelectorAll('[data-fw-burger]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var nav = document.querySelector('[data-fw-mobile-nav]');
      if (nav) nav.classList.add('is-open');
    });
  });
  document.querySelectorAll('[data-fw-mobile-close], [data-fw-mobile-backdrop]').forEach(function (el) {
    el.addEventListener('click', function () {
      var nav = document.querySelector('[data-fw-mobile-nav]');
      if (nav) nav.classList.remove('is-open');
    });
  });
  document.querySelectorAll('[data-fw-mobile-toplink]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var li = link.closest('li');
      if (li && li.querySelector('.fw-mobile-sub')) {
        e.preventDefault();
        li.classList.toggle('is-open');
      }
    });
  });

  /* ---------- Hero banner slider ---------- */
  document.querySelectorAll('[data-fw-hero]').forEach(function (root) {
    var track = root.querySelector('.fw-hero-track');
    var slides = root.querySelectorAll('.fw-hero-slide');
    var dots = root.querySelectorAll('[data-fw-hero-dot]');
    var count = slides.length;
    if (!track || count === 0) return;
    var index = 0;

    function render() {
      track.style.transform = 'translateX(-' + (index * 100) + '%)';
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
    }
    function goTo(i) {
      index = (i + count) % count;
      render();
    }

    var prevBtn = root.querySelector('[data-fw-hero-prev]');
    var nextBtn = root.querySelector('[data-fw-hero-next]');
    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(index - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(index + 1); });
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { goTo(i); });
    });

    if (count > 1) {
      var timer = setInterval(function () { goTo(index + 1); }, 6000);
      root.addEventListener('mouseenter', function () { clearInterval(timer); });
    }

    render();
  });

  /* ---------- Category image slider ---------- */
  document.querySelectorAll('[data-fw-cat-slider]').forEach(function (root) {
    var wrap = root.querySelector('.fw-cat-track-wrap');
    var track = root.querySelector('.fw-cat-track');
    var cards = root.querySelectorAll('.fw-cat-card');
    var prevBtn = root.querySelector('[data-fw-cat-prev]');
    var nextBtn = root.querySelector('[data-fw-cat-next]');
    if (!wrap || !track || cards.length === 0) return;

    var index = 0;
    var gap = 20;

    function cardStep() {
      return cards[0].getBoundingClientRect().width + gap;
    }
    function visibleCount() {
      return Math.max(1, Math.floor((wrap.getBoundingClientRect().width + gap) / cardStep()));
    }
    function maxIndex() {
      return Math.max(0, cards.length - visibleCount());
    }
    function render() {
      var max = maxIndex();
      if (index > max) index = max;
      track.style.transform = 'translateX(-' + (index * cardStep()) + 'px)';
      if (prevBtn) prevBtn.disabled = index <= 0;
      if (nextBtn) nextBtn.disabled = index >= max;
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { index = Math.max(0, index - 1); render(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { index = Math.min(maxIndex(), index + 1); render(); });
    window.addEventListener('resize', render);

    /* Swipe left/right on touch screens */
    var startX = 0, startY = 0, dragging = false, baseX = 0;
    wrap.style.touchAction = 'pan-y';
    wrap.addEventListener('touchstart', function (e) {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      baseX = index * cardStep();
      dragging = true;
      track.style.transition = 'none';
    }, { passive: true });
    wrap.addEventListener('touchmove', function (e) {
      if (!dragging) return;
      var dx = e.touches[0].clientX - startX;
      var dy = e.touches[0].clientY - startY;
      if (Math.abs(dy) > Math.abs(dx)) return;
      var max = maxIndex() * cardStep();
      var x = Math.min(max + 40, Math.max(-40, baseX - dx));
      track.style.transform = 'translateX(' + (-x) + 'px)';
    }, { passive: true });
    wrap.addEventListener('touchend', function (e) {
      if (!dragging) return;
      dragging = false;
      track.style.transition = '';
      var dx = e.changedTouches[0].clientX - startX;
      var step = cardStep();
      if (Math.abs(dx) > 40) {
        var moved = Math.max(1, Math.round(Math.abs(dx) / step));
        index = dx < 0 ? Math.min(maxIndex(), index + moved) : Math.max(0, index - moved);
      }
      render();
    });

    render();
  });

});
