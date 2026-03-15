const assembliesGrid = document.getElementById('assemblies-grid');
const detailModal = document.getElementById('detail-modal');
const errorState = document.getElementById('error-state');

let currentItem = null;
let currentType = null;
let lastFocusedElement = null;
let currentIndex = 0;
let keyboardListener = null;

document.addEventListener('DOMContentLoaded', () => {
    initializeAssemblies();
});

async function initializeAssemblies() {
    try {
        const response = await fetch('assemblies.json');
        if (!response.ok) throw new Error('Network error');
        const assembliesData = await response.json();
        
        window.assembliesData = assembliesData;
        
        if (!window.assembliesData || window.assembliesData.length === 0) {
            showError('No assemblies data available');
            return;
        }

        loadAssemblies();
    } catch (error) {
        console.error('Failed to load assemblies.json:', error);
        showError('Failed to load assemblies');
    }
}

function loadAssemblies() {
    try {
        assembliesGrid.innerHTML = '';
        hideError();

        window.assembliesData.forEach(assembly => {
            const card = createAssemblyCard(assembly);
            assembliesGrid.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading assemblies:', error);
        showError('Failed to load assemblies');
    }
}

function createAssemblyCard(assembly) {
    const card = document.createElement('div');
    
    card.className = 'item-card';
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `View details for ${assembly.title}`);
    card.dataset.title = assembly.title;
    
    card.innerHTML = `
        <img src="${assembly.thumbnail}" 
             class="item-image" 
             alt="${assembly.title}"
             loading="lazy">
        <div class="item-title">
            <h3>${assembly.title}</h3>
        </div>
    `;

    card.addEventListener('click', () => showAssemblyDetail(assembly));
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            showAssemblyDetail(assembly);
        }
    });

    return card;
}

function showAssemblyDetail(item) {
    lastFocusedElement = document.activeElement;
    
    currentItem = {
        ...item,
        images: item.images || [],
        videos: item.videos || [],
        drawing: item.drawing || [],
        model3d: item.model3d || []
    };
    
    currentIndex = 0;
    currentType = determineInitialMediaType(currentItem);
    
    populateModalContent();
    renderCurrentMedia(); // This line was missing in your original – added for consistency
    
    detailModal.classList.add('active');
    detailModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    
    setupModalEventListeners();
    
    setTimeout(() => {
        const firstFocusable = document.querySelector('.action-btn, .back-button, .modal-close');
        if (firstFocusable) {
            firstFocusable.focus();
        } else {
            document.querySelector('.detail-modal-content')?.focus();
        }
    }, 100);
}

function determineInitialMediaType(item) {
    if (item.model3d.length) return 'model';
    if (item.images.length) return 'images';
    if (item.videos.length) return 'videos';
    if (item.drawing.length) return 'pdf';
    return null;
}

function populateModalContent() {
    const modalContent = document.querySelector('.detail-modal-content');
    
    modalContent.innerHTML = `
        <button class="back-button" id="detail-back-button" aria-label="Go back">← Back</button>
        <button class="modal-close" id="modal-close-btn" aria-label="Close modal">&times;</button>
        
        <h2 class="detail-title" id="detail-title">${currentItem.title}</h2>
        
        <div class="action-buttons" id="action-buttons">
            ${createActionButtons()}
        </div>
        
        <div class="viewer-section">
            <div id="preview-container" class="media-grid"></div>
        </div>
        
        <div class="media-toolbar" id="media-toolbar"></div>
    `;
}

function createActionButtons() {
    const buttons = [];
    const types = [
        { type: 'images', label: 'Images', count: currentItem.images.length },
        { type: 'videos', label: 'Videos', count: currentItem.videos.length },
        { type: 'pdf', label: 'Drawing', count: currentItem.drawing.length },
        { type: 'model', label: '3D Models', count: currentItem.model3d.length }
    ];
    
    types.forEach(({ type, label, count }) => {
        if (count > 0) {
            const activeClass = currentType === type ? 'active' : '';
            const ariaCurrent = currentType === type ? 'true' : 'false';
            buttons.push(
                `<button class="action-btn ${activeClass}" data-type="${type}" aria-current="${ariaCurrent}">${label} (${count})</button>`
            );
        }
    });
    
    return buttons.join('');
}

function renderCurrentMedia() {
    const container = document.getElementById('preview-container');
    const toolbar = document.getElementById('media-toolbar');
    
    if (!container || !toolbar) return;
    
    container.innerHTML = '';
    toolbar.innerHTML = '';
    
    const mediaArray = getMediaArray();
    
    if (!mediaArray.length) {
        showNoMediaMessage(container);
        return;
    }
    
    currentIndex = Math.max(0, Math.min(currentIndex, mediaArray.length - 1));
    
    const mediaElement = createMediaElement(mediaArray[currentIndex]);
    const wrapper = createMediaWrapper(mediaElement, mediaArray.length);
    
    container.appendChild(wrapper);
    
    addToolbarControls(toolbar, mediaArray.length);
}

function getMediaArray() {
    switch (currentType) {
        case 'images': return currentItem.images;
        case 'videos': return currentItem.videos;
        case 'pdf': return currentItem.drawing;
        case 'model': return currentItem.model3d;
        default: return [];
    }
}

function createMediaElement(src) {
    switch (currentType) {
        case 'images':
            return createImageElement(src);
        case 'videos':
            return createVideoElement(src);
        case 'pdf':
            return createPdfElement(src);
        case 'model':
            return createModelElement(src);
        default:
            const div = document.createElement('div');
            div.className = 'no-media-message';
            div.textContent = 'Unsupported media type';
            return div;
    }
}

function createImageElement(src) {
    const img = document.createElement('img');
    img.src = src;
    img.className = 'media-item';
    img.alt = 'Assembly image';
    img.loading = 'lazy';
    return img;
}

function createVideoElement(src) {
    const video = document.createElement('video');
    video.src = src;
    video.controls = true;
    video.className = 'media-item';
    video.preload = 'metadata';
    return video;
}

function createPdfElement(src) {
    const iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.className = 'media-item';
    iframe.title = 'PDF Document';
    iframe.setAttribute('aria-label', 'PDF viewer');
    return iframe;
}

function createModelElement(src) {
    const modelViewer = document.createElement('model-viewer');
    
    modelViewer.src = src;
    modelViewer.setAttribute('camera-controls', '');
    modelViewer.setAttribute('auto-rotate', '');
    modelViewer.setAttribute('shadow-intensity', '1');
    modelViewer.setAttribute('ar', '');
    modelViewer.setAttribute('alt', `3D model of ${currentItem.title}`);
    modelViewer.className = 'media-item';
    
    // Force dimensions with inline styles
    modelViewer.style.width = '800px';
    modelViewer.style.height = '500px';
    modelViewer.style.maxWidth = '100%';
    
    // Force resize after a short delay to ensure rendering
    setTimeout(() => {
        if (modelViewer.updateFramebuffer) {
            modelViewer.updateFramebuffer();
        } else {
            window.dispatchEvent(new Event('resize'));
        }
    }, 100);
    
    return modelViewer;
}

function createMediaWrapper(mediaElement, totalItems) {
    const wrapper = document.createElement('div');
    wrapper.className = 'media-wrapper';
    wrapper.appendChild(mediaElement);
    
    if (totalItems > 1) {
        const navLeft = createNavButton('left', '◀', () => changeMedia(-1));
        const navRight = createNavButton('right', '▶', () => changeMedia(1));
        
        wrapper.appendChild(navLeft);
        wrapper.appendChild(navRight);
    }
    
    return wrapper;
}

function createNavButton(direction, icon, clickHandler) {
    const button = document.createElement('button');
    button.className = `media-nav ${direction}`;
    button.innerHTML = icon;
    button.setAttribute('aria-label', `Show previous ${currentType}`);
    button.onclick = clickHandler;
    return button;
}

function addToolbarControls(toolbar, totalItems) {
    const counter = document.createElement('span');
    counter.className = 'model-counter';
    counter.textContent = `${currentIndex + 1} / ${totalItems}`;
    toolbar.appendChild(counter);
    
    const fsBtn = document.createElement('button');
    fsBtn.textContent = '⛶ Fullscreen';
    fsBtn.setAttribute('aria-label', 'View in fullscreen');
    fsBtn.onclick = toggleFullscreen;
    toolbar.appendChild(fsBtn);
    
    if (currentType === 'model') {
        const arBtn = document.createElement('button');
        arBtn.textContent = '📱 AR';
        arBtn.setAttribute('aria-label', 'View in augmented reality');
        arBtn.onclick = () => {
            const modelViewer = document.querySelector('model-viewer');
            if (modelViewer) modelViewer.activateAR();
        };
        toolbar.appendChild(arBtn);
    }
}

function toggleFullscreen() {
    const mediaElement = document.querySelector('.media-item');
    if (!mediaElement) return;
    
    if (mediaElement.requestFullscreen) {
        mediaElement.requestFullscreen();
    } else if (mediaElement.webkitRequestFullscreen) {
        mediaElement.webkitRequestFullscreen();
    } else if (mediaElement.msRequestFullscreen) {
        mediaElement.msRequestFullscreen();
    } else {
        const wrapper = mediaElement.closest('.media-wrapper');
        if (wrapper) {
            if (wrapper.requestFullscreen) {
                wrapper.requestFullscreen();
            } else if (wrapper.webkitRequestFullscreen) {
                wrapper.webkitRequestFullscreen();
            } else if (wrapper.msRequestFullscreen) {
                wrapper.msRequestFullscreen();
            }
        }
    }
}

function showNoMediaMessage(container) {
    const message = document.createElement('div');
    message.className = 'no-media-message';
    message.textContent = 'No media available for this type';
    container.appendChild(message);
}

function changeMedia(direction) {
    const mediaArray = getMediaArray();
    if (!mediaArray.length) return;
    
    currentIndex = (currentIndex + direction + mediaArray.length) % mediaArray.length;
    renderCurrentMedia();
}

function setupModalEventListeners() {
    if (keyboardListener) {
        document.removeEventListener('keydown', keyboardListener);
    }
    
    const backBtn = document.getElementById('detail-back-button');
    if (backBtn) backBtn.onclick = closeModal;
    
    const closeBtn = document.getElementById('modal-close-btn');
    if (closeBtn) closeBtn.onclick = closeModal;
    
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.onclick = () => {
            currentType = btn.dataset.type;
            currentIndex = 0;
            
            document.querySelectorAll('.action-btn').forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-current', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-current', 'true');
            
            renderCurrentMedia();
        };
    });
    
    keyboardListener = (e) => {
        if (!detailModal.classList.contains('active')) return;
        
        switch(e.key) {
            case 'Escape':
                e.preventDefault();
                closeModal();
                break;
            case 'ArrowRight':
                e.preventDefault();
                changeMedia(1);
                break;
            case 'ArrowLeft':
                e.preventDefault();
                changeMedia(-1);
                break;
        }
    };
    
    document.addEventListener('keydown', keyboardListener);
    
    detailModal.onclick = (e) => {
        if (e.target === detailModal) {
            closeModal();
        }
    };
}

function closeModal() {
    detailModal.classList.remove('active');
    detailModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    
    if (lastFocusedElement) {
        lastFocusedElement.focus();
    }
    
    if (keyboardListener) {
        document.removeEventListener('keydown', keyboardListener);
        keyboardListener = null;
    }
}

function showError(message = 'Failed to load assemblies') {
    if (errorState) {
        errorState.hidden = false;
        const messageEl = errorState.querySelector('p');
        if (messageEl) messageEl.textContent = message;
    }
}

function hideError() {
    if (errorState) {
        errorState.hidden = true;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        createAssemblyCard,
        determineInitialMediaType,
        changeMedia
    };
}