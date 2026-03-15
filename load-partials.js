// load-partials.js – Improved version
(function() {
    'use strict';

    const DEBUG = true;
    function log(...args) { if (DEBUG) console.log(...args); }

    // Use forward slashes – works everywhere
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
            // Add cache busting for development (optional)
            const url = DEBUG ? `${filePath}?t=${Date.now()}` : filePath;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const html = await response.text();
            container.innerHTML = html;

            // After loading, run specific initialisers
            if (filePath.includes('header')) {
                initHeader();
            }
            if (filePath.includes('footer')) {
                initFooter();
            }

        } catch (error) {
            console.error(`Error loading ${filePath}:`, error);
            showErrorInContainer(container, filePath, error.message);
        }
    }

    function showErrorInContainer(container, filePath, message) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            padding: 20px;
            margin: 10px;
            background: #ffebee;
            color: #c62828;
            border: 1px solid #ef5350;
            border-radius: 5px;
        `;
        errorDiv.textContent = `Error loading ${filePath}: ${message}`;
        container.appendChild(errorDiv);
    }

    // ===== HEADER INITIALISATION =====
    function initHeader() {
        setActiveNavLink();
        setupMobileMenu();
    }

    function setActiveNavLink() {
        const navLinks = document.querySelectorAll('.nav-link');
        if (!navLinks.length) return;

        // Get current page filename (e.g., 'home.html', 'experiences.html')
        const currentPath = window.location.pathname;
        const currentFile = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'home.html';

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            // Extract filename from href (ignore query/hash)
            const linkFile = href.substring(href.lastIndexOf('/') + 1).split('?')[0].split('#')[0];

            if (linkFile === currentFile) {
                link.classList.add('active');
                log(`Activated: ${link.href}`);
            } else {
                link.classList.remove('active');
            }
        });
    }

    function setupMobileMenu() {
        const mobileToggle = document.getElementById('mobile-menu-toggle');
        const navMenu = document.querySelector('.nav-menu');

        if (!mobileToggle || !navMenu) {
            log('Mobile menu elements not found – skipping setup');
            return;
        }

        // Use a flag to prevent duplicate click listeners on the same element
        if (!mobileToggle._listenerAttached) {
            mobileToggle.addEventListener('click', toggleMobileMenu);
            mobileToggle._listenerAttached = true;
        }

        // Ensure aria-expanded attribute
        if (!mobileToggle.hasAttribute('aria-expanded')) {
            mobileToggle.setAttribute('aria-expanded', 'false');
        }

        // Close menu when a nav link is clicked (using event delegation to avoid many listeners)
        navMenu.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                closeMobileMenu();
            }
        });
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

    // ===== GLOBAL ESCAPE KEY HANDLER (set up once) =====
    function setupGlobalEscapeKey() {
        if (window._escapeListenerAdded) return;
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const navMenu = document.querySelector('.nav-menu');
                if (navMenu && navMenu.classList.contains('active')) {
                    closeMobileMenu();
                }
            }
        });
        window._escapeListenerAdded = true;
    }

    // ===== FOOTER INITIALISATION =====
    function initFooter() {
        // Update copyright year
        const yearElement = document.getElementById('current-year');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }

        setupBackToTop();
    }

    function setupBackToTop() {
        const backToTop = document.querySelector('.back-to-top');
        if (!backToTop) return;

        // Use a flag to prevent duplicate scroll listeners
        if (window._backToTopInitialised) return;

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

    // ===== LOAD PARTIALS WHEN DOM IS READY =====
    document.addEventListener('DOMContentLoaded', async function() {
        log('DOM loaded, loading partials...');

        // Set up global Escape listener once
        setupGlobalEscapeKey();

        // Load both partials in parallel
        try {
            await Promise.all([
                loadPartial('header-container', PARTIAL_PATHS.header),
                loadPartial('footer-container', PARTIAL_PATHS.footer)
            ]);
            log('All partials loaded successfully');

            // Dispatch a custom event so page‑specific scripts can run after partials are ready
            document.dispatchEvent(new CustomEvent('partialsLoaded'));
        } catch (error) {
            console.error('One or more partials failed to load:', error);
        }
    });
})();