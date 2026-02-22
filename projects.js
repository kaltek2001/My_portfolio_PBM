// Projects Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    console.log('Projects page loaded');

    // Initialize page
    initProjectsPage();

    // Add any project-specific functionality here
    setupEventListeners();
});

function initProjectsPage() {
    console.log('Initializing projects page...');

    // Update any dynamic content
    updateDynamicContent();

    // Add animations or effects
    addAnimations();
}

function updateDynamicContent() {
    // You can add dynamic content updates here
    // For example, fetching project data from an API

    console.log('Updating dynamic content...');
}

function addAnimations() {
    // Add subtle animations to page elements
    const heroTitle = document.querySelector('.projects-hero h1');
    const comingSoonIcon = document.querySelector('.coming-soon-icon');

    if (heroTitle) {
        heroTitle.style.opacity = '0';
        heroTitle.style.transform = 'translateY(20px)';

        setTimeout(() => {
            heroTitle.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            heroTitle.style.opacity = '1';
            heroTitle.style.transform = 'translateY(0)';
        }, 300);
    }

    if (comingSoonIcon) {
        comingSoonIcon.style.opacity = '0';

        setTimeout(() => {
            comingSoonIcon.style.transition = 'opacity 1s ease';
            comingSoonIcon.style.opacity = '1';
        }, 800);
    }
}

function setupEventListeners() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Only handle internal page anchors
            if (href !== '#' && href.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(href);

                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Button hover effects
    const buttons = document.querySelectorAll('.cta-button');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.02)';
        });

        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Contact form simulation (if you add a form later)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Contact form submitted');
            // Add form submission logic here
        });
    }
}

// Utility function for future project loading
function loadProjectsData() {
    // This function can be used to load projects from JSON or API
    return new Promise((resolve) => {
        // Simulate loading
        setTimeout(() => {
            resolve([]); // Empty array for now
        }, 500);
    });
}

// Export functions if using modules (optional)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initProjectsPage,
        loadProjectsData
    };
}