"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { SiteChrome } from "@/components/site-chrome";
import { ProductImageCarousel } from "@/components/product-image-carousel";
import {
  Product,
  formatBRL,
  getPublicProductBySlug,
  listPublicProducts,
  productGallery,
  productWhatsAppUrl,
} from "@/lib/api";
import "../produtos.css";

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = String(params.slug || "");
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const { product: p } = await getPublicProductBySlug(slug);
        if (cancelled) return;
        setProduct(p);
        setError("");

        const list = await listPublicProducts(
          p.categoryId ? { categoryId: p.categoryId } : { category: p.category }
        );
        if (cancelled) return;
        setRelated((list.products || []).filter((item) => item.id !== p.id).slice(0, 4));
      } catch (err) {
        if (!cancelled) {
          setProduct(null);
          setError(err instanceof Error ? err.message : "Produto não encontrado");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const images = useMemo(() => (product ? productGallery(product) : []), [product]);
  const catLabel = product?.categoryRef?.name || product?.category || "";

  return (
    <SiteChrome active="produtos" brand="catools">
      <section className="pdp">
        <div className="container">
          {loading ? <p className="prod-status">Carregando produto…</p> : null}

          {!loading && error ? (
            <div className="prod-empty">
              <p>{error}</p>
              <Link href="/produtos" className="btn btn--primary" style={{ marginTop: 16 }}>
                Voltar à vitrine
              </Link>
            </div>
          ) : null}

          {!loading && product ? (
            <>
              <nav className="pdp__breadcrumb" aria-label="Breadcrumb">
                <Link href="/index.html">Início</Link>
                <ChevronRight size={14} aria-hidden />
                <Link href="/produtos">Produtos</Link>
                <ChevronRight size={14} aria-hidden />
                {catLabel ? (
                  <>
                    <span>{catLabel}</span>
                    <ChevronRight size={14} aria-hidden />
                  </>
                ) : null}
                <span aria-current="page">{product.name}</span>
              </nav>

              <div className="pdp__grid">
                <div className="pdp__gallery">
                  <ProductImageCarousel images={images} alt={product.name} />
                </div>

                <div className="pdp__info">
                  <p className="eyebrow">CA Tools</p>
                  <h1>{product.name}</h1>

                  <div className="pdp__meta">
                    {product.reference ? (
                      <span className="pdp__chip">
                        Ref: <strong>{product.reference}</strong>
                      </span>
                    ) : null}
                    {catLabel ? <span className="pdp__chip">{catLabel}</span> : null}
                    {product.featured ? <span className="pdp__chip pdp__chip--feat">Destaque</span> : null}
                  </div>

                  <div className="pdp__price">
                    <strong>{formatBRL(product.price)}</strong>
                    {product.compareAt && product.compareAt > product.price ? (
                      <s>{formatBRL(product.compareAt)}</s>
                    ) : null}
                  </div>

                  <div className="pdp__actions">
                    <a
                      className="btn btn--primary btn--lg"
                      href={productWhatsAppUrl(product)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {product.buttonLabel || "Quero este produto"}
                    </a>
                    <Link className="btn btn--ghost btn--lg pdp__btn-all" href="/produtos">
                      Ver todos
                    </Link>
                  </div>

                  <div className="pdp__desc">
                    <h2>Descrição</h2>
                    <p>{product.description}</p>
                  </div>
                </div>
              </div>

              {related.length > 0 ? (
                <section className="pdp__related">
                  <div className="section-head" style={{ marginBottom: 18 }}>
                    <span className="eyebrow">Relacionados</span>
                    <h2>Produtos relacionados</h2>
                  </div>
                  <div className="pdp__related-grid">
                    {related.map((item) => {
                      const cover = productGallery(item)[0];
                      return (
                        <Link key={item.id} href={`/produtos/${item.slug}`} className="pdp__related-card">
                          <div className="pdp__related-media">
                            {cover ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={cover} alt="" />
                            ) : (
                              <span>Sem imagem</span>
                            )}
                          </div>
                          <div className="pdp__related-body">
                            <h3>{item.name}</h3>
                            {item.reference ? <p>Ref: {item.reference}</p> : null}
                            <strong>{formatBRL(item.price)}</strong>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </section>
              ) : null}
            </>
          ) : null}
        </div>
      </section>
    </SiteChrome>
  );
}
