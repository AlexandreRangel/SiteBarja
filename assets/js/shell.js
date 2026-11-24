/* ==========================================================================
   Site Wagner Barja — shell compartilhado (cabeçalho + rodapé)
   Injeta header/footer em todas as páginas; destaca o item ativo via
   data-page no <body>.
   ========================================================================== */
(function () {
  "use strict";

  var page = document.body.getAttribute("data-page") || "";
  // páginas dentro de subpastas (ex.: /obra/) precisam de "../" nos links do shell
  var BASE = /\/obra\//.test(window.location.pathname) ? "../" : "";
  window.BARJA_BASE = BASE;

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function link(href, label, key) {
    var active = page === key ? ' aria-current="page"' : "";
    return '<li><a href="' + BASE + href + '"' + active + ' data-i18n="nav.' + key + '">' + label + "</a></li>";
  }

  var headerHTML =
    '<header class="site-header">' +
    '  <div class="nav">' +
    '    <a class="brand" href="' + BASE + 'index.html">Wagner Barja<small data-i18n="nav.brand.sub">artista · curador · educador</small></a>' +
    '    <div class="nav-right">' +
    '      <button id="lang-toggle" class="lang-toggle" aria-label="Switch language to English">EN</button>' +
    '      <button class="nav-toggle" aria-label="Abrir menu" data-i18n="menu.open">Menu</button>' +
    "    </div>" +
    '    <nav aria-label="Principal">' +
    '      <ul class="nav-menu" id="nav-menu" data-open="false">' +
    link("index.html", "Início", "home") +
    link("tumulto-iii.html", "Tumulto III", "tumulto") +
    link("antologia.html", "Antologia", "antologia") +
    link("depoimentos.html", "Depoimentos", "depoimentos") +
    link("obras.html", "Obras", "obras") +
    link("exposicoes.html", "Exposições", "exposicoes") +
    link("curadorias.html", "Curadorias", "curadorias") +
    link("publicacoes.html", "Publicações", "publicacoes") +
    link("projetos.html", "Projetos", "projetos") +
    link("citacoes.html", "Citações", "citacoes") +
    "      </ul>" +
    "    </nav>" +
    "  </div>" +
    "</header>";

  var footerHTML =
    '<footer class="site-footer">' +
    '  <div class="container">' +
    '    <span data-i18n="footer.site">Site de Wagner Barja</span>' +
    '    <span><a rel="noreferrer" target="_blank" href="http://lattes.cnpq.br/3271219304383451" data-i18n="footer.lattes">Currículo Lattes</a></span>' +
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
