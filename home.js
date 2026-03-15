// home.js - Improved version with accessibility, performance, and robustness

// ===== Configuration =====
const CONFIG = {
  starCount: 80,                // Reduced from 200 for performance
  orbitRadius: 210,
  rotationSpeed: 0.0015,
  modalCloseDelay: 2000          // Time before modal auto-closes (if desired)
};

// ===== Global Variables =====
let angle = 0;
let isAnimating = true;
let animationId = null;
let currentFocusElement = null;   // To store element that opened modal

// ===== DOM Element References (with null checks) =====
const starsContainer = document.getElementById('stars');
const orbitItems = document.querySelectorAll('.orbit-item');
const centerCircle = document.querySelector('.center-circle');
const orbitContainer = document.querySelector('.orbit-container');
const modal = document.getElementById('projectModal');
const modalTitle = document.querySelector('.modal-title');
const modalDescription = document.getElementById('modalDescription');
const modalImage = document.getElementById('modalImage');
const closeModal = document.getElementById('closeModal');

// ===== Modal Data (keys now match data-label attributes) =====
const modalData = {
  'CAD Components': {
    title: 'CAD Components',
    description: 'Detailed mechanical component designs created using SolidWorks, AutoCAD, and Fusion 360. Includes individual part designs with complete specifications, materials selection, and manufacturing considerations.',
    color: '#9aa4ff'
  },
  'CAD Assemblies': {
    title: 'CAD Assemblies',
    description: 'Complex mechanical assemblies showing how components work together. Features include exploded views, assembly animations, and detailed assembly instructions with proper constraints and relationships.',
    color: '#7a86ff'
  },
  'Experiences': {
    title: 'Professional Experiences',
    description: 'Comprehensive work history in mechanical engineering roles. Includes project management, team leadership, and hands-on experience with manufacturing processes and quality control.',
    color: '#5a68ff'
  },
  'Edu-Skills-Cert': {            // Fixed key to match data-label
    title: 'Education, Skills & Certifications',
    description: 'Academic background, technical skills, and professional certifications. Includes CAD software proficiency, engineering analysis skills, and industry-recognized certifications.',
    color: '#4a58ff'
  },
  'Contact': {
    title: 'Contact Information',
    description: 'Get in touch for project inquiries, collaboration opportunities, or professional consultation. Available for freelance projects and full-time mechanical engineering positions.',
    color: '#3a48ff'
  },
  'Projects Portfolio': {
    title: 'Projects Portfolio',
    description: 'Explore my engineering projects, CAD designs, and professional experiences through the orbiting menu.',
    color: '#9aa4ff'
  }
};

// ===== Star Field Generation (with null check) =====
function createStars() {
  if (!starsContainer) return;
  // Clear existing stars if any
  starsContainer.innerHTML = '';
  for (let i = 0; i < CONFIG.starCount; i++) {
    const star = document.createElement('div');
    star.classList.add('star');

    const sizes = ['small', 'medium', 'large'];
    const size = sizes[Math.floor(Math.random() * sizes.length)];
    star.classList.add(size);

    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.animationDelay = `${Math.random() * 5}s`;
    star.style.animationDuration = `${2 + Math.random() * 4}s`;
    star.style.opacity = 0.1 + Math.random() * 0.7;

    starsContainer.appendChild(star);
  }
}

// ===== Orbit Animation =====
function positionItems() {
  if (!orbitItems.length) return;
  const step = (2 * Math.PI) / orbitItems.length;

  orbitItems.forEach((item, i) => {
    const x = CONFIG.orbitRadius * Math.cos(angle + i * step);
    const y = CONFIG.orbitRadius * Math.sin(angle + i * step);

    item.style.left = "50%";
    item.style.top = "50%";
    item.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
  });
}

function animate() {
  if (!isAnimating) return;
  angle += CONFIG.rotationSpeed;
  positionItems();
  animationId = requestAnimationFrame(animate);
}

// Pause/resume based on page visibility
function handleVisibilityChange() {
  isAnimating = !document.hidden;
  if (isAnimating && !animationId) {
    animate();
  }
}

// ===== Modal Functions =====
function showModal(sectionLabel) {
  if (!modal) return;

  // Store the element that triggered the modal (for focus return)
  currentFocusElement = document.activeElement;

  const data = modalData[sectionLabel] || {
    title: sectionLabel,
    description: `Information about ${sectionLabel} will be displayed here.`,
    color: '#9aa4ff'
  };

  modalTitle.textContent = data.title;
  modalDescription.textContent = data.description;
  modalImage.style.background = `linear-gradient(135deg, ${data.color}20, #2d325f)`;
  modalImage.style.borderColor = data.color;
  modalImage.textContent = `${data.title} Overview`;

  // Show modal and set focus
  modal.style.display = 'flex';
  modal.focus({ preventScroll: true });  // Focus the modal container

  // Trap focus inside modal (simple version)
  modal.addEventListener('keydown', trapFocus);
}

function closeModalHandler() {
  if (!modal) return;
  modal.style.display = 'none';
  modal.removeEventListener('keydown', trapFocus);

  // Return focus to the element that opened the modal
  if (currentFocusElement && typeof currentFocusElement.focus === 'function') {
    currentFocusElement.focus({ preventScroll: true });
  }
}

function trapFocus(e) {
  if (!modal) return;
  const focusableElements = modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const first = focusableElements[0];
  const last = focusableElements[focusableElements.length - 1];

  if (e.key === 'Tab') {
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  // Close on Escape
  if (e.key === 'Escape') {
    closeModalHandler();
  }
}

// ===== Navigation =====
function handleItemClick(item) {
  const targetPage = item.getAttribute('data-target');
  const label = item.getAttribute('data-label');

  // Visual feedback
  item.style.background = 'radial-gradient(circle at 30% 30%, #4a5080, #2a38ff)';
  item.style.boxShadow = '0 0 40px rgba(154, 164, 255, 0.8)';

  // Show modal (optional – comment out if not desired)
  if (label) showModal(label);

  // Navigate after a short delay (or immediately if you prefer)
  setTimeout(() => {
    item.style.background = '';
    item.style.boxShadow = '';
    if (targetPage) {
      window.location.href = targetPage;
    }
  }, 300);
}

// ===== Event Setup =====
function setupEventListeners() {
  // Orbit items click + keyboard
  orbitItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      handleItemClick(item);
    });
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleItemClick(item);
      }
    });
  });

  // Center circle click + keyboard
  if (centerCircle) {
    centerCircle.addEventListener('click', () => {
      const label = centerCircle.getAttribute('data-label') || 'Projects Portfolio';
      showModal(label);
    });
    centerCircle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const label = centerCircle.getAttribute('data-label') || 'Projects Portfolio';
        showModal(label);
      }
    });
  }

  // Modal close button
  if (closeModal) {
    closeModal.addEventListener('click', closeModalHandler);
  }

  // Close modal on backdrop click
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModalHandler();
    });
  }

  // Pause animation on hover
  if (orbitContainer) {
    orbitContainer.addEventListener('mouseenter', () => { isAnimating = false; });
    orbitContainer.addEventListener('mouseleave', () => { isAnimating = true; });
  }

  // Page visibility change (pause when tab hidden)
  document.addEventListener('visibilitychange', handleVisibilityChange);
}

// ===== Active Navigation Link (with null check) =====
function setActiveNavLink() {
  const navLinks = document.querySelectorAll('.nav-link');
  if (!navLinks.length) return;
  const currentPage = window.location.pathname.split('/').pop() || 'home.html';
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'home.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// ===== Initialize =====
function init() {
  // Check for reduced motion preference
  const motionMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (motionMediaQuery.matches) {
    isAnimating = false;
  }

  createStars();
  if (orbitItems.length) {
    positionItems();
    animate();
  }
  setActiveNavLink();
  setupEventListeners();

  // (Optional) Remove or conditionally run skill bars if elements exist
  // const skillLevels = document.querySelectorAll('.skill-level');
  // if (skillLevels.length) {
  //   initSkillBars(skillLevels);
  // }
}

// Start when DOM is ready
document.addEventListener('DOMContentLoaded', init);

// Clean up on page unload
window.addEventListener('beforeunload', () => {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
  document.removeEventListener('visibilitychange', handleVisibilityChange);
});