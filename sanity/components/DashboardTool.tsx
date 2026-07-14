"use client";

import { useEffect, useState, useCallback } from "react";
import { useClient } from "sanity";

interface DashboardMetrics {
  totalProducts: number;
  activeProducts: number;
  lowStockProducts: number;
  totalOrders: number;
  pendingOrders: number;
  paidOrders: number;
  totalRevenue: number;
  recentOrders: Array<{
    _id: string;
    customerEmail: string;
    customerName?: string;
    total: number;
    status: string;
    paymentMethod: string;
    createdAt: string;
  }>;
  lowStockItems: Array<{
    _id: string;
    name: string;
    stock: number;
    price: number;
  }>;
}

const STATUS_LABELS: Record<string, string> = {
  pending: "Pendiente",
  pending_confirmation: "Pend. Confirmación",
  paid: "Pagado",
  shipped: "Enviado",
  delivered: "Entregado",
  cancelled: "Cancelado",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "#f59e0b",
  pending_confirmation: "#f97316",
  paid: "#22c55e",
  shipped: "#3b82f6",
  delivered: "#10b981",
  cancelled: "#ef4444",
};

const PAYMENT_LABELS: Record<string, string> = {
  paypal: "PayPal",
  pagomovil: "PagoMóvil",
};

export function DashboardTool() {
  const client = useClient({ apiVersion: "2024-01-01" });
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const query = `{
        "totalProducts": count(*[_type == "product"]),
        "activeProducts": count(*[_type == "product" && isActive == true]),
        "lowStockProducts": count(*[_type == "product" && isActive == true && stock < 5]),
        "totalOrders": count(*[_type == "order"]),
        "pendingOrders": count(*[_type == "order" && status == "pending"]),
        "paidOrders": count(*[_type == "order" && status == "paid"]),
        "totalRevenue": math::sum(*[_type == "order" && status == "paid"].total),
        "recentOrders": *[_type == "order"] | order(createdAt desc)[0...5] {
          _id,
          customerEmail,
          customerName,
          total,
          status,
          paymentMethod,
          createdAt
        },
        "lowStockItems": *[_type == "product" && isActive == true && stock < 5] | order(stock asc)[0...5] {
          _id,
          name,
          stock,
          price
        }
      }`;

      const data = await client.fetch<DashboardMetrics>(query);
      setMetrics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar métricas");
    } finally {
      setLoading(false);
    }
  }, [client]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  if (loading) {
    return (
      <div style={{ padding: "24px", textAlign: "center", color: "#666" }}>
        <div style={{ fontSize: "18px", marginBottom: "8px" }}>⏳</div>
        Cargando métricas...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "24px", textAlign: "center", color: "#ef4444" }}>
        <div style={{ fontSize: "18px", marginBottom: "8px" }}>❌</div>
        {error}
        <div style={{ marginTop: "16px" }}>
          <button
            onClick={fetchMetrics}
            style={{
              padding: "8px 16px",
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!metrics) return null;

  const cards = [
    {
      title: "Productos Totales",
      value: metrics.totalProducts,
      subtitle: `${metrics.activeProducts} activos`,
      icon: "📦",
      color: "#3b82f6",
    },
    {
      title: "Pedidos Totales",
      value: metrics.totalOrders,
      subtitle: `${metrics.pendingOrders} pendientes`,
      icon: "🛒",
      color: "#8b5cf6",
    },
    {
      title: "Ingresos (USD)",
      value: `$${metrics.totalRevenue.toFixed(2)}`,
      subtitle: `${metrics.paidOrders} pedidos pagados`,
      icon: "💰",
      color: "#22c55e",
    },
    {
      title: "Stock Bajo",
      value: metrics.lowStockProducts,
      subtitle: "productos con stock < 5",
      icon: "⚠️",
      color: "#f59e0b",
    },
  ];

  return (
    <div style={{ padding: "24px", maxWidth: "1200px" }}>
      <h1
        style={{
          fontSize: "24px",
          fontWeight: "700",
          marginBottom: "24px",
          color: "#1a1a1a",
        }}
      >
        Dashboard de Administración
      </h1>

      {/* Metric Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
          marginBottom: "32px",
        }}
      >
        {cards.map((card) => (
          <div
            key={card.title}
            style={{
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "12px",
              }}
            >
              <span style={{ fontSize: "28px" }}>{card.icon}</span>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  color: card.color,
                  backgroundColor: `${card.color}15`,
                  padding: "2px 8px",
                  borderRadius: "12px",
                }}
              >
                {card.subtitle}
              </span>
            </div>
            <div
              style={{
                fontSize: "28px",
                fontWeight: "700",
                color: "#1a1a1a",
                marginBottom: "4px",
              }}
            >
              {card.value}
            </div>
            <div style={{ fontSize: "14px", color: "#6b7280" }}>
              {card.title}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
          gap: "24px",
        }}
      >
        {/* Recent Orders */}
        <div
          style={{
            backgroundColor: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          }}
        >
          <h2
            style={{
              fontSize: "16px",
              fontWeight: "600",
              marginBottom: "16px",
              color: "#1a1a1a",
            }}
          >
            Pedidos Recientes
          </h2>
          {metrics.recentOrders.length === 0 ? (
            <p style={{ color: "#9ca3af", textAlign: "center", padding: "20px" }}>
              No hay pedidos aún
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {metrics.recentOrders.map((order) => (
                <div
                  key={order._id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px",
                    backgroundColor: "#f9fafb",
                    borderRadius: "8px",
                  }}
                >
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: "500", color: "#1a1a1a" }}>
                      {order.customerName || order.customerEmail}
                    </div>
                    <div style={{ fontSize: "12px", color: "#6b7280" }}>
                      {new Date(order.createdAt).toLocaleDateString("es-VE")} ·{" "}
                      {PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "14px", fontWeight: "600", color: "#1a1a1a" }}>
                      ${order.total.toFixed(2)}
                    </div>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: "600",
                        color: STATUS_COLORS[order.status] || "#6b7280",
                        backgroundColor: `${STATUS_COLORS[order.status] || "#6b7280"}15`,
                        padding: "2px 6px",
                        borderRadius: "4px",
                      }}
                    >
                      {STATUS_LABELS[order.status] || order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock Products */}
        <div
          style={{
            backgroundColor: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          }}
        >
          <h2
            style={{
              fontSize: "16px",
              fontWeight: "600",
              marginBottom: "16px",
              color: "#1a1a1a",
            }}
          >
            Stock Bajo
          </h2>
          {metrics.lowStockItems.length === 0 ? (
            <p style={{ color: "#9ca3af", textAlign: "center", padding: "20px" }}>
              Todos los productos tienen stock suficiente
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {metrics.lowStockItems.map((item) => (
                <div
                  key={item._id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px",
                    backgroundColor: item.stock === 0 ? "#fef2f2" : "#fffbeb",
                    borderRadius: "8px",
                    border: `1px solid ${item.stock === 0 ? "#fecaca" : "#fde68a"}`,
                  }}
                >
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: "500", color: "#1a1a1a" }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: "12px", color: "#6b7280" }}>
                      ${item.price.toFixed(2)}
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: "700",
                      color: item.stock === 0 ? "#dc2626" : "#d97706",
                    }}
                  >
                    {item.stock} uds
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div
        style={{
          marginTop: "32px",
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <a
          href="/admin/structure/product;create"
          style={{
            padding: "10px 20px",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500",
            textDecoration: "none",
          }}
        >
          + Nuevo Producto
        </a>
        <a
          href="/admin/structure/category;create"
          style={{
            padding: "10px 20px",
            backgroundColor: "#8b5cf6",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500",
            textDecoration: "none",
          }}
        >
          + Nueva Categoría
        </a>
        <a
          href="/admin/structure/order"
          style={{
            padding: "10px 20px",
            backgroundColor: "#f59e0b",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500",
            textDecoration: "none",
          }}
        >
          Ver Pedidos
        </a>
        <button
          onClick={fetchMetrics}
          style={{
            padding: "10px 20px",
            backgroundColor: "#6b7280",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500",
          }}
        >
          🔄 Actualizar
        </button>
      </div>
    </div>
  );
}
