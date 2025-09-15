// Products Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initProductsPage();
});

function initProductsPage() {
    // Initialize view switching
    initViewSwitcher();
    
    // Initialize price range slider
    initPriceRangeSlider();
    
    // Initialize sorting
    initSorting();
    
    // Initialize filters
    initFilters();
    
    // Initialize product actions
    initProductActions();
}

// View Switcher (Grid/List)
function initViewSwitcher() {
    const gridBtn = document.querySelector('.view-btn.grid');
    const listBtn = document.querySelector('.view-btn.list');
    const productsGrid = document.querySelector('.products-grid-view');
    
    if (gridBtn && listBtn && productsGrid) {
        gridBtn.addEventListener('click', function() {
            gridBtn.classList.add('active');
            listBtn.classList.remove('active');
            productsGrid.classList.remove('list-view');
        });
        
        listBtn.addEventListener('click', function() {
            listBtn.classList.add('active');
            gridBtn.classList.remove('active');
            productsGrid.classList.add('list-view');
        });
    }
}

// Price Range Slider
function initPriceRangeSlider() {
    const rangeMin = document.querySelector('.range-min');
    const rangeMax = document.querySelector('.range-max');
    const inputMin = document.querySelector('.input-min');
    const inputMax = document.querySelector('.input-max');
    const sliderRange = document.querySelector('.slider-range');
    const applyBtn = document.querySelector('.apply-price');
    
    if (rangeMin && rangeMax && inputMin && inputMax && sliderRange) {
        // Set initial positions
        updateSliderRange();
        
        // Update range slider when inputs change
        rangeMin.addEventListener('input', function() {
            if (parseInt(rangeMin.value) > parseInt(rangeMax.value)) {
                rangeMin.value = rangeMax.value;
            }
            inputMin.value = rangeMin.value;
            updateSliderRange();
        });
        
        rangeMax.addEventListener('input', function() {
            if (parseInt(rangeMax.value) < parseInt(rangeMin.value)) {
                rangeMax.value = rangeMin.value;
            }
            inputMax.value = rangeMax.value;
            updateSliderRange();
        });
        
        // Update slider when inputs change
        inputMin.addEventListener('input', function() {
            if (parseInt(inputMin.value) > parseInt(inputMax.value)) {
                inputMin.value = inputMax.value;
            }
            rangeMin.value = inputMin.value;
            updateSliderRange();
        });
        
        inputMax.addEventListener('input', function() {
            if (parseInt(inputMax.value) < parseInt(inputMin.value)) {
                inputMax.value = inputMin.value;
            }
            rangeMax.value = inputMax.value;
            updateSliderRange();
        });
        
        // Apply button
        if (applyBtn) {
            applyBtn.addEventListener('click', function() {
                // Here you would typically filter products based on price range
                // For now, we'll just show a notification
                showNotification(`Filtering products from ₹${inputMin.value} to ₹${inputMax.value}`);
            });
        }
    }
    
    function updateSliderRange() {
        const min = parseInt(rangeMin.value);
        const max = parseInt(rangeMax.value);
        const minPercent = (min / parseInt(rangeMin.max)) * 100;
        const maxPercent = (max / parseInt(rangeMax.max)) * 100;
        
        sliderRange.style.left = minPercent + '%';
        sliderRange.style.width = (maxPercent - minPercent) + '%';
    }
}

// Sorting Products
function initSorting() {
    const sortSelect = document.getElementById('sort-by');
    
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            const sortValue = sortSelect.value;
            // Here you would typically sort products based on the selected option
            // For now, we'll just show a notification
            showNotification(`Sorting products by ${sortValue}`);
        });
    }
}

// Filter Functionality
function initFilters() {
    const filterCheckboxes = document.querySelectorAll('.checkbox-container input[type="checkbox"]');
    const filterRadios = document.querySelectorAll('.radio-container input[type="radio"]');
    const resetBtn = document.querySelector('.filter-reset');
    
    // Add event listeners to checkboxes
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            // Here you would typically filter products based on selected filters
            // For now, we'll just show a notification
            const filterName = this.parentElement.textContent.trim().split('(')[0].trim();
            const action = this.checked ? 'applied' : 'removed';
            showNotification(`Filter ${filterName} ${action}`);
        });
    });
    
    // Add event listeners to radio buttons
    filterRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.checked) {
                const filterName = this.parentElement.textContent.trim().split('(')[0].trim();
                showNotification(`Filter ${filterName} applied`);
            }
        });
    });
    
    // Reset filters
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            // Reset all checkboxes and radio buttons
            filterCheckboxes.forEach(checkbox => {
                checkbox.checked = false;
            });
            
            // Reset price range
            const rangeMin = document.querySelector('.range-min');
            const rangeMax = document.querySelector('.range-max');
            const inputMin = document.querySelector('.input-min');
            const inputMax = document.querySelector('.input-max');
            
            if (rangeMin && rangeMax && inputMin && inputMax) {
                rangeMin.value = rangeMin.min;
                rangeMax.value = rangeMax.max;
                inputMin.value = rangeMin.min;
                inputMax.value = rangeMax.max;
                
                // Update slider range
                const sliderRange = document.querySelector('.slider-range');
                if (sliderRange) {
                    sliderRange.style.left = '0%';
                    sliderRange.style.width = '100%';
                }
            }
            
            showNotification('All filters reset');
        });
    }
}

// Product Actions (Add to Cart, Wishlist, Quick View)
function initProductActions() {
    // Add to cart buttons
    const addToCartBtns = document.querySelectorAll('.add-to-cart, .list-add-to-cart');
    
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const productId = this.getAttribute('data-id');
            addToCart(productId);
        });
    });
    
    // Product action buttons (heart, eye)
    const actionBtns = document.querySelectorAll('.action-btn:not(.add-to-cart)');
    
    actionBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const icon = this.querySelector('i');
            
            if (icon.classList.contains('fa-heart')) {
                // Toggle wishlist
                if (icon.classList.contains('fas')) {
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                    showNotification('Removed from wishlist');
                } else {
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                    showNotification('Added to wishlist');
                }
            } else if (icon.classList.contains('fa-eye')) {
                // Quick view
                const productCard = this.closest('.product-card');
                const productId = productCard.querySelector('.add-to-cart').getAttribute('data-id');
                quickView(productId);
            }
        });
    });
    
    // Product card links
    const productLinks = document.querySelectorAll('.product-info h3 a');
    
    productLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // For demo purposes, we'll prevent default and show notification
            // In a real app, this would navigate to the product detail page
            e.preventDefault();
            const productId = this.getAttribute('href').split('?id=')[1];
            window.location.href = `product-detail.html?id=${productId}`;
        });
    });
}

// Add to Cart Function
function addToCart(productId) {
    // Here you would typically add the product to the cart
    // For now, we'll just update the cart count and show a notification
    updateCartCount(1);
    showNotification('Product added to cart');
}

// Quick View Function
function quickView(productId) {
    // Here you would typically show a quick view modal
    // For now, we'll just show a notification
    showNotification(`Quick view for product ${productId}`);
}

// Update Cart Count
function updateCartCount(increment) {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        let count = parseInt(cartCount.textContent) || 0;
        count += increment;
        cartCount.textContent = count;
        
        // Add animation class
        cartCount.classList.add('pulse');
        setTimeout(() => {
            cartCount.classList.remove('pulse');
        }, 300);
    }
}

// Show Notification
function showNotification(message) {
    // Create notification element if it doesn't exist
    let notification = document.querySelector('.notification');
    
    if (!notification) {
        notification = document.createElement('div');
        notification.className = 'notification';
        document.body.appendChild(notification);
    }
    
    // Set message and show notification
    notification.textContent = message;
    notification.classList.add('show');
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Load Products (for a real application, this would fetch from an API)
function loadProducts() {
    // This function would typically fetch products from an API
    // For now, we're using static HTML
}