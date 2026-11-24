/* ==========================================================================
   Site Wagner Barja — internacionalização PT/EN
   Marca os elementos com data-i18n="chave"; o botão #lang-toggle alterna
   entre pt (padrão, HTML embutido) e en (dicionário en.json).
   A escolha fica em localStorage e é aplicada no load.
   ========================================================================== */
(function () {
  "use strict";

  var STORE_KEY = "barja-lang";
  var dict = null;

  function currentLang() {
    return localStorage.getItem(STORE_KEY) || "pt";
  }

  function applyLang(lang) {
    document.documentElement.setAttribute("lang", lang === "en" ? "en" : "pt-BR");
    var btn = document.getElementById("lang-toggle");
    if (btn) {
      if (lang === "en") {
        btn.textContent = "PT";
        btn.setAttribute("aria-label", "Mudar idioma para português");
      } else {
        btn.textContent = "EN";
        btn.setAttribute("aria-label", "Switch language to English");
      }
    }
    if (lang === "pt") {
      document.querySelectorAll("[data-i18n]").forEach(function (el) {
        var key = el.getAttribute("data-i18n");
        if (el.getAttribute("data-orig") === null) {
          el.setAttribute("data-orig", el.textContent);
        }
        el.textContent = el.getAttribute("data-orig");
      });
      return;
    }
    if (!dict) return;
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (el.getAttribute("data-orig") === null) {
        el.setAttribute("data-orig", el.textContent);
      }
      if (key && dict[key]) {
        el.textContent = dict[key];
      }
    });
  }

  function loadDict(cb) {
    var s = document.createElement("script");
    s.src = "assets/lang/en.js"; // dict setado como window.BARJA_EN
    s.onload = function () {
      dict = window.BARJA_EN || null;
      cb();
    };
    s.onerror = function () {
      dict = null;
      cb();
    };
    document.head.appendChild(s);
  }

  function init() {
    var lang = currentLang();
    if (lang === "en") {
      loadDict(function () { applyLang("en"); });
    } else {
      applyLang("pt");
    }
    var btn = document.getElementById("lang-toggle");
    if (btn) {
      btn.addEventListener("click", function () {
        var next = currentLang() === "en" ? "pt" : "en";
        localStorage.setItem(STORE_KEY, next);
        if (next === "en") {
          loadDict(function () { applyLang("en"); });
        } else {
          applyLang("pt");
        }
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
