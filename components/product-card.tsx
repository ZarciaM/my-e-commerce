"use client";

import Link from "next/link";
import Stripe from "stripe";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";
import { Button } from "./ui/button";
import { 
  HeartIcon, 
  ShoppingCartIcon, 
  EyeIcon,
  StarIcon,
  TruckIcon 
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cart-store";

interface Props { 
  product: Stripe.Product;
  featured?: boolean;
}

export const ProductCard = ({ product, featured = false }: Props) => {
  const price = product.default_price as Stripe.Price;
  const [wished, setWished] = useState(false);
  const [added, setAdded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { addItem } = useCartStore();

  const isOnSale = Math.random() > 0.7;
  const originalPrice = price?.unit_amount || 0;
  const salePrice = isOnSale ? originalPrice * 0.8 : originalPrice;
  const discountPercent = isOnSale ? 20 : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addItem({
      id: product.id,
      name: product.name,
      price: isOnSale ? salePrice : originalPrice,
      imageUrl: product.images?.[0] ?? null,
      quantity: 1,
    });
    
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWishlist = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setWished((w) => !w);
    
    const btn = e.currentTarget;
    btn.style.transform = 'scale(0.9)';
    setTimeout(() => { 
      if (btn) {
        btn.style.transform = ''; 
      }
    }, 200);
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount / 100);
  };

  return (
    <div className="block h-full group/card">
      <Card className={`
        relative h-full flex flex-col overflow-hidden 
        border-border transition-all duration-300 
        hover:shadow-2xl hover:shadow-primary/10
        ${featured ? 'lg:col-span-2 lg:row-span-2' : ''}
      `}>
        {/* featured badge */}
        {featured && (
          <div className="absolute top-4 left-4 z-20">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
              <StarIcon className="h-3.5 w-3.5" />
              Featured
            </span>
          </div>
        )}

        <div className="relative h-64 w-full overflow-hidden bg-gradient-to-br from-secondary to-muted">
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          )}
          
          {product.images?.[0] && !imageError ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className={`
                object-cover transition-all duration-700 
                group-hover/card:scale-110 group-hover/card:rotate-1
                ${imageLoaded ? 'opacity-100' : 'opacity-0'}
              `}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted to-secondary">
              <ShoppingCartIcon className="h-16 w-16 text-muted-foreground/30" />
            </div>
          )}

          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />

          <Link
            href={`/products/${product.id}`}
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-all duration-300"
          >
            <Button 
              variant="secondary" 
              size="sm"
              className="rounded-full gap-2 shadow-lg transform translate-y-4 group-hover/card:translate-y-0 transition-transform"
              onClick={(e) => e.preventDefault()}
            >
              <EyeIcon className="h-4 w-4" />
              Quick View
            </Button>
          </Link>

          <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
            <button
              onClick={handleWishlist}
              className={`
                flex h-9 w-9 items-center justify-center rounded-full 
                bg-white/95 dark:bg-zinc-800/95 shadow-lg 
                transition-all duration-300 hover:scale-110
                ${wished ? 'scale-110' : ''}
              `}
              aria-label="Wishlist"
            >
              {wished ? (
                <HeartSolid className="h-4.5 w-4.5 text-rose-500 animate-bounce-in" />
              ) : (
                <HeartIcon className="h-4.5 w-4.5 text-muted-foreground group-hover:text-rose-500 transition-colors" />
              )}
            </button>
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
            {isOnSale && (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-500 px-2.5 py-1 text-xs font-bold text-white shadow-lg">
                -{discountPercent}%
              </span>
            )}
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-1 text-xs font-bold text-white shadow-lg">
              <TruckIcon className="h-3 w-3" />
              Free Ship
            </span>
          </div>
        </div>

        <CardContent className="flex flex-col flex-grow gap-3 p-5">
          <div className="flex-grow">
            {/* Catégories */}
            <div className="mb-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {product.metadata?.category || 'Premium'}
              </span>
            </div>

            <h3 className="font-semibold text-foreground leading-snug line-clamp-2 group-hover/card:text-primary transition-colors duration-200">
              {product.name}
            </h3>

            {product.description && (
              <p className="text-muted-foreground text-sm mt-2 line-clamp-2">
                {product.description}
              </p>
            )}

            <div className="flex items-center gap-1 mt-3">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              ))}
              <span className="text-xs text-muted-foreground ml-1">(128)</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-baseline gap-2">
              {isOnSale ? (
                <>
                  <p className="text-2xl font-bold text-primary">
                    {formatPrice(salePrice)}
                  </p>
                  <p className="text-sm text-muted-foreground line-through">
                    {formatPrice(originalPrice)}
                  </p>
                </>
              ) : (
                <p className="text-2xl font-bold text-primary">
                  {formatPrice(originalPrice)}
                </p>
              )}
            </div>

            {/* Stock indicator */}
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '85%' }} />
              </div>
              <span className="text-xs text-muted-foreground">In Stock</span>
            </div>
          </div>

          <Button
            onClick={handleAddToCart}
            className={`
              w-full rounded-full gap-2 transition-all duration-300
              ${added 
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white' 
                : 'gradient-accent hover:shadow-lg hover:shadow-primary/30'
              }
            `}
          >
            {added ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Added to Cart!
              </>
            ) : (
              <>
                <ShoppingCartIcon className="h-4 w-4 transition-transform group-hover:scale-110" />
                Add to Cart
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {added && (
        <div className="fixed bottom-4 right-4 z-50 animate-slide-in-up">
          <div className="flex items-center gap-3 rounded-lg bg-emerald-500 text-white px-4 py-3 shadow-lg">
            <ShoppingCartIcon className="h-5 w-5" />
            <div>
              <p className="font-semibold text-sm">Added to cart!</p>
              <p className="text-xs opacity-90">{product.name}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};