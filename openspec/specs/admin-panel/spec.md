# Admin Panel Specification

## Purpose

The admin panel capability provides a customized Sanity Studio interface for store administrators to manage products, categories, and orders. It extends the default Sanity Studio with custom input components, document actions, and structure configuration for an optimized e-commerce admin experience.

## Requirements

### Requirement: Sanity Studio Customization

The system SHALL provide a customized Sanity Studio instance accessible at /admin with custom branding, navigation structure, and input components tailored for e-commerce management.

#### Scenario: Admin access control

- GIVEN an unauthenticated user attempts to access /admin
- WHEN the page loads
- THEN they are redirected to /auth/login
- AND a message "Admin access required" is displayed

#### Scenario: Admin with user role

- GIVEN a logged-in user without admin role attempts to access /admin
- WHEN the page loads
- THEN they see a "Not authorized" message
- AND are not redirected (to prevent loop)
- AND a link to return to the store is provided

#### Scenario: Admin with admin role

- GIVEN a logged-in user with admin role accesses /admin
- WHEN the Studio loads
- THEN the customized Sanity Studio interface is displayed
- AND navigation shows Products, Categories, Orders, and Users

### Requirement: Product Management

The system SHALL provide a customized product editing interface with image upload, variant management, category assignment, and stock tracking. Products SHALL be created, updated, and soft-deleted (isActive flag).

#### Scenario: Create new product

- GIVEN an admin is on the Products page in Sanity Studio
- WHEN they click "Create new" and fill in product details (name, price, category, images)
- THEN the product is saved to Sanity
- AND the product appears in the store catalog
- AND a success notification is displayed

#### Scenario: Edit existing product

- GIVEN an admin selects an existing product
- WHEN they modify the price from $29.99 to $34.99
- AND click "Publish"
- THEN the product price updates in Sanity
- AND the store catalog reflects the new price
- AND the change is logged in Sanity's revision history

#### Scenario: Upload product images

- GIVEN an admin is editing a product
- WHEN they drag and drop images into the image field
- THEN images are uploaded to Sanity's CDN
- AND image previews are displayed
- AND multiple images can be uploaded (up to 10)

#### Scenario: Manage product variants

- GIVEN an admin is editing a product with variants (size, color)
- WHEN they add a new variant option
- THEN the variant is added with its own price and stock fields
- AND variant combinations are automatically generated

#### Scenario: Soft delete product

- GIVEN an admin wants to remove a product from the catalog
- WHEN they toggle the "Active" switch to off
- THEN the product is no longer visible in the store
- AND the product data is preserved in Sanity
- AND the product can be reactivated later

### Requirement: Category Management

The system SHALL provide a category management interface with hierarchy support. Categories SHALL support parent-child relationships for nested navigation.

#### Scenario: Create new category

- GIVEN an admin is on the Categories page
- WHEN they create a category with name "Clothing" and description
- THEN the category is saved to Sanity
- AND it appears in the store's category navigation
- AND a slug is auto-generated from the name

#### Scenario: Create subcategory

- GIVEN a category "Clothing" exists
- WHEN an admin creates a category "Shirts" with parent "Clothing"
- THEN "Shirts" is nested under "Clothing" in the admin interface
- AND the store displays "Shirts" as a subcategory of "Clothing"

#### Scenario: Delete category with products

- GIVEN a category has assigned products
- WHEN an admin attempts to delete the category
- THEN a warning is displayed: "This category has X products"
- AND the admin must confirm deletion
- AND products are unassigned (not deleted)

### Requirement: Order Management

The system SHALL display orders in Sanity Studio with status tracking, customer details, and item breakdown. Orders SHALL be filterable by status and date range.

#### Scenario: View order list

- GIVEN an admin is on the Orders page
- WHEN the page loads
- THEN a list of orders is displayed sorted by date (newest first)
- AND each order shows order ID, customer email, status, total, and date

#### Scenario: View order details

- GIVEN an admin clicks on an order
- WHEN the order detail view loads
- THEN customer email, items (with product links), quantities, prices, and totals are displayed
- AND the order status is shown with available status transitions

#### Scenario: Update order status

- GIVEN an admin views an order with status "paid"
- WHEN they change the status to "shipped"
- THEN the status is updated in Sanity
- AND the change is logged in revision history
- AND the customer's order history reflects the new status

#### Scenario: Filter orders by status

- GIVEN multiple orders exist with different statuses
- WHEN an admin filters by status "paid"
- THEN only orders with status "paid" are displayed
- AND the filter persists while navigating between orders

### Requirement: Dashboard Overview

The system SHALL display a dashboard with key metrics: total products, total orders, recent orders, and revenue summary. Metrics SHALL be calculated from Sanity data.

#### Scenario: Dashboard display

- GIVEN an admin logs into the Studio
- WHEN the dashboard loads
- THEN total product count, order count, and revenue are displayed
- AND the 5 most recent orders are shown
- AND quick-action buttons for creating products and viewing orders are available

#### Scenario: Dashboard with no data

- GIVEN a new store with no products or orders
- WHEN the dashboard loads
- THEN "0" is displayed for all metrics
- AND getting-started guides are shown

### Requirement: Image Management

The system SHALL provide optimized image handling with automatic cropping, resizing, and format conversion via Sanity's image pipeline. Image metadata (alt text, captions) SHALL be editable.

#### Scenario: Image upload with preview

- GIVEN an admin uploads a product image
- WHEN the upload completes
- THEN a preview is displayed with the image
- AND file size and dimensions are shown
- AND an alt text field is available for accessibility

#### Scenario: Image crop and hotspot

- GIVEN an admin uploads a product image
- WHEN they enable crop/hotspot
- THEN a crop tool is displayed
- AND the admin can define the focal point for responsive cropping

#### Scenario: Multiple image ordering

- GIVEN a product has multiple images
- WHEN the admin reorders images via drag-and-drop
- THEN the image order is saved
- AND the store displays images in the specified order

### Requirement: Document Actions

The system SHALL extend Sanity's default document actions with custom publish, archive, and delete workflows appropriate for e-commerce data integrity.

#### Scenario: Publish with validation

- GIVEN an admin makes changes to a product
- WHEN they click "Publish"
- THEN required fields are validated (name, price, category)
- AND if validation fails, an error message is shown
- AND the document is not published until validation passes

#### Scenario: Archive instead of delete

- GIVEN an admin wants to remove a product
- WHEN they click "Archive" instead of "Delete"
- THEN the product is archived (soft deleted)
- AND the product data is preserved
- AND the product can be restored from the archive

#### Scenario: Bulk actions

- GIVEN an admin selects multiple products
- WHEN they choose an action (activate, deactivate, delete)
- THEN the action is applied to all selected products
- AND a progress indicator shows the bulk operation status

## Data Models

### Sanity Schema Extensions

The admin panel reuses existing schemas from product-catalog and cart-checkout with additional admin-specific fields:

```typescript
// Extended User schema with admin role
{
  name: 'user',
  type: 'document',
  fields: [
    // ... base fields from user-auth
    { name: 'role', type: 'string', options: { list: ['user', 'admin'] }, initialValue: 'user' }
  ]
}
```

### Sanity Studio Configuration

```typescript
// sanity.config.ts
export default defineConfig({
  // ... base config
  structure: (S) =>
    S.list()
      .title('Content')
      .items([
        S.listItem().title('Products').child(S.documentTypeList('product')),
        S.listItem().title('Categories').child(S.documentTypeList('category')),
        S.listItem().title('Orders').child(S.documentTypeList('order')),
        S.listItem().title('Users').child(S.documentTypeList('user'))
      ])
})
```

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/admin/[[...index]]` | GET | Sanity Studio catch-all route |
| `/api/admin/metrics` | GET | Dashboard metrics aggregation |

## Components

| Component | Type | Description |
|-----------|------|-------------|
| `AdminLayout` | Server | Custom Studio layout with branding |
| `Dashboard` | Server | Metrics overview with charts |
| `ProductInput` | Client | Custom product input with image manager |
| `VariantInput` | Client | Variant combination manager |
| `OrderList` | Client | Order list with filters |
| `OrderDetail` | Client | Order detail with status management |
| `ImageUpload` | Client | Drag-and-drop image uploader |

## Testing Strategy

### Unit Tests
- Custom input components (image upload, variant manager)
- Dashboard metrics calculation
- Document validation rules
- Access control logic

### Integration Tests
- Sanity Studio configuration loading
- Product CRUD operations via Studio
- Order status updates
- Category hierarchy management

### E2E Tests (Playwright)
- Admin login and access control
- Product creation with images and variants
- Order status workflow
- Dashboard metrics accuracy
- Bulk operations on products

## Dependencies

### Depends On
- `product-catalog`: Products are managed here
- `cart-checkout`: Orders are managed here
- `user-auth`: Admin users require authentication
- Sanity Studio library

### Depended On By
- No other capabilities depend on admin-panel

## Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Sanity Studio bundle size (large) | Medium | Use dynamic imports, lazy load Studio |
| Admin access security | High | Implement role-based access control, audit logging |
| Image upload failures (large files) | Low | Set file size limits, validate before upload |
| Studio customization breaking on Sanity updates | Medium | Pin Sanity versions, test updates in dev |
| Concurrent admin edits | Low | Sanity handles conflict resolution, show warnings |