/* Mescla catálogo de cursos da API com CA.cursos. */
(function (w) {
  function ensureCA() {
    w.CA = w.CA || {};
    if (!Array.isArray(w.CA.cursos)) w.CA.cursos = [];
  }

  function mergeCursos(list) {
    ensureCA();
    if (!Array.isArray(list) || !list.length) return;

    const bySlug = new Map(w.CA.cursos.map((c) => [c.slug, c]));
    list.forEach((c) => {
      if (!c || !c.slug || !c.titulo) return;
      bySlug.set(c.slug, {
        slug: c.slug,
        titulo: c.titulo,
        categoria: c.categoria || "iniciante",
        nivel: c.nivel || "Iniciante",
        glyph: c.glyph || "📱",
        destaque: !!c.destaque,
        badge: c.badge || "",
        horas: Number(c.horas) || 0,
        aulas: Number(c.aulas) || 0,
        alunos: Number(c.alunos) || 0,
        nota: Number(c.nota) || 0,
        avaliacoes: Number(c.avaliacoes) || 0,
        formato: c.formato || "",
        acesso: c.acesso ?? null,
        preco: Number(c.preco) || 0,
        precoDe: c.precoDe != null ? Number(c.precoDe) : null,
        parcelas: c.parcelas || null,
        boleto: c.boleto || null,
        reserva: c.reserva || null,
        precoNota: c.precoNota || null,
        link: c.link || null,
        resumo: c.resumo || "",
        para: Array.isArray(c.para) ? c.para : [],
        aprende: Array.isArray(c.aprende) ? c.aprende : [],
        beneficios: Array.isArray(c.beneficios) ? c.beneficios : [],
        turmas: Array.isArray(c.turmas) ? c.turmas : [],
        modulos: Array.isArray(c.modulos) ? c.modulos : [],
        faq: Array.isArray(c.faq) ? c.faq : [],
        _cms: true
      });
    });

    const apiSlugs = new Set(list.map((c) => c && c.slug).filter(Boolean));
    const fromApi = list
      .filter((c) => c && c.slug && bySlug.has(c.slug))
      .map((c) => bySlug.get(c.slug));
    const rest = Array.from(bySlug.values()).filter((c) => !apiSlugs.has(c.slug));
    w.CA.cursos = fromApi.concat(rest);
    w.CA.curso = (slug) => w.CA.cursos.find((c) => c.slug === slug);
  }

  w.CACursosMerge = {
    apply(payload) {
      mergeCursos(payload && payload.cursos);
    },
    async load() {
      ensureCA();
      const apiBase = (w.CA_API_BASE || "").replace(/\/$/, "");
      if (apiBase) {
        try {
          const res = await fetch(`${apiBase}/api/courses/public/feed`, { cache: "no-store" });
          if (res.ok) {
            const json = await res.json();
            if (Array.isArray(json.cursos) && json.cursos.length) {
              w.CA.cursos = [];
              mergeCursos(json.cursos);
            }
          }
        } catch (e) {
          /* API offline: mantém estático */
        }
      }
      return w.CA.cursos;
    }
  };
})(window);
