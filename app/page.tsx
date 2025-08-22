"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
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
  Users,
  Award,
  Zap,
  Shield,
  Globe,
  Heart
} from "lucide-react";
import { IProduct, MEDIA_TYPES, CATEGORIES } from "@/models/Product";
import { apiClient } from "@/lib/api-client";
import ImageGallery from "./components/ImageGallery";

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

    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }

    if (selectedMediaType !== "all") {
      filtered = filtered.filter((product) => product.mediaType === selectedMediaType);
    }

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

  const stats = [
    { label: "Total Assets", value: products.length, icon: ImageIcon },
    { label: "Categories", value: Object.keys(CATEGORIES).length, icon: Grid },
    { label: "Media Types", value: Object.keys(MEDIA_TYPES).length, icon: FileText },
    { label: "Happy Users", value: "10K+", icon: Users },
  ];

  const features = [
    {
      icon: Shield,
      title: "Secure Downloads",
      description: "All assets are securely delivered with watermark protection"
    },
    {
      icon: Award,
      title: "Premium Quality",
      description: "Curated collection of high-resolution digital assets"
    },
    {
      icon: Zap,
      title: "Instant Access",
      description: "Download immediately after payment confirmation"
    },
    {
      icon: Globe,
      title: "Global License",
      description: "Use your assets worldwide with flexible licensing"
    }
  ];

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6">
              Premium Digital Assets for{" "}
              <span className="text-gradient">Creators</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Discover high-quality images, videos, e-books, and PDFs. 
              Perfect for your next creative project.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-12">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for images, videos, e-books, PDFs..."
                  className="w-full pl-12 pr-16 py-4 text-lg border-0 rounded-2xl shadow-strong focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 transition-colors">
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                    <stat.icon className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose PixelKit?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              We provide everything you need to bring your creative vision to life
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <feature.icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Browse Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Browse Digital Assets
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Discover our curated collection of premium digital content
              </p>
            </div>
            <Link
              href="/browse"
              className="btn-primary inline-flex items-center space-x-2"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg mb-8">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="font-medium text-gray-700 dark:text-gray-300">Filters:</span>
              </div>

              <select
                className="input-modern max-w-xs"
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

              <select
                className="input-modern max-w-xs"
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

              <select
                className="input-modern max-w-xs"
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

              <div className="flex items-center space-x-2 ml-auto">
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
          </div>

          {/* Featured Products */}
          {featuredProducts.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center space-x-2 mb-6">
                <Sparkles className="w-6 h-6 text-yellow-500" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Featured Assets</h3>
              </div>
              <ImageGallery products={featuredProducts} viewMode={viewMode} />
            </div>
          )}

          {/* All Products */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {searchTerm || selectedCategory !== "all" || selectedMediaType !== "all"
                  ? `Search Results (${filteredProducts.length})`
                  : "All Digital Assets"}
              </h3>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {filteredProducts.length} of {products.length} assets
              </div>
            </div>

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
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("all");
                      setSelectedMediaType("all");
                    }}
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
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Creating?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of creators who trust PixelKit for their digital asset needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="btn-secondary">
              Get Started Free
            </Link>
            <Link href="/browse" className="btn-outline border-white text-white hover:bg-white hover:text-blue-600">
              Browse Assets
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}