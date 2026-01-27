const nav = document.querySelector('.site-nav');
const toggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelectorAll('.nav-list a');
const headerDate = document.querySelector('.header-date');
const footerYear = document.querySelector('#footer-year');
const topbar = document.querySelector('#site-topbar');
const topbarToggle = document.querySelector('.topbar-toggle');

const TOPBAR_COLLAPSE_BREAKPOINT = 1024;
const TOPBAR_AUTO_COLLAPSE_DELAY = 5000;
let wasMobileViewport = window.innerWidth < TOPBAR_COLLAPSE_BREAKPOINT;
let topbarAutoCollapseTimer;

const setTopbarCollapsed = (collapsed) => {
    if (!topbar || !topbarToggle) return;
    topbar.classList.toggle('is-collapsed', collapsed);
    topbarToggle.setAttribute('aria-expanded', String(!collapsed));
    topbarToggle.classList.toggle('topbar-toggle--collapsed', collapsed);
    topbarToggle.textContent = collapsed
        ? 'Mostrar informações de contato'
        : 'Ocultar informações de contato';
};

const cancelTopbarAutoCollapse = () => {
    if (topbarAutoCollapseTimer) {
        clearTimeout(topbarAutoCollapseTimer);
        topbarAutoCollapseTimer = undefined;
    }
};

const scheduleTopbarAutoCollapse = () => {
    if (!topbar || !topbarToggle) return;
    cancelTopbarAutoCollapse();
    topbarAutoCollapseTimer = window.setTimeout(() => {
        setTopbarCollapsed(true);
    }, TOPBAR_AUTO_COLLAPSE_DELAY);
};

const applyTopbarResponsiveBehavior = (forceShowForMobile = false) => {
    if (!topbar || !topbarToggle) return;

    const isMobileViewport = window.innerWidth < TOPBAR_COLLAPSE_BREAKPOINT;
    topbarToggle.hidden = !isMobileViewport;

    if (isMobileViewport) {
        if (forceShowForMobile || !wasMobileViewport) {
            setTopbarCollapsed(false);
            scheduleTopbarAutoCollapse();
        }
    } else {
        cancelTopbarAutoCollapse();
        setTopbarCollapsed(false);
    }

    wasMobileViewport = isMobileViewport;
};

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

if (topbar && topbarToggle) {
    applyTopbarResponsiveBehavior(true);

    topbarToggle.addEventListener('click', () => {
        const isCollapsed = topbar.classList.contains('is-collapsed');
        setTopbarCollapsed(!isCollapsed);

        if (isCollapsed) {
            scheduleTopbarAutoCollapse();
        } else {
            cancelTopbarAutoCollapse();
        }
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

    if (topbar && topbarToggle) {
        const previousState = wasMobileViewport;
        applyTopbarResponsiveBehavior();

        if (window.innerWidth < TOPBAR_COLLAPSE_BREAKPOINT && !topbar.classList.contains('is-collapsed')) {
            if (!previousState) {
                scheduleTopbarAutoCollapse();
            }
        } else if (window.innerWidth >= TOPBAR_COLLAPSE_BREAKPOINT) {
            cancelTopbarAutoCollapse();
        }
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

if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
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

const footerTopLink = document.querySelector('.site-footer__top-link');

if (footerTopLink) {
    footerTopLink.addEventListener('click', (event) => {
        event.preventDefault();
        const target = document.querySelector(footerTopLink.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
}
