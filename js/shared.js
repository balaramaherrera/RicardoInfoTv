/* =========================================================
   Funciones compartidas: tarjetas, escape de HTML, navegación
   ========================================================= */

function renderCard(item) {
  return `
    <article class="card" data-id="${item.id}">
      <div class="card-media"><img src="${item.image}" alt="${escapeHtml(item.title)}"></div>
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.description || "")}</p>
      <div class="source">${escapeHtml(item.source || "")}</div>
    </article>
  `;
}

function attachCardHandlers(container) {
  container.querySelectorAll("[data-id]").forEach(el => {
    el.style.cursor = "pointer";
    el.addEventListener("click", () => goToArticle(el.dataset.id));
  });
}

function goToArticle(id) {
  window.location.href = `articulo.html?id=${encodeURIComponent(id)}`;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
