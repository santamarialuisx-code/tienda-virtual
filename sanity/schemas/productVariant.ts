import { defineField, defineType } from "sanity";

export default defineType({
  name: "productVariant",
  title: "Product Variant",
  type: "object",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "price",
      title: "Price (USD)",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "stock",
      title: "Stock",
      type: "number",
      validation: (Rule) => Rule.min(0),
      initialValue: 0,
    }),
    defineField({
      name: "options",
      title: "Options",
      type: "object",
      fields: [
        defineField({
          name: "size",
          title: "Size",
          type: "string",
        }),
        defineField({
          name: "color",
          title: "Color",
          type: "string",
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "price",
    },
  },
});
