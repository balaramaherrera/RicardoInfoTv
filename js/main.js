/* =========================================================
   Página de inicio — carga y pinta las secciones de noticias
   ========================================================= */

document.addEventListener("DOMContentLoaded", async () => {
  const section = document.body.dataset.section;

  if (section) {
    await loadSectionPage(section);
    return;
  }

  // Una petición a la vez, con una pequeña pausa entre cada una,
  // para no disparar el límite de peticiones por segundo de la API.
  await loadHero();
  await sleep(600);
  await loadAnalisis();
  await sleep(600);
  await loadBonoBanca();
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function loadHero() {
  const stage = document.getElementById("hero-stage");
  const caption = document.getElementById("hero-caption");
  try {
    const items = await fetchNews("portada");
    if (!items.length) return;
    cacheArticles(items);
    const top = items[0];

    stage.innerHTML = `<img src="${top.image}" alt="${escapeHtml(top.title)}">` + caption.outerHTML;
    const newCaption = stage.querySelector("#hero-caption");
    newCaption.innerHTML = `
      <div class="eyebrow">Última hora</div>
      <h1>${escapeHtml(top.title)}</h1>
    `;
    newCaption.onclick = () => goToArticle(top.id);
    newCaption.style.cursor = "pointer";
  } catch (e) {
    console.error(e);
  }
}

async function loadAnalisis() {
  const grid = document.getElementById("analisis-grid");
  const status = document.getElementById("analisis-status");
  try {
    const items = await fetchNews("analisis");
    cacheArticles(items);
    status.textContent = "";
    grid.innerHTML = items.slice(0, 3).map(renderCard).join("");
    attachCardHandlers(grid);
  } catch (e) {
    status.textContent = "No se pudieron cargar las noticias de esta sección.";
    status.classList.add("error");
  }
}

async function loadBonoBanca() {
  const list = document.getElementById("bono-list");
  const feature = document.getElementById("bono-feature");
  const status = document.getElementById("bono-status");
  try {
    const items = await fetchNews("bono_banca");
    cacheArticles(items);
    status.textContent = "";

    list.innerHTML = items.slice(0, 3).map(renderListItem).join("");
    attachCardHandlers(list);

    if (items[0]) {
      feature.innerHTML = `<img src="${items[0].image}" alt="${escapeHtml(items[0].title)}">`;
      feature.onclick = () => goToArticle(items[0].id);
      feature.style.cursor = "pointer";
    }
  } catch (e) {
    status.textContent = "No se pudieron cargar las noticias de esta sección.";
    status.classList.add("error");
  }
}

async function loadSectionPage(sectionKey) {
  const grid = document.getElementById(`${sectionKey}-grid`);
  if (!grid) return;

  const status = document.getElementById(`${sectionKey}-status`);
  try {
    const items = await fetchNews(sectionKey);
    cacheArticles(items);
    if (status) status.textContent = "";
    grid.innerHTML = items.map(renderCard).join("");
    attachCardHandlers(grid);
  } catch (e) {
    if (status) {
      status.textContent = "No se pudieron cargar las noticias de esta sección.";
      status.classList.add("error");
    }
  }
}

function renderListItem(item) {
  return `
    <div class="list-item" data-id="${item.id}" style="cursor:pointer">
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.description || "")}</p>
    </div>
  `;
}