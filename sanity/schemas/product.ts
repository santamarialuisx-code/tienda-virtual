import { defineField, defineType } from "sanity";

export default defineType({
  name: "product",
  title: "Producto",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Nombre",
      type: "string",
      validation: (Rule) => Rule.required().error("El nombre es obligatorio"),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Descripción",
      type: "text",
    }),
    defineField({
      name: "price",
      title: "Precio (USD)",
      type: "number",
      validation: (Rule) =>
        Rule.required()
          .min(0)
          .error("El precio debe ser un número positivo"),
    }),
    defineField({
      name: "images",
      title: "Imágenes",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "alt",
              title: "Texto alternativo",
              type: "string",
              description: "Descripción de la imagen para accesibilidad",
            },
          ],
        },
      ],
      validation: (Rule) => Rule.max(10).error("Máximo 10 imágenes"),
    }),
    defineField({
      name: "category",
      title: "Categoría",
      type: "reference",
      to: [{ type: "category" }],
      validation: (Rule) => Rule.required().error("Selecciona una categoría"),
    }),
    defineField({
      name: "variants",
      title: "Variantes",
      type: "array",
      of: [{ type: "productVariant" }],
    }),
    defineField({
      name: "stock",
      title: "Stock",
      type: "number",
      validation: (Rule) => Rule.min(0).error("El stock no puede ser negativo"),
      initialValue: 0,
    }),
    defineField({
      name: "brand",
      title: "Marca",
      type: "string",
    }),
    defineField({
      name: "tags",
      title: "Etiquetas",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "featured",
      title: "Destacado",
      type: "boolean",
      initialValue: false,
      description: "Los productos destacados aparecen en la página principal",
    }),
    defineField({
      name: "isActive",
      title: "Activo",
      type: "boolean",
      initialValue: true,
      description: "Los productos inactivos no son visibles en la tienda",
    }),
    defineField({
      name: "createdAt",
      title: "Fecha de creación",
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
      title: "Nombre A-Z",
      name: "nameAsc",
      by: [{ field: "name", direction: "asc" }],
    },
    {
      title: "Precio: menor a mayor",
      name: "priceAsc",
      by: [{ field: "price", direction: "asc" }],
    },
    {
      title: "Precio: mayor a menor",
      name: "priceDesc",
      by: [{ field: "price", direction: "desc" }],
    },
    {
      title: "Stock bajo",
      name: "stockAsc",
      by: [{ field: "stock", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "name",
      media: "images.0",
      subtitle: "category.name",
    },
  },
});
