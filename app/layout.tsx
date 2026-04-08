import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "MyStore — Premium Shopping",
  description: "Discover premium products at unbeatable prices.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col bg-background">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8 animate-fade-in">
          {children}
        </main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
