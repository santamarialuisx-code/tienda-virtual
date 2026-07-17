import { defineField, defineType } from "sanity";

export default defineType({
  name: "order",
  title: "Pedido",
  type: "document",
  fields: [
    defineField({
      name: "customerEmail",
      title: "Email del Cliente",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "customerName",
      title: "Nombre del Cliente",
      type: "string",
    }),
    defineField({
      name: "items",
      title: "Productos",
      type: "array",
      of: [{ type: "orderItem" }],
    }),
    defineField({
      name: "subtotal",
      title: "Subtotal",
      type: "number",
    }),
    defineField({
      name: "shipping",
      title: "Envío",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "tax",
      title: "Impuesto",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "total",
      title: "Total",
      type: "number",
    }),
    defineField({
      name: "status",
      title: "Estado",
      type: "string",
      options: {
        list: [
          { title: "⏳ Pendiente", value: "pending" },
          { title: "🔍 Pend. Confirmación", value: "pending_confirmation" },
          { title: "✅ Pagado", value: "paid" },
          { title: "📦 Enviado", value: "shipped" },
          { title: "🏠 Entregado", value: "delivered" },
          { title: "❌ Cancelado", value: "cancelled" },
        ],
      },
      initialValue: "pending",
    }),
    defineField({
      name: "productionStatus",
      title: "Estado de producción",
      type: "string",
      options: {
        list: [
          { title: "⏳ Pendiente", value: "pendiente" },
          { title: "🏭 En producción", value: "en_produccion" },
          { title: "✅ Listo", value: "listo" },
          { title: "📤 Enviado", value: "enviado" },
        ],
      },
      initialValue: "pendiente",
      description:
        "Seguimiento del estado de fabricación para pedidos personalizados",
    }),
    defineField({
      name: "source",
      title: "Origen del pedido",
      type: "string",
      options: {
        list: [
          { title: "🛒 Checkout", value: "checkout" },
          { title: "📱 WhatsApp", value: "whatsapp" },
        ],
      },
      initialValue: "checkout",
      description:
        "Indica si el pedido fue realizado por checkout o por WhatsApp",
    }),
    defineField({
      name: "paymentMethod",
      title: "Método de Pago",
      type: "string",
      options: {
        list: [
          { title: "💳 PayPal", value: "paypal" },
          { title: "📱 PagoMóvil", value: "pagomovil" },
        ],
      },
    }),
    defineField({
      name: "paypalOrderId",
      title: "ID de Orden PayPal",
      type: "string",
      hidden: ({ document }) => document?.paymentMethod !== "paypal",
    }),
    defineField({
      name: "shippingAddress",
      title: "Dirección de Envío",
      type: "object",
      fields: [
        defineField({
          name: "address",
          title: "Dirección",
          type: "string",
        }),
        defineField({
          name: "city",
          title: "Ciudad",
          type: "string",
        }),
        defineField({
          name: "state",
          title: "Estado",
          type: "string",
        }),
        defineField({
          name: "phone",
          title: "Teléfono",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "notes",
      title: "Notas",
      type: "text",
      description: "Notas internas del administrador sobre el pedido",
    }),
    defineField({
      name: "createdAt",
      title: "Fecha del Pedido",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
  ],
  orderings: [
    {
      title: "Más recientes",
      name: "createdAtDesc",
      by: [{ field: "createdAt", direction: "desc" }],
    },
    {
      title: "Total: mayor a menor",
      name: "totalDesc",
      by: [{ field: "total", direction: "desc" }],
    },
    {
      title: "Estado",
      name: "statusAsc",
      by: [{ field: "status", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "customerEmail",
      subtitle: "status",
      media: "items.0.productName",
    },
    prepare(selection) {
      const statusLabels: Record<string, string> = {
        pending: "⏳ Pendiente",
        pending_confirmation: "🔍 Pend. Confirmación",
        paid: "✅ Pagado",
        shipped: "📦 Enviado",
        delivered: "🏠 Entregado",
        cancelled: "❌ Cancelado",
      };
      return {
        title: selection.title || "Sin email",
        subtitle: statusLabels[selection.subtitle as string] || selection.subtitle,
      };
    },
  },
});
