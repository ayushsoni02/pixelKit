import mongoose, { Schema, model, models } from "mongoose";

export const IMAGE_VARIANTS = {
  SQUARE: {
    type: "SQUARE",
    dimensions: { width: 1200, height: 1200 },
    label: "Square (1:1)",
    aspectRatio: "1:1",
  },
  WIDE: {
    type: "WIDE",
    dimensions: { width: 1920, height: 1080 },
    label: "Widescreen (16:9)",
    aspectRatio: "16:9",
  },
  PORTRAIT: {
    type: "PORTRAIT",
    dimensions: { width: 1080, height: 1440 },
    label: "Portrait (3:4)",
    aspectRatio: "3:4",
  },
} as const;

export const MEDIA_TYPES = {
  IMAGE: "image",
  VIDEO: "video",
  EBOOK: "ebook",
  PDF: "pdf",
} as const;

export const CATEGORIES = {
  NATURE: "nature",
  BUSINESS: "business",
  TECHNOLOGY: "technology",
  LIFESTYLE: "lifestyle",
  TRAVEL: "travel",
  FOOD: "food",
  ARCHITECTURE: "architecture",
  ABSTRACT: "abstract",
  ILLUSTRATION: "illustration",
  PHOTOGRAPHY: "photography",
} as const;

export type ImageVariantType = keyof typeof IMAGE_VARIANTS;
export type MediaType = typeof MEDIA_TYPES[keyof typeof MEDIA_TYPES];
export type Category = typeof CATEGORIES[keyof typeof CATEGORIES];

export interface ImageVariant {
  type: ImageVariantType;
  price: number;
  license: "personal" | "commercial" | "extended";
}

export interface VideoVariant {
  quality: "720p" | "1080p" | "4K";
  duration: number; // in seconds
  price: number;
  license: "personal" | "commercial" | "extended";
}

export interface DocumentVariant {
  format: "PDF" | "EPUB" | "MOBI";
  pages?: number;
  price: number;
  license: "personal" | "commercial" | "extended";
}

export interface IProduct {
  _id?: mongoose.Types.ObjectId;
  name: string;
  description: string;
  mediaType: MediaType;
  category: Category;
  tags: string[];
  thumbnailUrl: string;
  mediaUrl: string;
  variants: ImageVariant[] | VideoVariant[] | DocumentVariant[];
  creator: string;
  featured: boolean;
  downloads: number;
  rating: number;
  reviewCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const imageVariantSchema = new Schema<ImageVariant>({
  type: {
    type: String,
    required: true,
    enum: ["SQUARE", "WIDE", "PORTRAIT"],
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  license: {
    type: String,
    required: true,
    enum: ["personal", "commercial", "extended"],
  },
});

const videoVariantSchema = new Schema<VideoVariant>({
  quality: {
    type: String,
    required: true,
    enum: ["720p", "1080p", "4K"],
  },
  duration: {
    type: Number,
    required: true,
    min: 0,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  license: {
    type: String,
    required: true,
    enum: ["personal", "commercial", "extended"],
  },
});

const documentVariantSchema = new Schema<DocumentVariant>({
  format: {
    type: String,
    required: true,
    enum: ["PDF", "EPUB", "MOBI"],
  },
  pages: {
    type: Number,
    min: 0,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  license: {
    type: String,
    required: true,
    enum: ["personal", "commercial", "extended"],
  },
});

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    mediaType: {
      type: String,
      required: true,
      enum: Object.values(MEDIA_TYPES),
    },
    category: {
      type: String,
      required: true,
      enum: Object.values(CATEGORIES),
    },
    tags: [{ type: String }],
    thumbnailUrl: { type: String, required: true },
    mediaUrl: { type: String, required: true },
    variants: {
      type: Schema.Types.Mixed, // Can be any of the variant types
      required: true,
      validate: {
        validator: function(variants: any[]) {
          return variants && variants.length > 0;
        },
        message: "At least one variant is required",
      },
    },
    creator: { type: String, required: true },
    featured: { type: Boolean, default: false },
    downloads: { type: Number, default: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Indexes for better query performance
productSchema.index({ mediaType: 1, category: 1 });
productSchema.index({ featured: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ downloads: -1 });
productSchema.index({ tags: 1 });
productSchema.index({ name: "text", description: "text" });

const Product = models?.Product || model<IProduct>("Product", productSchema);

export default Product;