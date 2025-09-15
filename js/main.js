// Main JavaScript file for ShopEase e-commerce website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initVideoInteraction();
    initProductActions();
    initCartFunctionality();
    initTestimonialSlider();
});

// Mobile Navigation Toggle
function initNavigation() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
            
            // Toggle icon between bars and times
            const icon = menuToggle.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (navLinks && navLinks.classList.contains('active') && 
            !event.target.closest('.nav-links') && 
            !event.target.closest('.menu-toggle')) {
            navLinks.classList.remove('active');
            
            if (menuToggle) {
                menuToggle.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                if (icon && icon.classList.contains('fa-times')) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        }
    });
}

// Video Interaction - Slide up on click
function initVideoInteraction() {
    const videoContainer = document.querySelector('.video-container');
    const playButton = document.querySelector('.play-button');
    
    if (videoContainer && playButton) {
        playButton.addEventListener('click', function() {
            // Add active class to slide up the video
            videoContainer.classList.add('active');
            
            // Create and play video
            const videoPlaceholder = videoContainer.querySelector('img');
            if (videoPlaceholder) {
                const video = document.createElement('video');
                video.src = 'videos/product-video.mp4'; // Path to your video file
                video.controls = true;
                video.autoplay = true;
                video.style.width = '100%';
                video.style.height = '100%';
                video.style.objectFit = 'cover';
                video.style.position = 'absolute';
                video.style.top = '0';
                video.style.left = '0';
                
                // Replace image with video
                videoPlaceholder.style.display = 'none';
                videoContainer.appendChild(video);
                
                // Hide play button
                playButton.style.display = 'none';
            }
        });
    }
}

// Product Actions (Add to Cart, Wishlist, Quick View)
function initProductActions() {
    // Add to cart buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productId = this.getAttribute('data-id');
            addToCart(productId);
            
            // Visual feedback
            const originalIcon = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check"></i>';
            this.classList.add('added');
            
            setTimeout(() => {
                this.innerHTML = originalIcon;
                this.classList.remove('added');
            }, 1500);
        });
    });
    
    // Product image hover effect
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const actions = this.querySelector('.product-actions');
            if (actions) {
                actions.style.bottom = '0';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const actions = this.querySelector('.product-actions');
            if (actions) {
                actions.style.bottom = '-50px';
            }
        });
    });
}

// Cart Functionality
function initCartFunctionality() {
    // Load cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartCount(cart.length);
    
    // Newsletter form submission
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            if (emailInput && emailInput.value) {
                // Show success message
                const formContainer = this.parentElement;
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.textContent = 'Thank you for subscribing!';
                successMessage.style.marginTop = '20px';
                successMessage.style.padding = '10px';
                successMessage.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                successMessage.style.borderRadius = '4px';
                
                // Replace form with success message
                formContainer.innerHTML = '';
                formContainer.appendChild(successMessage);
            }
        });
    }
}

// Add product to cart
function addToCart(productId) {
    // Get current cart or initialize empty array
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if product already in cart
    const existingProduct = cart.find(item => item.id === productId);
    
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        // In a real app, you would fetch product details from an API
        // For this demo, we'll use hardcoded product data
        const products = {
            '1': {
                id: '1',
                name: 'Premium Wireless Earbuds',
                price: 1999,
                image: 'images/product1.jpg'
            },
            '2': {
                id: '2',
                name: 'Smart Fitness Watch',
                price: 2499,
                image: 'images/product2.jpg'
            },
            '3': {
                id: '3',
                name: 'Portable Bluetooth Speaker',
                price: 1299,
                image: 'images/product3.jpg'
            },
            '4': {
                id: '4',
                name: 'HD Action Camera',
                price: 4999,
                image: 'images/product4.jpg'
            }
        };
        
        const product = products[productId];
        if (product) {
            cart.push({
                ...product,
                quantity: 1
            });
        }
    }
    
    // Save updated cart
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count in UI
    updateCartCount(cart.length);
    
    // Show notification
    showNotification('Product added to cart!');
}

// Update cart count in the header
function updateCartCount(count) {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = count;
    }
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Style the notification
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = 'var(--success-color)';
    notification.style.color = 'white';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = 'var(--border-radius)';
    notification.style.boxShadow = 'var(--box-shadow)';
    notification.style.zIndex = '1000';
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(20px)';
    notification.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Simple testimonial slider
function initTestimonialSlider() {
    const testimonials = document.querySelectorAll('.testimonial-card');
    let currentIndex = 0;
    
    // Only initialize if there are multiple testimonials and we're on a small screen
    if (testimonials.length > 1 && window.innerWidth < 768) {
        // Hide all except first
        testimonials.forEach((testimonial, index) => {
            if (index !== 0) {
                testimonial.style.display = 'none';
            }
        });
        
        // Create navigation dots
        const sliderContainer = document.querySelector('.testimonial-slider');
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'slider-dots';
        dotsContainer.style.display = 'flex';
        dotsContainer.style.justifyContent = 'center';
        dotsContainer.style.marginTop = '20px';
        dotsContainer.style.gap = '10px';
        
        testimonials.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.className = index === 0 ? 'dot active' : 'dot';
            dot.style.width = '10px';
            dot.style.height = '10px';
            dot.style.borderRadius = '50%';
            dot.style.backgroundColor = index === 0 ? 'var(--primary-color)' : 'var(--gray-color)';
            dot.style.cursor = 'pointer';
            dot.style.transition = 'background-color 0.3s ease';
            
            dot.addEventListener('click', () => showTestimonial(index));
            dotsContainer.appendChild(dot);
        });
        
        if (sliderContainer) {
            sliderContainer.after(dotsContainer);
        }
        
        // Auto-rotate testimonials
        setInterval(() => {
            currentIndex = (currentIndex + 1) % testimonials.length;
            showTestimonial(currentIndex);
        }, 5000);
    }
    
    function showTestimonial(index) {
        testimonials.forEach((testimonial, i) => {
            testimonial.style.display = i === index ? 'block' : 'none';
        });
        
        // Update dots
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, i) => {
            dot.style.backgroundColor = i === index ? 'var(--primary-color)' : 'var(--gray-color)';
        });
        
        currentIndex = index;
    }
}