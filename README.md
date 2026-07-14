# Tienda Virtual 🛒

Una tienda en línea completa para Venezuela, construida con Next.js 16, Sanity CMS, PayPal y PagoMóvil.

## Características Principales

- **Catálogo de Productos**: Listado, búsqueda, filtros, categorías y detalle de productos
- **Carrito de Compras**: Persistencia con localStorage, cantidades, resumen con precios en USD y Bs.
- **Checkout**: PayPal (automático) y PagoMóvil (confirmación manual)
- **Autenticación**: NextAuth.js v5 con registro, login y roles (admin/usuario)
- **Panel de Administración**: Sanity Studio personalizado para gestionar productos, pedidos y usuarios
- **Responsive Design**: Optimizado para móvil, tablet y desktop
- **SEO**: Metadatos OpenGraph, Twitter Cards, sitemap.xml, robots.txt
- **Accesibilidad**: Navegación por teclado, ARIA labels, skip-to-content

## Tech Stack

| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| Next.js | 16.x | Framework React con App Router |
| React | 19.x | UI Library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.x | Utility-first CSS |
| Sanity | 6.x | Headless CMS |
| NextAuth.js | 5.x | Autenticación |
| Zustand | 5.x | State management |
| PayPal SDK | 10.x | Pagos |
| Zod | 4.x | Validación |

## Requisitos Previos

- Node.js 18+ (recomendado: 20 LTS)
- npm 9+ o yarn 1.22+ o pnpm 8+
- Cuenta de Sanity (free tier disponible)
- Cuenta de PayPal Developer (sandbox para pruebas)

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/tienda-virtual.git
cd tienda-virtual
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

```bash
cp .env.local.example .env.local
```

Edita `.env.local` con tus valores. Ver [Variables de Entorno](#variables-de-entorno) para más detalles.

### 4. Configurar Sanity

```bash
# Inicializar Sanity (si no existe el proyecto)
npx sanity@latest init

# O usar el proyecto existente
npx sanity dev
```

El estudio de Sanity estará disponible en `http://localhost:3333`.

### 5. Ejecutar en desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`.

## Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Iniciar servidor de desarrollo |
| `npm run build` | Construir para producción |
| `npm start` | Iniciar servidor de producción |
| `npm run lint` | Ejecutar ESLint |
| `npm test` | Ejecutar tests con Vitest |
| `npm run type-check` | Verificar tipos TypeScript |
| `npm run sanity:dev` | Iniciar Sanity Studio en desarrollo |
| `npm run sanity:build` | Construir Sanity Studio |

## Variables de Entorno

### Requeridas

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | ID del proyecto Sanity | `abc123` |
| `NEXT_PUBLIC_SANITY_DATASET` | Dataset de Sanity | `production` |
| `SANITY_API_READ_TOKEN` | Token de API de Sanity | `sk...` |
| `NEXT_PUBLIC_PAYPAL_CLIENT_ID` | Client ID de PayPal | `AeA...` |
| `PAYPAL_CLIENT_SECRET` | Secret de PayPal | `EG...` |
| `NEXTAUTH_SECRET` | Secreto para JWT | `tu-secreto-random` |
| `NEXTAUTH_URL` | URL de tu app | `http://localhost:3000` |

### Opcionales

| Variable | Descripción | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_BASE_URL` | URL base para SEO | `https://tienda-virtual.vercel.app` |
| `PAGOMOVIL_BANK` | Banco para PagoMóvil | `Banco de Venezuela` |
| `PAGOMOVIL_PHONE` | Teléfono para PagoMóvil | `04121234567` |

## Estructura del Proyecto

```
tienda-virtual/
├── app/                    # Next.js App Router
│   ├── about/             # Página Nosotros
│   ├── account/           # Cuenta de usuario (protegido)
│   ├── admin/             # Panel de administración
│   ├── api/               # API routes
│   ├── auth/              # Login y registro
│   ├── cart/              # Carrito de compras
│   ├── categories/        # Categorías de productos
│   ├── checkout/          # Checkout y pagos
│   ├── orders/            # Historial de pedidos
│   ├── products/          # Catálogo de productos
│   ├── search/            # Búsqueda
│   ├── layout.tsx         # Layout raíz
│   ├── page.tsx           # Homepage
│   ├── globals.css        # Estilos globales
│   ├── not-found.tsx      # Página 404
│   ├── error.tsx          # Error boundary global
│   ├── loading.tsx        # Loading state global
│   ├── robots.ts          # Robots.txt
│   └── sitemap.ts         # Sitemap XML
├── components/            # Componentes React
│   ├── auth/              # Componentes de autenticación
│   ├── cart/              # Componentes del carrito
│   ├── checkout/          # Componentes de checkout
│   ├── layout/            # Header, Footer, MobileNav
│   ├── product/           # Componentes de productos
│   ├── search/            # Componentes de búsqueda
│   └── ui/                # Componentes UI (shadcn)
├── lib/                   # Utilidades y configuración
│   ├── auth/              # Configuración de NextAuth
│   ├── sanity/            # Cliente y queries de Sanity
│   ├── store/             # Zustand stores
│   ├── currency.ts        # Formateo de monedas
│   └── validation.ts      # Schemas de validación
├── sanity/                # Configuración de Sanity
│   ├── schemas/           # Schemas de Sanity
│   ├── components/        # Componentes personalizados
│   └── sanity.config.ts   # Configuración principal
├── public/                # Archivos estáticos
├── tests/                 # Tests
├── middleware.ts          # Middleware de Next.js
├── next.config.ts        # Configuración de Next.js
├── tailwind.config.ts    # Configuración de Tailwind
├── vercel.json           # Configuración de Vercel
└── package.json          # Dependencias
```

## Despliegue

### Vercel (Recomendado)

1. **Conectar repositorio**:
   - Ve a [vercel.com/new](https://vercel.com/new)
   - Importa tu repositorio de GitHub

2. **Configurar variables de entorno**:
   - En el dashboard de Vercel, ve a Settings > Environment Variables
   - Agrega todas las variables de `.env.local`

3. **Deploy**:
   - Vercel detectará automáticamente Next.js
   - El build se ejecutará automáticamente en cada push

4. **Dominio personalizado** (opcional):
   - Ve a Settings > Domains
   - Agrega tu dominio y configura DNS

### Deploy Manual

```bash
# Construir
npm run build

# Iniciar servidor de producción
npm start
```

## Flujos de Usuario

### Compra
1. Explorar productos → `/products`
2. Ver detalle → `/products/[slug]`
3. Agregar al carrito → Carrito se actualiza
4. Proceder al checkout → `/checkout`
5. Seleccionar pago (PayPal/PagoMóvil)
6. Completar pago
7. Ver confirmación → `/checkout/success`

### Administración
1. Login → `/auth/login`
2. Acceder al admin → `/admin`
3. Gestionar productos, categorías, pedidos
4. Ver métricas del dashboard

## Testing

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch
npm run test:watch

# Verificar tipos
npm run type-check

# Lint
npm run lint

# Build completo (verifica todo)
npm run build
```

## Contribuir

1. Fork el proyecto
2. Crear branch (`git checkout -b feature/nueva-funcionalidad`)
3. Commit (`git commit -m 'Add nueva funcionalidad'`)
4. Push (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

## Documentación Adicional

- [Guía de Despliegue](DEPLOYMENT.md) - Instrucciones detalladas para desplegar en Vercel o servidor propio
- [Variables de Entorno](ENVIRONMENT.md) - Guía completa de todas las variables de entorno
- [Contribuir](CONTRIBUTING.md) - Cómo contribuir al proyecto

## Licencia

MIT License - ver [LICENSE](LICENSE) para detalles.

## Soporte

- **Issues**: [GitHub Issues](https://github.com/tu-usuario/tienda-virtual/issues)
- **Email**: info@tiendavirtual.com
