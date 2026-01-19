// Aurora AI - Interactive JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // ===========================================
    // INITIALIZE ANIMATIONS ON LOAD
    // ===========================================
    window.addEventListener('load', function() {
            document.body.classList.add('loaded');
        // Trigger initial animations immediately
        initAnimations();
    });

    // ===========================================
    // NAVBAR SCROLL EFFECT
    // ===========================================
    const navbar = document.getElementById('navbar');
    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateNavbar() {
        const scrollY = window.scrollY;

        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScrollY = scrollY;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    });

    // ===========================================
    // SCROLL ANIMATIONS
    // ===========================================
    function initAnimations() {
        const animElements = document.querySelectorAll('[data-anim]');

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Add staggered delay based on element position
                    const delay = index * 100;
                    setTimeout(() => {
                        entry.target.classList.add('animated');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animElements.forEach(el => observer.observe(el));
    }

    // ===========================================
    // TAB FUNCTIONALITY
    // ===========================================
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');

            // Update buttons
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update panels
            tabPanels.forEach(panel => {
                panel.classList.remove('active');
                if (panel.id === tabId) {
                    panel.classList.add('active');

                    // Re-animate elements in new panel
                    const panelAnims = panel.querySelectorAll('[data-anim]');
                    panelAnims.forEach((el, i) => {
                        el.classList.remove('animated');
                        setTimeout(() => {
                            el.classList.add('animated');
                        }, i * 100 + 100);
                    });
                }
            });
        });
    });

    // ===========================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ===========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const navHeight = navbar.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===========================================
    // AURORA GLOW CURSOR EFFECT
    // ===========================================
    function createAuroraGlow() {
        const glowElements = document.querySelectorAll('.btn-primary, .cta-card, .feature-card, .nav-glass');

        glowElements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                el.style.setProperty('--mouse-x', `${x}px`);
                el.style.setProperty('--mouse-y', `${y}px`);
            });
        });
    }

    createAuroraGlow();

    // ===========================================
    // MARQUEE PAUSE ON HOVER
    // ===========================================
    const marqueeContainers = document.querySelectorAll('.logos-marquee, .features-ticker');

    marqueeContainers.forEach(container => {
        const track = container.querySelector('.logos-track, .ticker-track');
        if (track) {
            container.addEventListener('mouseenter', () => {
                track.style.animationPlayState = 'paused';
            });
            container.addEventListener('mouseleave', () => {
                track.style.animationPlayState = 'running';
            });
        }
    });

    // ===========================================
    // PARALLAX EFFECT FOR HERO
    // ===========================================
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    const heroVideo = document.querySelector('.hero-video');

    if (hero && heroContent && heroVideo) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const heroHeight = hero.offsetHeight;

            if (scrollY <= heroHeight) {
                const progress = scrollY / heroHeight;

                // Parallax on video
                heroVideo.style.transform = `translateY(${scrollY * 0.3}px)`;

                // Fade out content
                heroContent.style.opacity = 1 - (progress * 1.5);
                heroContent.style.transform = `translateY(${scrollY * 0.15}px)`;
            }
        });
    }

    // ===========================================
    // BUTTON RIPPLE EFFECT
    // ===========================================
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            ripple.style.cssText = `
                position: absolute;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                pointer-events: none;
                width: 100px;
                height: 100px;
                left: ${x - 50}px;
                top: ${y - 50}px;
                transform: scale(0);
                animation: rippleEffect 0.6s ease-out;
            `;

            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Add ripple animation styles
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes rippleEffect {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);

    // ===========================================
    // VIDEO OPTIMIZATION
    // ===========================================
    const video = document.querySelector('.hero-video');
    if (video) {
        // Reduce quality on mobile for performance
        if (window.innerWidth < 768) {
            video.playbackRate = 0.75;
        }

        // Pause video when not visible
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    video.play().catch(() => {});
                } else {
                    video.pause();
                }
            });
        }, { threshold: 0.1 });

        videoObserver.observe(video);
    }

    // ===========================================
    // CONTACT FORM HANDLING (if on contact page)
    // ===========================================
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const formData = new FormData(this);
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            // Update button state
            submitBtn.innerHTML = '<span>Sending...</span>';
            submitBtn.disabled = true;

            // Simulate form submission (replace with actual endpoint)
            try {
                // In production, replace with actual form submission
                await new Promise(resolve => setTimeout(resolve, 1500));

                // Success state
                submitBtn.innerHTML = '<span>Message Sent!</span>';
                submitBtn.style.background = 'var(--aurora-teal)';

                // Reset form
                this.reset();

                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 3000);

            } catch (error) {
                submitBtn.innerHTML = '<span>Error. Try again.</span>';
                submitBtn.style.background = '#ef4444';

                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 3000);
            }
        });
    }

    // ===========================================
    // FAQ ACCORDION (if on contact page)
    // ===========================================
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const headerBtn = item.querySelector('.faq-header-btn');
        if (headerBtn) {
            headerBtn.addEventListener('click', () => {
                const isOpen = item.classList.contains('open');

                // Close all others
                faqItems.forEach(i => i.classList.remove('open'));

                // Toggle current
                if (!isOpen) {
                    item.classList.add('open');
                }
            });
        }
    });

    // ===========================================
    // DARK MODE DETECTION (for future use)
    // ===========================================
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    function handleThemeChange(e) {
        if (e.matches) {
            document.documentElement.setAttribute('data-theme', 'dark');
            // Update favicon for dark mode
            updateFavicon('W');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            // Update favicon for light mode
            updateFavicon('B');
        }
    }

    function updateFavicon(variant) {
        const favicon = document.querySelector('link[rel="icon"]');
        if (favicon) {
            favicon.href = `favicon_${variant} copy/favicon-32x32.png`;
        }
    }

    // Listen for theme changes
    prefersDark.addEventListener('change', handleThemeChange);

    // ===========================================
    // PERFORMANCE: DEBOUNCE SCROLL EVENTS
    // ===========================================
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // ===========================================
    // ACCESSIBILITY: KEYBOARD NAVIGATION
    // ===========================================
    document.addEventListener('keydown', (e) => {
        // Tab panels keyboard navigation
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            const activeTab = document.querySelector('.tab-btn.active');
            if (activeTab && document.activeElement.classList.contains('tab-btn')) {
                const tabs = Array.from(tabBtns);
                const currentIndex = tabs.indexOf(activeTab);
                let nextIndex;

                if (e.key === 'ArrowRight') {
                    nextIndex = (currentIndex + 1) % tabs.length;
                } else {
                    nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
                }

                tabs[nextIndex].click();
                tabs[nextIndex].focus();
            }
        }
    });

    // ===========================================
    // COOKIE CONSENT BANNER
    // ===========================================
    const cookieBanner = document.getElementById('cookieBanner');
    const cookieModalOverlay = document.getElementById('cookieModalOverlay');
    const cookieAccept = document.getElementById('cookieAccept');
    const cookieReject = document.getElementById('cookieReject');
    const cookieSettings = document.getElementById('cookieSettings');
    const cookieModalReject = document.getElementById('cookieModalReject');
    const cookieModalSave = document.getElementById('cookieModalSave');
    const analyticsToggle = document.getElementById('analyticsToggle');
    const functionalToggle = document.getElementById('functionalToggle');
    const marketingToggle = document.getElementById('marketingToggle');

    // Check if consent already given
    function checkCookieConsent() {
        const consent = localStorage.getItem('aurora_cookie_consent');
        if (!consent && cookieBanner) {
            // Show banner after a short delay
            setTimeout(() => {
                cookieBanner.classList.add('visible');
            }, 1500);
        }
    }

    // Save cookie preferences
    function saveCookiePreferences(preferences) {
        localStorage.setItem('aurora_cookie_consent', JSON.stringify(preferences));
        localStorage.setItem('aurora_cookie_consent_date', new Date().toISOString());
        hideCookieBanner();
        hideModal();
    }

    // Hide cookie banner
    function hideCookieBanner() {
        if (cookieBanner) {
            cookieBanner.classList.remove('visible');
            cookieBanner.classList.add('hidden');
        }
    }

    // Show modal
    function showModal() {
        if (cookieModalOverlay) {
            cookieModalOverlay.classList.add('visible');
            document.body.style.overflow = 'hidden';

            // Load current preferences if they exist
            const consent = localStorage.getItem('aurora_cookie_consent');
            if (consent) {
                const prefs = JSON.parse(consent);
                if (analyticsToggle) analyticsToggle.checked = prefs.analytics || false;
                if (functionalToggle) functionalToggle.checked = prefs.functional || false;
                if (marketingToggle) marketingToggle.checked = prefs.marketing || false;
            }
        }
    }

    // Hide modal
    function hideModal() {
        if (cookieModalOverlay) {
            cookieModalOverlay.classList.remove('visible');
            document.body.style.overflow = '';
        }
    }

    // Event listeners
    if (cookieAccept) {
        cookieAccept.addEventListener('click', () => {
            saveCookiePreferences({
                necessary: true,
                analytics: true,
                functional: true,
                marketing: true
            });
        });
    }

    if (cookieReject) {
        cookieReject.addEventListener('click', () => {
            saveCookiePreferences({
                necessary: true,
                analytics: false,
                functional: false,
                marketing: false
            });
        });
    }

    if (cookieSettings) {
        cookieSettings.addEventListener('click', () => {
            showModal();
        });
    }

    if (cookieModalReject) {
        cookieModalReject.addEventListener('click', () => {
            saveCookiePreferences({
                necessary: true,
                analytics: false,
                functional: false,
                marketing: false
            });
        });
    }

    if (cookieModalSave) {
        cookieModalSave.addEventListener('click', () => {
            saveCookiePreferences({
                necessary: true,
                analytics: analyticsToggle ? analyticsToggle.checked : false,
                functional: functionalToggle ? functionalToggle.checked : false,
                marketing: marketingToggle ? marketingToggle.checked : false
            });
        });
    }

    // Close modal on overlay click
    if (cookieModalOverlay) {
        cookieModalOverlay.addEventListener('click', (e) => {
            if (e.target === cookieModalOverlay) {
                hideModal();
            }
        });
    }

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && cookieModalOverlay && cookieModalOverlay.classList.contains('visible')) {
            hideModal();
        }
    });

    // Initialize cookie consent check
    checkCookieConsent();

    // ===========================================
    // LIQUID GLASS EFFECT INITIALIZATION
    // ===========================================
    function initLiquidGlass() {
        // Configuration for liquid glass effect - More transparent, more water effect
        const glassConfig = {
            scale: -200,
            radius: 16,
            border: 0.07,
            lightness: 50,
            displace: 0,
            blend: 'difference',
            x: 'R',
            y: 'B',
            alpha: 0.93,
            blur: 11,
            r: 0,
            g: 10,
            b: 20,
            saturation: 1.8,
            frost: 0.02
        };

        // Function to build displacement image for an element
        function buildDisplacementImage(element, width, height, radius) {
            const border = Math.min(width, height) * (glassConfig.border * 0.5);
            const uniqueId = element.id || `glass-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
            svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
            
            const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
            
            const redGrad = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
            redGrad.setAttribute('id', `red-${uniqueId}`);
            redGrad.setAttribute('x1', '100%');
            redGrad.setAttribute('y1', '0%');
            redGrad.setAttribute('x2', '0%');
            redGrad.setAttribute('y2', '0%');
            const redStop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
            redStop1.setAttribute('offset', '0%');
            redStop1.setAttribute('stop-color', '#000');
            const redStop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
            redStop2.setAttribute('offset', '100%');
            redStop2.setAttribute('stop-color', 'red');
            redGrad.appendChild(redStop1);
            redGrad.appendChild(redStop2);
            
            const blueGrad = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
            blueGrad.setAttribute('id', `blue-${uniqueId}`);
            blueGrad.setAttribute('x1', '0%');
            blueGrad.setAttribute('y1', '0%');
            blueGrad.setAttribute('x2', '0%');
            blueGrad.setAttribute('y2', '100%');
            const blueStop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
            blueStop1.setAttribute('offset', '0%');
            blueStop1.setAttribute('stop-color', '#000');
            const blueStop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
            blueStop2.setAttribute('offset', '100%');
            blueStop2.setAttribute('stop-color', 'blue');
            blueGrad.appendChild(blueStop1);
            blueGrad.appendChild(blueStop2);
            
            defs.appendChild(redGrad);
            defs.appendChild(blueGrad);
            svg.appendChild(defs);
            
            // Backdrop
            const backdrop = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            backdrop.setAttribute('x', '0');
            backdrop.setAttribute('y', '0');
            backdrop.setAttribute('width', width);
            backdrop.setAttribute('height', height);
            backdrop.setAttribute('fill', 'black');
            svg.appendChild(backdrop);
            
            // Red linear
            const redRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            redRect.setAttribute('x', '0');
            redRect.setAttribute('y', '0');
            redRect.setAttribute('width', width);
            redRect.setAttribute('height', height);
            redRect.setAttribute('rx', radius);
            redRect.setAttribute('fill', `url(#red-${uniqueId})`);
            svg.appendChild(redRect);
            
            // Blue linear
            const blueRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            blueRect.setAttribute('x', '0');
            blueRect.setAttribute('y', '0');
            blueRect.setAttribute('width', width);
            blueRect.setAttribute('height', height);
            blueRect.setAttribute('rx', radius);
            blueRect.setAttribute('fill', `url(#blue-${uniqueId})`);
            blueRect.setAttribute('style', `mix-blend-mode: ${glassConfig.blend}`);
            svg.appendChild(blueRect);
            
            // Block out distortion
            const blockRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            blockRect.setAttribute('x', border);
            blockRect.setAttribute('y', Math.min(width, height) * (glassConfig.border * 0.5));
            blockRect.setAttribute('width', width - border * 2);
            blockRect.setAttribute('height', height - border * 2);
            blockRect.setAttribute('rx', radius);
            blockRect.setAttribute('fill', `hsl(0 0% ${glassConfig.lightness}% / ${glassConfig.alpha})`);
            blockRect.setAttribute('style', `filter:blur(${glassConfig.blur}px)`);
            svg.appendChild(blockRect);
            
            const serialized = new XMLSerializer().serializeToString(svg);
            const encoded = encodeURIComponent(serialized);
            return `data:image/svg+xml,${encoded}`;
        }

        // Update filter for all glass elements
        function updateGlassElements() {
            const glassElements = document.querySelectorAll('.nav-glass, .btn-secondary, .btn-outline, .badge, .tab-btn');
            
            glassElements.forEach((element, index) => {
                if (!element.id) {
                    element.id = `glass-${index}`;
                }
                
                const rect = element.getBoundingClientRect();
                const width = Math.max(rect.width, 100);
                const height = Math.max(rect.height, 40);
                const radius = parseInt(getComputedStyle(element).borderRadius) || 28;
                
                const dataUri = buildDisplacementImage(element, width, height, radius);
                
                // Update the feImage in the filter
                const feImage = document.querySelector('#glass-filter feImage');
                if (feImage) {
                    feImage.setAttribute('href', dataUri);
                }
                
                // Update filter attributes
                const feDisplacementMap = document.querySelectorAll('#glass-filter feDisplacementMap');
                feDisplacementMap.forEach((map, idx) => {
                    map.setAttribute('xChannelSelector', glassConfig.x);
                    map.setAttribute('yChannelSelector', glassConfig.y);
                    
                    let scale = glassConfig.scale;
                    if (idx === 0) scale += glassConfig.r; // red
                    if (idx === 1) scale += glassConfig.g; // green
                    if (idx === 2) scale += glassConfig.b; // blue
                    
                    map.setAttribute('scale', scale);
                });
                
                // Update CSS variables
                element.style.setProperty('--glass-width', width);
                element.style.setProperty('--glass-height', height);
                element.style.setProperty('--glass-radius', radius);
                element.style.setProperty('--glass-saturation', glassConfig.saturation);
            });
        }

        // Initialize on load
        updateGlassElements();
        
        // Update on resize with debounce
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(updateGlassElements, 150);
        });
        
        // Update when elements are added/removed
        const observer = new MutationObserver(() => {
            updateGlassElements();
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Initialize liquid glass after page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLiquidGlass);
    } else {
        initLiquidGlass();
    }


    // ===========================================
    // MAGIC FLOW TEXT EFFECT FOR HERO TITLE
    // ===========================================
    function initMagicFlowText() {
        const magicTextElements = document.querySelectorAll('.magic-text');
        
        magicTextElements.forEach((element) => {
            const text = element.textContent.trim();
            element.textContent = '';
            
            // Split text into letters
            for (let i = 0; i < text.length; i++) {
                const letter = document.createElement('span');
                letter.className = 'letter';
                letter.textContent = text[i];
                
                // Space handling
                if (text[i] === ' ') {
                    letter.style.width = '0.25em';
                    letter.style.display = 'inline-block';
                }
                
                element.appendChild(letter);
            }
        });
    }

    // Initialize magic flow text effect
    function initMagicFlowTextDelayed() {
        // Initialize immediately after DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initMagicFlowText);
        } else {
            initMagicFlowText();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMagicFlowTextDelayed);
    } else {
        initMagicFlowTextDelayed();
    }

    // ===========================================
    // INITIALIZE ON LOAD
    // ===========================================
    console.log('Aurora AI Website Initialized');
});
