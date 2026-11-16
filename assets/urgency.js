/* Urgency layer: top banner, live counters, pace-vs-needed, next-up.
   Constants live here — update COVERED when a new topic gets a note. */
(function () {
  /* defaults; any [data-exam]/[data-total]/[data-covered] on the page overrides them */
  var cfg = document.querySelector("[data-exam]");
  var EXAM = (cfg && cfg.dataset.exam) || "2027-02-06";
  var START = (cfg && cfg.dataset.start) || "2026-10-23";
  var TOTAL = (cfg && parseInt(cfg.dataset.total, 10)) || 105;
  var COVERED = (cfg && parseInt(cfg.dataset.covered, 10)) || 5;
  /* Syllabus finish line, leaving a revision buffer before the exam window.
     Exam opens 6 Feb 2027; finish by 9 Jan 2027 = 28-day buffer. */
  var FINISH = (cfg && cfg.dataset.finish) || "2027-01-09";

  var exam = new Date(EXAM + "T00:00:00");
  var start = new Date(START + "T00:00:00");
  var now = new Date();
  var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  var DAY = 86400000;
  var finish = new Date(FINISH + "T00:00:00+05:30");
  var days = Math.max(0, Math.round((exam - today) / DAY));
  var left = Math.max(0, TOTAL - COVERED);
  /* pace is measured to the finish line, not the exam — the gap is the buffer */
  var finishDays = Math.max(0, Math.round((finish - today) / DAY));
  var weeks = finishDays / 7;
  var perWeek = weeks > 0 ? left / weeks : 0;
  var perDay = finishDays > 0 ? left / finishDays : 0;
  var bufferDays = Math.max(0, days - finishDays);

  var elapsed = Math.max(1, Math.round((today - start) / DAY));
  var spanDays = Math.max(1, Math.round((finish - start) / DAY));   /* plan to the finish line */
  var expected = TOTAL * (elapsed / spanDays);
  var behind = Math.max(0, Math.round(expected - COVERED));
  var actualPerWeek = COVERED / (elapsed / 7);

  /* gradual colour escalation — nothing is red at 84 days */
  var tier = days <= 7 ? "7" : days <= 14 ? "14" : days <= 30 ? "30" : days <= 60 ? "60" : "";
  if (tier) document.documentElement.setAttribute("data-tier", tier);

  function out(k, v) {
    var n = document.querySelectorAll('[data-out="' + k + '"]');
    for (var i = 0; i < n.length; i++) n[i].textContent = v;
  }

  var MN = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  var fp = FINISH.split("-");
  var finishLabel = parseInt(fp[2], 10) + " " + MN[parseInt(fp[1], 10) - 1];
  out("finish", finishLabel);
  out("finishdays", finishDays);
  out("buffer", bufferDays);

  /* ---- top banner, on every page ---- */
  var TARGET = new Date("2027-02-06T00:00:00+05:30");   /* IST, exam window opens */
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var suppress = document.body.hasAttribute("data-nobanner");
  var banner = null, clockEl = null;
  if (!suppress) {
  banner = document.createElement("div");
  banner.className = "ubar";
  banner.setAttribute("role", "status");
  banner.innerHTML =
    '<span><b class="clock" data-out="clock">—</b> left</span>' +
    '<span class="u">·</span>' +
    "<span><b>" + left + "</b> topics untouched</span>" +
    '<span class="u">·</span>' +
    "<span>finish by <b>" + finishLabel + "</b></span>" +
    '<span class="u">·</span>' +
    "<span>need <b>" + perWeek.toFixed(1) + "</b>/wk (<b>" + perDay.toFixed(1) + "</b>/day)</span>";
  document.body.insertBefore(banner, document.body.firstChild);
  clockEl = banner.querySelector(".clock");
  }

  /* ---- the ticking clock ---- */
  function pad2(n) { return n < 10 ? "0" + n : "" + n; }
  function tick() {
    var diff = TARGET - new Date();
    if (diff < 0) diff = 0;
    var d = Math.floor(diff / DAY);
    var h = Math.floor(diff / 3600000) % 24;
    var m = Math.floor(diff / 60000) % 60;
    var sec = Math.floor(diff / 1000) % 60;
    var txt = d + "d " + pad2(h) + ":" + pad2(m) + (reduce ? "" : ":" + pad2(sec));
    if (clockEl) {
      clockEl.textContent = txt;
      clockEl.setAttribute("datetime", TARGET.toISOString());
    }
    out("clock", txt);
  }
  tick();
  setInterval(tick, reduce ? 30000 : 1000);

  /* keep the nav directly under the banner, and make anchor jumps clear both */
  function syncOffsets() {
    var nav = document.querySelector(".nav");
    if (!nav) return;
    var barH = (banner && !banner.classList.contains("ubar-hidden")) ? banner.offsetHeight : 0;
    nav.style.top = barH + "px";
    var off = barH + nav.offsetHeight + 12;
    ["#below", "#index"].forEach(function (sel) {
      var el = document.querySelector(sel);
      if (el) el.style.scrollMarginTop = off + "px";
    });
  }
  window.__syncOffsets = syncOffsets;
  syncOffsets();
  window.addEventListener("resize", syncOffsets);

  out("days", days);
  out("left", left);
  out("weeks", Math.round(weeks));
  out("pace", perWeek.toFixed(1));
  out("perday", perDay.toFixed(1));
  out("covered", COVERED);
  out("total", TOTAL);
  var bar = document.querySelector('[data-out="bar"]');
  if (bar) bar.style.width = ((COVERED / TOTAL) * 100).toFixed(2) + "%";

  /* ---- momentum panel (index only) ---- */
  var m = document.getElementById("momentum");
  if (m) {
    out("actual", actualPerWeek.toFixed(1));
    out("behind", behind);
    out("elapsed", elapsed);
    var st = document.getElementById("pace-state");
    if (st) {
      st.textContent = behind > 0 ? "behind by " + behind + " topics" : "on track";
      st.className = behind > 0 ? "pill" : "pill ok";
    }
  }

  /* ---- next-up: the biggest untouched section ---- */
  var nu = document.getElementById("next-up");
  if (nu && nu.dataset.sections) {
    try {
      var secs = JSON.parse(nu.dataset.sections);
      var best = null;
      secs.forEach(function (s) { if (s.left > 0 && (!best || s.left > best.left)) best = s; });
      if (best) {
        nu.querySelector("[data-out=\"nu-name\"]").textContent = best.name;
        nu.querySelector("[data-out=\"nu-count\"]").textContent = best.left + " of " + best.total;
        var a = nu.querySelector("a");
        if (a) a.href = "coverage.html";
      }
    } catch (e) { /* leave the static fallback in place */ }
  }
})();
