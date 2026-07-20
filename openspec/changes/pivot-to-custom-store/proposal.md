# Proposal: Pivot to Personalized Anime/Pop Culture Store

## Intent

Transform the existing generic variety store (`tienda-virtual`) into a personalized anime/pop culture e-commerce platform inspired by Crystal Tree CR. The current store sells pre-stocked generic products; the pivot shifts to made-to-order personalized items with a strong geek/anime identity.

**Business problem**: The current generic store doesn't match the founder's vision of selling personalized anime/pop culture products. The platform has solid e-commerce foundations (81 tasks completed) but needs a fundamental business model shift from inventory-based to custom-order-based.

## Scope

### In Scope
- Re-categorize products by physical type (Ropa, Vasos/Tazas, Botellas, Gorras, Sets, Accesorios)
- Add personalization schema (design options, image upload, custom instructions)
- Create "Personalizá el tuyo" customization flow
- Implement thematic collections/temporadas (Naruto, One Piece, etc.)
- Add WhatsApp integration for custom orders
- Transform to made-to-order model (no pre-stocking)

### Out of Scope
- Payment gateway changes (keep PayPal + PagoMóvil)
- User authentication changes
- Admin panel restructuring (future phase)
- Inventory management system (not needed for made-to-order)
- Internationalization (Spanish-only for now)

## Capabilities

### New Capabilities
- `product-personalization`: Customization options, image upload, design tiers, special instructions
- `thematic-collections`: Anime/franchise grouping (temporadas), seasonal promotions
- `custom-order-channel`: WhatsApp integration, image upload form, made-to-order workflow

### Modified Capabilities
- `product-catalog`: Re-categorize by physical type, add personalization fields, made-to-order stock model
- `cart-checkout`: Support custom orders, personalization data in cart, WhatsApp redirect option

## Approach

1. **Schema Evolution**: Extend Sanity schemas with personalization fields, add collection document type
2. **Customization UI**: Build product configurator component (pick base → customize → add to cart)
3. **Made-to-Order Logic**: Remove stock tracking, add production status tracking
4. **WhatsApp Integration**: Add custom order form with image upload, send to WhatsApp API
5. **Thematic Collections**: Create collection pages grouping products by anime/franchise

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `sanity/schemas/` | Modified | Add personalization fields, collection schema, made-to-order status |
| `src/components/products/` | Modified | Add product configurator, customization options |
| `src/app/products/` | Modified | Update product pages for customization flow |
| `src/app/collections/` | New | Thematic collection pages |
| `src/components/checkout/` | Modified | Support custom orders, WhatsApp redirect |
| `src/lib/sanity/` | Modified | Update queries for new schemas |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Schema migration breaks existing products | Medium | Create migration scripts, test with sample data |
| Personalization UI complexity | High | Start with basic options, iterate based on feedback |
| WhatsApp API reliability | Medium | Add fallback email order option |
| Made-to-order production tracking | Low | Simple status field, manual updates initially |

## Rollback Plan

1. Revert Sanity schema changes to original structure
2. Remove personalization components
3. Restore stock-based inventory logic
4. Disable WhatsApp integration
5. Remove collection pages

## Dependencies

- Sanity CMS project (existing)
- WhatsApp Business API (new integration)
- Image upload service (Sanity asset pipeline)

## Success Criteria

- [ ] Products categorized by physical type (Ropa, Vasos, etc.)
- [ ] Personalization flow works end-to-end (pick → customize → cart)
- [ ] Thematic collections display grouped products
- [ ] WhatsApp custom order form submits successfully
- [ ] Made-to-order model removes stock tracking
- [ ] No regression in existing checkout flow

## Proposal Question Round

Before finalizing, I have clarifying questions:

1. **Personalization depth**: Should we start with basic options (color, text) or support complex image uploads from customers?
2. **Production tracking**: Do you need real-time production status updates, or is manual status sufficient initially?
3. **Collection management**: Should collections be manually curated or auto-generated from product tags?
4. **WhatsApp integration**: Do you have a WhatsApp Business API account, or should we use a simple `wa.me` link?
5. **Pricing model**: Should personalization add fixed fees or percentage-based upcharges?

Please answer or skip these questions. I'll proceed with reasonable defaults if skipped.