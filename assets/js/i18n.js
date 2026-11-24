/* ==========================================================================
   Site Wagner Barja — internacionalização PT / EN / ES
   1) Interface: [data-i18n="chave"] -> assets/lang/<lang>.js (window.BARJA_<LANG>)
   2) Conteúdo: <body data-i18n-content="caminho/sem-extensao"> + elementos com
      [data-i18n-key="chave"] -> caminho.<lang>.json ; o PT original fica guardado
      no próprio elemento (data-orig-html).
   A escolha fica em localStorage ('barja-lang').
   ========================================================================== */
(function () {
  "use strict";

  var STORE_KEY = "barja-lang";
  var LANGS = ["pt", "en", "es"];
  var ALVO = { pt: "pt-BR", en: "en", es: "es" };
  var dicts = {};        // interface por idioma
  var contents = {};     // conteúdo por idioma
  var carregando = {};

  function atual() {
    var v = localStorage.getItem(STORE_KEY);
    return LANGS.indexOf(v) >= 0 ? v : "pt";
  }
  function base() { return window.BARJA_BASE || ""; }

  /* ---------- interface ---------- */
  function applyChrome(lang) {
    var dict = dicts[lang] || null;
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (el.getAttribute("data-orig") === null) el.setAttribute("data-orig", el.textContent);
      if (lang === "pt") el.textContent = el.getAttribute("data-orig");
      else if (dict && key && dict[key]) el.textContent = dict[key];
    });
  }

  /* ---------- conteúdo ---------- */
  function aplicarTexto(el, valor) {
    if (!el.hasAttribute("data-orig-html")) el.setAttribute("data-orig-html", el.innerHTML);
    if (valor === null) { el.innerHTML = el.getAttribute("data-orig-html"); return; }
    if (/<[a-z][\s\S]*>/i.test(valor)) el.innerHTML = valor;
    else el.textContent = valor;
  }

  function applyContent(lang) {
    var nodes = document.querySelectorAll("[data-i18n-key]");
    if (!nodes.length) return;
    var dic = contents[lang] || null;
    nodes.forEach(function (el) {
      var key = el.getAttribute("data-i18n-key");
      if (lang === "pt") { aplicarTexto(el, null); return; }
      var val = dic && typeof dic[key] === "string" && dic[key] ? dic[key] : null;
      aplicarTexto(el, val);
    });
  }

  function srcConteudo() {
    var body = document.body;
    return body ? body.getAttribute("data-i18n-content") : null;
  }

  function carregarConteudo(lang) {
    var src = srcConteudo();
    if (!src || lang === "pt") return Promise.resolve();
    if (contents[lang] || carregando[lang]) return carregando[lang] || Promise.resolve();
    carregando[lang] = fetch(src + "." + lang + ".json", { cache: "force-cache" })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) { contents[lang] = j || {}; })
      .catch(function () { contents[lang] = {}; })
      .then(function () { delete carregando[lang]; });
    return carregando[lang];
  }

  function carregarDict(lang) {
    if (lang === "pt" || dicts[lang]) return Promise.resolve();
    return new Promise(function (resolve) {
      var s = document.createElement("script");
      s.src = base() + "assets/lang/" + lang + ".js";
      s.onload = function () { dicts[lang] = window["BARJA_" + lang.toUpperCase()] || null; resolve(); };
      s.onerror = function () { dicts[lang] = null; resolve(); };
      document.head.appendChild(s);
    });
  }

  /* ---------- estado dos botões ---------- */
  function marcarBotoes(lang) {
    document.querySelectorAll("[data-lang]").forEach(function (b) {
      var on = b.getAttribute("data-lang") === lang;
      b.setAttribute("aria-pressed", on ? "true" : "false");
      b.classList.toggle("is-active", on);
    });
  }

  function applyLang(lang) {
    document.documentElement.setAttribute("lang", ALVO[lang] || "pt-BR");
    marcarBotoes(lang);
    applyChrome(lang);
    applyContent(lang);
  }

  function irPara(lang) {
    if (lang === "pt") { applyLang("pt"); return; }
    Promise.all([carregarDict(lang), carregarConteudo(lang)]).then(function () { applyLang(lang); });
  }

  function init() {
    irPara(atual());
    document.addEventListener("click", function (e) {
      var b = e.target.closest("[data-lang]");
      if (!b) return;
      var lang = b.getAttribute("data-lang");
      if (LANGS.indexOf(lang) < 0) return;
      localStorage.setItem(STORE_KEY, lang);
      irPara(lang);
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
