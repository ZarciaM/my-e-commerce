"use client";

import Stripe from "stripe";
import { ProductCard } from "./product-card";
import { useState, useMemo } from "react";
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";

interface Props { products: Stripe.Product[]; }

type SortKey = "default" | "price-asc" | "price-desc" | "name";

export const ProductList = ({ products }: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sort, setSort] = useState<SortKey>("default");

  const filtered = useMemo(() => {
    const term = searchTerm.toLowerCase();
    let result = products.filter((p) => {
      return (
        p.name.toLowerCase().includes(term) ||
        (p.description?.toLowerCase().includes(term) ?? false)
      );
    });

    if (sort === "price-asc") {
      result = [...result].sort((a, b) => {
        const pa = (a.default_price as Stripe.Price)?.unit_amount ?? 0;
        const pb = (b.default_price as Stripe.Price)?.unit_amount ?? 0;
        return pa - pb;
      });
    } else if (sort === "price-desc") {
      result = [...result].sort((a, b) => {
        const pa = (a.default_price as Stripe.Price)?.unit_amount ?? 0;
        const pb = (b.default_price as Stripe.Price)?.unit_amount ?? 0;
        return pb - pa;
      });
    } else if (sort === "name") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [products, searchTerm, sort]);

  return (
    <div className="animate-fade-in">
      {/* Search + Sort bar */}
      <div className="mb-8 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-grow">
          <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products…"
            className="w-full rounded-full border border-border bg-background pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
          />
        </div>
        <div className="relative flex items-center gap-2 shrink-0">
          <AdjustmentsHorizontalIcon className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-full border border-border bg-background pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer"
          >
            <option value="default">Sort: Default</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="name">Name A–Z</option>
          </select>
        </div>
      </div>

      {/* Results count */}
      {searchTerm && (
        <p className="mb-4 text-sm text-muted-foreground">
          {filtered.length} result{filtered.length !== 1 ? "s" : ""} for {'"'}{searchTerm}{'"'}
        </p>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-24 text-muted-foreground">
          <p className="text-4xl mb-3">🔍</p>
          <p className="font-medium">No products found</p>
          <p className="text-sm">Try a different search term</p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
