// ================================================
//  LIGHTBOX REUTILIZABLE
//  Lo usan la galería del index (.g-cuadro) y Galería.html (.ga-item).
//  En Galería.html, además, respeta el filtro activo: con soloVisibles
//  las flechas recorren únicamente las imágenes que están en pantalla.
// ================================================
function initLightbox({ items, soloVisibles = false } = {}) {
    const contenedores = document.querySelectorAll(items);
    if (!contenedores.length) return;

    const lightbox  = document.getElementById('lightbox');
    const lbImg     = document.getElementById('lb-img');
    const btnCerrar = document.querySelector('.lb-cerrar');
    const btnPrev   = document.querySelector('.lb-prev');
    const btnNext   = document.querySelector('.lb-next');
    if (!lightbox || !lbImg || !btnCerrar || !btnPrev || !btnNext) return;

    let indice = 0;
    let lista  = [];

    function actualizarLista() {
        let elems = Array.from(contenedores);
        if (soloVisibles) {
            elems = elems.filter(el => window.getComputedStyle(el).display !== 'none');
        }
        lista = elems.map(el => el.querySelector('img')).filter(Boolean);
    }

    function mostrar(i) {
        if (!lista.length) return;
        indice = (i + lista.length) % lista.length;
        lbImg.src = lista[indice].src;
    }

    function abrir(img) {
        actualizarLista();
        mostrar(lista.indexOf(img));
        lightbox.classList.add('mostrar');
        document.body.style.overflow = 'hidden';
    }

    function cerrar() {
        lightbox.classList.remove('mostrar');
        document.body.style.overflow = 'auto';
    }

    contenedores.forEach(el => {
        const img = el.querySelector('img');
        if (!img) return;
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => abrir(img));
    });

    btnNext.addEventListener('click',   e => { e.stopPropagation(); mostrar(indice + 1); });
    btnPrev.addEventListener('click',   e => { e.stopPropagation(); mostrar(indice - 1); });
    btnCerrar.addEventListener('click', cerrar);
    lightbox.addEventListener('click',  e => { if (e.target === lightbox) cerrar(); });

    document.addEventListener('keydown', e => {
        if (!lightbox.classList.contains('mostrar')) return;
        if      (e.key === 'Escape')     cerrar();
        else if (e.key === 'ArrowRight') mostrar(indice + 1);
        else if (e.key === 'ArrowLeft')  mostrar(indice - 1);
    });
}
