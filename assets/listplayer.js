/* Animates a singly linked list being built and torn down, one operation at a time. */
(function () {
  var mount = document.getElementById("listplayer");
  var src = document.getElementById("list-data");
  if (!mount || !src) return;

  var spec = JSON.parse(src.textContent);
  var stage = mount.querySelector(".lp-stage");
  var cap = mount.querySelector(".lp-caption");
  var bPlay = mount.querySelector(".lp-play");
  var bStep = mount.querySelector(".lp-step");
  var bReset = mount.querySelector(".lp-reset");
  var i = -1, timer = null;

  function render() {
    stage.innerHTML = "";
    if (i < 0) {
      cap.textContent = "Press Play, or step through one operation at a time.";
      stage.innerHTML = '<span class="lp-none">None</span>';
      return;
    }
    var st = spec.steps[i];

    var head = document.createElement("span");
    head.className = "lp-head";
    head.textContent = "head";
    if (st.list.length) stage.appendChild(head);

    st.list.forEach(function (v, idx) {
      var n = document.createElement("span");
      n.className = "lp-node" + (idx === st.hi ? " lp-hi" : "");
      n.textContent = v;
      stage.appendChild(n);
      var a = document.createElement("span");
      a.className = "lp-arrow";
      a.textContent = "→";
      stage.appendChild(a);
    });

    var t = document.createElement("span");
    t.className = "lp-none";
    t.textContent = "None";
    stage.appendChild(t);

    cap.textContent = st.cap;
  }

  function step() { if (i < spec.steps.length - 1) { i++; render(); return true; } return false; }
  function pause() { clearInterval(timer); timer = null; bPlay.textContent = "Play"; }
  function play() {
    if (timer) return;
    if (i >= spec.steps.length - 1) { i = -1; render(); }
    bPlay.textContent = "Pause";
    timer = setInterval(function () { if (!step()) pause(); }, Math.max(60, 1500 / mult));
  }

  var mult = 1;
  if (window.PlayerSpeed) window.PlayerSpeed.wire(mount, function (m) {
    mult = m;
    if (timer) { clearInterval(timer);
      timer = setInterval(function () { if (!step()) pause(); }, Math.max(60, 1500 / mult)); }
  });

  bPlay.addEventListener("click", function () { timer ? pause() : play(); });
  bStep.addEventListener("click", function () { pause(); step(); });
  bReset.addEventListener("click", function () { pause(); i = -1; render(); });
  render();
})();
