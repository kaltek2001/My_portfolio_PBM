// Load header and footer from partials folder
async function loadPartial(elementId, filePath) {
    try {
        console.log(`Loading: ${filePath}`);
        const response = await fetch(filePath);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const html = await response.text();
        document.getElementById(elementId).innerHTML = html;

        // Initialize after loading
        if (filePath.includes('header')) {
            console.log('Initializing header...');
            initHeader();
        }
        if (filePath.includes('footer')) {
            console.log('Initializing footer...');
            initFooter();
        }

    } catch (error) {
        console.error(`Error loading ${filePath}:`, error);
        document.getElementById(elementId).innerHTML = `
            <div style="
                padding: 20px;
                margin: 10px;
                background: #ffebee;
                color: #c62828;
                border: 1px solid #ef5350;
                border-radius: 5px;
            ">
                <strong>Error loading ${filePath}</strong><br>
                ${error.message}<br>
                <small>Current folder: ${window.location.pathname}</small>
            </div>
        `;
    }
}

function initHeader() {
    console.log('Setting active nav links...');

    // Set active nav link
    const currentPage = window.location.pathname.split('/').pop() || 'home.html';
    console.log('Current page:', currentPage);

    const navLinks = document.querySelectorAll('.nav-link');
    console.log('Found nav links:', navLinks.length);

    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage) {
            link.classList.add('active');
            console.log(`Activated: ${linkHref}`);
        }
    });

    // Mobile menu toggle
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
        console.log('Mobile menu initialized');
    }
}

function initFooter() {
    console.log('Initializing footer...');

    // Update copyright year
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
        console.log('Copyright year updated');
    }
}

// Load when page is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, loading partials...');

    // IMPORTANT: Paths must be correct!
    loadPartial('header-container', 'partials/header.html');
    loadPartial('footer-container', 'partials/footer.html');
});