// Storage.js - Local storage functionality for PiggyPal

/**
 * Initialize local storage with default data if not already set
 */
function initializeLocalStorage() {
    // Check if local storage is already initialized
    if (!localStorage.getItem('piggypal_initialized')) {
        // Create default data structure
        const defaultData = {
            expenses: [],
            budget: {
                total: 0,
                categories: [
                    { name: 'Food & Drinks', amount: 0, color: '#FF6384', icon: 'fa-utensils' },
                    { name: 'Entertainment', amount: 0, color: '#36A2EB', icon: 'fa-film' },
                    { name: 'Transportation', amount: 0, color: '#FFCE56', icon: 'fa-bus' },
                    { name: 'Shopping', amount: 0, color: '#4BC0C0', icon: 'fa-shopping-bag' },
                    { name: 'Education', amount: 0, color: '#9966FF', icon: 'fa-book' },
                    { name: 'Gifts', amount: 0, color: '#FF9F40', icon: 'fa-gift' },
                    { name: 'Other', amount: 0, color: '#C9CBCF', icon: 'fa-ellipsis-h' }
                ]
            },
            goals: [],
            tips: [],
            settings: {
                currency: '$',
                theme: 'light',
                notifications: true
            }
        };

        // Save default data to local storage
        saveToLocalStorage('expenses', defaultData.expenses);
        saveToLocalStorage('budget', defaultData.budget);
        saveToLocalStorage('goals', defaultData.goals);
        saveToLocalStorage('tips', defaultData.tips);
        saveToLocalStorage('settings', defaultData.settings);

        // Mark as initialized
        localStorage.setItem('piggypal_initialized', 'true');
    }
}

/**
 * Save data to local storage
 * @param {string} key - The key to store data under
 * @param {any} data - The data to store
 */
function saveToLocalStorage(key, data) {
    try {
        const serializedData = JSON.stringify(data);
        localStorage.setItem(`piggypal_${key}`, serializedData);
        return true;
    } catch (error) {
        console.error(`Error saving to local storage: ${error}`);
        showToast('Error saving data. Please try again.', 'error');
        return false;
    }
}

/**
 * Get data from local storage
 * @param {string} key - The key to retrieve data from
 * @returns {any} The retrieved data or null if not found
 */
function getFromLocalStorage(key) {
    try {
        const serializedData = localStorage.getItem(`piggypal_${key}`);
        if (serializedData === null) {
            return null;
        }
        return JSON.parse(serializedData);
    } catch (error) {
        console.error(`Error retrieving from local storage: ${error}`);
        return null;
    }
}

/**
 * Clear all PiggyPal data from local storage
 */
function clearLocalStorage() {
    try {
        // Get all keys in local storage
        const keys = Object.keys(localStorage);
        
        // Filter for PiggyPal keys
        const piggypalKeys = keys.filter(key => key.startsWith('piggypal_'));
        
        // Remove each PiggyPal key
        piggypalKeys.forEach(key => localStorage.removeItem(key));
        
        return true;
    } catch (error) {
        console.error(`Error clearing local storage: ${error}`);
        return false;
    }
}

/**
 * Export all PiggyPal data as JSON
 * @returns {string} JSON string of all PiggyPal data
 */
function exportData() {
    try {
        const exportData = {
            expenses: getFromLocalStorage('expenses'),
            budget: getFromLocalStorage('budget'),
            goals: getFromLocalStorage('goals'),
            tips: getFromLocalStorage('tips'),
            settings: getFromLocalStorage('settings'),
            exportDate: new Date().toISOString()
        };
        
        return JSON.stringify(exportData, null, 2);
    } catch (error) {
        console.error(`Error exporting data: ${error}`);
        showToast('Error exporting data. Please try again.', 'error');
        return null;
    }
}

/**
 * Import PiggyPal data from JSON
 * @param {string} jsonData - JSON string of PiggyPal data
 * @returns {boolean} Success status
 */
function importData(jsonData) {
    try {
        const data = JSON.parse(jsonData);
        
        // Validate data structure
        if (!data.expenses || !data.budget || !data.goals || !data.settings) {
            showToast('Invalid data format. Import failed.', 'error');
            return false;
        }
        
        // Import each data section
        saveToLocalStorage('expenses', data.expenses);
        saveToLocalStorage('budget', data.budget);
        saveToLocalStorage('goals', data.goals);
        saveToLocalStorage('tips', data.tips || []);
        saveToLocalStorage('settings', data.settings);
        
        showToast('Data imported successfully!', 'success');
        return true;
    } catch (error) {
        console.error(`Error importing data: ${error}`);
        showToast('Error importing data. Please check the file format.', 'error');
        return false;
    }
}

// Initialize local storage when the script loads
document.addEventListener('DOMContentLoaded', function() {
    initializeLocalStorage();
});