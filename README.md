# Tienda Virtual

Tienda en línea desarrollada con Next.js 14+ y Sanity CMS, diseñada para el mercado venezolano con soporte para PayPal y PagoMóvil.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (strict mode)
- **CMS**: Sanity (Headless CMS)
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand
- **Auth**: NextAuth.js v5
- **Payments**: PayPal + PagoMóvil
- **Deployment**: Vercel

## Características

- Catálogo de productos con búsqueda y filtrado
- Carrito de compras persistente
- Checkout con PayPal y PagoMóvil
- Conversión de moneda en tiempo real (USD/BS)
- Autenticación de usuarios
- Panel de administración con Sanity Studio
- Diseño responsive mobile-first
- SEO optimizado

## Setup

### Requisitos

- Node.js 18+
- npm o yarn
- Cuenta de Sanity (free tier)
- Cuenta de PayPal (sandbox para desarrollo)

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/your-repo/tienda-virtual.git
cd tienda-virtual

# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.local.example .env.local

# Configurar variables de entorno en .env.local
# (ver sección siguiente)

# Iniciar desarrollo
npm run dev
```

### Variables de Entorno

Configura las siguientes variables en `.env.local`:

```env
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=tu_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=tu_token

# PayPal
NEXT_PUBLIC_PAYPAL_CLIENT_ID=tu_client_id
PAYPAL_CLIENT_SECRET=tu_client_secret

# NextAuth
NEXTAUTH_SECRET=tu_secret
NEXTAUTH_URL=http://localhost:3000
```

## Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Iniciar servidor de desarrollo |
| `npm run build` | Construir proyecto para producción |
| `npm run start` | Iniciar servidor de producción |
| `npm run lint` | Ejecutar linter |
| `npm run type-check` | Verificar tipos TypeScript |
| `npm run sanity:dev` | Iniciar Sanity Studio en desarrollo |
| `npm run sanity:build` | Construir Sanity Studio |

## Estructura del Proyecto

```
tienda-virtual/
├── app/                    # App Router pages
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Homepage
│   ├── products/           # Product pages
│   ├── categories/         # Category pages
│   ├── cart/               # Cart page
│   ├── checkout/           # Checkout flow
│   ├── auth/               # Authentication pages
│   ├── account/            # User account pages
│   └── api/                # API routes
├── components/             # React components
│   ├── ui/                 # shadcn/ui components
│   ├── layout/             # Layout components
│   ├── product/            # Product components
│   ├── cart/               # Cart components
│   └── auth/               # Auth components
├── lib/                    # Utilities and configs
│   ├── sanity/             # Sanity client and queries
│   └── utils.ts            # Utility functions
├── sanity/                 # Sanity configuration
│   ├── sanity.config.ts    # Sanity config
│   └── schemas/            # Sanity schemas
└── types/                  # TypeScript types
```

## Despliegue

### Vercel

1. Conecta el repositorio a Vercel
2. Configura las variables de entorno en Vercel
3. Despliega automáticamente en cada push a main

### Sanity Studio

El Sanity Studio estará disponible en `/admin` una vez desplegado.

## Licencia

MIT
