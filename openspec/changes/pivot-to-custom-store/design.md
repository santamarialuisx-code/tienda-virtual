# Design: Pivot to Personalized Anime/Pop Culture Store

## Technical Approach

Extend existing Sanity schemas additively (new fields, new types) without breaking current data. Build a client-side customization wizard using RHF + Zustand for state, integrated into existing product detail pages. Add collection document type and WhatsApp deep-link integration. Migrate stock-based model to made-to-order via deprecation.

## Architecture Decisions

| Decision | Options | Tradeoff | Choice | Rationale |
|----------|---------|----------|--------|-----------|
| Wizard state | URL-driven vs Zustand | URL adds route complexity; Zustand is simpler but client-only | Zustand | Existing cart uses Zustand persist; keeps wizard state client-side, avoids route pollution for 4-step flow |
| Schema evolution | New types vs extend existing | New types cleaner but needs migration; extend is additive | Extend + new | Add personalization fields to product (additive, safe), add new `collection` type, extend `orderItem` — all backward-compatible |
| Stock model | Delete `stock` field vs deprecate | Delete breaks queries; deprecate is safe | Deprecate | Remove stock logic from UI components, keep field for migration safety; use `isActive` for visibility |
| WhatsApp integration | Business API vs wa.me link | API needs account/fees; wa.me is free, simple | wa.me deep link | User confirmed: simple wa.me with pre-encoded message |
| Customization flow | Modal vs page | Modal is overlay; page is SEO-friendly but heavier | Dedicated component (modal-like overlay) | Customization is transient, not indexable; overlay avoids route complexity while fitting in product detail page |

## Data Flow

```
Sanity (schema) ──→ GROQ queries ──→ Server Components ──→ Product Detail
                                                                   │
                                               ┌───────────────────┘
                                               ▼
                                     "Personalizá el tuyo" CTA
                                               │
                                               ▼
                                  ┌─── Customization Wizard (Client) ───┐
                                  │  Step 1: Base product              │
                                  │  Step 2: Color swatches + size     │
                                  │  Step 3: Custom text (optional)    │
                                  │  Step 4: Review + price breakdown  │
                                  └──────────┬────────────┬────────────┘
                                             │            │
                                     Add to Cart    WhatsApp (wa.me)
                                             │            │
                                             ▼            ▼
                                    Zustand Cart    wa.me link with
                                    (with custom.)  pre-encoded message
                                             │
                                             ▼
                                    Checkout ──→ Sanity Order
                                    (PayPal/PagoMóvil)   (with customization
                                                          data + source + status)
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `sanity/schemas/collection.ts` | Create | New collection document type |
| `sanity/schemas/index.ts` | Modify | Register collection schema |
| `sanity/schemas/product.ts` | Modify | Add personalizationEnabled, personalizationOptions fields; deprecate stock |
| `sanity/schemas/order.ts` | Modify | Add productionStatus, source fields |
| `sanity/schemas/orderItem.ts` | Modify | Add customization object field |
| `lib/sanity/types.ts` | Modify | Add Collection, PersonalizationOptions, CustomizationData types |
| `lib/sanity/queries.ts` | Modify | Add collection queries, update product queries for personalization |
| `lib/store/cart.ts` | Modify | Add customization field to CartItem, remove stock constraint |
| `lib/validation.ts` | Modify | Add customization text validation schema |
| `components/product/CustomizationWizard.tsx` | Create | 4-step wizard container (Client) |
| `components/product/ColorSwatches.tsx` | Create | Visual swatch picker |
| `components/product/SizeSelector.tsx` | Create | Size button row |
| `components/product/CustomTextInput.tsx` | Create | Input with live character counter |
| `components/product/CustomizationReview.tsx` | Create | Summary step with price breakdown |
| `components/product/PriceBreakdown.tsx` | Create | Real-time base + fee display |
| `components/product/ProductCard.tsx` | Modify | Add personalization badge, remove stock overlay |
| `components/product/ProductDetail.tsx` | Modify | Add "Personalizá el tuyo" CTA, remove stock/variant logic |
| `components/product/VariantSelector.tsx` | Deprecate | Superseded by customization wizard |
| `components/cart/CartItem.tsx` | Modify | Display customization data (color, size, text) |
| `components/cart/CartSummary.tsx` | Modify | Add WhatsApp order button |
| `components/checkout/CheckoutForm.tsx` | Modify | Include customization data in order creation |
| `components/layout/Header.tsx` | Modify | Add "Colecciones" nav link |
| `app/collections/page.tsx` | Create | Collections listing page (Server Component) |
| `app/collections/[slug]/page.tsx` | Create | Collection detail page (Server Component) |
| `components/collections/CollectionCard.tsx` | Create | Collection card component |
| `components/collections/CollectionsList.tsx` | Create | Collections grid |
| `components/collections/FeaturedCollections.tsx` | Create | Homepage featured collections section |
| `components/cart/WhatsAppButton.tsx` | Create | WhatsApp order button with wa.me link generation |
| `lib/whatsapp.ts` | Create | WhatsApp message formatting and URL generation |

## Interfaces / Contracts

```typescript
// Customization data shape (client-side wizard state)
interface CustomizationState {
  tier: 'basico' | 'medio' | 'complejo';
  color?: string;
  size?: string;
  text?: string;
}

// Extended CartItem (replaces existing)
interface CartItem {
  productId: string;
  name: string;
  slug: string;
  price: number;           // base price
  image?: string;
  quantity: number;
  customization?: {
    tier: 'basico' | 'medio' | 'complejo';
    color?: string;
    size?: string;
    text?: string;
    fee: number;           // 5, 10, or 20
  };
  totalPrice: number;      // basePrice + fee
}

// Sanity Order extension
interface Order {
  // ... existing fields
  productionStatus: 'pendiente' | 'en_produccion' | 'listo' | 'enviado';
  source: 'checkout' | 'whatsapp';
}
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | CustomizationWizard step transitions, price calculation, WhatsApp URL generation | Vitest with React Testing Library |
| Integration | Cart with customization data persistence, Sanity queries for new schemas | Mock Sanity client, test store hydration |
| E2E | Full customization flow (product → customize → cart → checkout) | Playwright against local dev |

## Migration / Rollout

**Phase 1 — Schema (safe, additive):**
- Add personalization fields to product schema (default `false`)
- Add `collection` document type
- Add `productionStatus` and `source` to order schema
- Add `customization` to orderItem schema
- Mark `stock` as deprecated (hidden in Sanity Studio)

**Phase 2 — UI (non-breaking):**
- Build customization components; only activate when `personalizationEnabled: true`
- Existing products without personalization continue working unchanged
- New components coexist with existing variant system

**Phase 3 — Cart evolution:**
- Extend CartItem type with optional `customization` field
- Existing cart items (no customization) still work
- Update CartItem display to show customization when present

**Phase 4 — Cutover:**
- Remove stock-based logic from UI
- Remove VariantSelector usage
- Add collection navigation
- Add WhatsApp integration

## Open Questions

- [ ] WhatsApp phone number storage — env var or Sanity storeSettings? (env var recommended for security)
- [ ] Should existing products be migrated to have `personalizationEnabled: true` by default, or only new products?
- [ ] Image preview during customization — show product with color overlay, or keep it simple with text-only preview?
