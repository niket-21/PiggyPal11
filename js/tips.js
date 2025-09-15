// Tips Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initApp();
});

function initApp() {
    // Initialize all components
    initTipsFilter();
    initFeaturedTip();
    initTipsGrid();
    initTipsChallenge();
    initSubmitTipForm();
    initBookmarkedTips();
}

function initTipsFilter() {
    // Get filter elements
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // Add event listeners for filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter tips
            filterTips(this.dataset.filter);
        });
    });
    
    // Add event listener for search input
    document.getElementById('tips-search').addEventListener('input', function() {
        // Get active filter
        const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
        
        // Filter tips
        filterTips(activeFilter, this.value.trim().toLowerCase());
    });
}

function filterTips(category, searchTerm = '') {
    // Get all tip items
    const tipItems = document.querySelectorAll('.tip-item');
    
    // Show/hide tips based on filter
    tipItems.forEach(tip => {
        const tipCategory = tip.dataset.category;
        const tipTitle = tip.querySelector('.tip-title').textContent.toLowerCase();
        const tipContent = tip.querySelector('.tip-content').textContent.toLowerCase();
        
        // Check if tip matches category filter
        const matchesCategory = category === 'all' || tipCategory === category;
        
        // Check if tip matches search term
        const matchesSearch = searchTerm === '' || 
            tipTitle.includes(searchTerm) || 
            tipContent.includes(searchTerm);
        
        // Show/hide tip
        if (matchesCategory && matchesSearch) {
            tip.style.display = 'block';
        } else {
            tip.style.display = 'none';
        }
    });
    
    // Check if no tips are visible
    const visibleTips = document.querySelectorAll('.tip-item[style="display: block"]');
    const emptyState = document.querySelector('.tips-empty-state');
    
    if (visibleTips.length === 0) {
        // Show empty state
        if (!emptyState) {
            const tipsGrid = document.querySelector('.tips-grid');
            const emptyStateElement = document.createElement('div');
            emptyStateElement.className = 'tips-empty-state';
            emptyStateElement.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-search"></i>
                    <h3>No Tips Found</h3>
                    <p>Try a different filter or search term.</p>
                </div>
            `;
            tipsGrid.appendChild(emptyStateElement);
        } else {
            emptyState.style.display = 'block';
        }
    } else {
        // Hide empty state
        if (emptyState) {
            emptyState.style.display = 'none';
        }
    }
}

function initFeaturedTip() {
    // Get user data
    const userData = getLocalStorageData();
    
    // Get all tips
    const allTips = userData.tips;
    
    // If no tips, create default tips
    if (allTips.length === 0) {
        createDefaultTips();
        return;
    }
    
    // Get featured tip (random tip from all tips)
    const randomIndex = Math.floor(Math.random() * allTips.length);
    const featuredTip = allTips[randomIndex];
    
    // Update featured tip UI
    updateFeaturedTip(featuredTip);
}

function updateFeaturedTip(tip) {
    // Get featured tip container
    const featuredTipContainer = document.querySelector('.featured-tip');
    
    // Update featured tip content
    featuredTipContainer.innerHTML = `
        <div class="tip-header">
            <h3 class="tip-title">${tip.title}</h3>
            <span class="tip-category ${tip.category}">${tip.category}</span>
        </div>
        <div class="tip-content">
            <p>${tip.content}</p>
        </div>
        <div class="tip-footer">
            <div class="tip-meta">
                <span class="tip-author">
                    <i class="fas fa-user"></i> ${tip.author || 'PiggyPal Team'}
                </span>
                <span class="tip-date">
                    <i class="fas fa-calendar-alt"></i> ${formatDate(new Date(tip.date), 'medium')}
                </span>
            </div>
            <div class="tip-actions">
                <button class="action-btn ${tip.bookmarked ? 'active' : ''}" 
                    onclick="toggleBookmark('${tip.id}')" title="${tip.bookmarked ? 'Remove bookmark' : 'Bookmark'}">
                    <i class="fas fa-bookmark"></i>
                </button>
                <button class="action-btn" onclick="shareTip('${tip.id}')" title="Share">
                    <i class="fas fa-share-alt"></i>
                </button>
            </div>
        </div>
    `;
}

function initTipsGrid() {
    // Update tips grid
    updateTipsGrid();
}

function updateTipsGrid() {
    // Get user data
    const userData = getLocalStorageData();
    
    // Get all tips
    const allTips = userData.tips;
    
    // If no tips, create default tips
    if (allTips.length === 0) {
        createDefaultTips();
        return;
    }
    
    // Get tips grid container
    const tipsGrid = document.querySelector('.tips-grid');
    
    // Clear existing tips
    tipsGrid.innerHTML = '';
    
    // Create tip items
    allTips.forEach(tip => {
        const tipItem = document.createElement('div');
        tipItem.className = 'tip-item';
        tipItem.dataset.id = tip.id;
        tipItem.dataset.category = tip.category;
        
        tipItem.innerHTML = `
            <div class="tip-header">
                <h3 class="tip-title">${tip.title}</h3>
                <span class="tip-category ${tip.category}">${tip.category}</span>
            </div>
            <div class="tip-content">
                <p>${tip.content}</p>
            </div>
            <div class="tip-footer">
                <div class="tip-meta">
                    <span class="tip-author">
                        <i class="fas fa-user"></i> ${tip.author || 'PiggyPal Team'}
                    </span>
                </div>
                <div class="tip-actions">
                    <button class="action-btn ${tip.bookmarked ? 'active' : ''}" 
                        onclick="toggleBookmark('${tip.id}')" title="${tip.bookmarked ? 'Remove bookmark' : 'Bookmark'}">
                        <i class="fas fa-bookmark"></i>
                    </button>
                </div>
            </div>
        `;
        
        tipsGrid.appendChild(tipItem);
    });
}

function createDefaultTips() {
    // Create default tips
    const defaultTips = [
        {
            id: generateUniqueId(),
            title: 'The 50/30/20 Rule',
            content: 'Allocate 50% of your pocket money to needs, 30% to wants, and 20% to savings. This simple rule helps you balance spending while building savings habits.',
            category: 'budgeting',
            author: 'PiggyPal Team',
            date: new Date().toISOString(),
            bookmarked: false
        },
        {
            id: generateUniqueId(),
            title: 'Track Every Expense',
            content: 'Keep a record of every penny you spend. This awareness alone can reduce unnecessary spending by up to 15% according to financial experts.',
            category: 'tracking',
            author: 'PiggyPal Team',
            date: new Date().toISOString(),
            bookmarked: false
        },
        {
            id: generateUniqueId(),
            title: 'Wait 24 Hours Before Buying',
            content: 'Before making non-essential purchases, wait 24 hours. This "cooling off" period helps avoid impulse buying and gives you time to consider if you really need the item.',
            category: 'saving',
            author: 'PiggyPal Team',
            date: new Date().toISOString(),
            bookmarked: false
        },
        {
            id: generateUniqueId(),
            title: 'Set Specific Financial Goals',
            content: 'Create clear, specific goals for your money. Instead of "save more," try "save $20 per month for a new game" - specific goals are more motivating and achievable.',
            category: 'goals',
            author: 'PiggyPal Team',
            date: new Date().toISOString(),
            bookmarked: false
        },
        {
            id: generateUniqueId(),
            title: 'Use the Envelope System',
            content: 'Divide your pocket money into envelopes for different spending categories. When an envelope is empty, stop spending in that category until next allowance.',
            category: 'budgeting',
            author: 'PiggyPal Team',
            date: new Date().toISOString(),
            bookmarked: false
        },
        {
            id: generateUniqueId(),
            title: 'Find Free Entertainment',
            content: 'Look for free activities in your community - parks, libraries, community events, and free online resources can provide entertainment without spending money.',
            category: 'saving',
            author: 'PiggyPal Team',
            date: new Date().toISOString(),
            bookmarked: false
        },
        {
            id: generateUniqueId(),
            title: 'Compare Prices Before Buying',
            content: 'Always check prices at different stores or websites before making a purchase. Price comparison can save you 10-15% on average.',
            category: 'shopping',
            author: 'PiggyPal Team',
            date: new Date().toISOString(),
            bookmarked: false
        },
        {
            id: generateUniqueId(),
            title: 'Learn Basic DIY Skills',
            content: 'Learning to fix or make things yourself can save money. Basic sewing, simple repairs, and crafting skills can extend the life of your belongings.',
            category: 'saving',
            author: 'PiggyPal Team',
            date: new Date().toISOString(),
            bookmarked: false
        },
        {
            id: generateUniqueId(),
            title: 'Pack Lunch Instead of Buying',
            content: 'Bringing lunch from home instead of buying at school or outside can save $20-$50 per month, which adds up to hundreds per year.',
            category: 'saving',
            author: 'PiggyPal Team',
            date: new Date().toISOString(),
            bookmarked: false
        },
        {
            id: generateUniqueId(),
            title: 'Automate Your Savings',
            content: 'Set up an automatic transfer of a small amount to your savings each time you receive pocket money. What you don\'t see, you won\'t spend.',
            category: 'saving',
            author: 'PiggyPal Team',
            date: new Date().toISOString(),
            bookmarked: false
        },
        {
            id: generateUniqueId(),
            title: 'Use the 30-Day Rule',
            content: 'When tempted by a non-essential purchase, write it down and wait 30 days. If you still want it after 30 days, reconsider buying it.',
            category: 'shopping',
            author: 'PiggyPal Team',
            date: new Date().toISOString(),
            bookmarked: false
        },
        {
            id: generateUniqueId(),
            title: 'Sell Items You No Longer Need',
            content: 'Declutter and sell items you no longer use. Online marketplaces make it easy to turn unused belongings into extra cash.',
            category: 'earning',
            author: 'PiggyPal Team',
            date: new Date().toISOString(),
            bookmarked: false
        }
    ];
    
    // Get user data
    const userData = getLocalStorageData();
    
    // Add default tips
    userData.tips = defaultTips;
    
    // Save updated data to local storage
    setLocalStorageData(userData);
    
    // Update UI
    updateTipsGrid();
    initFeaturedTip();
}

function initTipsChallenge() {
    // Get challenge container
    const challengeContainer = document.querySelector('.tips-challenge');
    
    // Define challenges
    const challenges = [
        {
            title: 'No-Spend Weekend',
            description: 'Challenge yourself to spend absolutely nothing for an entire weekend. Plan free activities and use what you already have.',
            icon: 'fa-calendar-alt'
        },
        {
            title: 'Lunch Packing Week',
            description: 'Pack your lunch every day for a week instead of buying food. Track how much you save compared to your usual spending.',
            icon: 'fa-utensils'
        },
        {
            title: 'Spare Change Challenge',
            description: 'Collect all your spare change for a month. At the end, count it up and deposit it into your savings.',
            icon: 'fa-coins'
        },
        {
            title: '24-Hour Gratitude',
            description: 'Spend 24 hours focusing on what you already have instead of what you want to buy. Write down things you're grateful for.',
            icon: 'fa-heart'
        }
    ];
    
    // Get random challenge
    const randomIndex = Math.floor(Math.random() * challenges.length);
    const challenge = challenges[randomIndex];
    
    // Update challenge UI
    challengeContainer.innerHTML = `
        <div class="challenge-icon">
            <i class="fas ${challenge.icon}"></i>
        </div>
        <div class="challenge-content">
            <h3>This Week's Challenge: ${challenge.title}</h3>
            <p>${challenge.description}</p>
            <button class="btn btn-primary" onclick="acceptChallenge()">
                Accept Challenge
            </button>
        </div>
    `;
}

function acceptChallenge() {
    // Show toast message
    showToast('Challenge accepted! Good luck!', 'success');
    
    // Update UI
    const acceptButton = document.querySelector('.tips-challenge .btn');
    acceptButton.textContent = 'Challenge Accepted!';
    acceptButton.disabled = true;
    acceptButton.classList.add('accepted');
}

function initSubmitTipForm() {
    // Get the tip form
    const tipForm = document.getElementById('submit-tip-form');
    
    // Add event listener for form submission
    tipForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        if (validateTipForm()) {
            // Save tip
            saveTip();
            
            // Reset form
            tipForm.reset();
            
            // Show success message
            showToast('Thank you for sharing your tip!', 'success');
        }
    });
}

function validateTipForm() {
    // Get form values
    const title = document.getElementById('tip-title').value.trim();
    const content = document.getElementById('tip-content').value.trim();
    const category = document.getElementById('tip-category').value;
    const author = document.getElementById('tip-author').value.trim();
    
    // Clear previous validation errors
    clearValidationErrors();
    
    // Validate title
    if (!title) {
        showValidationError('tip-title', 'Please enter a title');
        return false;
    }
    
    // Validate content
    if (!content) {
        showValidationError('tip-content', 'Please enter tip content');
        return false;
    }
    
    // Validate category
    if (!category) {
        showValidationError('tip-category', 'Please select a category');
        return false;
    }
    
    return true;
}

function showValidationError(inputId, message) {
    const inputElement = document.getElementById(inputId);
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    
    // Add error class to input
    inputElement.classList.add('error');
    
    // Add error message after input
    inputElement.parentNode.appendChild(errorElement);
}

function clearValidationErrors() {
    // Remove all error messages
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(error => error.remove());
    
    // Remove error class from inputs
    const errorInputs = document.querySelectorAll('.error');
    errorInputs.forEach(input => input.classList.remove('error'));
}

function saveTip() {
    // Get form values
    const title = document.getElementById('tip-title').value.trim();
    const content = document.getElementById('tip-content').value.trim();
    const category = document.getElementById('tip-category').value;
    const author = document.getElementById('tip-author').value.trim() || 'Anonymous';
    
    // Create tip object
    const tip = {
        id: generateUniqueId(),
        title: title,
        content: content,
        category: category,
        author: author,
        date: new Date().toISOString(),
        bookmarked: false
    };
    
    // Get user data
    const userData = getLocalStorageData();
    
    // Add new tip
    userData.tips.push(tip);
    
    // Save updated data to local storage
    setLocalStorageData(userData);
    
    // Update UI
    updateTipsGrid();
}

function initBookmarkedTips() {
    // Update bookmarked tips
    updateBookmarkedTips();
}

function updateBookmarkedTips() {
    // Get user data
    const userData = getLocalStorageData();
    
    // Get bookmarked tips
    const bookmarkedTips = userData.tips.filter(tip => tip.bookmarked);
    
    // Get bookmarked tips container
    const bookmarkedContainer = document.querySelector('.bookmarked-tips-list');
    
    // Clear existing bookmarked tips
    bookmarkedContainer.innerHTML = '';
    
    // If no bookmarked tips, show empty state
    if (bookmarkedTips.length === 0) {
        bookmarkedContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-bookmark"></i>
                <h3>No Bookmarked Tips</h3>
                <p>Bookmark tips you find useful to access them quickly here.</p>
            </div>
        `;
        return;
    }
    
    // Create bookmarked tip items
    bookmarkedTips.forEach(tip => {
        const tipItem = document.createElement('div');
        tipItem.className = 'bookmarked-tip-item';
        tipItem.dataset.id = tip.id;
        
        tipItem.innerHTML = `
            <div class="tip-header">
                <h4 class="tip-title">${tip.title}</h4>
                <span class="tip-category ${tip.category}">${tip.category}</span>
            </div>
            <div class="tip-content">
                <p>${tip.content.substring(0, 100)}${tip.content.length > 100 ? '...' : ''}</p>
            </div>
            <div class="tip-actions">
                <button class="action-btn" onclick="toggleBookmark('${tip.id}')" title="Remove bookmark">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        bookmarkedContainer.appendChild(tipItem);
    });
}

function toggleBookmark(tipId) {
    // Get user data
    const userData = getLocalStorageData();
    
    // Find tip index
    const tipIndex = userData.tips.findIndex(tip => tip.id === tipId);
    
    if (tipIndex === -1) {
        showToast('Tip not found', 'error');
        return;
    }
    
    // Toggle bookmarked status
    userData.tips[tipIndex].bookmarked = !userData.tips[tipIndex].bookmarked;
    
    // Save updated data to local storage
    setLocalStorageData(userData);
    
    // Update UI
    updateTipsGrid();
    updateBookmarkedTips();
    
    // Show success message
    if (userData.tips[tipIndex].bookmarked) {
        showToast('Tip bookmarked!', 'success');
    } else {
        showToast('Bookmark removed', 'info');
    }
}

function shareTip(tipId) {
    // Get user data
    const userData = getLocalStorageData();
    
    // Find tip
    const tip = userData.tips.find(tip => tip.id === tipId);
    
    if (!tip) {
        showToast('Tip not found', 'error');
        return;
    }
    
    // Create share text
    const shareText = `Money-Saving Tip: ${tip.title} - ${tip.content}`;
    
    // Check if Web Share API is supported
    if (navigator.share) {
        navigator.share({
            title: 'PiggyPal Money-Saving Tip',
            text: shareText
        })
        .then(() => showToast('Tip shared successfully!', 'success'))
        .catch(() => copyToClipboard(shareText));
    } else {
        // Fallback to clipboard
        copyToClipboard(shareText);
    }
}

function copyToClipboard(text) {
    // Create temporary textarea
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    
    // Select and copy text
    textarea.select();
    document.execCommand('copy');
    
    // Remove temporary textarea
    document.body.removeChild(textarea);
    
    // Show success message
    showToast('Tip copied to clipboard!', 'success');
}