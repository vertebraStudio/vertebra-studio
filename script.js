// ===== NAVIGATION =====
const nav = document.getElementById('nav');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.querySelector('.nav-menu');

// Nav scroll effect with smooth transitions
let lastScrollY = window.scrollY;
let ticking = false;

const updateNavbar = () => {
    const scrollY = window.scrollY;
    
    if (scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
    
    // Ensure navbar stays at top (remove any transform that might interfere)
    nav.style.transform = 'translateY(0)';
    
    lastScrollY = scrollY;
    ticking = false;
};

const requestTick = () => {
    if (!ticking) {
        requestAnimationFrame(updateNavbar);
        ticking = true;
    }
};

window.addEventListener('scroll', requestTick, { passive: true });

// Mobile menu toggle with smooth animations
navToggle.addEventListener('click', () => {
    const isActive = navMenu.classList.contains('active');
    
    if (isActive) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        document.body.style.overflow = '';
    } else {
        navMenu.classList.add('active');
        navToggle.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Smooth scroll for nav links (only on same page)
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        
        // Check if link points to another page (contains path, not just #)
        if (href && (href.includes('.html') || href.startsWith('../') || href.startsWith('/'))) {
            // Let the browser handle navigation to other pages
            return;
        }
        
        // Only handle same-page anchors (starting with #)
        if (href && href.startsWith('#')) {
            e.preventDefault();
            const targetSection = document.querySelector(href);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
            }
        }
    });
});

// Active section indicator
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const highlightNavLink = () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
};

window.addEventListener('scroll', highlightNavLink);

// ===== SPINE INTERACTIVE =====
const spine = document.getElementById('spine');
const vertebras = document.querySelectorAll('.vertebra');

vertebras.forEach(vertebra => {
    vertebra.addEventListener('click', () => {
        const service = vertebra.dataset.service;
        console.log(`Clicked on: ${service}`);
        // Here you could add navigation to specific service section
    });
});

// Spine horizontal scroll mapping to vertical scroll
if (spine) {
    const spineContainer = document.querySelector('.spine-container');
    let rafId = null;
    let targetX = 0;
    let currentX = 0;
    const ease = 0.2; // smoothing factor (higher = faster)

    // Create a seamless loop by duplicating items enough times to ensure coverage
    const originalChildren = Array.from(spine.children);
    const originalCount = originalChildren.length;
    
    // Duplicate multiple times to ensure complete coverage on all screen sizes
    // This ensures there's always content visible during the loop transition
    for (let i = 0; i < 3; i++) {
        originalChildren.forEach(child => spine.appendChild(child.cloneNode(true)));
    }

    // Width of one full set of vertebrae (loop length)
    const getLoopWidth = () => {
        // Temporarily reset transform to measure accurately
        const currentTransform = spine.style.transform;
        spine.style.transform = 'translateX(0px)';
        
        // Force reflow to ensure positions are updated
        void spine.offsetHeight;
        
        let measuredWidth = 0;
        
        // Method 1: Measure from first original to first duplicate (most accurate)
        if (spine.children.length >= originalCount * 2) {
            const firstOriginal = spine.children[0];
            const firstDuplicate = spine.children[originalCount];
            
            const firstRect = firstOriginal.getBoundingClientRect();
            const duplicateRect = firstDuplicate.getBoundingClientRect();
            const spineRect = spine.getBoundingClientRect();
            
            const firstLeft = firstRect.left - spineRect.left;
            const duplicateLeft = duplicateRect.left - spineRect.left;
            measuredWidth = duplicateLeft - firstLeft;
        }
        
        // Method 2: If method 1 failed, measure from start of first to end of last original
        if (measuredWidth <= 0 || isNaN(measuredWidth) || !isFinite(measuredWidth)) {
            if (originalCount > 0) {
                const firstOriginal = spine.children[0];
                const lastOriginal = spine.children[originalCount - 1];
                
                const firstRect = firstOriginal.getBoundingClientRect();
                const lastRect = lastOriginal.getBoundingClientRect();
                const spineRect = spine.getBoundingClientRect();
                
                const firstLeft = firstRect.left - spineRect.left;
                const lastRight = lastRect.right - spineRect.left;
                measuredWidth = lastRight - firstLeft;
            }
        }
        
        // Method 3: Fallback - calculate manually
        if (measuredWidth <= 0 || isNaN(measuredWidth) || !isFinite(measuredWidth)) {
            const isMobile = window.innerWidth < 768;
            let width = 0;
            
            for (let i = 0; i < originalCount; i++) {
                const child = spine.children[i];
                const childWidth = child.offsetWidth;
                const computedStyle = window.getComputedStyle(child);
                const marginLeft = parseFloat(computedStyle.marginLeft) || 0;
                const marginRight = parseFloat(computedStyle.marginRight) || 0;
                
                if (isMobile) {
                    // In mobile, negative margins create overlap
                    // First vertebra: add full width
                    // Subsequent vertebrae: add width minus the overlap
                    if (i === 0) {
                        width += childWidth;
                    } else {
                        // Each vertebra overlaps with the previous one
                        // The overlap is the absolute value of the negative margin
                        const overlapLeft = Math.abs(marginLeft);
                        const overlapRight = Math.abs(marginRight);
                        // Total overlap is the minimum of left and right negative margins
                        const totalOverlap = Math.min(overlapLeft, overlapRight);
                        width += childWidth - totalOverlap;
                    }
                } else {
                    width += childWidth;
                }
            }
            
            measuredWidth = Math.max(width, 1);
        }
        
        // Restore transform
        spine.style.transform = currentTransform;
        
        return measuredWidth;
    };

    let loopWidth = 0;
    const updateBounds = () => {
        // Use requestAnimationFrame to ensure DOM is fully updated before measuring
        requestAnimationFrame(() => {
            const newLoopWidth = getLoopWidth();
            // Only update if we got a valid measurement
            if (newLoopWidth > 0 && !isNaN(newLoopWidth) && isFinite(newLoopWidth)) {
                loopWidth = newLoopWidth;
            } else {
                // Retry after a short delay if measurement failed
                setTimeout(() => {
                    const retryWidth = getLoopWidth();
                    if (retryWidth > 0 && !isNaN(retryWidth) && isFinite(retryWidth)) {
                        loopWidth = retryWidth;
                    }
                }, 100);
            }
        });
    };
    // Initial update after a short delay to ensure DOM is ready
    setTimeout(updateBounds, 100);
    updateBounds();
    window.addEventListener('resize', updateBounds);
    // Also update when page becomes visible (for mobile)
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            setTimeout(updateBounds, 50);
        }
    });

    // Only animate when section is in view
    let inView = false;
    const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            inView = entry.isIntersecting;
            if (inView && !rafId) rafId = requestAnimationFrame(animate);
        });
    }, { threshold: 0 });
    io.observe(spineContainer);

    const speed = 0.6; // pixels of horizontal move per 1px vertical scroll

    const animate = () => {
        // Wrap using modulo to create infinite loop
        const diff = targetX - currentX;
        currentX += diff * ease;
        
        // Ensure loopWidth is valid before wrapping
        if (loopWidth > 0) {
            // Use modulo to wrap, ensuring positive value
            // This creates a seamless infinite loop
            let wrapped = currentX % loopWidth;
            
            // Ensure wrapped value is positive
            if (wrapped < 0) {
                wrapped = wrapped + loopWidth;
            }
            
            // Ensure wrapped value is within valid range [0, loopWidth)
            // Use Math.floor to avoid floating point precision issues
            wrapped = wrapped % loopWidth;
            
            // Apply transform - negative because we're moving left
            spine.style.transform = `translateX(${-wrapped}px)`;
        }
        
        rafId = requestAnimationFrame(animate);
    };

    const updateTargetFromScroll = () => {
        if (!inView) return;
        // Use vertical scroll amount to advance horizontally, producing infinite loop
        targetX = window.scrollY * speed;
        if (!rafId) rafId = requestAnimationFrame(animate);
    };

    // initial position
    updateTargetFromScroll();
    window.addEventListener('scroll', updateTargetFromScroll, { passive: true });
}



// ===== IMAGE SCROLL EFFECT =====
// Use IntersectionObserver for better performance and mobile compatibility
const aboutImage = document.querySelector('.about-image');
if (aboutImage) {
    let imageObserver = null;
    
    const setupImageObserver = () => {
        // Si ya existe un observer, desconectarlo primero
        if (imageObserver) {
            imageObserver.disconnect();
        }
        
        // Detectar si estamos en móvil para ajustar los umbrales
        const isMobile = window.innerWidth < 768;
        
        // Configurar IntersectionObserver con umbrales adaptativos
        imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Cuando la imagen está visible, añadir clase 'scrolled'
                    aboutImage.classList.add('scrolled');
                } else {
                    // Cuando la imagen sale de vista, remover clase 'scrolled'
                    aboutImage.classList.remove('scrolled');
                }
            });
        }, {
            // En móvil, usar un threshold más bajo para activar antes
            // En desktop, usar un threshold más alto para activar cuando está más centrada
            threshold: isMobile ? 0.3 : 0.5,
            // Ajustar el rootMargin para controlar cuándo se activa
            // En móvil, usar márgenes más pequeños para activar cuando está más visible
            rootMargin: isMobile ? '-15% 0px -15% 0px' : '-30% 0px -30% 0px'
        });
        
        imageObserver.observe(aboutImage);
    };
    
    // Configurar inicialmente
    setupImageObserver();
    
    // Reconfigurar si cambia el tamaño de la ventana (útil para rotación de dispositivo)
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            setupImageObserver();
        }, 250);
    }, { passive: true });
    
    // También mantener la función handleImageScroll para compatibilidad
    // pero solo si IntersectionObserver no está disponible
    if (!window.IntersectionObserver) {
        function handleImageScroll() {
            const rect = aboutImage.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const isMobile = window.innerWidth < 768;
            const threshold = isMobile ? 0.5 : 0.5;
            const isInView = rect.top <= windowHeight * threshold && rect.bottom >= windowHeight * threshold;
            
            if (isInView) {
                aboutImage.classList.add('scrolled');
            } else {
                aboutImage.classList.remove('scrolled');
            }
        }
        window.addEventListener('scroll', handleImageScroll, { passive: true });
    }
}

// ===== SCROLL ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.card, .section-header, .hero-text').forEach(el => {
    el.classList.add('animate-on-scroll');
    observer.observe(el);
});


// ===== UTILITIES =====
// Update current year
document.getElementById('current-year').textContent = new Date().getFullYear();

// Glass intensity toggle (bonus feature)
let glassIntensity = 1;
const toggleGlassIntensity = () => {
    glassIntensity = glassIntensity === 1 ? 0.5 : 1;
    document.documentElement.style.setProperty('--glass-bg', `rgba(255, 255, 255, ${0.05 * glassIntensity})`);
    document.documentElement.style.setProperty('--glass-blur', `${16 * glassIntensity}px`);
};

// Add keyboard shortcut for glass toggle (Ctrl + G)
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'g') {
        e.preventDefault();
        toggleGlassIntensity();
    }
});

// ===== PERFORMANCE OPTIMIZATIONS =====
// Lazy load images (when added)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===== ACCESSIBILITY =====
// Skip to main content
const skipLink = document.createElement('a');
skipLink.href = '#main-content';
skipLink.textContent = 'Saltar al contenido principal';
skipLink.className = 'sr-only';
skipLink.style.position = 'absolute';
skipLink.style.left = '-9999px';
skipLink.style.zIndex = '9999';

skipLink.addEventListener('focus', () => {
    skipLink.style.left = '10px';
    skipLink.style.top = '10px';
});

skipLink.addEventListener('blur', () => {
    skipLink.style.left = '-9999px';
});

document.body.insertBefore(skipLink, document.body.firstChild);

console.log('Vertebra Studio - Landing page loaded successfully! 🚀');
