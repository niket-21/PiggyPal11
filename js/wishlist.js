document.addEventListener('DOMContentLoaded', function() {
    initWishlist();
});

function initWishlist() {
    setupRemoveButtons();
    setupShareWishlist();
    setupViewProductButtons();
    updateWishlistCount();
}

// Setup view product buttons
function setupViewProductButtons() {
    const viewButtons = document.querySelectorAll('.wishlist-actions .primary-btn');
    
    viewButtons.forEach(button => {
        button.addEventListener('click', () => {
            const wishlistItem = button.closest('.wishlist-item');
            const productName = wishlistItem.querySelector('.wishlist-product-info h3').textContent;
            
            // Redirect to product detail page
            // In a real application, this would use the product ID to create the correct URL
            window.location.href = 'product-detail.html';
        });
    });
}

// Setup share wishlist functionality
function setupShareWishlist() {
    const shareButton = document.querySelector('.share-wishlist-btn');
    
    if (shareButton) {
        shareButton.addEventListener('click', () => {
            // In a real application, this would generate a shareable link
            // For now, we'll just show a notification
            showNotification('Wishlist link copied to clipboard!');
        });
    }
}

// Format price with commas for thousands
function formatPrice(price) {
    return price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

// Handle remove buttons
function setupRemoveButtons() {
    const removeButtons = document.querySelectorAll('.remove-btn');
    
    removeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const wishlistItem = button.closest('.wishlist-item');
            const itemId = wishlistItem.dataset.itemId;
            
            // Animation for removal
            wishlistItem.style.opacity = '0';
            setTimeout(() => {
                wishlistItem.style.height = '0';
                wishlistItem.style.padding = '0';
                wishlistItem.style.margin = '0';
                wishlistItem.style.overflow = 'hidden';
                
                setTimeout(() => {
                    wishlistItem.remove();
                    updateWishlistCount(-1);
                    showNotification('Item removed from wishlist');
                    
                    // Check if wishlist is empty
                    const wishlistItems = document.querySelectorAll('.wishlist-item');
                    if (wishlistItems.length === 0) {
                        showEmptyWishlistMessage();
                    }
                }, 300);
            }, 300);
        });
    });
}

// Show empty wishlist message
function showEmptyWishlistMessage() {
    const wishlistContainer = document.querySelector('.wishlist-container');
    const emptyWishlistMessage = document.createElement('div');
    emptyWishlistMessage.className = 'empty-wishlist-message';
    emptyWishlistMessage.innerHTML = `
        <div class="empty-wishlist-icon">
            <i class="fas fa-heart"></i>
        </div>
        <h3>Your wishlist is empty</h3>
        <p>Looks like you haven't added any items to your wishlist yet.</p>
        <a href="products.html" class="btn primary-btn">Browse Products</a>
    `;
    
    wishlistContainer.innerHTML = '';
    wishlistContainer.appendChild(emptyWishlistMessage);
    
    // Hide the wishlist summary
    const wishlistSummary = document.querySelector('.wishlist-summary');
    if (wishlistSummary) {
        wishlistSummary.style.display = 'none';
    }
}

// Update wishlist count in header
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

// Setup clear wishlist button
function setupClearWishlist() {
    const clearButton = document.querySelector('.clear-wishlist');
    if (clearButton) {
        clearButton.addEventListener('click', () => {
            const wishlistItems = document.querySelectorAll('.wishlist-item');
            
            if (wishlistItems.length > 0) {
                // Animation for removal
                wishlistItems.forEach(item => {
                    item.style.opacity = '0';
                });
                
                setTimeout(() => {
                    // Clear all items
                    const wishlistContainer = document.querySelector('.wishlist-items');
                    wishlistContainer.innerHTML = '';
                    
                    // Reset wishlist count
                    localStorage.setItem('wishlistCount', '0');
                    updateWishlistCount();
                    
                    // Show empty wishlist message
                    showEmptyWishlistMessage();
                    
                    // Show notification
                    showNotification('Wishlist cleared');
                }, 300);
            }
        });
    }
}

// Setup continue shopping button
function setupContinueShopping() {
    const continueButton = document.querySelector('.continue-shopping');
    if (continueButton) {
        continueButton.addEventListener('click', () => {
            window.location.href = 'products.html';
        });
    }
}

// Initialize the wishlist on page load
function initializeWishlist() {
    // Check if wishlist is empty
    const wishlistItems = document.querySelectorAll('.wishlist-item');
    if (wishlistItems.length === 0) {
        showEmptyWishlistMessage();
    }
    
    // Setup additional event listeners
    setupClearWishlist();
    setupContinueShopping();
    
    // Initialize wishlist count
    updateWishlistCount();
}

// Handle shipping options
function setupShippingOptions() {
    const shippingOptions = document.querySelectorAll('.shipping-option input');
    
    shippingOptions.forEach(option => {
        option.addEventListener('change', () => {
            const shippingCost = parseFloat(option.dataset.cost);
            updateShippingCost(shippingCost);
        });
    });
    
    // Set default shipping option
    if (shippingOptions.length > 0) {
        shippingOptions[0].checked = true;
        const defaultShippingCost = parseFloat(shippingOptions[0].dataset.cost);
        updateShippingCost(defaultShippingCost);
    }
}

// Update shipping cost
function updateShippingCost(cost) {
    const shippingElement = document.querySelector('.summary-shipping .summary-value');
    
    if (shippingElement) {
        shippingElement.textContent = cost > 0 ? `₹${formatPrice(cost)}` : 'Free';
        updateCartTotals();
    }
}

// Update cart totals
function updateCartTotals() {
    // Calculate subtotal from all items
    const subtotalElements = document.querySelectorAll('.cart-subtotal');
    let subtotal = 0;
    
    subtotalElements.forEach(element => {
        subtotal += parseFloat(element.textContent.replace('₹', '').replace(',', ''));
    });
    
    // Update subtotal in summary
    const summarySubtotalElement = document.querySelector('.summary-subtotal .summary-value');
    if (summarySubtotalElement) {
        summarySubtotalElement.textContent = `₹${formatPrice(subtotal)}`;
    }
    
    // Get discount if applied
    let discount = 0;
    const discountElement = document.querySelector('.summary-discount .summary-value');
    if (discountElement && discountElement.parentElement.style.display !== 'none') {
        discount = parseFloat(discountElement.textContent.replace('-₹', '').replace(',', ''));
    }
    
    // Get shipping cost
    let shipping = 0;
    const shippingElement = document.querySelector('.summary-shipping .summary-value');
    if (shippingElement && shippingElement.textContent !== 'Free') {
        shipping = parseFloat(shippingElement.textContent.replace('₹', '').replace(',', ''));
    }
    
    // Calculate tax (GST 18%)
    const tax = (subtotal - discount) * 0.18;
    
    // Update tax in summary
    const taxElement = document.querySelector('.summary-tax .summary-value');
    if (taxElement) {
        taxElement.textContent = `₹${formatPrice(tax)}`;
    }
    
    // Calculate total
    const total = subtotal - discount + shipping + tax;
    
    // Update total in summary
    const totalElement = document.querySelector('.summary-total .summary-value');
    if (totalElement) {
        totalElement.textContent = `₹${formatPrice(total)}`;
    }
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Add styles
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = '#1a56db';
    notification.style.color = '#fff';
    notification.style.padding = '12px 20px';
    notification.style.borderRadius = '4px';
    notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    notification.style.zIndex = '1000';
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(20px)';
    notification.style.transition = 'opacity 0.3s, transform 0.3s';
    
    document.body.appendChild(notification);
    
    // Show with animation
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 10);
    
    // Hide after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        
        // Remove from DOM after animation
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Checkout button
const checkoutBtn = document.querySelector('.checkout-btn');
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        // Simulate checkout process
        showNotification('Redirecting to checkout...');
        
        // In a real application, this would redirect to a checkout page
        setTimeout(() => {
            window.location.href = '#'; // Replace with actual checkout page URL
        }, 1500);
    });
}