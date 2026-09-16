"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Product, formatBRL, productGallery } from "@/lib/api";

/** Faixa horizontal de cards - inspirado no Carousel Cards (21st / kokonutd). */
export function ProductShowcaseCarousel({ products }: { products: Product[] }) {
  const router = useRouter();
  const scroller = useRef<HTMLDivElement>(null);

  if (!products.length) return null;

  const scrollBy = (dir: -1 | 1) => {
    scroller.current?.scrollBy({ left: dir * 300, behavior: "smooth" });
  };

  return (
    <div className="prod-strip">
      <div className="prod-strip__head">
        <div>
          <span className="eyebrow">Destaques</span>
          <h2>Escolhas da bancada</h2>
        </div>
        <div className="prod-strip__controls">
          <button type="button" className="prod-strip__btn" aria-label="Anterior" onClick={() => scrollBy(-1)}>
            <ChevronLeft size={18} />
          </button>
          <button type="button" className="prod-strip__btn" aria-label="Próximo" onClick={() => scrollBy(1)}>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="prod-strip__track" ref={scroller}>
        {products.map((p) => {
          const imgs = productGallery(p);
          return (
            <article
              key={p.id}
              className="prod-strip__card"
              role="link"
              tabIndex={0}
              onClick={() => router.push(`/produtos/${p.slug}`)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  router.push(`/produtos/${p.slug}`);
                }
              }}
              style={{ cursor: "pointer" }}
            >
              <div className="prod-strip__media">
                {imgs[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imgs[0]} alt="" />
                ) : (
                  <span>Sem imagem</span>
                )}
                {p.featured ? <span className="prod-strip__badge">Destaque</span> : null}
              </div>
              <div className="prod-strip__body">
                <p className="prod-strip__cat">{p.categoryRef?.name || p.category}</p>
                <h3>{p.name}</h3>
                {p.reference ? <p className="prod-strip__ref">Ref: {p.reference}</p> : null}
                <strong>{formatBRL(p.price)}</strong>
                <span className="btn btn--primary btn--sm">Ver produto</span>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
