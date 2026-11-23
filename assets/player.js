/* Animated traversal player: steps through a graph, highlighting the
   current node and everything visited so far. Data-driven via a JSON blob. */
(function () {
  var NS = "http://www.w3.org/2000/svg";

  function el(name, attrs) {
    var n = document.createElementNS(NS, name);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    return n;
  }

  function makePlayer(mount, spec) {
    var W = spec.width, H = spec.height;
    var svg = el("svg", { viewBox: "0 0 " + W + " " + H, class: "gp-svg", role: "img" });
    svg.setAttribute("aria-label", spec.alt || "graph traversal animation");

    var edgeLayer = el("g", {}), nodeLayer = el("g", {});
    svg.appendChild(edgeLayer);
    svg.appendChild(nodeLayer);

    /* directed graphs get arrowheads, trimmed back to the circle edge */
    var arrowId = null;
    if (spec.directed) {
      arrowId = "arw-" + (spec.id || Math.random().toString(36).slice(2, 8));
      var defs = el("defs", {});
      [["", "var(--line-strong)"], ["-on", "var(--accent)"]].forEach(function (pair) {
        var mk = el("marker", { id: arrowId + pair[0], markerWidth: "9", markerHeight: "9",
                                refX: "7", refY: "3.2", orient: "auto",
                                markerUnits: "userSpaceOnUse" });
        mk.appendChild(el("path", { d: "M0,0 L7,3.2 L0,6.4 z", style: "fill:" + pair[1] }));
        defs.appendChild(mk);
      });
      svg.appendChild(defs);
    }

    var nodeEls = {}, edgeEls = {};

    spec.edges.forEach(function (e) {
      var a = e[0], b = e[1];
      var pa = spec.nodes[a], pb = spec.nodes[b];
      var ax = pa[0], ay = pa[1], bx = pb[0], by = pb[1];
      if (arrowId) {
        var dx = bx - ax, dy = by - ay, len = Math.sqrt(dx * dx + dy * dy) || 1;
        var ux = dx / len, uy = dy / len, R = 19;
        ax += ux * R; ay += uy * R; bx -= ux * R; by -= uy * R;
      }
      var ln = el("line", { x1: ax, y1: ay, x2: bx, y2: by, class: "gp-edge" });
      if (arrowId) ln.setAttribute("marker-end", "url(#" + arrowId + ")");
      edgeLayer.appendChild(ln);
      edgeEls[a + "|" + b] = ln;
      if (!spec.directed) edgeEls[b + "|" + a] = ln;
    });

    Object.keys(spec.nodes).forEach(function (id) {
      var p = spec.nodes[id];
      var g = el("g", { class: "gp-node", transform: "translate(" + p[0] + "," + p[1] + ")" });
      g.appendChild(el("circle", { r: 17, class: "gp-circle" }));
      var t = el("text", { class: "gp-label", "text-anchor": "middle", dy: "0.34em" });
      t.textContent = id;
      g.appendChild(t);
      nodeLayer.appendChild(g);
      nodeEls[id] = g;
    });

    var i = -1, timer = null;
    var stage = mount.querySelector(".gp-stage");
    var caption = mount.querySelector(".gp-caption");
    var btnPlay = mount.querySelector(".gp-play");
    var btnStep = mount.querySelector(".gp-step");
    var btnReset = mount.querySelector(".gp-reset");
    var speed = spec.speed || 850;

    function render() {
      var visited = {};
      for (var k = 0; k <= i; k++) visited[spec.steps[k].v] = true;
      var cur = i >= 0 ? spec.steps[i].v : null;

      Object.keys(nodeEls).forEach(function (id) {
        nodeEls[id].classList.toggle("visited", !!visited[id]);
        nodeEls[id].classList.toggle("current", id === cur);
      });
      spec.edges.forEach(function (e) {
        var ln = edgeEls[e[0] + "|" + e[1]];
        if (ln) ln.classList.remove("done");
      });
      /* light only the edges the search actually used to reach each node */
      for (var k = 1; k <= i; k++) {
        var st = spec.steps[k];
        if (st.p) {
          var pe = edgeEls[st.p + "|" + st.v];
          if (pe) pe.classList.add("done");
        }
      }
      if (arrowId) {
        spec.edges.forEach(function (e) {
          var ln = edgeEls[e[0] + "|" + e[1]];
          if (!ln) return;
          ln.setAttribute("marker-end", "url(#" + arrowId +
            (ln.classList.contains("done") ? "-on" : "") + ")");
        });
      }

      caption.textContent = i < 0
        ? "Press Play, or step through one node at a time."
        : spec.steps[i].t;
      mount.setAttribute("data-step", i);
    }

    function step() {
      if (i < spec.steps.length - 1) { i++; render(); return true; }
      return false;
    }
    function pause() { clearInterval(timer); timer = null; btnPlay.textContent = "Play"; }
    function play() {
      if (timer) return;
      if (i >= spec.steps.length - 1) { i = -1; render(); }
      btnPlay.textContent = "Pause";
      timer = setInterval(function () { if (!step()) pause(); }, Math.max(60, speed / mult));
    }
    function reset() { pause(); i = -1; render(); }

    var mult = 1;
    if (window.PlayerSpeed) window.PlayerSpeed.wire(mount, function (m) {
      mult = m;
      if (timer) { clearInterval(timer);
        timer = setInterval(function () { if (!step()) pause(); }, Math.max(60, speed / mult)); }
    });

    btnPlay.addEventListener("click", function () { timer ? pause() : play(); });
    btnStep.addEventListener("click", function () { pause(); step(); });
    btnReset.addEventListener("click", reset);

    stage.appendChild(svg);
    render();
  }

  document.querySelectorAll("[data-graph]").forEach(function (mount) {
    var src = document.getElementById(mount.getAttribute("data-graph"));
    if (!src) return;
    try { makePlayer(mount, JSON.parse(src.textContent)); }
    catch (err) { console.error("graph player:", err); }
  });
})();
