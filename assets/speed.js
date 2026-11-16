/* Shared speed control. Each player calls PlayerSpeed.wire(mount, apply). */
window.PlayerSpeed = {
  wire: function (mount, apply) {
    var btns = mount.querySelectorAll(".spd-btn");
    if (!btns.length) return;
    Array.prototype.forEach.call(btns, function (b) {
      b.addEventListener("click", function () {
        Array.prototype.forEach.call(btns, function (x) { x.classList.remove("is-on"); });
        b.classList.add("is-on");
        apply(parseFloat(b.getAttribute("data-speed")) || 1);
      });
    });
  }
};
