// load-partials.js – Updated version with improvements

(function() {
    'use strict';

    // Set to false in production to disable console logs
    const DEBUG = true;

    function log(...args) {
        if (DEBUG) console.log(...args);
    }

    // Configuration – adjust paths as needed
    const PARTIAL_PATHS = {
        header: 'partials/header.html',
        footer: 'partials/footer.html'
    };

    // ===== LOAD PARTIAL =====
    async function loadPartial(elementId, filePath) {
        const container = document.getElementById(elementId);
        if (!container) {
            console.error(`Container #${elementId} not found – cannot load ${filePath}`);
            return;
        }

        try {
            log(`Loading: ${filePath}`);
            const response = await fetch(filePath);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const html = await response.text();
            container.innerHTML = html;

            // Initialize after loading
            if (filePath.includes('header')) {
                log('Initializing header...');
                initHeader();
            }
            if (filePath.includes('footer')) {
                log('Initializing footer...');
                initFooter();
            }

        } catch (error) {
            console.error(`Error loading ${filePath}:`, error);
            // Safely inject error message (avoid innerHTML with user‑controlled content)
            const errorDiv = document.createElement('div');
            errorDiv.style.cssText = `
                padding: 20px;
                margin: 10px;
                background: #ffebee;
                color: #c62828;
                border: 1px solid #ef5350;
                border-radius: 5px;
            `;
            errorDiv.textContent = `Error loading ${filePath}: ${error.message}`;
            container.appendChild(errorDiv);
        }
    }

    // ===== HEADER INITIALISATION =====
    function initHeader() {
        setActiveNavLink();

        // Mobile menu setup
        const mobileToggle = document.getElementById('mobile-menu-toggle');
        const navMenu = document.querySelector('.nav-menu');

        if (mobileToggle && navMenu) {
            // Prevent duplicate listeners – remove any existing listener and re‑attach
            // (We'll use a flag on the element to track if listener is already attached)
            if (!mobileToggle._listenerAttached) {
                mobileToggle.addEventListener('click', toggleMobileMenu);
                mobileToggle._listenerAttached = true;
                log('Mobile menu listener attached');
            }

            // Ensure aria-expanded attribute exists
            if (!mobileToggle.hasAttribute('aria-expanded')) {
                mobileToggle.setAttribute('aria-expanded', 'false');
            }

            // Close menu with Escape key
            document.addEventListener('keydown', function onEscape(e) {
                if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                    closeMobileMenu();
                }
            });

            // Close menu when a nav link is clicked (optional, improves UX)
            navMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', closeMobileMenu);
            });
        }
    }

    function toggleMobileMenu() {
        const navMenu = document.querySelector('.nav-menu');
        const mobileToggle = document.getElementById('mobile-menu-toggle');
        if (!navMenu || !mobileToggle) return;

        const isActive = navMenu.classList.toggle('active');
        mobileToggle.classList.toggle('active');
        mobileToggle.setAttribute('aria-expanded', isActive);
    }

    function closeMobileMenu() {
        const navMenu = document.querySelector('.nav-menu');
        const mobileToggle = document.getElementById('mobile-menu-toggle');
        if (!navMenu || !mobileToggle) return;

        navMenu.classList.remove('active');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
    }

    // ===== ACTIVE NAV LINK =====
    function setActiveNavLink() {
        const navLinks = document.querySelectorAll('.nav-link');
        if (!navLinks.length) return;

        // Get current page pathname (without query or hash)
        const currentPath = window.location.pathname;

        navLinks.forEach(link => {
            // Build absolute path from link's href
            const linkPath = new URL(link.href, window.location.origin).pathname;
            if (linkPath === currentPath) {
                link.classList.add('active');
                log(`Activated: ${link.href}`);
            } else {
                link.classList.remove('active');
            }
        });
    }

    // ===== FOOTER INITIALISATION =====
    function initFooter() {
        // Update copyright year
        const yearElement = document.getElementById('current-year');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
            log('Copyright year updated');
        }

        // Back‑to‑top button functionality
        const backToTop = document.querySelector('.back-to-top');
        if (backToTop) {
            // Use a flag to prevent duplicate scroll listeners
            if (!window._backToTopInitialised) {
                const toggleBackToTop = () => {
                    if (window.scrollY > 300) {
                        backToTop.classList.add('visible');
                    } else {
                        backToTop.classList.remove('visible');
                    }
                };

                window.addEventListener('scroll', toggleBackToTop, { passive: true });
                toggleBackToTop(); // initial check

                backToTop.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                });

                window._backToTopInitialised = true;
                log('Back‑to‑top initialised');
            }
        }
    }

    // ===== LOAD PARTIALS WHEN DOM IS READY =====
    document.addEventListener('DOMContentLoaded', async function() {
        log('DOM loaded, loading partials...');

        // Load both partials in parallel for better performance
        try {
            await Promise.all([
                loadPartial('header-container', PARTIAL_PATHS.header),
                loadPartial('footer-container', PARTIAL_PATHS.footer)
            ]);
            log('All partials loaded successfully');
        } catch (error) {
            console.error('One or more partials failed to load:', error);
        }
    });
})();