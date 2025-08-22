"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import FileUpload from "./FileUpload";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import { Loader2, Plus, Trash2, Tag, User } from "lucide-react";
import { useNotification } from "./Notification";
import { IMAGE_VARIANTS, MEDIA_TYPES, CATEGORIES, ImageVariantType, MediaType, Category } from "@/models/Product";
import { apiClient, ProductFormData } from "@/lib/api-client";

export default function AdminProductForm() {
  const [loading, setLoading] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const { showNotification } = useNotification();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormData>({
    defaultValues: {
      name: "",
      description: "",
      mediaType: "image" as MediaType,
      category: "nature" as Category,
      tags: [],
      thumbnailUrl: "",
      mediaUrl: "",
      variants: [
        {
          type: "SQUARE" as ImageVariantType,
          price: 9.99,
          license: "personal",
        },
      ],
      creator: "",
      featured: false,
      downloads: 0,
      rating: 0,
      reviewCount: 0,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  const watchedMediaType = watch("mediaType");

  const handleThumbnailUpload = (response: IKUploadResponse) => {
    setThumbnailUrl(response.filePath);
    setValue("thumbnailUrl", response.filePath);
    showNotification("Thumbnail uploaded successfully!", "success");
  };

  const handleMediaUpload = (response: IKUploadResponse) => {
    setMediaUrl(response.filePath);
    setValue("mediaUrl", response.filePath);
    showNotification("Media file uploaded successfully!", "success");
  };

  const addTag = (tag: string) => {
    const currentTags = watch("tags");
    if (tag && !currentTags.includes(tag)) {
      setValue("tags", [...currentTags, tag]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    const currentTags = watch("tags");
    setValue("tags", currentTags.filter(tag => tag !== tagToRemove));
  };

  const onSubmit = async (data: ProductFormData) => {
    setLoading(true);
    try {
      await apiClient.createProduct(data);
      showNotification("Product created successfully!", "success");

      // Reset form
      setValue("name", "");
      setValue("description", "");
      setValue("mediaType", "image");
      setValue("category", "nature");
      setValue("tags", []);
      setValue("thumbnailUrl", "");
      setValue("mediaUrl", "");
      setValue("variants", [
        {
          type: "SQUARE" as ImageVariantType,
          price: 9.99,
          license: "personal",
        },
      ]);
      setValue("creator", "");
      setValue("featured", false);
      setThumbnailUrl("");
      setMediaUrl("");
    } catch (error) {
      showNotification(
        error instanceof Error ? error.message : "Failed to create product",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const renderVariantFields = () => {
    switch (watchedMediaType) {
      case "video":
        return (
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="card bg-base-200 p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="form-control">
                    <label className="label">Quality</label>
                    <select
                      className="select select-bordered"
                      {...register(`variants.${index}.quality`)}
                    >
                      <option value="720p">720p</option>
                      <option value="1080p">1080p</option>
                      <option value="4K">4K</option>
                    </select>
                  </div>

                  <div className="form-control">
                    <label className="label">Duration (seconds)</label>
                    <input
                      type="number"
                      className="input input-bordered"
                      {...register(`variants.${index}.duration`, {
                        valueAsNumber: true,
                        required: "Duration is required",
                        min: { value: 1, message: "Duration must be at least 1 second" },
                      })}
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">License</label>
                    <select
                      className="select select-bordered"
                      {...register(`variants.${index}.license`)}
                    >
                      <option value="personal">Personal Use</option>
                      <option value="commercial">Commercial Use</option>
                      <option value="extended">Extended License</option>
                    </select>
                  </div>

                  <div className="form-control">
                    <label className="label">Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      className="input input-bordered"
                      {...register(`variants.${index}.price`, {
                        valueAsNumber: true,
                        required: "Price is required",
                        min: { value: 0.01, message: "Price must be greater than 0" },
                      })}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case "ebook":
      case "pdf":
        return (
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="card bg-base-200 p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="form-control">
                    <label className="label">Format</label>
                    <select
                      className="select select-bordered"
                      {...register(`variants.${index}.format`)}
                    >
                      <option value="PDF">PDF</option>
                      <option value="EPUB">EPUB</option>
                      <option value="MOBI">MOBI</option>
                    </select>
                  </div>

                  <div className="form-control">
                    <label className="label">Pages (optional)</label>
                    <input
                      type="number"
                      className="input input-bordered"
                      {...register(`variants.${index}.pages`, {
                        valueAsNumber: true,
                        min: { value: 1, message: "Pages must be at least 1" },
                      })}
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">License</label>
                    <select
                      className="select select-bordered"
                      {...register(`variants.${index}.license`)}
                    >
                      <option value="personal">Personal Use</option>
                      <option value="commercial">Commercial Use</option>
                      <option value="extended">Extended License</option>
                    </select>
                  </div>

                  <div className="form-control">
                    <label className="label">Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      className="input input-bordered"
                      {...register(`variants.${index}.price`, {
                        valueAsNumber: true,
                        required: "Price is required",
                        min: { value: 0.01, message: "Price must be greater than 0" },
                      })}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      default: // image
        return (
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="card bg-base-200 p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="form-control">
                    <label className="label">Size & Aspect Ratio</label>
                    <select
                      className="select select-bordered"
                      {...register(`variants.${index}.type`)}
                    >
                      {Object.entries(IMAGE_VARIANTS).map(([key, value]) => (
                        <option key={key} value={value.type}>
                          {value.label} ({value.dimensions.width}x{value.dimensions.height})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-control">
                    <label className="label">License</label>
                    <select
                      className="select select-bordered"
                      {...register(`variants.${index}.license`)}
                    >
                      <option value="personal">Personal Use</option>
                      <option value="commercial">Commercial Use</option>
                      <option value="extended">Extended License</option>
                    </select>
                  </div>

                  <div className="form-control">
                    <label className="label">Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      className="input input-bordered"
                      {...register(`variants.${index}.price`, {
                        valueAsNumber: true,
                        required: "Price is required",
                        min: { value: 0.01, message: "Price must be greater than 0" },
                      })}
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      type="button"
                      className="btn btn-error btn-sm"
                      onClick={() => remove(index)}
                      disabled={fields.length === 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="form-control">
          <label className="label">Product Name</label>
          <input
            type="text"
            className={`input input-bordered ${errors.name ? "input-error" : ""}`}
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && (
            <span className="text-error text-sm mt-1">{errors.name.message}</span>
          )}
        </div>

        <div className="form-control">
          <label className="label">Creator</label>
          <input
            type="text"
            className={`input input-bordered ${errors.creator ? "input-error" : ""}`}
            {...register("creator", { required: "Creator is required" })}
          />
          {errors.creator && (
            <span className="text-error text-sm mt-1">{errors.creator.message}</span>
          )}
        </div>
      </div>

      <div className="form-control">
        <label className="label">Description</label>
        <textarea
          className={`textarea textarea-bordered h-24 ${
            errors.description ? "textarea-error" : ""
          }`}
          {...register("description", { required: "Description is required" })}
        />
        {errors.description && (
          <span className="text-error text-sm mt-1">
            {errors.description.message}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="form-control">
          <label className="label">Media Type</label>
          <select
            className="select select-bordered"
            {...register("mediaType")}
          >
            {Object.entries(MEDIA_TYPES).map(([key, value]) => (
              <option key={key} value={value}>
                {key.charAt(0) + key.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </div>

        <div className="form-control">
          <label className="label">Category</label>
          <select
            className="select select-bordered"
            {...register("category")}
          >
            {Object.entries(CATEGORIES).map(([key, value]) => (
              <option key={key} value={value}>
                {key.charAt(0) + key.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </div>

        <div className="form-control">
          <label className="label cursor-pointer">
            <span>Featured Product</span>
            <input
              type="checkbox"
              className="toggle toggle-primary ml-2"
              {...register("featured")}
            />
          </label>
        </div>
      </div>

      <div className="form-control">
        <label className="label">Tags</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            className="input input-bordered flex-1"
            placeholder="Add a tag..."
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                const input = e.target as HTMLInputElement;
                addTag(input.value);
                input.value = '';
              }
            }}
          />
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => {
              const input = document.querySelector('input[placeholder="Add a tag..."]') as HTMLInputElement;
              if (input && input.value) {
                addTag(input.value);
                input.value = '';
              }
            }}
          >
            <Tag className="w-4 h-4" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {watch("tags").map((tag, index) => (
            <span key={index} className="badge badge-primary gap-2">
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="btn btn-ghost btn-xs"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="form-control">
          <label className="label">Thumbnail Image</label>
          <FileUpload onSuccess={handleThumbnailUpload} />
          {thumbnailUrl && (
            <div className="mt-2 text-sm text-success">
              ✓ Thumbnail uploaded: {thumbnailUrl}
            </div>
          )}
        </div>

        <div className="form-control">
          <label className="label">Media File</label>
          <FileUpload onSuccess={handleMediaUpload} />
          {mediaUrl && (
            <div className="mt-2 text-sm text-success">
              ✓ Media uploaded: {mediaUrl}
            </div>
          )}
        </div>
      </div>

      <div className="divider">Product Variants</div>

      {renderVariantFields()}

      <button
        type="button"
        className="btn btn-outline btn-block"
        onClick={() => {
          switch (watchedMediaType) {
            case "video":
              append({
                quality: "1080p",
                duration: 60,
                price: 19.99,
                license: "personal",
              });
              break;
            case "ebook":
            case "pdf":
              append({
                format: "PDF",
                pages: 50,
                price: 14.99,
                license: "personal",
              });
              break;
            default:
              append({
                type: "SQUARE" as ImageVariantType,
                price: 9.99,
                license: "personal",
              });
          }
        }}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Variant
      </button>

      <button
        type="submit"
        className="btn btn-primary btn-block"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Creating Product...
          </>
        ) : (
          "Create Product"
        )}
      </button>
    </form>
  );
}