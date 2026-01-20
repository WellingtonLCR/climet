const nav = document.querySelector('.site-nav');
const toggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelectorAll('.nav-list a');
const headerDate = document.querySelector('.header-date');

const closeMenu = () => {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
};

if (toggle) {
    toggle.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', String(isOpen));
    });
}

navLinks.forEach((link) => {
    link.addEventListener('click', () => {
        if (nav.classList.contains('is-open')) {
            closeMenu();
        }
    });
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 820 && nav.classList.contains('is-open')) {
        closeMenu();
    }
});

if (headerDate) {
    const now = new Date();
    const formatted = now.toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
    headerDate.textContent = formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

const heroCarousel = document.querySelector('.hero-carousel');

if (heroCarousel) {
    const slides = Array.from(heroCarousel.querySelectorAll('.hero-slide'));
    const prevControl = heroCarousel.querySelector('.hero-carousel__control--prev');
    const nextControl = heroCarousel.querySelector('.hero-carousel__control--next');
    const indicatorsContainer = heroCarousel.querySelector('.hero-carousel__indicators');
    const AUTOPLAY_INTERVAL = 5000;
    let currentIndex = Math.max(
        0,
        slides.findIndex((slide) => slide.classList.contains('is-active'))
    );
    let autoplayId;
    let indicators = [];

    const setSlide = (newIndex) => {
        const previousSlide = slides[currentIndex];
        const nextSlide = slides[newIndex];

        if (previousSlide) {
            previousSlide.classList.remove('is-active');
            previousSlide.setAttribute('aria-hidden', 'true');
        }

        if (indicators[currentIndex]) {
            indicators[currentIndex].classList.remove('is-active');
            indicators[currentIndex].setAttribute('aria-selected', 'false');
            indicators[currentIndex].setAttribute('tabindex', '-1');
        }

        nextSlide.classList.add('is-active');
        nextSlide.setAttribute('aria-hidden', 'false');

        if (indicators[newIndex]) {
            indicators[newIndex].classList.add('is-active');
            indicators[newIndex].setAttribute('aria-selected', 'true');
            indicators[newIndex].setAttribute('tabindex', '0');
        }

        currentIndex = newIndex;
    };

    const goToSlide = (index) => {
        const total = slides.length;
        const normalized = ((index % total) + total) % total;
        setSlide(normalized);
    };

    const moveSlide = (delta) => {
        goToSlide(currentIndex + delta);
    };

    const restartAutoplay = () => {
        if (autoplayId) {
            clearInterval(autoplayId);
        }
        autoplayId = setInterval(() => {
            moveSlide(1);
        }, AUTOPLAY_INTERVAL);
    };

    slides.forEach((slide, index) => {
        slide.setAttribute('aria-hidden', index === currentIndex ? 'false' : 'true');
    });

    indicators = slides.map((_, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'hero-carousel__indicator';
        button.setAttribute('aria-label', `Mostrar imagem ${index + 1}`);
        button.setAttribute('role', 'tab');
        button.setAttribute('aria-selected', index === currentIndex ? 'true' : 'false');
        button.setAttribute('tabindex', index === currentIndex ? '0' : '-1');

        if (index === currentIndex) {
            button.classList.add('is-active');
        }

        button.addEventListener('click', () => {
            goToSlide(index);
            restartAutoplay();
        });

        indicatorsContainer.appendChild(button);
        return button;
    });

    if (prevControl && nextControl) {
        prevControl.addEventListener('click', () => {
            moveSlide(-1);
            restartAutoplay();
        });

        nextControl.addEventListener('click', () => {
            moveSlide(1);
            restartAutoplay();
        });
    }

    heroCarousel.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            moveSlide(-1);
            restartAutoplay();
        }

        if (event.key === 'ArrowRight') {
            event.preventDefault();
            moveSlide(1);
            restartAutoplay();
        }
    });

    heroCarousel.addEventListener('mouseenter', () => {
        if (autoplayId) {
            clearInterval(autoplayId);
        }
    });

    heroCarousel.addEventListener('mouseleave', () => {
        restartAutoplay();
    });

    restartAutoplay();
}
