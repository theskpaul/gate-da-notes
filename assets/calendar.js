/* Calendar: month grids + exam countdown + note-upload history.
   Everything comes from the #cal-data JSON blob. */
(function () {
  var root = document.getElementById("cal");
  var src = document.getElementById("cal-data");
  if (!root || !src) return;

  var D = JSON.parse(src.textContent);
  var MN = ["January","February","March","April","May","June",
            "July","August","September","October","November","December"];
  var WD = ["M","T","W","T","F","S","S"];

  function ymd(y, m, d) {
    return y + "-" + String(m + 1).padStart(2, "0") + "-" + String(d).padStart(2, "0");
  }
  function parse(s) {
    var p = s.split("-");
    return { y: +p[0], m: +p[1] - 1, d: +p[2] };
  }

  var byDate = {};
  (D.events || []).forEach(function (e) {
    (byDate[e.d] = byDate[e.d] || []).push(e);
  });
  var exam = {};
  (D.exam || []).forEach(function (d) { exam[d] = true; });

  var now = new Date();
  var todayStr = ymd(now.getFullYear(), now.getMonth(), now.getDate());

  /* ---------- countdown ---------- */
  var cd = document.getElementById("countdown");
  if (cd && D.exam && D.exam.length) {
    var first = D.exam.slice().sort()[0];
    var p = parse(first);
    var target = new Date(p.y, p.m, p.d);
    var t0 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var days = Math.round((target - t0) / 86400000);
    cd.innerHTML = days > 0
      ? '<b>' + days + '</b><span>days to the exam window</span>'
      : days === 0
        ? '<b>Today</b><span>the exam window opens</span>'
        : '<b>' + Math.abs(days) + '</b><span>days since the exam window opened</span>';
  }

  /* ---------- month grids ---------- */
  var wrap = document.getElementById("cal-months");
  if (wrap) {
    (D.months || []).forEach(function (ym) {
      var parts = ym.split("-"), y = +parts[0], m = +parts[1] - 1;
      var firstDay = new Date(y, m, 1).getDay();       // 0=Sun
      var offset = (firstDay + 6) % 7;                  // Monday-first
      var total = new Date(y, m + 1, 0).getDate();

      var cells = "";
      for (var b = 0; b < offset; b++) cells += '<span class="cal-pad"></span>';
      for (var d = 1; d <= total; d++) {
        var key = ymd(y, m, d);
        var cls = "cal-day";
        if (key === todayStr) cls += " today";
        if (exam[key]) cls += " exam";
        var evs = byDate[key];
        var dot = evs ? '<i class="cal-dot"></i>' : "";
        var title = evs ? evs.map(function (e) { return e.t; }).join(" · ") : "";
        cells += '<span class="' + cls + '"' + (title ? ' title="' + title.replace(/"/g, "&quot;") + '"' : "") + ">" +
                 d + dot + "</span>";
      }

      wrap.insertAdjacentHTML("beforeend",
        '<div class="cal-month"><h4>' + MN[m] + " " + y + "</h4>" +
        '<div class="cal-grid">' +
        WD.map(function (w) { return '<span class="cal-wd">' + w + "</span>"; }).join("") +
        cells + "</div></div>");
    });
  }

  /* ---------- upload history ---------- */
  var list = document.getElementById("cal-log");
  if (list) {
    var items = (D.events || []).slice().sort(function (a, b) { return a.d < b.d ? 1 : -1; });
    list.innerHTML = items.map(function (e) {
      var p = parse(e.d);
      var label = e.t;
      if (e.h) label = '<a href="' + e.h + '">' + e.t + "</a>";
      return '<li><time datetime="' + e.d + '">' + p.d + " " + MN[p.m].slice(0, 3) + " " + p.y +
             "</time><span>" + label + "</span></li>";
    }).join("");
  }
})();
