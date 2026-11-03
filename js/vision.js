(function () {
  var V = window.VISION;
  var road = document.getElementById("vb-road");
  if (!road) return;
  function mk(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
  function link(a, go) { a.setAttribute("data-go", go); a.setAttribute("href", "#" + go); }
  var tr = document.getElementById("vb-today-row");
  V.today.forEach(function (x, i) {
    var a = mk("a", "vb-today__c", x.t);
    a.style.setProperty("--i", i);
    link(a, x.go);
    tr.appendChild(a);
  });
  var lanes = {}, heads = {};
  V.lanes.forEach(function (l) {
    var col = mk("div", "vb-road__col");
    col.setAttribute("data-y", l.k);
    var h = mk("div", "vb-road__h", l.h);
    var c = mk("div", "vb-road__c");
    col.appendChild(h);
    col.appendChild(c);
    if (l.none) c.appendChild(mk("span", "vb-road__none", l.none));
    road.appendChild(col);
    lanes[l.k] = c;
    heads[l.k] = h;
  });
  var chips = V.chips.map(function (x) {
    var a = mk("a", "vb-road__chip" + (x.road ? "" : " vb-road__chip--out"));
    link(a, x.go);
    a.appendChild(mk("b", "", x.t));
    if (x.road) a.appendChild(mk("small", "vb-road__r", x.road));
    a.appendChild(mk("em", "vb-road__ph", x.tag));
    lanes[x.lane].appendChild(a);
    return { el: a, lane: x.lane };
  });
  var words = document.getElementById("vb-count");
  var calm = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function say(goal) {
    if (words) words.textContent = goal ? "The goal: all of it in FY27." : "Your roadmap, phase by phase.";
    heads.p1.textContent = goal ? "The goal: FY27" : "Phase 1";
  }
  function set(state) {
    if (road.getAttribute("data-state") === state) return;
    var goal = state === "goal";
    var first = chips.map(function (c) { return c.el.getBoundingClientRect(); });
    road.setAttribute("data-state", state);
    document.querySelectorAll("[data-vb]").forEach(function (b) { b.classList.toggle("is-on", b.getAttribute("data-vb") === state); });
    chips.forEach(function (c) { lanes[goal ? "p1" : c.lane].appendChild(c.el); });
    say(goal);
    if (calm || !chips[0].el.animate) return;
    requestAnimationFrame(function () {
      chips.forEach(function (c, i) {
        var last = c.el.getBoundingClientRect();
        c.el.animate([
          { transform: "translate(" + (first[i].left - last.left) + "px," + (first[i].top - last.top) + "px)" },
          { transform: "none" }
        ], { duration: 1000, delay: i * 45, easing: "cubic-bezier(.2,.7,.2,1)", fill: "backwards" });
      });
    });
  }
  var played = false, timer = null;
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-vb]");
    if (b) { played = true; clearTimeout(timer); set(b.getAttribute("data-vb")); }
  });
  function maybePlay() {
    clearTimeout(timer);
    if (location.hash !== "#vision") return;
    set("plan");
    if (played) return;
    played = true;
    timer = setTimeout(function () { if (location.hash === "#vision") set("goal"); }, 3500);
  }
  say(false);
  window.addEventListener("hashchange", function () { played = false; maybePlay(); });
  maybePlay();
})();
