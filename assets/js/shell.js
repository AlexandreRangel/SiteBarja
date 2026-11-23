/* ==========================================================================
   Site Wagner Barja — shell compartilhado (cabeçalho + rodapé)
   Injeta header/footer em todas as páginas; destaca o item ativo via
   data-page no <body>.
   ========================================================================== */
(function () {
  "use strict";

  var page = document.body.getAttribute("data-page") || "";

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function link(href, label, key) {
    var active = page === key ? ' aria-current="page"' : "";
    return '<li><a href="' + href + '"' + active + '>' + label + "</a></li>";
  }

  var headerHTML =
    '<header class="site-header">' +
    '  <div class="nav">' +
    '    <a class="brand" href="index.html">Wagner Barja<small>artista · curador · educador</small></a>' +
    '    <button class="nav-toggle" aria-label="Abrir menu">Menu</button>' +
    '    <nav aria-label="Principal">' +
    '      <ul class="nav-menu" id="nav-menu" data-open="false">' +
    link("index.html", "Início", "home") +
    link("tumulto-iii.html", "Tumulto III", "tumulto") +
    link("antologia.html", "Antologia", "antologia") +
    link("publicacoes.html", "Publicações", "publicacoes") +
    link("citacoes.html", "Citações", "citacoes") +
    "      </ul>" +
    "    </nav>" +
    "  </div>" +
    "</header>";

  var footerHTML =
    '<footer class="site-footer">' +
    '  <div class="container">' +
    "    <span>Site de Wagner Barja</span>" +
    "    <span>1985 — presente</span>" +
    "  </div>" +
    "</footer>";

  function inject() {
    var target = document.getElementById("include-header");
    if (target) {
      target.outerHTML = headerHTML + '<div id="include-header" hidden></div>';
    }
    var ft = document.getElementById("include-footer");
    if (ft) {
      ft.outerHTML = footerHTML + '<div id="include-footer" hidden></div>';
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inject);
  } else {
    inject();
  }
})();
