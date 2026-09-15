/* Mescla artigos do CMS (API + JSON local) com CA.posts / CA.conteudo. */
(function (w) {
  function ensureCA() {
    w.CA = w.CA || {};
    if (!Array.isArray(w.CA.posts)) w.CA.posts = [];
    if (!w.CA.conteudo || typeof w.CA.conteudo !== "object") w.CA.conteudo = {};
  }

  function mergePayload(payload) {
    ensureCA();
    if (!payload || !Array.isArray(payload.posts)) return;

    const bySlug = new Map(w.CA.posts.map((p) => [p.slug, p]));
    payload.posts.forEach((p) => {
      if (!p || !p.slug || !p.titulo) return;
      bySlug.set(p.slug, {
        slug: p.slug,
        glyph: p.glyph || "📝",
        categoria: p.categoria || "Geral",
        destaque: !!p.destaque,
        titulo: p.titulo,
        resumo: p.resumo || "",
        data: p.data || new Date().toISOString().slice(0, 10),
        leitura: p.leitura || "5 min",
        autor: p.autor || "Equipe CA Cursos",
        capa: p.capa || "",
        seoTitle: p.seoTitle || "",
        seoDescription: p.seoDescription || "",
        _cms: true
      });
    });

    w.CA.posts = Array.from(bySlug.values()).sort((a, b) =>
      String(b.data || "").localeCompare(String(a.data || ""))
    );

    const conteudo = payload.conteudo || {};
    Object.keys(conteudo).forEach((slug) => {
      if (conteudo[slug]) w.CA.conteudo[slug] = conteudo[slug];
    });

    w.CA.post = (slug) => w.CA.posts.find((p) => p.slug === slug);
  }

  w.CABlogMerge = {
    apply(payload) {
      mergePayload(payload);
    },
    async load() {
      ensureCA();

      // 1) API do backend (fonte de verdade)
      const apiBase = (w.CA_API_BASE || "").replace(/\/$/, "");
      if (apiBase) {
        try {
          const res = await fetch(`${apiBase}/api/articles/public/feed`, { cache: "no-store" });
          if (res.ok) {
            const json = await res.json();
            mergePayload(json);
          }
        } catch (e) {
          /* API offline: segue com estático */
        }
      }

      // 2) Arquivo público versionado (fallback de deploy)
      try {
        const res = await fetch("assets/data/blog-articles.json", { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          mergePayload(json);
        }
      } catch (e) {
        /* ignore */
      }

      return w.CA.posts;
    }
  };
})(window);
