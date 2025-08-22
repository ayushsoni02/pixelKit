"use client";

import React, { useEffect, useState } from "react";
import ImageGallery from "./components/ImageGallery";
import { IProduct, MEDIA_TYPES, CATEGORIES } from "@/models/Product";
import { apiClient } from "@/lib/api-client";
import { Search, Filter, Grid, List, Star, TrendingUp, Sparkles } from "lucide-react";

export default function Home() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedMediaType, setSelectedMediaType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await apiClient.getProducts();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = [...products];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }

    // Media type filter
    if (selectedMediaType !== "all") {
      filtered = filtered.filter((product) => product.mediaType === selectedMediaType);
    }

    // Sort
    switch (sortBy) {
      case "featured":
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "downloads":
        filtered.sort((a, b) => b.downloads - a.downloads);
        break;
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime());
        break;
      case "price-low":
        filtered.sort((a, b) => {
          const aMinPrice = Math.min(...(a.variants as any[]).map(v => v.price));
          const bMinPrice = Math.min(...(b.variants as any[]).map(v => v.price));
          return aMinPrice - bMinPrice;
        });
        break;
      case "price-high":
        filtered.sort((a, b) => {
          const aMinPrice = Math.min(...(a.variants as any[]).map(v => v.price));
          const bMinPrice = Math.min(...(b.variants as any[]).map(v => v.price));
          return bMinPrice - aMinPrice;
        });
        break;
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, selectedMediaType, sortBy]);

  const featuredProducts = products.filter(product => product.featured).slice(0, 6);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex justify-center items-center">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="hero bg-gradient-to-r from-primary to-secondary text-primary-content rounded-2xl mb-12">
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold mb-6">
              Premium Digital Assets for Creators
            </h1>
            <p className="text-xl mb-8">
              Discover high-quality images, videos, e-books, and PDFs. 
              Perfect for your next creative project.
            </p>
            <div className="stats shadow bg-base-100 text-base-content">
              <div className="stat">
                <div className="stat-title">Total Assets</div>
                <div className="stat-value text-primary">{products.length}</div>
              </div>
              <div className="stat">
                <div className="stat-title">Categories</div>
                <div className="stat-value text-secondary">{Object.keys(CATEGORIES).length}</div>
              </div>
              <div className="stat">
                <div className="stat-title">Media Types</div>
                <div className="stat-value text-accent">{Object.keys(MEDIA_TYPES).length}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <div className="join w-full max-w-2xl">
          <div className="join-item flex-1">
            <input
              type="text"
              placeholder="Search for images, videos, e-books, PDFs..."
              className="input input-bordered join-item w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn btn-primary join-item">
            <Search className="w-4 h-4" />
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            <span className="font-semibold">Filters:</span>
          </div>

          {/* Category Filter */}
          <select
            className="select select-bordered select-sm"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {Object.entries(CATEGORIES).map(([key, value]) => (
              <option key={key} value={value}>
                {key.charAt(0) + key.slice(1).toLowerCase()}
              </option>
            ))}
          </select>

          {/* Media Type Filter */}
          <select
            className="select select-bordered select-sm"
            value={selectedMediaType}
            onChange={(e) => setSelectedMediaType(e.target.value)}
          >
            <option value="all">All Types</option>
            {Object.entries(MEDIA_TYPES).map(([key, value]) => (
              <option key={key} value={value}>
                {key.charAt(0) + key.slice(1).toLowerCase()}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            className="select select-bordered select-sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="rating">Highest Rated</option>
            <option value="downloads">Most Downloaded</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>

          {/* View Mode */}
          <div className="btn-group">
            <button
              className={`btn btn-sm ${viewMode === "grid" ? "btn-active" : ""}`}
              onClick={() => setViewMode("grid")}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              className={`btn btn-sm ${viewMode === "list" ? "btn-active" : ""}`}
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Featured Assets</h2>
          </div>
          <ImageGallery products={featuredProducts} viewMode={viewMode} />
        </div>
      )}

      {/* All Products */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            {searchTerm || selectedCategory !== "all" || selectedMediaType !== "all"
              ? `Search Results (${filteredProducts.length})`
              : "All Digital Assets"}
          </h2>
          <div className="text-sm text-base-content/70">
            Showing {filteredProducts.length} of {products.length} assets
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <Search className="w-16 h-16 mx-auto mb-4 text-base-content/30" />
              <h3 className="text-xl font-semibold mb-2">No assets found</h3>
              <p className="text-base-content/70 mb-6">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                  setSelectedMediaType("all");
                }}
                className="btn btn-primary"
              >
                Clear Filters
              </button>
            </div>
          </div>
        ) : (
          <ImageGallery products={filteredProducts} viewMode={viewMode} />
        )}
      </div>
    </main>
  );
}