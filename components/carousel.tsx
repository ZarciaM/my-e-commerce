"use client";

import Stripe from "stripe";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  StarIcon,
  ShoppingBagIcon 
} from "@heroicons/react/24/outline";

interface Props { products: Stripe.Product[]; }

export const Carousel = ({ products }: Props) => {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [touchStart, setTouchStart] = useState(0);

  const prev = () => {
    setCurrent((c) => (c - 1 + products.length) % products.length);
    setImageLoaded(false);
  };
  
 
const next = useCallback(() => {
  setCurrent((c) => (c + 1) % products.length);
  setImageLoaded(false);
}, [products.length]);
  // Auto-play


  useEffect(() => {
  if (paused || products.length <= 1) return;
  const id = setInterval(next, 5000);
  return () => clearInterval(id);
}, [products.length, paused, next]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        next();
      } else {
        prev();
      }
    }
    setTouchStart(0);
  };

  if (!products.length) return null;

  const product = products[current];
  const price = product.default_price as Stripe.Price;
  const isNew = Math.random() > 0.7; 

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount / 100);
  };

  return (
    <div 
      className="relative rounded-2xl overflow-hidden shadow-xl group"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Container image */}
      <div className="relative h-80 sm:h-96 md:h-[500px] w-full bg-gradient-to-br from-secondary to-muted">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        )}
        
        {product.images?.[0] && (
          <Image
            key={current}
            src={product.images[0]}
            alt={product.name}
            fill
            className={`
              object-cover transition-all duration-700 
              ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}
            `}
            onLoad={() => setImageLoaded(true)}
            priority
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2 z-10">
          {isNew && (
            <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
              <StarIcon className="h-3 w-3" />
              NEW
            </span>
          )}
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
            Best Seller
          </span>
        </div>

        <div className="absolute top-4 right-4 z-10">
          <span className="inline-flex items-center gap-1 rounded-full bg-black/50 backdrop-blur-sm px-3 py-1 text-xs font-medium text-white">
            {current + 1} / {products.length}
          </span>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 md:p-10">
        <div className="max-w-2xl">
          <p className="text-white/60 text-xs sm:text-sm mb-2 uppercase tracking-wider font-medium">
            FEATURED PRODUCT
          </p>
          
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 leading-tight">
            {product.name}
          </h3>
          
          {product.description && (
            <p className="text-white/80 text-sm sm:text-base mb-3 line-clamp-2 max-w-lg">
              {product.description}
            </p>
          )}
          
          {price?.unit_amount && (
            <p className="text-xl sm:text-2xl font-bold text-white mb-4">
              {formatPrice(price.unit_amount)}
            </p>
          )}
          
          <Link
            href={`/products/${product.id}`}
            className="inline-flex items-center gap-2 rounded-full bg-white text-gray-900 px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            <ShoppingBagIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            Shop Now
          </Link>
        </div>
      </div>

      {products.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 hover:bg-black/70 hover:scale-110 transition-all duration-300"
            aria-label="Previous"
          >
            <ChevronLeftIcon className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 hover:bg-black/70 hover:scale-110 transition-all duration-300"
            aria-label="Next"
          >
            <ChevronRightIcon className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </>
      )}

      {products.length > 1 && (
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {products.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrent(i);
                setImageLoaded(false);
              }}
              className={`
                transition-all duration-300 rounded-full
                ${i === current 
                  ? 'w-6 sm:w-8 h-1.5 sm:h-2 bg-white shadow-lg' 
                  : 'w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/40 hover:bg-white/70'
                }
              `}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}

      {!paused && products.length > 1 && (
        <div className="absolute bottom-0 left-0 h-0.5 bg-white/30">
          <div 
            className="h-full bg-white rounded-r-full"
            style={{
              width: '100%',
              animation: 'shrink 5s linear forwards'
            }}
          />
        </div>
      )}
    </div>
  );
};