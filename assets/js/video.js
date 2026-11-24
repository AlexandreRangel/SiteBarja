/* ==========================================================================
   Site Wagner Barja — vídeo
   - loops decorativos: carregam e tocam só quando visíveis (economia de dados)
   - cartões: abrem player em modal, com som (o clique é intencional)
   - respeita prefers-reduced-motion
   ========================================================================== */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var modal = null;

  /* ---------- loops decorativos ---------- */

  function initLoops() {
    var loops = document.querySelectorAll("[data-loop]");
    if (!loops.length) return;

    function makeVideo(el) {
      var v = document.createElement("video");
      v.muted = true;
      v.loop = true;
      v.playsInline = true;
      v.setAttribute("playsinline", "");
      v.setAttribute("muted", "");
      v.setAttribute("aria-hidden", "true");
      v.preload = "none";
      var poster = el.getAttribute("data-poster");
      if (poster) v.poster = poster;
      v.src = el.getAttribute("data-loop");
      el.insertBefore(v, el.firstChild);
      return v;
    }

    if (reduceMotion) {
      // sem animação: mostra o poster como imagem
      loops.forEach(function (el) {
        var poster = el.getAttribute("data-poster");
        if (!poster || el.querySelector("img")) return;
        var img = document.createElement("img");
        img.src = poster;
        img.alt = el.getAttribute("data-alt") || "";
        img.loading = "lazy";
        el.insertBefore(img, el.firstChild);
      });
      return;
    }

    if (!("IntersectionObserver" in window)) {
      loops.forEach(function (el) { makeVideo(el).play().catch(function () {}); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var el = entry.target;
        var v = el.querySelector("video");
        if (entry.isIntersecting) {
          if (!v) v = makeVideo(el);
          if (v.readyState === 0) v.load();
          var p = v.play();
          if (p && p.catch) p.catch(function () {});
        } else if (v) {
          v.pause();
        }
      });
    }, { rootMargin: "200px 0px", threshold: 0.01 });

    loops.forEach(function (el) { io.observe(el); });
  }

  /* ---------- modal para os vídeos completos ---------- */

  function buildModal() {
    if (modal) return modal;
    modal = document.createElement("div");
    modal.className = "vmodal";
    modal.setAttribute("data-open", "false");
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.innerHTML =
      '<div class="vmodal-box">' +
      '  <video controls playsinline preload="none"></video>' +
      '  <div class="vmodal-cap"><span class="vmodal-title"></span>' +
      '  <button class="vmodal-close" type="button">Fechar · Esc</button></div>' +
      "</div>";
    document.body.appendChild(modal);
    modal.addEventListener("click", function (e) {
      if (e.target === modal || e.target.closest(".vmodal-close")) closeModal();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeModal();
    });
    return modal;
  }

  function openModal(src, title, poster) {
    var m = buildModal();
    var v = m.querySelector("video");
    var cap = m.querySelector(".vmodal-title");
    v.src = src;
    if (poster) v.poster = poster;
    cap.textContent = title || "";
    m.setAttribute("data-open", "true");
    v.load();
    var p = v.play();
    if (p && p.catch) {
      p.catch(function () {
        // autoplay com som bloqueado: mantém os controles, usuário dá play
        v.controls = true;
      });
    }
    v.focus();
    document.documentElement.style.overflow = "hidden";
  }

  function closeModal() {
    if (!modal || modal.getAttribute("data-open") !== "true") return;
    var v = modal.querySelector("video");
    v.pause();
    v.removeAttribute("src");
    v.load();
    modal.setAttribute("data-open", "false");
    document.documentElement.style.overflow = "";
  }

  function initCards() {
    document.addEventListener("click", function (e) {
      var card = e.target.closest("[data-video]");
      if (!card) return;
      e.preventDefault();
      openModal(
        card.getAttribute("data-video"),
        card.getAttribute("data-title") || "",
        card.getAttribute("data-poster") || ""
      );
    });
  }

  /* ---------- botão "ver no YouTube" (conteúdo longo) ---------- */

  function initYouTube() {
    document.addEventListener("click", function (e) {
      var c = e.target.closest("[data-yt]");
      if (!c) return;
      var id = c.getAttribute("data-yt");
      if (!id) {
        e.preventDefault();
        var msg = c.getAttribute("data-yt-pending");
        if (msg) alert(msg);
      }
    });
  }

  function init() {
    initLoops();
    initCards();
    initYouTube();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
