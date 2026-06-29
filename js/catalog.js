/* ============================================================
   catalog.js — catalog page rendering, filtering and sorting
   Uses GAMES from data.js
   ============================================================ */

const gamesContainer = document.getElementById("gamesContainer");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const sortSelect = document.getElementById("sortSelect");
const catalogCount = document.getElementById("catalogCount");
const noResults = document.getElementById("noResults");
const downloadPdfBtn = document.getElementById("downloadPdfBtn");

let currentGames = [];

function getCategoryName(category) {
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
                    ${
                        game.slike && game.slike.length > 0
                            ? `<img src="${game.slike[0]}" alt="${game.naziv}">`
                            : game.naziv
                    }
                </div>

                <div class="game-card-body">
                    <span class="category-pill">${getCategoryName(game.kategorija)}</span>

                    <h3>${game.naziv}</h3>
                    <p>${game.opis}</p>

                    <ul class="game-info-list">
                        <li><strong>Broj igrača:</strong> ${game.brojIgraca}</li>
                        <li><strong>Uzrast:</strong> ${game.uzrast}</li>
                        <li><strong>Trajanje:</strong> ${game.trajanje}</li>
                        <li><strong>Ocena:</strong> ${game.ocena}</li>
                    </ul>

                    <p class="price">${formatRSD(game.cena)}</p>

                    <div class="game-card-actions">
                        <a href="igra.html?id=${game.id}" class="btn btn-small-custom">Detalji</a>
                        <button class="btn btn-cart-small" onclick="addCatalogItemToCart('${game.id}')">
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
        alert("Igra je dodata u korpu.");
    } else {
        alert("Korpa trenutno nije dostupna.");
    }
}

function downloadCatalogPdf() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let y = 20;

    doc.setFontSize(18);
    doc.text("BoardGame Online Shop - Katalog igara", 15, y);

    y += 12;

    doc.setFontSize(11);
    doc.text("Prikazane igre: " + currentGames.length, 15, y);

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
        doc.text(removeSerbianChars("Kategorija: " + getCategoryName(game.kategorija)), 20, y);
        y += 6;

        doc.text(removeSerbianChars("Cena: " + formatRSD(game.cena)), 20, y);
        y += 6;

        doc.text(removeSerbianChars("Broj igraca: " + game.brojIgraca), 20, y);
        y += 6;

        doc.text(removeSerbianChars("Uzrast: " + game.uzrast), 20, y);
        y += 6;

        doc.text(removeSerbianChars("Trajanje: " + game.trajanje), 20, y);
        y += 6;

        doc.text(removeSerbianChars("Ocena: " + game.ocena + "/5"), 20, y);
        y += 6;

        const splitDescription = doc.splitTextToSize(
            removeSerbianChars("Opis: " + game.opis),
            170
        );

        doc.text(splitDescription, 20, y);

        y += splitDescription.length * 6 + 8;
    });

    doc.save("katalog-igara.pdf");
}

searchInput.addEventListener("input", applyFiltersAndSort);
categoryFilter.addEventListener("change", applyFiltersAndSort);
sortSelect.addEventListener("change", applyFiltersAndSort);
downloadPdfBtn.addEventListener("click", downloadCatalogPdf);

readCategoryFromUrl();
applyFiltersAndSort();