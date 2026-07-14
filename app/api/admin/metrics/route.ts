import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { client } from "@/lib/sanity/client";

export async function GET() {
  // Check admin authentication
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json(
      { error: "No autorizado" },
      { status: 401 }
    );
  }

  try {
    const query = `{
      "totalProducts": count(*[_type == "product"]),
      "activeProducts": count(*[_type == "product" && isActive == true]),
      "lowStockProducts": count(*[_type == "product" && isActive == true && stock < 5]),
      "totalOrders": count(*[_type == "order"]),
      "pendingOrders": count(*[_type == "order" && status == "pending"]),
      "pendingConfirmationOrders": count(*[_type == "order" && status == "pending_confirmation"]),
      "paidOrders": count(*[_type == "order" && status == "paid"]),
      "shippedOrders": count(*[_type == "order" && status == "shipped"]),
      "deliveredOrders": count(*[_type == "order" && status == "delivered"]),
      "cancelledOrders": count(*[_type == "order" && status == "cancelled"]),
      "totalRevenue": math::sum(*[_type == "order" && status == "paid"].total),
      "totalUsers": count(*[_type == "user"]),
      "recentOrders": *[_type == "order"] | order(createdAt desc)[0...10] {
        _id,
        customerEmail,
        customerName,
        total,
        status,
        paymentMethod,
        createdAt
      },
      "lowStockItems": *[_type == "product" && isActive == true && stock < 5] | order(stock asc)[0...10] {
        _id,
        name,
        stock,
        price,
        category->{ name }
      }
    }`;

    const metrics = await client.fetch(query);
    return NextResponse.json(metrics);
  } catch (error) {
    console.error("Error fetching admin metrics:", error);
    return NextResponse.json(
      { error: "Error al obtener métricas" },
      { status: 500 }
    );
  }
}
