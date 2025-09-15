// Main JavaScript file for ShopEase e-commerce website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initVideoInteraction();
    initProductActions();
    initWishlistFunctionality();
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

// Product Actions (Add to Wishlist, Quick View)
function initProductActions() {
    // Add to wishlist buttons
    const addToWishlistButtons = document.querySelectorAll('.add-to-wishlist');
    
    addToWishlistButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productId = this.getAttribute('data-id');
            addToWishlist(productId);
            
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
    
    // Quick view buttons
    const quickViewButtons = document.querySelectorAll('.quick-view');
    
    quickViewButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productId = this.getAttribute('data-id');
            showQuickView(productId);
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

// Wishlist Functionality
function initWishlistFunctionality() {
    // Load wishlist from localStorage
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    updateWishlistCount();
    
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

// Add product to wishlist
function addToWishlist(productId) {
    // Get current wishlist or initialize empty array
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    // Check if product already in wishlist
    const existingProduct = wishlist.find(item => item.id === productId);
    
    if (existingProduct) {
        // Product already in wishlist - show notification
        showNotification('Product already in your wishlist');
        return;
    } else {
        // In a real app, you would fetch product details from an API
        // For this demo, we'll use hardcoded product data
        const products = {
            '1': {
                id: '1',
                name: 'Premium Wireless Earbuds',
                price: 24.99,
                image: 'images/product1.jpg'
            },
            '2': {
                id: '2',
                name: 'Smart Fitness Watch',
                price: 29.99,
                image: 'images/product2.jpg'
            },
            '3': {
                id: '3',
                name: 'Portable Bluetooth Speaker',
                price: 15.99,
                image: 'images/product3.jpg'
            },
            '4': {
                id: '4',
                name: 'HD Action Camera',
                price: 59.99,
                image: 'images/product4.jpg'
            }
        };
        
        const product = products[productId];
        if (product) {
            wishlist.push({
                ...product
            });
        }
    }
    
    // Save updated wishlist
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    
    // Update wishlist count in UI
    updateWishlistCount(1);
    
    // Show notification
    showNotification('Product added to wishlist!');
}

// Update wishlist count in the header
function updateWishlistCount(change = 0) {
    const wishlistCountElement = document.querySelector('.wishlist-count');
    let currentCount = parseInt(localStorage.getItem('wishlistCount') || '0');
    
    if (change !== 0) {
        currentCount += change;
        localStorage.setItem('wishlistCount', currentCount);
    }
    
    if (wishlistCountElement) {
        wishlistCountElement.textContent = currentCount;
        
        // Show/hide based on count
        if (currentCount > 0) {
            wishlistCountElement.style.display = 'flex';
        } else {
            wishlistCountElement.style.display = 'none';
        }
    }
}

// Quick view functionality
function showQuickView(productId) {
    // In a real app, you would fetch product details from an API
    // For this demo, we'll use hardcoded product data
    const products = {
        '1': {
            id: '1',
            name: 'Premium Wireless Earbuds',
            price: 24.99,
            image: 'https://m.media-amazon.com/images/I/61f1YfTkTDL._AC_SL1500_.jpg',
            description: 'Experience crystal-clear sound with these premium wireless earbuds. Features include active noise cancellation, water resistance, and long battery life.'
        },
        '2': {
            id: '2',
            name: 'Smart Fitness Watch',
            price: 29.99,
            image: 'https://m.media-amazon.com/images/I/61SSVxTSs3L._AC_SL1500_.jpg',
            description: 'Track your fitness goals with this advanced smartwatch. Monitors heart rate, steps, sleep quality and more with a beautiful display.'
        },
        '3': {
            id: '3',
            name: 'Portable Bluetooth Speaker',
            price: 15.99,
            image: 'https://m.media-amazon.com/images/I/71HXzrP2ITL._AC_SL1500_.jpg',
            description: 'Take your music anywhere with this compact yet powerful Bluetooth speaker. Offers rich sound, waterproof design, and 12-hour battery life.'
        },
        '4': {
            id: '4',
            name: 'HD Action Camera',
            price: 59.99,
            image: 'https://m.media-amazon.com/images/I/71H8N3F7scL._AC_SL1500_.jpg',
            description: 'Capture your adventures in stunning 4K resolution. This action camera is waterproof, shockproof, and comes with various mounting accessories.'
        }
    };
    
    const product = products[productId];
    if (!product) return;
    
    // Create modal container
    const modal = document.createElement('div');
    modal.className = 'quick-view-modal';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0,0,0,0.7)';
    modal.style.zIndex = '1000';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.opacity = '0';
    modal.style.transition = 'opacity 0.3s ease';
    
    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.className = 'quick-view-content';
    modalContent.style.backgroundColor = '#fff';
    modalContent.style.borderRadius = '8px';
    modalContent.style.maxWidth = '800px';
    modalContent.style.width = '90%';
    modalContent.style.display = 'flex';
    modalContent.style.flexDirection = 'column';
    modalContent.style.maxHeight = '90vh';
    modalContent.style.overflow = 'auto';
    modalContent.style.transform = 'translateY(20px)';
    modalContent.style.transition = 'transform 0.3s ease';
    
    // Add product details to modal
    modalContent.innerHTML = `
        <div class="quick-view-header" style="display: flex; justify-content: space-between; align-items: center; padding: 15px 20px; border-bottom: 1px solid #eee;">
            <h3 style="margin: 0; font-size: 18px;">{product.name}</h3>
            <button class="close-modal" style="background: none; border: none; font-size: 20px; cursor: pointer;">&times;</button>
        </div>
        <div class="quick-view-body" style="display: flex; flex-direction: column; padding: 20px; gap: 20px;">
            <div class="product-image" style="text-align: center;">
                <img src="${product.image}" alt="${product.name}" style="max-width: 100%; max-height: 300px; object-fit: contain;">
            </div>
            <div class="product-details">
                <p class="product-description" style="margin-bottom: 15px; color: #666;">${product.description}</p>
                <div class="product-price" style="font-size: 18px; font-weight: 600; margin-bottom: 15px;">
                    ₹${product.price.toFixed(2)}
                </div>
                <div class="product-actions" style="display: flex; gap: 10px;">
                    <button class="add-to-wishlist-modal btn primary-btn" data-id="${product.id}" style="background-color: #1a56db; color: white; border: none; padding: 10px 15px; border-radius: 4px; cursor: pointer;">
                        <i class="fas fa-heart"></i> Add to Wishlist
                    </button>
                    <a href="product-detail.html?id=${product.id}" class="btn secondary-btn" style="background-color: #f3f4f6; color: #333; border: none; padding: 10px 15px; border-radius: 4px; text-decoration: none; display: inline-block;">
                        View Details
                    </a>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to DOM
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Show modal with animation
    setTimeout(() => {
        modal.style.opacity = '1';
        modalContent.style.transform = 'translateY(0)';
    }, 10);
    
    // Close modal on click outside or close button
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    const closeButton = modalContent.querySelector('.close-modal');
    if (closeButton) {
        closeButton.addEventListener('click', closeModal);
    }
    
    // Add to wishlist from modal
    const addToWishlistButton = modalContent.querySelector('.add-to-wishlist-modal');
    if (addToWishlistButton) {
        addToWishlistButton.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            addToWishlist(productId);
            
            // Visual feedback
            this.innerHTML = '<i class="fas fa-check"></i> Added to Wishlist';
            this.disabled = true;
        });
    }
    
    function closeModal() {
        modal.style.opacity = '0';
        modalContent.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            document.body.removeChild(modal);
        }, 300);
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
    notification.style.backgroundColor = '#1a56db';
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