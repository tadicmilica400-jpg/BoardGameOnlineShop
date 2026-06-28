const games = [
    {
        id: "catan",
        name: "Catan",
        category: "strateske",
        categoryName: "Strateške igre",
        price: 4500,
        players: "3-4",
        age: "10+",
        duration: "60-120 min",
        rating: 4.8,
        image: "images/games/catan.jpg",
        description: "Catan je strateška društvena igra u kojoj igrači grade naselja, puteve i gradove, trguju resursima i pokušavaju da osvoje ostrvo."
    },
    {
        id: "ticket-to-ride",
        name: "Ticket to Ride",
        category: "porodicne",
        categoryName: "Porodične igre",
        price: 5200,
        players: "2-5",
        age: "8+",
        duration: "30-60 min",
        rating: 4.9,
        image: "images/games/ticket-to-ride.jpg",
        description: "Ticket to Ride je porodična igra u kojoj igrači grade železničke rute između gradova i sakupljaju poene."
    },
    {
        id: "dixit",
        name: "Dixit",
        category: "porodicne",
        categoryName: "Porodične igre",
        price: 3900,
        players: "3-6",
        age: "8+",
        duration: "30 min",
        rating: 4.7,
        image: "images/games/dixit.jpg",
        description: "Dixit je kreativna igra asocijacija, mašte i prelepih ilustracija, idealna za opušteno društvo."
    },
    {
        id: "uno",
        name: "Uno",
        category: "zabavne",
        categoryName: "Zabavne igre",
        price: 1200,
        players: "2-10",
        age: "7+",
        duration: "15-30 min",
        rating: 4.4,
        image: "images/games/uno.jpg",
        description: "Uno je brza i zabavna kartaška igra u kojoj igrači pokušavaju da se prvi oslobode svih karata."
    },
    {
        id: "azul",
        name: "Azul",
        category: "strateske",
        categoryName: "Strateške igre",
        price: 4300,
        players: "2-4",
        age: "8+",
        duration: "30-45 min",
        rating: 4.8,
        image: "images/games/azul.jpg",
        description: "Azul je apstraktna strateška igra u kojoj igrači biraju i postavljaju pločice kako bi osvojili što više poena."
    },
    {
        id: "exploding-kittens",
        name: "Exploding Kittens",
        category: "zabavne",
        categoryName: "Zabavne igre",
        price: 2500,
        players: "2-5",
        age: "7+",
        duration: "15 min",
        rating: 4.5,
        image: "images/games/exploding-kittens.jpg",
        description: "Exploding Kittens je brza, nepredvidiva i smešna kartaška igra puna iznenađenja."
    },
    {
        id: "monopoly",
        name: "Monopoly",
        category: "porodicne",
        categoryName: "Porodične igre",
        price: 3600,
        players: "2-6",
        age: "8+",
        duration: "60-180 min",
        rating: 4.2,
        image: "images/games/monopoly.jpg",
        description: "Monopoly je klasična porodična igra kupovine, prodaje i upravljanja nekretninama."
    },
    {
        id: "risk",
        name: "Risk",
        category: "strateske",
        categoryName: "Strateške igre",
        price: 4800,
        players: "2-6",
        age: "10+",
        duration: "120 min",
        rating: 4.3,
        image: "images/games/risk.jpg",
        description: "Risk je strateška igra osvajanja teritorija, planiranja napada i kontrole mape."
    },
    {
        id: "dobble",
        name: "Dobble",
        category: "zabavne",
        categoryName: "Zabavne igre",
        price: 1800,
        players: "2-8",
        age: "6+",
        duration: "10-15 min",
        rating: 4.6,
        image: "images/games/dobble.jpg",
        description: "Dobble je brza igra zapažanja i refleksa u kojoj igrači traže zajedničke simbole na kartama."
    }
];

function getGameById(id) {
    return games.find(function(game) {
        return game.id === id;
    });
}

function getGamesByCategory(category) {
    if (category === "sve" || !category) {
        return games;
    }

    return games.filter(function(game) {
        return game.category === category;
    });
}

function getTopRatedGames(limit) {
    return [...games]
        .sort(function(a, b) {
            return b.rating - a.rating;
        })
        .slice(0, limit);
}

function formatPrice(price) {
    return price.toLocaleString("sr-RS") + " RSD";
}