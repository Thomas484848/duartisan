/* ========================================
   DUARTISAN - Animations JavaScript
   Scroll reveal & GSAP-like animations
   ======================================== */

/**
 * Simple animation library for scroll-based reveals
 * Lightweight alternative to GSAP for basic use cases
 */

class ScrollReveal {
    constructor(options = {}) {
        this.options = {
            threshold: options.threshold || 0.1,
            rootMargin: options.rootMargin || '0px 0px -50px 0px',
            once: options.once !== false
        };
        
        this.elements = [];
        this.observer = null;
        
        this.init();
    }
    
    init() {
        // Create Intersection Observer
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            {
                threshold: this.options.threshold,
                rootMargin: this.options.rootMargin
            }
        );
        
        // Find all reveal elements
        this.elements = document.querySelectorAll('.reveal-fade, .reveal-up, .reveal-scale');
        
        // Observe each element
        this.elements.forEach(el => {
            this.observer.observe(el);
        });
    }
    
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                
                if (this.options.once) {
                    this.observer.unobserve(entry.target);
                }
            } else if (!this.options.once) {
                entry.target.classList.remove('revealed');
            }
        });
    }
    
    // Manually reveal an element
    reveal(element) {
        element.classList.add('revealed');
    }
    
    // Refresh observer for dynamically added content
    refresh() {
        this.elements = document.querySelectorAll('.reveal-fade, .reveal-up, .reveal-scale');
        this.elements.forEach(el => {
            if (!el.classList.contains('revealed')) {
                this.observer.observe(el);
            }
        });
    }
    
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }
}

/**
 * Counter animation for statistics
 */
class CounterAnimation {
    constructor(element, options = {}) {
        this.element = element;
        this.target = parseInt(element.dataset.count) || 0;
        this.duration = options.duration || 2000;
        this.current = 0;
        this.increment = this.target / (this.duration / 16);
        this.started = false;
    }
    
    start() {
        if (this.started) return;
        this.started = true;
        this.animate();
    }
    
    animate() {
        this.current += this.increment;
        
        if (this.current >= this.target) {
            this.element.textContent = this.target;
            this.element.classList.remove('counting');
            return;
        }
        
        this.element.textContent = Math.floor(this.current);
        this.element.classList.add('counting');
        
        requestAnimationFrame(() => this.animate());
    }
}

/**
 * Smooth parallax effect
 */
class ParallaxEffect {
    constructor() {
        this.elements = [];
        this.ticking = false;
        
        this.init();
    }
    
    init() {
        this.elements = document.querySelectorAll('[data-parallax]');
        
        if (this.elements.length > 0) {
            window.addEventListener('scroll', () => this.onScroll(), { passive: true });
        }
    }
    
    onScroll() {
        if (!this.ticking) {
            requestAnimationFrame(() => {
                this.update();
                this.ticking = false;
            });
            this.ticking = true;
        }
    }
    
    update() {
        const scrollY = window.pageYOffset;
        
        this.elements.forEach(el => {
            const speed = parseFloat(el.dataset.parallax) || 0.5;
            const offset = scrollY * speed;
            el.style.transform = `translateY(${offset}px)`;
        });
    }
}

/**
 * Magnetic button effect
 */
class MagneticButton {
    constructor(element) {
        this.element = element;
        this.boundingRect = null;
        this.strength = 0.3;
        
        this.init();
    }
    
    init() {
        this.element.addEventListener('mouseenter', () => this.onEnter());
        this.element.addEventListener('mousemove', (e) => this.onMove(e));
        this.element.addEventListener('mouseleave', () => this.onLeave());
    }
    
    onEnter() {
        this.boundingRect = this.element.getBoundingClientRect();
    }
    
    onMove(e) {
        if (!this.boundingRect) return;
        
        const x = e.clientX - this.boundingRect.left - this.boundingRect.width / 2;
        const y = e.clientY - this.boundingRect.top - this.boundingRect.height / 2;
        
        this.element.style.transform = `translate(${x * this.strength}px, ${y * this.strength}px)`;
    }
    
    onLeave() {
        this.element.style.transform = 'translate(0, 0)';
        this.boundingRect = null;
    }
}

/**
 * Text split animation helper
 */
class TextSplitter {
    constructor(element, options = {}) {
        this.element = element;
        this.type = options.type || 'chars'; // 'chars', 'words', 'lines'
        this.originalHTML = element.innerHTML;
    }
    
    split() {
        const text = this.element.textContent;
        let html = '';
        
        if (this.type === 'chars') {
            html = text.split('').map((char, i) => 
                char === ' ' ? ' ' : `<span class="char" style="--char-index: ${i}">${char}</span>`
            ).join('');
        } else if (this.type === 'words') {
            html = text.split(' ').map((word, i) => 
                `<span class="word" style="--word-index: ${i}">${word}</span>`
            ).join(' ');
        }
        
        this.element.innerHTML = html;
        return this;
    }
    
    revert() {
        this.element.innerHTML = this.originalHTML;
    }
}

/**
 * Stagger animation helper
 */
function staggerAnimate(elements, options = {}) {
    const delay = options.delay || 0.1;
    const duration = options.duration || 0.6;
    const ease = options.ease || 'cubic-bezier(0.16, 1, 0.3, 1)';
    
    elements.forEach((el, i) => {
        el.style.transition = `all ${duration}s ${ease}`;
        el.style.transitionDelay = `${i * delay}s`;
    });
}

/**
 * Smooth scroll to element
 */
function smoothScrollTo(target, offset = 0) {
    const element = document.querySelector(target);
    if (!element) return;
    
    const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
    
    window.scrollTo({
        top,
        behavior: 'smooth'
    });
}

/**
 * Animate CSS custom property
 */
function animateCSSVariable(element, property, from, to, duration = 1000) {
    const start = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = from + (to - from) * eased;
        
        element.style.setProperty(property, value);
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

/**
 * Line drawing animation for SVG paths
 */
function animatePath(pathElement, duration = 2000) {
    const length = pathElement.getTotalLength();
    
    pathElement.style.strokeDasharray = length;
    pathElement.style.strokeDashoffset = length;
    pathElement.style.transition = `stroke-dashoffset ${duration}ms ease-in-out`;
    
    // Trigger animation
    requestAnimationFrame(() => {
        pathElement.style.strokeDashoffset = '0';
    });
}

/**
 * Initialize approach decoration animation on scroll
 */
function initApproachDecoration() {
    const decoration = document.querySelector('.approach-decoration');
    if (!decoration) return;
    
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    decoration.classList.add('visible');
                }
            });
        },
        { threshold: 0.3 }
    );
    
    observer.observe(decoration);
}

/**
 * Initialize counter animations
 */
function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = new CounterAnimation(entry.target);
                    counter.start();
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.5 }
    );
    
    counters.forEach(counter => observer.observe(counter));
}

/**
 * Initialize magnetic buttons (desktop only)
 */
function initMagneticButtons() {
    if (window.matchMedia('(pointer: fine)').matches) {
        const buttons = document.querySelectorAll('.btn-primary');
        buttons.forEach(btn => new MagneticButton(btn));
    }
}

// Export for use in main.js
window.DuartisanAnimations = {
    ScrollReveal,
    CounterAnimation,
    ParallaxEffect,
    MagneticButton,
    TextSplitter,
    staggerAnimate,
    smoothScrollTo,
    animateCSSVariable,
    animatePath,
    initApproachDecoration,
    initCounters,
    initMagneticButtons
};
