// Authentication system

class AuthManager {
    constructor() {
        this.init();
    }
    
    init() {
        // Initialize users array if it doesn't exist
        if (!localStorage.getItem('users')) {
            localStorage.setItem('users', JSON.stringify([]));
        }
    }
    
    signupUser(email, password, confirmPassword) {
        // Validation
        if (!email || !password || !confirmPassword) {
            throw new Error('All fields are required');
        }
        
        if (password.length < 8) {
            throw new Error('Password must be at least 8 characters long');
        }
        
        if (password !== confirmPassword) {
            throw new Error('Passwords do not match');
        }
        
        if (!this.isValidEmail(email)) {
            throw new Error('Please enter a valid email address');
        }
        
        // Check if user already exists
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        if (users.find(user => user.email === email)) {
            throw new Error('An account with this email already exists');
        }
        
        // Create new user
        const newUser = {
            email,
            password, // In a real app, this would be hashed
            isPaid: false,
            createdAt: new Date().toISOString(),
            profile: {
                name: '',
                country: '',
                university: ''
            },
            connectedAccounts: {
                instagram: false,
                tiktok: false,
                linkedin: false,
                twitter: false
            }
        };
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        return newUser;
    }
    
    loginUser(email, password) {
        if (!email || !password) {
            throw new Error('Email and password are required');
        }
        
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);
        
        if (!user) {
            throw new Error('Invalid email or password');
        }
        
        // Set current user session
        localStorage.setItem('currentUser', email);
        localStorage.setItem('userPaidStatus', user.isPaid.toString());
        
        return user;
    }
    
    logoutUser() {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('userPaidStatus');
        window.location.href = 'index.html';
    }
    
    getCurrentUser() {
        const currentUserEmail = localStorage.getItem('currentUser');
        if (!currentUserEmail) return null;
        
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        return users.find(user => user.email === currentUserEmail);
    }
    
    updateUser(userData) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const currentUserEmail = localStorage.getItem('currentUser');
        
        const userIndex = users.findIndex(user => user.email === currentUserEmail);
        if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], ...userData };
            localStorage.setItem('users', JSON.stringify(users));
            return users[userIndex];
        }
        
        throw new Error('User not found');
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    isAuthenticated() {
        return !!localStorage.getItem('currentUser');
    }
    
    requireAuth() {
        if (!this.isAuthenticated()) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    }
}

// Initialize auth manager
const authManager = new AuthManager();

// Authentication form handlers
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    try {
        authManager.loginUser(email, password);
        showMessage('Login successful! Redirecting...', 'success');
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
        
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

function handleSignup(event) {
    event.preventDefault();
    
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    try {
        authManager.signupUser(email, password, confirmPassword);
        showMessage('Account created successfully! Please sign in.', 'success');
        
        // Switch to login tab
        setTimeout(() => {
            document.getElementById('login-tab').click();
            document.getElementById('login-email').value = email;
        }, 1000);
        
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

function logout() {
    authManager.logoutUser();
}

// Message display function
function showMessage(message, type = 'info') {
    const container = document.getElementById('message-container');
    if (!container) return;
    
    const messageDiv = document.createElement('div');
    
    const colors = {
        success: 'bg-green-100 dark:bg-green-900 border-green-400 dark:border-green-600 text-green-700 dark:text-green-200',
        error: 'bg-red-100 dark:bg-red-900 border-red-400 dark:border-red-600 text-red-700 dark:text-red-200',
        info: 'bg-blue-100 dark:bg-blue-900 border-blue-400 dark:border-blue-600 text-blue-700 dark:text-blue-200'
    };
    
    messageDiv.className = `${colors[type]} border px-4 py-3 rounded mb-4 shadow-lg transition-all duration-300 transform translate-x-0`;
    messageDiv.innerHTML = `
        <div class="flex justify-between items-center">
            <span class="text-sm font-medium">${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-2 text-lg leading-none hover:opacity-75">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add animation
    messageDiv.style.transform = 'translateX(100%)';
    container.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.style.transform = 'translateX(0)';
    }, 10);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentElement) {
            messageDiv.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (messageDiv.parentElement) {
                    messageDiv.remove();
                }
            }, 300);
        }
    }, 5000);
}

// Password strength indicator
function updatePasswordStrength(password) {
    const strengthBar = document.getElementById('password-strength');
    if (!strengthBar) return;
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-green-600'];
    const widths = ['w-1/5', 'w-2/5', 'w-3/5', 'w-4/5', 'w-full'];
    
    strengthBar.className = `h-2 rounded-full transition-all duration-300 ${colors[strength - 1] || 'bg-gray-300'} ${widths[strength - 1] || 'w-0'}`;
}

// Add password strength indicator to signup form
document.addEventListener('DOMContentLoaded', function() {
    const signupPassword = document.getElementById('signup-password');
    if (signupPassword) {
        signupPassword.addEventListener('input', function() {
            updatePasswordStrength(this.value);
        });
    }
});
