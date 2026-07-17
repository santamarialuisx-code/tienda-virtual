import { client, safeFetch } from "./client";
import type {
  Product,
  ProductListItem,
  Category,
  ProductFilters,
  PaginatedProducts,
  Order,
  OrderStatus,
  Collection,
} from "./types";

const PRODUCT_LIST_FRAGMENT = `{
  _id, name, slug, price, stock, images[0],
  category->{ name, slug },
  brand, featured, createdAt
}`;

// All active products with category (paginated)
export async function getAllProducts(
  page: number = 1,
  limit: number = 12
): Promise<PaginatedProducts> {
  const start = (page - 1) * limit;
  const [products, total] = await Promise.all([
    safeFetch<ProductListItem[]>(
      `*[_type == "product" && isActive == true] | order(createdAt desc) [${start}...${start + limit}] ${PRODUCT_LIST_FRAGMENT}`
    ),
    safeFetch<number>(
      `count(*[_type == "product" && isActive == true])`
    ),
  ]);

  return {
    products: products || [],
    total: total || 0,
    page,
    totalPages: Math.ceil((total || 0) / limit),
    limit,
  };
}

// Featured products for homepage
export async function getFeaturedProducts(
  limit: number = 4
): Promise<ProductListItem[]> {
  return safeFetch<ProductListItem[]>(
    `*[_type == "product" && isActive == true && featured == true] | order(createdAt desc) [0...${limit}] ${PRODUCT_LIST_FRAGMENT}`
  );
}

// Products by category (paginated)
export async function getProductsByCategory(
  slug: string,
  page: number = 1,
  limit: number = 12
): Promise<PaginatedProducts> {
  const start = (page - 1) * limit;
  const [products, total] = await Promise.all([
    safeFetch<ProductListItem[]>(
      `*[_type == "product" && isActive == true && category->slug.current == $slug] | order(createdAt desc) [${start}...${start + limit}] ${PRODUCT_LIST_FRAGMENT}`,
      { slug }
    ),
    safeFetch<number>(
      `count(*[_type == "product" && isActive == true && category->slug.current == $slug])`,
      { slug }
    ),
  ]);

  return {
    products: products || [],
    total: total || 0,
    page,
    totalPages: Math.ceil((total || 0) / limit),
    limit,
  };
}

// Product detail by slug
export async function getProductBySlug(
  slug: string
): Promise<Product | null> {
  try {
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return null;
    return await client.fetch(
      `*[_type == "product" && slug.current == $slug][0] {
        ..., category->{ name, slug },
        variants[] { name, price, stock, options }
      }`,
      { slug }
    );
  } catch {
    return null;
  }
}

// Related products (same category, excluding current)
export async function getRelatedProducts(
  categorySlug: string,
  currentProductId: string,
  limit: number = 4
): Promise<ProductListItem[]> {
  return safeFetch<ProductListItem[]>(
    `*[_type == "product" && isActive == true && category->slug.current == $categorySlug && _id != $currentProductId] | order(createdAt desc) [0...${limit}] ${PRODUCT_LIST_FRAGMENT}`,
    { categorySlug, currentProductId }
  );
}

// Search products with relevance
export async function searchProducts(
  query: string,
  page: number = 1,
  limit: number = 12
): Promise<PaginatedProducts> {
  const start = (page - 1) * limit;
  const searchQuery = `${query}*`;
  const [products, total] = await Promise.all([
    safeFetch<ProductListItem[]>(
      `*[_type == "product" && isActive == true && (name match $searchQuery || description match $searchQuery || brand match $searchQuery || count((tags[])[@ in [$searchQuery]]) > 0)] | order(createdAt desc) [${start}...${start + limit}] ${PRODUCT_LIST_FRAGMENT}`,
      { searchQuery }
    ),
    safeFetch<number>(
      `count(*[_type == "product" && isActive == true && (name match $searchQuery || description match $searchQuery || brand match $searchQuery || count((tags[])[@ in [$searchQuery]]) > 0)])`,
      { searchQuery }
    ),
  ]);

  return {
    products: products || [],
    total: total || 0,
    page,
    totalPages: Math.ceil((total || 0) / limit),
    limit,
  };
}

// Filter and sort products
export async function filterProducts(
  filters: ProductFilters
): Promise<PaginatedProducts> {
  const {
    category,
    minPrice,
    maxPrice,
    inStock,
    search,
    sort = "newest",
    page = 1,
    limit = 12,
  } = filters;
  const start = (page - 1) * limit;

  let conditions = [`isActive == true`];
  const params: Record<string, unknown> = {};

  if (category) {
    conditions.push(`category->slug.current == $category`);
    params.category = category;
  }
  if (minPrice !== undefined) {
    conditions.push(`price >= $minPrice`);
    params.minPrice = minPrice;
  }
  if (maxPrice !== undefined) {
    conditions.push(`price <= $maxPrice`);
    params.maxPrice = maxPrice;
  }
  if (inStock) {
    conditions.push(`stock > 0`);
  }
  if (search) {
    conditions.push(
      `(name match $searchQuery || description match $searchQuery)`
    );
    params.searchQuery = `${search}*`;
  }

  const whereClause = conditions.length > 0 ? conditions.join(" && ") : "true";

  let sortClause = "| order(createdAt desc)";
  switch (sort) {
    case "price-asc":
      sortClause = "| order(price asc)";
      break;
    case "price-desc":
      sortClause = "| order(price desc)";
      break;
    case "relevance":
      sortClause = search ? "" : "| order(createdAt desc)";
      break;
  }

  const [products, total] = await Promise.all([
    safeFetch<ProductListItem[]>(
      `*[_type == "product" && ${whereClause}] ${sortClause} [${start}...${start + limit}] ${PRODUCT_LIST_FRAGMENT}`,
      params
    ),
    safeFetch<number>(
      `count(*[_type == "product" && ${whereClause}])`,
      params
    ),
  ]);

  return {
    products: products || [],
    total: total || 0,
    page,
    totalPages: Math.ceil((total || 0) / limit),
    limit,
  };
}

// All categories with product count
export async function getAllCategories(): Promise<
  (Category & { productCount: number })[]
> {
  return safeFetch<(Category & { productCount: number })[]>(
    `*[_type == "category"] {
      _id, name, slug, description, image,
      parent->{ name, slug },
      "productCount": count(*[_type == "product" && isActive == true && ^.slug.current in [category->slug.current]])
    }`
  );
}

// Category by slug
export async function getCategoryBySlug(
  slug: string
): Promise<Category | null> {
  try {
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return null;
    return await client.fetch(
      `*[_type == "category" && slug.current == $slug][0] {
        _id, name, slug, description, image,
        parent->{ name, slug }
      }`,
      { slug }
    );
  } catch {
    return null;
  }
}

// Autocomplete suggestions
export async function getAutocompleteSuggestions(
  query: string,
  limit: number = 5
): Promise<{ name: string; slug: string; category: string }[]> {
  return safeFetch(
    `*[_type == "product" && isActive == true && (name match $searchQuery)] | order(createdAt desc) [0...${limit}] {
      name,
      "slug": slug.current,
      "category": category->name
    }`,
    { searchQuery: `${query}*` }
  );
}

// Create a new order
export async function createOrder(orderData: {
  customerEmail: string;
  customerName?: string;
  items: Array<{
    product: string;
    productName: string;
    quantity: number;
    price: number;
    variant?: string;
  }>;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: OrderStatus;
  paymentMethod: "paypal" | "pagomovil";
  paypalOrderId?: string;
}): Promise<{ _id: string }> {
  return client.create({
    _type: "order",
    ...orderData,
    createdAt: new Date().toISOString(),
  });
}

// Get order by ID
export async function getOrderById(orderId: string): Promise<Order | null> {
  try {
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return null;
    return await client.fetch(
      `*[_type == "order" && _id == $orderId][0] {
        ..., items[] {
          product->,
          productName,
          quantity,
          price,
          variant
        }
      }`,
      { orderId }
    );
  } catch {
    return null;
  }
}

// Get orders by customer email
export async function getOrdersByEmail(
  email: string,
  page: number = 1,
  limit: number = 10
): Promise<{ orders: Order[]; total: number }> {
  const start = (page - 1) * limit;
  const [orders, total] = await Promise.all([
    safeFetch<Order[]>(
      `*[_type == "order" && customerEmail == $email] | order(createdAt desc) [${start}...${start + limit}] {
        ..., items[] {
          product->,
          productName,
          quantity,
          price,
          variant
        }
      }`,
      { email }
    ),
    safeFetch<number>(
      `count(*[_type == "order" && customerEmail == $email])`,
      { email }
    ),
  ]);

  return {
    orders: orders || [],
    total: total || 0,
  };
}

// Update order status
export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<void> {
  await client
    .patch(orderId)
    .set({ status })
    .commit();
}

// ===== Admin Queries =====

// Get all products (including inactive) for admin
export async function getAllProductsAdmin(): Promise<ProductListItem[]> {
  return safeFetch<ProductListItem[]>(
    `*[_type == "product"] | order(createdAt desc) ${PRODUCT_LIST_FRAGMENT}`
  );
}

// Get all orders for admin
export async function getAllOrdersAdmin(): Promise<Order[]> {
  return safeFetch<Order[]>(
    `*[_type == "order"] | order(createdAt desc) {
      ..., items[] {
        product->,
        productName,
        quantity,
        price,
        variant
      }
    }`
  );
}

// Get all users for admin
export async function getAllUsersAdmin(): Promise<
  Array<{
    _id: string;
    email: string;
    name?: string;
    role: string;
    createdAt: string;
  }>
> {
  return safeFetch(
    `*[_type == "user"] | order(createdAt desc) {
      _id,
      email,
      name,
      role,
      createdAt
    }`
  );
}

// Get dashboard metrics
export async function getDashboardMetrics(): Promise<{
  totalProducts: number;
  activeProducts: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  totalUsers: number;
}> {
  return safeFetch(`{
    "totalProducts": count(*[_type == "product"]),
    "activeProducts": count(*[_type == "product" && isActive == true]),
    "totalOrders": count(*[_type == "order"]),
    "pendingOrders": count(*[_type == "order" && status == "pending"]),
    "totalRevenue": math::sum(*[_type == "order" && status == "paid"].total),
    "totalUsers": count(*[_type == "user"])
  }`);
}
