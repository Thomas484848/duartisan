/* ========================================
   DUARTISAN - Main JavaScript
   Site initialization & interactions
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    init();
});

/**
 * Main initialization
 */
function init() {
    // Show loading state
    document.body.classList.add('loading');
    
    // Initialize components
    initLoader();
    initNavigation();
    initSmoothScroll();
    initHeaderScroll();
    initContactForm();
    
    // Initialize animations after a short delay
    setTimeout(() => {
        initAnimations();
    }, 100);
}

/**
 * Page Loader
 */
function initLoader() {
    const loader = document.getElementById('loader');
    
    // Wait for page to be fully loaded
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
            document.body.classList.remove('loading');
            
            // Remove loader from DOM after animation
            setTimeout(() => {
                loader.remove();
            }, 500);
        }, 1500); // Minimum loader display time
    });
    
    // Fallback: hide loader after max time
    setTimeout(() => {
        if (!loader.classList.contains('hidden')) {
            loader.classList.add('hidden');
            document.body.classList.remove('loading');
        }
    }, 4000);
}

/**
 * Mobile Navigation
 */
function initNavigation() {
    const toggle = document.getElementById('nav-toggle');
    const menu = document.getElementById('nav-menu');
    const links = menu.querySelectorAll('.nav-link');
    
    // Toggle menu
    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        menu.classList.toggle('active');
        document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close menu on link click
    links.forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            menu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menu.classList.contains('active')) {
            toggle.classList.remove('active');
            menu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Close menu on click outside
    document.addEventListener('click', (e) => {
        if (menu.classList.contains('active') && 
            !menu.contains(e.target) && 
            !toggle.contains(e.target)) {
            toggle.classList.remove('active');
            menu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/**
 * Smooth Scroll for anchor links
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    const headerHeight = 80;
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            if (href === '#') return;
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Update URL without scrolling
                history.pushState(null, null, href);
            }
        });
    });
}

/**
 * Header scroll effect
 */
function initHeaderScroll() {
    const header = document.getElementById('header');
    let lastScrollY = 0;
    let ticking = false;
    
    function updateHeader() {
        const scrollY = window.pageYOffset;
        
        // Add/remove scrolled class
        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/show header on scroll direction (optional)
        // Uncomment if you want header to hide on scroll down
        /*
        if (scrollY > lastScrollY && scrollY > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        */
        
        lastScrollY = scrollY;
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }, { passive: true });
}

/**
 * Initialize animations using our animation library
 */
function initAnimations() {
    const { 
        ScrollReveal, 
        initApproachDecoration, 
        initCounters,
        initMagneticButtons 
    } = window.DuartisanAnimations;
    
    // Initialize scroll reveal
    const scrollReveal = new ScrollReveal({
        threshold: 0.1,
        rootMargin: '0px 0px -80px 0px',
        once: true
    });
    
    // Initialize other animations
    initApproachDecoration();
    initCounters();
    initMagneticButtons();
    
    // Initialize hero illustration animations
    initHeroIllustration();
}

/**
 * Hero illustration interactive effects
 */
function initHeroIllustration() {
    const illustration = document.querySelector('.hero-illustration');
    if (!illustration) return;
    
    // Subtle parallax effect on mouse move
    const hero = document.querySelector('.hero');
    
    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
        const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
        
        // Apply subtle transform
        const moveX = x * 20;
        const moveY = y * 20;
        
        illustration.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
    
    hero.addEventListener('mouseleave', () => {
        illustration.style.transform = 'translate(0, 0)';
        illustration.style.transition = 'transform 0.5s ease';
        
        setTimeout(() => {
            illustration.style.transition = '';
        }, 500);
    });
}

/**
 * Contact Form handling
 */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Validate form
        if (!validateForm(form)) {
            return;
        }
        
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        // Collect form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        try {
            // Simulate API call (replace with actual endpoint)
            await simulateFormSubmission(data);
            
            // Show success
            submitBtn.classList.remove('loading');
            submitBtn.classList.add('success');
            submitBtn.innerHTML = '<span>Message envoyé !</span>';
            
            // Reset form
            form.reset();
            
            // Reset button after delay
            setTimeout(() => {
                submitBtn.classList.remove('success');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 3000);
            
        } catch (error) {
            // Show error
            submitBtn.classList.remove('loading');
            submitBtn.innerHTML = '<span>Erreur, réessayer</span>';
            submitBtn.disabled = false;
            
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
            }, 3000);
            
            console.error('Form submission error:', error);
        }
    });
    
    // Real-time validation
    const inputs = form.querySelectorAll('.form-input, .form-textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                validateField(input);
            }
        });
    });
}

/**
 * Form validation
 */
function validateForm(form) {
    const inputs = form.querySelectorAll('[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(input) {
    const value = input.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Remove existing error
    removeError(input);
    
    // Required check
    if (input.required && !value) {
        isValid = false;
        errorMessage = 'Ce champ est requis';
    }
    
    // Email validation
    if (isValid && input.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Email invalide';
        }
    }
    
    // Min length for message
    if (isValid && input.name === 'message' && value.length < 10) {
        isValid = false;
        errorMessage = 'Minimum 10 caractères';
    }
    
    if (!isValid) {
        showError(input, errorMessage);
    }
    
    return isValid;
}

function showError(input, message) {
    input.classList.add('error');
    input.style.borderColor = '#ff5f57';
    
    const errorEl = document.createElement('span');
    errorEl.className = 'form-error';
    errorEl.textContent = message;
    errorEl.style.cssText = 'color: #ff5f57; font-size: 0.8125rem; margin-top: 4px; display: block;';
    
    input.parentNode.appendChild(errorEl);
}

function removeError(input) {
    input.classList.remove('error');
    input.style.borderColor = '';
    
    const errorEl = input.parentNode.querySelector('.form-error');
    if (errorEl) {
        errorEl.remove();
    }
}

/**
 * Simulate form submission (replace with actual API call)
 */
function simulateFormSubmission(data) {
    return new Promise((resolve, reject) => {
        console.log('Form data:', data);
        
        // Simulate network delay
        setTimeout(() => {
            // Simulate success (90% of the time)
            if (Math.random() > 0.1) {
                resolve({ success: true });
            } else {
                reject(new Error('Network error'));
            }
        }, 1500);
    });
}

/**
 * Active navigation link based on scroll position
 */
function initActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        },
        {
            threshold: 0.3,
            rootMargin: '-100px 0px -50% 0px'
        }
    );
    
    sections.forEach(section => observer.observe(section));
}

// Initialize active navigation after DOM load
document.addEventListener('DOMContentLoaded', initActiveNavigation);

/**
 * Accessibility: Handle focus states
 */
function initAccessibility() {
    // Show focus outline only for keyboard navigation
    document.body.addEventListener('mousedown', () => {
        document.body.classList.add('using-mouse');
    });
    
    document.body.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.remove('using-mouse');
        }
    });
}

// Add accessibility styles
const accessibilityStyles = document.createElement('style');
accessibilityStyles.textContent = `
    body.using-mouse *:focus {
        outline: none !important;
    }
    
    *:focus-visible {
        outline: 2px solid var(--accent-orange) !important;
        outline-offset: 2px !important;
    }
`;
document.head.appendChild(accessibilityStyles);

initAccessibility();

/**
 * Performance: Lazy load images
 */
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers without IntersectionObserver
        images.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
}

initLazyLoading();

/**
 * Console Easter Egg
 */
console.log(
    '%c🔧 DUARTISAN %c— L\'artisan du digital',
    'background: #e07a3c; color: white; padding: 8px 12px; border-radius: 4px 0 0 4px; font-weight: bold;',
    'background: #1a1a1d; color: #f5f5f7; padding: 8px 12px; border-radius: 0 4px 4px 0;'
);
console.log('Intéressé par le code source ? → https://github.com/duartisan');
