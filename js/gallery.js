/* ============================================================
   gallery.js — lightbox for the gallery page
   Opens an enlarged image (with a placeholder fallback when the
   photo file is missing) and closes on click / × / Esc.
   The functions are global because the tiles call them via onclick.
   ============================================================ */

function openLightbox(el) {
    const full = el.dataset.full;
    const caption = el.dataset.caption || "";
    const media = document.getElementById("lightbox-media");

    // try to show the real image; if it is missing, show the gradient placeholder
    media.innerHTML =
        '<img src="' + full + '" alt="' + caption + '" ' +
        'onerror="this.style.display=\'none\'; this.nextElementSibling.style.display=\'flex\';">' +
        '<div class="lightbox-ph" style="display:none">' + caption + '</div>';

    document.getElementById("lightbox-caption").textContent = caption;
    document.getElementById("lightbox").classList.add("open");
}

function closeLightbox() {
    document.getElementById("lightbox").classList.remove("open");
    document.getElementById("lightbox-media").innerHTML = "";
}

// close on Esc
document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeLightbox();
});