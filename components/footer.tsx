import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 font-bold text-lg mb-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg gradient-accent text-white text-sm font-black">M</span>
              MyStore
            </div>
            <p className="text-sm text-muted-foreground">
              Premium products curated for quality and style.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="hover:text-foreground text-muted-foreground transition-colors">All Products</Link></li>
              <li><Link href="/checkout" className="hover:text-foreground text-muted-foreground transition-colors">Cart</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><span className="text-muted-foreground">Free shipping over $50</span></li>
              <li><span className="text-muted-foreground">30-day returns</span></li>
              <li><span className="text-muted-foreground">Secure checkout</span></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} MyStore. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
