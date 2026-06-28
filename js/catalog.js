const gamesContainer = document.getElementById("gamesContainer");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const sortSelect = document.getElementById("sortSelect");
const catalogCount = document.getElementById("catalogCount");
const noResults = document.getElementById("noResults");
const downloadPdfBtn = document.getElementById("downloadPdfBtn");

let currentGames = [];

function readCategoryFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const category = params.get("kategorija");

    if (category) {
        categoryFilter.value = category;
    }
}

function renderGames(gamesToRender) {
    gamesContainer.innerHTML = "";

    if (gamesToRender.length === 0) {
        noResults.classList.remove("d-none");
        catalogCount.textContent = "Prikazano 0 igara.";
        return;
    }

    noResults.classList.add("d-none");
    catalogCount.textContent = "Prikazano " + gamesToRender.length + " igara.";

    gamesToRender.forEach(function(game) {
        const gameCard = document.createElement("div");
        gameCard.className = "col-md-6 col-lg-4";

        gameCard.innerHTML = `
            <div class="game-card">
                <div class="game-image-placeholder">
                    ${game.name}
                </div>

                <div class="game-card-body">
                    <span class="category-pill">${game.categoryName}</span>
                    <h3>${game.name}</h3>

                    <p>${game.description}</p>

                    <ul class="game-info-list">
                        <li><strong>Broj igrača:</strong> ${game.players}</li>
                        <li><strong>Uzrast:</strong> ${game.age}</li>
                        <li><strong>Trajanje:</strong> ${game.duration}</li>
                        <li><strong>Ocena:</strong> ${game.rating}</li>
                    </ul>

                    <p class="price">${formatPrice(game.price)}</p>

                    <div class="game-card-actions">
                        <a href="igra.html?id=${game.id}" class="btn btn-small-custom">Detalji</a>
                        <button class="btn btn-cart-small" onclick="quickAddToCart('${game.id}')">
                            Dodaj u korpu
                        </button>
                    </div>
                </div>
            </div>
        `;

        gamesContainer.appendChild(gameCard);
    });
}

function applyFiltersAndSort() {
    const searchText = searchInput.value.toLowerCase().trim();
    const selectedCategory = categoryFilter.value;
    const selectedSort = sortSelect.value;

    let filteredGames = getGamesByCategory(selectedCategory);

    if (searchText !== "") {
        filteredGames = filteredGames.filter(function(game) {
            return game.name.toLowerCase().includes(searchText);
        });
    }

    if (selectedSort === "name-asc") {
        filteredGames.sort(function(a, b) {
            return a.name.localeCompare(b.name);
        });
    } else if (selectedSort === "name-desc") {
        filteredGames.sort(function(a, b) {
            return b.name.localeCompare(a.name);
        });
    } else if (selectedSort === "price-asc") {
        filteredGames.sort(function(a, b) {
            return a.price - b.price;
        });
    } else if (selectedSort === "price-desc") {
        filteredGames.sort(function(a, b) {
            return b.price - a.price;
        });
    }

    currentGames = filteredGames;
    renderGames(currentGames);
}

function quickAddToCart(gameId) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = cart.find(function(item) {
        return item.id === gameId;
    });

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: gameId,
            quantity: 1
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Igra je dodata u korpu.");
}

function downloadCatalogPlaceholder() {
    alert("PDF katalog ćemo dodati kasnije. Za sada je dugme spremno.");
}

searchInput.addEventListener("input", applyFiltersAndSort);
categoryFilter.addEventListener("change", applyFiltersAndSort);
sortSelect.addEventListener("change", applyFiltersAndSort);
downloadPdfBtn.addEventListener("click", downloadCatalogPlaceholder);

readCategoryFromUrl();
applyFiltersAndSort();