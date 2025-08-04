// Utility functions for VisaGuardAI

// Message system
function showMessage(message, type = 'info') {
    const container = document.getElementById('message-container') || createMessageContainer();
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message-toast p-4 rounded-lg shadow-lg border mb-3 transition-all duration-300 transform translate-x-full`;
    
    const colors = {
        success: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-700 dark:text-green-300',
        error: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-700 dark:text-red-300',
        warning: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-700 dark:text-yellow-300',
        info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-700 dark:text-blue-300'
    };
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    messageDiv.className += ` ${colors[type]}`;
    
    messageDiv.innerHTML = `
        <div class="flex items-center">
            <i class="${icons[type]} mr-3"></i>
            <span class="flex-1">${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-3 text-gray-400 hover:text-gray-600">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    container.appendChild(messageDiv);
    
    // Animate in
    setTimeout(() => {
        messageDiv.classList.remove('translate-x-full');
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentElement) {
            messageDiv.classList.add('translate-x-full');
            setTimeout(() => {
                if (messageDiv.parentElement) {
                    messageDiv.remove();
                }
            }, 300);
        }
    }, 5000);
}

function createMessageContainer() {
    const container = document.createElement('div');
    container.id = 'message-container';
    container.className = 'fixed top-4 right-4 z-50 max-w-sm w-full';
    document.body.appendChild(container);
    return container;
}

// Format date utility
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Format currency utility
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Debounce utility
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Loading state utility
function setLoading(element, isLoading, originalText = '') {
    if (isLoading) {
        element.disabled = true;
        element.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Loading...';
    } else {
        element.disabled = false;
        element.innerHTML = originalText;
    }
}

// Local storage utilities
function setStorageItem(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
    }
}

function getStorageItem(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return defaultValue;
    }
}

function removeStorageItem(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error('Error removing from localStorage:', error);
        return false;
    }
}

// Form validation utilities
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

// Platform icon mapping
function getPlatformIcon(platform) {
    const icons = {
        instagram: 'fab fa-instagram text-pink-500',
        tiktok: 'fab fa-tiktok text-black dark:text-white',
        linkedin: 'fab fa-linkedin text-blue-600',
        twitter: 'fab fa-twitter text-blue-400',
        facebook: 'fab fa-facebook text-blue-600',
        youtube: 'fab fa-youtube text-red-600'
    };
    
    return icons[platform.toLowerCase()] || 'fas fa-globe text-gray-500';
}

// Risk level utilities
function getRiskColor(riskLevel) {
    if (typeof riskLevel === 'string') {
        return riskLevel.toLowerCase() === 'low' ? 'green' : 
               riskLevel.toLowerCase() === 'medium' || riskLevel.toLowerCase() === 'moderate' ? 'yellow' : 'red';
    }
    
    return riskLevel < 30 ? 'green' : riskLevel < 60 ? 'yellow' : 'red';
}

function getRiskText(riskLevel) {
    if (typeof riskLevel === 'number') {
        return riskLevel < 30 ? 'Low Risk' : riskLevel < 60 ? 'Moderate Risk' : 'High Risk';
    }
    
    return riskLevel;
}

// Animation utilities
function fadeIn(element, duration = 300) {
    element.style.opacity = '0';
    element.style.display = 'block';
    
    let start = performance.now();
    
    function animate(timestamp) {
        let progress = (timestamp - start) / duration;
        if (progress > 1) progress = 1;
        
        element.style.opacity = progress;
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }
    
    requestAnimationFrame(animate);
}

function fadeOut(element, duration = 300) {
    let start = performance.now();
    
    function animate(timestamp) {
        let progress = (timestamp - start) / duration;
        if (progress > 1) progress = 1;
        
        element.style.opacity = 1 - progress;
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            element.style.display = 'none';
        }
    }
    
    requestAnimationFrame(animate);
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showMessage,
        formatDate,
        formatCurrency,
        debounce,
        setLoading,
        setStorageItem,
        getStorageItem,
        removeStorageItem,
        validateEmail,
        validatePassword,
        getPlatformIcon,
        getRiskColor,
        getRiskText,
        fadeIn,
        fadeOut
    };
}