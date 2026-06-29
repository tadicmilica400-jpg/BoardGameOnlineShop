/* ============================================================
   game.js — game details page logic
   Uses GAMES from data.js and addToCart from cart.js
   ============================================================ */

const params = new URLSearchParams(window.location.search);
const gameId = params.get("id");

const game = getGameById(gameId);

const gameNotFound = document.getElementById("game-not-found");
const gameDetails = document.getElementById("game-details");

const breadcrumbGameName = document.getElementById("breadcrumb-game-name");
const gameTitle = document.getElementById("game-title");
const gameSubtitle = document.getElementById("game-subtitle");

const gameImage = document.getElementById("game-image");
const gameCategory = document.getElementById("game-category");
const gameName = document.getElementById("game-name");
const gameDescription = document.getElementById("game-description");
const gamePlayers = document.getElementById("game-players");
const gameAge = document.getElementById("game-age");
const gameDuration = document.getElementById("game-duration");
const gameRating = document.getElementById("game-rating");
const gamePrice = document.getElementById("game-price");

const addToCartBtn = document.getElementById("add-to-cart-btn");

const ratingButtons = document.querySelectorAll(".rating-btn");
const ratingMessage = document.getElementById("rating-message");
const averageRatingMessage = document.getElementById("average-rating-message");
const submitRatingBtn = document.getElementById("submit-rating-btn");

let selectedRating = null;

const commentForm = document.getElementById("comment-form");
const commentName = document.getElementById("comment-name");
const commentText = document.getElementById("comment-text");
const commentsContainer = document.getElementById("comments-container");

function getCategoryName(category) {
    if (category === "porodicne") return "Porodične igre";
    if (category === "strateske") return "Strateške igre";
    if (category === "zabavne") return "Zabavne igre";
    return "Društvena igra";
}

function getRatingKey() {
    return "rating_" + game.id;
}

function getRatingsKey() {
    return "ratings_" + game.id;
}

function getCommentsKey() {
    return "comments_" + game.id;
}

function showGameNotFound() {
    gameNotFound.classList.remove("d-none");
    gameDetails.classList.add("d-none");
}

function renderGameDetails() {
    breadcrumbGameName.textContent = game.naziv;
    gameTitle.textContent = game.naziv;
    gameSubtitle.textContent = getCategoryName(game.kategorija);

    gameCategory.textContent = getCategoryName(game.kategorija);
    gameName.textContent = game.naziv;
    gameDescription.textContent = game.opis;
    gamePlayers.textContent = game.brojIgraca;
    gameAge.textContent = game.uzrast;
    gameDuration.textContent = game.trajanje;
    gameRating.textContent = game.ocena;
    gamePrice.textContent = formatRSD(game.cena);

    document.title = "BoardGame Online Shop | " + game.naziv;

    if (game.slike && game.slike.length > 0) {
        gameImage.innerHTML = `
            <img src="${game.slike[0]}" alt="${game.naziv}">
        `;
    } else {
        gameImage.textContent = game.naziv;
    }
}

function getRatings() {
    return JSON.parse(localStorage.getItem(getRatingsKey())) || [];
}

function saveRatings(ratings) {
    localStorage.setItem(getRatingsKey(), JSON.stringify(ratings));
}

function calculateAverageRating() {
    const ratings = getRatings();

    let sum = game.ocena;
    let count = 1;

    ratings.forEach(function(rating) {
        sum += Number(rating);
        count++;
    });

    return (sum / count).toFixed(1);
}

function renderAverageRating() {
    const average = calculateAverageRating();

    gameRating.textContent = average;
    averageRatingMessage.textContent = "Prosečna ocena: " + average + "/5";
}

function renderSavedRating() {
    const savedRating = localStorage.getItem(getRatingKey());

    ratingButtons.forEach(function(button) {
        button.classList.remove("active");
    });

    if (savedRating) {
        selectedRating = savedRating;
        ratingMessage.textContent = "Vaša ocena za ovu igru je " + savedRating + "/5.";

        ratingButtons.forEach(function(button) {
            if (button.dataset.rating === savedRating) {
                button.classList.add("active");
            }
        });
    } else {
        ratingMessage.textContent = "Izaberite ocenu od 1 do 5.";
    }

    renderAverageRating();
}

function submitRating() {
    if (!selectedRating) {
        alert("Prvo izaberite ocenu od 1 do 5.");
        return;
    }

    const previousRating = localStorage.getItem(getRatingKey());
    let ratings = getRatings();

    if (previousRating) {
        const index = ratings.indexOf(Number(previousRating));

        if (index !== -1) {
            ratings[index] = Number(selectedRating);
        }
    } else {
        ratings.push(Number(selectedRating));
    }

    saveRatings(ratings);
    localStorage.setItem(getRatingKey(), selectedRating);

    renderSavedRating();
    alert("Ocena je sačuvana.");
}

function getComments() {
    return JSON.parse(localStorage.getItem(getCommentsKey())) || [];
}

function saveComments(comments) {
    localStorage.setItem(getCommentsKey(), JSON.stringify(comments));
}

function renderComments() {
    const comments = getComments();

    if (comments.length === 0) {
        commentsContainer.innerHTML = '<p class="empty-note">Još uvek nema komentara za ovu igru.</p>';
        return;
    }

    let html = "";

    comments.forEach(function(comment) {
        html += `
            <div class="comment-card">
                <div class="comment-top">
                    <strong>${comment.name}</strong>
                    <span>${comment.date}</span>
                </div>
                <p>${comment.text}</p>
            </div>
        `;
    });

    commentsContainer.innerHTML = html;
}

function addComment(event) {
    event.preventDefault();

    const name = commentName.value.trim();
    const text = commentText.value.trim();

    if (name === "" || text === "") {
        alert("Unesite ime i komentar.");
        return;
    }

    const comments = getComments();

    const newComment = {
        name: name,
        text: text,
        date: new Date().toLocaleString("sr-RS")
    };

    comments.unshift(newComment);
    saveComments(comments);

    commentForm.reset();
    renderComments();
}

function setupEvents() {
    addToCartBtn.addEventListener("click", function() {
        addToCart(game.id, 1);
        alert("Igra je dodata u korpu.");
    });

    ratingButtons.forEach(function(button) {
        button.addEventListener("click", function() {
            selectedRating = button.dataset.rating;

            ratingButtons.forEach(function(btn) {
                btn.classList.remove("active");
            });

            button.classList.add("active");
            ratingMessage.textContent = "Izabrali ste ocenu " + selectedRating + "/5. Kliknite na Pošalji ocenu.";
        });
    });

    submitRatingBtn.addEventListener("click", submitRating);

    commentForm.addEventListener("submit", addComment);
}

if (!game) {
    showGameNotFound();
} else {
    renderGameDetails();
    renderSavedRating();
    renderComments();
    setupEvents();
}