/* ==========================================================================
   CA CURSOS - Comportamento do site
   ========================================================================== */
(function () {
  "use strict";

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const esc = (s = "") => String(s).replace(/[&<>"']/g, m =>
    ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[m]));

  /* Ícones inline (Lucide-like) ------------------------------------------ */
  const ico = {
    check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    star:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
    clock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    play:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
    users:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/></svg>',
    layers:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 2 9 5-9 5-9-5 9-5z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/></svg>',
    search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>',
    chevron:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
    plus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    arrow:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    shield:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    award:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="m8.2 13.9-1.4 7.1L12 18l5.2 3-1.4-7.1"/></svg>',
    infinity:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6.5 8.5a3.5 3.5 0 1 0 0 7c2.5 0 3.5-3.5 5.5-3.5s3 3.5 5.5 3.5a3.5 3.5 0 1 0 0-7c-2.5 0-3.5 3.5-5.5 3.5S9 8.5 6.5 8.5z"/></svg>',
    mail:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 6 10-6"/></svg>',
    pin:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    wa:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.2-1.7-.9-2-1-.3-.1-.5-.2-.7.1-.2.3-.7 1-.9 1.2-.2.2-.3.2-.6.1-1.7-.9-2.9-1.6-4-3.6-.3-.5.3-.5.8-1.5.1-.2 0-.4 0-.5 0-.2-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.3 5.2 4.6 1.9.8 2.7.9 3.6.8.6-.1 1.7-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3zM12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3.1.8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2z"/></svg>',
    ig:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>',
    yt:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23 12s0-3.6-.5-5.3a2.8 2.8 0 0 0-2-2C18.8 4.2 12 4.2 12 4.2s-6.8 0-8.5.5a2.8 2.8 0 0 0-2 2C1 8.4 1 12 1 12s0 3.6.5 5.3c.3 1 1 1.7 2 2 1.7.5 8.5.5 8.5.5s6.8 0 8.5-.5a2.8 2.8 0 0 0 2-2C23 15.6 23 12 23 12zM9.8 15.3V8.7l5.7 3.3-5.7 3.3z"/></svg>',
    fb:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h3l1-3h-4v-2c0-.6.4-1 1-1z"/></svg>',
    info:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>',
    file:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7z"/><path d="M14 2v5h5"/></svg>',
    device:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="2" width="12" height="20" rx="2.5"/><path d="M11 18.5h2"/></svg>'
  };
  window.ICO = ico;

  const stars = (n) => `<span class="stars">${Array.from({length:5},(_,i)=>
    `<span style="opacity:${i < Math.round(n) ? 1 : .28}">${ico.star}</span>`).join("")}</span>`;

  /* Header ---------------------------------------------------------------- */
  const header = $(".header");
  if (header) {
    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive:true });
  }

  const burger = $(".burger"), mnav = $(".mobile-nav");
  if (burger && mnav) {
    burger.addEventListener("click", () => {
      const open = mnav.classList.toggle("is-open");
      burger.classList.toggle("is-open", open);
      burger.setAttribute("aria-expanded", String(open));
    });
    $$("a", mnav).forEach(a => a.addEventListener("click", () => {
      mnav.classList.remove("is-open"); burger.classList.remove("is-open");
    }));
  }

  /* Marca a página ativa na navegação ------------------------------------- */
  const here = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  $$(".nav a, .mobile-nav a").forEach(a => {
    const href = (a.getAttribute("href") || "").split("#")[0].toLowerCase();
    if (href && href === here) a.classList.add("is-active");
  });

  /* Links de WhatsApp / contato dinâmicos --------------------------------- */
  if (window.CA) {
    $$("[data-wa]").forEach(a => { a.href = CA.wa(a.dataset.wa || ""); });
    $$("[data-cfg]").forEach(el => {
      const v = CA.config[el.dataset.cfg];
      if (!v) return;
      if (el.tagName === "A") { el.href = /@/.test(v) ? "mailto:" + v : v; el.textContent = el.textContent.trim() || v; }
      else el.textContent = v;
    });
    $$("[data-cfg-href]").forEach(el => {
      const v = CA.config[el.dataset.cfgHref];
      if (v) el.href = v;
    });
  }

  /* As entradas por rolagem ficam no módulo de efeitos, no fim do arquivo. */

  /* Acordeões (FAQ e módulos) --------------------------------------------- */
  document.addEventListener("click", (e) => {
    const q = e.target.closest(".faq__q");
    if (q) { q.closest(".faq").classList.toggle("is-open"); return; }
    const m = e.target.closest(".module__head");
    if (m) { m.closest(".module").classList.toggle("is-open"); }
  });

  /* Templates ------------------------------------------------------------- */
  window.tplCurso = function (c) {
    const badge = c.badge ? `<span class="badge">${esc(c.badge)}</span>` : "";
    const meta = [];
    if (c.horas) meta.push(`<span>${ico.clock}${c.horas}h</span>`);
    else if (c.formato) meta.push(`<span>${ico.layers}${esc(c.formato.split("·")[0].trim())}</span>`);
    if (c.parcelas) meta.push(`<span>${esc(c.parcelas)}</span>`);
    const off = c.precoDe ? Math.round((1 - c.preco / c.precoDe) * 100) : 0;
    return `
    <a class="card course" href="curso.html?c=${encodeURIComponent(c.slug)}">
      <div class="course__thumb">
        <span class="course__glyph">${c.glyph}</span>
        <div class="course__tags">${badge}<span class="badge badge--neutral">${esc(c.nivel)}</span></div>
      </div>
      <div class="course__body">
        <span class="course__cat">${esc(CA.catNome(c.categoria))}</span>
        <h3 class="course__title">${esc(c.titulo)}</h3>
        <p style="font-size:.88rem;color:var(--muted);margin:8px 0 0;line-height:1.45">${esc(c.resumo)}</p>
        <div class="course__meta">${meta.join("")}</div>
        <div class="price">
          <b>${CA.brl(c.preco)}</b>${c.precoDe ? `<s>${CA.brl(c.precoDe)}</s>` : ""}
          ${off > 0 ? `<span class="badge badge--free">${off}% OFF</span>` : ""}
        </div>
      </div>
    </a>`;
  };

  const cursoFormato = (c) => {
    const f = String(c.formato || "").toLowerCase();
    if (f.includes("online") || f.includes("ead") || f.includes("gravad")) return "online";
    if (f.includes("presencial")) return "presencial";
    return "todos";
  };

  window.tplPricingCurso = function (c) {
    const popular = /mais procurado/i.test(c.badge || "") || c.slug === "curso-presencial-iniciante";
    const highlighted = /board repair|santos|iphone/i.test(c.titulo || "");
    const features = (c.beneficios && c.beneficios.length ? c.beneficios : (c.aprende || [])).slice(0, 5);
    const cls = [
      "pricing-card",
      popular ? "is-popular" : "",
      highlighted ? "is-highlighted" : ""
    ].filter(Boolean).join(" ");

    return `
    <article class="${cls}">
      ${highlighted ? `<div class="pricing-card__gridbg" aria-hidden="true"></div>` : ""}
      ${popular ? `<div class="pricing-card__glow" aria-hidden="true"></div>` : ""}
      <div class="pricing-card__top">
        <h3 class="pricing-card__name">
          ${esc(c.titulo)}
          ${popular ? `<span class="pricing-card__badge">Mais procurado</span>` : ""}
        </h3>
        <div class="pricing-card__price">
          <strong>${CA.brl(c.preco)}</strong>
          ${c.parcelas ? `<span>${esc(c.parcelas)}</span>` : `<span>${esc(c.formato || c.nivel || "")}</span>`}
        </div>
        <p class="pricing-card__desc">${esc(c.resumo)}</p>
      </div>
      <ul class="pricing-card__features">
        ${features.map(f => `<li><span class="pricing-card__check" aria-hidden="true">${ico.check}</span>${esc(f)}</li>`).join("")}
      </ul>
      <a class="btn ${highlighted ? "btn--ghost" : "btn--primary"} pricing-card__cta" href="curso.html?c=${encodeURIComponent(c.slug)}">
        Ver detalhes ${ico.arrow}
      </a>
    </article>`;
  };

  window.mountDestaquePricing = function (gridEl, tabsEl) {
    if (!gridEl || !window.CA) return;
    const all = CA.cursos.filter(c => c.destaque).slice(0, 4);
    let freq = "todos";

    const render = () => {
      const list = freq === "todos" ? all : all.filter(c => cursoFormato(c) === freq);
      gridEl.innerHTML = list.length
        ? list.map(window.tplPricingCurso).join("")
        : `<p class="pricing-empty">Nenhum curso nesse formato entre os destaques. <a href="cursos.html">Ver catálogo</a>.</p>`;
    };

    if (tabsEl) {
      $$(".pricing-tab", tabsEl).forEach(btn => {
        btn.addEventListener("click", () => {
          freq = btn.dataset.freq || "todos";
          $$(".pricing-tab", tabsEl).forEach(b => {
            const on = b === btn;
            b.classList.toggle("is-active", on);
            b.setAttribute("aria-selected", String(on));
          });
          render();
        });
      });
    }
    render();
  };

  window.tplAula = function (a) {
    return `
    <a class="card" href="aulas.html?v=${encodeURIComponent(a.id)}">
      <div class="post-card__thumb">
        <img src="https://img.youtube.com/vi/${a.yt}/hqdefault.jpg" alt="" loading="lazy"
             onerror="this.remove()">
      </div>
      <div class="post-card__body">
        <span class="course__cat">${esc(CA.catNome(a.categoria))}</span>
        <h3>${esc(a.titulo)}</h3>
        <div class="post-meta">
          <span>${ico.clock} ${a.duracao}</span>
          <span>${a.views} visualizações</span>
          <span class="badge badge--free">Gratuita</span>
        </div>
      </div>
    </a>`;
  };

  window.tplPost = function (p) {
    return `
    <a class="card" href="post.html?p=${encodeURIComponent(p.slug)}">
      <div class="post-card__thumb">${p.glyph}</div>
      <div class="post-card__body">
        <span class="course__cat">${esc(p.categoria)}</span>
        <h3>${esc(p.titulo)}</h3>
        <p>${esc(p.resumo)}</p>
        <div class="post-meta">
          <span>${CA.dataBR(p.data)}</span><span>${esc(p.leitura)} de leitura</span>
        </div>
      </div>
    </a>`;
  };

  window.tplDepoimento = function () {
    return "";
  };

  /* Avaliações oficiais do Google (layout social proof) ------------------- */
  const googleG = `
    <svg class="gr-g" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>`;

  const starRow = (n, cls = "gr-stars") => {
    const rating = Number(n) || 0;
    return `<div class="${cls}" aria-label="${rating} de 5 estrelas">${
      Array.from({ length: 5 }, (_, i) => {
        const on = i < Math.round(rating);
        return `<span class="gr-star${on ? " is-on" : ""}" aria-hidden="true">★</span>`;
      }).join("")
    }</div>`;
  };

  const initials = (name = "") => {
    const parts = String(name).trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return "G";
    return ((parts[0][0] || "") + (parts[1]?.[0] || "")).toUpperCase();
  };

  const avatarHue = (name = "") => {
    let h = 0;
    for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
    return h % 360;
  };

  const getGoogleConfig = () =>
    (window.CA && window.CA.config && window.CA.config.google) || {};

  const normalizeRelativeDate = (s = "") => {
    let t = String(s).trim();
    if (!t) return "";
    t = t
      .replace(/\batrás\b/gi, "")
      .replace(/\ba year ago\b/i, "há 1 ano")
      .replace(/\ban? (\d+) years? ago\b/i, "há $1 anos")
      .replace(/\ban? (\d+) months? ago\b/i, "há $1 meses")
      .replace(/\ban? (\d+) weeks? ago\b/i, "há $1 semanas")
      .replace(/\ban? (\d+) days? ago\b/i, "há $1 dias")
      .replace(/\s+/g, " ")
      .trim();
    if (t && !/^há\b/i.test(t)) t = "há " + t;
    return t;
  };

  const reviewKey = (r) =>
    ((r.name || "") + "|" + String(r.text || "").slice(0, 120)).toLowerCase();

  const mergeReviews = (...lists) => {
    const map = new Map();
    lists.flat().forEach(r => {
      if (!r || !r.text || !r.name) return;
      const k = reviewKey(r);
      if (!map.has(k)) map.set(k, r);
    });
    return Array.from(map.values());
  };

  const mapPlacesReviews = (payload = {}) => {
    const reviews = Array.isArray(payload.reviews) ? payload.reviews : [];
    return reviews.map(r => {
      const author = r.authorAttribution || {};
      return {
        name: author.displayName || "Usuário do Google",
        relativeDate: normalizeRelativeDate(r.relativePublishTimeDescription || ""),
        rating: Number(r.rating) || 0,
        text: (r.text && r.text.text) || (r.originalText && r.originalText.text) || "",
        avatar: author.photoUri || "",
        url: author.uri || ""
      };
    }).filter(r => r.text);
  };

  const fetchPlaceByLang = async (placeId, key, lang) => {
    const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=${encodeURIComponent(lang)}`;
    const res = await fetch(url, {
      headers: {
        "X-Goog-Api-Key": key,
        "X-Goog-FieldMask": "id,displayName,rating,userRatingCount,reviews"
      }
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.error) {
      throw new Error((data.error && data.error.message) || ("Places API " + res.status));
    }
    return data;
  };

  const fetchGooglePlaceLive = async () => {
    const g = getGoogleConfig();
    const key = g.apiKey;
    const placeId = g.placeId;
    if (!key || !placeId) return null;
    if (location.protocol === "file:") return null;

    const cacheKey = `ca-google-place-v2:${placeId}`;
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.expires > Date.now() && parsed.data && !parsed.data.error) {
          return parsed.data;
        }
      }
    } catch (_) {}

    const langs = ["pt-BR", "pt", "en", "es"];
    const settled = await Promise.allSettled(
      langs.map(lang => fetchPlaceByLang(placeId, key, lang))
    );
    const payloads = settled
      .filter(r => r.status === "fulfilled")
      .map(r => r.value);
    if (!payloads.length) throw new Error("Places API indisponível");

    const base = payloads[0];
    const allReviews = mergeReviews(...payloads.map(mapPlacesReviews));
    const data = {
      ...base,
      reviews: allReviews.map(r => ({
        rating: r.rating,
        relativePublishTimeDescription: r.relativeDate,
        text: { text: r.text },
        authorAttribution: {
          displayName: r.name,
          photoUri: r.avatar,
          uri: r.url
        }
      })),
      _mapped: allReviews
    };

    try {
      sessionStorage.setItem(cacheKey, JSON.stringify({
        expires: Date.now() + 6 * 60 * 60 * 1000,
        data
      }));
    } catch (_) {}
    return data;
  };

  const renderReviewCard = (r, idx, reviewsHref) => {
    const name = r.name || "Avaliação no Google";
    const text = r.text || "Leia esta avaliação no perfil oficial da CA Cursos no Google.";
    const href = r.url || reviewsHref;
    const photo = r.avatar
      ? `<img class="gr-card__avatar" src="${esc(r.avatar)}" alt="" width="44" height="44" loading="lazy" referrerpolicy="no-referrer">`
      : `<span class="gr-card__avatar gr-card__avatar--letter" style="--gr-hue:${avatarHue(name)}" aria-hidden="true">${esc(initials(name))}</span>`;

    return `
      <a class="gr-card" href="${esc(href)}" target="_blank" rel="noopener" style="--gr-i:${idx}">
        <div class="gr-card__top">
          ${photo}
          <div class="gr-card__who">
            <b>${esc(name)}</b>
            <div class="gr-card__meta">
              ${starRow(r.rating != null ? r.rating : 5, "gr-stars gr-stars--sm")}
              ${r.relativeDate ? `<span>${esc(r.relativeDate)}</span>` : ""}
            </div>
          </div>
        </div>
        <p class="gr-card__text">“${esc(text)}”</p>
        <span class="gr-card__source">Publicado no Google</span>
      </a>`;
  };

  window.tplGoogleReviews = function (live) {
    const g = getGoogleConfig();
    const brand = (window.CA && window.CA.config && window.CA.config.nome) || "CA Cursos";
    const rating = Number((live && live.rating) || g.rating) || 0;
    const count = Number((live && live.userRatingCount) || g.reviewCount) || 0;
    const ratingLabel = rating ? rating.toFixed(1).replace(".", ",") : "-";
    const countLabel = count
      ? count.toLocaleString("pt-BR") + " avaliações"
      : "avaliações";
    const reviewsHref = g.reviewsUrl || g.profileUrl || "#";
    const writeHref = g.writeUrl || "#";
    const profileHref = g.profileUrl || reviewsHref;
    const minCard = Number(g.minCardRating != null ? g.minCardRating : 5);
    const limit = Number(g.carouselLimit != null ? g.carouselLimit : 30);

    const seeded = Array.isArray(g.featuredReviews)
      ? g.featuredReviews.filter(r => r && r.text && r.name)
      : [];
    const liveMapped = (live && live._mapped)
      ? live._mapped
      : (live ? mapPlacesReviews(live) : []);

    const blockedNames = /genildo\s+moreira|pedro\s+akira|guilherme\s+augusto|vanderson\s+lourenco/i;
    const looksEnglish = (t) => {
      const s = String(t || "");
      const en = (s.match(/\b(the|and|was|with|very|really|amazing|experience|recommend|everyone|devices|about|good|only|try|know|how|it|is|to|learn|electronics)\b/gi) || []).length;
      const pt = (s.match(/\b(que|com|para|muito|escola|curso|aprendi|ótimo|otimo|excelente|recomendo|professor|aulas)\b/gi) || []).length;
      return en >= 4 && en > pt;
    };
    const isThinReview = (t) => {
      const s = String(t || "").replace(/[.…!?\s]+/g, " ").trim();
      const words = s.split(/\s+/).filter(Boolean);
      return s.length < 28 || words.length < 4;
    };
    const isQualityReview = (r) => {
      if (!r || !r.text || !r.name) return false;
      if (blockedNames.test(r.name)) return false;
      if (looksEnglish(r.text)) return false;
      if (isThinReview(r.text)) return false;
      if (/\?/.test(r.text) && r.text.trim().length < 80) return false; // perguntas curtas tipo Genildo
      return true;
    };

    let featured = mergeReviews(seeded, liveMapped)
      .filter(r => Number(r.rating) >= minCard)
      .filter(isQualityReview)
      .sort((a, b) => (b.text || "").length - (a.text || "").length)
      .slice(0, limit);

    if (featured.length) g.featuredReviews = featured;

    const fallbackCards = [
      {
        name: "Nota no Google",
        relativeDate: "perfil oficial",
        rating: 5,
        text: `A ${brand} mantém média ${ratingLabel} entre centenas de avaliações públicas no Google.`
      },
      {
        name: count ? count.toLocaleString("pt-BR") + " avaliações" : "Avaliações",
        relativeDate: "atualizado no Google",
        rating: 5,
        text: "Depoimentos reais de quem passou pela escola. Abra o perfil para ler cada avaliação completa."
      },
      {
        name: "Escola técnica",
        relativeDate: "Goiânia, GO",
        rating: 5,
        text: `${(live && live.displayName && live.displayName.text) || g.name || brand}. Formação prática em manutenção de smartphones.`
      }
    ];

    const list = featured.length ? featured : fallbackCards;
    const cards = list.map((r, idx) => renderReviewCard(r, idx, reviewsHref)).join("");
    const duration = Math.max(32, list.length * 5);
    const track = `
      <div class="gr__slide">${cards}</div>
      <div class="gr__slide" aria-hidden="true">${cards}</div>`;

    return `
    <div class="gr">
      <div class="gr__head">
        <span class="gr-badge">${googleG}<span>Avaliações no Google</span></span>
        <h2 class="gr__title">O Que Nossos Clientes Dizem No Google</h2>
        <div class="gr__score">
          ${starRow(rating)}
          <strong>${esc(ratingLabel)}</strong>
          <a href="${esc(reviewsHref)}" target="_blank" rel="noopener">${esc(countLabel)}</a>
        </div>
        <p class="gr__lead">Depoimentos reais de 5 estrelas de quem usa a ${esc(brand)} no dia a dia</p>
      </div>
      <div class="gr__carousel" style="--gr-duration:${duration}s">
        <div class="gr__track">${track}</div>
      </div>
      <div class="gr__actions">
        <a class="btn gr-btn gr-btn--dark" href="${esc(profileHref)}" target="_blank" rel="noopener">Ver todas no Google</a>
        <a class="btn gr-btn gr-btn--blue" href="${esc(writeHref)}" target="_blank" rel="noopener">Avaliar a ${esc(brand)}</a>
      </div>
    </div>`;
  };

  window.mountGoogleReviews = function (el) {
    if (!el) return;
    el.classList.remove("grid", "grid--3");
    el.classList.add("google-reviews-host");
    const section = el.closest("section");
    if (section) {
      section.classList.add("section--google");
      const head = section.querySelector(":scope > .container > .section-head");
      if (head) head.hidden = true;
    }
    el.innerHTML = window.tplGoogleReviews();

    const g = getGoogleConfig();
    if (!g.apiKey || !g.placeId || location.protocol === "file:") return;

    fetchGooglePlaceLive()
      .then(live => {
        if (!live) return;
        if (live.rating != null) g.rating = live.rating;
        if (live.userRatingCount != null) g.reviewCount = live.userRatingCount;
        if (live.displayName && live.displayName.text) g.name = live.displayName.text;
        el.innerHTML = window.tplGoogleReviews(live);
      })
      .catch(err => {
        console.warn("[CA Cursos] Não foi possível atualizar avaliações do Google:", err && err.message ? err.message : err);
      });
  };

  window.CAstars = stars;
  window.CAesc = esc;

  /* Formulários (demo, sem back-end) ------------------------------------- */
  $$("form[data-demo]").forEach(f => {
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      const ok = $(".form-ok", f) || f.nextElementSibling;
      if (ok && ok.classList.contains("form-ok")) ok.classList.add("is-visible");
      f.reset();
    });
  });

  /* Ano no rodapé --------------------------------------------------------- */
  $$("[data-year]").forEach(el => el.textContent = new Date().getFullYear());
})();

/* ==========================================================================
   Tema claro/escuro
   O tema já é aplicado no <head> (script anti-flash); aqui fica só o botão.
   ========================================================================== */
(function () {
  "use strict";
  const root = document.documentElement;
  const meta = document.querySelector('meta[name="theme-color"]');
  const COR = { dark: "#0A0A0D", light: "#FFFFFF" };
  const PADRAO = "light";   /* o tema claro é o principal do site */

  function aplicar(tema) {
    root.setAttribute("data-theme", tema);
    if (meta) meta.setAttribute("content", COR[tema] || COR.dark);
    document.querySelectorAll(".theme-toggle").forEach(b => {
      b.setAttribute("aria-pressed", String(tema === "light"));
      b.title = tema === "light" ? "Mudar para o tema escuro" : "Mudar para o tema claro";
    });
  }

  aplicar(root.getAttribute("data-theme") || PADRAO);

  document.querySelectorAll(".theme-toggle").forEach(btn => {
    btn.addEventListener("click", () => {
      const atual = root.getAttribute("data-theme") || PADRAO;
      const novo = atual === "light" ? "dark" : "light";
      aplicar(novo);
      try { localStorage.setItem("ca-theme", novo); } catch (e) {}
    });
  });

})();

/* ==========================================================================
   Efeitos
   Entradas por rolagem, contadores, brilho que segue o cursor, inclinação
   dos painéis e barra de progresso. Tudo decorativo: se algo aqui falhar,
   a página continua completa.
   ========================================================================== */
(function () {
  "use strict";

  const menosMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const comMouse = window.matchMedia("(hover:hover) and (pointer:fine)").matches;

  /* --- 1. Entradas por rolagem ------------------------------------------ */
  const io = new IntersectionObserver(entradas => {
    entradas.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add("is-in");
      io.unobserve(e.target);
    });
  }, { threshold: .1, rootMargin: "0px 0px -8%" });

  /* Blocos que entram sozinhos */
  const SOLTOS = [
    ".section-head", ".cta-band", ".featured-post", ".author-box",
    ".article > .callout", ".article > figure", ".playlist", ".now-playing",
    ".module", ".faq", ".widget", ".google-reviews-host"
  ].join(",");

  /* Contêineres cujos filhos entram em sequência */
  const LISTAS = ".grid, .steps, .stats, .trust__row, .story-grid, .pricing-grid";

  function prepararReveal(escopo) {
    escopo.querySelectorAll(LISTAS).forEach(cont => {
      cont.classList.remove("reveal");
      Array.prototype.forEach.call(cont.children, (filho, i) => {
        if (filho.dataset.rv) return;
        filho.dataset.rv = "1";
        filho.classList.add("reveal");
        filho.style.setProperty("--i", String(Math.min(i, 7)));
      });
    });

    escopo.querySelectorAll(SOLTOS).forEach(el => {
      if (el.dataset.rv) return;
      el.dataset.rv = "1";
      el.classList.add("reveal");
    });

    /* Um .reveal com vários filhos vira sequência nos filhos */
    escopo.querySelectorAll(".reveal").forEach(el => {
      if (el.dataset.rvSeq || el.children.length < 2) return;
      if (!el.matches(".grid, .steps, .stats, .trust__row, .story-grid") && el.id) {
        el.dataset.rvSeq = "1";
        el.classList.remove("reveal");
        Array.prototype.forEach.call(el.children, (filho, i) => {
          if (filho.dataset.rv) return;
          filho.dataset.rv = "1";
          filho.classList.add("reveal");
          filho.style.setProperty("--i", String(Math.min(i, 7)));
        });
      }
    });

    escopo.querySelectorAll(".reveal:not(.is-in)").forEach(el => io.observe(el));
  }

  /* --- 2. Contadores ----------------------------------------------------- */
  let contando = 0;
  function animarNumero(el) {
    const bruto = el.textContent.trim();
    const m = bruto.match(/^(\d[\d.,]*)(.*)$/);
    if (!m) return;
    const sufixo = m[2];
    const temVirgula = m[1].includes(",");
    const alvo = parseFloat(m[1].replace(/\./g, "").replace(",", "."));
    /* Números pequenos não ganham nada em contar; 1 viraria só 0 e 1. */
    if (!isFinite(alvo) || alvo < 10) return;
    const casas = temVirgula ? 1 : 0;
    const dur = 1100, ini = performance.now();
    contando++;
    el.style.fontVariantNumeric = "tabular-nums";
    function passo(agora) {
      const t = Math.min(1, (agora - ini) / dur);
      const suave = 1 - Math.pow(1 - t, 3);
      el.textContent = (alvo * suave).toLocaleString("pt-BR", {
        minimumFractionDigits: casas, maximumFractionDigits: casas
      }) + sufixo;
      if (t < 1) { requestAnimationFrame(passo); }
      else { el.textContent = bruto; contando--; }
    }
    requestAnimationFrame(passo);
  }

  const ioNum = new IntersectionObserver(entradas => {
    entradas.forEach(e => {
      if (!e.isIntersecting) return;
      ioNum.unobserve(e.target);
      animarNumero(e.target);
    });
  }, { threshold: .6 });

  function prepararNumeros(escopo) {
    escopo.querySelectorAll(".stat b, .hero__proof b, .gr__score strong").forEach(el => {
      if (el.dataset.num || !/^\d/.test(el.textContent.trim())) return;
      el.dataset.num = "1";
      ioNum.observe(el);
    });
  }

  /* --- 3. Brilho que segue o cursor -------------------------------------- */
  const BLOCOS = ".card, .cat-tile, .step, .stat, .quote, .contact-tile, .gr-card";
  if (comMouse && !menosMovimento) {
    let alvo = null, cx = 0, cy = 0, agendado = false;
    document.addEventListener("pointermove", e => {
      const el = e.target.closest && e.target.closest(BLOCOS);
      if (!el) return;
      alvo = el; cx = e.clientX; cy = e.clientY;
      if (agendado) return;
      agendado = true;
      requestAnimationFrame(() => {
        agendado = false;
        if (!alvo) return;
        const r = alvo.getBoundingClientRect();
        if (!r.width || !r.height) return;
        alvo.style.setProperty("--mx", (((cx - r.left) / r.width) * 100).toFixed(1) + "%");
        alvo.style.setProperty("--my", (((cy - r.top) / r.height) * 100).toFixed(1) + "%");
      });
    }, { passive: true });
  }

  /* --- 4. Inclinação suave do painel do hero ----------------------------- */
  function prepararTilt(escopo) {
    if (!comMouse || menosMovimento) return;
    escopo.querySelectorAll(".hero__panel").forEach(el => {
      if (el.dataset.tilt) return;
      el.dataset.tilt = "1";
      el.classList.add("tilt");
      let agendado = false, ex = 0, ey = 0;
      el.addEventListener("pointermove", e => {
        ex = e.clientX; ey = e.clientY;
        if (agendado) return;
        agendado = true;
        requestAnimationFrame(() => {
          agendado = false;
          const r = el.getBoundingClientRect();
          const px = (ex - r.left) / r.width - .5;
          const py = (ey - r.top) / r.height - .5;
          el.style.setProperty("--ry", (px * 7).toFixed(2) + "deg");
          el.style.setProperty("--rx", (-py * 7).toFixed(2) + "deg");
        });
      }, { passive: true });
      el.addEventListener("pointerleave", () => {
        el.style.setProperty("--rx", "0deg");
        el.style.setProperty("--ry", "0deg");
      });
    });
  }

  /* --- 5. Barra de progresso de leitura ---------------------------------- */
  if (!menosMovimento) {
    const barra = document.createElement("div");
    barra.className = "scroll-progress";
    barra.setAttribute("role", "presentation");
    document.body.appendChild(barra);
    let agendado = false;
    const atualizar = () => {
      const alcance = document.documentElement.scrollHeight - window.innerHeight;
      if (alcance < 400) { barra.classList.remove("is-on"); return; }
      barra.classList.add("is-on");
      barra.style.setProperty("--p", Math.min(1, window.scrollY / alcance).toFixed(4));
    };
    window.addEventListener("scroll", () => {
      if (agendado) return;
      agendado = true;
      requestAnimationFrame(() => { agendado = false; atualizar(); });
    }, { passive: true });
    window.addEventListener("resize", atualizar, { passive: true });
    atualizar();
  }

  /* --- 6. Roda agora e a cada novo conteúdo montado por JavaScript -------- */
  function montar(escopo) {
    prepararReveal(escopo || document);
    prepararNumeros(escopo || document);
    prepararTilt(escopo || document);
  }
  montar(document);

  let pendente = false;
  new MutationObserver(() => {
    if (pendente || contando > 0) return;
    pendente = true;
    requestAnimationFrame(() => { pendente = false; montar(document); });
  }).observe(document.body, { childList: true, subtree: true });

  /* Rede de segurança: nada pode ficar invisível por falha de observador. */
  window.addEventListener("load", () => {
    setTimeout(() => {
      document.querySelectorAll(".reveal:not(.is-in)").forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) el.classList.add("is-in");
      });
    }, 1200);
  });
})();
