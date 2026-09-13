# Riesdorinfoty — sitio de noticias de geopolítica

Sitio estático (HTML/CSS/JS puro, sin frameworks) basado en tu diseño de Figma.
No necesita Node.js: se abre directamente en el navegador o con Live Server.

## Estructura
```
noticias-geo/
├── index.html        → Página de inicio (hero + secciones)
├── articulo.html      → Plantilla de artículo individual
├── css/style.css      → Todos los estilos
└── js/
    ├── config.js       → Aquí pegas tu API key
    ├── api.js          → Conexión a la API + datos de ejemplo
    ├── shared.js        → Funciones compartidas (tarjetas, navegación)
    ├── main.js          → Lógica de la página de inicio
    └── article.js       → Lógica de la página de artículo
```

## Cómo probarlo ya mismo
1. Abre la carpeta `noticias-geo` en VS Code.
2. Clic derecho en `index.html` → **"Open with Live Server"**
   (o simplemente doble clic en el archivo para abrirlo en el navegador).
3. Verás el sitio funcionando con **noticias de ejemplo** (no necesitas
   API key todavía).

## Cómo conectar noticias reales
1. Crea una cuenta gratis en https://gnews.io (plan gratuito: 100
   peticiones/día, suficiente para desarrollo).
2. Copia tu API key.
3. Ábre `js/config.js` y pégala aquí:
   ```js
   GNEWS_API_KEY: "TU_API_KEY_AQUI",
   ```
4. Recarga la página — ahora debería traer noticias reales según los
   términos de búsqueda definidos en `SECTIONS` (puedes ajustarlos).

> Si en algún momento quieres cambiar de API (NewsAPI, Mediastack, etc.)
> solo hay que tocar la función `fetchNews()` en `js/api.js` — el resto
> del sitio no necesita cambios porque todos consumen el mismo formato
> interno (`title`, `description`, `image`, `source`, `content`...).

## Publicarlo en internet
Sube la carpeta a GitHub y conéctala a **Netlify** o **Vercel** (ambos
gratis) — al ser un sitio 100% estático, el despliegue es automático,
sin configuración adicional.

## Siguientes pasos sugeridos
- Ajustar los términos de búsqueda de `config.js` para afinar qué
  noticias aparecen en cada sección.
- Reemplazar el logo de texto por tu logo real (agrégalo en `assets/`).
- Si más adelante quieres más de 3 categorías o paginación, se puede
  extender fácilmente el mismo patrón de `fetchNews()`.
