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

async function loadAnalisis() {
  const grid = document.getElementById("analisis-grid");
  const status = document.getElementById("analisis-status");
  const previous = document.getElementById("analysis-prev");
  const next = document.getElementById("analysis-next");
  try {
    const manualItems = window.ANALYSIS_CARDS?.enabled
      ? window.ANALYSIS_CARDS.items
      : [];
    const items = manualItems.length ? manualItems : await fetchNews("analisis");
    if (!items.length) throw new Error("Sin noticias de análisis");
    cacheArticles(items);
    status.textContent = "";
    grid.innerHTML = items.map(renderCard).join("");
    attachCardHandlers(grid);
    setupCardCarousel(items, grid, previous, next);
  } catch (e) {
    showSectionError(status, () => loadAnalisis());
  }
}

function setupCardCarousel(items, grid, previous, next) {
  let index = 0;
  let timer = null;
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
    index = Math.min(index, getMaxIndex());
    grid.style.transform = `translateX(-${index * step}px)`;
  };
  const move = (direction) => {
    const maxIndex = getMaxIndex();
    index += direction;
    if (index > maxIndex) index = 0;
    if (index < 0) index = maxIndex;
    update();
    restartTimer();
  };
  const restartTimer = () => {
    window.clearInterval(timer);
    if (items.length > 1) timer = window.setInterval(() => move(1), 6500);
  };

  previous.disabled = items.length < 2;
  next.disabled = items.length < 2;
  previous.onclick = () => move(-1);
  next.onclick = () => move(1);
  window.addEventListener("resize", update);
  update();
  restartTimer();
}

async function loadBonoBanca() {
  const grid = document.getElementById("bono-grid");
  const status = document.getElementById("bono-status");
  const previous = document.getElementById("bono-prev");
  const next = document.getElementById("bono-next");
  try {
    const items = await fetchNews("bono_banca");
    if (!items.length) throw new Error("Sin noticias de banca");
    cacheArticles(items);
    status.textContent = "";
    grid.innerHTML = items.map(renderCard).join("");
    attachCardHandlers(grid);
    setupCardCarousel(items, grid, previous, next);
  } catch (e) {
    showSectionError(status, () => loadBonoBanca());
  }
}

async function loadSectionPage(sectionKey) {
  const grid = document.getElementById(`${sectionKey}-grid`);
  if (!grid) return;

  const status = document.getElementById(`${sectionKey}-status`);
  try {
    const items = await fetchNews(sectionKey);
    if (!items.length) throw new Error(`Sin noticias para ${sectionKey}`);
    cacheArticles(items);
    if (status) status.textContent = "";
    grid.innerHTML = items.map(renderCard).join("");
    attachCardHandlers(grid);
  } catch (e) {
    if (status) showSectionError(status, () => loadSectionPage(sectionKey));
  }
}

function showSectionError(status, retry) {
  if (!status) return;
  status.classList.add("error");
  status.innerHTML = "No hay noticias disponibles en este momento. " +
    '<button type="button" class="retry-button">Reintentar</button>';
  status.querySelector(".retry-button").addEventListener("click", retry, { once: true });
}

function renderListItem(item) {
  return `
    <div class="list-item" data-id="${item.id}" style="cursor:pointer">
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.description || "")}</p>
    </div>
  `;
}