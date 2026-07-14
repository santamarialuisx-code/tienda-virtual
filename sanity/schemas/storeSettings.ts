import { defineField, defineType } from "sanity";

export default defineType({
  name: "storeSettings",
  title: "Configuración de Tienda",
  type: "document",
  fields: [
    defineField({
      name: "storeName",
      title: "Nombre de la Tienda",
      type: "string",
      initialValue: "Tienda Virtual",
    }),
    defineField({
      name: "storeDescription",
      title: "Descripción de la Tienda",
      type: "text",
    }),
    defineField({
      name: "contactEmail",
      title: "Email de Contacto",
      type: "string",
    }),
    defineField({
      name: "contactPhone",
      title: "Teléfono de Contacto",
      type: "string",
    }),
    defineField({
      name: "currency",
      title: "Moneda",
      type: "string",
      options: {
        list: [
          { title: "USD (Dólar Americano)", value: "USD" },
          { title: "VES (Bolívar)", value: "VES" },
        ],
      },
      initialValue: "USD",
    }),
    defineField({
      name: "paypalClientId",
      title: "PayPal Client ID",
      type: "string",
      description: "Client ID de PayPal para pagos",
    }),
    defineField({
      name: "pagomovilBank",
      title: "Banco PagoMóvil",
      type: "string",
      description: "Banco para transferencias PagoMóvil",
    }),
    defineField({
      name: "pagomovilPhone",
      title: "Teléfono PagoMóvil",
      type: "string",
      description: "Número de teléfono para PagoMóvil",
    }),
    defineField({
      name: "pagomovilId",
      title: "Cédula/RIF PagoMóvil",
      type: "string",
      description: "Cédula o RIF registrado en el banco",
    }),
    defineField({
      name: "freeShippingThreshold",
      title: "Envío Gratis desde (USD)",
      type: "number",
      initialValue: 50,
      description: "Monto mínimo para envío gratis en USD",
    }),
    defineField({
      name: "flatShippingRate",
      title: "Tarifa Plana de Envío (USD)",
      type: "number",
      initialValue: 5,
      description: "Costo fijo de envío en USD",
    }),
  ],
  preview: {
    select: {
      title: "storeName",
      subtitle: "currency",
    },
  },
});
