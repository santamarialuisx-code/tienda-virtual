# Variables de Entorno - Guía Completa

## Resumen

| Variable | Requerida | Cliente | Descripción |
|----------|-----------|---------|-------------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | ✅ | Sí | ID del proyecto Sanity |
| `NEXT_PUBLIC_SANITY_DATASET` | ✅ | Sí | Dataset de Sanity |
| `SANITY_API_READ_TOKEN` | ✅ | No | Token de API de Sanity |
| `NEXT_PUBLIC_PAYPAL_CLIENT_ID` | ✅ | Sí | Client ID de PayPal |
| `PAYPAL_CLIENT_SECRET` | ✅ | No | Secret de PayPal |
| `NEXTAUTH_SECRET` | ✅ | No | Secreto para JWT |
| `NEXTAUTH_URL` | ✅ | No | URL de la app |
| `NEXT_PUBLIC_BASE_URL` | ❌ | Sí | URL base para SEO |
| `PAGOMOVIL_BANK` | ❌ | No | Banco para PagoMóvil |
| `PAGOMOVIL_PHONE` | ❌ | No | Teléfono para PagoMóvil |

---

## Sanity Configuration

### `NEXT_PUBLIC_SANITY_PROJECT_ID`

**Requerida**: Sí  
**Cliente**: Sí (exposta al navegador)  
**Descripción**: ID único de tu proyecto en Sanity.

**Cómo obtenerlo**:
1. Ve a [sanity.io/manage](https://www.sanity.io/manage)
2. Selecciona tu proyecto
3. Ve a **Settings > General**
4. Copia el **Project ID**

**Ejemplo**: `abc123xyz`

---

### `NEXT_PUBLIC_SANITY_DATASET`

**Requerida**: Sí  
**Cliente**: Sí  
**Descripción**: Nombre del dataset donde están tus datos.

**Valor por defecto**: `production`

**Cómo obtenerlo**:
1. Ve a [sanity.io/manage](https://www.sanity.io/manage)
2. Selecciona tu proyecto
3. Ve a **Datasets**
4. Copia el nombre del dataset

**Ejemplo**: `production`

---

### `SANITY_API_READ_TOKEN`

**Requerida**: Sí  
**Cliente**: No (solo servidor)  
**Descripción**: Token de API para consultas de Sanity desde el servidor.

**Cómo obtenerlo**:
1. Ve a [sanity.io/manage](https://www.sanity.io/manage)
2. Selecciona tu proyecto
3. Ve to **API > Tokens**
4. Haz clic en **Add new token**
5. Selecciona **Read**
6. Copia el token generado

**Ejemplo**: `skXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`

**⚠️ Importante**: Nunca expongas este token al cliente.

---

## PayPal Configuration

### `NEXT_PUBLIC_PAYPAL_CLIENT_ID`

**Requerida**: Sí  
**Cliente**: Sí  
**Descripción**: Client ID de tu aplicación PayPal.

**Cómo obtenerlo**:
1. Ve a [developer.paypal.com](https://developer.paypal.com)
2. Inicia sesión con tu cuenta PayPal
3. Ve a **My Apps & Credentials**
4. Selecciona **Sandbox** (para pruebas) o **Live** (para producción)
5. Crea una nueva aplicación o selecciona una existente
6. Copia el **Client ID**

**Ejemplo**: `AeAXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`

**Ambientes**:
- **Sandbox**: Para pruebas (usa credenciales de sandbox)
- **Live**: Para producción (usa credenciales de producción)

---

### `PAYPAL_CLIENT_SECRET`

**Requerida**: Sí  
**Cliente**: No (solo servidor)  
**Descripción**: Secret key de tu aplicación PayPal.

**Cómo obtenerlo**:
1. Sigue los mismos pasos que `NEXT_PUBLIC_PAYPAL_CLIENT_ID`
2. Haz clic en **Show** junto a **Secret**
3. Copia el secret

**Ejemplo**: `EGXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`

**⚠️ Importante**: Nunca expongas este token al cliente.

---

## NextAuth.js Configuration

### `NEXTAUTH_SECRET`

**Requerida**: Sí  
**Cliente**: No (solo servidor)  
**Descripción**: Secreto usado para firmar tokens JWT.

**Cómo generarlo**:

```bash
# En terminal
openssl rand -base64 32

# O con Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Ejemplo**: `tu-secreto-super-seguro-aqui-1234567890`

**⚠️ Importante**: Nunca cambies este secret después de producción, o todas las sesiones se invalidarán.

---

### `NEXTAUTH_URL`

**Requerida**: Sí  
**Cliente**: No (solo servidor)  
**Descripción**: URL base de tu aplicación.

**Desarrollo**: `http://localhost:3000`  
**Producción**: `https://tu-dominio.com`

**⚠️ Importante**: Debe coincidir exactamente con la URL donde está desplegada tu app.

---

## Optional Variables

### `NEXT_PUBLIC_BASE_URL`

**Requerida**: No  
**Cliente**: Sí  
**Descripción**: URL base para SEO (sitemap, robots.txt, OpenGraph).

**Valor por defecto**: `https://tienda-virtual.vercel.app`

**Ejemplo**: `https://tutienda.com`

---

### `PAGOMOVIL_BANK`

**Requerida**: No  
**Cliente**: No  
**Descripción**: Nombre del banco para PagoMóvil.

**Valor por defecto**: `Banco de Venezuela`

**Ejemplo**: `Banco de Venezuela`

---

### `PAGOMOVIL_PHONE`

**Requerida**: No  
**Cliente**: No  
**Descripción**: Número de teléfono para recibir PagoMóvil.

**Ejemplo**: `04121234567`

---

## Archivos de Configuración

### `.env.local` (Desarrollo Local)

```bash
# Copiar desde el ejemplo
cp .env.local.example .env.local

# Editar con tus valores
nano .env.local
```

### `.env.production` (Producción - Vercel)

Configurar en el dashboard de Vercel:
1. Ve a **Settings > Environment Variables**
2. Agrega cada variable
3. Selecciona el ambiente (Production, Preview, Development)

---

## Seguridad

### ✅ Buenas Prácticas

1. **Nunca commitear** `.env.local` o `.env.production`
2. **Usar** `.env.local.example` como plantilla
3. **Rotar** secrets periódicamente en producción
4. **Usar** diferentes credenciales para sandbox y producción

### ❌ Malas Prácticas

1. **No** exponer `SANITY_API_READ_TOKEN` al cliente
2. **No** exponer `PAYPAL_CLIENT_SECRET` al cliente
3. **No** usar el mismo `NEXTAUTH_SECRET` en diferentes ambientes
4. **No** hardcodear valores en el código

---

## Troubleshooting

### Error: "Missing environment variable"

1. Verifica que la variable esté en `.env.local`
2. Reinicia el servidor de desarrollo: `npm run dev`
3. Verifica que el nombre de la variable es correcto

### Error: "NEXTAUTH_URL mismatch"

1. Verifica que `NEXTAUTH_URL` coincide con la URL de tu app
2. En producción, usa HTTPS
3. No incluir `/` al final

### Error: "Sanity API error"

1. Verifica que `NEXT_PUBLIC_SANITY_PROJECT_ID` es correcto
2. Verifica que `SANITY_API_READ_TOKEN` tiene permisos
3. Verifica que el dataset existe

### Error: "PayPal error"

1. Verifica que estás usando las credenciales del ambiente correcto
2. Sandbox para desarrollo, Live para producción
3. Verifica que `PAYPAL_CLIENT_SECRET` corresponde a `NEXT_PUBLIC_PAYPAL_CLIENT_ID`
