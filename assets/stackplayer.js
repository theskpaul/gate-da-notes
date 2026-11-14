/* Animates a stack: push, peek, pop, and underflow. */
(function () {
  var mount = document.getElementById("stackplayer");
  var src = document.getElementById("stack-data");
  if (!mount || !src) return;

  var spec = JSON.parse(src.textContent);
  var stage = mount.querySelector(".stk-stage");
  var cap = mount.querySelector(".stk-caption");
  var bPlay = mount.querySelector(".stk-play");
  var bStep = mount.querySelector(".stk-step");
  var bReset = mount.querySelector(".stk-reset");
  var i = -1, timer = null;

  function render() {
    stage.innerHTML = "";
    if (i < 0) {
      cap.textContent = "Press Play, or step through one operation at a time.";
      stage.innerHTML = '<span class="stk-empty">(empty)</span>';
      return;
    }
    var st = spec.steps[i];
    if (st.s.length === 0) {
      stage.innerHTML = '<span class="stk-empty">(empty)</span>';
    } else {
      st.s.forEach(function (v, idx) {
        var row = document.createElement("div");
        row.className = "stk-box" + (idx === st.s.length - 1 ? " top" : "");
        var lab = document.createElement("span");
        lab.className = "stk-top"; lab.textContent = "top";
        var val = document.createElement("span");
        val.className = "stk-val" + (idx === st.hi ? " hi" : "");
        val.textContent = v;
        row.appendChild(lab); row.appendChild(val);
        stage.appendChild(row);
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
