"use client";

import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Product, formatBRL, productGallery, productWhatsAppUrl } from "@/lib/api";
import { ProductImageCarousel } from "@/components/product-image-carousel";

type Props = {
  product: Product | null;
  open: boolean;
  onClose: () => void;
};

export function ProductModal({ product, open, onClose }: Props) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
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
        ref={panelRef}
        className="prod-modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <button
          ref={closeRef}
          type="button"
          className="prod-modal__close"
          aria-label="Fechar"
          onClick={onClose}
        >
          <X size={18} />
        </button>

        <div className="prod-modal__media">
          <ProductImageCarousel images={images} alt={product.name} />
        </div>

        <div className="prod-modal__body">
          <p className="prod-modal__cat">{catLabel}</p>
          <h2 id={titleId} className="prod-modal__title">
            {product.name}
          </h2>
          {product.reference ? (
            <p className="prod-modal__ref">Ref: {product.reference}</p>
          ) : null}
          <div className="prod-modal__price">
            <strong>{formatBRL(product.price)}</strong>
            {product.compareAt && product.compareAt > product.price ? (
              <s>{formatBRL(product.compareAt)}</s>
            ) : null}
          </div>
          <p className="prod-modal__desc">{product.description}</p>
          <a
            className="btn btn--primary btn--lg prod-modal__cta"
            href={productWhatsAppUrl(product)}
            target="_blank"
            rel="noopener noreferrer"
          >
            {product.buttonLabel || "Quero este produto"}
          </a>
        </div>
      </div>
    </div>,
    document.body
  );
}
