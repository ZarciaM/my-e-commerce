"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCartStore } from "@/store/cart-store";
import { checkoutAction } from "./checkout-action";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBagIcon, TagIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export default function CheckoutPage() {
  const { items, removeItem, addItem } = useCartStore();
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discount = promoApplied ? total * 0.1 : 0;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-6 animate-fade-in text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
          <ShoppingBagIcon className="h-10 w-10 text-muted-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground">Add some products to get started!</p>
        </div>
        <Button asChild className="rounded-full gradient-accent text-white border-0 hover:opacity-90">
          <Link href="/products">Browse Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 border-b border-border pb-4 last:border-0 last:pb-0">
              {item.imageUrl && (
                <div className="relative h-16 w-16 rounded-lg overflow-hidden shrink-0 bg-secondary">
                  <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                </div>
              )}
              <div className="flex-grow min-w-0">
                <p className="font-medium truncate">{item.name}</p>
                <p className="text-sm text-muted-foreground">${(item.price / 100).toFixed(2)} each</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => removeItem(item.id)}
                  className="h-7 w-7 flex items-center justify-center rounded-full border border-border hover:bg-secondary transition-colors text-sm font-bold"
                >
                  −
                </button>
                <span className="w-6 text-center font-semibold text-sm">{item.quantity}</span>
                <button
                  onClick={() => addItem({ ...item, quantity: 1 })}
                  className="h-7 w-7 flex items-center justify-center rounded-full border border-border hover:bg-secondary transition-colors text-sm font-bold"
                >
                  +
                </button>
              </div>
              <p className="font-semibold text-sm w-16 text-right shrink-0">
                ${((item.price * item.quantity) / 100).toFixed(2)}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Promo code */}
      <div className="mb-6 flex gap-2">
        <div className="relative flex-grow">
          <TagIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            placeholder="Promo code"
            className="w-full rounded-full border border-border bg-background pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <Button
          variant="outline"
          className="rounded-full"
          onClick={() => { if (promoCode === "SAVE10") setPromoApplied(true); }}
        >
          Apply
        </Button>
      </div>
      {promoApplied && (
        <p className="text-sm text-green-600 dark:text-green-400 mb-4 animate-fade-in">
          ✓ 10% discount applied! Use code: SAVE10
        </p>
      )}

      {/* Totals */}
      <Card className="mb-6">
        <CardContent className="space-y-2 pt-4">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Subtotal</span>
            <span>${(total / 100).toFixed(2)}</span>
          </div>
          {promoApplied && (
            <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
              <span>Discount (10%)</span>
              <span>-${(discount / 100).toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t border-border pt-3">
            <span>Total</span>
            <span>${((total - discount) / 100).toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      <form action={checkoutAction}>
        <input type="hidden" name="items" value={JSON.stringify(items)} />
        <Button type="submit" size="lg" className="w-full rounded-full gradient-accent text-white border-0 hover:opacity-90 text-base">
          Proceed to Payment →
        </Button>
      </form>
      <p className="text-center text-xs text-muted-foreground mt-4">
        🔒 Secured by Stripe. Your payment info is never stored.
      </p>
    </div>
  );
}
