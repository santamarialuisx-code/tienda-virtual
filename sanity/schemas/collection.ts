import { defineField, defineType } from "sanity";

export default defineType({
  name: "collection",
  title: "Colección",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Nombre",
      type: "string",
      validation: (Rule) =>
        Rule.required().error("El nombre de la colección es obligatorio"),
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
      name: "image",
      title: "Imagen de portada",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "products",
      title: "Productos",
      type: "array",
      of: [{ type: "reference", to: [{ type: "product" }] }],
    }),
    defineField({
      name: "isActive",
      title: "Activa",
      type: "boolean",
      initialValue: true,
      description: "Las colecciones inactivas no son visibles en la tienda",
    }),
    defineField({
      name: "sortOrder",
      title: "Orden",
      type: "number",
      initialValue: 0,
      description: "Número más bajo = se muestra primero",
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
      title: "Orden",
      name: "sortOrderAsc",
      by: [{ field: "sortOrder", direction: "asc" }],
    },
    {
      title: "Más recientes",
      name: "createdAtDesc",
      by: [{ field: "createdAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "name",
      media: "image",
      subtitle: "description",
    },
  },
});
