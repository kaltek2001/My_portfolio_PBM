// Set current year in footer (if present)
const yearEl = document.getElementById('current-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Mobile menu functionality (if not already handled globally)
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const navLinks = document.getElementById('nav-links');

if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuBtn.setAttribute('aria-expanded', navLinks.classList.contains('active'));
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        });
    });
}

// Back to top button
const backToTop = document.getElementById('back-to-top');
if (backToTop) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Intersection Observer for scroll animations
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll(
        '.timeline-item, .certification-card, .skill-category, .soft-skill-category, .course-tag'
    );

    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -30px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                // Trigger progress bar animation with a small delay
                const progressBars = entry.target.querySelectorAll('.progress-bar span');
                progressBars.forEach(bar => {
                    const width = bar.style.width; // already set inline
                    bar.style.transition = 'width 1s ease';
                });
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));

    // Force progress bars to animate if already in view
    setTimeout(() => {
        document.querySelectorAll('.progress-bar span').forEach(bar => {
            bar.style.width = bar.style.width; // trigger reflow
        });
    }, 100);

    // ===== IMPROVED: Expandable details functionality =====
    const expandButtons = document.querySelectorAll('.btn-expand');
    expandButtons.forEach(button => {
        button.addEventListener('click', () => {
            const expanded = button.getAttribute('aria-expanded') === 'true' ? false : true;
            button.setAttribute('aria-expanded', expanded);
            const targetId = button.getAttribute('aria-controls');
            const target = document.getElementById(targetId);
            if (target) {
                target.hidden = !expanded;
            }
        });
    });

    // ===== IMPROVED: Tooltip enhancement for better accessibility =====
    // (Already handled via CSS, but we can add ARIA labels)
    document.querySelectorAll('[data-tooltip]').forEach(el => {
        el.setAttribute('aria-label', el.getAttribute('data-tooltip'));
    });

    // ===== IMPROVED: Optional smooth reveal for new elements =====
    // (Already covered by Intersection Observer)
});