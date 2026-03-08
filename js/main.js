// Smooth scrolling para navegación
document.querySelectorAll('a.nav-link, a.btn').forEach(anchor => {
    anchor.addEventListener('click', function (e) {

        // Solo aplicar preventDefault si es un link interno (#)
        if (this.getAttribute('href').startsWith('#')) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Cerrar menú móvil si está abierto
                document.getElementById('nav-links').classList.remove('active');

                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Ajustar por el header fijo
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Cambiar estilo del header al hacer scroll
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Menú Móvil
const mobileToggle = document.getElementById('mobile-toggle');
const navLinks = document.getElementById('nav-links');

mobileToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Intersection Observer para Animaciones de Scroll
const observerOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Dejar de observar una vez animado
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach((elem) => {
    observer.observe(elem);
});

// =========================================
// Funcionalidad del Carrusel
// =========================================
const track = document.querySelector('.carousel-track');
if (track) {
    const slides = Array.from(track.children);
    const nextButton = document.querySelector('.carousel-btn-right');
    const prevButton = document.querySelector('.carousel-btn-left');
    const dotsNav = document.querySelector('.carousel-nav');
    const dots = Array.from(dotsNav.children);

    let slideWidth = slides[0].getBoundingClientRect().width;

    // Acomodar los slides uno al lado del otro
    const setSlidePosition = (slide, index) => {
        slide.style.left = slideWidth * index + 'px';
    };
    slides.forEach(setSlidePosition);

    // Reposicionar en resize
    window.addEventListener('resize', () => {
        slideWidth = slides[0].getBoundingClientRect().width;
        slides.forEach(setSlidePosition);

        // Mantener posicionado el current slide
        const currentSlide = track.querySelector('.current-slide');
        track.style.transform = 'translateX(-' + currentSlide.style.left + ')';
    });

    const moveToSlide = (track, currentSlide, targetSlide) => {
        if (!targetSlide) return;
        track.style.transform = 'translateX(-' + targetSlide.style.left + ')';
        currentSlide.classList.remove('current-slide');
        targetSlide.classList.add('current-slide');
    };

    const updateDots = (currentDot, targetDot) => {
        if (!targetDot) return;
        currentDot.classList.remove('current-indicator');
        targetDot.classList.add('current-indicator');
    };

    // Click derecha
    nextButton.addEventListener('click', e => {
        const currentSlide = track.querySelector('.current-slide');
        let targetSlide = currentSlide.nextElementSibling;

        const currentDot = dotsNav.querySelector('.current-indicator');
        let targetDot = currentDot.nextElementSibling;

        // Loop infinito al final
        if (!targetSlide) {
            targetSlide = slides[0];
            targetDot = dots[0];
        }

        moveToSlide(track, currentSlide, targetSlide);
        updateDots(currentDot, targetDot);
    });

    // Click izquierda
    prevButton.addEventListener('click', e => {
        const currentSlide = track.querySelector('.current-slide');
        let targetSlide = currentSlide.previousElementSibling;

        const currentDot = dotsNav.querySelector('.current-indicator');
        let targetDot = currentDot.previousElementSibling;

        // Loop infinito al principio
        if (!targetSlide) {
            targetSlide = slides[slides.length - 1];
            targetDot = dots[dots.length - 1];
        }

        moveToSlide(track, currentSlide, targetSlide);
        updateDots(currentDot, targetDot);
    });

    // Click en los puntos
    dotsNav.addEventListener('click', e => {
        targetDot = e.target.closest('button');
        if (!targetDot) return;

        const currentSlide = track.querySelector('.current-slide');
        const currentDot = dotsNav.querySelector('.current-indicator');
        const targetIndex = dots.findIndex(dot => dot === targetDot);
        const targetSlide = slides[targetIndex];

        moveToSlide(track, currentSlide, targetSlide);
        updateDots(currentDot, targetDot);
    });

    // Auto play (opcional)
    setInterval(() => {
        nextButton.click();
    }, 5000);
}
