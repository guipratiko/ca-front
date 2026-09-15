"use client";

import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Product, productGallery, productWhatsAppUrl } from "@/lib/api";
import { ProductCard } from "@/components/ui/product-card-1";
import { Button } from "@/components/ui/button";

type Props = {
  product: Product | null;
  open: boolean;
  onClose: () => void;
};

export function ProductModal({ product, open, onClose }: Props) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => closeRef.current?.focus(), 20);
    return () => {
      document.body.style.overflow = prev;
      window.clearTimeout(t);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !product || typeof document === "undefined") return null;

  const images = productGallery(product);
  const catLabel = product.categoryRef?.name || product.category;

  return createPortal(
    <div
      className="prod-modal"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="prod-modal__panel prod-modal__panel--card"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <Button
          ref={closeRef}
          type="button"
          variant="secondary"
          size="icon"
          className="prod-modal__close absolute top-3 right-3 z-10 h-9 w-9 rounded-full shadow-md"
          aria-label="Fechar"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>

        <h2 id={titleId} className="sr-only">
          {product.name}
        </h2>

        <div className="prod-modal__card-wrap">
          <ProductCard
            name={product.name}
            price={product.price}
            originalPrice={product.compareAt ?? undefined}
            images={images}
            category={catLabel}
            reference={product.reference}
            description={product.description}
            isFeatured={product.featured}
            ctaLabel={product.buttonLabel || "Quero este produto"}
            ctaHref={productWhatsAppUrl(product)}
            className="max-w-none shadow-none border-0 rounded-none sm:rounded-xl"
          />
        </div>
      </div>
    </div>,
    document.body
  );
}
