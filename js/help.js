// Help Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize FAQ accordion functionality
    initFaqAccordion();
    
    // Initialize topic switching
    initTopicSwitching();
    
    // Initialize help search functionality
    initHelpSearch();
    
    // Initialize support form submission
    initSupportForm();
});

/**
 * Initialize FAQ accordion functionality
 */
function initFaqAccordion() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            
            // Toggle active class on the clicked item
            faqItem.classList.toggle('active');
            
            // Optional: Close other open FAQ items
            const siblingItems = document.querySelectorAll('.faq-item.active');
            siblingItems.forEach(item => {
                if (item !== faqItem && item.classList.contains('active')) {
                    item.classList.remove('active');
                }
            });
        });
    });
}

/**
 * Initialize topic switching functionality
 */
function initTopicSwitching() {
    const topicItems = document.querySelectorAll('.topic-list li');
    
    topicItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all topics
            document.querySelectorAll('.topic-list li').forEach(topic => {
                topic.classList.remove('active');
            });
            
            // Add active class to clicked topic
            item.classList.add('active');
            
            // Hide all topic content
            document.querySelectorAll('.topic-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Show the selected topic content
            const topicId = item.getAttribute('data-topic');
            document.getElementById(topicId).classList.add('active');
        });
    });
}

/**
 * Initialize help search functionality
 */
function initHelpSearch() {
    const searchInput = document.getElementById('helpSearch');
    const searchButton = document.getElementById('searchHelpBtn');
    
    // Function to perform search
    const performSearch = () => {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            return;
        }
        
        let foundResults = false;
        
        // Search in FAQ questions
        const faqQuestions = document.querySelectorAll('.faq-question h4');
        faqQuestions.forEach(question => {
            const faqItem = question.closest('.faq-item');
            const questionText = question.textContent.toLowerCase();
            
            if (questionText.includes(searchTerm)) {
                // Find which topic this FAQ belongs to
                const topicContent = question.closest('.topic-content');
                const topicId = topicContent.id;
                
                // Activate the correct topic
                document.querySelectorAll('.topic-list li').forEach(topic => {
                    topic.classList.remove('active');
                    if (topic.getAttribute('data-topic') === topicId) {
                        topic.classList.add('active');
                    }
                });
                
                // Show the correct topic content
                document.querySelectorAll('.topic-content').forEach(content => {
                    content.classList.remove('active');
                });
                topicContent.classList.add('active');
                
                // Open the FAQ item
                document.querySelectorAll('.faq-item.active').forEach(item => {
                    item.classList.remove('active');
                });
                faqItem.classList.add('active');
                
                // Scroll to the FAQ item
                setTimeout(() => {
                    faqItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
                
                foundResults = true;
                return;
            }
        });
        
        // If no results found in questions, search in answers
        if (!foundResults) {
            const faqAnswers = document.querySelectorAll('.faq-answer');
            faqAnswers.forEach(answer => {
                const faqItem = answer.closest('.faq-item');
                const answerText = answer.textContent.toLowerCase();
                
                if (answerText.includes(searchTerm)) {
                    // Find which topic this FAQ belongs to
                    const topicContent = answer.closest('.topic-content');
                    const topicId = topicContent.id;
                    
                    // Activate the correct topic
                    document.querySelectorAll('.topic-list li').forEach(topic => {
                        topic.classList.remove('active');
                        if (topic.getAttribute('data-topic') === topicId) {
                            topic.classList.add('active');
                        }
                    });
                    
                    // Show the correct topic content
                    document.querySelectorAll('.topic-content').forEach(content => {
                        content.classList.remove('active');
                    });
                    topicContent.classList.add('active');
                    
                    // Open the FAQ item
                    document.querySelectorAll('.faq-item.active').forEach(item => {
                        item.classList.remove('active');
                    });
                    faqItem.classList.add('active');
                    
                    // Scroll to the FAQ item
                    setTimeout(() => {
                        faqItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 100);
                    
                    foundResults = true;
                    return;
                }
            });
        }
        
        // If still no results found
        if (!foundResults) {
            showToast('No results found for "' + searchTerm + '". Try a different search term.');
        }
    };
    
    // Search on button click
    searchButton.addEventListener('click', performSearch);
    
    // Search on Enter key press
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

/**
 * Initialize support form submission
 */
function initSupportForm() {
    const supportForm = document.getElementById('supportForm');
    
    supportForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // In a real application, you would send the form data to a server
        // Since this is a static frontend project, we'll just show a success message
        
        // Reset the form
        supportForm.reset();
        
        // Show success message
        showToast('Your message has been sent! We\'ll get back to you soon.');
    });
}

/**
 * Show a toast notification
 * @param {string} message - The message to display in the toast
 */
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.querySelector('.toast-message');
    
    // Set the message
    toastMessage.textContent = message;
    
    // Show the toast
    toast.classList.add('show');
    
    // Hide the toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}