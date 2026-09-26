/* ==========================================================================
   projects.js — search + filter for the Projects dashboard
   ========================================================================== */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var grid = document.querySelector("[data-project-grid]");
    if (!grid) return;

    var cards = Array.prototype.slice.call(grid.querySelectorAll("[data-project]"));
    var searchInput = document.querySelector("[data-project-search]");
    var categoryChips = document.querySelectorAll("[data-category-chip]");
    var techSelect = document.querySelector("[data-tech-select]");
    var noResults = document.querySelector(".no-results");

    var state = { query: "", category: "all", tech: "all" };

    function applyFilters() {
      var visibleCount = 0;
      cards.forEach(function (card) {
        var title = (card.getAttribute("data-title") || "").toLowerCase();
        var desc = (card.getAttribute("data-desc") || "").toLowerCase();
        var category = card.getAttribute("data-category") || "";
        var tech = (card.getAttribute("data-tech") || "").toLowerCase();

        var matchesQuery = !state.query || title.indexOf(state.query) > -1 || desc.indexOf(state.query) > -1;
        var matchesCategory = state.category === "all" || category === state.category;
        var matchesTech = state.tech === "all" || tech.indexOf(state.tech) > -1;

        var show = matchesQuery && matchesCategory && matchesTech;
        card.style.display = show ? "" : "none";
        if (show) visibleCount++;
      });
      if (noResults) noResults.classList.toggle("show", visibleCount === 0);
    }

    if (searchInput) {
      searchInput.addEventListener("input", function () {
        state.query = searchInput.value.trim().toLowerCase();
        applyFilters();
      });
    }

    categoryChips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        categoryChips.forEach(function (c) { c.classList.remove("active"); });
        chip.classList.add("active");
        state.category = chip.getAttribute("data-category-chip");
        applyFilters();
      });
    });

    if (techSelect) {
      techSelect.addEventListener("change", function () {
        state.tech = techSelect.value.toLowerCase();
        applyFilters();
      });
    }
  });
})();
