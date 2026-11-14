/* Turns the landing -> notes transition into a page flip instead of a slow scroll.
   Only acts inside the boundary zone, so the notes page itself scrolls normally. */
(function () {
  var landing = document.querySelector(".landing");
  if (!landing) return;
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var busy = false, timer = null, prev = window.scrollY;
  var FLIP_AT = 0.18, GRACE = 700;

  function height() { return landing.offsetHeight; }

  function go(target) {
    busy = true;
    window.scrollTo({ top: target, behavior: "smooth" });
    setTimeout(function () { busy = false; prev = window.scrollY; }, GRACE);
  }

  function settle(dir) {
    var y = window.scrollY, h = height();
    if (y <= 6 || y >= h - 6) return;          /* already resting on one screen */

    if (dir > 0) go(y > h * FLIP_AT ? h : 0);          /* down: flip, or snap back */
    else         go(y < h * (1 - FLIP_AT) ? 0 : h);    /* up: flip back, or snap down */
  }

  window.addEventListener("scroll", function () {
    if (busy) { prev = window.scrollY; return; }
    var y = window.scrollY;
    var dir = y >= prev ? 1 : -1;
    prev = y;
    clearTimeout(timer);
    timer = setTimeout(function () { settle(dir); }, 130);
  }, { passive: true });

  window.addEventListener("keydown", function (e) {
    var y = window.scrollY, h = height();
    if (y <= 6 || y >= h - 6) return;
    var down = ["PageDown", " ", "ArrowDown", "End"].indexOf(e.key) !== -1;
    var up = ["PageUp", "ArrowUp", "Home"].indexOf(e.key) !== -1;
    if (!down && !up) return;
    e.preventDefault();
    go(down ? h : 0);
  }, { passive: false });
})();
