# Product Catalog Specification

## Purpose

The product catalog capability enables customers to browse, search, and filter products sourced from Sanity CMS. It provides product listing pages, detailed product views, category navigation, and search functionality with responsive design and SEO optimization.

## Requirements

### Requirement: Product Listing Display

The system SHALL display a paginated grid of products with image, name, price, and category. Products SHALL be fetched from Sanity using GROQ queries and rendered as Server Components for SEO.

#### Scenario: Default product listing

- GIVEN a customer visits the homepage or /products page
- WHEN the page loads
- THEN a grid of products is displayed with images, names, prices, and category labels
- AND products are sorted by creation date (newest first) by default
- AND pagination controls are visible when more than 12 products exist

#### Scenario: Empty catalog

- GIVEN no products exist in Sanity
- WHEN a customer visits the products page
- THEN a message "No products available" is displayed
- AND no error boundaries are triggered

#### Scenario: Image loading failure

- GIVEN a product has a broken or missing image URL
- WHEN the product card renders
- THEN a placeholder image is displayed instead
- AND the product information (name, price) remains visible

### Requirement: Product Detail View

The system SHALL provide a dedicated product detail page at /products/[slug] with full product information, multiple images, variants, and add-to-cart functionality.

#### Scenario: Product detail page load

- GIVEN a customer clicks a product card
- WHEN the /products/[slug] page loads
- THEN the full product detail is displayed with name, description, price, images, and available variants
- AND the page includes structured data (JSON-LD) for SEO
- AND a meta description is set from the product description

#### Scenario: Invalid product slug

- GIVEN a customer navigates to /products/nonexistent-slug
- WHEN the page loads
- THEN a 404 page is displayed with a link back to the product listing

#### Scenario: Product with variants

- GIVEN a product has multiple variants (size, color)
- WHEN the product detail page loads
- THEN variant selectors are displayed
- AND selecting a variant updates the displayed price and stock status

### Requirement: Category Navigation

The system SHALL organize products into categories and provide navigation between categories. Categories SHALL be fetched from Sanity and displayed in the main navigation and sidebar.

#### Scenario: Category page display

- GIVEN a customer clicks a category link
- WHEN the /categories/[slug] page loads
- THEN only products belonging to that category are displayed
- AND the category name and description are shown as header
- AND breadcrumb navigation reflects the current category

#### Scenario: Category with no products

- GIVEN a category exists but has no assigned products
- WHEN a customer visits that category page
- THEN a message "No products in this category" is displayed
- AND the category information is still visible

#### Scenario: Multiple category levels

- GIVEN a category has subcategories
- WHEN the parent category page loads
- THEN subcategory links are displayed
- AND products from all subcategories are optionally included

### Requirement: Search Functionality

The system SHALL provide a search feature that queries product names and descriptions using Sanity's built-in text search. Search results SHALL be displayed in real-time as the user types (debounced).

#### Scenario: Search with results

- GIVEN a customer types "shirt" in the search bar
- WHEN the search query is submitted (debounced after 300ms)
- THEN products matching "shirt" in name or description are displayed
- AND the search term is highlighted in results
- AND the URL updates to reflect the search query (?q=shirt)

#### Scenario: Search with no results

- GIVEN a customer searches for "xyznonexistent"
- WHEN the search completes
- THEN a "No products found" message is displayed
- AND suggestions to check spelling or browse categories are shown

#### Scenario: Search input validation

- GIVEN a customer enters special characters (<script>) in search
- WHEN the search is executed
- THEN the input is sanitized
- AND no XSS vulnerabilities are triggered
- AND results are displayed safely

### Requirement: Product Filtering

The system SHALL support filtering products by price range, category, and availability status. Filters SHALL be combinable and reflected in the URL for shareability.

#### Scenario: Apply price filter

- GIVEN a customer is on the products page
- WHEN they select a price range filter (e.g., $50-$100)
- THEN only products within that price range are displayed
- AND the URL updates with filter parameters
- AND the filter selection is visually indicated

#### Scenario: Combine multiple filters

- GIVEN a customer selects category "Clothing" and price range "$20-$50"
- WHEN the filters are applied
- THEN only products matching BOTH criteria are displayed
- AND the filter count shows the number of active filters
- AND clearing one filter preserves the others

#### Scenario: Filter persistence across navigation

- GIVEN a customer applies filters on the products page
- WHEN they navigate to a category page and back
- THEN the previously applied filters are preserved
- AND the URL reflects the persisted filter state

### Requirement: SEO Optimization

The system SHALL generate proper meta tags, structured data (JSON-LD), and sitemap entries for all product and category pages. Server-side rendering ensures crawlability.

#### Scenario: Product page SEO

- GIVEN a product detail page loads
- WHEN a search engine crawler visits the page
- THEN the page includes Open Graph tags with product image and description
- AND structured data (JSON-LD Product schema) is present
- AND the page is server-rendered (not client-side only)

#### Scenario: Sitemap generation

- GIVEN products and categories exist in Sanity
- WHEN the sitemap.xml is requested
- THEN all product and category URLs are included with lastmod dates
- AND the sitemap is generated at build time or on-demand

### Requirement: Responsive Design

The system SHALL display product catalogs responsively across mobile, tablet, and desktop viewports. Product grids SHALL adapt from 1 column (mobile) to 4 columns (desktop).

#### Scenario: Mobile product grid

- GIVEN a customer views the products page on a 375px wide viewport
- WHEN the page renders
- THEN products are displayed in a single column
- AND touch targets are at least 44x44px
- AND the navigation collapses to a hamburger menu

#### Scenario: Desktop product grid

- GIVEN a customer views the products page on a 1440px wide viewport
- WHEN the page renders
- THEN products are displayed in a 4-column grid
- AND the full navigation is visible

## Data Models

### Sanity Schema: Product

```typescript
{
  name: 'product',
  type: 'document',
  fields: [
    { name: 'name', type: 'string', validation: required },
    { name: 'slug', type: 'slug', options: { source: 'name' } },
    { name: 'description', type: 'text' },
    { name: 'price', type: 'number', validation: { min: 0 } },
    { name: 'images', type: 'array', of: [{ type: 'image' }] },
    { name: 'category', type: 'reference', to: [{ type: 'category' }] },
    { name: 'variants', type: 'array', of: [{ type: 'productVariant' }] },
    { name: 'stock', type: 'number', validation: { min: 0 } },
    { name: 'isActive', type: 'boolean', initialValue: true },
    { name: 'createdAt', type: 'datetime' }
  ]
}
```

### Sanity Schema: Category

```typescript
{
  name: 'category',
  type: 'document',
  fields: [
    { name: 'name', type: 'string', validation: required },
    { name: 'slug', type: 'slug', options: { source: 'name' } },
    { name: 'description', type: 'text' },
    { name: 'parent', type: 'reference', to: [{ type: 'category' }] }
  ]
}
```

### Sanity Schema: ProductVariant

```typescript
{
  name: 'productVariant',
  type: 'object',
  fields: [
    { name: 'name', type: 'string' },
    { name: 'price', type: 'number' },
    { name: 'stock', type: 'number' },
    { name: 'options', type: 'object', of: [{ type: 'variantOption' }] }
  ]
}
```

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/products` | GET | List products with pagination, search, filters |
| `/api/products/[slug]` | GET | Get single product by slug |
| `/api/categories` | GET | List all categories |
| `/api/categories/[slug]` | GET | Get category with products |
| `/api/search` | GET | Search products by query |

## Components

| Component | Type | Description |
|-----------|------|-------------|
| `ProductGrid` | Server | Displays paginated product grid |
| `ProductCard` | Server | Individual product card with image, name, price |
| `ProductDetail` | Server | Full product detail view |
| `CategoryNav` | Server | Category navigation sidebar |
| `SearchBar` | Client | Debounced search input with results |
| `FilterPanel` | Client | Price range, category, availability filters |
| `Pagination` | Client | Page navigation controls |
| `Breadcrumbs` | Server | Navigation breadcrumb trail |

## Testing Strategy

### Unit Tests
- Component rendering (ProductCard, ProductGrid, FilterPanel)
- GROQ query construction and sanitization
- Price formatting utilities
- URL parameter parsing for filters

### Integration Tests
- Sanity data fetching with mock client
- Search functionality with debouncing
- Filter state management and URL sync
- Category navigation flow

### E2E Tests (Playwright)
- Full product browsing flow: homepage → category → product detail
- Search and filter combinations
- Mobile responsive behavior
- SEO meta tag validation
- 404 handling for invalid slugs

## Dependencies

### Depends On
- Sanity CMS project setup and configuration
- Tailwind CSS + shadcn/ui component library
- Next.js App Router with Server Components

### Depended On By
- `cart-checkout`: Products are added to cart from catalog
- `admin-panel`: Products are managed in admin

## Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Sanity free tier query limits (100K req/month) | Medium | Implement client-side caching with SWR/React Cache |
| Large product catalogs slow GROQ queries | Medium | Use Sanity perspectives and batch queries |
| Image optimization at scale | Low | Use Next.js Image with Sanity CDN URLs |
| SEO indexing delays | Low | Use dynamic sitemap generation |
| Filter state complexity | Medium | Keep filters in URL for simplicity and shareability |