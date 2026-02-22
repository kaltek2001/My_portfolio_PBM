// home.js - Updated version

// Star field generation
function createStars() {
  const starsContainer = document.getElementById('stars');
  const starCount = 200;

  for (let i = 0; i < starCount; i++) {
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

// Orbit positioning and animation
const items = document.querySelectorAll(".orbit-item");
const radius = 210;
let angle = 0;
let isAnimating = true;
let animationId = null;

function positionItems() {
  const step = (2 * Math.PI) / items.length;

  items.forEach((item, i) => {
    const x = radius * Math.cos(angle + i * step);
    const y = radius * Math.sin(angle + i * step);

    item.style.left = "50%";
    item.style.top = "50%";
    item.style.transform =
      `translate(-50%, -50%) translate(${x}px, ${y}px)`;
  });
}

function animate() {
  if (isAnimating) {
    angle += 0.0015;
    positionItems();
  }
  animationId = requestAnimationFrame(animate);
}

// Initialize skill bars
function initSkillBars() {
  const skillLevels = document.querySelectorAll('.skill-level');
  skillLevels.forEach(skill => {
    const level = skill.getAttribute('data-level');
    setTimeout(() => {
      skill.style.width = `${level}%`;
    }, 500);
  });
}

// Modal functionality
const modal = document.getElementById('projectModal');
const modalTitle = document.querySelector('.modal-title');
const modalDescription = document.getElementById('modalDescription');
const modalImage = document.getElementById('modalImage');
const closeModal = document.getElementById('closeModal');

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
  'Edu/Skills/Cert': {
    title: 'Education, Skills & Certifications',
    description: 'Academic background, technical skills, and professional certifications. Includes CAD software proficiency, engineering analysis skills, and industry-recognized certifications.',
    color: '#4a58ff'
  },
  'Contact': {
    title: 'Contact Information',
    description: 'Get in touch for project inquiries, collaboration opportunities, or professional consultation. Available for freelance projects and full-time mechanical engineering positions.',
    color: '#3a48ff'
  }
};

function showModal(section) {
  const data = modalData[section] || {
    title: section,
    description: `Information about ${section} will be displayed here.`,
    color: '#9aa4ff'
  };

  modalTitle.textContent = data.title;
  modalDescription.textContent = data.description;
  modalImage.style.background = `linear-gradient(135deg, ${data.color}20, #2d325f)`;
  modalImage.style.borderColor = data.color;
  modalImage.textContent = `${data.title} Overview`;

  modal.style.display = 'flex';
}

// Navigation functionality
items.forEach((item) => {
  item.addEventListener('click', () => {
    const targetPage = item.getAttribute('data-target');
    const itemText = item.textContent.replace(/\n/g, ' ');

    // Visual feedback
    item.style.background = 'radial-gradient(circle at 30% 30%, #4a5080, #2a38ff)';
    item.style.boxShadow = '0 0 40px rgba(154, 164, 255, 0.8)';

    setTimeout(() => {
      item.style.background = '';
      item.style.boxShadow = '';

      // Navigate to target page
      if (targetPage) {
        window.location.href = targetPage;
      }
    }, 300);

    // Show modal for demo (optional)
    // showModal(itemText);
  });
});

closeModal.addEventListener('click', () => {
  modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});

// Pause animation on hover
const orbitContainer = document.querySelector('.orbit-container');

orbitContainer.addEventListener('mouseenter', () => {
  isAnimating = false;
});

orbitContainer.addEventListener('mouseleave', () => {
  isAnimating = true;
});

// Center circle click
const centerCircle = document.querySelector('.center-circle');
centerCircle.addEventListener('click', () => {
  showModal('Projects Portfolio');
});

// Set active navigation link
function setActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'home.html';
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'home.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', () => {
  positionItems();
  animate();
  createStars();
  initSkillBars();
  setActiveNavLink();
});

// Handle page unload
window.addEventListener('beforeunload', () => {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
});