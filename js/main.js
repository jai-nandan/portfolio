/* ==========================================================================
   main.js — global behaviour shared by every page
   ========================================================================== */
(function () {
  "use strict";

  /* ---- Loader ---- */
  window.addEventListener("load", function () {
    var loader = document.querySelector(".loader");
    if (loader) {
      setTimeout(function () { loader.classList.add("hidden"); }, 250);
    }
  });

  /* ---- Theme (dark default, persisted in localStorage) ---- */
  var THEME_KEY = "jn-theme";
  function applyTheme(theme) {
    if (theme === "light") {
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    var icon = document.querySelector(".theme-toggle i");
    if (icon) icon.className = theme === "light" ? "bi bi-moon-stars" : "bi bi-sun";
  }
  var savedTheme = localStorage.getItem(THEME_KEY) || "dark";
  applyTheme(savedTheme);

  document.addEventListener("DOMContentLoaded", function () {
    var toggle = document.querySelector(".theme-toggle");
    if (toggle) {
      toggle.addEventListener("click", function () {
        var current = document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
        var next = current === "light" ? "dark" : "light";
        applyTheme(next);
        localStorage.setItem(THEME_KEY, next);
      });
    }

    /* ---- Mobile nav ---- */
    var navToggle = document.querySelector(".nav-toggle");
    var navLinks = document.querySelector(".nav-links");
    if (navToggle && navLinks) {
      navToggle.addEventListener("click", function () {
        navLinks.classList.toggle("mobile-open");
        var open = navLinks.classList.contains("mobile-open");
        navToggle.innerHTML = open ? '<i class="bi bi-x-lg"></i>' : '<i class="bi bi-list"></i>';
        navToggle.setAttribute("aria-expanded", open);
      });
      navLinks.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", function () {
          navLinks.classList.remove("mobile-open");
          navToggle.innerHTML = '<i class="bi bi-list"></i>';
        });
      });
    }

    /* ---- Active nav link (by current filename) ---- */
    var page = (location.pathname.split("/").pop() || "index.html");
    if (page === "") page = "index.html";
    document.querySelectorAll(".nav-links a").forEach(function (a) {
      var href = a.getAttribute("href");
      if (href === page || (page === "index.html" && href === "index.html")) {
        a.classList.add("active");
      }
    });

    /* ---- Header scroll shadow ---- */
    var header = document.querySelector(".site-header");
    function onScroll() {
      if (!header) return;
      if (window.scrollY > 12) header.classList.add("scrolled");
      else header.classList.remove("scrolled");
      toggleBackToTop();
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    /* ---- Back to top ---- */
    var backBtn = document.querySelector(".back-to-top");
    function toggleBackToTop() {
      if (!backBtn) return;
      if (window.scrollY > 480) backBtn.classList.add("visible");
      else backBtn.classList.remove("visible");
    }
    if (backBtn) {
      backBtn.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }

    /* ---- Footer year ---- */
    document.querySelectorAll(".current-year").forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  });

  /* ---- Animated particle / node background ---- */
  function initParticles() {
    var canvas = document.getElementById("particle-canvas");
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext("2d");
    var w, h, dots = [];
    var COUNT = window.innerWidth < 768 ? 26 : 50;

    function resize() {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    }
    function makeDots() {
      dots = [];
      for (var i = 0; i < COUNT; i++) {
        dots.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          r: Math.random() * 1.6 + 0.6
        });
      }
    }
    function step() {
      ctx.clearRect(0, 0, w, h);
      var isLight = document.documentElement.getAttribute("data-theme") === "light";
      var dotColor = isLight ? "37,99,235" : "34,211,238";
      for (var i = 0; i < dots.length; i++) {
        var d = dots[i];
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0 || d.x > w) d.vx *= -1;
        if (d.y < 0 || d.y > h) d.vy *= -1;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(" + dotColor + ",0.55)";
        ctx.fill();
        for (var j = i + 1; j < dots.length; j++) {
          var o = dots[j];
          var dx = d.x - o.x, dy = d.y - o.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(d.x, d.y);
            ctx.lineTo(o.x, o.y);
            ctx.strokeStyle = "rgba(" + dotColor + "," + (0.12 * (1 - dist / 130)) + ")";
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(step);
    }
    window.addEventListener("resize", function () { resize(); makeDots(); });
    resize(); makeDots();
    requestAnimationFrame(step);
  }
  document.addEventListener("DOMContentLoaded", initParticles);

  /* ---- Certificate modal (Certificates page) ---- */
  document.addEventListener("DOMContentLoaded", function () {
    var modal = document.querySelector("[data-cert-modal]");
    if (!modal) return;
    var titleEl = modal.querySelector("[data-cert-title]");
    var issuerEl = modal.querySelector("[data-cert-issuer]");
    var dateEl = modal.querySelector("[data-cert-date]");
    var iconEl = modal.querySelector("[data-cert-icon] i");

    document.querySelectorAll("[data-cert-trigger]").forEach(function (trigger) {
      trigger.addEventListener("click", function () {
        titleEl.textContent = trigger.getAttribute("data-cert-title-val");
        issuerEl.textContent = trigger.getAttribute("data-cert-issuer-val");
        dateEl.textContent = trigger.getAttribute("data-cert-date-val");
        if (iconEl) iconEl.className = trigger.getAttribute("data-cert-icon-val") || "bi bi-award";
        modal.classList.add("open");
        document.body.style.overflow = "hidden";
      });
    });
    function closeModal() {
      modal.classList.remove("open");
      document.body.style.overflow = "";
    }
    modal.querySelectorAll("[data-cert-close]").forEach(function (btn) {
      btn.addEventListener("click", closeModal);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeModal();
    });
  });

  /* ---- Detail page tabs (Project Detail page) ---- */
  document.addEventListener("DOMContentLoaded", function () {
    var tabs = document.querySelectorAll("[data-detail-tab]");
    if (!tabs.length) return;
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        var target = tab.getAttribute("data-detail-tab");
        document.querySelectorAll("[data-detail-tab]").forEach(function (t) { t.classList.remove("active"); });
        document.querySelectorAll("[data-detail-panel]").forEach(function (p) { p.classList.remove("active"); });
        tab.classList.add("active");
        var panel = document.querySelector('[data-detail-panel="' + target + '"]');
        if (panel) panel.classList.add("active");
      });
    });
  });

  /* ---- Certificate category filter ---- */
  document.addEventListener("DOMContentLoaded", function () {
    var chips = document.querySelectorAll("[data-cert-filter]");
    var cards = document.querySelectorAll("[data-cert-card]");
    if (!chips.length) return;
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        chips.forEach(function (c) { c.classList.remove("active"); });
        chip.classList.add("active");
        var cat = chip.getAttribute("data-cert-filter");
        cards.forEach(function (card) {
          var match = cat === "all" || card.getAttribute("data-category") === cat;
          card.style.display = match ? "" : "none";
        });
      });
    });
  });
})();
