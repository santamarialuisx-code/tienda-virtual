# Tasks: Pivot to Personalized Anime/Pop Culture Store

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 550–700 |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR 1 → PR 2 → PR 3 → PR 4 |
| Delivery strategy | auto-chain |
| Chain strategy | stacked-to-main |

Decision needed before apply: No
Chained PRs recommended: Yes
Chain strategy: stacked-to-main
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|------|------|-----------|----------------------|-----------------|-------------------|
| 1 | Schema + types (foundation) | PR 1 | `npx sanity typegen` | N/A — schema validation only | sanity/schemas/*, lib/sanity/types.ts |
| 2 | Customization components | PR 2 | `npm run test -- --run src/components/product` | Dev server: open product with personalizationEnabled=true | components/product/Custom*.tsx |
| 3 | Cart + WhatsApp integration | PR 3 | `npm run test -- --run src/components/cart` | Dev server: add customized item to cart, verify WhatsApp link | lib/store/cart.ts, components/cart/* |
| 4 | UI integration + collections | PR 4 | `npm run build` | Dev server: browse collections, test product detail CTA | app/collections/*, components/layout/* |

---

## Phase 1: Schema & Type Foundation (PR 1)

- [ ] 1.1 Create `sanity/schemas/collection.ts` — new document type with fields: title, slug, description, image, products (array of references), featured (boolean), order (number)
- [ ] 1.2 Register collection schema in `sanity/schemas/index.ts` — add to schemaTypes array
- [ ] 1.3 Modify `sanity/schemas/product.ts` — add `personalizationEnabled` (boolean, default false), `personalizationOptions` (object with colors[], sizes[], complexityTiers[]), deprecate `stock` (hidden: true)
- [ ] 1.4 Modify `sanity/schemas/order.ts` — add `productionStatus` (string enum: pendiente/en_produccion/listo/enviado, default pendiente), `source` (string enum: checkout/whatsapp, default checkout)
- [ ] 1.5 Modify `sanity/schemas/orderItem.ts` — add `customization` object (tier, color, size, text, fee fields)
- [ ] 1.6 Update `lib/sanity/types.ts` — add Collection, PersonalizationOptions, CustomizationData interfaces; extend CartItem with optional customization field; add productionStatus to Order type

## Phase 2: Customization Components (PR 2)

- [ ] 2.1 Create `components/product/ColorSwatches.tsx` — visual swatch grid, 44×44px touch targets, aria-label per color
- [ ] 2.2 Create `components/product/SizeSelector.tsx` — horizontal button row, active state highlighting
- [ ] 2.3 Create `components/product/CustomTextInput.tsx` — textarea with live character counter (max 100), validation
- [ ] 2.4 Create `components/product/PriceBreakdown.tsx` — real-time base price + tier fee + total display
- [ ] 2.5 Create `components/product/CustomizationReview.tsx` — summary of selected color/size/text with price breakdown
- [ ] 2.6 Create `components/product/CustomizationWizard.tsx` — 4-step container managing state via Zustand (step navigation, selections, validation, add-to-cart CTA)
- [ ] 2.7 Add customization text validation schema in `lib/validation.ts` — zod schema for text input (max 100 chars, optional)

## Phase 3: Cart & WhatsApp Integration (PR 3)

- [ ] 3.1 Modify `lib/store/cart.ts` — extend CartItem with optional customization field, remove stock constraint, update addItem to accept customization, calculate totalPrice as basePrice + fee
- [ ] 3.2 Create `lib/whatsapp.ts` — generate wa.me URL with pre-encoded message including product name, customization details, tier
- [ ] 3.3 Create `components/cart/WhatsAppButton.tsx` — wa.me deep link button, opens in new tab
- [ ] 3.4 Modify `components/cart/CartItem.tsx` — display customization data (color swatch, size badge, text snippet) when present
- [ ] 3.5 Modify `components/cart/CartSummary.tsx` — add WhatsApp order button below checkout

## Phase 4: UI Integration & Collections (PR 4)

- [x] 4.1 Modify `components/product/ProductCard.tsx` — add personalization badge when enabled, remove stock overlay
- [x] 4.2 Modify `components/product/ProductDetail.tsx` — add "Personalizá el tuyo" CTA for customizable products, remove stock/variant logic
- [x] 4.3 Modify `components/layout/Header.tsx` — add "Colecciones" nav link
- [x] 4.4 Create `components/collections/CollectionCard.tsx` — card with image, title, product count
- [x] 4.5 Create `components/collections/CollectionsList.tsx` — responsive grid of CollectionCards
- [x] 4.6 Create `app/collections/page.tsx` — Server Component, fetch all collections, render CollectionsList
- [x] 4.7 Create `app/collections/[slug]/page.tsx` — Server Component, fetch collection by slug, render products
- [x] 4.8 Create `components/collections/FeaturedCollections.tsx` — homepage section showing featured collections
- [x] 4.9 Modify `lib/sanity/queries.ts` — add collection queries (all collections, by slug, featured), update product queries for personalization fields

## Phase 5: Testing & Verification

- [ ] 5.1 Write unit tests for CustomizationWizard step transitions and state management
- [ ] 5.2 Write unit tests for price calculation (base + tier fee)
- [ ] 5.3 Write unit tests for WhatsApp URL generation with pre-encoded message
- [ ] 5.4 Write unit tests for cart operations with customization data
- [ ] 5.5 Verify build passes (`npm run build`)
- [ ] 5.6 Manual E2E: browse collections, open customizable product, complete customization flow, verify cart shows customization data, verify WhatsApp link works

---

## Relevant Files

- `sanity/schemas/collection.ts` — new (PR 1)
- `sanity/schemas/product.ts` — modified (PR 1)
- `sanity/schemas/order.ts` — modified (PR 1)
- `sanity/schemas/orderItem.ts` — modified (PR 1)
- `sanity/schemas/index.ts` — modified (PR 1)
- `lib/sanity/types.ts` — modified (PR 1)
- `lib/sanity/queries.ts` — modified (PR 4)
- `lib/store/cart.ts` — modified (PR 3)
- `lib/validation.ts` — modified (PR 2)
- `lib/whatsapp.ts` — new (PR 3)
- `components/product/CustomizationWizard.tsx` — new (PR 2)
- `components/product/ColorSwatches.tsx` — new (PR 2)
- `components/product/SizeSelector.tsx` — new (PR 2)
- `components/product/CustomTextInput.tsx` — new (PR 2)
- `components/product/CustomizationReview.tsx` — new (PR 2)
- `components/product/PriceBreakdown.tsx` — new (PR 2)
- `components/product/ProductCard.tsx` — modified (PR 4)
- `components/product/ProductDetail.tsx` — modified (PR 4)
- `components/cart/CartItem.tsx` — modified (PR 3)
- `components/cart/CartSummary.tsx` — modified (PR 3)
- `components/cart/WhatsAppButton.tsx` — new (PR 3)
- `components/layout/Header.tsx` — modified (PR 4)
- `components/collections/CollectionCard.tsx` — new (PR 4)
- `components/collections/CollectionsList.tsx` — new (PR 4)
- `components/collections/FeaturedCollections.tsx` — new (PR 4)
- `app/collections/page.tsx` — new (PR 4)
- `app/collections/[slug]/page.tsx` — new (PR 4)