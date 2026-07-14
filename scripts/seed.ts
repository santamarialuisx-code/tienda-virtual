import { createClient } from '@sanity/client';
import { hashSync } from 'bcryptjs';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load .env.local manually (npx tsx doesn't auto-load it)
function loadEnv() {
  try {
    const envPath = resolve(__dirname, '..', '.env.local');
    const envContent = readFileSync(envPath, 'utf-8');
    for (const line of envContent.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const value = trimmed.slice(eqIdx + 1).trim();
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  } catch {
    // .env.local not found, rely on existing env vars
  }
}

loadEnv();

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'iltmiizk';
const dataset = process.env.SANITY_STUDIO_DATASET || 'production';
const token = process.env.SANITY_API_TOKEN || process.env.SANITY_API_READ_TOKEN;

if (!token) {
  console.error('Error: No Sanity API token found. Set SANITY_API_TOKEN or SANITY_API_READ_TOKEN');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
});

interface Category {
  name: string;
  slug: string;
  description: string;
  sortOrder: number;
}

interface Product {
  name: string;
  description: string;
  price: number;
  brand: string;
  tags: string[];
  featured: boolean;
  stock: number;
  categoryName: string;
}

const categories: Category[] = [
  {
    name: 'Alimentos Básicos',
    slug: 'alimentos-basicos',
    description: 'Productos fundamentales para la cocina venezolana: harinas, aceites, arroz, azúcar y más.',
    sortOrder: 1,
  },
  {
    name: 'Bebidas',
    slug: 'bebidas',
    description: 'Refrescos, jugos, aguas y bebidas para toda la familia.',
    sortOrder: 2,
  },
  {
    name: 'Aseo del Hogar',
    slug: 'aseo-del-hogar',
    description: 'Productos de limpieza para mantener tu hogar impecable.',
    sortOrder: 3,
  },
  {
    name: 'Aseo Personal',
    slug: 'aseo-personal',
    description: 'Artículos de higiene y cuidado personal para toda la familia.',
    sortOrder: 4,
  },
  {
    name: 'Snacks y Dulces',
    slug: 'snacks-y-dulces',
    description: 'Golosinas, galletas y aperitivos para picar entre horas.',
    sortOrder: 5,
  },
];

const products: Product[] = [
  // Alimentos Básicos
  {
    name: 'Harina P.A.N. 1kg',
    description: 'Harina de maíz blanco precocida para preparar arepas, empanadas y otros platos típicos venezolanos.',
    price: 3.50,
    brand: 'P.A.N.',
    tags: ['harina', 'arepas', 'cocina'],
    featured: true,
    stock: 45,
    categoryName: 'Alimentos Básicos',
  },
  {
    name: 'Aceite Ideal 1L',
    description: 'Aceite vegetal de alta calidad ideal para freír, cocinar y preparar tus comidas favoritas.',
    price: 4.25,
    brand: 'Ideal',
    tags: ['aceite', 'cocina', 'frituras'],
    featured: false,
    stock: 38,
    categoryName: 'Alimentos Básicos',
  },
  {
    name: 'Arroz Mary 1kg',
    description: 'Arroz de grano largo, blanco y suave, perfecto para acompañar cualquier plato.',
    price: 2.80,
    brand: 'Mary',
    tags: ['arroz', 'cocina', 'granos'],
    featured: false,
    stock: 50,
    categoryName: 'Alimentos Básicos',
  },
  {
    name: 'Azúcar Montalbán 1kg',
    description: 'Azúcar blanca refinada de alta pureza para endulzar tus bebidas y postres.',
    price: 2.50,
    brand: 'Montalbán',
    tags: ['azúcar', 'dulces', 'cocina'],
    featured: false,
    stock: 42,
    categoryName: 'Alimentos Básicos',
  },

  // Bebidas
  {
    name: 'Agua Minalba 1.5L',
    description: 'Agua purificada de manantial, ideal para mantener tu hidratación diaria.',
    price: 1.25,
    brand: 'Minalba',
    tags: ['agua', 'hidratación', 'bebida'],
    featured: false,
    stock: 50,
    categoryName: 'Bebidas',
  },
  {
    name: 'Pepsi 2L',
    description: 'Refresco de cola sabor original, perfecto para acompañar tus comidas y celebraciones.',
    price: 2.75,
    brand: 'Pepsi',
    tags: ['refresco', 'cola', 'bebida'],
    featured: true,
    stock: 30,
    categoryName: 'Bebidas',
  },
  {
    name: 'Jugo Yukery Naranja 1L',
    description: 'Jugo de naranja 100% natural, rico en vitaminas y sabor cítrico refrescante.',
    price: 3.25,
    brand: 'Yukery',
    tags: ['jugo', 'naranja', 'frutas'],
    featured: false,
    stock: 25,
    categoryName: 'Bebidas',
  },
  {
    name: 'Malta Regional 355ml',
    description: 'Malta premium con sabor único y refrescante, bebida tradicional venezolana.',
    price: 1.50,
    brand: 'Regional',
    tags: ['malta', 'malta', 'bebida'],
    featured: false,
    stock: 35,
    categoryName: 'Bebidas',
  },

  // Aseo del Hogar
  {
    name: 'Jabón Las Llaves 500g',
    description: 'Jabón en barra para lavado de ropa, elimina manchas difíciles y deja aroma fresco.',
    price: 2.25,
    brand: 'Las Llaves',
    tags: ['jabón', 'ropa', 'limpieza'],
    featured: false,
    stock: 40,
    categoryName: 'Aseo del Hogar',
  },
  {
    name: 'Cloro Nevex 1L',
    description: 'Cloro concentrado para desinfectar y blanquear superficies del hogar.',
    price: 1.80,
    brand: 'Nevex',
    tags: ['cloro', 'desinfectante', 'limpieza'],
    featured: false,
    stock: 32,
    categoryName: 'Aseo del Hogar',
  },
  {
    name: 'Esponja Scotch-Brite',
    description: 'Esponja multiusos con fibra resistente para limpiar utensilios de cocina y superficies.',
    price: 1.25,
    brand: 'Scotch-Brite',
    tags: ['esponja', 'cocina', 'limpieza'],
    featured: true,
    stock: 48,
    categoryName: 'Aseo del Hogar',
  },
  {
    name: 'Detergente Ariel 1kg',
    description: 'Detergente en polvo con fórmula concentrada que elimina las manchas más difíciles.',
    price: 5.50,
    brand: 'Ariel',
    tags: ['detergente', 'ropa', 'limpieza'],
    featured: false,
    stock: 28,
    categoryName: 'Aseo del Hogar',
  },

  // Aseo Personal
  {
    name: 'Jabón Dove 90g',
    description: 'Jabón de tocador con ¼ de crema hidratante, suaviza y nutre tu piel.',
    price: 2.75,
    brand: 'Dove',
    tags: ['jabón', 'piel', 'higiene'],
    featured: true,
    stock: 36,
    categoryName: 'Aseo Personal',
  },
  {
    name: 'Pasta Colgate 90g',
    description: 'Pasta dental con flúor para protección contra caries y encías sanas.',
    price: 3.25,
    brand: 'Colgate',
    tags: ['pasta', 'dental', 'higiene'],
    featured: false,
    stock: 44,
    categoryName: 'Aseo Personal',
  },
  {
    name: 'Shampoo Pantene 400ml',
    description: 'Shampoo reparador para todo tipo de cabello, deja el cabello suave y brillante.',
    price: 6.50,
    brand: 'Pantene',
    tags: ['shampoo', 'cabello', 'cuidado'],
    featured: false,
    stock: 22,
    categoryName: 'Aseo Personal',
  },
  {
    name: 'Desodorante Rexona 50ml',
    description: 'Desodorante antitranspirante con protección 48 horas contra el sudor.',
    price: 4.75,
    brand: 'Rexona',
    tags: ['desodorante', 'higiene', 'protección'],
    featured: true,
    stock: 30,
    categoryName: 'Aseo Personal',
  },

  // Snacks y Dulces
  {
    name: 'Tostones Margarita 100g',
    description: 'Tostones de plátano verde crujientes, snack tradicional venezolano perfecto para picar.',
    price: 1.75,
    brand: 'Margarita',
    tags: ['tostones', 'snack', 'plátano'],
    featured: true,
    stock: 45,
    categoryName: 'Snacks y Dulces',
  },
  {
    name: 'Chocoramo 40g',
    description: 'Galleta cubierta con chocolate, el snack más popular y delicioso de Venezuela.',
    price: 1.00,
    brand: 'Chocoramo',
    tags: ['galleta', 'chocolate', 'dulce'],
    featured: true,
    stock: 50,
    categoryName: 'Snacks y Dulces',
  },
  {
    name: 'Papelón Bello 500g',
    description: 'Papelón o panela venezolana, endulzante natural para preparar bebidas y postres.',
    price: 2.25,
    brand: 'Bello',
    tags: ['papelón', 'panela', 'endulzante'],
    featured: false,
    stock: 38,
    categoryName: 'Snacks y Dulces',
  },
  {
    name: 'Galletas Quaker 150g',
    description: 'Galletas de avena con chispas de chocolate, snack saludable y delicioso.',
    price: 3.50,
    brand: 'Quaker',
    tags: ['galletas', 'avena', 'snack'],
    featured: false,
    stock: 32,
    categoryName: 'Snacks y Dulces',
  },
];

async function checkExistingData(): Promise<boolean> {
  const count = await client.fetch<number>('count(*[_type == "product"])');
  return count > 0;
}

async function createCategories(): Promise<Map<string, string>> {
  const categoryMap = new Map<string, string>();

  for (const cat of categories) {
    const doc = await client.create({
      _type: 'category',
      name: cat.name,
      slug: { _type: 'slug', current: cat.slug },
      description: cat.description,
      sortOrder: cat.sortOrder,
    });
    categoryMap.set(cat.name, doc._id);
    console.log(`  ✓ Categoría creada: ${cat.name}`);
  }

  return categoryMap;
}

async function createProducts(categoryMap: Map<string, string>): Promise<void> {
  for (const prod of products) {
    const categoryId = categoryMap.get(prod.categoryName);
    if (!categoryId) {
      console.error(`  ✗ Categoría no encontrada: ${prod.categoryName}`);
      continue;
    }

    await client.create({
      _type: 'product',
      name: prod.name,
      slug: { _type: 'slug', current: prod.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') },
      description: prod.description,
      price: prod.price,
      category: { _type: 'reference', _ref: categoryId },
      stock: prod.stock,
      brand: prod.brand,
      tags: prod.tags,
      featured: prod.featured,
      isActive: true,
      createdAt: new Date().toISOString(),
    });
    console.log(`  ✓ Producto creado: ${prod.name}`);
  }
}

async function createAdminUser(): Promise<void> {
  const passwordHash = hashSync('admin123', 10);

  await client.create({
    _type: 'user',
    email: 'admin@tienda.com',
    name: 'Administrador',
    passwordHash,
    role: 'admin',
    createdAt: new Date().toISOString(),
  });
  console.log('  ✓ Usuario admin creado: admin@tienda.com');
}

async function createStoreSettings(): Promise<void> {
  await client.create({
    _type: 'storeSettings',
    storeName: 'Mi Tienda Venezolana',
    storeDescription: 'Tu tienda de productos venezolanos favorita. Ofrecemos los mejores productos del país a precios accesibles.',
    currency: 'USD',
    contactEmail: 'contacto@mitiendavenezolana.com',
    contactPhone: '+58 412-1234567',
    freeShippingThreshold: 50,
    flatShippingRate: 5,
  });
  console.log('  ✓ Configuración de tienda creada');
}

async function seed() {
  console.log('🌱 Iniciando seed de la base de datos...\n');

  const exists = await checkExistingData();
  if (exists) {
    console.error('⚠️  La base de datos ya contiene productos.');
    console.error('   Elimina los datos existentes antes de ejecutar el seed.');
    console.error('   O usa el flag --force para sobrescribir.');
    
    if (!process.argv.includes('--force')) {
      process.exit(1);
    }
    console.log('   Continuando con --force...\n');
  }

  try {
    console.log('📦 Creando categorías...');
    const categoryMap = await createCategories();
    console.log('');

    console.log('🛒 Creando productos...');
    await createProducts(categoryMap);
    console.log('');

    console.log('👤 Creando usuario administrador...');
    await createAdminUser();
    console.log('');

    console.log('⚙️  Creando configuración de tienda...');
    await createStoreSettings();
    console.log('');

    console.log('✅ Seed completado exitosamente!');
    console.log(`   • ${categories.length} categorías`);
    console.log(`   • ${products.length} productos`);
    console.log('   • 1 usuario admin (admin@tienda.com / admin123)');
    console.log('   • 1 configuración de tienda');
  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    process.exit(1);
  }
}

seed();
