import { IKImage } from "imagekitio-next";
import Link from "next/link";
import { IProduct, IMAGE_VARIANTS, MEDIA_TYPES } from "@/models/Product";
import { Eye, Star, Download, Play, FileText, Image as ImageIcon } from "lucide-react";

interface ProductCardProps {
  product: IProduct;
  viewMode: "grid" | "list";
}

export default function ProductCard({ product, viewMode }: ProductCardProps) {
  const lowestPrice = (product.variants as any[]).reduce(
    (min, variant) => (variant.price < min ? variant.price : min),
    (product.variants as any[])[0]?.price || 0
  );

  const getMediaIcon = (mediaType: string) => {
    switch (mediaType) {
      case MEDIA_TYPES.VIDEO:
        return <Play className="w-4 h-4" />;
      case MEDIA_TYPES.EBOOK:
      case MEDIA_TYPES.PDF:
        return <FileText className="w-4 h-4" />;
      default:
        return <ImageIcon className="w-4 h-4" />;
    }
  };

  const getMediaTypeLabel = (mediaType: string) => {
    switch (mediaType) {
      case MEDIA_TYPES.VIDEO:
        return "Video";
      case MEDIA_TYPES.EBOOK:
        return "E-Book";
      case MEDIA_TYPES.PDF:
        return "PDF";
      default:
        return "Image";
    }
  };

  if (viewMode === "list") {
    return (
      <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="card-body">
          <div className="flex items-center gap-6">
            {/* Thumbnail */}
            <div className="w-32 h-24 bg-base-200 rounded-lg overflow-hidden flex-shrink-0">
              <IKImage
                path={product.thumbnailUrl}
                alt={product.name}
                loading="lazy"
                transformation={[
                  {
                    height: "96",
                    width: "128",
                    cropMode: "extract",
                    focus: "center",
                    quality: 80,
                  },
                ]}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/products/${product._id}`}
                    className="hover:opacity-80 transition-opacity"
                  >
                    <h2 className="card-title text-lg mb-2">{product.name}</h2>
                  </Link>
                  <p className="text-sm text-base-content/70 line-clamp-2 mb-3">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      {getMediaIcon(product.mediaType)}
                      <span className="text-base-content/70">
                        {getMediaTypeLabel(product.mediaType)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-warning fill-current" />
                      <span>{product.rating.toFixed(1)}</span>
                      <span className="text-base-content/50">({product.reviewCount})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="w-4 h-4 text-base-content/50" />
                      <span className="text-base-content/50">{product.downloads}</span>
                    </div>
                  </div>
                </div>

                {/* Price and Actions */}
                <div className="flex flex-col items-end gap-3">
                  <div className="text-right">
                    <span className="text-2xl font-bold">${lowestPrice.toFixed(2)}</span>
                    <div className="text-xs text-base-content/50">
                      {(product.variants as any[]).length} options available
                    </div>
                  </div>
                  <Link
                    href={`/products/${product._id}`}
                    className="btn btn-primary btn-sm gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View Options
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view (original design with enhancements)
  return (
    <div className="card bg-base-100 shadow hover:shadow-lg transition-all duration-300">
      <figure className="relative px-4 pt-4">
        <Link
          href={`/products/${product._id}`}
          className="relative group w-full"
        >
          <div
            className="rounded-xl overflow-hidden relative w-full"
            style={{
              aspectRatio:
                IMAGE_VARIANTS.SQUARE.dimensions.width /
                IMAGE_VARIANTS.SQUARE.dimensions.height,
            }}
          >
            <IKImage
              path={product.thumbnailUrl}
              alt={product.name}
              loading="lazy"
              transformation={[
                {
                  height: IMAGE_VARIANTS.SQUARE.dimensions.height.toString(),
                  width: IMAGE_VARIANTS.SQUARE.dimensions.width.toString(),
                  cropMode: "extract",
                  focus: "center",
                  quality: 80,
                },
              ]}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            
            {/* Media Type Badge */}
            <div className="absolute top-2 left-2 badge badge-primary badge-sm gap-1">
              {getMediaIcon(product.mediaType)}
              {getMediaTypeLabel(product.mediaType)}
            </div>

            {/* Featured Badge */}
            {product.featured && (
              <div className="absolute top-2 right-2 badge badge-secondary badge-sm">
                Featured
              </div>
            )}

            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 rounded-xl" />
          </div>
        </Link>
      </figure>

      <div className="card-body p-4">
        <Link
          href={`/products/${product._id}`}
          className="hover:opacity-80 transition-opacity"
        >
          <h2 className="card-title text-lg">{product.name}</h2>
        </Link>

        <p className="text-sm text-base-content/70 line-clamp-2 min-h-[2.5rem]">
          {product.description}
        </p>

        {/* Rating and Downloads */}
        <div className="flex items-center gap-4 text-sm mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-warning fill-current" />
            <span>{product.rating.toFixed(1)}</span>
            <span className="text-base-content/50">({product.reviewCount})</span>
          </div>
          <div className="flex items-center gap-1">
            <Download className="w-4 h-4 text-base-content/50" />
            <span className="text-base-content/50">{product.downloads}</span>
          </div>
        </div>

        <div className="card-actions justify-between items-center mt-2">
          <div className="flex flex-col">
            <span className="text-lg font-bold">
              From ${lowestPrice.toFixed(2)}
            </span>
            <span className="text-xs text-base-content/50">
              {(product.variants as any[]).length} options available
            </span>
          </div>

          <Link
            href={`/products/${product._id}`}
            className="btn btn-primary btn-sm gap-2"
          >
            <Eye className="w-4 h-4" />
            View Options
          </Link>
        </div>
      </div>
    </div>
  );
}