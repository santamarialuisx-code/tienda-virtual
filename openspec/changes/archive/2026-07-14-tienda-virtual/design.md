# Design: tienda-virtual MVP

## Technical Approach

Full-stack Next.js 14+ App Router e-commerce platform. Sanity CMS as sole data store (no database). Stripe Checkout for payments. Server Components by default for SEO; Client Components only for interactive UI (cart, search, auth forms). Zustand for client-side cart state. NextAuth.js v5 for auth. Tailwind CSS + shadcn/ui for design system.

## Architecture Decisions

| Decision | Choice | Alternatives | Rationale |
|----------|--------|--------------|-----------|
| Rendering | App Router Server Components | Pages Router, client-only | SEO-first, streaming, RSC data fetching without client JS |
| Data store | Sanity CMS (headless) | PostgreSQL, MongoDB, Supabase | Admin UI built-in, image CDN included, $0/mo free tier, no DB ops |
| State management | Zustand | Redux, Jotai, Context | Minimal boilerplate, built-in persistence middleware, small bundle |
| Auth | NextAuth.js v5 | Clerk, Lucia, custom | Battle-tested, credential + OAuth, session callbacks for Sanity |
| Styling | Tailwind CSS + shadcn/ui | MUI, Chakra, CSS Modules | Copy-paste components, no runtime CSS, full control |
| Payments | Stripe Checkout (hosted) | PayPal, MercadoPago, custom form | PCI compliance offloaded, webhook ecosystem, test mode |
| Deployment | Vercel | AWS, Railway, Fly.io | Zero-config Next.js deploy, preview branches, edge functions |
| Image optimization | next/image + Sanity CDN | Cloudinary, imgix | Free, integrated with Sanity, no extra service |

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                        Client                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │ Browser  │  │ Browser  │  │ Browser  │             │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘             │
│       │              │              │                    │
├───────┴──────────────┴──────────────┴───────────────────┤
│                     Vercel Edge / CDN                    │
├─────────────────────────────────────────────────────────┤
│                   Next.js App Router                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │ Server   │  │ Server   │  │ Client   │             │
│  │ Comps    │  │ Actions  │  │ Comps    │             │
│  │ (RSC)    │  │          │  │ (zustand)│             │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘             │
│       │              │              │                    │
│  ┌────┴──────────────┴──────────────┴────┐             │
│  │            API Routes                  │             │
│  │  /api/checkout  /api/webhooks/stripe   │             │
│  │  /api/auth/*    /api/admin/metrics     │             │
│  └────┬──────────────┬──────────────┬────┘             │
└───────┼──────────────┼──────────────┼───────────────────┘
        │              │              │
   ┌────┴────┐   ┌─────┴─────┐  ┌────┴────┐
   │ Sanity  │   │  Stripe   │  │ Resend  │
   │  CMS    │   │ Checkout  │  │ Email   │
   │ (GROQ)  │   │ (Webhooks)│  │ (SMTP)  │
   └─────────┘   └───────────┘  └─────────┘
```

## Data Flow

### Product Browse Flow
```
Browser → RSC fetch (GROQ) → Sanity → Render HTML → Return to Client
                                    ↓
                              next/image → Sanity CDN (optimization)
```

### Checkout Flow
```
Browser → Add to Cart (Zustand → localStorage)
       → Checkout Button
       → POST /api/checkout → Stripe Session → Redirect to Stripe
       → Payment OK → Redirect /checkout/success
       → Webhook: checkout.session.completed → POST /api/webhooks/stripe
       → Verify signature → Create order in Sanity → Respond 200
```

### Auth Flow
```
Browser → /auth/login → CredentialsProvider.authorize()
       → Query Sanity (email lookup + bcrypt compare)
       → JWT callback (user ID in token)
       → Session callback (user ID in session)
       → Set httpOnly cookie → Redirect to return URL
```

## Component Architecture

### React Component Tree

```
app/
├── layout.tsx                    # Root layout (AuthProvider, Header, Footer)
├── page.tsx                      # Homepage (featured products)
├── products/
│   ├── page.tsx                  # Product listing (RSC)
│   └── [slug]/page.tsx           # Product detail (RSC)
├── categories/
│   └── [slug]/page.tsx           # Category page (RSC)
├── cart/page.tsx                 # Cart page (Client)
├── checkout/
│   ├── success/page.tsx          # Order confirmation (RSC)
│   └── cancel/page.tsx           # Payment cancelled (RSC)
├── auth/
│   ├── login/page.tsx            # Login form (Client)
│   └── register/page.tsx         # Register form (Client)
├── account/
│   ├── page.tsx                  # Profile (RSC, protected)
│   └── orders/page.tsx           # Order history (RSC, protected)
├── admin/
│   └── [[...index]]/page.tsx     # Sanity Studio (dynamic import)
├── api/
│   ├── checkout/route.ts         # Stripe session creation
│   ├── webhooks/stripe/route.ts  # Webhook handler
│   ├── auth/[...nextauth]/route.ts
│   ├── auth/register/route.ts
│   └── admin/metrics/route.ts
└── sitemap.ts                    # Dynamic sitemap generation

components/
├── layout/
│   ├── Header.tsx                # Server (nav + Client cart/auth)
│   ├── Footer.tsx                # Server
│   └── MobileNav.tsx             # Client (hamburger menu)
├── product/
│   ├── ProductCard.tsx           # Server
│   ├── ProductGrid.tsx           # Server
│   ├── ProductDetail.tsx         # Server
│   ├── VariantSelector.tsx       # Client
│   └── ImageGallery.tsx          # Server (next/image)
├── cart/
│   ├── CartIcon.tsx              # Client (badge from Zustand)
│   ├── CartPage.tsx              # Client
│   ├── CartItem.tsx              # Client
│   └── CartSummary.tsx           # Server
├── search/
│   ├── SearchBar.tsx             # Client (debounced)
│   └── FilterPanel.tsx           # Client
├── auth/
│   ├── LoginForm.tsx             # Client
│   ├── RegisterForm.tsx          # Client
│   ├── AuthButton.tsx            # Client (dropdown)
│   └── AuthProvider.tsx          # Client (SessionProvider)
└── ui/
    └── (shadcn/ui components)
```

### Server vs Client Split
- **Server Components (default)**: ProductCard, ProductGrid, ProductDetail, CartSummary, Footer, Breadcrumbs, ImageGallery
- **Client Components** (`"use client"`): CartIcon, CartPage, CartItem, SearchBar, FilterPanel, LoginForm, RegisterForm, AuthButton, VariantSelector, MobileNav

## Sanity Schema Design

### Product
```typescript
{
  name: 'product',
  type: 'document',
  fields: [
    { name: 'name', type: 'string', validation: R },
    { name: 'slug', type: 'slug', options: { source: 'name' }, validation: R },
    { name: 'description', type: 'text' },
    { name: 'price', type: 'number', validation: { min: 0 } },
    { name: 'images', type: 'array', of: [{ type: 'image', options: { hotspot: true } }] },
    { name: 'category', type: 'reference', to: [{ type: 'category' }], validation: R },
    { name: 'variants', type: 'array', of: [{ type: 'productVariant' }] },
    { name: 'stock', type: 'number', validation: { min: 0 }, initialValue: 0 },
    { name: 'isActive', type: 'boolean', initialValue: true },
    { name: 'createdAt', type: 'datetime', initialValue: new Date().toISOString() }
  ],
  preview: { select: { title: 'name', media: 'images.0', subtitle: 'category.name' } }
}
```

### Category
```typescript
{
  name: 'category',
  type: 'document',
  fields: [
    { name: 'name', type: 'string', validation: R },
    { name: 'slug', type: 'slug', options: { source: 'name' }, validation: R },
    { name: 'description', type: 'text' },
    { name: 'parent', type: 'reference', to: [{ type: 'category' }] }
  ]
}
```

### ProductVariant
```typescript
{
  name: 'productVariant',
  type: 'object',
  fields: [
    { name: 'name', type: 'string', validation: R },
    { name: 'price', type: 'number', validation: { min: 0 } },
    { name: 'stock', type: 'number', validation: { min: 0 }, initialValue: 0 },
    { name: 'options', type: 'object', fields: [
      { name: 'size', type: 'string' },
      { name: 'color', type: 'string' }
    ]}
  ]
}
```

### Order
```typescript
{
  name: 'order',
  type: 'document',
  fields: [
    { name: 'customerEmail', type: 'string', validation: R },
    { name: 'customerName', type: 'string' },
    { name: 'items', type: 'array', of: [{ type: 'orderItem' }] },
    { name: 'subtotal', type: 'number' },
    { name: 'shipping', type: 'number', initialValue: 0 },
    { name: 'tax', type: 'number', initialValue: 0 },
    { name: 'total', type: 'number' },
    { name: 'status', type: 'string', options: { list: ['pending','paid','shipped','delivered','cancelled'] }, initialValue: 'pending' },
    { name: 'stripeSessionId', type: 'string' },
    { name: 'createdAt', type: 'datetime', initialValue: new Date().toISOString() }
  ]
}
```

### OrderItem
```typescript
{
  name: 'orderItem',
  type: 'object',
  fields: [
    { name: 'product', type: 'reference', to: [{ type: 'product' }] },
    { name: 'productName', type: 'string' },
    { name: 'quantity', type: 'number', validation: { min: 1 } },
    { name: 'price', type: 'number' },
    { name: 'variant', type: 'string' }
  ]
}
```

### User
```typescript
{
  name: 'user',
  type: 'document',
  fields: [
    { name: 'email', type: 'string', validation: R },
    { name: 'name', type: 'string' },
    { name: 'passwordHash', type: 'string' },
    { name: 'image', type: 'string' },
    { name: 'role', type: 'string', options: { list: ['user','admin'] }, initialValue: 'user' },
    { name: 'emailVerified', type: 'datetime' },
    { name: 'createdAt', type: 'datetime', initialValue: new Date().toISOString() }
  ]
}
```

## GROQ Query Patterns

```groq
// All active products with category
*[_type == "product" && isActive == true] | order(createdAt desc) {
  _id, name, slug, price, stock, images[0],
  category->{ name, slug }
}

// Products by category
*[_type == "product" && isActive == true && category->slug.current == $slug] | order(createdAt desc) { ... }

// Product detail by slug
*[_type == "product" && slug.current == $slug][0] {
  ..., category->{ name, slug },
  variants[] { name, price, stock, options }
}

// Search products (Sanity text search)
*[_type == "product" && isActive == true && (name match $query || description match $query)] { ... }

// Filter by price range
*[_type == "product" && isActive == true && price >= $min && price <= $max] { ... }

// Category tree
*[_type == "category"] { name, slug, parent->{ name, slug } }

// Orders by user email
*[_type == "order" && customerEmail == $email] | order(createdAt desc) { ..., items[] { ... } }

// Dashboard metrics
{
  "totalProducts": count(*[_type == "product" && isActive == true]),
  "totalOrders": count(*[_type == "order"]),
  "totalRevenue": math::sum(*[_type == "order" && status == "paid"].total),
  "recentOrders": *[_type == "order"] | order(createdAt desc)[0...5] { ... }
}
```

## API Design

### Next.js API Routes

| Route | Method | Auth | Description |
|-------|--------|------|-------------|
| `/api/auth/[...nextauth]` | * | No | NextAuth.js handler |
| `/api/auth/register` | POST | No | User registration (bcrypt + Sanity) |
| `/api/checkout` | POST | Yes | Create Stripe Checkout session |
| `/api/webhooks/stripe` | POST | Stripe sig | Handle Stripe events |
| `/api/admin/metrics` | GET | Admin | Dashboard metrics |

### Stripe Checkout Session Creation
```typescript
// POST /api/checkout
// Body: { items: [{ productId, variant, quantity, price }], userEmail }
// Creates Stripe session with line_items from cart
// Returns { sessionId, url }
// On success: redirect to url
// On failure: 500 with error message
```

### Webhook Handler
```typescript
// POST /api/webhooks/stripe
// Verify signature with stripe.webhooks.constructEvent
// Handle: checkout.session.completed
//   → Create order in Sanity (customer email, items, total, status: "paid")
//   → Idempotency: check stripeSessionId before creating
// Respond 200 regardless (Stripe retries on failure)
```

## State Management

### Zustand Cart Store
```typescript
// store/cart.ts
interface CartState {
  items: CartItem[];
  addItem: (product: Product, variant?: string) => void;
  removeItem: (productId: string, variant?: string) => void;
  updateQuantity: (productId: string, variant: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

// Persisted to localStorage via zustand/middleware
// Price snapshot at add time (no live Sanity price lookups)
```

### Cache Strategy

| Layer | Strategy | TTL |
|-------|----------|-----|
| Product listings | ISR (Incremental Static Regeneration) | 60s revalidate |
| Product detail | ISR + `revalidateTag('products')` | 60s revalidate |
| Categories | ISR | 300s revalidate |
| User session | NextAuth.js JWT | 30 days |
| Cart state | localStorage (Zustand persist) | Session |
| Sanity queries | React `cache()` within request | Per-request dedup |

### ISR vs SWR Decision
- Product pages: ISR (Vercel CDN cache, revalidate on timer) — SEO needs pre-rendered HTML
- Cart UI: Zustand (client state) — no server dependency
- Search results: Client-side GROQ query via Sanity client — real-time but debounced

## Authentication & Authorization

### NextAuth.js v5 Configuration
```typescript
// lib/auth/config.ts
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      credentials: { email: {}, password: {} },
      authorize: async (credentials) => {
        // 1. Query Sanity for user by email
        // 2. bcrypt.compare(password, user.passwordHash)
        // 3. Return user object or null
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    })
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    jwt: ({ token, user }) => { /* attach user.id, user.role to token */ },
    session: ({ session, token }) => { /* expose id, role in session.user */ }
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error'
  }
}
```

### Protected Routes Strategy
- Middleware-based: `middleware.ts` checks session for `/account/*`, `/checkout/*`, `/admin/*`
- Admin routes additionally check `session.user.role === 'admin'`
- Unauthenticated → redirect to `/auth/login?returnTo={path}`
- Non-admin on `/admin/*` → show "Not authorized" page (no redirect loop)

### Session Flow
```
Login → CredentialsProvider.authorize() → JWT callback (user.id + role)
     → httpOnly cookie set → Session available via useSession() / getServerSession()
     → Session expires in 30 days (or 7 days for non-remember-me)
```

## Payment Flow

### Stripe Checkout Sequence
```
1. User clicks "Checkout" → POST /api/checkout
2. API route creates Stripe Checkout Session:
   - line_items: cart items with prices
   - customer_email: from session (if logged in)
   - success_url: /checkout/success?session_id={CHECKOUT_SESSION_ID}
   - cancel_url: /cart
3. Redirect user to Stripe Checkout URL
4. User completes payment on Stripe
5. Stripe redirects to success_url → /checkout/success
6. Stripe sends webhook: checkout.session.completed
7. Webhook handler:
   a. Verify signature
   b. Retrieve session from Stripe (with line_items)
   c. Check for existing order (idempotency)
   d. Create order document in Sanity
   e. Return 200
8. Success page displays order confirmation
```

### Email Confirmation Flow
- Resend API integration (optional for MVP)
- Triggered from webhook handler after order creation
- Sends: order confirmation with items, total, order reference
- Template: HTML email with order summary

## Performance Strategy

### Targets
- Lighthouse score: > 90
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1

### Image Optimization
```
next/image + Sanity CDN:
- Automatic WebP/AVIF conversion
- Responsive srcSet via Sanity imageUrl builder
- Lazy loading by default (loading="lazy")
- Blur placeholder via Sanity LQIP
```

### Bundle Strategy
- Server Components: 0 client JS shipped
- Client Components: lazy-loaded with `next/dynamic`
- Sanity Studio: `dynamic(() => import(...), { ssr: false })` — only on /admin
- Zustand: small (~1KB), no code splitting needed
- Fonts: `next/font` (Inter) — self-hosted, no FOUT

### Code Splitting
```typescript
// Lazy-load heavy client components
const SearchBar = dynamic(() => import('@/components/search/SearchBar'), { ssr: false })
const CartPage = dynamic(() => import('@/components/cart/CartPage'))
const AdminStudio = dynamic(() => import('@/app/admin/[[...index]]/Studio'), { ssr: false })
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | Zustand cart store, GROQ queries, form validation, price utils | Vitest + React Testing Library |
| Integration | Sanity data fetching, Stripe session creation, auth flows | Vitest + MSW (mock Sanity/Stripe) |
| E2E | Full purchase flow, auth flow, admin CRUD | Playwright against preview deploy |

### Mock Strategy
- Sanity client: mock `client.fetch()` responses
- Stripe: use `stripe listen` + test webhook events in dev
- NextAuth: mock `getServerSession()` for protected route tests
- localStorage: `jest-localstorage-mock` or Vitest equivalent

### E2E Test Scenarios
1. Browse → Add to Cart → Checkout → Payment → Confirmation
2. Register → Login → View Account → View Orders
3. Search → Filter → Category → Product Detail
4. Admin: Login → Create Product → Upload Images → Verify in Store
5. Mobile responsive: viewport tests at 375px, 768px, 1440px

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `app/layout.tsx` | Create | Root layout with AuthProvider, Header, Footer |
| `app/page.tsx` | Create | Homepage with featured products |
| `app/products/page.tsx` | Create | Product listing (RSC, paginated) |
| `app/products/[slug]/page.tsx` | Create | Product detail (RSC, ISR) |
| `app/categories/[slug]/page.tsx` | Create | Category page (RSC) |
| `app/cart/page.tsx` | Create | Cart page (Client) |
| `app/checkout/success/page.tsx` | Create | Order confirmation |
| `app/checkout/cancel/page.tsx` | Create | Payment cancelled |
| `app/auth/login/page.tsx` | Create | Login form |
| `app/auth/register/page.tsx` | Create | Register form |
| `app/account/page.tsx` | Create | User profile (protected) |
| `app/account/orders/page.tsx` | Create | Order history (protected) |
| `app/admin/[[...index]]/page.tsx` | Create | Sanity Studio (dynamic import) |
| `app/api/checkout/route.ts` | Create | Stripe session creation |
| `app/api/webhooks/stripe/route.ts` | Create | Webhook handler |
| `app/api/auth/[...nextauth]/route.ts` | Create | NextAuth handler |
| `app/api/auth/register/route.ts` | Create | Registration endpoint |
| `app/api/admin/metrics/route.ts` | Create | Dashboard metrics |
| `app/sitemap.ts` | Create | Dynamic sitemap |
| `components/**` | Create | ~20 components (see tree above) |
| `lib/sanity/client.ts` | Create | Sanity client config |
| `lib/sanity/queries.ts` | Create | GROQ query definitions |
| `lib/sanity/image.ts` | Create | Image URL builder |
| `lib/sanity/types.ts` | Create | TypeScript types from schemas |
| `lib/stripe/client.ts` | Create | Stripe client singleton |
| `lib/auth/config.ts` | Create | NextAuth.js configuration |
| `lib/auth/helpers.ts` | Create | Session/role helpers |
| `store/cart.ts` | Create | Zustand cart store |
| `hooks/use-cart.ts` | Create | Cart convenience hook |
| `hooks/use-search.ts` | Create | Search with debouncing |
| `middleware.ts` | Create | Auth + admin route protection |
| `sanity/schemas/*.ts` | Create | All Sanity document schemas |
| `sanity/sanity.config.ts` | Create | Sanity Studio config |
| `sanity/structure.ts` | Create | Custom Studio navigation |
| `next.config.mjs` | Create | Next.js config (images, env) |
| `tailwind.config.ts` | Create | Tailwind config with shadcn |
| `playwright.config.ts` | Create | Playwright E2E config |
| `vitest.config.ts` | Create | Vitest unit test config |

## Migration / Rollout

No migration required — greenfield project. Phase-gated rollout:

1. **Scaffolding**: Deploy blank Next.js to Vercel (preview branch)
2. **Product Catalog**: First visible functionality on preview deploy
3. **Cart & Checkout**: Stripe test mode only, no production risk
4. **User Accounts**: Auth integration tested on preview
5. **Admin Panel**: Sanity Studio embedded, admin-only access
6. **Polish**: Performance audit, responsive fixes, production deploy

## Threat Matrix

N/A — no routing, shell, subprocess, VCS/PR automation, executable-file classification, or process-integration boundary. This is a web application with standard HTTP request/response flows.

## Open Questions

- [ ] Should Resend email be included in MVP or deferred to post-launch?
- [ ] What is the exact Stripe fee structure for the target market (LATAM)?
- [ ] Should we implement rate limiting on auth endpoints (e.g., 5 attempts / 15 min)?
- [ ] Do we need a `sanity.config.ts` `plugins` array beyond the defaults?
- [ ] Should the product price be stored in USD or local currency (ARS, MXN)?
