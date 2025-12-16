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

// ===== PROYECTOS CAROUSEL (home) =====
const projectsTrack = document.querySelector('.projects-track');
const projectCards = document.querySelectorAll('.project-card');
const projectsPrev = document.querySelector('.projects-prev');
const projectsNext = document.querySelector('.projects-next');

if (projectsTrack && projectCards.length) {
    let currentPage = 0;
    const cardsPerViewDesktop = 3;

    const getCardsPerView = () => {
        if (window.innerWidth < 640) return 1;
        if (window.innerWidth < 1024) return 2;
        return cardsPerViewDesktop;
    };

    const updateCarousel = () => {
        const cardsPerView = getCardsPerView();
        const totalPages = Math.max(1, Math.ceil(projectCards.length / cardsPerView));
        currentPage = Math.min(currentPage, totalPages - 1);

        const wrapper = document.querySelector('.projects-carousel-wrapper');
        const width = wrapper ? wrapper.offsetWidth : 0;
        const offset = -currentPage * width;
        projectsTrack.style.transform = `translateX(${offset}px)`;
    };

    const goNext = () => {
        const totalPages = Math.max(1, Math.ceil(projectCards.length / getCardsPerView()));
        currentPage = (currentPage + 1) % totalPages;
        updateCarousel();
    };

    const goPrev = () => {
        const totalPages = Math.max(1, Math.ceil(projectCards.length / getCardsPerView()));
        currentPage = (currentPage - 1 + totalPages) % totalPages;
        updateCarousel();
    };

    if (projectsNext) projectsNext.addEventListener('click', goNext);
    if (projectsPrev) projectsPrev.addEventListener('click', goPrev);

    window.addEventListener('resize', () => {
        updateCarousel();
    });

    // Inicializar
    updateCarousel();
}


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

// ===== PARALLAX EFFECT FOR HERO BACKGROUND GRADIENT =====
const heroBg = document.querySelector('.hero-bg');
let parallaxTicking = false;

const updateParallax = () => {
    if (!heroBg) {
        parallaxTicking = false;
        return;
    }
    
    const scrolled = window.pageYOffset;
    const heroSection = document.querySelector('.hero');
    
    if (heroSection) {
        const heroTop = heroSection.offsetTop;
        const heroHeight = heroSection.offsetHeight;
        const windowHeight = window.innerHeight;
        
        // Only apply parallax when hero is in view
        if (scrolled < heroTop + heroHeight && scrolled + windowHeight > heroTop) {
            // Calculate offset based on scroll (exaggerated movement)
            const parallaxSpeed = 0.25;
            const offset = (scrolled - heroTop) * parallaxSpeed;
            
            // Update gradient center positions
            const baseX1 = 20;
            const baseX2 = 15;
            const baseY = 50;
            
            // Move gradient center more noticeably based on scroll
            const newX1 = baseX1 + (offset * 0.2);
            const newX2 = baseX2 + (offset * 0.2);
            const newY = baseY + (offset * 0.12);
            
            // Usar valores reducidos en móvil
            const isMobile = window.innerWidth <= 768;
            const isSmallMobile = window.innerWidth <= 640;
            
            let opacity1, opacity2, opacity3, opacity4, opacity5, opacity6;
            
            if (isSmallMobile) {
                // Valores muy reducidos para móviles pequeños
                opacity1 = 0.02;
                opacity2 = 0.015;
                opacity3 = 0.015;
                opacity4 = 0.01;
                opacity5 = 0.008;
            } else if (isMobile) {
                // Valores reducidos para tablets
                opacity1 = 0.03;
                opacity2 = 0.02;
                opacity3 = 0.025;
                opacity4 = 0.018;
                opacity5 = 0.015;
            } else {
                // Valores normales para desktop
                opacity1 = 0.12;
                opacity2 = 0.08;
                opacity3 = 0.10;
                opacity4 = 0.07;
                opacity5 = 0.06;
            }
            
            heroBg.style.backgroundImage = `
                radial-gradient(ellipse 800px 1200px at ${newX1}% ${newY}%, rgba(37, 99, 235, ${opacity1}) 0%, rgba(124, 58, 237, ${opacity2}) 40%, transparent 70%),
                radial-gradient(ellipse 1200px 1800px at ${newX2}% ${newY}%, rgba(236, 72, 153, ${opacity3}) 0%, rgba(168, 85, 247, ${opacity4}) 35%, rgba(59, 130, 246, ${opacity5}) 60%, transparent 85%)
            `;
        } else {
            // Reset to original position when out of view
            const isMobile = window.innerWidth <= 768;
            const isSmallMobile = window.innerWidth <= 640;
            
            let opacity1, opacity2, opacity3, opacity4, opacity5;
            
            if (isSmallMobile) {
                opacity1 = 0.02;
                opacity2 = 0.015;
                opacity3 = 0.015;
                opacity4 = 0.01;
                opacity5 = 0.008;
            } else if (isMobile) {
                opacity1 = 0.03;
                opacity2 = 0.02;
                opacity3 = 0.025;
                opacity4 = 0.018;
                opacity5 = 0.015;
            } else {
                opacity1 = 0.12;
                opacity2 = 0.08;
                opacity3 = 0.10;
                opacity4 = 0.07;
                opacity5 = 0.06;
            }
            
            heroBg.style.backgroundImage = `
                radial-gradient(ellipse 800px 1200px at 20% 50%, rgba(37, 99, 235, ${opacity1}) 0%, rgba(124, 58, 237, ${opacity2}) 40%, transparent 70%),
                radial-gradient(ellipse 1200px 1800px at 15% 50%, rgba(236, 72, 153, ${opacity3}) 0%, rgba(168, 85, 247, ${opacity4}) 35%, rgba(59, 130, 246, ${opacity5}) 60%, transparent 85%)
            `;
        }
    }
    
    parallaxTicking = false;
};

const requestParallaxTick = () => {
    if (!parallaxTicking) {
        requestAnimationFrame(updateParallax);
        parallaxTicking = true;
    }
};

if (heroBg) {
    window.addEventListener('scroll', requestParallaxTick, { passive: true });
    // Initialize on load
    updateParallax();
}

// ===== SERVICE CARDS SCROLL HIGHLIGHT (MOBILE) =====
// En móvil, destacar las tarjetas de servicios una a una conforme se hace scroll
let serviceCardsHighlightInitialized = false;
let serviceCardsScrollHandler = null;
let serviceCardsResizeHandler = null;

const initServiceCardsScrollHighlight = () => {
    // Solo ejecutar en móvil
    if (window.innerWidth > 768) {
        // Limpiar si ya estaba inicializado
        if (serviceCardsHighlightInitialized) {
            const serviceCards = document.querySelectorAll('#servicios .service-card, #por-que-vertebra .service-card');
            serviceCards.forEach(card => {
                card.classList.remove('scroll-highlighted');
            });
            if (serviceCardsScrollHandler) {
                window.removeEventListener('scroll', serviceCardsScrollHandler);
                serviceCardsScrollHandler = null;
            }
            if (serviceCardsResizeHandler) {
                window.removeEventListener('resize', serviceCardsResizeHandler);
                serviceCardsResizeHandler = null;
            }
            serviceCardsHighlightInitialized = false;
        }
        return;
    }
    
    // Evitar múltiples inicializaciones
    if (serviceCardsHighlightInitialized) {
        return;
    }
    
    // Buscar tarjetas dentro de las secciones de servicios y "¿Por qué vertebra?"
    const serviciosSection = document.getElementById('servicios');
    const porQueVertebraSection = document.getElementById('por-que-vertebra');
    
    let serviceCards = [];
    
    if (serviciosSection) {
        const serviciosCards = serviciosSection.querySelectorAll('.service-card');
        serviceCards = Array.from(serviciosCards);
    }
    
    if (porQueVertebraSection) {
        const porQueVertebraCards = porQueVertebraSection.querySelectorAll('.service-card');
        serviceCards = serviceCards.concat(Array.from(porQueVertebraCards));
    }
    
    if (serviceCards.length === 0) {
        return;
    }
    
    let highlightedCard = null;
    let ticking = false;
    
    const updateHighlightedCard = () => {
        const viewportCenter = window.innerHeight / 2;
        let closestCard = null;
        let minDistance = Infinity;
        
        // Encontrar la tarjeta más cercana al centro del viewport
        serviceCards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const cardCenter = rect.top + (rect.height / 2);
            const distance = Math.abs(cardCenter - viewportCenter);
            
            // Solo considerar tarjetas que estén al menos parcialmente visibles
            if (rect.bottom > 0 && rect.top < window.innerHeight && rect.height > 0) {
                if (distance < minDistance) {
                    minDistance = distance;
                    closestCard = card;
                }
            }
        });
        
        // Quitar destacado de la tarjeta anterior
        if (highlightedCard && highlightedCard !== closestCard) {
            highlightedCard.classList.remove('scroll-highlighted');
        }
        
        // Aplicar destacado a la nueva tarjeta
        if (closestCard && closestCard !== highlightedCard) {
            closestCard.classList.add('scroll-highlighted');
            highlightedCard = closestCard;
        } else if (!closestCard && highlightedCard) {
            // Si no hay ninguna tarjeta visible, quitar el destacado
            highlightedCard.classList.remove('scroll-highlighted');
            highlightedCard = null;
        }
        
        ticking = false;
    };
    
    const requestUpdate = () => {
        if (!ticking) {
            requestAnimationFrame(updateHighlightedCard);
            ticking = true;
        }
    };
    
    // Guardar referencia al handler para poder limpiarlo
    serviceCardsScrollHandler = requestUpdate;
    
    // Actualizar en scroll
    window.addEventListener('scroll', serviceCardsScrollHandler, { passive: true });
    
    // Actualizar inicialmente
    updateHighlightedCard();
    
    // Limpiar cuando cambie el tamaño de la ventana
    let resizeTimeout;
    serviceCardsResizeHandler = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (window.innerWidth > 768) {
                // Si cambia a desktop, quitar todos los destacados y limpiar
                const allServiceCards = document.querySelectorAll('#servicios .service-card, #por-que-vertebra .service-card');
                allServiceCards.forEach(card => {
                    card.classList.remove('scroll-highlighted');
                });
                highlightedCard = null;
                if (serviceCardsScrollHandler) {
                    window.removeEventListener('scroll', serviceCardsScrollHandler);
                    serviceCardsScrollHandler = null;
                }
                if (serviceCardsResizeHandler) {
                    window.removeEventListener('resize', serviceCardsResizeHandler);
                    serviceCardsResizeHandler = null;
                }
                serviceCardsHighlightInitialized = false;
            } else {
                // Si sigue en móvil, actualizar el destacado
                updateHighlightedCard();
            }
        }, 250);
    };
    
    window.addEventListener('resize', serviceCardsResizeHandler, { passive: true });
    
    serviceCardsHighlightInitialized = true;
};

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initServiceCardsScrollHighlight);
} else {
    initServiceCardsScrollHighlight();
}

// ===== PROJECT CARDS SCROLL HIGHLIGHT (MOBILE) =====
// En móvil, activar efectos de hover de las tarjetas de proyectos con scroll
const initProjectCardsScrollHighlight = () => {
    // Solo ejecutar en móvil
    if (window.innerWidth > 768) {
        return;
    }
    
    const projectCards = document.querySelectorAll('.grid-3 .card-link, .grid-2 .card-link');
    
    if (projectCards.length === 0) {
        return;
    }
    
    let highlightedCard = null;
    let ticking = false;
    
    const updateHighlightedCard = () => {
        const viewportCenter = window.innerHeight / 2;
        let closestCard = null;
        let minDistance = Infinity;
        
        // Encontrar la tarjeta más cercana al centro del viewport
        projectCards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const cardCenter = rect.top + (rect.height / 2);
            const distance = Math.abs(cardCenter - viewportCenter);
            
            // Solo considerar tarjetas que estén al menos parcialmente visibles
            if (rect.bottom > 0 && rect.top < window.innerHeight) {
                if (distance < minDistance) {
                    minDistance = distance;
                    closestCard = card;
                }
            }
        });
        
        // Quitar destacado de la tarjeta anterior
        if (highlightedCard && highlightedCard !== closestCard) {
            highlightedCard.classList.remove('scroll-highlighted');
        }
        
        // Aplicar destacado a la nueva tarjeta
        if (closestCard && closestCard !== highlightedCard) {
            closestCard.classList.add('scroll-highlighted');
            highlightedCard = closestCard;
        }
        
        ticking = false;
    };
    
    const requestUpdate = () => {
        if (!ticking) {
            requestAnimationFrame(updateHighlightedCard);
            ticking = true;
        }
    };
    
    // Actualizar en scroll
    window.addEventListener('scroll', requestUpdate, { passive: true });
    
    // Actualizar inicialmente
    updateHighlightedCard();
    
    // Limpiar cuando cambie el tamaño de la ventana
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (window.innerWidth > 768) {
                // Si cambia a desktop, quitar todos los destacados
                projectCards.forEach(card => {
                    card.classList.remove('scroll-highlighted');
                });
                highlightedCard = null;
            } else {
                // Si sigue en móvil, actualizar el destacado
                updateHighlightedCard();
            }
        }, 250);
    }, { passive: true });
};

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProjectCardsScrollHighlight);
} else {
    initProjectCardsScrollHighlight();
}

console.log('Vertebra Studio - Landing page loaded successfully! 🚀');
