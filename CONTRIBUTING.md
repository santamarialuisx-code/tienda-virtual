# Contribuir a Tienda Virtual

Gracias por tu interés en contribuir a Tienda Virtual. Este documento explica cómo empezar.

## Guía Rápida

1. **Fork** el repositorio
2. **Clone** tu fork: `git clone https://github.com/tu-usuario/tienda-virtual.git`
3. **Instalar** dependencias: `npm install`
4. **Configurar** variables de entorno: `cp .env.local.example .env.local`
5. **Crear** branch para tu cambios: `git checkout -b feature/tu-funcionalidad`
6. **Desarrollar** tus cambios
7. **Tests**: `npm test`
8. **Lint**: `npm run lint`
9. **Commit**: `git commit -m 'feat: descripción de tu cambio'`
10. **Push**: `git push origin feature/tu-funcionalidad`
11. **Pull Request**

## Convenciones de Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` nueva funcionalidad
- `fix:` corrección de bug
- `docs:` documentación
- `style:` formato (no afecta el código)
- `refactor:` refactorización
- `test:` agregar tests
- `chore:` tareas de mantenimiento

Ejemplos:
```bash
git commit -m 'feat: agregar filtro de precio en catálogo'
git commit -m 'fix: corregir cálculo de IVA en checkout'
git commit -m 'docs: actualizar README con instrucciones de deploy'
```

## Estructura de Carpetas

- `app/` - Páginas y rutas (Next.js App Router)
- `components/` - Componentes React reutilizables
- `lib/` - Utilidades, configuración, stores
- `sanity/` - Configuración y schemas de Sanity
- `tests/` - Tests unitarios y de integración

## Estilo de Código

- **TypeScript**: Todo debe tener tipos explícitos
- **Tailwind**: Usar utilidades de Tailwind, no CSS custom
- **Componentes**: Server components por defecto, `"use client"` solo cuando sea necesario
- **Naming**: PascalCase para componentes, camelCase para funciones/variables
- **Archivos**: Componentes en `components/`, páginas en `app/`

## Reglas Importantes

1. **No commitear** `.env.local` o cualquier secreto
2. **Siempre ejecutar** `npm run build` antes de PR
3. **Tests**: Agregar tests para nuevas funcionalidades
4. **Documentación**: Actualizar README si es necesario
5. **Accesibilidad**: Asegurar que los componentes sean accesibles

## Desarrollo Local

```bash
# Servidor de desarrollo
npm run dev

# Sanity Studio
npm run sanity:dev

# Tests
npm run test:watch

# Type check
npm run type-check
```

## Pull Requests

1. **Título descriptivo**: "feat: agregar filtro de categoría"
2. **Descripción**: Qué hiciste y por qué
3. **Screenshots**: Si cambia la UI
4. **Tests**: Incluir tests relevantes
5. **Build**: Asegurar que `npm run build` pasa

## Preguntas?

Abre un [GitHub Issue](https://github.com/tu-usuario/tienda-virtual/issues) con la etiqueta "question".
