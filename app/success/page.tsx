"use client";

import { useCartStore } from "@/store/cart-store";
import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

export default function SuccessPage() {
  const { clearCart } = useCartStore();
  useEffect(() => { clearCart(); }, [clearCart]);

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center gap-6 animate-fade-in">
      <div className="animate-bounce-in">
        <CheckCircleIcon className="h-24 w-24 text-green-500 drop-shadow-lg" />
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Payment Successful! 🎉</h1>
        <p className="text-muted-foreground max-w-sm">
  Thank you for your purchase. You&apos;ll receive a confirmation email shortly.
</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 mt-2">
        <Button asChild className="rounded-full gradient-accent text-white border-0 hover:opacity-90">
          <Link href="/products">Continue Shopping</Link>
        </Button>
        <Button asChild variant="outline" className="rounded-full">
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
}
