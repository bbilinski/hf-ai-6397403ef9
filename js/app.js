(function () {
  "use strict";

  var pages = document.querySelectorAll(".page");
  var main = document.querySelector(".main");
  var nav = document.querySelector(".nav");

  function show(id) {
    var target = document.getElementById("page-" + id) ? id : "home";
    pages.forEach(function (p) {
      var on = p.id === "page-" + target;
      p.classList.toggle("is-active", on);
      p.querySelectorAll("video").forEach(function (v) {
        if (!on) { v.pause(); return; }
        if (v.classList.contains("once")) {
          if (v.getAttribute("data-played")) return;
          v.defaultPlaybackRate = 0.75; v.playbackRate = 0.75;
        }
        var pr = v.play(); if (pr && pr.catch) pr.catch(function () {});
      });
    });

    document.querySelectorAll("[data-go]").forEach(function (el) {
      if (!el.classList.contains("nav__item") && !el.classList.contains("nav__child")) return;
      var go = el.getAttribute("data-go");
      var grp = el.classList.contains("nav__item") ? el.closest(".nav__group") : null;
      var active = go === target || !!(grp && grp.querySelector('.nav__child[data-go="' + target + '"]'));
      el.classList.toggle("is-active", active);
    });
    document.querySelectorAll(".nav__group").forEach(function (g) {
      if (g.querySelector('[data-go="' + target + '"]')) g.classList.add("is-open");
    });

    main.scrollTop = 0;
    reveal(document.getElementById("page-" + target));
  }

  function route() { show((location.hash || "#home").slice(1)); }

  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-toggle]");
    if (t && e.target.closest(".nav__chev")) { t.closest(".nav__group").classList.toggle("is-open"); return; }
    var el = e.target.closest("[data-go]");
    if (!el) return;
    e.preventDefault();
    var id = el.getAttribute("data-go");
    if (location.hash === "#" + id) route(); else location.hash = id;
  });

  var toggle = document.getElementById("nav-toggle");
  if (toggle) toggle.addEventListener("click", function () { nav.classList.toggle("is-collapsed"); });

  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { root: main, threshold: 0.12 }) : null;

  function reveal(page) {
    if (!page) return;
    page.querySelectorAll(".rv").forEach(function (el) {
      el.classList.remove("in");
      if (io) { io.observe(el); } else { el.classList.add("in"); }
    });
  }

  var urls = window.DEMO_URLS || {};
  var target = window.DEMO_TARGET || "_top";
  document.querySelectorAll("[data-demo]").forEach(function (a) {
    var key = a.getAttribute("data-demo");
    var url = urls[key];
    if (url && !/^REPLACE/.test(url)) {
      a.setAttribute("href", url);
      a.setAttribute("target", target);
      a.setAttribute("rel", "noopener");
    } else {
      a.classList.add("is-unset");
      a.setAttribute("title", "Not linked yet.");
      a.addEventListener("click", function (e) { e.preventDefault(); toast("Not linked yet."); });
    }
  });

  var purls = window.PROTO_URLS || {};
  document.querySelectorAll("[data-proto]").forEach(function (a) {
    var key = a.getAttribute("data-proto"), url = purls[key];
    if (url && !/^REPLACE/.test(url)) {
      a.setAttribute("href", url);
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noopener");
    } else {
      a.classList.add("is-unset");
      a.addEventListener("click", function (e) { e.preventDefault(); toast("Not linked yet."); });
    }
  });

  document.querySelectorAll("[data-status]").forEach(function (el) {
    if (el.getAttribute("data-status") === "npd") el.textContent = window.NPD_STATUS || "";
  });

  function closeViewers() {
    document.querySelectorAll(".viewer").forEach(function (v) {
      var f = v.querySelector("iframe");
      if (f.getAttribute("src")) f.removeAttribute("src");
      if (f.contentWindow && !v.hidden) f.contentWindow.location.replace("about:blank");
      v.hidden = true;
    });
  }
  document.addEventListener("click", function (e) {
    var see = e.target.closest("[data-see]");
    if (see) {
      var v = see.closest(".page").querySelector(".viewer");
      var f = v.querySelector("iframe");
      var src = (window.LOCAL_PROTOS || {})[see.getAttribute("data-see")];
      if (!src) { toast("Not linked yet."); return; }
      if (!f.getAttribute("src")) f.setAttribute("src", src);
      v.hidden = false;
      v.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (e.target.closest("[data-see-close]")) closeViewers();
  });
  window.addEventListener("hashchange", closeViewers);

  function toast(msg) {
    var t = document.querySelector(".toast");
    if (!t) { t = document.createElement("div"); t.className = "toast"; t.setAttribute("role", "status"); document.body.appendChild(t); }
    t.textContent = msg; t.classList.add("is-on");
    clearTimeout(toast._t); toast._t = setTimeout(function () { t.classList.remove("is-on"); }, 3200);
  }

  var lb = document.getElementById("lightbox");
  var lastShot = null;
  function closeLb() { if (!lb || lb.hidden) return; lb.hidden = true; if (lastShot) lastShot.focus(); }
  function showShot(b) {
    lastShot = b;
    var img = lb.querySelector("img");
    img.classList.remove("is-actual");
    lb.querySelector(".lightbox__stage").scrollTop = 0;
    img.src = b.getAttribute("data-full");
    img.alt = b.querySelector("img").alt;
    lb.querySelector(".lightbox__cap").textContent = b.querySelector(".shot__cap").textContent;
    lb.hidden = false;
  }
  function stepShot(d) {
    var all = Array.prototype.slice.call(document.querySelectorAll(".page.is-active .shot"));
    if (all.length) showShot(all[(all.indexOf(lastShot) + d + all.length) % all.length]);
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest(".shot");
    if (b && lb) { showShot(b); lb.querySelector(".lightbox__x").focus(); return; }
    if (!lb || lb.hidden) return;
    if (e.target.closest(".lightbox__x")) closeLb();
    else if (e.target.closest(".lightbox__prev")) stepShot(-1);
    else if (e.target.closest(".lightbox__next")) stepShot(1);
    else if (e.target.closest(".lightbox__stage img")) e.target.classList.toggle("is-actual");
    else if (e.target.classList.contains("lightbox__stage")) closeLb();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeLb();
    if (lb && !lb.hidden && e.key === "ArrowLeft") stepShot(-1);
    if (lb && !lb.hidden && e.key === "ArrowRight") stepShot(1);
  });
  window.addEventListener("hashchange", closeLb);

  function setPhase(hp, open) {
    hp.classList.toggle("is-open", open);
    var b = hp.querySelector(".hp__head"); if (b) b.setAttribute("aria-expanded", open ? "true" : "false");
  }
  document.addEventListener("click", function (e) {
    var h = e.target.closest(".hp__head");
    if (h) { var hp = h.closest(".hp"); setPhase(hp, !hp.classList.contains("is-open")); return; }
    var o = e.target.closest("[data-hub]");
    if (o) {
      e.preventDefault();
      var ids = o.getAttribute("data-hub").split(" "), first = null;
      ids.forEach(function (id) {
        var c = document.getElementById(id); if (!c) return;
        var hp0 = c.closest(".hp"); if (hp0) setPhase(hp0, true);
        var mo = c.closest(".morph"); if (mo) mo.classList.add("m-pick", "m-done");
        if (c.closest(".rest") && mo) mo.classList.add("r-open");
        c.classList.remove("is-flash"); void c.offsetWidth; c.classList.add("is-flash");
        if (!first) first = c;
      });
      if (first) setTimeout(function () { first.scrollIntoView({ behavior: "smooth", block: "center" }); }, 420);
    }
  });

  document.querySelectorAll("video.once").forEach(function (v) {
    var wrap = v.closest(".hubvid"), btn = wrap ? wrap.querySelector(".replay") : null;
    v.addEventListener("ended", function () { v.setAttribute("data-played", "1"); if (btn) btn.hidden = false; });
    if (btn) btn.addEventListener("click", function () {
      v.currentTime = 0; v.playbackRate = 0.75; btn.hidden = true;
      var pr = v.play(); if (pr && pr.catch) pr.catch(function () {});
    });
  });

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function runMorph(m) {
    if (m.getAttribute("data-ran")) return; m.setAttribute("data-ran", "1");
    if (reduce) { m.classList.add("m-pick", "m-done"); return; }
    setTimeout(function () { m.classList.add("m-pick"); }, 700);
    setTimeout(function () { m.classList.add("m-done"); }, 2600);
  }
  var mio = "IntersectionObserver" in window ? new IntersectionObserver(function (es) {
    es.forEach(function (en) { if (en.isIntersecting) { runMorph(en.target); mio.unobserve(en.target); } });
  }, { root: main, threshold: 0.35 }) : null;
  document.querySelectorAll(".morph").forEach(function (m) { if (mio) mio.observe(m); else runMorph(m); });
  document.addEventListener("click", function (e) {
    var b = e.target.closest(".morph__all"); if (!b) return;
    var m = b.closest(".morph");
    var cls = m.getAttribute("data-morph") === "pha" ? "r-open" : "m-all";
    var open = !m.classList.contains(cls);
    m.classList.toggle(cls, open);
    b.setAttribute("aria-expanded", open ? "true" : "false");
    if (!b.getAttribute("data-label")) b.setAttribute("data-label", b.textContent);
    b.textContent = open ? "Show less" : b.getAttribute("data-label");
  });

  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.querySelectorAll("svg.orbit").forEach(function (svg) { if (svg.pauseAnimations) svg.pauseAnimations(); });
  }

  window.addEventListener("hashchange", route);
  route();
})();

(function hideCases() {
  var hide = (window.HIDE_CASES || []);
  if (!hide.length) return;
  function run() {
    hide.forEach(function (id) {
      var page = document.getElementById("page-real-" + id);
      if (page) page.remove();
      document.querySelectorAll('[data-go="real-' + id + '"], a[href="#real-' + id + '"]').forEach(function (el) {
        if (el.classList.contains("fcard") || el.classList.contains("rm__item")) {
          el.removeAttribute("href"); el.removeAttribute("data-go");
          el.style.cursor = "default";
          var go = el.querySelector(".fx__go"); if (go) go.remove();
        } else {
          el.remove();
        }
      });
    });
    var names = { "cash-application": "Cash Application", "engineering-release": "Engineering Release", "quality-root-cause": "Quality Root Cause" };
    document.querySelectorAll(".hero__chips span").forEach(function (s) {
      hide.forEach(function (id) { if (s.textContent.trim() === names[id]) s.remove(); });
    });
    var n = 5 - hide.length;
    var words = { 1: "1", 2: "2", 3: "3", 4: "4" };
    document.querySelectorAll(".card__desc, .note, .path5__you span").forEach(function (el) {
      el.innerHTML = el.innerHTML.replace(/\b5 use cases\b/, words[n] + " use cases").replace(/\bAll 5\b/, n === 2 ? "Both" : "All " + n).replace(/\bYour 5 prototypes\b/, "Your " + words[n] + " prototypes");
    });
    document.querySelectorAll(".cards--row5").forEach(function (g) {
      g.style.gridTemplateColumns = "repeat(" + n + ", minmax(0, 1fr))";
      Array.prototype.forEach.call(g.children, function (c) { c.style.gridColumn = "auto"; });
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run); else run();
})();
