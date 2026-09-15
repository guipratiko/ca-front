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
  const discount =
    product.compareAt && product.compareAt > product.price
      ? Math.round(((product.compareAt - product.price) / product.compareAt) * 100)
      : 0;

  return createPortal(
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-black/55 p-0 backdrop-blur-[6px] sm:items-center sm:p-6"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full max-w-sm animate-in fade-in zoom-in-95 duration-200 max-sm:rounded-t-xl max-sm:overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <Button
          ref={closeRef}
          type="button"
          variant="secondary"
          size="icon"
          className="absolute left-1/2 top-3 z-20 h-9 w-9 -translate-x-1/2 rounded-full bg-background/95 shadow-md sm:-top-12 sm:left-auto sm:right-0 sm:translate-x-0"
          aria-label="Fechar"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>

        <h2 id={titleId} className="sr-only">
          {product.name}
        </h2>

        <div className="max-h-[92vh] overflow-y-auto overscroll-contain max-sm:pt-14">
          <ProductCard
            name={product.name}
            price={product.price}
            originalPrice={product.compareAt ?? product.price}
            images={images}
            isNew={false}
            isBestSeller={product.featured}
            discount={discount}
            freeShipping={false}
            colors={[]}
            sizes={[]}
            currency="BRL"
            ctaHref={productWhatsAppUrl(product)}
            ctaLabel={product.buttonLabel || "Quero este produto"}
            className="max-sm:max-w-none max-sm:rounded-none max-sm:rounded-t-md max-sm:shadow-none"
          />
        </div>
      </div>
    </div>,
    document.body
  );
}
