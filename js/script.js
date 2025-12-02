/* ===================================
   WoosAI - Interactive Script
   All animations and interactions
   =================================== */

// ===================================
// 1. Counter Animation
// ===================================
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = Math.floor(target);
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Initialize counters when visible
function initCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.count);
                animateCounter(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

// ===================================
// 2. Scroll Interactive Features
// ===================================
function initScrollFeatures() {
    const featureItems = document.querySelectorAll('.feature-item');
    const visuals = document.querySelectorAll('.visual');
    
    if (featureItems.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove active class from all items
                featureItems.forEach(item => item.classList.remove('active'));
                visuals.forEach(visual => visual.classList.remove('active'));
                
                // Add active class to current item
                entry.target.classList.add('active');
                
                // Get feature number and activate corresponding visual
                const featureNum = entry.target.dataset.feature;
                const correspondingVisual = document.querySelector(`[data-visual="${featureNum}"]`);
                if (correspondingVisual) {
                    correspondingVisual.classList.add('active');
                }
            }
        });
    }, {
        threshold: 0.6,
        rootMargin: '-100px 0px -100px 0px'
    });
    
    featureItems.forEach(item => observer.observe(item));
}

// ===================================
// 3. Copy Code Functionality
// ===================================
function copyCode() {
    const code = 'pip install woosailibrary';
    
    // Copy to clipboard
    navigator.clipboard.writeText(code).then(() => {
        // Visual feedback
        const btn = document.querySelector('.copy-btn');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i>';
        btn.style.background = 'rgba(16, 185, 129, 0.3)';
        
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.background = '';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
        alert('Failed to copy. Please copy manually: ' + code);
    });
}

// Make copyCode available globally
window.copyCode = copyCode;

// ===================================
// 4. Smooth Scroll for Navigation
// ===================================
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip empty anchors
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===================================
// 5. Navbar Scroll Effect
// ===================================
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.style.boxShadow = '0 4px 16px rgba(12, 26, 88, 0.12)';
        } else {
            navbar.style.boxShadow = '0 2px 8px rgba(12, 26, 88, 0.08)';
        }
        
        lastScroll = currentScroll;
    });
}

// ===================================
// 6. Use Case Card Hover Effect
// ===================================
function initUseCaseCards() {
    const cards = document.querySelectorAll('.use-case-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Add ripple effect (optional enhancement)
            this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    });
}

// ===================================
// 7. Code Box Copy Buttons
// ===================================
function initCodeBoxes() {
    const codeBoxes = document.querySelectorAll('.code-box');
    
    codeBoxes.forEach(box => {
        // Add copy button if not exists
        if (!box.querySelector('.copy-code-btn')) {
            const copyBtn = document.createElement('button');
            copyBtn.className = 'copy-code-btn';
            copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
            copyBtn.onclick = function() {
                const code = box.textContent.trim();
                navigator.clipboard.writeText(code).then(() => {
                    copyBtn.innerHTML = '<i class="fas fa-check"></i>';
                    setTimeout(() => {
                        copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
                    }, 2000);
                });
            };
            
            box.style.position = 'relative';
            box.appendChild(copyBtn);
        }
    });
}

// ===================================
// 8. Animate Elements on Scroll
// ===================================
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.stat-card, .comparison-card, .step-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    entry.target.style.transition = 'all 0.6s ease';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(el => observer.observe(el));
}

// ===================================
// 9. Dynamic Token Flow Animation
// ===================================
function initTokenFlow() {
    const tokenFlow = document.querySelector('.token-flow');
    
    if (!tokenFlow) return;
    
    // Token flow is already handled by CSS animations
    // This function can be used for additional dynamic effects
    
    setInterval(() => {
        const nodes = tokenFlow.querySelectorAll('.token-node');
        nodes.forEach((node, index) => {
            // Add random delay variation for more organic feel
            const randomDelay = Math.random() * 0.5;
            node.style.animationDelay = `${index * 0.5 + randomDelay}s`;
        });
    }, 10000);
}

// ===================================
// 10. Live Activity Pulse
// ===================================
function initLiveActivity() {
    const liveActivity = document.querySelector('.live-activity');
    
    if (!liveActivity) return;
    
    const activities = [
        '실시간 최적화 중...',
        '토큰 압축 진행 중...',
        '비용 절감 계산 중...',
        'API 호출 최적화 중...'
    ];
    
    let currentIndex = 0;
    
    setInterval(() => {
        const activityText = liveActivity.querySelector('span:last-child');
        if (activityText) {
            activityText.style.opacity = '0';
            
            setTimeout(() => {
                currentIndex = (currentIndex + 1) % activities.length;
                activityText.textContent = activities[currentIndex];
                activityText.style.opacity = '1';
            }, 300);
        }
    }, 3000);
}

// ===================================
// 11. Savings Calculator (Optional)
// ===================================
function initSavingsCalculator() {
    // This can be expanded for an interactive calculator
    const savingsElements = document.querySelectorAll('.savings-content strong');
    
    savingsElements.forEach(element => {
        element.style.transition = 'color 0.3s ease';
        
        element.addEventListener('mouseenter', function() {
            this.style.color = '#FEB451';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.color = '';
        });
    });
}

// ===================================
// 12. Mobile Menu Toggle
// ===================================
function initMobileMenu() {
    // Create mobile menu button if screen is small
    if (window.innerWidth <= 768) {
        const navbar = document.querySelector('.navbar .container');
        
        if (!document.querySelector('.mobile-menu-btn')) {
            const menuBtn = document.createElement('button');
            menuBtn.className = 'mobile-menu-btn';
            menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            
            menuBtn.onclick = function() {
                const navLinks = document.querySelector('.nav-links');
                navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '60px';
                navLinks.style.left = '0';
                navLinks.style.right = '0';
                navLinks.style.background = '#0C1A58';
                navLinks.style.padding = '20px';
            };
            
            navbar.appendChild(menuBtn);
        }
    }
}

// ===================================
// 13. Performance Optimization
// ===================================
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

// ===================================
// INITIALIZATION
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 WoosAI Website Loaded');
    
    // Initialize all features
    initCounters();
    initScrollFeatures();
    initSmoothScroll();
    initNavbarScroll();
    initUseCaseCards();
    initCodeBoxes();
    initScrollAnimations();
    initTokenFlow();
    initLiveActivity();
    initSavingsCalculator();
    initMobileMenu();
    
    // Add loading complete class
    document.body.classList.add('loaded');
    
    console.log('✅ All features initialized');
});

// Handle window resize
window.addEventListener('resize', debounce(() => {
    initMobileMenu();
}, 250));

// ===================================
// Export functions for external use
// ===================================
window.WoosAI = {
    animateCounter,
    copyCode,
    initCounters,
    initScrollFeatures
};

// ===================================
// Additional CSS for dynamic elements
// ===================================
const style = document.createElement('style');
style.textContent = `
    .copy-code-btn {
        position: absolute;
        top: 8px;
        right: 8px;
        background: rgba(255, 255, 255, 0.2);
        border: none;
        padding: 6px 10px;
        border-radius: 4px;
        color: #F7F5EE;
        cursor: pointer;
        font-size: 0.85rem;
        transition: all 0.3s ease;
    }
    
    .copy-code-btn:hover {
        background: rgba(255, 255, 255, 0.3);
    }
    
    .mobile-menu-btn {
        display: none;
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 8px;
    }
    
    @media (max-width: 768px) {
        .mobile-menu-btn {
            display: block;
        }
        
        .nav-links {
            display: none;
        }
    }
    
    .live-activity {
        text-align: center;
        padding: 12px;
        background: rgba(65, 108, 194, 0.1);
        border-radius: 50px;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        margin-top: 20px;
    }
    
    .live-activity .pulse {
        width: 10px;
        height: 10px;
        background: #10b981;
        border-radius: 50%;
        animation: pulse 2s ease-in-out infinite;
    }
    
    .live-activity span {
        font-size: 0.9rem;
        color: #0C1A58;
        font-weight: 600;
        transition: opacity 0.3s ease;
    }
    
    body.loaded {
        animation: pageLoad 0.5s ease;
    }
    
    @keyframes pageLoad {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);