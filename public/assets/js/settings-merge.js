/* Carrega conteúdo editável (hero home) da API. */
(function (w) {
  const DEFAULT_HOME_HERO = {
    eyebrow: "CA Cursos · Nota 4,8 no Google · +850 avaliações",
    titleBefore: "Em ",
    titleHighlight: "40 horas",
    titleAfter: ", você sai da teoria e começa a cobrar pelo primeiro conserto.",
    lead:
      "Bancada individual em Goiânia ou formação 100% online com 1 ano de acesso - você escolhe o formato, o conteúdo é o mesmo. Garantia de resultado em 60 dias.",
    primaryCtaLabel: "Ver cursos e valores",
    primaryCtaHref: "cursos.html",
    secondaryCtaLabel: "Assistir aula grátis",
    secondaryCtaHref: "aulas.html",
    proof: [
      { label: "Presencial", detail: "bancada individual" },
      { label: "Online", detail: "1 ano de acesso" },
      { label: "40h", detail: "curso iniciante" },
      { label: "60 dias", detail: "garantia de resultado" }
    ]
  };

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function applyHomeHero(hero) {
    const data = Object.assign({}, DEFAULT_HOME_HERO, hero || {});
    const eyebrow = document.querySelector(".hero__copy > .eyebrow");
    const h1 = document.querySelector(".hero__copy > h1");
    const lead = document.querySelector(".hero__copy > .lead");
    const ctas = document.querySelectorAll(".hero__cta > a");
    const proof = document.querySelector(".hero__proof");

    if (eyebrow) eyebrow.textContent = data.eyebrow;
    if (h1) {
      h1.innerHTML =
        esc(data.titleBefore) +
        '<span class="grad-text">' +
        esc(data.titleHighlight) +
        "</span>" +
        esc(data.titleAfter);
    }
    if (lead) lead.textContent = data.lead;
    if (ctas[0]) {
      ctas[0].textContent = data.primaryCtaLabel;
      ctas[0].setAttribute("href", data.primaryCtaHref || "cursos.html");
    }
    if (ctas[1]) {
      ctas[1].textContent = data.secondaryCtaLabel;
      ctas[1].setAttribute("href", data.secondaryCtaHref || "aulas.html");
    }
    if (proof && Array.isArray(data.proof) && data.proof.length) {
      proof.innerHTML = data.proof
        .map(function (p) {
          return (
            "<div><b>" +
            esc(p.label) +
            "</b><span>" +
            esc(p.detail) +
            "</span></div>"
          );
        })
        .join("");
    }
    w.CA_HOME_HERO = data;
  }

  w.CASettingsMerge = {
    async load() {
      const apiBase = (w.CA_API_BASE || "").replace(/\/$/, "");
      let homeHero = DEFAULT_HOME_HERO;
      if (apiBase) {
        try {
          const res = await fetch(apiBase + "/api/settings/public", { cache: "no-store" });
          if (res.ok) {
            const json = await res.json();
            if (json && json.homeHero) homeHero = Object.assign({}, DEFAULT_HOME_HERO, json.homeHero);
          }
        } catch (e) {
          /* offline */
        }
      }
      applyHomeHero(homeHero);
      return { homeHero };
    }
  };
})(window);
