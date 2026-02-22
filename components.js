// components.js – Enterprise Ready Full Version (Dynamic 3D FIXED & STABLE)

const componentsGrid = document.getElementById('components-grid');
const detailModal = document.getElementById('detail-modal');
const detailModalContent = document.getElementById('detail-modal-content');
const loadingState = document.getElementById('loading-state');
const errorState = document.getElementById('error-state');

let currentItem = null;
let currentType = null;
let lastFocusedElement = null;
let currentIndex = 0;
let pdfZoom = 1;

document.addEventListener('DOMContentLoaded', () => {

    if (!window.componentsData || componentsData.length === 0) {
        console.error("No components data found in data.js");
        showError();
        return;
    }

    loadComponents();
    setupGlobalEvents();
});


// ===============================
// LOAD COMPONENT CARDS
// ===============================
function loadComponents() {
    componentsGrid.innerHTML = '';
    componentsGrid.setAttribute('aria-busy', 'true');

    const fragment = document.createDocumentFragment();

    componentsData.forEach(component => {

        const card = document.createElement('div');
        card.className = 'item-card';
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `Open ${component.title}`);

        card.innerHTML = `
            <img src="${component.thumbnail}" 
                 class="item-image" 
                 alt="${component.title}" 
                 loading="lazy">
            <div class="item-title"><h3>${component.title}</h3></div>
        `;

        card.addEventListener('click', () => showComponentDetail(component));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                showComponentDetail(component);
            }
        });

        fragment.appendChild(card);
    });

    componentsGrid.appendChild(fragment);
    loadingState?.setAttribute('hidden', true);
    componentsGrid.setAttribute('aria-busy', 'false');
}


// ===============================
// DETAIL MODAL VIEW
// ===============================
function showComponentDetail(item) {

    lastFocusedElement = document.activeElement;
    currentItem = item;
    currentIndex = 0;
    pdfZoom = 1;

    currentItem.images = currentItem.images || [];
    currentItem.videos = currentItem.videos || [];
    currentItem.drawing = Array.isArray(currentItem.drawing) ? currentItem.drawing : [];
    currentItem.model3d = Array.isArray(currentItem.model3d) ? currentItem.model3d : [];

    currentType =
    currentItem.model3d.length ? 'model' :
    currentItem.images.length ? 'images' :
    currentItem.videos.length ? 'videos' :
    currentItem.drawing.length ? 'pdf' :
    'placeholder';

    detailModalContent.innerHTML = `
        <div class="detail-container">
            <button class="back-button" id="detail-back-button">← Back</button>
            <div class="detail-title"><h1>${item.title}</h1></div>
            <div class="media-grid" id="preview-container"></div>
            <button class="media-nav left" id="nav-left">&lt;</button>
            <button class="media-nav right" id="nav-right">&gt;</button>
            <div class="media-toolbar" id="media-toolbar"></div>
            <div class="action-buttons">
                ${currentItem.images.length ? `<button class="action-btn images" data-type="images">Images (${currentItem.images.length})</button>` : ''}
                ${currentItem.videos.length ? `<button class="action-btn videos" data-type="videos">Videos (${currentItem.videos.length})</button>` : ''}
                ${currentItem.drawing.length ? `<button class="action-btn drawing" data-type="pdf">Drawing</button>` : ''}
                ${currentItem.model3d.length ? `<button class="action-btn model" data-type="model">3D Model</button>` : ''}
            </div>
        </div>
    `;

    setActiveButton(document.querySelector(`.action-btn.${currentType}`));
    renderCurrentMedia();

    detailModal.classList.add('active');
    detailModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    detailModal.focus();

    setupDetailButtons();
    setupMediaNavigation();
}


// ===============================
// RENDER CURRENT MEDIA
// ===============================
function renderCurrentMedia() {

    const container = document.getElementById('preview-container');
    const toolbar = document.getElementById('media-toolbar');
    const navLeft = document.getElementById('nav-left');
    const navRight = document.getElementById('nav-right');

    if (!container) return;

    container.innerHTML = '';
    if (toolbar) toolbar.innerHTML = '';

    let mediaArray = [];

    switch (currentType) {
        case 'images': mediaArray = currentItem.images || []; break;
        case 'videos': mediaArray = currentItem.videos || []; break;
        case 'pdf': mediaArray = currentItem.drawing || []; break;
        case 'model': mediaArray = currentItem.model3d || []; break;
        default: mediaArray = [];
    }

    if (!mediaArray.length) {
        container.appendChild(createPlaceholder());
        return;
    }

    currentIndex = Math.max(0, Math.min(currentIndex, mediaArray.length - 1));
    const mediaSrc = mediaArray[currentIndex];

    let mediaElement;

    switch (currentType) {
        case 'images':
            mediaElement = createImageItem(mediaSrc);
            break;
        case 'videos':
            mediaElement = createVideoItem(mediaSrc);
            break;
        case 'pdf':
            mediaElement = createPdfItem(mediaSrc);
            break;
        case 'model':
            mediaElement = createModelItem(mediaSrc);
            addModelToolbar(toolbar, mediaElement);
            break;
        default:
            mediaElement = createPlaceholder();
    }

    container.appendChild(mediaElement);

    if (navLeft && navRight) {
        if (mediaArray.length <= 1 || currentType === 'model') {
            navLeft.classList.add('hidden');
            navRight.classList.add('hidden');
        } else {
            navLeft.classList.remove('hidden');
            navRight.classList.remove('hidden');
        }
    }
}


// ===============================
// 3D MODEL (FULLY FIXED)
// ===============================
function createModelItem(src) {

    const div = document.createElement('div');
    div.className = 'media-item';
    div.style.width = '100%';
    div.style.height = '80vh';
    div.style.minHeight = '500px';
    div.style.position = 'relative';
    div.style.backgroundColor = 'var(--light-color)';

    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'model-loading';
    loadingIndicator.innerHTML = 'Loading 3D model...';
    div.appendChild(loadingIndicator);

    customElements.whenDefined('model-viewer').then(() => {

        const modelViewer = document.createElement('model-viewer');

        modelViewer.src = src;
        modelViewer.alt = `${currentItem.title} 3D model`;
        modelViewer.setAttribute('camera-controls', '');
        modelViewer.setAttribute('auto-rotate', '');
        modelViewer.setAttribute('rotation-per-second', '30deg');
        modelViewer.setAttribute('shadow-intensity', '1');
        modelViewer.setAttribute('exposure', '1');
        modelViewer.setAttribute('loading', 'lazy');
        modelViewer.setAttribute('reveal', 'auto');
        modelViewer.setAttribute('ar', '');
        modelViewer.setAttribute('ar-modes', 'webxr scene-viewer quick-look');

        modelViewer.style.width = '100%';
        modelViewer.style.height = '100%';

        modelViewer.addEventListener('load', () => {
            loadingIndicator.style.display = 'none';
            console.log('✅ Model loaded:', src);
        });

        modelViewer.addEventListener('error', () => {
            loadingIndicator.innerHTML = `
                <div style="text-align:center; color: var(--accent-color);">
                    <p style="font-size:24px;">❌</p>
                    <p>Failed to load 3D model</p>
                    <p style="font-size:12px; color: var(--gray-color);">${src}</p>
                </div>
            `;
        });

        div.appendChild(modelViewer);
    });

    return div;
}


// ===============================
// TOOLBAR
// ===============================
function addModelToolbar(toolbar, container) {
    if (!toolbar) return;

    const fsBtn = document.createElement('button');
    fsBtn.textContent = "⛶ Fullscreen";
    fsBtn.onclick = () => {
        const model = container.querySelector('model-viewer');
        model?.requestFullscreen();
    };

    const arBtn = document.createElement('button');
    arBtn.textContent = "📱 View in AR";
    arBtn.onclick = () => {
        const model = container.querySelector('model-viewer');
        model?.activateAR();
    };

    toolbar.appendChild(fsBtn);
    toolbar.appendChild(arBtn);
}


// ===============================
// UTILITIES
// ===============================
function createImageItem(src) {
    const img = document.createElement('img');
    img.src = src;
    img.className = 'media-item';
    img.loading = 'lazy';
    return img;
}

function createVideoItem(src) {
    const video = document.createElement('video');
    video.src = src;
    video.controls = true;
    video.className = 'media-item';
    return video;
}

function createPdfItem(src) {
    const iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.className = 'media-item';
    return iframe;
}

function createPlaceholder() {
    const div = document.createElement('div');
    div.className = 'media-item';
    div.textContent = "No media available";
    return div;
}


// ===============================
function setupDetailButtons() {
    document.getElementById('detail-back-button')?.addEventListener('click', closeModal);
    document.getElementById('modal-close-btn')?.addEventListener('click', closeModal);

    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.onclick = () => {
            currentType = btn.dataset.type;
            currentIndex = 0;
            renderCurrentMedia();
            setActiveButton(btn);
        };
    });
}

function setupMediaNavigation() {
    document.getElementById('nav-left')?.addEventListener('click', () => changeMedia(-1));
    document.getElementById('nav-right')?.addEventListener('click', () => changeMedia(1));
}

function changeMedia(delta) {
    if (currentType === 'model') return;

    const mediaArray =
        currentType === 'images' ? currentItem.images :
        currentType === 'videos' ? currentItem.videos :
        currentType === 'pdf' ? currentItem.drawing : [];

    if (!mediaArray.length) return;

    currentIndex = (currentIndex + delta + mediaArray.length) % mediaArray.length;
    renderCurrentMedia();
}

function setActiveButton(btn) {
    document.querySelectorAll('.action-btn').forEach(b => b.classList.remove('active'));
    btn?.classList.add('active');
}

function setupGlobalEvents() {
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && detailModal.classList.contains('active')) {
            closeModal();
        }
    });

    detailModal.addEventListener('click', e => {
        if (e.target === detailModal) closeModal();
    });
}

function closeModal() {
    detailModal.classList.remove('active');
    detailModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    lastFocusedElement?.focus();
}

function showError() {
    loadingState?.setAttribute('hidden', true);
    errorState?.removeAttribute('hidden');
}