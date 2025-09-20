// Theme Toggle Functionality
class ThemeToggle {
    constructor() {
        this.themeToggle = null;
        this.currentTheme = 'dark'; // Default theme
        this.init();
    }

    init() {
        this.createToggleElement();
        this.loadSavedTheme();
        this.bindEvents();
        this.applyTheme();
    }

    createToggleElement() {
        // Create theme toggle container
        const toggleContainer = document.createElement('div');
        toggleContainer.className = 'theme-toggle-container';
        
        // Create theme toggle button
        const toggleButton = document.createElement('div');
        toggleButton.className = 'theme-toggle';
        toggleButton.id = 'theme-toggle';
        
        // Create background element
        const toggleBg = document.createElement('div');
        toggleBg.className = 'toggle-bg';
        toggleButton.appendChild(toggleBg);
        
        // Create label
        const toggleLabel = document.createElement('span');
        toggleLabel.className = 'theme-toggle-label';
        toggleLabel.textContent = 'Тема';
        
        // Append elements
        toggleContainer.appendChild(toggleLabel);
        toggleContainer.appendChild(toggleButton);
        
        // Insert into body
        document.body.appendChild(toggleContainer);
        
        this.themeToggle = toggleButton;
    }

    bindEvents() {
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', (e) => {
                this.toggleTheme();
            });
        }
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme();
        this.saveTheme();
        this.updateToggleState();
    }

    applyTheme() {
        const body = document.body;
        
        // Remove existing theme classes
        body.classList.remove('dark-theme', 'light-theme');
        
        // Add current theme class
        body.classList.add(`${this.currentTheme}-theme`);
        
        // Update toggle button state
        this.updateToggleState();
        
        // Update background images based on theme
        this.updateBackgroundImages();
    }

    updateToggleState() {
        if (this.themeToggle) {
            if (this.currentTheme === 'dark') {
                this.themeToggle.classList.add('dark');
            } else {
                this.themeToggle.classList.remove('dark');
            }
        }
    }



    saveTheme() {
        try {
            localStorage.setItem('neuro-cafe-theme', this.currentTheme);
        } catch (error) {
            console.warn('Could not save theme preference:', error);
        }
    }

    loadSavedTheme() {
        try {
            const savedTheme = localStorage.getItem('neuro-cafe-theme');
            if (savedTheme && (savedTheme === 'dark' || savedTheme === 'light')) {
                this.currentTheme = savedTheme;
            }
        } catch (error) {
            console.warn('Could not load saved theme:', error);
        }
    }

    // Public method to get current theme
    getCurrentTheme() {
        return this.currentTheme;
    }

    // Public method to set theme programmatically
    setTheme(theme) {
        if (theme === 'dark' || theme === 'light') {
            this.currentTheme = theme;
            this.applyTheme();
            this.saveTheme();
        }
    }

    // Update background images based on current theme
    updateBackgroundImages() {
        const isDarkTheme = this.currentTheme === 'dark';
        
        // Update hero background elements
        const heroElements = document.querySelectorAll('.hero');
        heroElements.forEach(element => {
            const computedStyle = window.getComputedStyle(element, '::before');
            const currentBg = computedStyle.backgroundImage;
            
            if (isDarkTheme) {
                element.style.setProperty('--hero-bg', "url('images/img_bg_1.jpg')");
            } else {
                element.style.setProperty('--hero-bg', "url('images/img_bg_1_black.jpg')");
            }
        });

        // Update elements with inline background styles
        const bgElements = document.querySelectorAll('[style*="img_bg_1"], [style*="img_bg_3"]');
        bgElements.forEach(element => {
            const currentStyle = element.getAttribute('style') || '';
            let newStyle = currentStyle;
            
            if (isDarkTheme) {
                newStyle = newStyle.replace(/img_bg_1_black\.jpg/g, 'img_bg_1.jpg')
                                 .replace(/img_bg_3_black\.jpg/g, 'img_bg_3.jpg');
            } else {
                newStyle = newStyle.replace(/img_bg_1\.jpg/g, 'img_bg_1_black.jpg')
                                 .replace(/img_bg_3\.jpg/g, 'img_bg_3_black.jpg');
            }
            
            if (newStyle !== currentStyle) {
                element.setAttribute('style', newStyle);
            }
        });

        // Update CSS custom properties for background images
        const root = document.documentElement;
        if (isDarkTheme) {
            root.style.setProperty('--bg-image-1', "url('images/img_bg_1.jpg')");
            root.style.setProperty('--bg-image-3', "url('images/img_bg_3.jpg')");
        } else {
            root.style.setProperty('--bg-image-1', "url('images/img_bg_1_black.jpg')");
            root.style.setProperty('--bg-image-3', "url('images/img_bg_3_black.jpg')");
        }

        // Force reflow for smooth transitions
        document.body.offsetHeight;
    }
}

// Enhanced theme toggle with additional features
class EnhancedThemeToggle extends ThemeToggle {
    constructor() {
        super();
        this.addSystemThemeDetection();
        this.addThemeTransitionEffects();
    }

    addSystemThemeDetection() {
        // Check if user prefers dark mode
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            if (!localStorage.getItem('neuro-cafe-theme')) {
                this.currentTheme = 'dark';
                this.applyTheme();
            }
        }

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('neuro-cafe-theme')) {
                this.currentTheme = e.matches ? 'dark' : 'light';
                this.applyTheme();
            }
        });
    }

    addThemeTransitionEffects() {
        // Add smooth transition when theme changes
        const style = document.createElement('style');
        style.textContent = `
            body {
                transition: background 0.3s ease, color 0.3s ease;
            }
            .liquid-glass {
                transition: background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
            }
            .theme-toggle {
                transition: all 0.3s ease;
            }
        `;
        document.head.appendChild(style);
    }

    toggleTheme() {
        // Add sound effect (optional)
        this.playToggleSound();
        
        // Call parent method
        super.toggleTheme();
        
        // Add haptic feedback for mobile
        if ('vibrate' in navigator) {
            navigator.vibrate(50);
        }
    }

    playToggleSound() {
        // Create a subtle sound effect
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    }
}

// Initialize theme toggle when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Create enhanced theme toggle
    window.themeToggle = new EnhancedThemeToggle();
    
    // Add theme toggle to window object for global access
    window.toggleTheme = function() {
        window.themeToggle.toggleTheme();
    };
    
    // Set active navigation based on current page
    setActiveNavigation();
    
    // Add keyboard shortcut (Ctrl/Cmd + T)
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 't') {
            e.preventDefault();
            window.themeToggle.toggleTheme();
        }
    });
    
    // Add theme toggle to mobile menu if exists
    const mobileMenu = document.querySelector('.mobile-menu-btn');
    if (mobileMenu) {
        mobileMenu.addEventListener('click', function() {
            // Add theme toggle to mobile menu
            const mobileThemeToggle = document.createElement('div');
            mobileThemeToggle.className = 'mobile-theme-toggle';
            mobileThemeToggle.innerHTML = `
                <span>Тема</span>
                <div class="theme-toggle" onclick="toggleTheme()">
                    <div class="toggle-bg"></div>
                </div>
            `;
            
            // Add to mobile menu if not already present
            if (!document.querySelector('.mobile-theme-toggle')) {
                mobileMenu.parentNode.appendChild(mobileThemeToggle);
            }
        });
    }
});

// Function to set active navigation based on current page
function setActiveNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        
        if (href === currentPage || (currentPage === 'index.html' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ThemeToggle, EnhancedThemeToggle };
} 