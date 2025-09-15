// Common JavaScript functionality for all pages

document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile menu functionality
    initMobileMenu();
    
    // Initialize local storage if it doesn't exist
    initLocalStorage();
});

/**
 * Initialize mobile menu functionality
 */
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            
            // Toggle hamburger menu animation
            const spans = mobileMenuBtn.querySelectorAll('span');
            spans.forEach(span => span.classList.toggle('active'));
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenuBtn.contains(e.target) && !navLinks.contains(e.target) && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                
                // Reset hamburger menu animation
                const spans = mobileMenuBtn.querySelectorAll('span');
                spans.forEach(span => span.classList.remove('active'));
            }
        });
    }
}

/**
 * Initialize local storage with default data if it doesn't exist
 */
function initLocalStorage() {
    // Check if local storage is available
    if (typeof(Storage) === "undefined") {
        console.error('Local storage is not supported by your browser');
        return;
    }
    
    // Initialize expenses if they don't exist
    if (!localStorage.getItem('piggypal_expenses')) {
        const defaultExpenses = [];
        localStorage.setItem('piggypal_expenses', JSON.stringify(defaultExpenses));
    }
    
    // Initialize budget if it doesn't exist
    if (!localStorage.getItem('piggypal_budget')) {
        const defaultBudget = {
            total: 0,
            categories: {
                food: { amount: 0, percentage: 30 },
                entertainment: { amount: 0, percentage: 20 },
                transportation: { amount: 0, percentage: 15 },
                education: { amount: 0, percentage: 15 },
                savings: { amount: 0, percentage: 10 },
                other: { amount: 0, percentage: 10 }
            }
        };
        localStorage.setItem('piggypal_budget', JSON.stringify(defaultBudget));
    }
    
    // Initialize goals if they don't exist
    if (!localStorage.getItem('piggypal_goals')) {
        const defaultGoals = [];
        localStorage.setItem('piggypal_goals', JSON.stringify(defaultGoals));
    }
    
    // Initialize tips if they don't exist
    if (!localStorage.getItem('piggypal_tips')) {
        const defaultTips = [
            {
                id: 1,
                title: "Pack your lunch instead of eating out",
                description: "Save $5-10 per day by bringing lunch from home instead of buying it.",
                category: "daily",
                bookmarked: false
            },
            {
                id: 2,
                title: "Use the 24-hour rule for purchases",
                description: "Wait 24 hours before making non-essential purchases to avoid impulse buying.",
                category: "shopping",
                bookmarked: false
            },
            {
                id: 3,
                title: "Set up automatic savings transfers",
                description: "Automatically transfer a small amount to savings each time you get pocket money.",
                category: "planning",
                bookmarked: false
            },
            {
                id: 4,
                title: "Use the library instead of buying books",
                description: "Borrow books, movies, and games from your local library instead of purchasing them.",
                category: "entertainment",
                bookmarked: false
            },
            {
                id: 5,
                title: "Walk or bike for short trips",
                description: "Save on transportation costs by walking or biking for short distances.",
                category: "daily",
                bookmarked: false
            },
            {
                id: 6,
                title: "Compare prices before buying",
                description: "Check prices at different stores or online before making a purchase.",
                category: "shopping",
                bookmarked: false
            },
            {
                id: 7,
                title: "Earn extra money with small tasks",
                description: "Offer to help neighbors with chores or tasks to earn additional pocket money.",
                category: "earning",
                bookmarked: false
            },
            {
                id: 8,
                title: "Use reusable water bottles",
                description: "Save money and help the environment by using a reusable water bottle instead of buying bottled water.",
                category: "daily",
                bookmarked: false
            }
        ];
        localStorage.setItem('piggypal_tips', JSON.stringify(defaultTips));
    }
    
    // Initialize user settings if they don't exist
    if (!localStorage.getItem('piggypal_settings')) {
        const defaultSettings = {
            username: "User",
            currency: "$",
            theme: "light",
            notifications: true
        };
        localStorage.setItem('piggypal_settings', JSON.stringify(defaultSettings));
    }
}

/**
 * Format currency based on user settings
 * @param {number} amount - The amount to format
 * @returns {string} - Formatted currency string
 */
function formatCurrency(amount) {
    // Get user's currency setting
    let settings = JSON.parse(localStorage.getItem('piggypal_settings')) || { currency: '$' };
    let currency = settings.currency || '$';
    
    // Format the amount with 2 decimal places
    return currency + amount.toFixed(2);
}

/**
 * Format date to a readable string
 * @param {Date|string} date - The date to format
 * @returns {string} - Formatted date string
 */
function formatDate(date) {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

/**
 * Generate a unique ID
 * @returns {string} - Unique ID
 */
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

/**
 * Show a toast notification
 * @param {string} message - The message to display
 * @param {string} type - The type of toast (success, error, warning, info)
 */
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.querySelector('.toast-message');
    const toastIcon = document.querySelector('.toast-content i');
    
    if (!toast || !toastMessage) {
        console.error('Toast elements not found');
        return;
    }
    
    // Set the message
    toastMessage.textContent = message;
    
    // Set the icon based on type
    if (toastIcon) {
        toastIcon.className = ''; // Clear existing classes
        
        switch (type) {
            case 'success':
                toastIcon.className = 'fas fa-check-circle';
                toastIcon.style.color = 'var(--success-color)';
                break;
            case 'error':
                toastIcon.className = 'fas fa-exclamation-circle';
                toastIcon.style.color = 'var(--error-color)';
                break;
            case 'warning':
                toastIcon.className = 'fas fa-exclamation-triangle';
                toastIcon.style.color = 'var(--warning-color)';
                break;
            case 'info':
                toastIcon.className = 'fas fa-info-circle';
                toastIcon.style.color = 'var(--info-color)';
                break;
        }
    }
    
    // Show the toast
    toast.classList.add('show');
    
    // Hide the toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}