/* =========================================================
   Página de inicio — carga y pinta las secciones de noticias
   Una sola llamada a la API; los resultados se reparten entre
   el hero, "Análisis y opinión" y "Bono y banca".
   ========================================================= */

document.addEventListener("DOMContentLoaded", async () => {
  const status1 = document.getElementById("analisis-status");
  const status2 = document.getElementById("bono-status");

  try {
    const items = await fetchAllNews();
    cacheArticles(items);

    const hero = items[0];
    const analisisItems = items.slice(1, 4);
    const bonoItems = items.slice(4, 7);
    const bonoFeature = items[7] || items[0];

    if (hero) renderHero(hero);

    if (analisisItems.length) {
      status1.textContent = "";
      document.getElementById("analisis-grid").innerHTML = analisisItems.map(renderCard).join("");
      attachCardHandlers(document.getElementById("analisis-grid"));
    } else {
      status1.textContent = "No hay suficientes noticias para esta sección todavía.";
    }

    if (bonoItems.length) {
      status2.textContent = "";
      document.getElementById("bono-list").innerHTML = bonoItems.map(renderListItem).join("");
      attachCardHandlers(document.getElementById("bono-list"));

      const feature = document.getElementById("bono-feature");
      feature.innerHTML = `<img src="${bonoFeature.image}" alt="${escapeHtml(bonoFeature.title)}">`;
      feature.onclick = () => goToArticle(bonoFeature.id);
      feature.style.cursor = "pointer";
    } else {
      status2.textContent = "No hay suficientes noticias para esta sección todavía.";
    }
  } catch (e) {
    console.error(e);
    status1.textContent = "No se pudieron cargar las noticias.";
    status1.classList.add("error");
  }
});

function renderHero(item) {
  const stage = document.getElementById("hero-stage");
  stage.innerHTML = `
    <img src="${item.image}" alt="${escapeHtml(item.title)}">
    <div class="hero-caption" id="hero-caption">
      <div class="eyebrow">Última hora</div>
      <h1>${escapeHtml(item.title)}</h1>
    </div>
  `;
  const caption = document.getElementById("hero-caption");
  caption.style.cursor = "pointer";
  caption.onclick = () => goToArticle(item.id);
}

function renderListItem(item) {
  return `
    <div class="list-item" data-id="${item.id}" style="cursor:pointer">
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.description || "")}</p>
    </div>
  `;
}
