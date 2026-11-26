/* PYQ tracker — the single source of truth for progress on this site.
 *
 * Progress here measures PRACTICE, not notes. A topic counts as done only
 * when you have SOLVED its previous-year questions (GATE DA 2024-2026).
 * A note existing is not progress. Solving questions is.
 *
 * TO MARK A TOPIC DONE: add its key to that section's `done` array below.
 * The keys are the data-key values on progress.html
 * (e.g. "sec-2-matrices").
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

  /* per-section number + bar + status, wherever a [data-sec] block exists */
  function renderSections() {
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
  }

  /* progress.html topic rows */
  function renderRows() {
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

  /* optional "show only what's left" filter on progress.html */
  function applyFilter() {
    var table = document.querySelector("table");
    if (!table || !table.tBodies.length) return;
    var cb = document.getElementById("only-left");
    var only = !!(cb && cb.checked);
    var rows = table.tBodies[0].rows;
    var header = null, group = [];
    function flush() {
      if (!header) return;
      var vis = 0;
      for (var k = 0; k < group.length; k++) if (group[k].style.display !== "none") vis++;
      header.style.display = (only && vis === 0) ? "none" : "";
    }
    for (var i = 0; i < rows.length; i++) {
      var r = rows[i];
      if (r.hasAttribute("data-sec")) {
        flush(); header = r; group = [];
      } else if (r.hasAttribute("data-key")) {
        var done = r.querySelector('.pill[data-pyq="yes"]');
        r.style.display = (only && done) ? "none" : "";
        group.push(r);
      }
    }
    flush();
    var note = document.getElementById("only-left-count");
    if (note) {
      var left = PYQ.total - PYQ.count();
      note.textContent = only ? ("Showing " + left + " of " + PYQ.total + " still to do") : "";
    }
  }

  function render() {
    renderSections();
    renderRows();
    var cb = document.getElementById("only-left");
    if (cb && !cb.__wired) { cb.__wired = true; cb.addEventListener("change", applyFilter); }
    applyFilter();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", render);
  else render();
})();
