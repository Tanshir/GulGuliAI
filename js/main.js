/* GulGuli site scripts: nav menus, platform tabs, demo video */
(function () {
  // Set this to your demo video embed URL (YouTube/Vimeo embed link) to make the poster play inline.
  var DEMO_VIDEO_EMBED_URL = "";

  var nav = document.getElementById("nav");
  var menuBtn = document.getElementById("menuBtn");

  // Mobile menu
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  // Dropdowns (click to open; close on outside click or Escape)
  var dropdowns = Array.prototype.slice.call(document.querySelectorAll(".has-menu"));
  function closeAll(except) {
    dropdowns.forEach(function (li) {
      if (li !== except) {
        li.classList.remove("open");
        var b = li.querySelector("button");
        if (b) b.setAttribute("aria-expanded", "false");
      }
    });
  }
  dropdowns.forEach(function (li) {
    var btn = li.querySelector("button");
    if (!btn) return;
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var isOpen = li.classList.toggle("open");
      btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
      closeAll(li);
    });
  });
  document.addEventListener("click", function () { closeAll(null); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") { closeAll(null); if (nav) nav.classList.remove("open"); } });

  // Platform tabs
  var tabs = Array.prototype.slice.call(document.querySelectorAll('[role="tab"]'));
  var panels = Array.prototype.slice.call(document.querySelectorAll('[role="tabpanel"]'));
  function showTab(name) {
    tabs.forEach(function (t) {
      var on = t.id === "tab-" + name;
      t.setAttribute("aria-selected", on ? "true" : "false");
      t.tabIndex = on ? 0 : -1;
    });
    panels.forEach(function (p) { p.hidden = p.id !== "panel-" + name; });
  }
  tabs.forEach(function (t, i) {
    t.addEventListener("click", function () { showTab(t.id.replace("tab-", "")); });
    t.addEventListener("keydown", function (e) {
      var dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (!dir) return;
      var next = tabs[(i + dir + tabs.length) % tabs.length];
      next.focus();
      showTab(next.id.replace("tab-", ""));
    });
  });
  // Links elsewhere on the page that point at a tab
  Array.prototype.slice.call(document.querySelectorAll("[data-tab]")).forEach(function (a) {
    a.addEventListener("click", function () {
      showTab(a.getAttribute("data-tab"));
      closeAll(null);
      if (nav) nav.classList.remove("open");
    });
  });
  if (location.hash && /^#tab-/.test(location.hash)) showTab(location.hash.replace("#tab-", ""));

  // Close the mobile nav when a plain link is followed
  Array.prototype.slice.call(document.querySelectorAll(".nav-links a")).forEach(function (a) {
    a.addEventListener("click", function () { if (nav) nav.classList.remove("open"); });
  });

  // Demo poster: swap in the embed when a URL is set
  var poster = document.getElementById("demoPoster");
  if (poster) {
    poster.addEventListener("click", function () {
      if (!DEMO_VIDEO_EMBED_URL) {
        poster.querySelector(".play span").textContent = "Demo video coming soon";
        return;
      }
      var frame = document.createElement("iframe");
      frame.src = DEMO_VIDEO_EMBED_URL + (DEMO_VIDEO_EMBED_URL.indexOf("?") > -1 ? "&" : "?") + "autoplay=1";
      frame.allow = "autoplay; fullscreen; picture-in-picture";
      frame.title = "GulGuli demo video";
      poster.replaceWith(frame);
    });
  }

  // Pricing page: monthly / yearly toggle
  var billing = document.getElementById("billingToggle");
  if (billing) {
    var amounts = Array.prototype.slice.call(document.querySelectorAll("[data-monthly]"));
    billing.addEventListener("change", function () {
      var yearly = billing.checked;
      amounts.forEach(function (el) {
        el.textContent = yearly ? el.getAttribute("data-yearly") : el.getAttribute("data-monthly");
      });
      var note = document.getElementById("billingNote");
      if (note) note.textContent = yearly ? "Billed yearly. Two months free." : "Billed monthly. Cancel anytime.";
    });
  }
})();
