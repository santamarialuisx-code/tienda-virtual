# Thematic Collections Specification

## Purpose

The thematic collections capability allows administrators to manually curate product groupings by anime franchise, pop culture theme, or seasonal promotion. Collections are managed entirely in Sanity — no auto-generation from tags. This is a NEW domain — no existing spec exists.

## Requirements

### Requirement: Collection Document Type

The system SHALL support a `collection` document type in Sanity with fields for name, slug, description, image, product references, active status, and sort order. Collections SHALL be manually curated by the admin — products are explicitly assigned, not auto-tagged.

#### Scenario: Create a collection in Sanity

- GIVEN an admin is in Sanity Studio
- WHEN they create a new collection with name "Temporada Naruto", description, and image
- THEN the collection is saved with a slug auto-generated from the name
- AND the admin can assign products to it
- AND the collection appears in the store

#### Scenario: Assign products to a collection

- GIVEN a collection "Temporada Naruto" exists
- WHEN the admin selects 5 products to include
- THEN those 5 products are linked to the collection
- AND the collection page displays exactly those 5 products
- AND reordering products in Sanity changes display order in the store

#### Scenario: Deactivate a collection

- GIVEN a collection is active
- WHEN the admin sets `isActive: false`
- THEN the collection is hidden from the store
- AND direct URL access returns 404
- AND products remain unaffected

### Requirement: Collection Page Display

The system SHALL provide a /collections/[slug] page displaying the collection's name, description, hero image, and assigned products in a grid. The page SHALL be server-rendered for SEO.

#### Scenario: Collection page load

- GIVEN a customer navigates to /collections/temporada-naruto
- WHEN the page loads
- THEN the collection name, description, and hero image are displayed
- AND assigned products are shown in a grid with images, names, and prices
- AND products are displayed in the order set by the admin

#### Scenario: Collection with no products

- GIVEN a collection exists but has no assigned products
- WHEN a customer visits the collection page
- THEN the collection header (name, description, image) is still displayed
- AND a message "Próximamente productos en esta colección" is shown

#### Scenario: Invalid collection slug

- GIVEN a customer navigates to /collections/nonexistent-slug
- WHEN the page loads
- THEN a 404 page is displayed

### Requirement: Collections Listing

The system SHALL provide a /collections page listing all active collections with their images and names. The page SHALL serve as a discovery entry point for thematic browsing.

#### Scenario: Collections listing page

- GIVEN multiple active collections exist
- WHEN a customer visits /collections
- THEN all active collections are displayed as cards with image, name, and product count
- AND collections are sorted by sortOrder (admin-defined)
- AND each card links to the collection detail page

#### Scenario: No active collections

- GIVEN no collections have `isActive: true`
- WHEN a customer visits /collections
- THEN a message "No hay colecciones disponibles" is displayed
- AND a link to browse all products is shown

### Requirement: Collection Navigation Integration

The system SHALL surface collections in the site navigation. A "Colecciones" link SHALL appear in the main header/nav, and featured collections MAY appear on the homepage.

#### Scenario: Collection in main navigation

- GIVEN the site header renders
- WHEN a customer views the navigation
- THEN a "Colecciones" link is visible
- AND clicking it navigates to /collections

#### Scenario: Featured collections on homepage

- GIVEN collections with `featured: true` exist
- WHEN the homepage loads
- THEN featured collections are displayed in a dedicated section
- AND each shows image, name, and a "Ver colección" CTA

### Requirement: SEO for Collections

The system SHALL generate proper meta tags and structured data for collection pages. Collections SHALL be included in the sitemap.

#### Scenario: Collection page SEO

- GIVEN a collection page loads
- WHEN a crawler visits
- THEN Open Graph tags include the collection image and description
- AND the page is server-rendered
- AND a canonical URL is set

#### Scenario: Sitemap includes collections

- GIVEN active collections exist
- WHEN sitemap.xml is generated
- THEN all active collection URLs are included with lastmod dates

## Data Models

### Sanity Schema: Collection

```typescript
{
  name: 'collection',
  title: 'Colección',
  type: 'document',
  fields: [
    { name: 'name', title: 'Nombre', type: 'string', validation: required },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name' } },
    { name: 'description', title: 'Descripción', type: 'text' },
    { name: 'image', title: 'Imagen', type: 'image', options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string' }] },
    { name: 'products', title: 'Productos', type: 'array',
      of: [{ type: 'reference', to: [{ type: 'product' }] }] },
    { name: 'featured', title: 'Destacada', type: 'boolean', initialValue: false },
    { name: 'isActive', title: 'Activa', type: 'boolean', initialValue: true },
    { name: 'sortOrder', title: 'Orden', type: 'number', initialValue: 0 },
    { name: 'createdAt', title: 'Fecha de creación', type: 'datetime' },
  ]
}
```

### TypeScript Types

```typescript
interface Collection {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: SanityImage;
  products: Product[];
  featured: boolean;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
}
```

### GROQ Queries

```groq
// All active collections for listing
*[_type == "collection" && isActive == true] | order(sortOrder asc) {
  _id, name, slug, image, featured, "productCount": count(products)
}

// Collection detail with products
*[_type == "collection" && slug.current == $slug && isActive == true][0] {
  _id, name, slug, description, image, featured,
  products[]-> {
    _id, name, slug, price, images[0], personalizationEnabled, category->{name}
  }
}

// Featured collections for homepage
*[_type == "collection" && isActive == true && featured == true] | order(sortOrder asc) {
  _id, name, slug, image, description
}
```

## Components

| Component | Type | Description |
|-----------|------|-------------|
| `CollectionsList` | Server | Grid of collection cards at /collections |
| `CollectionCard` | Server | Individual collection card with image, name, count |
| `CollectionDetail` | Server | Full collection page with products grid |
| `CollectionNav` | Server | "Colecciones" link in main navigation |
| `FeaturedCollections` | Server | Homepage section for featured collections |

## Acceptance Criteria

- [ ] Collections are managed manually in Sanity (no auto-generation)
- [ ] /collections page lists all active collections with images and product counts
- [ ] /collections/[slug] displays collection header and assigned products
- [ ] "Colecciones" link appears in main navigation
- [ ] Featured collections appear on homepage
- [ ] Deactivated collections return 404
- [ ] Collection pages are server-rendered for SEO
- [ ] Sitemap includes collection URLs
- [ ] Admin can reorder products within a collection

## Edge Cases

- Collection with 0 products — show header with "Próximamente" message
- Collection references a deactivated product — skip that product in listing
- Collection slug conflicts with product slug — Sanity slugs are unique per type, no conflict
- Admin deletes a product that's in a collection — product reference becomes null, skip in query
- Multiple collections reference the same product — product appears in both (no dedup)
