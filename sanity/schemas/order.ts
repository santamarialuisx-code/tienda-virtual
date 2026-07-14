import { defineField, defineType } from "sanity";

export default defineType({
  name: "order",
  title: "Order",
  type: "document",
  fields: [
    defineField({
      name: "customerEmail",
      title: "Customer Email",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "customerName",
      title: "Customer Name",
      type: "string",
    }),
    defineField({
      name: "items",
      title: "Items",
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
      title: "Shipping",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "tax",
      title: "Tax",
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
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Pending Confirmation", value: "pending_confirmation" },
          { title: "Paid", value: "paid" },
          { title: "Shipped", value: "shipped" },
          { title: "Delivered", value: "delivered" },
          { title: "Cancelled", value: "cancelled" },
        ],
      },
      initialValue: "pending",
    }),
    defineField({
      name: "paymentMethod",
      title: "Payment Method",
      type: "string",
      options: {
        list: [
          { title: "PayPal", value: "paypal" },
          { title: "PagoMóvil", value: "pagomovil" },
        ],
      },
    }),
    defineField({
      name: "paypalOrderId",
      title: "PayPal Order ID",
      type: "string",
    }),
    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: "customerEmail",
      subtitle: "status",
    },
  },
});
