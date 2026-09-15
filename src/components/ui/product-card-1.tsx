"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  ShoppingCart,
  Star,
  ChevronLeft,
  ChevronRight,
  Check,
  Loader2,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface ProductCardProps {
  name?: string;
  price?: number;
  originalPrice?: number;
  rating?: number;
  reviewCount?: number;
  images?: string[];
  colors?: string[];
  sizes?: string[];
  isNew?: boolean;
  isBestSeller?: boolean;
  discount?: number;
  freeShipping?: boolean;
  /** Quando definido, o CTA abre WhatsApp em vez de "Add to Cart". */
  ctaHref?: string;
  ctaLabel?: string;
  currency?: "BRL" | "USD";
  className?: string;
}

function formatPrice(value: number, currency: "BRL" | "USD") {
  if (currency === "BRL") {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  }
  return `$${value.toFixed(2)}`;
}

export function ProductCard({
  name = "Premium Wool Sweater",
  price = 89.99,
  originalPrice = 129.99,
  rating,
  reviewCount,
  images = [
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
    "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80",
    "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&q=80",
  ],
  colors = [],
  sizes = [],
  isNew = false,
  isBestSeller = false,
  discount = 0,
  freeShipping = false,
  ctaHref,
  ctaLabel,
  currency = "USD",
  className,
}: ProductCardProps) {
  const gallery = images.length > 0 ? images : ["/assets/img/logo-ca-tools.png"];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(colors[0] ?? "");
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % gallery.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
  };

  const handleAddToCart = () => {
    if (isAddedToCart) return;
    setIsAddingToCart(true);
    setTimeout(() => {
      setIsAddingToCart(false);
      setIsAddedToCart(true);
      setTimeout(() => setIsAddedToCart(false), 2000);
    }, 800);
  };

  const showRating = rating != null && reviewCount != null;
  const showColors = colors.length > 0;
  const showSizes = sizes.length > 0;
  const compare = originalPrice != null && originalPrice > price;

  return (
    <Card
      className={cn(
        "w-full max-w-sm overflow-hidden group bg-background text-foreground shadow-xl hover:shadow-lg transition-all duration-300 rounded-md border border-border",
        className
      )}
    >
      {/* Image carousel */}
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        <motion.img
          key={currentImageIndex}
          src={gallery[currentImageIndex]}
          alt={`${name} - View ${currentImageIndex + 1}`}
          className="object-cover w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />

        {/* Navigation arrows */}
        {gallery.length > 1 ? (
          <div className="absolute inset-0 flex items-center justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity max-sm:opacity-100">
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

        {/* Image indicators */}
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
                aria-label={`Image ${index + 1}`}
              />
            ))}
          </div>
        ) : null}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isNew ? (
            <Badge className="bg-blue-500 hover:bg-blue-500/90 text-white border-0">New</Badge>
          ) : null}
          {isBestSeller ? (
            <Badge className="bg-amber-500 hover:bg-amber-500/90 text-white border-0">
              Best Seller
            </Badge>
          ) : null}
          {discount > 0 ? (
            <Badge className="bg-rose-500 hover:bg-rose-500/90 text-white border-0">
              -{discount}%
            </Badge>
          ) : null}
        </div>

        {/* Wishlist button */}
        <Button
          type="button"
          variant="secondary"
          size="icon"
          className={`absolute top-3 right-3 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm shadow-sm ${
            isWishlisted ? "text-rose-500" : ""
          }`}
          onClick={(e) => {
            e.stopPropagation();
            setIsWishlisted(!isWishlisted);
          }}
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? "fill-rose-500" : ""}`} />
        </Button>
      </div>

      {/* Content */}
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-medium line-clamp-1">{name}</h3>
            {showRating ? (
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center">
                  <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                  <span className="ml-1 text-sm font-medium">{rating}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  ({reviewCount} reviews)
                </span>
                {freeShipping ? (
                  <span className="text-xs text-emerald-600 ml-auto">Free shipping</span>
                ) : null}
              </div>
            ) : freeShipping ? (
              <div className="mt-1">
                <span className="text-xs text-emerald-600">Free shipping</span>
              </div>
            ) : null}
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-semibold">{formatPrice(price, currency)}</span>
            {compare ? (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(originalPrice!, currency)}
              </span>
            ) : null}
          </div>

          {/* Colors & Sizes */}
          {showColors || showSizes ? (
            <div className="space-y-3">
              {showColors ? (
                <div className="space-y-1.5">
                  <div className="text-xs text-muted-foreground">Colors</div>
                  <div className="flex gap-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`w-6 h-6 rounded-full transition-all ${
                          selectedColor === color
                            ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                            : "ring-1 ring-muted hover:ring-primary"
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setSelectedColor(color)}
                        aria-label={`Select color ${color}`}
                      />
                    ))}
                  </div>
                </div>
              ) : null}

              {showSizes ? (
                <div className="space-y-1.5">
                  <div className="text-xs text-muted-foreground">Sizes</div>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        className={`min-w-[2.5rem] h-8 px-2 rounded-md text-xs font-medium transition-all ${
                          selectedSize === size
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted/60 hover:bg-muted"
                        }`}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </CardContent>

      {/* Footer */}
      <CardFooter className="p-4 pt-0">
        {ctaHref ? (
          <Button asChild className="w-full">
            <a href={ctaHref} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="mr-2 h-4 w-4" />
              {ctaLabel || "Quero este produto"}
            </a>
          </Button>
        ) : (
          <Button
            type="button"
            className="w-full"
            onClick={handleAddToCart}
            disabled={isAddingToCart || isAddedToCart}
          >
            {isAddingToCart ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : isAddedToCart ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Added to Cart
              </>
            ) : (
              <>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
