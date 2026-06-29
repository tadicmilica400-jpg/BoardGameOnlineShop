/* ============================================================
   cart.js — cart logic + rendering of the account page
   Persisted via localStorage (survives closing the browser).
   Bilingual: UI text is chosen from <html lang> (sr / en).
   ------------------------------------------------------------
   Cart item:  { id, naziv, cena, kolicina }
   Order:      { id, datum, stavke:[...], ukupno }
   ============================================================ */

const CART_KEY = "bg_korpa";
const HISTORY_KEY = "bg_istorija";

/* ---------- i18n (UI labels per language) ---------- */
const I18N = {
  sr: {
    emptyCart: 'Vaša korpa je prazna. Pogledajte <a href="katalog.html">katalog igara</a> i dodajte nešto za sledeće veče igranja.',
    colGame: "Igra", colPrice: "Cena", colQty: "Količina", colSum: "Ukupno",
    remove: "Ukloni", total: "Ukupno:", checkout: "Finalizuj kupovinu",
    noHistory: "Još uvek nema završenih porudžbina.", locale: "sr-RS"
  },
  en: {
    emptyCart: 'Your cart is empty. Browse the <a href="catalog.html">game catalog</a> and add something for your next game night.',
    colGame: "Game", colPrice: "Price", colQty: "Quantity", colSum: "Total",
    remove: "Remove", total: "Total:", checkout: "Checkout",
    noHistory: "No completed orders yet.", locale: "en-GB"
  }
};

// pick the dictionary for the current page language
function L() {
  return I18N[document.documentElement.lang === "en" ? "en" : "sr"];
}

/* ---------- read / write storage ---------- */
function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}
function getHistory() {
  return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
}
function saveHistory(hist) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(hist));
}

/* ---------- cart operations ---------- */

// id -> game id from data.js; kolicina -> defaults to 1
function addToCart(id, kolicina = 1) {
  const cart = getCart();
  const postoji = cart.find(s => s.id === id);

  if (postoji) {
    postoji.kolicina += kolicina;
  } else {
    const igra = (typeof getGameById === "function") ? getGameById(id) : null;
    if (!igra) {
      console.warn("addToCart: game with id '" + id + "' not found in GAMES.");
      return;
    }
    cart.push({ id: igra.id, naziv: igra.naziv, cena: igra.cena, kolicina });
  }
  saveCart(cart);
}

function updateQty(id, kolicina) {
  const cart = getCart();
  const stavka = cart.find(s => s.id === id);
  if (!stavka) return;
  stavka.kolicina = kolicina;
  if (stavka.kolicina < 1) {
    removeFromCart(id);
  } else {
    saveCart(cart);
  }
}

function removeFromCart(id) {
  saveCart(getCart().filter(s => s.id !== id));
}

function clearCart() {
  saveCart([]);
}

function cartTotal() {
  return getCart().reduce((zbir, s) => zbir + s.cena * s.kolicina, 0);
}

// checkout: move cart -> history, then empty the cart
function finalizeOrder() {
  const cart = getCart();
  if (cart.length === 0) return null;

  const porudzbina = {
    id: Date.now(),
    datum: new Date().toLocaleString(L().locale),
    stavke: cart,
    ukupno: cartTotal()
  };

  const hist = getHistory();
  hist.unshift(porudzbina);      // newest on top
  saveHistory(hist);
  clearCart();
  return porudzbina;
}

/* ---------- price format ---------- */
function formatRSD(iznos) {
  return iznos.toLocaleString(L().locale) + " RSD";
}

// expose globally (used by catalog/game pages)
window.addToCart = addToCart;
window.getCart = getCart;
window.formatRSD = formatRSD;


/* ============================================================
   RENDERING THE ACCOUNT PAGE
   Runs only if #cart-container exists on the page.
   ============================================================ */
document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("cart-container");
  if (!container) return; // not on the account page -> API only

  renderCart();
  renderHistory();

  // checkout button
  document.addEventListener("click", function (e) {
    if (e.target.id === "checkout-btn") {
      const p = finalizeOrder();
      if (p) {
        renderCart();
        renderHistory();
      }
    }
  });
});

function renderCart() {
  const container = document.getElementById("cart-container");
  const summary = document.getElementById("cart-summary");
  const cart = getCart();
  const t = L();

  if (cart.length === 0) {
    container.innerHTML = '<div class="empty-note">' + t.emptyCart + '</div>';
    if (summary) summary.innerHTML = "";
    return;
  }

  let redovi = "";
  cart.forEach(s => {
    redovi +=
      '<tr>' +
        '<td>' + s.naziv + '</td>' +
        '<td class="price">' + formatRSD(s.cena) + '</td>' +
        '<td>' +
          '<span class="qty-box">' +
            '<button class="qty-btn" onclick="qtyChange(\'' + s.id + '\',-1)">−</button>' +
            '<span class="qty-num">' + s.kolicina + '</span>' +
            '<button class="qty-btn" onclick="qtyChange(\'' + s.id + '\',1)">+</button>' +
          '</span>' +
        '</td>' +
        '<td class="sum">' + formatRSD(s.cena * s.kolicina) + '</td>' +
        '<td><button class="remove-btn" onclick="qtyRemove(\'' + s.id + '\')">' + t.remove + '</button></td>' +
      '</tr>';
  });

  container.innerHTML =
    '<div class="table-responsive">' +
      '<table class="cart-table">' +
        '<thead><tr>' +
          '<th>' + t.colGame + '</th><th>' + t.colPrice + '</th>' +
          '<th>' + t.colQty + '</th><th>' + t.colSum + '</th><th></th>' +
        '</tr></thead>' +
        '<tbody>' + redovi + '</tbody>' +
      '</table>' +
    '</div>';

  if (summary) {
    summary.innerHTML =
      '<div class="cart-summary">' +
        '<div class="total-row"><span>' + t.total + '</span><span>' + formatRSD(cartTotal()) + '</span></div>' +
        '<button id="checkout-btn" class="btn btn-primary-custom w-100">' + t.checkout + '</button>' +
      '</div>';
  }
}

// helpers — global because the onclick attributes call them
function qtyChange(id, delta) {
  const s = getCart().find(x => x.id === id);
  if (!s) return;
  updateQty(id, s.kolicina + delta);
  renderCart();
}
function qtyRemove(id) {
  removeFromCart(id);
  renderCart();
}
window.qtyChange = qtyChange;
window.qtyRemove = qtyRemove;

function renderHistory() {
  const box = document.getElementById("history-container");
  if (!box) return;
  const t = L();

  const hist = getHistory();
  if (hist.length === 0) {
    box.innerHTML = '<p class="empty-note">' + t.noHistory + '</p>';
    return;
  }

  let html = "";
  hist.forEach(p => {
    let stavke = "";
    p.stavke.forEach(s => {
      stavke += '<li>' + s.naziv + ' × ' + s.kolicina + ' — ' + formatRSD(s.cena * s.kolicina) + '</li>';
    });
    html +=
      '<div class="history-card">' +
        '<div class="h-top">' +
          '<span class="h-date">' + p.datum + '</span>' +
          '<span class="h-total">' + formatRSD(p.ukupno) + '</span>' +
        '</div>' +
        '<ul>' + stavke + '</ul>' +
      '</div>';
  });
  box.innerHTML = html;
}