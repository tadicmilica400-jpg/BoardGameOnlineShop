# Board Game Online Shop

## Project overview

A bilingual static web-design coursework project presenting a fictional board-game shop. The site is implemented with HTML, CSS and browser-side JavaScript; it has no backend, database or real payment integration.

## Academic context and authorship

Developed by **Milica Tadić and Ivana Mušikić** as a Web Design project at the University of Belgrade, School of Electrical Engineering. The repository should be presented as joint work.

## Technologies

- HTML5, CSS and vanilla JavaScript
- Bootstrap 5 loaded from a CDN
- jsPDF loaded from a CDN for catalogue export
- Browser `localStorage` for cart, order-history, rating and comment state
- Serbian and English page sets

## Main functionality

- Responsive home, catalogue, product, gallery, account and promotional pages
- Text/category filtering and name/price sorting in the catalogue
- Product details selected through URL parameters
- Client-side cart quantities, totals, simulated checkout and local order history
- Local product ratings and comments
- Catalogue PDF generation in the browser
- Image/video gallery with a lightbox
- Serbian and English interfaces

## Technical implementation

`js/data.js` contains the catalogue data used by product and cart views. `js/catalog.js` renders and filters the catalogue and creates PDF output. `js/cart.js` persists cart and simulated order history in `localStorage`. `js/game.js` renders product details and stores ratings/comments locally. There is no authentication service: the account and checkout behaviour are interface demonstrations only.

## Run locally

The pages can be served by any static HTTP server, for example:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000/`. An internet connection is required for the CDN-hosted Bootstrap and jsPDF dependencies. All shop data and transactions are local to the browser and are not shared with a server.

## Repository structure

- root `*.html` — Serbian pages
- `en/` — English pages
- `js/` — catalogue, cart, product and gallery logic
- `css/` — shared and contributor-specific styles
- `images/`, `videos/` — local media assets

## Reproducibility and limitations

- The static source and local media are present, so the interface can be inspected without a build step; CDN-dependent styling and PDF export require network access.
- No automated accessibility, browser or JavaScript tests are included.
- Cart, checkout, ratings, comments and order history are simulations backed by `localStorage`, not secure multi-user features.
- Product/media provenance and redistribution rights should be confirmed before using the repository as a public portfolio artefact.
- Useful improvements include semantic/accessibility testing, removal or self-hosting of CDN dependencies, test coverage and an explicit division-of-work note confirmed by both authors.


