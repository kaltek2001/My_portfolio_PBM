// assemblies.js - Specific to Assemblies page using data.js

// DOM Elements specific to assemblies page
const assembliesGrid = document.getElementById('assemblies-grid');
const detailModal = document.getElementById('detail-modal');
const detailModalContent = document.getElementById('detail-modal-content');

// Initialize the assemblies page
document.addEventListener('DOMContentLoaded', function() {
    if (!window.assembliesData || assembliesData.length === 0) {
        console.error("No assemblies data found in data.js");
        return;
    }

    loadAssemblies();
    setupAssembliesEventListeners();
});

function loadAssemblies() {
    assembliesGrid.innerHTML = '';

    assembliesData.forEach(assembly => {
        const assemblyCard = document.createElement('div');
        assemblyCard.className = 'item-card';
        assemblyCard.innerHTML = `
            <img src="${assembly.thumbnail}" alt="${assembly.title}" class="item-image">
            <div class="item-title">
                <h3>${assembly.title}</h3>
            </div>
        `;

        assemblyCard.addEventListener('click', () => showAssemblyDetail(assembly));

        assembliesGrid.appendChild(assemblyCard);
    });
}

function setupAssembliesEventListeners() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-links');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => navMenu.classList.toggle('active'));
    }
}

function showAssemblyDetail(assembly) {
    detailModalContent.innerHTML = generateDetailContent(assembly);
    detailModal.classList.add('active');
    setupDetailEventListeners();
}

function generateDetailContent(item) {
    const hasImages = item.images && item.images.length > 0;
    const hasVideos = item.videos && item.videos.length > 0;
    const hasDrawing = item.drawing && item.drawing.trim() !== '';
    const hasModel3d = item.model3d && item.model3d.trim() !== '';

    let content = `
        <div class="detail-container">
            <button class="back-button" id="detail-back-button">
                <i class="fas fa-arrow-left"></i> Back to Assemblies
            </button>
            
            <div class="detail-title">
                <h1>${item.title}</h1>
            </div>
            
            <div class="media-grid">
    `;

    if (hasImages) {
        item.images.forEach((image, index) => {
            content += `
                <div class="media-item" data-type="image" data-index="${index}">
                    <img src="${image}" alt="${item.title} - Image ${index + 1}">
                </div>
            `;
        });
    }

    if (hasVideos) {
        item.videos.forEach((video, index) => {
            content += `
                <div class="media-item" data-type="video" data-index="${index}">
                    <video>
                        <source src="${video}" type="video/mp4">
                    </video>
                    <div class="video-overlay">
                        <i class="fas fa-play"></i>
                    </div>
                </div>
            `;
        });
    }

    if (!hasImages && !hasVideos) {
        content += `
            <div class="media-item">
                <div class="media-placeholder">
                    <i class="fas fa-image"></i>
                    <p>No images or videos available</p>
                </div>
            </div>
        `;
    }

    content += `<div class="action-buttons">`;

    if (hasImages) content += `<button class="action-btn images" data-action="images"><i class="fas fa-images"></i> Images</button>`;
    if (hasVideos) content += `<button class="action-btn videos" data-action="videos"><i class="fas fa-video"></i> Videos</button>`;
    if (hasDrawing) content += `<button class="action-btn drawing" data-action="drawing" data-file="${item.drawing}"><i class="fas fa-file-pdf"></i> Drawing</button>`;
    if (hasModel3d) content += `<button class="action-btn model" data-action="model" data-file="${item.model3d}"><i class="fas fa-cube"></i> 3D Model</button>`;

    content += `</div></div>`;
    return content;
}

function setupDetailEventListeners() {
    const backButton = document.getElementById('detail-back-button');
    if (backButton) backButton.addEventListener('click', () => detailModal.classList.remove('active'));
}