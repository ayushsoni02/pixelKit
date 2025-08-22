"use client";

import React, { useEffect, useState } from "react";
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Star, 
  TrendingUp, 
  Sparkles, 
  ArrowRight,
  Play,
  Image as ImageIcon,
  FileText,
  Download,
  SlidersHorizontal,
  X,
  ChevronDown
} from "lucide-react";
import { IProduct, MEDIA_TYPES, CATEGORIES } from "@/models/Product";
import { apiClient } from "@/lib/api-client";
import ImageGallery from "../components/ImageGallery";

export default function BrowsePage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedMediaType, setSelectedMediaType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLicenses, setSelectedLicenses] = useState<string[]>([]);

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

    // Price range filter
    filtered = filtered.filter((product) => {
      const minPrice = Math.min(...(product.variants as any[]).map(v => v.price));
      return minPrice >= priceRange[0] && minPrice <= priceRange[1];
    });

    // License filter
    if (selectedLicenses.length > 0) {
      filtered = filtered.filter((product) => 
        (product.variants as any[]).some(variant => 
          selectedLicenses.includes(variant.license)
        )
      );
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
  }, [products, searchTerm, selectedCategory, selectedMediaType, sortBy, priceRange, selectedLicenses]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedMediaType("all");
    setPriceRange([0, 1000]);
    setSelectedLicenses([]);
  };

  const toggleLicense = (license: string) => {
    setSelectedLicenses(prev => 
      prev.includes(license) 
        ? prev.filter(l => l !== license)
        : [...prev, license]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading amazing content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Browse Digital Assets
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Discover our curated collection of premium digital content for your creative projects
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for images, videos, e-books, PDFs..."
                className="w-full pl-12 pr-4 py-4 text-lg border-0 rounded-2xl shadow-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <SlidersHorizontal className="w-5 h-5 mr-2" />
                  Filters
                </h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400"
                >
                  Clear all
                </button>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Category</h3>
                <select
                  className="input-modern w-full"
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
              </div>

              {/* Media Type Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Media Type</h3>
                <select
                  className="input-modern w-full"
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
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Price Range: ${priceRange[0]} - ${priceRange[1]}
                </h3>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>$0</span>
                    <span>$1000</span>
                  </div>
                </div>
              </div>

              {/* License Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">License</h3>
                <div className="space-y-2">
                  {["personal", "commercial", "extended"].map((license) => (
                    <label key={license} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedLicenses.includes(license)}
                        onChange={() => toggleLicense(license)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 capitalize">
                        {license}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sort Options */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Sort By</h3>
                <select
                  className="input-modern w-full"
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
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {searchTerm || selectedCategory !== "all" || selectedMediaType !== "all"
                    ? `Search Results (${filteredProducts.length})`
                    : "All Digital Assets"}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Showing {filteredProducts.length} of {products.length} assets
                </p>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "grid" 
                      ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400" 
                      : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "list" 
                      ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400" 
                      : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Active Filters */}
            {(searchTerm || selectedCategory !== "all" || selectedMediaType !== "all" || selectedLicenses.length > 0) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {searchTerm && (
                  <span className="badge-modern badge-primary">
                    Search: {searchTerm}
                    <button
                      onClick={() => setSearchTerm("")}
                      className="ml-2 hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedCategory !== "all" && (
                  <span className="badge-modern badge-primary">
                    Category: {selectedCategory}
                    <button
                      onClick={() => setSelectedCategory("all")}
                      className="ml-2 hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedMediaType !== "all" && (
                  <span className="badge-modern badge-primary">
                    Type: {selectedMediaType}
                    <button
                      onClick={() => setSelectedMediaType("all")}
                      className="ml-2 hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedLicenses.map((license) => (
                  <span key={license} className="badge-modern badge-primary">
                    License: {license}
                    <button
                      onClick={() => toggleLicense(license)}
                      className="ml-2 hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <Search className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    No assets found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Try adjusting your search terms or filters to find what you're looking for.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="btn-primary"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            ) : (
              <ImageGallery products={filteredProducts} viewMode={viewMode} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
