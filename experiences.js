// ========== EXPERIENCE DATA ==========
const experiencesData = [
    {
        title: "CNC Operator/Programmer",
        company: "Protectolite Composites Inc.",
        location: "North York, ON",
        startDate: "2025-01-01",
        endDate: null,
        tools: ["G-Code", "CNC Machining", "Calipers", "Micrometers", "FRP Composites", "Quality Control"],
        responsibilities: [
            "Program and operate CNC machine using G-code to manufacture precision parts from FRP (Fiberglass Reinforced Plastic) sheets and composite materials.",
            "Produce high-quality components for wastewater systems, electrical insulation applications, and custom vehicle parts, meeting tight tolerances and client specifications.",
            "Interpret engineering drawings, CAD models, and Bills of Materials (BOMs) to plan and execute accurate machining operations.",
            "Perform dimensional inspections using calipers, micrometers, and height gauges, documenting all quality assurance results to maintain production standards.",
            "Collaborate with engineers and production teams to resolve machining challenges, optimize tool paths, and support continuous improvement initiatives.",
            "Maintain a safe, organized, and compliant work environment, ensuring efficient operation of all CNC and shop equipment."
        ]
        // achievements removed
    },
    {
        title: "Design Assistant (Part-Time)",
        company: "Kris Design & Build",
        location: "Scarborough, ON, Canada",
        startDate: "2024-06-01",
        endDate: "2024-12-31",
        tools: ["AutoCAD", "Architectural Drawings", "Client Collaboration", "Version Control", "Material Selection"],
        responsibilities: [
            "Created precise 2D architectural drawings in AutoCAD, adhering to industry standards and project specifications.",
            "Collaborated with clients and multidisciplinary design teams to integrate feedback and recommend materials and finishes that enhance design functionality and aesthetic quality.",
            "Managed and organized design documentation, including specifications, drawing versions, and schedules, ensuring project consistency.",
            "Supported project delivery and client satisfaction through effective timeline coordination and cross-functional communication.",
            "Maintained compliance with regulatory guidelines and quality standards through consistent version control and internal review processes."
        ]
        // achievements removed
    },
    {
        title: "Tool Crib Attendant (Machine Shop)",
        company: "Centennial College",
        location: "Scarborough, ON, Canada",
        startDate: "2023-01-01",
        endDate: "2023-04-30",
        tools: ["Inventory Management", "Tool Inspection", "Safety Compliance", "Data Reporting", "Procurement"],
        responsibilities: [
            "Maintained precise inventory records, performed regular audits, and managed procurement to ensure continuous tool availability and operational efficiency.",
            "Oversaw the issuance, tracking, and inspection of tools, performing minor repairs, and coordinating replacements with maintenance teams.",
            "Ensured proper tool storage and safety compliance, generating detailed reports on tool usage, inventory levels, and equipment performance to support data-driven improvements."
        ]
        // achievements removed
    }
];

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
function renderTimeline() {
    const container = document.getElementById('timeline');
    if (!container) return;

    container.innerHTML = '';

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
                <div class="company"><i class="fas fa-building"></i> ${job.company}</div>
            </div>
            <div class="header-right">
                <div class="location"><i class="fas fa-map-marker-alt"></i> ${job.location}</div>
                <div class="period"><i class="fas fa-calendar"></i> ${periodDisplay}</div>
                <span class="duration-badge"><i class="far fa-clock"></i> ${duration}</span>
            </div>
        `;
        card.appendChild(header);

        // Tools
        if (job.tools && job.tools.length) {
            const toolsSection = document.createElement('div');
            toolsSection.className = 'tools-section';
            toolsSection.innerHTML = `
                <h4><i class="fas fa-wrench"></i> Tools & Technologies</h4>
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
            <h4><i class="fas fa-tasks"></i> Responsibilities</h4>
            <ul class="responsibilities-list" id="resp-${index}">
                ${job.responsibilities.map(r => `
                    <li><i class="fas fa-check-circle"></i> ${r}</li>
                `).join('')}
            </ul>
        `;
        card.appendChild(respSection);

        // Expand/Collapse Button
        const expandBtn = document.createElement('button');
        expandBtn.className = 'expand-btn';
        expandBtn.innerHTML = '<span>Show less</span> <i class="fas fa-chevron-up"></i>';
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
function updateCareerSummary() {
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

// ========== INIT ==========
document.addEventListener('DOMContentLoaded', function() {
    const yearEl = document.getElementById('current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    const mobileBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');
    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileBtn.setAttribute('aria-expanded', navLinks.classList.contains('active'));
        });
    }

    renderTimeline();
    updateCareerSummary();
});