// ===== MENÚ MÓVIL =====
(function () {
    const toggle = document.getElementById('menu-toggle');
    const header = document.querySelector('.c-header');
    if (!toggle || !header) return;

    document.addEventListener('click', (e) => {
        if (!header.contains(e.target)) {
            toggle.checked = false;
        }
    });

    document.querySelectorAll('.h-panel-movil a').forEach(link => {
        link.addEventListener('click', () => {
            setTimeout(() => {
                toggle.checked = false;
            }, 700);
        });
    });
})();

document.querySelectorAll('.s-card').forEach(card => {
    card.addEventListener('click', () => {
        if (window.matchMedia('(hover: hover)').matches) {
            card.blur();
        }
    });
});
(function () {
    const track = document.querySelector('.t-slider-track');
    const btnPrev = document.querySelector('.t-flecha-prev');
    const btnNext = document.querySelector('.t-flecha-next');
    const originalCards = Array.from(document.querySelectorAll('.t-card'));
    // Esta sección solo existe en index.html
    if (!track || !btnPrev || !btnNext || !originalCards.length) return;

    function visibles() {
        return window.matchMedia('(min-width: 992px)').matches ? 2 : 1;
    }

    function setupClones() {
        const v = visibles();
        track.querySelectorAll('.t-clone').forEach(c => c.remove());
        const lastCards = originalCards.slice(-v);
        lastCards.reverse().forEach(card => {
            const clone = card.cloneNode(true);
            clone.classList.add('t-clone');
            track.prepend(clone);
        });
        const firstCards = originalCards.slice(0, v);
        firstCards.forEach(card => {
            const clone = card.cloneNode(true);
            clone.classList.add('t-clone');
            track.append(clone);
        });
    }

    function cardWidth() {
        const allCards = track.querySelectorAll('.t-card');
        return allCards[0].offsetWidth + 24;
    }

    let current = 0;

    function goTo(index, animate = true) {
        const v = visibles();
        current = index;
        if (!animate) {
            track.style.transition = 'none';
        } else {
            track.style.transition = 'transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)';
        }
        const offset = (current + v) * cardWidth();
        track.style.transform = `translateX(-${offset}px)`;
    }

    function next() {
        const total = originalCards.length;
        goTo(current + 1);
        if (current >= total) {
            setTimeout(() => { goTo(0, false); }, 450);
        }
    }

    function prev() {
        goTo(current - 1);
        if (current < 0) {
            setTimeout(() => { goTo(originalCards.length - 1, false); }, 450);
        }
    }

    function init() {
        setupClones();
        goTo(0, false);
    }

    btnNext.addEventListener('click', next);
    btnPrev.addEventListener('click', prev);

    let startX = 0;
    track.addEventListener('touchstart', e => {
        startX = e.touches[0].clientX;
    }, { passive: true });
    track.addEventListener('touchend', e => {
        const diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
    });

    let isDragging = false;
    track.addEventListener('mousedown', e => { startX = e.clientX; isDragging = true; });
    track.addEventListener('mouseup', e => {
        if (!isDragging) return;
        isDragging = false;
        const diff = startX - e.clientX;
        if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
    });
    track.addEventListener('mouseleave', () => { isDragging = false; });

    window.addEventListener('resize', () => { setupClones(); goTo(current, false); });

    init();
})();

// ===== ARCO PEDIDO =====
(function () {
    const COLORS = ['#F5A623','#F7B731','#FF8C00','#E07B00','#B85C00'];
    const ICONS  = ['diseno', 'corte', 'confeccion', 'calidad', 'entrega']; // ← sin ñ
    const LABELS = ['Diseño y Asesoría','Patronaje y corte','Confección','Control de calidad','Entrega'];
    const NUMS   = ['01','02','03','04','05'];

    function getArcParams(W, H) {
        const r = Math.min(W * 0.22, H * 0.78);
        return { cx: W / 2, cy: H * 0.96, rx: r, ry: r };
    }

    function ellipsePoint(cx, cy, rx, ry, angle) {
        return {
            x: cx + rx * Math.cos(angle),
            y: cy - ry * Math.sin(angle),
        };
    }

    function drawCanvas() {
        const wrap   = document.getElementById('p-arco-wrap');
        const canvas = document.getElementById('p-arco-canvas');
        if (!wrap || !canvas) return;
        const r = wrap.getBoundingClientRect();
        const W = r.width, H = r.height;
        if (!W || !H) return;
        canvas.width  = W * devicePixelRatio;
        canvas.height = H * devicePixelRatio;
        canvas.style.width  = W + 'px';
        canvas.style.height = H + 'px';
        const ctx = canvas.getContext('2d');
        ctx.scale(devicePixelRatio, devicePixelRatio);

        const { cx, cy, rx, ry } = getArcParams(W, H);
        const lineW = rx * 0.25;
        ctx.lineWidth = lineW;
        ctx.lineCap = 'butt';
        const steps = 120;

        for (let seg = 0; seg < 5; seg++) {
            const start = Math.PI * (1 - seg / 5);
            const end   = Math.PI * (1 - (seg + 1) / 5);
            ctx.beginPath();
            ctx.strokeStyle = COLORS[seg];
            for (let i = 0; i <= steps; i++) {
                const angle = start + (end - start) * (i / steps);
                const pt = ellipsePoint(cx, cy, rx, ry, angle);
                i === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y);
            }
            ctx.stroke();
        }
    }

    function renderPasos() {
        const wrap   = document.getElementById('p-arco-wrap');
        const puntos = document.getElementById('p-arco-puntos');
        if (!wrap || !puntos) return;
        const r = wrap.getBoundingClientRect();
        const W = r.width, H = r.height;
        puntos.innerHTML = '';

        const { cx, cy, rx, ry } = getArcParams(W, H);
        const lineW  = rx * 0.32;
        const outerR = rx + lineW * 0.5;
        const numR   = rx + lineW * 0.38;

        // Icono central
        const centro = document.createElement('div');
        centro.className = 'p-arco-centro';
        centro.style.left = cx + 'px';
        centro.style.top  = (cy - ry * 0.28) + 'px';
        centro.innerHTML = `<img src="imagenes/copa.svg" alt="centro">`;
        puntos.appendChild(centro);

        // Números sobre el arco
        const numFracs = [0.1, 0.3, 0.5, 0.7, 0.9];
        numFracs.forEach((f, i) => {
            const angle = Math.PI * (1 - f);
            const pt    = ellipsePoint(cx, cy, numR, numR, angle);
            const col   = COLORS[i];
            const div   = document.createElement('div');
            div.className = 'p-arco-circulo';
            div.style.left   = pt.x + 'px';
            div.style.top    = pt.y + 'px';
            div.style.border = `3px solid ${col}`;
            div.innerHTML    = `<span>${NUMS[i]}</span>`;
            puntos.appendChild(div);
        });

        // Iconos + labels
        const iconFracs = [0, 0.25, 0.5, 0.75, 1.0];
        const iconR     = outerR + lineW * 0.85;
        const yOffsetIconos = [-150, 0, 0, 0, -150];

        iconFracs.forEach((f, i) => {
            const angle = Math.PI * (1 - f);
            const pt    = ellipsePoint(cx, cy, iconR, iconR, angle);
            const div   = document.createElement('div');
            div.className = `p-arco-info p-arco-info--${i}`;
            div.style.left = pt.x + 'px';
            div.style.top  = (pt.y + yOffsetIconos[i]) + 'px';
            div.innerHTML  = `
                <div class="p-arco-icono">
                    <img src="imagenes/${ICONS[i]}.svg" alt="${LABELS[i]}">
                </div>
                <div class="p-arco-label">${LABELS[i]}</div>
            `;
            puntos.appendChild(div);
        });
    }

    function init() {
        drawCanvas();
        renderPasos();
    }

    window.addEventListener('load', init);
    window.addEventListener('resize', () => { drawCanvas(); renderPasos(); });
})();

// ===== ACTIVE NAV ON SCROLL =====
(function () {
    const secciones = document.querySelectorAll('section[id]');
    const links     = document.querySelectorAll('.h-item a');

    function setActivo(id) {
        links.forEach(link => {
            link.classList.remove('activo');
            if (link.getAttribute('href') === '#' + id) {
                link.classList.add('activo');
            }
        });
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setActivo(entry.target.id);
            }
        });
    }, { threshold: 0.3 });

    secciones.forEach(s => observer.observe(s));

    links.forEach(link => {
        link.addEventListener('click', () => {
            links.forEach(l => l.classList.remove('activo'));
            link.classList.add('activo');
        });
    });
})();
// ===== CURSOR GLOW EN SECCIONES CON HEXAGONOS =====
(function () {
    const secciones = document.querySelectorAll('.fondo-hex, .fondo-ped, .fondo-tes, .fondo-cer');

    // Mismo cálculo para ratón y para táctil
    function aplicarGlow(sec, clientX, clientY) {
        const rect = sec.getBoundingClientRect();
        const x = ((clientX - rect.left) / rect.width) * 100;
        const y = ((clientY - rect.top) / rect.height) * 100;

        const distBorde = Math.max(1 - (x / 20), 1 - ((100 - x) / 20));
        const factorBorde = Math.max(0, distBorde);
        const opacidad = 0.1 + (factorBorde * 0.2);

        sec.style.setProperty('--glow-x', x + '%');
        sec.style.setProperty('--glow-y', y + '%');
        sec.style.setProperty('--glow-opacity', opacidad);
    }

    function apagarGlow(sec) {
        sec.style.setProperty('--glow-opacity', '0');
    }

    secciones.forEach(sec => {
        sec.addEventListener('mousemove', e => aplicarGlow(sec, e.clientX, e.clientY));
        sec.addEventListener('mouseleave', () => apagarGlow(sec));
        sec.addEventListener('touchmove', e => {
            const t = e.touches[0];
            aplicarGlow(sec, t.clientX, t.clientY);
        }, { passive: true });
        sec.addEventListener('touchend', () => apagarGlow(sec));
    });
})();
// ===== ENVÍO DE FORMULARIO DE CONTACTO (Web3Forms) =====
(function () {
    const form = document.getElementById('formContacto');
    const mensaje = document.getElementById('formMensaje');

    if (!form) return;

    const submitBtn = form.querySelector('.btn-enviar-premium');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        formData.append("access_key", "00a6eb93-0745-4301-8188-b937930acde5");
        formData.append("subject", "¡WebDeFigazo! Te llegó un mensaje de un cliente");
        formData.append("from_name", "WebDeFigazo");

        const originalText = submitBtn.textContent;
        submitBtn.textContent = "Enviando...";
        submitBtn.disabled = true;

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                mensaje.textContent = "✅ ¡Mensaje enviado! Te responderemos pronto.";
                mensaje.style.color = "green";
                form.reset();
            } else {
                mensaje.textContent = "❌ Error: " + data.message;
                mensaje.style.color = "red";
            }
        } catch (error) {
            mensaje.textContent = "❌ Algo salió mal. Intenta de nuevo.";
            mensaje.style.color = "red";
        } finally {
            mensaje.style.display = "block";
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
})();
// ===== LIGHTBOX DE LA GALERÍA DEL INDEX =====
// Quienessomos.html carga este archivo pero no lightbox.js: sin la
// comprobación, la excepción abortaría todo lo que viene después.
if (typeof initLightbox === 'function') {
    initLightbox({ items: '.g-cuadro' });
}

// Botón WhatsApp flotante: aparece desde #nosotros
(function () {
    const btnWsp = document.querySelector('.wsp-flotante');
    const nosotros = document.getElementById('nosotros');
    if (!btnWsp || !nosotros) return;

    const observer = new IntersectionObserver(([entry]) => {
        if (entry.boundingClientRect.top < window.innerHeight) {
            btnWsp.classList.add('visible');
            observer.disconnect(); // ya no necesita observar más
        }
    }, { threshold: 0 });

    observer.observe(nosotros);
})();
// ===== HEADER DINÁMICO POR SECCIÓN =====
(function () {
    const cHeader = document.querySelector('.c-header');
    if (!cHeader) return;

    // Fondo real de cada sección: decide si el header va claro u oscuro
    const temasPorSeccion = {
        inicio:          'transparente', // Hero con foto
        nosotros:        'transparente', // Fondo oscuro (hexágonos)
        servicios:       'oscuro',       // Fondo blanco
        pedido:          'transparente', // Fondo oscuro
        galeria:         'oscuro',       // Fondo blanco
        testimonios:     'transparente', // Fondo oscuro
        beneficios:      'oscuro',       // Fondo blanco (Corregido en tu HTML)
        certificaciones: 'transparente', // Fondo oscuro
        empresas:        'oscuro',       // Fondo blanco
        contacto:        'transparente'  // Fondo oscuro
    };

    function aplicarTema(tema) {
        if (tema === 'oscuro') {
            cHeader.classList.remove('header-transparente');
            cHeader.classList.add('header-oscuro');
        } else {
            cHeader.classList.remove('header-oscuro');
            cHeader.classList.add('header-transparente');
        }
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                if (temasPorSeccion[id]) {
                    aplicarTema(temasPorSeccion[id]);
                }
            }
        });
    }, {
        // Reduce la zona de detección a una franja del 1% del alto, al 15%
        // desde arriba: así el tema cambia justo al cruzar de sección y no antes.
        rootMargin: '-15% 0px -84% 0px',
        threshold: 0
    });

    Object.keys(temasPorSeccion).forEach(id => {
        const seccion = document.getElementById(id);
        if (seccion) observer.observe(seccion);
    });

    aplicarTema(temasPorSeccion['inicio']);
})();