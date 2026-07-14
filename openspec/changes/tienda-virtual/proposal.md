# Proposal: tienda-virtual MVP

## Intent

Build a fully functional e-commerce platform for a virtual variety store targeting Latin American Spanish-speaking customers. The store needs product browsing, cart, checkout, and user accounts — deployable and maintainable with minimal infrastructure costs.

## Scope

### In Scope
- Next.js 14+ App Router project with TypeScript strict mode
- Sanity CMS for all product/category/order data
- Product catalog: listings, detail pages, categories, search, filtering
- Shopping cart with Zustand (persistent across sessions)
- Stripe Checkout integration (hosted checkout, webhooks)
- NextAuth.js v5 with email/password + optional Google OAuth
- Sanity Studio admin panel (product/order management)
- Responsive mobile-first design (Tailwind CSS + shadcn/ui)
- SEO: meta tags, structured data, sitemap
- Vercel deployment with preview environments

### Out of Scope
- Multi-language support (Spanish only for MVP)
- Inventory management beyond basic stock counts
- Custom payment gateway integration
- Mobile app (PWA not included)
- Analytics dashboards
- Email marketing / notifications
- Custom order fulfillment workflow
- Warehouse/shipment tracking integration

## Capabilities

### New Capabilities
- `product-catalog`: Product listing, detail, categories, search, filtering via Sanity
- `cart-checkout`: Zustand cart state, Stripe Checkout session, webhook handling
- `user-auth`: NextAuth.js credentials + OAuth, session management, order history
- `admin-panel`: Sanity Studio customization for product and order management

### Modified Capabilities
None — greenfield project, no existing specs.

## Approach

Follow the 6-phase implementation plan from exploration:
1. **Scaffolding** (3-5 days): Next.js + Sanity + Vercel + TypeScript
2. **Product Catalog** (5-7 days): Sanity schemas, GROQ queries, product pages
3. **Cart & Checkout** (5-7 days): Zustand store, Stripe Checkout, webhooks
4. **User Accounts** (4-5 days): NextAuth.js v5, login/register, order history
5. **Admin Panel** (3-4 days): Sanity Studio customization
6. **Polish** (3-5 days): Responsive, performance, deployment

Server Components by default. Sanity as single source of truth. Stripe for payments only.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `app/` | New | App Router routes for shop, auth, admin, API |
| `components/` | New | Atomic UI components (product, cart, layout) |
| `lib/sanity/` | New | Client config, GROQ queries, types |
| `lib/stripe/` | New | Stripe client and server utilities |
| `lib/auth/` | New | NextAuth.js configuration |
| `store/` | New | Zustand cart store |
| `sanity/schemas/` | New | Product, Category, Variant, Order schemas |
| `hooks/` | New | Custom hooks (use-cart, use-search) |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Sanity free tier limits exceeded (10K docs) | Medium | Monitor usage; upgrade to Growth ($15/seat) when needed |
| Stripe webhook complexity (idempotency, retries) | Medium | Use official Stripe examples; implement idempotency keys |
| Auth edge cases (session, CSRF, password reset) | Medium | Use battle-tested NextAuth.js; test thoroughly |
| SEO issues with client-side rendering | Low | App Router SSR ensures crawlability; validate with Lighthouse |
| Scope creep across 6 phases | High | Strict phase gates; defer non-MVP features |

## Rollback Plan

- Each phase produces a deployable increment — revert Git to last known-good commit
- Sanity schemas are versioned — use `sanity migrate` to roll back if needed
- Stripe test mode for all development — no production data risk
- Vercel preview deploys allow branch-level rollback without affecting production

## Dependencies

- Sanity account (free tier) and project setup
- Stripe account (test mode) and API keys
- Vercel account connected to Git repo
- Domain name (optional for MVP, Vercel subdomain works)

## Success Criteria

- [ ] Homepage loads < 2s on 3G, Lighthouse score > 90
- [ ] Product catalog supports 100+ products with images, search, and filtering
- [ ] Cart persists across page refreshes and sessions
- [ ] Stripe Checkout processes test payments successfully
- [ ] User can register, login, and view order history
- [ ] Admin can create/edit products via Sanity Studio
- [ ] All pages responsive on mobile, tablet, and desktop
- [ ] Deployed to Vercel with preview deploys on PR

## Constraints

- Single developer (full-time)
- 23-33 day estimated timeline
- Budget: ~$0/month during MVP (free tiers only)
- Spanish-only UI (no i18n framework)
- No database — Sanity handles all data persistence
