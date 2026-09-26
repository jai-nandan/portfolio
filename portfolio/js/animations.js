/* ==========================================================================
   animations.js — scroll reveal, counters, skill bars
   ========================================================================== */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    /* ---- Scroll reveal ---- */
    var revealEls = document.querySelectorAll("[data-reveal]");
    if ("IntersectionObserver" in window && revealEls.length) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("in-view");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
      );
      revealEls.forEach(function (el, i) {
        el.style.setProperty("--d", Math.min(i % 6, 5) * 0.08 + "s");
        io.observe(el);
      });
    } else {
      revealEls.forEach(function (el) { el.classList.add("in-view"); });
    }

    /* ---- Count-up numbers (elements with data-count-to) ---- */
    var counters = document.querySelectorAll("[data-count-to]");
    if (counters.length) {
      var cio = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            animateCount(entry.target);
            cio.unobserve(entry.target);
          });
        },
        { threshold: 0.4 }
      );
      counters.forEach(function (el) { cio.observe(el); });
    }
    function animateCount(el) {
      var target = parseFloat(el.getAttribute("data-count-to"));
      var suffix = el.getAttribute("data-suffix") || "";
      var duration = 1200;
      var start = performance.now();
      function tick(now) {
        var progress = Math.min((now - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var value = target * eased;
        el.textContent = (target % 1 === 0 ? Math.round(value) : value.toFixed(1)) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }

    /* ---- Skill progress bars ---- */
    var bars = document.querySelectorAll(".progress-fill[data-level]");
    if (bars.length) {
      var bio = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            var level = entry.target.getAttribute("data-level");
            entry.target.style.width = level + "%";
            bio.unobserve(entry.target);
          });
        },
        { threshold: 0.4 }
      );
      bars.forEach(function (el) { bio.observe(el); });
    }
  });
})();
