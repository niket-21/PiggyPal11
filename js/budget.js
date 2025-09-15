// Budget Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initApp();
});

function initApp() {
    // Initialize all components
    initBudgetOverview();
    initBudgetCategories();
    initBudgetTools();
    initBudgetTips();
    initBudgetModals();
    
    // Check for URL parameters
    checkUrlParams();
}

function checkUrlParams() {
    // Check if there's an action parameter in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get('action');
    
    if (action === 'create') {
        // Open budget creation modal
        openModal('budget-calculator-modal');
    }
}

function initBudgetOverview() {
    // Get user data
    const userData = getLocalStorageData();
    
    // Update budget overview
    updateBudgetOverview(userData.budget);
    
    // Add event listener for period selector
    document.getElementById('budget-period-selector').addEventListener('change', function() {
        updateBudgetOverview(userData.budget);
    });
}

function updateBudgetOverview(budget) {
    // Get selected period
    const period = document.getElementById('budget-period-selector').value;
    
    // Calculate total budget and spent amounts
    const totalBudget = budget.categories.reduce((total, category) => total + category.limit, 0);
    const totalSpent = budget.categories.reduce((total, category) => total + category.spent, 0);
    const remaining = totalBudget - totalSpent;
    const spentPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
    
    // Update budget overview UI
    document.getElementById('total-budget').textContent = formatCurrency(totalBudget);
    document.getElementById('total-spent').textContent = formatCurrency(totalSpent);
    document.getElementById('remaining-budget').textContent = formatCurrency(remaining);
    
    // Update progress bar
    const progressBar = document.querySelector('.budget-progress-bar .progress');
    progressBar.style.width = `${Math.min(spentPercentage, 100)}%`;
    
    // Update progress bar color based on percentage
    if (spentPercentage > 90) {
        progressBar.className = 'progress danger';
    } else if (spentPercentage > 75) {
        progressBar.className = 'progress warning';
    } else {
        progressBar.className = 'progress';
    }
    
    // Update budget status message
    const statusMessage = document.getElementById('budget-status-message');
    if (remaining < 0) {
        statusMessage.textContent = 'You have exceeded your budget!';
        statusMessage.className = 'status-message danger';
    } else if (remaining < totalBudget * 0.1) {
        statusMessage.textContent = 'You are close to your budget limit!';
        statusMessage.className = 'status-message warning';
    } else {
        statusMessage.textContent = 'Your budget is on track!';
        statusMessage.className = 'status-message success';
    }
}

function initBudgetCategories() {
    // Update budget categories
    updateBudgetCategories();
    
    // Add event listener for add category button
    document.getElementById('add-category-btn').addEventListener('click', function() {
        openModal('category-modal');
    });
    
    // Add event listener for category form submission
    document.getElementById('category-form').addEventListener('submit', function(e) {
        e.preventDefault();
        saveBudgetCategory();
    });
}

function updateBudgetCategories() {
    // Get user data
    const userData = getLocalStorageData();
    
    // Get categories container
    const categoriesContainer = document.querySelector('.budget-categories-list');
    
    // Clear existing categories
    categoriesContainer.innerHTML = '';
    
    // If no categories, show empty state
    if (userData.budget.categories.length === 0) {
        categoriesContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-folder-open"></i>
                <h3>No Budget Categories</h3>
                <p>Add your first budget category to start tracking your spending.</p>
            </div>
        `;
        return;
    }
    
    // Sort categories by limit (highest first)
    userData.budget.categories.sort((a, b) => b.limit - a.limit);
    
    // Create category items
    userData.budget.categories.forEach(category => {
        const spentPercentage = category.limit > 0 ? (category.spent / category.limit) * 100 : 0;
        const remaining = category.limit - category.spent;
        
        const categoryItem = document.createElement('div');
        categoryItem.className = 'category-item';
        categoryItem.dataset.category = category.name;
        
        // Determine progress bar class based on percentage
        let progressClass = 'progress';
        if (spentPercentage > 90) {
            progressClass = 'progress danger';
        } else if (spentPercentage > 75) {
            progressClass = 'progress warning';
        }
        
        categoryItem.innerHTML = `
            <div class="category-header">
                <div class="category-icon">
                    <i class="fas ${getCategoryIcon(category.name)}"></i>
                </div>
                <div class="category-title">
                    <h4>${category.name}</h4>
                    <span class="category-limit">${formatCurrency(category.limit)}</span>
                </div>
                <div class="category-actions">
                    <button class="action-btn edit" title="Edit" onclick="editCategory('${category.name}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" title="Delete" onclick="deleteCategory('${category.name}')">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </div>
            <div class="category-progress">
                <div class="progress-bar">
                    <div class="${progressClass}" style="width: ${Math.min(spentPercentage, 100)}%"></div>
                </div>
                <div class="progress-labels">
                    <span class="spent">${formatCurrency(category.spent)}</span>
                    <span class="remaining">${formatCurrency(remaining)} left</span>
                </div>
            </div>
        `;
        
        categoriesContainer.appendChild(categoryItem);
    });
}

function getCategoryIcon(category) {
    // Return appropriate icon for each category
    switch(category.toLowerCase()) {
        case 'food':
            return 'fa-utensils';
        case 'transport':
            return 'fa-car';
        case 'entertainment':
            return 'fa-film';
        case 'shopping':
            return 'fa-shopping-bag';
        case 'utilities':
            return 'fa-bolt';
        case 'rent':
            return 'fa-home';
        case 'health':
            return 'fa-heartbeat';
        case 'education':
            return 'fa-graduation-cap';
        default:
            return 'fa-folder';
    }
}

function saveBudgetCategory() {
    // Get form values
    const categoryName = document.getElementById('category-name').value.trim();
    const categoryLimit = parseFloat(document.getElementById('category-limit').value.trim());
    const categoryId = document.getElementById('category-id').value.trim();
    
    // Validate form
    if (!categoryName || isNaN(categoryLimit) || categoryLimit <= 0) {
        showToast('Please fill all required fields correctly', 'error');
        return;
    }
    
    // Get user data
    const userData = getLocalStorageData();
    
    // Check if editing existing category or creating new one
    if (categoryId) {
        // Find category index
        const categoryIndex = userData.budget.categories.findIndex(cat => cat.name === categoryId);
        
        if (categoryIndex === -1) {
            showToast('Category not found', 'error');
            return;
        }
        
        // Update category
        userData.budget.categories[categoryIndex].name = categoryName;
        userData.budget.categories[categoryIndex].limit = categoryLimit;
        
        // If category name changed, update expenses with old category name
        if (categoryId !== categoryName) {
            userData.expenses.forEach(expense => {
                if (expense.category === categoryId) {
                    expense.category = categoryName;
                }
            });
        }
    } else {
        // Check if category already exists
        const existingCategory = userData.budget.categories.find(cat => 
            cat.name.toLowerCase() === categoryName.toLowerCase());
        
        if (existingCategory) {
            showToast('Category already exists', 'error');
            return;
        }
        
        // Add new category
        userData.budget.categories.push({
            name: categoryName,
            limit: categoryLimit,
            spent: 0
        });
    }
    
    // Save updated data to local storage
    setLocalStorageData(userData);
    
    // Close modal
    closeModal('category-modal');
    
    // Reset form
    document.getElementById('category-form').reset();
    document.getElementById('category-id').value = '';
    document.getElementById('category-modal-title').textContent = 'Add Budget Category';
    
    // Update UI
    updateBudgetCategories();
    updateBudgetOverview(userData.budget);
    
    // Show success message
    showToast('Budget category saved successfully!', 'success');
}

function editCategory(categoryName) {
    // Get user data
    const userData = getLocalStorageData();
    
    // Find category
    const category = userData.budget.categories.find(cat => cat.name === categoryName);
    
    if (!category) {
        showToast('Category not found', 'error');
        return;
    }
    
    // Populate form with category data
    document.getElementById('category-id').value = category.name;
    document.getElementById('category-name').value = category.name;
    document.getElementById('category-limit').value = category.limit;
    
    // Update modal title
    document.getElementById('category-modal-title').textContent = 'Edit Budget Category';
    
    // Open modal
    openModal('category-modal');
}

function deleteCategory(categoryName) {
    // Confirm deletion
    if (!confirm(`Are you sure you want to delete the "${categoryName}" category?`)) {
        return;
    }
    
    // Get user data
    const userData = getLocalStorageData();
    
    // Find category index
    const categoryIndex = userData.budget.categories.findIndex(cat => cat.name === categoryName);
    
    if (categoryIndex === -1) {
        showToast('Category not found', 'error');
        return;
    }
    
    // Remove category from array
    userData.budget.categories.splice(categoryIndex, 1);
    
    // Save updated data to local storage
    setLocalStorageData(userData);
    
    // Update UI
    updateBudgetCategories();
    updateBudgetOverview(userData.budget);
    
    // Show success message
    showToast(`Category "${categoryName}" deleted successfully!`, 'success');
}

function initBudgetTools() {
    // Initialize budget calculator
    initBudgetCalculator();
    
    // Add event listener for calculator button
    document.getElementById('budget-calculator-btn').addEventListener('click', function() {
        openModal('budget-calculator-modal');
    });
}

function initBudgetCalculator() {
    // Get calculator form
    const calculatorForm = document.getElementById('budget-calculator-form');
    
    // Add event listener for form submission
    calculatorForm.addEventListener('submit', function(e) {
        e.preventDefault();
        calculateBudget();
    });
    
    // Add event listener for income inputs to update total income
    const incomeInputs = document.querySelectorAll('.income-input');
    incomeInputs.forEach(input => {
        input.addEventListener('input', updateTotalIncome);
    });
    
    // Add event listener for expense inputs to update total expenses
    const expenseInputs = document.querySelectorAll('.expense-input');
    expenseInputs.forEach(input => {
        input.addEventListener('input', updateTotalExpenses);
    });
}

function updateTotalIncome() {
    // Get all income inputs
    const incomeInputs = document.querySelectorAll('.income-input');
    
    // Calculate total income
    let totalIncome = 0;
    incomeInputs.forEach(input => {
        const value = parseFloat(input.value) || 0;
        totalIncome += value;
    });
    
    // Update total income display
    document.getElementById('total-income').textContent = formatCurrency(totalIncome);
    
    // Update available budget
    updateAvailableBudget();
}

function updateTotalExpenses() {
    // Get all expense inputs
    const expenseInputs = document.querySelectorAll('.expense-input');
    
    // Calculate total expenses
    let totalExpenses = 0;
    expenseInputs.forEach(input => {
        const value = parseFloat(input.value) || 0;
        totalExpenses += value;
    });
    
    // Update total expenses display
    document.getElementById('total-expenses').textContent = formatCurrency(totalExpenses);
    
    // Update available budget
    updateAvailableBudget();
}

function updateAvailableBudget() {
    // Get total income and expenses
    const totalIncome = parseFloat(document.getElementById('total-income').textContent.replace(/[^0-9.-]+/g, '')) || 0;
    const totalExpenses = parseFloat(document.getElementById('total-expenses').textContent.replace(/[^0-9.-]+/g, '')) || 0;
    
    // Calculate available budget
    const availableBudget = totalIncome - totalExpenses;
    
    // Update available budget display
    const availableBudgetElement = document.getElementById('available-budget');
    availableBudgetElement.textContent = formatCurrency(availableBudget);
    
    // Update available budget color based on value
    if (availableBudget < 0) {
        availableBudgetElement.className = 'amount danger';
    } else if (availableBudget === 0) {
        availableBudgetElement.className = 'amount warning';
    } else {
        availableBudgetElement.className = 'amount success';
    }
}

function calculateBudget() {
    // Get form values
    const mainIncome = parseFloat(document.getElementById('main-income').value) || 0;
    const sideIncome = parseFloat(document.getElementById('side-income').value) || 0;
    const otherIncome = parseFloat(document.getElementById('other-income').value) || 0;
    
    const housingExpense = parseFloat(document.getElementById('housing-expense').value) || 0;
    const foodExpense = parseFloat(document.getElementById('food-expense').value) || 0;
    const transportExpense = parseFloat(document.getElementById('transport-expense').value) || 0;
    const utilitiesExpense = parseFloat(document.getElementById('utilities-expense').value) || 0;
    const entertainmentExpense = parseFloat(document.getElementById('entertainment-expense').value) || 0;
    const healthExpense = parseFloat(document.getElementById('health-expense').value) || 0;
    const educationExpense = parseFloat(document.getElementById('education-expense').value) || 0;
    const otherExpense = parseFloat(document.getElementById('other-expense').value) || 0;
    
    // Calculate totals
    const totalIncome = mainIncome + sideIncome + otherIncome;
    const totalExpenses = housingExpense + foodExpense + transportExpense + utilitiesExpense + 
                         entertainmentExpense + healthExpense + educationExpense + otherExpense;
    const availableBudget = totalIncome - totalExpenses;
    
    // Get user data
    const userData = getLocalStorageData();
    
    // Clear existing categories
    userData.budget.categories = [];
    
    // Add categories based on form values
    if (housingExpense > 0) {
        userData.budget.categories.push({
            name: 'Rent',
            limit: housingExpense,
            spent: 0
        });
    }
    
    if (foodExpense > 0) {
        userData.budget.categories.push({
            name: 'Food',
            limit: foodExpense,
            spent: 0
        });
    }
    
    if (transportExpense > 0) {
        userData.budget.categories.push({
            name: 'Transport',
            limit: transportExpense,
            spent: 0
        });
    }
    
    if (utilitiesExpense > 0) {
        userData.budget.categories.push({
            name: 'Utilities',
            limit: utilitiesExpense,
            spent: 0
        });
    }
    
    if (entertainmentExpense > 0) {
        userData.budget.categories.push({
            name: 'Entertainment',
            limit: entertainmentExpense,
            spent: 0
        });
    }
    
    if (healthExpense > 0) {
        userData.budget.categories.push({
            name: 'Health',
            limit: healthExpense,
            spent: 0
        });
    }
    
    if (educationExpense > 0) {
        userData.budget.categories.push({
            name: 'Education',
            limit: educationExpense,
            spent: 0
        });
    }
    
    if (otherExpense > 0) {
        userData.budget.categories.push({
            name: 'Other',
            limit: otherExpense,
            spent: 0
        });
    }
    
    // Update budget income
    userData.budget.income = totalIncome;
    
    // Save updated data to local storage
    setLocalStorageData(userData);
    
    // Close modal
    closeModal('budget-calculator-modal');
    
    // Update UI
    updateBudgetCategories();
    updateBudgetOverview(userData.budget);
    
    // Show success message
    showToast('Budget created successfully!', 'success');
}

function initBudgetTips() {
    // Get budget tips container
    const tipsContainer = document.querySelector('.budget-tips-list');
    
    // Define budget tips
    const budgetTips = [
        {
            title: '50/30/20 Rule',
            description: 'Allocate 50% of your income to needs, 30% to wants, and 20% to savings and debt repayment.'
        },
        {
            title: 'Zero-Based Budgeting',
            description: 'Assign every dollar a job so your income minus expenses equals zero.'
        },
        {
            title: 'Envelope System',
            description: 'Use envelopes to separate and limit spending for different categories.'
        },
        {
            title: 'Pay Yourself First',
            description: 'Set aside savings as soon as you get paid, before spending on anything else.'
        }
    ];
    
    // Create tip items
    budgetTips.forEach(tip => {
        const tipItem = document.createElement('div');
        tipItem.className = 'tip-item';
        
        tipItem.innerHTML = `
            <div class="tip-icon">
                <i class="fas fa-lightbulb"></i>
            </div>
            <div class="tip-content">
                <h4>${tip.title}</h4>
                <p>${tip.description}</p>
            </div>
        `;
        
        tipsContainer.appendChild(tipItem);
    });
}

function initBudgetModals() {
    // Get all modals
    const modals = document.querySelectorAll('.modal');
    
    // Add event listeners for closing modals
    modals.forEach(modal => {
        const closeBtn = modal.querySelector('.modal-close');
        const cancelBtn = modal.querySelector('.cancel-btn');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                closeModal(modal.id);
            });
        }
        
        if (cancelBtn) {
            cancelBtn.addEventListener('click', function() {
                closeModal(modal.id);
            });
        }
        
        // Close modal when clicking outside
        window.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });
}

function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}