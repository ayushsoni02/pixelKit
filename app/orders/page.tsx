"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2, Download, Eye, Calendar, DollarSign, CheckCircle, Clock, XCircle } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { IOrder } from "@/models/Order";

export default function OrdersPage() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const data = await apiClient.getUserOrders();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [session, router]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-success" />;
      case "pending":
        return <Clock className="w-5 h-5 text-warning" />;
      case "failed":
        return <XCircle className="w-5 h-5 text-error" />;
      default:
        return <Clock className="w-5 h-5 text-base-content/50" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "badge-success";
      case "pending":
        return "badge-warning";
      case "failed":
        return "badge-error";
      default:
        return "badge-base-content/50";
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex justify-center items-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">My Orders</h1>
          <div className="text-sm text-base-content/70">
            {orders.length} order{orders.length !== 1 ? "s" : ""}
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <Eye className="w-16 h-16 mx-auto mb-4 text-base-content/30" />
              <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
              <p className="text-base-content/70 mb-6">
                Start exploring our digital assets and make your first purchase!
              </p>
              <button
                onClick={() => router.push("/")}
                className="btn btn-primary"
              >
                Browse Products
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id?.toString()} className="card bg-base-100 shadow-lg">
                <div className="card-body">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Product Info */}
                    <div className="flex items-start space-x-4">
                      <div className="w-20 h-20 bg-base-200 rounded-lg flex items-center justify-center">
                        <Eye className="w-8 h-8 text-base-content/50" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">
                          {(order.productId as any)?.name || "Product"}
                        </h3>
                        <p className="text-sm text-base-content/70">
                          {order.variant.type} • {order.variant.license} license
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          {getStatusIcon(order.status)}
                          <span className={`badge ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(order.createdAt || "").toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="w-4 h-4" />
                        <span className="font-semibold">
                          ${(order.amount / 100).toFixed(2)}
                        </span>
                      </div>
                      <div className="text-xs text-base-content/50">
                        Order ID: {order.razorpayOrderId}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2">
                      {order.status === "completed" && order.downloadUrl && (
                        <a
                          href={order.downloadUrl}
                          className="btn btn-primary btn-sm gap-2"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </a>
                      )}
                      {order.previewUrl && (
                        <a
                          href={order.previewUrl}
                          className="btn btn-outline btn-sm gap-2"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Eye className="w-4 h-4" />
                          Preview
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
