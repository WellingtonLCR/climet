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
