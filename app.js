let entries = [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let currentLang = localStorage.getItem("lang") || "fa";
let selectedCategory = "";

const searchInput = document.getElementById("search-input");
const categoryList = document.getElementById("category-list");
const entriesList = document.getElementById("entries-list");
const favoritesList = document.getElementById("favorites-list");
const langToggle = document.getElementById("lang-toggle");
const themeToggle = document.getElementById("theme-toggle");

async function loadEntries() {
  const response = await fetch("data/entries.json");
  entries = await response.json();
  updateTexts();
}

function renderCategories() {
  const uniqueCategories = [...new Set(entries.map(e => currentLang === "fa" ? e.category_fa : e.category_en))];
  categoryList.innerHTML = "";

  const allBtn = document.createElement("button");
  allBtn.className = "category-btn";
  allBtn.textContent = currentLang === "fa" ? "همه" : "All";
  allBtn.onclick = () => { selectedCategory = ""; renderEntries(); };
  categoryList.appendChild(allBtn);

  uniqueCategories.forEach(cat => {
    const btn = document.createElement("button");
    btn.className = "category-btn";
    btn.textContent = cat;
    btn.onclick = () => { selectedCategory = cat; renderEntries(); };
    categoryList.appendChild(btn);
  });
}

function renderEntries() {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = entries.filter(entry => {
    const title = currentLang === "fa" ? entry.title_fa : entry.title_en;
    const content = currentLang === "fa" ? entry.content_fa : entry.content_en;
    const category = currentLang === "fa" ? entry.category_fa : entry.category_en;
    const matchesSearch = title.toLowerCase().includes(query) || content.toLowerCase().includes(query) || entry.keywords.join(" ").toLowerCase().includes(query);
    const matchesCategory = !selectedCategory || category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  entriesList.innerHTML = filtered.map(entry => `
    <div class="entry-card">
      <h4>${currentLang === "fa" ? entry.title_fa : entry.title_en}</h4>
      <p><strong>${currentLang === "fa" ? "دسته:" : "Category:"}</strong> ${currentLang === "fa" ? entry.category_fa : entry.category_en}</p>
      <p>${currentLang === "fa" ? entry.content_fa : entry.content_en}</p>
      <div class="entry-actions">
        <button onclick="toggleFavorite(${entry.id})">
          ${favorites.includes(entry.id) ? (currentLang === "fa" ? "حذف از علاقه‌مندی" : "Remove Favorite") : (currentLang === "fa" ? "افزودن به علاقه‌مندی" : "Add Favorite")}
        </button>
      </div>
    </div>
  `).join("");
}

function toggleFavorite(id) {
  if (favorites.includes(id)) { favorites = favorites.filter(f => f !== id); }
  else { favorites.push(id); }
  localStorage.setItem("favorites", JSON.stringify(favorites));
  renderEntries();
  renderFavorites();
}

function renderFavorites() {
  const favEntries = entries.filter(entry => favorites.includes(entry.id));
  favoritesList.innerHTML = favEntries.map(entry => `
    <div class="entry-card">
      <h4>${currentLang === "fa" ? entry.title_fa : entry.title_en}</h4>
      <p>${currentLang === "fa" ? entry.content_fa : entry.content_en}</p>
    </div>
  `).join("");
  if (favEntries.length === 0) favoritesList.innerHTML = `<p>${currentLang === "fa" ? "هنوز چیزی ذخیره نشده است." : "No favorites yet."}</p>`;
}

function updateTexts() {
  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === "fa" ? "rtl" : "ltr";
  document.getElementById("hero-title").textContent = currentLang === "fa" ? "دانشنامه همراه شما" : "Your Pocket Encyclopedia";
  document.getElementById("hero-subtitle").textContent = currentLang === "fa" ? "جستجو در اطلاعات عمومی و مدخل‌های دانشنامه" : "Search general knowledge and encyclopedia entries";
  document.getElementById("category-title").textContent = currentLang === "fa" ? "دسته‌بندی‌ها" : "Categories";
  document.getElementById("results-title").textContent = currentLang === "fa" ? "مدخل‌ها" : "Entries";
  document.getElementById("favorites-title").textContent = currentLang === "fa" ? "علاقه‌مندی‌ها" : "Favorites";
  searchInput.placeholder = currentLang === "fa" ? "جستجو..." : "Search...";
  langToggle.textContent = currentLang === "fa" ? "EN" : "FA";
  renderCategories();
  renderEntries();
  renderFavorites();
}

langToggle.addEventListener("click", () => {
  currentLang = currentLang === "fa" ? "en" : "fa";
  localStorage.setItem("lang", currentLang);
  updateTexts();
});

themeToggle.addEventListener("click", () => document.body.classList.toggle("dark"));
searchInput.addEventListener("input", renderEntries);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("service-worker.js"));
}
loadEntries();
