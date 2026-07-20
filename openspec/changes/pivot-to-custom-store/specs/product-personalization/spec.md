# Product Personalization Specification

## Purpose

The product personalization capability defines the data model and business rules for customizing products before adding them to the cart. It covers color selection, size selection (clothing), custom text input, and pricing tiers based on personalization complexity. This is a NEW domain — no existing spec exists.

## Requirements

### Requirement: Personalization Options Configuration

The system SHALL allow admins to configure per-product personalization options in Sanity. Each product SHALL declare which customization types it supports (color, size, text) and the available values for each.

#### Scenario: Product with color + text personalization

- GIVEN a product (e.g., "Vaso Naruto") has `personalizationEnabled: true`
- AND `allowsColor: true`, `allowsText: true`, `allowsSize: false`
- WHEN a customer views the product
- THEN the customization flow offers color swatches and text input
- AND size selection is not shown

#### Scenario: Product with all personalization options

- GIVEN a product (e.g., "Camisa Dragon Ball") has all options enabled
- WHEN a customer customizes the product
- THEN color, size, and text steps are all available
- AND each step validates independently

#### Scenario: Product with no personalization

- GIVEN a product has `personalizationEnabled: false`
- WHEN a customer views the product
- THEN no customization flow is offered
- AND the product can be added directly to cart (standard add-to-cart)

### Requirement: Color Personalization

The system SHALL support color selection via visual swatch components. Available colors SHALL be defined per product in Sanity as an array of hex codes or named colors. The system SHALL display swatches as clickable circles/boxes, not as a dropdown menu.

#### Scenario: Display color swatches

- GIVEN a product has `availableColors: ["#FF0000", "#0000FF", "#FFFFFF"]`
- WHEN the color step loads
- THEN three color swatches are displayed
- AND the first swatch is pre-selected as default
- AND hovering/tapping a swatch shows a tooltip with the color name (if provided)

#### Scenario: Select a color

- GIVEN color swatches are displayed
- WHEN a customer taps the blue swatch
- THEN the swatch shows a selected state (border, checkmark)
- AND the product preview updates to reflect the selected color
- AND the previously selected swatch is deselected

#### Scenario: Single available color

- GIVEN a product has only one available color
- WHEN the color step loads
- THEN the single swatch is pre-selected
- AND the step shows a "Color: [name]" confirmation
- AND the customer can proceed without interaction

### Requirement: Size Personalization (Clothing)

The system SHALL support size selection for products in the Ropa physical type. Available sizes SHALL be defined per product. The system SHALL pre-select "M" as the default size unless the product specifies otherwise.

#### Scenario: Display size options

- GIVEN a Ropa product has `availableSizes: ["S", "M", "L", "XL", "XXL"]`
- WHEN the size step loads
- THEN five size buttons are displayed in a row
- AND "M" is pre-selected (highlighted)
- AND each button shows the size label

#### Scenario: Select a size

- GIVEN size options are displayed with "M" pre-selected
- WHEN a customer taps "XL"
- THEN "XL" becomes highlighted
- AND "M" is deselected
- AND the product preview updates if size affects the visual

#### Scenario: Size not applicable

- GIVEN a product has `allowsSize: false`
- WHEN the customization flow runs
- THEN the size step is skipped entirely
- AND the flow proceeds to the next applicable step

### Requirement: Custom Text Input

The system SHALL support short custom text input for products that enable it. Text SHALL be limited to a configurable maximum character count (default 30). The system SHALL display a live character counter and validate input in real time.

#### Scenario: Display text input with counter

- GIVEN a product has `allowsText: true` and `maxTextLength: 30`
- WHEN the text step loads
- THEN a text input field is displayed
- AND a character counter shows "0 / 30"
- AND a helper text says "Máximo 30 caracteres"

#### Scenario: Type custom text

- GIVEN the text input is displayed
- WHEN a customer types "Naruto kun"
- THEN the counter updates to "10 / 30"
- AND the text appears on the product preview as an overlay
- AND no error is shown

#### Scenario: Exceed character limit

- GIVEN the text input has maxTextLength: 30
- WHEN a customer types 31 characters
- THEN the input stops accepting characters at 30
- AND the counter shows "30 / 30" in a warning color
- AND no form submission is possible with invalid text

#### Scenario: Empty text submission

- GIVEN the text input is empty
- WHEN the customer proceeds to the next step
- THEN the flow proceeds with no text (text is optional unless product requires it)
- AND the review step shows "Sin texto personalizado"

#### Scenario: Text with only whitespace

- GIVEN a customer enters "   " (spaces only)
- WHEN they proceed
- THEN the system treats it as empty text
- AND proceeds without error

### Requirement: Personalization Pricing Tiers

The system SHALL calculate personalization fees based on complexity tiers: básico (text/color only) = +$5, medio (simple image) = +$10, complejo (full design) = +$20. The fee SHALL be added to the base price and displayed in real time during customization.

#### Scenario: Básico tier pricing

- GIVEN a product with base price $15
- WHEN a customer selects only color and/or text
- THEN the personalization fee is +$5
- AND the total price shown is $20
- AND the breakdown shows "Base: $15 + Personalización: $5 = $20"

#### Scenario: Price update on option change

- GIVEN a customer is on the review step with total $20 (básico tier)
- WHEN they go back and add a complex design option
- THEN the fee updates to +$20
- AND the total price updates to $35 immediately

#### Scenario: Base price only (no personalization)

- GIVEN a product with `personalizationEnabled: false`
- WHEN a customer adds it to cart
- THEN only the base price is charged
- AND no personalization fee is added

### Requirement: Personalization Data Persistence

The system SHALL persist customization selections (color, size, text, selected tier) as a structured object attached to the cart item. This data SHALL be stored in Zustand cart state and included in the order sent to Sanity.

#### Scenario: Customization data in cart

- GIVEN a customer completes customization and adds to cart
- WHEN they view the cart
- THEN the cart item shows: product name, selected color, size (if applicable), custom text (if any), and price breakdown
- AND the customization data is serialized as JSON in the cart item

#### Scenario: Customization data in order

- GIVEN a customer checks out with customized items
- WHEN the order is created in Sanity
- THEN each order item includes the customization data
- AND the admin can view color, size, and text for each item

## Data Models

### Sanity Schema: PersonalizationOptions (embedded in Product)

```typescript
// Already defined in product-catalog delta spec
// Key fields: allowsColor, allowsSize, allowsText, maxTextLength, availableColors, availableSizes
```

### Sanity Schema: CustomizationTier

```typescript
{
  name: 'customizationTier',
  type: 'object',
  fields: [
    { name: 'name', type: 'string' },           // 'basico' | 'medio' | 'complejo'
    { name: 'label', type: 'string' },           // 'Básico' | 'Medio' | 'Complejo'
    { name: 'fee', type: 'number' },             // 5, 10, or 20
    { name: 'description', type: 'string' },     // 'Texto/color simple'
  ]
}
```

### TypeScript Types

```typescript
type PersonalizationTier = 'basico' | 'medio' | 'complejo';

interface CustomizationData {
  tier: PersonalizationTier;
  color?: string;
  size?: string;
  text?: string;
  fee: number;
}

interface CartItemCustomization {
  productId: string;
  productName: string;
  basePrice: number;
  customization: CustomizationData;
  totalPrice: number;  // basePrice + fee
}

const PERSONALIZATION_FEES: Record<PersonalizationTier, number> = {
  basico: 5,
  medio: 10,
  complejo: 20,
};
```

### GROQ Queries

```groq
// Product with personalization config
*[_type == "product" && slug.current == $slug][0] {
  _id, name, slug, price, personalizationEnabled, personalizationOptions, images
}
```

## Components

| Component | Type | Description |
|-----------|------|-------------|
| `ColorSwatches` | Client | Visual swatch picker with selection state |
| `SizeSelector` | Client | Size button row with default selection |
| `CustomTextInput` | Client | Input with live character counter |
| `PriceBreakdown` | Client | Real-time base + fee display |
| `PersonalizationTierBadge` | Client | Shows selected tier and fee |

## Acceptance Criteria

- [ ] Color swatches render as clickable visual elements, not dropdowns
- [ ] Size selector pre-selects "M" for clothing products
- [ ] Text input shows "0/30" counter that updates as user types
- [ ] Character limit is enforced — input stops at max length
- [ ] Whitespace-only text is treated as empty
- [ ] Pricing tier fee is added to base price and shown in real time
- [ ] Customization data persists in Zustand cart state as structured JSON
- [ ] Customization data is included in Sanity order items
- [ ] All touch targets are 44x44px minimum

## Edge Cases

- Product with `availableColors: []` — show "Colores no disponibles" message
- Product with `availableSizes: []` — skip size step entirely
- Custom text contains special characters (<, >, &) — sanitize before rendering in preview
- Customer rapidly clicks between swatches — debounce selection updates
- Browser localStorage is full — show warning, cart may not persist
- Product price is $0 — personalization fee still applies normally
