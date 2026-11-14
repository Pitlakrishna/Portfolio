/**
 * Sai Krishna Pitla - Interactive Portfolio Engine
 * Optimized Three.js Canvas · Accessible Navigation & Focus Trap · Live Skills Filter
 * Web3Forms / Mailto Hybrid Form Engine · Toast Notifications · Reduced Motion & Mobile Fallback
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Set Current Year in Footer
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Initialize Core Modules
  initScrollProgressAndBackToTop();
  initThreeJSBackground();
  initNavbar();
  initSkillsFilterAndSearch();
  initContactForm();
  initClipboardToast();
});

/* ==========================================================================
   Scroll Progress Bar & Floating Back-to-Top with Circular Indicator
   ========================================================================== */
function initScrollProgressAndBackToTop() {
  const progressBar = document.getElementById('scroll-progress-bar');
  const backToTopBtn = document.getElementById('back-to-top');
  const progressCircle = document.querySelector('.progress-ring-circle');
  const canvasContainer = document.getElementById('canvas-container');

  const circumference = 2 * Math.PI * 20; // r = 20
  if (progressCircle) {
    progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
    progressCircle.style.strokeDashoffset = circumference;
  }

  const handleScroll = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercentage = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

    // Update Top Progress Bar
    if (progressBar) {
      progressBar.style.width = `${scrollPercentage}%`;
    }

    // Update Circular Ring on Floating Back-to-Top
    if (progressCircle) {
      const offset = circumference - (scrollPercentage / 100) * circumference;
      progressCircle.style.strokeDashoffset = offset;
    }

    // Toggle Back-to-Top Button Visibility
    if (backToTopBtn) {
      if (scrollTop > 350) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    // Subtle fade of Three.js background past the hero section for pristine readability
    if (canvasContainer && canvasContainer.style.display !== 'none') {
      const heroHeight = window.innerHeight;
      if (scrollTop < heroHeight) {
        // Fade from 0.42 down to 0.12 as user leaves hero
        const factor = 0.42 - (scrollTop / heroHeight) * 0.30;
        canvasContainer.style.opacity = Math.max(0.1, factor).toFixed(2);
      } else {
        canvasContainer.style.opacity = '0.12';
      }
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

/* ==========================================================================
   Three.js 3D Background with Static Mobile Fallback & Offscreen Pause
   Low-poly geometric icosahedron core with reactive particle constellation
   ========================================================================== */
function initThreeJSBackground() {
  const container = document.getElementById('canvas-container');
  const fallback = document.getElementById('hero-static-fallback');
  const statusEl = document.getElementById('threejs-status');
  if (!container) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.innerWidth <= 768;

  // On mobile devices or reduced-motion preference, use lightweight CSS static fallback
  if (isMobile || prefersReducedMotion || typeof THREE === 'undefined') {
    container.style.display = 'none';
    if (fallback) fallback.style.display = 'block';
    if (statusEl) {
      statusEl.textContent = prefersReducedMotion ? 'Motion Reduced (Static)' : 'Static Mode (Optimized)';
    }
    return;
  }

  // Ensure desktop canvas is visible with balanced contrast opacity
  container.style.display = 'block';
  container.style.opacity = '0.42';
  if (fallback) fallback.style.display = 'none';

  // Scene & Camera
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 28;

  // WebGL Renderer
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'default'
    });
  } catch (e) {
    console.warn('WebGL init failed, using static fallback:', e);
    container.style.display = 'none';
    if (fallback) fallback.style.display = 'block';
    if (statusEl) statusEl.textContent = 'Static Fallback';
    return;
  }

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  container.appendChild(renderer.domElement);

  // Main Group for unified interaction
  const mainGroup = new THREE.Group();
  scene.add(mainGroup);

  if (window.innerWidth > 1080) {
    mainGroup.position.x = 8.5; // Offset nicely beside text on desktop
  }

  /* --- 1. Core Geometric Shapes --- */
  const coreGroup = new THREE.Group();
  mainGroup.add(coreGroup);

  // Outer Low-Poly Icosahedron
  const outerGeom = new THREE.IcosahedronGeometry(6.5, 1);
  const outerMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    wireframe: true,
    transparent: true,
    opacity: 0.28
  });
  const outerMesh = new THREE.Mesh(outerGeom, outerMat);
  coreGroup.add(outerMesh);

  // Inner Geometric Node
  const innerGeom = new THREE.OctahedronGeometry(3.6, 0);
  const innerMat = new THREE.MeshBasicMaterial({
    color: 0x818cf8,
    wireframe: true,
    transparent: true,
    opacity: 0.38
  });
  const innerMesh = new THREE.Mesh(innerGeom, innerMat);
  coreGroup.add(innerMesh);

  // Glowing Points on Vertices
  const vertexMat = new THREE.PointsMaterial({
    color: 0x38bdf8,
    size: 0.4,
    transparent: true,
    opacity: 0.75
  });
  const vertexPoints = new THREE.Points(outerGeom, vertexMat);
  coreGroup.add(vertexPoints);

  // Orbital Rings
  const ringGeom = new THREE.TorusGeometry(9.5, 0.035, 8, 60);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x818cf8,
    transparent: true,
    opacity: 0.18
  });
  const ring1 = new THREE.Mesh(ringGeom, ringMat);
  ring1.rotation.x = Math.PI / 3;
  coreGroup.add(ring1);

  const ring2 = new THREE.Mesh(ringGeom, ringMat);
  ring2.rotation.y = Math.PI / 4;
  coreGroup.add(ring2);

  /* --- 2. Ambient Floating Particle Nebula --- */
  const particleCount = 450;
  const particleGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const colorPalette = [
    new THREE.Color(0x38bdf8),
    new THREE.Color(0x818cf8),
    new THREE.Color(0xc084fc),
    new THREE.Color(0x34d399)
  ];

  for (let i = 0; i < particleCount; i++) {
    const radius = 10 + Math.random() * 40;
    const theta = THREE.MathUtils.randFloatSpread(360);
    const phi = THREE.MathUtils.randFloatSpread(360);

    positions[i * 3] = radius * Math.sin(theta) * Math.cos(phi);
    positions[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
    positions[i * 3 + 2] = radius * Math.cos(theta);

    const randomColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];
    colors[i * 3] = randomColor.r;
    colors[i * 3 + 1] = randomColor.g;
    colors[i * 3 + 2] = randomColor.b;
  }

  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  // Circular Particle Texture
  const pointCanvas = document.createElement('canvas');
  pointCanvas.width = 16;
  pointCanvas.height = 16;
  const pctx = pointCanvas.getContext('2d');
  const gradient = pctx.createRadialGradient(8, 8, 0, 8, 8, 8);
  gradient.addColorStop(0, 'rgba(255,255,255,0.9)');
  gradient.addColorStop(0.4, 'rgba(255,255,255,0.5)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  pctx.fillStyle = gradient;
  pctx.fillRect(0, 0, 16, 16);

  const particleTexture = new THREE.CanvasTexture(pointCanvas);

  const particleMaterial = new THREE.PointsMaterial({
    size: 0.55,
    vertexColors: true,
    map: particleTexture,
    transparent: true,
    opacity: 0.5,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
  mainGroup.add(particleSystem);

  /* --- 3. Interaction & Pausable Animation Loop --- */
  let mouseX = 0;
  let mouseY = 0;
  let targetRotationX = 0;
  let targetRotationY = 0;

  const onMouseMove = (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    targetRotationY = mouseX * 0.35;
    targetRotationX = -mouseY * 0.25;
  };

  window.addEventListener('mousemove', onMouseMove, { passive: true });

  const onResize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    if (width <= 768) {
      container.style.display = 'none';
      if (fallback) fallback.style.display = 'block';
      return;
    } else {
      container.style.display = 'block';
      if (fallback) fallback.style.display = 'none';
    }

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    if (width <= 1080) {
      mainGroup.position.x = 0;
      mainGroup.position.y = -2;
      coreGroup.scale.set(0.7, 0.7, 0.7);
    } else {
      mainGroup.position.x = 8.5;
      mainGroup.position.y = 0;
      coreGroup.scale.set(1, 1, 1);
    }
  };

  window.addEventListener('resize', onResize);

  let clock = new THREE.Clock();
  let isPageVisible = !document.hidden;
  let isHeroVisible = true;
  let animFrameId = null;

  document.addEventListener('visibilitychange', () => {
    isPageVisible = !document.hidden;
    if (isPageVisible && isHeroVisible) {
      if (!animFrameId) animate();
    }
  });

  // Pause Three.js loop when Hero is out of viewport to save battery & CPU
  const heroSection = document.getElementById('hero');
  if ('IntersectionObserver' in window && heroSection) {
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isHeroVisible = entry.isIntersecting;
        if (isHeroVisible && isPageVisible && !animFrameId) {
          animate();
        }
      });
    }, { threshold: 0.05 });
    heroObserver.observe(heroSection);
  }

  const animate = () => {
    if (!isPageVisible || !isHeroVisible || window.innerWidth <= 768) {
      animFrameId = null;
      return;
    }

    animFrameId = requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    coreGroup.rotation.y += 0.0025;
    coreGroup.rotation.x += 0.0015;
    innerMesh.rotation.y -= 0.004;
    innerMesh.rotation.z += 0.002;

    ring1.rotation.z += 0.0015;
    ring2.rotation.z -= 0.002;

    particleSystem.rotation.y = elapsedTime * 0.01;
    particleSystem.rotation.x = Math.sin(elapsedTime * 0.08) * 0.04;

    // Mouse Parallax Damping
    mainGroup.rotation.y += (targetRotationY - mainGroup.rotation.y) * 0.035;
    mainGroup.rotation.x += (targetRotationX - mainGroup.rotation.x) * 0.035;

    renderer.render(scene, camera);
  };

  animate();
}

/* ==========================================================================
   Navbar Management: Hamburger Drawer, Focus Trap, Scroll Lock & Scrollspy
   ========================================================================== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const navCloseBtn = document.getElementById('nav-close-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-contact-cta');
  const sections = document.querySelectorAll('section[id]');

  // Scrolled shadow toggle
  const checkNavbarScroll = () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', checkNavbarScroll, { passive: true });
  checkNavbarScroll();

  if (!navToggle || !navMenu) return;

  // Open & Close Menu Functions
  const openMenu = () => {
    navMenu.classList.add('open');
    navToggle.classList.add('open');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('nav-locked');

    // Focus close button or first interactive element for accessibility
    setTimeout(() => {
      if (navCloseBtn) {
        navCloseBtn.focus();
      } else {
        const firstLink = navMenu.querySelector('a, button');
        if (firstLink) firstLink.focus();
      }
    }, 50);
  };

  const closeMenu = () => {
    navMenu.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-locked');
    navToggle.focus();
  };

  // Toggle button click
  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.contains('open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Dedicated Close button inside drawer
  if (navCloseBtn) {
    navCloseBtn.addEventListener('click', closeMenu);
  }

  // Close on any menu link click
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('open')) {
        closeMenu();
      }
    });
  });

  // Close when clicking outside menu
  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('open') && !navbar.contains(e.target)) {
      closeMenu();
    }
  });

  // Close on Escape key & Accessible Focus Trap
  document.addEventListener('keydown', (e) => {
    if (!navMenu.classList.contains('open')) return;

    if (e.key === 'Escape') {
      closeMenu();
      return;
    }

    if (e.key === 'Tab') {
      const focusableEls = navMenu.querySelectorAll('a[href], button:not([disabled]), input, [tabindex="0"]');
      if (focusableEls.length === 0) return;

      const firstEl = focusableEls[0];
      const lastEl = focusableEls[focusableEls.length - 1];

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    }
  });

  // Active Link Highlighting (IntersectionObserver)
  if ('IntersectionObserver' in window && sections.length > 0) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            const href = link.getAttribute('href');
            if (href === `#${currentId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, { rootMargin: '-20% 0px -60% 0px', threshold: 0 });

    sections.forEach((section) => sectionObserver.observe(section));
  }
}

/* ==========================================================================
   Skills Filtering & Live Search System
   ========================================================================== */
function initSkillsFilterAndSearch() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-group-card');
  const searchInput = document.getElementById('skills-search-input');
  const searchClear = document.getElementById('skills-search-clear');

  let currentCategory = 'all';
  let currentSearchQuery = '';

  const applyFilters = () => {
    skillCards.forEach((card) => {
      const cardCategory = card.getAttribute('data-category') || '';
      const skillTags = card.querySelectorAll('.skill-tag');

      const matchesCategory = currentCategory === 'all' || cardCategory.includes(currentCategory);

      let hasMatchingSkill = false;
      skillTags.forEach((tag) => {
        const skillName = (tag.getAttribute('data-name') || tag.textContent).toLowerCase();
        if (!currentSearchQuery || skillName.includes(currentSearchQuery)) {
          tag.style.display = 'inline-flex';
          hasMatchingSkill = true;
        } else {
          tag.style.display = 'none';
        }
      });

      if (matchesCategory && (hasMatchingSkill || !currentSearchQuery)) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  };

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      filterButtons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');
      currentCategory = button.getAttribute('data-filter') || 'all';
      applyFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value.trim().toLowerCase();
      if (searchClear) {
        searchClear.style.display = currentSearchQuery ? 'inline-flex' : 'none';
      }
      applyFilters();
    });
  }

  if (searchClear && searchInput) {
    searchClear.addEventListener('click', () => {
      searchInput.value = '';
      currentSearchQuery = '';
      searchClear.style.display = 'none';
      searchInput.focus();
      applyFilters();
    });
  }
}

/* ==========================================================================
   Contact Form: Web3Forms / Formspree with Mailto Fallback
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('contact-submit-btn');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('c-name')?.value.trim() || '';
    const email = document.getElementById('c-email')?.value.trim() || '';
    const subject = document.getElementById('c-subject')?.value.trim() || 'Software Engineer Opportunity';
    const message = document.getElementById('c-message')?.value.trim() || '';
    const accessKeyInput = document.getElementById('form-access-key');
    const accessKey = accessKeyInput ? accessKeyInput.value.trim() : '';

    const mailtoFallback = () => {
      const mailtoUrl = `mailto:saikrishnapitla2@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
        `Hi Sai Krishna,\n\n${message}\n\nBest regards,\n${name} (${email})`
      )}`;
      window.location.href = mailtoUrl;
      showToast('Opening Email Client', 'Message prepared in your default mail app.');
    };

    // If access key is still default placeholder, seamlessly trigger mailto fallback
    if (!accessKey || accessKey === 'YOUR_WEB3FORMS_ACCESS_KEY_HERE') {
      mailtoFallback();
      return;
    }

    // Otherwise, submit through modern fetch API
    const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Sending...</span>`;
    }

    try {
      const formData = new FormData(form);
      const res = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success !== false) {
        showToast('Message Sent!', 'Thank you! Sai Krishna will reply promptly.');
        form.reset();
      } else {
        console.warn('Form endpoint error, falling back to mailto:', data);
        mailtoFallback();
      }
    } catch (err) {
      console.warn('Form network submission error, falling back to mailto:', err);
      mailtoFallback();
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
        if (window.lucide) window.lucide.createIcons();
      }
    }
  });
}

/* ==========================================================================
   Toast Notification & Clipboard Utilities
   ========================================================================== */
let toastTimer = null;

function showToast(title, message) {
  const toast = document.getElementById('toast');
  const toastTitle = document.getElementById('toast-title');
  const toastMessage = document.getElementById('toast-message');

  if (!toast) return;

  if (toastTitle) toastTitle.textContent = title;
  if (toastMessage) toastMessage.textContent = message;

  toast.classList.add('active');

  if (toastTimer) {
    clearTimeout(toastTimer);
  }

  toastTimer = setTimeout(() => {
    toast.classList.remove('active');
  }, 3800);
}

function initClipboardToast() {
  const copyButtons = document.querySelectorAll('.copy-email-btn');
  const toastClose = document.getElementById('toast-close');
  const toast = document.getElementById('toast');

  if (toastClose && toast) {
    toastClose.addEventListener('click', () => {
      if (toastTimer) clearTimeout(toastTimer);
      toast.classList.remove('active');
    });
  }

  copyButtons.forEach((btn) => {
    btn.addEventListener('click', async () => {
      const email = btn.getAttribute('data-email') || 'saikrishnapitla2@gmail.com';
      let copied = false;

      // Modern Clipboard API
      if (navigator.clipboard && window.isSecureContext) {
        try {
          await navigator.clipboard.writeText(email);
          copied = true;
        } catch (err) {
          console.warn('Clipboard writeText failed, using fallback:', err);
        }
      }

      // Fallback
      if (!copied) {
        const textarea = document.createElement('textarea');
        textarea.value = email;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
          copied = document.execCommand('copy');
        } catch (err) {
          console.error('Fallback copy error:', err);
        }
        document.body.removeChild(textarea);
      }

      if (copied) {
        showToast('Copied to Clipboard!', email);

        // Visual feedback on button if text node is present
        const textSpan = btn.querySelector('.btn-copy-text');
        if (textSpan) {
          const originalText = textSpan.textContent;
          textSpan.textContent = 'Copied!';
          setTimeout(() => {
            textSpan.textContent = originalText;
          }, 2000);
        }
      }
    });
  });
}
