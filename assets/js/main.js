/* ==========================================================================
   Site Wagner Barja — interações
   Menu mobile · lightbox com zoom (mouse: roda; touch: pinça)
   Vanilla JS, progressivo, sem dependências.
   ========================================================================== */
(function () {
  "use strict";

  /* ---------- menu mobile ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.querySelector(".nav-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.getAttribute("data-open") === "true";
      menu.setAttribute("data-open", open ? "false" : "true");
      toggle.setAttribute("aria-expanded", open ? "false" : "true");
    });
    // fecha ao navegar
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        menu.setAttribute("data-open", "false");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-controls", menu.id || "nav-menu");
  }

  /* ---------- lightbox com zoom ---------- */
  var lb = document.querySelector(".lightbox");
  if (!lb) return;

  var lbImg = lb.querySelector("img");
  var lbClose = lb.querySelector(".lb-close");
  var lbHint = lb.querySelector(".lb-hint");
  var scale = 1;
  var tx = 0;
  var ty = 0;

  function applyTransform() {
    var s = scale < 1 ? 1 : scale;
    lbImg.style.transform = "translate(" + tx + "px," + ty + "px) scale(" + s + ")";
  }

  function openLightbox(src, alt) {
    lbImg.src = src;
    lbImg.alt = alt || "";
    scale = 1; tx = 0; ty = 0;
    applyTransform();
    lb.setAttribute("data-open", "true");
    document.body.style.overflow = "hidden";
    if (lbHint) hint("roda do mouse ou pinça para dar zoom · Esc fecha");
  }

  function closeLightbox() {
    lb.setAttribute("data-open", "false");
    document.body.style.overflow = "";
  }

  // todos os elementos com data-lightbox abrem o lightbox
  document.querySelectorAll("[data-lightbox]").forEach(function (el) {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      var src = el.getAttribute("data-lightbox") || el.getAttribute("href");
      var alt = el.getAttribute("data-alt") || el.getAttribute("alt") || "";
      openLightbox(src, alt);
    });
  });

  if (lbClose) lbClose.addEventListener("click", closeLightbox);
  lb.addEventListener("click", function (e) {
    if (e.target === lb || e.target === lbImg) closeLightbox();
  });
  document.addEventListener("keydown", function (e) {
    if (lb.getAttribute("data-open") !== "true") return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "+" || e.key === "=") zoomBy(1.25);
    if (e.key === "-") zoomBy(1 / 1.25);
    if (e.key === "0") { scale = 1; tx = 0; ty = 0; applyTransform(); }
  });

  function zoomBy(factor) {
    var was = scale;
    scale = Math.min(6, Math.max(1, scale * factor));
    tx *= scale / was;
    ty *= scale / was;
    applyTransform();
    if (lbHint) hint((Math.round(scale * 100)) + "% · Esc fecha");
  }

  function hint(text) {
    lbHint.textContent = text;
    clearTimeout(hint._t);
    hint._t = setTimeout(function () { lbHint.textContent = "roda do mouse ou pinça para dar zoom · Esc fecha"; }, 1600);
  }

  // roda do mouse
  lb.addEventListener("wheel", function (e) {
    e.preventDefault();
    var rect = lb.getBoundingClientRect();
    var px = e.clientX - rect.left - rect.width / 2;
    var py = e.clientY - rect.top - rect.height / 2;
    var factor = e.deltaY < 0 ? 1.15 : 1 / 1.15;
    var was = scale;
    scale = Math.min(6, Math.max(1, scale * factor));
    tx = px - ((px - tx) * scale) / was;
    ty = py - ((py - ty) * scale) / was;
    applyTransform();
    if (lbHint) hint((Math.round(scale * 100)) + "% · Esc fecha");
  }, { passive: false });

  // pinça no touch
  var touch = { dist: 0, scale0: 1, active: false, lastX: 0, lastY: 0 };
  lb.addEventListener("touchstart", function (e) {
    if (e.touches.length === 2) {
      touch.active = true;
      touch.dist = dist(e.touches);
      touch.scale0 = scale;
    } else if (e.touches.length === 1) {
      touch.lastX = e.touches[0].clientX;
      touch.lastY = e.touches[0].clientY;
    }
  }, { passive: true });

  lb.addEventListener("touchmove", function (e) {
    e.preventDefault();
    if (touch.active && e.touches.length === 2) {
      var d = dist(e.touches);
      scale = Math.min(6, Math.max(1, touch.scale0 * (d / touch.dist)));
      applyTransform();
      if (lbHint) hint((Math.round(scale * 100)) + "% · Esc fecha");
    } else if (!touch.active && e.touches.length === 1 && scale > 1) {
      var x = e.touches[0].clientX;
      var y = e.touches[0].clientY;
      tx += x - touch.lastX;
      ty += y - touch.lastY;
      touch.lastX = x;
      touch.lastY = y;
      applyTransform();
    }
  }, { passive: false });

  lb.addEventListener("touchend", function () { touch.active = false; }, { passive: true });

  function dist(touches) {
    return Math.hypot(touches[0].clientX - touches[1].clientX, touches[0].clientY - touches[1].clientY);
  }
})();
