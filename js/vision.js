(function () {
  var board = document.getElementById("vb");
  var road = document.getElementById("vb-road");
  if (!board || !road) return;
  var count = document.getElementById("vb-count");
  var pills = Array.prototype.slice.call(board.querySelectorAll(".uc2__y"));
  var total = pills.length;
  var calm = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var lanes = {};
  [["FY27", "Prove it and build the core"], ["FY28", "Scale it and harden it"], ["FY29", "Operate on it"], ["None", "Raised, year not set"]].forEach(function (y) {
    var col = document.createElement("div");
    col.className = "vb-road__col";
    col.setAttribute("data-y", y[0]);
    var h = document.createElement("div");
    h.className = "vb-road__h";
    h.textContent = y[0] === "None" ? "No year yet" : y[0];
    var sm = document.createElement("small");
    sm.textContent = y[1];
    h.appendChild(sm);
    var c = document.createElement("div");
    c.className = "vb-road__c";
    col.appendChild(h);
    col.appendChild(c);
    road.appendChild(col);
    lanes[y[0]] = c;
  });
  var chips = pills.map(function (p) {
    var chip = document.createElement("span");
    chip.className = "vb-road__chip";
    chip.textContent = p.closest(".uc2").querySelector(".uc2__t").textContent;
    lanes[p.getAttribute("data-from")].appendChild(chip);
    return { chip: chip, from: p.getAttribute("data-from"), pill: p };
  });
  function paint(p, y) {
    p.setAttribute("data-now", y);
    p.textContent = y === "None" ? "No year" : y;
  }
  function words(goal) {
    var inFY27 = chips.filter(function (c) { return c.from === "FY27"; }).length;
    if (count) count.textContent = goal
      ? "The goal: all " + total + " use cases in FY27."
      : "Your plan: 3 years, with " + inFY27 + " of " + total + " use cases in FY27.";
  }
  function set(state) {
    if (board.getAttribute("data-state") === state) return;
    var goal = state === "goal";
    var first = chips.map(function (c) { return c.chip.getBoundingClientRect(); });
    board.setAttribute("data-state", state);
    road.setAttribute("data-state", state);
    document.querySelectorAll("[data-vb]").forEach(function (b) { b.classList.toggle("is-on", b.getAttribute("data-vb") === state); });
    chips.forEach(function (c) {
      lanes[goal ? "FY27" : c.from].appendChild(c.chip);
      paint(c.pill, goal ? "FY27" : c.from);
    });
    words(goal);
    if (calm || !chips[0].chip.animate) return;
    requestAnimationFrame(function () {
      chips.forEach(function (c, i) {
        var last = c.chip.getBoundingClientRect();
        if (c.from === "FY27") return;
        c.chip.animate([
          { transform: "translate(" + (first[i].left - last.left) + "px," + (first[i].top - last.top) + "px)" },
          { transform: "none" }
        ], { duration: 1100, delay: i * 45, easing: "cubic-bezier(.2,.7,.2,1)", fill: "backwards" });
      });
    });
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-vb]");
    if (b) { played = true; set(b.getAttribute("data-vb")); }
  });
  var played = false;
  function maybePlay() {
    if (location.hash !== "#vision") return;
    set("plan");
    if (played) return;
    played = true;
    setTimeout(function () { if (location.hash === "#vision") set("goal"); }, 3000);
  }
  chips.forEach(function (c) { paint(c.pill, c.from); });
  words(false);
  window.addEventListener("hashchange", function () { played = false; maybePlay(); });
  maybePlay();
})();
