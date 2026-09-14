/* =========================================================
   Página de inicio — carga y pinta las secciones de noticias
   ========================================================= */

document.addEventListener("DOMContentLoaded", async () => {
  const section = document.body.dataset.section;

  if (section) {
    await loadSectionPage(section);
    return;
  }

  await loadAnalisis();
  await sleep(600);
  await loadBonoBanca();
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let analysisIndex = 0;
let analysisTimer = null;

async function loadAnalisis() {
  const grid = document.getElementById("analisis-grid");
  const status = document.getElementById("analisis-status");
  const previous = document.getElementById("analysis-prev");
  const next = document.getElementById("analysis-next");
  try {
    const items = await fetchNews("analisis");
    cacheArticles(items);
    status.textContent = "";
    grid.innerHTML = items.map(renderCard).join("");
    attachCardHandlers(grid);
    setupCardCarousel(items, grid, previous, next);
  } catch (e) {
    status.textContent = "No se pudieron cargar las noticias de esta sección.";
    status.classList.add("error");
  }
}

function setupCardCarousel(items, grid, previous, next) {
  analysisIndex = 0;
  const viewport = grid.parentElement;
  const getMaxIndex = () => {
    const firstCard = grid.firstElementChild;
    if (!firstCard) return 0;
    const step = firstCard.getBoundingClientRect().width + 16;
    const visibleCards = Math.max(1, Math.floor((viewport.clientWidth + 16) / step));
    return Math.max(0, items.length - visibleCards);
  };
  const update = () => {
    const firstCard = grid.firstElementChild;
    if (!firstCard) return;
    const gap = 16;
    const step = firstCard.getBoundingClientRect().width + gap;
    analysisIndex = Math.min(analysisIndex, getMaxIndex());
    grid.style.transform = `translateX(-${analysisIndex * step}px)`;
  };
  const move = (direction) => {
    const maxIndex = getMaxIndex();
    analysisIndex += direction;
    if (analysisIndex > maxIndex) analysisIndex = 0;
    if (analysisIndex < 0) analysisIndex = maxIndex;
    update();
    restartAnalysisTimer();
  };
  const restartAnalysisTimer = () => {
    window.clearInterval(analysisTimer);
    if (items.length > 1) analysisTimer = window.setInterval(() => move(1), 6500);
  };

  previous.disabled = items.length < 2;
  next.disabled = items.length < 2;
  previous.onclick = () => move(-1);
  next.onclick = () => move(1);
  window.addEventListener("resize", update);
  update();
  restartAnalysisTimer();
}

async function loadBonoBanca() {
  const grid = document.getElementById("bono-grid");
  const status = document.getElementById("bono-status");
  const previous = document.getElementById("bono-prev");
  const next = document.getElementById("bono-next");
  try {
    const items = await fetchNews("bono_banca");
    cacheArticles(items);
    status.textContent = "";
    grid.innerHTML = items.map(renderCard).join("");
    attachCardHandlers(grid);
    setupCardCarousel(items, grid, previous, next);
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