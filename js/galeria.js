// ================================================
//  GALERÍA.HTML — filtros por categoría
// ================================================
(function () {
    const filtros = document.querySelectorAll('.ga-filtro');
    const items   = document.querySelectorAll('.ga-item');
    if (!filtros.length || !items.length) return;

    filtros.forEach(btn => {
        btn.addEventListener('click', () => {
            filtros.forEach(b => b.classList.remove('activo'));
            btn.classList.add('activo');

            const filtro = btn.dataset.filtro;
            items.forEach(item => {
                const coincide = filtro === 'todos' || item.dataset.cat === filtro;
                item.style.display = coincide ? 'block' : 'none';
            });
        });
    });

    initLightbox({ items: '.ga-item', soloVisibles: true });
})();
