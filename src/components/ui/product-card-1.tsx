"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import { formatBRL } from "@/lib/api";

export interface ProductCardProps {
  name?: string;
  price?: number;
  originalPrice?: number;
  images?: string[];
  category?: string;
  reference?: string | null;
  description?: string;
  isFeatured?: boolean;
  discount?: number;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

export function ProductCard({
  name = "Produto",
  price = 0,
  originalPrice,
  images = [],
  category,
  reference,
  description,
  isFeatured = false,
  discount = 0,
  ctaLabel = "Quero este produto",
  ctaHref = "#",
  className,
}: ProductCardProps) {
  const gallery = images.length ? images : ["/assets/img/logo-ca-tools.png"];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % gallery.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
  };

  const compare = originalPrice != null && originalPrice > price ? originalPrice : null;
  const pct =
    discount > 0
      ? discount
      : compare
        ? Math.round(((compare - price) / compare) * 100)
        : 0;

  return (
    <Card
      className={`w-full max-w-md overflow-hidden group bg-card text-foreground shadow-xl rounded-xl border border-border ${className || ""}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <motion.img
          key={currentImageIndex}
          src={gallery[currentImageIndex]}
          alt={`${name} - vista ${currentImageIndex + 1}`}
          className="object-cover w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />

        {gallery.length > 1 ? (
          <div className="absolute inset-0 flex items-center justify-between p-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm shadow-sm"
              onClick={prevImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm shadow-sm"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        ) : null}

        {gallery.length > 1 ? (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
            {gallery.map((_, index) => (
              <button
                key={index}
                type="button"
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  index === currentImageIndex ? "bg-primary w-4" : "bg-primary/30"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                }}
                aria-label={`Imagem ${index + 1}`}
              />
            ))}
          </div>
        ) : null}

        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isFeatured ? (
            <Badge className="bg-amber-500 hover:bg-amber-500/90 border-0 text-white">
              Destaque
            </Badge>
          ) : null}
          {pct > 0 ? (
            <Badge className="bg-rose-500 hover:bg-rose-500/90 border-0 text-white">
              -{pct}%
            </Badge>
          ) : null}
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            {category ? (
              <p className="text-xs font-bold uppercase tracking-wider text-primary mb-1">
                {category}
              </p>
            ) : null}
            <h3 className="font-semibold text-lg leading-tight line-clamp-2">{name}</h3>
            {reference ? (
              <p className="text-xs text-muted-foreground mt-1 font-medium">Ref: {reference}</p>
            ) : null}
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold tracking-tight">{formatBRL(price)}</span>
            {compare ? (
              <span className="text-sm text-muted-foreground line-through">
                {formatBRL(compare)}
              </span>
            ) : null}
          </div>

          {description ? (
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4 whitespace-pre-wrap">
              {description}
            </p>
          ) : null}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full h-11 font-bold">
          <a href={ctaHref} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="mr-2 h-4 w-4" />
            {ctaLabel}
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
