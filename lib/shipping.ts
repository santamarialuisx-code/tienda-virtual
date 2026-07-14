// Shipping and tax calculation for Venezuela

const FREE_SHIPPING_THRESHOLD = 50.00; // USD
const FLAT_RATE_SHIPPING = 5.00; // USD
const TAX_RATE = 0; // No tax for Venezuela

export function calculateShipping(subtotal: number): number {
  if (subtotal >= FREE_SHIPPING_THRESHOLD) {
    return 0; // Free shipping over $50
  }
  return FLAT_RATE_SHIPPING;
}

export function calculateTax(_subtotal: number): number {
  // Venezuela has 0% tax (IVA) for online sales
  // Using underscore prefix to indicate intentionally unused parameter
  return _subtotal * TAX_RATE;
}

export function getShippingInfo(subtotal: number): {
  cost: number;
  isFree: boolean;
  message: string;
} {
  const cost = calculateShipping(subtotal);
  const isFree = cost === 0;

  if (isFree) {
    return {
      cost: 0,
      isFree: true,
      message: "¡Envío gratis!",
    };
  }

  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
  return {
    cost: FLAT_RATE_SHIPPING,
    isFree: false,
    message: `Envío estándar: $${FLAT_RATE_SHIPPING.toFixed(2)} USD. ¡Agrega $${remaining.toFixed(2)} USD más para envío gratis!`,
  };
}

export function getOrderTotal(
  subtotal: number,
  shipping: number,
  tax: number
): number {
  return subtotal + shipping + tax;
}
