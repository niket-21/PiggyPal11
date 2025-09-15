// Product Detail Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initProductDetail();
});

function initProductDetail() {
    // Initialize all product detail page functionality
    initThumbnailGallery();
    initQuantitySelector();
    initProductTabs();
    initImageZoom();
    initColorOptions();
    initRatingSelect();
    handleAddToWishlist();
    handleQuickView();
    loadProductData();
}

// Handle thumbnail gallery
function initThumbnailGallery() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.getElementById('main-product-image');
    
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            // Remove active class from all thumbnails
            thumbnails.forEach(item => item.classList.remove('active'));
            
            // Add active class to clicked thumbnail
            this.classList.add('active');
            
            // Update main image source
            const imgSrc = this.getAttribute('data-img');
            mainImage.src = imgSrc;
        });
    });
}

// Handle quantity selector
function initQuantitySelector() {
    const minusBtn = document.querySelector('.quantity-btn.minus');
    const plusBtn = document.querySelector('.quantity-btn.plus');
    const quantityInput = document.getElementById('quantity');
    
    if (minusBtn && plusBtn && quantityInput) {
        minusBtn.addEventListener('click', function() {
            let currentValue = parseInt(quantityInput.value);
            if (currentValue > 1) {
                quantityInput.value = currentValue - 1;
            }
        });
        
        plusBtn.addEventListener('click', function() {
            let currentValue = parseInt(quantityInput.value);
            if (currentValue < 10) {
                quantityInput.value = currentValue + 1;
            }
        });
        
        // Prevent manual input of invalid values
        quantityInput.addEventListener('change', function() {
            let currentValue = parseInt(this.value);
            if (isNaN(currentValue) || currentValue < 1) {
                this.value = 1;
            } else if (currentValue > 10) {
                this.value = 10;
            }
        });
    }
}

// Handle product tabs
function initProductTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons and panels
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Show corresponding panel
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// Handle image zoom
function initImageZoom() {
    const mainImage = document.querySelector('.main-image');
    const zoomIcon = document.querySelector('.zoom-icon');
    const zoomModal = document.querySelector('.zoom-modal');
    const zoomClose = document.querySelector('.zoom-close');
    const zoomImg = document.querySelector('.zoom-img');
    
    if (zoomIcon && zoomModal && zoomImg) {
        zoomIcon.addEventListener('click', function() {
            const imgSrc = document.getElementById('main-product-image').src;
            zoomImg.src = imgSrc;
            zoomModal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
        });
        
        zoomClose.addEventListener('click', function() {
            zoomModal.style.display = 'none';
            document.body.style.overflow = ''; // Restore scrolling
        });
        
        // Close modal when clicking outside the image
        zoomModal.addEventListener('click', function(e) {
            if (e.target === zoomModal) {
                zoomModal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    }
}

// Handle color options
function initColorOptions() {
    const colorOptions = document.querySelectorAll('.color-option');
    
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all options
            colorOptions.forEach(opt => opt.classList.remove('active'));
            
            // Add active class to clicked option
            this.classList.add('active');
        });
    });
}

// Handle rating selection in review form
function initRatingSelect() {
    const ratingStars = document.querySelectorAll('.rating-select i');
    
    ratingStars.forEach((star, index) => {
        star.addEventListener('mouseover', function() {
            // Highlight stars on hover
            for (let i = 0; i <= index; i++) {
                ratingStars[i].classList.remove('far');
                ratingStars[i].classList.add('fas');
            }
        });
        
        star.addEventListener('mouseout', function() {
            // Reset stars if not selected
            ratingStars.forEach(s => {
                if (!s.classList.contains('active')) {
                    s.classList.remove('fas');
                    s.classList.add('far');
                }
            });
        });
        
        star.addEventListener('click', function() {
            // Set selected rating
            ratingStars.forEach(s => {
                s.classList.remove('active');
                s.classList.remove('fas');
                s.classList.add('far');
            });
            
            for (let i = 0; i <= index; i++) {
                ratingStars[i].classList.remove('far');
                ratingStars[i].classList.add('fas');
                ratingStars[i].classList.add('active');
            }
        });
    });
}

// Handle add to wishlist functionality
function handleAddToWishlist() {
    const addToWishlistBtn = document.querySelector('.add-to-wishlist-btn');
    
    if (addToWishlistBtn) {
        addToWishlistBtn.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            const productName = document.getElementById('product-name').textContent;
            const productPrice = document.getElementById('product-price').textContent;
            const productImage = document.getElementById('main-product-image').src;
            
            // Get existing wishlist or create new one
            let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
            
            // Check if product already in wishlist
            const existingProductIndex = wishlist.findIndex(item => item.id === productId);
            
            if (existingProductIndex > -1) {
                // Product already in wishlist, show notification
                showNotification('This product is already in your wishlist!');
            } else {
                // Add new product to cart
                cart.push({
                    id: productId,
                    name: productName,
                    price: productPrice,
                    image: productImage,
                    quantity: quantity
                });
            }
            
            // Save updated cart to localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Update cart count in header
            updateCartCount();
            
            // Show success message
            showNotification('Product added to cart successfully!');
        });
    }
}

// Handle quick view functionality
function handleQuickView() {
    const quickViewBtn = document.querySelector('.quick-view-btn');
    
    if (quickViewBtn) {
        quickViewBtn.addEventListener('click', function() {
            const productName = document.getElementById('product-name').textContent;
            const productPrice = document.getElementById('product-price').textContent;
            
            // Show notification
            showNotification(`Quick view for ${productName} - ${productPrice}`);
            
            // Here you would typically open a modal with product details
            // For now, we'll just show a notification
        });
    }
}

// Update wishlist count
function updateWishlistCount() {
    const wishlistCountElements = document.querySelectorAll('.wishlist-count');
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    // Calculate total items
    const totalItems = wishlist.length;
    
    // Update all wishlist count elements
    wishlistCountElements.forEach(element => {
        element.textContent = totalItems;
    });
}

// Show notification
function showNotification(message) {
    // Check if notification container exists, if not create it
    let notificationContainer = document.querySelector('.notification-container');
    
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
        
        // Add styles for notification container
        notificationContainer.style.position = 'fixed';
        notificationContainer.style.top = '20px';
        notificationContainer.style.right = '20px';
        notificationContainer.style.zIndex = '1000';
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = message;
    
    // Add styles for notification
    notification.style.backgroundColor = '#1a56db';
    notification.style.color = 'white';
    notification.style.padding = '15px 20px';
    notification.style.borderRadius = '5px';
    notification.style.marginBottom = '10px';
    notification.style.boxShadow = '0 3px 10px rgba(0,0,0,0.1)';
    notification.style.transform = 'translateX(100%)';
    notification.style.opacity = '0';
    notification.style.transition = 'all 0.3s ease';
    
    // Add notification to container
    notificationContainer.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
        notification.style.opacity = '1';
    }, 10);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        
        // Remove from DOM after animation completes
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Load product data from URL parameter
function loadProductData() {
    // Get product ID from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (productId) {
        // In a real application, you would fetch product data from an API
        // For this demo, we'll use mock data
        const productData = getProductById(productId);
        
        if (productData) {
            updateProductUI(productData);
        }
    }
}

// Get product data by ID (mock data for demo)
function getProductById(id) {
    // Mock product database
    const products = {
        '1': {
            id: '1',
            name: 'Premium Wireless Earbuds',
            price: '₹1,999',
            originalPrice: '₹3,499',
            description: 'Experience crystal-clear sound with our Premium Wireless Earbuds. Featuring advanced noise cancellation technology, these earbuds deliver an immersive audio experience. With a comfortable ergonomic design and long battery life, they\'re perfect for all-day use. The touch controls make it easy to manage your music and calls without reaching for your phone.',
            rating: 4.5,
            sku: 'PROD001',
            features: [
                'Active Noise Cancellation',
                'Bluetooth 5.2 Connectivity',
                '8 Hours Battery Life (30 Hours with Case)',
                'IPX7 Water Resistance',
                'Touch Controls'
            ],
            images: [
                'images/product1.jpg',
                'images/product1-2.jpg',
                'images/product1-3.jpg',
                'images/product1-4.jpg'
            ],
            categories: ['Electronics', 'Audio'],
            tags: ['wireless', 'earbuds', 'bluetooth']
        },
        '2': {
            id: '2',
            name: 'Smart Fitness Watch',
            price: '₹2,499',
            originalPrice: '₹4,999',
            description: 'Track your fitness goals with our Smart Fitness Watch. Monitor your heart rate, steps, sleep quality, and more. With a vibrant touchscreen display and long battery life, this watch is your perfect fitness companion.',
            rating: 5.0,
            sku: 'PROD002',
            features: [
                'Heart Rate Monitoring',
                'Step Counter',
                'Sleep Tracking',
                'Water Resistant',
                '7-Day Battery Life'
            ],
            images: [
                'images/product2.jpg',
                'images/product2-2.jpg',
                'images/product2-3.jpg',
                'images/product2-4.jpg'
            ],
            categories: ['Electronics', 'Fitness'],
            tags: ['smartwatch', 'fitness', 'health']
        },
        '3': {
            id: '3',
            name: 'Portable Bluetooth Speaker',
            price: '₹1,299',
            originalPrice: '₹1,999',
            description: 'Take your music anywhere with our Portable Bluetooth Speaker. With powerful bass and crystal-clear sound, this speaker delivers an exceptional audio experience. Its compact design and long battery life make it perfect for outdoor adventures.',
            rating: 4.0,
            sku: 'PROD003',
            features: [
                'Powerful Bass',
                'Bluetooth 5.0',
                '12 Hours Battery Life',
                'IPX5 Water Resistance',
                'Built-in Microphone'
            ],
            images: [
                'images/product3.jpg',
                'images/product3-2.jpg',
                'images/product3-3.jpg',
                'images/product3-4.jpg'
            ],
            categories: ['Electronics', 'Audio'],
            tags: ['speaker', 'bluetooth', 'portable']
        }
    };
    
    return products[id];
}

// Update product UI with data
function updateProductUI(product) {
    // Update product name
    document.getElementById('product-name').textContent = product.name;
    document.getElementById('product-breadcrumb').textContent = product.name;
    
    // Update product price
    document.getElementById('product-price').textContent = product.price;
    document.getElementById('product-original-price').textContent = product.originalPrice;
    
    // Update product description
    document.getElementById('product-description').textContent = product.description;
    
    // Update product SKU
    document.getElementById('product-sku').textContent = product.sku;
    
    // Update product features
    const featuresList = document.getElementById('product-features');
    if (featuresList) {
        featuresList.innerHTML = '';
        product.features.forEach(feature => {
            const li = document.createElement('li');
            li.innerHTML = `<i class="fas fa-check"></i> ${feature}`;
            featuresList.appendChild(li);
        });
    }
    
    // Update product images
    const mainImage = document.getElementById('main-product-image');
    if (mainImage && product.images.length > 0) {
        mainImage.src = product.images[0];
    }
    
    // Update thumbnails
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach((thumbnail, index) => {
        if (index < product.images.length) {
            const img = thumbnail.querySelector('img');
            img.src = product.images[index];
            thumbnail.setAttribute('data-img', product.images[index]);
        }
    });
    
    // Update add to cart button
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    if (addToCartBtn) {
        addToCartBtn.setAttribute('data-id', product.id);
    }
    
    // Set page title
    document.title = `${product.name} - ShopEase`;
}

// Initialize on page load
updateCartCount();