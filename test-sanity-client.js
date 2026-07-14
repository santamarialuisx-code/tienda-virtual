const { createClient } = require("@sanity/client");
const client = createClient({
  projectId: "iltmiizk",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: true,
});

async function main() {
  try {
    const count = await client.fetch('count(*[_type == "product" && isActive == true])');
    console.log("Count result:", count, typeof count);
  } catch(e) { console.log("Count failed:", e.message); }

  try {
    const products = await client.fetch('*[_type == "product" && isActive == true] | order(createdAt desc) [0...12] { _id, name, slug, price, stock, images[0], category->{ name, slug }, brand, featured, createdAt }');
    console.log("Products count:", products.length);
  } catch(e) { console.log("Products failed:", e.message); }

  try {
    const products2 = await client.fetch('*[_type == "product" && isActive == true] | order(createdAt desc) [0...12] { _id, name, slug, price, stock, images[0], category->{ name, slug }, brand, featured, createdAt }', {});
    console.log("Products2 count (with empty params):", products2.length);
  } catch(e2) { console.log("Products2 failed:", e2.message); }

  try {
    const count2 = await client.fetch('count(*[_type == "product" && isActive == true])', {});
    console.log("Count2 result (with empty params):", count2, typeof count2);
  } catch(e3) { console.log("Count2 failed:", e3.message); }
}
main();
