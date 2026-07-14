import { defineField, defineType } from "sanity";

export default defineType({
  name: "category",
  title: "Categoría",
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
      name: "image",
      title: "Imagen",
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
    }),
    defineField({
      name: "parent",
      title: "Categoría Padre",
      type: "reference",
      to: [{ type: "category" }],
      description: "Opcional: crea subcategorías anidadas",
    }),
    defineField({
      name: "sortOrder",
      title: "Orden",
      type: "number",
      initialValue: 0,
      description: "Número de orden para mostrar en la tienda (menor = primero)",
    }),
  ],
  orderings: [
    {
      title: "Nombre A-Z",
      name: "nameAsc",
      by: [{ field: "name", direction: "asc" }],
    },
    {
      title: "Orden",
      name: "sortOrderAsc",
      by: [{ field: "sortOrder", direction: "asc" }],
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
