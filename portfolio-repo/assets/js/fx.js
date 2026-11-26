/* Aurora motion: mouse glow, parallax, glitch. Plain JS, no dependencies. */
(function () {
  var $ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  $('.glass').forEach(function (e, i) { e.style.setProperty('--i', Math.min(i, 8)); });
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  /* glitch on titles: on hover + a periodic pulse on the first one */
  function fire(t) { t.classList.remove('go'); void t.offsetWidth; t.classList.add('go'); }
  var gl = $('h1').map(function (h) {
    var t = h.querySelector('.grad') || h;
    t.classList.add('gl'); t.setAttribute('data-text', t.textContent);
    t.addEventListener('mouseenter', function () { fire(t); });
    return t;
  });
  if (gl[0]) { setTimeout(function () { fire(gl[0]); }, 900); setInterval(function () { fire(gl[0]); }, 6000); }

  /* parallax (mouse + scroll) and glow that follows the pointer */
  var glow = document.querySelector('.cursor-glow');
  var blobs = $('.aurora i').map(function (e, i) { return { e: e, d: [22, 36, 52][i] || 30, k: [.03, .05, .08][i] || .04 }; });
  var cards = $('.photo, .term, .stats').map(function (e, i) { return { e: e, d: i % 2 ? -8 : 8 }; });
  var tx = 0, ty = 0, mx = 0, my = 0, px = innerWidth / 2, py = innerHeight / 3, gx = px, gy = py, busy = false;

  function frame() {
    mx += (tx - mx) * .07; my += (ty - my) * .07; gx += (px - gx) * .14; gy += (py - gy) * .14;
    var sy = scrollY;
    blobs.forEach(function (b) { b.e.style.translate = (-mx * b.d) + 'px ' + (-my * b.d - sy * b.k) + 'px'; });
    cards.forEach(function (c) { c.e.style.translate = (mx * c.d) + 'px ' + (my * c.d) + 'px'; });
    if (glow) glow.style.transform = 'translate3d(' + gx + 'px,' + gy + 'px,0)';
    busy = Math.abs(tx - mx) + Math.abs(ty - my) + Math.abs(px - gx) + Math.abs(py - gy) > .002;
    if (busy) requestAnimationFrame(frame);
  }
  function kick() { if (!busy) { busy = true; requestAnimationFrame(frame); } }

  addEventListener('pointermove', function (e) {
    if (e.pointerType === 'touch') return;
    tx = e.clientX / innerWidth - .5; ty = e.clientY / innerHeight - .5; px = e.clientX; py = e.clientY;
    if (glow) glow.classList.add('on');
    var c = e.target.closest && e.target.closest('.glass');
    if (c) { var r = c.getBoundingClientRect(); c.style.setProperty('--sx', (e.clientX - r.left) + 'px'); c.style.setProperty('--sy', (e.clientY - r.top) + 'px'); }
    kick();
  }, { passive: true });
  document.addEventListener('mouseleave', function () { if (glow) glow.classList.remove('on'); });
  addEventListener('scroll', kick, { passive: true });
  kick();
})();
