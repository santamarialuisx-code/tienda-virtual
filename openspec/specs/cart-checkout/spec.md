# Cart & Checkout Specification

## Purpose

The cart and checkout capability manages the shopping cart state using Zustand with persistence, integrates with Stripe Checkout for payment processing, and handles webhook events for order fulfillment. It provides a seamless flow from adding items to completing a purchase.

## Requirements

### Requirement: Cart State Management

The system SHALL maintain shopping cart state using Zustand with localStorage persistence. Cart state SHALL survive page refreshes and browser sessions. The cart SHALL be available across all pages via a floating cart icon with item count badge.

#### Scenario: Add item to cart

- GIVEN a customer is viewing a product detail page
- WHEN they click "Add to Cart" button
- THEN the item is added to the cart with quantity 1
- AND a success toast notification is displayed
- AND the cart icon badge updates to reflect the new count
- AND the cart state persists to localStorage

#### Scenario: Add duplicate item

- GIVEN a customer has "Shirt - Size M" in the cart with quantity 1
- WHEN they add the same item again
- THEN the quantity increments to 2
- AND the cart total updates accordingly
- AND no duplicate entry is created

#### Scenario: Remove item from cart

- GIVEN a customer has items in the cart
- WHEN they click the remove button on a cart item
- THEN the item is removed from the cart
- AND the cart total recalculates
- AND the cart icon badge updates

#### Scenario: Update item quantity

- GIVEN a customer has an item with quantity 2 in the cart
- WHEN they change the quantity to 3
- THEN the item quantity updates to 3
- AND the line item total recalculates
- AND the cart total updates

#### Scenario: Cart persistence across sessions

- GIVEN a customer adds items to the cart
- WHEN they close the browser and return later
- THEN the cart items are still present
- AND quantities and prices are preserved

#### Scenario: Empty cart display

- GIVEN a customer has no items in the cart
- WHEN they view the cart page
- THEN a message "Your cart is empty" is displayed
- AND a "Continue Shopping" link is shown

### Requirement: Cart Page Display

The system SHALL provide a /cart page displaying all cart items with images, names, prices, quantities, and totals. The page SHALL include quantity controls, remove buttons, and a checkout button.

#### Scenario: Cart page with items

- GIVEN a customer has 3 items in the cart
- WHEN they navigate to /cart
- THEN all items are displayed with images, names, unit prices, quantities, and line totals
- AND a subtotal, shipping estimate, and total are shown
- AND a "Proceed to Checkout" button is visible

#### Scenario: Cart page responsive layout

- GIVEN a customer views /cart on mobile
- WHEN the page loads
- THEN items are displayed in a single column
- AND quantity controls are touch-friendly (44x44px minimum)
- AND the checkout button is fixed at the bottom

### Requirement: Stripe Checkout Integration

The system SHALL create Stripe Checkout sessions via an API route and redirect customers to Stripe's hosted checkout page. Checkout SHALL support credit card payments in test and live modes.

#### Scenario: Initiate checkout

- GIVEN a customer has items in the cart
- WHEN they click "Proceed to Checkout"
- THEN a loading state is displayed
- AND an API call creates a Stripe Checkout session
- AND the customer is redirected to Stripe's checkout page

#### Scenario: Checkout session creation failure

- GIVEN Stripe API is unavailable or returns an error
- WHEN the customer attempts checkout
- THEN an error message is displayed
- AND the customer remains on the cart page
- AND the cart state is preserved

#### Scenario: Successful payment completion

- GIVEN a customer completes payment on Stripe Checkout
- WHEN the payment succeeds
- THEN the customer is redirected to /checkout/success
- AND a success message with order summary is displayed
- AND the cart is cleared
- AND an order record is created in Sanity via webhook

#### Scenario: Payment cancellation

- GIVEN a customer is on Stripe Checkout
- WHEN they click "Cancel" or navigate away
- THEN they are redirected to /checkout/cancel
- AND a message "Payment was not completed" is shown
- AND the cart items remain intact

### Requirement: Stripe Webhook Handling

The system SHALL process Stripe webhook events to update order status. The webhook endpoint SHALL verify Stripe signatures and handle idempotency.

#### Scenario: Successful payment webhook

- GIVEN Stripe sends a checkout.session.completed event
- WHEN the webhook endpoint receives the event
- THEN the signature is verified
- AND an order is created in Sanity with status "paid"
- AND the order includes customer email, items, and total
- AND the webhook responds with 200 OK

#### Scenario: Idempotent webhook processing

- GIVEN Stripe retries a webhook event (duplicate delivery)
- WHEN the webhook endpoint receives the same event ID
- THEN the event is recognized as duplicate
- AND no duplicate order is created
- AND the endpoint responds with 200 OK

#### Scenario: Invalid webhook signature

- GIVEN a request hits the webhook endpoint with an invalid signature
- WHEN the signature verification fails
- THEN the endpoint responds with 401 Unauthorized
- AND no order is created
- AND the event is logged for investigation

#### Scenario: Webhook endpoint unavailability

- GIVEN the webhook endpoint is down or times out
- WHEN Stripe retries the event
- THEN Stripe continues retrying per its schedule
- AND the endpoint processes the event on recovery

### Requirement: Order Creation

The system SHALL create order records in Sanity when payment is confirmed. Orders SHALL include customer information, items purchased, totals, and payment status.

#### Scenario: Order record creation

- GIVEN a successful Stripe checkout session
- WHEN the webhook processes the completed event
- THEN an order document is created in Sanity with:
  - Customer email from Stripe session
  - Items with product references, quantities, and prices
  - Subtotal, shipping, tax, and total
  - Status: "paid"
  - Stripe session ID for reference

#### Scenario: Order with multiple items

- GIVEN a customer purchases 3 different products
- WHEN the order is created
- THEN all 3 items are included in the order
- AND each item has the correct quantity and price at time of purchase
- AND the order total matches the sum of line items

### Requirement: Checkout Success Page

The system SHALL display a confirmation page after successful payment with order summary and next steps. The page SHALL be accessible only with a valid session.

#### Scenario: Success page display

- GIVEN a customer completes payment
- WHEN they arrive at /checkout/success
- THEN an order confirmation is displayed
- AND the order number/reference is shown
- AND a summary of purchased items is displayed
- AND a "Continue Shopping" link is available

#### Scenario: Direct access to success page

- GIVEN a customer navigates directly to /checkout/success without completing checkout
- WHEN the page loads
- THEN they are redirected to the homepage
- OR a generic "No recent order" message is displayed

### Requirement: Cart Icon with Badge

The system SHALL display a floating cart icon in the header with a badge showing the total item count. The icon SHALL be clickable to navigate to /cart.

#### Scenario: Cart icon display

- GIVEN a customer is on any page
- WHEN the header renders
- THEN a cart icon is visible in the top navigation
- AND the badge shows the current item count
- AND the badge is hidden when the cart is empty

#### Scenario: Cart icon update

- GIVEN a customer adds an item to the cart
- WHEN the cart state updates
- THEN the cart icon badge animates to reflect the new count
- AND the update is visible without page refresh

## Data Models

### Sanity Schema: Order

```typescript
{
  name: 'order',
  type: 'document',
  fields: [
    { name: 'customerEmail', type: 'string', validation: required },
    { name: 'items', type: 'array', of: [{ type: 'orderItem' }] },
    { name: 'subtotal', type: 'number' },
    { name: 'shipping', type: 'number' },
    { name: 'tax', type: 'number' },
    { name: 'total', type: 'number' },
    { name: 'status', type: 'string', options: { list: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'] } },
    { name: 'stripeSessionId', type: 'string' },
    { name: 'createdAt', type: 'datetime' }
  ]
}
```

### Sanity Schema: OrderItem

```typescript
{
  name: 'orderItem',
  type: 'object',
  fields: [
    { name: 'product', type: 'reference', to: [{ type: 'product' }] },
    { name: 'quantity', type: 'number' },
    { name: 'price', type: 'number' },
    { name: 'variant', type: 'string' }
  ]
}
```

### Zustand Cart State

```typescript
interface CartState {
  items: CartItem[];
  addItem: (product: Product, variant?: string) => void;
  removeItem: (productId: string, variant?: string) => void;
  updateQuantity: (productId: string, variant: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

interface CartItem {
  product: Product;
  variant?: string;
  quantity: number;
  price: number;
}
```

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/checkout` | POST | Create Stripe Checkout session |
| `/api/webhooks/stripe` | POST | Handle Stripe webhook events |
| `/api/orders` | GET | List orders for authenticated user |

## Components

| Component | Type | Description |
|-----------|------|-------------|
| `CartIcon` | Client | Header cart icon with badge |
| `CartPage` | Client | Full cart page with items and checkout |
| `CartItem` | Client | Individual cart item row with controls |
| `CartSummary` | Server | Order summary with totals |
| `CheckoutButton` | Client | Initiates Stripe Checkout |
| `CheckoutSuccess` | Server | Order confirmation page |
| `CheckoutCancel` | Server | Payment cancelled page |

## Testing Strategy

### Unit Tests
- Zustand cart store: add, remove, update, clear, totals
- Cart persistence (localStorage mock)
- Price calculation with variants
- Webhook signature verification

### Integration Tests
- Cart state across page navigations
- Stripe Checkout session creation flow
- Webhook event processing and order creation
- Cart clearing after successful payment

### E2E Tests (Playwright)
- Full purchase flow: add to cart → checkout → payment → confirmation
- Cart persistence across browser sessions
- Webhook retry handling
- Error states: failed payment, invalid cart

## Dependencies

### Depends On
- `product-catalog`: Products are added to cart from catalog
- Stripe account and API keys
- Sanity CMS for order storage

### Depended On By
- `user-auth`: Order history requires authenticated user
- `admin-panel`: Orders are managed in admin

## Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Stripe webhook delivery failures | High | Implement idempotency, log all events, use Stripe CLI for testing |
| Cart state corruption | Medium | Use Zustand with immer for immutable updates, validate state |
| Price changes between cart and checkout | Medium | Display disclaimer, lock prices at checkout session creation |
| localStorage quota exceeded | Low | Implement cart size limits, compress stored data |
| Concurrent cart modifications | Low | Cart is per-user, no multi-device sync needed for MVP |