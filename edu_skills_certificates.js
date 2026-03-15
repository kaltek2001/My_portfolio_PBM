// edu_skills_certificates.js – Page‑specific animations and interactions

(function() {
    'use strict';

    // ===== PAUSE HERO ANIMATION WHEN PAGE HIDDEN =====
    (function pauseAnimationWhenHidden() {
        const heroGear = document.querySelector('.hero-gear');
        if (!heroGear) return;

        const handleVisibilityChange = () => {
            heroGear.style.animationPlayState = document.hidden ? 'paused' : 'running';
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
    })();

    // ===== INTERSECTION OBSERVER FOR SCROLL ANIMATIONS =====
    document.addEventListener('DOMContentLoaded', () => {
        const animatedElements = document.querySelectorAll(
            '.timeline-item, .certification-card, .skill-category, .soft-skill-category, .course-tag'
        );

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');

                    // Trigger progress bar animation
                    const progressBars = entry.target.querySelectorAll('.progress-bar span');
                    progressBars.forEach(bar => {
                        // Use requestAnimationFrame to ensure smooth transition
                        requestAnimationFrame(() => {
                            bar.style.transition = 'width 1s ease';
                            // Force reflow by reading offsetWidth
                            void bar.offsetWidth;
                            // Width is already set inline, no need to set again
                        });
                    });

                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2, rootMargin: '0px 0px -30px 0px' });

        animatedElements.forEach(el => observer.observe(el));

        // Also trigger for any progress bars already in view
        setTimeout(() => {
            document.querySelectorAll('.progress-bar span').forEach(bar => {
                requestAnimationFrame(() => {
                    bar.style.transition = 'width 1s ease';
                    void bar.offsetWidth;
                });
            });
        }, 100);

        // ===== EXPANDABLE DETAILS FUNCTIONALITY =====
        const expandButtons = document.querySelectorAll('.btn-expand');
        expandButtons.forEach(button => {
            // Store show/hide texts if not already stored
            if (!button.dataset.showText) {
                button.dataset.showText = 'Show achievements';
                button.dataset.hideText = 'Hide achievements';
            }

            button.addEventListener('click', () => {
                const expanded = button.getAttribute('aria-expanded') === 'true' ? false : true;
                button.setAttribute('aria-expanded', expanded);

                const targetId = button.getAttribute('aria-controls');
                const target = document.getElementById(targetId);
                if (target) {
                    target.hidden = !expanded;
                }

                // Update button text and icon
                const icon = button.querySelector('i');
                const textSpan = button.querySelector('span') || button.childNodes[1]; // adjust if structure differs
                if (textSpan) {
                    textSpan.textContent = expanded ? button.dataset.hideText : button.dataset.showText;
                }
                if (icon) {
                    icon.className = expanded ? 'fas fa-chevron-up' : 'fas fa-chevron-down';
                }
            });
        });

        // ===== TOOLTIP ACCESSIBILITY =====
        document.querySelectorAll('[data-tooltip]').forEach(el => {
            if (!el.hasAttribute('aria-label')) {
                el.setAttribute('aria-label', el.getAttribute('data-tooltip'));
            }
        });
    });
})();