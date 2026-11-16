/* Animates a queue: enqueue at the rear, dequeue from the front. */
(function () {
  var mount = document.getElementById("queueplayer");
  var src = document.getElementById("queue-data");
  if (!mount || !src) return;

  var spec = JSON.parse(src.textContent);
  var stage = mount.querySelector(".qp-stage");
  var cap = mount.querySelector(".qp-caption");
  var bPlay = mount.querySelector(".qp-play");
  var bStep = mount.querySelector(".qp-step");
  var bReset = mount.querySelector(".qp-reset");
  var i = -1, timer = null;

  function render() {
    stage.innerHTML = "";
    if (i < 0) {
      cap.textContent = "Press Play, or step through one operation at a time.";
      stage.innerHTML = '<span class="qp-empty">(empty)</span>';
      return;
    }
    var st = spec.steps[i];
    if (st.q.length === 0) {
      stage.innerHTML = '<span class="qp-empty">(empty)</span>';
    } else {
      st.q.forEach(function (v, idx) {
        var it = document.createElement("div");
        it.className = "qp-item";
        var b = document.createElement("span");
        b.className = "qp-box" + (idx === st.hi ? " hi" : "");
        b.textContent = v;
        var tag = document.createElement("span");
        tag.className = "qp-tag";
        if (st.q.length === 1) tag.textContent = "front · rear";
        else if (idx === 0) tag.textContent = "front";
        else if (idx === st.q.length - 1) tag.textContent = "rear";
        it.appendChild(b); it.appendChild(tag);
        stage.appendChild(it);
        if (idx < st.q.length - 1) {
          var a = document.createElement("span");
          a.className = "qp-arrow"; a.textContent = "→";
          stage.appendChild(a);
        }
      });
    }
    cap.textContent = st.cap;
  }

  function step() { if (i < spec.steps.length - 1) { i++; render(); return true; } return false; }
  function pause() { clearInterval(timer); timer = null; bPlay.textContent = "Play"; }
  function play() {
    if (timer) return;
    if (i >= spec.steps.length - 1) { i = -1; render(); }
    bPlay.textContent = "Pause";
    timer = setInterval(function () { if (!step()) pause(); }, 1500);
  }

  bPlay.addEventListener("click", function () { timer ? pause() : play(); });
  bStep.addEventListener("click", function () { step(); });
  bReset.addEventListener("click", function () { pause(); i = -1; render(); });
  render();
})();
