import { client } from "./client";
import type { Product, Category } from "./types";

// All active products with category
export async function getAllProducts(): Promise<Product[]> {
  return client.fetch(`
    *[_type == "product" && isActive == true] | order(createdAt desc) {
      _id, name, slug, price, stock, images[0],
      category->{ name, slug }
    }
  `);
}

// Products by category
export async function getProductsByCategory(slug: string): Promise<Product[]> {
  return client.fetch(
    `
    *[_type == "product" && isActive == true && category->slug.current == $slug] | order(createdAt desc) {
      _id, name, slug, price, stock, images[0],
      category->{ name, slug }
    }
  `,
    { slug }
  );
}

// Product detail by slug
export async function getProductBySlug(slug: string): Promise<Product | null> {
  return client.fetch(
    `
    *[_type == "product" && slug.current == $slug][0] {
      ..., category->{ name, slug },
      variants[] { name, price, stock, options }
    }
  `,
    { slug }
  );
}

// Search products
export async function searchProducts(query: string): Promise<Product[]> {
  return client.fetch(
    `
    *[_type == "product" && isActive == true && (name match $searchQuery || description match $searchQuery)] {
      _id, name, slug, price, stock, images[0],
      category->{ name, slug }
    }
  `,
    { searchQuery: `${query}*` }
  );
}

// All categories
export async function getAllCategories(): Promise<Category[]> {
  return client.fetch(`
    *[_type == "category"] {
      _id, name, slug, description, image,
      parent->{ name, slug }
    }
  `);
}

// Category by slug
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  return client.fetch(
    `
    *[_type == "category" && slug.current == $slug][0] {
      _id, name, slug, description, image,
      parent->{ name, slug }
    }
  `,
    { slug }
  );
}
