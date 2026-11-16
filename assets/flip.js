/* Home page only.
   1. The countdown banner belongs to the index view: hidden on the landing,
      revealed as soon as you move off it.
   2. The landing -> index transition is a page flip, not a slow scroll. */
(function () {
  var landing = document.querySelector(".landing");
  if (!landing) return;                       /* other pages: banner untouched */

  var bar = document.querySelector(".ubar");
  var busy = false, timer = null, prev = window.scrollY;
  var FLIP_AT = 0.18, GRACE = 700;

  function setBar(show) {
    if (bar) bar.classList.toggle("ubar-hidden", !show);
    if (window.__syncOffsets) window.__syncOffsets();
  }

  /* keep the banner in step with the view, except while a flip is running */
  function syncBar() { if (!busy) setBar(window.scrollY > 8); }
  setBar(window.scrollY > 8);
  window.addEventListener("scroll", syncBar, { passive: true });

  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  function goDown() {
    busy = true;
    setBar(true);                              /* show it, THEN measure where the index sits */
    requestAnimationFrame(function () {
      var below = document.getElementById("below");
      /* scrollIntoView honours scroll-margin-top, so the sticky banner+nav never cover the first card */
      below.scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(function () { busy = false; prev = window.scrollY; }, GRACE);
    });
  }
  function goUp() {
    busy = true;
    setBar(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(function () { busy = false; prev = window.scrollY; }, GRACE);
  }

  function settle(dir) {
    var y = window.scrollY, h = landing.offsetHeight;
    if (y <= 6 || y >= h - 6) return;
    if (dir > 0) (y > h * FLIP_AT ? goDown : goUp)();
    else         (y < h * (1 - FLIP_AT) ? goUp : goDown)();
  }

  window.addEventListener("scroll", function () {
    if (busy) { prev = window.scrollY; return; }
    var y = window.scrollY, dir = y >= prev ? 1 : -1;
    prev = y;
    clearTimeout(timer);
    timer = setTimeout(function () { settle(dir); }, 130);
  }, { passive: true });

  window.addEventListener("keydown", function (e) {
    var y = window.scrollY, h = landing.offsetHeight;
    if (y <= 6 || y >= h - 6) return;
    var down = ["PageDown", " ", "ArrowDown", "End"].indexOf(e.key) !== -1;
    var up = ["PageUp", "ArrowUp", "Home"].indexOf(e.key) !== -1;
    if (!down && !up) return;
    e.preventDefault();
    down ? goDown() : goUp();
  }, { passive: false });
})();
