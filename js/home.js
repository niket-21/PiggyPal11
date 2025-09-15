// Home Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initApp();
});

function initApp() {
    // Initialize all components
    initDashboard();
    initCharts();
    initQuickActions();
    initRecentActivity();
}

function initDashboard() {
    // Get user data from local storage
    const userData = getUserData();
    
    // Update dashboard stats
    updateDashboardStats(userData);
    
    // Update dashboard date
    document.querySelector('.dashboard-date').textContent = `Last updated: ${formatDate(new Date(), 'full')}`;
}

function updateDashboardStats(userData) {
    // Calculate total balance
    const totalBalance = userData.balance || 0;
    document.querySelector('#total-balance .stat-card-value').textContent = formatCurrency(totalBalance);
    
    // Calculate total expenses this month
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const expensesThisMonth = userData.expenses
        .filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
        })
        .reduce((total, expense) => total + expense.amount, 0);
    
    document.querySelector('#monthly-expenses .stat-card-value').textContent = formatCurrency(expensesThisMonth);
    
    // Calculate savings
    const totalSavings = userData.goals
        .reduce((total, goal) => total + goal.currentAmount, 0);
    
    document.querySelector('#total-savings .stat-card-value').textContent = formatCurrency(totalSavings);
    
    // Calculate budget status
    const budgetTotal = userData.budget.categories
        .reduce((total, category) => total + category.limit, 0);
    
    const budgetUsed = userData.budget.categories
        .reduce((total, category) => total + category.spent, 0);
    
    const budgetRemaining = budgetTotal - budgetUsed;
    document.querySelector('#budget-remaining .stat-card-value').textContent = formatCurrency(budgetRemaining);
    
    // Update change percentages
    updateChangePercentages(userData);
}

function updateChangePercentages(userData) {
    // These would normally be calculated by comparing with previous period data
    // For demo purposes, we'll use placeholder values
    
    const balanceChange = 5.2; // 5.2% increase
    const expensesChange = -2.8; // 2.8% decrease
    const savingsChange = 10.5; // 10.5% increase
    const budgetChange = 3.7; // 3.7% increase
    
    // Update balance change
    const balanceChangeEl = document.querySelector('#total-balance .stat-card-change');
    balanceChangeEl.textContent = `${balanceChange > 0 ? '+' : ''}${balanceChange}% from last month`;
    balanceChangeEl.className = `stat-card-change ${balanceChange >= 0 ? 'positive' : 'negative'}`;
    
    // Update expenses change
    const expensesChangeEl = document.querySelector('#monthly-expenses .stat-card-change');
    expensesChangeEl.textContent = `${expensesChange > 0 ? '+' : ''}${expensesChange}% from last month`;
    expensesChangeEl.className = `stat-card-change ${expensesChange <= 0 ? 'positive' : 'negative'}`;
    
    // Update savings change
    const savingsChangeEl = document.querySelector('#total-savings .stat-card-change');
    savingsChangeEl.textContent = `${savingsChange > 0 ? '+' : ''}${savingsChange}% from last month`;
    savingsChangeEl.className = `stat-card-change ${savingsChange >= 0 ? 'positive' : 'negative'}`;
    
    // Update budget change
    const budgetChangeEl = document.querySelector('#budget-remaining .stat-card-change');
    budgetChangeEl.textContent = `${budgetChange > 0 ? '+' : ''}${budgetChange}% from last month`;
    budgetChangeEl.className = `stat-card-change ${budgetChange >= 0 ? 'positive' : 'negative'}`;
}

function initCharts() {
    // Initialize expense trend chart
    initExpenseTrendChart();
    
    // Initialize category breakdown chart
    initCategoryBreakdownChart();
    
    // Set up chart filter buttons
    setupChartFilters();
}

function initExpenseTrendChart() {
    const chartElement = document.getElementById('expensesChart');
    if (!chartElement) {
        console.warn('Expense trend chart element not found');
        return;
    }
    
    const ctx = chartElement.getContext('2d');
    
    // Get user data
    const userData = getUserData();
    
    // Prepare data for the last 6 months
    const labels = [];
    const expenseData = [];
    const incomeData = [];
    
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
        
        // For demo purposes, generate some income data
        incomeData.push(monthExpenses * (1 + Math.random() * 0.5 + 0.5)); // Income is 1.5-2x expenses
    }
    
    // Create the chart
    const expenseTrendChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Income',
                    data: incomeData,
                    backgroundColor: 'rgba(76, 175, 80, 0.2)',
                    borderColor: 'rgba(76, 175, 80, 1)',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: true
                },
                {
                    label: 'Expenses',
                    data: expenseData,
                    backgroundColor: 'rgba(244, 67, 54, 0.2)',
                    borderColor: 'rgba(244, 67, 54, 1)',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + formatCurrency(context.raw);
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
    window.expenseTrendChart = expenseTrendChart;
}

function initCategoryBreakdownChart() {
    const ctx = document.getElementById('category-breakdown-chart').getContext('2d');
    
    // Get user data
    const userData = getUserData();
    
    // Prepare data for categories
    const categories = userData.budget.categories;
    const labels = categories.map(category => category.name);
    const data = categories.map(category => category.spent);
    
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
    const categoryBreakdownChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColors,
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
    window.categoryBreakdownChart = categoryBreakdownChart;
}

function setupChartFilters() {
    // Set up expense trend chart filters
    const trendFilterButtons = document.querySelectorAll('#expense-trend-filters .chart-filter-btn');
    trendFilterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            trendFilterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Update chart data based on selected period
            updateExpenseTrendChart(this.dataset.period);
        });
    });
    
    // Set up category breakdown chart filters
    const breakdownFilterButtons = document.querySelectorAll('#category-breakdown-filters .chart-filter-btn');
    breakdownFilterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            breakdownFilterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Update chart data based on selected period
            updateCategoryBreakdownChart(this.dataset.period);
        });
    });
}

function updateExpenseTrendChart(period) {
    // This function would update the expense trend chart based on the selected period
    // For demo purposes, we'll just log the selected period
    console.log(`Updating expense trend chart for period: ${period}`);
    
    // In a real application, you would fetch data for the selected period and update the chart
    // window.expenseTrendChart.data.labels = newLabels;
    // window.expenseTrendChart.data.datasets[0].data = newIncomeData;
    // window.expenseTrendChart.data.datasets[1].data = newExpenseData;
    // window.expenseTrendChart.update();
}

function updateCategoryBreakdownChart(period) {
    // This function would update the category breakdown chart based on the selected period
    // For demo purposes, we'll just log the selected period
    console.log(`Updating category breakdown chart for period: ${period}`);
    
    // In a real application, you would fetch data for the selected period and update the chart
    // window.categoryBreakdownChart.data.labels = newLabels;
    // window.categoryBreakdownChart.data.datasets[0].data = newData;
    // window.categoryBreakdownChart.update();
}

function initQuickActions() {
    // Add event listeners to quick action cards
    const actionCards = document.querySelectorAll('.action-card');
    actionCards.forEach(card => {
        card.addEventListener('click', function() {
            const action = this.dataset.action;
            handleQuickAction(action);
        });
    });
}

function handleQuickAction(action) {
    // Handle quick action clicks
    switch(action) {
        case 'add-expense':
            window.location.href = 'expenses.html?action=add';
            break;
        case 'set-budget':
            window.location.href = 'budget.html?action=set';
            break;
        case 'add-goal':
            window.location.href = 'goals.html?action=add';
            break;
        case 'view-tips':
            window.location.href = 'tips.html';
            break;
        default:
            console.log(`Unknown action: ${action}`);
    }
}

function initRecentActivity() {
    // Get user data
    const userData = getUserData();
    
    // Get recent activity container
    const activityList = document.querySelector('.activity-list');
    
    // Clear existing activity items
    activityList.innerHTML = '';
    
    // Combine expenses, income, goals, and budget changes into a single activity array
    let activities = [];
    
    // Add expenses to activities
    userData.expenses.forEach(expense => {
        activities.push({
            type: 'expense',
            title: expense.description,
            category: expense.category,
            amount: expense.amount,
            date: new Date(expense.date),
            icon: getCategoryIcon(expense.category)
        });
    });
    
    // Add goal deposits to activities
    userData.goals.forEach(goal => {
        if (goal.deposits && goal.deposits.length > 0) {
            goal.deposits.forEach(deposit => {
                activities.push({
                    type: 'goal',
                    title: `Deposit to ${goal.name}`,
                    category: 'Savings',
                    amount: deposit.amount,
                    date: new Date(deposit.date),
                    icon: 'fa-bullseye'
                });
            });
        }
    });
    
    // Sort activities by date (most recent first)
    activities.sort((a, b) => b.date - a.date);
    
    // Limit to 5 most recent activities
    activities = activities.slice(0, 5);
    
    // If no activities, show empty state
    if (activities.length === 0) {
        activityList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-history"></i>
                <h3>No Recent Activity</h3>
                <p>Your recent transactions will appear here.</p>
            </div>
        `;
        return;
    }
    
    // Create activity items
    activities.forEach(activity => {
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        
        activityItem.innerHTML = `
            <div class="activity-icon ${activity.type}">
                <i class="fas ${activity.icon}"></i>
            </div>
            <div class="activity-content">
                <h4 class="activity-title">${activity.title}</h4>
                <div class="activity-details">
                    <span class="activity-category">${activity.category}</span>
                    <span class="activity-time">${formatDate(activity.date, 'relative')}</span>
                </div>
            </div>
            <div class="activity-amount ${activity.type}">
                ${activity.type === 'expense' ? '-' : '+'} ${formatCurrency(activity.amount)}
            </div>
        `;
        
        activityList.appendChild(activityItem);
    });
    
    // Add view all link
    const viewAllLink = document.createElement('a');
    viewAllLink.href = 'expenses.html';
    viewAllLink.className = 'view-all-link';
    viewAllLink.textContent = 'View All Activity';
    activityList.appendChild(viewAllLink);
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

function getUserData() {
    const expenses = getFromLocalStorage('expenses') || [];
    const budget = getFromLocalStorage('budget') || {
        total: 0,
        categories: []
    };
    const goals = getFromLocalStorage('goals') || [];
    const settings = getFromLocalStorage('settings') || {};
    
    // Calculate demo balance
    const totalIncome = 5000; // Demo income
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const balance = totalIncome - totalExpenses;
    
    return {
        expenses,
        budget,
        goals,
        settings,
        balance,
        income: totalIncome
    };
}