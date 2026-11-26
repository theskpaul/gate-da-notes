/* PYQ tracker — the single source of truth for progress on this site.
 *
 * Progress here measures PRACTICE, not notes. A topic counts as done only
 * when you have SOLVED its previous-year questions (GATE DA 2024-2026).
 * A note existing is not progress. Solving questions is.
 *
 * TO MARK A TOPIC DONE: add its key to that section's `done` array below.
 * The keys are the data-key values on progress.html
 * (e.g. "sec-2-matrices-determinants").
 * Every page — home bar, progress tracker, coverage — reads this one file.
 */
(function () {
  var PYQ = {
    total: 105,
    sections: [
      { id: "sec-1", name: "Probability & Statistics",                 total: 17, done: [] },
      { id: "sec-2", name: "Linear Algebra",                            total: 17, done: [] },
      { id: "sec-3", name: "Calculus & Optimization",                   total:  6, done: [] },
      { id: "sec-4", name: "Programming, Data Structures & Algorithms", total: 16, done: [] },
      { id: "sec-5", name: "Database Management & Warehousing",         total: 17, done: [] },
      { id: "sec-6", name: "Machine Learning",                          total: 20, done: [] },
      { id: "sec-7", name: "Artificial Intelligence",                   total:  8, done: [] },
      { id: "sec-8", name: "General Aptitude",                          total:  4, done: [] }
    ]
  };

  PYQ.count = function () {
    var n = 0;
    for (var i = 0; i < PYQ.sections.length; i++) n += PYQ.sections[i].done.length;
    return n;
  };
  PYQ.byId = function (id) {
    for (var i = 0; i < PYQ.sections.length; i++) if (PYQ.sections[i].id === id) return PYQ.sections[i];
    return null;
  };
  PYQ.isDone = function (key) {
    for (var i = 0; i < PYQ.sections.length; i++) {
      if (PYQ.sections[i].done.indexOf(key) !== -1) return true;
    }
    return false;
  };

  window.PYQ = PYQ;

  function render() {
    /* per-section number + bar + status, wherever a [data-sec] block exists */
    var blocks = document.querySelectorAll("[data-sec]");
    for (var i = 0; i < blocks.length; i++) {
      var sec = PYQ.byId(blocks[i].getAttribute("data-sec"));
      if (!sec) continue;
      var d = sec.done.length, t = sec.total;
      var num = blocks[i].querySelector(".lnum, .cnum, .seccount");
      if (num) {
        if (num.className.indexOf("seccount") !== -1) num.textContent = "\u2014 " + d + " of " + t;
        else num.textContent = d + " / " + t;
      }
      var bar = blocks[i].querySelector(".lbar > div, .cbar");
      if (bar) bar.style.width = (t ? (d / t) * 100 : 0).toFixed(1) + "%";
      var stat = blocks[i].querySelector(".cstat");
      if (stat) {
        stat.textContent = d > 0 ? "Started" : "Not started";
        stat.className = d > 0 ? "pill ok cstat" : "pill cstat";
      }
    }
    /* progress.html topic rows */
    var rows = document.querySelectorAll("tr[data-key]");
    for (var j = 0; j < rows.length; j++) {
      var key = rows[j].getAttribute("data-key");
      var pill = rows[j].querySelector(".pill[data-pyq]");
      if (!pill) continue;
      var done = PYQ.isDone(key);
      pill.textContent = done ? "PYQ done" : "Not done";
      pill.className = done ? "pill ok" : "pill";
      pill.setAttribute("data-pyq", done ? "yes" : "no");
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", render);
  else render();
})();
