import { defineField, defineType } from "sanity";

export default defineType({
  name: "orderItem",
  title: "Order Item",
  type: "object",
  fields: [
    defineField({
      name: "product",
      title: "Product",
      type: "reference",
      to: [{ type: "product" }],
    }),
    defineField({
      name: "productName",
      title: "Product Name",
      type: "string",
    }),
    defineField({
      name: "quantity",
      title: "Quantity",
      type: "number",
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "number",
    }),
    defineField({
      name: "variant",
      title: "Variant",
      type: "string",
    }),
    defineField({
      name: "customization",
      title: "Personalización",
      type: "object",
      fields: [
        defineField({
          name: "color",
          title: "Color",
          type: "string",
          description: "Color seleccionado por el cliente",
        }),
        defineField({
          name: "size",
          title: "Talla",
          type: "string",
          description: "Talla seleccionada por el cliente",
        }),
        defineField({
          name: "text",
          title: "Texto personalizado",
          type: "string",
          description: "Texto que el cliente quiere en su producto",
        }),
        defineField({
          name: "tier",
          title: "Tier de complejidad",
          type: "string",
          options: {
            list: [
              { title: "Básico", value: "basic" },
              { title: "Medio", value: "medium" },
              { title: "Complejo", value: "complex" },
            ],
          },
          description: "Nivel de complejidad de la personalización",
        }),
        defineField({
          name: "fee",
          title: "Cargo adicional (USD)",
          type: "number",
          description: "Cargo extra por la personalización",
        }),
      ],
      description:
        "Datos de personalización del producto (solo para productos personalizables)",
    }),
  ],
});
