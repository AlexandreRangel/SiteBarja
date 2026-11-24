/* ==========================================================================
   Site Wagner Barja — camada visual (comportamento)
   Barra de progresso de leitura, revelação ao rolar, parallax leve do fundo
   e botão "topo". Tudo degrada bem sem JS e respeita prefers-reduced-motion.
   ========================================================================== */
(function () {
  "use strict";

  var reduzir = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- barra de progresso ---------- */
  function initProgress() {
    var bar = document.createElement("div");
    bar.className = "scroll-progress";
    bar.setAttribute("aria-hidden", "true");
    document.body.appendChild(bar);

    var raf = 0;
    function atualizar() {
      raf = 0;
      var doc = document.documentElement;
      var max = doc.scrollHeight - window.innerHeight;
      var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      bar.style.transform = "scaleX(" + p.toFixed(4) + ")";
    }
    function agendar() { if (!raf) raf = requestAnimationFrame(atualizar); }
    window.addEventListener("scroll", agendar, { passive: true });
    window.addEventListener("resize", agendar, { passive: true });
    atualizar();
  }

  /* ---------- revelação ao entrar na tela ---------- */
  function initReveal() {
    var alvos = document.querySelectorAll(".reveal");
    if (!alvos.length) return;
    if (reduzir || !("IntersectionObserver" in window)) {
      alvos.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    alvos.forEach(function (el) { io.observe(el); });
  }

  /* ---------- parallax suave no fundo do cabeçalho ---------- */
  function initParallax() {
    if (reduzir) return;
    var fundos = document.querySelectorAll(".page-head, .hero, .work-head");
    if (!fundos.length) return;
    var raf = 0;
    function atualizar() {
      raf = 0;
      var y = window.scrollY;
      if (y > 1400) return; // só perto do topo: custo zero no meio da página
      for (var i = 0; i < fundos.length; i++) {
        var el = fundos[i];
        var antes = window.getComputedStyle(el, "::before");
        if (antes && antes.content === "none") continue;
        el.style.setProperty("--shift", (y * 0.06).toFixed(1) + "px");
      }
    }
    window.addEventListener("scroll", function () { if (!raf) raf = requestAnimationFrame(atualizar); }, { passive: true });
    atualizar();
  }

  /* ---------- botão "voltar ao topo" ---------- */
  function initTopo() {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "to-top";
    btn.innerHTML = "↑";
    btn.setAttribute("aria-label", "Voltar ao topo");
    document.body.appendChild(btn);

    function verificar() {
      btn.classList.toggle("is-visible", window.scrollY > window.innerHeight * 1.2);
    }
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduzir ? "auto" : "smooth" });
    });
    window.addEventListener("scroll", verificar, { passive: true });
    verificar();
  }

  /* ---------- fundos: resolve o caminho relativo ao documento ---------- */
  function initFundos() {
    document.querySelectorAll("[data-bg]").forEach(function (el) {
      var v = el.getAttribute("data-bg");
      if (!v) return;
      var abs;
      try { abs = new URL(v, window.location.href).href; } catch (e) { return; }
      el.style.setProperty("--bg-img", 'url("' + abs + '")');
    });
  }

  function init() {
    initFundos();
    initProgress();
    initReveal();
    initParallax();
    initTopo();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
