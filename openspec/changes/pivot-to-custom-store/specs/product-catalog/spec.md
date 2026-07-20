# Delta for Product Catalog

## MODIFIED Requirements

### Requirement: Product Listing Display

The system SHALL display a paginated grid of products with image, name, base price, and physical-type category. Products SHALL be fetched from Sanity using GROQ queries and rendered as Server Components for SEO. Products SHALL display their base price (personalization fees excluded) with a "Personalizá el tuyo" badge when customization is enabled.

#### Scenario: Default product listing

- GIVEN a customer visits the homepage or /products page
- WHEN the page loads
- THEN a grid of products is displayed with images, names, base prices, and physical-type category labels
- AND products are sorted by creation date (newest first) by default
- AND pagination controls are visible when more than 12 products exist

#### Scenario: Product with personalization badge

- GIVEN a product has `personalizationEnabled: true`
- WHEN the product card renders
- THEN a "Personalizá el tuyo" badge is visible on the card
- AND the base price is shown with a "+" prefix (e.g., "+$5")

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

The system SHALL provide a dedicated product detail page at /products/[slug] with full product information, multiple images, physical-type category, base price, and a "Personalizá el tuyo" CTA that launches the customization flow. Products SHALL no longer show variant selectors directly on the detail page — customization replaces the variant picker.

#### Scenario: Standard product detail page load

- GIVEN a customer clicks a product card
- WHEN the /products/[slug] page loads
- THEN the full product detail is displayed with name, description, base price, images, and physical-type category
- AND the page includes structured data (JSON-LD) for SEO
- AND a meta description is set from the product description
- AND a "Personalizá el tuyo" button is prominently displayed

#### Scenario: Personalizable product detail page

- GIVEN a product has `personalizationEnabled: true`
- WHEN the product detail page loads
- THEN the "Personalizá el tuyo" CTA launches the customization flow (step-by-step configurator)
- AND the base price is shown separately from the personalization fee preview

#### Scenario: Invalid product slug

- GIVEN a customer navigates to /products/nonexistent-slug
- WHEN the page loads
- THEN a 404 page is displayed with a link back to the product listing

### Requirement: Category Navigation

The system SHALL organize products into physical-type categories (Ropa, Vasos/Tazas, Botellas/Tumblers, Gorras, Sets de Madera, Accesorios) and provide navigation between them. Categories SHALL be fetched from Sanity and displayed in the main navigation. Subcategories SHALL support nesting (e.g., Ropa > Camisas, Ropa > Hoodies).

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

- GIVEN a customer types "naruto" in the search bar
- WHEN the search query is submitted (debounced after 300ms)
- THEN products matching "naruto" in name, description, or tags are displayed
- AND the search term is highlighted in results
- AND the URL updates to reflect the search query (?q=naruto)

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

The system SHALL support filtering products by price range, physical-type category, and availability status. Filters SHALL be combinable and reflected in the URL for shareability.

#### Scenario: Apply price filter

- GIVEN a customer is on the products page
- WHEN they select a price range filter (e.g., $50-$100)
- THEN only products within that price range are displayed
- AND the URL updates with filter parameters
- AND the filter selection is visually indicated

#### Scenario: Combine multiple filters

- GIVEN a customer selects category "Ropa" and price range "$20-$50"
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

## ADDED Requirements

### Requirement: Physical-Type Product Categorization

The system SHALL categorize products by physical product type rather than generic categories. The predefined physical types are: Ropa (camisas, hoodies), Vasos/Tazas (whiskeros, tazas), Botellas/Tumblers, Gorras, Sets de Madera, and Accesorios. Each product SHALL belong to exactly one physical-type category.

#### Scenario: Product assigned to physical-type category

- GIVEN an admin creates a new product in Sanity
- WHEN they assign it to the "Ropa" category
- THEN the product appears under the Ropa physical type in the store
- AND the category hierarchy supports subcategories (Ropa > Camisas)

#### Scenario: Browse by physical type

- GIVEN a customer visits the store
- WHEN they navigate to the category sidebar
- THEN physical-type categories are displayed (Ropa, Vasos/Tazas, etc.)
- AND each category shows a count of products it contains

#### Scenario: Filter by physical type

- GIVEN a customer is on the products page
- WHEN they select the "Vasos/Tazas" filter
- THEN only products in the Vasos/Tazas category are displayed
- AND the URL reflects the category filter

### Requirement: Made-to-Order Stock Model

The system SHALL treat products as made-to-order items. The `stock` field SHALL be removed from the product schema. Products SHALL always be available for purchase and personalization. The `isActive` field SHALL control visibility, not stock availability.

#### Scenario: Product always available for purchase

- GIVEN a product is active in Sanity
- WHEN a customer views the product
- THEN the product is always shown as available
- AND no "out of stock" state exists
- AND the "Add to Cart" / "Personalizá el tuyo" button is always enabled

#### Scenario: Deactivated product hidden

- GIVEN an admin sets a product's `isActive` to false
- WHEN a customer browses the store
- THEN the product is not displayed in listings or search results
- AND direct URL access returns 404

### Requirement: Product Customization Flow ("Personalizá el tuyo")

The system SHALL provide a step-by-step product customization flow accessible from product detail pages. The flow SHALL use progressive disclosure: Step 1 (select base), Step 2 (color/size), Step 3 (text), Step 4 (review & add to cart). Each step SHALL validate input before advancing.

#### Scenario: Launch customization from product page

- GIVEN a customer is on a product detail page with `personalizationEnabled: true`
- WHEN they click "Personalizá el tuyo"
- THEN the customization flow launches in a modal or dedicated page
- AND Step 1 shows the base product with available options
- AND the progress indicator shows Step 1 of 4

#### Scenario: Select color with visual swatches

- GIVEN the customer is on Step 2 of customization
- WHEN the color selection step loads
- THEN color options are displayed as visual swatches (not dropdowns)
- AND the most common / default color is pre-selected
- AND selecting a swatch updates the product preview in real time

#### Scenario: Select size for clothing products

- GIVEN the product belongs to the Ropa physical type
- WHEN the size selection step loads
- THEN available sizes (S, M, L, XL, XXL) are displayed
- AND the most common size (M) is pre-selected
- AND selecting a size updates the preview if applicable

#### Scenario: Enter custom text

- GIVEN the customer is on Step 3 of customization
- WHEN the text input step loads
- THEN a text field with a visible character counter (e.g., "0/30") is displayed
- AND the maximum character count is enforced as the user types
- AND inline validation shows errors for invalid input in real time
- AND the text appears on the product preview as an overlay

#### Scenario: Review step with price breakdown

- GIVEN the customer has completed all customization steps
- WHEN they reach Step 4 (review)
- THEN a summary shows: base product, selected color, selected size, custom text, and base price + personalization fee
- AND the total price (base + fee) is clearly displayed
- AND an "Add to Cart" button is available
- AND a "Back" option allows returning to any previous step

#### Scenario: Conditional text field

- GIVEN a product does not support text personalization
- WHEN the customization flow reaches Step 3
- THEN the text step is skipped
- AND the flow proceeds directly from Step 2 to Step 4

#### Scenario: Mobile-first touch targets

- GIVEN a customer uses the customization flow on a mobile device
- WHEN they interact with any button, swatch, or input
- THEN all touch targets are at least 44x44px
- AND no pinch-zoom is required for any step
- AND the flow fits within a single viewport per step

#### Scenario: Real-time price transparency

- GIVEN a customer is on any customization step
- WHEN they change a customization option (color, size, text)
- THEN the total price (base + personalization fee) updates immediately
- AND the fee breakdown is visible at all times

## Data Models

### Sanity Schema: Product (Modified)

```typescript
{
  name: 'product',
  type: 'document',
  fields: [
    { name: 'name', type: 'string', validation: required },
    { name: 'slug', type: 'slug', options: { source: 'name' } },
    { name: 'description', type: 'text' },
    { name: 'price', type: 'number', validation: { min: 0 }, description: 'Base price (USD)' },
    { name: 'images', type: 'array', of: [{ type: 'image', fields: [{ name: 'alt', type: 'string' }] }] },
    { name: 'category', type: 'reference', to: [{ type: 'category' }], validation: required },
    { name: 'personalizationEnabled', type: 'boolean', initialValue: false },
    { name: 'personalizationOptions', type: 'object', fields: [
      { name: 'allowsColor', type: 'boolean', initialValue: true },
      { name: 'allowsSize', type: 'boolean', initialValue: false },
      { name: 'allowsText', type: 'boolean', initialValue: false },
      { name: 'maxTextLength', type: 'number', initialValue: 30 },
      { name: 'availableColors', type: 'array', of: [{ type: 'string' }] },
      { name: 'availableSizes', type: 'array', of: [{ type: 'string' }] },
    ]},
    { name: 'tags', type: 'array', of: [{ type: 'string' }], options: { layout: 'tags' } },
    { name: 'featured', type: 'boolean', initialValue: false },
    { name: 'isActive', type: 'boolean', initialValue: true },
    { name: 'createdAt', type: 'datetime' }
  ]
}
```

### TypeScript Types

```typescript
type PhysicalType = 'ropa' | 'vasos-tazas' | 'botellas-tumblers' | 'gorras' | 'sets-madera' | 'accesorios';

interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  images: SanityImage[];
  category: Category;
  personalizationEnabled: boolean;
  personalizationOptions: PersonalizationOptions;
  tags: string[];
  featured: boolean;
  isActive: boolean;
  createdAt: string;
}

interface PersonalizationOptions {
  allowsColor: boolean;
  allowsSize: boolean;
  allowsText: boolean;
  maxTextLength: number;
  availableColors: string[];
  availableSizes: string[];
}
```

### GROQ Queries

```groq
// Product listing with category
*[_type == "product" && isActive == true] | order(createdAt desc) {
  _id, name, slug, price, images[0], category->{name, slug}, personalizationEnabled, tags
}

// Product detail with full personalization config
*[_type == "product" && slug.current == $slug][0] {
  ..., category->{name, slug}, personalizationOptions
}

// Products by physical-type category
*[_type == "product" && isActive == true && category->slug.current == $categorySlug] | order(createdAt desc) {
  _id, name, slug, price, images[0], personalizationEnabled
}
```

## Components

| Component | Type | Description |
|-----------|------|-------------|
| `PhysicalTypeNav` | Server | Sidebar with physical-type categories and product counts |
| `ProductCard` | Server | Product card with image, name, base price, personalization badge |
| `ProductGrid` | Server | Paginated grid with filters |
| `ProductDetail` | Server | Full detail page with "Personalizá el tuyo" CTA |
| `CustomizationFlow` | Client | Step-by-step configurator (4 steps) |
| `ColorSwatches` | Client | Visual color picker with swatches |
| `SizeSelector` | Client | Size picker for clothing products |
| `TextInput` | Client | Character-limited text input with live counter |
| `CustomizationReview` | Client | Summary step with price breakdown |
| `PriceDisplay` | Client | Real-time base + fee price display |

## Acceptance Criteria

- [ ] Products are categorized by physical type (Ropa, Vasos/Tazas, Botellas/Tumblers, Gorras, Sets de Madera, Accesorios)
- [ ] Product detail pages show "Personalizá el tuyo" CTA for personalizable products
- [ ] Customization flow has 4 steps with progressive disclosure
- [ ] Color selection uses visual swatches, not dropdowns
- [ ] Size selector pre-selects "M" as default
- [ ] Text input shows character counter (e.g., "0/30") and enforces max length
- [ ] Review step shows full summary with price breakdown (base + fee)
- [ ] Real-time price updates as customization options change
- [ ] All touch targets are 44x44px minimum on mobile
- [ ] No stock field exists on products (made-to-order model)

## Edge Cases

- Product with `personalizationEnabled: false` shows no customization CTA
- Product with `allowsText: false` skips text step in customization flow
- Empty `availableColors` or `availableSizes` arrays show a "Contact us" fallback
- Custom text with only whitespace is rejected
- Customer navigates directly to a customization step URL — redirect to Step 1
- Product has no images — show placeholder across all customization preview steps
