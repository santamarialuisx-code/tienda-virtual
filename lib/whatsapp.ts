import type { CustomizationData } from "@/lib/sanity/types";
import type { CartItem } from "@/lib/store/cart";

/**
 * Generates a WhatsApp deep link with a pre-filled message.
 * @param phone - WhatsApp phone number (with country code, no + or spaces)
 * @param message - Message to pre-fill
 * @returns wa.me URL
 */
export function generateWhatsAppLink(phone: string, message: string): string {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encodedMessage}`;
}

/**
 * Generates a WhatsApp message for a product with customization details.
 * @param productName - Name of the product
 * @param customization - Customization data (color, size, text, tier, fee)
 * @returns Formatted message string
 */
export function generateProductMessage(
  productName: string,
  customization?: CustomizationData
): string {
  let message = `Hola, me interesa el producto: ${productName}`;

  if (customization?.color) {
    message += `\nColor: ${customization.color}`;
  }
  if (customization?.size) {
    message += `\nTalla: ${customization.size}`;
  }
  if (customization?.text) {
    message += `\nTexto: "${customization.text}"`;
  }
  if (customization?.tier) {
    const tierLabels: Record<string, string> = {
      basic: "Básica",
      medium: "Media",
      complex: "Compleja",
    };
    const fee = customization.fee ? ` (+$${customization.fee.toFixed(2)})` : "";
    message += `\nComplejidad: ${tierLabels[customization.tier]}${fee}`;
  }

  return message;
}

/**
 * Generates a WhatsApp link for a product with customization.
 * Uses the WHATSAPP_PHONE environment variable.
 * @param productName - Name of the product
 * @param customization - Customization data
 * @returns wa.me URL or null if phone not configured
 */
export function generateProductWhatsAppLink(
  productName: string,
  customization?: CustomizationData
): string | null {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE;
  if (!phone) {
    console.warn("NEXT_PUBLIC_WHATSAPP_PHONE environment variable not set");
    return null;
  }
  const message = generateProductMessage(productName, customization);
  return generateWhatsAppLink(phone, message);
}

/**
 * Generates a WhatsApp message for a cart with multiple items.
 * @param items - Cart items
 * @returns Formatted message string
 */
export function generateCartMessage(items: CartItem[]): string {
  if (items.length === 0) return "";

  let message = "Hola, me interesa hacer un pedido:\n\n";

  items.forEach((item, index) => {
    message += `${index + 1}. ${item.name}`;
    if (item.quantity > 1) {
      message += ` (x${item.quantity})`;
    }
    message += "\n";

    if (item.customization) {
      const details: string[] = [];
      if (item.customization.color) {
        details.push(`Color: ${item.customization.color}`);
      }
      if (item.customization.size) {
        details.push(`Talla: ${item.customization.size}`);
      }
      if (item.customization.text) {
        details.push(`Texto: "${item.customization.text}"`);
      }
      if (item.customization.tier) {
        const tierLabels: Record<string, string> = {
          basic: "Básica",
          medium: "Media",
          complex: "Compleja",
        };
        details.push(`Complejidad: ${tierLabels[item.customization.tier]}`);
      }
      if (details.length > 0) {
        message += `   ${details.join(" | ")}\n`;
      }
    }

    message += "\n";
  });

  return message;
}

/**
 * Generates a WhatsApp link for a cart with multiple items.
 * Uses the WHATSAPP_PHONE environment variable.
 * @param items - Cart items
 * @returns wa.me URL or null if phone not configured
 */
export function generateCartWhatsAppLink(items: CartItem[]): string | null {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE;
  if (!phone) {
    console.warn("NEXT_PUBLIC_WHATSAPP_PHONE environment variable not set");
    return null;
  }
  const message = generateCartMessage(items);
  return generateWhatsAppLink(phone, message);
}