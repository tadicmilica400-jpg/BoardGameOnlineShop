/* ============================================================
   data.js — central list of games
   Used by cart.js (addToCart looks up the name/price by id),
   and later by catalog.js / game.js to render the games.
   Categories: porodicne | strateske | zabavne
   ============================================================ */

const GAMES = [
  // ---- FAMILY ----
  {
    id: "ticket-to-ride",
    naziv: "Ticket to Ride",
    kategorija: "porodicne",
    cena: 5200,
    opis: "Gradi železničke rute kroz mapu i poveži gradove pre protivnika.",
    opisEn: "Build railway routes across the map and connect cities before your opponents.",
    brojIgraca: "2–5",
    uzrast: "8+",
    trajanje: "30–60 min",
    ocena: 4.8,
    slike: ["images/igre/ticket-to-ride.jpg"]
  },
  {
    id: "carcassonne",
    naziv: "Carcassonne",
    kategorija: "porodicne",
    cena: 3600,
    opis: "Slaži pločice i osvajaj puteve, gradove i manastire svojim sledbenicima.",
    opisEn: "Place tiles and claim roads, cities and monasteries with your followers.",
    brojIgraca: "2–5",
    uzrast: "7+",
    trajanje: "30–45 min",
    ocena: 4.6,
    slike: ["images/igre/carcassonne.jpg"]
  },
  {
    id: "dixit",
    naziv: "Dixit",
    kategorija: "porodicne",
    cena: 3900,
    opis: "Kreativna igra asocijacija, mašte i prelepih ilustracija.",
    opisEn: "A creative game of associations, imagination and beautiful illustrations.",
    brojIgraca: "3–6",
    uzrast: "8+",
    trajanje: "30 min",
    ocena: 4.7,
    slike: ["images/igre/dixit.jpg"]
  },

  // ---- STRATEGY ----
  {
    id: "catan",
    naziv: "Catan",
    kategorija: "strateske",
    cena: 4500,
    opis: "Strateška igra trgovine, gradnje i osvajanja teritorije.",
    opisEn: "A strategy game about trading, building and expanding settlements.",
    brojIgraca: "3–4",
    uzrast: "10+",
    trajanje: "60–90 min",
    ocena: 4.7,
    slike: ["images/igre/catan.jpg"]
  },
  {
    id: "azul",
    naziv: "Azul",
    kategorija: "strateske",
    cena: 4100,
    opis: "Prelepa apstraktna igra slaganja pločica i bodovanja uzoraka.",
    opisEn: "A beautiful abstract strategy game about placing tiles and scoring patterns.",
    brojIgraca: "2–4",
    uzrast: "8+",
    trajanje: "30–45 min",
    ocena: 4.8,
    slike: ["images/igre/azul.jpg"]
  },
  {
    id: "terraforming-mars",
    naziv: "Terraforming Mars",
    kategorija: "strateske",
    cena: 7900,
    opis: "Vodi korporaciju koja menja Mars u nastanjivu planetu.",
    opisEn: "Lead a corporation and help transform Mars into a habitable planet.",
    brojIgraca: "1–5",
    uzrast: "12+",
    trajanje: "90–120 min",
    ocena: 4.9,
    slike: ["images/igre/terraforming-mars.jpg"]
  },

  // ---- PARTY ----
  {
    id: "uno",
    naziv: "Uno",
    kategorija: "zabavne",
    cena: 1200,
    opis: "Brza i zabavna kartaška igra za celu ekipu.",
    brojIgraca: "2–10",
    uzrast: "7+",
    trajanje: "15–30 min",
    ocena: 4.4,
    slike: ["images/igre/uno.jpg"]
  },
  {
    id: "exploding-kittens",
    naziv: "Exploding Kittens",
    kategorija: "zabavne",
    cena: 2300,
    opis: "Brza i smešna igra za opušteno društvo.",
    opisEn: "A quick and funny card game full of surprises.",
    brojIgraca: "2–5",
    uzrast: "7+",
    trajanje: "15 min",
    ocena: 4.3,
    slike: ["images/igre/exploding-kittens.jpg"]
  },
  {
    id: "codenames",
    naziv: "Codenames",
    kategorija: "zabavne",
    cena: 2900,
    opis: "Timska igra pogađanja reči pomoću jednog asocijativnog traga.",
    opisEn: "A team word-guessing game based on clever one-word clues.",
    brojIgraca: "2–8",
    uzrast: "10+",
    trajanje: "15–30 min",
    ocena: 4.7,
    slike: ["images/igre/codenames.jpg"]
  }
];

// available globally (no modules, plain <script>)
window.GAMES = GAMES;

// helper: find a game by id
function getGameById(id) {
  return GAMES.find(g => g.id === id) || null;
}
window.getGameById = getGameById;