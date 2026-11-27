/* Wiki theme: only a light stagger when the page first appears. Plain JS, no dependencies. */
(function () {
  Array.prototype.slice.call(document.querySelectorAll('.glass')).forEach(function (e, i) {
    e.style.setProperty('--i', Math.min(i, 8));
  });
})();
