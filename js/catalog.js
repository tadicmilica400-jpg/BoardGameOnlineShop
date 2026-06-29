/* ============================================================
   catalog.js — catalog page rendering, filtering and sorting
   Uses GAMES from data.js
   Supports Serbian and English pages
   ============================================================ */

const gamesContainer = document.getElementById("gamesContainer");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const sortSelect = document.getElementById("sortSelect");
const catalogCount = document.getElementById("catalogCount");
const noResults = document.getElementById("noResults");
const downloadPdfBtn = document.getElementById("downloadPdfBtn");

let currentGames = [];

const isEnglish = document.documentElement.lang === "en";

function getCategoryName(category) {
    if (isEnglish) {
        if (category === "porodicne") return "Family games";
        if (category === "strateske") return "Strategy games";
        if (category === "zabavne") return "Party games";
        return "Board game";
    }

    if (category === "porodicne") return "Porodične igre";
    if (category === "strateske") return "Strateške igre";
    if (category === "zabavne") return "Zabavne igre";
    return "Društvena igra";
}

function removeSerbianChars(text) {
    return text
        .replaceAll("č", "c")
        .replaceAll("ć", "c")
        .replaceAll("đ", "dj")
        .replaceAll("š", "s")
        .replaceAll("ž", "z")
        .replaceAll("Č", "C")
        .replaceAll("Ć", "C")
        .replaceAll("Đ", "Dj")
        .replaceAll("Š", "S")
        .replaceAll("Ž", "Z");
}

function readCategoryFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const category = params.get("kategorija");

    if (category && categoryFilter) {
        categoryFilter.value = category;
    }
}

function renderGames(gamesToRender) {
    gamesContainer.innerHTML = "";

    if (gamesToRender.length === 0) {
        noResults.classList.remove("d-none");

        catalogCount.textContent = isEnglish
            ? "Showing 0 games."
            : "Prikazano 0 igara.";

        return;
    }

    noResults.classList.add("d-none");

    catalogCount.textContent = isEnglish
        ? "Showing " + gamesToRender.length + " games."
        : "Prikazano " + gamesToRender.length + " igara.";

    gamesToRender.forEach(function(game) {
        const gameCard = document.createElement("div");
        gameCard.className = "col-md-6 col-lg-4";

        gameCard.innerHTML = `
            <div class="game-card">
                <div class="game-image-placeholder">
                    ${
                        game.slike && game.slike.length > 0
                            ? `<img src="${isEnglish ? "../" : ""}${game.slike[0]}" alt="${game.naziv}">`
                            : game.naziv
                    }
                </div>

                <div class="game-card-body">
                    <span class="category-pill">${getCategoryName(game.kategorija)}</span>

                    <h3>${game.naziv}</h3>
                    <p>${isEnglish ? game.opisEn : game.opis}</p>

                    <ul class="game-info-list">
                        <li><strong>${isEnglish ? "Players" : "Broj igrača"}:</strong> ${game.brojIgraca}</li>
                        <li><strong>${isEnglish ? "Age" : "Uzrast"}:</strong> ${game.uzrast}</li>
                        <li><strong>${isEnglish ? "Duration" : "Trajanje"}:</strong> ${game.trajanje}</li>
                        <li><strong>${isEnglish ? "Rating" : "Ocena"}:</strong> ${game.ocena}</li>
                    </ul>

                    <p class="price">${formatRSD(game.cena)}</p>

                    <div class="game-card-actions">
                        <a href="${isEnglish ? "game.html" : "igra.html"}?id=${game.id}" class="btn btn-small-custom">
                            ${isEnglish ? "Details" : "Detalji"}
                        </a>

                        <button class="btn btn-cart-small" onclick="addCatalogItemToCart('${game.id}')">
                            ${isEnglish ? "Add to cart" : "Dodaj u korpu"}
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

    let filteredGames = [...GAMES];

    if (selectedCategory !== "sve") {
        filteredGames = filteredGames.filter(function(game) {
            return game.kategorija === selectedCategory;
        });
    }

    if (searchText !== "") {
        filteredGames = filteredGames.filter(function(game) {
            return game.naziv.toLowerCase().includes(searchText);
        });
    }

    if (selectedSort === "name-asc") {
        filteredGames.sort(function(a, b) {
            return a.naziv.localeCompare(b.naziv);
        });
    } else if (selectedSort === "name-desc") {
        filteredGames.sort(function(a, b) {
            return b.naziv.localeCompare(a.naziv);
        });
    } else if (selectedSort === "price-asc") {
        filteredGames.sort(function(a, b) {
            return a.cena - b.cena;
        });
    } else if (selectedSort === "price-desc") {
        filteredGames.sort(function(a, b) {
            return b.cena - a.cena;
        });
    }

    currentGames = filteredGames;
    renderGames(currentGames);
}

function addCatalogItemToCart(gameId) {
    if (typeof addToCart === "function") {
        addToCart(gameId, 1);

        alert(isEnglish
            ? "The game has been added to your cart."
            : "Igra je dodata u korpu."
        );
    } else {
        alert(isEnglish
            ? "The cart is currently unavailable."
            : "Korpa trenutno nije dostupna."
        );
    }
}

function downloadCatalogPdf() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let y = 20;

    doc.setFontSize(18);
    doc.text(
        isEnglish
            ? "BoardGame Online Shop - Game Catalog"
            : "BoardGame Online Shop - Katalog igara",
        15,
        y
    );

    y += 12;

    doc.setFontSize(11);
    doc.text(
        isEnglish
            ? "Displayed games: " + currentGames.length
            : "Prikazane igre: " + currentGames.length,
        15,
        y
    );

    y += 12;

    currentGames.forEach(function(game, index) {
        if (y > 270) {
            doc.addPage();
            y = 20;
        }

        doc.setFontSize(13);
        doc.text(removeSerbianChars((index + 1) + ". " + game.naziv), 15, y);

        y += 7;

        doc.setFontSize(10);

        doc.text(
            removeSerbianChars((isEnglish ? "Category: " : "Kategorija: ") + getCategoryName(game.kategorija)),
            20,
            y
        );
        y += 6;

        doc.text(
            removeSerbianChars((isEnglish ? "Price: " : "Cena: ") + formatRSD(game.cena)),
            20,
            y
        );
        y += 6;

        doc.text(
            removeSerbianChars((isEnglish ? "Players: " : "Broj igraca: ") + game.brojIgraca),
            20,
            y
        );
        y += 6;

        doc.text(
            removeSerbianChars((isEnglish ? "Age: " : "Uzrast: ") + game.uzrast),
            20,
            y
        );
        y += 6;

        doc.text(
            removeSerbianChars((isEnglish ? "Duration: " : "Trajanje: ") + game.trajanje),
            20,
            y
        );
        y += 6;

        doc.text(
            removeSerbianChars((isEnglish ? "Rating: " : "Ocena: ") + game.ocena + "/5"),
            20,
            y
        );
        y += 6;

        const splitDescription = doc.splitTextToSize(
            removeSerbianChars(
                (isEnglish ? "Description: " : "Opis: ") +
                (isEnglish ? game.opisEn : game.opis)
            ),
            170
        );

        doc.text(splitDescription, 20, y);

        y += splitDescription.length * 6 + 8;
    });

    doc.save(isEnglish ? "game-catalog.pdf" : "katalog-igara.pdf");
}

searchInput.addEventListener("input", applyFiltersAndSort);
categoryFilter.addEventListener("change", applyFiltersAndSort);
sortSelect.addEventListener("change", applyFiltersAndSort);
downloadPdfBtn.addEventListener("click", downloadCatalogPdf);

readCategoryFromUrl();
applyFiltersAndSort();