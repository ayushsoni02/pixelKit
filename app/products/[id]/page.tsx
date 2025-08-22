"use client";

import { IKImage } from "imagekitio-next";
import {
  IProduct,
  ImageVariant,
  VideoVariant,
  DocumentVariant,
  IMAGE_VARIANTS,
  ImageVariantType,
  MEDIA_TYPES,
} from "@/models/Product";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, AlertCircle, Check, Image as ImageIcon, Play, FileText, Star, Download, Tag } from "lucide-react";
import { useNotification } from "@/app/components/Notification";
import { useSession } from "next-auth/react";
import { apiClient } from "@/lib/api-client";

type Variant = ImageVariant | VideoVariant | DocumentVariant;

export default function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const { showNotification } = useNotification();
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const fetchProduct = async () => {
      const id = params?.id;

      if (!id) {
        setError("Product ID is missing");
        setLoading(false);
        return;
      }

      try {
        const data = await apiClient.getProduct(id.toString());
        setProduct(data);
        // Set first variant as default
        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0] as Variant);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(err instanceof Error ? err.message : "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params?.id]);

  const handlePurchase = async (variant: Variant) => {
    if (!session) {
      showNotification("Please login to make a purchase", "error");
      router.push("/login");
      return;
    }

    if (!product?._id) {
      showNotification("Invalid product", "error");
      return;
    }

    try {
      const { orderId, amount } = await apiClient.createOrder({
        productId: product._id,
        variant,
      });

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount,
        currency: "USD",
        name: "PixelKit",
        description: `${product.name} - ${getVariantLabel(variant)}`,
        order_id: orderId,
        handler: function () {
          showNotification("Payment successful!", "success");
          router.push("/orders");
        },
        prefill: {
          email: session.user.email,
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
      showNotification(
        error instanceof Error ? error.message : "Payment failed",
        "error"
      );
    }
  };

  const getVariantLabel = (variant: Variant) => {
    if ('type' in variant) {
      // Image variant
      return IMAGE_VARIANTS[variant.type].label;
    } else if ('quality' in variant) {
      // Video variant
      return `${variant.quality} Quality`;
    } else if ('format' in variant) {
      // Document variant
      return `${variant.format} Format`;
    }
    return "Standard";
  };

  const getMediaIcon = (mediaType: string) => {
    switch (mediaType) {
      case MEDIA_TYPES.VIDEO:
        return <Play className="w-5 h-5" />;
      case MEDIA_TYPES.EBOOK:
      case MEDIA_TYPES.PDF:
        return <FileText className="w-5 h-5" />;
      default:
        return <ImageIcon className="w-5 h-5" />;
    }
  };

  const getTransformation = (variantType: ImageVariantType) => {
    const variant = IMAGE_VARIANTS[variantType];
    return [
      {
        width: variant.dimensions.width.toString(),
        height: variant.dimensions.height.toString(),
        cropMode: "extract" as "extract",
        focus: "center",
        quality: 60,
      },
    ];
  };

  const renderVariantDetails = (variant: Variant) => {
    if ('type' in variant) {
      // Image variant
      const imageVariant = IMAGE_VARIANTS[variant.type];
      return (
        <div>
          <h3 className="font-semibold">{imageVariant.label}</h3>
          <p className="text-sm text-base-content/70">
            {imageVariant.dimensions.width} x {imageVariant.dimensions.height}px • {variant.license} license
          </p>
        </div>
      );
    } else if ('quality' in variant) {
      // Video variant
      return (
        <div>
          <h3 className="font-semibold">{variant.quality} Quality</h3>
          <p className="text-sm text-base-content/70">
            {Math.floor(variant.duration / 60)}:{(variant.duration % 60).toString().padStart(2, '0')} • {variant.license} license
          </p>
        </div>
      );
    } else if ('format' in variant) {
      // Document variant
      return (
        <div>
          <h3 className="font-semibold">{variant.format} Format</h3>
          <p className="text-sm text-base-content/70">
            {variant.pages ? `${variant.pages} pages • ` : ''}{variant.license} license
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading)
    return (
      <div className="min-h-[70vh] flex justify-center items-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );

  if (error || !product)
    return (
      <div className="alert alert-error max-w-md mx-auto my-8">
        <AlertCircle className="w-6 h-6" />
        <span>{error || "Product not found"}</span>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Media Section */}
        <div className="space-y-4">
          <div
            className="relative rounded-lg overflow-hidden bg-base-200"
            style={{
              aspectRatio: product.mediaType === "image" && selectedVariant && 'type' in selectedVariant
                ? `${IMAGE_VARIANTS[selectedVariant.type].dimensions.width} / ${IMAGE_VARIANTS[selectedVariant.type].dimensions.height}`
                : "16 / 9",
            }}
          >
            {product.mediaType === "image" ? (
              <IKImage
                urlEndpoint={process.env.NEXT_PUBLIC_URL_ENDPOINT}
                path={product.mediaUrl}
                alt={product.name}
                transformation={
                  selectedVariant && 'type' in selectedVariant
                    ? getTransformation(selectedVariant.type)
                    : getTransformation("SQUARE")
                }
                className="w-full h-full object-cover"
                loading="eager"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  {getMediaIcon(product.mediaType)}
                  <p className="mt-2 text-base-content/70">
                    {product.mediaType === "video" ? "Video Preview" : "Document Preview"}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Media Info */}
          {selectedVariant && (
            <div className="text-sm text-center text-base-content/70">
              {renderVariantDetails(selectedVariant)}
            </div>
          )}
        </div>

        {/* Product Details Section */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {getMediaIcon(product.mediaType)}
              <span className="badge badge-primary">{product.mediaType.toUpperCase()}</span>
              {product.featured && (
                <span className="badge badge-secondary">Featured</span>
              )}
            </div>
            <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
            <p className="text-base-content/80 text-lg mb-4">
              {product.description}
            </p>
            
            {/* Stats */}
            <div className="flex items-center gap-6 text-sm mb-4">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-warning fill-current" />
                <span>{product.rating.toFixed(1)}</span>
                <span className="text-base-content/50">({product.reviewCount} reviews)</span>
              </div>
              <div className="flex items-center gap-1">
                <Download className="w-4 h-4 text-base-content/50" />
                <span className="text-base-content/50">{product.downloads} downloads</span>
              </div>
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <span key={index} className="badge badge-outline gap-1">
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Variants Selection */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Available Versions</h2>
            {(product.variants as Variant[]).map((variant, index) => (
              <div
                key={index}
                className={`card bg-base-200 cursor-pointer hover:bg-base-300 transition-colors ${
                  selectedVariant === variant ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedVariant(variant)}
              >
                <div className="card-body p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      {getMediaIcon(product.mediaType)}
                      {renderVariantDetails(variant)}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xl font-bold">
                        ${variant.price.toFixed(2)}
                      </span>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePurchase(variant);
                        }}
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* License Information */}
          <div className="card bg-base-200">
            <div className="card-body p-4">
              <h3 className="font-semibold mb-2">License Information</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-success" />
                  <span><strong>Personal:</strong> Use in personal projects, social media, personal websites</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-success" />
                  <span><strong>Commercial:</strong> Use in commercial projects, advertising, business materials</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-success" />
                  <span><strong>Extended:</strong> Unlimited use, resale rights, multiple projects</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Creator Info */}
          <div className="card bg-base-200">
            <div className="card-body p-4">
              <h3 className="font-semibold mb-2">Creator</h3>
              <p className="text-base-content/70">{product.creator}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}