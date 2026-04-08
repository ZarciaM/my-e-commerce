"use client";

import Stripe from "stripe";
import Image from "next/image";
import { Button } from "./ui/button";
import { useCartStore } from "@/store/cart-store";
import { 
  ShoppingCartIcon, 
  HeartIcon, 
  ShareIcon, 
  CheckIcon,
  TruckIcon,
  ArrowPathIcon,
  ShieldCheckIcon,
  MinusIcon,
  PlusIcon
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useState, useEffect } from "react";

interface Props { product: Stripe.Product; }

export const ProductDetail = ({ product }: Props) => {
  const { items, addItem, removeItem } = useCartStore();
  const price = product.default_price as Stripe.Price;
  const cartItem = items.find((i) => i.id === product.id);
  const quantity = cartItem?.quantity ?? 0;
  const [wished, setWished] = useState(false);
  const [copied, setCopied] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    if (wishlist.includes(product.id)) {
      setWished(true);
    }
  }, [product.id]);

  const onAdd = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: price.unit_amount as number,
      imageUrl: product.images?.[0] ?? null,
      quantity: 1,
    });
  };

  const onRemove = () => {
    if (quantity > 0) {
      removeItem(product.id);
    }
  };

  const toggleWishlist = () => {
    const newWished = !wished;
    setWished(newWished);
    
    // Sauvegarder dans localStorage
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    if (newWished) {
      localStorage.setItem('wishlist', JSON.stringify([...wishlist, product.id]));
    } else {
      localStorage.setItem('wishlist', JSON.stringify(wishlist.filter((id: string) => id !== product.id)));
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount / 100);
  };

  const images = product.images || [];
  
  const allImages = images.length > 0 ? images : ['/placeholder-image.jpg'];

  return (
    <div className="animate-fade-in">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
        <span>/</span>
        <span className="text-foreground font-medium truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Section Image */}
        <div className="w-full lg:w-1/2">
          <div className="sticky top-24">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-secondary to-muted shadow-lg mb-4">
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                </div>
              )}
              <Image
                src={allImages[selectedImage]}
                alt={product.name}
                fill
                className={`
                  object-cover transition-all duration-500 hover:scale-105
                  ${imageLoaded ? 'opacity-100' : 'opacity-0'}
                `}
                onLoad={() => setImageLoaded(true)}
                priority
              />
              
              {product.metadata?.isNew === 'true' && (
                <div className="absolute top-4 left-4 z-10">
                  <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
                    NEW
                  </span>
                </div>
              )}
            </div>

            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`
                      relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0
                      transition-all duration-200
                      ${selectedImage === idx 
                        ? 'ring-2 ring-primary shadow-md scale-95' 
                        : 'ring-1 ring-border hover:ring-primary/50'
                      }
                    `}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} - view ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Section Info */}
        <div className="w-full lg:w-1/2 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                In Stock
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
              {product.name}
            </h1>
          </div>

          {product.description && (
            <p className="text-muted-foreground leading-relaxed border-l-2 border-primary/30 pl-4">
              {product.description}
            </p>
          )}

          {price?.unit_amount && (
            <div className="flex items-baseline gap-3 py-2">
              <span className="text-3xl sm:text-4xl font-bold text-primary">
                {formatPrice(price.unit_amount)}
              </span>
              <span className="text-sm text-muted-foreground">USD</span>
            </div>
          )}

          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">Quantity</p>
            <div className="flex items-center gap-3">
              <div className="flex items-center rounded-full border border-border bg-secondary/30 overflow-hidden">
                <button
                  onClick={onRemove}
                  disabled={quantity === 0}
                  className="p-2 sm:p-3 hover:bg-secondary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Decrease quantity"
                >
                  <MinusIcon className="h-4 w-4" />
                </button>
                <span className="min-w-[3rem] text-center font-semibold text-lg">
                  {quantity}
                </span>
                <button
                  onClick={onAdd}
                  className="p-2 sm:p-3 hover:bg-secondary transition-all"
                  aria-label="Increase quantity"
                >
                  <PlusIcon className="h-4 w-4" />
                </button>
              </div>
              <span className="text-sm text-muted-foreground">
                {quantity > 0 ? `${quantity} item${quantity > 1 ? 's' : ''} in cart` : 'No items in cart'}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button 
              onClick={onAdd} 
              size="lg" 
              className="flex-1 rounded-full gradient-accent text-white border-0 gap-2 hover:shadow-lg hover:shadow-primary/30 transition-all duration-300"
            >
              <ShoppingCartIcon className="h-5 w-5" />
              Add to Cart
            </Button>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-12 w-12 hover:scale-105 transition-all duration-200"
                onClick={toggleWishlist}
                aria-label="Add to wishlist"
              >
                {wished ? (
                  <HeartSolid className="h-5 w-5 text-rose-500 animate-bounce-in" />
                ) : (
                  <HeartIcon className="h-5 w-5" />
                )}
              </Button>
              
              <Button
                variant="outline"
                size="default"
                className="rounded-full gap-2 hover:scale-105 transition-all duration-200"
                onClick={handleShare}
              >
                {copied ? (
                  <>
                    <CheckIcon className="h-5 w-5 text-green-500" />
                    Copied!
                  </>
                ) : (
                  <>
                    <ShareIcon className="h-5 w-5" />
                    Share
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-border">
            <div className="flex items-center gap-2 text-sm">
              <TruckIcon className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">Free Shipping</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <ArrowPathIcon className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">30 Days Return</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <ShieldCheckIcon className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">Secure Payment</span>
            </div>
          </div>

          {/* SKU from Stripe */}
          {product.metadata?.sku && (
            <p className="text-xs text-muted-foreground pt-2">
              SKU: {product.metadata.sku}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};