import { IProduct } from "@/models/Product";
import ProductCard from "./ProductCard";

interface ImageGalleryProps {
  products: IProduct[];
  viewMode?: "grid" | "list";
}

export default function ImageGallery({ products, viewMode = "grid" }: ImageGalleryProps) {
  if (viewMode === "list") {
    return (
      <div className="space-y-4">
        {products.map((product) => (
          <ProductCard key={product._id?.toString()} product={product} viewMode="list" />
        ))}

        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-base-content/70">No products found</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product._id?.toString()} product={product} viewMode="grid" />
      ))}

      {products.length === 0 && (
        <div className="col-span-full text-center py-12">
          <p className="text-base-content/70">No products found</p>
        </div>
      )}
    </div>
  );
}