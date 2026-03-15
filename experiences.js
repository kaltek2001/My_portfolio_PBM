// ========== LOAD EXPERIENCE DATA FROM JSON ==========
async function loadExperiences() {
    try {
        const response = await fetch('data\\experiences.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to load experiences:', error);
        const container = document.getElementById('timeline');
        if (container) {
            container.innerHTML = '<p class="error-message">Unable to load experiences. Please try again later.</p>';
        }
        return []; // fallback empty array
    }
}

// ========== HELPER FUNCTIONS ==========
function calculateDuration(startDate, endDate) {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();

    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();

    if (months < 0) {
        years--;
        months += 12;
    }

    const parts = [];
    if (years > 0) parts.push(`${years} yr${years > 1 ? 's' : ''}`);
    if (months > 0) parts.push(`${months} mo${months > 1 ? 's' : ''}`);
    if (parts.length === 0) return '< 1 mo';

    return parts.join(' ');
}

function formatDateRange(startDate, endDate) {
    const start = new Date(startDate);
    const startStr = start.toLocaleString('en-US', { month: 'short', year: 'numeric' });
    const endStr = endDate ? new Date(endDate).toLocaleString('en-US', { month: 'short', year: 'numeric' }) : 'Present';
    return `${startStr} – ${endStr}`;
}

// ========== RENDER TIMELINE ==========
function renderTimeline(experiencesData) {
    const container = document.getElementById('timeline');
    if (!container) return;

    container.innerHTML = '';

    if (!experiencesData.length) {
        container.innerHTML = '<p class="no-data">No experience entries to display.</p>';
        return;
    }

    experiencesData.forEach((job, index) => {
        const periodDisplay = formatDateRange(job.startDate, job.endDate);
        const duration = calculateDuration(job.startDate, job.endDate);

        const item = document.createElement('div');
        item.className = 'timeline-item';
        item.dataset.index = index;

        const dotCol = document.createElement('div');
        dotCol.className = 'timeline-dot';

        const card = document.createElement('div');
        card.className = 'experience-card';

        // Header
        const header = document.createElement('div');
        header.className = 'card-header';
        header.innerHTML = `
            <div class="header-left">
                <h3>${job.title}</h3>
                <div class="company"><i class="fas fa-building" aria-hidden="true"></i> ${job.company}</div>
            </div>
            <div class="header-right">
                <div class="location"><i class="fas fa-map-marker-alt" aria-hidden="true"></i> ${job.location}</div>
                <div class="period"><i class="fas fa-calendar" aria-hidden="true"></i> ${periodDisplay}</div>
                <span class="duration-badge"><i class="far fa-clock" aria-hidden="true"></i> ${duration}</span>
            </div>
        `;
        card.appendChild(header);

        // Tools
        if (job.tools && job.tools.length) {
            const toolsSection = document.createElement('div');
            toolsSection.className = 'tools-section';
            toolsSection.innerHTML = `
                <h4><i class="fas fa-wrench" aria-hidden="true"></i> Tools & Technologies</h4>
                <div class="tool-tags">
                    ${job.tools.map(tool => `<span class="tool-tag">${tool}</span>`).join('')}
                </div>
            `;
            card.appendChild(toolsSection);
        }

        // Responsibilities
        const respSection = document.createElement('div');
        respSection.className = 'responsibilities-section';
        respSection.innerHTML = `
            <h4><i class="fas fa-tasks" aria-hidden="true"></i> Responsibilities</h4>
            <ul class="responsibilities-list" id="resp-${index}">
                ${job.responsibilities.map(r => `
                    <li><i class="fas fa-check-circle" aria-hidden="true"></i> ${r}</li>
                `).join('')}
            </ul>
        `;
        card.appendChild(respSection);

        // Expand/Collapse Button
        const expandBtn = document.createElement('button');
        expandBtn.className = 'expand-btn';
        expandBtn.innerHTML = '<span>Show less</span> <i class="fas fa-chevron-up" aria-hidden="true"></i>';
        expandBtn.setAttribute('aria-expanded', 'true');
        expandBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const list = document.getElementById(`resp-${index}`);
            const isExpanded = this.classList.toggle('active');
            list.classList.toggle('collapsed', !isExpanded);
            this.querySelector('span').textContent = isExpanded ? 'Show less' : 'Show more';
            this.setAttribute('aria-expanded', isExpanded);
        });
        card.appendChild(expandBtn);

        item.appendChild(dotCol);
        item.appendChild(card);
        container.appendChild(item);
    });

    setupScrollReveal();
}

// ========== SCROLL REVEAL ==========
function setupScrollReveal() {
    const items = document.querySelectorAll('.timeline-item');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' });

    items.forEach(item => observer.observe(item));
}

// ========== UPDATE CAREER SUMMARY ==========
function updateCareerSummary(experiencesData) {
    const totalMonths = experiencesData.reduce((acc, job) => {
        const start = new Date(job.startDate);
        const end = job.endDate ? new Date(job.endDate) : new Date();
        const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
        return acc + months;
    }, 0);

    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;
    let totalExpStr = '';
    if (years > 0) totalExpStr += `${years}+ year${years > 1 ? 's' : ''}`;
    if (months > 0) totalExpStr += ` ${months} month${months > 1 ? 's' : ''}`;
    if (totalExpStr === '') totalExpStr = '< 1 month';

    const totalExpEl = document.getElementById('total-exp');
    if (totalExpEl) totalExpEl.textContent = totalExpStr;
}

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', async function() {
    // Set current year (if element exists)
    const yearEl = document.getElementById('current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Mobile menu toggle (if elements exist)
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');
    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileBtn.setAttribute('aria-expanded', navLinks.classList.contains('active'));
        });
    }

    // Show loading indicator
    const timelineContainer = document.getElementById('timeline');
    if (timelineContainer) {
        timelineContainer.innerHTML = '<div class="loading-spinner">Loading experiences...</div>';
    }

    // Load experiences and render
    const experiences = await loadExperiences();
    renderTimeline(experiences);
    updateCareerSummary(experiences);
});