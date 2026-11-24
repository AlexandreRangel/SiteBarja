/* ==========================================================================
   Site Wagner Barja — filtro do índice de obras (por década)
   ========================================================================== */
(function () {
  "use strict";

  function init() {
    var pills = document.querySelectorAll(".filters button");
    var cards = document.querySelectorAll(".works-grid .wcard");
    if (!pills.length || !cards.length) return;

    function apply(filter) {
      cards.forEach(function (card) {
        var dec = card.getAttribute("data-decade") || "";
        card.hidden = filter !== "all" && dec !== filter;
      });
      pills.forEach(function (b) {
        b.setAttribute("aria-pressed", b.getAttribute("data-f") === filter ? "true" : "false");
      });
    }

    pills.forEach(function (btn) {
      btn.addEventListener("click", function () {
        apply(btn.getAttribute("data-f"));
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
