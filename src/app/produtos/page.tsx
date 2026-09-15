"use client";

import { useEffect, useMemo, useState } from "react";
import { SiteChrome } from "@/components/site-chrome";
import { ProductImageCarousel } from "@/components/product-image-carousel";
import { ProductShowcaseCarousel } from "@/components/product-showcase-carousel";
import {
  Product,
  formatBRL,
  listPublicProducts,
  productGallery,
  productWhatsAppUrl,
  productsWhatsAppUrl,
} from "@/lib/api";
import "./produtos.css";

export default function ProdutosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("Todos");

  useEffect(() => {
    listPublicProducts()
      .then((data) => setProducts(data.products || []))
      .catch((err) => setError(err instanceof Error ? err.message : "Erro ao carregar"))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category).filter(Boolean));
    return ["Todos", ...Array.from(set).sort()];
  }, [products]);

  const filtered = useMemo(
    () => (category === "Todos" ? products : products.filter((p) => p.category === category)),
    [products, category]
  );

  const featured = useMemo(
    () => products.filter((p) => p.featured).slice(0, 12),
    [products]
  );

  return (
    <SiteChrome active="produtos" brand="catools">
      <section className="prod-hero">
        <div className="container prod-hero__inner">
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
            <a className="btn btn--ghost btn--lg" href={productsWhatsAppUrl()} target="_blank" rel="noopener noreferrer">
              Falar no WhatsApp
            </a>
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
                <p>Filtre por categoria e veja as imagens de cada item no carrossel.</p>
              </div>

              <div className="prod-filters" role="tablist" aria-label="Categorias">
                {categories.map((c) => (
                  <button
                    key={c}
                    type="button"
                    role="tab"
                    aria-selected={category === c}
                    className={`chip${category === c ? " is-active" : ""}`}
                    onClick={() => setCategory(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </>
          ) : null}

          {!loading && !error && !products.length ? (
            <div className="prod-empty">Em breve novos produtos por aqui.</div>
          ) : null}

          <div className="prod-grid">
            {filtered.map((p) => {
              const images = productGallery(p);
              return (
                <article key={p.id} className="prod-card">
                  <ProductImageCarousel images={images} alt={p.name} />
                  <div className="prod-card__body">
                    <div className="prod-card__meta">
                      <span className="prod-card__cat">{p.category}</span>
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
