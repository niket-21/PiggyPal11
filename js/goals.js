// Goals Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initApp();
});

function initApp() {
    // Initialize all components
    initGoalsSummary();
    initCreateGoalForm();
    initGoalsTracker();
    initGoalCalculator();
    initGoalMilestones();
    initGoalModals();
    
    // Check for URL parameters
    checkUrlParams();
}

function checkUrlParams() {
    // Check if there's an action parameter in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get('action');
    
    if (action === 'create') {
        // Focus on the goal name input
        document.getElementById('goal-name').focus();
    }
}

function initGoalsSummary() {
    // Update goals summary
    updateGoalsSummary();
}

function updateGoalsSummary() {
    // Get user data
    const userData = getLocalStorageData();
    
    // Calculate summary statistics
    const totalGoals = userData.goals.length;
    const completedGoals = userData.goals.filter(goal => goal.currentAmount >= goal.targetAmount).length;
    const inProgressGoals = totalGoals - completedGoals;
    
    // Calculate total saved and total target
    const totalSaved = userData.goals.reduce((total, goal) => total + goal.currentAmount, 0);
    const totalTarget = userData.goals.reduce((total, goal) => total + goal.targetAmount, 0);
    const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;
    
    // Update summary UI
    document.getElementById('total-goals').textContent = totalGoals;
    document.getElementById('completed-goals').textContent = completedGoals;
    document.getElementById('in-progress-goals').textContent = inProgressGoals;
    document.getElementById('total-saved').textContent = formatCurrency(totalSaved);
    document.getElementById('total-target').textContent = formatCurrency(totalTarget);
    
    // Update overall progress bar
    const progressBar = document.querySelector('.overall-progress .progress');
    progressBar.style.width = `${Math.min(overallProgress, 100)}%`;
    document.getElementById('overall-progress-percentage').textContent = `${Math.round(overallProgress)}%`;
}

function initCreateGoalForm() {
    // Get the goal form
    const goalForm = document.getElementById('create-goal-form');
    
    // Add event listener for form submission
    goalForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        if (validateGoalForm()) {
            // Save goal
            saveGoal();
            
            // Reset form
            goalForm.reset();
            
            // Update UI
            updateUI();
            
            // Show success message
            showToast('Goal created successfully!', 'success');
        }
    });
    
    // Add event listener for reset button
    document.getElementById('reset-goal-button').addEventListener('click', function() {
        goalForm.reset();
        clearValidationErrors();
    });
    
    // Initialize date picker with current date
    const today = new Date();
    const oneYearFromNow = new Date(today);
    oneYearFromNow.setFullYear(today.getFullYear() + 1);
    
    const formattedDate = oneYearFromNow.toISOString().substr(0, 10);
    document.getElementById('goal-target-date').value = formattedDate;
    
    // Add event listeners for amount inputs to update progress
    document.getElementById('goal-target-amount').addEventListener('input', updateGoalProgress);
    document.getElementById('goal-current-amount').addEventListener('input', updateGoalProgress);
}

function updateGoalProgress() {
    // Get target and current amounts
    const targetAmount = parseFloat(document.getElementById('goal-target-amount').value) || 0;
    const currentAmount = parseFloat(document.getElementById('goal-current-amount').value) || 0;
    
    // Calculate progress percentage
    const progressPercentage = targetAmount > 0 ? (currentAmount / targetAmount) * 100 : 0;
    
    // Update progress bar
    const progressBar = document.querySelector('.goal-form-progress .progress');
    progressBar.style.width = `${Math.min(progressPercentage, 100)}%`;
    
    // Update progress text
    document.getElementById('goal-progress-percentage').textContent = `${Math.round(progressPercentage)}%`;
    document.getElementById('goal-remaining-amount').textContent = 
        formatCurrency(Math.max(targetAmount - currentAmount, 0));
}

function validateGoalForm() {
    // Get form values
    const name = document.getElementById('goal-name').value.trim();
    const targetAmount = document.getElementById('goal-target-amount').value.trim();
    const currentAmount = document.getElementById('goal-current-amount').value.trim();
    const targetDate = document.getElementById('goal-target-date').value.trim();
    
    // Clear previous validation errors
    clearValidationErrors();
    
    // Validate name
    if (!name) {
        showValidationError('goal-name', 'Please enter a goal name');
        return false;
    }
    
    // Validate target amount
    if (!targetAmount) {
        showValidationError('goal-target-amount', 'Please enter a target amount');
        return false;
    }
    
    if (isNaN(parseFloat(targetAmount)) || parseFloat(targetAmount) <= 0) {
        showValidationError('goal-target-amount', 'Please enter a valid amount');
        return false;
    }
    
    // Validate current amount
    if (currentAmount && (isNaN(parseFloat(currentAmount)) || parseFloat(currentAmount) < 0)) {
        showValidationError('goal-current-amount', 'Please enter a valid amount');
        return false;
    }
    
    // Validate target date
    if (!targetDate) {
        showValidationError('goal-target-date', 'Please select a target date');
        return false;
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(targetDate);
    
    if (selectedDate < today) {
        showValidationError('goal-target-date', 'Target date cannot be in the past');
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

function saveGoal() {
    // Get form values
    const name = document.getElementById('goal-name').value.trim();
    const targetAmount = parseFloat(document.getElementById('goal-target-amount').value.trim());
    const currentAmount = parseFloat(document.getElementById('goal-current-amount').value.trim()) || 0;
    const targetDate = document.getElementById('goal-target-date').value.trim();
    const notes = document.getElementById('goal-notes').value.trim();
    
    // Create goal object
    const goal = {
        id: generateUniqueId(),
        name: name,
        targetAmount: targetAmount,
        currentAmount: currentAmount,
        targetDate: targetDate,
        startDate: new Date().toISOString().substr(0, 10),
        notes: notes,
        deposits: []
    };
    
    // Add initial deposit if current amount > 0
    if (currentAmount > 0) {
        goal.deposits.push({
            id: generateUniqueId(),
            amount: currentAmount,
            date: new Date().toISOString().substr(0, 10),
            notes: 'Initial deposit'
        });
    }
    
    // Get user data
    const userData = getLocalStorageData();
    
    // Add new goal
    userData.goals.push(goal);
    
    // Save updated data to local storage
    setLocalStorageData(userData);
}

function initGoalsTracker() {
    // Update goals tracker
    updateGoalsTracker();
    
    // Add event listener for filter input
    document.getElementById('goals-filter').addEventListener('input', function() {
        updateGoalsTracker();
    });
    
    // Add event listener for sort selector
    document.getElementById('goals-sort').addEventListener('change', function() {
        updateGoalsTracker();
    });
}

function updateGoalsTracker() {
    // Get filter value
    const filterValue = document.getElementById('goals-filter').value.toLowerCase();
    
    // Get sort value
    const sortValue = document.getElementById('goals-sort').value;
    
    // Get user data
    const userData = getLocalStorageData();
    
    // Filter goals based on filter value
    let filteredGoals = userData.goals;
    
    if (filterValue) {
        filteredGoals = filteredGoals.filter(goal => 
            goal.name.toLowerCase().includes(filterValue) || 
            goal.notes.toLowerCase().includes(filterValue)
        );
    }
    
    // Sort goals based on sort value
    switch(sortValue) {
        case 'name':
            filteredGoals.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'amount':
            filteredGoals.sort((a, b) => b.targetAmount - a.targetAmount);
            break;
        case 'progress':
            filteredGoals.sort((a, b) => {
                const progressA = a.targetAmount > 0 ? (a.currentAmount / a.targetAmount) : 0;
                const progressB = b.targetAmount > 0 ? (b.currentAmount / b.targetAmount) : 0;
                return progressB - progressA;
            });
            break;
        case 'date':
            filteredGoals.sort((a, b) => new Date(a.targetDate) - new Date(b.targetDate));
            break;
        default:
            // Default sort by date added (newest first)
            filteredGoals.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
    }
    
    // Get goals container
    const goalsContainer = document.querySelector('.goals-list');
    
    // Clear existing goals
    goalsContainer.innerHTML = '';
    
    // If no goals, show empty state
    if (filteredGoals.length === 0) {
        goalsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-bullseye"></i>
                <h3>No Goals Found</h3>
                <p>Create your first financial goal to start tracking your progress.</p>
            </div>
        `;
        return;
    }
    
    // Create goal items
    filteredGoals.forEach(goal => {
        const progressPercentage = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
        const remainingAmount = Math.max(goal.targetAmount - goal.currentAmount, 0);
        
        // Calculate days remaining
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const targetDate = new Date(goal.targetDate);
        const daysRemaining = Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24));
        
        // Determine status class
        let statusClass = 'in-progress';
        let statusText = 'In Progress';
        
        if (progressPercentage >= 100) {
            statusClass = 'completed';
            statusText = 'Completed';
        } else if (daysRemaining < 0) {
            statusClass = 'overdue';
            statusText = 'Overdue';
        } else if (daysRemaining <= 30) {
            statusClass = 'urgent';
            statusText = 'Urgent';
        }
        
        const goalItem = document.createElement('div');
        goalItem.className = 'goal-item';
        goalItem.dataset.id = goal.id;
        
        goalItem.innerHTML = `
            <div class="goal-header">
                <h3 class="goal-title">${goal.name}</h3>
                <span class="goal-status ${statusClass}">${statusText}</span>
            </div>
            <div class="goal-progress">
                <div class="progress-bar">
                    <div class="progress" style="width: ${Math.min(progressPercentage, 100)}%"></div>
                </div>
                <div class="progress-stats">
                    <span class="progress-percentage">${Math.round(progressPercentage)}%</span>
                    <span class="progress-amounts">
                        ${formatCurrency(goal.currentAmount)} / ${formatCurrency(goal.targetAmount)}
                    </span>
                </div>
            </div>
            <div class="goal-details">
                <div class="goal-detail">
                    <i class="fas fa-calendar-alt"></i>
                    <span>${formatDate(new Date(goal.targetDate), 'medium')}</span>
                </div>
                <div class="goal-detail">
                    <i class="fas fa-hourglass-half"></i>
                    <span>${daysRemaining > 0 ? `${daysRemaining} days left` : 'Past due'}</span>
                </div>
                <div class="goal-detail">
                    <i class="fas fa-coins"></i>
                    <span>${formatCurrency(remainingAmount)} to go</span>
                </div>
            </div>
            <div class="goal-actions">
                <button class="btn btn-primary" onclick="viewGoalDetails('${goal.id}')">
                    <i class="fas fa-eye"></i> View Details
                </button>
                <button class="btn btn-success" onclick="addDeposit('${goal.id}')">
                    <i class="fas fa-plus-circle"></i> Add Deposit
                </button>
                <button class="btn btn-secondary" onclick="editGoal('${goal.id}')">
                    <i class="fas fa-edit"></i> Edit
                </button>
            </div>
        `;
        
        goalsContainer.appendChild(goalItem);
    });
}

function initGoalCalculator() {
    // Get calculator form
    const calculatorForm = document.getElementById('goal-calculator-form');
    
    // Add event listener for form submission
    calculatorForm.addEventListener('submit', function(e) {
        e.preventDefault();
        calculateGoal();
    });
    
    // Add event listeners for inputs to update calculation
    document.getElementById('calc-target-amount').addEventListener('input', updateCalculation);
    document.getElementById('calc-current-amount').addEventListener('input', updateCalculation);
    document.getElementById('calc-target-date').addEventListener('input', updateCalculation);
    document.getElementById('calc-deposit-frequency').addEventListener('change', updateCalculation);
}

function updateCalculation() {
    // Get form values
    const targetAmount = parseFloat(document.getElementById('calc-target-amount').value) || 0;
    const currentAmount = parseFloat(document.getElementById('calc-current-amount').value) || 0;
    const targetDate = document.getElementById('calc-target-date').value;
    const depositFrequency = document.getElementById('calc-deposit-frequency').value;
    
    // Validate inputs
    if (targetAmount <= 0 || !targetDate) {
        return;
    }
    
    // Calculate days remaining
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endDate = new Date(targetDate);
    const daysRemaining = Math.max(Math.ceil((endDate - today) / (1000 * 60 * 60 * 24)), 1);
    
    // Calculate remaining amount
    const remainingAmount = Math.max(targetAmount - currentAmount, 0);
    
    // Calculate number of deposits based on frequency
    let numberOfDeposits = 0;
    
    switch(depositFrequency) {
        case 'daily':
            numberOfDeposits = daysRemaining;
            break;
        case 'weekly':
            numberOfDeposits = Math.ceil(daysRemaining / 7);
            break;
        case 'biweekly':
            numberOfDeposits = Math.ceil(daysRemaining / 14);
            break;
        case 'monthly':
            numberOfDeposits = Math.ceil(daysRemaining / 30);
            break;
        default:
            numberOfDeposits = 1;
    }
    
    // Calculate required deposit amount
    const depositAmount = remainingAmount / numberOfDeposits;
    
    // Update result
    document.getElementById('calc-result-amount').textContent = formatCurrency(depositAmount);
    document.getElementById('calc-result-frequency').textContent = depositFrequency;
    document.getElementById('calc-result-deposits').textContent = numberOfDeposits;
    document.getElementById('calc-result-total').textContent = formatCurrency(remainingAmount);
}

function calculateGoal() {
    // Just update the calculation (form submission)
    updateCalculation();
    
    // Show the result section
    document.getElementById('calculator-result').style.display = 'block';
}

function initGoalMilestones() {
    // Update goal milestones
    updateGoalMilestones();
}

function updateGoalMilestones() {
    // Get user data
    const userData = getLocalStorageData();
    
    // Get milestones container
    const milestonesContainer = document.querySelector('.goal-milestones-list');
    
    // Clear existing milestones
    milestonesContainer.innerHTML = '';
    
    // If no goals, show empty state
    if (userData.goals.length === 0) {
        milestonesContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-flag-checkered"></i>
                <h3>No Milestones Yet</h3>
                <p>Create goals and add deposits to see your milestones here.</p>
            </div>
        `;
        return;
    }
    
    // Create milestone items (recent deposits and completed goals)
    const milestones = [];
    
    // Add recent deposits
    userData.goals.forEach(goal => {
        goal.deposits.forEach(deposit => {
            milestones.push({
                type: 'deposit',
                date: deposit.date,
                goal: goal.name,
                goalId: goal.id,
                amount: deposit.amount,
                notes: deposit.notes
            });
        });
    });
    
    // Add completed goals
    userData.goals.forEach(goal => {
        if (goal.currentAmount >= goal.targetAmount) {
            // Find the date when the goal was completed (date of the deposit that completed the goal)
            let completionDate = goal.targetDate;
            
            if (goal.deposits.length > 0) {
                // Sort deposits by date (newest first)
                const sortedDeposits = [...goal.deposits].sort((a, b) => new Date(b.date) - new Date(a.date));
                
                // Find the deposit that completed the goal
                let runningTotal = 0;
                for (let i = sortedDeposits.length - 1; i >= 0; i--) {
                    runningTotal += sortedDeposits[i].amount;
                    if (runningTotal >= goal.targetAmount) {
                        completionDate = sortedDeposits[i].date;
                        break;
                    }
                }
            }
            
            milestones.push({
                type: 'completion',
                date: completionDate,
                goal: goal.name,
                goalId: goal.id,
                amount: goal.targetAmount
            });
        }
    });
    
    // Sort milestones by date (newest first)
    milestones.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Limit to 10 most recent milestones
    const recentMilestones = milestones.slice(0, 10);
    
    // If no milestones, show empty state
    if (recentMilestones.length === 0) {
        milestonesContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-flag-checkered"></i>
                <h3>No Milestones Yet</h3>
                <p>Add deposits to your goals to see milestones here.</p>
            </div>
        `;
        return;
    }
    
    // Create milestone items
    recentMilestones.forEach(milestone => {
        const milestoneItem = document.createElement('div');
        milestoneItem.className = 'milestone-item';
        
        if (milestone.type === 'deposit') {
            milestoneItem.innerHTML = `
                <div class="milestone-icon deposit">
                    <i class="fas fa-plus-circle"></i>
                </div>
                <div class="milestone-content">
                    <h4>Deposit to "${milestone.goal}"</h4>
                    <p>${milestone.notes || 'No notes'}</p>
                    <div class="milestone-details">
                        <span class="milestone-date">
                            <i class="fas fa-calendar-alt"></i> ${formatDate(new Date(milestone.date), 'medium')}
                        </span>
                        <span class="milestone-amount">
                            <i class="fas fa-coins"></i> ${formatCurrency(milestone.amount)}
                        </span>
                    </div>
                </div>
                <div class="milestone-actions">
                    <button class="btn btn-sm btn-primary" onclick="viewGoalDetails('${milestone.goalId}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            `;
        } else {
            milestoneItem.innerHTML = `
                <div class="milestone-icon completion">
                    <i class="fas fa-trophy"></i>
                </div>
                <div class="milestone-content">
                    <h4>Goal Completed: "${milestone.goal}"</h4>
                    <p>Congratulations on reaching your goal!</p>
                    <div class="milestone-details">
                        <span class="milestone-date">
                            <i class="fas fa-calendar-alt"></i> ${formatDate(new Date(milestone.date), 'medium')}
                        </span>
                        <span class="milestone-amount">
                            <i class="fas fa-coins"></i> ${formatCurrency(milestone.amount)}
                        </span>
                    </div>
                </div>
                <div class="milestone-actions">
                    <button class="btn btn-sm btn-primary" onclick="viewGoalDetails('${milestone.goalId}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            `;
        }
        
        milestonesContainer.appendChild(milestoneItem);
    });
}

function initGoalModals() {
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
    
    // Add event listener for deposit form submission
    document.getElementById('deposit-form').addEventListener('submit', function(e) {
        e.preventDefault();
        saveDeposit();
    });
    
    // Add event listener for edit goal form submission
    document.getElementById('edit-goal-form').addEventListener('submit', function(e) {
        e.preventDefault();
        saveEditedGoal();
    });
}

function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function viewGoalDetails(goalId) {
    // Get user data
    const userData = getLocalStorageData();
    
    // Find goal by ID
    const goal = userData.goals.find(g => g.id === goalId);
    
    if (!goal) {
        showToast('Goal not found', 'error');
        return;
    }
    
    // Populate modal with goal details
    document.getElementById('details-goal-name').textContent = goal.name;
    document.getElementById('details-target-amount').textContent = formatCurrency(goal.targetAmount);
    document.getElementById('details-current-amount').textContent = formatCurrency(goal.currentAmount);
    document.getElementById('details-remaining-amount').textContent = 
        formatCurrency(Math.max(goal.targetAmount - goal.currentAmount, 0));
    
    // Calculate progress percentage
    const progressPercentage = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
    document.getElementById('details-progress-percentage').textContent = `${Math.round(progressPercentage)}%`;
    
    // Update progress bar
    const progressBar = document.querySelector('#goal-details-modal .progress');
    progressBar.style.width = `${Math.min(progressPercentage, 100)}%`;
    
    // Calculate days remaining
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(goal.targetDate);
    const daysRemaining = Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24));
    
    document.getElementById('details-target-date').textContent = formatDate(targetDate, 'medium');
    document.getElementById('details-days-remaining').textContent = 
        daysRemaining > 0 ? `${daysRemaining} days left` : 'Past due';
    
    document.getElementById('details-start-date').textContent = formatDate(new Date(goal.startDate), 'medium');
    document.getElementById('details-notes').textContent = goal.notes || 'No notes';
    
    // Populate deposits list
    const depositsContainer = document.getElementById('details-deposits-list');
    depositsContainer.innerHTML = '';
    
    if (goal.deposits.length === 0) {
        depositsContainer.innerHTML = `
            <div class="empty-state small">
                <i class="fas fa-coins"></i>
                <p>No deposits yet</p>
            </div>
        `;
    } else {
        // Sort deposits by date (newest first)
        const sortedDeposits = [...goal.deposits].sort((a, b) => new Date(b.date) - new Date(a.date));
        
        sortedDeposits.forEach(deposit => {
            const depositItem = document.createElement('div');
            depositItem.className = 'deposit-item';
            
            depositItem.innerHTML = `
                <div class="deposit-date">
                    ${formatDate(new Date(deposit.date), 'short')}
                </div>
                <div class="deposit-amount">
                    ${formatCurrency(deposit.amount)}
                </div>
                <div class="deposit-notes">
                    ${deposit.notes || 'No notes'}
                </div>
            `;
            
            depositsContainer.appendChild(depositItem);
        });
    }
    
    // Open modal
    openModal('goal-details-modal');
}

function addDeposit(goalId) {
    // Get user data
    const userData = getLocalStorageData();
    
    // Find goal by ID
    const goal = userData.goals.find(g => g.id === goalId);
    
    if (!goal) {
        showToast('Goal not found', 'error');
        return;
    }
    
    // Set goal ID in form
    document.getElementById('deposit-goal-id').value = goalId;
    document.getElementById('deposit-goal-name').textContent = goal.name;
    
    // Calculate remaining amount
    const remainingAmount = Math.max(goal.targetAmount - goal.currentAmount, 0);
    document.getElementById('deposit-remaining').textContent = formatCurrency(remainingAmount);
    
    // Set today's date as default
    const today = new Date();
    const formattedDate = today.toISOString().substr(0, 10);
    document.getElementById('deposit-date').value = formattedDate;
    
    // Reset form
    document.getElementById('deposit-amount').value = '';
    document.getElementById('deposit-notes').value = '';
    
    // Open modal
    openModal('add-deposit-modal');
}

function saveDeposit() {
    // Get form values
    const goalId = document.getElementById('deposit-goal-id').value;
    const amount = parseFloat(document.getElementById('deposit-amount').value.trim());
    const date = document.getElementById('deposit-date').value.trim();
    const notes = document.getElementById('deposit-notes').value.trim();
    
    // Validate form
    if (isNaN(amount) || amount <= 0 || !date) {
        showToast('Please fill all required fields correctly', 'error');
        return;
    }
    
    // Get user data
    const userData = getLocalStorageData();
    
    // Find goal index
    const goalIndex = userData.goals.findIndex(g => g.id === goalId);
    
    if (goalIndex === -1) {
        showToast('Goal not found', 'error');
        return;
    }
    
    // Create deposit object
    const deposit = {
        id: generateUniqueId(),
        amount: amount,
        date: date,
        notes: notes
    };
    
    // Add deposit to goal
    userData.goals[goalIndex].deposits.push(deposit);
    
    // Update current amount
    userData.goals[goalIndex].currentAmount += amount;
    
    // Save updated data to local storage
    setLocalStorageData(userData);
    
    // Close modal
    closeModal('add-deposit-modal');
    
    // Update UI
    updateUI();
    
    // Show success message
    showToast('Deposit added successfully!', 'success');
}

function editGoal(goalId) {
    // Get user data
    const userData = getLocalStorageData();
    
    // Find goal by ID
    const goal = userData.goals.find(g => g.id === goalId);
    
    if (!goal) {
        showToast('Goal not found', 'error');
        return;
    }
    
    // Populate form with goal data
    document.getElementById('edit-goal-id').value = goal.id;
    document.getElementById('edit-goal-name').value = goal.name;
    document.getElementById('edit-goal-target-amount').value = goal.targetAmount;
    document.getElementById('edit-goal-target-date').value = goal.targetDate;
    document.getElementById('edit-goal-notes').value = goal.notes || '';
    
    // Open modal
    openModal('edit-goal-modal');
}

function saveEditedGoal() {
    // Get form values
    const goalId = document.getElementById('edit-goal-id').value;
    const name = document.getElementById('edit-goal-name').value.trim();
    const targetAmount = parseFloat(document.getElementById('edit-goal-target-amount').value.trim());
    const targetDate = document.getElementById('edit-goal-target-date').value.trim();
    const notes = document.getElementById('edit-goal-notes').value.trim();
    
    // Validate form
    if (!name || isNaN(targetAmount) || targetAmount <= 0 || !targetDate) {
        showToast('Please fill all required fields correctly', 'error');
        return;
    }
    
    // Get user data
    const userData = getLocalStorageData();
    
    // Find goal index
    const goalIndex = userData.goals.findIndex(g => g.id === goalId);
    
    if (goalIndex === -1) {
        showToast('Goal not found', 'error');
        return;
    }
    
    // Update goal
    userData.goals[goalIndex].name = name;
    userData.goals[goalIndex].targetAmount = targetAmount;
    userData.goals[goalIndex].targetDate = targetDate;
    userData.goals[goalIndex].notes = notes;
    
    // Save updated data to local storage
    setLocalStorageData(userData);
    
    // Close modal
    closeModal('edit-goal-modal');
    
    // Update UI
    updateUI();
    
    // Show success message
    showToast('Goal updated successfully!', 'success');
}

function updateUI() {
    // Update all UI components
    updateGoalsSummary();
    updateGoalsTracker();
    updateGoalMilestones();
}