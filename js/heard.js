window.HEARD_COLUMNS = [
  { p: "P1", name: "Order to Cash", note: "On your AI Adoption Hub roadmap" },
  { p: "P2", name: "Idea to Product" }
];

window.HEARD = [
  { p: "P2", area: "Item setup", what: "Many people touch one item, and data gets missed.",
    from: "Hub" },
  { p: "P2", area: "Integrations", what: "Flat-file schedules hold new products back.",
    from: "Hub" },
  { p: "P2", area: "Your environment", what: "Settings made for another company still sit in LN.",
    from: "Hub" },

  { p: "P1", area: "Blocked orders", what: "Orders block daily on margin, cross references, pricing and EDI.",
    from: "Hub" },
  { p: "P1", area: "Customer setup", what: "A new account takes days, with approvals in a separate tool.",
    from: "Hub" },
  { p: "P1", area: "Account changes", what: "A simple update goes through a long approval chain.",
    from: "Hub" },
  { p: "P1", area: "Pricing", what: "Customer prices go unloaded, so orders wait on a manual approval.",
    from: "Hub" }
];

(function renderHeard() {
  var host = document.getElementById("heard-days");
  if (!host) return;
  var esc = function (s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); };
  host.innerHTML = window.HEARD_COLUMNS.map(function (col, ci) {
    var cards = window.HEARD.filter(function (h) { return h.p === col.p; }).map(function (h) {
      return '<div class="moment fx"><i class="fx__b" aria-hidden="true"></i>' +
        '<div class="moment__area">' + esc(h.area) + (h.from && h.from !== "Hub" ? ' <span class="moment__from">' + esc(h.from) + '</span>' : "") + '</div>' +
        '<div class="moment__what">' + esc(h.what) + '</div></div>';
    }).join("");
    return '<div class="rv' + (ci ? " rv-d2" : "") + '"><div class="day__head"><span class="day__badge' + (col.p === "P2" ? " day__badge--p2" : "") + '">' + col.p + '</span><span class="day__date">' + esc(col.name) + '</span>' + (col.note ? '<span class="day__note">' + esc(col.note) + '</span>' : '') + '</div><div class="moments">' + cards + '</div></div>';
  }).join("");
})();
