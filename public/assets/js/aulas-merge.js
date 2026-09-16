/* Mescla vídeo aulas abertas da API com CA.aulas. */
(function (w) {
  function ensureCA() {
    w.CA = w.CA || {};
    if (!Array.isArray(w.CA.aulas)) w.CA.aulas = [];
  }

  function mergeAulas(list) {
    ensureCA();
    if (!Array.isArray(list) || !list.length) return;

    const byId = new Map(w.CA.aulas.map((a) => [a.id, a]));
    list.forEach((a) => {
      if (!a || !a.id || !a.titulo || !a.yt) return;
      byId.set(a.id, {
        id: a.id,
        yt: a.yt,
        titulo: a.titulo,
        categoria: a.categoria || "iniciante",
        duracao: a.duracao || "",
        views: a.views || "",
        data: a.data || new Date().toISOString().slice(0, 10),
        desc: a.desc || "",
        _cms: true
      });
    });

    // Preferência: aulas da API primeiro (por ordem do feed), depois estáticas restantes
    const apiIds = new Set(list.map((a) => a && a.id).filter(Boolean));
    const fromApi = list
      .filter((a) => a && a.id && byId.has(a.id))
      .map((a) => byId.get(a.id));
    const rest = Array.from(byId.values()).filter((a) => !apiIds.has(a.id));
    w.CA.aulas = fromApi.concat(rest);
  }

  w.CAAulasMerge = {
    apply(payload) {
      mergeAulas(payload && payload.aulas);
    },
    async load() {
      ensureCA();
      const apiBase = (w.CA_API_BASE || "").replace(/\/$/, "");
      if (apiBase) {
        try {
          const res = await fetch(`${apiBase}/api/lessons/public/feed`, { cache: "no-store" });
          if (res.ok) {
            const json = await res.json();
            if (Array.isArray(json.aulas) && json.aulas.length) {
              // API é fonte de verdade quando há aulas publicadas
              w.CA.aulas = [];
              mergeAulas(json.aulas);
            }
          }
        } catch (e) {
          /* API offline: mantém estático */
        }
      }
      return w.CA.aulas;
    }
  };
})(window);
