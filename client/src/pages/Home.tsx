import { useState, useEffect } from "react";
import { Link } from "wouter";
import { fetchProducts } from "../lib/csv-parser";
import { Product } from "../types";
import { Navbar } from "../components/Navbar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts()
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch products", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container px-4 py-8">
        <h1 className="text-3xl font-bold tracking-tight mb-8">Latest Collection</h1>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col space-y-3">
                <Skeleton className="h-[300px] w-full rounded-xl" />
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link key={product.handle} href={`/product/${product.handle}`}>
                <div className="group cursor-pointer">
                  <Card className="border-0 shadow-none overflow-hidden">
                    <CardContent className="p-0 relative aspect-[3/4] overflow-hidden bg-muted rounded-lg">
                      <img
                        src={product.imageSrc}
                        alt={product.title}
                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                      />
                    </CardContent>
                    <CardFooter className="flex flex-col items-start p-4 px-0">
                      <h3 className="font-medium text-lg leading-none">{product.title}</h3>
                      <p className="text-sm text-muted-foreground mt-2">${product.price}</p>
                    </CardFooter>
                  </Card>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
