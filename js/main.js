// Main JavaScript for НейроКофейня

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize Application
function initializeApp() {
    setupHeaderScroll();
    setupSmoothScrolling();
    setupAnimations();
    setupFormHandlers();
    setupMobileMenu();
    setupThemeToggle();
}

// Header Scroll Effect
function setupHeaderScroll() {
    const header = document.getElementById('header');
    if (!header) return;

    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    });
}

// Smooth Scrolling for Navigation Links
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Animation on Scroll
function setupAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.liquid-glass, .card, .feature-card, .menu-item, .team-member, .timeline-content, .contact-info, .social-item, .faq-item');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// Form Handlers
function setupFormHandlers() {
    // Contact Form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }

    // Booking Form
    const bookingForm = document.querySelector('.booking-form form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleBookingForm);
    }

    // Newsletter Form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterForm);
    }
}

// Contact Form Handler
function handleContactForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Validate form
    if (!validateForm(data)) {
        return;
    }
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Отправка...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        showNotification('Сообщение отправлено! Мы свяжемся с вами в ближайшее время.', 'success');
        e.target.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

// iOS Modal System
function createIOSModal(title, content, actions = []) {
    const modalHTML = `
        <div class="ios-modal-overlay" id="ios-modal">
            <div class="ios-modal">
                <div class="ios-modal-header">
                    <h3>${title}</h3>
                    <button class="ios-modal-close" onclick="closeIOSModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="ios-modal-body">
                    ${content}
                </div>
                ${actions.length > 0 ? `
                    <div class="ios-modal-actions">
                        ${actions.map(action => `
                            <button class="ios-modal-btn ${action.type || 'ios-modal-btn-secondary'}" onclick="${action.onClick}">
                                ${action.text}
                            </button>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    setTimeout(() => {
        document.getElementById('ios-modal').classList.add('active');
    }, 10);
}

function closeIOSModal() {
    const modal = document.getElementById('ios-modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();
            // Restore body scroll
            document.body.classList.remove('picker-open');
        }, 400);
    }
}

// iOS Picker System
function createIOSPicker(title, options, onSelect) {
    // Remove any existing pickers first
    const existingPickers = document.querySelectorAll('.ios-picker');
    existingPickers.forEach(picker => picker.remove());
    
    const pickerHTML = `
        <div class="ios-picker" id="ios-picker" style="z-index: 999999; position: fixed; bottom: 0; left: 0; right: 0; transform: translateY(100%);">
            <div class="ios-picker-header">
                <span class="ios-picker-title">${title}</span>
                <button class="ios-picker-close" onclick="closeIOSPicker()">Готово</button>
            </div>
            <div class="ios-picker-content">
                ${options.map(option => `
                    <button class="ios-picker-option" data-value="${option.value}" onclick="selectPickerOption('${option.value}', '${option.label}')">
                        ${option.label}
                    </button>
                `).join('')}
            </div>
        </div>
    `;
    
    // Create a container for the picker to ensure proper positioning
    const pickerContainer = document.createElement('div');
    pickerContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 999999;
        pointer-events: none;
        display: flex;
        align-items: flex-end;
    `;
    pickerContainer.innerHTML = pickerHTML;
    
    // Add click handler to close picker when clicking on background
    pickerContainer.addEventListener('click', function(e) {
        if (e.target === pickerContainer) {
            closeIOSPicker();
        }
    });
    
    document.body.appendChild(pickerContainer);
    
    // Prevent body scroll
    document.body.classList.add('picker-open');
    
    setTimeout(() => {
        const picker = document.getElementById('ios-picker');
        if (picker) {
            picker.style.pointerEvents = 'auto';
            picker.style.zIndex = '999999';
            picker.style.transform = 'translateY(0)';
            picker.classList.add('active');
            
            // Ensure picker is visible and properly positioned
            const rect = picker.getBoundingClientRect();
            if (rect.bottom > window.innerHeight) {
                picker.style.maxHeight = '70vh';
                picker.style.overflowY = 'auto';
            }
        }
    }, 10);
    
    // Store callback
    window.pickerCallback = onSelect;
}

function selectPickerOption(value, label) {
    if (window.pickerCallback) {
        window.pickerCallback(value, label);
    }
    closeIOSPicker();
}

function closeIOSPicker() {
    const picker = document.getElementById('ios-picker');
    if (picker) {
        picker.classList.remove('active');
        setTimeout(() => {
            // Remove the picker and its container
            const pickerContainer = picker.closest('div[style*="z-index: 999999"]');
            if (pickerContainer) {
                pickerContainer.remove();
            } else {
                picker.remove();
            }
            // Restore body scroll
            document.body.classList.remove('picker-open');
        }, 400);
    }
}

// Booking Form Handler
function handleBookingForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    if (!validateBookingForm(data)) {
        return;
    }
    
    // Show success modal
    createIOSModal('Бронирование подтверждено', `
        <div style="text-align: center; padding: 2rem 0;">
            <i class="fas fa-check-circle" style="font-size: 4rem; color: #50C2C2; margin-bottom: 1rem;"></i>
            <h4 style="margin-bottom: 1rem; color: #333;">Бронирование отправлено!</h4>
            <p style="color: #666; line-height: 1.6;">
                Мы свяжемся с вами в ближайшее время для подтверждения бронирования.
            </p>
        </div>
    `, [
        {
            text: 'Отлично',
            type: 'ios-modal-btn-primary',
            onClick: 'closeIOSModal()'
        }
    ]);
    
    e.target.reset();
    
    // Reset display fields
    document.getElementById('guests-display').textContent = 'Выберите количество';
    document.getElementById('date-display').textContent = 'Выберите дату';
    document.getElementById('time-display').textContent = 'Выберите время';
    
    // Remove selected class from input fields
    document.querySelectorAll('.ios-input-field').forEach(field => {
        field.classList.remove('selected');
    });
}

// iOS Picker Functions
function showGuestsPicker() {
    const options = [
        { value: '1', label: '1 человек' },
        { value: '2', label: '2 человека' },
        { value: '3', label: '3 человека' },
        { value: '4', label: '4 человека' },
        { value: '5+', label: '5+ человек' }
    ];
    
    createIOSPicker('Количество гостей', options, (value, label) => {
        document.getElementById('guests').value = value;
        document.getElementById('guests-display').textContent = label;
        document.querySelector('.ios-input-field[onclick="showGuestsPicker()"]').classList.add('selected');
    });
}

function showDatePicker() {
    const today = new Date();
    const options = [];
    
    for (let i = 0; i < 14; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const formattedDate = date.toLocaleDateString('ru-RU', {
            weekday: 'long',
            day: 'numeric',
            month: 'long'
        });
        const value = date.toISOString().split('T')[0];
        
        options.push({
            value: value,
            label: formattedDate
        });
    }
    
    createIOSPicker('Выберите дату', options, (value, label) => {
        document.getElementById('date').value = value;
        document.getElementById('date-display').textContent = label;
        document.querySelector('.ios-input-field[onclick="showDatePicker()"]').classList.add('selected');
    });
}

function showTimePicker() {
    const options = [];
    const startHour = 8;
    const endHour = 23;
    
    for (let hour = startHour; hour <= endHour; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
            const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            const displayTime = `${hour}:${minute.toString().padStart(2, '0')}`;
            
            options.push({
                value: timeString,
                label: displayTime
            });
        }
    }
    
    createIOSPicker('Выберите время', options, (value, label) => {
        document.getElementById('time').value = value;
        document.getElementById('time-display').textContent = label;
        document.querySelector('.ios-input-field[onclick="showTimePicker()"]').classList.add('selected');
    });
}

// Menu Page Functions
function filterMenu(category) {
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        if (category === 'all' || item.dataset.category === category) {
            item.style.display = 'block';
            item.classList.add('animate-fade-in');
        } else {
            item.style.display = 'none';
        }
    });
}

function changeQuantity(btn, change) {
    const quantityDisplay = btn.parentElement.querySelector('.quantity-display');
    let quantity = parseInt(quantityDisplay.textContent);
    quantity = Math.max(0, quantity + change);
    quantityDisplay.textContent = quantity;
}

// Cart functionality
let cart = [];
let cartTotal = 0;

function addToCart(btn) {
    const menuItem = btn.closest('.menu-item');
    const title = menuItem.querySelector('.menu-item-title').textContent;
    const price = parseInt(menuItem.querySelector('.menu-item-price').textContent);
    const quantity = parseInt(menuItem.querySelector('.quantity-display').textContent);
    
    if (quantity > 0) {
        const existingItem = cart.find(item => item.title === title);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({ title, price, quantity });
        }
        
        cartTotal += price * quantity;
        updateCart();
        
        // Reset quantity
        menuItem.querySelector('.quantity-display').textContent = '0';
        
        // Show success message
        showNotification('Товар добавлен в корзину!');
    }
}

function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotalElement = document.getElementById('cart-total');
    
    if (!cartItems || !cartCount || !cartTotalElement) return;
    
    cartItems.innerHTML = '';
    let totalItems = 0;
    
    cart.forEach(item => {
        totalItems += item.quantity;
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.title}</h4>
                <span>${item.quantity} x ${item.price}₽</span>
            </div>
            <div class="cart-item-price">${item.price * item.quantity}₽</div>
        `;
        cartItems.appendChild(cartItem);
    });
    
    cartCount.textContent = totalItems;
    cartTotalElement.textContent = cartTotal + '₽';
}

function toggleCart() {
    const cartPanel = document.getElementById('cart-panel');
    if (cartPanel) {
        cartPanel.classList.toggle('active');
    }
}

// FAQ toggle function
function toggleFAQ(element) {
    const answer = element.nextElementSibling;
    const isActive = element.classList.contains('active');
    
    // Close all other FAQ items
    document.querySelectorAll('.faq-question').forEach(item => {
        item.classList.remove('active');
        item.nextElementSibling.classList.remove('active');
    });
    
    // Toggle current item
    if (!isActive) {
        element.classList.add('active');
        answer.classList.add('active');
    }
}

// Newsletter Form Handler
function handleNewsletterForm(e) {
    e.preventDefault();
    
    const email = e.target.querySelector('input[type="email"]').value;
    
    if (!validateEmail(email)) {
        showNotification('Пожалуйста, введите корректный email адрес.', 'error');
        return;
    }
    
    showNotification('Спасибо за подписку!', 'success');
    e.target.reset();
}

// Form Validation
function validateForm(data) {
    const required = ['name', 'email', 'subject', 'message'];
    
    for (let field of required) {
        if (!data[field] || data[field].trim() === '') {
            showNotification(`Пожалуйста, заполните поле "${field}"`, 'error');
            return false;
        }
    }
    
    if (!validateEmail(data.email)) {
        showNotification('Пожалуйста, введите корректный email адрес.', 'error');
        return false;
    }
    
    return true;
}

function validateBookingForm(data) {
    const required = ['guests', 'date', 'time'];
    
    for (let field of required) {
        if (!data[field] || data[field].trim() === '') {
            showNotification(`Пожалуйста, заполните поле "${field}"`, 'error');
            return false;
        }
    }
    
    return true;
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification System
function showNotification(message, type = 'info') {
    showEnhancedNotification(message, type, 5000);
}

// Enhanced Mobile Menu
function setupMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
            body.classList.toggle('menu-open');
        });
        
        // Close menu when clicking on menu items
        navMenu.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                navMenu.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                body.classList.remove('menu-open');
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenuBtn.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                body.classList.remove('menu-open');
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                navMenu.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                body.classList.remove('menu-open');
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                navMenu.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                body.classList.remove('menu-open');
            }
        });
    }
}

// Theme Toggle
function setupThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
}

function toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update toggle button
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.innerHTML = newTheme === 'dark' ? '☀️' : '🌙';
    }
}

// Load saved theme
function loadSavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.setAttribute('data-theme', savedTheme);
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.innerHTML = savedTheme === 'dark' ? '☀️' : '🌙';
        }
    }
}

// Utility Functions
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

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Parallax Effect
function setupParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    window.addEventListener('scroll', throttle(() => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.parallax || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }, 16));
}

// Lazy Loading for Images
function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Counter Animation
function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.dataset.target);
                const duration = parseInt(counter.dataset.duration) || 2000;
                const increment = target / (duration / 16);
                let current = 0;
                
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.textContent = Math.floor(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                };
                
                updateCounter();
                counterObserver.unobserve(counter);
            }
        });
    });
    
    counters.forEach(counter => counterObserver.observe(counter));
}

// Initialize additional features
document.addEventListener('DOMContentLoaded', function() {
    loadSavedTheme();
    setupParallax();
    setupLazyLoading();
    animateCounters();
            setupParticleSystem();
        setupScrollProgress();
        setupMagneticEffects();
    setupRippleEffects();
    setupTextAnimations();
    setupHoverEffects();
    
    // Close modals when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('ios-modal-overlay')) {
            closeIOSModal();
        }
    });
    
    // Close pickers when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('ios-picker-close')) {
            closeIOSPicker();
        }
    });
    
    // Close modals with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeIOSModal();
            closeIOSPicker();
        }
    });
    
    // Initialize menu page functionality
    setupMenuPage();
});

// Setup menu page functionality
function setupMenuPage() {
    // Category filtering
    document.querySelectorAll('.category-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');
            
            const category = this.dataset.category;
            filterMenu(category);
        });
    });
}

// Particle System
function setupParticleSystem() {
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particle-container';
    particleContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
    `;
    document.body.appendChild(particleContainer);
    
    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            background: rgba(78, 205, 196, ${Math.random() * 0.5 + 0.3});
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: 100%;
            animation: particleFloat ${Math.random() * 3 + 2}s ease-in-out infinite;
        `;
        
        particleContainer.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 5000);
    }
    
    // Create particles periodically
    setInterval(createParticle, 2000);
}

// Scroll Progress Indicator
function setupScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.offsetHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}



// Magnetic Effects
function setupMagneticEffects() {
    document.querySelectorAll('.magnetic').forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            element.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translate(0, 0)';
        });
    });
}

// Ripple Effects
function setupRippleEffects() {
    document.querySelectorAll('.ripple').forEach(element => {
        element.addEventListener('click', (e) => {
            const ripple = document.createElement('span');
            const rect = element.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            element.appendChild(ripple);
            
            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.parentNode.removeChild(ripple);
                }
            }, 600);
        });
    });
}

// Text Animations
function setupTextAnimations() {
    const textElements = document.querySelectorAll('h1, h2, h3, p');
    
    const textObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-scale');
                textObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    textElements.forEach(el => textObserver.observe(el));
}

// Enhanced Hover Effects
function setupHoverEffects() {
    // Add hover classes to elements
    document.querySelectorAll('.card, .btn, .nav-menu a').forEach(el => {
        el.classList.add('card-hover', 'button-hover');
    });
    
    // Add glow effect to important elements
    document.querySelectorAll('.logo, .section-title').forEach(el => {
        el.classList.add('glow-effect');
    });
    
    // Add ripple effect to buttons
    document.querySelectorAll('.btn').forEach(el => {
        el.classList.add('ripple');
    });
    
    // Add magnetic effect to cards
    document.querySelectorAll('.card').forEach(el => {
        el.classList.add('magnetic');
    });
}

// Enhanced Animation Observer
function setupEnhancedAnimations() {
    const animatedElements = document.querySelectorAll('.liquid-glass, .card, .feature-card, .menu-item, .team-member, .timeline-content, .contact-info, .social-item, .faq-item');
    
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add staggered animation
                setTimeout(() => {
                    entry.target.classList.add('animate-fade-scale');
                }, Math.random() * 500);
                
                animationObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    animatedElements.forEach(el => animationObserver.observe(el));
}

// Smooth Page Transitions
function setupPageTransitions() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                // Add fade out effect
                document.body.classList.add('page-transition', 'fade-out');
                
                setTimeout(() => {
                    target.scrollIntoView({ behavior: 'smooth' });
                    document.body.classList.remove('fade-out');
                    document.body.classList.add('fade-in');
                    
                    setTimeout(() => {
                        document.body.classList.remove('page-transition', 'fade-in');
                    }, 300);
                }, 150);
            }
        });
    });
}

// Enhanced Loading States
function showEnhancedLoading(element) {
    const originalContent = element.innerHTML;
    element.innerHTML = '<span class="loading-dots">Загрузка</span>';
    element.disabled = true;
    
    return () => {
        element.innerHTML = originalContent;
        element.disabled = false;
    };
}

// Enhanced Notification System
function showEnhancedNotification(message, type = 'info', duration = 5000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type} animate-bounce-in`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        border-radius: 15px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        max-width: 400px;
        word-wrap: break-word;
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.2);
    `;
    
    // Set background based on type
    switch(type) {
        case 'success':
            notification.style.background = 'linear-gradient(135deg, rgba(76, 175, 80, 0.9), rgba(129, 199, 132, 0.9))';
            break;
        case 'error':
            notification.style.background = 'linear-gradient(135deg, rgba(244, 67, 54, 0.9), rgba(239, 154, 154, 0.9))';
            break;
        case 'warning':
            notification.style.background = 'linear-gradient(135deg, rgba(255, 152, 0, 0.9), rgba(255, 183, 77, 0.9))';
            break;
        default:
            notification.style.background = 'linear-gradient(135deg, rgba(78, 205, 196, 0.9), rgba(120, 119, 198, 0.9))';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Auto remove after duration
    setTimeout(() => {
        notification.classList.remove('animate-bounce-in');
        notification.classList.add('animate-fade-scale');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, duration);
    
    // Add click to dismiss
    notification.addEventListener('click', () => {
        notification.classList.remove('animate-bounce-in');
        notification.classList.add('animate-fade-scale');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    });
}

// Initialize enhanced features
document.addEventListener('DOMContentLoaded', function() {
    setupEnhancedAnimations();
    setupPageTransitions();
});

// Enhanced CSS animations and effects
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes bounceIn {
        0% {
            opacity: 0;
            transform: scale(0.3);
        }
        50% {
            opacity: 1;
            transform: scale(1.05);
        }
        70% {
            transform: scale(0.9);
        }
        100% {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(50px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes fadeInScale {
        from {
            opacity: 0;
            transform: scale(0.8);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    @keyframes shimmer {
        0% {
            background-position: -200% 0;
        }
        100% {
            background-position: 200% 0;
        }
    }
    
    @keyframes float {
        0%, 100% {
            transform: translateY(0px);
        }
        50% {
            transform: translateY(-10px);
        }
    }
    
    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
        }
    }
    
    @keyframes rotate {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
    
    @keyframes wave {
        0%, 100% {
            transform: translateX(0);
        }
        50% {
            transform: translateX(10px);
        }
    }
    
    @keyframes ripple {
        0% {
            transform: scale(0);
            opacity: 1;
        }
        100% {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .notification {
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
    }
    
    .notification::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        transition: left 0.5s ease;
    }
    
    .notification:hover::before {
        left: 100%;
    }
    
    .notification:hover {
        transform: translateY(-3px) scale(1.02);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
    }
    
    .mobile-menu-btn {
        display: none;
        flex-direction: column;
        cursor: pointer;
        padding: 0.5rem;
        transition: all 0.3s ease;
    }
    
    .mobile-menu-btn:hover {
        transform: scale(1.1);
    }
    
    .mobile-menu-btn span {
        width: 25px;
        height: 3px;
        background: white;
        margin: 3px 0;
        transition: 0.3s ease;
        border-radius: 2px;
    }
    
    .mobile-menu-btn.active span:nth-child(1) {
        transform: rotate(-45deg) translate(-5px, 6px);
    }
    
    .mobile-menu-btn.active span:nth-child(2) {
        opacity: 0;
        transform: translateX(-20px);
    }
    
    .mobile-menu-btn.active span:nth-child(3) {
        transform: rotate(45deg) translate(-5px, -6px);
    }
    
    .animate-bounce-in {
        animation: bounceIn 0.6s ease-out;
    }
    
    .animate-slide-up {
        animation: slideInUp 0.6s ease-out;
    }
    
    .animate-fade-scale {
        animation: fadeInScale 0.6s ease-out;
    }
    
    .animate-float {
        animation: float 3s ease-in-out infinite;
    }
    
    .animate-pulse {
        animation: pulse 2s ease-in-out infinite;
    }
    
    .animate-rotate {
        animation: rotate 2s linear infinite;
    }
    
    .animate-wave {
        animation: wave 1s ease-in-out infinite;
    }
    
    .shimmer {
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
        background-size: 200% 100%;
        animation: shimmer 2s infinite;
    }
    
    .magnetic {
        transition: transform 0.3s ease;
    }
    
    .magnetic:hover {
        transform: scale(1.05);
    }
    
    .glow-effect {
        transition: all 0.3s ease;
    }
    
    .glow-effect:hover {
        box-shadow: 0 0 20px rgba(78, 205, 196, 0.5);
        transform: translateY(-2px);
    }
    
    .ripple {
        position: relative;
        overflow: hidden;
    }
    
    .ripple::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: translate(-50%, -50%);
        transition: width 0.6s, height 0.6s;
    }
    
    .ripple:active::after {
        width: 300px;
        height: 300px;
    }
    
    .parallax-element {
        transition: transform 0.1s ease-out;
    }
    
    .text-gradient {
        background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1);
        background-size: 200% 200%;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        animation: gradientShift 3s ease-in-out infinite;
    }
    
    @keyframes gradientShift {
        0%, 100% {
            background-position: 0% 50%;
        }
        50% {
            background-position: 100% 50%;
        }
    }
    
    .card-hover {
        transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    
    .card-hover:hover {
        transform: translateY(-10px) scale(1.02);
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }
    
    .button-hover {
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
    }
    
    .button-hover::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        transition: left 0.5s ease;
    }
    
    .button-hover:hover::before {
        left: 100%;
    }
    
    .button-hover:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
    }
    
    @media (max-width: 768px) {
        .mobile-menu-btn {
            display: flex;
        }
        
        .nav-menu {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: rgba(63, 58, 74, 0.95);
            backdrop-filter: blur(20px);
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            flex-direction: column;
            padding: 1rem;
            transform: translateY(-100%);
            opacity: 0;
            transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
        }
        
        .nav-menu.active {
            transform: translateY(0);
            opacity: 1;
        }
        
        .nav-menu a {
            padding: 1rem;
            border-radius: 10px;
            transition: all 0.3s ease;
        }
        
        .nav-menu a:hover {
            background: rgba(255, 255, 255, 0.1);
            transform: translateX(10px);
        }
    }
    
    /* Particle system */
    .particle {
        position: absolute;
        pointer-events: none;
        opacity: 0;
        animation: particleFloat 4s ease-in-out infinite;
    }
    
    @keyframes particleFloat {
        0% {
            opacity: 0;
            transform: translateY(0) scale(0);
        }
        10% {
            opacity: 1;
            transform: translateY(-10px) scale(1);
        }
        90% {
            opacity: 1;
            transform: translateY(-100px) scale(1);
        }
        100% {
            opacity: 0;
            transform: translateY(-150px) scale(0);
        }
    }
    
    /* Loading animations */
    .loading-dots {
        display: inline-block;
    }
    
    .loading-dots::after {
        content: '';
        animation: loadingDots 1.5s infinite;
    }
    
    @keyframes loadingDots {
        0%, 20% {
            content: '';
        }
        40% {
            content: '.';
        }
        60% {
            content: '..';
        }
        80%, 100% {
            content: '...';
        }
    }
    
    /* Scroll progress indicator */
    .scroll-progress {
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #ff6b6b, #4ecdc4);
        z-index: 9999;
        transition: width 0.1s ease;
    }
    
    /* Cursor effects */
    .custom-cursor {
        position: fixed;
        width: 20px;
        height: 20px;
        border: 2px solid #4ecdc4;
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: all 0.1s ease;
        transform: translate(-50%, -50%);
    }
    
    .custom-cursor.hover {
        width: 40px;
        height: 40px;
        background: rgba(78, 205, 196, 0.2);
        border-color: #4ecdc4;
    }
`;

document.head.appendChild(style); 