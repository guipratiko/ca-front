"use client";

import { useEffect, useMemo, useState } from "react";
import { SiteChrome } from "@/components/site-chrome";
import { ProductImageCarousel } from "@/components/product-image-carousel";
import { ProductShowcaseCarousel } from "@/components/product-showcase-carousel";
import {
  Category,
  Product,
  formatBRL,
  listPublicCategories,
  listPublicProducts,
  productGallery,
  productWhatsAppUrl,
  productsWhatsAppUrl,
} from "@/lib/api";
import "./produtos.css";

const PRICE_PRESETS = [
  { id: "all", label: "Qualquer preço", min: undefined, max: undefined },
  { id: "0-100", label: "Até R$ 100", min: 0, max: 100 },
  { id: "100-300", label: "R$ 100 – 300", min: 100, max: 300 },
  { id: "300-600", label: "R$ 300 – 600", min: 300, max: 600 },
  { id: "600+", label: "Acima de R$ 600", min: 600, max: undefined },
] as const;

export default function ProdutosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categoryId, setCategoryId] = useState("Todos");
  const [pricePreset, setPricePreset] = useState<(typeof PRICE_PRESETS)[number]["id"]>("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    Promise.all([listPublicProducts(), listPublicCategories()])
      .then(([prodData, catData]) => {
        setProducts(prodData.products || []);
        setCategories(catData.categories || []);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Erro ao carregar"))
      .finally(() => setLoading(false));
  }, []);

  const categoryOptions = useMemo(() => {
    if (categories.length) {
      return [
        { id: "Todos", name: "Todos" },
        ...categories.map((c) => ({ id: c.id, name: c.name })),
      ];
    }
    const names = Array.from(new Set(products.map((p) => p.category).filter(Boolean))).sort();
    return [{ id: "Todos", name: "Todos" }, ...names.map((n) => ({ id: n, name: n }))];
  }, [categories, products]);

  const filtered = useMemo(() => {
    const preset = PRICE_PRESETS.find((p) => p.id === pricePreset) || PRICE_PRESETS[0];
    const minManual = minPrice.trim() ? Number(String(minPrice).replace(",", ".")) : undefined;
    const maxManual = maxPrice.trim() ? Number(String(maxPrice).replace(",", ".")) : undefined;
    const min =
      minManual != null && Number.isFinite(minManual)
        ? minManual
        : preset.min;
    const max =
      maxManual != null && Number.isFinite(maxManual)
        ? maxManual
        : preset.max;

    return products.filter((p) => {
      if (categoryId !== "Todos") {
        const byId = p.categoryId === categoryId;
        const byName = p.category === categoryId || p.categoryRef?.name === categoryId;
        if (!byId && !byName) return false;
      }
      if (min != null && p.price < min) return false;
      if (max != null && p.price > max) return false;
      return true;
    });
  }, [products, categoryId, pricePreset, minPrice, maxPrice]);

  const featured = useMemo(
    () => products.filter((p) => p.featured).slice(0, 12),
    [products]
  );

  const clearPrice = () => {
    setPricePreset("all");
    setMinPrice("");
    setMaxPrice("");
  };

  return (
    <SiteChrome active="produtos" brand="catools">
      <section className="prod-hero">
        <div className="container">
          <div className="prod-hero__panel">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="prod-hero__logo"
              src="/assets/img/logo-ca-tools.png"
              alt="CA Tools"
            />
            <span className="eyebrow">CA Tools · Vitrine oficial</span>
            <h1>
              Produtos para a <span className="grad-text">bancada</span>
            </h1>
            <p className="lead">
              Kits, ferramentas e itens selecionados para quem está começando ou evoluindo na
              manutenção de celulares — no mesmo padrão visual do site.
            </p>
            <div className="prod-hero__cta">
              <a className="btn btn--primary btn--lg" href="#vitrine">
                Ver produtos
              </a>
              <a
                className="btn btn--ghost btn--lg"
                href={productsWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
              >
                Falar no WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="vitrine">
        <div className="container">
          {loading ? <p className="prod-status">Carregando produtos…</p> : null}
          {error ? <p className="prod-status prod-status--error">{error}</p> : null}

          {!loading && featured.length > 0 ? (
            <ProductShowcaseCarousel products={featured} />
          ) : null}

          {!loading && !error && products.length > 0 ? (
            <>
              <div className="section-head" style={{ marginBottom: 18 }}>
                <span className="eyebrow">Catálogo</span>
                <h2>Todos os produtos</h2>
                <p>Filtre por categoria e faixa de preço.</p>
              </div>

              <div className="prod-filters-block">
                <p className="prod-filters__label">Categoria</p>
                <div className="prod-filters" role="tablist" aria-label="Categorias">
                  {categoryOptions.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      role="tab"
                      aria-selected={categoryId === c.id}
                      className={`chip${categoryId === c.id ? " is-active" : ""}`}
                      onClick={() => setCategoryId(c.id)}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>

                <p className="prod-filters__label">Faixa de preço</p>
                <div className="prod-filters" role="tablist" aria-label="Faixas de preço">
                  {PRICE_PRESETS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      role="tab"
                      aria-selected={pricePreset === p.id && !minPrice && !maxPrice}
                      className={`chip${
                        pricePreset === p.id && !minPrice && !maxPrice ? " is-active" : ""
                      }`}
                      onClick={() => {
                        setPricePreset(p.id);
                        setMinPrice("");
                        setMaxPrice("");
                      }}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                <div className="prod-price-inputs">
                  <label>
                    <span>Mín. (R$)</span>
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      placeholder="0"
                      value={minPrice}
                      onChange={(e) => {
                        setMinPrice(e.target.value);
                        setPricePreset("all");
                      }}
                    />
                  </label>
                  <label>
                    <span>Máx. (R$)</span>
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      placeholder="1000"
                      value={maxPrice}
                      onChange={(e) => {
                        setMaxPrice(e.target.value);
                        setPricePreset("all");
                      }}
                    />
                  </label>
                  {(minPrice || maxPrice || pricePreset !== "all") && (
                    <button type="button" className="chip" onClick={clearPrice}>
                      Limpar preço
                    </button>
                  )}
                </div>

                <p className="prod-filters__count">
                  {filtered.length === 1
                    ? "1 produto encontrado"
                    : `${filtered.length} produtos encontrados`}
                </p>
              </div>
            </>
          ) : null}

          {!loading && !error && !products.length ? (
            <div className="prod-empty">Em breve novos produtos por aqui.</div>
          ) : null}

          {!loading && products.length > 0 && !filtered.length ? (
            <div className="prod-empty">Nenhum produto nesta combinação de filtros.</div>
          ) : null}

          <div className="prod-grid">
            {filtered.map((p) => {
              const images = productGallery(p);
              const catLabel = p.categoryRef?.name || p.category;
              return (
                <article key={p.id} className="prod-card">
                  <ProductImageCarousel images={images} alt={p.name} />
                  <div className="prod-card__body">
                    <div className="prod-card__meta">
                      <span className="prod-card__cat">{catLabel}</span>
                      {p.featured ? <span className="prod-card__feat">Destaque</span> : null}
                    </div>
                    <h3>{p.name}</h3>
                    <p className="prod-card__desc">{p.description}</p>
                    <div className="prod-card__price">
                      <strong>{formatBRL(p.price)}</strong>
                      {p.compareAt && p.compareAt > p.price ? (
                        <s>{formatBRL(p.compareAt)}</s>
                      ) : null}
                    </div>
                    {p.reference ? (
                      <p className="prod-card__ref">Ref: {p.reference}</p>
                    ) : null}
                    <a
                      className="btn btn--primary"
                      href={productWhatsAppUrl(p)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {p.buttonLabel || "Quero este produto"}
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </SiteChrome>
  );
}
