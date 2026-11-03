window.HEARD = [
  { n: "1", area: "Reduce blocked orders", tag: "Biggest priority", big: [["$", 50, "K"], " to ", ["$", 250, "K"]], unit: "a day held in blocked orders", what: "Every block is researched by hand across teams. Stop them at the source.", go: "real-blocked-orders", see: "Blocked orders" },
  { n: "2", area: "Right the first time", pre: "Up to", big: [["", 2, " weeks"]], unit: "to set up a customer", what: "Items go unsellable when data gets missed, and price gaps surface only at the block.", go: "real-item-setup-readiness", see: "Item Setup Readiness" },
  { n: "3", area: "From flat files to APIs", big: [["", 48, " hours"]], unit: "from new product to sellable", what: "The online store integration is due next September.", go: "real-online-store", see: "Online store integration" },
  { n: "4", area: "Inventory and working capital", pre: "About", big: [["", 40, "%"]], unit: "forecast accuracy", what: "Stock held for one large order can't sell in the meantime." },
  { n: "5", area: "Simplify the inherited platform", pre: "About", big: [["", 1200, ""]], unit: "extensions", what: "They burden every upgrade. Replace the third-party AR tool with native LN.", go: "real-cash-application", see: "Cash application" },
  { n: "6", area: "Absorb Infor releases safely", pre: "Over", big: [["", 500, ""]], unit: "line items in the 2026.10 release", what: "Incomplete test cases leave audit gaps." },
  { n: "7", area: "Product data and retailer content", pre: "About", big: [["", 800, ""]], unit: "product attributes", what: "Mapped to each retailer by hand. Perhaps half should stay.", go: "proto-retailer", see: "Retailer content" }
];

(function renderHeard() {
  var host = document.getElementById("heard-days");
  if (!host) return;
  function fmt(v) { return String(v).replace(/\B(?=(\d{3})+$)/g, ","); }
  function mk(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  var nums = [];
  window.HEARD.forEach(function (g, i) {
    var c = mk(g.go ? "a" : "div", "hg__c fx" + (i === 0 ? " hg__c--hero" : ""));
    c.style.setProperty("--i", i);
    if (g.go) { c.setAttribute("data-go", g.go); c.setAttribute("href", "#" + g.go); }
    var b = mk("i", "fx__b"); b.setAttribute("aria-hidden", "true"); c.appendChild(b);
    var top = mk("div", "hg__top");
    top.appendChild(mk("span", "hg__n", g.n));
    top.appendChild(mk("span", "hg__area", g.area));
    if (g.tag) top.appendChild(mk("span", "hg__tag", g.tag));
    c.appendChild(top);
    var big = mk("div", "hg__big");
    if (g.pre) big.appendChild(mk("small", "", g.pre));
    g.big.forEach(function (p) {
      if (typeof p === "string") { big.appendChild(mk("small", "", p)); return; }
      var s = mk("b", "", p[0] + fmt(p[1]) + p[2]);
      nums.push({ el: s, pre: p[0], to: p[1], suf: p[2] });
      big.appendChild(s);
    });
    c.appendChild(big);
    c.appendChild(mk("div", "hg__unit", g.unit));
    c.appendChild(mk("p", "hg__what", g.what));
    if (g.go) c.appendChild(mk("span", "hg__see", g.see));
    host.appendChild(c);
  });
  var calm = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function count() {
    if (calm) return;
    var t0 = null, dur = 1300;
    function step(t) {
      if (t0 === null) t0 = t;
      var k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      nums.forEach(function (x) { x.el.textContent = x.pre + fmt(Math.round(x.to * e)) + x.suf; });
      if (k < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  function maybe() { if (location.hash === "#heard") count(); }
  window.addEventListener("hashchange", maybe);
  maybe();
})();
