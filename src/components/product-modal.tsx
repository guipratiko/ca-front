"use client";

import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { MessageCircle, Tag, X } from "lucide-react";
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
    const t = window.setTimeout(() => closeRef.current?.focus(), 40);
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
  const cover = images[0];

  return createPortal(
    <div className="prod-modal" role="presentation">
      <button
        type="button"
        className="prod-modal__backdrop"
        aria-label="Fechar popup"
        onClick={onClose}
      />
      <div className="prod-modal__blur" aria-hidden="true" />
      <div className="prod-modal__glow" aria-hidden="true" />

      <div
        ref={panelRef}
        className="prod-modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="prod-modal__shine" aria-hidden="true" />

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
          {cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="prod-modal__media-blur" src={cover} alt="" aria-hidden="true" />
          ) : null}
          <div className="prod-modal__media-main">
            <ProductImageCarousel images={images} alt={product.name} />
          </div>
        </div>

        <div className="prod-modal__body">
          <div className="prod-modal__chips">
            <span className="prod-modal__chip">{catLabel}</span>
            {product.featured ? (
              <span className="prod-modal__chip prod-modal__chip--hot">Destaque</span>
            ) : null}
          </div>

          <h2 id={titleId} className="prod-modal__title">
            {product.name}
          </h2>

          {product.reference ? (
            <p className="prod-modal__ref">
              <Tag size={14} />
              Ref: {product.reference}
            </p>
          ) : null}

          <div className="prod-modal__price">
            <strong>{formatBRL(product.price)}</strong>
            {product.compareAt && product.compareAt > product.price ? (
              <s>{formatBRL(product.compareAt)}</s>
            ) : null}
          </div>

          <p className="prod-modal__desc">{product.description}</p>

          <a
            className="prod-modal__cta"
            href={productWhatsAppUrl(product)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle size={18} />
            <span>{product.buttonLabel || "Quero este produto"}</span>
          </a>
        </div>
      </div>
    </div>,
    document.body
  );
}
