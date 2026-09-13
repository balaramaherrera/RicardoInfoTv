/* =========================================================
   Página de artículo — lee el id de la URL y pinta el contenido
   ========================================================= */

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  let article = id ? getCachedArticle(id) : null;

  // Si alguien entra directo al link sin pasar por el home, no hay caché:
  // cargamos noticias de portada y tomamos la primera como respaldo.
  if (!article) {
    const fallback = await fetchNews("portada");
    cacheArticles(fallback);
    article = fallback[0];
  }

  if (!article) {
    document.getElementById("article-root").innerHTML =
      `<div class="wrap status-msg error">No se encontró el artículo.</div>`;
    return;
  }

  renderArticle(article);
  loadRelated(article);
});

function renderArticle(a) {
  document.title = `${a.title} — Riesdorinfoty`;

  document.getElementById("art-eyebrow").textContent = sectionLabel(a.category);
  document.getElementById("art-title").textContent = a.title;
  document.getElementById("art-sub").textContent = a.description || "";
  document.getElementById("art-source").textContent = a.source || "";
  document.getElementById("art-date").textContent = formatDate(a.publishedAt);

  const media = document.getElementById("art-media");
  media.innerHTML = `<img src="${a.image}" alt="${escapeHtml(a.title)}">`;

  const body = document.getElementById("art-body");
  const paragraphs = (a.content || a.description || "")
    .split("\n")
    .filter(p => p.trim().length);
  body.innerHTML = paragraphs.map(p => `<p>${escapeHtml(p)}</p>`).join("");
}

async function loadRelated(current) {
  const grid = document.getElementById("related-grid");
  try {
    const items = await fetchNews(current.category === "bono_banca" ? "bono_banca" : "analisis");
    cacheArticles(items);
    const others = items.filter(i => i.id !== current.id).slice(0, 3);
    grid.innerHTML = others.map(renderCard).join("");
    attachCardHandlers(grid);
  } catch (e) {
    grid.innerHTML = "";
  }
}

function sectionLabel(cat) {
  const labels = {
    analisis: "Análisis y opinión",
    bono_banca: "Bono y banca",
    portada: "Geopolítica"
  };
  return labels[cat] || "Geopolítica";
}

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
}
