# Guía de Despliegue - Tienda Virtual

## Despliegue en Vercel (Recomendado)

### 1. Preparar el Repositorio

```bash
# Asegurar que todo está commiteado
git add .
git commit -m "chore: preparar para despliegue"
git push origin main
```

### 2. Conectar con Vercel

1. Ve a [vercel.com/new](https://vercel.com/new)
2. Selecciona "Import Git Repository"
3. Selecciona tu repositorio de GitHub
4. Vercel detectará automáticamente Next.js

### 3. Configurar Variables de Entorno

En el dashboard de Vercel:

1. Ve a **Settings > Environment Variables**
2. Agrega cada variable:

| Variable | Valor | Ambiente |
|----------|-------|----------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Tu project ID de Sanity | Production, Preview |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` | Production, Preview |
| `SANITY_API_READ_TOKEN` | Tu token de Sanity | Production, Preview |
| `NEXT_PUBLIC_PAYPAL_CLIENT_ID` | Tu Client ID de PayPal | Production, Preview |
| `PAYPAL_CLIENT_SECRET` | Tu Secret de PayPal | Production, Preview |
| `NEXTAUTH_SECRET` | Secreto aleatorio | Production, Preview |
| `NEXTAUTH_URL` | `https://tu-dominio.vercel.app` | Production |
| `NEXT_PUBLIC_BASE_URL` | `https://tu-dominio.vercel.app` | Production |

### 4. Configuración del Build

Vercel debería detectar automáticamente:
- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### 5. Dominio Personalizado

1. Ve a **Settings > Domains**
2. Agrega tu dominio
3. Configura los registros DNS:
   - **Tipo**: CNAME
   - **Nombre**: `@` o tu subdominio
   - **Value**: `cname.vercel-dns.com`

### 6. Preview Deployments

Cada PR automáticamente recibe un deployment de preview:
- URL: `https://tu-proyecto-git-branch.vercel.app`
- Variables de entorno: Usa las de Preview

## Despliegue Manual (VPS/Dedicado)

### 1. Requisitos

- Node.js 18+ instalado
- npm 9+ instalado
- Acceso SSH al servidor

### 2. Instalar Dependencias del Sistema

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install -y nodejs npm

# CentOS/RHEL
sudo yum install -y nodejs npm
```

### 3. Clonar y Construir

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/tienda-virtual.git
cd tienda-virtual

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.local.example .env.local
nano .env.local  # Editar con tus valores

# Construir
npm run build
```

### 4. Ejecutar con PM2

```bash
# Instalar PM2 globalmente
npm install -g pm2

# Iniciar la aplicación
pm2 start npm --name "tienda-virtual" -- start

# Guardar configuración de PM2
pm2 save

# Iniciar PM2 en el arranque del sistema
pm2 startup
```

### 5. Configurar Nginx (Recomendado)

```nginx
server {
    listen 80;
    server_name tu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 6. SSL con Certbot

```bash
# Instalar Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtener certificado
sudo certbot --nginx -d tu-dominio.com

# Auto-renovación
sudo crontab -e
# Agregar: 0 12 * * * /usr/bin/certbot renew --quiet
```

## Variables de Entorno para Producción

### Sanity

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=abc123xyz
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=skXXXXXXXXXXXXX
```

### PayPal

```bash
NEXT_PUBLIC_PAYPAL_CLIENT_ID=AeAXXXXXXXXXXX
PAYPAL_CLIENT_SECRET=EGXXXXXXXXXXXXXXXX
```

### NextAuth

```bash
NEXTAUTH_SECRET=tu-secreto-super-seguro-aqui
NEXTAUTH_URL=https://tu-dominio.com
```

### Base URL (SEO)

```bash
NEXT_PUBLIC_BASE_URL=https://tu-dominio.com
```

## Verificación Post-Deploy

1. **Homepage**: `https://tu-dominio.com`
2. **Productos**: `https://tu-dominio.com/products`
3. **Categorías**: `https://tu-dominio.com/categories`
4. **Auth**: `https://tu-dominio.com/auth/login`
5. **Admin**: `https://tu-dominio.com/admin`
6. **API**: `https://tu-dominio.com/api/health`

## Troubleshooting

### Build Fails

```bash
# Verificar tipos
npm run type-check

# Verificar lint
npm run lint

# Build limpio
rm -rf .next node_modules
npm install
npm run build
```

### Errores de Sanity

1. Verificar que el proyecto existe
2. Verificar que el token tiene permisos de lectura
3. Verificar que el dataset es correcto

### Errores de PayPal

1. Verificar Client ID y Secret
2. Verificar que estás usando los credenciales correctos (sandbox vs production)
3. Verificar la configuración de webhooks

## Monitoreo

### Vercel

- **Analytics**: Habilitar en Settings > Analytics
- **Speed Insights**: Habilitar en Settings > Speed Insights
- **Logs**: Ver en dashboard > Deployments > Logs

### Application Performance

```bash
# Verificar logs de PM2
pm2 logs tienda-virtual

# Monitorear recursos
pm2 monit
```

## Backup

### Sanity

- Los datos están en Sanity Cloud
- Exportar desde Sanity Management: `sanity dataset export`

### Base de Datos

- Si usas una base de datos externa, configurar backups automáticos
- Recomendado: backups diarios con retención de 30 días
