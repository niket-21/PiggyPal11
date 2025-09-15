document.addEventListener('DOMContentLoaded', function() {
    initCart();
});

function initCart() {
    setupQuantityControls();
    setupRemoveButtons();
    setupCouponForm();
    setupShippingOptions();
    updateCartTotals();
}

// Handle quantity selectors
function setupQuantityControls() {
    const quantitySelectors = document.querySelectorAll('.quantity-selector');
    
    quantitySelectors.forEach(selector => {
        const decreaseBtn = selector.querySelector('.quantity-decrease');
        const increaseBtn = selector.querySelector('.quantity-increase');
        const input = selector.querySelector('.quantity-input');
        const itemId = selector.closest('.cart-item').dataset.itemId;
        
        decreaseBtn.addEventListener('click', () => {
            let value = parseInt(input.value);
            if (value > 1) {
                input.value = value - 1;
                updateItemQuantity(itemId, input.value);
            }
        });
        
        increaseBtn.addEventListener('click', () => {
            let value = parseInt(input.value);
            input.value = value + 1;
            updateItemQuantity(itemId, input.value);
        });
        
        input.addEventListener('change', () => {
            let value = parseInt(input.value);
            if (value < 1) {
                input.value = 1;
                value = 1;
            }
            updateItemQuantity(itemId, value);
        });
    });
}

// Update item quantity and recalculate totals
function updateItemQuantity(itemId, quantity) {
    const cartItem = document.querySelector(`.cart-item[data-item-id="${itemId}"]`);
    const priceElement = cartItem.querySelector('.cart-price');
    const subtotalElement = cartItem.querySelector('.cart-subtotal');
    
    // Get price value (remove ₹ symbol and convert to number)
    const price = parseFloat(priceElement.textContent.replace('₹', '').replace(',', ''));
    
    // Calculate new subtotal
    const subtotal = price * quantity;
    
    // Update subtotal display
    subtotalElement.textContent = `₹${formatPrice(subtotal)}`;
    
    // Update cart totals
    updateCartTotals();
    
    // Show notification
    showNotification('Cart updated');
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
            const cartItem = button.closest('.cart-item');
            const itemId = cartItem.dataset.itemId;
            
            // Animation for removal
            cartItem.style.opacity = '0';
            setTimeout(() => {
                cartItem.style.height = '0';
                cartItem.style.padding = '0';
                cartItem.style.margin = '0';
                cartItem.style.overflow = 'hidden';
                
                setTimeout(() => {
                    cartItem.remove();
                    updateCartTotals();
                    updateCartCount(-1);
                    showNotification('Item removed from cart');
                    
                    // Check if cart is empty
                    const cartItems = document.querySelectorAll('.cart-item');
                    if (cartItems.length === 0) {
                        showEmptyCartMessage();
                    }
                }, 300);
            }, 300);
        });
    });
}

// Show empty cart message
function showEmptyCartMessage() {
    const cartItems = document.querySelector('.cart-items');
    const emptyMessage = document.createElement('div');
    emptyMessage.className = 'empty-cart-message';
    emptyMessage.innerHTML = `
        <div class="text-center py-5">
            <i class="fas fa-shopping-cart fa-3x mb-3" style="color: #ddd;"></i>
            <h3>Your cart is empty</h3>
            <p>Looks like you haven't added any products to your cart yet.</p>
            <a href="products.html" class="btn btn-primary mt-3">Continue Shopping</a>
        </div>
    `;
    
    cartItems.innerHTML = '';
    cartItems.appendChild(emptyMessage);
    
    // Hide cart summary
    const cartSummary = document.querySelector('.cart-summary');
    if (cartSummary) {
        cartSummary.style.display = 'none';
    }
}

// Update cart count in header
function updateCartCount(change) {
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        let currentCount = parseInt(cartCountElement.textContent);
        currentCount += change;
        
        if (currentCount < 0) currentCount = 0;
        
        cartCountElement.textContent = currentCount;
        
        // Update cart icon animation
        const cartIcon = document.querySelector('.cart-icon');
        if (cartIcon) {
            cartIcon.classList.add('shake');
            setTimeout(() => {
                cartIcon.classList.remove('shake');
            }, 500);
        }
    }
}

// Handle coupon form
function setupCouponForm() {
    const couponForm = document.querySelector('.coupon');
    if (couponForm) {
        couponForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const couponInput = couponForm.querySelector('.coupon-input');
            const couponCode = couponInput.value.trim();
            
            if (couponCode) {
                // Simulate coupon validation
                if (couponCode.toUpperCase() === 'DISCOUNT20') {
                    applyCoupon(20); // 20% discount
                    showNotification('Coupon applied successfully!');
                } else {
                    showNotification('Invalid coupon code', 'error');
                }
            }
        });
    }
}

// Apply coupon discount
function applyCoupon(discountPercentage) {
    const subtotalElement = document.querySelector('.summary-subtotal .summary-value');
    const discountElement = document.querySelector('.summary-discount .summary-value');
    
    if (subtotalElement && discountElement) {
        const subtotal = parseFloat(subtotalElement.textContent.replace('₹', '').replace(',', ''));
        const discount = (subtotal * discountPercentage) / 100;
        
        discountElement.textContent = `-₹${formatPrice(discount)}`;
        discountElement.parentElement.style.display = 'flex';
        
        updateCartTotals();
    }
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
function showNotification(message, type = 'success') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create new notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
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