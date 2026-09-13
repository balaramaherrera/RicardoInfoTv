/* =========================================================
   CONFIGURACIÓN
   ---------------------------------------------------------
   1. Regístrate gratis en https://gnews.io (u otra API) y
      copia tu API key aquí abajo.
   2. Mientras no tengas una key, el sitio funciona igual
      pero con noticias de ejemplo (MOCK), para que puedas
      trabajar en el diseño sin depender de la API.
   ========================================================= */

const CONFIG = {
  // Pega tu API key de GNews.io aquí (deja vacío para usar datos de ejemplo)
  GNEWS_API_KEY: "",

  // Endpoint base de GNews
  GNEWS_BASE_URL: "https://gnews.io/api/v4/search",

  // Idioma y país de las noticias
  LANG: "es",
  COUNTRY: "us",

  // Una sola búsqueda combinada: se pide UNA vez y se reparte entre
  // las secciones del sitio, para no chocar con el límite de
  // peticiones por segundo del plan gratuito de GNews.
  QUERY: "geopolítica OR relaciones internacionales OR banco central OR economía global",

  // Cuántos artículos pedir en total (se reparten entre las secciones)
  MAX_RESULTS: 10
};
