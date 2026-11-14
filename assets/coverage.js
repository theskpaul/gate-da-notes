/* Fills in the live urgency numbers: days to the exam window, topics left,
   and the pace needed to finish. Reads its inputs from any [data-exam] element. */
(function () {
  var src = document.querySelector("[data-exam]");
  if (!src) return;

  var exam = new Date(src.dataset.exam + "T00:00:00");
  var now = new Date();
  var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  var days = Math.max(0, Math.round((exam - today) / 86400000));

  var total = parseInt(src.dataset.total, 10) || 0;
  var covered = parseInt(src.dataset.covered, 10) || 0;
  var left = Math.max(0, total - covered);
  var weeks = days / 7;
  var pace = weeks > 0 ? left / weeks : 0;

  function out(k, v) {
    var nodes = document.querySelectorAll('[data-out="' + k + '"]');
    for (var i = 0; i < nodes.length; i++) nodes[i].textContent = v;
  }
  out("days", days);
  out("left", left);
  out("weeks", Math.round(weeks));
  out("pace", pace.toFixed(1));
  out("covered", covered);
  out("total", total);

  var bar = document.querySelector('[data-out="bar"]');
  if (bar) bar.style.width = (total ? (covered / total) * 100 : 0) + "%";
})();
