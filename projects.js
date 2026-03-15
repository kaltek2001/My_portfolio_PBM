// Projects Page JavaScript - Improved version
(function() {
    'use strict';

    // Wait for the DOM and any dynamically loaded header/footer
    function domReady() {
        return new Promise(resolve => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });
    }

    // Ensure header is loaded before measuring its height
    function waitForHeader() {
        return new Promise(resolve => {
            const header = document.querySelector('#header-container header');
            if (header) {
                resolve(header);
            } else {
                // If header not yet present, observe DOM changes
                const observer = new MutationObserver((mutations, obs) => {
                    const header = document.querySelector('#header-container header');
                    if (header) {
                        obs.disconnect();
                        resolve(header);
                    }
                });
                observer.observe(document.body, { childList: true, subtree: true });
            }
        });
    }

    async function init() {
        console.log('Projects page initialised');

        // Add entrance animations
        addAnimations();

        // Set up smooth scrolling and focus management
        await setupSmoothScroll();

        // (Optional) Additional initialisation can go here
    }

    function addAnimations() {
        const heroTitle = document.querySelector('.projects-hero h1');
        const comingSoonIcon = document.querySelector('.coming-soon-icon');

        // Add classes for initial hidden state
        if (heroTitle) {
            heroTitle.classList.add('animate-title');
        }
        if (comingSoonIcon) {
            comingSoonIcon.classList.add('animate-icon');
        }

        // Trigger fade-in after a short delay (respects prefers-reduced-motion)
        const motionMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (!motionMediaQuery.matches) {
            setTimeout(() => {
                if (heroTitle) heroTitle.classList.add('fade-in');
            }, 300);
            setTimeout(() => {
                if (comingSoonIcon) comingSoonIcon.classList.add('fade-in');
            }, 800);
        } else {
            // If user prefers reduced motion, make elements visible immediately
            if (heroTitle) {
                heroTitle.style.opacity = '1';
                heroTitle.style.transform = 'translateY(0)';
            }
            if (comingSoonIcon) {
                comingSoonIcon.style.opacity = '1';
            }
        }
    }

    async function setupSmoothScroll() {
        // Wait for header to be fully loaded so we can measure its height
        const header = await waitForHeader().catch(() => null);
        const headerHeight = header ? header.offsetHeight : 80; // fallback to 80px

        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#' || !href.startsWith('#')) return;

                e.preventDefault();
                const targetElement = document.querySelector(href);
                if (!targetElement) {
                    console.warn(`Smooth scroll target not found: ${href}`);
                    return;
                }

                // Scroll to target with dynamic offset
                window.scrollTo({
                    top: targetElement.offsetTop - headerHeight,
                    behavior: 'smooth'
                });

                // Manage focus for accessibility
                targetElement.setAttribute('tabindex', '-1');
                targetElement.focus({ preventScroll: true }); // preventScroll avoids double scrolling

                // Optionally remove tabindex after losing focus
                targetElement.addEventListener('blur', function onBlur() {
                    targetElement.removeAttribute('tabindex');
                    targetElement.removeEventListener('blur', onBlur);
                }, { once: true });
            });
        });
    }

    // Start the initialisation once DOM is ready
    domReady().then(init);
})();