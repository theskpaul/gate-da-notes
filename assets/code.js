/* Turns every <pre><code> into a highlighted block with a copy button and line numbers.
   Python only — that is the only language on this site. */
(function () {
  var RE = new RegExp([
    "(#[^\\n]*)",                                             // 1 comment
    "(\"\"\"[\\s\\S]*?\"\"\"|'''[\\s\\S]*?'''|\"(?:\\\\.|[^\"\\\\\\n])*\"|'(?:\\\\.|[^'\\\\\\n])*')", // 2 string
    "(@[A-Za-z_]\\w*)",                                       // 3 decorator
    "(\\b(?:def|class)\\s+[A-Za-z_]\\w*)",                    // 4 def / class name
    "(\\b\\d+(?:\\.\\d+)?\\b)",                               // 5 number
    "(\\b(?:def|class|return|if|elif|else|while|for|in|not|and|or|is|None|True|False|import|from|as|pass|break|continue|raise|try|except|finally|with|lambda|yield|global|nonlocal|assert|del)\\b)", // 6 keyword
    "(\\b(?:self|cls|len|list|dict|int|str|bool|float|print|range|super|isinstance|ValueError|TypeError|IndexError|KeyError|Exception|enumerate|sorted|zip|map|filter|set|tuple)\\b)" // 7 builtin
  ].join("|"), "g");

  var CLS = { 1: "com", 2: "str", 3: "dec", 4: "defn", 5: "num", 6: "kw", 7: "bi" };

  function esc(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  /* split the source into lines of tokens, so a multi-line docstring keeps its colour
     across every line it covers */
  function tokenizeLines(src) {
    var lines = [[]], last = 0, m;
    RE.lastIndex = 0;
    function push(text, cls) {
      var parts = text.split("\n");
      for (var i = 0; i < parts.length; i++) {
        if (i > 0) lines.push([]);
        if (parts[i] !== "") lines[lines.length - 1].push({ t: parts[i], c: cls });
      }
    }
    while ((m = RE.exec(src)) !== null) {
      push(src.slice(last, m.index), null);
      var cls = null;
      for (var g = 1; g <= 7; g++) if (m[g] !== undefined) { cls = CLS[g]; break; }
      push(m[0], cls);
      last = m.index + m[0].length;
    }
    push(src.slice(last), null);
    return lines;
  }

  function copyText(text, btn) {
    function done(ok) {
      btn.textContent = ok ? "Copied" : "Ctrl+C";
      btn.classList.add("ok");
      setTimeout(function () { btn.textContent = "Copy"; btn.classList.remove("ok"); }, 1600);
    }
    function fallback() {
      var ta = document.createElement("textarea");
      ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
      document.body.removeChild(ta);
      done(ok);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { done(true); }, fallback);
    } else { fallback(); }
  }

  function build(pre) {
    var code = pre.querySelector("code");
    if (!code || pre.dataset.done) return;
    pre.dataset.done = "1";

    var src = code.textContent;
    var lines = tokenizeLines(src);

    var block = document.createElement("div");
    block.className = "codeblock";

    var bar = document.createElement("div");
    bar.className = "codebar";
    bar.innerHTML = '<span class="codelang">Python</span>';

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "copybtn";
    btn.textContent = "Copy";
    btn.setAttribute("aria-label", "Copy this code");
    btn.addEventListener("click", function () { copyText(src, btn); });
    bar.appendChild(btn);

    var wrap = document.createElement("div");
    wrap.className = "codewrap";

    var nums = document.createElement("div");
    nums.className = "lnums";
    nums.setAttribute("aria-hidden", "true");
    nums.textContent = lines.map(function (_, i) { return i + 1; }).join("\n");

    var newPre = document.createElement("pre");
    newPre.className = "codepre";
    var newCode = document.createElement("code");
    newCode.innerHTML = lines.map(function (parts) {
      return parts.map(function (p) {
        return p.c ? '<span class="tok-' + p.c + '">' + esc(p.t) + "</span>" : esc(p.t);
      }).join("");
    }).join("\n");

    newPre.appendChild(newCode);
    wrap.appendChild(nums);
    wrap.appendChild(newPre);
    block.appendChild(bar);
    block.appendChild(wrap);
    pre.parentNode.replaceChild(block, pre);
  }

  function run() {
    Array.prototype.forEach.call(document.querySelectorAll("pre > code"), function (c) {
      if (c.parentNode.tagName === "PRE") build(c.parentNode);
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run);
  else run();
})();
