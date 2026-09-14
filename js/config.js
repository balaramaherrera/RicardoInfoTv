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

  // Términos de búsqueda por sección de tu sitio
  SECTIONS: {
    portada:        "geopolítica OR relaciones internacionales",
    analisis:       "análisis geopolítico OR opinión internacional",
    bono_banca:      "banco central OR bonos OR política monetaria",
    cultura_economia: "cultura OR economía global"
  },

  // Cuántos artículos pedir por sección
  MAX_RESULTS: 6
};
