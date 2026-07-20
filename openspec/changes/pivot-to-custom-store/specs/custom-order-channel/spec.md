# Custom Order Channel Specification

## Purpose

The custom order channel capability enables customers to place custom/personalized orders via WhatsApp using a simple wa.me link with a pre-written message. It also introduces made-to-order production tracking with manual status updates in Sanity. This is a NEW domain — no existing spec exists.

## Requirements

### Requirement: WhatsApp Order Link

The system SHALL generate a wa.me link with a pre-encoded message when a customer initiates a custom order via WhatsApp. The message SHALL include the product name, selected customization options (color, size, text), and total price. No WhatsApp Business API integration is required — this is a simple deep link.

#### Scenario: Generate WhatsApp link from cart

- GIVEN a customer has customized items in their cart
- WHEN they click "Pedir por WhatsApp"
- THEN a wa.me URL is generated with a pre-written message
- AND the message includes: product name, color, size (if applicable), text (if applicable), and total price
- AND the link opens in a new tab

#### Scenario: WhatsApp message format

- GIVEN a customer has a "Vaso Naruto" in cart with color: blue, text: "Believe it", total: $20
- WHEN the WhatsApp link is generated
- THEN the message is URL-encoded and includes:
  - Product: Vaso Naruto
  - Color: Azul
  - Texto: Believe it
  - Total: $20
  - A polite greeting and request for confirmation

#### Scenario: Multiple items in cart

- GIVEN a customer has 3 customized items in cart
- WHEN they click "Pedir por WhatsApp"
- THEN the message lists all 3 items with their individual customizations
- AND a grand total is included at the bottom

#### Scenario: WhatsApp link without customization

- GIVEN a customer has a non-customized product in cart
- WHEN they click "Pedir por WhatsApp"
- THEN the message includes the product name and price
- AND customization fields are omitted

### Requirement: WhatsApp Button Placement

The system SHALL display a "Pedir por WhatsApp" button on the cart page, product detail pages (for personalizable products), and the customization review step. The button SHALL use WhatsApp's brand green color and the WhatsApp icon.

#### Scenario: WhatsApp button on cart page

- GIVEN a customer has items in the cart
- WHEN they view the /cart page
- THEN a "Pedir por WhatsApp" button is displayed below the cart items
- AND the button is visually distinct from the standard checkout button

#### Scenario: WhatsApp button on product detail

- GIVEN a product has `personalizationEnabled: true`
- WHEN a customer views the product detail page
- THEN a "Pedir por WhatsApp" option is available alongside the standard CTA

#### Scenario: WhatsApp button on customization review

- GIVEN a customer is on Step 4 (review) of customization
- WHEN the review step loads
- THEN both "Agregar al carrito" and "Pedir por WhatsApp" options are available
- AND "Pedir por WhatsApp" opens the link immediately (no add-to-cart required)

### Requirement: Production Status Tracking

The system SHALL track custom order production status in Sanity with manual admin updates. Statuses SHALL be: pendiente, en producción, listo, enviado. The order schema SHALL be extended with a `productionStatus` field.

#### Scenario: Order created with production status

- GIVEN a customer places an order (via checkout or WhatsApp)
- WHEN the order is created in Sanity
- THEN `productionStatus` is set to "pendiente"
- AND the admin sees the order in the orders list with this status

#### Scenario: Admin updates production status

- GIVEN an admin views an order with status "pendiente"
- WHEN they change the status to "en producción"
- THEN the status is updated in Sanity
- AND the change is logged in revision history
- AND the admin can continue updating through "listo" → "enviado"

#### Scenario: Status dropdown in admin

- GIVEN an admin is editing an order in Sanity Studio
- WHEN they view the productionStatus field
- THEN a dropdown shows: Pendiente, En Producción, Listo, Enviado
- AND the current status is highlighted

### Requirement: Custom Order Data in Cart

The system SHALL store customization data (color, size, text, tier, fee) as a structured object in the Zustand cart state. This data SHALL be serialized when generating WhatsApp messages and when creating orders.

#### Scenario: Cart item with customization

- GIVEN a customer added a customized "Camisa Dragon Ball" to cart
- WHEN they view the cart
- THEN the item shows: product name, color, size, text, base price, fee, and total
- AND the customization data is editable (customer can re-customize)

#### Scenario: WhatsApp message includes cart customization data

- GIVEN the cart has customized items with structured data
- WHEN the WhatsApp link is generated
- THEN each item's customization data is included in the message
- AND the data matches what's stored in the cart

### Requirement: Order Source Tracking

The system SHALL distinguish between orders placed via standard checkout (PayPal/PagoMóvil) and orders initiated via WhatsApp. The order schema SHALL include a `source` field with values: checkout, whatsapp.

#### Scenario: Checkout order

- GIVEN a customer completes payment via PayPal
- WHEN the order is created
- THEN `source` is set to "checkout"
- AND `productionStatus` defaults to "pendiente"

#### Scenario: WhatsApp order

- GIVEN a customer clicks "Pedir por WhatsApp" and sends the message
- WHEN the admin manually creates the order in Sanity
- THEN `source` is set to "whatsapp"
- AND `productionStatus` defaults to "pendiente"
- AND the WhatsApp message content is preserved in `notes`

## Data Models

### Sanity Schema: Order (Modified)

```typescript
{
  name: 'order',
  type: 'document',
  fields: [
    // ... existing fields (customerEmail, customerName, items, subtotal, etc.)
    { name: 'productionStatus', title: 'Estado de Producción', type: 'string',
      options: { list: [
        { title: '⏳ Pendiente', value: 'pendiente' },
        { title: '🏭 En Producción', value: 'en_produccion' },
        { title: '✅ Listo', value: 'listo' },
        { title: '📦 Enviado', value: 'enviado' },
      ]},
      initialValue: 'pendiente'
    },
    { name: 'source', title: 'Fuente del Pedido', type: 'string',
      options: { list: [
        { title: 'Carrito (Checkout)', value: 'checkout' },
        { title: 'WhatsApp', value: 'whatsapp' },
      ]},
      initialValue: 'checkout'
    },
  ]
}
```

### Sanity Schema: OrderItem (Extended)

```typescript
{
  name: 'orderItem',
  type: 'object',
  fields: [
    // ... existing fields (product, productName, quantity, price, variant)
    { name: 'customization', title: 'Personalización', type: 'object', fields: [
      { name: 'tier', type: 'string' },       // 'basico' | 'medio' | 'complejo'
      { name: 'color', type: 'string' },
      { name: 'size', type: 'string' },
      { name: 'text', type: 'string' },
      { name: 'fee', type: 'number' },
    ]}
  ]
}
```

### TypeScript Types

```typescript
type ProductionStatus = 'pendiente' | 'en_produccion' | 'listo' | 'enviado';
type OrderSource = 'checkout' | 'whatsapp';

interface WhatsAppMessage {
  items: Array<{
    name: string;
    color?: string;
    size?: string;
    text?: string;
    price: number;
  }>;
  total: number;
}

function generateWhatsAppUrl(message: WhatsAppMessage, phoneNumber: string): string {
  const text = formatWhatsAppMessage(message);
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
}
```

### GROQ Queries

```groq
// Orders with production status
*[_type == "order"] | order(createdAt desc) {
  _id, customerEmail, productionStatus, source, total, createdAt,
  items[]->{ productName, customization }
}

// Orders by production status (admin dashboard)
*[_type == "order" && productionStatus == $status] | order(createdAt desc) {
  _id, customerEmail, source, total, createdAt
}
```

## Components

| Component | Type | Description |
|-----------|------|-------------|
| `WhatsAppButton` | Client | Green WhatsApp button with icon |
| `WhatsAppMessageBuilder` | Client | Generates wa.me URL from cart/customization data |
| `ProductionStatusBadge` | Client | Shows current production status with color coding |
| `OrderSourceBadge` | Client | Shows "Checkout" or "WhatsApp" source |

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/whatsapp/link` | POST | Generate wa.me URL from cart data (server-side encoding) |

## Acceptance Criteria

- [ ] "Pedir por WhatsApp" button appears on cart page, product detail, and customization review
- [ ] WhatsApp link opens wa.me with pre-written message including all customization details
- [ ] Multiple items are listed in the WhatsApp message with individual customizations
- [ ] Production status field exists on orders with 4 states (pendiente, en producción, listo, enviado)
- [ ] Admin can update production status via Sanity Studio dropdown
- [ ] Order source (checkout vs whatsapp) is tracked
- [ ] WhatsApp orders preserve the message content in order notes
- [ ] Cart stores customization data as structured JSON
- [ ] All touch targets are 44x44px minimum

## Edge Cases

- WhatsApp phone number not configured — show error "Contacta al administrador"
- Cart is empty — "Pedir por WhatsApp" button is disabled or hidden
- Special characters in custom text — URL-encode properly for wa.me link
- Long WhatsApp message (>2000 chars) — truncate items list, show first 3 items + "y X más"
- Customer clicks WhatsApp button but doesn't send message — no order is created (admin handles manually)
- Admin updates production status to "enviado" — no automatic notification (manual process)
- Order with mixed customized and non-customized items — list both in WhatsApp message
