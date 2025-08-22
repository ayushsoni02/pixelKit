import { IOrder } from "@/models/Order";
import { IProduct, ImageVariant, VideoVariant, DocumentVariant } from "@/models/Product";
import { Types } from "mongoose";

export type ProductFormData = Omit<IProduct, "_id">;

export interface CreateOrderData {
  productId: Types.ObjectId | string;
  variant: ImageVariant | VideoVariant | DocumentVariant;
}

type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
  headers?: Record<string, string>;
};

class ApiClient {
  private async fetch<T>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<T> {
    const { method = "GET", body, headers = {} } = options;

    const defaultHeaders = {
      "Content-Type": "application/json",
      ...headers,
    };

    const response = await fetch(`/api${endpoint}`, {
      method,
      headers: defaultHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    return response.json();
  }

  async getProducts() {
    return this.fetch<IProduct[]>("/products");
  }

  async getProduct(id: string) {
    return this.fetch<IProduct>(`/products/${id}`);
  }

  async createProduct(productData: ProductFormData) {
    return this.fetch<IProduct>("/products", {
      method: "POST",
      body: productData,
    });
  }

  async updateProduct(id: string, productData: Partial<ProductFormData>) {
    return this.fetch<IProduct>(`/products/${id}`, {
      method: "PUT",
      body: productData,
    });
  }

  async deleteProduct(id: string) {
    return this.fetch<void>(`/products/${id}`, {
      method: "DELETE",
    });
  }

  async getUserOrders() {
    return this.fetch<IOrder[]>("/orders");
  }

  async createOrder(orderData: CreateOrderData) {
    const sanitizedOrderData = {
      ...orderData,
      productId: orderData.productId.toString(),
    };

    return this.fetch<{ orderId: string; amount: number; currency: string; dbOrderId: string }>("/orders", {
      method: "POST",
      body: sanitizedOrderData,
    });
  }

  // Search and filter methods
  async searchProducts(query: string) {
    return this.fetch<IProduct[]>(`/products/search?q=${encodeURIComponent(query)}`);
  }

  async getProductsByCategory(category: string) {
    return this.fetch<IProduct[]>(`/products/category/${category}`);
  }

  async getProductsByMediaType(mediaType: string) {
    return this.fetch<IProduct[]>(`/products/type/${mediaType}`);
  }

  async getFeaturedProducts() {
    return this.fetch<IProduct[]>("/products/featured");
  }
}

export const apiClient = new ApiClient();