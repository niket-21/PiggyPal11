// Expenses Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initApp();
});

function initApp() {
    // Initialize all components
    initExpenseForm();
    initExpenseSummary();
    initExpenseVisualization();
    initExpenseHistory();
    initExpenseModal();
    
    // Check for URL parameters
    checkUrlParams();
}

function checkUrlParams() {
    // Check if there's an action parameter in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get('action');
    
    if (action === 'add') {
        // Focus on the expense description input
        document.getElementById('expense-description').focus();
    }
}

function initExpenseForm() {
    // Get the expense form
    const expenseForm = document.getElementById('expense-form');
    
    // Add event listener for form submission
    expenseForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        if (validateExpenseForm()) {
            // Save expense
            saveExpense();
            
            // Reset form
            expenseForm.reset();
            
            // Update UI
            updateUI();
            
            // Show success message
            showToast('Expense added successfully!', 'success');
        }
    });
    
    // Add event listener for reset button
    document.getElementById('reset-button').addEventListener('click', function() {
        expenseForm.reset();
        clearValidationErrors();
    });
    
    // Initialize date picker with current date
    const today = new Date();
    const formattedDate = today.toISOString().substr(0, 10);
    document.getElementById('expense-date').value = formattedDate;
    
    // Initialize category selection
    initCategorySelection();
}

function initCategorySelection() {
    // Get all category options
    const categoryOptions = document.querySelectorAll('.category-option');
    
    // Add event listener for each category option
    categoryOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove selected class from all options
            categoryOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Add selected class to clicked option
            this.classList.add('selected');
            
            // Update hidden input value
            document.getElementById('expense-category').value = this.dataset.category;
        });
    });
}

function validateExpenseForm() {
    // Get form values
    const description = document.getElementById('expense-description').value.trim();
    const amount = document.getElementById('expense-amount').value.trim();
    const date = document.getElementById('expense-date').value.trim();
    const category = document.getElementById('expense-category').value.trim();
    
    // Clear previous validation errors
    clearValidationErrors();
    
    // Validate description
    if (!description) {
        showValidationError('expense-description', 'Please enter a description');
        return false;
    }
    
    // Validate amount
    if (!amount) {
        showValidationError('expense-amount', 'Please enter an amount');
        return false;
    }
    
    if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
        showValidationError('expense-amount', 'Please enter a valid amount');
        return false;
    }
    
    // Validate date
    if (!date) {
        showValidationError('expense-date', 'Please select a date');
        return false;
    }
    
    // Validate category
    if (!category) {
        showValidationError('expense-category-container', 'Please select a category');
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

function saveExpense() {
    // Get form values
    const description = document.getElementById('expense-description').value.trim();
    const amount = parseFloat(document.getElementById('expense-amount').value.trim());
    const date = document.getElementById('expense-date').value.trim();
    const category = document.getElementById('expense-category').value.trim();
    const notes = document.getElementById('expense-notes').value.trim();
    
    // Create expense object
    const expense = {
        id: generateUniqueId(),
        description: description,
        amount: amount,
        date: date,
        category: category,
        notes: notes
    };
    
    // Get existing expenses from local storage
    const userData = getLocalStorageData();
    
    // Add new expense
    userData.expenses.push(expense);
    
    // Update budget category spent amount
    updateBudgetCategorySpent(userData, category, amount);
    
    // Save updated data to local storage
    setLocalStorageData(userData);
}

function updateBudgetCategorySpent(userData, category, amount) {
    // Find matching budget category
    const budgetCategory = userData.budget.categories.find(cat => 
        cat.name.toLowerCase() === category.toLowerCase());
    
    // If category exists, update spent amount
    if (budgetCategory) {
        budgetCategory.spent += amount;
    } else {
        // If category doesn't exist in budget, create it
        userData.budget.categories.push({
            name: category,
            limit: amount * 2, // Set default limit to double the expense amount
            spent: amount
        });
    }
}

function initExpenseSummary() {
    // Update expense summary
    updateExpenseSummary();
    
    // Add event listener for period selector
    document.getElementById('period-selector').addEventListener('change', function() {
        updateExpenseSummary();
    });
}

function updateExpenseSummary() {
    // Get selected period
    const period = document.getElementById('period-selector').value;
    
    // Get user data
    const userData = getLocalStorageData();
    
    // Filter expenses based on selected period
    const filteredExpenses = filterExpensesByPeriod(userData.expenses, period);
    
    // Calculate summary statistics
    const totalExpenses = filteredExpenses.reduce((total, expense) => total + expense.amount, 0);
    const averageExpense = filteredExpenses.length > 0 ? totalExpenses / filteredExpenses.length : 0;
    const highestExpense = filteredExpenses.length > 0 ? 
        Math.max(...filteredExpenses.map(expense => expense.amount)) : 0;
    
    // Update summary UI
    document.getElementById('total-expenses').textContent = formatCurrency(totalExpenses);
    document.getElementById('average-expense').textContent = formatCurrency(averageExpense);
    document.getElementById('highest-expense').textContent = formatCurrency(highestExpense);
}

function filterExpensesByPeriod(expenses, period) {
    const today = new Date();
    let startDate;
    
    switch(period) {
        case 'week':
            startDate = new Date(today);
            startDate.setDate(today.getDate() - 7);
            break;
        case 'month':
            startDate = new Date(today);
            startDate.setMonth(today.getMonth() - 1);
            break;
        case 'year':
            startDate = new Date(today);
            startDate.setFullYear(today.getFullYear() - 1);
            break;
        default:
            startDate = new Date(0); // Beginning of time
    }
    
    return expenses.filter(expense => new Date(expense.date) >= startDate);
}

function initExpenseVisualization() {
    // Initialize charts
    initExpenseCharts();
    
    // Add event listeners for chart tabs
    const chartTabs = document.querySelectorAll('.chart-tab');
    chartTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            chartTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Show selected chart
            showChart(this.dataset.chart);
        });
    });
}

function initExpenseCharts() {
    // Initialize category chart
    initCategoryChart();
    
    // Initialize trend chart
    initTrendChart();
}

function initCategoryChart() {
    const ctx = document.getElementById('category-chart').getContext('2d');
    
    // Get user data
    const userData = getLocalStorageData();
    
    // Group expenses by category
    const categoryData = {};
    userData.expenses.forEach(expense => {
        if (!categoryData[expense.category]) {
            categoryData[expense.category] = 0;
        }
        categoryData[expense.category] += expense.amount;
    });
    
    // Prepare chart data
    const labels = Object.keys(categoryData);
    const data = Object.values(categoryData);
    
    // Define colors for categories
    const backgroundColors = [
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(153, 102, 255, 0.7)',
        'rgba(255, 159, 64, 0.7)',
        'rgba(199, 199, 199, 0.7)'
    ];
    
    // Create the chart
    const categoryChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColors.slice(0, labels.length),
                borderColor: 'rgba(255, 255, 255, 0.8)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: ${formatCurrency(value)} (${percentage}%)`;
                        }
                    }
                }
            },
            cutout: '70%'
        }
    });
    
    // Store chart reference for later updates
    window.categoryChart = categoryChart;
}

function initTrendChart() {
    const ctx = document.getElementById('trend-chart').getContext('2d');
    
    // Get user data
    const userData = getLocalStorageData();
    
    // Prepare data for the last 6 months
    const labels = [];
    const expenseData = [];
    
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
        const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
        labels.push(formatDate(month, 'month'));
        
        // Calculate expenses for this month
        const monthExpenses = userData.expenses
            .filter(expense => {
                const expenseDate = new Date(expense.date);
                return expenseDate.getMonth() === month.getMonth() && 
                       expenseDate.getFullYear() === month.getFullYear();
            })
            .reduce((total, expense) => total + expense.amount, 0);
        
        expenseData.push(monthExpenses);
    }
    
    // Create the chart
    const trendChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Expenses',
                data: expenseData,
                backgroundColor: 'rgba(244, 67, 54, 0.2)',
                borderColor: 'rgba(244, 67, 54, 1)',
                borderWidth: 2,
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false,
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return 'Expenses: ' + formatCurrency(context.raw);
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value, true);
                        }
                    }
                }
            }
        }
    });
    
    // Store chart reference for later updates
    window.trendChart = trendChart;
}

function showChart(chartId) {
    // Hide all charts
    document.querySelectorAll('.chart-container').forEach(chart => {
        chart.style.display = 'none';
    });
    
    // Show selected chart
    document.getElementById(chartId).style.display = 'block';
}

function initExpenseHistory() {
    // Update expense history
    updateExpenseHistory();
    
    // Add event listener for filter input
    document.getElementById('expense-filter').addEventListener('input', function() {
        updateExpenseHistory();
    });
}

function updateExpenseHistory() {
    // Get filter value
    const filterValue = document.getElementById('expense-filter').value.toLowerCase();
    
    // Get user data
    const userData = getLocalStorageData();
    
    // Filter expenses based on filter value
    let filteredExpenses = userData.expenses;
    
    if (filterValue) {
        filteredExpenses = filteredExpenses.filter(expense => 
            expense.description.toLowerCase().includes(filterValue) || 
            expense.category.toLowerCase().includes(filterValue) ||
            expense.notes.toLowerCase().includes(filterValue)
        );
    }
    
    // Sort expenses by date (most recent first)
    filteredExpenses.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Get expense list container
    const expenseList = document.querySelector('.expense-list');
    
    // Clear existing expense items
    expenseList.innerHTML = '';
    
    // If no expenses, show empty state
    if (filteredExpenses.length === 0) {
        expenseList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-receipt"></i>
                <h3>No Expenses Found</h3>
                <p>Add your first expense or try a different filter.</p>
            </div>
        `;
        return;
    }
    
    // Create expense items
    filteredExpenses.forEach(expense => {
        const expenseItem = document.createElement('div');
        expenseItem.className = 'expense-item';
        expenseItem.dataset.id = expense.id;
        
        expenseItem.innerHTML = `
            <div class="expense-icon ${expense.category.toLowerCase()}">
                <i class="fas ${getCategoryIcon(expense.category)}"></i>
            </div>
            <div class="expense-content">
                <h4 class="expense-title">${expense.description}</h4>
                <div class="expense-details">
                    <span class="expense-category">
                        <i class="fas fa-tag"></i> ${expense.category}
                    </span>
                    <span class="expense-date">
                        <i class="fas fa-calendar-alt"></i> ${formatDate(new Date(expense.date), 'short')}
                    </span>
                </div>
            </div>
            <div class="expense-amount">
                ${formatCurrency(expense.amount)}
            </div>
            <div class="expense-actions">
                <button class="action-btn edit" title="Edit" onclick="editExpense('${expense.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete" title="Delete" onclick="deleteExpense('${expense.id}')">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        `;
        
        expenseList.appendChild(expenseItem);
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
            return 'fa-receipt';
    }
}

function initExpenseModal() {
    // Get modal elements
    const modal = document.getElementById('edit-modal');
    const closeBtn = document.querySelector('.modal-close');
    const cancelBtn = document.getElementById('modal-cancel');
    
    // Add event listeners for closing modal
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Add event listener for save button
    document.getElementById('modal-save').addEventListener('click', saveEditedExpense);
}

function openModal() {
    document.getElementById('edit-modal').classList.add('active');
}

function closeModal() {
    document.getElementById('edit-modal').classList.remove('active');
}

function editExpense(expenseId) {
    // Get user data
    const userData = getLocalStorageData();
    
    // Find expense by ID
    const expense = userData.expenses.find(exp => exp.id === expenseId);
    
    if (!expense) {
        showToast('Expense not found', 'error');
        return;
    }
    
    // Populate modal form with expense data
    document.getElementById('edit-expense-id').value = expense.id;
    document.getElementById('edit-expense-description').value = expense.description;
    document.getElementById('edit-expense-amount').value = expense.amount;
    document.getElementById('edit-expense-date').value = expense.date;
    document.getElementById('edit-expense-category').value = expense.category;
    document.getElementById('edit-expense-notes').value = expense.notes || '';
    
    // Open modal
    openModal();
}

function saveEditedExpense() {
    // Get form values
    const id = document.getElementById('edit-expense-id').value;
    const description = document.getElementById('edit-expense-description').value.trim();
    const amount = parseFloat(document.getElementById('edit-expense-amount').value.trim());
    const date = document.getElementById('edit-expense-date').value.trim();
    const category = document.getElementById('edit-expense-category').value.trim();
    const notes = document.getElementById('edit-expense-notes').value.trim();
    
    // Validate form
    if (!description || isNaN(amount) || amount <= 0 || !date || !category) {
        showToast('Please fill all required fields correctly', 'error');
        return;
    }
    
    // Get user data
    const userData = getLocalStorageData();
    
    // Find expense index
    const expenseIndex = userData.expenses.findIndex(exp => exp.id === id);
    
    if (expenseIndex === -1) {
        showToast('Expense not found', 'error');
        return;
    }
    
    // Get old expense for budget update
    const oldExpense = userData.expenses[expenseIndex];
    
    // Update expense
    userData.expenses[expenseIndex] = {
        id: id,
        description: description,
        amount: amount,
        date: date,
        category: category,
        notes: notes
    };
    
    // Update budget category spent amount if category or amount changed
    if (oldExpense.category !== category || oldExpense.amount !== amount) {
        // Subtract old amount from old category
        updateBudgetCategorySpent(userData, oldExpense.category, -oldExpense.amount);
        
        // Add new amount to new category
        updateBudgetCategorySpent(userData, category, amount);
    }
    
    // Save updated data to local storage
    setLocalStorageData(userData);
    
    // Close modal
    closeModal();
    
    // Update UI
    updateUI();
    
    // Show success message
    showToast('Expense updated successfully!', 'success');
}

function deleteExpense(expenseId) {
    // Confirm deletion
    if (!confirm('Are you sure you want to delete this expense?')) {
        return;
    }
    
    // Get user data
    const userData = getLocalStorageData();
    
    // Find expense index
    const expenseIndex = userData.expenses.findIndex(exp => exp.id === expenseId);
    
    if (expenseIndex === -1) {
        showToast('Expense not found', 'error');
        return;
    }
    
    // Get expense for budget update
    const expense = userData.expenses[expenseIndex];
    
    // Remove expense from array
    userData.expenses.splice(expenseIndex, 1);
    
    // Update budget category spent amount
    updateBudgetCategorySpent(userData, expense.category, -expense.amount);
    
    // Save updated data to local storage
    setLocalStorageData(userData);
    
    // Update UI
    updateUI();
    
    // Show success message
    showToast('Expense deleted successfully!', 'success');
}

function updateUI() {
    // Update all UI components
    updateExpenseSummary();
    updateExpenseHistory();
    
    // Update charts
    if (window.categoryChart) {
        initCategoryChart(); // Reinitialize for simplicity
    }
    
    if (window.trendChart) {
        initTrendChart(); // Reinitialize for simplicity
    }
}