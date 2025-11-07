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

    // Create a seamless loop by duplicating items once
    const originalChildren = Array.from(spine.children);
    const originalCount = originalChildren.length;
    originalChildren.forEach(child => spine.appendChild(child.cloneNode(true)));

    // Width of one full set of vertebrae (loop length)
    const getLoopWidth = () => {
        // measure first N items (original set)
        let width = 0;
        for (let i = 0; i < originalCount; i++) {
            width += spine.children[i].getBoundingClientRect().width;
        }
        return width;
    };

    let loopWidth = 0;
    const updateBounds = () => {
        loopWidth = getLoopWidth();
    };
    updateBounds();
    window.addEventListener('resize', updateBounds);

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
        const wrapped = loopWidth ? ((currentX % loopWidth) + loopWidth) % loopWidth : 0;
        spine.style.transform = `translateX(${-wrapped}px)`;
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
function handleImageScroll() {
    const aboutImage = document.querySelector('.about-image');
    if (!aboutImage) {
        console.log('About image not found');
        return;
    }
    
    const rect = aboutImage.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // Activar cuando la imagen esté más abajo en la pantalla
    const isInView = rect.top <= windowHeight * 0.3 && rect.bottom >= windowHeight * 0.7;
    
    console.log('Scroll check:', { 
        rectTop: Math.round(rect.top), 
        rectBottom: Math.round(rect.bottom),
        windowHeight: windowHeight, 
        isInView: isInView,
        hasScrolledClass: aboutImage.classList.contains('scrolled')
    });
    
    if (isInView) {
        aboutImage.classList.add('scrolled');
        console.log('Added scrolled class');
    } else {
        aboutImage.classList.remove('scrolled');
        console.log('Removed scrolled class');
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

// Focus management for mobile menu
navToggle.addEventListener('click', () => {
    if (navMenu.classList.contains('active')) {
        const firstLink = navMenu.querySelector('.nav-link');
        if (firstLink) {
            setTimeout(() => firstLink.focus(), 100);
        }
    }
});

// Add scroll listener for image effect
window.addEventListener('scroll', handleImageScroll, { passive: true });

console.log('Vertebra Studio - Landing page loaded successfully! 🚀');
