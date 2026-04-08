import Image from "next/image";
import { stripe } from "@/lib/stripe";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Carousel } from "@/components/carousel";
import { ArrowRightIcon, StarIcon, ShieldCheckIcon, TruckIcon } from "@heroicons/react/24/outline";

export default async function Home() {
  const products = await stripe.products.list({
    expand: ["data.default_price"],
    limit: 5,
  });

  const perks = [
    { icon: TruckIcon,      title: "Free Shipping",    desc: "On orders over $50" },
    { icon: ShieldCheckIcon, title: "Secure Payments",  desc: "100% protected" },
    { icon: StarIcon,        title: "Top Quality",      desc: "Curated products only" },
  ];

  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-zinc-900 to-zinc-700 dark:from-zinc-800 dark:to-zinc-900 py-16 sm:py-24">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "radial-gradient(circle at 70% 50%, oklch(0.558 0.243 262.88), transparent 60%)" }}
        />
        <div className="relative mx-auto grid grid-cols-1 items-center justify-items-center gap-10 px-8 sm:px-16 md:grid-cols-2">
          <div className="max-w-md space-y-6 text-center md:text-left">
            <span className="inline-block rounded-full bg-white/10 px-4 py-1 text-sm text-white/80 backdrop-blur">
              ✨ New arrivals every week
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl leading-tight">
              Shop the <span className="text-gradient">Future</span> of Style
            </h1>
            <p className="text-zinc-300 text-lg">
              Discover handpicked products that combine quality, design, and value.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <Button asChild size="lg" className="gradient-accent text-white rounded-full hover:opacity-90 border-0">
                <Link href="/products" className="inline-flex items-center gap-2">
                  Shop Now <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full border-white/30 text-white hover:bg-white/10 bg-transparent">
                <Link href="/products">Browse All</Link>
              </Button>
            </div>
          </div>
          {products.data[0]?.images?.[0] && (
            <div className="relative">
              <div className="absolute -inset-4 rounded-full gradient-accent opacity-20 blur-2xl" />
              <Image
                alt="Hero Product"
                src={products.data[0].images[0]}
                className="relative rounded-2xl shadow-2xl object-cover"
                width={420}
                height={420}
              />
            </div>
          )}
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {perks.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex items-center gap-4 rounded-xl border border-border bg-card px-6 py-4 shadow-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full gradient-accent">
              <Icon className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-sm">{title}</p>
              <p className="text-muted-foreground text-xs">{desc}</p>
            </div>
          </div>
        ))}
      </section>

      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <Button asChild variant="ghost" className="text-accent-foreground gap-1">
            <Link href="/products">
              View all <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <Carousel products={products.data} />
      </section>
    </div>
  );
}
